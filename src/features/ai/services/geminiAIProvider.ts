import {
  GroundedAIContext,
  AIHealthSummary,
  AIAnomalyExplanation,
  AITrendInterpretation,
  ChatMessage,
  CopilotOverview,
  HealthSituationBrief,
  ClinicalInvestigation,
  InvestigationReport,
  FollowUpChecklistItem,
  MultiMetricAnalysisResult,
  TimeRangeOption,
  VitalParameter,
} from '../types/aiTypes';
import { DeterministicAIProvider } from './deterministicAIProvider';

export interface GeminiProviderConfig {
  modelId: string;
  proxyEndpoint?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class GeminiAIProvider {
  private config: GeminiProviderConfig;
  private fallbackProvider: DeterministicAIProvider;

  constructor(
    config: Partial<GeminiProviderConfig> = {},
    fallbackProvider?: DeterministicAIProvider
  ) {
    this.config = {
      modelId: config.modelId || 'gemini-1.5-flash',
      proxyEndpoint: config.proxyEndpoint || '/api/gemini-intelligence',
      timeoutMs: config.timeoutMs || 10000,
      maxRetries: config.maxRetries || 2,
    };
    this.fallbackProvider = fallbackProvider || new DeterministicAIProvider();
  }

  public getModelIdentifier(): string {
    return this.config.modelId;
  }

  public setModelIdentifier(modelId: string): void {
    this.config.modelId = modelId;
  }

  /**
   * Dispatches a request to the secure Edge Function / Server Proxy.
   * If credentials are unavailable or the proxy returns an error,
   * falls back safely to the deterministic provider.
   */
  private async callProxy<T>(
    action: 'summary' | 'anomaly' | 'trends' | 'chat' | 'copilotOverview' | 'situationBrief' | 'analyzeInvestigation' | 'multiMetric' | 'enrichReport' | 'suggestFollowUps',
    payload: {
      context: GroundedAIContext;
      alertId?: string;
      query?: string;
      timeRange?: TimeRangeOption;
      investigation?: ClinicalInvestigation;
      report?: InvestigationReport;
      metrics?: VitalParameter[];
      investigationId?: string;
    }
  ): Promise<{ data: T; isFallback: boolean; error?: string }> {
    const endpoint = this.config.proxyEndpoint;

    // If running in purely client-side environment without a live backend proxy,
    // trigger fallback cleanly
    if (!endpoint || endpoint.startsWith('/api') && typeof window !== 'undefined' && !window.location.host.includes('localhost:3000')) {
      // In standalone client demo mode, return deterministic fallback
      return {
        data: this.executeFallback<T>(action, payload),
        isFallback: true,
      };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.modelId,
          action,
          payload,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        if (res.status === 429) {
          console.warn('[GeminiAIProvider] Gemini Rate Limit reached (429). Failing over to Deterministic Fallback.');
          return {
            data: this.executeFallback<T>(action, payload),
            isFallback: true,
            error: 'RATE_LIMIT_EXCEEDED',
          };
        }
        if (res.status === 401 || res.status === 403) {
          console.warn('[GeminiAIProvider] Gemini Credentials unconfigured or invalid. Failing over to Deterministic Fallback.');
          return {
            data: this.executeFallback<T>(action, payload),
            isFallback: true,
            error: 'UNAUTHORIZED_OR_MISSING_KEY',
          };
        }
        return {
          data: this.executeFallback<T>(action, payload),
          isFallback: true,
          error: `HTTP_${res.status}`,
        };
      }

      const json = await res.json();
      if (!json || !json.data) {
        throw new Error('Malformed response received from Gemini proxy');
      }

      return {
        data: json.data as T,
        isFallback: false,
      };
    } catch (err: any) {
      console.warn('[GeminiAIProvider] Proxy call failed or timed out:', err?.message || err);
      return {
        data: this.executeFallback<T>(action, payload),
        isFallback: true,
        error: err?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
      };
    }
  }

