import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  demoMissionService,
  demoAstronautService,
  demoTelemetryService,
  demoRadiationService,
  demoHealthAssessmentService,
  demoWellnessService,
  demoAlertService,
  demoReportService,
  demoSimulationService,
} from './demoDataProvider';
import {
  supabaseMissionService,
  supabaseAstronautService,
  supabaseTelemetryService,
  supabaseRadiationService,
  supabaseHealthAssessmentService,
  supabaseWellnessService,
  supabaseAlertService,
  supabaseReportService,
  supabaseSimulationService,
} from './supabaseDataProvider';
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

const useLiveSupabase = isSupabaseConfigured();

/**
 * Universal Data Layer Provider
 * Automatically selects Supabase when configured, or DemoDataProvider for standalone hackathon demonstration.
 */
export const missionService: IMissionService = useLiveSupabase
  ? supabaseMissionService
  : demoMissionService;

export const astronautService: IAstronautService = useLiveSupabase
  ? supabaseAstronautService
  : demoAstronautService;

export const telemetryService: ITelemetryService = useLiveSupabase
  ? supabaseTelemetryService
  : demoTelemetryService;

export const radiationService: IRadiationService = useLiveSupabase
  ? supabaseRadiationService
  : demoRadiationService;

export const healthAssessmentService: IHealthAssessmentService = useLiveSupabase
  ? supabaseHealthAssessmentService
  : demoHealthAssessmentService;

export const wellnessService: IWellnessService = useLiveSupabase
  ? supabaseWellnessService
  : demoWellnessService;

export const alertService: IAlertService = useLiveSupabase
  ? supabaseAlertService
  : demoAlertService;

export const reportService: IReportService = useLiveSupabase
  ? supabaseReportService
  : demoReportService;

export const simulationService: ISimulationService = useLiveSupabase
  ? supabaseSimulationService
  : demoSimulationService;

export const isDemoMode = !useLiveSupabase;
