/**
 * AstroCare Scientific Calculation Verification Suite
 * Mathematical formulations, invariants, numerical stability,
 * and property-based verification helpers.
 */

import { StatisticalSummary, AnomalyScoreResult } from '../../types/calculations';

export class CalculationValidator {
  /**
   * Absolute difference: |x - baseline|
   */
  public static absoluteDifference(value: number, baseline: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(baseline)) {
      throw new Error(`Invalid non-finite input: value=${value}, baseline=${baseline}`);
    }
    return Math.abs(value - baseline);
  }

  /**
   * Percentage deviation: ((value - baseline) / baseline) * 100
   * Invariant:
   * 1. If value === baseline, percentage deviation is strictly 0.0.
   * 2. If baseline === 0 and value === 0, percentage deviation is 0.0.
   * 3. If baseline === 0 and value !== 0, returns null (cannot divide by zero).
   */
  public static percentageDeviation(value: number, baseline: number): number | null {
    if (!Number.isFinite(value) || !Number.isFinite(baseline)) {
      throw new Error(`Invalid non-finite input: value=${value}, baseline=${baseline}`);
    }
    if (value === baseline) return 0.0;
    if (baseline === 0) return null; // Undefined division by zero
    return ((value - baseline) / Math.abs(baseline)) * 100;
  }

  /**
   * Z-score: (x - mean) / standardDeviation
   * Invariant:
   * 1. If stdDev === 0, return 0.0 when value === mean, else throw or return 0.0.
   * 2. When value === mean, z-score is 0.0.
   */
  public static zScore(value: number, mean: number, standardDeviation: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(mean) || !Number.isFinite(standardDeviation)) {
      throw new Error(
        `Invalid non-finite input: value=${value}, mean=${mean}, stdDev=${standardDeviation}`
      );
    }
    if (standardDeviation < 0) {
      throw new Error(`Standard deviation cannot be negative: ${standardDeviation}`);
    }
    if (standardDeviation === 0) {
      return value === mean ? 0.0 : (value > mean ? Infinity : -Infinity);
    }
    return (value - mean) / standardDeviation;
  }

  /**
   * Mean and standard deviation of an array
   */
  public static computeMeanAndStd(values: number[]): { mean: number; stdDev: number } {
    if (!values || values.length === 0) {
      throw new Error('Cannot compute statistics on empty array.');
    }
    const cleanValues = values.filter((v) => Number.isFinite(v));
    if (cleanValues.length === 0) {
      throw new Error('All supplied values are non-finite or NaN.');
    }

    const mean = cleanValues.reduce((sum, v) => sum + v, 0) / cleanValues.length;
    if (cleanValues.length === 1) {
      return { mean, stdDev: 0 };
    }

    const variance =
      cleanValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (cleanValues.length - 1);
    return { mean, stdDev: Math.sqrt(variance) };
  }

  /**
   * Simple Moving Average (SMA) over window size k
   */
  public static movingAverage(values: number[], windowSize: number): number[] {
    if (windowSize <= 0 || !Number.isInteger(windowSize)) {
      throw new Error(`Window size must be a positive integer, got ${windowSize}.`);
    }
    if (!values || values.length === 0) {
      return [];
    }
    if (windowSize > values.length) {
      throw new Error(
        `Window size (${windowSize}) cannot exceed series length (${values.length}).`
      );
    }

    const result: number[] = [];
    let currentWindowSum = 0;

    for (let i = 0; i < windowSize; i++) {
      if (!Number.isFinite(values[i])) {
        throw new Error(`Non-finite element at index ${i}: ${values[i]}`);
      }
      currentWindowSum += values[i];
    }
    result.push(currentWindowSum / windowSize);

    for (let i = windowSize; i < values.length; i++) {
      if (!Number.isFinite(values[i])) {
        throw new Error(`Non-finite element at index ${i}: ${values[i]}`);
      }
      currentWindowSum += values[i] - values[i - windowSize];
      result.push(currentWindowSum / windowSize);
    }

    return result;
  }

  /**
   * Compute comprehensive statistical summary
   */
  public static computeSummary(values: number[], baseline?: number): StatisticalSummary {
    const { mean, stdDev } = this.computeMeanAndStd(values);
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const base = baseline !== undefined ? baseline : mean;

    const zScores = values.map((v) => this.zScore(v, mean, stdDev));
    const absoluteDifferences = values.map((v) => this.absoluteDifference(v, base));
    const percentageDeviations = values.map((v) => this.percentageDeviation(v, base));
    const movingAverages = values.length >= 3 ? this.movingAverage(values, 3) : values;

    return {
      mean,
      median,
      standardDeviation: stdDev,
      zScores,
      absoluteDifferences,
      percentageDeviations,
      movingAverages,
    };
  }

  /**
   * Normalized Anomaly Scoring algorithm
   * Combines statistical divergence (|z|), rate of change, and domain weights
   */
  public static calculateAnomalyScore(params: {
    observedValue: number;
    baselineMean: number;
    baselineStdDev: number;
    previousValue?: number;
    deltaTimeMinutes?: number;
    domainWeight?: number; // 0.0 to 1.0 (default 0.5)
    zScoreThreshold?: number; // default 2.5 (99% confidence interval)
  }): AnomalyScoreResult {
    const {
      observedValue,
      baselineMean,
      baselineStdDev,
      previousValue,
      deltaTimeMinutes,
      domainWeight = 0.5,
      zScoreThreshold = 2.5,
    } = params;

    const z = Math.abs(this.zScore(observedValue, baselineMean, baselineStdDev));
    // Sigmoid compression for z-score component: maps [0, inf) to [0, 1)
    const zContribution = 1 - Math.exp(-0.5 * Math.max(0, z - 1));

    let rocContribution = 0;
    if (
      previousValue !== undefined &&
      deltaTimeMinutes !== undefined &&
      deltaTimeMinutes > 0
    ) {
      const deltaRate = Math.abs(observedValue - previousValue) / deltaTimeMinutes;
      const expectedBaselineRate = baselineStdDev / 10; // reference plausible rate
      rocContribution = Math.min(1.0, deltaRate / (expectedBaselineRate * 5));
    }

    // Composite score
    const rawScore = 0.6 * zContribution + 0.4 * rocContribution;
    const weightedScore = rawScore * (0.5 + 0.5 * Math.min(1.0, domainWeight));
    const finalScore = Math.min(1.0, Math.max(0.0, weightedScore));

    const isAnomaly = z >= zScoreThreshold || finalScore >= 0.75;
    const confidence = Math.min(1.0, Math.max(0.5, z / 4));

    return {
      score: Math.round(finalScore * 1000) / 1000,
      isAnomaly,
      zScoreContribution: Math.round(zContribution * 1000) / 1000,
      rateOfChangeContribution: Math.round(rocContribution * 1000) / 1000,
      domainWeight,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  /**
   * Unit conversions for biomedical & aerospace sensors
   */
  public static convertBiomedicalUnit(
    val: number,
    from: 'degC' | 'degF' | 'mmHg' | 'kPa' | 'bpm' | 'Hz',
    to: 'degC' | 'degF' | 'mmHg' | 'kPa' | 'bpm' | 'Hz'
  ): number {
    if (!Number.isFinite(val)) {
      throw new Error(`Cannot convert non-finite value: ${val}`);
    }
    if (from === to) return val;

    // Temperature
    if (from === 'degC' && to === 'degF') return (val * 9) / 5 + 32;
    if (from === 'degF' && to === 'degC') return ((val - 32) * 5) / 9;

    // Pressure
    if (from === 'mmHg' && to === 'kPa') return val * 0.133322387415;
    if (from === 'kPa' && to === 'mmHg') return val / 0.133322387415;

    // Frequency
    if (from === 'bpm' && to === 'Hz') return val / 60;
    if (from === 'Hz' && to === 'bpm') return val * 60;

    throw new Error(`Incompatible or unsupported unit conversion: from "${from}" to "${to}".`);
  }
}
