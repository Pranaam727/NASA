import { describe, it, expect } from 'vitest';
import { AstroCareModuleRegistry } from '../../src/adapters/modules/AstroCareAdapters';
import { SYNTHETIC_TELEMETRY_SERIES, SYNTHETIC_RADIATION_EVENTS } from '../../src/fixtures';

describe('AstroCare Module Adapters Integration', () => {
  const moduleRegistry = new AstroCareModuleRegistry();

  it('allows registration and communication with Biomedical service', async () => {
    const bioService = moduleRegistry.getBiomedicalService();
    const ingestRes = await bioService.ingestTelemetry(SYNTHETIC_TELEMETRY_SERIES[0]);

    expect(ingestRes.accepted).toBe(true);
    expect(ingestRes.recordId).toBe(SYNTHETIC_TELEMETRY_SERIES[0].recordId);

    const vitals = await bioService.getAstronautLatestVitals('ASTRO-CDR-01');
    expect(vitals['heart_rate']).toBeDefined();
    expect(vitals['heart_rate'].value).toBe(62);

    const risk = await bioService.assessHealthRisk('ASTRO-CDR-01');
    expect(risk.riskLevel).toBe('LOW');
  });

  it('interacts with AI Intelligence service and generates clinical reasoning', async () => {
    const aiService = moduleRegistry.getAiService();
    const context = await aiService.constructHealthContext('ASTRO-CDR-01');

    expect(context.astronautId).toBe('ASTRO-CDR-01');

    const reasoning = await aiService.generateClinicalReasoning(context);
    expect(reasoning.sourceModel).toBe('GEMINI_PRO');
    expect(reasoning.citations.length).toBeGreaterThan(0);
    expect(reasoning.provenance.deterministicFallbackInvoked).toBe(false);
  });

  it('records radiation dosimetric events in Aerospace service', async () => {
    const aeroService = moduleRegistry.getAerospaceService();
    await aeroService.recordRadiationExposure(SYNTHETIC_RADIATION_EVENTS[0]);

    const summary = await aeroService.getCumulativeMissionExposure('MISSION-ARTEMIS-III');
    expect(summary.totalAbsorbedDoseGy).toBeGreaterThan(0);
    expect(summary.totalEquivalentDoseSv).toBeGreaterThan(0);

    const spe = await aeroService.assessSolarParticleEventRisk();
    expect(spe.speRiskLevel).toBe('NOMINAL_BACKGROUND');
  });

  it('queries Research service and validates NASA OSDR/NTRS citations', async () => {
    const researchService = moduleRegistry.getResearchService();
    const osdrCheck = await researchService.validateCitation('OSD-379');

    expect(osdrCheck.valid).toBe(true);
    expect(osdrCheck.citation).toBeDefined();

    const ntrsCheck = await researchService.validateCitation('20210018596');
    expect(ntrsCheck.valid).toBe(true);
  });
});
