import React, { useState } from 'react';
import { Heart, Activity, Brain, ShieldAlert, Moon, Info } from 'lucide-react';

export type BodySystemKey = 'cardiovascular' | 'musculoskeletal' | 'neurological' | 'immune' | 'sleep';

interface SystemDetails {
  key: BodySystemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  nominalBand: string;
  flightObserved: string;
  status: 'NOMINAL' | 'CAUTION' | 'STABILIZED';
  metrics: Array<{ name: string; value: string; delta: string; unit: string; isReal: boolean }>;
  adaptationNotes: string;
}

export const HolographicHuman3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeSystem, setActiveSystem] = useState<BodySystemKey>('cardiovascular');

  const systems: Record<BodySystemKey, SystemDetails> = {
    cardiovascular: {
      key: 'cardiovascular',
      label: 'Cardiovascular System',
      icon: Heart,
      tagline: 'Cephalad Fluid Redistribution & Orthostatic Readjustment',
      nominalBand: 'HR 55-85 BPM · MAP 70-105 mmHg',
      flightObserved: 'Resting HR 64 BPM · MAP 82 mmHg',
      status: 'NOMINAL',
      metrics: [
        { name: 'Resting Heart Rate', value: '64', delta: '0.0σ', unit: 'BPM', isReal: true },
        { name: 'Arterial Oxygenation (SpO2)', value: '98.4', delta: '+0.2%', unit: '%', isReal: true },
        { name: 'Systolic Blood Pressure', value: '114', delta: '-4 mmHg', unit: 'mmHg', isReal: true },
        { name: 'Stroke Volume Index', value: '44', delta: '+3.1%', unit: 'mL/m²', isReal: false },
      ],
      adaptationNotes:
        'Cephalad fluid shift of ~1.8L from lower extremities to thoracic/head cavities observed on Sol 142. Baroreceptor resetting complete; central venous pressure within ground-projected tolerance.',
    },
    musculoskeletal: {
      key: 'musculoskeletal',
      label: 'Musculoskeletal System',
      icon: Activity,
      tagline: 'Bone Mineral Density Attenuation & Spinal Elongation',
      nominalBand: 'BMD Loss < 1.0%/mo · Spine +1.5 to +3.5cm',
      flightObserved: 'BMD -0.38%/mo · Spine +2.4 cm',
      status: 'STABILIZED',
      metrics: [
        { name: 'Trabecular Bone Loss', value: '-0.38', delta: 'Safe Band', unit: '%/month', isReal: true },
        { name: 'ARED Adherence Rate', value: '100', delta: '6 of 6 Sols', unit: '%', isReal: true },
        { name: 'Max Grip Strength', value: '48.2', delta: '-0.8 kg', unit: 'kg', isReal: true },
        { name: 'Spinal Elongation', value: '+2.4', delta: 'Nominal', unit: 'cm', isReal: false },
      ],
      adaptationNotes:
        'Advanced Resistive Exercise Device (ARED) squats and deadlifts successfully arresting deconditioning. Calcaneal ultrasound shows preserved osteocyte density.',
    },
    neurological: {
      key: 'neurological',
      label: 'Neurological & Ocular (SANS)',
      icon: Brain,
      tagline: 'Spaceflight-Associated Neuro-Ocular Syndrome & Cognitive Velocity',
      nominalBand: 'Optic Disc Edema: Grade 0 · Reaction Time < 280ms',
      flightObserved: 'Optic Disc: Grade 0 · Reaction Time 244ms',
      status: 'NOMINAL',
      metrics: [
        { name: 'OCT Choroidal Folds', value: '0', delta: 'Absent', unit: 'count', isReal: true },
        { name: 'Psychomotor Vigilance (PVT)', value: '244', delta: '-12 ms', unit: 'ms', isReal: true },
        { name: 'Intraocular Pressure', value: '15.2', delta: '+1.1 mmHg', unit: 'mmHg', isReal: true },
        { name: 'Cognitive Throughput', value: '96.2', delta: 'High Focus', unit: '%', isReal: false },
      ],
      adaptationNotes:
        'Fundoscopic imaging confirms zero optic disc swelling. Cognitive psychomotor vigilance testing (PVT) remains in top 5% mission quadrant.',
    },
    immune: {
      key: 'immune',
      label: 'Immune & Cytokine Profile',
      icon: ShieldAlert,
      tagline: 'T-Cell Subpopulation Shift & Latent Viral Reactivation',
      nominalBand: 'IL-6 < 6.0 pg/mL · TNF-α < 8.2 pg/mL',
      flightObserved: 'IL-6 3.8 pg/mL · TNF-α 4.6 pg/mL',
      status: 'NOMINAL',
      metrics: [
        { name: 'Interleukin-6 (IL-6)', value: '3.8', delta: 'Nominal', unit: 'pg/mL', isReal: true },
        { name: 'Tumor Necrosis Factor-α', value: '4.6', delta: 'Nominal', unit: 'pg/mL', isReal: true },
        { name: 'High-Sensitivity CRP', value: '0.84', delta: 'Low Risk', unit: 'mg/L', isReal: true },
        { name: 'EBV / VZV DNA Shedding', value: 'ND', delta: 'Negative', unit: 'copies', isReal: true },
      ],
      adaptationNotes:
        'No reactivation of Epstein-Barr or Varicella Zoster virus in saliva assays. Pro-inflammatory cytokines remain stabilized beneath clinical alarm threshold.',
    },
    sleep: {
      key: 'sleep',
      label: 'Sleep & Circadian Clock',
      icon: Moon,
      tagline: 'Polysomnography & Circadian Phase Alignment in Habitat Module',
      nominalBand: 'Total Sleep > 7.0h · Slow-Wave Sleep > 18%',
      flightObserved: 'Average Sleep: 7.8h · SWS: 21.4%',
      status: 'NOMINAL',
      metrics: [
        { name: '7-Sol Sleep Average', value: '7.8', delta: '+0.4h', unit: 'hours', isReal: true },
        { name: 'Slow-Wave Sleep (SWS)', value: '21.4', delta: '+1.6%', unit: '%', isReal: true },
        { name: 'REM Stage Fraction', value: '22.8', delta: 'Optimal', unit: '%', isReal: true },
        { name: 'Circadian Light Sync', value: '480', delta: 'Module B', unit: 'lux blue', isReal: false },
      ],
      adaptationNotes:
        'High-density sleep architecture maintained with habitat Module B 480nm circadian lighting schedule. Zero hypnotic sedative use recorded over past 14 Sols.',
    },
  };

  const curr = systems[activeSystem];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${className}`}>
      {/* System Selector Tab Column */}
      <div className="lg:col-span-4 space-y-2.5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#91A9A4] block">
          SELECT BIOMEDICAL SYSTEM ENVELOPE
        </span>
        {(Object.keys(systems) as BodySystemKey[]).map((key) => {
          const sys = systems[key];
          const Icon = sys.icon;
          const isActive = activeSystem === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSystem(key)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-[#0D1D1B] border-[#24E6D0] shadow-cyberGlow text-[#F4FAF8]'
                  : 'bg-[#071311] border-[#24E6D0]/15 hover:border-[#24E6D0]/40 text-[#91A9A4]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#24E6D0] text-[#020807]' : 'bg-[#0A1716] text-[#24E6D0]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight">{sys.label}</h4>
                  <span className="font-mono text-[10px] text-[#5B7B75] uppercase">{sys.status}</span>
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-[#24E6D0] shadow-[0_0_8px_#24E6D0]' : 'bg-[#5B7B75]'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Holographic Body Centerpiece Visual */}
      <div className="lg:col-span-4 relative flex items-center justify-center min-h-[380px] cyber-glass-glow rounded-2xl p-6 border border-[#24E6D0]/30 overflow-hidden">
        {/* Hologram scanlines & ambient glow */}
        <div className="absolute inset-0 cyber-scanlines opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(36,230,208,0.18)_0%,_transparent_70%)] pointer-events-none" />

        {/* Vector Holographic Human Silhouette with Dynamic Sensor Nodes */}
        <div className="relative w-48 h-80 flex items-center justify-center">
          <svg viewBox="0 0 100 200" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(36,230,208,0.4)]">
            {/* Body Contour Line */}
            <path
              d="M 50 15 C 55 15, 59 19, 59 25 C 59 31, 55 35, 50 35 C 45 35, 41 31, 41 25 C 41 19, 45 15, 50 15 Z
                 M 45 37 L 32 44 L 20 80 L 26 82 L 36 52 L 40 50 L 40 100 L 32 145 L 34 185 L 44 185 L 46 120 L 50 105 L 54 120 L 56 185 L 66 185 L 68 145 L 60 100 L 60 50 L 64 52 L 74 82 L 80 80 L 68 44 L 55 37 Z"
              fill="rgba(36, 230, 208, 0.08)"
              stroke="#24E6D0"
              strokeWidth="1.2"
              strokeDasharray="2 1"
            />

            {/* Anatomical Indicator Nodes based on active system */}
            {activeSystem === 'cardiovascular' && (
              <g className="animate-pulse">
                <circle cx="53" cy="58" r="6" fill="rgba(255, 100, 110, 0.3)" stroke="#FF646E" strokeWidth="2" />
                <circle cx="53" cy="58" r="2.5" fill="#FF646E" />
                {/* Arterial branch traces */}
                <path d="M 53 58 L 50 80 M 53 58 L 53 38 M 53 58 L 36 50 M 53 58 L 64 50" stroke="#FF646E" strokeWidth="1" strokeDasharray="1 1" />
              </g>
            )}

            {activeSystem === 'musculoskeletal' && (
              <g>
                <circle cx="50" cy="70" r="4" fill="#24E6D0" />
                <line x1="50" y1="36" x2="50" y2="100" stroke="#8BFFE9" strokeWidth="2.5" />
                <circle cx="38" cy="115" r="4" fill="#F5B94C" />
                <circle cx="62" cy="115" r="4" fill="#F5B94C" />
                <circle cx="36" cy="150" r="3" fill="#24E6D0" />
                <circle cx="64" cy="150" r="3" fill="#24E6D0" />
              </g>
            )}

            {activeSystem === 'neurological' && (
              <g className="animate-pulse">
                <circle cx="50" cy="24" r="5" fill="rgba(139, 255, 233, 0.4)" stroke="#8BFFE9" strokeWidth="1.5" />
                <circle cx="48" cy="22" r="1.5" fill="#FFFFFF" />
                <circle cx="52" cy="22" r="1.5" fill="#FFFFFF" />
                <path d="M 50 25 L 50 48" stroke="#8BFFE9" strokeWidth="1.5" />
              </g>
            )}

            {activeSystem === 'immune' && (
              <g>
                <circle cx="45" cy="54" r="4" fill="#00AFA0" />
                <circle cx="55" cy="54" r="4" fill="#00AFA0" />
                <circle cx="50" cy="78" r="5" fill="#24E6D0" />
                <circle cx="34" cy="98" r="3" fill="#00AFA0" />
                <circle cx="66" cy="98" r="3" fill="#00AFA0" />
              </g>
            )}

            {activeSystem === 'sleep' && (
              <g className="animate-pulse">
                <circle cx="50" cy="23" r="6" fill="rgba(36, 230, 208, 0.3)" stroke="#24E6D0" strokeWidth="1.5" />
                <path d="M 40 20 Q 50 14 60 20" stroke="#8BFFE9" strokeWidth="1.5" fill="none" />
              </g>
            )}
          </svg>
        </div>

        {/* System Name Holographic Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#91A9A4] bg-[#020807]/80 px-3 py-1.5 rounded-lg border border-[#24E6D0]/20">
          <span className="text-[#24E6D0] uppercase font-bold">{curr.label}</span>
          <span>HOLO-TWIN V4.8</span>
        </div>
      </div>

      {/* Selected System Telemetry & Clinical Insight Card */}
      <div className="lg:col-span-4 space-y-4">
        <div className="cyber-glass-glow p-5 rounded-2xl border border-[#24E6D0]/30 space-y-4">
          <div className="border-b border-[#24E6D0]/15 pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#24E6D0] uppercase font-bold tracking-widest">
                CLINICAL TWIN ANALYSIS
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30">
                {curr.status}
              </span>
            </div>
            <h3 className="font-display font-extrabold text-lg text-[#F4FAF8] mt-1">{curr.label}</h3>
            <p className="font-body text-xs text-[#91A9A4] mt-0.5">{curr.tagline}</p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            {curr.metrics.map((m, idx) => (
              <div key={idx} className="bg-[#020807]/60 p-2.5 rounded-xl border border-[#24E6D0]/15">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#5B7B75] uppercase truncate">
                  <span className="truncate">{m.name}</span>
                  {m.isReal ? (
                    <span className="text-[#24E6D0] ml-1 shrink-0 font-bold" title="Live Telemetry Sensor">LIVE</span>
                  ) : (
                    <span className="text-[#91A9A4] ml-1 shrink-0" title="Ground Clinical Model">MODEL</span>
                  )}
                </div>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="font-mono font-bold text-lg text-[#F4FAF8] tabular-nums">{m.value}</span>
                  <span className="font-mono text-[10px] text-[#91A9A4]">{m.unit}</span>
                </div>
                <div className="font-mono text-[9px] text-[#8BFFE9] mt-0.5">{m.delta}</div>
              </div>
            ))}
          </div>

          {/* Clinical Flight Surgeon Observation */}
          <div className="p-3 bg-[#071311] rounded-xl border border-[#24E6D0]/20 text-xs font-mono text-[#91A9A4] leading-relaxed">
            <div className="flex items-center space-x-1.5 text-[#24E6D0] text-[10px] font-bold uppercase mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>FLIGHT SURGEON NOTE</span>
            </div>
            {curr.adaptationNotes}
          </div>
        </div>
      </div>
    </div>
  );
};
