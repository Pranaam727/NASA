// AstroCare P11 — Unit Tests: Analytics Service
// Tests all calculation functions with documented formulas

import { describe, it, expect } from 'vitest';
import {
  computeSleepAnalytics,
  computeWellnessAnalytics,
  estimateCircadianAlignment,
  computeFatigueComposite,
  reactionTimeToScore,
  sleepToChartPoints,
  wellnessToTrendPoints,
} from '../services/wellness/analyticsService';
import type { SleepRecord, WellnessRecord, CircadianRecord, FatigueRecord } from '../types';

// ─── Test Fixtures ───────────────────────────────────────────

const makeSleep = (overrides: Partial<SleepRecord> = {}): SleepRecord => ({
  id: 'TEST-SLP-001',
  astronautId: 'TEST-AST',
  missionId: 'TEST-MSN',
  timestamp: '2024-06-01T22:30:00.000Z',
  sleepStart: '2024-06-01T22:30:00.000Z',
  sleepEnd: '2024-06-02T06:00:00.000Z',
  totalSleepDurationMinutes: 450, // 7.5h
  sleepLatencyMinutes: 10,
  awakeningsCount: 1,
  sleepEfficiencyPercent: 88,
  scheduleDeviation: 0,
  missionDay: 100,
  source: 'SIMULATED',
  dataOrigin: 'SIMULATED',
  ...overrides,
});

const makeWellness = (overrides: Partial<WellnessRecord> = {}): WellnessRecord => ({
  id: 'TEST-WLN-001',
  astronautId: 'TEST-AST',
  missionId: 'TEST-MSN',
  timestamp: '2024-06-01T08:00:00.000Z',
  missionDay: 100,
  moodScore: 7,
  stressScore: 4,
  energyScore: 7,
  wellbeingScore: 7,
  source: 'SIMULATED',
  dataOrigin: 'SIMULATED',
  ...overrides,
});

const makeCircadian = (overrides: Partial<CircadianRecord> = {}): CircadianRecord => ({
  id: 'TEST-CIR-001',
  astronautId: 'TEST-AST',
  missionId: 'TEST-MSN',
  timestamp: '2024-06-01T07:00:00.000Z',
  missionDay: 100,
  scheduledSleepTime: '22:30',
  scheduledWakeTime: '06:00',
  alignmentScore: 85,
  scheduleDeviationMinutes: 15,
  source: 'SIMULATED',
  dataOrigin: 'SIMULATED',
  ...overrides,
});

const makeFatigue = (overrides: Partial<FatigueRecord> = {}): FatigueRecord => ({
  id: 'TEST-FAT-001',
  astronautId: 'TEST-AST',
  missionId: 'TEST-MSN',
  timestamp: '2024-06-01T08:30:00.000Z',
  missionDay: 100,
  fatigueScore: 4,
  workloadScore: 5,
  selfReportedAlertnessScore: 7,
  sleepDeficitEstimateMinutes: 0,
  source: 'SIMULATED',
  dataOrigin: 'SIMULATED',
  ...overrides,
});

// ─── Sleep Analytics Tests ───────────────────────────────────

