/**
 * AstroCare Aerospace Radiation Calculation Engine
 * Strict preservation of Absorbed Dose (Gy) vs Equivalent Dose (Sv).
 * Incorporates ICRP 103 / NASA Space Radiation Cancer Risk (NSCR) radiation weighting factors (w_R).
 *
 * Formula:
 * Equivalent Dose H_T (Sv) = Sum_R [ w_R * Absorbed Dose D_{T,R} (Gy) ]
 *
 * Critical rules:
 * 1. Gy and Sv cannot be arbitrarily converted via fixed multiplier without knowing particle type and w_R.
 * 2. Missing data intervals must NOT be interpreted as zero radiation exposure.
 * 3. Adding 0 exposure leaves cumulative exposure invariant.
 */

import {
  RadiationParticleType,
  RadiationExposureRecord,
  RadiationSummaryResult,
} from '../../types/calculations';

export const RADIATION_WEIGHTING_FACTORS: Record<RadiationParticleType, number> = {
  gamma_xray: 1.0, // Low-LET photon
  proton: 2.0, // Solar energetic particles & galactic cosmic ray protons
  alpha: 20.0, // High-LET alpha particles
  neutron_thermal: 5.0, // Low-energy neutrons
  neutron_fast: 20.0, // High-energy secondary neutrons from hull spallation
  hze_heavy_ion: 20.0, // High-Z and high-energy GCR nuclei (Fe, C, O, Si)
};

export class RadiationCalculator {
  /**
   * Convert between Gy and mGy, or Sv and mSv
   */
  public static convertUnit(
    value: number,
    fromUnit: 'Gy' | 'mGy' | 'Sv' | 'mSv',
    toUnit: 'Gy' | 'mGy' | 'Sv' | 'mSv'
  ): number {
    if (isNaN(value) || !isFinite(value)) {
      throw new Error(`Cannot convert non-finite radiation value: ${value}`);
    }

    // Prohibit cross-converting Gy and Sv without biological weighting factor
    const isDoseGy = fromUnit === 'Gy' || fromUnit === 'mGy';
    const isEquivalentSv = toUnit === 'Sv' || toUnit === 'mSv';
    if ((isDoseGy && isEquivalentSv) || (!isDoseGy && !isEquivalentSv && (toUnit === 'Gy' || toUnit === 'mGy'))) {
      throw new Error(
        `Invalid conversion from physical absorbed dose (${fromUnit}) to biologically weighted equivalent dose (${toUnit}) without particle radiation weighting factor w_R.`
      );
    }

    if (fromUnit === toUnit) return value;
    if (fromUnit === 'Gy' && toUnit === 'mGy') return value * 1000;
    if (fromUnit === 'mGy' && toUnit === 'Gy') return value / 1000;
    if (fromUnit === 'Sv' && toUnit === 'mSv') return value * 1000;
    if (fromUnit === 'mSv' && toUnit === 'Sv') return value / 1000;

    throw new Error(`Unsupported unit conversion pair: ${fromUnit} -> ${toUnit}`);
  }

  /**
   * Calculate Equivalent Dose (Sv) from Absorbed Dose (Gy) given particle type
   */
  public static calculateEquivalentDose(
    absorbedDoseGy: number,
    particleType: RadiationParticleType,
    customWeightingFactor?: number
  ): number {
    if (absorbedDoseGy < 0) {
      throw new Error(`Negative absorbed dose is physically impossible: ${absorbedDoseGy} Gy.`);
    }
    const wR = customWeightingFactor ?? RADIATION_WEIGHTING_FACTORS[particleType];
    if (wR === undefined || wR <= 0) {
      throw new Error(`Invalid radiation weighting factor: ${wR} for particle: ${particleType}`);
    }
    return absorbedDoseGy * wR;
  }

  /**
   * Aggregate multi-particle mission exposure records over time
   */
  public static aggregateExposure(
    records: RadiationExposureRecord[],
    expectedIntervalMinutes?: number
  ): RadiationSummaryResult {
    if (!records || records.length === 0) {
      return {
        totalAbsorbedDoseGy: 0,
        totalEquivalentDoseSv: 0,
        dominantRadiationSource: 'gamma_xray',
        doseRateGyPerHour: 0,
        doseRateSvPerHour: 0,
        validIntervalSeconds: 0,
        missingDataIntervalCount: 0,
      };
    }

    let totalGy = 0;
    let totalSv = 0;
    const particleContribution = new Map<RadiationParticleType, number>();

    // Check for gaps
    let missingIntervals = 0;
    const sorted = [...records].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

    for (let i = 0; i < sorted.length; i++) {
      const rec = sorted[i];
      if (rec.absorbedDoseGy < 0) {
        throw new Error(`Record ${rec.timestamp} contains negative absorbed dose.`);
      }

      const wR = rec.radiationWeightingFactor || RADIATION_WEIGHTING_FACTORS[rec.particleType] || 1.0;
      const equivalentDose = rec.absorbedDoseGy * wR;

      totalGy += rec.absorbedDoseGy;
      totalSv += equivalentDose;

      const currentPartSv = particleContribution.get(rec.particleType) || 0;
      particleContribution.set(rec.particleType, currentPartSv + equivalentDose);

      if (expectedIntervalMinutes && i > 0) {
        const gapMinutes = (Date.parse(rec.timestamp) - Date.parse(sorted[i - 1].timestamp)) / 60000;
        if (gapMinutes > expectedIntervalMinutes * 1.5) {
          missingIntervals += Math.floor(gapMinutes / expectedIntervalMinutes) - 1;
        }
      }
    }

    // Determine dominant radiation source by equivalent biological damage (Sv)
    let dominantSource: RadiationParticleType = 'gamma_xray';
    let maxSv = -1;
    for (const [part, svVal] of particleContribution.entries()) {
      if (svVal > maxSv) {
        maxSv = svVal;
        dominantSource = part;
      }
    }

    // Compute duration in hours
    const startMs = Date.parse(sorted[0].timestamp);
    const endMs = Date.parse(sorted[sorted.length - 1].timestamp);
    const durationHours = Math.max((endMs - startMs) / 3600000, 1 / 3600); // at least 1 second

    const doseRateGyPerHour = totalGy / durationHours;
    const doseRateSvPerHour = totalSv / durationHours;

    return {
      totalAbsorbedDoseGy: totalGy,
      totalEquivalentDoseSv: totalSv,
      dominantRadiationSource: dominantSource,
      doseRateGyPerHour,
      doseRateSvPerHour,
      validIntervalSeconds: (endMs - startMs) / 1000,
      missingDataIntervalCount: missingIntervals,
    };
  }
}
