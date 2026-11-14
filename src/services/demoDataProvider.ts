import {
  IMissionService,
  IAstronautService,
  ITelemetryService,
  IRadiationService,
  IHealthAssessmentService,
  IWellnessService,
  IAlertService,
  IReportService,
  ISimulationService,
  ServiceResponse,
} from './contracts';
import {
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
  Mission,
  HealthAlert,
} from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import {
  SEED_MISSION,
  SEED_ASTRONAUTS,
  SEED_VITALS,
  SEED_RADIATION,
  SEED_ALERTS,
  SEED_INCIDENTS,
  SEED_JOURNALS,
  SEED_SIMULATION_SESSION,
} from '@/data/seedData';

// In-Memory State for Demonstration Mode
let activeMission = { ...SEED_MISSION };
let astronauts = [...SEED_ASTRONAUTS];
let vitalReadings: Record<string, VitalReading[]> = {
  'ASTRO-01': [SEED_VITALS['ASTRO-01']],
  'ASTRO-02': [SEED_VITALS['ASTRO-02']],
};
let radiationLogs = [SEED_RADIATION];
let alerts = [...SEED_ALERTS];
let incidents = [...SEED_INCIDENTS];
let journals = [...SEED_JOURNALS];
let aiRecords: AIAnalysisRecord[] = [];
let activeSession: SimulationSession = { ...SEED_SIMULATION_SESSION };

const wrap = <T>(data: T | null, error: string | null = null): ServiceResponse<T> => ({
  data,
  error,
  isDemoMode: true,
});

export const demoMissionService: IMissionService = {
  async getActiveMission() {
    return wrap(activeMission);
  },
  async getAllMissions() {
    return wrap([activeMission]);
  },
  async getMissionById(id: string) {
    if (activeMission.id === id || activeMission.code === id) {
      return wrap(activeMission);
    }
    return wrap<Mission>(null, 'Mission not found');
  },
};

export const demoAstronautService: IAstronautService = {
  async getAstronautsByMission() {
    return wrap(astronauts);
  },
  async getAstronautById(id: string) {
    const astro = astronauts.find((a) => a.id === id || a.profile?.callsign === id);
    if (!astro) return wrap<Astronaut>(null, 'Astronaut not found');
    return wrap(astro);
  },
  async updateBaseline(astronautId: string, updates: Partial<Astronaut>) {
    const idx = astronauts.findIndex((a) => a.id === astronautId);
    if (idx === -1) return wrap<Astronaut>(null, 'Astronaut not found');
    astronauts[idx] = { ...astronauts[idx], ...updates, updated_at: new Date().toISOString() };
    return wrap(astronauts[idx]);
  },
};

export const demoTelemetryService: ITelemetryService = {
  async getLatestVitals(astronautId: string) {
    const history = vitalReadings[astronautId] || [];
    if (history.length > 0) {
      return wrap(history[0]);
    }
    // Return baseline synthetic record
    const astro = astronauts.find((a) => a.id === astronautId) || astronauts[0];
    const generated: VitalReading = {
      id: `vr-syn-${Date.now()}`,
      astronaut_id: astronautId,
      mission_id: activeMission.id,
      timestamp: new Date().toISOString(),
      data_source: 'SIMULATOR',
      is_simulated: true,
      heart_rate_bpm: astro.baseline_resting_hr,
      blood_pressure_systolic: astro.baseline_bp_systolic,
      blood_pressure_diastolic: astro.baseline_bp_diastolic,
      spo2_percentage: astro.baseline_spo2,
      respiratory_rate_rpm: 14,
      core_temp_celsius: 36.8,
      quality_status: 'NOMINAL',
      created_at: new Date().toISOString(),
    };
    return wrap(generated);
  },
  async getRecentVitals(astronautId: string, limit = 50) {
    const history = vitalReadings[astronautId] || [];
    return wrap(history.slice(0, limit));
  },
  async recordVitalPacket(packet: VitalSignsPacket) {
    const reading: VitalReading = {
      id: packet.packetId,
      astronaut_id: packet.astronautId,
      mission_id: packet.missionId,
      timestamp: packet.timestamp,
      data_source: packet.dataSource,
      is_simulated: packet.isSimulated,
      heart_rate_bpm: packet.vitals.heartRate.value,
      blood_pressure_systolic: packet.vitals.bloodPressure.systolic,
      blood_pressure_diastolic: packet.vitals.bloodPressure.diastolic,
      spo2_percentage: packet.vitals.spo2.value,
      respiratory_rate_rpm: packet.vitals.respiratoryRate.value,
      core_temp_celsius: packet.vitals.coreTemp.value,
      ecg_rhythm_strip: packet.vitals.ecgStrip?.values,
      quality_status: packet.vitals.heartRate.quality,
      created_at: new Date().toISOString(),
    };

    if (!vitalReadings[packet.astronautId]) {
      vitalReadings[packet.astronautId] = [];
    }
    vitalReadings[packet.astronautId].unshift(reading);
    if (vitalReadings[packet.astronautId].length > 100) {
      vitalReadings[packet.astronautId].pop();
    }

    return wrap(reading);
  },
};

