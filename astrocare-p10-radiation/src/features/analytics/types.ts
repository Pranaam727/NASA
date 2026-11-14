/**
 * ASTROCARE HEALTH ANALYTICS & RISK ENGINE TYPE DEFINITIONS
 * Standardized data contracts for personal baseline deviation analysis,
 * deterministic multi-parameter risk evaluation, and alert management.
 */

import { AlertSeverity } from '@/types/database.types';

export type RiskLevel = 'NORMAL' | 'CAUTION' | 'WARNING' | 'CRITICAL';

export type SubsystemCategory =
  | 'CARDIOVASCULAR'
  | 'RESPIRATORY'
  | 'RADIATION'
  | 'METABOLIC_THERMAL';

export type HealthParameter =
  | 'HEART_RATE'
  | 'SPO2'
  | 'BLOOD_PRESSURE_SYS'
  | 'BLOOD_PRESSURE_DIA'
  | 'RESPIRATORY_RATE'
  | 'CORE_TEMP'
  | 'RADIATION_FLUX';

export interface ParameterDeviation {
  parameter: HealthParameter;
  label: string;
  unit: string;
  currentValue: number;
  baselineValue: number;
  delta: number;
  percentDelta: number;
  zScore: number;
  direction: 'ELEVATED' | 'DEPRESSED' | 'NOMINAL';
  riskLevel: RiskLevel;
  clinicalSignificance: string;
}

export interface SubsystemRisk {
  category: SubsystemCategory;
  name: string;
  score: number; // 0 to 100
  level: RiskLevel;
  contributingFactors: string[];
  primaryParameter: string;
}

export interface CompositeRiskAssessment {
  astronautId: string;
  missionId: string;
  timestamp: string;
  compositeScore: number; // 0 to 100
  riskLevel: RiskLevel;
  subsystems: Record<SubsystemCategory, SubsystemRisk>;
  activeSynergies: string[];
  recommendation: string;
}

export interface AstronautBaselineProfile {
  astronautId: string;
  callsign: string;
  fullName: string;
  restingHr: number;
  spo2: number;
  bpSystolic: number;
  bpDiastolic: number;
  respiratoryRate: number;
  coreTemp: number;
  radiationFlux: number;
}

export interface EvaluatedAlertRule {
  ruleCode: string;
  title: string;
  category: SubsystemCategory;
  severity: AlertSeverity;
  affectedParameter: HealthParameter | 'COMPOUND';
  triggeringValue: string;
  baselineExpected: string;
  description: string;
}

export interface RiskHistoryPoint {
  time: string;
  timestamp: string;
  compositeScore: number;
  cardioScore: number;
  respiratoryScore: number;
  radiationScore: number;
}
