/**
 * @astrocare/qa-framework
 * AstroCare Comprehensive Testing, Scientific Validation & Quality Assurance Framework
 *
 * Central Public API Entry Point
 */

// Types & Contracts
export * from './types';

// Core Test Orchestration Engine
export { TestOrchestrator, type ProgressCallback } from './engine/TestOrchestrator';
export { TestRegistry } from './engine/TestRegistry';
export { TestReportGenerator } from './engine/TestReportGenerator';

// Biomedical Validation
export { BiomedicalValidator } from './validation/biomedical/BiomedicalValidator';
export { BIOMEDICAL_PROFILES } from './validation/biomedical/profiles';

// Scientific Calculation Verification
export { CalculationValidator } from './validation/scientific/CalculationValidator';
export { RadiationCalculator, RADIATION_WEIGHTING_FACTORS } from './validation/scientific/RadiationCalculator';

// AI Intelligence & Safety Validation
export { MockGeminiProvider, type MockGeminiConfig } from './validation/ai/MockGeminiProvider';
export { AIResponseValidator } from './validation/ai/AIResponseValidator';

// NASA Adapters & Verification
export { NasaApiAdapter, type NasaApiConfig } from './adapters/nasa/NasaApiAdapter';
export { NasaOsdrAdapter, SAMPLE_OSDR_FIXTURES } from './adapters/nasa/NasaOsdrAdapter';
export { NasaNtrsAdapter, SAMPLE_NTRS_FIXTURES } from './adapters/nasa/NasaNtrsAdapter';
export { NasaDataPortalAdapter, SAMPLE_DATA_PORTAL_FIXTURES } from './adapters/nasa/NasaDataPortalAdapter';

// API & Module Integration
export { ApiTestClient, type ApiRequestOptions, type ApiResponse, type MockHandler } from './adapters/api/ApiTestClient';
export {
  AstroCareModuleRegistry,
  type IBiomedicalService,
  type IAiIntelligenceService,
  type IAerospaceService,
  type IResearchService,
} from './adapters/modules/AstroCareAdapters';

// Security & Compliance
export { SecretScanner, type SecretFinding } from './security/SecretScanner';
export { SecurityAuditor, type SecurityAuditResult } from './security/SecurityAuditor';

// Performance Benchmarking
export { PerformanceBenchmarker, type BenchmarkResult, type PerformanceBudget } from './performance/PerformanceBenchmarker';

// Regression & Module Compatibility
export { ModuleCompatibilityValidator } from './regression/ModuleCompatibilityValidator';

// Fixtures
export * from './fixtures';
