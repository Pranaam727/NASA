import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ArrowRight, Orbit, ShieldCheck } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#020807] overflow-hidden flex items-center justify-center border-t border-[#24E6D0]/20">
      {/* Background Deep Emerald Atmosphere Glow & Cyber Grid */}
      <div className="absolute inset-0 cyber-dots opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse,_rgba(36,230,208,0.18)_0%,_rgba(0,175,160,0.06)_40%,_transparent_70%)] pointer-events-none blur-3xl" />

      {/* Subtle Orbital Ring Graphic */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-[#24E6D0]/10 pointer-events-none animate-spin-slow" />
      <div className="absolute w-[800px] h-[800px] rounded-full border border-[#24E6D0]/5 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full cyber-glass border border-[#24E6D0]/30 shadow-cyberGlow">
          <Orbit className="w-4 h-4 text-[#24E6D0]" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8BFFE9]">
            SECTION 05 // MISSION EXPEDITION ACCESS
          </span>
        </div>

        <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-[#F4FAF8] tracking-tight leading-[0.92] uppercase">
          THE FUTURE OF
          <br />
          HUMAN SPACEFLIGHT
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24E6D0] via-[#8BFFE9] to-[#00AFA0]">
            IS HEALTH.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg font-body text-[#91A9A4] leading-relaxed">
          From transit microgravity to Martian surface operations, AstroCare protects human life with autonomous medical intelligence, grounded baselines, and flight-proven emergency protocols.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to={ROUTES.ASTRONAUT_DASHBOARD}
            className="w-full sm:w-auto px-10 py-4 rounded-full font-mono text-sm font-bold bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] transition-all flex items-center justify-center space-x-2 shadow-cyberGlow hover:scale-105"
          >
            <span>ENTER ASTROCARE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to={ROUTES.AUTH}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-mono text-sm font-bold text-[#F4FAF8] cyber-glass border border-[#24E6D0]/30 hover:border-[#24E6D0] transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#24E6D0]" />
            <span>AUTHENTICATE CREW ROLE</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
