import React, { useState } from 'react';
import { NasaResearchService } from '../services/nasaResearchService';
import { RiskDetailLayout } from '../components/RiskDetailLayout';
import { Moon, Users, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SleepPsychologicalRiskPageProps {
  onNavigate: (route: string) => void;
}

export const SleepPsychologicalRiskPage: React.FC<SleepPsychologicalRiskPageProps> = ({ onNavigate }) => {
  const [activeSub, setActiveSub] = useState<'sleep' | 'behavior'>('sleep');

  const sleepCategory = NasaResearchService.getRiskCategoryById('SLEEP')!;
  const behaviorCategory = NasaResearchService.getRiskCategoryById('BEHAVIOR')!;

  const currentCategory = activeSub === 'sleep' ? sleepCategory : behaviorCategory;
  const evidence = NasaResearchService.getEvidenceForCategory(currentCategory.code);
  const mitigations = NasaResearchService.getMitigationsForCategory(currentCategory.code);

  const deepDiveSection = (
    <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Circadian Synchrony vs Isolated Exploration Behavioral Resilience
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSub('sleep')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeSub === 'sleep' ? 'bg-blue-950 text-blue-300 font-medium border border-blue-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sleep & Circadian (SLEEP)
          </button>
          <button
            onClick={() => setActiveSub('behavior')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeSub === 'behavior' ? 'bg-pink-950 text-pink-300 font-medium border border-pink-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Behavior & Team Cohesion (BEHAVIOR)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-blue-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" /> 90-Minute Orbital Cycle & Sleep Fragmentation
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            In LEO, astronauts witness 16 sunrises and sunsets daily, stripping away natural 24h solar zeitgebers. Despite 8.5h scheduled opportunities, astronauts average under 6.0h sleep/night. Sleeping medications (zolpidem, zaleplon) are used on ~78% of ISS missions. On Mars, crew must adapt to the 24h 39m Martian sol, requiring continuous daily circadian phase shifting.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            Countermeasure: Solid-State Light Assemblies (SSLA) with blue-depleted evening spectrum.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-pink-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-pink-400" /> Deep-Space Isolation & Earth-Out-of-View
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            During interplanetary transit to Mars, Earth recedes to an imperceptible point of light, severing profound psychological visual attachment. Round-trip communication latency expands to 44 minutes, preventing conversational dialogue with family or flight surgeons. Ground analog experiments (HERA, NEK, Mars500) identify third-quarter dips in crew morale and displacement of friction onto Mission Control.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            Analog Data: HERA 45-day campaigns demonstrate autonomous conflict management need.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <RiskDetailLayout
      category={currentCategory}
      evidence={evidence}
      mitigations={mitigations}
      onNavigateBack={() => onNavigate('/risks/categories')}
      onNavigateOtherCategory={onNavigate}
      additionalSections={deepDiveSection}
    />
  );
};
