import { describe, it, expect } from 'vitest';
import { immuneService } from '../services/immune/immuneService';

describe('Immune Service & Longitudinal Aggregation', () => {
  it('retrieves immune cell records filtered by category and astronaut', () => {
    const leukocytes = immuneService.getImmuneCellRecords({
      astronautId: 'AST-042',
      category: 'LEUKOCYTE',
    });
    expect(leukocytes.length).toBeGreaterThan(0);
    expect(leukocytes.every((c) => c.category === 'LEUKOCYTE')).toBe(true);
  });

  it('retrieves biomarker records and latest profile', () => {
    const profile = immuneService.getLatestImmuneProfile('AST-042');
    expect(profile.cells['WBC_TOTAL']).toBeDefined();
    expect(profile.biomarkers['IL_6']).toBeDefined();
    expect(profile.biomarkers['IL_6'].value).toBe(6.4);
  });

  it('computes longitudinal metrics for IL-6 with baseline and percentage change', () => {
    const summary = immuneService.calculateLongitudinalMetric('AST-042', 'IL_6');
    expect(summary).not.toBeNull();
    expect(summary?.metricKey).toBe('IL_6');
    expect(summary?.preFlightBaseline).toBe(1.5); // Average of L-180 (1.4) and L-30 (1.6)
    expect(summary?.latestValue).toBe(6.4);
    expect(summary?.isCalculable).toBe(true);
    expect(summary?.percentChange).toBeGreaterThan(300);
  });

  it('computes longitudinal metrics for zero baseline without error', () => {
    const summary = immuneService.calculateLongitudinalMetric('AST-042', 'VIRAL_SHEDDING_EBV');
    expect(summary).not.toBeNull();
    // When pre-flight viral DNA is 0 (undetectable):
    expect(summary?.preFlightBaseline).toBe(0);
    expect(summary?.isCalculable).toBe(false);
    expect(summary?.percentChange).toBeNull();
  });

  it('compiles multi-marker timeline points across mission days', () => {
    const timeline = immuneService.getLongitudinalTimeline('AST-042');
    expect(timeline.length).toBeGreaterThanOrEqual(4);
    const day88 = timeline.find((t) => t.missionDay === 88);
    expect(day88).toBeDefined();
    expect(day88?.values.WBC_TOTAL).toBe(9.4);
    expect(day88?.values.IL_6).toBe(6.4);
  });
});
