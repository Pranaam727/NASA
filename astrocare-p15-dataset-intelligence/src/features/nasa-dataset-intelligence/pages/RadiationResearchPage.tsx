import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { SunMedium, ShieldAlert, Atom, Activity } from 'lucide-react';

interface RadiationResearchPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const RadiationResearchPage: React.FC<RadiationResearchPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const radiationStudies = datasets.filter(d => 
    d.primaryDomain.includes('Radiation') ||
    d.title.toLowerCase().includes('radiation') ||
    d.title.toLowerCase().includes('hze') ||
    d.title.toLowerCase().includes('gamma') ||
    d.description.toLowerCase().includes('nsrl')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Deep Space Environmental Hazards
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Space Radiation Biology Research
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            High-LET galactic cosmic ray (GCR) simulation, heavy iron ions (Fe-56), gamma irradiation baselines, and DNA double-strand break repair kinetics from the NASA Space Radiation Laboratory (NSRL).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <SunMedium className="w-4 h-4" />
          <span>{radiationStudies.length} Studies Indexed</span>
        </div>
      </div>

      {/* Radiation Hazard Metrics Overview */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">High-LET HZE Ions</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Dense ionization tracks (e.g. Fe-56 1000 MeV/n in OSD-2) produce clustered, complex DNA damage refractory to standard repair enzymes.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Low-LET Reference</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Comparative gamma radiation controls establish biological relative biological effectiveness (RBE) ratios for risk prediction.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Epithelial Vulnerability</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Normal human bronchial epithelial models (OSD-73) reveal distinct persistent transcriptome reprogramming post-heavy ion beam exposure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {radiationStudies.map(dataset => (
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
