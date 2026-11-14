import { ImmuneAlert, AlertSeverity, AlertCategory, MasterAstroCareAlert } from '../../types';
import { DEMO_ALERTS } from '../../data/mockImmuneData';

const ALERTS_STORAGE_KEY = 'astrocare_p12_alerts_v1';

class AlertService {
  private alerts: ImmuneAlert[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (stored) {
        this.alerts = JSON.parse(stored);
      } else {
        this.resetAlertsToDefault();
      }
    } catch (e) {
      console.warn('Alert storage corrupted, resetting to defaults', e);
      this.resetAlertsToDefault();
    }
  }

  public resetAlertsToDefault(): void {
    this.alerts = JSON.parse(JSON.stringify(DEMO_ALERTS));
    this.saveAlerts();
  }

  private saveAlerts(): void {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(this.alerts));
    } catch (e) {
      console.error('Failed to save alerts to localStorage', e);
    }
  }

  public getAlerts(filters?: {
    astronautId?: string;
    severity?: AlertSeverity | 'ALL';
    category?: AlertCategory | 'ALL';
    unacknowledgedOnly?: boolean;
  }): ImmuneAlert[] {
    let list = [...this.alerts];

    if (filters?.astronautId) {
      list = list.filter((a) => a.astronautId === filters.astronautId);
    }
    if (filters?.severity && filters.severity !== 'ALL') {
      list = list.filter((a) => a.severity === filters.severity);
    }
    if (filters?.category && filters.category !== 'ALL') {
      list = list.filter((a) => a.category === filters.category);
    }
    if (filters?.unacknowledgedOnly) {
      list = list.filter((a) => !a.acknowledged);
    }

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public acknowledgeAlert(
    alertId: string,
    operator: string = 'Medical Officer'
  ): { success: boolean; error?: string } {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) {
      return { success: false, error: `Alert ${alertId} not found.` };
    }

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = operator;

    this.saveAlerts();
    return { success: true };
  }

  public addAlert(alert: ImmuneAlert): void {
    if (this.alerts.some((a) => a.id === alert.id)) return;
    this.alerts.unshift(alert);
    this.saveAlerts();
  }

  /**
   * Adapter mapping to the master AstroCare generic alert contract.
   */
  public toMasterAstroCareAlerts(astronautId?: string): MasterAstroCareAlert[] {
    const list = this.getAlerts({ astronautId });

    return list.map((a) => {
      let masterSeverity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO';
      if (a.severity === 'WARNING') masterSeverity = 'WARN';
      if (a.severity === 'CRITICAL') masterSeverity = 'CRITICAL';

      return {
        alertId: `P12-${a.id}`,
        originModule: 'P12_IMMUNE_INTELLIGENCE',
        severity: masterSeverity,
        title: `${a.analyte} [${a.category.replace(/_/g, ' ')}]`,
        message: a.explanation,
        timestamp: a.timestamp,
        entityId: a.astronautId,
        acknowledged: a.acknowledged,
        metadata: {
          analyte: a.analyte,
          observedValue: a.observedValue,
          threshold: a.threshold,
          unit: a.unit,
          category: a.category,
          recommendedFollowUp: a.recommendedFollowUp,
        },
      };
    });
  }
}

export const alertService = new AlertService();
