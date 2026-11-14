import { describe, it, expect } from 'vitest';
import { DESIGN_TOKENS } from '../design-system/tokens';
import { dataProvider } from '../data/mockDataProvider';
import { NASA_OFFICIAL_RESEARCH_SOURCES } from '../data/nasaSources';
import { ASTROCARE_NAVIGATION_TREE } from '../data/navigationTree';
import { CREW_MEMBERS } from '../data/crewRoster';

describe('AstroCare P20/21 Design System & Quality Assurance Suite', () => {

  describe('1. Centralized Design Tokens & Color Palettes', () => {
    it('defines brand surfaces and controlled status colors for both dark and light modes', () => {
      expect(DESIGN_TOKENS.brand.navy).toBe('#070a12');
      expect(DESIGN_TOKENS.brand.cyan).toBe('#06b6d4');
      expect(DESIGN_TOKENS.status.nominal.dark).toBeDefined();
      expect(DESIGN_TOKENS.status.nominal.light).toBeDefined();
      expect(DESIGN_TOKENS.status.warning.dark).toBeDefined();
      expect(DESIGN_TOKENS.status.critical.dark).toBeDefined();
    });

    it('defines scientific chart colors with distinct series and baseline markers', () => {
      expect(DESIGN_TOKENS.charts.primary).toBe('#06b6d4');
      expect(DESIGN_TOKENS.charts.baseline).toBe('#94a3b8');
      expect(DESIGN_TOKENS.charts.gridDark).toBe('#1e293b');
      expect(DESIGN_TOKENS.charts.gridLight).toBe('#e2e8f0');
    });

    it('contains all 7 required data provenance badge tokens', () => {
      const provTokens = Object.keys(DESIGN_TOKENS.provenance);
      expect(provTokens).toContain('live-telemetry');
      expect(provTokens).toContain('simulated-data');
      expect(provTokens).toContain('nasa-research-source');
      expect(provTokens).toContain('derived-metric');
      expect(provTokens).toContain('ai-generated-interpretation');
      expect(provTokens).toContain('deterministic-fallback');
      expect(provTokens).toContain('incomplete-data');
    });
  });

  describe('2. Navigation Information Architecture & Route Contracts', () => {
    it('structures navigation into the 5 core operational groups', () => {
      const groupIds = ASTROCARE_NAVIGATION_TREE.map(g => g.id);
      expect(groupIds).toEqual([
        'mission-operations',
        'health-monitoring',
        'intelligence',
        'scientific-research',
        'operations'
      ]);
    });

    it('clearly distinguishes implemented P20 modules from external target P-modules', () => {
      const allRoutes = ASTROCARE_NAVIGATION_TREE.flatMap(g => g.routes);
      
      const p20Implemented = allRoutes.filter(r => r.isImplementedInP20);
      expect(p20Implemented.length).toBeGreaterThanOrEqual(8);

      const placeholders = allRoutes.filter(r => !r.isImplementedInP20);
      expect(placeholders.length).toBeGreaterThanOrEqual(8);

      // Verify every placeholder has a documented route contract and target P-module
      for (const p of placeholders) {
        expect(p.targetPModule).toMatch(/^P\d+/);
        expect(p.routeContractPath).toMatch(/^\//);
        expect(p.description.length).toBeGreaterThan(10);
      }
    });
  });

  describe('3. NASA Scientific Research Sources & Ground Truth Verification', () => {
    it('incorporates all required official NASA research resources', () => {
      const sourceIds = NASA_OFFICIAL_RESEARCH_SOURCES.map(s => s.id);
      expect(sourceIds).toContain('nasa-hrp-main');
      expect(sourceIds).toContain('nasa-osdr-repository');
      expect(sourceIds).toContain('nasa-osdr-faq-schema');
      expect(sourceIds).toContain('nasa-life-sciences-portal');
      expect(sourceIds).toContain('nasa-ongoing-hrp-research');
      expect(sourceIds).toContain('nasa-accessibility-policy');
      expect(sourceIds).toContain('nasa-web-design-system');
    });

    it('verifies that every research source has legitimate URL and data access classification', () => {
      for (const src of NASA_OFFICIAL_RESEARCH_SOURCES) {
        expect(src.sourceUrl).toMatch(/^https:\/\/(www\.)?(nasa\.gov|science\.nasa\.gov|nlsp\.nasa\.gov|nasa\.github\.io)/);
        expect(src.verifiedGroundTruth).toBe(true);
        expect(src.supportedDomains.length).toBeGreaterThan(0);
        expect(src.description.length).toBeGreaterThan(40);
        expect(src.accessDate).toBeDefined();
      }
    });
  });

  describe('4. Deterministic Local Data Provider & Contracts', () => {
    it('returns valid Mission contract with active environmental telemetry', async () => {
      const mission = await dataProvider.getMission();
      expect(mission.id).toBe('EXP-72-ISS');
      expect(mission.currentPhase).toBe('long-duration-orbital');
      expect(mission.flightDay).toBe(142);
      expect(mission.ambientEnvironment.cabinCo2Ppm).toBe(3200);
      expect(mission.systemHealthScorePercent).toBeGreaterThanOrEqual(90);
    });

    it('returns full monitored crew roster with non-fabricating physiological measurements', async () => {
      const crew = await dataProvider.getCrewMembers();
      expect(crew.length).toBe(4);
      for (const a of crew) {
        expect(a.id).toMatch(/^AST-\d+/);
        expect(a.primaryVitals.heartRateBpm).toBeGreaterThan(40);
        expect(a.primaryVitals.heartRateBpm).toBeLessThan(120);
        expect(a.primaryVitals.bloodPressureSys).toBeGreaterThan(90);
        expect(a.primaryVitals.hrvRmssdMs).toBeGreaterThan(15);
      }
    });

    it('provides multi-domain time-series metrics with nominal envelope bands', async () => {
      const metrics = await dataProvider.getHealthMetrics('AST-084-SC');
      expect(metrics.length).toBeGreaterThanOrEqual(5);

      for (const m of metrics) {
        expect(m.nominalRange[0]).toBeLessThan(m.nominalRange[1]);
        expect(m.provenance).toBeDefined();
        expect(m.timeSeriesHistory).toBeDefined();
        expect(m.timeSeriesHistory!.length).toBeGreaterThanOrEqual(5);
      }
    });

    it('returns chronological activity timeline with provenance stamps', async () => {
      const events = await dataProvider.getTimelineEvents();
      expect(events.length).toBeGreaterThanOrEqual(6);
      for (const e of events) {
        expect(e.timestamp).toBeDefined();
        expect(e.provenance.type).toBeDefined();
        expect(e.category).toBeDefined();
      }
    });
  });

  describe('5. Global Search Indexing', () => {
    it('finds astronauts by name and callsign', async () => {
      const results = await dataProvider.searchPlatform('Chen');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe('Astronaut');
      expect(results[0].title).toBe('Cmdr. Sarah Chen');

      const byCallsign = await dataProvider.searchPlatform('Valkyrie');
      expect(byCallsign.length).toBeGreaterThan(0);
    });

    it('finds scientific metrics and NASA research sources', async () => {
      const metricResults = await dataProvider.searchPlatform('Heart Rate Variability');
      expect(metricResults.some(r => r.category === 'Health Metric')).toBe(true);

      const researchResults = await dataProvider.searchPlatform('OSDR');
      expect(researchResults.some(r => r.category === 'NASA Research')).toBe(true);
    });

    it('returns empty array cleanly on blank or unmatched query', async () => {
      const empty = await dataProvider.searchPlatform('');
      expect(empty).toEqual([]);

      const unmatched = await dataProvider.searchPlatform('NonExistentMarsAnomaly999');
      expect(unmatched).toEqual([]);
    });
  });

});
