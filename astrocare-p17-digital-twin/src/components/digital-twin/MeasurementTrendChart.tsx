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
} from 'recharts';
import { PhysiologicalMeasurement } from '../../types';
import { UnitTag } from '../common/UnitTag';

interface MeasurementTrendChartProps {
  title: string;
  variableName: string;
  unit: string;
  measurements: PhysiologicalMeasurement[];
  baselineValue?: number;
  expectedMin?: number;
  expectedMax?: number;
  height?: number;
  color?: string;
}

export const MeasurementTrendChart: React.FC<MeasurementTrendChartProps> = ({
  title,
  variableName,
  unit,
  measurements,
  baselineValue,
  expectedMin,
  expectedMax,
  height = 280,
  color = '#06b6d4',
}) => {
  // Sort chronologically
  const sorted = [...measurements].sort((a, b) => a.missionDay - b.missionDay);

  const chartData = sorted.map((m) => ({
    missionDay: m.missionDay,
    dayLabel: m.missionDay < 0 ? `L${m.missionDay}` : `FD ${m.missionDay}`,
    value: m.value,
    phase: m.missionPhase,
    source: m.sourceType,
  }));

  const validValues = chartData.filter((d) => d.value !== null).map((d) => d.value as number);
  const minVal = validValues.length > 0 ? Math.min(...validValues) : 0;
  const maxVal = validValues.length > 0 ? Math.max(...validValues) : 100;
  const yDomain = [
    Math.floor(Math.min(minVal, expectedMin ?? minVal, baselineValue ?? minVal) * 0.9),
    Math.ceil(Math.max(maxVal, expectedMax ?? maxVal, baselineValue ?? maxVal) * 1.1),
  ];

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
          <span className="text-xs text-slate-400">{variableName}</span>
        </div>
        <div className="flex items-center gap-2">
          {baselineValue !== undefined && (
            <span className="text-xs text-slate-400 font-mono">
              Base: <strong className="text-slate-200">{baselineValue}</strong>
            </span>
          )}
          <UnitTag unit={unit} />
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        {validValues.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 italic">
            No valid numeric data points recorded for this variable.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis
                dataKey="dayLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                domain={yDomain}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-sans">
                        <div className="font-mono text-cyan-400 font-semibold">
                          {data.dayLabel} ({data.phase})
                        </div>
                        <div className="text-slate-200">
                          Value:{' '}
                          <strong className="font-mono text-sm">
                            {data.value !== null ? `${data.value} ${unit}` : 'Missing / Unavailable'}
                          </strong>
                        </div>
                        <div className="text-[10px] text-slate-500">Source: {data.source}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Baseline Reference Line */}
              {baselineValue !== undefined && (
                <ReferenceLine
                  y={baselineValue}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: `Base: ${baselineValue}`,
                    fill: '#94a3b8',
                    fontSize: 10,
                    position: 'insideRight',
                  }}
                />
              )}

              {/* Expected Range Reference Lines */}
              {expectedMax !== undefined && (
                <ReferenceLine
                  y={expectedMax}
                  stroke="#f59e0b"
                  strokeDasharray="2 2"
                  opacity={0.4}
                />
              )}
              {expectedMin !== undefined && (
                <ReferenceLine
                  y={expectedMin}
                  stroke="#f59e0b"
                  strokeDasharray="2 2"
                  opacity={0.4}
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: color, stroke: '#080c14', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: color, strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
        <span>● Solid node: Ingested observation</span>
        <span>--- Dashed grey: Ground baseline</span>
      </div>
    </div>
  );
};
