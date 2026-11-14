import { AlertSeverity } from '@/types/database.types';

export type ScenarioId =
  | 'SCENARIO_1_NOMINAL'
  | 'SCENARIO_2_CARDIO_STRESS'
  | 'SCENARIO_3_HYPOXIA'
  | 'SCENARIO_4_SLEEP_DEPRIVED'
  | 'SCENARIO_5_RADIATION_SPE'
  | 'SCENARIO_6_DECONDITIONING'
  | 'SCENARIO_7_MULTI_FACTOR';

export interface ParameterModulators {
  hrTargetOffset: number; // Delta BPM
  stressFactor: number; // 0.0 to 1.0
  spo2Drop: number; // Negative delta (e.g. -12%)
  bpStressDelta: number; // Delta mmHg
  thermalDelta: number; // Delta °C
  respiratoryDelta: number; // Delta RPM
  isSpeActive: boolean; // Solar Particle Event active
  speSurgeFlux: number; // Flux boost uSv/h
  sleepDeprivationFactor: number; // 0.0 to 1.0
  exerciseIntensity: number; // 0.0 to 1.0
}

export interface SimulationScenarioDefinition {
  id: ScenarioId;
  code: string;
  name: string;
  category: 'PHYSIOLOGICAL' | 'ENVIRONMENTAL' | 'BEHAVIORAL' | 'CRITICAL';
  description: string;
  expectedBehavior: string;
  severity: AlertSeverity;
  durationSeconds: number;
  modulators: ParameterModulators;
}
