/**
 * AstroCare P18 — Simulation Engine
 * 
 * Deterministic, reproducible simulation engine with event dispatch.
 * 
 * MODEL ASSUMPTIONS (see NASA_REFERENCES.md for grounding):
 * - Atmospheric gas mixing: lumped-parameter ideal gas surrogate
 * - Radiation shielding: simplified mass-attenuation (not HZETRN/MCNP)
 * - Crew physiology: heuristic transfer functions derived from open literature
 * - Resource consumption: linear approximations with configurable multipliers
 * 
 * All outputs are SIMULATED. Not validated NASA mission operations tools.
 */

import type {
  ScenarioDefinition,
  ScenarioEvent,
  SimulationTelemetrySnapshot,
  EnvironmentalSimulationState,
  RadiationSimulationState,
  CrewSimulationState,
  ResourceSimulationState,
  MissionRiskAssessment,
  RiskSeverity,
} from '../contracts/index';

// ─── Seeded deterministic pseudo-random (Mulberry32 PRNG) ────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Default baseline environment ────────────────────────────────────────────
export const BASELINE_ENVIRONMENT: EnvironmentalSimulationState = {
  cabinPressureKPa: 101.3,
  oxygenKPa: 21.3,
  oxygenPercent: 21.0,
  co2KPa: 0.38,
  co2Percent: 0.38,
  temperatureC: 22.0,
  humidityPercent: 45.0,
  leakRatePercentPerDay: 0.05,
  scrubberEfficiencyPercent: 98,
  tcsStatus: 'Nominal',
};

export const BASELINE_RADIATION: RadiationSimulationState = {
  backgroundDoseRateMicroGyPerHour: 25,
  effectiveDoseRateMicroSvPerHour: 60,
  speActive: false,
  speFluxProtonsPerCm2Sec: 0,
  accumulatedAbsorbedDoseMilliGy: 0,
  accumulatedEquivalentDoseMilliSv: 0,
  stormShelterActive: false,
  shieldingThicknessGCm2: 5.0,
  shieldingAttenuationFactor: 1.0,
};

export const BASELINE_CREW: CrewSimulationState = {
  heartRateBpm: 68,
  oxygenSaturationPercent: 98.5,
  respiratoryRateBpm: 15,
  fatigueIndex: 15,
  circadianDisruptionIndex: 10,
  cognitiveStressIndex: 12,
  workloadIndex: 30,
  readinessScorePercent: 92,
  readinessCategory: 'Optimal',
  clinicalSummary: 'All crew vitals nominal. Well-rested.',
};

export const BASELINE_RESOURCES: ResourceSimulationState = {
  oxygenRemainingKg: 480,
  oxygenCapacityKg: 500,
  waterRemainingLiters: 950,
  waterCapacityLiters: 1000,
  powerRemainingKWh: 180,
  powerCapacityKWh: 200,
  batteryStateOfChargePercent: 90,
  consumableRationDays: 90,
  emergencyReservesPercent: 100,
  consumptionRateMultiplier: 1.0,
};

// ─── Thresholds for risk assessment ──────────────────────────────────────────
const THRESHOLDS = {
  pressure: { low: 95.0, moderate: 84.0, high: 75.0, critical: 70.3 },
  co2: { low: 0.5, moderate: 0.7, high: 1.0, critical: 1.5 },
  oxygen: { critical: 15.5, high: 16.0, moderate: 18.0, low: 19.5 },
  temperature: { coldLow: 18, warmHigh: 27, criticalHigh: 35 },
  radiation_rate: { low: 100, moderate: 300, high: 1000, critical: 2500 },
  spO2: { low: 95, moderate: 92, high: 90, critical: 85 },
  fatigue: { low: 35, moderate: 55, high: 70, critical: 85 },
  oxygenReserve: { low: 70, moderate: 50, high: 30, critical: 15 },
};

// ─── SimulationEngine Class ───────────────────────────────────────────────────
export class SimulationEngine {
  private scenario: ScenarioDefinition | null = null;
  private env: EnvironmentalSimulationState = { ...BASELINE_ENVIRONMENT };
  private rad: RadiationSimulationState = { ...BASELINE_RADIATION };
  private crew: CrewSimulationState = { ...BASELINE_CREW };
  private res: ResourceSimulationState = { ...BASELINE_RESOURCES };

  private elapsedSec = 0;
  private pendingEvents: ScenarioEvent[] = [];
  private dispatchedEvents: ScenarioEvent[] = [];
  private history: SimulationTelemetrySnapshot[] = [];
  private activeAnomalies: string[] = [];
  private activeRecoveryActions: string[] = [];
  private seed: number;
  private rng: () => number;

