import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Wind, Thermometer, Droplets, Gauge, ArrowRight } from 'lucide-react';

interface CrewStatus {
  id: string;
  name: string;
  callsign: string;
  role: string;
  status: 'NOMINAL' | 'OBSERVATION' | 'RESTRICTED';
  heartRate: number;
  radiation: number;
  lastCheckin: string;
}

export const MissionIntelligenceSection: React.FC = () => {
  const crew: CrewStatus[] = [
    {
      id: 'ASTRO-01',
      name: 'Cmdr. Marcus Chen',
      callsign: 'ARES-LEAD',
      role: 'Mission Commander',
      status: 'NOMINAL',
      heartRate: 64,
      radiation: 128.4,
      lastCheckin: 'Today, 08:30 UTC',
    },
    {
      id: 'ASTRO-02',
      name: 'Dr. Sarah Vance',
      callsign: 'FLIGHT-MED',
      role: 'Lead Flight Surgeon',
      status: 'NOMINAL',
      heartRate: 68,
      radiation: 119.2,
      lastCheckin: 'Today, 08:15 UTC',
    },
    {
      id: 'ASTRO-03',
      name: 'Lt. Col. Elena Rostova',
      callsign: 'PILOT-01',
      role: 'Command Pilot',
      status: 'OBSERVATION',
      heartRate: 74,
      radiation: 142.1,
      lastCheckin: 'Today, 07:45 UTC',
    },
    {
      id: 'ASTRO-04',
      name: 'Dr. Kenji Sato',
      callsign: 'SCIENCE-01',
      role: 'Payload Specialist',
      status: 'NOMINAL',
      heartRate: 62,
      radiation: 134.6,
      lastCheckin: 'Today, 07:10 UTC',
    },
  ];

  const eclss = [
    { label: 'CABIN PRESSURE', val: '101.3', unit: 'kPa', status: 'NOMINAL', icon: Gauge },
    { label: 'OXYGEN PARTIAL (pO2)', val: '21.2', unit: 'kPa', status: 'NOMINAL', icon: Wind },
    { label: 'CARBON DIOXIDE (pCO2)', val: '0.38', unit: 'kPa', status: 'NOMINAL', icon: Wind },
    { label: 'CABIN TEMPERATURE', val: '21.5', unit: '°C', status: 'NOMINAL', icon: Thermometer },
    { label: 'RELATIVE HUMIDITY', val: '46.0', unit: '%', status: 'NOMINAL', icon: Droplets },
  ];

  return (
    <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#020807] border-t border-[#24E6D0]/15 relative cyber-grid">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-[#24E6D0]/30 text-[#24E6D0] font-mono text-[10px] uppercase font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0]" />
            <span>SECTION 04 // EXPEDITION FLIGHT SURGEON & COMMAND STATION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F4FAF8] tracking-tight leading-[0.95] uppercase">
                ONE MISSION.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24E6D0] to-[#8BFFE9]">
                  COMPLETE HEALTH VISIBILITY.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#91A9A4] leading-relaxed">
                Aggregating biometrics across the 4-person Ares-VI crew, environmental spacecraft telemetry, and radiation dosimeters into an operational triage matrix.
              </p>
            </div>
          </div>
        </div>

        {/* Crew Readiness Triage Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#91A9A4]">
            <span className="text-[#24E6D0] uppercase font-bold tracking-wider">CREW TRIAGE MATRIX // SOL 142</span>
            <span>4 OF 4 CREW MEMBERS SYNCHRONIZED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crew.map((c) => {
              const isNominal = c.status === 'NOMINAL';
              return (
                <div
                  key={c.id}
                  className="cyber-glass-glow p-5 rounded-2xl border border-[#24E6D0]/20 hover:border-[#24E6D0] transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#5B7B75] uppercase">{c.id}</span>
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isNominal
                          ? 'bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30'
                          : 'bg-[#F5B94C]/15 text-[#F5B94C] border border-[#F5B94C]/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-[#F4FAF8] tracking-tight">{c.name}</h4>
                    <span className="font-mono text-[10px] text-[#91A9A4] block mt-0.5">{c.role} ({c.callsign})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#24E6D0]/15 font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-[#5B7B75] block">HEART RATE</span>
                      <span className="font-bold text-[#F4FAF8]">{c.heartRate} <span className="text-[9px] font-normal text-[#91A9A4]">BPM</span></span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#5B7B75] block">RAD ACCUM</span>
                      <span className="font-bold text-[#8BFFE9]">{c.radiation} <span className="text-[9px] font-normal text-[#91A9A4]">mSv</span></span>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono text-[#5B7B75] pt-1">
                    Check-in: {c.lastCheckin}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ECLSS Spacecraft Life Support Telemetry Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-[#91A9A4]">
            <span className="text-[#8BFFE9] uppercase font-bold tracking-wider">ECLSS CABIN BIOSPHERE TELEMETRY</span>
            <span>HABITAT MODULE B · ACTIVE LIFE SUPPORT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {eclss.map((e, idx) => {
              const Icon = e.icon;
              return (
                <div key={idx} className="cyber-glass p-3.5 rounded-xl border border-[#24E6D0]/20 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#24E6D0]">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] text-[#5B7B75] uppercase truncate">{e.label}</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-mono font-bold text-lg text-[#F4FAF8]">{e.val}</span>
                    <span className="font-mono text-[10px] text-[#91A9A4]">{e.unit}</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#24E6D0] font-semibold">{e.status}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashboard Link Banner */}
        <div className="p-6 rounded-2xl cyber-glass-glow border border-[#24E6D0]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-lg text-[#F4FAF8]">
              Ready to explore role-authorized clinical operations?
            </h4>
            <p className="font-body text-xs text-[#91A9A4] mt-0.5">
              Switch between Astronaut, Medical Officer, and Mission Commander command workstations.
            </p>
          </div>
          <Link
            to={ROUTES.AUTH}
            className="px-6 py-2.5 rounded-full font-mono text-xs font-bold bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] transition-all flex items-center space-x-2 shrink-0 shadow-cyberGlow"
          >
            <span>SELECT STATION ROLE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
