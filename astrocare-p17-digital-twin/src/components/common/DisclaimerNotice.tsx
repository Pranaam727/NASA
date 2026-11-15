import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface DisclaimerNoticeProps {
  compact?: boolean;
  className?: string;
  context?: string;
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({
  compact = false,
  className = '',
  context,
}) => {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-slate-300">Synthetic Demonstration Data:</strong>{' '}
          Analytical research module. No real astronaut PHI is displayed. Not clinically validated for medical diagnosis.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900/80 border border-cyan-500/20 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3 ${className}`}
    >
      <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] text-cyan-400">
          Aerospace Biomedical Intelligence Integrity Disclaimer
        </p>
        <p className="leading-relaxed text-slate-400">
          This system is an independent digital twin demonstration platform developed for research and educational exploratory analysis. All astronaut profiles, physiological time series, and sensor readings are synthetically modeled. Statistical projections and anomaly alerts represent configurable mathematical rules and must not be interpreted as certified NASA clinical diagnoses or emergency medical protocols.
          {context && ` ${context}`}
        </p>
      </div>
    </div>
  );
};
