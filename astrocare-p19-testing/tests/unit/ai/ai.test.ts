import { describe, it, expect } from 'vitest';
import { MockGeminiProvider } from '../../../src/validation/ai/MockGeminiProvider';
import { AIResponseValidator } from '../../../src/validation/ai/AIResponseValidator';
import { HealthContextInput, AIResponsePayload } from '../../../src/types/ai';

describe('AI Intelligence & Gemini Response Validation', () => {
  const provider = new MockGeminiProvider();

  const nominalContext: HealthContextInput = {
    astronautId: 'ASTRO-CDR-01',
    missionPhase: 'SURFACE_TRAVERSE',
    telemetrySummary: {
      heart_rate: { value: 72, unit: 'bpm', status: 'NOMINAL' },
      oxygen_saturation: { value: 98, unit: '%', status: 'NOMINAL' },
    },
    activeDeterministicAlerts: [],
  };

  it('generates nominal grounded reasoning with valid citations', async () => {
    const response = await provider.generateClinicalReasoning(nominalContext, 'MOCK_KEY');
    expect(response.sourceModel).toBe('GEMINI_PRO');
    expect(response.citations.length).toBeGreaterThan(0);

    const validation = AIResponseValidator.validateResponse(nominalContext, response);
    expect(validation.isFullyGrounded).toBe(true);
    expect(validation.score).toBeGreaterThanOrEqual(95);
  });

  it('triggers deterministic fallback on missing credentials and labels it correctly', async () => {
    provider.setConfig({ simulateFailureMode: 'MISSING_API_KEY', deterministicFallbackEnabled: true });
    const response = await provider.generateClinicalReasoning(nominalContext);

    expect(response.sourceModel).toBe('DETERMINISTIC_FALLBACK');
    expect(response.provenance.deterministicFallbackInvoked).toBe(true);

    const validation = AIResponseValidator.validateResponse(nominalContext, response);
    expect(validation.provenanceValid).toBe(true);
    provider.setConfig({ simulateFailureMode: 'NONE' });
  });

  it('triggers deterministic fallback on rate limit (429) simulation', async () => {
    provider.setConfig({ simulateFailureMode: 'RATE_LIMIT', deterministicFallbackEnabled: true });
    const response = await provider.generateClinicalReasoning(nominalContext);

    expect(response.sourceModel).toBe('DETERMINISTIC_FALLBACK');
    expect(response.provenance.fallbackReason).toContain('quota exceeded');
    provider.setConfig({ simulateFailureMode: 'NONE' });
  });

  it('detects hallucinated numerical measurements not present in input context', () => {
    const hallucinatedResponse: AIResponsePayload = {
      sourceModel: 'GEMINI_PRO',
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: 'Patient presents with severe tachycardia at 195 bpm.',
      highlightedObservations: ['Observed 195 bpm'],
      suggestedOperationalActions: ['Re-evaluate telemetry'],
      citations: [],
      riskSeverityAssessment: 'ELEVATED',
      provenance: {
        inputContextHash: 'CTX-01',
        deterministicFallbackInvoked: false,
      },
      safetyDisclaimers: [],
    };

    const validation = AIResponseValidator.validateResponse(nominalContext, hallucinatedResponse);
    expect(validation.isFullyGrounded).toBe(false);
    expect(validation.hallucinatedValues.length).toBeGreaterThan(0);
    expect(validation.hallucinatedValues[0].inventedValue).toBe('195 bpm');
  });

  it('prohibits and flags autonomous medical diagnostic language', () => {
    const diagnosticResponse: AIResponsePayload = {
      sourceModel: 'GEMINI_PRO',
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: 'I diagnose the astronaut with acute decompression sickness. Prescribe 100 mg aspirin.',
      highlightedObservations: [],
      suggestedOperationalActions: [],
      citations: [],
      riskSeverityAssessment: 'CRITICAL',
      provenance: {
        inputContextHash: 'CTX-01',
        deterministicFallbackInvoked: false,
      },
      safetyDisclaimers: [],
    };

    const validation = AIResponseValidator.validateResponse(nominalContext, diagnosticResponse);
    expect(validation.isFullyGrounded).toBe(false);
    expect(validation.prohibitedDiagnosticLanguageDetected.length).toBeGreaterThan(0);
  });

  it('prohibits silent alert downgrading when active alerts are present', () => {
    const alertContext: HealthContextInput = {
      ...nominalContext,
      activeDeterministicAlerts: ['ALERT_CARDIAC_ARRHYTHMIA'],
    };

    const downgradedResponse: AIResponsePayload = {
      sourceModel: 'GEMINI_PRO',
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: 'Telemetry is completely nominal with no anomalies detected.',
      highlightedObservations: [],
      suggestedOperationalActions: [],
      citations: [],
      riskSeverityAssessment: 'LOW', // Downgraded despite active alert!
      provenance: {
        inputContextHash: 'CTX-01',
        deterministicFallbackInvoked: false,
      },
      safetyDisclaimers: [],
    };

    const validation = AIResponseValidator.validateResponse(alertContext, downgradedResponse);
    expect(validation.isFullyGrounded).toBe(false);
    expect(validation.downgradedAlerts.length).toBeGreaterThan(0);
  });
});
