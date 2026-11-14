import React from 'react';
import { MonitoringState } from '../../types';
import { StateBadge } from './StateBadge';
import { DataOriginBadge } from './DataOriginBadge';
import { ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  category?: string;
  value: number | string;
  unit: string;
  baselineValue?: number | null;
  percentChange?: number | null;
  referenceLow?: number;
  referenceHigh?: number;
  referenceSource?: string;
  timestamp?: string;
  monitoringState?: MonitoringState;
  provenance?: string;
  dataOrigin?: string;
  notes?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  category,
  value,
  unit,
  baselineValue,
  percentChange,
  referenceLow,
  referenceHigh,
  referenceSource,
  timestamp,
  monitoringState = 'NORMAL',
  provenance,
  dataOrigin = 'SIMULATED',
  notes,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-space-900 border border-space-800 rounded-xl p-4 transition-all duration-200 hover:border-space-700 shadow-lg flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:bg-space-850' : ''
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            {category && (
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono block">
                {category}
              </span>
            )}
            <h4 className="text-sm font-semibold text-slate-100 leading-snug">{title}</h4>
          </div>
          <StateBadge state={monitoringState} size="sm" />
        </div>

        {/* Main Numerical Value */}
        <div className="flex items-baseline gap-2 my-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          <span className="text-xs font-mono text-cyan-400 font-medium">{unit}</span>
        </div>

        {/* Baseline Comparison */}
        {baselineValue !== undefined && baselineValue !== null && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 py-1 border-t border-space-800/60 my-2">
            <span className="text-slate-400">Baseline (L-180):</span>
            <span className="font-semibold text-slate-200">
              {baselineValue} {unit}
            </span>

            {percentChange !== null && percentChange !== undefined && (
              <span
                className={`inline-flex items-center text-[11px] font-semibold ml-auto px-1.5 py-0.5 rounded ${
                  percentChange > 0
                    ? 'text-amber-300 bg-amber-950/50'
                    : percentChange < 0
                    ? 'text-sky-300 bg-sky-950/50'
                    : 'text-slate-400 bg-slate-800'
                }`}
              >
                {percentChange > 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : percentChange < 0 ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}
              </span>
            )}
          </div>
        )}

        {/* Reference Range Notice */}
        {referenceLow !== undefined && referenceHigh !== undefined && (
          <div className="text-[11px] text-slate-400 flex items-center justify-between gap-1 mt-1">
            <span>Ref: {referenceLow} – {referenceHigh} {unit}</span>
            {referenceSource && (
              <span
                title={`Reference source: ${referenceSource}. Results outside interval do not automatically establish pathology.`}
                className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-0.5 cursor-help"
              >
                <Info className="w-3 h-3" />
                Source
              </span>
            )}
          </div>
        )}

        {notes && (
          <p className="text-[11px] text-slate-400 mt-2 bg-space-950/60 p-2 rounded border border-space-800 italic">
            {notes}
          </p>
        )}
      </div>

      {/* Footer Provenance */}
      <div className="mt-3 pt-2.5 border-t border-space-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <DataOriginBadge origin={dataOrigin} />
        {timestamp && <span>{timestamp.split('T')[0]}</span>}
      </div>
      {provenance && (
        <div className="text-[9px] text-slate-400 mt-1 truncate" title={provenance}>
          Src: {provenance}
        </div>
      )}
    </div>
  );
};
