import { SeededPRNG } from '../math/prng';
import { PHYSIOLOGICAL_BOUNDS, QualityStatus } from '@/types/telemetry';

export interface BloodOxygenOutput {
  spo2: number; // %
  qualityStatus: QualityStatus;
}

export class BloodOxygenSensor {
  private prng: SeededPRNG;
  private currentSpo2: number;
  private baselineSpo2: number;

  constructor(prng: SeededPRNG, baselineSpo2: number = 98) {
    this.prng = prng;
    this.baselineSpo2 = baselineSpo2;
    this.currentSpo2 = baselineSpo2;
  }

  public setBaseline(baseline: number): void {
    this.baselineSpo2 = baseline;
  }

  public reset(): void {
    this.currentSpo2 = this.baselineSpo2;
  }

  /**
   * Generates next SpO2 reading.
   * Under hypoxia scenarios, targetDrop represents percentage drop (e.g. -12 for 86% SpO2).
   */
  public generate(_timeSeconds: number, targetDrop: number = 0): BloodOxygenOutput {
    const target = this.baselineSpo2 + targetDrop;

    // Gradual physiological lag (oxygen desaturation/recovery curves)
    this.currentSpo2 += (target - this.currentSpo2) * 0.08;

    // Optical pulse oximeter quantization & micro-noise
    const noise = this.prng.nextGaussian(0, 0.25);
    const calculated = Math.round(this.currentSpo2 + noise);

    const clamped = Math.max(
      PHYSIOLOGICAL_BOUNDS.SPO2.min,
      Math.min(PHYSIOLOGICAL_BOUNDS.SPO2.max, calculated)
    );

    let quality: QualityStatus = 'NOMINAL';
    if (clamped < 88) {
      quality = 'DEGRADED_SIGNAL';
    }

    return {
      spo2: clamped,
      qualityStatus: quality,
    };
  }
}
