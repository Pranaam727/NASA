import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { HealthMetric } from '../../types/contracts';
import { useTheme } from '../../design-system/ThemeContext';
import { DESIGN_TOKENS } from '../../design-system/tokens';

interface MultiMetricComparisonChartProps {
  primaryMetric: HealthMetric;
  secondaryMetric: HealthMetric;
  height?: number;
  className?: string;
}

export const MultiMetricComparisonChart: React.FC<MultiMetricComparisonChartProps> = ({
  primaryMetric,
  secondaryMetric,
  height = 260,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Merge the two time series by matching timestamps
  const primaryData = primaryMetric.timeSeriesHistory || [];
  const secondaryData = secondaryMetric.timeSeriesHistory || [];

  const mergedData = primaryData.map((pt, idx) => {
    const secPt = secondaryData[idx] || secondaryData[secondaryData.length - 1];
    return {
      timestamp: pt.timestamp,
      primaryValue: pt.value,
      secondaryValue: secPt?.value ?? null
    };
  });

  const gridColor = isDark ? DESIGN_TOKENS.charts.gridDark : DESIGN_TOKENS.charts.gridLight;
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className={`bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm ${className}`}>
      
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
            Cross-Disciplinary Telemetry Correlation
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Synchronized comparison: <span className="text-cyan-500 font-semibold">{primaryMetric.name}</span> vs{' '}
            <span className="text-purple-500 font-semibold">{secondaryMetric.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">{primaryMetric.name} ({primaryMetric.unit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">{secondaryMetric.name} ({secondaryMetric.unit})</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />

            <XAxis
              dataKey="timestamp"
              stroke={textColor}
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />

            {/* Left Y Axis for Primary Metric */}
            <YAxis
              yAxisId="left"
              stroke="#06b6d4"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              domain={['auto', 'auto']}
              unit={` ${primaryMetric.unit}`}
            />

            {/* Right Y Axis for Secondary Metric */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#a855f7"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              domain={['auto', 'auto']}
              unit={` ${secondaryMetric.unit}`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const pt = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs font-mono text-slate-200 space-y-1">
                    <div className="font-bold text-white border-b border-slate-800 pb-1">
                      {label}
                    </div>
                    <div className="text-cyan-400">
                      {primaryMetric.name}: <strong className="text-white">{pt.primaryValue} {primaryMetric.unit}</strong>
                    </div>
                    <div className="text-purple-400">
                      {secondaryMetric.name}: <strong className="text-white">{pt.secondaryValue} {secondaryMetric.unit}</strong>
                    </div>
                  </div>
                );
              }}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="primaryValue"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#06b6d4' }}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="secondaryValue"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#a855f7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
