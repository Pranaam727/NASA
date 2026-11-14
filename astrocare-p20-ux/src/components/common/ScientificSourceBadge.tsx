import React from 'react';
import { ResearchSource } from '../../types/contracts';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface ScientificSourceBadgeProps {
  source: ResearchSource;
  onClick?: (source: ResearchSource) => void;
  className?: string;
}

export const ScientificSourceBadge: React.FC<ScientificSourceBadgeProps> = ({
  source,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={() => onClick && onClick(source)}
      className={`group inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border text-left transition-all cursor-pointer bg-blue-950/40 dark:bg-blue-950/60 hover:bg-blue-900/50 border-blue-500/30 hover:border-blue-500/60 text-blue-300 dark:text-blue-200 ${className}`}
      title={`Click to inspect verified NASA source: ${source.title}`}
    >
      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
      <span className="font-semibold text-white group-hover:text-cyan-300">
        {source.studyIdentifier || source.publishingOrganization}
      </span>
      <span className="text-slate-400 text-[10px]">
        ({source.dataAccessClassification.replace(/-/g, ' ')})
      </span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0 ml-0.5" />
    </button>
  );
};
