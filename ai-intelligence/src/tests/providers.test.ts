import { describe, it, expect } from 'vitest';
import { MockAIProvider } from '../providers/MockAIProvider';
import { GeminiBackendProvider } from '../providers/GeminiBackendProvider';
import { DEFAULT_ASTRONAUT_PROFILES } from '../data/astronautProfiles';
import { NASA_RESEARCH_DATABASE, SCIENTIFIC_GLOSSARY } from '../data/nasaResearchDocs';

describe('AstroCare AI Providers & Safety Suite', () => {
  const profile = DEFAULT_ASTRONAUT_PROFILES[0];
  const mockProvider = new MockAIProvider();

  describe('MockAIProvider Core Capabilities', () => {
    it('returns high-fidelity status in offline mode', async () => {
      const status = await mockProvider.getStatus();
      expect(status.isAvailable).toBe(true);
      expect(status.mode).toBe('mock-simulation');
      expect(status.model).toBeDefined();
    });

    it('processes chat messages and strictly segregates observations from hypotheses', async () => {
      const response = await mockProvider.sendMessage(
        [
          {
            id: 'test-1',
            role: 'user',
            content: 'Explain cardiovascular deconditioning and SANS risk for this mission phase.',
            timestamp: new Date().toISOString()
          }
        ],
        {},
        profile.astronaut,
        profile.missionContext
      );

      expect(response.role).toBe('assistant');
      expect(response.content).toContain('Observations');
      expect(response.content).toContain('Hypotheses');
      expect(response.citations).toBeDefined();
      expect(response.citations!.length).toBeGreaterThan(0);
      expect(response.suggestedQuestions).toBeDefined();
    });

    it('explains scientific terminology from verified aerospace glossary', async () => {
      const response = await mockProvider.sendMessage([
        {
          id: 'test-term',
          role: 'user',
          content: 'What is SANS and cephalad fluid shift?',
          timestamp: new Date().toISOString()
        }
      ]);

      expect(response.content.toLowerCase()).toContain('sans');
      expect(response.content.toLowerCase()).toContain('cephalad');
    });

    it('interprets health telemetry across all 5 biomedical domains', async () => {
      const result = await mockProvider.interpretHealthData(profile.astronaut, profile.missionContext);

      expect(result.domainEvaluations).toHaveLength(5);
      expect(result.executiveSummary).toBeDefined();
      expect(result.disclaimer).toContain('INFORMATIONAL AND RESEARCH DECISION SUPPORT ONLY');
      expect(result.citations.length).toBeGreaterThan(0);
      expect(result.recommendedQuestionsForSurgeon.length).toBeGreaterThan(0);

      // Verify each domain has observations and hypotheses
      for (const de of result.domainEvaluations) {
        expect(de.observations.length).toBeGreaterThan(0);
        expect(de.hypotheses.length).toBeGreaterThan(0);
      }
    });

    it('detects anomalous changes and generates risk patterns', async () => {
      const result = await mockProvider.interpretHealthData(profile.astronaut, profile.missionContext);
      expect(result.unusualChanges.length).toBeGreaterThan(0);
      expect(result.potentialRiskPatterns.length).toBeGreaterThan(0);
    });

    it('summarizes NASA research papers accurately with valid NTRS citation metadata', async () => {
      const doc = NASA_RESEARCH_DATABASE[0];
      const summary = await mockProvider.summarizeResearch(doc.id, 'telomeres and immune activation');

      expect(summary.summary).toContain(doc.ntrsId);
      expect(summary.citations[0].ntrsId).toBe(doc.ntrsId);
      expect(summary.keyTakeaways.length).toBeGreaterThan(0);
    });

    it('generates multi-domain biomedical insights and cross-domain correlations', async () => {
      const insights = await mockProvider.generateBiomedicalInsights(profile.astronaut, profile.missionContext);

      expect(insights.flightDay).toBe(profile.missionContext.flightDay);
      expect(insights.crossDomainCorrelations.length).toBeGreaterThan(0);
      expect(insights.riskMatrix.length).toBeGreaterThan(0);
      expect(insights.suggestedQuestionsForFlightSurgeons.length).toBeGreaterThan(0);
      expect(insights.missingDataNotes.length).toBeGreaterThan(0);
    });
  });

  describe('Citation Grounding & Zero Hallucination Integrity', () => {
    it('verifies that all NASA research database entries have legitimate NTRS IDs', () => {
      for (const doc of NASA_RESEARCH_DATABASE) {
        expect(doc.ntrsId).toMatch(/^NTRS-\d+/);
        expect(doc.verifiedGroundTruth).toBe(true);
        expect(doc.authors.length).toBeGreaterThan(0);
        expect(doc.abstract.length).toBeGreaterThan(50);
        expect(doc.keyFindings.length).toBeGreaterThan(0);
      }
    });

    it('verifies that scientific glossary entries have verified aerospace significance', () => {
      const terms = Object.keys(SCIENTIFIC_GLOSSARY);
      expect(terms.length).toBeGreaterThanOrEqual(6);
      for (const key of terms) {
        const item = SCIENTIFIC_GLOSSARY[key];
        expect(item.term).toBeDefined();
        expect(item.definition).toBeDefined();
        expect(item.aerospaceSignificance).toBeDefined();
        expect(item.relatedDomains.length).toBeGreaterThan(0);
      }
    });
  });

  describe('GeminiBackendProvider Fallback Handling', () => {
    it('initializes and provides graceful mock fallback when proxy is offline', async () => {
      const provider = new GeminiBackendProvider('http://localhost:9999'); // non-existent port
      const status = await provider.getStatus();
      expect(status.mode).toBe('mock-simulation');

      const response = await provider.sendMessage([
        {
          id: 'fb-test',
          role: 'user',
          content: 'Hello astronaut status',
          timestamp: new Date().toISOString()
        }
      ]);
      expect(response.content).toBeDefined();
      expect(response.metadata?.mode).toBe('mock-simulation');
    });
  });
});
