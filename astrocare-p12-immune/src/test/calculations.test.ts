import { describe, it, expect } from 'vitest';
import {
  calculateAbsoluteChange,
  calculatePercentChange,
  evaluateReferenceInterval,
  determineMonitoringState,
  generateCsv,
} from '../utils/calculations';

describe('Biomedical Calculations & Metrology Suite', () => {
  it('calculates absolute change accurately', () => {
    expect(calculateAbsoluteChange(6.4, 1.4)).toBe(5.0);
    expect(calculateAbsoluteChange(1.8, 2.2)).toBe(-0.4);
    expect(calculateAbsoluteChange(null, 1.4)).toBeNull();
    expect(calculateAbsoluteChange(6.4, undefined)).toBeNull();
  });

  it('calculates percent change correctly when baseline is non-zero', () => {
    // 1.4 -> 6.4: ((6.4 - 1.4) / 1.4) * 100 = 357.1%
    expect(calculatePercentChange(6.4, 1.4)).toBe(357.1);
    expect(calculatePercentChange(10, 20)).toBe(-50.0);
  });

  it('safely handles zero baseline values without division-by-zero or NaN errors', () => {
    expect(calculatePercentChange(84, 0)).toBeNull();
    expect(calculatePercentChange(0, 0)).toBeNull();
    expect(calculatePercentChange(50, null)).toBeNull();
  });

  it('evaluates values against clinical reference intervals', () => {
    expect(evaluateReferenceInterval(7.0, 4.5, 11.0)).toBe('WITHIN_REFERENCE');
    expect(evaluateReferenceInterval(3.2, 4.5, 11.0)).toBe('BELOW_REFERENCE');
    expect(evaluateReferenceInterval(14.8, 4.5, 11.0)).toBe('ABOVE_REFERENCE');
    expect(evaluateReferenceInterval(NaN, 4.5, 11.0)).toBe('NOT_AVAILABLE');
  });

  it('determines monitoring states with baseline deviations', () => {
    // Within limits, minor baseline change
    expect(determineMonitoringState(5.0, 4.0, 10.0, 5.0)).toBe('NORMAL');
    // Moderately above high limit
    expect(determineMonitoringState(12.0, 4.0, 10.0, 5.0)).toBe('WARNING');
    // Far above high limit (>50% of range above high)
    expect(determineMonitoringState(18.0, 4.0, 10.0, 5.0)).toBe('CRITICAL');
  });

  it('generates standard RFC-4180 CSV with quotes escaping', () => {
    const data = [
      { id: 'RES-1', analyte: 'IL-6, Serum', value: 6.4, unit: 'pg/mL' },
      { id: 'RES-2', analyte: 'hs-CRP "High"', value: 3.42, unit: 'mg/L' },
    ];
    const csv = generateCsv(data, [
      { key: 'id', header: 'ID' },
      { key: 'analyte', header: 'Analyte' },
      { key: 'value', header: 'Value' },
      { key: 'unit', header: 'Unit' },
    ]);

    expect(csv).toContain('"ID","Analyte","Value","Unit"');
    expect(csv).toContain('"RES-1","IL-6, Serum","6.4","pg/mL"');
    expect(csv).toContain('"RES-2","hs-CRP ""High""","3.42","mg/L"');
  });
});
