import React, { useState } from 'react';
import { SectionReveal } from '@/components/editorial/SectionReveal';
import { Radiation, Lock, Globe2, Weight, HeartPulse, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface ChallengeCard {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  impact: string;
  clinicalMetric: string;
  nominalBand: string;
  accentColor: string;
  icon: React.ElementType;
  route: string;
}

export const TheChallengeSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string>('01');

  const challenges: ChallengeCard[] = [
    {
      id: '01',
      num: '01',
      title: 'MICROGRAVITY',
      subtitle: 'Fluid Cephalad Shifts & SANS',
      impact:
        'In zero gravity, 2 liters of blood and interstitial fluid shift headward into the chest and cranium, increasing intracranial pressure and contributing to Spaceflight-Associated Neuro-ocular Syndrome (SANS).',
      clinicalMetric: 'Intracranial Pressure (ICP) & Optical Coherence',
      nominalBand: '< 15 mmHg intracranial equivalent',
      accentColor: '#75D8DC',
      icon: Weight,
      route: ROUTES.SPACE_HEALTH,
    },
    {
      id: '02',
      num: '02',
      title: 'SPACE RADIATION',
      subtitle: 'GCR Flux & DNA Double-Strand Breaks',
      impact:
        'Galactic Cosmic Rays and Solar Particle Events penetrate habitat hulls, damaging cellular DNA, elevating lifetime cancer risk (REID), and triggering microvascular endothelial degeneration.',
      clinicalMetric: 'Daily Dosimetry Flux & Cumulative Career Dose',
      nominalBand: '< 600 mSv NASA Career Permissible Exposure Limit (PEL)',
      accentColor: '#FF6B35',
      icon: Radiation,
      route: ROUTES.RADIATION,
    },
    {
      id: '03',
      num: '03',
      title: 'ISOLATION & CONFINEMENT',
      subtitle: 'Circadian Phase Shift & Melatonin',
      impact:
        'A confined environment orbiting in a 90-minute daylight cycle desynchronizes circadian rhythms, suppresses deep slow-wave sleep, and increases subjective fatigue indices.',
      clinicalMetric: 'Psychomotor Vigilance (PVT) & Slow-Wave Sleep %',
      nominalBand: '> 18% Slow-Wave Sleep / PVT Latency < 250ms',
      accentColor: '#111111',
      icon: Lock,
      route: ROUTES.WELLNESS,
    },
    {
      id: '04',
      num: '04',
      title: 'BONE & MUSCLE DEGRADATION',
      subtitle: 'Osteoclast Activation & Sarcopenia',
      impact:
        'Without mechanical loading, astronauts lose approximately 1.0% to 1.5% of bone mineral density in the lumbar spine and femur each month, necessitating intensive daily ARED resistance protocols.',
      clinicalMetric: 'Bone Mineral Density (BMD) & Serum Calcium',
      nominalBand: '< 0.5% monthly attenuation target with ARED',
      accentColor: '#FF6B35',
      icon: ShieldAlert,
      route: ROUTES.SPACE_HEALTH,
    },
    {
      id: '05',
      num: '05',
      title: 'CARDIOVASCULAR REMODELING',
      subtitle: 'Myocardial Atrophy & Orthostatic Intolerance',
      impact:
        'With lower workload required to circulate blood, left ventricular mass decreases by 8% to 10% during prolonged microgravity, inducing severe post-landing orthostatic hypotension.',
      clinicalMetric: 'Left Ventricular Stroke Volume & Arterial MAP',
      nominalBand: 'Mean Arterial Pressure 70–105 mmHg',
      accentColor: '#75D8DC',
      icon: HeartPulse,
      route: ROUTES.VITALS,
    },
    {
      id: '06',
      num: '06',
      title: 'IMMUNE DYSREGULATION',
      subtitle: 'T-Cell Anergy & Latent Viral Reactivation',
      impact:
        'Prolonged spaceflight alters leukocyte distributions, downregulates delayed-type hypersensitivity, and triggers asymptomatic reactivation of latent Epstein-Barr and Varicella-Zoster viruses.',
      clinicalMetric: 'Serum IL-6, TNF-α & Salivary Viral Copies',
      nominalBand: 'IL-6 < 5.0 pg/mL / TNF-α < 8.1 pg/mL',
      accentColor: '#111111',
      icon: Globe2,
      route: ROUTES.LABORATORY,
    },
  ];

  return (
    <section id="challenge" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F2F0EA] relative">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <SectionReveal className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#111111] text-[#111111] font-mono text-[10px] uppercase font-bold tracking-widest shadow-sm">
            <span>SECTION 02 // PHYSIOLOGICAL VULNERABILITY</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#111111] tracking-tight leading-[0.92] uppercase">
                SPACE CHANGES
                <br />
                THE HUMAN
                <br />
                <span className="text-[#FF6B35]">BODY.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#444444] leading-relaxed">
                As human missions extend beyond the protection of Earth’s magnetosphere toward lunar outposts and Martian transits, five core environmental stressors alter human biology.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* 6 Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((c) => {
            const Icon = c.icon;
            const isSelected = activeCard === c.id;

            return (
              <SectionReveal key={c.id}>
                <div
                  onMouseEnter={() => setActiveCard(c.id)}
                  className={`p-6 rounded-2xl bg-[#FFFFFF] border-2 transition-all duration-300 flex flex-col justify-between h-full shadow-subtle ${
                    isSelected
                      ? 'border-[#111111] shadow-editorial -translate-y-1'
                      : 'border-[#DCD8CD] hover:border-[#111111]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#FF6B35]">
                        CHALLENGE // {c.num}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#F2F0EA] border border-[#111111] flex items-center justify-center text-[#111111]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-extrabold text-2xl text-[#111111] tracking-tight">
                        {c.title}
                      </h3>
                      <div className="font-mono text-[11px] text-[#888882] tracking-wider uppercase mt-1">
                        {c.subtitle}
                      </div>
                    </div>

                    <p className="font-body text-xs text-[#444444] leading-relaxed">
                      {c.impact}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DCD8CD] space-y-3">
                    <div className="font-mono text-[10px]">
                      <span className="text-[#888882] uppercase block">MONITORED INDICATOR:</span>
                      <span className="font-bold text-[#111111]">{c.clinicalMetric}</span>
                    </div>

                    <div className="font-mono text-[9px] text-[#75D8DC] font-bold p-2 bg-[#111111] rounded-lg flex items-center justify-between">
                      <span>NOMINAL: {c.nominalBand}</span>
                    </div>

                    <Link
                      to={c.route}
                      className="inline-flex items-center space-x-1.5 font-mono text-xs font-bold text-[#111111] hover:text-[#FF6B35] transition-colors"
                    >
                      <span>INSPECT SENSOR ENVELOPE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
