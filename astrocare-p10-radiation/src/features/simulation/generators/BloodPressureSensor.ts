import { SeededPRNG } from '../math/prng';
import { PHYSIOLOGICAL_BOUNDS, QualityStatus } from '@/types/telemetry';

export interface BloodPressureOutput {
  systolic: number; // mmHg
  diastolic: number; // mmHg
  qualityStatus: QualityStatus;
}

export class BloodPressureSensor {
  private prng: SeededPRNG;
  private baselineSys: number;
  private baselineDia: number;

  constructor(prng: SeededPRNG, baselineSys: number = 115, baselineDia: number = 75) {
    this.prng = prng;
    this.baselineSys = baselineSys;
    this.baselineDia = baselineDia;
  }

  public setBaseline(sys: number, dia: number): void {
    this.baselineSys = sys;
    this.baselineDia = dia;
  }

  /**
   * Generates paired systolic and diastolic arterial pressures with baroreflex coupling to HR.
   */
  public generate(currentHr: number, baselineHr: number, stressDelta: number = 0): BloodPressureOutput {
    // Baroreflex response: Elevated HR during exertion / stress elevates systolic pressure proportionally
    const hrDelta = currentHr - baselineHr;
    const sysRamp = hrDelta * 0.45 + stressDelta;
    const diaRamp = hrDelta * 0.2 + stressDelta * 0.5;

    // Biological noise
    const sysNoise = this.prng.nextGaussian(0, 1.2);
    const diaNoise = this.prng.nextGaussian(0, 0.9);

    const calculatedSys = Math.round(this.baselineSys + sysRamp + sysNoise);
    const calculatedDia = Math.round(this.baselineDia + diaRamp + diaNoise);

    const sysClamped = Math.max(
      PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_SYS.min,
      Math.min(PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_SYS.max, calculatedSys)
    );

    // Diastolic must maintain positive pulse pressure (sys - dia >= 20 mmHg)
    const diaMax = sysClamped - 20;
    const diaClamped = Math.max(
      PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_DIA.min,
      Math.min(Math.min(PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_DIA.max, diaMax), calculatedDia)
    );

    return {
      systolic: sysClamped,
      diastolic: diaClamped,
      qualityStatus: 'NOMINAL',
    };
  }
}