  constructor(seed = 42) {
    this.seed = seed;
    this.rng = mulberry32(seed);
  }

  // ── Load scenario ──────────────────────────────────────────────────────────
  loadScenario(scenario: ScenarioDefinition) {
    this.scenario = { ...scenario, events: scenario.events.map(e => ({ ...e, applied: false })) };
    // Apply initial conditions
    this.env = { ...BASELINE_ENVIRONMENT, ...scenario.initialConditions.environment } as EnvironmentalSimulationState;
    this.rad = { ...BASELINE_RADIATION, ...scenario.initialConditions.radiation } as RadiationSimulationState;
    this.crew = { ...BASELINE_CREW, ...scenario.initialConditions.crew } as CrewSimulationState;
    this.res = { ...BASELINE_RESOURCES, ...scenario.initialConditions.resources } as ResourceSimulationState;
    this.elapsedSec = 0;
    this.pendingEvents = [...this.scenario.events].sort((a, b) => a.triggerTimeSec - b.triggerTimeSec);
    this.dispatchedEvents = [];
    this.history = [];
    this.activeAnomalies = [];
    this.activeRecoveryActions = [];
    this.rng = mulberry32(this.seed);
  }

  // ── Step simulation forward ────────────────────────────────────────────────
  step(deltaSeconds: number) {
    if (!this.scenario) return;

    const steps = Math.max(1, Math.floor(deltaSeconds));
    for (let i = 0; i < steps; i++) {
      this.elapsedSec += 1;
      this._dispatchDueEvents();
      this._updateEnvironment(1);
      this._updateRadiation(1);
      this._updateCrew(1);
      this._updateResources(1);
    }

    // Snapshot every 10 seconds of sim time (or first tick)
    if (this.history.length === 0 || this.elapsedSec % 10 === 0) {
      this.history.push(this.snapshot());
    }
  }

  // ── Dispatch events whose trigger time has arrived ─────────────────────────
  private _dispatchDueEvents() {
    while (this.pendingEvents.length > 0 && this.pendingEvents[0].triggerTimeSec <= this.elapsedSec) {
      const event = this.pendingEvents.shift()!;
      event.applied = true;
      this._applyEvent(event);
      this.dispatchedEvents.push(event);
    }
  }

  private _applyEvent(event: ScenarioEvent) {
    const p = event.parameters;

    // Environmental parameters
    if (p.cabinPressureKPa !== undefined) this.env.cabinPressureKPa = p.cabinPressureKPa;
    if (p.oxygenPercent !== undefined) { this.env.oxygenPercent = p.oxygenPercent; this.env.oxygenKPa = p.oxygenPercent * this.env.cabinPressureKPa / 100; }
    if (p.oxygenKPa !== undefined) this.env.oxygenKPa = p.oxygenKPa;
    if (p.co2Percent !== undefined) { this.env.co2Percent = p.co2Percent; this.env.co2KPa = p.co2Percent; }
    if (p.co2KPa !== undefined) this.env.co2KPa = p.co2KPa;
    if (p.temperatureC !== undefined) this.env.temperatureC = p.temperatureC;
    if (p.humidityPercent !== undefined) this.env.humidityPercent = p.humidityPercent;
    if (p.leakRatePercentPerDay !== undefined) this.env.leakRatePercentPerDay = p.leakRatePercentPerDay;
    if (p.scrubberEfficiencyPercent !== undefined) this.env.scrubberEfficiencyPercent = p.scrubberEfficiencyPercent;
    if (p.tcsStatus !== undefined) this.env.tcsStatus = p.tcsStatus;

    // Radiation parameters
    if (p.speActive !== undefined) this.rad.speActive = p.speActive;
    if (p.speFluxProtonsPerCm2Sec !== undefined) this.rad.speFluxProtonsPerCm2Sec = p.speFluxProtonsPerCm2Sec;
    if (p.effectiveDoseRateMicroSvPerHour !== undefined) this.rad.effectiveDoseRateMicroSvPerHour = p.effectiveDoseRateMicroSvPerHour;
    if (p.stormShelterActive !== undefined) this.rad.stormShelterActive = p.stormShelterActive;
    if (p.shieldingThicknessGCm2 !== undefined) this.rad.shieldingThicknessGCm2 = p.shieldingThicknessGCm2;
    if (p.shieldingAttenuationFactor !== undefined) this.rad.shieldingAttenuationFactor = p.shieldingAttenuationFactor;

    // Crew parameters
    if (p.heartRateBpm !== undefined) this.crew.heartRateBpm = p.heartRateBpm;
    if (p.fatigueIndex !== undefined) this.crew.fatigueIndex = p.fatigueIndex;
    if (p.circadianDisruptionIndex !== undefined) this.crew.circadianDisruptionIndex = p.circadianDisruptionIndex;
    if (p.cognitiveStressIndex !== undefined) this.crew.cognitiveStressIndex = p.cognitiveStressIndex;
    if (p.workloadIndex !== undefined) this.crew.workloadIndex = p.workloadIndex;
    if (p.respiratoryRateBpm !== undefined) this.crew.respiratoryRateBpm = p.respiratoryRateBpm;

    // Resource parameters
    if (p.consumptionRateMultiplier !== undefined) this.res.consumptionRateMultiplier = p.consumptionRateMultiplier;

    // Track anomalies
    if (event.severity === 'High' || event.severity === 'Critical') {
      if (!this.activeAnomalies.includes(event.title)) {
        this.activeAnomalies.push(event.title);
      }
    }
    if (event.severity === 'Info') {
      // Info events may resolve prior anomalies
      this.activeAnomalies = this.activeAnomalies.filter(a => !a.includes('Failure') || event.title.includes('Restored') || event.title.includes('Nominal'));
    }
  }

