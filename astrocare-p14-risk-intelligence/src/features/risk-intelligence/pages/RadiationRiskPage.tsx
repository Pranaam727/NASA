import React from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { RiskDetailLayout } from '../components/RiskDetailLayout';
import { Zap, ShieldCheck, AlertCircle, Compass } from 'lucide-react';

interface RadiationRiskPageProps {
  onNavigate: (route: string) => void;
}

export const RadiationRiskPage: React.FC<RadiationRiskPageProps> = ({ onNavigate }) => {
  const category = NasaResearchService.getRiskCategoryById('RAD')!;
  const evidence = NasaResearchService.getEvidenceForCategory('RAD');
  const mitigations = NasaResearchService.getMitigationsForCategory('RAD');

  const deepDiveSection = (
    <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Zap className="w-5 h-5 text-violet-400" />
        <h3 className="text-sm font-semibold text-slate-100">
          Radiation Field Spectra: Galactic Cosmic Rays (GCR) vs Solar Particle Events (SPE)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-violet-300">Galactic Cosmic Rays (GCR)</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Omnidirectional flux of high-energy protons (87%), alpha particles (12%), and heavy ions (1% HZE nuclei such as 56Fe). Traverses normal spacecraft hulls, depositing clustered DNA double-strand breaks. Modulated inversely with the 11-year solar cycle.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Dose rate: ~1.3–1.8 mSv/day (Deep Space)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-amber-300">Solar Particle Events (SPE)</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Sporadic, intense bursts of solar energetic protons driven by coronal mass ejections (CMEs) and solar flares. Can deliver acute, life-threatening doses (Gy levels) over hours if unshielded, causing Acute Radiation Syndrome (ARS).
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            Peak flux: Up to several Sv over 24-48 hours
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-cyan-300">Trapped Radiation Belts</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Van Allen radiation belts containing geomagnetically trapped protons and electrons. In Low Earth Orbit (LEO), the South Atlantic Anomaly (SAA) dips to ISS altitudes, contributing ~60% of the astronaut\'s total orbital dose.
          </p>
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
            ISS dose: ~0.4–0.6 mSv/day
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-lg bg-violet-950/20 border border-violet-800/40 text-xs text-violet-200/90 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <strong>NASA Career Exposure Limit (2022 Standard):</strong> NASA enforces a unified career limit of 600 mSv effective dose across all astronaut cohorts based on a 3% Risk of Exposure-Induced Death (REID) calculation at the 95% statistical confidence level.
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
