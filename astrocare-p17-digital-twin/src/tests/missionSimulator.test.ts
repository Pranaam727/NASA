import { describe, it, expect } from 'vitest';
import { missionScenarioService } from '../services/missionScenarioService';
import { simulateMissionScenario } from '../data/demoScenarios';

describe('Mission Scenario Simulator', () => {
  it('retrieves preconfigured scenarios', () => {
    const scenarios = missionScenarioService.getAll();
    expect(scenarios.length).toBeGreaterThanOrEqual(4);
  });

  it('computes projected impacts and readiness index for ISS mission', () => {
    const scenarios = missionScenarioService.getAll();
    const iss = scenarios.find((s) => s.id === 'scen-001')!;
    const res = simulateMissionScenario(iss);

    expect(res).not.toBeNull();
    expect(res.overallReadinessScore).toBeGreaterThanOrEqual(60);
    expect(res.systemImpacts.length).toBe(4);
    expect(res.projectedBiomarkerTrends.length).toBeGreaterThan(5);
  });

  it('demonstrates increased radiation impact in deep-space Mars transit', () => {
    const scenarios = missionScenarioService.getAll();
    const mars = scenarios.find((s) => s.id === 'scen-003')!;
    const res = simulateMissionScenario(mars);

    const radImpact = res.systemImpacts.find((i) => i.system.includes('Radiation'));
    expect(radImpact).toBeDefined();
    expect(radImpact!.projectedChangePercent).toBeLessThan(0);
  });
});