  // ── Environmental physics update (1 second step) ───────────────────────────
  private _updateEnvironment(dt: number) {
    // Pressure decay due to leaks (exponential decay approximation)
    // dP/dt = -leak_rate * P / 86400
    const leakDecay = (this.env.leakRatePercentPerDay / 100) / 86400;
    this.env.cabinPressureKPa = Math.max(0, this.env.cabinPressureKPa - leakDecay * this.env.cabinPressureKPa * dt);
    // Keep O2 kPa proportional if pressure is falling (assume fixed composition unless event overrides)
    this.env.oxygenKPa = Math.max(0, (this.env.oxygenPercent / 100) * this.env.cabinPressureKPa);

    // CO2 accumulation: rises based on crew metabolic output vs scrubber efficiency
    // Nominal CO2 production ~200 mL/min/person → modelled as a rate constant
    const co2ProductionRatePerSec = 0.000003 * (this.crew.workloadIndex / 30); // simplified
    const scrubberRemovalRate = (this.env.scrubberEfficiencyPercent / 100) * 0.000003;
    const netCO2Change = co2ProductionRatePerSec - scrubberRemovalRate;
    this.env.co2Percent = Math.max(0.03, Math.min(5.0, this.env.co2Percent + netCO2Change * dt));
    this.env.co2KPa = this.env.co2Percent;

    // Temperature dynamics: TCS removes heat, failures let it rise
    if (this.env.tcsStatus === 'Failed') {
      this.env.temperatureC = Math.min(45, this.env.temperatureC + 0.002 * dt);
    } else if (this.env.tcsStatus === 'Degraded') {
      this.env.temperatureC = Math.min(35, this.env.temperatureC + 0.0008 * dt);
    } else {
      // Natural slow recovery toward 22°C
      this.env.temperatureC += (22 - this.env.temperatureC) * 0.0001 * dt;
    }

    // Humidity: rises with temperature deviation and metabolic load
    const humidityTarget = 45 + (this.env.temperatureC - 22) * 1.5;
    this.env.humidityPercent += (humidityTarget - this.env.humidityPercent) * 0.0002 * dt;
    this.env.humidityPercent = Math.max(20, Math.min(90, this.env.humidityPercent));
  }

  // ── Radiation accumulation update ─────────────────────────────────────────
  private _updateRadiation(dt: number) {
    const hourFraction = dt / 3600;

    // Effective dose rate depends on SPE and shielding
    let effectiveRate = this.rad.effectiveDoseRateMicroSvPerHour;
    if (this.rad.speActive) {
      // During SPE, dose rate depends on proton flux and shielding attenuation
      // Simplified: base rate + SPE contribution attenuated by shielding
      const speContribution = (this.rad.speFluxProtonsPerCm2Sec / 1000) * 800; // µSv/h surrogate
      effectiveRate = (60 + speContribution) * this.rad.shieldingAttenuationFactor;
      this.rad.effectiveDoseRateMicroSvPerHour = effectiveRate;
    } else {
      // Background GCR attenuated by shielding
      effectiveRate = 60 * this.rad.shieldingAttenuationFactor;
      this.rad.effectiveDoseRateMicroSvPerHour = Math.max(effectiveRate, this.rad.effectiveDoseRateMicroSvPerHour * 0.9999);
    }

    // Accumulate dose
    // Effective dose (Sv): uses quality factor Q (here ≈ 2.4 for mixed field)
    const Q = this.rad.speActive ? 2.0 : 2.4;
    this.rad.accumulatedEquivalentDoseMilliSv += (effectiveRate / 1000) * hourFraction;
    this.rad.accumulatedAbsorbedDoseMilliGy += (effectiveRate / Q / 1000) * hourFraction;
    this.rad.backgroundDoseRateMicroGyPerHour = effectiveRate / Q;
  }

