/**
 * AstroCare Gemini AI Intelligence Module (ai-intelligence)
 * Type definitions for biomedical telemetry, research papers, mission context, and AI providers.
 */

export type HealthDomain = 
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'radiation'
  | 'sleep'
  | 'immune';

export type AnomalySeverity = 'normal' | 'nominal-shift' | 'warning' | 'critical';

export type DataOrigin = 'synthetic-telemetry' | 'nasa-hrp-ground-truth' | 'in-flight-realtime';

export interface MetricItem {
  id: string;
  name: string;
  domain: HealthDomain;
  value: number;
  unit: string;
  baseline: number;
  nominalRange: [number, number];
  status: AnomalySeverity;
  trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  description: string;
  lastUpdated: string;
  missing?: boolean;
}

export interface DomainHealthData {
  domain: HealthDomain;
  displayName: string;
  overallStatus: AnomalySeverity;
  metrics: MetricItem[];
  keyObservation: string;
}

export interface AstronautHealthPayload {
  astronautId: string;
  astronautName: string;
  callsign: string;
  age: number;
  sex: 'female' | 'male';
  role: string;
  dataOrigin: DataOrigin;
  timestamp: string;
  domains: Record<HealthDomain, DomainHealthData>;
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

export interface MissionContext {
  missionId: string;
  missionName: string;
  targetDestination: 'ISS Low Earth Orbit' | 'Lunar Gateway' | 'Artemis Base Camp' | 'Mars Transit';
  currentPhase: MissionPhase;
  flightDay: number;
  totalPlannedDays: number;
  evaCount: number;
  lastEvaFlightDay?: number;
  environmental: {
    cabinCo2Ppm: number;
    cabinPressureKpa: number;
    gcrDosimetryRateMicroSvPerDay: number;
    ambientTemperatureC: number;
    dailyExerciseCompletedHours: number;
    exerciseCompliancePercentage: number;
  };
}

export interface NASAResearchDoc {
  id: string;
  title: string;
  ntrsId: string; // NASA Technical Report Server identifier
  doi?: string;
  year: number;
  authors: string[];
  publication: string;
  domains: HealthDomain[];
  abstract: string;
  keyFindings: string[];
  clinicalTakeaways: string[];
  url?: string;
  verifiedGroundTruth: boolean;
}

export interface ResearchCitation {
  docId: string;
  title: string;
  ntrsId: string;
  authors: string;
  year: number;
  excerpt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: ResearchCitation[];
  healthContextIncluded?: boolean;
  missionContextIncluded?: boolean;
  observations?: string[];
  hypotheses?: string[];
  suggestedQuestions?: string[];
  error?: boolean;
  metadata?: {
    latencyMs?: number;
    modelUsed?: string;
    mode?: 'gemini-live' | 'mock-simulation';
  };
}

export interface HealthInterpretationResult {
  executiveSummary: string;
  domainEvaluations: {
    domain: HealthDomain;
    status: AnomalySeverity;
    observations: string[]; // Strict factual data
    hypotheses: string[]; // Clinical / physiological hypotheses
  }[];
  unusualChanges: string[];
  potentialRiskPatterns: {
    domain: HealthDomain;
    riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
    description: string;
    physiologicalMechanism: string;
  }[];
  recommendedQuestionsForSurgeon: string[];
  citations: ResearchCitation[];
  disclaimer: string;
}

export interface AIInsightsResult {
  flightDay: number;
  statusOverview: string;
  crossDomainCorrelations: {
    domains: HealthDomain[];
    relationship: string;
    clinicalSignificance: string;
  }[];
  riskMatrix: {
    riskArea: string;
    severity: 'low' | 'moderate' | 'elevated' | 'high';
    rationale: string;
    recommendedMitigation: string;
  }[];
  suggestedQuestionsForFlightSurgeons: string[];
  missingDataNotes: string[];
  generatedAt: string;
}

export interface AIProviderConfig {
  providerType: 'gemini-proxy' | 'mock' | 'custom';
  apiBaseUrl?: string;
  modelName?: string;
  apiKey?: string; // Optional client-side only if user explicitly forces direct, otherwise proxied
  enableTelemetryLogging?: boolean;
}
