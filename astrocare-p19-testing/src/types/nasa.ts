/**
 * AstroCare NASA Data Source & Software Assurance Types
 * Authoritative schemas for api.nasa.gov, osdr.nasa.gov, ntrs.nasa.gov, and data.nasa.gov
 * Quality guidance reference: NASA NPR 7150.2D & NASA-STD-8739.8B
 */

export interface NasaApiRateLimitInfo {
  limitPerHour: number;
  remainingPerHour: number;
  isDemoKey: boolean;
  rateLimitResetTimestamp?: string;
}

export interface NasaOsdrStudyMetadata {
  accession: string; // e.g. "OSD-379"
  title: string;
  description: string;
  organism: string;
  missionName?: string;
  spaceflightFactor?: string;
  assaysCount: number;
  samplesCount: number;
  releaseDate: string;
  dataFiles: Array<{
    fileName: string;
    fileSize: number;
    fileFormat: string;
    remoteUrl: string;
    sha256?: string;
  }>;
}

export interface NasaNtrsCitation {
  id: string; // e.g. "20230005432"
  title: string;
  authors: Array<{ name: string; affiliation?: string }>;
  publicationDate: string;
  abstract: string;
  subjectCategories: string[];
  documentType: string;
  pdfAvailable: boolean;
  landingPageUrl: string;
}

export interface NasaDataPortalRecord {
  datasetId: string;
  title: string;
  description: string;
  landingPage: string;
  publisher: string;
  theme: string[];
  distributionFormats: string[];
  hostedArchive: string; // e.g., "OSDR", "PDS", "DAAC"
}

export interface NasaSourceVerificationResult {
  sourceName: 'NASA_OPEN_APIS' | 'NASA_OSDR' | 'NASA_NTRS' | 'NASA_DATA_PORTAL';
  isReachable: boolean;
  isMocked: boolean;
  rateLimitCompliant: boolean;
  schemaCompliant: boolean;
  latencyMs: number;
  errors: string[];
  warnings: string[];
}
