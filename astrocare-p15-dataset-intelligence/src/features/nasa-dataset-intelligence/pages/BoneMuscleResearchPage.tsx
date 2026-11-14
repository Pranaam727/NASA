import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { Bone, Activity, Layers } from 'lucide-react';

interface BoneMuscleResearchPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const BoneMuscleResearchPage: React.FC<BoneMuscleResearchPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const boneStudies = datasets.filter(d => 
    d.primaryDomain.includes('Bone') ||
    d.title.toLowerCase().includes('bone') ||
    d.title.toLowerCase().includes('muscle') ||
    d.title.toLowerCase().includes('hls') ||
    d.title.toLowerCase().includes('spine')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Musculoskeletal Unloading & Countermeasures
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Bone and Muscle Research Datasets
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Quantification of osteoclast-mediated trabecular bone mineral loss, muscle atrophy in postural soleus fibers, and pharmacological mitigations (e.g. GSK3 inhibition).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Bone className="w-4 h-4" />
          <span>{boneStudies.length} Studies Indexed</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Volumetric Bone Loss</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Hindlimb suspension (OSD-661) and Bion-M1 (OSD-471) models demonstrate preferential loss of weight-bearing lumbar spine and femoral cancellous bone.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">GSK3 Targeted Mitigation</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Pharmacological inhibition of glycogen synthase kinase-3 preserves osteoblast Wnt/β-catenin signaling and counteracts disuse osteopenia.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Vertebral Structural Fragility</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Spaceflown rodent biomechanical testing indicates altered failure modes and significantly decreased ultimate bending strength in spinal segments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boneStudies.map(dataset => (
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
