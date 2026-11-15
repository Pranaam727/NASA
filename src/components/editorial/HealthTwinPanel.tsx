import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { HealthTrendChart } from './HealthTrendChart';

interface BaselineMetric {
  name: string;
  current: number;
  baselineMean: number;
  sigma: number;
  unit: string;
  zScore: number;
}

interface HealthTwinPanelProps {
  astronautName?: string;
  className?: string;
}

export const HealthTwinPanel: React.FC<HealthTwinPanelProps> = ({
  astronautName = 'Cmdr. Marcus Chen',
  className = '',
}) => {
  const metrics: BaselineMetric[] = [
    {
      name: 'Resting Heart Rate',
      current: 64,
      baselineMean: 64,
      sigma: 4.2,
      unit: 'BPM',
      zScore: 0.0,
    },
    {
      name: 'Systolic Blood Pressure',
      current: 114,
      baselineMean: 118,
      sigma: 5.5,
      unit: 'mmHg',
      zScore: -0.73,
    },
    {
      name: 'Slow-Wave Sleep Fraction',
      current: 21.4,
      baselineMean: 19.8,
      sigma: 2.1,
      unit: '%',
      zScore: +0.76,
    },
    {
      name: 'Max Grip Strength',
      current: 48.2,
      baselineMean: 49.0,
      sigma: 1.8,
      unit: 'kg',
      zScore: -0.44,
    },
  ];

  const sampleTrendData = [
    { time: 'Sol 112', value: 66 },
    { time: 'Sol 118', value: 65 },
    { time: 'Sol 124', value: 67 },
    { time: 'Sol 130', value: 64 },
    { time: 'Sol 136', value: 63 },
    { time: 'Sol 142', value: 64 },
  ];

  return (
    <div
      className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#111111] shadow-subtle space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCD8CD] pb-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#888882] block">
            INDIVIDUALIZED DIGITAL TWIN · 30-DAY STATISTICAL ENVELOPE (μ ± 2σ)
          </span>
          <h4 className="font-display font-bold text-xl text-[#111111]">
            PHYSIOLOGICAL BASELINE TWIN // {astronautName.toUpperCase()}
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full font-mono text-[10px] font-bold bg-[#75D8DC]/20 border border-[#75D8DC]/40 text-[#111111] flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
            <span>BASELINE STABILIZED</span>
          </span>
        </div>
      </div>

      {/* Metric comparison grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const isDeviated = Math.abs(m.zScore) > 2.0;
          return (
            <div
              key={m.name}
              className="p-4 rounded-xl bg-[#F2F0EA]/50 border border-[#DCD8CD] space-y-2"
            >
              <div className="font-mono text-[10px] text-[#888882] uppercase truncate">
                {m.name}
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-display font-bold text-2xl text-[#111111] tabular-nums">
                  {m.current}
                </span>
                <span className="font-mono text-xs text-[#888882]">{m.unit}</span>
              </div>

              <div className="pt-2 border-t border-[#DCD8CD] font-mono text-[10px] flex items-center justify-between">
                <span className="text-[#888882]">μ = {m.baselineMean}</span>
                <span
                  className={`font-bold tabular-nums ${
                    isDeviated ? 'text-[#FF6B35]' : 'text-[#75D8DC]'
                  }`}
                >
                  {m.zScore >= 0 ? `+${m.zScore.toFixed(2)}σ` : `${m.zScore.toFixed(2)}σ`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 30-Day Trend Chart */}
      <div className="pt-2">
        <HealthTrendChart
          data={sampleTrendData}
          title="30-Day Resting Heart Rate Drift vs Ground Baseline"
          unit="BPM"
          baselineMin={56}
          baselineMax={72}
          strokeColor="#111111"
          height={150}
        />
      </div>
    </div>
  );
};
