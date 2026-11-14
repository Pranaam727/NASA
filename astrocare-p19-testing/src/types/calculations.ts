/**
 * AstroCare Scientific Calculation Verification Types
 * Strict scientific precision contracts, units compatibility,
 * and aerospace radiation physics (Gy absorbed dose vs Sv equivalent dose).
 */

export type RadiationParticleType =
  | 'gamma_xray'
  | 'proton'
  | 'alpha'
  | 'neutron_thermal'
  | 'neutron_fast'
  | 'hze_heavy_ion';

export interface RadiationExposureRecord {
  timestamp: string;
  particleType: RadiationParticleType;
  absorbedDoseGy: number; // Grays (J/kg)
  radiationWeightingFactor: number; // w_R (ICRP 103 / NASA Space Cancer Risk model)
  location: 'ISS_INTERIOR' | 'EVA_SUIT' | 'LUNAR_GATEWAY' | 'DEEP_SPACE' | 'MARS_SURFACE';
  detectorId: string;
}

export interface RadiationSummaryResult {
  totalAbsorbedDoseGy: number;
  totalEquivalentDoseSv: number;
  dominantRadiationSource: RadiationParticleType;
  doseRateGyPerHour: number;
  doseRateSvPerHour: number;
  validIntervalSeconds: number;
  missingDataIntervalCount: number;
}

export interface StatisticalSummary {
  mean: number;
  median: number;
  standardDeviation: number;
  zScores: number[];
  absoluteDifferences: number[];
  percentageDeviations: (number | null)[]; // null when baseline is 0
  movingAverages: number[];
}

export interface AnomalyScoreResult {
  score: number; // 0.0 to 1.0 normalized
  isAnomaly: boolean;
  zScoreContribution: number;
  rateOfChangeContribution: number;
  domainWeight: number;
  confidence: number;
}