  private executeFallback<T>(
    action: 'summary' | 'anomaly' | 'trends' | 'chat' | 'copilotOverview' | 'situationBrief' | 'analyzeInvestigation' | 'multiMetric' | 'enrichReport' | 'suggestFollowUps',
    payload: {
      context: GroundedAIContext;
      alertId?: string;
      query?: string;
      timeRange?: TimeRangeOption;
      investigation?: ClinicalInvestigation;
      report?: InvestigationReport;
      metrics?: VitalParameter[];
      investigationId?: string;
    }
  ): T {
    switch (action) {
      case 'summary':
        return this.fallbackProvider.generateHealthSummary(payload.context) as unknown as T;
      case 'anomaly':
        return this.fallbackProvider.explainAnomaly(payload.alertId || '', payload.context) as unknown as T;
      case 'trends':
        return this.fallbackProvider.interpretTrends(payload.context) as unknown as T;
      case 'chat':
        return this.fallbackProvider.answerQuestion(payload.query || '', payload.context) as unknown as T;
      case 'copilotOverview':
        return this.fallbackProvider.generateCopilotOverview(payload.context) as unknown as T;
      case 'situationBrief':
        return this.fallbackProvider.generateHealthSituationBrief(payload.context, payload.timeRange || '24H') as unknown as T;
      case 'analyzeInvestigation':
        return this.fallbackProvider.analyzeInvestigation(payload.investigation!, payload.context) as unknown as T;
      case 'multiMetric':
        return this.fallbackProvider.analyzeMultipleMetrics(payload.metrics || ['HEART_RATE', 'SPO2'], payload.timeRange || '24H', payload.context) as unknown as T;
      case 'enrichReport':
        return this.fallbackProvider.enrichInvestigationReport(payload.report!, payload.context) as unknown as T;
      case 'suggestFollowUps':
        return this.fallbackProvider.suggestFollowUps(payload.investigationId || '', payload.context) as unknown as T;
    }
  }

  public async generateHealthSummary(context: GroundedAIContext): Promise<{ summary: AIHealthSummary; isFallback: boolean }> {
    const res = await this.callProxy<AIHealthSummary>('summary', { context });
    return { summary: res.data, isFallback: res.isFallback };
  }

  public async explainAnomaly(alertId: string, context: GroundedAIContext): Promise<{ explanation: AIAnomalyExplanation; isFallback: boolean }> {
    const res = await this.callProxy<AIAnomalyExplanation>('anomaly', { context, alertId });
    return { explanation: res.data, isFallback: res.isFallback };
  }

  public async interpretTrends(context: GroundedAIContext): Promise<{ trends: AITrendInterpretation; isFallback: boolean }> {
    const res = await this.callProxy<AITrendInterpretation>('trends', { context });
    return { trends: res.data, isFallback: res.isFallback };
  }

  public async answerQuestion(query: string, context: GroundedAIContext): Promise<{ message: ChatMessage; isFallback: boolean }> {
    const res = await this.callProxy<ChatMessage>('chat', { context, query });
    return { message: res.data, isFallback: res.isFallback };
  }

  public async generateCopilotOverview(context: GroundedAIContext): Promise<{ overview: CopilotOverview; isFallback: boolean }> {
    const res = await this.callProxy<CopilotOverview>('copilotOverview', { context });
    return { overview: res.data, isFallback: res.isFallback };
  }

  public async generateHealthSituationBrief(context: GroundedAIContext, timeRange: TimeRangeOption): Promise<{ brief: HealthSituationBrief; isFallback: boolean }> {
    const res = await this.callProxy<HealthSituationBrief>('situationBrief', { context, timeRange });
    return { brief: res.data, isFallback: res.isFallback };
  }

  public async analyzeInvestigation(investigation: ClinicalInvestigation, context: GroundedAIContext): Promise<{ report: InvestigationReport; isFallback: boolean }> {
    const res = await this.callProxy<InvestigationReport>('analyzeInvestigation', { context, investigation });
    return { report: res.data, isFallback: res.isFallback };
  }

  public async analyzeMultipleMetrics(metrics: VitalParameter[], timeRange: TimeRangeOption, context: GroundedAIContext): Promise<{ result: MultiMetricAnalysisResult; isFallback: boolean }> {
    const res = await this.callProxy<MultiMetricAnalysisResult>('multiMetric', { context, metrics, timeRange });
    return { result: res.data, isFallback: res.isFallback };
  }

  public async enrichInvestigationReport(report: InvestigationReport, context: GroundedAIContext): Promise<{ report: InvestigationReport; isFallback: boolean }> {
    const res = await this.callProxy<InvestigationReport>('enrichReport', { context, report });
    return { report: res.data, isFallback: res.isFallback };
  }

  public async suggestFollowUps(investigationId: string, context: GroundedAIContext): Promise<{ items: FollowUpChecklistItem[]; isFallback: boolean }> {
    const res = await this.callProxy<FollowUpChecklistItem[]>('suggestFollowUps', { context, investigationId });
    return { items: res.data, isFallback: res.isFallback };
  }
}
