import React, { useState } from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { RiskDetailLayout } from '../components/RiskDetailLayout';
import { Dumbbell, ShieldAlert, Sparkles, AlertTriangle, Layers } from 'lucide-react';

interface BoneMuscleRiskPageProps {
  onNavigate: (route: string) => void;
}

export const BoneMuscleRiskPage: React.FC<BoneMuscleRiskPageProps> = ({ onNavigate }) => {
  const [subDomain, setSubDomain] = useState<'bone' | 'muscle'>('bone');

  const boneCategory = NasaResearchService.getRiskCategoryById('BONE')!;
  const muscleCategory = NasaResearchService.getRiskCategoryById('MUSCLE')!;

  const activeCategory = subDomain === 'bone' ? boneCategory : muscleCategory;
  const evidence = NasaResearchService.getEvidenceForCategory(activeCategory.code);
  const mitigations = NasaResearchService.getMitigationsForCategory(activeCategory.code);

  const deepDiveSection = (
    <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Musculoskeletal System Synergy: Bone Demineralization vs Muscle Atrophy
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSubDomain('bone')}
            className={`px-3 py-1 rounded-md transition-colors ${
              subDomain === 'bone' ? 'bg-amber-950 text-amber-300 font-medium border border-amber-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bone Health (BONE)
          </button>
          <button
            onClick={() => setSubDomain('muscle')}
            className={`px-3 py-1 rounded-md transition-colors ${
              subDomain === 'muscle' ? 'bg-emerald-950 text-emerald-300 font-medium border border-emerald-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Muscle Function (MUSCLE)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Bone Remodeling Decoupling & Trabecular Thinning
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Unburdening arrests osteocyte fluid shear stress, triggering high sclerostin and RANKL secretion. Active osteoclasts excavate bone matrix unchecked by quiescent osteoblasts. Weight-bearing bones lose ~1–1.5% BMD per month. Released calcium causes hypercalciuria and nephrolithiasis (kidney stones).
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            TBone Findings: Trabecular micro-architecture remains incomplete 12mo post-flight.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Sarcopenia & Postural Muscle Fiber-Type Switching
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Without gravity vector resistance, antigravity calf postural muscles (soleus and gastrocnemius) undergo rapid proteolysis via MuRF1 and Atrogin-1 ubiquitin ligases. Slow-twitch fatigue-resistant Type I fibers convert toward fast-twitch Type IIx glycolytic fibers, degrading aerobic endurance and explosive work capacity.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            Biopsy Benchmark: 32% drop in single-fiber peak contractile force in soleus.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <RiskDetailLayout
      category={activeCategory}
      evidence={evidence}
      mitigations={mitigations}
      onNavigateBack={() => onNavigate('/risks/categories')}
      onNavigateOtherCategory={onNavigate}
      additionalSections={deepDiveSection}
    />
  );
};
