// AstroCare P11 — Analytics Service
// Transparent calculations with documented formulas

import type {
  SleepRecord,
  WellnessRecord,
  FatigueRecord,
  CircadianRecord,
  CognitivePerformanceRecord,
  SleepAnalytics,
  WellnessAnalytics,
  WellnessStatus,
  TrendDataPoint,
  SleepChartPoint,
} from '../../types';
import { THRESHOLDS } from '../../constants';
import {
  average,
  clampScore,
  roundTo,
  formatShortDate,
  minutesToHours,
  computeWellnessStatus,
  getISONow,
} from '../../utils';

// ─── Sleep Analytics ─────────────────────────────────────────

/**
 * Computes sleep analytics from an array of records.
 * Formula notes:
 * - averageDuration = mean of all recorded durations
 * - averageEfficiency = mean of all recorded efficiencies
 * - consistencyScore = 100 - stddev/target * 100 (clamped 0-100)
 * - estimatedSleepDeficit = sum of max(0, target - actual) across all records
 * - scheduleDeviationMean = mean absolute deviation from scheduled time
 */
export function computeSleepAnalytics(
  records: SleepRecord[],
  astronautId: string
): SleepAnalytics {
  if (records.length === 0) {
    return {
      astronautId,
      computedAt: getISONow(),
      averageDurationMinutes: 0,
      averageEfficiencyPercent: 0,
      consistencyScore: 0,
      estimatedSleepDeficitMinutes: 0,
      scheduleDeviationMeanMinutes: 0,
      dataOrigin: 'CALCULATED',
    };
  }

  const durations = records.map((r) => r.totalSleepDurationMinutes);
  const efficiencies = records.map((r) => r.sleepEfficiencyPercent);
  const deviations = records
    .filter((r) => r.scheduleDeviation !== undefined)
    .map((r) => Math.abs(r.scheduleDeviation!));

  const avgDuration = average(durations);
  const avgEfficiency = average(efficiencies);

  // Consistency: stddev of duration relative to target
  const targetMin = THRESHOLDS.SLEEP.TARGET_DURATION_HOURS * 60;
  const variance = average(durations.map((d) => Math.pow(d - avgDuration, 2)));
  const stddev = Math.sqrt(variance);
  const consistency = clampScore(100 - (stddev / targetMin) * 100);

  // Sleep deficit: cumulative minutes below target
  const deficit = durations.reduce(
    (acc, d) => acc + Math.max(0, targetMin - d),
    0
  );

  const deviationMean = deviations.length > 0 ? average(deviations) : 0;

  return {
    astronautId,
    computedAt: getISONow(),
    averageDurationMinutes: roundTo(avgDuration, 1),
    averageEfficiencyPercent: roundTo(avgEfficiency, 1),
    consistencyScore: roundTo(consistency, 1),
    estimatedSleepDeficitMinutes: roundTo(deficit, 0),
    scheduleDeviationMeanMinutes: roundTo(deviationMean, 1),
    dataOrigin: 'CALCULATED',
  };
}

// ─── Wellness Analytics ───────────────────────────────────────

/**
 * Computes overall wellness analytics.
 * Uses last 7 days of wellness records for indicators.
 * Stress scale is inverted (high stress = poor wellness).
 */
export function computeWellnessAnalytics(
  wellnessRecords: WellnessRecord[],
  sleepRecords: SleepRecord[],
  circadianRecords: CircadianRecord[],
  fatigueRecords: FatigueRecord[],
  astronautId: string
): WellnessAnalytics {
  const recent7 = wellnessRecords.slice(-7);
  const recentSleep7 = sleepRecords.slice(-7);
  const recentCirc7 = circadianRecords.slice(-7);
  const recentFat7 = fatigueRecords.slice(-7);

  const hasData = recent7.length > 0 || recentSleep7.length > 0;

  // Sleep quality indicator (0-100)
  const sleepDurIndicator =
    recentSleep7.length > 0
      ? clampScore(
          (average(recentSleep7.map((r) => r.totalSleepDurationMinutes)) /
            (THRESHOLDS.SLEEP.TARGET_DURATION_HOURS * 60)) *
            100
        )
      : 50;

  const sleepEffIndicator =
    recentSleep7.length > 0
      ? average(recentSleep7.map((r) => r.sleepEfficiencyPercent))
      : 50;

  const sleepQualityIndicator = clampScore(
    (sleepDurIndicator + sleepEffIndicator) / 2
  );

  // Fatigue indicator (inverted: high fatigue = low score)
  const fatigueIndicator =
    recentFat7.length > 0
      ? clampScore(
          100 -
            ((average(recentFat7.map((r) => r.fatigueScore)) - 1) / 9) * 100
        )
      : 50;

  // Stress indicator (inverted: high stress = low score)
  const stressIndicator =
    recent7.length > 0
      ? clampScore(
          100 -
            ((average(recent7.map((r) => r.stressScore)) - 1) / 9) * 100
        )
      : 50;

  // Energy indicator
  const energyIndicator =
    recent7.length > 0
      ? clampScore(((average(recent7.map((r) => r.energyScore)) - 1) / 9) * 100)
      : 50;

  // Circadian alignment
  const circadianAlignmentEstimate =
    recentCirc7.length > 0
      ? average(recentCirc7.map((r) => r.alignmentScore))
      : 50;

  // Overall score — weighted composite
  const overallScore = hasData
    ? clampScore(
        sleepQualityIndicator * 0.3 +
          fatigueIndicator * 0.2 +
          stressIndicator * 0.2 +
          energyIndicator * 0.15 +
          circadianAlignmentEstimate * 0.15
      )
    : 0;

  // Status determination
  const status: WellnessStatus = !hasData
    ? 'INSUFFICIENT_DATA'
    : computeWellnessStatus([
        { value: sleepQualityIndicator, warnThreshold: 50 },
        { value: fatigueIndicator, warnThreshold: 40 },
        { value: stressIndicator, warnThreshold: 40 },
        { value: energyIndicator, warnThreshold: 35 },
        { value: circadianAlignmentEstimate, warnThreshold: 50 },
      ]);

  const lastCheckIn =
    wellnessRecords.length > 0
      ? wellnessRecords[wellnessRecords.length - 1].timestamp
      : new Date(0).toISOString();

  return {
    astronautId,
    computedAt: getISONow(),
    overallWellnessStatus: status,
    overallScore: roundTo(overallScore, 1),
    sleepQualityIndicator: roundTo(sleepQualityIndicator, 1),
    fatigueIndicator: roundTo(fatigueIndicator, 1),
    stressIndicator: roundTo(stressIndicator, 1),
    energyIndicator: roundTo(energyIndicator, 1),
    circadianAlignmentEstimate: roundTo(circadianAlignmentEstimate, 1),
    lastCheckIn,
    dataOrigin: 'CALCULATED',
  };
}

