import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Activity, ArrowUpRight, ExternalLink } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#262626] text-[#817E7B] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#00A3FF]/20 border border-[#00A3FF]/40 flex items-center justify-center text-[#00A3FF] shadow-glowCyan">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-space font-bold tracking-widest text-lg text-[#E2DED9]">
                ASTRO<span className="text-[#00A3FF]">CARE</span>
              </span>
            </div>

            <p className="text-sm text-[#C6C2BB] font-light max-w-sm leading-relaxed">
              Aerospace biomedical intelligence and health assessment platform designed for
              astronaut monitoring during lunar and Mars exploration missions.
            </p>

            <div className="text-xs font-mono text-[#00A3FF] p-3 rounded-xl bg-[#0A1220] border border-[#00A3FF]/30">
              An independent aerospace biomedical intelligence project developed for the NASA Space
              Apps Challenge.
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              EXPERIENCE
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="#overview"
                  onClick={(e) => handleScrollTo(e, '#overview')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Overview & Hero
                </a>
              </li>
              <li>
                <a
                  href="#hazards"
                  onClick={(e) => handleScrollTo(e, '#hazards')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Spaceflight Hazards
                </a>
              </li>
              <li>
                <a
                  href="#human-body"
                  onClick={(e) => handleScrollTo(e, '#human-body')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Holographic Anatomy
                </a>
              </li>
              <li>
                <a
                  href="#intelligence"
                  onClick={(e) => handleScrollTo(e, '#intelligence')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Biometric Intelligence
                </a>
              </li>
              <li>
                <a
                  href="#daily-mission"
                  onClick={(e) => handleScrollTo(e, '#daily-mission')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Mission Wellness
                </a>
              </li>
              <li>
                <a
                  href="#spacecraft"
                  onClick={(e) => handleScrollTo(e, '#spacecraft')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Spacecraft Cupola
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Routes */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              APPLICATION
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => navigate(ROUTES.OVERVIEW)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>Mission Control</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.VITALS)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>Vital Monitoring</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.SPACE_HEALTH)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>Deep Space Health</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.RADIATION)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>Radiation Dosimetry</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.INTELLIGENCE)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>AI Health Copilot</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.SIMULATION)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>Simulation Lab</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Provenance */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              PROVENANCE
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="https://humanresearchroadmap.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>NASA HRP Roadmap</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://osdr.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>NASA OSDR Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://genelab.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>NASA GeneLab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.REPORTS)}
                  className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                >
                  <span>Clinical Reports</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Safety Disclaimer */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <p>
            © 2026 ASTROCARE. All demonstration telemetry and simulated sensors are high-fidelity
            virtual models.
          </p>
          <div className="text-center md:text-right max-w-xl text-[11px] text-slate-500 leading-normal">
            Regulatory Disclaimer: AstroCare is an aerospace biomedical research and educational
            tool. It does not provide medical diagnoses or replace qualified NASA flight surgeons.
          </div>
        </div>
      </div>
    </footer>
  );
};
