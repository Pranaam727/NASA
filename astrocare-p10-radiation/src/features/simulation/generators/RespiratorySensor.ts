import { SeededPRNG } from '../math/prng';
import { PHYSIOLOGICAL_BOUNDS, QualityStatus } from '@/types/telemetry';

export interface RespiratoryOutput {
  respiratoryRate: number; // RPM
  qualityStatus: QualityStatus;
}

export class RespiratorySensor {
  private prng: SeededPRNG;
  private currentRr: number;
  private baselineRr: number;

  constructor(prng: SeededPRNG, baselineRr: number = 14) {
    this.prng = prng;
    this.baselineRr = baselineRr;
    this.currentRr = baselineRr;
  }

  public reset(): void {
    this.currentRr = this.baselineRr;
  }

  /**
   * Generates respiratory rate coupled to HR and hypoxia compensatory tachypnea.
   */
  public generate(currentHr: number, baselineHr: number, hypoxiaDelta: number = 0): RespiratoryOutput {
    // Exertion / tachycardia coupling: ~1 breath per 4-5 bpm increase
    const hrContribution = (currentHr - baselineHr) * 0.18;

    // Hypoxia compensation: when SpO2 drops, chemoreceptors stimulate tachypnea
    const hypoxiaContribution = Math.abs(hypoxiaDelta) * 0.6;

    const target = this.baselineRr + hrContribution + hypoxiaContribution;
    this.currentRr += (target - this.currentRr) * 0.1;

    const noise = this.prng.nextGaussian(0, 0.4);
    const calculated = Math.round(this.currentRr + noise);

    const clamped = Math.max(
      PHYSIOLOGICAL_BOUNDS.RESPIRATORY_RATE.min,
      Math.min(PHYSIOLOGICAL_BOUNDS.RESPIRATORY_RATE.max, calculated)
    );

    return {
      respiratoryRate: clamped,
      qualityStatus: 'NOMINAL',
    };
  }
}
