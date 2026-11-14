import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { HealthMetric } from '../../types/contracts';
import { useTheme } from '../../design-system/ThemeContext';
import { DESIGN_TOKENS } from '../../design-system/tokens';

interface BaselineComparisonChartProps {
  metrics: HealthMetric[];
  height?: number;
  className?: string;
}

export const BaselineComparisonChart: React.FC<BaselineComparisonChartProps> = ({
  metrics,
  height = 260,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Normalize metrics to percentage of baseline (100% = Baseline)
  const chartData = metrics.map(m => {
    const percentOfBaseline = m.baselineValue !== 0 ? Math.round((m.currentValue / m.baselineValue) * 100) : 100;
    return {
      name: m.name.length > 20 ? m.name.substring(0, 18) + '...' : m.name,
      fullName: m.name,
      currentValue: m.currentValue,
      baselineValue: m.baselineValue,
      unit: m.unit,
      percentOfBaseline,
      baselineNormalized: 100
    };
  });

  const gridColor = isDark ? DESIGN_TOKENS.charts.gridDark : DESIGN_TOKENS.charts.gridLight;
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className={`bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm ${className}`}>
      
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
            Baseline Deviation Index (Normalized % of 1-G Pre-Flight Baseline)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            100% represents individual pre-flight baseline. Higher/lower reflects spaceflight physiological remodeling.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Monitored In-Flight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" />
            <span className="text-slate-500">Pre-Flight (100%)</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
            
            <XAxis
              dataKey="name"
              stroke={textColor}
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              angle={-15}
              textAnchor="end"
            />

            <YAxis
              stroke={textColor}
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              domain={[40, 160]}
              unit="%"
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs font-mono text-slate-200 space-y-1">
                    <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1">
                      {d.fullName}
                    </div>
                    <div>
                      Monitored: <strong className="text-white">{d.currentValue} {d.unit}</strong> ({d.percentOfBaseline}% of baseline)
                    </div>
                    <div className="text-slate-400">
                      Pre-Flight Baseline: {d.baselineValue} {d.unit} (100%)
                    </div>
                  </div>
                );
              }}
            />

            <Bar dataKey="percentOfBaseline" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="baselineNormalized" fill={isDark ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
