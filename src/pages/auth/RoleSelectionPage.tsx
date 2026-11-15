import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { RoleSelectionCard } from '@/components/editorial/RoleSelectionCard';
import { User, Stethoscope, ShieldAlert, ShieldCheck, Radio, Orbit } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickDemoLogin = async (role: 'ASTRONAUT' | 'MEDICAL_OFFICER' | 'MISSION_COMMANDER') => {
    if (role === 'ASTRONAUT') {
      await login('ASTRONAUT', 'marcus.chen@nasa.ares6.gov', 'AstroPass2026!');
      navigate(ROUTES.ASTRONAUT_DASHBOARD);
    } else if (role === 'MEDICAL_OFFICER') {
      await login('MEDICAL_OFFICER', 'sarah.vance@esa.flightmed.org', 'FlightMed2026!', '884210');
      navigate(ROUTES.MEDICAL_DASHBOARD);
    } else {
      await login('MISSION_COMMANDER', 'gregory.hayes@nasa.ops.gov', 'Command2026!', '884210');
      navigate(ROUTES.COMMANDER_DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen bg-[#020807] text-[#F4FAF8] flex flex-col justify-between selection:bg-[#24E6D0] selection:text-[#020807] relative overflow-hidden font-body p-4 sm:p-6 lg:p-8 cyber-dots cyber-grid">
      {/* Ambient Lighting Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(36,230,208,0.12)_0%,_rgba(0,175,160,0.04)_40%,_transparent_70%)] pointer-events-none blur-3xl -z-10" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#24E6D0]/18">
        <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#071311] border border-[#24E6D0]/40 flex items-center justify-center text-[#24E6D0] group-hover:shadow-cyberGlow transition-all">
            <Orbit className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-extrabold text-sm tracking-widest text-[#F4FAF8]">
              ASTRO<span className="text-[#24E6D0]">CARE</span>
            </span>
            <span className="block font-mono text-[8px] uppercase tracking-wider text-[#91A9A4]">
              SPACE HEALTH INTELLIGENCE
            </span>
          </div>
        </Link>

        <Link
          to={ROUTES.HOME}
          className="px-4 py-1.5 text-xs font-mono font-semibold text-[#8BFFE9] hover:text-[#020807] hover:bg-[#24E6D0] bg-[#071311] border border-[#24E6D0]/30 rounded-full transition-all shadow-cyberGlow"
        >
          ← 3D EARTH EXPERIENCE
        </Link>
      </header>

      {/* Main Station Selection Content */}
      <main className="relative z-10 max-w-6xl mx-auto w-full py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-[#24E6D0]/30 text-[#8BFFE9] font-mono text-[10px] uppercase font-bold tracking-widest shadow-cyberGlow">
            <ShieldCheck className="w-3.5 h-3.5 text-[#24E6D0]" />
            <span>MISSION ACCESS PORTAL</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4FAF8] uppercase tracking-tight leading-[0.95]">
            ASTROCARE
            <span className="block text-[#91A9A4] text-xl sm:text-2xl font-normal mt-1">
              MISSION PERSONNEL ACCESS
            </span>
          </h1>

          <p className="font-body text-xs sm:text-sm text-[#91A9A4] leading-relaxed">
            Select your mission identity to access your dedicated health intelligence environment.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1 — ASTRONAUT */}
          <RoleSelectionCard
            clearanceLevel="CLEARANCE LEVEL 1 · FLIGHT CREW"
            title="Astronaut Access"
            description="Access your personal health monitoring cockpit, wellness assessments and mission health intelligence."
            icon={User}
            accentColor="#24E6D0"
            features={[
              'Personal Health Twin & 30-Day Envelope',
              'Daily 9-Step Self-Assessment',
              'ARED Exercise & Sleep Log',
            ]}
            continueRoute={ROUTES.ASTRONAUT_SIGNIN}
            buttonLabel="Continue as Astronaut"
            demoCallsign="Cmdr. Marcus Chen"
            demoRoleKey="ASTRONAUT"
            onQuickLogin={handleQuickDemoLogin}
          />

          {/* CARD 2 — MEDICAL OFFICER */}
          <RoleSelectionCard
            clearanceLevel="CLEARANCE LEVEL 2 · FLIGHT SURGEON"
            title="Medical Officer Access"
            description="Access crew health monitoring, medical assessments, laboratory intelligence and emergency workflows."
            icon={Stethoscope}
            accentColor="#00AFA0"
            features={[
              'Crew Biometric Triage Matrix',
              'In-Flight Lab Micro-Assays',
              'NASA-MED Emergency Protocols',
            ]}
            continueRoute={ROUTES.MEDICAL_SIGNIN}
            buttonLabel="Continue as Medical Officer"
            demoCallsign="Dr. Sarah Vance"
            demoRoleKey="MEDICAL_OFFICER"
            onQuickLogin={handleQuickDemoLogin}
          />

          {/* CARD 3 — MISSION COMMANDER */}
          <RoleSelectionCard
            clearanceLevel="CLEARANCE LEVEL 3 · FLIGHT DIRECTOR"
            title="Mission Commander Access"
            description="Access mission-level health readiness, crew oversight, radiation budgets and spacecraft environmental telemetry."
            icon={ShieldAlert}
            accentColor="#F5B94C"
            features={[
              'Crew Operational Readiness (98.4%)',
              'ECLSS Cabin Biosphere Telemetry',
              'Radiation Budget & PEL Tracking',
            ]}
            continueRoute={ROUTES.COMMANDER_SIGNIN}
            buttonLabel="Continue as Mission Commander"
            demoCallsign="Dir. Gregory Hayes"
            demoRoleKey="MISSION_COMMANDER"
            onQuickLogin={handleQuickDemoLogin}
          />
        </div>

        {/* Security & Confidentiality Footer */}
        <div className="mt-12 p-4 cyber-glass border border-[#24E6D0]/25 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-[#91A9A4] gap-3 shadow-cyberGlow">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#24E6D0] animate-pulse" />
            <span className="font-mono text-[11px] text-[#F4FAF8]">
              Ares-VI Deep Space Telemetry Link Active · End-to-End Cryptographically Sealed
            </span>
          </div>
          <div className="font-mono text-[10px] text-[#5B7B75]">
            NASA-STD-3001 & ESA Medical Data Privacy Enforced
          </div>
        </div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto w-full pt-4 border-t border-[#24E6D0]/18 text-center font-mono text-[10px] text-[#5B7B75]">
        NASA Space Apps Challenge 2026 · AstroCare Astronaut Health Intelligence System
      </footer>
    </div>
  );
};
