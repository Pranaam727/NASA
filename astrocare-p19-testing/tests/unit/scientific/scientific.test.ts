import { describe, it, expect } from 'vitest';
import { CalculationValidator } from '../../../src/validation/scientific/CalculationValidator';
import { RadiationCalculator } from '../../../src/validation/scientific/RadiationCalculator';
import { SYNTHETIC_RADIATION_EVENTS } from '../../../src/fixtures';

describe('Scientific Calculations & Radiation Dosimetry', () => {
  describe('Mathematical & Statistical Calculations', () => {
    it('verifies zero deviation mathematical invariant', () => {
      expect(CalculationValidator.percentageDeviation(120, 120)).toBe(0.0);
      expect(CalculationValidator.absoluteDifference(75.5, 75.5)).toBe(0.0);
    });

    it('guards against division by zero when baseline is 0', () => {
      const result = CalculationValidator.percentageDeviation(45, 0);
      expect(result).toBeNull();
    });

    it('calculates Z-scores with mean match invariant', () => {
      expect(CalculationValidator.zScore(70, 70, 10)).toBe(0.0);
      expect(CalculationValidator.zScore(90, 70, 10)).toBe(2.0);
      expect(CalculationValidator.zScore(50, 70, 10)).toBe(-2.0);
    });

    it('computes sliding moving averages accurately', () => {
      const data = [10, 20, 30, 40, 50];
      const ma = CalculationValidator.movingAverage(data, 3);
      expect(ma).toEqual([20, 30, 40]);
    });

    it('throws error when moving average window exceeds data length', () => {
      expect(() => CalculationValidator.movingAverage([10, 20], 5)).toThrow();
    });

    it('evaluates normalized anomaly scores combining Z-score and rate-of-change', () => {
      const anomaly = CalculationValidator.calculateAnomalyScore({
        observedValue: 145,
        baselineMean: 70,
        baselineStdDev: 10,
        previousValue: 72,
        deltaTimeMinutes: 1,
      });

      expect(anomaly.isAnomaly).toBe(true);
      expect(anomaly.score).toBeGreaterThan(0.7);
      expect(anomaly.confidence).toBeGreaterThan(0.8);
    });

    it('converts biomedical units with high precision', () => {
      // 37 degC -> 98.6 degF
      const degF = CalculationValidator.convertBiomedicalUnit(37, 'degC', 'degF');
      expect(Math.abs(degF - 98.6)).toBeLessThan(0.001);

      // 60 bpm -> 1 Hz
      const hz = CalculationValidator.convertBiomedicalUnit(60, 'bpm', 'Hz');
      expect(hz).toBe(1.0);
    });
  });

  describe('Aerospace Radiation Physics & Dosimetry', () => {
    it('strictly prohibits direct unit conversion between Gy and Sv without weighting factor', () => {
      expect(() => {
        RadiationCalculator.convertUnit(1.0, 'Gy', 'Sv');
      }).toThrow(/particle radiation weighting factor w_R/);
    });

    it('converts within absorbed dose units (Gy <-> mGy) and equivalent dose (Sv <-> mSv)', () => {
      expect(RadiationCalculator.convertUnit(0.5, 'Gy', 'mGy')).toBe(500);
      expect(RadiationCalculator.convertUnit(250, 'mGy', 'Gy')).toBe(0.25);
      expect(RadiationCalculator.convertUnit(0.02, 'Sv', 'mSv')).toBe(20);
    });

    it('calculates equivalent dose with particle-specific radiation weighting factors', () => {
      // 1 mGy proton (w_R = 2) = 2 mSv
      const protonSv = RadiationCalculator.calculateEquivalentDose(0.001, 'proton');
      expect(protonSv).toBe(0.002);

      // 1 mGy HZE heavy ion (w_R = 20) = 20 mSv
      const hzeSv = RadiationCalculator.calculateEquivalentDose(0.001, 'hze_heavy_ion');
      expect(hzeSv).toBe(0.02);
    });

    it('aggregates cumulative multi-particle mission exposures', () => {
      const summary = RadiationCalculator.aggregateExposure(SYNTHETIC_RADIATION_EVENTS);
      // 0.2 mGy (proton w_R=2 -> 0.4 mSv) + 0.05 mGy (HZE w_R=20 -> 1.0 mSv) + 0.1 mGy (fast neutron w_R=20 -> 2.0 mSv) = 3.4 mSv = 0.0034 Sv
      expect(Math.abs(summary.totalEquivalentDoseSv - 0.0034)).toBeLessThan(0.0001);
      expect(summary.dominantRadiationSource).toBe('neutron_fast');
      expect(summary.doseRateSvPerHour).toBeGreaterThan(0);
    });
  });
});
