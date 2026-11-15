import React from 'react';
import { Card } from './Card';
import { UnitTag } from './UnitTag';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string | null;
  unit?: string;
  baseline?: number | string;
  changePercent?: number;
  subtext?: string;
  systemColor?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  baseline,
  changePercent,
  subtext,
  systemColor = 'text-cyan-400',
  icon,
}) => {
  const isUnavailable = value === null || value === undefined;

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className={`${systemColor} opacity-80`}>{icon}</span>}
      </div>

      <div className="my-2 flex items-baseline gap-2">
        {isUnavailable ? (
          <span className="text-lg font-mono text-slate-500 italic">Unavailable</span>
        ) : (
          <>
            <span className="text-2xl font-bold font-mono text-slate-100">{value}</span>
            {unit && <UnitTag unit={unit} />}
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        {baseline !== undefined && (
          <span>
            Baseline: <strong className="text-slate-300 font-mono">{baseline}</strong>
          </span>
        )}

        {changePercent !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 font-mono ${
              changePercent > 0
                ? 'text-amber-400'
                : changePercent < 0
                ? 'text-cyan-400'
                : 'text-slate-400'
            }`}
          >
            {changePercent > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : changePercent < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
          </span>
        )}

        {subtext && <span className="truncate">{subtext}</span>}
      </div>
    </Card>
  );
};
