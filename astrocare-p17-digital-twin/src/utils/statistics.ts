export interface DataPoint {
  x: number;
  y: number;
}

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  standardError: number;
  predict: (x: number) => number;
  predictInterval: (x: number, confidenceMultiplier?: number) => { lower: number; upper: number };
}

/**
 * Calculates ordinary least squares linear regression on a series of (x, y) points.
 */
export function calculateLinearRegression(points: DataPoint[]): LinearRegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Compute R-squared
  const meanY = sumY / n;
  let totalSS = 0;
  let residualSS = 0;

  for (const p of points) {
    const predictedY = slope * p.x + intercept;
    totalSS += Math.pow(p.y - meanY, 2);
    residualSS += Math.pow(p.y - predictedY, 2);
  }

  const rSquared = totalSS === 0 ? 1 : Math.max(0, 1 - residualSS / totalSS);
  const degreesOfFreedom = Math.max(1, n - 2);
  const standardError = Math.sqrt(residualSS / degreesOfFreedom);

  return {
    slope,
    intercept,
    rSquared: Math.round(rSquared * 1000) / 1000,
    standardError: Math.round(standardError * 100) / 100,
    predict: (x: number) => Math.round((slope * x + intercept) * 100) / 100,
    predictInterval: (x: number, confidenceMultiplier = 1.96) => {
      const pred = slope * x + intercept;
      const margin = confidenceMultiplier * standardError * Math.sqrt(1 + 1 / n + Math.pow(x - sumX / n, 2) / Math.max(1, sumX2 - (sumX * sumX) / n));
      return {
        lower: Math.round((pred - margin) * 100) / 100,
        upper: Math.round((pred + margin) * 100) / 100,
      };
    },
  };
}

/**
 * Calculates Simple Moving Average (SMA)
 */
export function calculateMovingAverage(values: number[], windowSize = 5): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < windowSize - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += values[i - j];
      }
      result.push(Math.round((sum / windowSize) * 100) / 100);
    }
  }
  return result;
}

/**
 * Holt-Winters double exponential smoothing for trended series
 */
export function calculateHoltLinearSmoothing(
  values: number[],
  alpha = 0.3,
  beta = 0.1,
  horizon = 7
): { smoothed: number[]; forecast: number[] } {
  if (values.length === 0) return { smoothed: [], forecast: [] };
  if (values.length === 1) {
    return {
      smoothed: [...values],
      forecast: Array(horizon).fill(values[0]),
    };
  }

  let level = values[0];
  let trend = values[1] - values[0];
  const smoothed: number[] = [level];

  for (let i = 1; i < values.length; i++) {
    const prevLevel = level;
    level = alpha * values[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    smoothed.push(Math.round(level * 100) / 100);
  }

  const forecast: number[] = [];
  for (let m = 1; m <= horizon; m++) {
    forecast.push(Math.round((level + m * trend) * 100) / 100);
  }

  return { smoothed, forecast };
}

/**
 * Z-score calculation for anomaly detection against historical personal baseline
 */
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return Math.round(((value - mean) / stdDev) * 100) / 100;
}

/**
 * Basic sample standard deviation
 */
export function calculateStandardDeviation(values: number[]): { mean: number; stdDev: number } {
  if (values.length === 0) return { mean: 0, stdDev: 0 };
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
  if (values.length === 1) return { mean: Math.round(mean * 100) / 100, stdDev: 0 };
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return {
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(Math.sqrt(variance) * 100) / 100,
  };
}

/**
 * Rate of change between subsequent measurements (% per interval)
 */
export function calculateRateOfChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}
