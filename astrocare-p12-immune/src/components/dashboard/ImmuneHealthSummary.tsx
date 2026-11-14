import React from 'react';
import { immuneService } from '../../services/immune/immuneService';
import { StateBadge } from '../shared/StateBadge';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface ImmuneHealthSummaryProps {
  astronautId?: string;
  onNavigateToModule?: () => void;
}

export const ImmuneHealthSummary: React.FC<ImmuneHealthSummaryProps> = ({
  astronautId = 'AST-042',
  onNavigateToModule,
}) => {
  const latestProfile = immuneService.getLatestImmuneProfile(astronautId);
  const wbc = latestProfile.cells['WBC_TOTAL']?.absoluteCount ?? 9.4;
  const ratio = latestProfile.cells['CD4_CD8_RATIO']?.absoluteCount ?? 1.22;
  const nkFunction = latestProfile.cells['NK_CYTOTOXICITY_LYSIS']?.absoluteCount ?? 15.4;

  return (
    <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Immune System Status (P12)
            </h4>
          </div>
          <StateBadge state="MONITOR" size="sm" />
        </div>

        <div className="grid grid-cols-3 gap-2 my-3 text-xs">
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">WBC Count</span>
            <span className="text-sm font-bold text-white">{wbc}</span>
            <span className="text-[9px] text-slate-400 block">x10^9 / L</span>
          </div>
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">CD4/CD8</span>
            <span className="text-sm font-bold text-cyan-400">{ratio}</span>
            <span className="text-[9px] text-slate-400 block">Ratio</span>
          </div>
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">NK Lysis</span>
            <span className="text-sm font-bold text-amber-400">{nkFunction}%</span>
            <span className="text-[9px] text-amber-500 block">Depressed</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          Mild granulocytic expansion with qualitative suppression of innate cytotoxic responses.
        </p>
      </div>

      {onNavigateToModule && (
        <button
          onClick={onNavigateToModule}
          className="mt-3 pt-2 border-t border-space-800/80 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center justify-between transition"
        >
          <span>Open Full Immune Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
