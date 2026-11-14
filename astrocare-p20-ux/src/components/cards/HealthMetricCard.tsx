import React from 'react';
import { HealthMetric } from '../../types/contracts';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CARD_SURFACE, FOCUS_RING } from '../../design-system/utils';

interface HealthMetricCardProps {
  metric: HealthMetric;
  onClick?: (metric: HealthMetric) => void;
  className?: string;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  metric,
  onClick,
  className = ''
}) => {
  const isOutOfRange = metric.currentValue < metric.nominalRange[0] || metric.currentValue > metric.nominalRange[1];

  const getStatusBadge = () => {
    switch (metric.status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500">
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            ELEVATED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            NOMINAL
          </span>
        );
    }
  };

  const getTrendIcon = () => {
    if (metric.trend === 'increasing') {
      return <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />;
    }
    if (metric.trend === 'decreasing') {
      return <TrendingDown className="w-3.5 h-3.5 text-amber-500" />;
    }
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Calculate percentage along nominal range for visualization
  const rangeSpan = metric.nominalRange[1] - metric.nominalRange[0];
  const offset = metric.currentValue - metric.nominalRange[0];
  const progressPercent = Math.min(100, Math.max(0, (offset / (rangeSpan || 1)) * 100));

  return (
    <div
      onClick={() => onClick && onClick(metric)}
      className={`rounded-2xl p-5 transition-all ${CARD_SURFACE} ${onClick ? 'cursor-pointer hover:border-cyan-500/50' : ''} ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            {metric.domain}
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {metric.name}
          </h3>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Main Metric Value & Baseline Delta */}
      <div className="flex items-baseline justify-between my-2 font-mono">
        <div>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-cyan-300">
            {metric.currentValue}
          </span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1.5">
            {metric.unit}
          </span>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-xs">
            {getTrendIcon()}
            <span className={`font-semibold ${metric.trendDeltaPercent < 0 ? 'text-amber-500' : 'text-cyan-500'}`}>
              {metric.trendDeltaPercent > 0 ? `+${metric.trendDeltaPercent}%` : `${metric.trendDeltaPercent}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">vs 1-G baseline ({metric.baselineValue})</span>
        </div>
      </div>

      {/* Nominal Range Bar Indicator */}
      <div className="my-3 space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Min: {metric.nominalRange[0]}</span>
          <span className={isOutOfRange ? 'text-amber-400 font-bold' : ''}>
            Nominal Envelope [{metric.nominalRange[0]} - {metric.nominalRange[1]}]
          </span>
          <span>Max: {metric.nominalRange[1]}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all ${
              isOutOfRange ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Provenance */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-400">
        <DataProvenanceBadge type={metric.provenance.type} />
        <span>{metric.lastUpdated}</span>
      </div>
    </div>
  );
};
