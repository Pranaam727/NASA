/**
 * AstroCare Biomedical Types and Profile Definitions
 * Differentiates schema validation, data-quality warnings,
 * operational thresholds, and clinically established reference intervals.
 */

export type BiomedicalMetricType =
  | 'heart_rate'
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic'
  | 'oxygen_saturation'
  | 'respiratory_rate'
  | 'body_temperature'
  | 'sleep_duration'
  | 'bone_mineral_density'
  | 'muscle_mass'
  | 'blood_biomarker_cortisol'
  | 'blood_biomarker_ferritin'
  | 'blood_biomarker_ck'
  | 'radiation_absorbed_dose'
  | 'radiation_equivalent_dose';

export type MeasurementUnit =
  | 'bpm'
  | 'mmHg'
  | '%'
  | 'breaths/min'
  | 'degC'
  | 'degF'
  | 'hours'
  | 'g/cm2'
  | 'kg'
  | 'ug/dL'
  | 'ng/mL'
  | 'U/L'
  | 'mGy'
  | 'Gy'
  | 'mSv'
  | 'Sv';

export interface TelemetryRecord {
  recordId: string;
  astronautId: string;
  missionId: string;
  timestamp: string; // ISO 8601
  metricType: BiomedicalMetricType;
  value: number;
  unit: MeasurementUnit;
  sourceDevice: string;
  samplingFrequencyHz?: number;
  qualityFlag?: 'NOMINAL' | 'SUSPECT' | 'INVALID' | 'CALIBRATION';
  metadata?: Record<string, unknown>;
}

export interface MetricValidationProfile {
  metricType: BiomedicalMetricType;
  expectedUnit: MeasurementUnit;
  allowedAlternativeUnits?: MeasurementUnit[];
  // Physical impossibilities (e.g. negative SpO2 or HR > 300)
  absoluteMin: number;
  absoluteMax: number;
  // Clinical reference intervals (general population / astronaut standard baseline)
  referenceMin?: number;
  referenceMax?: number;
  // Configurable operational mission limits (flight surgeon warning bands)
  operationalMin?: number;
  operationalMax?: number;
  // Maximum plausible rate of change per minute (for spike / noise detection)
  maxPlausibleDeltaPerMinute?: number;
  notes?: string;
}

export type ValidationSeverity = 'ERROR' | 'WARNING' | 'INFO';

export interface BiomedicalValidationIssue {
  code: string;
  metricType: BiomedicalMetricType;
  field?: string;
  message: string;
  severity: ValidationSeverity;
  observedValue?: unknown;
  expectedConstraint?: string;
  recommendation: string;
  isDiagnostic: false; // Safety rule: Never auto-diagnose an astronaut!
}

export interface BiomedicalValidationResult {
  isValid: boolean;
  totalRecordsChecked: number;
  passedRecords: number;
  schemaErrors: BiomedicalValidationIssue[];
  qualityWarnings: BiomedicalValidationIssue[];
  operationalAlerts: BiomedicalValidationIssue[];
  clinicalIntervalFindings: BiomedicalValidationIssue[];
  duplicateCount: number;
  missingValuesCount: number;
}
