import { DataOrigin, MissionPhase, MonitoringState } from './context';

export type LeukocyteType =
  | 'WBC_TOTAL'
  | 'LYMPHOCYTE_ABS'
  | 'NEUTROPHIL_ABS'
  | 'MONOCYTE_ABS'
  | 'EOSINOPHIL_ABS'
  | 'BASOPHIL_ABS';

export type LymphocyteSubsetType =
  | 'CD3_T_CELL'
  | 'CD4_HELPER_T'
  | 'CD8_CYTOTOXIC_T'
  | 'CD4_CD8_RATIO'
  | 'B_CELL_CD19'
  | 'NK_CELL_CD16_56';

export type FunctionalAssayType =
  | 'T_CELL_STIM_PHA'
  | 'NK_CYTOTOXICITY_LYSIS'
  | 'MONOCYTE_PHAGOCYTOSIS'
  | 'VIRAL_SHEDDING_EBV'
  | 'VIRAL_SHEDDING_VZV'
  | 'VIRAL_SHEDDING_CMV';

export type ImmuneCellType = LeukocyteType | LymphocyteSubsetType | FunctionalAssayType;

export interface ImmuneCellRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  missionPhase: MissionPhase;
  cellType: ImmuneCellType;
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

export type CytokineType =
  | 'IL_6'
  | 'IL_1_BETA'
  | 'IL_10'
  | 'TNF_ALPHA'
  | 'IFN_GAMMA'
  | 'IL_2'
  | 'IL_4'
  | 'IL_8'
  | 'IL_1RA';

export type InflammatoryMarkerType =
  | 'CRP_HS'
  | 'FERRITIN'
  | 'PROCISION_CALCITONIN'
  | 'NEOPTERIN';

export type StressBiomarkerType =
  | 'CORTISOL_SERUM'
  | 'CORTISOL_SALIVARY'
  | 'CORTISOL_URINE_24H'
  | 'DHEA_S'
  | 'ALPHA_AMYLASE_SALIVARY';

export type BiomarkerIdentifier = CytokineType | InflammatoryMarkerType | StressBiomarkerType;

export type BiomarkerCategory = 'CYTOKINE' | 'INFLAMMATORY' | 'STRESS_HORMONAL';

export interface BiomarkerRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  missionPhase: MissionPhase;
  biomarker: BiomarkerIdentifier;
  name: string;
  category: BiomarkerCategory;
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
