/**
 * ASTROCARE POSTGRESQL & SUPABASE DATABASE TYPES
 * Fully typed interfaces matching normalized SQL schema
 */

import { DataSourceType, QualityStatus } from './telemetry';

export type UserRole = 'ASTRONAUT' | 'MEDICAL_OFFICER' | 'MISSION_COMMANDER' | 'MISSION_CONTROLLER';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
export type MissionStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ABORTED';
export type IncidentStatus = 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
export type ReportType = 'DAILY_BRIEF' | 'ANOMALY_EXPLANATION' | 'MISSION_SUMMARY' | 'RADIATION_DOSSIER';

// ============================================================================
// 1. User & Authentication
// ============================================================================
export interface Profile {
  id: string;
  callsign: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  callsign: string;
  badge: string;
  astronautId?: string;
  isApproved: boolean;
  mfaEnabled?: boolean;
  mission?: string;
  organization?: string;
  specialization?: string;
  avatar_url?: string;
}

export interface ApprovalRequest {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  invitationCodeUsed?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// 2. Mission Management
// ============================================================================
export interface Mission {
  id: string;
  code: string;
  name: string;
  target_destination: string;
  status: MissionStatus;
  launch_date: string;
  scheduled_end_date: string;
  actual_end_date?: string;
  radiation_threshold_limit_msv: number;
  created_at: string;
}

export interface Astronaut {
  id: string;
  profile_id: string;
  badge_number: string;
  date_of_birth: string;
  blood_type: string;
  height_cm: number;
  baseline_mass_kg: number;
  baseline_resting_hr: number;
  baseline_bp_systolic: number;
  baseline_bp_diastolic: number;
  baseline_spo2: number;
  emergency_contact: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Relational join
  profile?: Profile;
}

export interface MissionMember {
  id: string;
  mission_id: string;
  astronaut_id: string;
  assigned_role: string;
  joined_at: string;
  // Relational joins
  astronaut?: Astronaut;
  mission?: Mission;
}

// ============================================================================
// 3. Physiological Telemetry
// ============================================================================
export interface TelemetrySourceRecord {
  id: string;
  name: string;
  source_type: DataSourceType;
  model_identifier: string;
  firmware_version?: string;
  is_hardware: boolean;
  status: 'ACTIVE' | 'CALIBRATING' | 'STANDBY' | 'FAULT';
  created_at: string;
}

export interface TelemetrySession {
  id: string;
  mission_id: string;
  astronaut_id: string;
  source_id: string;
  session_type: 'ROUTINE_MONITOR' | 'EVA_SORTIE' | 'EXERCISE_SESSION' | 'SIMULATION_TEST';
  started_at: string;
  ended_at?: string;
  quality_metric_pct: number;
}

export interface VitalReading {
  id: string;
  astronaut_id: string;
  mission_id: string;
  simulation_session_id?: string;
  timestamp: string;
  data_source: DataSourceType;
  is_simulated: boolean;
  heart_rate_bpm: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  spo2_percentage: number;
  respiratory_rate_rpm: number;
  core_temp_celsius: number;
  ecg_rhythm_strip?: number[];
  quality_status: QualityStatus;
  created_at: string;
}

// ============================================================================
// 4. Radiation Monitoring
// ============================================================================
export interface RadiationLog {
  id: string;
  astronaut_id: string;
  mission_id: string;
  timestamp: string;
  data_source: DataSourceType;
  is_simulated: boolean;
  dosimeter_id: string;
  ambient_flux_usv_per_hour: number;
  accumulated_dose_msv: number;
  solar_particle_event_active: boolean;
  radiation_type: string;
  created_at: string;
}

export interface SolarEvent {
  id: string;
  mission_id: string;
  detected_at: string;
  peak_flux_usv_per_hour: number;
  duration_minutes: number;
  flare_classification: 'C_CLASS' | 'M_CLASS' | 'X_CLASS';
  is_simulated: boolean;
  active_countermeasures_taken: string[];
}

// ============================================================================
// 5. Space Health Assessments
// ============================================================================
export interface BoneHealthAssessment {
  id: string;
  astronaut_id: string;
  assessment_date: string;
  measurement_modality: string;
  femoral_neck_bmd_g_cm2: number;
  lumbar_spine_bmd_g_cm2: number;
  t_score: number;
  z_score: number;
  percentage_loss_from_baseline: number;
  notes?: string;
  is_simulated: boolean;
  created_at: string;
}

export interface MuscleHealthAssessment {
  id: string;
  astronaut_id: string;
  assessment_date: string;
  isometric_grip_strength_kg: number;
  quadriceps_peak_torque_nm: number;
  calf_circumference_cm: number;
  percentage_strength_loss: number;
  evaluator_id?: string;
  is_simulated: boolean;
  created_at: string;
}

export interface LabResult {
  id: string;
  astronaut_id: string;
  sample_collected_at: string;
  test_type: string;
  wbc_count_10e3_ul: number;
  lymphocytes_percentage: number;
  neutrophils_percentage: number;
  crp_mg_l: number;
  cortisol_ug_dl: number;
  raw_panel_json: Record<string, unknown>;
  is_simulated: boolean;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  astronaut_id: string;
  session_start: string;
  duration_minutes: number;
  modality: 'T2_TREADMILL' | 'ARED_RESISTANCE' | 'CYCLE_ERGOMETER';
  avg_heart_rate_bpm: number;
  peak_heart_rate_bpm: number;
  work_load_joules?: number;
  calories_burned_kcal?: number;
  resistance_load_kg?: number;
  is_simulated: boolean;
  created_at: string;
}

// ============================================================================
// 6. Mental Wellness (Privacy Gated)
// ============================================================================
export interface WellnessAssessment {
  id: string;
  astronaut_id: string;
  timestamp: string;
  mood_score: number; // 1 to 10
  stress_level: number; // 1 to 10
  fatigue_level: number; // 1 to 10
  cognitive_clarity_score: number; // 1 to 10
  is_simulated: boolean;
  created_at: string;
}

export interface SleepLog {
  id: string;
  astronaut_id: string;
  sleep_start: string;
  sleep_end: string;
  total_sleep_minutes: number;
  rem_minutes?: number;
  deep_sleep_minutes?: number;
  light_sleep_minutes?: number;
  awakenings_count: number;
  sleep_quality_score: number;
  is_simulated: boolean;
  created_at: string;
}

export interface WellnessJournalEntry {
  id: string;
  astronaut_id: string;
  timestamp: string;
  journal_text: string;
  sentiment_label?: 'POSITIVE' | 'STABLE' | 'ELEVATED_STRESS' | 'DEPRESSIVE_TENDENCY';
  share_with_medical_officer: boolean;
  created_at: string;
}

// ============================================================================
// 7. Risk & Incident Management
// ============================================================================
export interface HealthAlert {
  id: string;
  mission_id: string;
  astronaut_id: string;
  timestamp: string;
  rule_code: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  triggering_value: string;
  baseline_expected?: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface Incident {
  id: string;
  mission_id: string;
  astronaut_id?: string;
  alert_id?: string;
  incident_number: string;
  title: string;
  severity: AlertSeverity;
  root_cause_category: 'CARDIOVASCULAR' | 'ENVIRONMENTAL' | 'RADIATION' | 'PSYCHOSOCIAL' | 'EQUIPMENT';
  status: IncidentStatus;
  opened_by: string;
  opened_at: string;
  closed_at?: string;
  action_log: Array<{ timestamp: string; action: string; authorId: string }>;
}

export interface AlertAcknowledgement {
  id: string;
  alert_id: string;
  acknowledged_by: string;
  timestamp: string;
  clinical_decision: 'MONITORING_CONTINUED' | 'INTERVENTION_REQUIRED' | 'COUNTERMEASURE_PRESCRIBED';
  rationale: string;
}

// ============================================================================
// 8. AI & Reporting
// ============================================================================
export interface AIAnalysisRecord {
  id: string;
  astronaut_id: string;
  mission_id: string;
  report_type: ReportType;
  generated_at: string;
  prompt_context_summary: string;
  ai_response_markdown: string;
  model_version: string;
  disclaimer_acknowledged: boolean;
  citations_json: Array<{ source: string; metric: string; timestamp: string }>;
}

export interface HealthReport {
  id: string;
  mission_id: string;
  astronaut_id?: string;
  report_title: string;
  report_type: 'DAILY_CLINICAL_BRIEF' | 'WEEKLY_ORGAN_STATUS' | 'MISSION_RAD_SUMMARY';
  generated_by: string;
  created_at: string;
  file_size_bytes?: number;
  pdf_storage_path?: string;
  metadata: Record<string, unknown>;
}

// ============================================================================
// 9. Simulation
// ============================================================================
export interface SimulationSession {
  id: string;
  mission_id: string;
  scenario_id: string;
  scenario_name: string;
  started_by: string;
  time_multiplier: number;
  is_active: boolean;
  started_at: string;
  ended_at?: string;
}

export interface SimulationScenario {
  id: string;
  code: string;
  name: string;
  description: string;
  target_system: 'CARDIOVASCULAR' | 'RESPIRATORY' | 'DOSIMETRY' | 'NEUROLOGICAL' | 'COMPOUND';
  default_duration_seconds: number;
  severity: AlertSeverity;
}

export interface SimulationEvent {
  id: string;
  session_id: string;
  event_timestamp: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// 10. Audit Logging
// ============================================================================
export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_name: string;
  entity_id: string;
  ip_address?: string;
  details: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// 11. Daily Astronaut Self-Assessment
// ============================================================================
export interface DailySelfAssessment {
  id: string;
  astronaut_id: string;
  date: string;
  overall_wellbeing: number; // 1-10
  sleep_quality: number; // 1-10
  sleep_hours: number;
  fatigue_level: number; // 1-10
  pain_level: number; // 0-10
  pain_locations: string[];
  dizziness_or_vertigo: boolean;
  vision_changes: boolean;
  stress_level: number; // 1-10
  mood_score: number; // 1-10
  exercise_completed: boolean;
  exercise_duration_minutes: number;
  notes: string;
  escalated_to_medical: boolean;
  escalation_reason?: string;
  created_at: string;
}

// ============================================================================
// 12. Exercise & Musculoskeletal Logs
// ============================================================================
export interface ExerciseRecord {
  id: string;
  astronaut_id: string;
  date: string;
  exercise_type: 'ARED_SQUAT' | 'ARED_DEADLIFT' | 'ARED_BENCH' | 'CYCLE_ERGOMETER' | 'T2_TREADMILL';
  duration_minutes: number;
  load_kg_or_watts: number;
  peak_heart_rate: number;
  calories_burned: number;
  notes?: string;
}

// ============================================================================
// 13. Laboratory & Immune Biomarkers
// ============================================================================
export interface LaboratoryBiomarker {
  id: string;
  astronaut_id: string;
  biomarker_name: string;
  category: 'IMMUNE' | 'INFLAMMATORY' | 'METABOLIC' | 'HEMATOLOGY';
  observed_value: number;
  unit: string;
  reference_low: number;
  reference_high: number;
  collection_timestamp: string;
  is_abnormal: boolean;
  source_instrument: string;
}

// ============================================================================
// 14. Curated Medical Protocols
// ============================================================================
export interface MedicalProtocol {
  id: string;
  code: string;
  title: string;
  category: 'EMERGENCY' | 'COUNTERMEASURE' | 'ROUTINE' | 'ISOLATION';
  severity: AlertSeverity;
  version: string;
  indications: string[];
  steps: Array<{ stepNumber: number; instruction: string; critical: boolean }>;
  contraindications: string[];
  escalation_channel: string;
}

// ============================================================================
// 15. NASA Research Evidence Records
// ============================================================================
export interface NASAResearchRecord {
  id: string;
  title: string;
  program: 'NASA HRP' | 'NASA OSDR' | 'NASA GENELAB' | 'NASA TECHNICAL REPORTS';
  authors: string;
  publication_year: number;
  abstract: string;
  doi_or_url: string;
  dataset_id?: string;
  health_category: 'CARDIOVASCULAR' | 'RADIATION' | 'NEURO_OCULAR' | 'IMMUNE' | 'MUSCULOSKELETAL' | 'BEHAVIORAL';
}

// ============================================================================
// 16. Health Twin Baseline Deviation
// ============================================================================
export interface HealthTwinDeviation {
  metric: string;
  currentValue: number;
  baselineValue: number;
  delta: number;
  zScore: number;
  unit: string;
  status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  whatChanged: string;
  whenChanged: string;
  relevantCorrelations: string[];
  requiresReview: boolean;
  recommendedAction: string;
}

