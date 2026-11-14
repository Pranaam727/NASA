import React from 'react';
import {
  Heart,
  Wind,
  Activity,
  Thermometer,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { BaselineComparison, RiskLevel, VitalParameter } from '../types/analyticsTypes';

interface BaselineComparisonMatrixProps {
  comparisons: Record<VitalParameter, BaselineComparison> | undefined;
  className?: string;
}

export const BaselineComparisonMatrix: React.FC<BaselineComparisonMatrixProps> = ({
  comparisons,
  className = '',
}) => {
  if (!comparisons) {
    return (
      <div className="p-6 text-center text-xs font-mono text-astro-text-secondary bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
        [ AWAITING TELEMETRY STREAM TO COMPUTE BASELINE MATRIX ]
      </div>
    );
  }

  const iconMap: Record<VitalParameter, React.ReactNode> = {
    HEART_RATE: <Heart className="w-3.5 h-3.5 text-astro-text-secondary" />,
    SPO2: <Wind className="w-3.5 h-3.5 text-astro-text-secondary" />,
    BLOOD_PRESSURE_SYS: <Activity className="w-3.5 h-3.5 text-astro-text-secondary" />,
    BLOOD_PRESSURE_DIA: <Activity className="w-3.5 h-3.5 text-astro-text-secondary" />,
    CORE_TEMP: <Thermometer className="w-3.5 h-3.5 text-astro-text-secondary" />,
    RESPIRATORY_RATE: <Wind className="w-3.5 h-3.5 text-astro-text-secondary" />,
    RADIATION_FLUX: <Radio className="w-3.5 h-3.5 text-astro-text-secondary" />,
  };

  const riskBadgeStyles: Record<RiskLevel, string> = {
    NORMAL: 'bg-astro-status-healthy/10 text-astro-status-healthy border-astro-status-healthy/30',
    CAUTION: 'bg-astro-status-caution/10 text-astro-status-caution border-astro-status-caution/30',
    WARNING: 'bg-[#C87D20]/10 text-[#C87D20] border-[#C87D20]/30',
    CRITICAL: 'bg-astro-status-critical/10 text-astro-status-critical border-astro-status-critical/30',
  };

  const rows = Object.values(comparisons);

  return (
    <div
      className={`bg-astro-bg-surface border border-astro-border-hairline rounded-sm overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-astro-border-hairline flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-astro-text-primary font-bold">
          PHYSIOLOGICAL BASELINE COMPARISON MATRIX
        </h3>
        <span className="text-[10px] font-mono text-astro-text-tertiary uppercase">
          INDIVIDUAL RESTING BASELINE VS TELEMETRY (1HZ)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-astro-border-hairline bg-astro-bg-secondary/40 text-[10px] text-astro-text-secondary uppercase tracking-wider">
              <th className="py-2.5 px-4 font-medium">Parameter</th>
              <th className="py-2.5 px-3 font-medium text-right">Current Value</th>
              <th className="py-2.5 px-3 font-medium text-right">Resting Baseline</th>
              <th className="py-2.5 px-3 font-medium text-right">Delta (Δ)</th>
              <th className="py-2.5 px-3 font-medium text-right">% Deviation</th>
              <th className="py-2.5 px-3 font-medium text-right">Z-Score (σ)</th>
              <th className="py-2.5 px-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-astro-border-hairline">
            {rows.map((row) => {
              const isPositive = row.absoluteDelta > 0;
              const isZero = row.absoluteDelta === 0;

              return (
                <tr
                  key={row.parameter}
                  className="hover:bg-astro-bg-subtle/50 transition-colors"
                >
                  {/* Parameter Label */}
                  <td className="py-3 px-4 font-sans text-xs text-astro-text-primary flex items-center space-x-2">
                    {iconMap[row.parameter]}
                    <span className="font-medium">{row.label}</span>
                  </td>

                  {/* Current Value */}
                  <td className="py-3 px-3 text-right font-bold text-astro-text-primary">
                    {row.currentValue}{' '}
                    <span className="text-[10px] font-normal text-astro-text-tertiary">
                      {row.unit}
                    </span>
                  </td>

                  {/* Baseline */}
                  <td className="py-3 px-3 text-right text-astro-text-secondary">
                    {row.baselineValue}{' '}
                    <span className="text-[10px] text-astro-text-tertiary">{row.unit}</span>
                  </td>

                  {/* Absolute Delta */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center space-x-0.5 ${
                        isZero
                          ? 'text-astro-text-secondary'
                          : isPositive
                          ? 'text-[#C87D20]'
                          : 'text-[#4A7C9B]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : isZero ? (
                        <Minus className="w-3 h-3 text-astro-text-tertiary" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {row.absoluteDelta}
                      </span>
                    </span>
                  </td>

                  {/* Percentage Delta */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={
                        Math.abs(row.percentageDelta) > 15
                          ? 'text-astro-status-caution font-semibold'
                          : 'text-astro-text-secondary'
                      }
                    >
                      {row.percentageDelta > 0 ? '+' : ''}
                      {row.percentageDelta}%
                    </span>
                  </td>

                  {/* Z-Score */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        Math.abs(row.zScore) >= 3.0
                          ? 'bg-astro-status-critical/10 text-astro-status-critical font-bold'
                          : Math.abs(row.zScore) >= 2.0
                          ? 'bg-astro-status-caution/10 text-astro-status-caution'
                          : 'text-astro-text-secondary'
                      }`}
                    >
                      {row.zScore > 0 ? '+' : ''}
                      {row.zScore}σ
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] rounded-sm border uppercase tracking-wider font-semibold ${
                        riskBadgeStyles[row.riskLevel]
                      }`}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
