import { supabase, createServiceResponse } from '@/lib/supabase/client';
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
} from './contracts';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';

export const supabaseMissionService: IMissionService = {
  async getActiveMission() {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('launch_date', { ascending: false })
      .limit(1)
      .single();

    return createServiceResponse(data, error?.message);
  },
  async getAllMissions() {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('launch_date', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async getMissionById(id: string) {
    const { data, error } = await supabase.from('missions').select('*').eq('id', id).single();
    return createServiceResponse(data, error?.message);
  },
};

export const supabaseAstronautService: IAstronautService = {
  async getAstronautsByMission(missionId: string) {
    const { data, error } = await supabase
      .from('mission_members')
      .select('astronaut:astronauts(*, profile:profiles(*))')
      .eq('mission_id', missionId);

    const astronauts = (data || []).map((row: any) => row.astronaut).filter(Boolean);
    return createServiceResponse(astronauts, error?.message);
  },
  async getAstronautById(id: string) {
    const { data, error } = await supabase
      .from('astronauts')
      .select('*, profile:profiles(*)')
      .eq('id', id)
      .single();

    return createServiceResponse(data, error?.message);
  },
  async updateBaseline(astronautId: string, updates: any) {
    const { data, error } = await supabase
      .from('astronauts')
      .update(updates)
      .eq('id', astronautId)
      .select('*, profile:profiles(*)')
      .single();

    return createServiceResponse(data, error?.message);
  },
};

export const supabaseTelemetryService: ITelemetryService = {
  async getLatestVitals(astronautId: string) {
    const { data, error } = await supabase
      .from('vital_readings')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    return createServiceResponse(data, error?.message);
  },
  async getRecentVitals(astronautId: string, limit = 50) {
    const { data, error } = await supabase
      .from('vital_readings')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    return createServiceResponse(data || [], error?.message);
  },
  async recordVitalPacket(packet: VitalSignsPacket) {
    const row = {
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
    };

    const { data, error } = await supabase.from('vital_readings').insert(row).select().single();
    return createServiceResponse(data, error?.message);
  },
};

export const supabaseRadiationService: IRadiationService = {
  async getLatestRadiation(missionId: string) {
    const { data, error } = await supabase
      .from('radiation_logs')
      .select('*')
      .eq('mission_id', missionId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    return createServiceResponse(data, error?.message);
  },
  async getRecentRadiationLogs(missionId: string, limit = 20) {
    const { data, error } = await supabase
      .from('radiation_logs')
      .select('*')
      .eq('mission_id', missionId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    return createServiceResponse(data || [], error?.message);
  },
  async recordRadiationPacket(packet: RadiationPacket) {
    const row = {
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
    };

    const { data, error } = await supabase.from('radiation_logs').insert(row).select().single();
    return createServiceResponse(data, error?.message);
  },
};

export const supabaseHealthAssessmentService: IHealthAssessmentService = {
  async getBoneAssessments(astronautId: string) {
    const { data, error } = await supabase
      .from('bone_health_assessments')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('assessment_date', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async getMuscleAssessments(astronautId: string) {
    const { data, error } = await supabase
      .from('muscle_health_assessments')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('assessment_date', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async getLabResults(astronautId: string) {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('sample_collected_at', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async getExerciseLogs(astronautId: string, limit = 10) {
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('session_start', { ascending: false })
      .limit(limit);

    return createServiceResponse(data || [], error?.message);
  },
};

export const supabaseWellnessService: IWellnessService = {
  async getWellnessAssessments(astronautId: string) {
    const { data, error } = await supabase
      .from('wellness_assessments')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('timestamp', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async getSleepLogs(astronautId: string, limit = 7) {
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('sleep_start', { ascending: false })
      .limit(limit);

    return createServiceResponse(data || [], error?.message);
  },
  async getPrivateJournalEntries(astronautId: string) {
    // Relies directly on PostgreSQL RLS policy
    const { data, error } = await supabase
      .from('wellness_journal_entries')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('timestamp', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async submitJournalEntry(entry) {
    const { data, error } = await supabase
      .from('wellness_journal_entries')
      .insert(entry)
      .select()
      .single();

    return createServiceResponse(data, error?.message);
  },
};

export const supabaseAlertService: IAlertService = {
  async getActiveAlerts(missionId: string) {
    const { data, error } = await supabase
      .from('health_alerts')
      .select('*')
      .eq('mission_id', missionId)
      .eq('status', 'ACTIVE')
      .order('timestamp', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async getAllAlerts(missionId: string, limit = 50) {
    const { data, error } = await supabase
      .from('health_alerts')
      .select('*')
      .eq('mission_id', missionId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    return createServiceResponse(data || [], error?.message);
  },
  async acknowledgeAlert(alertId: string, acknowledgedBy: string, notes?: string) {
    const { data, error } = await supabase
      .from('health_alerts')
      .update({
        status: 'ACKNOWLEDGED',
        acknowledged_by: acknowledgedBy,
        acknowledged_at: new Date().toISOString(),
        resolution_notes: notes,
      })
      .eq('id', alertId)
      .select()
      .single();

    return createServiceResponse(data, error?.message);
  },
  async resolveAlert(alertId: string, resolvedBy: string, notes?: string) {
    const { data, error } = await supabase
      .from('health_alerts')
      .update({
        status: 'RESOLVED',
        acknowledged_by: resolvedBy,
        acknowledged_at: new Date().toISOString(),
        resolution_notes: notes || 'Resolved by medical operations',
      })
      .eq('id', alertId)
      .select()
      .single();

    return createServiceResponse(data, error?.message);
  },
  async createAlert(alert) {
    const row = {
      ...alert,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('health_alerts').insert(row).select().single();
    return createServiceResponse(data, error?.message);
  },
  async getIncidents(missionId: string) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('mission_id', missionId)
      .order('opened_at', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
};

export const supabaseReportService: IReportService = {
  async getAIRecords(astronautId: string) {
    const { data, error } = await supabase
      .from('ai_analysis_records')
      .select('*')
      .eq('astronaut_id', astronautId)
      .order('generated_at', { ascending: false });

    return createServiceResponse(data || [], error?.message);
  },
  async createAIRecord(record) {
    const { data, error } = await supabase
      .from('ai_analysis_records')
      .insert(record)
      .select()
      .single();

    return createServiceResponse(data, error?.message);
  },
};

export const supabaseSimulationService: ISimulationService = {
  async getActiveSession(missionId: string) {
    const { data, error } = await supabase
      .from('simulation_sessions')
      .select('*')
      .eq('mission_id', missionId)
      .eq('is_active', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    return createServiceResponse(data, error?.message);
  },
  async startSession(missionId, scenarioId, scenarioName, startedBy, multiplier = 1.0) {
    const session = {
      mission_id: missionId,
      scenario_id: scenarioId,
      scenario_name: scenarioName,
      started_by: startedBy,
      time_multiplier: multiplier,
      is_active: true,
      started_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('simulation_sessions')
      .insert(session)
      .select()
      .single();

    return createServiceResponse(data, error?.message);
  },
  async stopSession(sessionId: string) {
    const { error } = await supabase
      .from('simulation_sessions')
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq('id', sessionId);

    return createServiceResponse(true, error?.message);
  },
};
