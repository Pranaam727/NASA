/**
 * AstroCare Biomedical Validator
 * Strictly separates:
 * 1. Schema validation (fatal data errors)
 * 2. Data quality warnings (anomalous deltas, duplicate records, missing flags)
 * 3. Operational thresholds (mission flight rules)
 * 4. Clinical reference intervals (physiological baselines)
 *
 * SAFETY PRINCIPLE: Never automatically diagnoses medical conditions.
 */

import {
  TelemetryRecord,
  BiomedicalValidationResult,
  BiomedicalValidationIssue,
  MetricValidationProfile,
} from '../../types/biomedical';
import { BIOMEDICAL_PROFILES } from './profiles';

export class BiomedicalValidator {
  private customProfiles: Map<string, MetricValidationProfile> = new Map();

  constructor(customProfiles?: Record<string, MetricValidationProfile>) {
    if (customProfiles) {
      Object.entries(customProfiles).forEach(([k, v]) => {
        this.customProfiles.set(k, v);
      });
    }
  }

  public getProfile(metricType: string): MetricValidationProfile | undefined {
    return this.customProfiles.get(metricType) || (BIOMEDICAL_PROFILES as any)[metricType];
  }

  /**
   * Validate a single telemetry record or a stream of telemetry records
   */
  public validate(records: TelemetryRecord | TelemetryRecord[]): BiomedicalValidationResult {
    const recordList = Array.isArray(records) ? records : [records];
    const schemaErrors: BiomedicalValidationIssue[] = [];
    const qualityWarnings: BiomedicalValidationIssue[] = [];
    const operationalAlerts: BiomedicalValidationIssue[] = [];
    const clinicalIntervalFindings: BiomedicalValidationIssue[] = [];

    const seenIds = new Set<string>();
    const seenCompositeKeys = new Set<string>();
    let duplicateCount = 0;
    let missingValuesCount = 0;

    // Sort temporally per astronaut to perform rate-of-change delta validation
    const astronautStreams = new Map<string, TelemetryRecord[]>();

    for (const record of recordList) {
      // 1. Schema Validation Checks
      if (!record) {
        schemaErrors.push({
          code: 'NULL_RECORD',
          metricType: 'heart_rate',
          message: 'Telemetry record is null or undefined.',
          severity: 'ERROR',
          recommendation: 'Reject malformed null payload at ingestion layer.',
          isDiagnostic: false,
        });
        continue;
      }

      if (!record.recordId || typeof record.recordId !== 'string') {
        schemaErrors.push({
          code: 'MISSING_RECORD_ID',
          metricType: record.metricType || 'heart_rate',
          field: 'recordId',
          message: 'Record missing required recordId string identifier.',
          severity: 'ERROR',
          recommendation: 'Ensure all ingested telemetry records provide a unique UUID.',
          isDiagnostic: false,
        });
      }

      if (!record.astronautId || typeof record.astronautId !== 'string') {
        schemaErrors.push({
          code: 'MISSING_ASTRONAUT_ID',
          metricType: record.metricType,
          field: 'astronautId',
          message: 'Record missing astronaut identifier.',
          severity: 'ERROR',
          recommendation: 'Correlate telemetry packet with active mission crew manifest.',
          isDiagnostic: false,
        });
      }

      if (!record.missionId || typeof record.missionId !== 'string') {
        schemaErrors.push({
          code: 'MISSING_MISSION_ID',
          metricType: record.metricType,
          field: 'missionId',
          message: 'Record missing mission identifier.',
          severity: 'ERROR',
          recommendation: 'Tag telemetry with active mission ID (e.g., ISS-EXP-71, ARTEMIS-II).',
          isDiagnostic: false,
        });
      }

      // Timestamp validity
      if (!record.timestamp || isNaN(Date.parse(record.timestamp))) {
        schemaErrors.push({
          code: 'INVALID_TIMESTAMP',
          metricType: record.metricType,
          field: 'timestamp',
          observedValue: record.timestamp,
          message: 'Timestamp is missing or is not a valid ISO 8601 date string.',
          severity: 'ERROR',
          recommendation: 'Use UTC ISO-8601 formatted timestamps (YYYY-MM-DDTHH:mm:ss.sssZ).',
          isDiagnostic: false,
        });
      }

      // Value validity
      if (record.value === undefined || record.value === null) {
        missingValuesCount++;
        schemaErrors.push({
          code: 'MISSING_VALUE',
          metricType: record.metricType,
          field: 'value',
          message: 'Telemetry value is null or undefined.',
          severity: 'ERROR',
          recommendation: 'Handle sensor dropouts via explicit imputation or gap flagging.',
          isDiagnostic: false,
        });
        continue;
      }

      if (typeof record.value !== 'number' || isNaN(record.value) || !isFinite(record.value)) {
        schemaErrors.push({
          code: 'NAN_VALUE',
          metricType: record.metricType,
          field: 'value',
          observedValue: record.value,
          message: `Value must be a finite numerical representation, received: ${record.value}.`,
          severity: 'ERROR',
          recommendation: 'Reject non-finite sensor values.',
          isDiagnostic: false,
        });
        continue;
      }

      // Check duplicates
      if (record.recordId) {
        if (seenIds.has(record.recordId)) {
          duplicateCount++;
          qualityWarnings.push({
            code: 'DUPLICATE_RECORD_ID',
            metricType: record.metricType,
            observedValue: record.recordId,
            message: `Duplicate recordId detected: ${record.recordId}.`,
            severity: 'WARNING',
            recommendation: 'Deduplicate incoming telemetry streams by recordId.',
            isDiagnostic: false,
          });
        } else {
          seenIds.add(record.recordId);
        }
      }

      // Check duplicate composite key (astronautId + metricType + timestamp)
      const compositeKey = `${record.astronautId}_${record.metricType}_${record.timestamp}`;
      if (seenCompositeKeys.has(compositeKey)) {
        qualityWarnings.push({
          code: 'DUPLICATE_SAMPLE_TIMESTAMP',
          metricType: record.metricType,
          message: `Multiple telemetry samples for astronaut ${record.astronautId} and metric ${record.metricType} at timestamp ${record.timestamp}.`,
          severity: 'WARNING',
          recommendation: 'Validate telemetry ingestion stream rate or apply downsampling filter.',
          isDiagnostic: false,
        });
      } else {
        seenCompositeKeys.add(compositeKey);
      }

      // 2. Profile Validation (Physics, Clinical, Operational)
      const profile = this.getProfile(record.metricType);
      if (!profile) {
        qualityWarnings.push({
          code: 'UNKNOWN_METRIC_PROFILE',
          metricType: record.metricType,
          message: `No validation profile found for metric "${record.metricType}".`,
          severity: 'WARNING',
          recommendation: 'Register custom validation profile or verify metric spelling.',
          isDiagnostic: false,
        });
      } else {
        // Unit consistency
        const allowedUnits = [profile.expectedUnit, ...(profile.allowedAlternativeUnits || [])];
        if (!allowedUnits.includes(record.unit)) {
          schemaErrors.push({
            code: 'INCOMPATIBLE_UNIT',
            metricType: record.metricType,
            field: 'unit',
            observedValue: record.unit,
            expectedConstraint: allowedUnits.join(' | '),
            message: `Invalid unit "${record.unit}" for metric "${record.metricType}". Expected: ${allowedUnits.join(' or ')}.`,
            severity: 'ERROR',
            recommendation: 'Perform standardized unit conversion before ingestion.',
            isDiagnostic: false,
          });
        }

        // Physical Impossibility (Schema Error)
        if (record.value < profile.absoluteMin || record.value > profile.absoluteMax) {
          schemaErrors.push({
            code: 'PHYSICAL_LIMIT_EXCEEDED',
            metricType: record.metricType,
            observedValue: record.value,
            expectedConstraint: `[${profile.absoluteMin}, ${profile.absoluteMax}] ${record.unit}`,
            message: `Value ${record.value} ${record.unit} exceeds physical physiological limits [${profile.absoluteMin}, ${profile.absoluteMax}].`,
            severity: 'ERROR',
            recommendation: 'Mark reading as SENSOR_MALFUNCTION; do not feed into clinical decision algorithms.',
            isDiagnostic: false,
          });
        }

        // Operational Limits (Flight Rules Alert)
        if (
          profile.operationalMin !== undefined &&
          profile.operationalMax !== undefined &&
          (record.value < profile.operationalMin || record.value > profile.operationalMax)
        ) {
          operationalAlerts.push({
            code: 'OPERATIONAL_THRESHOLD_EXCEEDED',
            metricType: record.metricType,
            observedValue: record.value,
            expectedConstraint: `[${profile.operationalMin}, ${profile.operationalMax}] ${record.unit}`,
            message: `Value ${record.value} ${record.unit} is outside operational flight rule envelope [${profile.operationalMin}, ${profile.operationalMax}].`,
            severity: 'WARNING',
            recommendation: 'Notify Flight Surgeon console for mission context review.',
            isDiagnostic: false,
          });
        }

        // Clinical Reference Intervals (Non-diagnostic informative finding)
        if (
          profile.referenceMin !== undefined &&
          profile.referenceMax !== undefined &&
          (record.value < profile.referenceMin || record.value > profile.referenceMax)
        ) {
          clinicalIntervalFindings.push({
            code: 'OUTSIDE_CLINICAL_REFERENCE',
            metricType: record.metricType,
            observedValue: record.value,
            expectedConstraint: `Standard baseline: [${profile.referenceMin}, ${profile.referenceMax}] ${record.unit}`,
            message: `Observation ${record.value} ${record.unit} deviates from standard resting reference interval [${profile.referenceMin}, ${profile.referenceMax}].`,
            severity: 'INFO',
            recommendation: 'Correlate with astronaut baseline; this is an observation, NOT an automated diagnosis.',
            isDiagnostic: false,
          });
        }
      }

      // Group for rate-of-change check
      const groupKey = `${record.astronautId}_${record.metricType}`;
      if (!astronautStreams.has(groupKey)) {
        astronautStreams.set(groupKey, []);
      }
      astronautStreams.get(groupKey)!.push(record);
    }

    // 3. Sequential Rate-of-Change (Spike) Analysis
    for (const [key, stream] of astronautStreams.entries()) {
      if (stream.length < 2) continue;
      // Sort chronologically
      stream.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

      const metricType = stream[0].metricType;
      const profile = this.getProfile(metricType);
      if (!profile || !profile.maxPlausibleDeltaPerMinute) continue;

      for (let i = 1; i < stream.length; i++) {
        const prev = stream[i - 1];
        const curr = stream[i];
        const timeDiffMinutes = (Date.parse(curr.timestamp) - Date.parse(prev.timestamp)) / 60000;

        if (timeDiffMinutes > 0 && timeDiffMinutes <= 5) {
          const delta = Math.abs(curr.value - prev.value);
          const deltaPerMinute = delta / timeDiffMinutes;

          if (deltaPerMinute > profile.maxPlausibleDeltaPerMinute) {
            qualityWarnings.push({
              code: 'IMPLAUSIBLE_RATE_OF_CHANGE',
              metricType,
              observedValue: deltaPerMinute,
              expectedConstraint: `< ${profile.maxPlausibleDeltaPerMinute} per min`,
              message: `Abrupt rate of change detected for ${key}: ${delta.toFixed(1)} ${curr.unit} change in ${(timeDiffMinutes * 60).toFixed(0)}s (${deltaPerMinute.toFixed(1)}/min).`,
              severity: 'WARNING',
              recommendation: 'Check for sensor detachment, movement artifact, or transmission glitch.',
              isDiagnostic: false,
            });
          }
        }
      }
    }

    const isValid = schemaErrors.length === 0;
    const passedRecords = recordList.length - schemaErrors.length;

    return {
      isValid,
      totalRecordsChecked: recordList.length,
      passedRecords: Math.max(0, passedRecords),
      schemaErrors,
      qualityWarnings,
      operationalAlerts,
      clinicalIntervalFindings,
      duplicateCount,
      missingValuesCount,
    };
  }
}
