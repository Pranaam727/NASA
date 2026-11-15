// ============================================================
// AstroCare P11 — Core Type Definitions
// Astronaut Wellness, Sleep, Circadian Rhythm & Mental Health
// ============================================================

// ─── Enumerations ───────────────────────────────────────────

export type DataOrigin = 'SIMULATED' | 'USER_ENTERED' | 'CALCULATED' | 'NASA_RESEARCH';
export type DataSource = 'LOCAL_DEMO' | 'MASTER_APP' | 'API';

export type WellnessStatus = 'NORMAL' | 'MONITOR' | 'WARNING' | 'INSUFFICIENT_DATA';
export type AlertSeverity = 'INFO' | 'CAUTION' | 'WARNING' | 'CRITICAL';
export type AlertCategory =
  | 'SLEEP'
  | 'CIRCADIAN'
  | 'FATIGUE'
  | 'STRESS'
  | 'COGNITIVE'
  | 'TEAM'
  | 'WELLNESS';

export type CognitiveTaskType = 'REACTION_TIME' | 'ATTENTION' | 'MEMORY';
export type SleepSource = 'SELF_REPORT' | 'ACTIGRAPH' | 'SCHEDULE' | 'SIMULATED';

// ─── Core Identifiers ───────────────────────────────────────

export interface AstronautProfile {
  id: string;
  displayId: string;        // e.g. "CREW-07-ALPHA"
  missionId: string;
  missionName: string;
  missionStartDate: string; // ISO 8601
  missionDurationDays: number;
  currentMissionDayEstimate: number;
  dataOrigin: DataOrigin;
}

export interface MissionProfile {
  id: string;
  name: string;
  startDate: string;
  durationDays: number;
  crewSize: number;
  missionType: 'ISS' | 'LUNAR' | 'DEEP_SPACE' | 'SIMULATION';
  dataOrigin: DataOrigin;
}

// ─── Sleep ──────────────────────────────────────────────────

export interface SleepRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;        // ISO 8601 — when recorded
  sleepStart: string;       // ISO 8601
  sleepEnd: string;         // ISO 8601
  totalSleepDurationMinutes: number;
  sleepLatencyMinutes?: number;
  awakeningsCount?: number;
  sleepEfficiencyPercent: number; // 0–100
  scheduleDeviation?: number;     // minutes from target
  missionDay: number;
  source: SleepSource;
  dataOrigin: DataOrigin;
  notes?: string;
}

export interface SleepAnalytics {
  astronautId: string;
  computedAt: string;
  averageDurationMinutes: number;
  averageEfficiencyPercent: number;
  consistencyScore: number;        // 0–100 (derived)
  estimatedSleepDeficitMinutes: number;
  scheduleDeviationMeanMinutes: number;
  dataOrigin: DataOrigin;
}

// ─── Wellness / Mental Health ────────────────────────────────

export interface WellnessRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  moodScore: number;       // 1–10
  stressScore: number;     // 1–10 (1 = minimal stress)
  energyScore: number;     // 1–10
  wellbeingScore: number;  // 1–10
  privateNotes?: string;   // never shown publicly
  source: 'SELF_REPORT' | 'SIMULATED';
  dataOrigin: DataOrigin;
}

export interface WellnessAnalytics {
  astronautId: string;
  computedAt: string;
  overallWellnessStatus: WellnessStatus;
  overallScore: number;    // 0–100
  sleepQualityIndicator: number;    // 0–100
  fatigueIndicator: number;         // 0–100
  stressIndicator: number;          // 0–100
  energyIndicator: number;          // 0–100
  circadianAlignmentEstimate: number; // 0–100
  lastCheckIn: string;    // ISO 8601
  dataOrigin: DataOrigin;
}

// ─── Circadian ───────────────────────────────────────────────

export interface CircadianRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  scheduledSleepTime: string;  // HH:MM local mission time
  scheduledWakeTime: string;   // HH:MM
  actualSleepTime?: string;    // HH:MM if recorded
  actualWakeTime?: string;     // HH:MM if recorded
  alignmentScore: number;      // 0–100 derived
  scheduleDeviationMinutes: number;
  lightExposureMinutes?: number;
  shiftPattern?: 'STANDARD' | 'SHIFTED' | 'ROTATING';
  source: 'SCHEDULE' | 'SELF_REPORT' | 'SIMULATED';
  dataOrigin: DataOrigin;
}

