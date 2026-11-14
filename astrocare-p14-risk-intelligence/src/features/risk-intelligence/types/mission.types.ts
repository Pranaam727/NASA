export type MissionType = 
  | 'LEO'            // Low Earth Orbit (e.g., ISS Expedition)
  | 'LUNAR_ORBIT'    // Lunar Orbital Platform-Gateway
  | 'LUNAR_SURFACE'  // Artemis South Pole Surface Base
  | 'MARS_CONJUNCTION' // Mars 1000-day Conjunction Class (Opposition/Transit + ~500d surface)
  | 'MARS_OPPOSITION'  // Mars Short-Stay High Energy Trajectory
  | 'DEEP_SPACE_NEO' // Deep Space Near-Earth Asteroid Rendezvous
  | 'HYPOTHETICAL_CUSTOM'; // User-defined Research Profile

export type MissionPhase = 
  | 'PRE_LAUNCH_QUARANTINE'
  | 'ASCENT_TRANSIT_OUTBOUND'
  | 'ORBITAL_STATION_OPS'
  | 'SURFACE_EXTRAVEHICULAR'
  | 'TRANSIT_INBOUND'
  | 'POST_FLIGHT_REHABILITATION';

export interface MissionEnvironmentSpec {
  radiationFieldType: 'LEO_GEOMAGNETIC_SHIELDED' | 'CISLUNAR_UNSHIELDED' | 'INTERPLANETARY_GCR_SPE' | 'MARS_SURFACE_ATMOSPHERE';
  gravityField: 'MICROGRAVITY' | 'LUNAR_SIXTH' | 'MARTIAN_THREE_EIGHTHS' | 'VARIABLE_CENTRIFUGE' | 'ONE_G';
  communicationLatencyMinutes: number; // 0 for LEO, 1.3s for Moon, 3 to 22 mins for Mars
  evacuationTimeDays: number; // < 1 day for ISS, 3-5 days for Lunar, 6-9 months for Mars
  habitatVolumePerCrewM3: number;
}

export interface MissionProfile {
  id: string;
  missionName: string;
  missionType: MissionType;
  destination: string;
  durationDays: number;
  crewSize: number;
  environment: MissionEnvironmentSpec;
  activePhase: MissionPhase;
  isHypothetical: boolean;
  notes?: string;
}

export type QualitativeRiskRelevance = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'MONITORED_CONTROLLED';

export interface RiskRelevanceAssessment {
  riskCategoryId: string;
  qualitativeRelevance: QualitativeRiskRelevance;
  primaryRationale: string;
  environmentalDrivers: string[];
  recommendedMitigations: string[];
  keyResearchGaps: string[];
  supportingEvidenceCodes: string[];
  criticalMissionConstraints: string[];
  assumptions: string[];
}

export interface MissionAssessmentReport {
  mission: MissionProfile;
  generatedDate: string;
  qualitativeSummary: string;
  assessments: RiskRelevanceAssessment[];
  missionOperationalConstraints: string[];
  deepSpaceUniqueChallenges: string[];
  disclaimerNotice: string;
}
