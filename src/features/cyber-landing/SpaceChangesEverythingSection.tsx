import React, { useState } from 'react';
import { Radiation, Moon, Activity, ShieldAlert, HeartPulse } from 'lucide-react';
import { AstronautIllustration } from '@/components/editorial/AstronautIllustration';

interface HazardItem {
  id: string;
  num: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  clinicalImpact: string;
  nominalBand: string;
  observedFlight: string;
}

export const SpaceChangesEverythingSection: React.FC = () => {
  const [selectedHazard, setSelectedHazard] = useState<string>('01');

  const hazards: HazardItem[] = [
    {
      id: '01',
      num: '01 // HAZARD',
      title: 'Microgravity & Fluid Shift',
      category: 'CARDIOVASCULAR & FLUID DYNAMICS',
      icon: HeartPulse,
      description:
        'Absence of gravitational hydrostatic gradient shifts ~1.8-2.0 liters of blood and interstitial fluid cephalad towards head and thorax.',
      clinicalImpact: 'Jugular venous engorgement, elevated ICP, facial edema, stroke volume decrease upon return.',
      nominalBand: 'Systolic 90-130 mmHg · SpO2 > 95%',
      observedFlight: '114/76 mmHg · SpO2 98.4%',
    },
    {
      id: '02',
      num: '02 // HAZARD',
      title: 'Deep Space Radiation',
      category: 'SPE & GALACTIC COSMIC RAYS',
      icon: Radiation,
      description:
        'Continuous high-Z and energy (HZE) Galactic Cosmic Rays and intermittent Solar Particle Events (SPE) penetrating spacecraft shielding.',
      clinicalImpact: 'DNA double-strand breaks, cataractogenesis, cardiovascular endothelial stiffness, elevated REID.',
      nominalBand: '< 0.50 mSv/day · Lifetime < 600 mSv',
      observedFlight: '0.04 mSv/day · Cumulative 128.4 mSv',
    },
    {
      id: '03',
      num: '03 // HAZARD',
      title: 'Sleep Disruption & Isolation',
      category: 'CIRCADIAN & NEUROPSYCHIATRIC',
      icon: Moon,
      description:
        'Rapid 90-minute sunrise cycles in low orbit and constant artificial lighting in transit disrupt master circadian pacemaker (SCN).',
      clinicalImpact: 'Reduced Stage 3/4 Slow-Wave Sleep, psychomotor vigilance slowing, cortisol dysregulation.',
      nominalBand: 'Total Sleep > 7.0h · SWS > 18%',
      observedFlight: 'Average 7.8h · SWS 21.4%',
    },
    {
      id: '04',
      num: '04 // HAZARD',
      title: 'Bone & Muscle Atrophy',
      category: 'MUSCULOSKELETAL SYSTEM',
      icon: Activity,
      description:
        'Without 1-G mechanical axial loading, osteoclasts outpace osteoblasts, driving trabecular bone demineralization and postural muscle atrophy.',
      clinicalImpact: '1.0% to 1.5% bone density loss per month in weight-bearing bones, hypercalciuria, renal stone risk.',
      nominalBand: 'Loss < 1.0%/mo · ARED Adherence > 90%',
      observedFlight: 'Loss -0.38%/mo · 100% Adherence',
    },
    {
      id: '05',
      num: '05 // HAZARD',
      title: 'Immune-System Dysregulation',
      category: 'IMMUNOLOGICAL & CYTOKINE CASCADE',
      icon: ShieldAlert,
      description:
        'Synergistic stress of radiation, microgravity, and confinement alters leukocyte counts, cytokine responses, and subpopulation ratios.',
      clinicalImpact: 'Asymptomatic reactivation of latent herpesviruses (EBV, VZV), altered delayed-type hypersensitivity.',
      nominalBand: 'IL-6 < 6.0 pg/mL · TNF-α < 8.2 pg/mL',
      observedFlight: 'IL-6 3.8 pg/mL · TNF-α 4.6 pg/mL',
    },
  ];

  const current = hazards.find((h) => h.id === selectedHazard) || hazards[0];
  const Icon = current.icon;

  return (
    <section id="overview" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#071311]/50 border-t border-[#24E6D0]/15 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-[#24E6D0]/30 text-[#24E6D0] font-mono text-[10px] uppercase font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0]" />
            <span>SECTION 01 // HUMAN PHYSIOLOGY IN DEEP SPACE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F4FAF8] tracking-tight leading-[0.95] uppercase">
                SPACE CHANGES
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24E6D0] to-[#8BFFE9]">
                  EVERYTHING.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#91A9A4] leading-relaxed">
                As human missions venture beyond low Earth orbit toward Mars, the human body confronts five primary biomedical hazards identified by NASA’s Human Research Program.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Hazard Cards Grid + Astronaut Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Hazards Selector */}
          <div className="lg:col-span-6 space-y-3">
            {hazards.map((h) => {
              const HIcon = h.icon;
              const isSelected = selectedHazard === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHazard(h.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0D1D1B] border-[#24E6D0] shadow-cyberGlow'
                      : 'bg-[#0A1716]/60 border-[#24E6D0]/15 hover:border-[#24E6D0]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#24E6D0] text-[#020807]' : 'bg-[#071311] text-[#24E6D0]'
                        }`}
                      >
                        <HIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B7B75]">
                          {h.num} · {h.category}
                        </span>
                        <h4 className="font-display font-bold text-base text-[#F4FAF8] mt-0.5">{h.title}</h4>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-[#24E6D0]' : 'text-[#5B7B75]'
                      }`}
                    >
                      {h.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Floating Astronaut & Detailed Hazard Telemetry Dossier */}
          <div className="lg:col-span-6 space-y-6">
            <div className="cyber-glass-glow p-6 sm:p-8 rounded-2xl border border-[#24E6D0]/30 relative overflow-hidden">
              {/* Background Astronaut Illustration Overlay */}
              <div className="absolute -top-10 -right-10 opacity-25 pointer-events-none scale-90">
                <AstronautIllustration className="w-52 h-52 text-[#24E6D0]" />
              </div>

              <div className="relative z-10 space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-[#24E6D0]/20 border border-[#24E6D0]/40 flex items-center justify-center text-[#24E6D0]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#24E6D0] uppercase font-bold tracking-widest">
                      {current.num}
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-[#F4FAF8]">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="font-body text-sm text-[#91A9A4] leading-relaxed">
                  {current.description}
                </p>

                <div className="p-4 rounded-xl bg-[#020807]/80 border border-[#24E6D0]/20 space-y-2">
                  <span className="font-mono text-[10px] text-[#5B7B75] uppercase block">
                    CLINICAL PRESENTATION & FLIGHT IMPACT
                  </span>
                  <p className="font-mono text-xs text-[#F4FAF8] leading-relaxed">
                    {current.clinicalImpact}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#0A1716] border border-[#24E6D0]/15">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B7B75] block">
                      NASA NOMINAL BAND
                    </span>
                    <span className="font-mono text-xs font-bold text-[#F4FAF8] mt-1 block">
                      {current.nominalBand}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0A1716] border border-[#24E6D0]/15">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B7B75] block">
                      SOL 142 FLIGHT READOUT
                    </span>
                    <span className="font-mono text-xs font-bold text-[#8BFFE9] mt-1 block">
                      {current.observedFlight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
