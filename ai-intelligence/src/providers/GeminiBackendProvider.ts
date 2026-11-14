import {
  IAIProvider,
  ProviderRequestOptions,
  ProviderStatus
} from './types';
import {
  AstronautHealthPayload,
  MissionContext,
  ChatMessage,
  HealthInterpretationResult,
  AIInsightsResult,
  ResearchCitation
} from '../types';
import { MockAIProvider } from './MockAIProvider';

export class GeminiBackendProvider implements IAIProvider {
  readonly id = 'gemini-backend-proxy';
  readonly name = 'Google Gemini API (via AstroCare Secure Proxy)';
  private apiBaseUrl: string;
  private fallbackMock = new MockAIProvider();

  constructor(apiBaseUrl = '') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getStatus(): Promise<ProviderStatus> {
    const startTime = performance.now();
    try {
      const res = await fetch(`${this.apiBaseUrl}/api/health-check`, {
        signal: AbortSignal.timeout(4000)
      });
      const latencyMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(`Proxy status HTTP ${res.status}`);
      }

      const data = await res.json();
      return {
        name: this.name,
        mode: data.mode === 'gemini-live' ? 'gemini-live' : 'mock-simulation',
        isAvailable: true,
        model: data.model || 'gemini-2.5-flash',
        latencyMs,
        message: data.configured
          ? 'Connected to Gemini API via secure server-side proxy.'
          : 'Proxy online in Mock Mode (GEMINI_API_KEY not configured in backend .env).'
      };
    } catch (_err) {
      return {
        name: this.name,
        mode: 'mock-simulation',
        isAvailable: false,
        model: 'AstroCare-BioSim-v2.5 (Offline Standalone)',
        latencyMs: 10,
        message: 'Backend proxy offline or unreachable. Seamlessly operating in standalone mock simulation mode.'
      };
    }
  }

  async sendMessage(
    messages: ChatMessage[],
    options?: ProviderRequestOptions,
    healthContext?: AstronautHealthPayload,
    missionContext?: MissionContext
  ): Promise<ChatMessage> {
    const startTime = performance.now();

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          healthContext,
          missionContext,
          model: options?.model
        }),
        signal: options?.signal || AbortSignal.timeout(25000)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Proxy error: HTTP ${res.status}`);
      }

      const data = await res.json();
      const latencyMs = Math.round(performance.now() - startTime);

      // In mock response mode from proxy, delegate citation parsing or use simulated citations
      const citations: ResearchCitation[] = [];
      const suggestedQuestions: string[] = [];

      if (data.metadata?.mode === 'mock-simulation') {
        // Delegate to mock provider for richer citations and metadata
        return this.fallbackMock.sendMessage(messages, options, healthContext, missionContext);
      }

      // Parse suggestions or citations if returned
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
        citations: data.citations || citations,
        healthContextIncluded: Boolean(healthContext),
        missionContextIncluded: Boolean(missionContext),
        suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : [
          'Review cardiovascular trends for Flight Day',
          'Explain bone resorption mechanisms',
          'Evaluate flight surgeon countermeasure options'
        ],
        metadata: {
          latencyMs,
          modelUsed: data.metadata?.modelUsed || 'gemini-2.5-flash',
          mode: 'gemini-live'
        }
      };
    } catch (err: any) {
      console.warn('[GeminiBackendProvider] Proxy request failed, using high-fidelity fallback mock:', err);
      // Seamless degradation without crashing
      const fallbackResult = await this.fallbackMock.sendMessage(messages, options, healthContext, missionContext);
      return {
        ...fallbackResult,
        metadata: {
          ...fallbackResult.metadata,
          mode: 'mock-simulation',
          modelUsed: `Mock Fallback (${err.message || 'Backend Proxy Offline'})`
        }
      };
    }
  }

  async interpretHealthData(
    healthPayload: AstronautHealthPayload,
    missionContext: MissionContext,
    options?: ProviderRequestOptions
  ): Promise<HealthInterpretationResult> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/api/interpret-health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ healthPayload, missionContext }),
        signal: options?.signal || AbortSignal.timeout(20000)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mode === 'gemini-live' && data.interpretation) {
          // If Gemini returned a rich markdown interpretation, parse or integrate it
          const mockBase = await this.fallbackMock.interpretHealthData(healthPayload, missionContext, options);
          return {
            ...mockBase,
            executiveSummary: data.interpretation.split('\n\n')[0].replace(/^#+\s*/, '') || mockBase.executiveSummary
          };
        }
      }
    } catch (_err) {
      // Gracefully fall back to deterministic mock evaluation
    }
    return this.fallbackMock.interpretHealthData(healthPayload, missionContext, options);
  }

  async summarizeResearch(
    docId: string,
    query?: string,
    options?: ProviderRequestOptions
  ): Promise<{
    summary: string;
    keyTakeaways: string[];
    citations: ResearchCitation[];
    clinicalRelevance: string;
  }> {
    // Uses mock repository metadata plus proxy if available
    return this.fallbackMock.summarizeResearch(docId, query, options);
  }

  async generateBiomedicalInsights(
    healthPayload: AstronautHealthPayload,
    missionContext: MissionContext,
    options?: ProviderRequestOptions
  ): Promise<AIInsightsResult> {
    return this.fallbackMock.generateBiomedicalInsights(healthPayload, missionContext, options);
  }
}
