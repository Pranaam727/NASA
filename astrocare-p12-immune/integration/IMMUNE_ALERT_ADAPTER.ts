/**
 * AstroCare P12 — Alert Adapter
 * Maps internal P12 ImmuneAlert entities to the generic Master AstroCare Alert Schema.
 */

import { ImmuneAlert, MasterAstroCareAlert } from '../src/types';

export class ImmuneAlertAdapter {
  /**
   * Transforms a single P12 alert into the master AstroCare format.
   */
  public static toMasterAlert(alert: ImmuneAlert): MasterAstroCareAlert {
    let masterSeverity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO';
    if (alert.severity === 'WARNING') {
      masterSeverity = 'WARN';
    } else if (alert.severity === 'CRITICAL') {
      masterSeverity = 'CRITICAL';
    }

    return {
      alertId: `P12-${alert.id}`,
      originModule: 'P12_IMMUNE_INTELLIGENCE',
      severity: masterSeverity,
      title: `${alert.analyte} — ${alert.category.replace(/_/g, ' ')}`,
      message: alert.explanation,
      timestamp: alert.timestamp,
      entityId: alert.astronautId,
      acknowledged: alert.acknowledged,
      metadata: {
        analyte: alert.analyte,
        observedValue: alert.observedValue,
        threshold: alert.threshold,
        unit: alert.unit,
        category: alert.category,
        recommendedFollowUp: alert.recommendedFollowUp,
      },
    };
  }

  /**
   * Transforms an array of P12 alerts.
   */
  public static toMasterAlertList(alerts: ImmuneAlert[]): MasterAstroCareAlert[] {
    return alerts.map((a) => this.toMasterAlert(a));
  }
}
