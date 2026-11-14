import { HealthAlert, AlertSeverity } from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { Astronaut } from '@/types/database.types';
import { CompositeHealthAssessment } from '../types/analyticsTypes';

interface CooldownEntry {
  ruleCode: string;
  astronautId: string;
  severity: AlertSeverity;
  triggeredAtMs: number;
}

export class AlertManager {
  private alerts: HealthAlert[] = [];
  private cooldowns: Map<string, CooldownEntry> = new Map(); // key: `${astronautId}:${ruleCode}`
  private cooldownDurationMs: number;
  private alertListeners = new Set<(alert: HealthAlert) => void>();
  private updateListeners = new Set<(alerts: HealthAlert[]) => void>();

  constructor(cooldownDurationSeconds: number = 60, initialAlerts: HealthAlert[] = []) {
    this.cooldownDurationMs = cooldownDurationSeconds * 1000;
    this.alerts = [...initialAlerts];
  }

  public setCooldownDuration(seconds: number): void {
    this.cooldownDurationMs = seconds * 1000;
  }

  public onAlertGenerated(callback: (alert: HealthAlert) => void): () => void {
    this.alertListeners.add(callback);
    return () => this.alertListeners.delete(callback);
  }

  public onAlertsChanged(callback: (alerts: HealthAlert[]) => void): () => void {
    this.updateListeners.add(callback);
    callback(this.getAllAlerts());
    return () => this.updateListeners.delete(callback);
  }

  public getActiveAlerts(astronautId?: string): HealthAlert[] {
    return this.alerts.filter(
      (a) => a.status === 'ACTIVE' && (!astronautId || a.astronaut_id === astronautId)
    );
  }

  public getAllAlerts(astronautId?: string, limit: number = 100): HealthAlert[] {
    const list = astronautId ? this.alerts.filter((a) => a.astronaut_id === astronautId) : this.alerts;
    return list.slice(0, limit);
  }

  public getAlertById(alertId: string): HealthAlert | undefined {
    return this.alerts.find((a) => a.id === alertId);
  }

