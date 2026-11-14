/**
 * ASTROCARE AI HEALTH INTELLIGENCE TYPE DEFINITIONS
 * Standardized data contracts for Gemini grounding, conversational copilot,
 * predictive insights, risk explanations, and mission health reporting.
 */

import { ReportType } from '@/types/database.types';

export type AIProvenanceTag =
  | 'GROUNDED_MEASUREMENT'
  | 'CALCULATED_RISK'
  | 'RULE_ALERT'
  | 'AI_INTERPRETATION'
  | 'PREDICTIVE_PROJECTION';

export interface AICitation {
  source: string;
  metric: string;
  value: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provenanceTags?: AIProvenanceTag[];
  citations?: AICitation[];
  isEmergencyAlert?: boolean;
  confidenceScore?: number; // 0.0 to 1.0
  suggestedFollowUps?: string[];
}

export interface PredictiveInsight {
  id: string;
  parameter: string;
  timeframe: string;
  trendDirection: 'WORSENING' | 'STABILIZING' | 'IMPROVING' | 'VOLATILE';
  probability: number; // 0 to 100%
  projectedValue: string;
  headline: string;
  rationale: string;
  recommendedPreemptiveAction: string;
  isPrediction: true; // Invariant distinguishing prediction from confirmed measurement
}

export interface GroundedContextDocument {
  astronautId: string;
  callsign: string;
  fullName: string;
  missionCode: string;
  timestamp: string;
  baselineSummary: string;
  currentTelemetry: Record<string, { value: number; unit: string; delta: number; zScore: number; status: string }>;
  deterministicRisk: {
    compositeScore: number;
    riskLevel: string;
    subsystems: Record<string, { score: number; level: string; primary: string }>;
    activeSynergies: string[];
    directive: string;
  };
  activeAlerts: Array<{ code: string; title: string; severity: string; triggeringValue: string }>;
  provenanceDeclaration: string;
}

export interface MissionHealthReportDraft {
  reportType: ReportType;
  title: string;
  astronautId: string;
  executiveSummary: string;
  vitalSignsAssessment: string;
  subsystemRiskBreakdown: string;
  activeAlertsTriage: string;
  predictiveProjections: string;
  flightSurgeonDirectives: string;
  citations: AICitation[];
  markdownContent: string;
}

export interface GeminiProxyRequest {
  prompt: string;
  systemInstruction?: string;
  contextDocument?: GroundedContextDocument;
  temperature?: number;
}

export interface GeminiProxyResponse {
  text: string;
  modelVersion: string;
  citations?: AICitation[];
  isFallback: boolean;
  error?: string;
}
