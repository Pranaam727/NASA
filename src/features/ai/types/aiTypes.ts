import { RiskLevel, VitalParameter } from '@/features/analytics/types/analyticsTypes';

export type { VitalParameter };

export type AIProviderStatus = 'ONLINE' | 'FALLBACK_MODE' | 'OFFLINE' | 'RATE_LIMITED' | 'ERROR';
export type AIProviderMode = 'GEMINI_LIVE' | 'DETERMINISTIC_FALLBACK';
export type TimeRangeOption = '1H' | '6H' | '24H' | '7D';

export interface GroundedMetricRecord {
  parameter: VitalParameter;
  label: string;
  unit: string;
  currentValue: number;
  baselineValue: number;
  absoluteDelta: number;
  percentageDelta: number;
  zScore: number;
  riskLevel: RiskLevel;
  quality: string;
}

export interface GroundedAIContext {
  astronautId: string;
  astronautName: string;
  callsign: string;
  missionId: string;
  timeRange: TimeRangeOption;
  timestamp: string;
  compositeScore: number;
  overallRiskLevel: RiskLevel;
  primaryRiskFactor?: VitalParameter;
  synergyMultipliersApplied: string[];
  metrics: Record<VitalParameter, GroundedMetricRecord>;
  activeAlerts: Array<{
    id: string;
    ruleCode: string;
    severity: string;
    title: string;
    description: string;
    triggeringValue: string;
    baselineExpected?: string;
    timestamp: string;
  }>;
  radiationFluxUsVh: number;
  solarParticleEventActive: boolean;
  missingDataIndicators: string[];
  isSimulatedSource: boolean;
}

export interface MetricCitation {
  parameter: string;
  observedValue: string;
  baselineValue: string;
  timestamp: string;
}

export interface AIAnomalyExplanation {
  alertId: string;
  ruleCode: string;
  metricName: string;
  observedValue: string;
  baselineValue: string;
  deviation: string;
  p06Severity: string;
  timestamp: string;
  physiologicalMechanism: string;
  clinicalSignificance: string;
  supportingEvidence: MetricCitation[];
  suggestedFollowUp: string;
  provenance: AIProviderMode;
}

export interface ParameterTrendObservation {
  parameter: VitalParameter;
  label: string;
  unit: string;
  direction: 'RISING' | 'FALLING' | 'STABLE' | 'FLUCTUATING';
  baselineDeviationSummary: string;
  significance: 'CRITICAL' | 'ELEVATED' | 'MILD' | 'NOMINAL';
  observation: string;
}

export interface AITrendInterpretation {
  astronautId: string;
  timeRange: TimeRangeOption;
  overallTrendSummary: string;
  parameterObservations: ParameterTrendObservation[];
  physiologicalAdaptationNotes: string;
  provenance: AIProviderMode;
  generatedAt: string;
}

export interface AIHealthSummary {
  astronautId: string;
  astronautName: string;
  timeRange: TimeRangeOption;
  executiveSummary: string;
  baselineDeviationOverview: string;
  keyAnomalies: string[];
  interParameterRelationships: string[];
  missingDataWarnings: string[];
  humanReviewRequired: boolean;
  humanReviewItems: string[];
  informationalRecommendations: string[];
  provenance: AIProviderMode;
  modelVersion: string;
  generatedAt: string;
  cached?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provenance: AIProviderMode;
  citations?: MetricCitation[];
  suggestedFollowUps?: string[];
}

export interface AISystemOverview {
  providerStatus: AIProviderStatus;
  geminiConnection: 'CONNECTED' | 'STANDBY' | 'CREDENTIALS_REQUIRED' | 'ERROR';
  currentMode: AIProviderMode;
  modelIdentifier: string;
  latestAnalysisTimestamp: string | null;
  analyzedRecordsCount: number;
  anomaliesReviewedCount: number;
  activeRiskObservationsCount: number;
  dataProvenance: string;
}

// ---------- New Types for Prompt 08 ----------
export interface CopilotOverview {
  astronautId: string;
  astronautName: string;
  missionId: string;
  providerMode: AIProviderMode;
  latestTimestamp: string;
  activeAnomaliesCount: number;
  highPriorityObservations: string[];
  openInvestigationsCount: number;
  pendingFollowUpsCount: number;
  mostRecentInvestigationTitle?: string;
  lastBriefingTimestamp?: string;
}

export interface HealthSituationBrief {
  astronautId: string;
  astronautName: string;
  missionId: string;
  timeRange: TimeRangeOption;
  executiveSummary: string;
  currentHealthStatus: string;
  telemetryObservations: string[];
  significantAnomalies: string[];
  baselineComparisons: string[];
  relatedIndicators: string[];
  alerts: string[];
  dataQualityWarnings: string[];
  recommendedObservations: string[];
  humanReviewNotes: string[];
  generatedAt: string;
  providerMode: AIProviderMode;
}

export type InvestigationStatus = 'OPEN' | 'UNDER_REVIEW' | 'MONITORING' | 'ESCALATED' | 'RESOLVED';

export interface ClinicalInvestigation {
  investigationId: string;
  title: string;
  astronautId: string;
  missionId: string;
  primaryMetric: VitalParameter;
  relatedAlertIds: string[];
  timeRange: TimeRangeOption;
  notes: string;
  status: InvestigationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InvestigationReport {
  reportId: string;
  investigationId: string;
  astronautId: string;
  missionId: string;
  createdAt: string;
  primaryObservation: string;
  anomalySeverity: string;
  supportingMetrics: string[];
  baselineComparisons: string[];
  aiInterpretation: string;
  possibleContributingFactors: string[];
  missingInformation: string[];
  recommendedMonitoringActions: string[];
  humanReviewNotes: string[];
  providerMode: AIProviderMode;
}

export type FollowUpPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type FollowUpStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';

export interface FollowUpChecklistItem {
  itemId: string;
  investigationId: string;
  description: string;
  priority: FollowUpPriority;
  createdAt: string;
  dueDate?: string;
  status: FollowUpStatus;
  notes?: string;
}

export interface MultiMetricAnalysisResult {
  metrics: VitalParameter[];
  timeRange: TimeRangeOption;
  correlationMethod: string; // e.g., 'Pearson', 'Spearman'
  correlationCoefficient?: number;
  sampleCount: number;
  interpretation: string;
  providerMode: AIProviderMode;
}
