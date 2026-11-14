export type StudyCategory =
  | 'HUMAN_ASTRONAUT_RESEARCH'
  | 'HUMAN_CELL_MODEL'
  | 'ANIMAL_MODEL'
  | 'IN_VITRO_RESEARCH'
  | 'TECHNICAL_REPORT'
  | 'ROADMAP_RISK_GAP';

export type ResearchTopic =
  | 'IMMUNE_CELL_PROFILING'
  | 'CYTOKINE_ARRAY'
  | 'INFLAMMATION'
  | 'GENE_EXPRESSION'
  | 'RADIATION_IMMUNOLOGY'
  | 'LATENT_VIRUS_REACTIVATION'
  | 'FLOW_CYTOMETRY_METHODS'
  | 'STRESS_IMMUNE_AXIS';

export interface NASAResearchRecord {
  id: string;
  studyIdentifier: string; // e.g. OSD-575, HRR-Risk-85, NTRS-20230016983
  title: string;
  category: StudyCategory;
  topics: ResearchTopic[];
  organism: string; // e.g. Homo sapiens, Mus musculus, Human lymphoblastoid cell line
  sampleType: string; // e.g. Blood Serum, Whole Blood, Murine Thymus, Saliva
  assayType: string; // e.g. Luminex Multiplex, RNA-Seq Microarray, Flow Cytometry
  description: string;
  experimentalContext: string;
  spaceflightRelevance: string;
  sourceUrl: string;
  retrievalTimestamp: string;
  dataAccessLevel: 'PUBLIC_OPEN_ACCESS' | 'CONTROLLED_ACCESS' | 'OPEN_SCIENCE';
  citation: string;
  keyFindings: string[];
  caveatsAndLimitations: string[];
}

export interface ImmuneResearchInsightTopic {
  id: string;
  title: string;
  iconName: string;
  summary: string;
  observedFindings: string[];
  possibleMechanisms: string[];
  hypotheses: string[];
  clinicalDistinction: string;
  relatedNasaResources: string[];
}
