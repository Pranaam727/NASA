import { QualityStatus, DataSourceType } from '@/types/telemetry';
import { AlertSeverity } from '@/types/database.types';

/**
 * Supported space radiation measurement units
 */
export type AbsorbedDoseUnit = 'uGy' | 'mGy' | 'Gy';
export type EquivalentDoseUnit = 'uSv' | 'mSv' | 'Sv';
export type DoseRateUnit = 'uGy/h' | 'mGy/h' | 'Gy/h' | 'uSv/h' | 'mSv/h' | 'Sv/h';
export type ParticleFluxUnit = 'cm^-2 s^-1' | 'cm^-2 sr^-1 s^-1';

export type RadiationDataCategory = 'TELEMETRY' | 'SIMULATION' | 'HISTORICAL_ARCHIVE' | 'RESEARCH_STUDY';

/**
 * Normalized telemetry reading from NASA RadLab or local sensor adapter
 */
export interface RadiationMeasurement {
  id: string;
  timestamp: string; // ISO 8601 UTC
  spacecraft: string; // e.g. 'ISS', 'Orion', 'Gateway'
  instrument: string; // e.g. 'DosTel', 'TEPC', 'Liulin-5', 'REM'
  instrumentId: string;
  module?: string; // e.g. 'US Lab', 'Columbus', 'Cupola'
  absorbedDoseRate: number | null; // in uGy/hour
  doseEquivalentRate: number | null; // in uSv/hour
  particleFlux: number | null; // in cm^-2 sr^-1 s^-1
  altitude: number | null; // in km
  latitude: number | null; // degrees
  longitude: number | null; // degrees
  source: 'NASA_RADLAB' | 'SIMULATOR' | 'NASA_OSDR' | 'LOCAL_CACHE';
  sourceRecordId: string;
  dataCategory: RadiationDataCategory;
  qualityStatus: QualityStatus;
}

/**
 * Personal astronaut exposure tracking record
 */
export interface RadiationExposureRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  doseValue: number;
  doseUnit: EquivalentDoseUnit;
  exposureCategory: 'GALACTIC_COSMIC_RAY' | 'SOLAR_PARTICLE_EVENT' | 'TRAPPED_BELT' | 'NOMINAL_BACKGROUND';
  dataOrigin: DataSourceType;
  isSimulated: boolean;
  sourceReference: string;
}

/**
 * NASA Open Science Data Repository (OSDR) space-biology & space-health study
 */
export interface RadiationResearchStudy {
  id: string;
  accessionNumber: string; // e.g. 'OSD-379'
  title: string;
  description: string;
  organism: string; // e.g. 'Mus musculus', 'Homo sapiens'
  mission: string; // e.g. 'ISS Expedition', 'Rodent Research-1'
  studyType: string; // e.g. 'Transcriptomics', 'Radiation Cytogenetics'
  sourceUrl: string;
  publicationDate: string;
  researchCategory:
    | 'DNA_DAMAGE'
    | 'OXIDATIVE_STRESS'
    | 'CARDIOVASCULAR_RISK'
    | 'CNS_EFFECTS'
    | 'COUNTERMEASURES'
    | 'IMMUNE_DYSFUNCTION';
  metadata: {
    samplesCount?: number;
    spacecraft?: string;
    radiationSource?: string;
    doi?: string;
    principalInvestigator?: string;
  };
}

/**
 * NASA Human Research Program evidence reference
 */
export interface HrpEvidenceReference {
  id: string;
  title: string;
  riskCategory: string;
  summary: string;
  keyFindings: string[];
  url: string;
  lastUpdated: string;
  relevance: 'HIGH' | 'MEDIUM' | 'REFERENCE';
}

/**
 * Alert record specifically for radiation threshold exceedances
 */
export interface RadiationAlert {
  id: string;
  severity: AlertSeverity;
  metric: string;
  currentValue: number;
  threshold: number;
  unit: string;
  timestamp: string;
  message: string;
  acknowledgementStatus: 'UNACKNOWLEDGED' | 'ACKNOWLEDGED' | 'RESOLVED';
  dataOrigin: 'SIMULATION' | 'HISTORICAL_TELEMETRY';
}

/**
 * Radiation threshold configuration
 * Separates demonstration thresholds from official NASA standards
 */
export interface RadiationThresholdConfig {
  ambientNormalMaxUsVh: number; // <= 0.1 uSv/h nominal
  warningFluxUsVh: number; // >= 0.5 uSv/h elevated
  criticalFluxUsVh: number; // >= 2.0 uSv/h solar event / surge
  speActiveFluxThresholdUsVh: number; // >= 50.0 uSv/h major SPE
  careerLimitMsv: number; // 500 mSv reference career limit
  missionLimitMsv: number; // 250 mSv 30-day / exploration mission limit
}

export const DEMO_RADIATION_THRESHOLDS: RadiationThresholdConfig = {
  ambientNormalMaxUsVh: 0.1,
  warningFluxUsVh: 0.5,
  criticalFluxUsVh: 2.0,
  speActiveFluxThresholdUsVh: 50.0,
  careerLimitMsv: 500.0,
  missionLimitMsv: 250.0,
};

/**
 * Time window filter options for historical exposure analytics
 */
export type RadiationTimeRange = '24_HOURS' | '7_DAYS' | '30_DAYS' | 'MISSION_DURATION';

export interface RadiationTrendAnalytics {
  timeRange: RadiationTimeRange;
  sampleCount: number;
  durationHours: number;
  averageDoseRateUsVh: number;
  peakDoseRateUsVh: number;
  minDoseRateUsVh: number;
  cumulativeDoseMsv: number;
  percentageChangeRate: number;
  dataCoveragePct: number;
  isSpeDetected: boolean;
}
