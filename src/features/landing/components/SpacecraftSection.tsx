import React, { useState } from 'react';
import { SpacecraftCanvas } from '../3d/SpacecraftCanvas';
import { Compass, Stethoscope, Microscope, Satellite, Eye } from 'lucide-react';

interface StationModule {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  description: string;
  specs: string[];
}

const STATIONS: StationModule[] = [
  {
    id: 'medbay',
    name: 'DEEP SPACE MEDICAL STATION',
    role: 'Autonomous Clinical Intervention',
    icon: Stethoscope,
    description:
      'Equipped with diagnostic point-of-care ultrasound, 12-lead ECG tele-monitoring, sterile intravenous fluid reconstitution, and pharmaceutical stabilization lockers.',
    specs: ['Portable Ultrasound (Butterfly iQ+)', 'Blood Gas & Electrolyte Cartridges', 'Automated External Defibrillator'],
  },
  {
    id: 'biolab',
    name: 'MULTI-OMICS RESEARCH LAB',
    role: 'Molecular & Cytokine Profiling',
    icon: Microscope,
    description:
      'Conducts in-flight fingerstick capillary blood analysis, saliva immune stress markers, and DNA nanopore sequencing to measure telomere dynamics and viral reactivation.',
    specs: ['MinION DNA/RNA Sequencer', 'Centrifuge Micro-Hematocrit', 'Cryo-Quarantine Specimen Stowage'],
  },
  {
    id: 'telemetry',
    name: 'TELEMETRY DOWNLINK HUB',
    role: 'Deep Space Network (DSN) Pacing',
    icon: Satellite,
    description:
      'Synchronizes encrypted astronaut clinical dossiers with Mission Medical Control via Ka-band satellite downlinks, buffering packets during optical communications blackout.',
    specs: ['256-bit Encrypted Telemetry Pipe', 'Local Delay-Tolerant Storage', 'Autonomous Priority Queueing'],
  },
  {
    id: 'cupola',
    name: 'EARTH OBSERVATION CUPOLA',
    role: 'Circadian Reset & Psychological Refuge',
    icon: Eye,
    description:
      'A multi-window panoramic dome offering astronauts direct visual contact with Earth and the cosmos, counteracting confinement-induced psychological fatigue.',
    specs: ['Fused Silica Impact Windows', 'Integrated Blue-Depleted Lighting', 'Audiovisual Meditation Uplinks'],
  },
];

export const SpacecraftSection: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string>('medbay');

  const active = STATIONS.find((s) => s.id === selectedStation) || STATIONS[0];
  const Icon = active.icon;

  return (
    <section id="spacecraft" className="relative py-32 bg-[#05070B] overflow-hidden border-t border-slate-900">
      {/* 3D WebGL Spacecraft Interior Cupola Scene */}
      <SpacecraftCanvas />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/80 pointer-events-none z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              DEEP SPACE HABITAT ARCHITECTURE
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            THE SPACECRAFT
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              ENVIRONMENT.
            </span>
          </h2>

          <p className="text-slate-200 font-light text-base sm:text-lg leading-relaxed">
            "From Earth orbit to the lunar surface and the journey toward Mars, astronaut health
            remains mission-critical."
          </p>
        </div>

        {/* Spacecraft Subsystems Interactive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Station Selector Buttons */}
          <div className="lg:col-span-5 space-y-3">
            {STATIONS.map((station) => {
              const isSelected = station.id === selectedStation;
              const StationIcon = station.icon;
              return (
                <button
                  key={station.id}
                  onClick={() => setSelectedStation(station.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'glass-panel border-cyan-400 shadow-glowCyan'
                      : 'glass-panel-subtle border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-cyan-400'
                      }`}
                    >
                      <StationIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-space font-bold text-white">{station.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{station.role}</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-cyan-300' : 'text-slate-600'
                    }`}
                  >
                    ●
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Station Specs Card */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  {active.name}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                SYSTEM ONLINE
              </span>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {active.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                HARDWARE & INTEGRATED SPECIFICATIONS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {active.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono text-cyan-200"
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3 flex justify-between">
              <span>LOCATION: DEEP SPACE TRANSIT VEHICLE (DSTV)</span>
              <span className="text-cyan-400">CABIN PRESS: 101.3 kPa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
