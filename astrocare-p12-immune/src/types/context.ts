/**
 * AstroCare P12 - Core Context & Mission Types
 */

export type MissionPhase = 'PRE_FLIGHT' | 'IN_FLIGHT' | 'POST_FLIGHT' | 'RECOVERY';

export type MonitoringState = 'NORMAL' | 'MONITOR' | 'WARNING' | 'CRITICAL' | 'INSUFFICIENT_DATA';

export type DataOrigin = 'SIMULATED' | 'NASA_RESEARCH' | 'EXTERNAL_IMPORT' | 'USER_DEMO';

export interface AstronautContext {
  astronautId: string;
  name: string;
  missionId: string;
  missionName: string;
  missionDurationDays: number;
  missionElapsedDays: number;
  missionPhase: MissionPhase;
  crewRole: string;
  age: number;
  latestSampleDate: string;
  latestResultDate: string;
  overallMonitoringState: MonitoringState;
  dataOrigin: DataOrigin;
}

export interface OptionalRadiationContext {
  cumulativeDoseMsv: number;
  dailyAvgDoseMsv: number;
  solarParticleEventActive: boolean;
  gcrFluxIndex: number;
  lastUpdated: string;
  sourceModule: 'P10_RADIATION_INTELLIGENCE';
}

export interface OptionalWellnessContext {
  sleepScoreAvg: number; // 0 - 100
  circadianPhaseAlignment: number; // %
  subjectiveStressIndex: number; // 0 - 10
  fatigueIndex: number; // 0 - 10
  lastUpdated: string;
  sourceModule: 'P11_WELLNESS_INTELLIGENCE';
}
