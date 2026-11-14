import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area
} from 'recharts';
import { HealthMetric } from '../../types/contracts';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { useTheme } from '../../design-system/ThemeContext';
import { DESIGN_TOKENS } from '../../design-system/tokens';

interface MetricTrendChartProps {
  metric: HealthMetric;
  height?: number;
  className?: string;
}

export const MetricTrendChart: React.FC<MetricTrendChartProps> = ({
  metric,
  height = 240,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = metric.timeSeriesHistory || [];

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
        No time-series data logged for {metric.name}.
      </div>
    );
  }

  const gridColor = isDark ? DESIGN_TOKENS.charts.gridDark : DESIGN_TOKENS.charts.gridLight;
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className={`bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm ${className}`}>
      
      {/* Chart Title & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
              {metric.name} Trend
            </h4>
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              ({metric.unit})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Mission Elapsed Trajectory • Flight Day {data[0]?.timestamp} to {data[data.length - 1]?.timestamp}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300">Measured</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-t border-dashed border-slate-400" />
              <span className="text-slate-500">1-G Baseline</span>
            </div>
          </div>
          <DataProvenanceBadge type={metric.provenance.type} />
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
            
            <XAxis
              dataKey="timestamp"
              stroke={textColor}
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />

            <YAxis
              stroke={textColor}
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              domain={['auto', 'auto']}
              unit={` ${metric.unit}`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const pt = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs font-mono text-slate-200 space-y-1">
                    <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1">
                      {label} (Mission Flight Day)
                    </div>
                    <div>
                      Measured: <strong className="text-white text-sm">{pt.value} {metric.unit}</strong>
                    </div>
                    <div className="text-slate-400">
                      1-G Baseline: {pt.baseline} {metric.unit}
                    </div>
                    {pt.lowerNominal && pt.upperNominal && (
                      <div className="text-[10px] text-emerald-400">
                        Nominal Margin: [{pt.lowerNominal} - {pt.upperNominal}]
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Baseline Reference Line */}
            {metric.baselineValue && (
              <ReferenceLine
                y={metric.baselineValue}
                stroke={isDark ? '#94a3b8' : '#64748b'}
                strokeDasharray="4 4"
                label={{
                  value: `Baseline (${metric.baselineValue})`,
                  position: 'insideBottomRight',
                  fill: textColor,
                  fontSize: 10,
                  fontFamily: 'monospace'
                }}
              />
            )}

            {/* Primary Telemetry Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#06b6d4' }}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#0891b2', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Provenance and Units Note */}
      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-850">
        <span>Unit of Measure: {metric.unit} ({metric.domain.toUpperCase()})</span>
        <span>Sensor: {metric.provenance.sourceSystem}</span>
      </div>

    </div>
  );
};