export const demoRadiationService: IRadiationService = {
  async getLatestRadiation() {
    return wrap(radiationLogs[0] || SEED_RADIATION);
  },
  async getRecentRadiationLogs(_missionId: string, limit = 20) {
    return wrap(radiationLogs.slice(0, limit));
  },
  async recordRadiationPacket(packet: RadiationPacket) {
    const log: RadiationLog = {
      id: packet.packetId,
      astronaut_id: packet.astronautId,
      mission_id: packet.missionId,
      timestamp: packet.timestamp,
      data_source: packet.dataSource,
      is_simulated: packet.isSimulated,
      dosimeter_id: 'DOS-ARES-CH1',
      ambient_flux_usv_per_hour: packet.ambientFluxUsVh,
      accumulated_dose_msv: packet.accumulatedDoseMSv,
      solar_particle_event_active: packet.solarParticleEventActive,
      radiation_type: 'GALACTIC_COSMIC',
      created_at: new Date().toISOString(),
    };
    radiationLogs.unshift(log);
    return wrap(log);
  },
};

export const demoHealthAssessmentService: IHealthAssessmentService = {
  async getBoneAssessments(astronautId: string) {
    const assessments: BoneHealthAssessment[] = [
      {
        id: 'dxa-001',
        astronaut_id: astronautId,
        assessment_date: '2026-10-15',
        measurement_modality: 'DXA_SCAN_SIMULATED',
        femoral_neck_bmd_g_cm2: 0.942,
        lumbar_spine_bmd_g_cm2: 1.012,
        t_score: -0.3,
        z_score: -0.2,
        percentage_loss_from_baseline: 1.2,
        notes: 'Expected initial microgravity calcium remodeling.',
        is_simulated: true,
        created_at: '2026-10-15T00:00:00Z',
      },
    ];
    return wrap(assessments);
  },
  async getMuscleAssessments(astronautId: string) {
    const assessments: MuscleHealthAssessment[] = [
      {
        id: 'mus-001',
        astronaut_id: astronautId,
        assessment_date: '2026-10-20',
        isometric_grip_strength_kg: 52.4,
        quadriceps_peak_torque_nm: 204.0,
        calf_circumference_cm: 36.8,
        percentage_strength_loss: 2.8,
        is_simulated: true,
        created_at: '2026-10-20T00:00:00Z',
      },
    ];
    return wrap(assessments);
  },
  async getLabResults(astronautId: string) {
    const labs: LabResult[] = [
      {
        id: 'lab-001',
        astronaut_id: astronautId,
        sample_collected_at: '2026-10-25T08:00:00Z',
        test_type: 'IN_FLIGHT_HEMATOLOGY',
        wbc_count_10e3_ul: 6.8,
        lymphocytes_percentage: 31.5,
        neutrophils_percentage: 58.2,
        crp_mg_l: 1.1,
        cortisol_ug_dl: 14.2,
        raw_panel_json: { rbc_million_ul: 4.82, platelets_k_ul: 240 },
        is_simulated: true,
        created_at: '2026-10-25T09:00:00Z',
      },
    ];
    return wrap(labs);
  },
  async getExerciseLogs(astronautId: string, limit = 10) {
    const logs: ExerciseLog[] = [
      {
        id: 'ex-001',
        astronaut_id: astronautId,
        session_start: new Date(Date.now() - 86400000).toISOString(),
        duration_minutes: 45,
        modality: 'ARED_RESISTANCE',
        avg_heart_rate_bpm: 128,
        peak_heart_rate_bpm: 154,
        calories_burned_kcal: 420,
        resistance_load_kg: 110.0,
        is_simulated: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    return wrap(logs.slice(0, limit));
  },
};

export const demoWellnessService: IWellnessService = {
  async getWellnessAssessments(astronautId: string) {
    const data: WellnessAssessment[] = [
      {
        id: 'w-001',
        astronaut_id: astronautId,
        timestamp: new Date().toISOString(),
        mood_score: 8,
        stress_level: 3,
        fatigue_level: 2,
        cognitive_clarity_score: 9,
        is_simulated: false,
        created_at: new Date().toISOString(),
      },
    ];
    return wrap(data);
  },
  async getSleepLogs(astronautId: string, limit = 7) {
    const logs: SleepLog[] = [
      {
        id: 'slp-001',
        astronaut_id: astronautId,
        sleep_start: new Date(Date.now() - 36000000).toISOString(),
        sleep_end: new Date(Date.now() - 7200000).toISOString(),
        total_sleep_minutes: 480,
        rem_minutes: 110,
        deep_sleep_minutes: 135,
        light_sleep_minutes: 235,
        awakenings_count: 1,
        sleep_quality_score: 88,
        is_simulated: true,
        created_at: new Date().toISOString(),
      },
    ];
    return wrap(logs.slice(0, limit));
  },
  async getPrivateJournalEntries(astronautId: string, currentUserId: string, userRole: string) {
    // Strict RLS privacy emulation
    const astro = astronauts.find((a) => a.id === astronautId);
    const isOwner = astro && astro.profile_id === currentUserId;
    const isMedicalOfficer = userRole === 'MEDICAL_OFFICER';

    const visible = journals.filter((j) => {
      if (j.astronaut_id !== astronautId) return false;
      if (isOwner) return true;
      if (isMedicalOfficer && j.share_with_medical_officer) return true;
      return false; // Mission Controllers & unauthorized users get 0 entries
    });

    return wrap(visible);
  },
  async submitJournalEntry(entry) {
    const newEntry: WellnessJournalEntry = {
      id: `jrn-${Date.now()}`,
      ...entry,
      created_at: new Date().toISOString(),
    };
    journals.unshift(newEntry);
    return wrap(newEntry);
  },
};

export const demoAlertService: IAlertService = {
  async getActiveAlerts() {
    return wrap(alerts.filter((a) => a.status === 'ACTIVE'));
  },
  async getAllAlerts() {
    return wrap(alerts);
  },
  async acknowledgeAlert(alertId: string, acknowledgedBy: string, notes?: string) {
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx === -1) return wrap<HealthAlert>(null, 'Alert not found');
    alerts[idx] = {
      ...alerts[idx],
      status: 'ACKNOWLEDGED',
      acknowledged_by: acknowledgedBy,
      acknowledged_at: new Date().toISOString(),
      resolution_notes: notes || 'Reviewed by medical officer',
    };
    return wrap(alerts[idx]);
  },
  async resolveAlert(alertId: string, resolvedBy: string, notes?: string) {
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx === -1) return wrap<HealthAlert>(null, 'Alert not found');
    alerts[idx] = {
      ...alerts[idx],
      status: 'RESOLVED',
      acknowledged_by: alerts[idx].acknowledged_by || resolvedBy,
      acknowledged_at: alerts[idx].acknowledged_at || new Date().toISOString(),
      resolution_notes: notes || 'Condition stabilized; resolved by medical operations',
    };
    return wrap(alerts[idx]);
  },
  async createAlert(alert) {
    const newAlert: HealthAlert = {
      id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...alert,
      created_at: new Date().toISOString(),
    };
    alerts.unshift(newAlert);
    return wrap(newAlert);
  },
  async getIncidents() {
    return wrap(incidents);
  },
};

export const demoReportService: IReportService = {
  async getAIRecords(astronautId: string) {
    return wrap(aiRecords.filter((r) => r.astronaut_id === astronautId));
  },
  async createAIRecord(record) {
    const newRecord: AIAnalysisRecord = {
      id: `ai-${Date.now()}`,
      ...record,
      generated_at: new Date().toISOString(),
    };
    aiRecords.unshift(newRecord);
    return wrap(newRecord);
  },
};

export const demoSimulationService: ISimulationService = {
  async getActiveSession() {
    return wrap(activeSession);
  },
  async startSession(missionId, scenarioId, scenarioName, startedBy, multiplier = 1.0) {
    activeSession = {
      id: `sim-${Date.now()}`,
      mission_id: missionId,
      scenario_id: scenarioId,
      scenario_name: scenarioName,
      started_by: startedBy,
      time_multiplier: multiplier,
      is_active: true,
      started_at: new Date().toISOString(),
    };
    return wrap(activeSession);
  },
  async stopSession() {
    activeSession.is_active = false;
    activeSession.ended_at = new Date().toISOString();
    return wrap(true);
  },
};
