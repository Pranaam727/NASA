/**
 * AstroCare Module 18/21: Mission Scenarios, Operational Simulation & Mission Readiness Intelligence
 * PUBLIC INTEGRATION CONTRACTS
 * 
 * Clean, decoupled interfaces designed for modular integration into the primary AstroCare
 * aerospace biomedical intelligence platform.
 */

export interface MissionProfile {
  id: string;
  name: string;
  identifier: string; // e.g. "AC-ARTEMIS-III-E2"
  spacecraftType: 'Orion MPCV' | 'Deep Space Habitat' | 'Lunar Gateway' | 'Mars Transit Vehicle';
  durationDays: number;
  currentDay: number;
  phase: 'Pre-Launch' | 'Trans-Lunar Injection' | 'Lunar Orbit Insertion' | 'Surface Operations' | 'Earth Return' | 'Deep Space Cruise';
  crewSize: number;
  crewMembers: Array<{
    id: string;
    name: string;
    role: string;
    baselineVO2Max: number;
  }>;
}

export interface EnvironmentalSimulationState {
  cabinPressureKPa: number; // nominal 101.3 kPa
  oxygenKPa: number; // nominal 21.3 kPa (ppO2)
  oxygenPercent: number; // nominal 21.0%
  co2KPa: number; // nominal < 0.4 kPa (ppCO2)
  co2Percent: number; // nominal < 0.4%
  temperatureC: number; // nominal 21.5°C
  humidityPercent: number; // nominal 45%
  leakRatePercentPerDay: number; // nominal 0.05%
  scrubberEfficiencyPercent: number; // nominal 98%
  tcsStatus: 'Nominal' | 'Degraded' | 'Failed';
}

export interface RadiationSimulationState {
  backgroundDoseRateMicroGyPerHour: number; // GCR baseline ~25 µGy/h
  effectiveDoseRateMicroSvPerHour: number; // accounting for radiation weighting Q ~60 µSv/h
  speActive: boolean;
  speFluxProtonsPerCm2Sec: number; // SPE proton flux >10 MeV
  accumulatedAbsorbedDoseMilliGy: number; // Total Gy (mGy)
  accumulatedEquivalentDoseMilliSv: number; // Total Sv (mSv)
  stormShelterActive: boolean;
  shieldingThicknessGCm2: number; // e.g. 5.0 nominal, 25.0 storm shelter
  shieldingAttenuationFactor: number; // 0.15 - 1.0
}

export interface CrewSimulationState {
  heartRateBpm: number; // nominal 65-75 bpm
  oxygenSaturationPercent: number; // nominal 98-99%
  respiratoryRateBpm: number; // nominal 14-16 br/min
  fatigueIndex: number; // 0 to 100
  circadianDisruptionIndex: number; // 0 to 100
  cognitiveStressIndex: number; // 0 to 100
  workloadIndex: number; // 0 to 100
  readinessScorePercent: number; // 0 to 100%
  readinessCategory: 'Optimal' | 'Nominal' | 'Degraded' | 'Impaired' | 'Critical';
  clinicalSummary: string;
}

export interface ResourceSimulationState {
  oxygenRemainingKg: number;
  oxygenCapacityKg: number;
  waterRemainingLiters: number;
  waterCapacityLiters: number;
  powerRemainingKWh: number;
  powerCapacityKWh: number;
  batteryStateOfChargePercent: number;
  consumableRationDays: number;
  emergencyReservesPercent: number;
  consumptionRateMultiplier: number;
}

export type RiskCategory = 
  | 'Environmental' 
  | 'Radiation' 
  | 'Crew Condition' 
  | 'Equipment' 
  | 'Resource' 
  | 'Communication' 
  | 'Compound Emergency';

export type RiskSeverity = 'Nominal' | 'Low' | 'Moderate' | 'High' | 'Critical';

export interface MissionRiskAssessment {
  category: RiskCategory;
  severity: RiskSeverity;
  likelihood: number; // 1 to 5 scale
  consequence: number; // 1 to 5 scale
  riskScore: number; // likelihood * consequence (1-25)
  observedConditions: string;
  triggeringEvents: string[];
  rationale: string;
  suggestedOperationalResponse: string;
}

export interface ScenarioEvent {
  id: string;
  triggerTimeSec: number;
  title: string;
  description: string;
  category: 'Environmental' | 'Radiation' | 'Crew' | 'System' | 'Comms' | 'Medical' | 'Compound';
  severity: 'Info' | 'Warning' | 'High' | 'Critical';
  applied: boolean;
  parameters: Record<string, any>;
  suggestedMitigation?: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  missionPhase: string;
  severityClassification: 'Low' | 'Medium' | 'High' | 'Extreme';
  initialConditions: {
    environment: Partial<EnvironmentalSimulationState>;
    radiation: Partial<RadiationSimulationState>;
    crew: Partial<CrewSimulationState>;
    resources: Partial<ResourceSimulationState>;
  };
  events: ScenarioEvent[];
  affectedSystems: string[];
  expectedSimulationVariables: string[];
  recoveryObjectives: string[];
  evaluationCriteria: string[];
  isCustom?: boolean;
}

export interface SimulationTelemetrySnapshot {
  elapsedSec: number;
  simulationDay: number;
  timestampFormatted: string;
  environment: EnvironmentalSimulationState;
  radiation: RadiationSimulationState;
  crew: CrewSimulationState;
  resources: ResourceSimulationState;
  risks: MissionRiskAssessment[];
  compoundRiskScore: number;
  activeAlerts: string[];
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  timeScale: number; // 1x, 2x, 5x, 10x, 60x
  elapsedTimeSec: number;
  seed: number;
  selectedScenario: ScenarioDefinition;
  currentTelemetry: SimulationTelemetrySnapshot;
  telemetryHistory: SimulationTelemetrySnapshot[];
  dispatchedEvents: ScenarioEvent[];
  activeAnomalies: string[];
  activeRecoveryActions: string[];
}

export interface MissionSimulationReport {
  reportId: string;
  generatedAt: string;
  missionProfile: MissionProfile;
  scenarioExecuted: ScenarioDefinition;
  totalDurationSimulatedSec: number;
  initialConditions: Record<string, any>;
  finalConditions: Record<string, any>;
  criticalEventsEncountered: ScenarioEvent[];
  interventionsApplied: string[];
  telemetryLogSummary: {
    minSpO2: number;
    maxHeartRate: number;
    peakRadiationDoseRateMicroSvPerH: number;
    totalAbsorbedDoseMilliGy: number;
    totalEffectiveDoseMilliSv: number;
    minCabinPressureKPa: number;
    lowestReadinessPercent: number;
    oxygenRemainingPercent: number;
    finalRiskScore: number;
  };
  scientificAssumptionsAndDisclaimers: string[];
}

export interface ISimulationServiceProvider {
  loadScenario(scenario: ScenarioDefinition): void;
  startSimulation(): void;
  pauseSimulation(): void;
  resetSimulation(): void;
  stepSimulation(stepSeconds: number): void;
  setSpeed(speed: number): void;
  triggerEvent(event: ScenarioEvent): void;
  applyRecoveryAction(actionId: string, parameters?: Record<string, any>): void;
  getTelemetry(): SimulationTelemetrySnapshot;
  exportReport(format: 'json' | 'csv'): string;
}