// ─── Trend Computation ────────────────────────────────────────

export function sleepToChartPoints(records: SleepRecord[]): SleepChartPoint[] {
  return records.map((r) => ({
    date: formatShortDate(r.sleepStart),
    missionDay: r.missionDay,
    durationHours: roundTo(r.totalSleepDurationMinutes / 60, 2),
    efficiency: r.sleepEfficiencyPercent,
    targetHours: 7.5,
  }));
}

export function wellnessToTrendPoints(
  records: WellnessRecord[],
  field: keyof Pick<WellnessRecord, 'moodScore' | 'stressScore' | 'energyScore' | 'wellbeingScore'>
): TrendDataPoint[] {
  return records.map((r) => ({
    date: formatShortDate(r.timestamp),
    missionDay: r.missionDay,
    value: r[field] as number,
  }));
}

export function fatigueToTrendPoints(records: FatigueRecord[]): TrendDataPoint[] {
  return records.map((r) => ({
    date: formatShortDate(r.timestamp),
    missionDay: r.missionDay,
    value: r.fatigueScore,
  }));
}

export function circadianToAlignmentPoints(records: CircadianRecord[]): TrendDataPoint[] {
  return records.map((r) => ({
    date: formatShortDate(r.timestamp),
    missionDay: r.missionDay,
    value: r.alignmentScore,
  }));
}

// ─── Circadian Alignment Computation ─────────────────────────

/**
 * Estimates circadian schedule alignment from sleep and schedule data.
 * Formula: alignment = max(0, 100 - |deviation_minutes| / 1.5)
 * This is a schedule-derived estimate, NOT a biological measurement.
 * Does not claim to measure melatonin, cortisol, or biological phase.
 */
export function estimateCircadianAlignment(deviationMinutes: number): number {
  return clampScore(100 - Math.abs(deviationMinutes) / 1.5);
}

// ─── Fatigue Composite ─────────────────────────────────────────

/**
 * Computes a transparent composite fatigue indicator.
 * Inputs: sleep deficit, workload, self-reported fatigue, alertness.
 * All inputs documented and invertible.
 * Returns 0–100 (0 = no fatigue, 100 = maximal fatigue).
 */
export function computeFatigueComposite(
  fatigueScore: number,     // 1-10
  workloadScore: number,    // 1-10
  alertnessScore: number,   // 1-10 (higher = more alert = less fatigue)
  sleepDeficitMinutes: number
): number {
  const fatiguePct = ((fatigueScore - 1) / 9) * 100;
  const workloadPct = ((workloadScore - 1) / 9) * 100;
  const alertnessPct = 100 - ((alertnessScore - 1) / 9) * 100; // inverted
  const deficitPct = clampScore((sleepDeficitMinutes / (8 * 60)) * 100);

  return clampScore(
    fatiguePct * 0.35 +
    workloadPct * 0.2 +
    alertnessPct * 0.25 +
    deficitPct * 0.2
  );
}

// ─── Cognitive Score ──────────────────────────────────────────

/**
 * Normalizes reaction time to a 0-100 score.
 * Target = 250ms (100), Warn = 400ms (50), Max = 600ms (0).
 * Clearly labeled as a simple demonstration score.
 */
export function reactionTimeToScore(ms: number): number {
  if (ms <= 200) return 100;
  if (ms >= 600) return 0;
  return clampScore(100 - ((ms - 200) / 400) * 100);
}
