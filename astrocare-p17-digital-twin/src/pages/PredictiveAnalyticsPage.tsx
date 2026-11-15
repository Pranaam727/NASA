import React, { useEffect } from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { PredictionPanel } from '../components/digital-twin/PredictionPanel';
import { usePredictiveAnalytics } from '../hooks/usePredictiveAnalytics';
import { Badge } from '../components/common/Badge';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

interface PredictiveAnalyticsPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const PredictiveAnalyticsPage: React.FC<PredictiveAnalyticsPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const {
    currentAnalysis,
    selectedVariable,
    setSelectedVariable,
    modelType,
    setModelType,
    horizonDays,
    setHorizonDays,
    isComputing,
    runPrediction,
  } = usePredictiveAnalytics(activeProfile?.id);

  // Initialize with resting_heart_rate on first load
  useEffect(() => {
    if (activeProfile?.id) {
      runPrediction('resting_heart_rate', 'Linear Regression', 14);
    }
  }, [activeProfile?.id, runPrediction]);

  const historicalValues = measurements
    .filter(
      (m) =>
        m.astronautId === activeProfile?.id &&
        m.variable === (currentAnalysis?.measurementVariable || selectedVariable)
    )
    .map((m) => ({ missionDay: m.missionDay, value: m.value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Predictive Health Intelligence Engine
            </h1>
            <Badge variant="cyan">CORE P17 FEATURE</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explainable statistical forecasting of biomedical trajectories with confidence interval boundaries and uncertainty quantification for {activeProfile?.displayName}.
          </p>
        </div>
      </div>

      <DisclaimerNotice />

      <PredictionPanel
        analysis={currentAnalysis}
        historicalValues={historicalValues}
        onRunPrediction={(variable, model, horizon) => {
          setSelectedVariable(variable);
          setModelType(model);
          setHorizonDays(horizon);
          runPrediction(variable, model, horizon);
        }}
        isComputing={isComputing}
      />
    </div>
  );
};
