export type StudyClassification =
  | 'astronaut_human'     // Direct human spaceflight mission data
  | 'ground_analog'        // Head-down bed rest, isolation chambers (HERA/NEK), dry immersion
  | 'animal_model'         // Rodent, avian, invertebrate spaceflight/ground models
  | 'cell_culture'         // 2D/3D in-vitro bioreactor, organoid, microfluidic chips
  | 'computational_model'  // Biomechanical, radiation transport (HZETRN), pharmacokinetic
  | 'technical_report'     // NASA Special Publications, HRP Evidence Books, NTRS Tech Memos
  | 'peer_reviewed'       // Peer-reviewed journal papers (Nature, NPJ Microgravity, JAP, etc.)
  | 'nasa_summary';        // Official NASA HRP consensus statements & roadmap updates

export interface ScientificSourceReference {
  title: string;
  sourceOrganization: 'NASA HRP' | 'NASA Ames' | 'NASA Johnson' | 'ESA' | 'JAXA' | 'Academic Consortium';
  publicationYear: number;
  doi?: string;
  url: string;
  accessionNumber?: string; // NTRS ID or PubMed PMID
}

export interface ResearchEvidence {
  id: string;
  evidenceCode: string;
  title: string;
  sourceOrganization: string;
  publicationDate: string; // ISO date or Year
  studyType: StudyClassification;
  population: string;          // e.g. "12 ISS Crewmembers (6-12 month duration)" or "Not reported"
  sampleSize: string;          // e.g. "n = 16 (11 male, 5 female)" or "Not reported"
  organism: string;            // "Homo sapiens", "Mus musculus", "Rattus norvegicus", "In vitro human endothelial"
  methodology: string;         // Comprehensive scientific experimental protocol
  experimentalEnvironment: string; // "Low Earth Orbit (ISS Columbus/Destiny modules)", "6° Head-Down Bed Rest (envihab)"
  measurementMethods: string;  // e.g. "High-Resolution Peripheral Quantitative Computed Tomography (HR-pQCT)"
  findings: string;            // Validated scientific observations
  limitations: string;         // Explicit limitations (small n, sex bias, duration limits)
  generalizability: string;    // Human deep-space generalizability rating & caveats
  sourceUrl: string;
  doi?: string;
  ntrsId?: string;
  osdrId?: string;
  relatedRiskIds: string[];    // Target risk codes: 'RAD', 'CARDIO', 'BONE', 'MUSCLE', 'IMMUNE', 'SLEEP', 'BEHAVIOR', 'SANS'
  missionContext?: string;     // e.g. "ISS Increments 45-64", "NASA Twins Study (2015-2016)", "Shuttle STS-107"
  isDirectHumanEvidence: boolean;
}

export interface EvidenceFilterState {
  searchQuery: string;
  riskCategory: string; // 'ALL' or HrpRiskCode
  studyClassification: string; // 'ALL' or StudyClassification
  organismFilter: string; // 'ALL' | 'Human' | 'Animal' | 'Cell' | 'Computational'
  sourceOrg: string;
  yearRange: [number, number];
  hasDirectHumanOnly: boolean;
  sortBy: 'date' | 'sampleSize' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
}
