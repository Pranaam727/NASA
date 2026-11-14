/**
 * AstroCare AI Response Validation & Grounding Types
 * Enforces safety boundaries, evidence provenance, deterministic fallbacks,
 * and strict prohibition against diagnostic or prescription claims.
 */

export interface HealthContextInput {
  astronautId: string;
  missionPhase: string;
  telemetrySummary: Record<string, { value: number; unit: string; status: string }>;
  activeDeterministicAlerts: string[];
  recentLabBiomarkers?: Record<string, { value: number; unit: string }>;
  medicalHistoryFlags?: string[];
}

export interface GroundedCitation {
  sourceType: 'NASA_OSDR' | 'NASA_NTRS' | 'FLIGHT_RULE' | 'CLINICAL_GUIDELINE';
  identifier: string; // e.g. "OSD-379", "NTRS-20230001234"
  title: string;
  relevantExcerpt: string;
  confidenceScore: number;
}

export interface AIResponsePayload {
  sourceModel: 'GEMINI_PRO' | 'GEMINI_FLASH' | 'DETERMINISTIC_FALLBACK';
  generatedAt: string;
  clinicalReasoningSummary: string;
  highlightedObservations: string[];
  suggestedOperationalActions: string[];
  citations: GroundedCitation[];
  riskSeverityAssessment: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  provenance: {
    inputContextHash: string;
    deterministicFallbackInvoked: boolean;
    fallbackReason?: string;
  };
  safetyDisclaimers: string[];
}

export interface AIGroundingValidationResult {
  isFullyGrounded: boolean;
  unsupportedClaims: string[];
  hallucinatedValues: { field: string; inventedValue: unknown }[];
  missingMeasurementsIdentified: boolean;
  downgradedAlerts: string[]; // Alerts present in input but dropped/downgraded by AI
  prohibitedDiagnosticLanguageDetected: string[];
  provenanceValid: boolean;
  score: number; // 0 to 100
}
