import { SeededPRNG } from '../math/prng';

export class EcgGenerator {
  private prng: SeededPRNG;
  private sampleRateHz: number;
  private phase: number; // 0.0 to 1.0 within cardiac cycle

  constructor(prng: SeededPRNG, sampleRateHz: number = 50) {
    this.prng = prng;
    this.sampleRateHz = sampleRateHz;
    this.phase = 0;
  }

  public setSampleRate(hz: number): void {
    this.sampleRateHz = hz;
  }

  public reset(): void {
    this.phase = 0;
  }

  /**
   * Generates a single ECG sample in millivolts (mV) based on instantaneous heart rate.
   */
  public generateSample(heartRateBpm: number): number {
    const cycleDurationSeconds = 60.0 / Math.max(30, heartRateBpm);
    const phaseIncrement = 1.0 / (this.sampleRateHz * cycleDurationSeconds);

    this.phase = (this.phase + phaseIncrement) % 1.0;
    const p = this.phase;

    let mv = 0.0;

    // Mathematical Gaussian dipole model for P-Q-R-S-T wave components
    // P wave: centered at 0.15, width 0.035, amp 0.15
    mv += 0.15 * Math.exp(-Math.pow((p - 0.15) / 0.035, 2));

    // Q wave: centered at 0.35, width 0.012, amp -0.12
    mv -= 0.12 * Math.exp(-Math.pow((p - 0.35) / 0.012, 2));

    // R wave: sharp peak centered at 0.38, width 0.018, amp 1.25
    mv += 1.25 * Math.exp(-Math.pow((p - 0.38) / 0.018, 2));

    // S wave: negative dip centered at 0.41, width 0.015, amp -0.28
    mv -= 0.28 * Math.exp(-Math.pow((p - 0.41) / 0.015, 2));

    // T wave: repolarization centered at 0.65, width 0.07, amp 0.32
    mv += 0.32 * Math.exp(-Math.pow((p - 0.65) / 0.07, 2));

    // Isoelectric baseline noise (0.015 mV)
    const baselineNoise = this.prng.nextGaussian(0, 0.012);

    return parseFloat((mv + baselineNoise).toFixed(3));
  }

  /**
   * Generates a batch of N samples (e.g. 50 samples for 1 second of telemetry frame).
   */
  public generateBatch(heartRateBpm: number, count: number = 50): number[] {
    const samples: number[] = new Array(count);
    for (let i = 0; i < count; i++) {
      samples[i] = this.generateSample(heartRateBpm);
    }
    return samples;
  }
}
