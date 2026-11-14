import React from 'react';
import { CheckCircle2, HelpCircle, ShieldAlert } from 'lucide-react';

interface ObservationsVsHypothesesPanelProps {
  observations: string[];
  hypotheses: string[];
  unusualChanges?: string[];
}

export const ObservationsVsHypothesesPanel: React.FC<ObservationsVsHypothesesPanelProps> = ({
  observations,
  hypotheses,
  unusualChanges = []
}) => {
  return (
    <div className="space-y-4">
      {/* Notice on Strict Demarcation */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-slate-200">NASA Clinical Safety Standard:</strong> Factual measurements (observations) are strictly segregated from speculative pathophysiological mechanisms (hypotheses).
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Observations Column (Facts) */}
        <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 glow-emerald">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-emerald-300">
                Factual Telemetry Observations
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              EMPIRICAL DATA
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            {observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="font-mono text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hypotheses Column (Clinical/Etiological) */}
        <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 glow-cyan">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-cyan-300">
                Physiological Hypotheses
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              CLINICAL THEORY
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            {hypotheses.map((hyp, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5">?</span>
                <span className="leading-relaxed">{hyp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Unusual Changes Banner if present */}
      {unusualChanges.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200">
          <span className="font-semibold text-amber-300 block mb-1">
            Detected Telemetry Trends & Anomalous Deviations:
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            {unusualChanges.map((change, idx) => (
              <li key={idx}>{change}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
