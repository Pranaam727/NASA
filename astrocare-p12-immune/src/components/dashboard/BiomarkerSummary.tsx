import React from 'react';
import { immuneService } from '../../services/immune/immuneService';
import { StateBadge } from '../shared/StateBadge';
import { FlaskConical, ArrowRight } from 'lucide-react';

interface BiomarkerSummaryProps {
  astronautId?: string;
  onNavigateToModule?: () => void;
}

export const BiomarkerSummary: React.FC<BiomarkerSummaryProps> = ({
  astronautId = 'AST-042',
  onNavigateToModule,
}) => {
  const latestProfile = immuneService.getLatestImmuneProfile(astronautId);
  const il6 = latestProfile.biomarkers['IL_6']?.value ?? 6.4;
  const crp = latestProfile.biomarkers['CRP_HS']?.value ?? 3.42;
  const cortisol = latestProfile.biomarkers['CORTISOL_SALIVARY']?.value ?? 28.5;

  return (
    <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Biomarkers & Cytokines (P12)
            </h4>
          </div>
          <StateBadge state="WARNING" size="sm" />
        </div>

        <div className="grid grid-cols-3 gap-2 my-3 text-xs">
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">IL-6</span>
            <span className="text-sm font-bold text-rose-400">{il6}</span>
            <span className="text-[9px] text-slate-400 block">pg/mL</span>
          </div>
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">hs-CRP</span>
            <span className="text-sm font-bold text-amber-400">{crp}</span>
            <span className="text-[9px] text-slate-400 block">mg/L</span>
          </div>
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">Cortisol</span>
            <span className="text-sm font-bold text-amber-400">{cortisol}</span>
            <span className="text-[9px] text-slate-400 block">nmol/L</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          Serum IL-6 elevated (+357% vs baseline); acute-phase reactants active without clinical infection.
        </p>
      </div>

      {onNavigateToModule && (
        <button
          onClick={onNavigateToModule}
          className="mt-3 pt-2 border-t border-space-800/80 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center justify-between transition"
        >
          <span>View Cytokine Panel</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
