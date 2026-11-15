import React from 'react';
import { SectionReveal } from '@/components/editorial/SectionReveal';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Activity, ShieldCheck, FileCheck, Stethoscope, AlertOctagon, BarChart3, ArrowRight } from 'lucide-react';

export const TheSolutionSection: React.FC = () => {
  const solutions = [
    {
      step: '01',
      title: 'PERSONAL HEALTH TWIN',
      category: 'STATISTICAL BASELINE ENVELOPE',
      desc: 'Constructs an individualized 30-day biological baseline (μ ± 2σ) for every astronaut. Any clinical deviation is flagged in real-time before symptoms escalate.',
      badge: 'Z-SCORE ANOMALY ENGINE',
      route: ROUTES.HEALTH_TWIN,
      icon: Activity,
    },
    {
      step: '02',
      title: 'DAILY SELF-ASSESSMENT',
      category: 'CREW PARTICIPATORY TELEMETRY',
      desc: '9-step guided daily check-in evaluating sleep architecture, SANS visual acuity, microgravity vestibular dizziness, and ARED resistance workouts with offline auto-save.',
      badge: 'FLIGHT SURGEON TRIAGE',
      route: ROUTES.SELF_ASSESSMENT,
      icon: FileCheck,
    },
    {
      step: '03',
      title: 'BIOMARKER LABORATORY',
      category: 'IN-FLIGHT WET LAB ASSAYS',
      desc: 'Tracks on-orbit blood and saliva bio-analyzers measuring IL-6, TNF-α, hs-CRP, fasting glucose, and DNA 8-OHdG oxidative markers against clinical reference boundaries.',
      badge: 'IMMUNE MONITORING',
      route: ROUTES.LABORATORY,
      icon: Stethoscope,
    },
    {
      step: '04',
      title: 'EMERGENCY ASSISTANT',
      category: 'CRITICAL EVENT PROCEDURES',
      desc: 'Locally cached, version-controlled aerospace medical checklists for hypoxia, cabin depressurization, cardiac arrhythmia, toxic gas exposure, and hyperbaric treatment.',
      badge: 'LOCAL ZERO-FAIL PROTOCOLS',
      route: ROUTES.EMERGENCY,
      icon: AlertOctagon,
    },
    {
      step: '05',
      title: 'MISSION HEALTH ANALYTICS',
      category: 'MULTI-STRESSOR COMPOUNDING',
      desc: 'Combines physiological vitals, radiation exposure, sleep deficit, and cabin biosphere telemetry into a unified composite mission readiness score with synergistic distress multipliers.',
      badge: 'FLIGHT DIRECTOR INTELLIGENCE',
      route: ROUTES.INTELLIGENCE,
      icon: BarChart3,
    },
  ];

  return (
    <section id="technology" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-y border-[#DCD8CD]">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <SectionReveal className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2F0EA] border border-[#111111] text-[#111111] font-mono text-[10px] uppercase font-bold tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#75D8DC]" />
            <span>SECTION 03 // THE ASTROCARE ECOSYSTEM</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#111111] tracking-tight leading-[0.92] uppercase">
                EVERY SIGNAL
                <br />
                TELLS A
                <br />
                <span className="text-[#FF6B35]">STORY.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#444444] leading-relaxed">
                From subclinical biomarkers to cabin biosphere sensors, AstroCare connects disparate biometric streams into a unified health intelligence command deck.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* 5 Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <SectionReveal key={sol.step}>
                <div className="p-6 rounded-2xl bg-[#F2F0EA] border border-[#DCD8CD] hover:border-[#111111] transition-all duration-300 flex flex-col justify-between h-full shadow-subtle hover:shadow-editorial hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#FF6B35]">
                        MODULE // {sol.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center text-[#111111]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#888882] block">
                        {sol.category}
                      </span>
                      <h3 className="font-display font-extrabold text-2xl text-[#111111] tracking-tight mt-0.5">
                        {sol.title}
                      </h3>
                    </div>

                    <p className="font-body text-xs text-[#444444] leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DCD8CD] flex items-center justify-between">
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#111111] text-[#111111]">
                      {sol.badge}
                    </span>

                    <Link
                      to={sol.route}
                      className="inline-flex items-center space-x-1 font-mono text-xs font-bold text-[#111111] hover:text-[#FF6B35] transition-colors"
                    >
                      <span>EXPLORE</span>
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