  // ── Crew physiology update ─────────────────────────────────────────────────
  private _updateCrew(dt: number) {
    // SpO2 responds to ppO2 hypoxia
    const ppO2 = this.env.oxygenKPa;
    let spO2Target = 98.5;
    if (ppO2 < 16.0) spO2Target = 85 + (ppO2 - 13) * 2.5;
    else if (ppO2 < 18.0) spO2Target = 90 + (ppO2 - 16) * 2;
    else if (ppO2 < 19.5) spO2Target = 95 + (ppO2 - 18) * 1.5;
    spO2Target = Math.max(70, Math.min(100, spO2Target));
    this.crew.oxygenSaturationPercent += (spO2Target - this.crew.oxygenSaturationPercent) * 0.001 * dt;

    // Respiratory rate responds to CO2 and hypoxia
    const co2 = this.env.co2KPa;
    let rrTarget = 15;
    if (co2 > 1.5) rrTarget = 25;
    else if (co2 > 1.0) rrTarget = 21;
    else if (co2 > 0.7) rrTarget = 18;
    else if (co2 > 0.5) rrTarget = 16;
    if (ppO2 < 16) rrTarget = Math.max(rrTarget, 22);
    this.crew.respiratoryRateBpm += (rrTarget - this.crew.respiratoryRateBpm) * 0.0008 * dt;

    // Heart rate: responds to thermal stress, hypoxia, and stress index
    const thermalStress = Math.max(0, this.env.temperatureC - 27) * 2;
    const hypoxiaHR = ppO2 < 16 ? (16 - ppO2) * 5 : 0;
    const baseHR = 68 + (this.crew.cognitiveStressIndex / 100) * 20 + thermalStress + hypoxiaHR;
    this.crew.heartRateBpm += (baseHR - this.crew.heartRateBpm) * 0.0005 * dt;
    this.crew.heartRateBpm = Math.max(45, Math.min(160, this.crew.heartRateBpm));

    // Fatigue: accumulates with workload, dissipates with rest
    const fatigueRate = (this.crew.workloadIndex / 100) * 0.001 - 0.0003; // net per second
    this.crew.fatigueIndex = Math.max(0, Math.min(100, this.crew.fatigueIndex + fatigueRate * dt));

    // Circadian disruption: persists, slow recovery
    this.crew.circadianDisruptionIndex = Math.max(0, this.crew.circadianDisruptionIndex - 0.00005 * dt);

    // Stress: responds to anomalies, CO2, hypoxia, and temperature
    const stressTarget = 15
      + (co2 > 0.5 ? (co2 - 0.5) * 20 : 0)
      + (ppO2 < 19 ? (19 - ppO2) * 8 : 0)
      + (this.env.temperatureC > 27 ? (this.env.temperatureC - 27) * 3 : 0)
      + (this.activeAnomalies.length * 10);
    this.crew.cognitiveStressIndex += (Math.min(100, stressTarget) - this.crew.cognitiveStressIndex) * 0.0003 * dt;

    // Readiness calculation
    this._computeReadiness();
  }

