import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900/90 border-b border-amber-500/30 text-amber-200/90 text-xs px-4 py-2 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="font-medium tracking-wide">
            <span className="font-semibold text-amber-300">AEROSPACE BIOMEDICAL DECISION SUPPORT SYSTEM:</span>{' '}
            AI outputs are informational and research aids only, not a clinical diagnostic device.
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-amber-400 hover:text-amber-200 underline font-mono cursor-pointer shrink-0 ml-2"
        >
          {expanded ? 'Hide Safety Notice' : 'View Safety Protocols'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 font-sans">
          <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-slate-200 text-xs">Human-in-the-Loop Validation</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All AI-generated interpretations, hypotheses, and countermeasure adjustments must be evaluated and approved by a certified NASA/ESA Flight Surgeon or Biomedical Engineer (BME).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-slate-200 text-xs">Grounding & Missing Data Rule</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The AI engine is strictly configured never to fabricate missing telemetry. Missing sensor channels are explicitly labeled as unmeasured or noisy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-slate-200 text-xs">Observation vs Hypothesis Separation</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Factual sensor readings are strictly segregated from speculative pathophysiological mechanisms to prevent premature clinical assumptions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
