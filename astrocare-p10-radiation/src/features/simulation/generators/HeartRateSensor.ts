import { SeededPRNG } from '../math/prng';
import { PHYSIOLOGICAL_BOUNDS, QualityStatus } from '@/types/telemetry';

export interface HeartRateOutput {
  heartRate: number; // BPM
  qualityStatus: QualityStatus;
}

export class HeartRateSensor {
  private prng: SeededPRNG;
  private currentHr: number;
  private baselineHr: number;

  constructor(prng: SeededPRNG, baselineHr: number = 65) {
    this.prng = prng;
    this.baselineHr = baselineHr;
    this.currentHr = baselineHr;
  }

  public setBaseline(baseline: number): void {
    this.baselineHr = baseline;
  }

  public reset(): void {
    this.currentHr = this.baselineHr;
  }

  /**
   * Generates next heart rate sample based on elapsed seconds, target delta offset, and noise.
   */
  public generate(
    timeSeconds: number,
    targetOffsetBpm: number = 0,
    stressFactor: number = 0
  ): HeartRateOutput {
    // 1. Respiratory Sinus Arrhythmia (RSA) - sinusoidal breathing modulation (0.25 Hz)
    const rsaModulation = Math.sin(timeSeconds * 2 * Math.PI * 0.25) * 2.0;

    // 2. Slow Circadian / Mayer wave drift (0.1 Hz)
    const mayerWave = Math.sin(timeSeconds * 2 * Math.PI * 0.1) * 1.5;

    // 3. Target offset ramp (smooth lag towards target stress)
    const target = this.baselineHr + targetOffsetBpm + stressFactor * 40;
    this.currentHr += (target - this.currentHr) * 0.1;

    // 4. Biological Gaussian noise (stdDev = 0.8 bpm)
    const noise = this.prng.nextGaussian(0, 0.8);

    const calculated = Math.round(this.currentHr + rsaModulation + mayerWave + noise);

    // 5. Invariant clamp
    const clamped = Math.max(
      PHYSIOLOGICAL_BOUNDS.HEART_RATE.min,
      Math.min(PHYSIOLOGICAL_BOUNDS.HEART_RATE.max, calculated)
    );

    let quality: QualityStatus = 'NOMINAL';
    if (clamped > 160 || clamped < 45) {
      quality = 'DEGRADED_SIGNAL';
    }

    return {
      heartRate: clamped,
      qualityStatus: quality,
    };
  }
}
