export type PhysiologicalSystem = 
  | 'Cardiovascular'
  | 'Musculoskeletal (Bone)'
  | 'Musculoskeletal (Muscle)'
  | 'Central Nervous System & Sensorimotor'
  | 'Ophthalmic / Neuro-Ocular'
  | 'Immune & Hematology'
  | 'Behavioral & Neuropsychiatric'
  | 'Endocrine & Circadian'
  | 'Genomic & Cellular (Radiation)';

export type HrpRiskCode = 
  | 'RAD'       // Radiation
  | 'CARDIO'    // Cardiovascular
  | 'BONE'      // Bone Loss & Fracture
  | 'MUSCLE'    // Muscle Atrophy
  | 'IMMUNE'    // Host-Microorganism & Immune
  | 'SLEEP'     // Sleep & Circadian
  | 'BEHAVIOR'  // Behavioral Health & Performance
  | 'SANS';     // Spaceflight-Associated Neuro-ocular Syndrome

export interface BiologicalMechanism {
  name: string;
  description: string;
  cellularPathway?: string;
  primaryDrivers: string[];
}

export interface MissionRelevanceMatrix {
  leo: string;        // Low Earth Orbit (e.g. ISS)
  lunar: string;      // Artemis Gateway & Lunar Surface
  mars: string;       // Mars Transit & 500-day Surface Stay
  deepSpace: string;  // Deep Space Habitats / Asteroid
}

export interface RiskCategory {
  id: string;
  code: HrpRiskCode;
  title: string;
  shortDescription: string;
  fullDescription: string;
  physiologicalSystem: PhysiologicalSystem[];
  mechanisms: BiologicalMechanism[];
  missionRelevance: MissionRelevanceMatrix;
  evidenceIds: string[];
  mitigationIds: string[];
  hrpRiskUrl: string;
  primaryHrpCategory: string;
  severityFactors: string[];
  keyVulnerabilities: string[];
  evidenceQualitySummary: {
    astronautStudiesCount: number;
    groundAnalogCount: number;
    animalStudiesCount: number;
    cellModelCount: number;
    overallCertaintyBasis: string;
  };
  accentColor: string; // for scientific visualization
  iconName: string;
}

export interface RiskComparisonResult {
  categories: RiskCategory[];
  commonAffectedSystems: string[];
  divergentMechanisms: { categoryId: string; mechanisms: string[] }[];
  evidenceBreakdown: { categoryId: string; studyTypes: Record<string, number> }[];
  sharedMitigations: string[];
  missionVulnerabilityMatrix: {
    category: string;
    leoSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    lunarSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    marsSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  }[];
}
