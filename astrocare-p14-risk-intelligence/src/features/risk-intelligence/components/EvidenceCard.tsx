import React from 'react';
import { 
  UserCheck, 
  FlaskConical, 
  Binary, 
  FileText, 
  ExternalLink, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { ResearchEvidence, StudyClassification } from '../types/evidence.types';

interface EvidenceCardProps {
  evidence: ResearchEvidence;
  onOpenDetails: (evidence: ResearchEvidence) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, onOpenDetails }) => {
  const getBadgeDetails = (type: StudyClassification, isHuman: boolean) => {
    switch (type) {
      case 'astronaut_human':
        return {
          label: 'Direct Astronaut Study',
          badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60',
          icon: UserCheck
        };
      case 'ground_analog':
        return {
          label: 'Ground-Based Analog (Bed Rest/HERA)',
          badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60',
          icon: FlaskConical
        };
      case 'animal_model':
        return {
          label: 'Animal In-Vivo Model (Non-Human)',
          badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-700/60',
          icon: FlaskConical
        };
      case 'cell_culture':
        return {
          label: 'In-Vitro Cell Culture Model',
          badgeClass: 'bg-violet-950/60 text-violet-300 border-violet-700/60',
          icon: FlaskConical
        };
      case 'computational_model':
        return {
          label: 'Computational / In-Silico Transport',
          badgeClass: 'bg-blue-950/60 text-blue-300 border-blue-700/60',
          icon: Binary
        };
      default:
        return {
          label: 'NASA Technical / Review Report',
          badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: FileText
        };
    }
  };

  const badge = getBadgeDetails(evidence.studyType, evidence.isDirectHumanEvidence);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-space-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm">
      <div>
        {/* Top Classification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${badge.badgeClass}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
            {evidence.isDirectHumanEvidence && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/40 font-semibold">
                HUMAN ASTRONAUT DATA
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {evidence.publicationDate}
          </span>
        </div>

        {/* Title & Organization */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
          {evidence.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="font-medium text-slate-300">{evidence.sourceOrganization}</span>
          <span>•</span>
          <span className="font-mono text-slate-400">{evidence.evidenceCode}</span>
          {evidence.missionContext && (
            <>
              <span>•</span>
              <span className="text-slate-400 truncate max-w-xs">{evidence.missionContext}</span>
            </>
          )}
        </div>

        {/* Findings Box */}
        <div className="bg-space-950/80 p-3 rounded-lg border border-slate-800/80 mb-3 text-xs">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Key Scientific Findings
          </div>
          <p className="text-slate-200 line-clamp-3 leading-relaxed">
            {evidence.findings}
          </p>
        </div>

        {/* Non-Human Translation Notice if applicable */}
        {!evidence.isDirectHumanEvidence && (
          <div className="flex items-start gap-1.5 p-2 rounded-md bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-300/90 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Scientific Caveat:</strong> Ground analog, animal, or cell model. Does not constitute direct proof of human deep-space outcomes.
            </span>
          </div>
        )}

        {/* Population & Sample Size Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-800/70 text-slate-400">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Population / Model</span>
            <span className="text-slate-200 truncate block">{evidence.population}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sample Size</span>
            <span className="text-slate-200 font-mono truncate block">{evidence.sampleSize}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          {evidence.doi && (
            <a 
              href={`https://doi.org/${evidence.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              DOI <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {evidence.ntrsId && (
            <a 
              href={`https://ntrs.nasa.gov/citations/${evidence.ntrsId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              NTRS <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          onClick={() => onOpenDetails(evidence)}
          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 font-medium transition-colors"
        >
          View Full Methodology & Limitations
        </button>
      </div>
    </div>
  );
};
