import { SeededPRNG } from '../math/prng';
import { PHYSIOLOGICAL_BOUNDS, QualityStatus } from '@/types/telemetry';

export interface BodyTempOutput {
  coreTemp: number; // Celsius
  qualityStatus: QualityStatus;
}

export class BodyTempSensor {
  private prng: SeededPRNG;
  private currentTemp: number;
  private baselineTemp: number;

  constructor(prng: SeededPRNG, baselineTemp: number = 36.8) {
    this.prng = prng;
    this.baselineTemp = baselineTemp;
    this.currentTemp = baselineTemp;
  }

  public reset(): void {
    this.currentTemp = this.baselineTemp;
  }

  /**
   * Generates core body temperature with smooth thermal inertia.
   */
  public generate(timeSeconds: number, targetThermalDelta: number = 0): BodyTempOutput {
    // Circadian diurnal wave (amplitude 0.2°C over 24h)
    const circadian = Math.sin((timeSeconds / 86400) * 2 * Math.PI) * 0.2;

    const target = this.baselineTemp + targetThermalDelta + circadian;
    // Core body temperature has high thermal inertia (very slow response rate 0.02)
    this.currentTemp += (target - this.currentTemp) * 0.02;

    // Small sensor micro-fluctuation
    const noise = this.prng.nextGaussian(0, 0.03);
    const calculated = parseFloat((this.currentTemp + noise).toFixed(2));

    const clamped = Math.max(
      PHYSIOLOGICAL_BOUNDS.CORE_TEMP.min,
      Math.min(PHYSIOLOGICAL_BOUNDS.CORE_TEMP.max, calculated)
    );

    return {
      coreTemp: clamped,
      qualityStatus: 'NOMINAL',
    };
  }
}
