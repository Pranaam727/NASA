import { useState, useMemo } from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { ResearchEvidence, EvidenceFilterState } from '../types/evidence.types';

export function useRiskEvidence(initialCategory: string = 'ALL') {
  const [filters, setFilters] = useState<EvidenceFilterState>({
    searchQuery: '',
    riskCategory: initialCategory,
    studyClassification: 'ALL',
    organismFilter: 'ALL',
    sourceOrg: 'ALL',
    yearRange: [2000, 2026],
    hasDirectHumanOnly: false,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [selectedEvidence, setSelectedEvidence] = useState<ResearchEvidence | null>(null);

  const filteredEvidence = useMemo(() => {
    return NasaResearchService.filterEvidence(filters);
  }, [filters]);

  const updateFilters = (newFilters: Partial<EvidenceFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      riskCategory: 'ALL',
      studyClassification: 'ALL',
      organismFilter: 'ALL',
      sourceOrg: 'ALL',
      yearRange: [2000, 2026],
      hasDirectHumanOnly: false,
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const evidenceStats = useMemo(() => {
    const total = filteredEvidence.length;
    const humanCount = filteredEvidence.filter(e => e.isDirectHumanEvidence).length;
    const analogCount = filteredEvidence.filter(e => e.studyType === 'ground_analog').length;
    const animalCount = filteredEvidence.filter(e => e.studyType === 'animal_model').length;
    const cellCount = filteredEvidence.filter(e => e.studyType === 'cell_culture').length;

    return {
      total,
      humanCount,
      analogCount,
      animalCount,
      cellCount
    };
  }, [filteredEvidence]);

  return {
    filters,
    updateFilters,
    resetFilters,
    filteredEvidence,
    selectedEvidence,
    setSelectedEvidence,
    evidenceStats
  };
}
