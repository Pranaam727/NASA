import { describe, it, expect } from 'vitest';
import { BiomedicalValidator } from '../../../src/validation/biomedical/BiomedicalValidator';
import {
  SYNTHETIC_TELEMETRY_SERIES,
  SYNTHETIC_ANOMALOUS_RECORDS,
} from '../../../src/fixtures';
import { TelemetryRecord } from '../../../src/types/biomedical';

describe('BiomedicalValidator Engine', () => {
  const validator = new BiomedicalValidator();

  it('successfully validates nominal astronaut telemetry series', () => {
    const result = validator.validate(SYNTHETIC_TELEMETRY_SERIES);
    expect(result.isValid).toBe(true);
    expect(result.schemaErrors).toHaveLength(0);
    expect(result.passedRecords).toBe(SYNTHETIC_TELEMETRY_SERIES.length);
  });

  it('rejects physically impossible SpO2 values (> 100%)', () => {
    const invalidRecord = SYNTHETIC_ANOMALOUS_RECORDS[0]; // 105%
    const result = validator.validate(invalidRecord);

    expect(result.isValid).toBe(false);
    expect(result.schemaErrors.some((e) => e.code === 'PHYSICAL_LIMIT_EXCEEDED')).toBe(true);
  });

  it('detects incompatible measurement units (e.g., heart rate in mmHg)', () => {
    const badUnitRecord = SYNTHETIC_ANOMALOUS_RECORDS[1];
    const result = validator.validate(badUnitRecord);

    expect(result.isValid).toBe(false);
    expect(result.schemaErrors.some((e) => e.code === 'INCOMPATIBLE_UNIT')).toBe(true);
  });

  it('flags abrupt physiological rate-of-change spikes as quality warnings', () => {
    const spikeRecords = [SYNTHETIC_ANOMALOUS_RECORDS[2], SYNTHETIC_ANOMALOUS_RECORDS[3]];
    const result = validator.validate(spikeRecords);

    expect(result.qualityWarnings.some((w) => w.code === 'IMPLAUSIBLE_RATE_OF_CHANGE')).toBe(true);
  });

  it('enforces non-diagnostic invariant across all validation findings', () => {
    const allRecords = [...SYNTHETIC_TELEMETRY_SERIES, ...SYNTHETIC_ANOMALOUS_RECORDS];
    const result = validator.validate(allRecords);

    const issues = [
      ...result.schemaErrors,
      ...result.qualityWarnings,
      ...result.operationalAlerts,
      ...result.clinicalIntervalFindings,
    ];

    for (const issue of issues) {
      expect(issue.isDiagnostic).toBe(false);
    }
  });

  it('flags missing values and null telemetry records', () => {
    const nullValRecord: TelemetryRecord = {
      recordId: 'REC-NULL-01',
      astronautId: 'ASTRO-01',
      missionId: 'MISSION-ARTEMIS',
      timestamp: new Date().toISOString(),
      metricType: 'heart_rate',
      value: null as any,
      unit: 'bpm',
      sourceDevice: 'Sensor',
    };

    const result = validator.validate(nullValRecord);
    expect(result.isValid).toBe(false);
    expect(result.missingValuesCount).toBe(1);
    expect(result.schemaErrors.some((e) => e.code === 'MISSING_VALUE')).toBe(true);
  });

  it('identifies duplicate telemetry records by recordId and composite key', () => {
    const dupes = [
      SYNTHETIC_TELEMETRY_SERIES[0],
      { ...SYNTHETIC_TELEMETRY_SERIES[0] }, // Exact duplicate
    ];

    const result = validator.validate(dupes);
    expect(result.duplicateCount).toBe(1);
    expect(result.qualityWarnings.some((w) => w.code === 'DUPLICATE_RECORD_ID')).toBe(true);
  });
});
