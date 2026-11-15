import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AnatomyCanvas, BiologicalSystemKey } from '../3d/AnatomyCanvas';
import { Heart, Bone, Shield, Brain, Apple, Moon, ArrowUpRight, Activity } from 'lucide-react';

interface SystemDossier {
  key: BiologicalSystemKey;
  name: string;
  icon: React.ElementType;
  color: string;
  functionDesc: string;
  spaceflightRelevance: string;
  indicators: string[];
  countermeasures: string;
  targetRoute: string;
}

const SYSTEMS: SystemDossier[] = [
  {
    key: 'cardiovascular',
    name: 'CARDIOVASCULAR SYSTEM',
    icon: Heart,
    color: '#FF3366',
    functionDesc: 'Maintains continuous systemic perfusion, cardiac output, oxygen transport, and arterial pressure regulation.',
    spaceflightRelevance:
      'In microgravity, absence of hydrostatic pressure gradient induces a 2-liter cephalad fluid shift, causing facial puffiness, baroreceptor resetting, central blood volume contraction, and post-flight orthostatic intolerance.',
    indicators: ['Heart Rate (BPM)', 'Systolic / Diastolic Pressure', 'Pulse Pressure & Stroke Volume', 'Mean Arterial Pressure (MAP)'],
    countermeasures: 'Lower Body Negative Pressure (LBNP), saline fluid loading before re-entry, and daily 30-min high-intensity cycle ergometry.',
    targetRoute: ROUTES.VITALS,
  },
  {
    key: 'skeletal',
    name: 'SKELETAL & MUSCULOSKELETAL',
    icon: Bone,
    color: '#E0E6ED',
    functionDesc: 'Provides mechanical structural integrity, mineral reservoir (calcium/phosphorus), and bone marrow hematopoiesis.',
    spaceflightRelevance:
      'Unloading of skeletal weight-bearing bones causes osteoclast upregulation, leading to 1.0–1.5% bone mineral density loss per month in the lumbar spine, femoral neck, and calcaneus, along with hypercalciuria and renal stone risk.',
    indicators: ['Bone Mineral Density Index', 'Serum Calcium & Vitamin D', 'Urinary N-telopeptide (NTx)', 'Muscular Peak Power (Watts)'],
    countermeasures: 'Advanced Resistive Exercise Device (ARED) squats and deadlifts at 600+ lbs equivalent loads, bisphosphonates, and dietary calcium optimization.',
    targetRoute: ROUTES.SPACE_HEALTH,
  },
  {
    key: 'immune',
    name: 'IMMUNE & LYMPHATIC SYSTEM',
    icon: Shield,
    color: '#65CFFF',
    functionDesc: 'Defends host physiology against infectious pathogens, surveils oncogenic cellular mutations, and modulates tissue repair.',
    spaceflightRelevance:
      'Space radiation, psychological stress, and microgravity induce T-cell hyporesponsiveness, altered cytokine secretion profiles (skewed Th2 bias), and spontaneous subclinical reactivation of latent herpesviruses (EBV, VZV, CMV).',
    indicators: ['Cytokine Ratios (IL-6 / TNF-α)', 'Leukocyte Differential Counts', 'Salivary Cortisol & sIgA', 'Viral Shedding PCR Markers'],
    countermeasures: 'Dietary polyphenols, immunomodulatory nutraceuticals, microbial environmental hygiene, and targeted antiviral prophylaxis.',
    targetRoute: ROUTES.SPACE_HEALTH,
  },
  {
    key: 'nervous',
    name: 'NERVOUS SYSTEM & SANS',
    icon: Brain,
    color: '#00D9FF',
    functionDesc: 'Controls central cognitive executive function, neuro-vestibular spatial orientation, sensorimotor coordination, and visual processing.',
    spaceflightRelevance:
      'Cephalad fluid shift elevates intracranial venous pressures, resulting in Spaceflight-Associated Neuro-ocular Syndrome (SANS), optic disc edema, globe flattening, choroidal folds, and hyperopic refractive shifts.',
    indicators: ['Optic Nerve Sheath Diameter (ONSD)', 'Psychomotor Vigilance Test (PVT)', 'Visual Acuity & Contrast Sensitivity', 'Vestibular Balance Score'],
    countermeasures: 'Venous chokes, seated lower-body negative pressure sleeping habitats, optical coherence tomography (OCT) tracking, and neuro-ergonomic lighting.',
    targetRoute: ROUTES.INTELLIGENCE,
  },
  {
    key: 'metabolic',
    name: 'METABOLIC & ENDOCRINE',
    icon: Apple,
    color: '#FFA028',
    functionDesc: 'Regulates glucose homeostasis, mitochondrial energy synthesis, macronutrient assimilation, and nitrogen balance.',
    spaceflightRelevance:
      'Microgravity physical inactivity alters insulin receptor sensitivity, predisposing astronauts to glucose intolerance, negative nitrogen balance, and accelerated oxidative stress under high radiation environments.',
    indicators: ['Fasting Blood Glucose (mg/dL)', 'Insulin Resistance Index (HOMA-IR)', 'Serum Ferritin & Oxidative Stress', 'Ketone Body Flux'],
    countermeasures: 'Macronutrient calorie-dense space rations, precise glycemic index controls, and antioxidant co-factors (coenzyme Q10, alpha-lipoic acid).',
    targetRoute: ROUTES.VITALS,
  },
  {
    key: 'sleep',
    name: 'SLEEP & CIRCADIAN CLOCK',
    icon: Moon,
    color: '#B49AFF',
    functionDesc: 'Synchronizes endogenous 24-hour master clock in the suprachiasmatic nucleus (SCN), coordinating hormone surges and deep recovery.',
    spaceflightRelevance:
      'Astronauts experience 16 sunrises/sunsets every 24 hours in Low Earth Orbit (LEO). Habitat noise, ambient light, and high mission operational tempo reduce average astronaut sleep to 6.0 hours/night, triggering chronic sleep debt.',
    indicators: ['Total Sleep Time (TST)', 'Slow Wave / REM Sleep Fraction', 'Circadian Phase Angle Shift', 'Sleep Fragmentation Index'],
    countermeasures: 'Dynamic solid-state LED blue-depleted circadian lighting protocols in sleeping quarters, melatonin timing, and cognitive behavioral therapy (CBT-I).',
    targetRoute: ROUTES.WELLNESS,
  },
];

