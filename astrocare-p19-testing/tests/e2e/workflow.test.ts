import { describe, it, expect } from 'vitest';
import { AstroCareModuleRegistry } from '../../src/adapters/modules/AstroCareAdapters';
import { BiomedicalValidator } from '../../src/validation/biomedical/BiomedicalValidator';
import { CalculationValidator } from '../../src/validation/scientific/CalculationValidator';
import { MockGeminiProvider } from '../../src/validation/ai/MockGeminiProvider';
import { AIResponseValidator } from '../../src/validation/ai/AIResponseValidator';
import { TestOrchestrator } from '../../src/engine/TestOrchestrator';
import { createDefaultSuites } from '../../src/ui/default-suites';
import { TestReportGenerator } from '../../src/engine/TestReportGenerator';
import {
  SYNTHETIC_ASTRONAUTS,
  SYNTHETIC_TELEMETRY_SERIES,
  SYNTHETIC_RADIATION_EVENTS,
} from '../../src/fixtures';

describe('AstroCare 11-Step End-to-End Verification Workflow', () => {
  const registry = new AstroCareModuleRegistry();
  const bioValidator = new BiomedicalValidator();
  const geminiProvider = new MockGeminiProvider();
  const orchestrator = new TestOrchestrator();

  createDefaultSuites().forEach((s) => orchestrator.registerSuite(s));

  it('executes full 11-step clinical and aerospace decision-support pipeline', async () => {
    // Step 1: Open the Application & Initialize Service Registry
    const bioService = registry.getBiomedicalService();
    const aiService = registry.getAiService();
    const aeroService = registry.getAerospaceService();
    const researchService = registry.getResearchService();

    expect(bioService).toBeDefined();
    expect(aiService).toBeDefined();
    expect(aeroService).toBeDefined();
    expect(researchService).toBeDefined();

    // Step 2: Navigate Between Modules (Manifest and route discovery)
    const availableSuites = orchestrator.discoverSuites();
    expect(availableSuites.length).toBeGreaterThanOrEqual(7);

    // Step 3: Select an Astronaut Profile
    const selectedAstronaut = SYNTHETIC_ASTRONAUTS[0]; // Cmdr. Elena Vance
    expect(selectedAstronaut.astronautId).toBe('ASTRO-CDR-01');
    expect(selectedAstronaut.baselineRestingHeartRate).toBe(58);

    // Step 4: View Health Analytics & Validate Telemetry Stream
    for (const rec of SYNTHETIC_TELEMETRY_SERIES) {
      await bioService.ingestTelemetry(rec);
    }
    const vitals = await bioService.getAstronautLatestVitals(selectedAstronaut.astronautId);
    expect(vitals['heart_rate']).toBeDefined();
    expect(vitals['heart_rate'].value).toBe(64);

    const validation = bioValidator.validate(Object.values(vitals));
    expect(validation.isValid).toBe(true);

    // Step 5: Inspect an Anomaly
    const anomCheck = await bioService.detectAnomalies(selectedAstronaut.astronautId, 'heart_rate');
    expect(anomCheck.length).toBeGreaterThan(0);
    expect(anomCheck[0].score).toBeGreaterThan(0.7);

    // Step 6: Open AI Intelligence & Generate Grounded Clinical Copilot Reasoning
    const healthContext = await aiService.constructHealthContext(selectedAstronaut.astronautId);
    const reasoning = await aiService.generateClinicalReasoning(healthContext);

    expect(reasoning.sourceModel).toBe('GEMINI_PRO');
    const groundingCheck = AIResponseValidator.validateResponse(healthContext, reasoning);
    expect(groundingCheck.isFullyGrounded).toBe(true);

    // Step 7: Test Deterministic Fallback Mode
    geminiProvider.setConfig({ simulateFailureMode: 'RATE_LIMIT', deterministicFallbackEnabled: true });
    const fallbackReasoning = await geminiProvider.generateClinicalReasoning(healthContext);

    expect(fallbackReasoning.sourceModel).toBe('DETERMINISTIC_FALLBACK');
    expect(fallbackReasoning.provenance.deterministicFallbackInvoked).toBe(true);
    geminiProvider.setConfig({ simulateFailureMode: 'NONE' });

    // Step 8: Open Clinical Investigation & Anomaly Scoring Analysis
    const anomalyScore = CalculationValidator.calculateAnomalyScore({
      observedValue: 140,
      baselineMean: selectedAstronaut.baselineRestingHeartRate,
      baselineStdDev: 8,
      deltaTimeMinutes: 2,
    });
    expect(anomalyScore.isAnomaly).toBe(true);
    expect(anomalyScore.zScoreContribution).toBeGreaterThan(0.5);

    // Step 9: Inspect Radiation Analytics (Gy vs Sv)
    for (const rad of SYNTHETIC_RADIATION_EVENTS) {
      await aeroService.recordRadiationExposure(rad);
    }
    const cumulativeRad = await aeroService.getCumulativeMissionExposure(selectedAstronaut.missionId);
    expect(cumulativeRad.totalAbsorbedDoseGy).toBeGreaterThan(0);
    expect(cumulativeRad.totalEquivalentDoseSv).toBeGreaterThan(0);

    // Step 10: Search Scientific Research (NASA OSDR and NTRS)
    const osdrStudies = await researchService.searchNasaOsdr('Microgravity');
    expect(osdrStudies.length).toBeGreaterThan(0);

    const ntrsCitations = await researchService.searchNasaNtrs('Adverse Health');
    expect(ntrsCitations.length).toBeGreaterThan(0);

    // Step 11: Open Generated Quality Assurance Report & Check Readiness
    const overallReport = await orchestrator.runAll();
    expect(overallReport.summary.totalTests).toBeGreaterThan(15);
    expect(overallReport.summary.failed).toBe(0);
    expect(overallReport.integrationReadiness.isReadyForIntegration).toBe(true);

    // Verify HTML report output
    const htmlReport = TestReportGenerator.toHTML(overallReport);
    expect(htmlReport).toContain('AstroCare Verification Report');
    expect(htmlReport).toContain('READY FOR INTEGRATION');
  });
});
