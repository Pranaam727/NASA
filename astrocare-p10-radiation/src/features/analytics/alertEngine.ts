/**
 * ASTROCARE DETERMINISTIC ALERT ENGINE
 * Generates clinical and aerospace alerts, enforces deduplication windows,
 * and manages alert lifecycle state transitions.
 */

import { HealthAlert, AlertSeverity } from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { ALERT_RULES_CATALOG } from './alertRules';
import { AstronautBaselineProfile } from './types';
import { alertService } from '@/services/dataProvider';

interface CooldownEntry {
  lastFiredMs: number;
  lastSeverity: AlertSeverity;
}

export class AlertEngine {
  private activeAlerts: Map<string, HealthAlert> = new Map();
  private alertHistory: HealthAlert[] = [];
  private deduplicationCache: Map<string, CooldownEntry> = new Map();
  private listeners: Set<(alerts: HealthAlert[]) => void> = new Set();

  constructor() {
    this.initFromService();
  }

  private async initFromService(): Promise<void> {
    try {
      const res = await alertService.getAllAlerts('m-ares-06');
      if (res.data) {
        this.alertHistory = [...res.data];
        res.data.filter((a) => a.status === 'ACTIVE').forEach((a) => {
          this.activeAlerts.set(a.id, a);
        });
        this.notifyListeners();
      }
    } catch (err) {
      console.warn('Failed to initialize alerts from service:', err);
    }
  }

  /**
   * Evaluates telemetry and radiation streams against canonical alert rules.
   * Returns newly generated alerts that passed deduplication gating.
   */
  public evaluateTelemetry(
    vitalsPacket: VitalSignsPacket,
    radiationPacket: RadiationPacket | null,
    baseline: AstronautBaselineProfile
  ): HealthAlert[] {
    const newlyTriggered: HealthAlert[] = [];
    const nowMs = Date.now();

    for (const rule of ALERT_RULES_CATALOG) {
      const result = rule.evaluate(vitalsPacket.vitals, radiationPacket, baseline);

      if (result && result.triggered) {
        const cacheKey = `${baseline.astronautId}:${rule.ruleCode}`;
        const cached = this.deduplicationCache.get(cacheKey);

        const cooldownMs = rule.cooldownSeconds * 1000;
        const isCooldownActive = cached && nowMs - cached.lastFiredMs < cooldownMs;

        // Severity Escalation Bypass: If alert escalates to higher severity, bypass cooldown
        const isEscalation = cached && this.severityWeight(rule.severity) > this.severityWeight(cached.lastSeverity);

        if (!isCooldownActive || isEscalation) {
          const alert: HealthAlert = {
            id: `alt-${nowMs}-${Math.floor(Math.random() * 10000)}`,
            mission_id: vitalsPacket.missionId,
            astronaut_id: baseline.astronautId,
            timestamp: vitalsPacket.timestamp,
            rule_code: rule.ruleCode,
            severity: rule.severity,
            status: 'ACTIVE',
            title: rule.title,
            description: result.description,
            triggering_value: result.triggeringValue,
            baseline_expected: result.baselineExpected,
            created_at: new Date().toISOString(),
          };

          this.deduplicationCache.set(cacheKey, {
            lastFiredMs: nowMs,
            lastSeverity: rule.severity,
          });

          this.activeAlerts.set(alert.id, alert);
          this.alertHistory.unshift(alert);
          newlyTriggered.push(alert);

          // Fire and forget persistence to configured service
          if (alertService.recordAlert) {
            alertService.recordAlert(alert).catch((err) => {
              console.error('Failed to persist alert:', err);
            });
          }
        }
      }
    }

    if (newlyTriggered.length > 0) {
      this.notifyListeners();
    }

    return newlyTriggered;
  }

  /**
   * Acknowledges an active alert.
   */
  public async acknowledgeAlert(
    alertId: string,
    acknowledgedBy: string = 'FLIGHT_SURGEON',
    notes?: string
  ): Promise<HealthAlert | null> {
    const existing = this.activeAlerts.get(alertId) || this.alertHistory.find((a) => a.id === alertId);
    if (!existing) return null;

    const updated: HealthAlert = {
      ...existing,
      status: 'ACKNOWLEDGED',
      acknowledged_by: acknowledgedBy,
      acknowledged_at: new Date().toISOString(),
      resolution_notes: notes || 'Acknowledged by medical monitoring officer.',
    };

    this.activeAlerts.delete(alertId);

    const histIdx = this.alertHistory.findIndex((a) => a.id === alertId);
    if (histIdx !== -1) {
      this.alertHistory[histIdx] = updated;
    }

    this.notifyListeners();

    try {
      await alertService.acknowledgeAlert(alertId, acknowledgedBy, notes);
    } catch (err) {
      console.error('Error persisting alert acknowledgement:', err);
    }

    return updated;
  }

  /**
   * Resolves an alert completely.
   */
  public async resolveAlert(
    alertId: string,
    resolvedBy: string = 'FLIGHT_SURGEON',
    notes?: string
  ): Promise<HealthAlert | null> {
    const existing = this.activeAlerts.get(alertId) || this.alertHistory.find((a) => a.id === alertId);
    if (!existing) return null;

    const updated: HealthAlert = {
      ...existing,
      status: 'RESOLVED',
      acknowledged_by: existing.acknowledged_by || resolvedBy,
      acknowledged_at: existing.acknowledged_at || new Date().toISOString(),
      resolution_notes: notes || 'Physiological readings returned to nominal envelope.',
    };

    this.activeAlerts.delete(alertId);

    const histIdx = this.alertHistory.findIndex((a) => a.id === alertId);
    if (histIdx !== -1) {
      this.alertHistory[histIdx] = updated;
    }

    this.notifyListeners();

    if (alertService.resolveAlert) {
      try {
        await alertService.resolveAlert(alertId, resolvedBy, notes);
      } catch (err) {
        console.error('Error persisting alert resolution:', err);
      }
    }

    return updated;
  }

  public getActiveAlerts(astronautId?: string): HealthAlert[] {
    const list = Array.from(this.activeAlerts.values());
    if (astronautId) {
      return list.filter((a) => a.astronaut_id === astronautId);
    }
    return list;
  }

  public getAllAlerts(astronautId?: string): HealthAlert[] {
    if (astronautId) {
      return this.alertHistory.filter((a) => a.astronaut_id === astronautId);
    }
    return [...this.alertHistory];
  }

  public clearCooldowns(): void {
    this.deduplicationCache.clear();
  }

  public resetAll(): void {
    this.activeAlerts.clear();
    this.alertHistory = [];
    this.deduplicationCache.clear();
    this.notifyListeners();
  }

  public onAlertsChange(callback: (alerts: HealthAlert[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getAllAlerts());
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const all = this.getAllAlerts();
    this.listeners.forEach((fn) => fn(all));
  }

  private severityWeight(severity: AlertSeverity): number {
    switch (severity) {
      case 'CRITICAL':
        return 4;
      case 'HIGH':
        return 3;
      case 'MEDIUM':
        return 2;
      case 'LOW':
        return 1;
    }
  }
}

// Global Singleton Instance for application-wide alert management
export const alertEngine = new AlertEngine();
