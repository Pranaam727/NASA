import { DataOrigin, MissionPhase } from './context';

export type SampleType = 'BLOOD' | 'PLASMA' | 'SERUM' | 'SALIVA' | 'URINE';

export type SampleWorkflowStatus =
  | 'SCHEDULED'
  | 'COLLECTED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'ANALYSIS_COMPLETED'
  | 'ARCHIVED'
  | 'CANCELLED';

export type StorageCondition =
  | 'ROOM_TEMPERATURE'
  | 'REFRIGERATED_4C'
  | 'FROZEN_MINUS_20C'
  | 'CRYOPRESERVED_MINUS_80C'
  | 'LIQUID_NITROGEN_MINUS_196C';

export interface LaboratorySample {
  id: string;
  astronautId: string;
  missionId: string;
  sampleType: SampleType;
  collectionTimestamp: string;
  missionPhase: MissionPhase;
  missionDay: number;
  collectionStatus: 'SUCCESS' | 'PARTIAL_VOLUME' | 'FAILED' | 'PENDING';
  workflowStatus: SampleWorkflowStatus;
  storageCondition: StorageCondition;
  storageLocation: string;
  volumeMl: number;
  laboratory: string;
  associatedAssays: string[];
  collectedBy: string;
  notes?: string;
  source: string;
  dataOrigin: DataOrigin;
  history: SampleWorkflowEvent[];
}

export interface SampleWorkflowEvent {
  timestamp: string;
  status: SampleWorkflowStatus;
  operator: string;
  comment: string;
}

export type ResultInterpretation =
  | 'WITHIN_REFERENCE'
  | 'BELOW_REFERENCE'
  | 'ABOVE_REFERENCE'
  | 'PENDING'
  | 'NOT_AVAILABLE'
  | 'INSUFFICIENT_DATA';

export interface LaboratoryResult {
  id: string;
  sampleId: string;
  astronautId: string;
  missionId: string;
  analyte: string;
  category: 'IMMUNE_CELL' | 'CYTOKINE' | 'INFLAMMATORY' | 'HORMONAL' | 'CHEMISTRY' | 'VIROLOGY';
  value: number;
  unit: string;
  referenceLow?: number;
  referenceHigh?: number;
  referenceIntervalText: string;
  referenceSource: string;
  interpretation: ResultInterpretation;
  assayMethod: string;
  laboratoryName: string;
  collectionTimestamp: string;
  resultTimestamp: string;
  resultStatus: 'FINAL' | 'PRELIMINARY' | 'CORRECTED';
  dataProvenance: string;
  dataOrigin: DataOrigin;
  notes?: string;
}
