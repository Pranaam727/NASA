import React, { useState } from 'react';
import { MeasurementVariable, BiomedicalDomain } from '../types/observation.types';
import { DatasetRecord } from '../types/dataset.types';
import { BENCHMARK_VARIABLES } from '../data/demoObservations';
import { 
  Stethoscope, Activity, Heart, Shield, Bone, Sun, Moon, 
  Brain, Eye, Utensils, Bug, ExternalLink, Info, CheckCircle2 
} from 'lucide-react';

interface BiomedicalResearchPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onExploreVariable?: (variableId: string) => void;
}

export const BiomedicalResearchPage: React.FC<BiomedicalResearchPageProps> = ({
  datasets,
  onSelectStudy,
  onExploreVariable
}) => {
  const [selectedDomain, setSelectedDomain] = useState<BiomedicalDomain | 'all'>('all');

  const domains: Array<{ id: BiomedicalDomain; name: string; icon: any; desc: string }> = [
    { id: 'cardiovascular', name: 'Cardiovascular', icon: Heart, desc: 'Cephalad fluid redistribution, cardiomyocyte stress, and orthostatic intolerance.' },
    { id: 'bone', name: 'Bone Remodeling', icon: Bone, desc: 'Cancellous osteopenia, calcium balance, and trabecular micro-architecture degradation.' },
    { id: 'muscle', name: 'Muscle Atrophy', icon: Activity, desc: 'Soleus and postural antigravity muscle deconditioning and sarcopenia.' },
    { id: 'immune', name: 'Immune System', icon: Shield, desc: 'T-cell suppression, cytokine dysregulation, and latent herpesvirus reactivation.' },
    { id: 'radiation', name: 'Radiation Biology', icon: Sun, desc: 'High-LET galactic cosmic ray (GCR) exposure and complex DNA double-strand breaks.' },
    { id: 'sleep', name: 'Sleep Physiology', icon: Moon, desc: 'Circadian desynchronization, 16 sunrise orbital cycles, and sleep architecture loss.' },
    { id: 'behavioral', name: 'Behavioral Health', icon: Brain, desc: 'Isolation, confinement stress, neuro-cognitive performance, and autonomous operations.' },
    { id: 'vision', name: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS)', icon: Eye, desc: 'Optic disc edema, choroidal folds, and hyperopic refractive shift.' },
    { id: 'microbiome', name: 'Microbiome Dynamics', icon: Bug, desc: 'Gastrointestinal and habitat microbial dysbiosis in closed environmental life support.' },
    { id: 'metabolism', name: 'Nutrition & Metabolism', icon: Utensils, desc: 'Energy expenditure, oxidative stress markers, insulin sensitivity, and nutrient absorption.' }
  ];

  const filteredVariables = selectedDomain === 'all'
    ? BENCHMARK_VARIABLES
    : BENCHMARK_VARIABLES.filter(v => v.domain === selectedDomain);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Aerospace Medicine & Human System Risk Architecture
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Biomedical Measurement Variables
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Exploration of physiological biomarkers, clinical parameters, and molecular assays mapped to the NASA Human Research Program (HRP) 10 primary health risk domains.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <span>{BENCHMARK_VARIABLES.length} Validated Variables Indexed</span>
        </div>
      </div>

      {/* 10 Health Risk Domains Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {domains.map(dom => {
          const Icon = dom.icon;
          const isSelected = selectedDomain === dom.id;
          const varCount = BENCHMARK_VARIABLES.filter(v => v.domain === dom.id).length;

          return (
            <button
              key={dom.id}
              onClick={() => setSelectedDomain(selectedDomain === dom.id ? 'all' : dom.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/40 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-slate-400">
                    {varCount} var
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 leading-snug">{dom.name}</h4>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {dom.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Variables Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100">
            Catalogued Measurement Variables {selectedDomain !== 'all' && `(${selectedDomain})`}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Original units & assay specifications
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVariables.map(v => {
            const study = datasets.find(d => d.studyId === v.studyId);

            return (
              <div 
                key={v.variableId}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                        {v.studyId}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 uppercase">
                        Domain: {v.domain}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">
                      {v.variableName}
                    </h4>
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 shrink-0">
                    {v.unit}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {v.description}
                </p>

                {/* Clinical / Spaceflight Relevance */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 text-xs space-y-1">
                  <div className="text-[10px] font-semibold text-cyan-400 uppercase font-mono">
                    Spaceflight Significance:
                  </div>
                  <div className="text-slate-300 leading-relaxed text-[11px]">
                    {v.spaceflightRelevance}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[200px]" title={v.assayMethod}>
                    Assay: {v.assayMethod}
                  </span>

                  <button
                    onClick={() => onSelectStudy(v.studyId)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    <span>View Study {v.studyId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
