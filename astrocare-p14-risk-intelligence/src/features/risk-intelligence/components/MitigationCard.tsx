import React from 'react';
import { 
  CheckCircle, 
  FlaskConical, 
  Lightbulb, 
  AlertCircle, 
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';
import { MitigationStrategy, MitigationReadiness } from '../types/mitigation.types';

interface MitigationCardProps {
  mitigation: MitigationStrategy;
  onSelectEvidence?: (evidenceId: string) => void;
}

export const MitigationCard: React.FC<MitigationCardProps> = ({ mitigation, onSelectEvidence }) => {
  const getReadinessBadge = (readiness: MitigationReadiness) => {
    switch (readiness) {
      case 'OPERATIONAL':
        return {
          label: 'Flight Operational Standard',
          badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/70',
          icon: CheckCircle
        };
      case 'VALIDATED_ANALOG':
        return {
          label: 'Ground / Bed-Rest Validated',
          badgeClass: 'bg-cyan-950/70 text-cyan-300 border-cyan-700/70',
          icon: FlaskConical
        };
      case 'ADVANCED_RESEARCH':
        return {
          label: 'Advanced Laboratory Research',
          badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-700/70',
          icon: Lightbulb
        };
      default:
        return {
          label: 'Exploration Architecture Concept',
          badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: Layers
        };
    }
  };

  const badge = getReadinessBadge(mitigation.readiness);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-space-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm">
      <div>
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${badge.badgeClass}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            {badge.label}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {mitigation.code}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
          {mitigation.title}
        </h3>

        {/* Target Risks */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[10px] uppercase font-semibold text-slate-400 mr-1">Target Domains:</span>
          {mitigation.targetRiskIds.map((rId, idx) => (
            <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-space-800 text-cyan-300 border border-slate-700/70 font-semibold">
              {rId}
            </span>
          ))}
        </div>

        {/* Scientific Rationale */}
        <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800/80 mb-3 text-xs">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
            Scientific Rationale
          </div>
          <p className="text-slate-200 leading-relaxed">
            {mitigation.scientificRationale}
          </p>
        </div>

        {/* Protocol Description */}
        <div className="mb-3 text-xs text-slate-300">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
            Operational Protocol
          </div>
          <p className="leading-relaxed text-slate-300 line-clamp-3">
            {mitigation.protocolDescription}
          </p>
        </div>

        {/* Hardware / Flight Systems Used */}
        {mitigation.hardwareOrTechnology && mitigation.hardwareOrTechnology.length > 0 && (
          <div className="mb-3 flex items-start gap-1.5 text-xs text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {mitigation.hardwareOrTechnology.map((hw, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-space-800/80 text-[11px] text-slate-300 border border-slate-700/60">
                  {hw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mandatory Residual Risk Note */}
        <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/30 text-xs text-rose-200/90 mb-3 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-rose-300">Residual Risk:</strong> {mitigation.residualRiskNote}
          </div>
        </div>

        {/* Mission Applicability Matrix */}
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-space-950/60 border border-slate-800 text-[10px] text-slate-400 mb-3">
          <div>
            <span className="font-semibold text-slate-300 block">LEO (ISS)</span>
            <span className="text-slate-400 line-clamp-1">{mitigation.missionApplicability.leo}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-300 block">Lunar Gateway</span>
            <span className="text-slate-400 line-clamp-1">{mitigation.missionApplicability.lunar}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-300 block">Mars Transit</span>
            <span className="text-slate-400 line-clamp-1">{mitigation.missionApplicability.mars}</span>
          </div>
        </div>
      </div>

      {/* Footer References */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
          Ref: {mitigation.references[0]?.source || 'NASA HRP Standard'}
        </div>
        {mitigation.references[0]?.url && (
          <a
            href={mitigation.references[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            Verification Source <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
