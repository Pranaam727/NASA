import { NASA_RISK_CATEGORIES } from '../data/nasaRiskCategories';
import { NASA_EVIDENCE_LIBRARY } from '../data/nasaEvidenceLibrary';
import { NASA_MITIGATION_STRATEGIES } from '../data/nasaMitigations';
import { RiskCategory, RiskComparisonResult } from '../types/risk.types';
import { ResearchEvidence, EvidenceFilterState } from '../types/evidence.types';
import { MitigationStrategy } from '../types/mitigation.types';

export class NasaResearchService {
  /**
   * Retrieve all defined NASA Human-Spaceflight Risk categories.
   */
  public static getAllRiskCategories(): RiskCategory[] {
    return [...NASA_RISK_CATEGORIES];
  }

  /**
   * Get a risk category by its unique ID or HRP Risk Code.
   */
  public static getRiskCategoryById(idOrCode: string): RiskCategory | undefined {
    return NASA_RISK_CATEGORIES.find(
      c => c.id.toLowerCase() === idOrCode.toLowerCase() || c.code.toLowerCase() === idOrCode.toLowerCase()
    );
  }

  /**
   * Get all research evidence records associated with a risk category.
   */
  public static getEvidenceForCategory(riskIdOrCode: string): ResearchEvidence[] {
    const category = this.getRiskCategoryById(riskIdOrCode);
    if (!category) return [];

    return NASA_EVIDENCE_LIBRARY.filter(
      ev => ev.relatedRiskIds.includes(category.code) || category.evidenceIds.includes(ev.id)
    );
  }

  /**
   * Get all documented mitigation strategies for a risk category.
   */
  public static getMitigationsForCategory(riskIdOrCode: string): MitigationStrategy[] {
    const category = this.getRiskCategoryById(riskIdOrCode);
    if (!category) return [];

    return NASA_MITIGATION_STRATEGIES.filter(
      mit => mit.targetRiskIds.includes(category.code) || category.mitigationIds.includes(mit.id)
    );
  }

  /**
   * Retrieve all research evidence records.
   */
  public static getAllEvidence(): ResearchEvidence[] {
    return [...NASA_EVIDENCE_LIBRARY];
  }

  /**
   * Filter and sort research evidence based on multi-dimensional criteria.
   */
  public static filterEvidence(filters: Partial<EvidenceFilterState>): ResearchEvidence[] {
    return NASA_EVIDENCE_LIBRARY.filter(item => {
      // Search query across title, methodology, findings, and limitations
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesText = 
          item.title.toLowerCase().includes(query) ||
          item.evidenceCode.toLowerCase().includes(query) ||
          item.methodology.toLowerCase().includes(query) ||
          item.findings.toLowerCase().includes(query) ||
          item.organism.toLowerCase().includes(query) ||
          item.limitations.toLowerCase().includes(query);
        if (!matchesText) return false;
      }

      // Risk Category
      if (filters.riskCategory && filters.riskCategory !== 'ALL') {
        if (!item.relatedRiskIds.includes(filters.riskCategory)) return false;
      }

      // Study Classification
      if (filters.studyClassification && filters.studyClassification !== 'ALL') {
        if (item.studyType !== filters.studyClassification) return false;
      }

      // Organism
      if (filters.organismFilter && filters.organismFilter !== 'ALL') {
        if (filters.organismFilter === 'Human' && !item.organism.toLowerCase().includes('homo sapiens')) return false;
        if (filters.organismFilter === 'Animal' && !item.organism.toLowerCase().includes('mus') && !item.organism.toLowerCase().includes('rattus')) return false;
        if (filters.organismFilter === 'Cell' && !item.studyType.includes('cell')) return false;
      }

      // Direct Human Evidence only
      if (filters.hasDirectHumanOnly && !item.isDirectHumanEvidence) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      if (filters.sortBy === 'date') {
        return (new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()) * (filters.sortOrder === 'asc' ? -1 : 1);
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title) * order;
      }
      return 0;
    });
  }

  /**
   * Retrieve all documented NASA mitigation strategies.
   */
  public static getAllMitigations(): MitigationStrategy[] {
    return [...NASA_MITIGATION_STRATEGIES];
  }

  /**
   * Filter mitigation strategies.
   */
  public static filterMitigations(params: {
    category?: string;
    readiness?: string;
    targetRisk?: string;
    searchQuery?: string;
  }): MitigationStrategy[] {
    return NASA_MITIGATION_STRATEGIES.filter(mit => {
      if (params.searchQuery && params.searchQuery.trim() !== '') {
        const q = params.searchQuery.toLowerCase();
        const matches = 
          mit.title.toLowerCase().includes(q) ||
          mit.scientificRationale.toLowerCase().includes(q) ||
          mit.protocolDescription.toLowerCase().includes(q) ||
          mit.code.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (params.category && params.category !== 'ALL') {
        if (mit.category !== params.category) return false;
      }

      if (params.readiness && params.readiness !== 'ALL') {
        if (mit.readiness !== params.readiness) return false;
      }

      if (params.targetRisk && params.targetRisk !== 'ALL') {
        if (!mit.targetRiskIds.includes(params.targetRisk)) return false;
      }

      return true;
    });
  }

  /**
   * Compare two or more health risk categories.
   */
  public static compareRiskCategories(categoryIds: string[]): RiskComparisonResult {
    const selected = NASA_RISK_CATEGORIES.filter(c => categoryIds.includes(c.id) || categoryIds.includes(c.code));
    
    // Find common systems
    const systemCounts: Record<string, number> = {};
    selected.forEach(cat => {
      cat.physiologicalSystem.forEach(sys => {
        systemCounts[sys] = (systemCounts[sys] || 0) + 1;
      });
    });
    const commonAffectedSystems = Object.keys(systemCounts).filter(sys => systemCounts[sys] > 1);

    // Divergent mechanisms
    const divergentMechanisms = selected.map(cat => ({
      categoryId: cat.code,
      mechanisms: cat.mechanisms.map(m => m.name)
    }));

    // Evidence breakdown by study type
    const evidenceBreakdown = selected.map(cat => {
      const evs = this.getEvidenceForCategory(cat.code);
      const studyTypes: Record<string, number> = {};
      evs.forEach(ev => {
        studyTypes[ev.studyType] = (studyTypes[ev.studyType] || 0) + 1;
      });
      return {
        categoryId: cat.code,
        studyTypes
      };
    });

    // Shared mitigations
    const allMitigations = selected.flatMap(cat => this.getMitigationsForCategory(cat.code));
    const mitCounts: Record<string, number> = {};
    allMitigations.forEach(m => {
      mitCounts[m.title] = (mitCounts[m.title] || 0) + 1;
    });
    const sharedMitigations = Object.keys(mitCounts).filter(title => mitCounts[title] > 1);

    // Mission vulnerability matrix
    const missionVulnerabilityMatrix = selected.map(cat => ({
      category: cat.title,
      leoSeverity: (cat.code === 'RAD' ? 'LOW' : cat.code === 'BONE' || cat.code === 'CARDIO' ? 'MODERATE' : 'MODERATE') as any,
      lunarSeverity: (cat.code === 'RAD' ? 'HIGH' : cat.code === 'BONE' ? 'MODERATE' : 'HIGH') as any,
      marsSeverity: (cat.code === 'RAD' || cat.code === 'SANS' || cat.code === 'BEHAVIOR' ? 'CRITICAL' : 'HIGH') as any,
    }));

    return {
      categories: selected,
      commonAffectedSystems,
      divergentMechanisms,
      evidenceBreakdown,
      sharedMitigations,
      missionVulnerabilityMatrix
    };
  }
}
