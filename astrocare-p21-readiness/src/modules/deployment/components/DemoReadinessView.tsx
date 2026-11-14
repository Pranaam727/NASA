// ============================================================================
// AstroCare Module I: Hackathon Demonstration Preparation Center View
// Preloaded aerospace medical scenarios with synthetic telemetry quarantine.
// ============================================================================

import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Activity, 
  Heart, 
  Thermometer, 
  Radio, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { DemoScenario } from '../types';
import { DEMO_SCENARIOS_DATA } from '../data/demoScenariosData';
import { StatusBadge } from './StatusBadge';

export const DemoReadinessView: React.FC = () => {
  const [isDemoModeActive, setIsDemoModeActive] = useState(true);
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(DEMO_SCENARIOS_DATA[0]);
  const [resetNotice, setResetNotice] = useState(false);

  const handleSelectScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario);
  };

  const handleResetDemo = () => {
    setActiveScenario(DEMO_SCENARIOS_DATA[0]);
    setIsDemoModeActive(true);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
              HACKATHON DEMO MODE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Status: {isDemoModeActive ? 'ACTIVE (Synthetic Quarantine)' : 'LIVE TELEMETRY MODE'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Hackathon Presentation Scenarios & Deterministic Fallback Center
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Enables evaluators and judges to test deterministic clinical pathways without risking unhandled live telemetry network drops or API rate-limits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setIsDemoModeActive(!isDemoModeActive)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold bg-slate-950 border border-slate-800 text-slate-200 hover:text-white transition-all shadow-sm"
          >
            {isDemoModeActive ? (
              <ToggleRight className="w-5 h-5 text-purple-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-500" />
            )}
            <span>{isDemoModeActive ? 'Demo Mode ON' : 'Demo Mode OFF'}</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Notice */}
      {resetNotice && (
        <div className="p-3 bg-purple-950/60 border border-purple-800 rounded-lg text-xs text-purple-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Demo state successfully restored to Scenario 1 (Nominal Surveillance).</span>
        </div>
      )}

      {/* Mandatory Synthetic Data Notice */}
      <div className="bg-purple-950/30 border border-purple-800/80 p-4 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="text-purple-400 font-bold block mb-0.5 tracking-wider font-mono">
            SYNTHETIC DEMONSTRATION DATA — NOT REAL ASTRONAUT TELEMETRY
          </span>
          All physiological parameters, mission logs, and biometric alerts rendered in Demo Mode are synthetically generated for clinical simulation and hackathon judging. Demo Mode does not overwrite real patient records or empirical NASA research repositories.
        </div>
      </div>

      {/* 3 Preloaded Scenarios Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_SCENARIOS_DATA.map(scenario => {
          const isSelected = activeScenario.id === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500 shadow-xl'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded bg-slate-950 border border-purple-800/50">
                    {scenario.code}
                  </span>
                  <StatusBadge 
                    status={scenario.clinicalSeverity === 'Nominal' ? 'healthy' : scenario.clinicalSeverity === 'Critical' ? 'failed' : 'warning'} 
                    size="sm" 
                  />
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">
                  {scenario.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {scenario.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{scenario.astronautName}</span>
                <span className="text-purple-300 font-bold">Select Scenario →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Live Telemetry & Clinical Insight Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-purple-400">ACTIVE FLIGHT SCENARIO</span>
              <span className="text-slate-500 font-mono text-xs">•</span>
              <span className="text-xs text-slate-400 font-mono">{activeScenario.code}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {activeScenario.name}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              {activeScenario.astronautName} ({activeScenario.astronautId})
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              MET: {activeScenario.met}
            </span>
          </div>
        </div>

        {/* Biometric Telemetry Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Heart Rate</div>
            <div className="text-xl font-bold text-white flex items-center gap-1">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              {activeScenario.vitals.heartRate} <span className="text-xs text-slate-500 font-normal">bpm</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Blood Oxygen</div>
            <div className="text-xl font-bold text-cyan-400">
              {activeScenario.vitals.spo2}%
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Blood Pressure</div>
            <div className="text-xl font-bold text-white">
              {activeScenario.vitals.systolicBp}/{activeScenario.vitals.diastolicBp} <span className="text-xs text-slate-500 font-normal">mmHg</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Core Temp</div>
            <div className="text-xl font-bold text-amber-400 flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-amber-500" />
              {activeScenario.vitals.coreTemp}°C
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Radiation Dose</div>
            <div className="text-xl font-bold text-purple-400 flex items-center gap-1">
              <Radio className="w-4 h-4 text-purple-400" />
              {activeScenario.vitals.radiationAccumulated} <span className="text-xs text-slate-500 font-normal">mSv</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Severity Tier</div>
            <div className={`text-base font-bold mt-1 ${
              activeScenario.clinicalSeverity === 'Nominal' ? 'text-emerald-400' : activeScenario.clinicalSeverity === 'Critical' ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {activeScenario.clinicalSeverity.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Clinical Observations & Recommended Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <h4 className="font-bold text-cyan-300 font-mono mb-2 uppercase tracking-wider text-[11px]">
              Key Telemetry Observations & Anomalies:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">
              {activeScenario.keyFindings.map((finding, idx) => (
                <li key={idx}>{finding}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <h4 className="font-bold text-emerald-400 font-mono mb-2 uppercase tracking-wider text-[11px]">
              Suggested Flight Surgeon Actions:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">
              {activeScenario.suggestedClinicalActions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scientific Evidence Grounding */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
          <span className="text-sky-400 font-bold block mb-0.5">NASA Grounding Reference:</span>
          {activeScenario.evidenceSource}
        </div>
      </div>
    </div>
  );
};
