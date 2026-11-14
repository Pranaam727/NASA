import { SeededPRNG } from '../math/prng';
import { PHYSIOLOGICAL_BOUNDS, QualityStatus } from '@/types/telemetry';

export interface RadiationOutput {
  ambientFluxUsVh: number; // uSv/h
  accumulatedDoseMSv: number; // mSv
  solarParticleEventActive: boolean;
  qualityStatus: QualityStatus;
}

export class RadiationSensor {
  private prng: SeededPRNG;
  private currentFlux: number;
  private accumulatedDose: number; // mSv
  private baselineFlux: number;

  constructor(prng: SeededPRNG, baselineFlux: number = 0.052, initialAccumulatedDose: number = 48.64) {
    this.prng = prng;
    this.baselineFlux = baselineFlux;
    this.currentFlux = baselineFlux;
    this.accumulatedDose = initialAccumulatedDose;
  }

  public reset(initialDose: number = 48.64): void {
    this.currentFlux = this.baselineFlux;
    this.accumulatedDose = initialDose;
  }

  /**
   * Generates next radiation reading and integrates accumulated mission dosage.
   * @param elapsedSeconds Delta time in seconds
   * @param isSpeActive Whether a Solar Particle Event is currently modulating the flux
   * @param speSurgeFlux Peak flux surge if SPE is active
   */
  public generate(
    deltaSeconds: number,
    isSpeActive: boolean = false,
    speSurgeFlux: number = 0
  ): RadiationOutput {
    const targetFlux = isSpeActive ? this.baselineFlux + speSurgeFlux : this.baselineFlux;

    // Fast surge rise during SPE, gradual decay
    const rate = isSpeActive ? 0.15 : 0.05;
    this.currentFlux += (targetFlux - this.currentFlux) * rate;

    // Poisson-like noise on scintillation detector
    const noise = this.prng.nextGaussian(0, 0.003);
    const calculatedFlux = Math.max(
      PHYSIOLOGICAL_BOUNDS.RADIATION_FLUX.min,
      parseFloat((this.currentFlux + noise).toFixed(3))
    );

    // Integrated absorbed dose: Flux (uSv/h) * seconds / 3600 / 1000 = mSv
    const deltaDoseMsv = (calculatedFlux * deltaSeconds) / (3600 * 1000);
    this.accumulatedDose += deltaDoseMsv;

    return {
      ambientFluxUsVh: calculatedFlux,
      accumulatedDoseMSv: parseFloat(this.accumulatedDose.toFixed(6)),
      solarParticleEventActive: isSpeActive || calculatedFlux > 1.0,
      qualityStatus: 'NOMINAL',
    };
  }
}
