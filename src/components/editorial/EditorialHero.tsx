import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AstronautIllustration } from './AstronautIllustration';
import { PlanetIllustration } from './PlanetIllustration';
import { SpaceBlob } from './SpaceBlob';
import { MissionStatus } from './MissionStatus';
import { ArrowDown, ArrowUpRight, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const EditorialHero: React.FC = () => {
  const navigate = useNavigate();

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.querySelector('#challenge');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="mission"
      className="relative min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden"
    >
      {/* ── Background Organic Star-field Blobs ───────────────────── */}
      <div className="absolute -top-12 -left-20 pointer-events-none opacity-40 lg:opacity-60 z-0">
        <SpaceBlob variant="medium" animate={true} />
      </div>
      <div className="absolute top-1/4 -right-24 pointer-events-none opacity-30 lg:opacity-75 z-0">
        <SpaceBlob variant="large" animate={true} />
      </div>
      <div className="absolute -bottom-24 left-1/3 pointer-events-none opacity-20 z-0">
        <SpaceBlob variant="small" animate={false} />
      </div>

      {/* ── Top Status Banner ────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#111111] text-[#111111] font-mono text-[10px] uppercase font-bold tracking-widest shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>AEROSPACE BIOMEDICAL INTELLIGENCE · DEEP SPACE OPS</span>
        </div>

        <div className="xl:hidden">
          <MissionStatus variant="pill" />
        </div>
      </div>

      {/* ── Main Hero Composition (Grid: Left Astronaut / Center Stacked Title / Right Planet) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Small Astronaut Illustration & Quick Badges */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-start justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <AstronautIllustration size="md" floating={true} />
              
              <div className="mt-4 p-3 bg-[#FFFFFF] border border-[#111111] rounded-xl shadow-subtle font-mono text-[10px] space-y-1">
                <div className="text-[#888882] uppercase tracking-wider">CREW PHYSIOLOGY</div>
                <div className="font-bold text-[#111111] flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#75D8DC]" />
                  <span>CDR. MARCUS CHEN</span>
                </div>
                <div className="text-[#FF6B35] font-semibold">EVA-03 COMPLETED</div>
              </div>
            </motion.div>
          </div>

          {/* Center: Enormous Stacked Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-[#111111] uppercase"
            >
              THE HUMAN
              <br />
              BODY WAS NOT
              <br />
              <span className="relative inline-block">
                BUILT FOR
                {/* Diagonal Highlight Strikethrough Motif */}
                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#FF6B35]/25 -rotate-1 rounded" />
              </span>
              <br />
              <span className="text-[#111111] drop-shadow-sm">SPACE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl text-sm sm:text-base lg:text-lg text-[#444444] font-body leading-relaxed mx-auto lg:mx-0 pt-2"
            >
              AstroCare transforms astronaut health data into mission-ready intelligence,
              helping crews monitor, understand, and respond to the physiological challenges of spaceflight.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4"
            >
              <button
                type="button"
                onClick={handleExplore}
                className="w-full sm:w-auto px-7 py-4 rounded-full text-xs font-mono font-bold tracking-wider text-[#F2F0EA] bg-[#111111] hover:bg-[#242424] transition-all shadow-editorial hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <span>EXPLORE ASTROCARE</span>
                <ArrowDown className="w-4 h-4 text-[#75D8DC] animate-bounce" />
              </button>

              <button
                type="button"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="w-full sm:w-auto px-7 py-4 rounded-full text-xs font-mono font-bold tracking-wider text-[#111111] bg-[#FFFFFF] border-2 border-[#111111] hover:bg-[#111111] hover:text-[#F2F0EA] transition-all shadow-subtle hover:scale-[1.02] flex items-center justify-center space-x-2 group"
              >
                <span>ENTER MISSION CONTROL</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF6B35] group-hover:text-[#75D8DC] transition-colors" />
              </button>
            </motion.div>
          </div>

          {/* Right: Large Ringed Planet & Floating Astronaut */}
          <div className="lg:col-span-4 relative flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15 }}
              className="relative w-full flex items-center justify-center"
            >
              {/* Saturn-like ringed planet */}
              <PlanetIllustration size="hero" />

              {/* Floating Astronaut in Front of Planet Orbit */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 lg:-right-4">
                <AstronautIllustration size="md" floating={true} />
              </div>

              {/* Floating Telemetry Stamp */}
              <div className="absolute top-4 left-0 sm:left-4 p-3 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#111111] rounded-xl shadow-editorial font-mono text-[10px]">
                <div className="flex items-center space-x-1.5 text-[#FF6B35]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="font-bold">PEL CEILING: 600 mSv</span>
                </div>
                <div className="text-[#111111] font-bold mt-0.5 tabular-nums">CURRENT: 142.4 mSv</div>
                <div className="text-[#888882] text-[9px]">GCR ACTIVE MITIGATION</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom Strip: Mission Metrics Ticker ──────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-10 border-t border-[#DCD8CD]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-[#FFFFFF] border border-[#DCD8CD] rounded-xl shadow-subtle">
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#888882]">ASTRONAUT MONITORED</div>
            <div className="font-display font-bold text-xl text-[#111111] tabular-nums mt-0.5">04 CREW</div>
            <div className="font-mono text-[10px] text-[#75D8DC]">100% SENSOR ENVELOPE</div>
          </div>

          <div className="p-3 bg-[#FFFFFF] border border-[#DCD8CD] rounded-xl shadow-subtle">
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#888882]">MISSION PROFILE</div>
            <div className="font-display font-bold text-xl text-[#111111] mt-0.5">LUNAR / MARS</div>
            <div className="font-mono text-[10px] text-[#444444]">NASA-STD-3001 ALIGNED</div>
          </div>

          <div className="p-3 bg-[#FFFFFF] border border-[#DCD8CD] rounded-xl shadow-subtle">
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#888882]">ANOMALY DETECTION</div>
            <div className="font-display font-bold text-xl text-[#111111] tabular-nums mt-0.5">&gt;2σ DELTA</div>
            <div className="font-mono text-[10px] text-[#FF6B35]">GROUNDED DECISION ENGINE</div>
          </div>

          <div className="p-3 bg-[#FFFFFF] border border-[#DCD8CD] rounded-xl shadow-subtle">
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#888882]">AUTONOMOUS SYSTEM</div>
            <div className="font-display font-bold text-xl text-[#111111] mt-0.5">LOCAL ZERO-FAIL</div>
            <div className="font-mono text-[10px] text-[#75D8DC]">OFFLINE PROTOCOLS READY</div>
          </div>
        </div>
      </div>
    </section>
  );
};
