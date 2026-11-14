import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface MedicalSafetyBannerProps {
  className?: string;
}

export const MedicalSafetyBanner: React.FC<MedicalSafetyBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs ${className}`}
    >
      <div className="flex items-start space-x-2.5">
        <ShieldCheck className="w-4 h-4 text-astro-sage shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-body text-astro-text-secondary leading-relaxed">
          <span className="font-mono text-[10px] font-bold text-astro-text-primary uppercase tracking-wider block">
            Non-Diagnostic Aerospace Decision Support Protocol
          </span>
          <p className="text-[11px]">
            AI summaries and natural language interpretations are non-diagnostic clinical intelligence aids.
            All deterministic risk scores and anomaly detection rules in P06 remain authoritative.
            Qualified flight surgeons maintain primary operational oversight.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm bg-astro-bg-primary border border-astro-border-hairline text-astro-text-secondary flex items-center space-x-1">
          <Info className="w-3 h-3 text-astro-sage" />
          <span>SIMULATED TELEMETRY [isSimulated = true]</span>
        </span>
      </div>
    </div>
  );
};