export interface CircadianWindowEvent {
  type: 'SLEEP' | 'WAKE' | 'WORK' | 'REST' | 'EXERCISE' | 'LIGHT_EXPOSURE';
  startHour: number;  // 0–24
  durationHours: number;
  label: string;
  missionDay: number;
}

// ─── Fatigue ─────────────────────────────────────────────────

export interface FatigueRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  fatigueScore: number;            // 1–10 (10 = maximal fatigue)
  workloadScore: number;           // 1–10
  selfReportedAlertnessScore: number; // 1–10
  sleepDeficitEstimateMinutes: number;
  source: 'SELF_REPORT' | 'CALCULATED' | 'SIMULATED';
  dataOrigin: DataOrigin;
}

// ─── Cognitive Performance ───────────────────────────────────

export interface CognitivePerformanceRecord {
  id: string;
  astronautId: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  taskType: CognitiveTaskType;
  reactionTimeMs?: number;
  accuracyPercent: number;      // 0–100
  completionTimeMs: number;
  scoreRaw: number;             // task-specific raw score
  scoreNormalized: number;      // 0–100
  source: 'USER_TEST' | 'SIMULATED';
  dataOrigin: DataOrigin;
}

export interface CognitiveTestSession {
  id: string;
  astronautId: string;
  startTime: string;
  endTime?: string;
  tasksCompleted: CognitiveTaskType[];
  results: CognitivePerformanceRecord[];
  sessionComplete: boolean;
}

// ─── Team Wellness ───────────────────────────────────────────

export interface TeamWellnessRecord {
  id: string;
  missionId: string;
  timestamp: string;
  missionDay: number;
  cohesionScore: number;        // 0–100
  communicationScore: number;   // 0–100
  collaborationScore: number;   // 0–100
  conflictIndicator: number;    // 0–100 (higher = more conflict indicators)
  isolationDurationDays: number;
  crewInteractionFrequency: number; // sessions/day estimate
  source: 'SIMULATED';
  dataOrigin: DataOrigin;
}

// ─── Alerts ──────────────────────────────────────────────────

export interface WellnessAlert {
  id: string;
  astronautId?: string;
  missionId?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  explanation: string;
  timestamp: string;
  acknowledged: boolean;
  source: DataOrigin;
}

// ─── Recommendations ─────────────────────────────────────────

export interface WellnessRecommendation {
  id: string;
  category: AlertCategory;
  triggerMetric: string;
  triggerValue: number;
  triggerThreshold: number;
  title: string;
  explanation: string;
  suggestedAction: string;
  supportingSource?: string;
  supportingSourceUrl?: string;
  isSimulated: boolean;
  researchInformed: boolean;
  timestamp: string;
}

// ─── NASA Research ───────────────────────────────────────────

export type ResearchCategory =
  | 'SLEEP'
  | 'CIRCADIAN'
  | 'BEHAVIORAL_HEALTH'
  | 'COGNITIVE_PERFORMANCE'
  | 'ISOLATION'
  | 'TEAM_COHESION'
  | 'HUMAN_FACTORS';

export interface NasaResearchEntry {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  categories: ResearchCategory[];
  description: string;
  keyFindings: string[];
  studyIdentifier?: string;
  publicationDate?: string;
  retrievedAt: string;
  isStaticMetadata: boolean; // true = curated; false = fetched live
  tags: string[];
}

// ─── Service Contracts ───────────────────────────────────────

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

// ─── App Context ─────────────────────────────────────────────

export interface WellnessModuleConfig {
  astronautId: string;
  missionId: string;
  dataProvider: WellnessDataProvider;
  enablePrivateNotes: boolean;
  disclaimerAccepted: boolean;
}

// ─── UI State ────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
  lastUpdated: string | null;
}

// ─── Chart Data Helpers ──────────────────────────────────────

export interface TrendDataPoint {
  date: string;        // display date
  missionDay: number;
  value: number;
  label?: string;
}

export interface SleepChartPoint {
  date: string;
  missionDay: number;
  durationHours: number;
  efficiency: number;
  targetHours: number;
}
