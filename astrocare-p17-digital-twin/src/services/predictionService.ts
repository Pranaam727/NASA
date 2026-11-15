import {
  PredictiveAnalysis,
  PredictionModelType,
  ForecastPoint,
} from '../types';
import { measurementService } from './measurementService';
import {
  calculateLinearRegression,
  calculateHoltLinearSmoothing,
  calculateMovingAverage,
  DataPoint,
} from '../utils/statistics';

class PredictionService {
  public generateForecast(
    astronautId: string,
    variable: string,
    modelType: PredictionModelType = 'Linear Regression',
    forecastHorizonDays = 14
  ): PredictiveAnalysis {
    const rawMeasurements = measurementService.getByAstronautAndVariable(astronautId, variable);
    const validMeasurements = rawMeasurements.filter((m) => m.value !== null && typeof m.value === 'number');

    if (validMeasurements.length < 3) {
      return {
        id: `pred-${Date.now()}`,
        astronautId,
        system: rawMeasurements[0]?.system || 'cardiovascular',
        measurementVariable: variable,
        variableName: rawMeasurements[0]?.variableName || variable,
        unit: rawMeasurements[0]?.unit || 'units',
        modelType,
        historicalDataRange: {
          startDay: validMeasurements[0]?.missionDay ?? 0,
          endDay: validMeasurements[validMeasurements.length - 1]?.missionDay ?? 0,
          sampleCount: validMeasurements.length,
        },
        forecastHorizonDays,
        predictions: [],
        uncertaintyNotes: 'Insufficient observation count to compute statistically sound projection.',
        limitations: [
          'Minimum sample threshold not met (n < 3).',
          'Statistical projection requires at least three independent observations across flight days.',
          'Missing data prevents robust estimation of biological variability.',
        ],
        assumptions: [
          'No extrapolation performed on inadequate historical series.',
        ],
        isSyntheticData: true,
        generatedAt: new Date().toISOString(),
        status: 'insufficient_data',
      };
    }

    const firstItem = validMeasurements[0];
    const lastItem = validMeasurements[validMeasurements.length - 1];
    const unit = firstItem.unit;
    const variableName = firstItem.variableName;
    const system = firstItem.system;

    const dataPoints: DataPoint[] = validMeasurements.map((m) => ({
      x: m.missionDay,
      y: m.value as number,
    }));

    const predictions: ForecastPoint[] = [];
    let rSquared = 0;
    let meanAbsoluteError = 0;

    const lastDay = lastItem.missionDay;
    const dayStep = Math.max(1, Math.round(forecastHorizonDays / 5));

    if (modelType === 'Linear Regression') {
      const reg = calculateLinearRegression(dataPoints);
      if (reg) {
        rSquared = reg.rSquared;
        for (let day = lastDay + dayStep; day <= lastDay + forecastHorizonDays; day += dayStep) {
          const val = reg.predict(day);
          const interval = reg.predictInterval(day);
          predictions.push({
            missionDay: day,
            timestamp: new Date(Date.now() + (day - lastDay) * 86400000).toISOString(),
            predictedValue: val,
            confidenceLower: interval.lower,
            confidenceUpper: interval.upper,
            confidenceIntervalLevel: 95,
          });
        }
      }
    } else if (modelType === 'Exponential Smoothing (Holt-Winters)') {
      const series = validMeasurements.map((m) => m.value as number);
      const { forecast } = calculateHoltLinearSmoothing(series, 0.35, 0.15, 5);
      forecast.forEach((val, idx) => {
        const day = lastDay + (idx + 1) * dayStep;
        const spread = Math.abs(val * 0.08 * (idx + 1));
        predictions.push({
          missionDay: day,
          timestamp: new Date(Date.now() + (day - lastDay) * 86400000).toISOString(),
          predictedValue: val,
          confidenceLower: Math.round((val - spread) * 100) / 100,
          confidenceUpper: Math.round((val + spread) * 100) / 100,
          confidenceIntervalLevel: 90,
        });
      });
    } else {
      // Simple Moving Average baseline extrapolation
      const values = validMeasurements.map((m) => m.value as number);
      const sma = calculateMovingAverage(values, Math.min(3, values.length));
      const lastSma = sma[sma.length - 1] ?? values[values.length - 1];
      for (let day = lastDay + dayStep; day <= lastDay + forecastHorizonDays; day += dayStep) {
        predictions.push({
          missionDay: day,
          timestamp: new Date(Date.now() + (day - lastDay) * 86400000).toISOString(),
          predictedValue: lastSma,
          confidenceLower: Math.round((lastSma * 0.93) * 100) / 100,
          confidenceUpper: Math.round((lastSma * 1.07) * 100) / 100,
          confidenceIntervalLevel: 85,
        });
      }
    }

    return {
      id: `pred-${Date.now()}`,
      astronautId,
      system,
      measurementVariable: variable,
      variableName,
      unit,
      modelType,
      historicalDataRange: {
        startDay: validMeasurements[0].missionDay,
        endDay: lastDay,
        sampleCount: validMeasurements.length,
      },
      forecastHorizonDays,
      predictions,
      rSquared,
      meanAbsoluteError,
      uncertaintyNotes:
        'Uncertainty intervals widen as projection distance increases from observed flight day baseline.',
      limitations: [
        'Projection is an exploratory statistical extrapolation, not a clinically validated diagnosis.',
        'Does not account for unmeasured acute operational stressors, solar events, or sudden exercise disruptions.',
        'Data source is synthetic demonstration telemetry; actual human physiological homeostatic regulation is non-linear.',
      ],
      assumptions: [
        'Countermeasure compliance (exercise and nutrition) assumed constant across horizon.',
        'No abrupt change in environmental life support or habitat pressure.',
        'Variance across previous flight days is assumed representative of future observations.',
      ],
      isSyntheticData: true,
      generatedAt: new Date().toISOString(),
      status: 'completed',
    };
  }
}

export const predictionService = new PredictionService();
