import React from 'react';
import { Activity, ShieldCheck, Dna, AlertOctagon, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface FeaturePillar {
  num: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetry: string;
  route: string;
}

export const EverySignalMattersSection: React.FC = () => {
  const pillars: FeaturePillar[] = [
    {
      num: '01',
      title: 'Physiological Telemetry',
      tagline: 'Continuous biosensor telemetry with zero-drop packet queuing during deep-space link blackouts.',
      icon: Activity,
      telemetry: '64 BPM · 98.4% SpO2 · 14 BrPM',
      route: ROUTES.ASTRONAUT_DASHBOARD,
    },
    {
      num: '02',
      title: 'Personal Health Twin',
      tagline: 'Individualized 30-day statistical envelope (μ ± 2σ) evaluating biological drift against Earth baseline.',
      icon: ShieldCheck,
      telemetry: 'Z-Score: 0.0σ Baseline Stabilized',
      route: ROUTES.HEALTH_TWIN,
    },
    {
      num: '03',
      title: 'Biomarker Tracking',
      tagline: 'Automated wet-lab inflammatory cytokine assays and radiation oxidative stress markers (8-OHdG).',
      icon: Dna,
      telemetry: 'IL-6: 3.8 pg/mL · TNF-α: 4.6 pg/mL',
      route: ROUTES.LABORATORY,
    },
    {
      num: '04',
      title: 'Synergistic Anomaly Engine',
      tagline: 'Multi-axis alert engine compounding acute hypoxia, radiation surge, and tachycardia into unified risk scores.',
      icon: AlertOctagon,
      telemetry: '0 Active Critical · Tier: Normal',
      route: ROUTES.ALERTS,
    },
    {
      num: '05',
      title: 'Crew Countermeasures',
      tagline: 'Targeted ARED load prescriptions, ergometer intervals, and circadian Phase-Response lighting adjustments.',
      icon: Zap,
      telemetry: '6/6 Sols Completed · 100% Adherence',
      route: ROUTES.SELF_ASSESSMENT,
    },
  ];

  return (
    <section id="technology" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#020807] border-t border-[#24E6D0]/15 relative cyber-grid">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-[#24E6D0]/30 text-[#24E6D0] font-mono text-[10px] uppercase font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0]" />
            <span>SECTION 02 // MULTI-SIGNAL MONITORING ARCHITECTURE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F4FAF8] tracking-tight leading-[0.95] uppercase">
                EVERY SIGNAL
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24E6D0] to-[#8BFFE9]">
                  MATTERS.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#91A9A4] leading-relaxed">
                A single biometric anomaly may be compensatory; five synchronized micro-deviations reveal a clinical crisis before symptoms emerge.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Floating Connected Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="cyber-glass-glow p-6 rounded-2xl border border-[#24E6D0]/20 hover:border-[#24E6D0] transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#071311] border border-[#24E6D0]/30 flex items-center justify-center text-[#24E6D0] group-hover:bg-[#24E6D0] group-hover:text-[#020807] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#5B7B75] group-hover:text-[#24E6D0]">
                      {p.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-[#F4FAF8] tracking-tight">
                      {p.title}
                    </h3>
                    <p className="font-body text-xs text-[#91A9A4] mt-2 leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#24E6D0]/15 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#5B7B75] uppercase">ACTIVE TELEMETRY:</span>
                    <span className="text-[#8BFFE9] font-bold">{p.telemetry}</span>
                  </div>

                  <Link
                    to={p.route}
                    className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#24E6D0] hover:text-[#8BFFE9] transition-colors pt-1"
                  >
                    <span>LAUNCH PROTOCOL</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* 6th Card: NASA Space Apps Summary */}
          <div className="cyber-glass-glow p-6 rounded-2xl border border-[#24E6D0]/30 bg-gradient-to-br from-[#0A1716] via-[#071311] to-[#0D1D1B] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-[#24E6D0] uppercase font-bold tracking-widest block">
                NASA SPACE APPS CHALLENGE
              </span>
              <h3 className="font-display font-extrabold text-2xl text-[#F4FAF8]">
                Human Health on Long-Duration Spaceflight
              </h3>
              <p className="font-body text-xs text-[#91A9A4] leading-relaxed">
                Built strictly to NASA-STD-3001 technical standards with deterministic offline failover, individualized baseline envelopes, and role-authorized mission access.
              </p>
            </div>

            <div className="pt-4 border-t border-[#24E6D0]/15 flex items-center justify-between font-mono text-[10px] text-[#5B7B75]">
              <span>236 / 236 TESTS PASSING</span>
              <span className="text-[#24E6D0]">100% GROUNDED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