describe('computeSleepAnalytics', () => {
  it('returns zero values for empty records', () => {
    const result = computeSleepAnalytics([], 'TEST-AST');
    expect(result.averageDurationMinutes).toBe(0);
    expect(result.averageEfficiencyPercent).toBe(0);
    expect(result.estimatedSleepDeficitMinutes).toBe(0);
    expect(result.dataOrigin).toBe('CALCULATED');
  });

  it('computes correct average duration for single record', () => {
    const records = [makeSleep({ totalSleepDurationMinutes: 420 })]; // 7h
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.averageDurationMinutes).toBe(420);
  });

  it('computes correct average duration for multiple records', () => {
    const records = [
      makeSleep({ totalSleepDurationMinutes: 420 }),
      makeSleep({ totalSleepDurationMinutes: 480 }),
      makeSleep({ totalSleepDurationMinutes: 360 }),
    ];
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.averageDurationMinutes).toBe(420); // (420+480+360)/3 = 420
  });

  it('computes sleep deficit correctly', () => {
    // Target = 7.5h = 450 min. Record = 6h = 360 min. Deficit = 90 min.
    const records = [makeSleep({ totalSleepDurationMinutes: 360 })];
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.estimatedSleepDeficitMinutes).toBe(90);
  });

  it('accumulates sleep deficit across multiple records', () => {
    const records = [
      makeSleep({ totalSleepDurationMinutes: 360 }), // deficit 90
      makeSleep({ totalSleepDurationMinutes: 390 }), // deficit 60
      makeSleep({ totalSleepDurationMinutes: 450 }), // deficit 0
    ];
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.estimatedSleepDeficitMinutes).toBe(150);
  });

  it('does not count excess sleep as negative deficit', () => {
    const records = [makeSleep({ totalSleepDurationMinutes: 540 })]; // 9h, over target
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.estimatedSleepDeficitMinutes).toBe(0);
  });

  it('computes correct average efficiency', () => {
    const records = [
      makeSleep({ sleepEfficiencyPercent: 80 }),
      makeSleep({ sleepEfficiencyPercent: 90 }),
    ];
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.averageEfficiencyPercent).toBe(85);
  });

  it('computes consistency score within 0-100 range', () => {
    const records = Array.from({ length: 7 }, (_, i) =>
      makeSleep({ totalSleepDurationMinutes: 420 + i * 10 })
    );
    const result = computeSleepAnalytics(records, 'TEST-AST');
    expect(result.consistencyScore).toBeGreaterThanOrEqual(0);
    expect(result.consistencyScore).toBeLessThanOrEqual(100);
  });

  it('assigns correct astronautId', () => {
    const result = computeSleepAnalytics([makeSleep()], 'TEST-AST-XYZ');
    expect(result.astronautId).toBe('TEST-AST-XYZ');
  });
});

// ─── Circadian Alignment Tests ───────────────────────────────

describe('estimateCircadianAlignment', () => {
  it('returns 100 for zero deviation', () => {
    expect(estimateCircadianAlignment(0)).toBe(100);
  });

  it('returns lower scores for greater deviation', () => {
    const score30 = estimateCircadianAlignment(30);
    const score90 = estimateCircadianAlignment(90);
    expect(score30).toBeGreaterThan(score90);
  });

  it('never returns negative score', () => {
    expect(estimateCircadianAlignment(999)).toBeGreaterThanOrEqual(0);
  });

  it('never returns score above 100', () => {
    expect(estimateCircadianAlignment(-999)).toBeLessThanOrEqual(100);
  });

  it('treats negative deviation same as positive (absolute value)', () => {
    expect(estimateCircadianAlignment(60)).toBe(estimateCircadianAlignment(-60));
  });

  it('returns exactly 0 for 150-minute deviation', () => {
    // 100 - 150/1.5 = 100 - 100 = 0
    expect(estimateCircadianAlignment(150)).toBe(0);
  });
});

// ─── Fatigue Composite Tests ──────────────────────────────────

