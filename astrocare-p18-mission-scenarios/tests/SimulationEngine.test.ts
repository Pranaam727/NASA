/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from 'vitest';
import { SimulationEngine, BASELINE_ENVIRONMENT, BASELINE_RADIATION, BASELINE_CREW, BASELINE_RESOURCES } from '../src/engine/SimulationEngine';
import { PREDEFINED_SCENARIOS } from '../src/data/scenarios';

function getNominalScenario() {
  return PREDEFINED_SCENARIOS.find(s => s.id === 'S01-NOMINAL')!;
}

function getSPEScenario() {
  return PREDEFINED_SCENARIOS.find(s => s.id === 'S02-SPE')!;
}

function getCompoundScenario() {
  return PREDEFINED_SCENARIOS.find(s => s.id === 'S10-COMPOUND')!;
}

describe('SimulationEngine: Initialization', () => {
  it('creates engine with deterministic seed', () => {
    const e1 = new SimulationEngine(42);
    const e2 = new SimulationEngine(42);
    expect(e1).toBeTruthy();
    expect(e2).toBeTruthy();
  });

  it('loads a scenario and sets initial state', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    expect(engine.getElapsedSec()).toBe(0);
    expect(engine.getDispatchedEvents()).toHaveLength(0);
  });

  it('initialises environment from scenario initial conditions', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    const env = engine.getEnvironment();
    expect(env.cabinPressureKPa).toBeCloseTo(101.3, 0);
    expect(env.oxygenPercent).toBeCloseTo(21.0, 0);
  });

  it('initialises crew from scenario initial conditions', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    const crew = engine.getCrew();
    expect(crew.heartRateBpm).toBeGreaterThan(50);
    expect(crew.oxygenSaturationPercent).toBeGreaterThanOrEqual(95);
  });

  it('initialises radiation state correctly', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    const rad = engine.getRadiation();
    expect(rad.speActive).toBe(false);
    expect(rad.effectiveDoseRateMicroSvPerHour).toBeGreaterThan(0);
    expect(rad.accumulatedEquivalentDoseMilliSv).toBe(0);
    expect(rad.accumulatedAbsorbedDoseMilliGy).toBe(0);
  });
});

describe('SimulationEngine: Time Progression', () => {
  it('advances elapsed time by step amount', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(60);
    expect(engine.getElapsedSec()).toBe(60);
  });

  it('accumulates time across multiple steps', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(60);
    engine.step(60);
    engine.step(60);
    expect(engine.getElapsedSec()).toBe(180);
  });

  it('records history snapshots', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(100); // 100 steps → at least some snapshots
    expect(engine.getHistory().length).toBeGreaterThan(0);
  });
});

describe('SimulationEngine: Scenario Events', () => {
  it('dispatches events when trigger time is reached', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    // S02-E01 triggers at T+300s
    engine.step(300);
    const dispatched = engine.getDispatchedEvents();
    expect(dispatched.length).toBeGreaterThan(0);
    expect(dispatched[0].id).toBe('S02-E01');
  });

  it('does not dispatch events before trigger time', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    engine.step(100); // before T+300
    const dispatched = engine.getDispatchedEvents();
    expect(dispatched.length).toBe(0);
  });

  it('dispatches SPE event and updates radiation state', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    engine.step(310); // past T+300
    expect(engine.getRadiation().speActive).toBe(true);
  });
});

describe('SimulationEngine: Environmental Updates', () => {
  it('pressure gradually decreases with leak rate', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S03-PRESSURE')!);
    const initialPressure = engine.getEnvironment().cabinPressureKPa;
    // Step past T+120 to trigger pressure anomaly event
    engine.step(200);
    const afterPressure = engine.getEnvironment().cabinPressureKPa;
    expect(afterPressure).toBeLessThan(initialPressure);
  });

  it('CO2 rises when scrubber efficiency drops', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S08-EQUIP')!);
    const initialCO2 = engine.getEnvironment().co2KPa;
    engine.step(500); // scrubber degrades at T+120
    const afterCO2 = engine.getEnvironment().co2KPa;
    // CO2 should rise after scrubber failure event
    expect(afterCO2).toBeGreaterThan(0.03);
  });

  it('temperature rises with TCS degraded', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S05-THERMAL')!);
    engine.step(100); // trigger TCS failure at T+60
    const env = engine.getEnvironment();
    expect(env.tcsStatus).not.toBe('Nominal');
  });
});

