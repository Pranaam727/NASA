import React from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { RiskDetailLayout } from '../components/RiskDetailLayout';
import { Eye, ShieldAlert, AlertTriangle, Compass, CheckCircle2 } from 'lucide-react';

interface VisionNeurologicalRiskPageProps {
  onNavigate: (route: string) => void;
}

export const VisionNeurologicalRiskPage: React.FC<VisionNeurologicalRiskPageProps> = ({ onNavigate }) => {
  const category = NasaResearchService.getRiskCategoryById('SANS')!;
  const evidence = NasaResearchService.getEvidenceForCategory('SANS');
  const mitigations = NasaResearchService.getMitigationsForCategory('SANS');

  const deepDiveSection = (
    <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Eye className="w-5 h-5 text-teal-400" />
        <h3 className="text-sm font-semibold text-slate-100">
          Spaceflight-Associated Neuro-Ocular Syndrome (SANS) Structural Pathophysiology
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-teal-300">Translaminar Pressure Inversion</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            In 1-G upright posture, intracranial pressure (ICP) drops to ~0 mmHg, maintaining a positive translaminar pressure across the lamina cribrosa. In microgravity, constant non-pulsatile ICP (~10–15 mmHg) day and night alters this mechanical barrier, causing axoplasmic stasis and papilledema (optic disc edema).
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Incidence: ~70% of long-duration ISS crew
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-cyan-300">Posterior Globe Flattening & Folds</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Distension of the optic nerve sheath with cerebrospinal fluid mechanically presses into the back of the eye, causing posterior globe flattening and transverse choroidal folds. Astronauts experience progressive hyperopic refractive shifts (+0.5 to +1.75 diopters).
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Imaging: In-flight Heidelberg Spectralis SD-OCT
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-violet-300">One-Carbon Genetic Susceptibility</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            NASA biochemical studies revealed that astronauts developing clinically significant SANS possess single nucleotide polymorphisms (SNPs) in the folate- and B12-dependent one-carbon metabolic pathway (MTHFR 677C&gt;T, MS 2756A&gt;G), elevating baseline homocysteine and altering microvascular endothelial reactivity.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Countermeasure: Active methylfolate & B12
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <RiskDetailLayout
      category={category}
      evidence={evidence}
      mitigations={mitigations}
      onNavigateBack={() => onNavigate('/risks/categories')}
      onNavigateOtherCategory={onNavigate}
      additionalSections={deepDiveSection}
    />
  );
};
