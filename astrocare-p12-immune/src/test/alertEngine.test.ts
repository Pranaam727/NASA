import { describe, it, expect, beforeEach } from 'vitest';
import { alertService } from '../services/alerts/alertService';
import { ImmuneAlertAdapter } from '../../integration/IMMUNE_ALERT_ADAPTER';

describe('Immune Alert Engine & Adapter', () => {
  beforeEach(() => {
    alertService.resetAlertsToDefault();
  });

  it('retrieves active alerts and filters by severity', () => {
    const allAlerts = alertService.getAlerts();
    expect(allAlerts.length).toBeGreaterThan(0);

    const warningAlerts = alertService.getAlerts({ severity: 'WARNING' });
    expect(warningAlerts.every((a) => a.severity === 'WARNING')).toBe(true);
  });

  it('allows acknowledging an alert with operator stamp', () => {
    const unack = alertService.getAlerts({ unacknowledgedOnly: true })[0];
    expect(unack.acknowledged).toBe(false);

    const ackResult = alertService.acknowledgeAlert(unack.id, 'Flight Surgeon Dr. McCoy');
    expect(ackResult.success).toBe(true);

    const updated = alertService.getAlerts().find((a) => a.id === unack.id);
    expect(updated?.acknowledged).toBe(true);
    expect(updated?.acknowledgedBy).toBe('Flight Surgeon Dr. McCoy');
    expect(updated?.acknowledgedAt).toBeDefined();
  });

  it('transforms internal alerts to master AstroCare alert schema via adapter', () => {
    const rawAlerts = alertService.getAlerts();
    const masterAlerts = ImmuneAlertAdapter.toMasterAlertList(rawAlerts);

    expect(masterAlerts.length).toBe(rawAlerts.length);
    const first = masterAlerts[0];
    expect(first.originModule).toBe('P12_IMMUNE_INTELLIGENCE');
    expect(['INFO', 'WARN', 'CRITICAL']).toContain(first.severity);
    expect(first.alertId.startsWith('P12-')).toBe(true);
    expect(first.metadata.analyte).toBeDefined();
    expect(first.metadata.recommendedFollowUp).toBeDefined();
  });
});
