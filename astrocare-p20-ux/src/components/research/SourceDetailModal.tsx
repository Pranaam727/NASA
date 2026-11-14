import React from 'react';
import { ResearchSource } from '../../types/contracts';
import { ExternalLink, X, ShieldCheck, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { FOCUS_RING } from '../../design-system/utils';

interface SourceDetailModalProps {
  source: ResearchSource | null;
  onClose: () => void;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose
}) => {
  if (!source) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30">
                {source.studyIdentifier || source.publishingOrganization}
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified NASA Ground Truth
              </span>
            </div>
            <h3 id="source-detail-title" className="text-base font-bold font-sans text-slate-900 dark:text-white leading-snug">
              {source.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className={`text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer ${FOCUS_RING}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Publishing Entity</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{source.publishingOrganization}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Research Category</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{source.researchCategory}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Data Access Tier</span>
            <span className="font-semibold capitalize text-cyan-600 dark:text-cyan-400">
              {source.dataAccessClassification.replace(/-/g, ' ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Publication Date</span>
            <span className="text-slate-600 dark:text-slate-300">{source.publicationDate || 'Continuous Update'}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Verification Date</span>
            <span className="text-slate-600 dark:text-slate-300">{source.accessDate}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Source Type</span>
            <span className="text-slate-600 dark:text-slate-300 uppercase">{source.sourceType.replace(/-/g, ' ')}</span>
          </div>
        </div>

        {/* Description & Scientific Scope */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Information Supported & Operational Scope
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {source.description}
          </p>
        </div>

        {/* Supported Domains */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Supported Physiological Disciplines:</span>
          <div className="flex flex-wrap gap-1.5">
            {source.supportedDomains.map(d => (
              <span key={d} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Footer & Direct Official Link */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 italic">
            * AstroCare is an independent platform referencing official NASA public resources.
          </span>

          <div className="flex items-center gap-2">
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-medium cursor-pointer shadow transition-colors"
            >
              <span>Visit Official NASA Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
