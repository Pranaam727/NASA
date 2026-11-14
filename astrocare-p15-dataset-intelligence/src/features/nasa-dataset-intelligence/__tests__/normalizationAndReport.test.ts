import { describe, it, expect } from 'vitest';
import { DataNormalizationService } from '../services/dataNormalizationService';
import { ReportExportService } from '../services/reportExportService';
import { BENCHMARK_NASA_DATASETS } from '../data/benchmarkDatasets';
import { BENCHMARK_OBSERVATIONS, BENCHMARK_VARIABLES } from '../data/demoObservations';

describe('DataNormalizationService & ReportExportService', () => {
  it('correctly maps iso-molar concentration units pg/mL and ng/L', () => {
    const res = DataNormalizationService.normalizeMeasurement(14.5, 'pg/mL', 'ng/L');
    expect(res.success).toBe(true);
    expect(res.convertedValue).toBe(14.5);
  });

  it('correctly converts cortisol µg/dL to nmol/L using hydrocortisone molecular mass', () => {
    const res = DataNormalizationService.normalizeMeasurement(10.0, 'µg/dL', 'nmol/L');
    expect(res.success).toBe(true);
    expect(res.convertedValue).toBe(275.86);
  });

  it('rejects cross-dimensional conversion between bone mineral density and cytokine concentration', () => {
    const res = DataNormalizationService.normalizeMeasurement(200, 'mg/cm³', 'pg/mL');
    expect(res.success).toBe(false);
    expect(res.notes).toContain('Cross-dimensional conversion violates scientific validity');
  });

  it('computes accurate cohort statistics', () => {
    const values = [10, 20, 30, 40, 50];
    const stats = DataNormalizationService.calculateCohortStats(values);
    expect(stats.count).toBe(5);
    expect(stats.mean).toBe(30);
    expect(stats.median).toBe(30);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(50);
  });

  it('builds comprehensive research report data with correct metadata breakdown', () => {
    const report = ReportExportService.buildReportData(
      BENCHMARK_NASA_DATASETS.slice(0, 3),
      BENCHMARK_OBSERVATIONS,
      BENCHMARK_VARIABLES
    );
    expect(report.selectedStudies.length).toBe(3);
    expect(report.populationBreakdown.humans).toBeGreaterThan(0);
    expect(report.dataAvailabilityAudit.totalFiles).toBeGreaterThan(0);
  });

  it('exports structured markdown containing executive summary and limitations', () => {
    const report = ReportExportService.buildReportData(
      [BENCHMARK_NASA_DATASETS[0]],
      BENCHMARK_OBSERVATIONS,
      BENCHMARK_VARIABLES
    );
    const md = ReportExportService.exportToMarkdown(report);
    expect(md).toContain('# AstroCare Biomedical Intelligence Briefing');
    expect(md).toContain('## 1. Executive Summary');
    expect(md).toContain('## 7. Scientific Limitations & Risk Assessment');
  });

  it('exports valid CSV formatted observations', () => {
    const csv = ReportExportService.exportObservationsToCSV(BENCHMARK_OBSERVATIONS.slice(0, 3));
    expect(csv).toContain('Observation ID,Study ID,Variable ID');
    expect(csv).toContain('OSD-575');
    expect(csv.split('\n').length).toBe(4); // Header + 3 rows
  });
});
