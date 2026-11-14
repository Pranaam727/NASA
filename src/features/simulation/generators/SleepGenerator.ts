import { SeededPRNG } from '../math/prng';

export interface SleepOutput {
  totalSleepMinutes: number;
  remMinutes: number;
  deepSleepMinutes: number;
  lightSleepMinutes: number;
  awakeningsCount: number;
  sleepQualityScore: number; // 0 - 100
  disruptionEvents: string[];
}

export class SleepGenerator {
  private prng: SeededPRNG;

  constructor(prng: SeededPRNG) {
    this.prng = prng;
  }

  /**
   * Generates a simulated sleep architecture record.
   * Under sleep-deprivation scenarios, duration and deep sleep drop, awakenings increase.
   */
  public generateSession(deprivationFactor: number = 0): SleepOutput {
    const nominalDuration = 480; // 8 hours
    const duration = Math.max(180, Math.round(nominalDuration - deprivationFactor * 220 + this.prng.nextGaussian(0, 15)));

    // Standard sleep stage distribution (REM ~22%, Deep ~20%, Light ~58%)
    const remPct = Math.max(0.1, 0.22 - deprivationFactor * 0.08);
    const deepPct = Math.max(0.08, 0.20 - deprivationFactor * 0.1);

    const rem = Math.round(duration * remPct);
    const deep = Math.round(duration * deepPct);
    const light = duration - rem - deep;

    const awakenings = Math.round(1 + deprivationFactor * 5 + Math.abs(this.prng.nextGaussian(0, 1)));
    const quality = Math.max(15, Math.min(100, Math.round(88 - deprivationFactor * 52 - awakenings * 3 + this.prng.nextGaussian(0, 4))));

    const disruptions: string[] = [];
    if (deprivationFactor > 0.4) disruptions.push('CIRCADIAN_PHASE_SHIFT');
    if (awakenings >= 3) disruptions.push('MICROGRAVITY_VESTIBULAR_AROUSAL');
    if (quality < 50) disruptions.push('CHRONIC_FATIGUE_ACCRUAL');

    return {
      totalSleepMinutes: duration,
      remMinutes: rem,
      deepSleepMinutes: deep,
      lightSleepMinutes: light,
      awakeningsCount: awakenings,
      sleepQualityScore: quality,
      disruptionEvents: disruptions,
    };
  }
}
