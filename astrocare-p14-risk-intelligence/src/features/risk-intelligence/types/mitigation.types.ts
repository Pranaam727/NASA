export type MitigationReadiness = 
  | 'OPERATIONAL'       // Active standard flight rule (e.g. ARED, T2 treadmill, CEVIS, ISS light protocols)
  | 'VALIDATED_ANALOG'  // Validated in 60-day bed rest or ground analog, awaiting flight certification
  | 'ADVANCED_RESEARCH' // Ground & animal testing phase (e.g. radioprotective compounds, artificial gravity)
  | 'CONCEPTUAL';       // Theoretical deep-space architecture countermeasure

export type MitigationCategory = 
  | 'PHYSICAL_EXERCISE'
  | 'PHARMACOLOGICAL'
  | 'NUTRITIONAL'
  | 'ENVIRONMENTAL_ENGINEERING'
  | 'BEHAVIORAL_PSYCHOLOGICAL'
  | 'MONITORING_SURVEILLANCE'
  | 'ARTIFICIAL_GRAVITY';

export interface MitigationStrategy {
  id: string;
  code: string;
  title: string;
  category: MitigationCategory;
  readiness: MitigationReadiness;
  targetRiskIds: string[];
  scientificRationale: string;
  protocolDescription: string;
  hardwareOrTechnology?: string[];
  supportingEvidenceIds: string[];
  evidenceLimitations: string;
  missionApplicability: {
    leo: string;
    lunar: string;
    mars: string;
  };
  residualRiskNote: string; // Explains what portion of the risk is NOT eliminated
  references: {
    title: string;
    source: string;
    url: string;
    year: number;
  }[];
}
