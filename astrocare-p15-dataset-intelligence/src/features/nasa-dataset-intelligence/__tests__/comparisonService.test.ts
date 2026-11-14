import { describe, it, expect } from 'vitest';
import { DatasetComparisonService } from '../services/datasetComparisonService';
import { BENCHMARK_NASA_DATASETS } from '../data/benchmarkDatasets';
import { BENCHMARK_VARIABLES } from '../data/demoObservations';

describe('DatasetComparisonService (Scientific Integrity)', () => {
  const osd575 = BENCHMARK_NASA_DATASETS.find(d => d.studyId === 'OSD-575')!;
  const osd53 = BENCHMARK_NASA_DATASETS.find(d => d.studyId === 'OSD-53')!;
  const osd4 = BENCHMARK_NASA_DATASETS.find(d => d.studyId === 'OSD-4')!; // Mus musculus
  const osd2 = BENCHMARK_NASA_DATASETS.find(d => d.studyId === 'OSD-2')!; // Cell culture

  it('permits comparison between homogeneous human astronaut spaceflight cohorts', () => {
    const report = DatasetComparisonService.evaluateCompatibility([osd575, osd53]);
    expect(report.checks.organismCheck.passed).toBe(true);
    expect(report.checks.populationCheck.passed).toBe(true);
    expect(report.allowDirectNumericalMerge).toBe(true);
    expect(report.blockingReasons.length).toBe(0);
  });

  it('strictly blocks direct numerical merging between human and rodent animal models', () => {
    const report = DatasetComparisonService.evaluateCompatibility([osd575, osd4]);
    expect(report.checks.organismCheck.passed).toBe(false);
    expect(report.allowDirectNumericalMerge).toBe(false);
    expect(report.status).toBe('INCOMPATIBLE');
    expect(report.blockingReasons.some(r => r.includes('Cross-species divergence'))).toBe(true);
  });

  it('strictly blocks direct numerical merging between human flight astronaut and in vitro cell lines', () => {
    const report = DatasetComparisonService.evaluateCompatibility([osd575, osd2]);
    expect(report.checks.populationCheck.passed).toBe(false);
    expect(report.allowDirectNumericalMerge).toBe(false);
    expect(report.status).toBe('INCOMPATIBLE');
    expect(report.blockingReasons.some(r => r.includes('Incompatible study models'))).toBe(true);
  });
});
