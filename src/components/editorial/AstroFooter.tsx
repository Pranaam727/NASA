import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AstronautIllustration } from './AstronautIllustration';
import { ArrowUpRight, ShieldCheck, ExternalLink } from 'lucide-react';

export const AstroFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-[#111111] text-[#F2F0EA] pt-24 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-t-[36px]">
      {/* Starfield Pattern Overlay */}
      <div className="absolute inset-0 starfield-pattern opacity-60 pointer-events-none" />

      {/* Floating Astronaut in Footer */}
      <div className="absolute top-12 right-6 sm:right-16 opacity-30 pointer-events-none">
        <AstronautIllustration size="lg" floating={true} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-16">
        {/* ── Section 06 Final CTA: Keep Humans Healthy Wherever Humans Go ── */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#242424] border border-white/20 text-[#75D8DC] font-mono text-[10px] uppercase font-bold tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>THE HUMAN DEEP-SPACE FRONTIER</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F2F0EA] tracking-tight leading-[0.94] uppercase">
            KEEP HUMANS
            <br />
            HEALTHY.
            <br />
            <span className="text-[#FF6B35]">WHEREVER</span>
            <br />
            HUMANS GO.
          </h2>

          <p className="max-w-xl text-base sm:text-lg text-[#B8B8B3] font-body leading-relaxed">
            Every long-duration voyage beyond low Earth orbit depends on safeguarding the human system.
            AstroCare ensures astronauts remain medically resilient from launch to landing.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="px-8 py-4 bg-[#F2F0EA] text-[#111111] hover:bg-[#FFFFFF] font-mono font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-2 shadow-2xl hover:scale-[1.02]"
            >
              <span>ENTER ASTROCARE</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF6B35]" />
            </button>

            <Link
              to={ROUTES.AUTH}
              className="px-8 py-4 bg-[#242424] text-[#F2F0EA] hover:bg-[#333333] border border-white/10 font-mono font-bold text-xs rounded-full transition-all text-center"
            >
              PERSONNEL SIGN IN
            </Link>
          </div>
        </div>

        {/* ── Editorial Footer Link Grid ───────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10 font-mono text-xs">
          <div>
            <h4 className="text-[10px] font-bold text-[#888882] uppercase tracking-wider mb-4">
              HEALTH INTELLIGENCE
            </h4>
            <ul className="space-y-2.5 text-[#B8B8B3]">
              <li>
                <Link to={ROUTES.VITALS} className="hover:text-[#F2F0EA] transition-colors">
                  01 // Physiological Cockpit
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HEALTH_TWIN} className="hover:text-[#F2F0EA] transition-colors">
                  02 // 30-Day Health Twin
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SELF_ASSESSMENT} className="hover:text-[#F2F0EA] transition-colors">
                  03 // Daily Self-Check
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LABORATORY} className="hover:text-[#F2F0EA] transition-colors">
                  04 // Biomarker Assays
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-[#888882] uppercase tracking-wider mb-4">
              MISSION SYSTEMS
            </h4>
            <ul className="space-y-2.5 text-[#B8B8B3]">
              <li>
                <Link to={ROUTES.RADIATION} className="hover:text-[#F2F0EA] transition-colors">
                  05 // Radiation & PEL
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SPACE_HEALTH} className="hover:text-[#F2F0EA] transition-colors">
                  06 // Microgravity Workouts
                </Link>
              </li>
              <li>
                <Link to={ROUTES.EMERGENCY} className="hover:text-[#F2F0EA] transition-colors">
                  07 // Emergency Protocols
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SIMULATION} className="hover:text-[#F2F0EA] transition-colors">
                  08 // Stressor Simulator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-[#888882] uppercase tracking-wider mb-4">
              ROLE STATIONS
            </h4>
            <ul className="space-y-2.5 text-[#B8B8B3]">
              <li>
                <Link to={ROUTES.ASTRONAUT_DASHBOARD} className="hover:text-[#75D8DC] transition-colors">
                  Astronaut Cockpit (Cmdr. Chen)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.MEDICAL_DASHBOARD} className="hover:text-[#75D8DC] transition-colors">
                  Medical Operations (Dr. Vance)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.COMMANDER_DASHBOARD} className="hover:text-[#75D8DC] transition-colors">
                  Mission Readiness (Dir. Hayes)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AUTH} className="hover:text-[#FF6B35] transition-colors">
                  Role Access Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-[#888882] uppercase tracking-wider mb-4">
              RESEARCH PROVENANCE
            </h4>
            <ul className="space-y-2.5 text-[#B8B8B3]">
              <li>
                <a
                  href="https://humanresearchroadmap.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F2F0EA] transition-colors flex items-center space-x-1"
                >
                  <span>NASA HRP Roadmap</span>
                  <ExternalLink className="w-3 h-3 text-[#75D8DC]" />
                </a>
              </li>
              <li>
                <a
                  href="https://osdr.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F2F0EA] transition-colors flex items-center space-x-1"
                >
                  <span>NASA OSDR Data</span>
                  <ExternalLink className="w-3 h-3 text-[#75D8DC]" />
                </a>
              </li>
              <li>
                <Link to={ROUTES.RESEARCH} className="hover:text-[#F2F0EA] transition-colors">
                  Evidence Library
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REPORTS} className="hover:text-[#F2F0EA] transition-colors">
                  Clinical Flight Reports
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Regulatory & Mission Metadata ─────────────────── */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] font-mono text-[#888882] gap-4">
          <div>
            © 2026 ASTROCARE · HUMAN HEALTH BEYOND EARTH · NASA SPACE APPS CHALLENGE
          </div>
          <div className="max-w-md text-left md:text-right text-[10px]">
            Grounded biomedical intelligence architecture. Compliant with NASA-STD-3001 Level 1–3 telemetry parameters.
          </div>
        </div>
      </div>
    </footer>
  );
};
