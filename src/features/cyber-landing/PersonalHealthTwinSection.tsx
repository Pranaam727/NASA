import React from 'react';
import { HolographicHuman3D } from '@/components/3d/HolographicHuman3D';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ArrowRight } from 'lucide-react';

export const PersonalHealthTwinSection: React.FC = () => {
  return (
    <section id="health-intelligence" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#071311]/60 border-t border-[#24E6D0]/15 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-[#24E6D0]/30 text-[#24E6D0] font-mono text-[10px] uppercase font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0]" />
            <span>SECTION 03 // PERSONAL HEALTH TWIN & MULTI-ORGAN SYSTEM ENVELOPE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F4FAF8] tracking-tight leading-[0.95] uppercase">
                UNDERSTAND
                <br />
                YOUR BODY.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24E6D0] to-[#8BFFE9]">
                  IN ORBIT.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-4 space-y-3">
              <p className="font-body text-sm sm:text-base text-[#91A9A4] leading-relaxed">
                Every astronaut possesses a unique biological baseline. AstroCare’s statistical health twin maps continuous biometrics against ground tolerance envelopes (μ ± 2σ).
              </p>
              <Link
                to={ROUTES.HEALTH_TWIN}
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#24E6D0] hover:text-[#8BFFE9] transition-colors"
              >
                <span>OPEN FULL HEALTH TWIN COCKPIT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3D Holographic Human Anatomical System */}
        <div className="w-full">
          <HolographicHuman3D />
        </div>
      </div>
    </section>
  );
};
