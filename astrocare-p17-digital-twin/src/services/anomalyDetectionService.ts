import {
  AnomalyRecord,
  AnomalySeverity,
  AnomalyReviewStatus,
} from '../types';
import { astronautProfileService } from './astronautProfileService';
import { measurementService } from './measurementService';
import { BIOMEDICAL_VARIABLE_REGISTRY } from '../utils/unitValidation';
import { safeStorage } from '../utils/safeStorage';

const STORAGE_KEY = 'astrocare_p17_anomalies';

export interface AnomalyDetectionConfig {
  zScoreThreshold: number; // e.g. 2.0 standard deviations
  rateOfChangeThresholdPercent: number; // e.g. 25% change between consecutive measurements
  flagMissingObservations: boolean;
}

const DEFAULT_CONFIG: AnomalyDetectionConfig = {
  zScoreThreshold: 2.0,
  rateOfChangeThresholdPercent: 20.0,
  flagMissingObservations: true,
};

class AnomalyDetectionService {
  private config: AnomalyDetectionConfig = { ...DEFAULT_CONFIG };

  public getConfig(): AnomalyDetectionConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AnomalyDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  private getStoredAnomalies(): AnomalyRecord[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read anomalies', e);
    }
    return [];
  }

  private saveAnomalies(anomalies: AnomalyRecord[]): void {
    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(anomalies));
    } catch (e) {
      console.error('Failed to save anomalies', e);
    }
  }

  /**
   * Scans astronaut observations using configurable analytical rules and compiles explainable anomaly records.
   */
  public runDetection(astronautId?: string): AnomalyRecord[] {
    const profiles = astronautId
      ? [astronautProfileService.getById(astronautId)].filter(Boolean)
      : astronautProfileService.getAll();

    const detected: AnomalyRecord[] = [];
    const stored = this.getStoredAnomalies();
    const storedStatusMap = new Map<string, { status: AnomalyReviewStatus; notes?: string }>();
    stored.forEach((a) => storedStatusMap.set(a.id, { status: a.status, notes: a.reviewerNotes }));

    profiles.forEach((profile) => {
      if (!profile) return;
      const measurements = measurementService.getByAstronaut(profile.id);

      // Group measurements by variable
      const grouped: Record<string, typeof measurements> = {};
      measurements.forEach((m) => {
        if (!grouped[m.variable]) grouped[m.variable] = [];
        grouped[m.variable].push(m);
      });

      Object.entries(grouped).forEach(([variableKey, items]) => {
        const sorted = [...items].sort((a, b) => a.missionDay - b.missionDay);
        const baselineObj = profile.baselineMeasurements[variableKey];
        const regDef = BIOMEDICAL_VARIABLE_REGISTRY[variableKey];
        const baselineVal = baselineObj?.baselineValue ?? (regDef ? (regDef.typicalPhysiologicalRange.min + regDef.typicalPhysiologicalRange.max) / 2 : 50);
        const minRange = baselineObj?.typicalRange?.min ?? regDef?.typicalPhysiologicalRange.min ?? baselineVal * 0.8;
        const maxRange = baselineObj?.typicalRange?.max ?? regDef?.typicalPhysiologicalRange.max ?? baselineVal * 1.2;

        sorted.forEach((item, index) => {
          // Check for missing observation
          if (item.value === null && this.config.flagMissingObservations) {
            const anomalyId = `anom-${profile.id}-${item.variable}-${item.missionDay}-missing`;
            const previousState = storedStatusMap.get(anomalyId);
            detected.push({
              id: anomalyId,
              astronautId: profile.id,
              astronautName: profile.displayName,
              system: item.system,
              measurementVariable: item.variable,
              variableName: item.variableName,
              observedValue: null,
              baselineValue: baselineVal,
              expectedRange: { min: minRange, max: maxRange },
              unit: item.unit,
              deviationPercent: 0,
              severity: 'Moderate',
              detectionMethod: 'Missing Measurement Gap',
              detectionTimestamp: item.timestamp,
              missionDay: item.missionDay,
              explanation: `Scheduled observation is missing on FD ${item.missionDay}. Sensor error or failed sample acquisition reported in telemetry metadata.`,
              clinicalSignificanceDisclaimer:
                'Analytical alert only. Does not indicate astronaut medical distress.',
              status: previousState?.status || 'Pending',
              reviewerNotes: previousState?.notes,
            });
            return;
          }

          if (item.value !== null) {
            const val = item.value;
            const diffPct = Math.round((Math.abs(val - baselineVal) / baselineVal) * 1000) / 10;

            // Rule 1: Out of expected baseline range
            const outOfRange = val < minRange || val > maxRange;
            if (outOfRange && diffPct >= this.config.rateOfChangeThresholdPercent) {
              const anomalyId = `anom-${profile.id}-${item.variable}-${item.missionDay}-baseline`;
              const previousState = storedStatusMap.get(anomalyId);

              let severity: AnomalySeverity = 'Moderate';
              if (diffPct > 40) severity = 'Elevated (Review)';
              else if (diffPct < 25) severity = 'Low';

              detected.push({
                id: anomalyId,
                astronautId: profile.id,
                astronautName: profile.displayName,
                system: item.system,
                measurementVariable: item.variable,
                variableName: item.variableName,
                observedValue: val,
                baselineValue: baselineVal,
                expectedRange: { min: minRange, max: maxRange },
                unit: item.unit,
                deviationPercent: diffPct,
                severity,
                detectionMethod: 'Personal Baseline Discrepancy',
                detectionTimestamp: item.timestamp,
                missionDay: item.missionDay,
                explanation: `Measurement value of ${val} ${item.unit} deviates by ${diffPct}% from personal baseline (${baselineVal} ${item.unit}). Exceeds analytical tolerance threshold.`,
                clinicalSignificanceDisclaimer:
                  'Analytical demonstration notification. Not an official NASA flight surgeon diagnostic limit.',
                status: previousState?.status || 'Pending',
                reviewerNotes: previousState?.notes,
              });
            }

            // Rule 2: Sudden rate of change compared to immediately previous observation
            if (index > 0 && sorted[index - 1].value !== null) {
              const prevVal = sorted[index - 1].value as number;
              const suddenDiffPct = Math.round((Math.abs(val - prevVal) / prevVal) * 1000) / 10;
              if (suddenDiffPct > 35) {
                const anomalyId = `anom-${profile.id}-${item.variable}-${item.missionDay}-rate`;
                if (!detected.some((d) => d.id === anomalyId)) {
                  const previousState = storedStatusMap.get(anomalyId);
                  detected.push({
                    id: anomalyId,
                    astronautId: profile.id,
                    astronautName: profile.displayName,
                    system: item.system,
                    measurementVariable: item.variable,
                    variableName: item.variableName,
                    observedValue: val,
                    baselineValue: prevVal,
                    expectedRange: { min: minRange, max: maxRange },
                    unit: item.unit,
                    deviationPercent: suddenDiffPct,
                    severity: suddenDiffPct > 50 ? 'Elevated (Review)' : 'Moderate',
                    detectionMethod: 'Sudden Rate-of-Change Detection',
                    detectionTimestamp: item.timestamp,
                    missionDay: item.missionDay,
                    explanation: `Acute shift of ${suddenDiffPct}% observed between FD ${sorted[index - 1].missionDay} (${prevVal} ${item.unit}) and FD ${item.missionDay} (${val} ${item.unit}).`,
                    clinicalSignificanceDisclaimer:
                      'Analytical demonstration notification. Sensor artifacts or acute transient activity may account for variation.',
                    status: previousState?.status || 'Pending',
                    reviewerNotes: previousState?.notes,
                  });
                }
              }
            }
          }
        });
      });
    });

    this.saveAnomalies(detected);
    return detected;
  }

  public updateAnomalyStatus(
    id: string,
    status: AnomalyReviewStatus,
    reviewerNotes?: string,
    acknowledgedBy = 'Flight Surgeon Demo Station'
  ): boolean {
    const list = this.getStoredAnomalies();
    const item = list.find((a) => a.id === id);
    if (!item) return false;

    item.status = status;
    item.acknowledgedBy = acknowledgedBy;
    item.acknowledgedAt = new Date().toISOString();
    if (reviewerNotes !== undefined) {
      item.reviewerNotes = reviewerNotes;
    }

    this.saveAnomalies(list);
    return true;
  }
}

export const anomalyDetectionService = new AnomalyDetectionService();