  private _computeReadiness() {
    const spO2Score = this.crew.oxygenSaturationPercent >= 97 ? 100
      : this.crew.oxygenSaturationPercent >= 94 ? 80
      : this.crew.oxygenSaturationPercent >= 90 ? 55
      : this.crew.oxygenSaturationPercent >= 85 ? 25 : 5;

    const fatigueScore = 100 - this.crew.fatigueIndex;
    const stressScore = 100 - this.crew.cognitiveStressIndex;
    const workloadScore = 100 - this.crew.workloadIndex * 0.6;
    const anomalyPenalty = Math.min(40, this.activeAnomalies.length * 10);

    const rawScore = (spO2Score * 0.3 + fatigueScore * 0.25 + stressScore * 0.2 + workloadScore * 0.25) - anomalyPenalty;
    this.crew.readinessScorePercent = Math.max(0, Math.min(100, rawScore));

    if (this.crew.readinessScorePercent >= 85) this.crew.readinessCategory = 'Optimal';
    else if (this.crew.readinessScorePercent >= 70) this.crew.readinessCategory = 'Nominal';
    else if (this.crew.readinessScorePercent >= 50) this.crew.readinessCategory = 'Degraded';
    else if (this.crew.readinessScorePercent >= 30) this.crew.readinessCategory = 'Impaired';
    else this.crew.readinessCategory = 'Critical';

    // Clinical summary
    const issues: string[] = [];
    if (this.crew.oxygenSaturationPercent < 94) issues.push(`Low SpO2 ${this.crew.oxygenSaturationPercent.toFixed(1)}%`);
    if (this.crew.fatigueIndex > 65) issues.push(`High fatigue (${this.crew.fatigueIndex.toFixed(0)}/100)`);
    if (this.crew.cognitiveStressIndex > 60) issues.push(`Elevated stress (${this.crew.cognitiveStressIndex.toFixed(0)}/100)`);
    if (this.env.co2KPa > 0.6) issues.push(`CO2 elevated (${this.env.co2KPa.toFixed(2)} kPa)`);
    this.crew.clinicalSummary = issues.length > 0 ? issues.join(' | ') : 'All crew vitals within acceptable limits.';
  }

  // ── Resource consumption update ────────────────────────────────────────────
  private _updateResources(dt: number) {
    const mult = this.res.consumptionRateMultiplier;
    const crewFactor = 4; // crew size proxy

    // O2 consumption: ~0.84 kg/person/day nominal
    const o2PerSec = (0.84 * crewFactor * mult) / 86400;
    this.res.oxygenRemainingKg = Math.max(0, this.res.oxygenRemainingKg - o2PerSec * dt);

    // Water: ~2.5 L/person/day
    const waterPerSec = (2.5 * crewFactor * mult) / 86400;
    this.res.waterRemainingLiters = Math.max(0, this.res.waterRemainingLiters - waterPerSec * dt);

    // Power: continuous load ~8 kW average
    const powerPerSec = (8 * mult) / 3600;
    this.res.powerRemainingKWh = Math.max(0, this.res.powerRemainingKWh - powerPerSec * dt);
    this.res.batteryStateOfChargePercent = (this.res.powerRemainingKWh / this.res.powerCapacityKWh) * 100;

    // Consumables: proportional consumption
    const consPerSec = mult / 86400 * 0.5;
    this.res.consumableRationDays = Math.max(0, this.res.consumableRationDays - consPerSec * dt);

    // Emergency reserves erode when primary resources are critically low
    if (this.res.oxygenRemainingKg < this.res.oxygenCapacityKg * 0.1) {
      this.res.emergencyReservesPercent = Math.max(0, this.res.emergencyReservesPercent - 0.001 * dt);
    }
  }

