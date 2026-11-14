export type BiomedicalDomain =
  | 'cardiovascular'
  | 'bone'
  | 'muscle'
  | 'immune'
  | 'radiation'
  | 'sleep'
  | 'behavioral'
  | 'vision'
  | 'microbiome'
  | 'metabolism';

export type MissionPhase =
  | 'Preflight'
  | 'Inflight'
  | 'Postflight'
  | 'Ground Control'
  | 'Analog Baseline'
  | 'Analog Confinement'
  | 'Analog Recovery';

export interface MeasurementVariable {
  variableId: string;
  variableName: string;
  domain: BiomedicalDomain;
  description: string;
  unit: string;
  dataType: 'numerical' | 'categorical' | 'boolean';
  studyId: string;
  assayMethod: string;
  normalRangeAdult?: {
    min: number;
    max: number;
    unit: string;
    source: string;
  };
  spaceflightRelevance: string;
}

export interface ResearchObservation {
  observationId: string;
  studyId: string;
  variableId: string;
  variableName: string;
  numericValue: number;
  originalUnit: string;
  standardizedValue?: number;
  standardizedUnit?: string;
  collectionPhase: MissionPhase;
  phaseDay: number; // e.g. -30 for L-30, 2 for FD-2, 3 for R+3
  phaseDayLabel: string; // e.g. "L-30", "FD-2", "R+3"
  collectionTimestamp?: string;
  sampleId: string;
  subjectId: string; // e.g. "Astronaut-Alpha", "Murine-ISS-01"
  organism: string;
  studyPopulation: string;
  experimentalCondition: string; // e.g. "Microgravity (LEO)", "1G Ground Control", "Iron Ion Radiation 600 MeV/n"
  isDemonstrationData?: boolean;
}