  /**
   * Evaluates telemetry and composite assessment to generate new deduplicated alerts.
   */
  public evaluateTelemetry(
    vitals: VitalSignsPacket,
    assessment: CompositeHealthAssessment,
    radiation?: RadiationPacket | null,
    _astronaut?: Partial<Astronaut> | null
  ): HealthAlert[] {
    const newAlerts: HealthAlert[] = [];
    const astroId = vitals.astronautId;
    const missionId = vitals.missionId;
    const comps = assessment.baselineComparisons;

    // Rule 1: Acute Hypoxia
    const spo2Comp = comps.SPO2;
    if (spo2Comp.riskLevel === 'CRITICAL') {
      const alert = this.createCandidateAlert({
        ruleCode: 'RULE_HYPOXIA_CRITICAL',
        severity: 'CRITICAL',
        title: 'Critical Hypoxia Detected',
        description: `SpO2 collapsed to ${spo2Comp.currentValue}% (Baseline: ${spo2Comp.baselineValue}%). Immediate suit integrity and O2 supply check required.`,
        triggeringValue: `${spo2Comp.currentValue} %`,
        baselineExpected: `${spo2Comp.baselineValue} %`,
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    } else if (spo2Comp.riskLevel === 'WARNING') {
      const alert = this.createCandidateAlert({
        ruleCode: 'RULE_HYPOXIA_WARNING',
        severity: 'HIGH',
        title: 'Moderate Hypoxia Alert',
        description: `SpO2 degraded to ${spo2Comp.currentValue}% (${spo2Comp.percentageDelta}% deviation). Verify cabin partial O2 pressure.`,
        triggeringValue: `${spo2Comp.currentValue} %`,
        baselineExpected: `${spo2Comp.baselineValue} %`,
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    }

    // Rule 2: Tachycardia / Bradycardia
    const hrComp = comps.HEART_RATE;
    if (hrComp.riskLevel === 'CRITICAL') {
      const isHigh = hrComp.currentValue > hrComp.baselineValue;
      const alert = this.createCandidateAlert({
        ruleCode: isHigh ? 'RULE_TACHYCARDIA_CRITICAL' : 'RULE_BRADYCARDIA_CRITICAL',
        severity: 'CRITICAL',
        title: isHigh ? 'Extreme Tachycardia (>160 bpm)' : 'Severe Bradycardia (<40 bpm)',
        description: `Heart rate recorded at ${hrComp.currentValue} bpm vs resting baseline ${hrComp.baselineValue} bpm (${hrComp.zScore}σ deviation).`,
        triggeringValue: `${hrComp.currentValue} bpm`,
        baselineExpected: `${hrComp.baselineValue} ± 6 bpm`,
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    } else if (hrComp.riskLevel === 'WARNING') {
      const alert = this.createCandidateAlert({
        ruleCode: 'RULE_TACHYCARDIA_WARNING',
        severity: 'HIGH',
        title: 'Sustained Tachycardia',
        description: `Elevated heart rate at ${hrComp.currentValue} bpm sustained under mission workload.`,
        triggeringValue: `${hrComp.currentValue} bpm`,
        baselineExpected: `${hrComp.baselineValue} bpm`,
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    }

    // Rule 3: Arterial Pressure (Hypertension / Hypotension)
    const sysComp = comps.BLOOD_PRESSURE_SYS;
    if (sysComp.riskLevel === 'CRITICAL') {
      const isHigh = sysComp.currentValue > sysComp.baselineValue;
      const alert = this.createCandidateAlert({
        ruleCode: isHigh ? 'RULE_HYPERTENSION_CRITICAL' : 'RULE_HYPOTENSION_CRITICAL',
        severity: 'CRITICAL',
        title: isHigh ? 'Critical Hypertensive Crisis' : 'Critical Hypotensive Shock',
        description: `Systolic arterial pressure at ${sysComp.currentValue} mmHg exceeds biological tolerance limit.`,
        triggeringValue: `${sysComp.currentValue} mmHg`,
        baselineExpected: `${sysComp.baselineValue} mmHg`,
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    }

    // Rule 4: Respiratory Distress
    const respComp = comps.RESPIRATORY_RATE;
    if (respComp.riskLevel === 'CRITICAL' || respComp.riskLevel === 'WARNING') {
      const alert = this.createCandidateAlert({
        ruleCode: 'RULE_TACHYPNEA_WARNING',
        severity: respComp.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM',
        title: 'Compensatory Tachypnea / Respiratory Distress',
        description: `Breathing rate accelerated to ${respComp.currentValue} rpm (Baseline: ${respComp.baselineValue} rpm).`,
        triggeringValue: `${respComp.currentValue} rpm`,
        baselineExpected: `${respComp.baselineValue} rpm`,
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    }

    // Rule 5: Solar Particle Event (Radiation)
    const radComp = comps.RADIATION_FLUX;
    if (radComp.riskLevel === 'CRITICAL' || (radiation && radiation.solarParticleEventActive)) {
      const alert = this.createCandidateAlert({
        ruleCode: 'RULE_RADIATION_SPE_CRITICAL',
        severity: 'CRITICAL',
        title: 'Solar Particle Event (SPE) Radiation Flux Spike',
        description: `Ambient radiation flux reached ${radComp.currentValue} uSv/h (>2.0 uSv/h safety threshold). Active shelter protocol recommended.`,
        triggeringValue: `${radComp.currentValue} uSv/h`,
        baselineExpected: '< 0.080 uSv/h',
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    }

    // Rule 6: Compound Multi-Factor System Strain
    if (assessment.overallRiskLevel === 'CRITICAL' && assessment.synergyMultipliersApplied.length > 0) {
      const alert = this.createCandidateAlert({
        ruleCode: 'RULE_COMPOUND_PHYSIOLOGICAL_STRAIN',
        severity: 'CRITICAL',
        title: 'Multi-System Physiological Strain Emergency',
        description: `Composite strain score reached ${assessment.compositeScore}/100 with compounding syndromes: ${assessment.synergyMultipliersApplied.join(', ')}.`,
        triggeringValue: `Score: ${assessment.compositeScore}`,
        baselineExpected: 'Score < 25 (Normal)',
        missionId,
        astronautId: astroId,
      });
      if (alert) newAlerts.push(alert);
    }

    if (newAlerts.length > 0) {
      this.notifyChanges();
    }

    return newAlerts;
  }

  /**
   * Helper that applies deduplication, cooldown windows, and escalation bypass.
   */
  private createCandidateAlert(params: {
    ruleCode: string;
    severity: AlertSeverity;
    title: string;
    description: string;
    triggeringValue: string;
    baselineExpected: string;
    missionId: string;
    astronautId: string;
  }): HealthAlert | null {
    const key = `${params.astronautId}:${params.ruleCode}`;
    const now = Date.now();
    const existingCooldown = this.cooldowns.get(key);

    const severityRanks: Record<AlertSeverity, number> = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4,
    };

    if (existingCooldown) {
      const isWithinCooldown = now - existingCooldown.triggeredAtMs < this.cooldownDurationMs;
      const isEscalation = severityRanks[params.severity] > severityRanks[existingCooldown.severity];

      // Block duplicate alert if cooldown is active and not an escalation
      if (isWithinCooldown && !isEscalation) {
        return null;
      }
    }

    // Register / update cooldown
    this.cooldowns.set(key, {
      ruleCode: params.ruleCode,
      astronautId: params.astronautId,
      severity: params.severity,
      triggeredAtMs: now,
    });

    const newAlert: HealthAlert = {
      id: `alt-${now}-${Math.floor(Math.random() * 10000)}`,
      mission_id: params.missionId,
      astronaut_id: params.astronautId,
      timestamp: new Date().toISOString(),
      rule_code: params.ruleCode,
      severity: params.severity,
      status: 'ACTIVE',
      title: params.title,
      description: params.description,
      triggering_value: params.triggeringValue,
      baseline_expected: params.baselineExpected,
      created_at: new Date().toISOString(),
    };

    this.alerts.unshift(newAlert);
    this.alertListeners.forEach((fn) => fn(newAlert));

    return newAlert;
  }

  public acknowledgeAlert(
    alertId: string,
    acknowledgedBy: string = 'FLIGHT_SURGEON',
    notes?: string
  ): HealthAlert | null {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return null;

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledged_by = acknowledgedBy;
    alert.acknowledged_at = new Date().toISOString();
    alert.resolution_notes = notes || 'Acknowledged by medical operations';

    this.notifyChanges();
    return alert;
  }

  public resolveAlert(
    alertId: string,
    resolvedBy: string = 'FLIGHT_SURGEON',
    notes?: string
  ): HealthAlert | null {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return null;

    alert.status = 'RESOLVED';
    alert.acknowledged_by = alert.acknowledged_by || resolvedBy;
    alert.acknowledged_at = alert.acknowledged_at || new Date().toISOString();
    alert.resolution_notes = notes || 'Condition stabilized; parameters returned to baseline tolerance.';

    this.notifyChanges();
    return alert;
  }

  public clearCooldowns(): void {
    this.cooldowns.clear();
  }

  public reset(): void {
    this.alerts = [];
    this.cooldowns.clear();
    this.notifyChanges();
  }

  private notifyChanges(): void {
    const all = this.getAllAlerts();
    this.updateListeners.forEach((fn) => fn(all));
  }
}

// Global Singleton Instance for application-wide alert management
export const alertManager = new AlertManager(60);