  // ── Risk assessment ────────────────────────────────────────────────────────
  computeRisks(): MissionRiskAssessment[] {
    const risks: MissionRiskAssessment[] = [];

    // Environmental risk
    const pressSeverity = this._scorePressure();
    const co2Severity = this._scoreCO2();
    const tempSeverity = this._scoreTemp();
    const envMax = this._maxSeverity([pressSeverity, co2Severity, tempSeverity]);
    risks.push({
      category: 'Environmental',
      severity: envMax,
      likelihood: this._severityToLikelihood(envMax),
      consequence: this._severityToConsequence(envMax),
      riskScore: this._severityToLikelihood(envMax) * this._severityToConsequence(envMax),
      observedConditions: `Pressure: ${this.env.cabinPressureKPa.toFixed(1)} kPa | CO2: ${this.env.co2KPa.toFixed(2)} kPa | Temp: ${this.env.temperatureC.toFixed(1)}°C`,
      triggeringEvents: this.dispatchedEvents.filter(e => e.category === 'Environmental').map(e => e.title),
      rationale: `Cabin pressure ${pressSeverity}, CO2 ${co2Severity}, temperature ${tempSeverity}.`,
      suggestedOperationalResponse: this._envResponse(),
    });

    // Radiation risk
    const radSeverity = this._scoreRadiation();
    risks.push({
      category: 'Radiation',
      severity: radSeverity,
      likelihood: this._severityToLikelihood(radSeverity),
      consequence: this._severityToConsequence(radSeverity),
      riskScore: this._severityToLikelihood(radSeverity) * this._severityToConsequence(radSeverity),
      observedConditions: `Dose rate: ${this.rad.effectiveDoseRateMicroSvPerHour.toFixed(0)} µSv/h | Total eff. dose: ${this.rad.accumulatedEquivalentDoseMilliSv.toFixed(1)} mSv | Absorbed: ${this.rad.accumulatedAbsorbedDoseMilliGy.toFixed(1)} mGy`,
      triggeringEvents: this.dispatchedEvents.filter(e => e.category === 'Radiation').map(e => e.title),
      rationale: `Effective dose rate ${this.rad.effectiveDoseRateMicroSvPerHour.toFixed(0)} µSv/h. ${this.rad.speActive ? 'SPE ACTIVE.' : ''} Accumulated: ${this.rad.accumulatedEquivalentDoseMilliSv.toFixed(1)} mSv. Note: 150 mSv/30-day limit used as simplified reference (not NASA-official for this scenario).`,
      suggestedOperationalResponse: this._radResponse(),
    });

    // Crew condition risk
    const crewSeverity = this._scoreCrewCondition();
    risks.push({
      category: 'Crew Condition',
      severity: crewSeverity,
      likelihood: this._severityToLikelihood(crewSeverity),
      consequence: this._severityToConsequence(crewSeverity),
      riskScore: this._severityToLikelihood(crewSeverity) * this._severityToConsequence(crewSeverity),
      observedConditions: `SpO2: ${this.crew.oxygenSaturationPercent.toFixed(1)}% | HR: ${this.crew.heartRateBpm.toFixed(0)} bpm | Fatigue: ${this.crew.fatigueIndex.toFixed(0)}/100 | Stress: ${this.crew.cognitiveStressIndex.toFixed(0)}/100`,
      triggeringEvents: this.dispatchedEvents.filter(e => e.category === 'Crew' || e.category === 'Medical').map(e => e.title),
      rationale: `${this.crew.clinicalSummary}`,
      suggestedOperationalResponse: this._crewResponse(),
    });

    // Resource risk
    const resSeverity = this._scoreResources();
    risks.push({
      category: 'Resource',
      severity: resSeverity,
      likelihood: this._severityToLikelihood(resSeverity),
      consequence: this._severityToConsequence(resSeverity),
      riskScore: this._severityToLikelihood(resSeverity) * this._severityToConsequence(resSeverity),
      observedConditions: `O2: ${((this.res.oxygenRemainingKg/this.res.oxygenCapacityKg)*100).toFixed(0)}% | H2O: ${((this.res.waterRemainingLiters/this.res.waterCapacityLiters)*100).toFixed(0)}% | Power: ${this.res.batteryStateOfChargePercent.toFixed(0)}%`,
      triggeringEvents: [],
      rationale: `Resource consumption at ${this.res.consumptionRateMultiplier.toFixed(1)}x baseline rate.`,
      suggestedOperationalResponse: 'Monitor depletion rates. Activate conservation protocols if any resource < 30%.',
    });

    // Communication risk
    const commsSev = this._scoreComms();
    risks.push({
      category: 'Communication',
      severity: commsSev,
      likelihood: this._severityToLikelihood(commsSev),
      consequence: this._severityToConsequence(commsSev),
      riskScore: this._severityToLikelihood(commsSev) * this._severityToConsequence(commsSev),
      observedConditions: `Comms events: ${this.dispatchedEvents.filter(e => e.category === 'Comms').length}`,
      triggeringEvents: this.dispatchedEvents.filter(e => e.category === 'Comms').map(e => e.title),
      rationale: 'Communication status derived from dispatched communication events.',
      suggestedOperationalResponse: 'Activate autonomous operations mode. Attempt backup communication links.',
    });

    return risks;
  }

  // ── Scoring helpers ────────────────────────────────────────────────────────
  private _scorePressure(): RiskSeverity {
    const p = this.env.cabinPressureKPa;
    if (p < THRESHOLDS.pressure.critical) return 'Critical';
    if (p < THRESHOLDS.pressure.high) return 'High';
    if (p < THRESHOLDS.pressure.moderate) return 'Moderate';
    if (p < THRESHOLDS.pressure.low) return 'Low';
    return 'Nominal';
  }

  private _scoreCO2(): RiskSeverity {
    const c = this.env.co2KPa;
    if (c >= THRESHOLDS.co2.critical) return 'Critical';
    if (c >= THRESHOLDS.co2.high) return 'High';
    if (c >= THRESHOLDS.co2.moderate) return 'Moderate';
    if (c >= THRESHOLDS.co2.low) return 'Low';
    return 'Nominal';
  }

