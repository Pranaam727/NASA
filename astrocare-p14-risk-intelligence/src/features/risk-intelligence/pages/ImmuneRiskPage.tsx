import React from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { RiskDetailLayout } from '../components/RiskDetailLayout';
import { Shield, Sparkles, AlertCircle, Bug } from 'lucide-react';

interface ImmuneRiskPageProps {
  onNavigate: (route: string) => void;
}

export const ImmuneRiskPage: React.FC<ImmuneRiskPageProps> = ({ onNavigate }) => {
  const category = NasaResearchService.getRiskCategoryById('IMMUNE')!;
  const evidence = NasaResearchService.getEvidenceForCategory('IMMUNE');
  const mitigations = NasaResearchService.getMitigationsForCategory('IMMUNE');

  const deepDiveSection = (
    <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Shield className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-100">
          Immune Dysregulation & Latent Herpesvirus Reactivation
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-cyan-300">T-Cell Transduction Blunting</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Direct microgravity biophysical unburdening impairs early T-cell receptor (TCR) activation signaling. Protein kinase C (PKC) fails to translocate to the plasma membrane, arresting downstream NF-kappaB and NFAT transcription factors, reducing IL-2 and IFN-gamma secretion by over 75%.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Mechanism: Altered cytoskeletal actin dynamics
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-amber-300">Latent Viral Shedding</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Persistent neuroendocrine stress (cortisol, catecholamines) coupled with suppressed cell-mediated surveillance triggers subclinical reactivation of Epstein-Barr virus (EBV), Cytomegalovirus (CMV), and Varicella-Zoster virus (VZV) in over 60% of ISS astronauts.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Surveillance: Salivary & urinary qPCR copy counts
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-emerald-300">Host-Microbe Interactions</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Low fluid shear in spacecraft closed water and air recirculation loops alters bacterial regulons (Hfq chaperone), enhancing biofilm production and virulence in opportunistic pathogens (Pseudomonas aeruginosa, Staphylococcus aureus).
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Countermeasure: HEPA filtration & microbial swabbing
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
