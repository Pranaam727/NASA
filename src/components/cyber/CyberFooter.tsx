import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Orbit, ShieldCheck, Radio } from 'lucide-react';

export const CyberFooter: React.FC = () => {
  return (
    <footer className="bg-[#020807] border-t border-[#24E6D0]/15 py-16 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid: Logo + Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#071311] border border-[#24E6D0]/40 flex items-center justify-center text-[#24E6D0] group-hover:shadow-cyberGlow transition-all">
                <Orbit className="w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-extrabold text-lg tracking-widest text-[#F4FAF8]">
                  ASTRO<span className="text-[#24E6D0]">CARE</span>
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#91A9A4]">
                  HUMAN HEALTH BEYOND EARTH
                </span>
              </div>
            </Link>

            <p className="font-body text-xs text-[#91A9A4] max-w-sm leading-relaxed">
              Autonomous astronaut biomedical intelligence platform for long-duration deep space exploration. Built to NASA Space Apps Challenge & NASA STD-3001 operational standards.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#071311] border border-[#24E6D0]/20 font-mono text-[9px] text-[#24E6D0]">
                <Radio className="w-3 h-3 text-[#24E6D0]" />
                <span>MARS RELAY: ONLINE</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#071311] border border-[#24E6D0]/20 font-mono text-[9px] text-[#8BFFE9]">
                <ShieldCheck className="w-3 h-3 text-[#8BFFE9]" />
                <span>STD-3001 COMPLIANT</span>
              </span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase font-bold text-[#24E6D0] tracking-wider">
              CREW WORKSTATIONS
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#91A9A4]">
              <li>
                <Link to={ROUTES.ASTRONAUT_DASHBOARD} className="hover:text-[#24E6D0] transition-colors">
                  Astronaut Cockpit
                </Link>
              </li>
              <li>
                <Link to={ROUTES.MEDICAL_DASHBOARD} className="hover:text-[#24E6D0] transition-colors">
                  Medical Officer Station
                </Link>
              </li>
              <li>
                <Link to={ROUTES.COMMANDER_DASHBOARD} className="hover:text-[#24E6D0] transition-colors">
                  Commander Deck
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AUTH} className="hover:text-[#24E6D0] transition-colors">
                  Station Identity Selector
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase font-bold text-[#24E6D0] tracking-wider">
              BIOMEDICAL MODULES
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#91A9A4]">
              <li>
                <Link to={ROUTES.HEALTH_TWIN} className="hover:text-[#24E6D0] transition-colors">
                  Personal Health Twin
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SELF_ASSESSMENT} className="hover:text-[#24E6D0] transition-colors">
                  Daily Assessment Check-In
                </Link>
              </li>
              <li>
                <Link to={ROUTES.EMERGENCY} className="hover:text-[#24E6D0] transition-colors">
                  Emergency Medical Protocols
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LABORATORY} className="hover:text-[#24E6D0] transition-colors">
                  Biomarker Laboratory Assays
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SIMULATION} className="hover:text-[#24E6D0] transition-colors">
                  Telemetry Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase font-bold text-[#24E6D0] tracking-wider">
              STANDARDS & COMPLIANCE
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#91A9A4]">
              <li className="flex items-center space-x-1.5">
                <span>NASA-STD-3001 Vol 1 & 2</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>Deterministic Offline Mode</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>HIPAA / Common Rule Isolated</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>236 Automated Clinical Tests</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Technical Telemetry Bar */}
        <div className="pt-8 border-t border-[#24E6D0]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-[#5B7B75]">
          <div className="flex items-center space-x-3">
            <span>EXPEDITION ARES-VI</span>
            <span>·</span>
            <span>SOL 142 TRANSIT</span>
            <span>·</span>
            <span className="text-[#24E6D0]">CORE VER: 4.8.2-CYBER</span>
          </div>
          <div>
            AstroCare © 2026. All telemetry simulated or ground-referenced per NASA HRP guidelines.
          </div>
        </div>
      </div>
    </footer>
  );
};
