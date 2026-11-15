import { MissionPhase } from './astronaut.types';

export type PhysiologicalSystemType = 
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'immune'
  | 'neurological'
  | 'sleep_circadian'
  | 'radiation_context'
  | 'respiratory';

export type SourceType = 'Simulated Telemetry' | 'Laboratory Biomarker' | 'In-Flight Sensor' | 'Ground Baseline Assessment' | 'Wearable Bio-Monitor';

export type SimulationStatus = 'Synthetic Demonstration' | 'Simulated Historical' | 'Standard Model Observation';

export interface PhysiologicalMeasurement {
  id: string;
  astronautId: string;
  system: PhysiologicalSystemType;
  variable: string;
  variableName: string;
  value: number | null; // null if unavailable
  unit: string;
  timestamp: string; // ISO string
  missionDay: number;
  missionPhase: MissionPhase;
  sourceType: SourceType;
  sourceReference: string;
  simulationStatus: SimulationStatus;
  qualityScore: number; // 0 - 100
  isSynthetic: boolean;
  notes?: string;
}

export interface HealthObservation {
  id: string;
  astronautId: string;
  measurementId: string;
  observationDate: string;
  missionPhase: MissionPhase;
  missionDay: number;
  system: PhysiologicalSystemType;
  variable: string;
  value: number | null;
  unit: string;
  context: string;
  isFlagged: boolean;
  notes?: string;
  studyReference?: string;
}

export interface SystemStatusSummary {
  system: PhysiologicalSystemType;
  displayName: string;
  dataAvailable: boolean;
  measurementCount: number;
  lastUpdated: string | null;
  status: 'normal' | 'review_recommended' | 'insufficient_data';
  activeVariables: string[];
}
