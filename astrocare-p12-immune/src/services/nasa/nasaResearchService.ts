import { NASAResearchRecord, StudyCategory, ResearchTopic } from '../../types';
import { OSDR_DATASETS, OFFICIAL_NASA_RESOURCES, IMMUNE_INSIGHT_TOPICS } from '../../constants/nasaResourcesData';

const SAVED_RESEARCH_KEY = 'astrocare_p12_saved_research_v1';

class NASAResearchService {
  private datasets: NASAResearchRecord[] = [];
  private savedIds: Set<string> = new Set();

  constructor() {
    this.datasets = [...OSDR_DATASETS];
    this.initSaved();
  }

  private initSaved(): void {
    try {
      const stored = localStorage.getItem(SAVED_RESEARCH_KEY);
      if (stored) {
        this.savedIds = new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read saved research', e);
    }
  }

  private persistSaved(): void {
    try {
      localStorage.setItem(SAVED_RESEARCH_KEY, JSON.stringify(Array.from(this.savedIds)));
    } catch (e) {
      console.error('Failed to save research bookmarks', e);
    }
  }

  public getDatasets(filters?: {
    category?: StudyCategory | 'ALL';
    topic?: ResearchTopic | 'ALL';
    searchTerm?: string;
    savedOnly?: boolean;
  }): NASAResearchRecord[] {
    let list = [...this.datasets];

    if (filters?.category && filters.category !== 'ALL') {
      list = list.filter((d) => d.category === filters.category);
    }

    if (filters?.topic && filters.topic !== 'ALL') {
      list = list.filter((d) => d.topics.includes(filters.topic as ResearchTopic));
    }

    if (filters?.savedOnly) {
      list = list.filter((d) => this.savedIds.has(d.id));
    }

    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      const q = filters.searchTerm.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.studyIdentifier.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.organism.toLowerCase().includes(q) ||
          d.assayType.toLowerCase().includes(q) ||
          d.sampleType.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getDatasetById(id: string): NASAResearchRecord | undefined {
    return this.datasets.find((d) => d.id === id || d.studyIdentifier === id);
  }

  public toggleSaveDataset(id: string): boolean {
    if (this.savedIds.has(id)) {
      this.savedIds.delete(id);
    } else {
      this.savedIds.add(id);
    }
    this.persistSaved();
    return this.savedIds.has(id);
  }

  public isSaved(id: string): boolean {
    return this.savedIds.has(id);
  }

  public getOfficialResources() {
    return OFFICIAL_NASA_RESOURCES;
  }

  public getInsightTopics() {
    return IMMUNE_INSIGHT_TOPICS;
  }
}

export const nasaResearchService = new NASAResearchService();
