import React from 'react';
import { ResearchSource } from '../../types/contracts';
import { ScientificSourceBadge } from '../common/ScientificSourceBadge';
import { Database, ShieldCheck, ExternalLink, BookCheck, Lock } from 'lucide-react';

interface ResearchCitationPanelProps {
  sources: ResearchSource[];
  onSelectSource: (source: ResearchSource) => void;
  title?: string;
  className?: string;
}

export const ResearchCitationPanel: React.FC<ResearchCitationPanelProps> = ({
  sources,
  onSelectSource,
  title = 'Verified NASA Scientific Sources & Research Provenance',
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <BookCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
            {title}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero Fabrication Standard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((src) => {
          const isRestricted = src.dataAccessClassification === 'controlled-access-restricted';

          return (
            <div
              key={src.id}
              onClick={() => onSelectSource(src)}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/30">
                  {src.studyIdentifier || src.publishingOrganization}
                </span>

                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  {isRestricted ? (
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Lock className="w-2.5 h-2.5" /> Controlled Access
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-medium">Open Science</span>
                  )}
                </div>
              </div>

              <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 leading-snug line-clamp-2">
                {src.title}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {src.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-850 text-[10px] font-mono text-slate-400">
                <span>{src.publishingOrganization}</span>
                <span className="flex items-center gap-0.5 text-cyan-500 group-hover:underline">
                  Inspect Metadata <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