export const HumanBodySection: React.FC = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<BiologicalSystemKey>('cardiovascular');

  const activeSystem = SYSTEMS.find((s) => s.key === activeKey) || SYSTEMS[0];
  const Icon = activeSystem.icon;

  return (
    <section id="human-body" className="relative py-28 bg-[#05070B] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              BIOMEDICAL ANATOMY ARCHITECTURE
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            YOUR BODY.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              YOUR MOST IMPORTANT MISSION SYSTEM.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            Interact with the holographic anatomical model to understand the physiological impacts
            of spaceflight across six critical biological systems.
          </p>
        </div>

        {/* System Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {SYSTEMS.map((sys) => {
            const isSelected = sys.key === activeKey;
            const SysIcon = sys.icon;
            return (
              <button
                key={sys.key}
                onClick={() => setActiveKey(sys.key)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-glowCyan'
                    : 'glass-panel-subtle border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <SysIcon className="w-4 h-4" style={{ color: isSelected ? sys.color : undefined }} />
                <span>{sys.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Holographic Canvas + Dossier Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Holographic Model */}
          <div className="lg:col-span-6">
            <AnatomyCanvas activeSystem={activeKey} onSelectSystem={setActiveKey} />
          </div>

          {/* Right Column: In-depth Clinical Dossier */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/25">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border"
                  style={{
                    backgroundColor: `${activeSystem.color}15`,
                    borderColor: `${activeSystem.color}40`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: activeSystem.color }} />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    PHYSIOLOGICAL SUBSYSTEM
                  </div>
                  <h3 className="text-xl sm:text-2xl font-space font-bold text-white">
                    {activeSystem.name}
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                MONITORED
              </span>
            </div>

            {/* Function description */}
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                PRIMARY FUNCTION
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{activeSystem.functionDesc}</p>
            </div>

            {/* Spaceflight relevance */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                SPACEFLIGHT IMPACT & DEEP-SPACE RELEVANCE
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {activeSystem.spaceflightRelevance}
              </p>
            </div>

            {/* Monitored Indicators */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">
                MONITORED BIOMARKERS & INDICATORS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSystem.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preventive Countermeasures */}
            <div className="text-xs font-mono text-slate-300 border-t border-slate-800 pt-3">
              <span className="text-cyan-400 font-bold block mb-1">AEROSPACE COUNTERMEASURES:</span>
              <span className="text-slate-400 leading-normal">{activeSystem.countermeasures}</span>
            </div>

            {/* Inspect In App Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => navigate(activeSystem.targetRoute)}
                className="group flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold text-black bg-gradient-to-r from-cyan-400 to-iceBlue hover:brightness-110 transition-all shadow-glowCyan"
              >
                <span>INSPECT {activeSystem.name.split(' ')[0]} TELEMETRY</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