  private _scoreTemp(): RiskSeverity {
    const t = this.env.temperatureC;
    if (t > THRESHOLDS.temperature.criticalHigh) return 'Critical';
    if (t > THRESHOLDS.temperature.warmHigh) return 'High';
    if (t < THRESHOLDS.temperature.coldLow) return 'Moderate';
    return 'Nominal';
  }

  private _scoreRadiation(): RiskSeverity {
    const rate = this.rad.effectiveDoseRateMicroSvPerHour;
    if (rate >= THRESHOLDS.radiation_rate.critical) return 'Critical';
    if (rate >= THRESHOLDS.radiation_rate.high) return 'High';
    if (rate >= THRESHOLDS.radiation_rate.moderate) return 'Moderate';
    if (rate >= THRESHOLDS.radiation_rate.low) return 'Low';
    return 'Nominal';
  }

  private _scoreCrewCondition(): RiskSeverity {
    const spO2 = this.crew.oxygenSaturationPercent;
    const fatigue = this.crew.fatigueIndex;
    if (spO2 < THRESHOLDS.spO2.critical || fatigue >= THRESHOLDS.fatigue.critical) return 'Critical';
    if (spO2 < THRESHOLDS.spO2.high || fatigue >= THRESHOLDS.fatigue.high) return 'High';
    if (spO2 < THRESHOLDS.spO2.moderate || fatigue >= THRESHOLDS.fatigue.moderate) return 'Moderate';
    if (spO2 < THRESHOLDS.spO2.low || fatigue >= THRESHOLDS.fatigue.low) return 'Low';
    return 'Nominal';
  }

  private _scoreResources(): RiskSeverity {
    const o2pct = (this.res.oxygenRemainingKg / this.res.oxygenCapacityKg) * 100;
    if (o2pct < THRESHOLDS.oxygenReserve.critical) return 'Critical';
    if (o2pct < THRESHOLDS.oxygenReserve.high) return 'High';
    if (o2pct < THRESHOLDS.oxygenReserve.moderate) return 'Moderate';
    if (o2pct < THRESHOLDS.oxygenReserve.low) return 'Low';
    return 'Nominal';
  }

  private _scoreComms(): RiskSeverity {
    const commsEvents = this.dispatchedEvents.filter(e => e.category === 'Comms' && (e.severity === 'High' || e.severity === 'Critical'));
    const resolvedComms = this.dispatchedEvents.filter(e => e.category === 'Comms' && e.severity === 'Info' && e.title.includes('Restored'));
    if (commsEvents.length > resolvedComms.length) {
      const worstComms = commsEvents.find(e => e.severity === 'Critical');
      return worstComms ? 'High' : 'Moderate';
    }
    return 'Nominal';
  }

  private _maxSeverity(severities: RiskSeverity[]): RiskSeverity {
    const order: RiskSeverity[] = ['Nominal', 'Low', 'Moderate', 'High', 'Critical'];
    return severities.reduce((max, s) => order.indexOf(s) > order.indexOf(max) ? s : max, 'Nominal');
  }

  private _severityToLikelihood(s: RiskSeverity): number {
    return { Nominal: 1, Low: 2, Moderate: 3, High: 4, Critical: 5 }[s];
  }

  private _severityToConsequence(s: RiskSeverity): number {
    return { Nominal: 1, Low: 2, Moderate: 3, High: 4, Critical: 5 }[s];
  }

  // ── Response suggestions ───────────────────────────────────────────────────
  private _envResponse(): string {
    const issues: string[] = [];
    if (this.env.cabinPressureKPa < 95) issues.push('Isolate suspected leak compartment');
    if (this.env.co2KPa > 0.5) issues.push('Activate backup CO2 scrubbers; deploy LiOH canisters');
    if (this.env.temperatureC > 27) issues.push('Reduce electrical power load; activate backup thermal loop');
    return issues.length ? issues.join('. ') + '.' : 'Continue standard environmental monitoring.';
  }

  private _radResponse(): string {
    if (this.rad.effectiveDoseRateMicroSvPerHour > 1000) return 'IMMEDIATE: Crew ingress to storm shelter. Cancel all EVAs. Notify Mission Control.';
    if (this.rad.effectiveDoseRateMicroSvPerHour > 300) return 'Alert crew. Monitor dose rate. Prepare shelter ingress checklist. Cancel non-essential EVAs.';
    return 'Continue standard radiation monitoring. Log dose accumulation.';
  }

