/**
 * AstroCare Gemini AI Intelligence Module (ai-intelligence)
 * Public API Entry Point for Master Application
 */

export { AstroCareIntelligenceModule } from './components/AstroCareIntelligenceModule';
export type { AstroCareIntelligenceModuleProps, ActiveModuleTab } from './components/AstroCareIntelligenceModule';

// Providers & Context
export { ProviderContextProvider, useAstroCareAI } from './providers/ProviderContext';
export { GeminiBackendProvider } from './providers/GeminiBackendProvider';
export { MockAIProvider } from './providers/MockAIProvider';
export type { IAIProvider, ProviderStatus, ProviderRequestOptions } from './providers/types';

// Types
export type {
  HealthDomain,
  AnomalySeverity,
  DataOrigin,
  MetricItem,
  DomainHealthData,
  AstronautHealthPayload,
  MissionPhase,
  MissionContext,
  NASAResearchDoc,
  ResearchCitation,
  ChatMessage,
  HealthInterpretationResult,
  AIInsightsResult,
  AIProviderConfig
} from './types';

// Verified Datasets & Baseline Profiles
export { NASA_RESEARCH_DATABASE, SCIENTIFIC_GLOSSARY } from './data/nasaResearchDocs';
export { DEFAULT_ASTRONAUT_PROFILES } from './data/astronautProfiles';

// Modular Components
export { ChatInterface } from './components/chat/ChatInterface';
export { HealthDataInterpretationView } from './components/health/HealthDataInterpretationView';
export { ResearchAssistantView } from './components/research/ResearchAssistantView';
export { AIInsightsDashboard } from './components/insights/AIInsightsDashboard';
export { SafetyBanner } from './components/common/SafetyBanner';
export { DataOriginBadge } from './components/common/DataOriginBadge';
