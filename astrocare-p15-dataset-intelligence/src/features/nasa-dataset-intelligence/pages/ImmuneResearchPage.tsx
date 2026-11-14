import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { ShieldAlert, Activity, CheckCircle, Info } from 'lucide-react';

interface ImmuneResearchPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const ImmuneResearchPage: React.FC<ImmuneResearchPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const immuneStudies = datasets.filter(d => 
    d.primaryDomain.includes('Immune') ||
    d.title.toLowerCase().includes('immune') ||
    d.title.toLowerCase().includes('cytokine') ||
    d.title.toLowerCase().includes('thymus') ||
    d.title.toLowerCase().includes('lps')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              NASA OSDR Domain Exploration
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Immune System Research Datasets
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Investigation of spaceflight immune dysregulation, T-cell suppression, cytokine storms, thymic involution, and blunted endotoxin (LPS) host response during orbital missions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <ShieldAlert className="w-4 h-4" />
          <span>{immuneStudies.length} Studies Indexed</span>
        </div>
      </div>

      {/* Domain Scientific Context Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Thymic Involution</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Murine models (e.g. OSD-4) reveal rapid thymic atrophy and diminished T-cell progenitor maturation during short-duration Space Shuttle flights.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Cytokine Cascades</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Inspiration4 (OSD-575) multi-plex arrays identify acute inflight surges in pro-inflammatory IL-6 and TNF-α upon orbit insertion.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">In Vitro Blunting</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Simulated microgravity challenges (OSD-54) demonstrate suppressed TLR-4 pathway activation following LPS endotoxin exposure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {immuneStudies.map(dataset => (
          <DatasetCard
            key={dataset.studyId}
            dataset={dataset}
            isSelectedForComparison={selectedComparisonIds.includes(dataset.studyId)}
            onToggleComparison={onToggleCompare}
            onSelectDetails={onSelectStudy}
          />
        ))}
      </div>
    </div>
  );
};
