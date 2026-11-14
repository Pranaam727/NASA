import { useState, useMemo } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { MeasurementVariable } from '../types/observation.types';
import { ScientificCompatibilityReport } from '../types/comparison.types';
import { DatasetComparisonService } from '../services/datasetComparisonService';
import { BENCHMARK_NASA_DATASETS } from '../data/benchmarkDatasets';
import { BENCHMARK_VARIABLES } from '../data/demoObservations';

export function useDatasetComparison(initialSelectedIds: string[] = ['OSD-575', 'OSD-53']) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [selectedVarId, setSelectedVarId] = useState<string>('var-il6');

  const selectedDatasets: DatasetRecord[] = useMemo(() => {
    return selectedIds
      .map(id => BENCHMARK_NASA_DATASETS.find(d => d.studyId === id))
      .filter((d): d is DatasetRecord => Boolean(d));
  }, [selectedIds]);

  const selectedVariable: MeasurementVariable | undefined = useMemo(() => {
    return BENCHMARK_VARIABLES.find(v => v.variableId === selectedVarId);
  }, [selectedVarId]);

  const compatibilityReport: ScientificCompatibilityReport = useMemo(() => {
    return DatasetComparisonService.evaluateCompatibility(selectedDatasets, selectedVariable);
  }, [selectedDatasets, selectedVariable]);

  const toggleDataset = (studyId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(studyId)) {
        return prev.filter(id => id !== studyId);
      } else {
        return [...prev, studyId];
      }
    });
  };

  const removeDataset = (studyId: string) => {
    setSelectedIds(prev => prev.filter(id => id !== studyId));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    selectedDatasets,
    selectedVarId,
    selectedVariable,
    compatibilityReport,
    toggleDataset,
    removeDataset,
    clearAll,
    setSelectedVarId
  };
}
