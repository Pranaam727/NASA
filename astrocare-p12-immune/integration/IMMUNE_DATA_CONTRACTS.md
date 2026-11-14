# AstroCare P12 — Immune System & Laboratory Data Contracts

This document specifies the exact TypeScript data contracts exported by Module P12 for consumption by the master AstroCare application and peer modules.

---

## 1. Astronaut & Mission Context

```typescript
export type MissionPhase = 'PRE_FLIGHT' | 'IN_FLIGHT' | 'POST_FLIGHT' | 'RECOVERY';

export type MonitoringState = 'NORMAL' | 'MONITOR' | 'WARNING' | 'CRITICAL' | 'INSUFFICIENT_DATA';

export type DataOrigin = 'SIMULATED' | 'NASA_RESEARCH' | 'EXTERNAL_IMPORT' | 'USER_DEMO';

export interface AstronautContext {
  astronautId: string;
  name: string;
  missionId: string;
  missionName: string;
  missionDurationDays: number;
  missionElapsedDays: number;
  missionPhase: MissionPhase;
  crewRole: string;
  age: number;
  latestSampleDate: string;
  latestResultDate: string;
  overallMonitoringState: MonitoringState;
  dataOrigin: DataOrigin;
}
```

---

## 2. Immune Cell Telemetry Record

```typescript
export interface ImmuneCellRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  missionPhase: MissionPhase;
  cellType:
    | 'WBC_TOTAL'
    | 'LYMPHOCYTE_ABS'
    | 'NEUTROPHIL_ABS'
    | 'MONOCYTE_ABS'
    | 'EOSINOPHIL_ABS'
    | 'BASOPHIL_ABS'
    | 'CD3_T_CELL'
    | 'CD4_HELPER_T'
    | 'CD8_CYTOTOXIC_T'
    | 'CD4_CD8_RATIO'
    | 'B_CELL_CD19'
    | 'NK_CELL_CD16_56'
    | 'T_CELL_STIM_PHA'
    | 'NK_CYTOTOXICITY_LYSIS'
    | 'VIRAL_SHEDDING_EBV';
  cellName: string;
  category: 'LEUKOCYTE' | 'LYMPHOCYTE_SUBSET' | 'FUNCTIONAL_ASSAY';
  absoluteCount: number;
  relativePercentage?: number;
  unit: string;
  referenceLow: number;
  referenceHigh: number;
  referenceSource: string;
  sampleId: string;
  assayMethod: string;
  monitoringState: MonitoringState;
  source: string;
  dataOrigin: DataOrigin;
  notes?: string;
}
```

---

## 3. Cytokine & Inflammatory Biomarker Record

```typescript
export interface BiomarkerRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  missionPhase: MissionPhase;
  biomarker:
    | 'IL_6'
    | 'IL_1_BETA'
    | 'IL_10'
    | 'TNF_ALPHA'
    | 'IFN_GAMMA'
    | 'IL_8'
    | 'IL_1RA'
    | 'CRP_HS'
    | 'FERRITIN'
    | 'CORTISOL_SALIVARY'
    | 'CORTISOL_SERUM';
  name: string;
  category: 'CYTOKINE' | 'INFLAMMATORY' | 'STRESS_HORMONAL';
  value: number;
  unit: string;
  sampleType: 'SERUM' | 'PLASMA' | 'SALIVA' | 'URINE' | 'WHOLE_BLOOD';
  referenceLow: number;
  referenceHigh: number;
  referenceRangeText: string;
  referenceSource: string;
  assayMethod: string;
  sampleId: string;
  monitoringState: MonitoringState;
  source: string;
  dataOrigin: DataOrigin;
  notes?: string;
}
```

---

## 4. Laboratory Sample & Chain of Custody Record

```typescript
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
  storageCondition:
    | 'ROOM_TEMPERATURE'
    | 'REFRIGERATED_4C'
    | 'FROZEN_MINUS_20C'
    | 'CRYOPRESERVED_MINUS_80C'
    | 'LIQUID_NITROGEN_MINUS_196C';
  storageLocation: string;
  volumeMl: number;
  laboratory: string;
  associatedAssays: string[];
  collectedBy: string;
  notes?: string;
  source: string;
  dataOrigin: DataOrigin;
  history: {
    timestamp: string;
    status: SampleWorkflowStatus;
    operator: string;
    comment: string;
  }[];
}
```

---

## 5. Master AstroCare Alert Contract

```typescript
export interface MasterAstroCareAlert {
  alertId: string;
  originModule: 'P12_IMMUNE_INTELLIGENCE';
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  entityId: string;
  acknowledged: boolean;
  metadata: {
    analyte: string;
    observedValue: number | string;
    threshold: number | string;
    unit: string;
    category: string;
    recommendedFollowUp: string;
  };
}
```

---

## 6. Peer Module Interfaces (P10 & P11)

```typescript
export interface RadiationContextProvider {
  getMissionRadiationContext(missionId: string): OptionalRadiationContext | Promise<OptionalRadiationContext>;
  getExposureSummary(astronautId: string, missionId: string): { cumulativeDoseMsv: number };
}

export interface WellnessContextProvider {
  getSleepSummary(astronautId: string, missionId: string): { sleepScoreAvg: number };
  getStressSummary(astronautId: string, missionId: string): { subjectiveStressIndex: number };
}
```
