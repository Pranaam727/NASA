import { Astronaut } from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import {
  VitalParameter,
  RiskLevel,
  ParameterRiskConfig,
  CompositeHealthAssessment,
  ParameterRiskAssessment,
  BaselineComparison,
} from '../types/analyticsTypes';
import { DEFAULT_PARAMETER_CONFIGS } from '../config/defaultThresholds';
import { BaselineEngine } from './BaselineEngine';

export class HealthRiskEngine {
  private baselineEngine: BaselineEngine;
  private configs: Record<VitalParameter, ParameterRiskConfig>;

  constructor(
    configs: Record<VitalParameter, ParameterRiskConfig> = DEFAULT_PARAMETER_CONFIGS,
    baselineEngine?: BaselineEngine
  ) {
    this.configs = configs;
    this.baselineEngine = baselineEngine || new BaselineEngine(configs);
  }

  public updateConfig(param: VitalParameter, updates: Partial<ParameterRiskConfig>): void {
    if (this.configs[param]) {
      this.configs[param] = { ...this.configs[param], ...updates };
    }
  }

  public getConfigs(): Record<VitalParameter, ParameterRiskConfig> {
    return { ...this.configs };
  }

  /**
   * Evaluates complete physiological and environmental telemetry for an astronaut.
   */
  public evaluateAssessment(
    vitals: VitalSignsPacket,
    radiation?: RadiationPacket | null,
    astronaut?: Partial<Astronaut> | null
  ): CompositeHealthAssessment {
    const comparisons: Record<VitalParameter, BaselineComparison> = {} as any;
    const parameterRisks: Record<VitalParameter, ParameterRiskAssessment> = {} as any;

    // 1. Process Vital Signs
    const v = vitals.vitals;

    // Heart Rate
    comparisons.HEART_RATE = this.baselineEngine.calculateComparison(
      'HEART_RATE',
      v.heartRate.value,
      astronaut,
      v.heartRate.quality
    );

    // SpO2
    comparisons.SPO2 = this.baselineEngine.calculateComparison(
      'SPO2',
      v.spo2.value,
      astronaut,
      v.spo2.quality
    );

    // Systolic BP
    comparisons.BLOOD_PRESSURE_SYS = this.baselineEngine.calculateComparison(
      'BLOOD_PRESSURE_SYS',
      v.bloodPressure.systolic,
      astronaut,
      v.bloodPressure.quality
    );

    // Diastolic BP
    comparisons.BLOOD_PRESSURE_DIA = this.baselineEngine.calculateComparison(
      'BLOOD_PRESSURE_DIA',
      v.bloodPressure.diastolic,
      astronaut,
      v.bloodPressure.quality
    );

    // Core Temp
    comparisons.CORE_TEMP = this.baselineEngine.calculateComparison(
      'CORE_TEMP',
      v.coreTemp.value,
      astronaut,
      v.coreTemp.quality
    );

    // Respiratory Rate
    comparisons.RESPIRATORY_RATE = this.baselineEngine.calculateComparison(
      'RESPIRATORY_RATE',
      v.respiratoryRate.value,
      astronaut,
      v.respiratoryRate.quality
    );

    // Radiation Flux
    const radFlux = radiation ? radiation.ambientFluxUsVh : 0.052;
    const radQuality = radiation ? radiation.quality : 'NOMINAL';
    comparisons.RADIATION_FLUX = this.baselineEngine.calculateComparison(
      'RADIATION_FLUX',
      radFlux,
      astronaut,
      radQuality
    );

    // 2. Build Parameter Assessments & Weighted Contribution
    const params: VitalParameter[] = [
      'HEART_RATE',
      'SPO2',
      'BLOOD_PRESSURE_SYS',
      'BLOOD_PRESSURE_DIA',
      'CORE_TEMP',
      'RESPIRATORY_RATE',
      'RADIATION_FLUX',
    ];

    let baseWeightedScore = 0;
    let totalWeight = 0;
    let highestScore = -1;
    let primaryRiskFactor: VitalParameter = 'HEART_RATE';

    for (const p of params) {
      const comp = comparisons[p];
      const cfg = this.configs[p];
      const weightedContribution = parseFloat((comp.riskScore * cfg.weight).toFixed(2));

      parameterRisks[p] = {
        parameter: p,
        label: cfg.label,
        unit: cfg.unit,
        currentValue: comp.currentValue,
        baselineValue: comp.baselineValue,
        riskLevel: comp.riskLevel,
        riskScore: comp.riskScore,
        weight: cfg.weight,
        weightedContribution,
        triggerReason: comp.statusDescription,
      };

      baseWeightedScore += weightedContribution;
      totalWeight += cfg.weight;

      if (comp.riskScore > highestScore) {
        highestScore = comp.riskScore;
        primaryRiskFactor = p;
      }
    }

    // Normalize weighted score by total weight
    let compositeScore = totalWeight > 0 ? baseWeightedScore / totalWeight : baseWeightedScore;

    // 3. Multi-Parameter Synergistic Compounding Multipliers
    const synergyMultipliersApplied: string[] = [];

    // Synergy 1: Acute Hypoxic Stress (SpO2 Warning/Critical + HR Warning/Critical)
    const isHypoxic = comparisons.SPO2.riskLevel === 'WARNING' || comparisons.SPO2.riskLevel === 'CRITICAL';
    const isTachycardic = comparisons.HEART_RATE.riskLevel === 'WARNING' || comparisons.HEART_RATE.riskLevel === 'CRITICAL';
    if (isHypoxic && isTachycardic) {
      const bonus = comparisons.SPO2.riskLevel === 'CRITICAL' ? 25 : 18;
      compositeScore += bonus;
      if (comparisons.SPO2.riskLevel === 'CRITICAL') {
        compositeScore = Math.max(compositeScore, 76);
      }
      synergyMultipliersApplied.push('ACUTE_HYPOXIA_COMPENSATORY_TACHYCARDIA');
    }

    // Synergy 2: Thermal Stress Strain (Temp Warning/Critical + HR Warning/Critical)
    const isThermalStress = comparisons.CORE_TEMP.riskLevel === 'WARNING' || comparisons.CORE_TEMP.riskLevel === 'CRITICAL';
    if (isThermalStress && isTachycardic) {
      compositeScore += 12;
      synergyMultipliersApplied.push('THERMAL_CARDIOVASCULAR_STRAIN');
    }

    // Synergy 3: Compound Cardiovascular Exhaustion (BP Warning/Critical + HR Warning/Critical)
    const isBpAbnormal =
      comparisons.BLOOD_PRESSURE_SYS.riskLevel === 'WARNING' ||
      comparisons.BLOOD_PRESSURE_SYS.riskLevel === 'CRITICAL';
    if (isBpAbnormal && isTachycardic) {
      compositeScore += 10;
      synergyMultipliersApplied.push('CARDIOVASCULAR_HEMODYNAMIC_INSTABILITY');
    }

    // Synergy 4: Solar Particle Event (Direct Radiation Threat)
    if (comparisons.RADIATION_FLUX.riskLevel === 'CRITICAL' || (radiation && radiation.solarParticleEventActive)) {
      compositeScore = Math.max(compositeScore, 78);
      synergyMultipliersApplied.push('SPE_RADIATION_EVENT_ACTIVE');
    }

    // Clamp composite score between 0 and 100
    compositeScore = Math.min(100, Math.max(0, Math.round(compositeScore)));

    // 4. Classify Overall Risk Level
    let overallRiskLevel: RiskLevel = 'NORMAL';
    if (compositeScore >= 75 || highestScore >= 85) {
      overallRiskLevel = 'CRITICAL';
    } else if (compositeScore >= 50 || highestScore >= 60) {
      overallRiskLevel = 'WARNING';
    } else if (compositeScore >= 25 || highestScore >= 35) {
      overallRiskLevel = 'CAUTION';
    } else {
      overallRiskLevel = 'NORMAL';
    }

    // 5. Generate Recommended Operational Action
    const recommendedAction = this.generateRecommendation(
      overallRiskLevel,
      primaryRiskFactor,
      synergyMultipliersApplied
    );

    return {
      astronautId: vitals.astronautId,
      timestamp: vitals.timestamp,
      compositeScore,
      overallRiskLevel,
      primaryRiskFactor,
      synergyMultipliersApplied,
      parameterRisks,
      baselineComparisons: comparisons,
      recommendedAction,
    };
  }

