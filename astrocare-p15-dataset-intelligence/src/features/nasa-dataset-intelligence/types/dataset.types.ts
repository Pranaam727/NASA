export type StudyPopulation = 
  | 'human-spaceflight'
  | 'human-analog'
  | 'animal'
  | 'cell-culture'
  | 'microbial'
  | 'computational'
  | 'other';

export type ProvenanceType = 
  | 'LIVE_NASA_API'
  | 'CACHED_NASA_BENCHMARK'
  | 'SYNTHETIC_DEMO';

export type FileAvailabilityStatus = 
  | 'METADATA_AVAILABLE'
  | 'FILE_AVAILABLE'
  | 'DOWNLOAD_AVAILABLE'
  | 'ACCESS_UNAVAILABLE'
  | 'RETRIEVAL_FAILED';

export interface DatasetFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  category: string;
  remoteUrl: string;
  downloadUrl: string;
  availabilityStatus: FileAvailabilityStatus;
  restricted: boolean;
  dateCreated?: string;
  dateUpdated?: string;
}

export interface FactorItem {
  name: string;
  type: string;
  value?: string;
}

export interface ProtocolItem {
  name: string;
  type?: string;
  description: string;
}

export interface PublicationItem {
  title: string;
  authors?: string;
  journal?: string;
  year?: string;
  doi?: string;
  pmid?: string;
}

export interface DatasetRecord {
  studyId: string; // e.g. "OSD-575"
  title: string;
  description: string;
  organism: string; // e.g. "Homo sapiens", "Mus musculus"
  studyType: StudyPopulation;
  mission: string;
  flightProgram: string;
  experimentPlatform: string;
  sampleTypes: string[];
  assayTypes: string[];
  technologyPlatforms: string[];
  factors: FactorItem[];
  protocols: ProtocolItem[];
  publications: PublicationItem[];
  availableFiles: DatasetFile[];
  sourceUrl: string;
  metadataRetrievedAt: string;
  provenance: ProvenanceType;
  primaryDomain: string; // e.g. 'Cardiovascular', 'Immune', 'Bone and Muscle', etc.
  publicReleaseDate?: string;
  sampleCount?: number;
  managingCenter?: string;
  rawSourceData?: Record<string, unknown>;
}

export interface SearchFilterParams {
  query?: string;
  studyId?: string;
  organism?: string;
  studyType?: StudyPopulation | 'all';
  domain?: string;
  mission?: string;
  experimentType?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'id' | 'date' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResultPage {
  totalHits: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  results: DatasetRecord[];
  provenance: ProvenanceType;
  apiResponseTimeMs?: number;
  queryEcho?: string;
}
