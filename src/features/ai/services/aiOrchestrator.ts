import { GroundedAIContext, AIHealthSummary, AIAnomalyExplanation, AITrendInterpretation, ChatMessage, AISystemOverview, AIProviderMode, AIProviderStatus, TimeRangeOption, VitalParameter } from '../types/aiTypes';
import { CopilotOverview, HealthSituationBrief, ClinicalInvestigation, InvestigationReport, FollowUpChecklistItem, MultiMetricAnalysisResult } from '../types/aiTypes';
import { DeterministicAIProvider } from './deterministicAIProvider';
import { GeminiAIProvider } from './geminiAIProvider';

export class AIOrchestrator {
  private deterministicProvider: DeterministicAIProvider;
  private geminiProvider: GeminiAIProvider;
  private currentMode: AIProviderMode = 'DETERMINISTIC_FALLBACK';
  private summaryCache: Map<string, { summary: AIHealthSummary; cachedAt: number }> = new Map();
  private trendCache: Map<string, { trends: AITrendInterpretation; cachedAt: number }> = new Map();
  private recordsAnalyzed = 0;
  private anomaliesReviewed = 0;
  private latestTimestamp: string | null = null;
  private cacheTtlMs = 15000; // 15 seconds

  constructor(deterministicProvider?: DeterministicAIProvider, geminiProvider?: GeminiAIProvider) {
    this.deterministicProvider = deterministicProvider || new DeterministicAIProvider();
    this.geminiProvider = geminiProvider || new GeminiAIProvider({}, this.deterministicProvider);
  }

  // ----------------- Existing P07 methods -----------------
  public getSystemOverview(): AISystemOverview {
    const isGeminiMode = this.currentMode === 'GEMINI_LIVE';
    let providerStatus: AIProviderStatus = 'FALLBACK_MODE';
    let geminiConnection: 'CONNECTED' | 'STANDBY' | 'CREDENTIALS_REQUIRED' | 'ERROR' = 'STANDBY';
    if (isGeminiMode) {
      providerStatus = 'ONLINE';
      geminiConnection = 'CONNECTED';
    } else {
      providerStatus = 'FALLBACK_MODE';
      geminiConnection = 'CREDENTIALS_REQUIRED';
    }
    return {
      providerStatus,
      geminiConnection,
      currentMode: this.currentMode,
      modelIdentifier: isGeminiMode ? this.geminiProvider.getModelIdentifier() : 'AstroCare-Deterministic-Rule-v1.0',
      latestAnalysisTimestamp: this.latestTimestamp,
      analyzedRecordsCount: this.recordsAnalyzed,
      anomaliesReviewedCount: this.anomaliesReviewed,
      activeRiskObservationsCount: 7,
      dataProvenance: 'SIMULATOR (isSimulated = true)',
    };
  }

  public setProviderMode(mode: AIProviderMode): void {
    this.currentMode = mode;
  }

