import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { HeartPulse, Activity, Droplets } from 'lucide-react';

interface CardiovascularResearchPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const CardiovascularResearchPage: React.FC<CardiovascularResearchPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const cardioStudies = datasets.filter(d => 
    d.primaryDomain.includes('Cardio') ||
    d.title.toLowerCase().includes('cardio') ||
    d.title.toLowerCase().includes('heart') ||
    d.title.toLowerCase().includes('vascular') ||
    d.title.toLowerCase().includes('metabolic')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Hemodynamic & Myocardial Adaptation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Cardiovascular Research Datasets
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Examination of spaceflight cephalic fluid shift, left ventricular mass remodeling, microvascular regulation, and cardiac micro-stress biomarkers (e.g. hs-cTnI).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-rose-400 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <HeartPulse className="w-4 h-4" />
          <span>{cardioStudies.length} Studies Indexed</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Cephalic Fluid Shift</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Loss of hydrostatic pressure gradients shifts ~1.5–2.0 L of blood and interstitial fluid headward, triggering central hypovolemia upon re-entry.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Myocardial Micro-Stress</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Inspiration4 (OSD-575) cardiac troponin monitoring reveals transient subclinical elevations during orbital insertion and splashdown G-transitions.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Orthostatic Intolerance</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Postflight arterial baroreflex impairment and diminished vascular resistance contribute to standing presyncope in returning astronauts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardioStudies.map(dataset => (
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
