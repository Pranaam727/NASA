import { SeededPRNG } from '../math/prng';

export interface ActivityOutput {
  modality: 'T2_TREADMILL' | 'ARED_RESISTANCE' | 'CYCLE_ERGOMETER' | 'REST';
  durationMinutes: number;
  workLoadJoules: number;
  caloriesBurnedKcal: number;
  avgHeartRateBpm: number;
  peakHeartRateBpm: number;
  resistanceLoadKg?: number;
}

export class ActivitySensor {
  private prng: SeededPRNG;

  constructor(prng: SeededPRNG) {
    this.prng = prng;
  }

  /**
   * Generates a simulated exercise workout record for microgravity countermeasure tracking.
   */
  public generateWorkout(
    modality: 'T2_TREADMILL' | 'ARED_RESISTANCE' | 'CYCLE_ERGOMETER' = 'ARED_RESISTANCE',
    intensityFactor: number = 1.0
  ): ActivityOutput {
    const duration = Math.round(this.prng.nextRange(35, 60));
    const avgHr = Math.round(115 + intensityFactor * 25 + this.prng.nextGaussian(0, 4));
    const peakHr = Math.round(avgHr + 22 + this.prng.nextGaussian(0, 3));
    const calories = Math.round(duration * (7.5 + intensityFactor * 2.5));
    const workJoules = Math.round(calories * 4184 * 0.22); // ~22% gross mechanical efficiency

    const output: ActivityOutput = {
      modality,
      durationMinutes: duration,
      workLoadJoules: workJoules,
      caloriesBurnedKcal: calories,
      avgHeartRateBpm: avgHr,
      peakHeartRateBpm: peakHr,
    };

    if (modality === 'ARED_RESISTANCE') {
      output.resistanceLoadKg = Math.round(90 + intensityFactor * 40);
    }

    return output;
  }
}
