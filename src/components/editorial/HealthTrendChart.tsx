import React from 'react';

interface DataPoint {
  time: string;
  value: number;
}

interface HealthTrendChartProps {
  data: DataPoint[];
  title?: string;
  unit?: string;
  baselineMin?: number;
  baselineMax?: number;
  strokeColor?: string;
  height?: number;
  className?: string;
}

export const HealthTrendChart: React.FC<HealthTrendChartProps> = ({
  data,
  title,
  unit,
  baselineMin,
  baselineMax,
  strokeColor = '#111111',
  height = 140,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, baselineMin ?? Infinity) * 0.95;
  const maxVal = Math.max(...values, baselineMax ?? -Infinity) * 1.05;
  const range = maxVal - minVal || 1;

  const width = 400;
  const paddingX = 20;
  const paddingY = 20;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * chartW;
    const y = height - paddingY - ((d.value - minVal) / range) * chartH;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  // Baseline Band
  let baselineBandY1 = 0;
  let baselineBandY2 = 0;
  if (baselineMin !== undefined && baselineMax !== undefined) {
    baselineBandY1 = height - paddingY - ((baselineMax - minVal) / range) * chartH;
    baselineBandY2 = height - paddingY - ((baselineMin - minVal) / range) * chartH;
  }

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {title && (
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-[#111111] uppercase tracking-wider">{title}</span>
          {unit && <span className="text-[#888882]">{unit}</span>}
        </div>
      )}

      <div className="relative w-full overflow-hidden bg-[#FFFFFF] border border-[#DCD8CD] rounded-xl p-2 shadow-subtle">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Baseline envelope band */}
          {baselineMin !== undefined && baselineMax !== undefined && (
            <rect
              x={paddingX}
              y={baselineBandY1}
              width={chartW}
              height={Math.max(0, baselineBandY2 - baselineBandY1)}
              fill="rgba(117, 216, 220, 0.15)"
              stroke="rgba(117, 216, 220, 0.4)"
              strokeDasharray="2 2"
            />
          )}

          {/* Reference Gridlines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#DCD8CD"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#DCD8CD"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />

          {/* Data Nodes */}
          {data.map((d, i) => {
            const [xStr, yStr] = points[i].split(',');
            const x = parseFloat(xStr);
            const y = parseFloat(yStr);
            const isLast = i === data.length - 1;
            return (
              <g key={i}>
                <title>{`${d.time}: ${d.value} ${unit}`}</title>
                <circle
                  cx={x}
                  cy={y}
                  r={isLast ? 4.5 : 3}
                  fill={isLast ? '#FF6B35' : '#FFFFFF'}
                  stroke={isLast ? '#111111' : strokeColor}
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Labels below */}
        <div className="flex items-center justify-between font-mono text-[9px] text-[#888882] px-2 pt-1 border-t border-[#DCD8CD]/50">
          <span>{data[0]?.time}</span>
          <span>CURRENT: {data[data.length - 1]?.value} {unit}</span>
          <span>{data[data.length - 1]?.time}</span>
        </div>
      </div>
    </div>
  );
};