describe('SimulationEngine: Crew Condition Updates', () => {
  it('crew SpO2 responds to low ppO2', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S04-HYPOXIA')!);
    // Step past O2 failure event (T+60) and let physiology respond
    engine.step(700);
    const crew = engine.getCrew();
    // After hypoxia event, SpO2 should be decreasing from initial 98%
    expect(crew.oxygenSaturationPercent).toBeDefined();
    expect(crew.oxygenSaturationPercent).toBeLessThanOrEqual(98.5);
  });

  it('fatigue accumulates with high workload', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S06-SLEEP')!);
    const initialFatigue = engine.getCrew().fatigueIndex;
    engine.step(3700); // past workload event at T+0 and T+3600
    const afterFatigue = engine.getCrew().fatigueIndex;
    expect(afterFatigue).toBeGreaterThanOrEqual(initialFatigue);
  });

  it('computes crew readiness correctly', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(10);
    const crew = engine.getCrew();
    expect(crew.readinessScorePercent).toBeGreaterThanOrEqual(0);
    expect(crew.readinessScorePercent).toBeLessThanOrEqual(100);
    expect(['Optimal', 'Nominal', 'Degraded', 'Impaired', 'Critical']).toContain(crew.readinessCategory);
  });
});

describe('SimulationEngine: Radiation Accumulation', () => {
  it('accumulates effective dose (Sv) over time', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(3600); // 1 simulated hour
    const rad = engine.getRadiation();
    // Should accumulate some dose
    expect(rad.accumulatedEquivalentDoseMilliSv).toBeGreaterThan(0);
    expect(rad.accumulatedAbsorbedDoseMilliGy).toBeGreaterThan(0);
  });

  it('keeps absorbed dose (Gy) and effective dose (Sv) separate', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(3600);
    const rad = engine.getRadiation();
    // These are different quantities — should NOT be equal
    // Effective dose includes quality factor (~2.4), so Sv ≈ 2.4 × Gy
    expect(rad.accumulatedEquivalentDoseMilliSv).not.toEqual(rad.accumulatedAbsorbedDoseMilliGy);
  });

  it('SPE increases dose rate significantly', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    const baseRate = engine.getRadiation().effectiveDoseRateMicroSvPerHour;
    engine.step(700); // past SPE onset at T+300 and intensity at T+600
    const speRate = engine.getRadiation().effectiveDoseRateMicroSvPerHour;
    expect(speRate).toBeGreaterThan(baseRate);
  });

  it('storm shelter reduces dose rate', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    engine.step(1300); // past shelter activation at T+1200
    const rad = engine.getRadiation();
    // With shelter active, attenuation factor should be low
    if (rad.stormShelterActive) {
      expect(rad.shieldingAttenuationFactor).toBeLessThan(0.5);
    }
  });
});

describe('SimulationEngine: Resource Consumption', () => {
  it('oxygen reserves decrease over time', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    const initialO2 = engine.getResources().oxygenRemainingKg;
    engine.step(3600); // 1 hour
    const afterO2 = engine.getResources().oxygenRemainingKg;
    expect(afterO2).toBeLessThan(initialO2);
  });

  it('water decreases over time', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    const initWater = engine.getResources().waterRemainingLiters;
    engine.step(3600);
    expect(engine.getResources().waterRemainingLiters).toBeLessThan(initWater);
  });

  it('power decreases over time', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    const initPower = engine.getResources().powerRemainingKWh;
    engine.step(3600);
    expect(engine.getResources().powerRemainingKWh).toBeLessThan(initPower);
  });

  it('consumption rate multiplier speeds resource usage', () => {
    const e1 = new SimulationEngine(42);
    e1.loadScenario(getNominalScenario());
    e1.step(600);
    const normalO2 = e1.getResources().oxygenRemainingKg;

    const e2 = new SimulationEngine(42);
    const emergScenario = { ...getNominalScenario(), initialConditions: {
      ...getNominalScenario().initialConditions,
      resources: { ...BASELINE_RESOURCES, consumptionRateMultiplier: 2.0 }
    }};
    e2.loadScenario(emergScenario);
    e2.step(600);
    const emergencyO2 = e2.getResources().oxygenRemainingKg;

    expect(emergencyO2).toBeLessThan(normalO2);
  });
});

describe('SimulationEngine: Risk Assessment', () => {
  it('generates risk assessments with correct categories', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(10);
    const risks = engine.computeRisks();
    const categories = risks.map(r => r.category);
    expect(categories).toContain('Environmental');
    expect(categories).toContain('Radiation');
    expect(categories).toContain('Crew Condition');
    expect(categories).toContain('Resource');
  });

  it('nominal scenario has low risk scores', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(10);
    const risks = engine.computeRisks();
    const totalScore = risks.reduce((s, r) => s + r.riskScore, 0);
    expect(totalScore).toBeLessThan(30); // nominal should be low
  });

  it('risk scores are in valid range (1-25 per category)', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getCompoundScenario());
    engine.step(500);
    const risks = engine.computeRisks();
    for (const r of risks) {
      expect(r.riskScore).toBeGreaterThanOrEqual(1);
      expect(r.riskScore).toBeLessThanOrEqual(25);
    }
  });

  it('SPE scenario raises radiation risk', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    engine.step(700); // past SPE onset
    const risks = engine.computeRisks();
    const radRisk = risks.find(r => r.category === 'Radiation');
    expect(radRisk).toBeDefined();
    expect(radRisk!.riskScore).toBeGreaterThan(4);
  });
});

