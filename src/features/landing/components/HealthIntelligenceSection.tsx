import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ECGWaveform } from './ECGWaveform';
import { Activity, Heart, Droplets, Thermometer, Moon, Smile, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

type HealthStatus = 'NORMAL' | 'ATTENTION' | 'MEDICAL REVIEW';

interface ScenarioConfig {
  name: string;
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  glucose: number;
  temperature: number;
  sleepHours: number;
  moodScore: number;
  status: HealthStatus;
  note: string;
}

const SCENARIOS: Record<string, ScenarioConfig> = {
  nominal: {
    name: 'Nominal Deep Space Transit',
    heartRate: 72,
    bpSystolic: 118,
    bpDiastolic: 76,
    glucose: 92,
    temperature: 36.8,
    sleepHours: 7.4,
    moodScore: 8,
    status: 'NORMAL',
    note: 'All vitals within individual baseline envelope (±1.5σ). Circadian pacing stable.',
  },
  spe: {
    name: 'Solar Particle Event (SPE Alert)',
    heartRate: 88,
    bpSystolic: 132,
    bpDiastolic: 84,
    glucose: 108,
    temperature: 37.3,
    sleepHours: 5.6,
    moodScore: 5,
    status: 'ATTENTION',
    note: 'Elevated stress catecholamines and mild temperature elevation following shelter protocol.',
  },
  hypoxia: {
    name: 'Life Support Cabin Hypoxia Anomaly',
    heartRate: 114,
    bpSystolic: 146,
    bpDiastolic: 92,
    glucose: 118,
    temperature: 37.1,
    sleepHours: 4.8,
    moodScore: 3,
    status: 'MEDICAL REVIEW',
    note: 'Tachycardia and sympathetic overdrive secondary to depressed cabin pO2 (14.2 kPa). Urgent review.',
  },
  exercise: {
    name: 'Heavy ARED Resistance Exercise',
    heartRate: 142,
    bpSystolic: 160,
    bpDiastolic: 82,
    glucose: 88,
    temperature: 37.8,
    sleepHours: 7.4,
    moodScore: 9,
    status: 'NORMAL',
    note: 'Physiological cardiovascular strain expected during daily 600-lb equivalent deadlift workout.',
  },
};

export const HealthIntelligenceSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('nominal');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [userMoodRating, setUserMoodRating] = useState<number>(8);

  const scenario = SCENARIOS[selectedScenarioKey];

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NORMAL // WITHIN BASELINE</span>
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>ATTENTION // OBSERVATION REQUIRED</span>
          </span>
        );
      case 'MEDICAL REVIEW':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>MEDICAL REVIEW // PROTOCOL ESCALATION</span>
          </span>
        );
    }
  };

  const displayTemp =
    tempUnit === 'C'
      ? `${scenario.temperature.toFixed(1)}°C`
      : `${((scenario.temperature * 9) / 5 + 32).toFixed(1)}°F`;

  return (
    <section id="intelligence" className="relative py-28 bg-[#05070B] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              MISSION CONTROL BIOMETRIC SUITE
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            UNDERSTAND YOUR BODY.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              BEFORE YOUR BODY NEEDS TO WARN YOU.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            High-fidelity telemetry processing combining real-time baseline delta tracking,
            oscilloscopic waveform analysis, and clinical risk evaluation.
          </p>

          {/* Demonstration Notice Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>DEMONSTRATION DATA // SYNTHETIC VIRTUAL SENSOR ENGINE // NON-DIAGNOSTIC</span>
          </div>
        </div>

        {/* Interactive Scenario Bar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-10 border border-cyan-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase">Simulation Profile</div>
              <div className="text-sm font-space font-bold text-white">{scenario.name}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(SCENARIOS).map(([key]) => (
              <button
                key={key}
                onClick={() => setSelectedScenarioKey(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedScenarioKey === key
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-glowCyan'
                    : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          <div>{getStatusBadge(scenario.status)}</div>
        </div>

        {/* 6 Primary Health Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. HEART RATE & ECG */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-400">
                <Heart className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Heart Rate (ECG)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                ACTIVE
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-space font-bold text-white">{scenario.heartRate}</span>
              <span className="text-sm font-mono text-cyan-400">BPM</span>
              <span className="text-xs font-mono text-slate-400 ml-auto">Baseline: 64 bpm</span>
            </div>

            {/* Real-time Oscilloscope */}
            <ECGWaveform bpm={scenario.heartRate} height={70} color="#00D9FF" />

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
              <span>LEAD-II POLARITY</span>
              <span className="text-cyan-400">P-Q-R-S-T SYNCHRONOUS</span>
            </div>
          </div>

          {/* 2. BLOOD PRESSURE */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Activity className="w-5 h-5" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Blood Pressure
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                OSCILLOMETRIC
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-space font-bold text-white">
                {scenario.bpSystolic}/{scenario.bpDiastolic}
              </span>
              <span className="text-sm font-mono text-cyan-400">mmHg</span>
              <span className="text-xs font-mono text-slate-400 ml-auto">
                MAP: {Math.round((2 * scenario.bpDiastolic + scenario.bpSystolic) / 3)} mmHg
              </span>
            </div>

            {/* Visual pressure bar scale */}
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>HYPOTENSION</span>
                <span>OPTIMAL (120/80)</span>
                <span>HYPERTENSION</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (scenario.bpSystolic / 180) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
              <span>PULSE PRESSURE</span>
              <span className="text-emerald-400">
                {scenario.bpSystolic - scenario.bpDiastolic} mmHg (NOMINAL)
              </span>
            </div>
          </div>

          {/* 3. BLOOD GLUCOSE */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400">
                <Droplets className="w-5 h-5" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Blood Glucose
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-black/40 border border-slate-800">
                CGM SENSOR
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-space font-bold text-white">{scenario.glucose}</span>
              <span className="text-sm font-mono text-cyan-400">mg/dL</span>
              <span className="text-xs font-mono text-slate-400 ml-auto">Target: 70–110</span>
            </div>

            {/* 6-hour glucose curve sparkline */}
            <div className="h-16 flex items-end space-x-1.5 px-2 py-1 bg-black/40 rounded border border-slate-800">
              {[88, 92, 95, 90, scenario.glucose - 4, scenario.glucose].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-cyan-400/70 hover:bg-cyan-300 rounded-t transition-all"
                    style={{ height: `${Math.max(10, ((val - 60) / 80) * 100)}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-500">-{(5 - idx) * 2}h</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
              <span>METABOLIC STATUS</span>
              <span className="text-emerald-400">EUGLYCEMIC</span>
            </div>
          </div>

          {/* 4. CORE BODY TEMPERATURE */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sky-400">
                <Thermometer className="w-5 h-5" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Body Temperature
                </span>
              </div>
              {/* Unit Toggle */}
              <div className="flex items-center rounded bg-black/60 p-0.5 border border-slate-800 text-[10px] font-mono">
                <button
                  onClick={() => setTempUnit('C')}
                  className={`px-2 py-0.5 rounded ${tempUnit === 'C' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTempUnit('F')}
                  className={`px-2 py-0.5 rounded ${tempUnit === 'F' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400'}`}
                >
                  °F
                </button>
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-space font-bold text-white">{displayTemp}</span>
              <span className="text-xs font-mono text-slate-400 ml-auto">Normal: 36.5–37.5°C</span>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-cyan-400 block mb-0.5">CIRCADIAN OBSERVATION:</span>
              Absence of microgravity convective heat loss causes 0.5°C elevation during rest
              (Space Fever phenomenon).
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
              <span>TYMPANIC SENSOR</span>
              <span className="text-emerald-400">AFEBRILE</span>
            </div>
          </div>

          {/* 5. SLEEP DURATION & ARCHITECTURE */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400">
                <Moon className="w-5 h-5" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Sleep Architecture
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40">
                ACTIGRAPHY
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-space font-bold text-white">
                {scenario.sleepHours.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-cyan-400">HRS</span>
              <span className="text-xs font-mono text-slate-400 ml-auto">Target: 7.5–8.5h</span>
            </div>

            {/* Sleep stage segments */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>DEEP (18%)</span>
                <span>REM (24%)</span>
                <span>LIGHT (58%)</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                <div className="h-full bg-purple-500 w-[18%]" title="Deep Sleep" />
                <div className="h-full bg-cyan-400 w-[24%]" title="REM Sleep" />
                <div className="h-full bg-slate-600 w-[58%]" title="Light Sleep" />
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
              <span>RECOVERY EFFICIENCY</span>
              <span className="text-emerald-400">88% (RESTORED)</span>
            </div>
          </div>

          {/* 6. MOOD & BEHAVIORAL HEALTH */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Smile className="w-5 h-5" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Mood & Behavioral Health
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                CHECK-IN
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-space font-bold text-white">{userMoodRating}</span>
              <span className="text-sm font-mono text-cyan-400">/ 10</span>
              <span className="text-xs font-mono text-slate-400 ml-auto">
                {userMoodRating >= 7 ? 'HIGH RESILIENCE' : userMoodRating >= 5 ? 'MODERATE' : 'FATIGUED'}
              </span>
            </div>

            {/* Interactive mood rating slider */}
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>1 - CONCERN</span>
                <span>5 - NEUTRAL</span>
                <span>10 - OPTIMAL</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userMoodRating}
                onChange={(e) => setUserMoodRating(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
              <span>COGNITIVE LATENCY</span>
              <span className="text-cyan-400">142 ms (PVT NOMINAL)</span>
            </div>
          </div>
        </div>

        {/* Clinical Scenario Interpretation Footer Card */}
        <div className="mt-8 p-6 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              ALGORITHMIC CLINICAL INTERPRETATION //
            </div>
            <p className="text-sm text-slate-200">{scenario.note}</p>
          </div>

          <button
            onClick={() => navigate(ROUTES.VITALS)}
            className="group shrink-0 px-5 py-2.5 rounded-lg text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center space-x-2 shadow-glowCyan"
          >
            <span>OPEN FULL VITALS WORKBENCH</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