  private generateRecommendation(
    risk: RiskLevel,
    primary: VitalParameter,
    synergies: string[]
  ): string {
    if (risk === 'NORMAL') {
      return 'All biological telemetry channels within nominal baseline tolerance. Continue routine mission protocol.';
    }

    if (synergies.includes('SPE_RADIATION_EVENT_ACTIVE')) {
      return 'CRITICAL: Solar Particle Event detected. Direct crew to radiation storm shelter and suspend all EVA operations immediately.';
    }

    if (synergies.includes('ACUTE_HYPOXIA_COMPENSATORY_TACHYCARDIA')) {
      return 'CRITICAL: Acute hypoxia with compensatory tachycardia detected. Check suit seal, verify O2 partial pressure, and initiate emergency oxygen flood.';
    }

    if (risk === 'CRITICAL') {
      return `CRITICAL MEDICAL ALERT: Severe anomaly in ${primary}. Notify Flight Surgeon, place subject on continuous telemetry, and begin medical checklist.`;
    }

    if (risk === 'WARNING') {
      return `WARNING: Moderate physiological drift in ${primary}. Restrict high-intensity workloads, verify hydration, and monitor trend over next 15 minutes.`;
    }

    return `CAUTION: Mild baseline deviation in ${primary}. Log anomaly for end-of-day medical review; continue standard activities.`;
  }
}
