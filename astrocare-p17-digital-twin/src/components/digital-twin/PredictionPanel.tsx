import React, { useState } from 'react';
import { PredictiveAnalysis, PredictionModelType } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { UnitTag } from '../common/UnitTag';
import { DisclaimerNotice } from '../common/DisclaimerNotice';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { BIOMEDICAL_VARIABLE_REGISTRY } from '../../utils/unitValidation';

interface PredictionPanelProps {
  analysis: PredictiveAnalysis | null;
  historicalValues: { missionDay: number; value: number | null }[];
  onRunPrediction: (variable: string, model: PredictionModelType, horizon: number) => void;
  isComputing?: boolean;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  analysis,
  historicalValues,
  onRunPrediction,
  isComputing = false,
}) => {
  const [selectedVar, setSelectedVar] = useState<string>('resting_heart_rate');
  const [selectedModel, setSelectedModel] = useState<PredictionModelType>('Linear Regression');
  const [horizon, setHorizon] = useState<number>(14);

  const variablesList = Object.values(BIOMEDICAL_VARIABLE_REGISTRY);

  // Combine historical observations and predictions into a unified dataset for Recharts
  const chartData: {
    dayLabel: string;
    missionDay: number;
    observed?: number | null;
    predicted?: number;
    confidenceLower?: number;
    confidenceUpper?: number;
  }[] = [];

  // Add historical points
  historicalValues
    .filter((h) => h.value !== null)
    .sort((a, b) => a.missionDay - b.missionDay)
    .forEach((h) => {
      chartData.push({
        dayLabel: h.missionDay < 0 ? `L${h.missionDay}` : `FD ${h.missionDay}`,
        missionDay: h.missionDay,
        observed: h.value,
      });
    });

  // Connect last historical point to first prediction
  if (analysis && analysis.status === 'completed' && analysis.predictions.length > 0) {
    const lastHist = historicalValues[historicalValues.length - 1];
    if (lastHist && lastHist.value !== null) {
      const existing = chartData.find((d) => d.missionDay === lastHist.missionDay);
      if (existing) {
        existing.predicted = lastHist.value;
        existing.confidenceLower = lastHist.value;
        existing.confidenceUpper = lastHist.value;
      }
    }

    analysis.predictions.forEach((p) => {
      chartData.push({
        dayLabel: `FD ${p.missionDay}*`,
        missionDay: p.missionDay,
        predicted: p.predictedValue,
        confidenceLower: p.confidenceLower,
        confidenceUpper: p.confidenceUpper,
      });
    });
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Predictive Health Analytics Engine
            </h3>
            <Badge variant="cyan">STATISTICAL FORECASTING</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Short-term physiological trajectory modeling using ordinary least squares regression and exponential smoothing.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={() => onRunPrediction(selectedVar, selectedModel, horizon)}
          disabled={isComputing}
        >
          {isComputing ? 'Computing Projection...' : 'Run Prediction Engine'}
        </Button>
      </div>

      {/* Model Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Biomedical Variable
          </label>
          <select
            value={selectedVar}
            onChange={(e) => setSelectedVar(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {variablesList.map((v) => (
              <option key={v.variableKey} value={v.variableKey}>
                {v.name} [{v.standardUnit}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Mathematical Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as PredictionModelType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="Linear Regression">Ordinary Least Squares Linear Regression</option>
            <option value="Exponential Smoothing (Holt-Winters)">Holt Linear Exponential Smoothing</option>
            <option value="Simple Moving Average (SMA)">Simple Moving Average (SMA Baseline)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Forecast Horizon ({horizon} Days)
          </label>
          <input
            type="range"
            min={7}
            max={60}
            step={7}
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>+7 Days</span>
            <span>+30 Days</span>
            <span>+60 Days</span>
          </div>
        </div>
      </div>

      {/* Projection Chart & Output */}
      {analysis && analysis.status === 'insufficient_data' ? (
        <div className="p-6 bg-slate-900/40 border border-dashed border-amber-500/40 rounded-xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="font-semibold text-slate-200 text-sm">
            Statistical Prediction Unavailable
          </h4>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            {analysis.uncertaintyNotes}
          </p>
          <ul className="text-xs text-slate-500 space-y-1 pt-2">
            {analysis.limitations.map((lim, idx) => (
              <li key={idx}>• {lim}</li>
            ))}
          </ul>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span>Trajectory Forecast: {analysis.variableName}</span>
                  <UnitTag unit={analysis.unit} />
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Algorithm: {analysis.modelType} • R²: {analysis.rSquared ?? 'N/A'} • Samples: {analysis.historicalDataRange.sampleCount}
                </p>
              </div>

              <Badge variant="teal">
                <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" />
                EXTRAPOLATION ACTIVE
              </Badge>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    dataKey="dayLabel"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-sans">
                            <div className="font-mono text-cyan-400 font-semibold">{data.dayLabel}</div>
                            {data.observed !== undefined && (
                              <div className="text-emerald-300">
                                Observed Telemetry: <strong>{data.observed} {analysis.unit}</strong>
                              </div>
                            )}
                            {data.predicted !== undefined && (
                              <div className="text-cyan-300">
                                Projected Value: <strong>{data.predicted} {analysis.unit}</strong>
                              </div>
                            )}
                            {data.confidenceLower !== undefined && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                95% Confidence Interval: [{data.confidenceLower} - {data.confidenceUpper}]
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 10 }}
                  />

                  {/* Confidence Interval band */}
                  <Area
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="none"
                    fill="#06b6d4"
                    fillOpacity={0.12}
                    name="95% Confidence Band"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidenceLower"
                    stroke="none"
                    fill="#080c14"
                    fillOpacity={1.0}
                    name="Uncertainty Floor"
                  />

                  {/* Observed solid line */}
                  <Line
                    type="monotone"
                    dataKey="observed"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#10b981' }}
                    name="Observed Telemetry"
                    connectNulls={false}
                  />

                  {/* Projected dashed line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#06b6d4' }}
                    name="Projected Trend (*)"
                    connectNulls={true}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>● Green: Historical Observation</span>
              <span>--- Cyan (*): Statistical Projection</span>
              <span>Shaded Area: 95% Confidence Interval</span>
            </div>
          </div>

          {/* Scientific Limitations & Assumptions Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-lg text-xs space-y-1.5">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] text-cyan-400">
                Mathematical Model Assumptions
              </span>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                {analysis.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-lg text-xs space-y-1.5">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] text-amber-400">
                Scientific Limitations
              </span>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                {analysis.limitations.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-900/30 rounded-xl border border-slate-800">
          Select parameters and click "Run Prediction Engine" to generate a longitudinal statistical projection.
        </div>
      )}

      <DisclaimerNotice compact />
    </Card>
  );
};
