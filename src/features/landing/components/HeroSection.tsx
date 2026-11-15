import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { HeroCanvas } from '../3d/HeroCanvas';
import { ArrowRight, ChevronDown, Activity, ShieldCheck, Radio, Orbit } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleDiscoverMission = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.querySelector('#hazards');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="overview"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#0D0D0D]"
    >
      {/* 3D WebGL Background Scene */}
      <HeroCanvas />

      {/* Subtle Scanline & Radial Vignette Overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none z-10" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0D]/40 to-[#0D0D0D] pointer-events-none z-10" />

      {/* Foreground Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[75vh]">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Mission Protocol Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#151515]/90 border border-[#00A3FF]/40 w-fit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-[#00A3FF] uppercase font-semibold">
                NASA SPACE BIOMEDICAL INTELLIGENCE // OPERATIONAL
              </span>
            </div>

            {/* Oversized Headline */}
            <div className="space-y-1">
              <h1 className="font-space font-extrabold tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-[#E2DED9]">
                BEYOND EARTH.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] via-[#38BDF8] to-[#7B2CBF]">
                  BEYOND LIMITS.
                </span>
                <br />
                <span className="text-[#E2DED9]">HEALTH WITHOUT</span>{' '}
                <span className="text-[#00A3FF]">COMPROMISE.</span>
              </h1>
            </div>

            {/* Supporting Statement */}
            <p className="max-w-xl text-base sm:text-lg text-[#C6C2BB] leading-relaxed font-light">
              Your health is your most critical mission asset. AstroCare unites advanced
              astronaut physiological monitoring, AI-assisted clinical interpretation, and mission-level
              countermeasures into a unified digital command deck.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="group relative px-7 py-3.5 rounded-xl text-sm font-mono font-bold tracking-wider text-black bg-[#00A3FF] hover:bg-[#38BDF8] shadow-glowCyan transition-all flex items-center justify-center space-x-2"
              >
                <span>EXPLORE YOUR HEALTH</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDiscoverMission}
                className="px-6 py-3.5 rounded-xl text-sm font-mono font-medium text-[#E2DED9] bg-[#151515] border border-[#262626] hover:border-[#00A3FF]/60 hover:text-white transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>DISCOVER THE MISSION</span>
                <ChevronDown className="w-4 h-4 text-[#00A3FF] animate-bounce" />
              </button>
            </div>

            {/* Illustrative Interface Floating Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#262626]">
              <div className="p-3 rounded-xl bg-[#151515] border border-[#262626] shadow-sm">
                <div className="flex items-center space-x-1.5 text-[#00A3FF] mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono text-[#817E7B]">STATUS</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[#E2DED9]">OPERATIONAL</div>
              </div>

              <div className="p-3 rounded-xl bg-[#151515] border border-[#262626] shadow-sm">
                <div className="flex items-center space-x-1.5 text-[#7B2CBF] mb-1">
                  <Orbit className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono text-[#817E7B]">ENVIRONMENT</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[#E2DED9]">DEEP SPACE</div>
              </div>

              <div className="p-3 rounded-xl bg-[#151515] border border-[#262626] shadow-sm">
                <div className="flex items-center space-x-1.5 text-sky-400 mb-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono text-[#817E7B]">BIOMETRICS</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[#E2DED9]">REAL-TIME</div>
              </div>

              <div className="p-3 rounded-xl bg-[#151515] border border-[#262626] shadow-sm">
                <div className="flex items-center space-x-1.5 text-emerald-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono text-[#817E7B]">PROVENANCE</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[#E2DED9]">VALIDATED</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Astronaut Telemetry Floating HUD */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center pointer-events-auto">
            <div className="w-full max-w-sm rounded-2xl p-5 bg-[#151515]/95 border border-[#262626] shadow-card space-y-4 hover:border-[#383838] transition-colors">
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-[#E2DED9] tracking-wider">
                    CDR. MARCUS CHEN // ARES-VI
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00A3FF] px-2 py-0.5 rounded-md bg-[#0A1220] border border-[#00A3FF]/30">
                  EVA-03 // ACTIVE
                </span>
              </div>

              {/* Live telemetry metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                  <div className="text-[10px] font-mono text-[#817E7B] uppercase">Heart Rate</div>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-2xl font-mono font-bold text-[#E2DED9]">72</span>
                    <span className="text-xs font-mono text-[#00A3FF]">BPM</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">● NOMINAL (±2σ)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                  <div className="text-[10px] font-mono text-[#817E7B] uppercase">SpO2 Blood O2</div>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-2xl font-mono font-bold text-[#E2DED9]">98.4</span>
                    <span className="text-xs font-mono text-[#00A3FF]">%</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">● 101.3 kPa O2</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                  <div className="text-[10px] font-mono text-[#817E7B] uppercase">Core Temp</div>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-2xl font-mono font-bold text-[#E2DED9]">36.8</span>
                    <span className="text-xs font-mono text-[#00A3FF]">°C</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#817E7B]">98.2°F / STABLE</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                  <div className="text-[10px] font-mono text-[#817E7B] uppercase">Dosimetry Flux</div>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-2xl font-mono font-bold text-[#E2DED9]">0.42</span>
                    <span className="text-xs font-mono text-amber-400">mSv/d</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#817E7B]">GCR BACKGROUND</span>
                </div>
              </div>

              {/* Live Telemetry Downlink note */}
              <div className="p-2.5 rounded-xl bg-[#0A1220] border border-[#00A3FF]/20 text-[11px] font-mono text-[#00A3FF] flex items-center justify-between">
                <span>DOWNLINK: 1.0 Hz STREAM</span>
                <span className="text-[#817E7B]">LATENCY: 0.12s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
