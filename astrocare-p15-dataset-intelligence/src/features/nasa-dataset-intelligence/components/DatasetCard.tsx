import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { StatusBadge } from './StatusBadge';
import { ExternalLink, Files, Compass, Layers, CheckSquare, Square, ChevronRight } from 'lucide-react';

interface DatasetCardProps {
  dataset: DatasetRecord;
  isSelectedForComparison?: boolean;
  onToggleComparison?: (studyId: string) => void;
  onSelectDetails?: (studyId: string) => void;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  isSelectedForComparison = false,
  onToggleComparison,
  onSelectDetails
}) => {
  return (
    <div className={`p-5 rounded-xl bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between ${
      isSelectedForComparison 
        ? 'border-cyan-500/60 ring-1 ring-cyan-500/40 bg-slate-900' 
        : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/95'
    }`}>
      <div>
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {dataset.studyId}
            </span>
            <StatusBadge type="population" value={dataset.studyType} />
          </div>
          <StatusBadge type="provenance" value={dataset.provenance} />
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectDetails?.(dataset.studyId)}
          className="text-base font-semibold text-slate-100 hover:text-cyan-400 cursor-pointer transition-colors leading-snug line-clamp-2 mb-2"
        >
          {dataset.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {dataset.description}
        </p>

        {/* Metadata pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-500">Mission:</span>
            <span className="text-slate-300 font-medium truncate" title={dataset.mission || 'General Spaceflight'}>
              {dataset.mission || 'General Spaceflight'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="text-slate-500">Organism:</span>
            <span className="text-slate-300 font-medium truncate" title={dataset.organism}>
              {dataset.organism}
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate col-span-2">
            <Files className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="text-slate-500">Assay / Domain:</span>
            <span className="text-slate-300 truncate">
              {dataset.primaryDomain} • {dataset.assayTypes?.[0] || 'Omics Profiling'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onToggleComparison && (
            <button
              onClick={() => onToggleComparison(dataset.studyId)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                isSelectedForComparison
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
              title="Add or remove study from comparative analytics"
            >
              {isSelectedForComparison ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Selected</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>Compare</span>
                </>
              )}
            </button>
          )}

          <a
            href={dataset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Open original NASA OSDR record"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => onSelectDetails?.(dataset.studyId)}
          className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
        >
          <span>Inspect Study</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
