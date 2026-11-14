import { describe, it, expect } from 'vitest';
import { NasaResearchService } from '../features/risk-intelligence/services/nasaResearchService';
import { NasaOsdrService } from '../features/risk-intelligence/services/nasaOsdrService';
import { RiskAnalysisService } from '../features/risk-intelligence/services/riskAnalysisService';
import { NASA_RISK_CATEGORIES } from '../features/risk-intelligence/data/nasaRiskCategories';
import { NASA_EVIDENCE_LIBRARY } from '../features/risk-intelligence/data/nasaEvidenceLibrary';
import { NASA_MITIGATION_STRATEGIES } from '../features/risk-intelligence/data/nasaMitigations';
import { MissionProfile } from '../features/risk-intelligence/types/mission.types';

describe('AstroCare P14 — NASA Human-Spaceflight Risk Intelligence', () => {
  
  describe('Risk Category Data Integrity & Retrieval', () => {
    it('indexes all 8 mandatory NASA Human Research Program risk domains', () => {
      const categories = NasaResearchService.getAllRiskCategories();
      expect(categories).toHaveLength(8);

      const codes = categories.map(c => c.code);
      expect(codes).toContain('RAD');
      expect(codes).toContain('CARDIO');
      expect(codes).toContain('BONE');
      expect(codes).toContain('MUSCLE');
      expect(codes).toContain('IMMUNE');
      expect(codes).toContain('SLEEP');
      expect(codes).toContain('BEHAVIOR');
      expect(codes).toContain('SANS');
    });

    it('each category contains required scientific descriptions and mechanisms', () => {
      NASA_RISK_CATEGORIES.forEach(cat => {
        expect(cat.title).toBeTruthy();
        expect(cat.fullDescription).toBeTruthy();
        expect(cat.physiologicalSystem.length).toBeGreaterThan(0);
        expect(cat.mechanisms.length).toBeGreaterThan(0);
        expect(cat.missionRelevance.leo).toBeTruthy();
        expect(cat.missionRelevance.mars).toBeTruthy();
        expect(cat.hrpRiskUrl).toContain('humanresearchroadmap.nasa.gov');
      });
    });

    it('finds category by code and ID case-insensitively', () => {
      const sans = NasaResearchService.getRiskCategoryById('sans');
      expect(sans).toBeDefined();
      expect(sans?.title).toContain('Spaceflight-Associated Neuro-Ocular');

      const cardio = NasaResearchService.getRiskCategoryById('risk-cardiovascular');
      expect(cardio).toBeDefined();
      expect(cardio?.code).toBe('CARDIO');
    });
  });

  describe('NASA Evidence Library & Quality Framework', () => {
    it('contains verified evidence records with required metadata', () => {
      const allEvidence = NasaResearchService.getAllEvidence();
      expect(allEvidence.length).toBeGreaterThan(8);

      allEvidence.forEach(ev => {
        expect(ev.id).toBeTruthy();
        expect(ev.evidenceCode).toBeTruthy();
        expect(ev.title).toBeTruthy();
        expect(ev.sourceOrganization).toBeTruthy();
        expect(ev.methodology).toBeTruthy();
        expect(ev.findings).toBeTruthy();
        expect(ev.limitations).toBeTruthy();
        expect(ev.studyType).toBeTruthy();
        expect(typeof ev.isDirectHumanEvidence).toBe('boolean');
      });
    });

    it('strictly separates direct human astronaut evidence from animal and cell models', () => {
      const twinsStudy = NASA_EVIDENCE_LIBRARY.find(e => e.evidenceCode === 'HRP-RAD-TWINS-02');
      expect(twinsStudy?.isDirectHumanEvidence).toBe(true);
      expect(twinsStudy?.studyType).toBe('astronaut_human');

      const rodentBone = NASA_EVIDENCE_LIBRARY.find(e => e.evidenceCode === 'HRP-BONE-RODENT-03');
      expect(rodentBone?.isDirectHumanEvidence).toBe(false);
      expect(rodentBone?.studyType).toBe('animal_model');
      expect(rodentBone?.organism).toBe('Mus musculus');
    });

    it('filters evidence by keyword query across findings and methodology', () => {
      const results = NasaResearchService.filterEvidence({ searchQuery: 'jugular' });
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.findings.includes('jugular') || r.title.includes('Jugular'))).toBe(true);
    });

    it('filters evidence by direct human astronaut flag', () => {
      const directHumanOnly = NasaResearchService.filterEvidence({ hasDirectHumanOnly: true });
      expect(directHumanOnly.every(e => e.isDirectHumanEvidence)).toBe(true);
      expect(directHumanOnly.length).toBeGreaterThan(0);
    });
  });

  describe('NASA OSDR Study Search & Fallback Integrity', () => {
    it('retrieves curated authentic NASA OSDR datasets', async () => {
      const res = await NasaOsdrService.searchStudies({ query: 'bone' });
      expect(res.hits.length).toBeGreaterThan(0);
      expect(res.hits.some(h => h.id.startsWith('OSD-'))).toBe(true);
      expect(res.dataSourceNotice).toBeTruthy();
    });

    it('filters OSDR datasets by organism classification', () => {
      const humanResults = NasaOsdrService.getCuratedFallbackResults({ organismFilter: 'Human' });
      expect(humanResults.hits.every(h => h.isHuman)).toBe(true);

      const animalResults = NasaOsdrService.getCuratedFallbackResults({ organismFilter: 'Animal' });
      expect(animalResults.hits.every(h => h.organismClassification === 'Rodent / Mammalian')).toBe(true);
    });
  });

  describe('Mitigation Strategies Architecture', () => {
    it('indexes flight-operational countermeasures and includes residual risk notices', () => {
      const mitigations = NasaResearchService.getAllMitigations();
      expect(mitigations.length).toBeGreaterThan(6);

      const ared = mitigations.find(m => m.id === 'MIT-BONE-01');
      expect(ared).toBeDefined();
      expect(ared?.readiness).toBe('OPERATIONAL');
      expect(ared?.residualRiskNote).toContain('trabecular');

      // Check all have residual risk notes
      mitigations.forEach(m => {
        expect(m.residualRiskNote).toBeTruthy();
        expect(m.missionApplicability.leo).toBeTruthy();
        expect(m.missionApplicability.mars).toBeTruthy();
      });
    });
  });

  describe('Mission Qualitative Risk Relevance Logic', () => {
    const testMission: MissionProfile = {
      id: 'test-mars',
      missionName: 'Mars 1000-Day Conjunction Test',
      missionType: 'MARS_CONJUNCTION',
      destination: 'Mars Surface',
      durationDays: 1000,
      crewSize: 4,
      environment: {
        radiationFieldType: 'INTERPLANETARY_GCR_SPE',
        gravityField: 'MICROGRAVITY',
        communicationLatencyMinutes: 14.5,
        evacuationTimeDays: 280,
        habitatVolumePerCrewM3: 35
      },
      activePhase: 'ASCENT_TRANSIT_OUTBOUND',
      isHypothetical: true
    };

    it('assigns qualitative relevance without fabricating numerical health probabilities', () => {
      const analysis = RiskAnalysisService.analyzeMission(testMission);
      expect(analysis.assessments).toHaveLength(8);

      const radAssess = analysis.assessments.find(a => a.riskCategoryId === 'RAD');
      expect(radAssess?.qualitativeRelevance).toBe('CRITICAL');
      expect(radAssess?.environmentalDrivers.length).toBeGreaterThan(0);
      expect(radAssess?.assumptions.length).toBeGreaterThan(0);

      // Verify disclaimer is present
      expect(analysis.disclaimerNotice).toContain('In accordance with NASA scientific standards');
    });

    it('compares two mission profiles side-by-side and calculates delta relevance', () => {
      const presets = RiskAnalysisService.getPresetMissions();
      const iss = presets.find(p => p.missionType === 'LEO')!;
      const mars = presets.find(p => p.missionType === 'MARS_CONJUNCTION')!;

      const comparison = RiskAnalysisService.compareMissions(iss, mars);
      expect(comparison.deltaRiskSummary).toHaveLength(8);

      const radDelta = comparison.deltaRiskSummary.find(d => d.riskCategoryId === 'RAD');
      expect(radDelta?.severityDelta).toBe('HIGHER_IN_B'); // Higher on Mars than LEO
    });
  });

  describe('Multi-Domain Risk Comparison Logic', () => {
    it('compares selected categories and identifies common affected systems', () => {
      const comparison = NasaResearchService.compareRiskCategories(['RAD', 'CARDIO']);
      expect(comparison.categories).toHaveLength(2);
      expect(comparison.commonAffectedSystems).toContain('Cardiovascular');
      expect(comparison.divergentMechanisms).toHaveLength(2);
    });
  });
});
