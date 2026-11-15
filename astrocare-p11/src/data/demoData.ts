// AstroCare P11 — Deterministic Demo Data
// All records are clearly labeled as SIMULATED demonstration data.
// These are NOT real astronaut medical records.

import { addDays, subDays, parseISO, format, setHours, setMinutes } from 'date-fns';
import type {
  AstronautProfile,
  MissionProfile,
  SleepRecord,
  WellnessRecord,
  CircadianRecord,
  FatigueRecord,
  CognitivePerformanceRecord,
  TeamWellnessRecord,
  WellnessAlert,
} from '../types';
import { DEMO_ASTRONAUT_ID, DEMO_MISSION_ID } from '../constants';

// Mission anchor date — deterministic
const MISSION_START = '2024-03-15T06:00:00.000Z';
const NOW_ANCHOR = '2024-09-11T10:00:00.000Z'; // Day 180
const TOTAL_DAYS = 180;

function missionDate(dayOffset: number, hour = 22, minute = 30): string {
  const base = parseISO(MISSION_START);
  const d = addDays(base, dayOffset);
  return setMinutes(setHours(d, hour), minute).toISOString();
}

// ─── Astronaut Profile ───────────────────────────────────────

export const DEMO_ASTRONAUT: AstronautProfile = {
  id: DEMO_ASTRONAUT_ID,
  displayId: 'CREW-07-ALPHA',
  missionId: DEMO_MISSION_ID,
  missionName: 'Expedition 72 Alpha',
  missionStartDate: MISSION_START,
  missionDurationDays: TOTAL_DAYS,
  currentMissionDayEstimate: TOTAL_DAYS,
  dataOrigin: 'SIMULATED',
};

// ─── Mission Profile ─────────────────────────────────────────

export const DEMO_MISSION: MissionProfile = {
  id: DEMO_MISSION_ID,
  name: 'Expedition 72 Alpha',
  startDate: MISSION_START,
  durationDays: TOTAL_DAYS,
  crewSize: 4,
  missionType: 'ISS',
  dataOrigin: 'SIMULATED',
};

// ─── Sleep Records (90 days of data) ────────────────────────
// Simulates realistic ISS-like sleep patterns with gradual drift and recovery