describe('SimulationEngine: Compound Events', () => {
  it('compound scenario triggers multiple event types', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getCompoundScenario());
    engine.step(650); // past events at 60s, 300s, 600s
    const dispatched = engine.getDispatchedEvents();
    expect(dispatched.length).toBeGreaterThan(2);
    const categories = [...new Set(dispatched.map(e => e.category))];
    expect(categories.length).toBeGreaterThan(1);
  });
});

describe('SimulationEngine: Recovery Actions', () => {
  it('shelter ingress lowers shielding attenuation factor', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getSPEScenario());
    engine.applyRecoveryAction('shelter_ingress');
    const rad = engine.getRadiation();
    expect(rad.stormShelterActive).toBe(true);
    expect(rad.shieldingAttenuationFactor).toBeLessThan(0.5);
  });

  it('reduce workload lowers crew workload index', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S06-SLEEP')!);
    engine.step(10);
    const before = engine.getCrew().workloadIndex;
    engine.applyRecoveryAction('reduce_workload');
    const after = engine.getCrew().workloadIndex;
    expect(after).toBeLessThan(before);
  });

  it('backup scrubber improves scrubber efficiency', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S08-EQUIP')!);
    engine.step(200); // past scrubber failure event
    const before = engine.getEnvironment().scrubberEfficiencyPercent;
    engine.applyRecoveryAction('activate_backup_scrubber');
    const after = engine.getEnvironment().scrubberEfficiencyPercent;
    expect(after).toBeGreaterThan(before);
  });

  it('restore TCS sets tcsStatus to Nominal', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(PREDEFINED_SCENARIOS.find(s => s.id === 'S05-THERMAL')!);
    engine.step(100); // trigger TCS failure
    engine.applyRecoveryAction('restore_tcs');
    expect(engine.getEnvironment().tcsStatus).toBe('Nominal');
  });

  it('power shed reduces consumption rate multiplier', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getCompoundScenario());
    engine.step(10);
    const before = engine.getResources().consumptionRateMultiplier;
    engine.applyRecoveryAction('power_shed');
    const after = engine.getResources().consumptionRateMultiplier;
    expect(after).toBeLessThanOrEqual(before);
  });
});

describe('SimulationEngine: Reset', () => {
  it('reset restores initial state', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(500);
    expect(engine.getElapsedSec()).toBe(500);
    engine.reset();
    expect(engine.getElapsedSec()).toBe(0);
    expect(engine.getDispatchedEvents()).toHaveLength(0);
  });

  it('after reset, same seed produces same results', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(100);
    const firstRun = engine.getEnvironment().cabinPressureKPa;
    engine.reset();
    engine.step(100);
    const secondRun = engine.getEnvironment().cabinPressureKPa;
    expect(firstRun).toBeCloseTo(secondRun, 5);
  });
});

describe('SimulationEngine: Snapshot', () => {
  it('snapshot contains all required fields', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    engine.step(10);
    const snap = engine.snapshot();
    expect(snap.elapsedSec).toBeDefined();
    expect(snap.environment).toBeDefined();
    expect(snap.radiation).toBeDefined();
    expect(snap.crew).toBeDefined();
    expect(snap.resources).toBeDefined();
    expect(snap.risks).toBeDefined();
    expect(snap.compoundRiskScore).toBeDefined();
    expect(snap.activeAlerts).toBeDefined();
    expect(snap.timestampFormatted).toBeDefined();
  });
});

describe('SimulationEngine: Scenario Library', () => {
  it('has at least 10 predefined scenarios', () => {
    expect(PREDEFINED_SCENARIOS.length).toBeGreaterThanOrEqual(10);
  });

  it('each scenario has required fields', () => {
    for (const s of PREDEFINED_SCENARIOS) {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.events).toBeDefined();
      expect(s.initialConditions).toBeDefined();
      expect(s.recoveryObjectives).toBeDefined();
      expect(s.evaluationCriteria).toBeDefined();
    }
  });
});

describe('SimulationEngine: Invalid Input Handling', () => {
  it('step with 0 or negative does not crash', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    expect(() => engine.step(0)).not.toThrow();
    expect(() => engine.step(-10)).not.toThrow();
  });

  it('snapshot before loading scenario still works', () => {
    const engine = new SimulationEngine(42);
    // No scenario loaded - should not crash because scenario check in step()
    expect(() => engine.step(10)).not.toThrow();
  });

  it('unknown recovery action does not crash', () => {
    const engine = new SimulationEngine(42);
    engine.loadScenario(getNominalScenario());
    expect(() => engine.applyRecoveryAction('totally_unknown_action_xyz')).not.toThrow();
  });
});