describe('computeFatigueComposite', () => {
  it('returns low composite for minimal fatigue inputs', () => {
    const score = computeFatigueComposite(1, 1, 10, 0);
    // fatigue=1→0%, workload=1→0%, alertness=10→0%(inverted), deficit=0→0%
    // composite ≈ 0
    expect(score).toBeLessThan(10);
  });

  it('returns high composite for maximum fatigue inputs', () => {
    const score = computeFatigueComposite(10, 10, 1, 480);
    expect(score).toBeGreaterThan(80);
  });

  it('returns value between 0 and 100', () => {
    const score = computeFatigueComposite(5, 5, 5, 60);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('low alertness increases composite (inverted scale)', () => {
    const highAlert = computeFatigueComposite(5, 5, 9, 0);
    const lowAlert = computeFatigueComposite(5, 5, 1, 0);
    expect(lowAlert).toBeGreaterThan(highAlert);
  });
});

// ─── Reaction Time Score Tests ────────────────────────────────

describe('reactionTimeToScore', () => {
  it('returns 100 for reaction time <= 200ms', () => {
    expect(reactionTimeToScore(200)).toBe(100);
    expect(reactionTimeToScore(150)).toBe(100);
  });

  it('returns 0 for reaction time >= 600ms', () => {
    expect(reactionTimeToScore(600)).toBe(0);
    expect(reactionTimeToScore(800)).toBe(0);
  });

  it('returns intermediate score for 400ms', () => {
    // (400-200)/400 = 0.5 → score = 50
    expect(reactionTimeToScore(400)).toBe(50);
  });

  it('score decreases as reaction time increases', () => {
    expect(reactionTimeToScore(250)).toBeGreaterThan(reactionTimeToScore(350));
    expect(reactionTimeToScore(350)).toBeGreaterThan(reactionTimeToScore(450));
  });
});

// ─── Wellness Analytics Tests ─────────────────────────────────

describe('computeWellnessAnalytics', () => {
  it('returns INSUFFICIENT_DATA when no records', () => {
    const result = computeWellnessAnalytics([], [], [], [], 'TEST-AST');
    expect(result.overallWellnessStatus).toBe('INSUFFICIENT_DATA');
  });

  it('returns NORMAL status for good indicators', () => {
    const wellness = Array.from({ length: 7 }, () =>
      makeWellness({ moodScore: 8, stressScore: 2, energyScore: 8, wellbeingScore: 8 })
    );
    const sleep = Array.from({ length: 7 }, () =>
      makeSleep({ totalSleepDurationMinutes: 450, sleepEfficiencyPercent: 90 })
    );
    const circadian = Array.from({ length: 7 }, () =>
      makeCircadian({ alignmentScore: 90 })
    );
    const fatigue = Array.from({ length: 7 }, () =>
      makeFatigue({ fatigueScore: 2, workloadScore: 3, selfReportedAlertnessScore: 8 })
    );
    const result = computeWellnessAnalytics(wellness, sleep, circadian, fatigue, 'TEST-AST');
    expect(result.overallWellnessStatus).toBe('NORMAL');
  });

  it('computes overall score between 0 and 100', () => {
    const wellness = [makeWellness()];
    const sleep = [makeSleep()];
    const circadian = [makeCircadian()];
    const fatigue = [makeFatigue()];
    const result = computeWellnessAnalytics(wellness, sleep, circadian, fatigue, 'TEST-AST');
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('assigns CALCULATED dataOrigin', () => {
    const result = computeWellnessAnalytics([], [], [], [], 'TEST-AST');
    expect(result.dataOrigin).toBe('CALCULATED');
  });
});

// ─── Chart Point Conversion Tests ─────────────────────────────

describe('sleepToChartPoints', () => {
  it('converts records to chart points with correct values', () => {
    const records = [makeSleep({ totalSleepDurationMinutes: 450, sleepEfficiencyPercent: 85 })];
    const points = sleepToChartPoints(records);
    expect(points).toHaveLength(1);
    expect(points[0].durationHours).toBe(7.5);
    expect(points[0].efficiency).toBe(85);
    expect(points[0].targetHours).toBe(7.5);
  });

  it('returns empty array for empty records', () => {
    expect(sleepToChartPoints([])).toHaveLength(0);
  });
});

describe('wellnessToTrendPoints', () => {
  it('extracts correct field values', () => {
    const records = [
      makeWellness({ moodScore: 7 }),
      makeWellness({ moodScore: 5 }),
    ];
    const points = wellnessToTrendPoints(records, 'moodScore');
    expect(points[0].value).toBe(7);
    expect(points[1].value).toBe(5);
  });
});
