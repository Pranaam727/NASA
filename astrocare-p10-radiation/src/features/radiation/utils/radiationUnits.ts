/**
 * SPACE RADIATION PHYSICAL UNIT CONVERSION & NUMERICAL INTEGRATION UTILITIES
 * Enforces strict scientific unit handling and conversion invariants.
 */

// Prefix multipliers relative to base unit (Gy or Sv)
export const UNIT_MULTIPLIERS = {
  u: 1e-6, // micro
  m: 1e-3, // milli
  base: 1.0, // base Gy or Sv
} as const;

/**
 * Convert absorbed dose between microGray, milliGray, and Gray
 */
export function convertAbsorbedDose(
  value: number,
  from: 'uGy' | 'mGy' | 'Gy',
  to: 'uGy' | 'mGy' | 'Gy'
): number {
  if (from === to) return value;
  // Convert to base Gray first
  const baseValue =
    from === 'uGy' ? value * 1e-6 : from === 'mGy' ? value * 1e-3 : value;
  // Convert from base Gray to target
  return to === 'uGy' ? baseValue * 1e6 : to === 'mGy' ? baseValue * 1e3 : baseValue;
}

/**
 * Convert equivalent dose between microSievert, milliSievert, and Sievert
 */
export function convertEquivalentDose(
  value: number,
  from: 'uSv' | 'mSv' | 'Sv',
  to: 'uSv' | 'mSv' | 'Sv'
): number {
  if (from === to) return value;
  // Convert to base Sievert first
  const baseValue =
    from === 'uSv' ? value * 1e-6 : from === 'mSv' ? value * 1e-3 : value;
  // Convert from base Sievert to target
  return to === 'uSv' ? baseValue * 1e6 : to === 'mSv' ? baseValue * 1e3 : baseValue;
}

/**
 * Convert dose rate from uSv/hour to mSv/day or mSv/year
 */
export function doseRateUsVhToMsvPerDay(rateUsVh: number): number {
  // (uSv/h * 24 h/day) / 1000 uSv/mSv
  return (rateUsVh * 24) / 1000;
}

export function doseRateUsVhToMsvPerYear(rateUsVh: number): number {
  // (uSv/h * 24 * 365.25 h/yr) / 1000 uSv/mSv
  return (rateUsVh * 24 * 365.25) / 1000;
}

/**
 * Estimate dose equivalent rate (uSv/h) from absorbed dose rate (uGy/h)
 * using an effective radiation quality factor Q (radiation weighting factor w_R).
 * 
 * In deep space and LEO:
 * - Photons / electrons: Q = 1
 * - High-energy protons (solar events / trapped): Q ~ 1.5 - 2.0
 * - Galactic Cosmic Ray (GCR) heavy ions (HZE): Q ~ 10 - 20
 * - Default standard mixed spaceflight reference factor: Q = 1.7
 */
export function absorbedToEquivalentDoseRate(
  absorbedDoseRateUGyH: number,
  qualityFactorQ: number = 1.7
): number {
  if (absorbedDoseRateUGyH < 0) return 0;
  return absorbedDoseRateUGyH * qualityFactorQ;
}

export interface TimeDosePoint {
  timestamp: string | number; // ISO string or epoch ms
  doseRateUsVh: number; // in uSv/h
}

/**
 * Performs numerical integration of dose rate over time using the Composite Trapezoidal Rule.
 * 
 * Formula:
 * Cumulative Dose (uSv) = Sum_i [ 0.5 * (R_i + R_{i+1}) * (t_{i+1} - t_i) ]
 * where R is in uSv/hour, and (t_{i+1} - t_i) is in hours.
 * 
 * Returns cumulative dose in milliSievert (mSv).
 */
export function integrateDoseTrapezoidal(points: TimeDosePoint[]): number {
  if (!points || points.length < 2) return 0;

  // Sort strictly ascending by time
  const sorted = [...points].sort((a, b) => {
    const tA = typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp).getTime();
    const tB = typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp).getTime();
    return tA - tB;
  });

  let cumulativeUSv = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    const p1 = sorted[i];
    const p2 = sorted[i + 1];

    const t1 = typeof p1.timestamp === 'number' ? p1.timestamp : new Date(p1.timestamp).getTime();
    const t2 = typeof p2.timestamp === 'number' ? p2.timestamp : new Date(p2.timestamp).getTime();

    // Elapsed time in hours
    const deltaHours = (t2 - t1) / (1000 * 3600);

    // Skip inverted timestamps or excessively wide gaps (> 48 hours is considered disconnected)
    if (deltaHours <= 0 || deltaHours > 48) {
      continue;
    }

    const avgRateUsVh = (p1.doseRateUsVh + p2.doseRateUsVh) / 2;
    cumulativeUSv += avgRateUsVh * deltaHours;
  }

  // Convert uSv -> mSv (1 mSv = 1000 uSv)
  return cumulativeUSv / 1000;
}

/**
 * Format radiation dose with explicit unit and human-readable precision
 */
export function formatRadiationDose(
  doseMsv: number,
  precision: number = 2
): { value: string; unit: string; full: string } {
  if (doseMsv < 0.001) {
    const uSv = doseMsv * 1000;
    return {
      value: uSv.toFixed(precision),
      unit: 'uSv',
      full: `${uSv.toFixed(precision)} uSv`,
    };
  }
  if (doseMsv >= 1000) {
    const sv = doseMsv / 1000;
    return {
      value: sv.toFixed(precision),
      unit: 'Sv',
      full: `${sv.toFixed(precision)} Sv`,
    };
  }
  return {
    value: doseMsv.toFixed(precision),
    unit: 'mSv',
    full: `${doseMsv.toFixed(precision)} mSv`,
  };
}
