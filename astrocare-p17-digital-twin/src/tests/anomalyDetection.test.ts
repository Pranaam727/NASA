import { describe, it, expect, beforeEach } from 'vitest';
import { anomalyDetectionService } from '../services/anomalyDetectionService';
import { astronautProfileService } from '../services/astronautProfileService';

describe('Explainable Anomaly Detection Engine', () => {
  beforeEach(() => {
    astronautProfileService.resetToDemo();
  });

  it('runs detection and finds explainable anomaly records', () => {
    const anomalies = anomalyDetectionService.runDetection('astro-001');
    expect(anomalies.length).toBeGreaterThan(0);

    const first = anomalies[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('astronautId');
    expect(first).toHaveProperty('variableName');
    expect(first).toHaveProperty('severity');
    expect(first).toHaveProperty('explanation');
    expect(first.clinicalSignificanceDisclaimer).toContain('Analytical');
  });

  it('allows acknowledging and updating review status of an anomaly', () => {
    const anomalies = anomalyDetectionService.runDetection('astro-001');
    const target = anomalies[0];

    const ok = anomalyDetectionService.updateAnomalyStatus(
      target.id,
      'Acknowledged',
      'Reviewed by Flight Surgeon test'
    );
    expect(ok).toBe(true);

    const updated = anomalyDetectionService.runDetection('astro-001');
    const rechecked = updated.find((a) => a.id === target.id);
    expect(rechecked?.status).toBe('Acknowledged');
    expect(rechecked?.reviewerNotes).toBe('Reviewed by Flight Surgeon test');
  });
});
