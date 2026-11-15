import React, { useState } from 'react';
import { Radio, Cpu, BrainCircuit, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StageData {
  num: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  description: string;
  inputs: string[];
  output: string;
}

const STAGES: StageData[] = [
  {
    num: '01',
    title: 'MEASURE',
    tagline: 'Continuous Multimodal Sensor Ingest',
    icon: Radio,
    description:
      'Wearable biosensors, smart patches, and habitat telemetry ingest continuous 50Hz ECG, arterial pressure pulses, optical core temperature, and actigraphy sleep metrics.',
    inputs: ['50Hz Lead-II ECG', 'Optical Photoplethysmography', 'Dosimeter Flux Rates', 'Subjective Sol Check-Ins'],
    output: 'Normalized telemetry packets validated against strict Zod invariant schemas.',
  },
  {
    num: '02',
    title: 'ANALYZE',
    tagline: 'Statistical Baseline Delta Modeling',
    icon: Cpu,
    description:
      'Deterministic biomedical algorithms compare streaming telemetry against each astronaut’s established pre-flight 30-day baseline envelope, filtering microgravity noise artifacts.',
    inputs: ['Pre-Flight Baseline (μ ± 2σ)', 'Bayesian Anomaly Detectors', 'Multi-Metric Covariance Engine', 'NASA Reference Cohorts'],
    output: 'Real-time z-scores and early physiological deviation flags.',
  },
  {
    num: '03',
    title: 'UNDERSTAND',
    tagline: 'Grounded Clinical Context & Reasoning',
    icon: BrainCircuit,
    description:
      'The Clinical Reasoning Copilot correlates biometric anomalies with mission stressors (recent EVA, SPE alert, sleep deprivation) to explain the physiological mechanisms at work.',
    inputs: ['Biomedical Knowledge Graph', 'Mission Context & Event Log', 'Aerospace Clinical Literature', 'Space Radiation Models'],
    output: 'Plain-language medical summary preserving strict scientific provenance.',
  },
  {
    num: '04',
    title: 'RESPOND',
    tagline: 'Prioritized Countermeasures & Escalation',
    icon: ShieldAlert,
    description:
      'Provides the crew with targeted preventive guidance, exercise protocol modifications, and unambiguous criteria for when mission ground flight surgeons must be contacted.',
    inputs: ['NASA Clinical Protocol Checklists', 'Countermeasure Tuning Rules', 'Ground Comms Latency Budget', 'Medical Emergency Thresholds'],
    output: 'Actionable step-by-step checklist with human medical authority preserved.',
  },
];

export const DataToActionSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const current = STAGES[activeStage];
  const Icon = current.icon;

  return (
    <section className="relative py-28 bg-[#05070B] overflow-hidden border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              CLOSED-LOOP BIOMEDICAL WORKFLOW
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            FROM MEASUREMENT TO
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              MEANINGFUL ACTION.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            How raw spaceflight telemetry transforms into actionable clinical understanding and
            preventive mission countermeasures.
          </p>
        </div>

        {/* 4-Stage Horizontal Connected Stepper (Desktop) / Vertical (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mb-12">
          {/* Desktop Connecting Line behind buttons */}
          <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 z-0" />

          {STAGES.map((stage, idx) => {
            const isCurrent = idx === activeStage;
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.num}
                onClick={() => setActiveStage(idx)}
                className={`relative z-10 flex flex-col items-center text-center p-5 rounded-2xl transition-all ${
                  isCurrent
                    ? 'glass-panel border border-cyan-400 shadow-glowCyan'
                    : 'glass-panel-subtle border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isCurrent
                      ? 'bg-cyan-400 text-black shadow-glowCyan'
                      : 'bg-slate-900 border border-slate-800 text-cyan-400'
                  }`}
                >
                  <StageIcon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest">
                  STAGE {stage.num}
                </span>
                <span className="font-space font-bold text-base text-white mt-0.5">
                  {stage.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1">
                  {stage.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-cyan-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
                STAGE {current.num} // {current.title}
              </span>
              <span className="text-xs font-mono text-slate-400">{current.tagline}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-space font-bold text-white">
              {current.tagline}
            </h3>

            <p className="text-slate-300 text-base leading-relaxed">{current.description}</p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                CORE SYSTEM INPUTS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.inputs.map((inp, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{inp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 p-6 rounded-xl bg-black/60 border border-cyan-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                PIPELINE DELIVERABLE
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <p className="text-sm font-mono text-cyan-200 leading-relaxed">{current.output}</p>

            <div className="pt-2 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Next Stage:</span>
              <button
                onClick={() => setActiveStage((activeStage + 1) % STAGES.length)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <span>Proceed to {STAGES[(activeStage + 1) % STAGES.length].title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