  public async getHealthSummary(context: GroundedAIContext, forceRefresh: boolean = false): Promise<AIHealthSummary> {
    const cacheKey = `${context.astronautId}:${context.timeRange}:${context.compositeScore}`;
    const now = Date.now();
    const existing = this.summaryCache.get(cacheKey);
    if (!forceRefresh && existing && now - existing.cachedAt < this.cacheTtlMs) {
      return { ...existing.summary, cached: true };
    }
    this.recordsAnalyzed += Object.keys(context.metrics).length;
    this.latestTimestamp = new Date().toISOString();
    let result: AIHealthSummary;
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.generateHealthSummary(context);
      result = res.summary;
    } else {
      result = this.deterministicProvider.generateHealthSummary(context);
    }
    this.summaryCache.set(cacheKey, { summary: result, cachedAt: now });
    return result;
  }

  public async explainAnomaly(alertId: string, context: GroundedAIContext): Promise<AIAnomalyExplanation> {
    this.anomaliesReviewed += 1;
    this.latestTimestamp = new Date().toISOString();
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.explainAnomaly(alertId, context);
      return res.explanation;
    }
    return this.deterministicProvider.explainAnomaly(alertId, context);
  }

  public async interpretTrends(context: GroundedAIContext, forceRefresh: boolean = false): Promise<AITrendInterpretation> {
    const cacheKey = `trends:${context.astronautId}:${context.timeRange}:${context.compositeScore}`;
    const now = Date.now();
    const existing = this.trendCache.get(cacheKey);
    if (!forceRefresh && existing && now - existing.cachedAt < this.cacheTtlMs) {
      return existing.trends;
    }
    this.latestTimestamp = new Date().toISOString();
    let result: AITrendInterpretation;
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.interpretTrends(context);
      result = res.trends;
    } else {
      result = this.deterministicProvider.interpretTrends(context);
    }
    this.trendCache.set(cacheKey, { trends: result, cachedAt: now });
    return result;
  }

  public async askQuestion(query: string, context: GroundedAIContext): Promise<ChatMessage> {
    this.latestTimestamp = new Date().toISOString();
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.answerQuestion(query, context);
      return res.message;
    }
    return this.deterministicProvider.answerQuestion(query, context);
  }

  public clearCache(): void {
    this.summaryCache.clear();
    this.trendCache.clear();
  }

  // ----------------- Prompt 08 extensions -----------------
  public async generateCopilotOverview(context: GroundedAIContext, forceRefresh: boolean = false): Promise<CopilotOverview> {
    const cacheKey = `overview:${context.astronautId}:${context.timeRange}`;
    const now = Date.now();
    const existing = this.summaryCache.get(cacheKey);
    if (!forceRefresh && existing && now - existing.cachedAt < this.cacheTtlMs) {
      return existing.summary as any;
    }
    this.latestTimestamp = new Date().toISOString();
    let result: CopilotOverview;
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.generateCopilotOverview(context);
      result = res.overview;
    } else {
      result = this.deterministicProvider.generateCopilotOverview(context);
    }
    this.summaryCache.set(cacheKey, { summary: result as any, cachedAt: now });
    return result;
  }

  public async generateHealthSituationBrief(context: GroundedAIContext, timeRange: TimeRangeOption, forceRefresh: boolean = false): Promise<HealthSituationBrief> {
    const cacheKey = `brief:${context.astronautId}:${timeRange}`;
    const now = Date.now();
    const existing = this.summaryCache.get(cacheKey);
    if (!forceRefresh && existing && now - existing.cachedAt < this.cacheTtlMs) {
      return existing.summary as any;
    }
    this.latestTimestamp = new Date().toISOString();
    let result: HealthSituationBrief;
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.generateHealthSituationBrief(context, timeRange);
      result = res.brief;
    } else {
      result = this.deterministicProvider.generateHealthSituationBrief(context, timeRange);
    }
    this.summaryCache.set(cacheKey, { summary: result as any, cachedAt: now });
    return result;
  }

  public async analyzeClinicalInvestigation(investigation: ClinicalInvestigation, context: GroundedAIContext): Promise<InvestigationReport> {
    this.latestTimestamp = new Date().toISOString();
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.analyzeInvestigation(investigation, context);
      return res.report;
    }
    return this.deterministicProvider.analyzeInvestigation(investigation, context);
  }

  public async analyzeMultipleMetrics(metrics: VitalParameter[], timeRange: TimeRangeOption, context: GroundedAIContext): Promise<MultiMetricAnalysisResult> {
    this.latestTimestamp = new Date().toISOString();
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.analyzeMultipleMetrics(metrics, timeRange, context);
      return res.result;
    }
    return this.deterministicProvider.analyzeMultipleMetrics(metrics, timeRange, context);
  }

  public async generateInvestigationReport(report: InvestigationReport, context: GroundedAIContext): Promise<InvestigationReport> {
    this.latestTimestamp = new Date().toISOString();
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.enrichInvestigationReport(report, context);
      return res.report;
    }
    return this.deterministicProvider.enrichInvestigationReport(report, context);
  }

  public async suggestFollowUpActions(investigationId: string, context: GroundedAIContext): Promise<FollowUpChecklistItem[]> {
    this.latestTimestamp = new Date().toISOString();
    if (this.currentMode === 'GEMINI_LIVE') {
      const res = await this.geminiProvider.suggestFollowUps(investigationId, context);
      return res.items;
    }
    return this.deterministicProvider.suggestFollowUps(investigationId, context);
  }
}

export const aiOrchestrator = new AIOrchestrator();