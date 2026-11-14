import React, { useState } from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { ChartContainer } from '@/components/common/Visualization';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { RadiationHistoryPoint } from '../hooks/useRadiationTelemetry';

interface RadiationExposureChartProps {
  history: RadiationHistoryPoint[];
  currentFluxUsVh: number;
  cumulativeDoseMsv: number;
}

export const RadiationExposureChart: React.FC<RadiationExposureChartProps> = ({
  history,
  currentFluxUsVh,
  cumulativeDoseMsv,
}) => {
  const [viewMode, setViewMode] = useState<'DOSE_RATE' | 'CUMULATIVE'>('DOSE_RATE');

  const chartData = history.map((point) => ({
    time: point.time,
    rate: Number(point.fluxUsVh.toFixed(3)),
    cumulative: Number(point.accumulatedDoseMSv.toFixed(3)),
    isSpe: point.isSpeActive,
  }));

  return (
    <DossierCard
      title="Radiation Telemetry Waveform & Dosimetric Accumulation"
      subtitle="REAL-TIME DOSIMETER FLUX INTEGRATION // SENSOR STREAM (CH-RAD-01)"
      badge={
        <div className="flex gap-1.5 bg-[#EAE6DC] p-0.5 rounded text-[11px] font-mono">
          <button
            onClick={() => setViewMode('DOSE_RATE')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'DOSE_RATE'
                ? 'bg-[#242824] text-[#F3F0E8] font-medium'
                : 'text-[#5A635B] hover:text-[#242824]'
            }`}
          >
            DOSE RATE (uSv/h)
          </button>
          <button
            onClick={() => setViewMode('CUMULATIVE')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'CUMULATIVE'
                ? 'bg-[#242824] text-[#F3F0E8] font-medium'
                : 'text-[#5A635B] hover:text-[#242824]'
            }`}
          >
            CUMULATIVE DOSE (mSv)
          </button>
        </div>
      }
    >
      <div className="mt-2">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm font-mono text-astro-text-secondary">
            WAITING FOR TELEMETRY PACKET STREAM...
          </div>
        ) : viewMode === 'DOSE_RATE' ? (
          <ChartContainer title="Ambient Radiation Dose Rate vs Safety Thresholds" height={280}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D16C48" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#D16C48" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8CBAF" opacity={0.4} />
                <XAxis
                  dataKey="time"
                  stroke="#738174"
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#738174"
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                  domain={[0, (dataMax: number) => Math.max(2.5, Math.ceil(dataMax * 1.2))]}
                  label={{ value: 'uSv/h', angle: -90, position: 'insideLeft', offset: 12, fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      return (
                        <div className="bg-[#1A1D1A] text-[#F3F0E8] p-2.5 rounded shadow border border-[#2A302A] font-mono text-xs">
                          <p className="text-[10px] text-[#738174] uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-semibold text-[#D16C48] mt-0.5">
                            {val.toFixed(3)} uSv/h
                          </p>
                          <p className="text-[10px] text-astro-text-secondary mt-1">
                            Status: {val >= 2.0 ? 'CRITICAL (SPE)' : val >= 0.5 ? 'WARNING' : 'NOMINAL'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={0.5}
                  stroke="#D16C48"
                  strokeDasharray="4 4"
                  label={{ value: 'WARNING (0.5 uSv/h)', fill: '#D16C48', fontSize: 10, position: 'right' }}
                />
                <ReferenceLine
                  y={2.0}
                  stroke="#B9473E"
                  strokeDasharray="4 4"
                  label={{ value: 'CRITICAL / SPE (2.0 uSv/h)', fill: '#B9473E', fontSize: 10, position: 'right' }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#D16C48"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#rateGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <ChartContainer title="Cumulative Mission Absorbed Radiation Exposure (mSv)" height={280}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8CBAF" opacity={0.4} />
                <XAxis
                  dataKey="time"
                  stroke="#738174"
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#738174"
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                  domain={['dataMin - 0.05', 'dataMax + 0.1']}
                  label={{ value: 'mSv', angle: -90, position: 'insideLeft', offset: 12, fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      return (
                        <div className="bg-[#1A1D1A] text-[#F3F0E8] p-2.5 rounded shadow border border-[#2A302A] font-mono text-xs">
                          <p className="text-[10px] text-[#738174] uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-semibold text-[#738174] mt-0.5">
                            {val.toFixed(4)} mSv
                          </p>
                          <p className="text-[10px] text-astro-text-secondary mt-1">
                            NASA Career Limit: 500 mSv
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#738174"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        <div className="flex flex-wrap justify-between items-center text-[11px] font-mono text-astro-text-secondary mt-3 pt-2 border-t border-astro-border-hairline">
          <span>REAL-TIME RATE: {currentFluxUsVh.toFixed(3)} uSv/h</span>
          <span>INTEGRATED DOSE: {cumulativeDoseMsv.toFixed(3)} mSv</span>
          <span>DATA PROVENANCE: MATHEMATICAL SIMULATOR (isSimulated = true)</span>
        </div>
      </div>
    </DossierCard>
  );
};
