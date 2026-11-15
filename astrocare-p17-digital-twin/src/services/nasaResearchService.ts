import { NasaResearchStudy } from '../types';
import { NASA_RESEARCH_STUDIES } from '../data/nasaResearchData';

class NasaResearchService {
  public getAll(): NasaResearchStudy[] {
    return NASA_RESEARCH_STUDIES;
  }

  public getBySystem(system: string): NasaResearchStudy[] {
    return NASA_RESEARCH_STUDIES.filter((s) => s.physiologicalSystem === system);
  }

  public search(query: string, systemFilter?: string): NasaResearchStudy[] {
    const q = query.toLowerCase().trim();
    return NASA_RESEARCH_STUDIES.filter((study) => {
      const matchesSystem = !systemFilter || systemFilter === 'all' || study.physiologicalSystem === systemFilter;
      if (!matchesSystem) return false;

      if (!q) return true;
      return (
        study.title.toLowerCase().includes(q) ||
        study.accessionNumber.toLowerCase().includes(q) ||
        study.keyFindings.some((f) => f.toLowerCase().includes(q)) ||
        study.sourceRepository.toLowerCase().includes(q)
      );
    });
  }

  public getById(id: string): NasaResearchStudy | undefined {
    return NASA_RESEARCH_STUDIES.find((s) => s.id === id);
  }
}

export const nasaResearchService = new NasaResearchService();
