import { useState, useCallback } from 'react';
import { PredictiveAnalysis, PredictionModelType } from '../types';
import { predictionService } from '../services/predictionService';

export function usePredictiveAnalytics(astronautId: string) {
  const [currentAnalysis, setCurrentAnalysis] = useState<PredictiveAnalysis | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string>('resting_heart_rate');
  const [modelType, setModelType] = useState<PredictionModelType>('Linear Regression');
  const [horizonDays, setHorizonDays] = useState<number>(14);
  const [isComputing, setIsComputing] = useState<boolean>(false);

  const runPrediction = useCallback(
    (variable = selectedVariable, model = modelType, horizon = horizonDays) => {
      setIsComputing(true);
      try {
        const result = predictionService.generateForecast(astronautId, variable, model, horizon);
        setCurrentAnalysis(result);
      } finally {
        setIsComputing(false);
      }
    },
    [astronautId, selectedVariable, modelType, horizonDays]
  );

  return {
    currentAnalysis,
    selectedVariable,
    setSelectedVariable,
    modelType,
    setModelType,
    horizonDays,
    setHorizonDays,
    isComputing,
    runPrediction,
  };
}
