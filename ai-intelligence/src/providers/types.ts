import {
  AstronautHealthPayload,
  MissionContext,
  ChatMessage,
  HealthInterpretationResult,
  AIInsightsResult,
  ResearchCitation
} from '../types';

export interface ProviderRequestOptions {
  model?: string;
  temperature?: number;
  includeHealthContext?: boolean;
  includeMissionContext?: boolean;
  stream?: boolean;
  signal?: AbortSignal;
}

export interface ProviderStatus {
  name: string;
  mode: 'gemini-live' | 'mock-simulation' | 'custom-proxy';
  isAvailable: boolean;
  model: string;
  latencyMs?: number;
  message?: string;
}

export interface IAIProvider {
  readonly id: string;
  readonly name: string;
  getStatus(): Promise<ProviderStatus>;
  
  sendMessage(
    messages: ChatMessage[],
    options?: ProviderRequestOptions,
    healthContext?: AstronautHealthPayload,
    missionContext?: MissionContext
  ): Promise<ChatMessage>;

  interpretHealthData(
    healthPayload: AstronautHealthPayload,
    missionContext: MissionContext,
    options?: ProviderRequestOptions
  ): Promise<HealthInterpretationResult>;

  summarizeResearch(
    docId: string,
    query?: string,
    options?: ProviderRequestOptions
  ): Promise<{
    summary: string;
    keyTakeaways: string[];
    citations: ResearchCitation[];
    clinicalRelevance: string;
  }>;

  generateBiomedicalInsights(
    healthPayload: AstronautHealthPayload,
    missionContext: MissionContext,
    options?: ProviderRequestOptions
  ): Promise<AIInsightsResult>;
}
