import React from 'react';
import { MonitoringState, ResultInterpretation } from '../../types';

interface StateBadgeProps {
  state: MonitoringState | ResultInterpretation | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StateBadge: React.FC<StateBadgeProps> = ({ state, size = 'md' }) => {
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  const normalized = state.toUpperCase();

  switch (normalized) {
    case 'NORMAL':
    case 'WITHIN_REFERENCE':
    case 'SUCCESS':
    case 'ARCHIVED':
    case 'ANALYSIS_COMPLETED':
      colorClasses = 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60';
      break;

    case 'MONITOR':
    case 'INFORMATIONAL':
    case 'PENDING':
    case 'PROCESSING':
    case 'IN_TRANSIT':
      colorClasses = 'bg-sky-950/70 text-sky-400 border-sky-800/60';
      break;

    case 'WARNING':
    case 'BELOW_REFERENCE':
    case 'ABOVE_REFERENCE':
    case 'SCHEDULED':
      colorClasses = 'bg-amber-950/70 text-amber-400 border-amber-800/60';
      break;

    case 'CRITICAL':
    case 'FAILED':
    case 'CANCELLED':
      colorClasses = 'bg-rose-950/70 text-rose-400 border-rose-800/60';
      break;

    case 'INSUFFICIENT_DATA':
    case 'NOT_AVAILABLE':
    default:
      colorClasses = 'bg-slate-800/80 text-slate-400 border-slate-700/60';
      break;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center uppercase font-mono rounded border ${colorClasses} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {normalized.replace(/_/g, ' ')}
    </span>
  );
};
