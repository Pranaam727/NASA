import { DatasetRecord } from './dataset.types';

export interface ResearchReportData {
  reportId: string;
  generatedAt: string;
  reportTitle: string;
  authorAgency: string;
  selectedStudies: DatasetRecord[];
  executiveSummary: string;
  studyObjectives: string[];
  populationBreakdown: {
    humans: number;
    animals: number;
    cells: number;
    others: number;
  };
  experimentalProtocols: string[];
  biomedicalVariablesCatalogued: string[];
  dataAvailabilityAudit: {
    totalFiles: number;
    metadataComplete: boolean;
    directDownloadAvailable: boolean;
    fileTypesObserved: string[];
  };
  observedBiomedicalFindings: string[];
  scientificLimitations: string[];
  sourceReferences: Array<{
    studyId: string;
    title: string;
    url: string;
    authors?: string;
  }>;
}

export interface ProviderSettings {
  mode: 'LIVE_WITH_FALLBACK' | 'LIVE_STRICT' | 'OFFLINE_BENCHMARK';
  proxyEndpoint: string;
  directEndpoint: string;
  useProxy: boolean;
  cacheTimeoutMinutes: number;
  maxSearchResults: number;
  autoNormalizeUnits: boolean;
}
