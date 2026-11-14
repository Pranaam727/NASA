import {
  Mission,
  Astronaut,
  HealthMetric,
  MissionEvent,
  AlertSummary,
  InvestigationSummary,
  ResearchSource,
  HealthDomain,
  EventCategory
} from '../types/contracts';
import { CURRENT_MISSION, MOCK_ALERTS, MOCK_INVESTIGATIONS } from './mockMissionData';
import { CREW_MEMBERS } from './crewRoster';
import { MOCK_ASTRONAUT_METRICS } from './healthMetrics';
import { MISSION_ACTIVITY_TIMELINE } from './telemetryEvents';
import { NASA_OFFICIAL_RESEARCH_SOURCES } from './nasaSources';

export interface GlobalSearchResult {
  id: string;
  category: 'Astronaut' | 'Health Metric' | 'Investigation' | 'Report / Alert' | 'NASA Research' | 'Mission Event';
  title: string;
  subtitle: string;
  routeId: string;
  targetId?: string;
}

export class MockAstroCareDataProvider {
  async getMission(): Promise<Mission> {
    return { ...CURRENT_MISSION };
  }

  async getCrewMembers(): Promise<Astronaut[]> {
    return [...CREW_MEMBERS];
  }

  async getAstronautById(id: string): Promise<Astronaut | null> {
    const member = CREW_MEMBERS.find(a => a.id === id);
    return member ? { ...member } : null;
  }

  async getHealthMetrics(astronautId: string, domain?: HealthDomain): Promise<HealthMetric[]> {
    const metrics = MOCK_ASTRONAUT_METRICS[astronautId] || MOCK_ASTRONAUT_METRICS['AST-084-SC'] || [];
    if (!domain) return [...metrics];
    return metrics.filter(m => m.domain === domain);
  }

  async getTimelineEvents(category?: EventCategory): Promise<MissionEvent[]> {
    if (!category) return [...MISSION_ACTIVITY_TIMELINE];
    return MISSION_ACTIVITY_TIMELINE.filter(e => e.category === category);
  }

  async getAlerts(): Promise<AlertSummary[]> {
    return [...MOCK_ALERTS];
  }

  async getInvestigations(): Promise<InvestigationSummary[]> {
    return [...MOCK_INVESTIGATIONS];
  }

  async getResearchSources(domain?: HealthDomain): Promise<ResearchSource[]> {
    if (!domain) return [...NASA_OFFICIAL_RESEARCH_SOURCES];
    return NASA_OFFICIAL_RESEARCH_SOURCES.filter(s => s.supportedDomains.includes(domain));
  }

  async searchPlatform(query: string): Promise<GlobalSearchResult[]> {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const results: GlobalSearchResult[] = [];

    // Search Crew
    for (const a of CREW_MEMBERS) {
      if (a.name.toLowerCase().includes(clean) || a.callsign.toLowerCase().includes(clean) || a.role.toLowerCase().includes(clean)) {
        results.push({
          id: `search-crew-${a.id}`,
          category: 'Astronaut',
          title: a.name,
          subtitle: `${a.role} (${a.callsign}) • Status: ${a.overallHealthStatus.toUpperCase()}`,
          routeId: 'crew-roster',
          targetId: a.id
        });
      }
    }

    // Search Metrics
    for (const m of MOCK_ASTRONAUT_METRICS['AST-084-SC'] || []) {
      if (m.name.toLowerCase().includes(clean) || m.domain.toLowerCase().includes(clean)) {
        results.push({
          id: `search-metric-${m.id}`,
          category: 'Health Metric',
          title: m.name,
          subtitle: `${m.currentValue} ${m.unit} (Baseline: ${m.baselineValue}) • Domain: ${m.domain}`,
          routeId: 'health-analytics',
          targetId: m.id
        });
      }
    }

    // Search NASA Sources
    for (const s of NASA_OFFICIAL_RESEARCH_SOURCES) {
      if (s.title.toLowerCase().includes(clean) || s.description.toLowerCase().includes(clean) || (s.studyIdentifier && s.studyIdentifier.toLowerCase().includes(clean))) {
        results.push({
          id: `search-src-${s.id}`,
          category: 'NASA Research',
          title: s.title,
          subtitle: `${s.publishingOrganization} • ${s.studyIdentifier || s.researchCategory}`,
          routeId: 'nasa-sources',
          targetId: s.id
        });
      }
    }

    // Search Investigations
    for (const inv of MOCK_INVESTIGATIONS) {
      if (inv.title.toLowerCase().includes(clean) || inv.assignedPhysician.toLowerCase().includes(clean)) {
        results.push({
          id: `search-inv-${inv.id}`,
          category: 'Investigation',
          title: inv.title,
          subtitle: `${inv.astronautName} • Priority: ${inv.priority.toUpperCase()} (${inv.status})`,
          routeId: 'investigations',
          targetId: inv.id
        });
      }
    }

    return results;
  }
}

export const dataProvider = new MockAstroCareDataProvider();
