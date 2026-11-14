/**
 * AstroCare Mock Gemini Intelligence Provider
 * Fully mockable, deterministic AI provider designed to operate offline.
 * Simulates real Gemini Pro / Flash responses, rate-limiting, network dropouts,
 * malformed payloads, and safe deterministic fallbacks.
 */

import { HealthContextInput, AIResponsePayload } from '../../types/ai';

export interface MockGeminiConfig {
  simulateFailureMode?: 'NONE' | 'MISSING_API_KEY' | 'NETWORK_TIMEOUT' | 'RATE_LIMIT' | 'MALFORMED_JSON' | 'EMPTY_RESPONSE';
  deterministicFallbackEnabled?: boolean;
  latencyMs?: number;
}

export class MockGeminiProvider {
  private config: MockGeminiConfig;

  constructor(config?: MockGeminiConfig) {
    this.config = {
      simulateFailureMode: 'NONE',
      deterministicFallbackEnabled: true,
      latencyMs: 10,
      ...config,
    };
  }

  public setConfig(config: Partial<MockGeminiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Primary inference endpoint (simulates Gemini chat/reasoning generation)
   */
  public async generateClinicalReasoning(
    context: HealthContextInput,
    apiKey?: string
  ): Promise<AIResponsePayload> {
    // 1. Simulate API credential check
    if (!apiKey && this.config.simulateFailureMode === 'MISSING_API_KEY') {
      if (this.config.deterministicFallbackEnabled) {
        return this.generateDeterministicFallback(context, 'Gemini API key missing or invalid');
      }
      throw new Error('GEMINI_AUTH_ERROR: Missing or invalid Gemini API key.');
    }

    // 2. Simulate Latency
    if (this.config.latencyMs && this.config.latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.config.latencyMs));
    }

    // 3. Simulate Failure Modes
    if (this.config.simulateFailureMode === 'NETWORK_TIMEOUT') {
      if (this.config.deterministicFallbackEnabled) {
        return this.generateDeterministicFallback(context, 'Network timeout connecting to Google Gemini API');
      }
      throw new Error('GEMINI_NETWORK_TIMEOUT: Request timed out after 30000ms.');
    }

    if (this.config.simulateFailureMode === 'RATE_LIMIT') {
      if (this.config.deterministicFallbackEnabled) {
        return this.generateDeterministicFallback(context, 'Gemini quota exceeded / rate limit 429');
      }
      throw new Error('GEMINI_RATE_LIMIT: 429 Resource has been exhausted (quota limit reached).');
    }

    if (this.config.simulateFailureMode === 'EMPTY_RESPONSE') {
      if (this.config.deterministicFallbackEnabled) {
        return this.generateDeterministicFallback(context, 'AI returned empty candidate response');
      }
      throw new Error('GEMINI_EMPTY_RESPONSE: Zero candidate tokens generated.');
    }

    if (this.config.simulateFailureMode === 'MALFORMED_JSON') {
      throw new Error('GEMINI_PARSE_ERROR: Unexpected token < in JSON at position 0.');
    }

    // 4. Nominal Grounded Gemini Response
    const telemetryEntries = Object.entries(context.telemetrySummary || {});
    const observations = telemetryEntries.map(([metric, data]) => {
      return `Observed ${metric}: ${data.value} ${data.unit} (${data.status})`;
    });

    const isElevated = context.activeDeterministicAlerts.length > 0;

    return {
      sourceModel: 'GEMINI_PRO',
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: `Analysis for astronaut ${context.astronautId} during ${context.missionPhase}. Biotelemetry indicates ${
        isElevated ? 'active operational anomalies requiring attention' : 'nominal physiological adaptation'
      }.`,
      highlightedObservations: observations,
      suggestedOperationalActions: isElevated
        ? [
            'Alert Flight Surgeon console to review elevated telemetry values.',
            'Maintain continuous biotelemetry stream and monitor subsequent samples.',
          ]
        : ['Continue standard flight schedule and scheduled exercise countermeasures.'],
      citations: [
        {
          sourceType: 'NASA_OSDR',
          identifier: 'OSD-379',
          title: 'Genomic and physiological adaptation to microgravity during spaceflight missions',
          relevantExcerpt: 'Cardiovascular and autonomic adjustments stabilize following acute fluid shift.',
          confidenceScore: 0.94,
        },
        {
          sourceType: 'FLIGHT_RULE',
          identifier: 'ISS-MED-B2-04',
          title: 'ISS Medical Operations Flight Rules: Crew Biotelemetry Monitoring',
          relevantExcerpt: 'Persistent deviation beyond flight limits mandates flight surgeon notification.',
          confidenceScore: 0.98,
        },
      ],
      riskSeverityAssessment: isElevated ? 'ELEVATED' : 'LOW',
      provenance: {
        inputContextHash: this.hashContext(context),
        deterministicFallbackInvoked: false,
      },
      safetyDisclaimers: [
        'AstroCare AI reasoning is an operational decision-support tool, not an autonomous medical diagnostic device.',
        'Final clinical interpretation rests with the crew flight surgeon.',
      ],
    };
  }

  /**
   * Deterministic Fallback Engine
   * Strictly avoids labelling fallback responses as Gemini-generated!
   */
  public generateDeterministicFallback(
    context: HealthContextInput,
    reason: string
  ): AIResponsePayload {
    const alerts = context.activeDeterministicAlerts || [];
    const observations: string[] = [];

    if (context.telemetrySummary) {
      for (const [k, v] of Object.entries(context.telemetrySummary)) {
        observations.push(`Deterministic observation ${k}: ${v.value} ${v.unit}`);
      }
    }

    return {
      sourceModel: 'DETERMINISTIC_FALLBACK', // NEVER labelled as Gemini!
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: `[DETERMINISTIC FALLBACK ACTIVATED: ${reason}] Flight-rule based heuristic summary for astronaut ${context.astronautId}.`,
      highlightedObservations: observations.length > 0 ? observations : ['No telemetry values in input context.'],
      suggestedOperationalActions:
        alerts.length > 0
          ? [
              'Execute standard flight rule protocol for active alert status.',
              'Notify flight surgeon on primary space-to-ground audio loop.',
            ]
          : ['Maintain nominal flight protocols.'],
      citations: [
        {
          sourceType: 'FLIGHT_RULE',
          identifier: 'MED-FALLBACK-HEURISTIC',
          title: 'Standard Flight Rule Heuristics Fallback Table',
          relevantExcerpt: 'When intelligence engine is offline, apply deterministic decision tree.',
          confidenceScore: 1.0,
        },
      ],
      riskSeverityAssessment: alerts.length > 0 ? 'ELEVATED' : 'LOW',
      provenance: {
        inputContextHash: this.hashContext(context),
        deterministicFallbackInvoked: true,
        fallbackReason: reason,
      },
      safetyDisclaimers: [
        'Deterministic rule-based fallback response.',
        'No generative AI model was used for this decision summary.',
      ],
    };
  }

  private hashContext(ctx: HealthContextInput): string {
    const str = `${ctx.astronautId}_${ctx.missionPhase}_${Object.keys(ctx.telemetrySummary || {}).length}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `CTX-${Math.abs(hash).toString(16)}`;
  }
}