  private _crewResponse(): string {
    const r = this.crew.readinessCategory;
    if (r === 'Critical' || r === 'Impaired') return 'Remove crew from safety-critical operations. Implement mandatory rest schedule. Medical assessment required.';
    if (r === 'Degraded') return 'Buddy system required. Increase monitoring frequency. Reduce workload assignment.';
    return 'Maintain current monitoring protocol.';
  }

  // ── Apply a recovery action ────────────────────────────────────────────────
  applyRecoveryAction(actionId: string, params: Record<string, any> = {}) {
    this.activeRecoveryActions.push(actionId);

    switch (actionId) {
      case 'shelter_ingress':
        this.rad.stormShelterActive = true;
        this.rad.shieldingThicknessGCm2 = 25.0;
        this.rad.shieldingAttenuationFactor = 0.15;
        break;
      case 'shelter_egress':
        this.rad.stormShelterActive = false;
        this.rad.shieldingThicknessGCm2 = 5.0;
        this.rad.shieldingAttenuationFactor = 1.0;
        break;
      case 'activate_backup_o2':
        this.res.consumptionRateMultiplier = Math.max(1.0, this.res.consumptionRateMultiplier);
        this.env.oxygenPercent = Math.min(21.5, this.env.oxygenPercent + 2.0);
        this.env.oxygenKPa = this.env.oxygenPercent * this.env.cabinPressureKPa / 100;
        break;
      case 'activate_backup_scrubber':
        this.env.scrubberEfficiencyPercent = Math.min(98, this.env.scrubberEfficiencyPercent + 40);
        break;
      case 'reduce_workload':
        this.crew.workloadIndex = Math.max(20, this.crew.workloadIndex - 25);
        break;
      case 'mandatory_rest':
        this.crew.workloadIndex = Math.max(10, this.crew.workloadIndex - 40);
        break;
      case 'restore_tcs':
        this.env.tcsStatus = 'Nominal';
        break;
      case 'power_shed':
        this.res.consumptionRateMultiplier = Math.max(0.7, this.res.consumptionRateMultiplier - 0.2);
        break;
      case 'restore_comms':
        this.activeAnomalies = this.activeAnomalies.filter(a => !a.toLowerCase().includes('comms'));
        break;
      case 'repair_pressure_leak':
        this.env.leakRatePercentPerDay = 0.05;
        break;
      default:
        if (params) {
          // Generic parameter override
          Object.assign(this.env, params.environment || {});
          Object.assign(this.crew, params.crew || {});
          Object.assign(this.res, params.resources || {});
        }
    }
  }

  // ── Snapshot current state ─────────────────────────────────────────────────
  snapshot(): SimulationTelemetrySnapshot {
    const risks = this.computeRisks();
    const compoundScore = risks.reduce((sum, r) => sum + r.riskScore, 0);
    const alerts = this._generateAlerts(risks);

    return {
      elapsedSec: this.elapsedSec,
      simulationDay: Math.floor(this.elapsedSec / 86400) + 1,
      timestampFormatted: this._formatTime(this.elapsedSec),
      environment: { ...this.env },
      radiation: { ...this.rad },
      crew: { ...this.crew },
      resources: { ...this.res },
      risks,
      compoundRiskScore: compoundScore,
      activeAlerts: alerts,
    };
  }

  private _generateAlerts(risks: MissionRiskAssessment[]): string[] {
    const alerts: string[] = [];
    for (const r of risks) {
      if (r.severity === 'Critical') alerts.push(`CRITICAL: ${r.category} — ${r.observedConditions.split('|')[0].trim()}`);
      else if (r.severity === 'High') alerts.push(`HIGH: ${r.category} — ${r.observedConditions.split('|')[0].trim()}`);
    }
    return alerts;
  }

  private _formatTime(sec: number): string {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `D${String(d).padStart(2,'0')}+${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  // ── Accessors ──────────────────────────────────────────────────────────────
  getElapsedSec() { return this.elapsedSec; }
  getHistory() { return this.history; }
  getDispatchedEvents() { return this.dispatchedEvents; }
  getPendingEvents() { return this.pendingEvents; }
  getActiveAnomalies() { return this.activeAnomalies; }
  getActiveRecoveryActions() { return this.activeRecoveryActions; }
  getCurrentScenario() { return this.scenario; }
  getEnvironment() { return { ...this.env }; }
  getCrew() { return { ...this.crew }; }
  getRadiation() { return { ...this.rad }; }
  getResources() { return { ...this.res }; }

  // ── Reset ──────────────────────────────────────────────────────────────────
  reset() {
    if (this.scenario) this.loadScenario(this.scenario);
  }
}
