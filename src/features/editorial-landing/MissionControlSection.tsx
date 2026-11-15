import React from 'react';
import { SectionReveal } from '@/components/editorial/SectionReveal';
import { CrewStatusCard, CrewMemberData } from '@/components/editorial/CrewStatusCard';
import { MissionTelemetry } from '@/components/editorial/MissionTelemetry';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Orbit, ArrowUpRight } from 'lucide-react';

export const MissionControlSection: React.FC = () => {
  const crew: CrewMemberData[] = [
    {
      id: 'ASTRO-01',
      name: 'Cmdr. Marcus Chen',
      callsign: 'ARES-LEAD',
      role: 'Mission Commander',
      status: 'NOMINAL',
      heartRate: 64,
      radiationDose: 142.4,
      lastAssessment: 'Today, 07:30 UTC',
      activeAlertCount: 0,
    },
    {
      id: 'ASTRO-02',
      name: 'Dr. Elena Rostova',
      callsign: 'CHRONOS',
      role: 'Flight Surgeon & Science Specialist',
      status: 'NOMINAL',
      heartRate: 68,
      radiationDose: 139.1,
      lastAssessment: 'Today, 08:15 UTC',
      activeAlertCount: 0,
    },
    {
      id: 'ASTRO-03',
      name: 'Lt. Tariq Vance',
      callsign: 'HORIZON',
      role: 'Systems Engineer & EVA Specialist',
      status: 'CAUTION',
      heartRate: 78,
      radiationDose: 151.8,
      lastAssessment: 'Today, 06:45 UTC',
      activeAlertCount: 1, // SANS optic disc blur
    },
    {
      id: 'ASTRO-04',
      name: 'Spec. Maya Lin',
      callsign: 'PULSAR',
      role: 'Orbital Navigator & Robotics Lead',
      status: 'NOMINAL',
      heartRate: 62,
      radiationDose: 134.6,
      lastAssessment: 'Today, 07:10 UTC',
      activeAlertCount: 0,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-t border-[#DCD8CD]">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <SectionReveal className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2F0EA] border border-[#111111] text-[#111111] font-mono text-[10px] uppercase font-bold tracking-widest">
            <Orbit className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>SECTION 05 // MISSION-LEVEL HEALTH READINESS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#111111] tracking-tight leading-[0.92] uppercase">
                MISSION
                <br />
                CONTROL &
                <br />
                <span className="text-[#FF6B35]">READINESS.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#444444] leading-relaxed">
                Empowering flight surgeons and mission directors with multi-crew health triage, real-time life support telemetry, and grounded risk projections.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Crew Readiness Overview Bar */}
        <div className="p-6 rounded-2xl bg-[#111111] text-[#F2F0EA] shadow-editorial flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#75D8DC]">
              ARES-VI EXPEDITION READINESS
            </span>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#F2F0EA]">
              98.4% MISSION HEALTH COMPLIANCE
            </div>
            <div className="font-mono text-xs text-[#B8B8B3]">
              3 of 4 crew members fully nominal · 1 crew member under clinical post-EVA observation
            </div>
          </div>

          <Link
            to={ROUTES.COMMANDER_DASHBOARD}
            className="px-6 py-3.5 bg-[#FF6B35] hover:bg-[#E05A25] text-[#F2F0EA] font-mono text-xs font-bold rounded-full transition-all flex items-center space-x-2 shadow-lg shrink-0"
          >
            <span>LAUNCH COMMANDER DECK</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Crew Status Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#888882]">
            <span className="font-bold text-[#111111] uppercase tracking-wider">CREW TRIAGE MATRIX</span>
            <span>SOL 142 · SYNCHRONIZED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crew.map((member) => (
              <CrewStatusCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Spacecraft Telemetry (ECLSS) */}
        <div>
          <MissionTelemetry />
        </div>
      </div>
    </section>
  );
};
