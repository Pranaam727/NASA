import React from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { RiskDetailLayout } from '../components/RiskDetailLayout';
import { HeartPulse, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CardiovascularRiskPageProps {
  onNavigate: (route: string) => void;
}

export const CardiovascularRiskPage: React.FC<CardiovascularRiskPageProps> = ({ onNavigate }) => {
  const category = NasaResearchService.getRiskCategoryById('CARDIO')!;
  const evidence = NasaResearchService.getEvidenceForCategory('CARDIO');
  const mitigations = NasaResearchService.getMitigationsForCategory('CARDIO');

  const deepDiveSection = (
    <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <HeartPulse className="w-5 h-5 text-rose-400" />
        <h3 className="text-sm font-semibold text-slate-100">
          Cardiovascular Deconditioning Cascade & Hemodynamic Phenotypes
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-rose-300">Acute Phase (Days 0–14)</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Cephalad shift of 1.5–2.0 L of blood and interstitial fluid. Central venous pressure rises briefly, initiating Gauer-Henry reflex diuresis. Circulating plasma volume contracts by 10–15% within 48 hours.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Biomarker: Elevated ANP, suppressed Aldosterone
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-amber-300">Chronic Phase (Months 1–6+)</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Left ventricular mass drops by ~8–10% due to reduced hemodynamic work demands. Internal jugular vein flow develops stasis or retrograde patterns in 55% of crew. Subclinical endothelial stiffening.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Observation: IJV cross-sectional area expansion
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-cyan-300">Re-Entry & Post-Flight (R+0 to R+30)</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Gravitational pooling in lower extremities during deceleration and landing. Blunted arterial baroreflex sensitivity results in acute postural hypotension and presyncope in over 60% of crew without countermeasure suits.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Operational Protocol: Fluid load + Anti-G Suit
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <RiskDetailLayout
      category={category}
      evidence={evidence}
      mitigations={mitigations}
      onNavigateBack={() => onNavigate('/risks/categories')}
      onNavigateOtherCategory={onNavigate}
      additionalSections={deepDiveSection}
    />
  );
};