function makeSleepRecord(
  day: number,
  durationMinutes: number,
  sleepHour = 22,
  sleepMinute = 30,
  efficiency = 85,
  awakenings = 1
): SleepRecord {
  const sleepStart = missionDate(day, sleepHour, sleepMinute);
  const sleepEnd = new Date(parseISO(sleepStart).getTime() + durationMinutes * 60000).toISOString();
  return {
    id: `SLP-${String(day).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: sleepStart,
    sleepStart,
    sleepEnd,
    totalSleepDurationMinutes: durationMinutes,
    sleepLatencyMinutes: Math.round(8 + Math.sin(day * 0.3) * 4),
    awakeningsCount: awakenings,
    sleepEfficiencyPercent: efficiency,
    scheduleDeviation: Math.round((sleepHour - 22) * 60 + sleepMinute - 30),
    missionDay: day + 90, // days 90-179
    source: 'SIMULATED',
    dataOrigin: 'SIMULATED',
  };
}

// Generate 90 days deterministic sleep records
export const DEMO_SLEEP_RECORDS: SleepRecord[] = Array.from({ length: 90 }, (_, i) => {
  const day = i;
  // Realistic pattern: good start, mid-mission fatigue dip, partial recovery
  const baseDuration = 450; // 7.5h = 450 min
  const drift = Math.sin(i * 0.15) * 30 + Math.cos(i * 0.08) * 20;
  const duration = Math.round(Math.max(240, Math.min(540, baseDuration + drift)));

  const effBase = 85;
  const effDrift = Math.sin(i * 0.12) * 8;
  const efficiency = Math.round(Math.max(60, Math.min(97, effBase + effDrift)));

  const sleepHourDrift = Math.sin(i * 0.2) * 1.5;
  const sleepHour = Math.round(22 + sleepHourDrift);
  const awakenings = i > 50 ? 2 : 1;

  return makeSleepRecord(day, duration, sleepHour, 0, efficiency, awakenings);
});

// ─── Wellness Records (90 days) ──────────────────────────────

function makeWellnessRecord(day: number, overrides: Partial<WellnessRecord> = {}): WellnessRecord {
  const phase = day / 90;
  // Mood dips around mid-mission then partially recovers
  const moodBase = 7 - Math.sin(phase * Math.PI) * 2;
  const stressBase = 4 + Math.sin(phase * Math.PI) * 2.5;
  const energyBase = 7 - Math.sin(phase * Math.PI) * 1.8;
  const wellbeingBase = 7 - Math.sin(phase * Math.PI) * 2;

  return {
    id: `WLN-${String(day).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(day, 8, 0),
    missionDay: day + 90,
    moodScore: Math.round(Math.max(1, Math.min(10, moodBase + (Math.random() - 0.5) * 1.2))),
    stressScore: Math.round(Math.max(1, Math.min(10, stressBase + (Math.random() - 0.5) * 1.2))),
    energyScore: Math.round(Math.max(1, Math.min(10, energyBase + (Math.random() - 0.5) * 1.2))),
    wellbeingScore: Math.round(Math.max(1, Math.min(10, wellbeingBase + (Math.random() - 0.5) * 1.2))),
    source: 'SIMULATED',
    dataOrigin: 'SIMULATED',
    ...overrides,
  };
}

// Use deterministic values (no Math.random in final seed)
const wellnessSeed = [
  [8,3,8,8],[8,3,8,8],[7,3,7,8],[7,3,7,7],[7,4,7,7],[7,4,7,7],[6,4,7,7],
  [7,4,7,7],[6,4,6,7],[6,5,6,6],[6,5,6,6],[6,5,6,6],[5,5,6,6],[6,5,6,6],
  [5,6,5,5],[5,6,5,5],[5,6,5,5],[5,6,5,5],[5,6,5,5],[4,7,5,5],[4,7,4,5],
  [5,7,5,5],[4,7,4,4],[4,7,4,4],[4,7,4,4],[5,7,5,5],[5,6,5,5],[5,6,5,5],
  [5,6,5,5],[6,6,5,5],[6,6,6,6],[6,5,6,6],[6,5,6,6],[6,5,6,6],[6,5,6,6],
  [6,5,6,6],[7,5,6,6],[7,5,7,7],[7,5,7,7],[7,4,7,7],[7,4,7,7],[7,4,7,7],
  [8,4,7,7],[7,4,7,7],[7,4,7,7],[7,4,7,7],[7,4,7,7],[8,4,8,8],[8,3,8,8],
  [8,3,8,8],[7,3,7,8],[7,3,7,7],[7,4,7,7],[7,4,7,7],[6,4,7,7],[7,4,7,7],
  [6,4,6,7],[6,5,6,6],[6,5,6,6],[6,5,6,6],[5,5,6,6],[6,5,6,6],[5,6,5,5],
  [5,6,5,5],[5,6,5,5],[5,6,5,5],[5,6,5,5],[4,7,5,5],[4,7,4,5],[5,7,5,5],
  [4,7,4,4],[4,7,4,4],[4,7,4,4],[5,7,5,5],[5,6,5,5],[5,6,5,5],[5,6,5,5],
  [6,6,5,5],[6,6,6,6],[6,5,6,6],[6,5,6,6],[6,5,6,6],[6,5,6,6],[6,5,6,6],
  [7,5,6,6],[7,5,7,7],[7,5,7,7],[7,4,7,7],[7,4,7,7],[7,4,7,7],
];

export const DEMO_WELLNESS_RECORDS: WellnessRecord[] = wellnessSeed.map((v, i) => ({
  id: `WLN-${String(i).padStart(3, '0')}`,
  astronautId: DEMO_ASTRONAUT_ID,
  missionId: DEMO_MISSION_ID,
  timestamp: missionDate(i, 8, 0),
  missionDay: i + 90,
  moodScore: v[0],
  stressScore: v[1],
  energyScore: v[2],
  wellbeingScore: v[3],
  source: 'SIMULATED' as const,
  dataOrigin: 'SIMULATED' as const,
}));

// ─── Circadian Records (90 days) ─────────────────────────────

export const DEMO_CIRCADIAN_RECORDS: CircadianRecord[] = Array.from({ length: 90 }, (_, i) => {
  const scheduledSleep = '22:30';
  const scheduledWake = '06:00';
  // Drift increases mid-mission
  const deviationMin = Math.round(Math.sin(i * 0.15) * 45);
  const alignment = Math.round(Math.max(30, 90 - Math.abs(deviationMin) / 1.5));

  return {
    id: `CIR-${String(i).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(i, 7, 0),
    missionDay: i + 90,
    scheduledSleepTime: scheduledSleep,
    scheduledWakeTime: scheduledWake,
    alignmentScore: alignment,
    scheduleDeviationMinutes: deviationMin,
    lightExposureMinutes: 30 + Math.round(Math.sin(i * 0.2) * 10),
    shiftPattern: 'STANDARD',
    source: 'SIMULATED',
    dataOrigin: 'SIMULATED',
  };
});

// ─── Fatigue Records ─────────────────────────────────────────

export const DEMO_FATIGUE_RECORDS: FatigueRecord[] = Array.from({ length: 90 }, (_, i) => {
  const phase = i / 90;
  const fatigueBase = 4 + Math.sin(phase * Math.PI) * 3;
  const workloadBase = 5 + Math.sin(phase * Math.PI + 0.5) * 2;
  const alertnessBase = 7 - Math.sin(phase * Math.PI) * 2.5;

  const sleepDeficit = Math.max(0, (450 - (DEMO_SLEEP_RECORDS[i]?.totalSleepDurationMinutes ?? 450)));

  return {
    id: `FAT-${String(i).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(i, 8, 30),
    missionDay: i + 90,
    fatigueScore: Math.round(Math.max(1, Math.min(10, fatigueBase))),
    workloadScore: Math.round(Math.max(1, Math.min(10, workloadBase))),
    selfReportedAlertnessScore: Math.round(Math.max(1, Math.min(10, alertnessBase))),
    sleepDeficitEstimateMinutes: sleepDeficit,
    source: 'SIMULATED',
    dataOrigin: 'SIMULATED',
  };
});

// ─── Cognitive Performance Records ───────────────────────────

export const DEMO_COGNITIVE_RECORDS: CognitivePerformanceRecord[] = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `COG-RT-${String(i).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(i * 3, 9, 0),
    missionDay: (i * 3) + 90,
    taskType: 'REACTION_TIME' as const,
    reactionTimeMs: Math.round(250 + Math.sin(i * 0.3) * 60 + i * 1.2),
    accuracyPercent: Math.round(Math.max(70, 95 - i * 0.3 + Math.sin(i * 0.4) * 5)),
    completionTimeMs: Math.round(60000 + Math.sin(i * 0.2) * 10000),
    scoreRaw: Math.round(Math.max(50, 90 - i * 0.2 + Math.sin(i * 0.3) * 8)),
    scoreNormalized: Math.round(Math.max(50, 90 - i * 0.2 + Math.sin(i * 0.3) * 8)),
    source: 'SIMULATED' as const,
    dataOrigin: 'SIMULATED' as const,
  })),
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `COG-AT-${String(i).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(i * 3, 9, 30),
    missionDay: (i * 3) + 90,
    taskType: 'ATTENTION' as const,
    accuracyPercent: Math.round(Math.max(65, 92 - i * 0.4 + Math.sin(i * 0.35) * 6)),
    completionTimeMs: Math.round(90000 + Math.sin(i * 0.25) * 15000),
    scoreRaw: Math.round(Math.max(55, 88 - i * 0.3 + Math.sin(i * 0.4) * 7)),
    scoreNormalized: Math.round(Math.max(55, 88 - i * 0.3 + Math.sin(i * 0.4) * 7)),
    source: 'SIMULATED' as const,
    dataOrigin: 'SIMULATED' as const,
  })),
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `COG-MEM-${String(i).padStart(3, '0')}`,
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(i * 3, 10, 0),
    missionDay: (i * 3) + 90,
    taskType: 'MEMORY' as const,
    accuracyPercent: Math.round(Math.max(60, 90 - i * 0.35 + Math.sin(i * 0.3) * 7)),
    completionTimeMs: Math.round(120000 + Math.sin(i * 0.2) * 20000),
    scoreRaw: Math.round(Math.max(50, 86 - i * 0.3 + Math.sin(i * 0.35) * 8)),
    scoreNormalized: Math.round(Math.max(50, 86 - i * 0.3 + Math.sin(i * 0.35) * 8)),
    source: 'SIMULATED' as const,
    dataOrigin: 'SIMULATED' as const,
  })),
];

