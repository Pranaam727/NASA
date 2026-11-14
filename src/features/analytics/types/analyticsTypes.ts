import { QualityStatus } from '@/types/telemetry';
import { AlertSeverity } from '@/types/database.types';

export type RiskLevel = 'NORMAL' | 'CAUTION' | 'WARNING' | 'CRITICAL';

export type VitalParameter =
  | 'HEART_RATE'
  | 'SPO2'
  | 'BLOOD_PRESSURE_SYS'
  | 'BLOOD_PRESSURE_DIA'
  | 'CORE_TEMP'
  | 'RESPIRATORY_RATE'
  | 'RADIATION_FLUX';

export interface ParameterThresholds {
  cautionLow?: number;
  warningLow?: number;
  criticalLow?: number;
  cautionHigh?: number;
  warningHigh?: number;
  criticalHigh?: number;
}

export interface ParameterRiskConfig {
  parameter: VitalParameter;
  label: string;
  unit: string;
  weight: number; // 0.0 - 1.0 weight in composite risk score
  standardDeviation: number; // Biological standard deviation for z-score
  thresholds: ParameterThresholds;
}

export interface BaselineComparison {
  parameter: VitalParameter;
  label: string;
  unit: string;
  currentValue: number;
  baselineValue: number;
  absoluteDelta: number;
  percentageDelta: number;
  zScore: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  qualityStatus: QualityStatus;
  statusDescription: string;
}

export interface ParameterRiskAssessment {
  parameter: VitalParameter;
  label: string;
  unit: string;
  currentValue: number;
  baselineValue: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  weight: number;
  weightedContribution: number;
  triggerReason?: string;
}

export interface CompositeHealthAssessment {
  astronautId: string;
  timestamp: string;
  compositeScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  primaryRiskFactor?: VitalParameter;
  synergyMultipliersApplied: string[];
  parameterRisks: Record<VitalParameter, ParameterRiskAssessment>;
  baselineComparisons: Record<VitalParameter, BaselineComparison>;
  recommendedAction: string;
}

export interface AlertTriggerRule {
  ruleCode: string;
  parameter: VitalParameter;
  severity: AlertSeverity;
  title: string;
  descriptionTemplate: string;
  cooldownSeconds: number; // Deduplication cooldown window
  condition: (value: number, baseline: number, thresholds: ParameterThresholds) => boolean;
}
