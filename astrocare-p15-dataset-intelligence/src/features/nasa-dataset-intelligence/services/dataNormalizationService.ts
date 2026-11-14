export interface UnitConversionResult {
  convertedValue: number;
  targetUnit: string;
  factorUsed: number;
  success: boolean;
  notes: string;
}

export class DataNormalizationService {
  /**
   * Scientifically validates and normalizes units.
   * Only permits conversions within the exact same physical dimension.
   */
  public static normalizeMeasurement(
    value: number,
    fromUnit: string,
    toUnit: string
  ): UnitConversionResult {
    const from = fromUnit.trim().toLowerCase();
    const to = toUnit.trim().toLowerCase();

    if (from === to) {
      return {
        convertedValue: value,
        targetUnit: toUnit,
        factorUsed: 1.0,
        success: true,
        notes: 'Units are identical; 1:1 identity mapping.'
      };
    }

    // Dimension: Mass concentration (pg/mL <-> ng/L)
    // 1 pg/mL = (1e-12 g) / (1e-3 L) = 1e-9 g/L = 1 ng/L
    if ((from === 'pg/ml' && to === 'ng/l') || (from === 'ng/l' && to === 'pg/ml')) {
      return {
        convertedValue: value,
        targetUnit: toUnit,
        factorUsed: 1.0,
        success: true,
        notes: 'Iso-molar volumetric equivalence: 1 pg/mL equals exactly 1 ng/L.'
      };
    }

    // Cortisol µg/dL <-> nmol/L
    // Cortisol MW = 362.46 g/mol. 1 µg/dL = 27.59 nmol/L
    if (from === 'µg/dl' && to === 'nmol/l') {
      return {
        convertedValue: +(value * 27.586).toFixed(2),
        targetUnit: 'nmol/L',
        factorUsed: 27.586,
        success: true,
        notes: 'Biomolecular molecular weight conversion for hydrocortisone (MW 362.46 g/mol).'
      };
    }

    // Incompatible physical dimensions
    return {
      convertedValue: value,
      targetUnit: fromUnit,
      factorUsed: 1.0,
      success: false,
      notes: `Conversion rejected: cannot normalize '${fromUnit}' to '${toUnit}'. Cross-dimensional conversion violates scientific validity.`
    };
  }

  /**
   * Calculates descriptive statistics for an array of observations
   */
  public static calculateCohortStats(values: number[]): {
    count: number;
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
  } {
    if (!values || values.length === 0) {
      return { count: 0, mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
    }

    const n = values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;
    
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)];

    const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const stdDev = Math.sqrt(variance);

    return {
      count: n,
      mean: +mean.toFixed(2),
      median: +median.toFixed(2),
      stdDev: +stdDev.toFixed(2),
      min: sorted[0],
      max: sorted[n - 1]
    };
  }
}
