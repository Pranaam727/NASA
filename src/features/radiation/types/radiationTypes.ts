export type RadiationRiskTier = 'NOMINAL' | 'ELEVATED' | 'HAZARDOUS' | 'CRITICAL';
export type SolarParticleEventClass = 'NONE' | 'S1_MINOR' | 'S2_MODERATE' | 'S3_STRONG' | 'S4_SEVERE' | 'S5_EXTREME';
export type RadiationEnvironmentType = 'LEO' | 'LUNAR_SURFACE' | 'CISLUNAR' | 'MARS_TRANSIT' | 'MARS_SURFACE';
export type ShieldingMaterialType = 'ALUMINUM' | 'POLYETHYLENE' | 'WATER' | 'REGOLITH' | 'CARBON_COMPOSITE';

export interface RadiationDoseReading {
  timestamp: string;
  ambientFluxUsVh: number; // microSieverts per hour (µSv/h)
  fluxGcrUsVh: number; // Galactic Cosmic Rays component
  fluxSpeUsVh: number; // Solar Particle Event component
  accumulatedDoseMsv: number; // milliSieverts total
  careerDoseMsv: number; // career accumulated mSv
  isSimulated: boolean;
  dataSource: string;
}

export interface RadiationEventRecord {
  id: string;
  timestamp: string;
  speClass: SolarParticleEventClass;
  peakFluxUsVh: number;
  durationMinutes: number;
  protonEnergyMev: number; // e.g. >10 MeV, >100 MeV
  active: boolean;
  stormShelterOrdered: boolean;
  summary: string;
}

export interface BiologicalRiskEvaluation {
  careerLimitMsv: number; // NASA 600 mSv lifetime career limit
  careerDosePercent: number; // % of career limit reached
  acuteRadiationSicknessRisk: 'NEGLIGIBLE' | 'MILD_PRODROMAL' | 'MODERATE' | 'SEVERE';
  excessLifetimeCancerRiskPercent: number; // REID model estimate (e.g. 2.4%)
  dnaDoubleStrandBreaksPerCell: number; // Estimated based on heavy ion GCR fluence
  tissueDegradationScore: number; // 0-100 index (lens cataract, cardiovascular, CNS)
  biologicalRiskTier: RadiationRiskTier;
  recommendedAction: string;
}

export interface ShieldingScenarioConfig {
  environment: RadiationEnvironmentType;
  material: ShieldingMaterialType;
  thicknessGcm2: number; // Areal density in g/cm²
  stormShelterActive: boolean;
}

export interface ShieldingScenarioResult {
  unshieldedFluxUsVh: number;
  attenuatedFluxUsVh: number;
  doseReductionPercentage: number;
  dailyProjectedDoseMsv: number;
  timeToThirtyDayLimitDays: number; // NASA 30-day limit: 250 mSv
  mitigationEfficacy: 'SUBOPTIMAL' | 'ACCEPTABLE' | 'EXCELLENT';
  engineeringNotes: string;
}

export interface NASAResearchReference {
  id: string;
  title: string;
  authors: string;
  year: number;
  doiOrUrl: string;
  summary: string;
  keyFinding: string;
  nasaProgram: 'NASA Human Research Program (HRP)' | 'Space Radiation Health Project' | 'Artemis Medical Operations';
}
