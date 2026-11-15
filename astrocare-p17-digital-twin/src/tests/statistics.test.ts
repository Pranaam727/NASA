import { describe, it, expect } from 'vitest';
import {
  calculateLinearRegression,
  calculateMovingAverage,
  calculateHoltLinearSmoothing,
  calculateZScore,
  calculateStandardDeviation,
  calculateRateOfChange,
} from '../utils/statistics';

describe('Statistical & Predictive Calculations', () => {
  it('calculates linear regression correctly on trended series', () => {
    const points = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 30 },
      { x: 4, y: 40 },
    ];
    const result = calculateLinearRegression(points);
    expect(result).not.toBeNull();
    expect(result!.slope).toBeCloseTo(10, 1);
    expect(result!.intercept).toBeCloseTo(0, 1);
    expect(result!.rSquared).toBeCloseTo(1, 2);
    expect(result!.predict(5)).toBe(50);
  });

  it('handles small sample sizes safely', () => {
    const emptyResult = calculateLinearRegression([]);
    expect(emptyResult).toBeNull();

    const singleResult = calculateLinearRegression([{ x: 1, y: 10 }]);
    expect(singleResult).toBeNull();
  });

  it('calculates Simple Moving Average (SMA)', () => {
    const series = [10, 20, 30, 40, 50];
    const sma3 = calculateMovingAverage(series, 3);
    expect(sma3[0]).toBeNull();
    expect(sma3[1]).toBeNull();
    expect(sma3[2]).toBe(20); // (10+20+30)/3
    expect(sma3[3]).toBe(30); // (20+30+40)/3
    expect(sma3[4]).toBe(40); // (30+40+50)/3
  });

  it('calculates Holt linear exponential smoothing', () => {
    const series = [50, 52, 55, 58, 62];
    const { smoothed, forecast } = calculateHoltLinearSmoothing(series, 0.3, 0.1, 3);
    expect(smoothed.length).toBe(series.length);
    expect(forecast.length).toBe(3);
    expect(forecast[0]).toBeGreaterThan(50);
  });

  it('calculates Z-score accurately', () => {
    const z = calculateZScore(70, 60, 5);
    expect(z).toBe(2);
  });

  it('calculates standard deviation and mean', () => {
    const data = [10, 12, 14, 16, 18];
    const { mean, stdDev } = calculateStandardDeviation(data);
    expect(mean).toBe(14);
    expect(stdDev).toBeCloseTo(3.16, 1);
  });

  it('calculates rate of change percentage', () => {
    const roc = calculateRateOfChange(120, 100);
    expect(roc).toBe(20);
  });
});