// ─── Team Wellness Records ────────────────────────────────────

export const DEMO_TEAM_RECORDS: TeamWellnessRecord[] = Array.from({ length: 30 }, (_, i) => {
  const phase = i / 30;
  return {
    id: `TEAM-${String(i).padStart(3, '0')}`,
    missionId: DEMO_MISSION_ID,
    timestamp: missionDate(i * 3, 12, 0),
    missionDay: (i * 3) + 90,
    cohesionScore: Math.round(Math.max(50, 82 - Math.sin(phase * Math.PI) * 20)),
    communicationScore: Math.round(Math.max(55, 85 - Math.sin(phase * Math.PI) * 18)),
    collaborationScore: Math.round(Math.max(55, 80 - Math.sin(phase * Math.PI) * 15)),
    conflictIndicator: Math.round(Math.max(5, 20 + Math.sin(phase * Math.PI) * 20)),
    isolationDurationDays: (i * 3) + 90,
    crewInteractionFrequency: Math.round(10 - Math.sin(phase * Math.PI) * 3),
    source: 'SIMULATED',
    dataOrigin: 'SIMULATED',
  };
});

// ─── Active Alerts ────────────────────────────────────────────

export const DEMO_ALERTS: WellnessAlert[] = [
  {
    id: 'ALT-001',
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    severity: 'CAUTION',
    category: 'SLEEP',
    metric: 'averageSleepDuration',
    currentValue: 6.2,
    threshold: 7.0,
    message: 'Average sleep duration below recommended target',
    explanation: 'Sleep duration has averaged 6.2h over the past 7 days, below the 7h mission target. Prolonged sleep restriction can affect cognitive performance and wellbeing.',
    timestamp: missionDate(85, 8, 0),
    acknowledged: false,
    source: 'CALCULATED',
  },
  {
    id: 'ALT-002',
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    severity: 'INFO',
    category: 'CIRCADIAN',
    metric: 'scheduleDeviation',
    currentValue: 45,
    threshold: 60,
    message: 'Moderate circadian schedule deviation detected',
    explanation: 'Sleep schedule has shifted approximately 45 minutes from baseline. Monitor for further drift.',
    timestamp: missionDate(83, 8, 0),
    acknowledged: true,
    source: 'CALCULATED',
  },
  {
    id: 'ALT-003',
    astronautId: DEMO_ASTRONAUT_ID,
    missionId: DEMO_MISSION_ID,
    severity: 'CAUTION',
    category: 'WELLNESS',
    metric: 'stressScore',
    currentValue: 6.5,
    threshold: 7.0,
    message: 'Elevated stress scores in recent check-ins',
    explanation: 'Self-reported stress has trended upward over the past 2 weeks. Regular check-ins and workload review are recommended.',
    timestamp: missionDate(80, 10, 0),
    acknowledged: false,
    source: 'CALCULATED',
  },
];
