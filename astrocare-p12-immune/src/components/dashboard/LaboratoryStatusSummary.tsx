import React from 'react';
import { laboratoryService } from '../../services/laboratory/laboratoryService';
import { StateBadge } from '../shared/StateBadge';
import { Layers, ArrowRight } from 'lucide-react';

interface LaboratoryStatusSummaryProps {
  astronautId?: string;
  onNavigateToModule?: () => void;
}

export const LaboratoryStatusSummary: React.FC<LaboratoryStatusSummaryProps> = ({
  astronautId = 'AST-042',
  onNavigateToModule,
}) => {
  const samples = laboratoryService.getSamples({ astronautId });
  const pendingCount = samples.filter(
    (s) => s.workflowStatus === 'PROCESSING' || s.workflowStatus === 'IN_TRANSIT'
  ).length;
  const completedCount = samples.filter(
    (s) => s.workflowStatus === 'ANALYSIS_COMPLETED' || s.workflowStatus === 'ARCHIVED'
  ).length;

  return (
    <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Biospecimen Telemetry (P12)
            </h4>
          </div>
          <StateBadge state="NORMAL" size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 text-xs">
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">Analyzed & Archived</span>
            <span className="text-sm font-bold text-emerald-400">{completedCount}</span>
            <span className="text-[9px] text-slate-400 block">Samples</span>
          </div>
          <div className="bg-space-950 p-2 rounded border border-space-800">
            <span className="text-[9px] text-slate-500 uppercase block">In Processing / Transit</span>
            <span className="text-sm font-bold text-sky-400">{pendingCount}</span>
            <span className="text-[9px] text-slate-400 block">Specimens</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          MELFI-3 cryogenic freezer operational at -80°C. Cold bag transfer for CRS-32 Return scheduled.
        </p>
      </div>

      {onNavigateToModule && (
        <button
          onClick={onNavigateToModule}
          className="mt-3 pt-2 border-t border-space-800/80 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center justify-between transition"
        >
          <span>Laboratory Pipeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
