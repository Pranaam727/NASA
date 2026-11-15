export type PredictionModelType = 
  | 'Linear Regression'
  | 'Exponential Smoothing (Holt-Winters)'
  | 'Simple Moving Average (SMA)'
  | 'Weighted Rate-of-Change (W-RoC)'
  | 'Z-Score Baseline Projection';

export interface ForecastPoint {
  missionDay: number;
  timestamp: string;
  predictedValue: number;
  confidenceLower: number;
  confidenceUpper: number;
  confidenceIntervalLevel: number; // e.g. 95%
}

export interface PredictiveAnalysis {
  id: string;
  astronautId: string;
  system: string;
  measurementVariable: string;
  variableName: string;
  unit: string;
  modelType: PredictionModelType;
  historicalDataRange: {
    startDay: number;
    endDay: number;
    sampleCount: number;
  };
  forecastHorizonDays: number;
  predictions: ForecastPoint[];
  rSquared?: number;
  meanAbsoluteError?: number;
  uncertaintyNotes: string;
  limitations: string[];
  assumptions: string[];
  isSyntheticData: boolean;
  generatedAt: string;
  status: 'completed' | 'insufficient_data' | 'low_confidence';
}
