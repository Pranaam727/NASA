import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { CyberEarth3D } from '@/components/3d/CyberEarth3D';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const CyberHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden cyber-dots cyber-grid">
      {/* Ambient Emerald & Cyan Lighting Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(36,230,208,0.15)_0%,_rgba(0,175,160,0.05)_40%,_transparent_70%)] pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-6 z-10">
        {/* Mission Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full cyber-glass border border-[#24E6D0]/30 shadow-cyberGlow">
          <span className="w-2 h-2 rounded-full bg-[#24E6D0] animate-ping" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8BFFE9]">
            ARES-VI // DEEP SPACE BIOMEDICAL INTELLIGENCE
          </span>
          <span className="text-[#5B7B75]">|</span>
          <span className="font-mono text-[10px] text-[#91A9A4]">SOL 142 ACTIVE</span>
        </div>

        {/* Main Bold Headline */}
        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-[#F4FAF8] uppercase">
            YOUR HEALTH.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24E6D0] via-[#8BFFE9] to-[#00AFA0]">
              BEYOND EARTH.
            </span>
          </h1>
        </div>

        {/* Supporting Description */}
        <p className="max-w-2xl text-base sm:text-lg font-body text-[#91A9A4] leading-relaxed">
          An intelligent astronaut health monitoring ecosystem designed to understand physiological changes, detect anomalies, and support crew wellbeing throughout space missions.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <a
            href="#overview"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-mono text-xs font-bold bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] transition-all flex items-center justify-center space-x-2 shadow-cyberGlow hover:scale-105"
          >
            <span>EXPLORE PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            to={ROUTES.ASTRONAUT_DASHBOARD}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-mono text-xs font-bold text-[#F4FAF8] cyber-glass border border-[#24E6D0]/30 hover:border-[#24E6D0] hover:shadow-cyberGlow transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#24E6D0]" />
            <span>ENTER MISSION CONTROL</span>
          </Link>
        </div>

        {/* Main 3D Earth Centerpiece */}
        <div className="w-full mt-8 max-w-5xl h-[580px] sm:h-[640px] relative">
          <CyberEarth3D />
        </div>
      </div>
    </section>
  );
};
