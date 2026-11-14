/**
 * Standalone Data Contracts for AstroCare Platform
 * Module: P20/21 - Mission-Wide UI/UX Experience
 * 
 * Defines standard typed data structures allowing the future AstroCare
 * master platform to provide actual telemetry, crew rosters, and research datasets.
 */

export type DataProvenanceType = 
  | 'live-telemetry'
  | 'simulated-data'
  | 'nasa-research-source'
  | 'derived-metric'
  | 'ai-generated-interpretation'
  | 'deterministic-fallback'
  | 'incomplete-data';

export interface DataProvenance {
  type: DataProvenanceType;
  sourceSystem: string;
  timestamp: string;
  transformationStatus?: 'raw' | 'calibrated' | 'interpolated' | 'derived';
  completenessPercentage: number;
  isSimulated: boolean;
  notes?: string;
}

export type HealthDomain = 
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'radiation'
  | 'sleep'
  | 'immune'
  | 'behavioral';

export type MetricStatus = 'nominal' | 'warning' | 'critical' | 'informational';

export interface HealthMetric {
  id: string;
  name: string;
  domain: HealthDomain;
  currentValue: number;
  unit: string;
  baselineValue: number;
  nominalRange: [number, number];
  status: MetricStatus;
  trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  trendDeltaPercent: number;
  lastUpdated: string;
  provenance: DataProvenance;
  timeSeriesHistory?: {
    timestamp: string;
    value: number;
    baseline: number;
    upperNominal?: number;
    lowerNominal?: number;
  }[];
}

export interface HealthObservation {
  id: string;
  astronautId: string;
  astronautName: string;
  timestamp: string;
  domain: HealthDomain;
  severity: MetricStatus;
  observationText: string;
  hypotheticalMechanism?: string;
  flightSurgeonNotes?: string;
  followUpActionRequired?: boolean;
  provenance: DataProvenance;
}

export type MissionPhase = 
  | 'pre-launch'
  | 'launch-ascent'
  | 'microgravity-adaptation'
  | 'long-duration-orbital'
  | 'lunar-transit'
  | 'lunar-surface'
  | 'deep-space-transit'
  | 're-entry-rehabilitation';

export interface Astronaut {
  id: string;
  name: string;
  callsign: string;
  role: string;
  agency: 'NASA' | 'ESA' | 'JAXA' | 'CSA';
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  flightDay: number;
  evaCount: number;
  avatarUrl?: string;
  dataAvailability: 'full-stream' | 'intermittent' | 'loss-of-signal' | 'simulated';
  overallHealthStatus: MetricStatus;
  primaryVitals: {
    heartRateBpm: number;
    bloodPressureSys: number;
    bloodPressureDia: number;
    spo2Percent: number;
    hrvRmssdMs: number;
    coreTempC: number;
  };
  latestObservation: string;
  activeAlertCount: number;
  monitoredDomains: HealthDomain[];
}

export interface Mission {
  id: string;
  name: string;
  identifier: string;
  targetDestination: string;
  currentPhase: MissionPhase;
  missionElapsedTime: string; // e.g. "FD 142 : 14:32:08"
  flightDay: number;
  totalPlannedDays: number;
  telemetryConnectionStatus: 'connected' | 'degraded' | 'los' | 'simulated';
  lastTelemetrySync: string;
  systemHealthScorePercent: number;
  ambientEnvironment: {
    cabinCo2Ppm: number;
    cabinPressureKpa: number;
    gcrDosimetryRateMicroSvPerDay: number;
    ambientTempC: number;
  };
}

export type EventCategory = 
  | 'telemetry-event'
  | 'health-observation'
  | 'anomaly-detection'
  | 'medical-investigation'
  | 'ai-report'
  | 'follow-up-action'
  | 'data-sync';

export interface MissionEvent {
  id: string;
  timestamp: string;
  category: EventCategory;
  title: string;
  description: string;
  astronautId?: string;
  astronautName?: string;
  severity: MetricStatus;
  provenance: DataProvenance;
  investigationId?: string;
}

export interface AlertSummary {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'nominal';
  title: string;
  description: string;
  domain: HealthDomain;
  astronautId: string;
  astronautName: string;
  investigationId?: string;
  acknowledged: boolean;
  provenance: DataProvenance;
}

export interface InvestigationSummary {
  id: string;
  title: string;
  status: 'open' | 'under-review' | 'protocol-prescribed' | 'resolved';
  priority: 'routine' | 'elevated' | 'critical';
  assignedPhysician: string;
  astronautId: string;
  astronautName: string;
  leadDomain: HealthDomain;
  createdAt: string;
  updatedAt: string;
  targetActions: string[];
}

export type SourceType = 
  | 'nasa-hrp-evidence-book'
  | 'nasa-open-science-osdr'
  | 'nasa-life-sciences-portal'
  | 'nasa-ongoing-research'
  | 'nasa-accessibility-policy'
  | 'nasa-web-design-system'
  | 'peer-reviewed-journal';

export type DataAccessClassification = 
  | 'public-open-science'
  | 'de-identified-human-research'
  | 'controlled-access-restricted'
  | 'operational-flight-guideline';

export interface ResearchSource {
  id: string;
  title: string;
  publishingOrganization: 'NASA Human Research Program' | 'NASA Biological & Physical Sciences' | 'NASA Life Sciences Portal' | 'NASA Headquarters' | 'NASA WDS';
  sourceUrl: string;
  publicationDate?: string;
  accessDate: string;
  researchCategory: 'Human Health Countermeasures' | 'Space Radiation' | 'Behavioral Health & Performance' | 'Exploration Medical Capabilities' | 'Space Life Sciences OSDR' | 'Accessibility & Design Standard';
  studyIdentifier?: string; // e.g. OSDR-542, NTRS-20210022087
  description: string;
  dataAccessClassification: DataAccessClassification;
  sourceType: SourceType;
  verifiedGroundTruth: boolean;
  supportedDomains: HealthDomain[];
}
