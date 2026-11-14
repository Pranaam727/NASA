export type {
  AlertSeverity,
  AlertStatus,
  HealthAlert,
  Incident,
  Mission,
  Astronaut,
  VitalReading,
  RadiationLog,
  BoneHealthAssessment,
  MuscleHealthAssessment,
  LabResult,
  ExerciseLog,
  WellnessAssessment,
  SleepLog,
  WellnessJournalEntry,
  AIAnalysisRecord,
  SimulationSession,
} from '@/types/database.types';
import {
  Mission,
  Astronaut,
  VitalReading,
  RadiationLog,
  BoneHealthAssessment,
  MuscleHealthAssessment,
  LabResult,
  ExerciseLog,
  WellnessAssessment,
  SleepLog,
  WellnessJournalEntry,
  HealthAlert,
  Incident,
  AIAnalysisRecord,
  SimulationSession,
} from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  isDemoMode: boolean;
}

export interface IMissionService {
  getActiveMission(): Promise<ServiceResponse<Mission>>;
  getAllMissions(): Promise<ServiceResponse<Mission[]>>;
  getMissionById(id: string): Promise<ServiceResponse<Mission>>;
}

export interface IAstronautService {
  getAstronautsByMission(missionId: string): Promise<ServiceResponse<Astronaut[]>>;
  getAstronautById(id: string): Promise<ServiceResponse<Astronaut>>;
  updateBaseline(
    astronautId: string,
    updates: Partial<Astronaut>
  ): Promise<ServiceResponse<Astronaut>>;
}

export interface ITelemetryService {
  getLatestVitals(astronautId: string): Promise<ServiceResponse<VitalReading>>;
  getRecentVitals(astronautId: string, limit?: number): Promise<ServiceResponse<VitalReading[]>>;
  recordVitalPacket(packet: VitalSignsPacket): Promise<ServiceResponse<VitalReading>>;
}

export interface IRadiationService {
  getLatestRadiation(missionId: string): Promise<ServiceResponse<RadiationLog>>;
  getRecentRadiationLogs(
    missionId: string,
    limit?: number
  ): Promise<ServiceResponse<RadiationLog[]>>;
  recordRadiationPacket(packet: RadiationPacket): Promise<ServiceResponse<RadiationLog>>;
}

export interface IHealthAssessmentService {
  getBoneAssessments(astronautId: string): Promise<ServiceResponse<BoneHealthAssessment[]>>;
  getMuscleAssessments(astronautId: string): Promise<ServiceResponse<MuscleHealthAssessment[]>>;
  getLabResults(astronautId: string): Promise<ServiceResponse<LabResult[]>>;
  getExerciseLogs(astronautId: string, limit?: number): Promise<ServiceResponse<ExerciseLog[]>>;
}

export interface IWellnessService {
  getWellnessAssessments(astronautId: string): Promise<ServiceResponse<WellnessAssessment[]>>;
  getSleepLogs(astronautId: string, limit?: number): Promise<ServiceResponse<SleepLog[]>>;
  getPrivateJournalEntries(
    astronautId: string,
    currentUserId: string,
    userRole: string
  ): Promise<ServiceResponse<WellnessJournalEntry[]>>;
  submitJournalEntry(
    entry: Omit<WellnessJournalEntry, 'id' | 'created_at'>
  ): Promise<ServiceResponse<WellnessJournalEntry>>;
}

export interface IAlertService {
  getActiveAlerts(missionId: string): Promise<ServiceResponse<HealthAlert[]>>;
  getAllAlerts(missionId: string, limit?: number): Promise<ServiceResponse<HealthAlert[]>>;
  acknowledgeAlert(
    alertId: string,
    acknowledgedBy: string,
    notes?: string
  ): Promise<ServiceResponse<HealthAlert>>;
  resolveAlert?(
    alertId: string,
    resolvedBy: string,
    notes?: string
  ): Promise<ServiceResponse<HealthAlert>>;
  recordAlert?(
    alert: HealthAlert
  ): Promise<ServiceResponse<HealthAlert>>;
  getIncidents(missionId: string): Promise<ServiceResponse<Incident[]>>;
}

export interface IReportService {
  getAIRecords(astronautId: string): Promise<ServiceResponse<AIAnalysisRecord[]>>;
  createAIRecord(
    record: Omit<AIAnalysisRecord, 'id' | 'generated_at'>
  ): Promise<ServiceResponse<AIAnalysisRecord>>;
}

export interface ISimulationService {
  getActiveSession(missionId: string): Promise<ServiceResponse<SimulationSession>>;
  startSession(
    missionId: string,
    scenarioId: string,
    scenarioName: string,
    startedBy: string,
    multiplier?: number
  ): Promise<ServiceResponse<SimulationSession>>;
  stopSession(sessionId: string): Promise<ServiceResponse<boolean>>;
}
