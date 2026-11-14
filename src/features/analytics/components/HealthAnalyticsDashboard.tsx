import React from 'react';
import { useHealthAnalytics } from '../hooks/useHealthAnalytics';
import { CompositeRiskGauge } from './CompositeRiskGauge';
import { ParameterRiskCards } from './ParameterRiskCards';
import { BaselineComparisonMatrix } from './BaselineComparisonMatrix';
import { ActiveAlertsList } from './ActiveAlertsList';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { User, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const HealthAnalyticsDashboard: React.FC = () => {
  const {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    assessment,
    history,
    allAlerts,
    acknowledgeAlert,
    resolveAlert,
    isStreaming,
  } = useHealthAnalytics();

  // Prepare chart series from assessment history
  const chartData = history.map((h, idx) => ({
    time: new Date(h.timestamp).toLocaleTimeString(),
    index: idx + 1,
    score: h.compositeScore,
    hr: h.parameterRisks.HEART_RATE.currentValue,
    spo2: h.parameterRisks.SPO2.currentValue,
  }));

  return (
    <div className="space-y-5">
      {/* 1. Astronaut Selector & Quick Profile Bar */}
      <div className="bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-astro-bg-secondary flex items-center justify-center border border-astro-border-hairline">
            <User className="w-5 h-5 text-astro-text-secondary" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-astro-text-primary uppercase">
                {selectedAstronaut.profile?.callsign} // {selectedAstronaut.profile?.full_name}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-astro-bg-subtle text-[10px] font-mono text-astro-text-secondary">
                {selectedAstronaut.badge_number}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-astro-text-tertiary mt-0.5">
              <span>Resting HR: {selectedAstronaut.baseline_resting_hr} bpm</span>
              <span>•</span>
              <span>SpO2: {selectedAstronaut.baseline_spo2}%</span>
              <span>•</span>
              <span>
                BP: {selectedAstronaut.baseline_bp_systolic}/{selectedAstronaut.baseline_bp_diastolic} mmHg
              </span>
            </div>
          </div>
        </div>

        {/* Crew Selector Buttons */}
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <span className="text-[10px] text-astro-text-tertiary uppercase mr-1">Subject:</span>
          {astronauts.map((astro) => (
            <button
              key={astro.id}
              onClick={() => setSelectedAstronautId(astro.id)}
              className={`px-3 py-1.5 rounded-sm border text-[11px] uppercase tracking-wider transition-colors ${
                selectedAstronautId === astro.id
                  ? 'bg-astro-text-primary text-astro-text-inverted border-astro-text-primary font-bold shadow-sm'
                  : 'bg-astro-bg-surface text-astro-text-secondary border-astro-border-hairline hover:bg-astro-bg-subtle'
              }`}
            >
              {astro.profile?.callsign || astro.id}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Analytics Row: Composite Risk Gauge + Historical Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Gauge */}
        <CompositeRiskGauge assessment={assessment} className="lg:col-span-1" />

        {/* Dynamic Strain Score Trend Chart */}
        <div className="lg:col-span-2 bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-astro-border-hairline pb-3 mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-astro-text-secondary" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-astro-text-primary">
                DYNAMIC PHYSIOLOGICAL STRAIN TREND (LAST 40 CYCLES)
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#B9473E]" />
                <span className="text-astro-text-secondary">Strain Score</span>
              </span>
              <StatusIndicator
                status={isStreaming ? 'NOMINAL' : 'INFO'}
                label={isStreaming ? '1HZ STREAMING' : 'IDLE'}
                size="sm"
                pulse={isStreaming}
              />
            </div>
          </div>

          <div className="h-44 w-full pt-2">
            {chartData.length < 2 ? (
              <div className="h-full flex items-center justify-center font-mono text-xs text-astro-text-secondary">
                [ AWAITING TELEMETRY CYCLES TO RENDER REAL-TIME STRAIN CURVE ]
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 9, fill: '#73766F', fontFamily: 'monospace' }}
                    stroke="#D8D4C9"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: '#73766F', fontFamily: 'monospace' }}
                    stroke="#D8D4C9"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D8D4C9',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <ReferenceLine y={50} stroke="#C87D20" strokeDasharray="3 3" label="" />
                  <ReferenceLine y={75} stroke="#B9473E" strokeDasharray="3 3" label="" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#D16C48"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-astro-text-tertiary border-t border-astro-border-hairline pt-2 mt-2">
            <span>DASHED: WARNING (50) & CRITICAL (75) THRESHOLDS</span>
            <span>INTEGRATED WITH SIMULATION ENGINE EVENT BUS</span>
          </div>
        </div>
      </div>

      {/* 3. Parameter Risk Cards (8 Vital Channels) */}
      <ParameterRiskCards parameterRisks={assessment?.parameterRisks} />

      {/* 4. Baseline vs Current Comparison Matrix */}
      <BaselineComparisonMatrix comparisons={assessment?.baselineComparisons} />

      {/* 5. Active Alert Triage Queue */}
      <ActiveAlertsList
        alerts={allAlerts}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
      />
    </div>
  );
};
