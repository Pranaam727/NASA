import React from 'react';
import { AlertSummary } from '../../types/contracts';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { AlertTriangle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { FOCUS_RING } from '../../design-system/utils';

interface AlertSummaryCardProps {
  alert: AlertSummary;
  onAcknowledge?: (alertId: string) => void;
  onOpenInvestigation?: (invId: string) => void;
}

export const AlertSummaryCard: React.FC<AlertSummaryCardProps> = ({
  alert,
  onAcknowledge,
  onOpenInvestigation
}) => {
  const isCritical = alert.severity === 'critical';

  return (
    <div
      className={`rounded-xl p-4 border transition-all ${
        isCritical
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40 text-rose-950 dark:text-rose-100 glow-rose'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/40 text-amber-950 dark:text-amber-100 glow-amber'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          <h4 className="font-bold text-xs sm:text-sm font-sans">
            {alert.title}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
          {alert.timestamp}
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {alert.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {alert.astronautName}
          </span>
          <span className="text-slate-400">•</span>
          <DataProvenanceBadge type={alert.provenance.type} />
        </div>

        <div className="flex items-center gap-2">
          {alert.investigationId && onOpenInvestigation && (
            <button
              onClick={() => onOpenInvestigation(alert.investigationId!)}
              className={`flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer ${FOCUS_RING}`}
            >
              <span>{alert.investigationId}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {!alert.acknowledged && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors shadow-sm"
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
