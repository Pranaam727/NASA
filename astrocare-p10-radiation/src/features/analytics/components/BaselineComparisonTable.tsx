import React from 'react';
import { ParameterDeviation } from '../types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface BaselineComparisonTableProps {
  deviations: Record<string, ParameterDeviation>;
  astronautCallsign: string;
}

export const BaselineComparisonTable: React.FC<BaselineComparisonTableProps> = ({
  deviations,
  astronautCallsign,
}) => {
  const statusMap = {
    NORMAL: 'NOMINAL' as const,
    CAUTION: 'CAUTION' as const,
    WARNING: 'CAUTION' as const,
    CRITICAL: 'CRITICAL' as const,
  };

  return (
    <DossierCard
      title="PERSONAL BASELINE TELEMETRY DELTA MATRIX"
      subtitle={`SUBJECT: ${astronautCallsign} // INDIVIDUAL RESTING BIOMETRIC VARIATION`}
      badge={<span className="font-mono text-[10px] text-astro-text-secondary">Z-SCORE NORMALIZED</span>}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-astro-border-hairline text-[10px] text-astro-text-tertiary uppercase">
              <th className="py-2 px-3 font-semibold">Parameter</th>
              <th className="py-2 px-3 font-semibold text-right">Resting Baseline</th>
              <th className="py-2 px-3 font-semibold text-right">Current Value</th>
              <th className="py-2 px-3 font-semibold text-right">Delta (Δ)</th>
              <th className="py-2 px-3 font-semibold text-right">% Shift</th>
              <th className="py-2 px-3 font-semibold text-right">Z-Score</th>
              <th className="py-2 px-3 font-semibold text-center">Risk Tier</th>
              <th className="py-2 px-3 font-semibold">Clinical Interpretation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-astro-border-hairline/60">
            {Object.values(deviations).map((d) => {
              const statusBadge = statusMap[d.riskLevel];
              const isPositive = d.delta > 0;
              const isNegative = d.delta < 0;

              return (
                <tr key={d.parameter} className="hover:bg-astro-bg-subtle/30 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-astro-text-primary">
                    {d.label}
                    <span className="text-[10px] text-astro-text-tertiary ml-1 font-normal">
                      ({d.unit})
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right text-astro-text-secondary">
                    {d.baselineValue} {d.unit}
                  </td>

                  <td className="py-2.5 px-3 text-right font-bold text-astro-text-primary">
                    {d.currentValue} {d.unit}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center space-x-0.5 font-bold ${
                        isPositive
                          ? 'text-[#B9473E]'
                          : isNegative
                          ? 'text-[#4878D1]'
                          : 'text-astro-text-tertiary'
                      }`}
                    >
                      {isPositive && <ArrowUp className="w-3 h-3" />}
                      {isNegative && <ArrowDown className="w-3 h-3" />}
                      {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                      <span>
                        {isPositive ? `+${d.delta}` : `${d.delta}`} {d.unit}
                      </span>
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right text-astro-text-secondary">
                    {d.percentDelta > 0 ? `+${d.percentDelta}%` : `${d.percentDelta}%`}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${
                        Math.abs(d.zScore) >= 3.0
                          ? 'bg-astro-status-critical/10 text-astro-status-critical'
                          : Math.abs(d.zScore) >= 2.0
                          ? 'bg-astro-status-caution/10 text-astro-status-caution'
                          : 'text-astro-text-secondary'
                      }`}
                    >
                      {d.zScore > 0 ? `+${d.zScore}σ` : `${d.zScore}σ`}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <StatusIndicator status={statusBadge} label={d.riskLevel} size="sm" />
                  </td>

                  <td className="py-2.5 px-3 font-body text-[11px] text-astro-text-secondary max-w-xs">
                    {d.clinicalSignificance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DossierCard>
  );
};
