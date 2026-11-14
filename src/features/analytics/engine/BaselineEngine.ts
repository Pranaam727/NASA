import { Astronaut } from '@/types/database.types';
import { VitalParameter, BaselineComparison, RiskLevel, ParameterRiskConfig } from '../types/analyticsTypes';
import { DEFAULT_PARAMETER_CONFIGS, DEFAULT_ASTRONAUT_FALLBACK_BASELINES } from '../config/defaultThresholds';
import { QualityStatus } from '@/types/telemetry';

export class BaselineEngine {
  private configs: Record<VitalParameter, ParameterRiskConfig>;

  constructor(configs: Record<VitalParameter, ParameterRiskConfig> = DEFAULT_PARAMETER_CONFIGS) {
    this.configs = configs;
  }

  /**
   * Resolves the individual baseline for an astronaut for a given parameter.
   */
  public getBaselineValue(param: VitalParameter, astronaut?: Partial<Astronaut> | null): number {
    if (!astronaut) {
      return this.getDefaultBaseline(param);
    }

    switch (param) {
      case 'HEART_RATE':
        return astronaut.baseline_resting_hr ?? DEFAULT_ASTRONAUT_FALLBACK_BASELINES.restingHr;
      case 'SPO2':
        return astronaut.baseline_spo2 ?? DEFAULT_ASTRONAUT_FALLBACK_BASELINES.spo2;
      case 'BLOOD_PRESSURE_SYS':
        return astronaut.baseline_bp_systolic ?? DEFAULT_ASTRONAUT_FALLBACK_BASELINES.bpSystolic;
      case 'BLOOD_PRESSURE_DIA':
        return astronaut.baseline_bp_diastolic ?? DEFAULT_ASTRONAUT_FALLBACK_BASELINES.bpDiastolic;
      case 'CORE_TEMP':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.coreTemp;
      case 'RESPIRATORY_RATE':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.respiratoryRate;
      case 'RADIATION_FLUX':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.radiationFlux;
      default:
        return 0;
    }
  }

  public getDefaultBaseline(param: VitalParameter): number {
    switch (param) {
      case 'HEART_RATE':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.restingHr;
      case 'SPO2':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.spo2;
      case 'BLOOD_PRESSURE_SYS':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.bpSystolic;
      case 'BLOOD_PRESSURE_DIA':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.bpDiastolic;
      case 'CORE_TEMP':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.coreTemp;
      case 'RESPIRATORY_RATE':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.respiratoryRate;
      case 'RADIATION_FLUX':
        return DEFAULT_ASTRONAUT_FALLBACK_BASELINES.radiationFlux;
      default:
        return 0;
    }
  }

  /**
   * Calculates deviation metrics from individual baseline.
   */
  public calculateComparison(
    param: VitalParameter,
    currentValue: number,
    astronaut?: Partial<Astronaut> | null,
    qualityStatus: QualityStatus = 'NOMINAL'
  ): BaselineComparison {
    const config = this.configs[param] || DEFAULT_PARAMETER_CONFIGS[param];
    const baseline = this.getBaselineValue(param, astronaut);

    const absoluteDelta = parseFloat((currentValue - baseline).toFixed(2));
    const percentageDelta = baseline !== 0
      ? parseFloat(((absoluteDelta / baseline) * 100).toFixed(2))
      : 0;

    const std = config.standardDeviation || 1.0;
    const zScore = parseFloat((absoluteDelta / std).toFixed(2));

    const { riskLevel, riskScore, statusDescription } = this.evaluateDeviation(
      param,
      currentValue,
      baseline,
      zScore,
      config
    );

    return {
      parameter: param,
      label: config.label,
      unit: config.unit,
      currentValue,
      baselineValue: baseline,
      absoluteDelta,
      percentageDelta,
      zScore,
      riskLevel,
      riskScore,
      qualityStatus,
      statusDescription,
    };
  }

  private evaluateDeviation(
    _param: VitalParameter,
    current: number,
    _baseline: number,
    zScore: number,
    config: ParameterRiskConfig
  ): { riskLevel: RiskLevel; riskScore: number; statusDescription: string } {
    const t = config.thresholds;

    // Critical checks
    if (t.criticalHigh !== undefined && current >= t.criticalHigh) {
      return {
        riskLevel: 'CRITICAL',
        riskScore: Math.min(100, 85 + Math.round((current - t.criticalHigh) * 2)),
        statusDescription: `Critical High (Above ${t.criticalHigh} ${config.unit})`,
      };
    }
    if (t.criticalLow !== undefined && current <= t.criticalLow) {
      return {
        riskLevel: 'CRITICAL',
        riskScore: Math.min(100, 85 + Math.round((t.criticalLow - current) * 3)),
        statusDescription: `Critical Low (Below ${t.criticalLow} ${config.unit})`,
      };
    }

    // Warning checks
    if (t.warningHigh !== undefined && current >= t.warningHigh) {
      return {
        riskLevel: 'WARNING',
        riskScore: 60 + Math.round(((current - t.warningHigh) / ((t.criticalHigh ?? (t.warningHigh + 10)) - t.warningHigh)) * 20),
        statusDescription: `Warning High (Elevated >${t.warningHigh} ${config.unit})`,
      };
    }
    if (t.warningLow !== undefined && current <= t.warningLow) {
      return {
        riskLevel: 'WARNING',
        riskScore: 60 + Math.round(((t.warningLow - current) / (t.warningLow - (t.criticalLow ?? (t.warningLow - 5)))) * 20),
        statusDescription: `Warning Low (Depressed <${t.warningLow} ${config.unit})`,
      };
    }

    // Caution checks
    if (t.cautionHigh !== undefined && current >= t.cautionHigh) {
      return {
        riskLevel: 'CAUTION',
        riskScore: 30 + Math.round(((current - t.cautionHigh) / ((t.warningHigh ?? (t.cautionHigh + 10)) - t.cautionHigh)) * 25),
        statusDescription: `Mild Elevation (Above ${t.cautionHigh} ${config.unit})`,
      };
    }
    if (t.cautionLow !== undefined && current <= t.cautionLow) {
      return {
        riskLevel: 'CAUTION',
        riskScore: 30 + Math.round(((t.cautionLow - current) / (t.cautionLow - (t.warningLow ?? (t.cautionLow - 5)))) * 25),
        statusDescription: `Mild Depression (Below ${t.cautionLow} ${config.unit})`,
      };
    }

    // Z-score deviation check for baseline drift even within nominal bounds
    if (Math.abs(zScore) >= 2.5) {
      return {
        riskLevel: 'CAUTION',
        riskScore: 30,
        statusDescription: `Statistical Baseline Drift (${zScore > 0 ? '+' : ''}${zScore}σ)`,
      };
    }

    return {
      riskLevel: 'NORMAL',
      riskScore: Math.min(24, Math.max(0, Math.round(Math.abs(zScore) * 8))),
      statusDescription: 'Nominal resting baseline alignment',
    };
  }
}
