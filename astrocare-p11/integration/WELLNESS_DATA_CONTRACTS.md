# AstroCare P11 — Wellness Data Contracts & Schemas

All types are exported from `src/types/index.ts`.

## 1. SleepRecord
```typescript
export interface SleepRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;               // ISO 8601
  sleepStart: string;              // ISO 8601
  sleepEnd: string;                // ISO 8601
  totalSleepDurationMinutes: number;
  sleepLatencyMinutes?: number;
  awakeningsCount?: number;
  sleepEfficiencyPercent: number;  // 0–100
  scheduleDeviation?: number;      // minutes from target bedtime
  missionDay: number;
  source: 'SELF_REPORT' | 'ACTIGRAPH' | 'SCHEDULE' | 'SIMULATED';
  dataOrigin: 'SIMULATED' | 'USER_ENTERED' | 'CALCULATED' | 'NASA_RESEARCH';
  notes?: string;
}
```

## 2. WellnessRecord (Mental Health & Subjective Status)
```typescript
export interface WellnessRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;               // ISO 8601
  missionDay: number;
  moodScore: number;               // 1–10 (10 = optimal)
  stressScore: number;             // 1–10 (1 = minimal stress, inverted)
  energyScore: number;             // 1–10 (10 = fully energized)
  wellbeingScore: number;          // 1–10 (10 = excellent)
  privateNotes?: string;          // Encrypted / Local session only
  source: 'SELF_REPORT' | 'SIMULATED';
  dataOrigin: DataOrigin;
}
```

## 3. CircadianRecord
```typescript
export interface CircadianRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  scheduledSleepTime: string;      // HH:MM UTC / MET
  scheduledWakeTime: string;       // HH:MM UTC / MET
  actualSleepTime?: string;
  actualWakeTime?: string;
  alignmentScore: number;          // 0–100 derived schedule score
  scheduleDeviationMinutes: number;
  lightExposureMinutes?: number;
  shiftPattern?: 'STANDARD' | 'SHIFTED' | 'ROTATING';
  source: 'SCHEDULE' | 'SELF_REPORT' | 'SIMULATED';
  dataOrigin: DataOrigin;
}
```

## 4. CognitivePerformanceRecord
```typescript
export interface CognitivePerformanceRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  taskType: 'REACTION_TIME' | 'ATTENTION' | 'MEMORY';
  reactionTimeMs?: number;
  accuracyPercent: number;         // 0–100
  completionTimeMs: number;
  scoreRaw: number;
  scoreNormalized: number;         // 0–100
  source: 'USER_TEST' | 'SIMULATED';
  dataOrigin: DataOrigin;
}
```

## 5. TeamWellnessRecord
```typescript
export interface TeamWellnessRecord {
  id: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  cohesionScore: number;           // 0–100
  communicationScore: number;      // 0–100
  collaborationScore: number;      // 0–100
  conflictIndicator: number;       // 0–100
  isolationDurationDays: number;
  crewInteractionFrequency: number;// sessions/day
  source: 'SIMULATED';
  dataOrigin: DataOrigin;
}
```

## 6. WellnessAlert
```typescript
export interface WellnessAlert {
  id: string;
  astronautId?: string;
  missionId?: string;
  severity: 'INFO' | 'CAUTION' | 'WARNING' | 'CRITICAL';
  category: 'SLEEP' | 'CIRCADIAN' | 'FATIGUE' | 'STRESS' | 'COGNITIVE' | 'TEAM' | 'WELLNESS';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  explanation: string;
  timestamp: string;
  acknowledged: boolean;
  source: DataOrigin;
}
```

## 7. WellnessDataProvider Interface
```typescript
export interface WellnessDataProvider {
  getSleepRecords(astronautId: string): Promise<SleepRecord[]>;
  getWellnessRecords(astronautId: string): Promise<WellnessRecord[]>;
  getCircadianRecords(astronautId: string): Promise<CircadianRecord[]>;
  getFatigueRecords(astronautId: string): Promise<FatigueRecord[]>;
  getCognitiveRecords(astronautId: string): Promise<CognitivePerformanceRecord[]>;
  getTeamWellnessRecords(missionId: string): Promise<TeamWellnessRecord[]>;
  getWellnessAlerts(astronautId: string): Promise<WellnessAlert[]>;
  saveSleepRecord(record: Omit<SleepRecord, 'id'>): Promise<SleepRecord>;
  saveWellnessRecord(record: Omit<WellnessRecord, 'id'>): Promise<WellnessRecord>;
  saveCognitiveRecord(record: Omit<CognitivePerformanceRecord, 'id'>): Promise<CognitivePerformanceRecord>;
  resetDemoData(): Promise<void>;
}
```
