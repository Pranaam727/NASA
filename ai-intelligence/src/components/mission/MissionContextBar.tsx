import React, { useState } from 'react';
import { MissionContext, MissionPhase } from '../../types';
import {
  Orbit,
  Calendar,
  Wind,
  Gauge,
  Radiation,
  Dumbbell,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';

interface MissionContextBarProps {
  missionContext: MissionContext;
  onUpdateMissionContext: (updated: MissionContext) => void;
}

const PHASES: { id: MissionPhase; label: string }[] = [
  { id: 'pre-launch', label: 'Pre-Launch' },
  { id: 'launch-ascent', label: 'Ascent' },
  { id: 'microgravity-adaptation', label: 'Microgravity Adapt (FD 1-14)' },
  { id: 'long-duration-orbital', label: 'Long-Duration ISS (FD 15-180)' },
  { id: 'lunar-transit', label: 'Lunar Transit' },
  { id: 'lunar-surface', label: 'Surface Ops' },
  { id: 'deep-space-transit', label: 'Deep Space Transit' },
  { id: 're-entry-rehabilitation', label: 'Re-entry & Rehab' }
];

export const MissionContextBar: React.FC<MissionContextBarProps> = ({
  missionContext,
  onUpdateMissionContext
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePhaseChange = (phase: MissionPhase) => {
    onUpdateMissionContext({
      ...missionContext,
      currentPhase: phase
    });
  };

  const handleFlightDayChange = (val: number) => {
    if (isNaN(val) || val < 1) return;
    onUpdateMissionContext({
      ...missionContext,
      flightDay: Math.min(val, missionContext.totalPlannedDays)
    });
  };

  const handleEnvironmentalChange = (key: keyof MissionContext['environmental'], val: number) => {
    if (isNaN(val)) return;
    onUpdateMissionContext({
      ...missionContext,
      environmental: {
        ...missionContext.environmental,
        [key]: val
      }
    });
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 transition-all">
      
      {/* Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Destination & Mission Details */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
            <Orbit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white">{missionContext.missionName}</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                {missionContext.targetDestination}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
              <span>Mission Phase: <strong className="text-cyan-400 uppercase">{missionContext.currentPhase.replace(/-/g, ' ')}</strong></span>
              <span>•</span>
              <span>EVA Spacewalks Completed: <strong className="text-white">{missionContext.evaCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Flight Day Progress Indicator */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800">
          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Mission Flight Day</div>
            <div className="text-sm font-bold text-cyan-400">
              FD {missionContext.flightDay} <span className="text-slate-500 font-normal text-xs">/ {missionContext.totalPlannedDays}</span>
            </div>
          </div>

          <div className="w-24 sm:w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (missionContext.flightDay / missionContext.totalPlannedDays) * 100)}%` }}
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 font-mono cursor-pointer transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isExpanded ? 'Collapse Context' : 'Adjust Environmental Context'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Expanded Controls for Mission Phase and Environmental Telemetry */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
          
          {/* Phase Selector */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Active Mission Phase:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PHASES.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePhaseChange(p.id)}
                  className={`px-2.5 py-1.5 rounded text-xs font-mono text-left border transition-all cursor-pointer ${
                    missionContext.currentPhase === p.id
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 font-semibold glow-cyan'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Sliders & Inputs */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Spacecraft Environmental Sensors & Countermeasure Telemetry:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Cabin CO2 */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Cabin CO2 (ppm)</span>
                  <span className="font-mono text-cyan-300 font-bold">{missionContext.environmental.cabinCo2Ppm}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={6000}
                  step={100}
                  value={missionContext.environmental.cabinCo2Ppm}
                  onChange={(e) => handleEnvironmentalChange('cabinCo2Ppm', parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Nominal: &lt;2500</span>
                  <span className={missionContext.environmental.cabinCo2Ppm > 3000 ? 'text-amber-400 font-bold' : ''}>
                    {missionContext.environmental.cabinCo2Ppm > 3000 ? 'SANS Risk Elevated' : 'Nominal'}
                  </span>
                </div>
              </div>

              {/* GCR Dosimeter Rate */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">GCR Rate (µSv/d)</span>
                  <span className="font-mono text-rose-300 font-bold">{missionContext.environmental.gcrDosimetryRateMicroSvPerDay}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={2500}
                  step={50}
                  value={missionContext.environmental.gcrDosimetryRateMicroSvPerDay}
                  onChange={(e) => handleEnvironmentalChange('gcrDosimetryRateMicroSvPerDay', parseInt(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>LEO: ~450</span>
                  <span>Deep Space: &gt;1200</span>
                </div>
              </div>

              {/* Daily Exercise Compliance */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Exercise Compliance</span>
                  <span className="font-mono text-emerald-300 font-bold">{missionContext.environmental.exerciseCompliancePercentage}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={2}
                  value={missionContext.environmental.exerciseCompliancePercentage}
                  onChange={(e) => handleEnvironmentalChange('exerciseCompliancePercentage', parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Target: &gt;90%</span>
                  <span className="text-slate-400">{missionContext.environmental.dailyExerciseCompletedHours}h logged</span>
                </div>
              </div>

              {/* Flight Day Adjustment */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Flight Day Elapsed</span>
                  <span className="font-mono text-cyan-300 font-bold">FD {missionContext.flightDay}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={missionContext.totalPlannedDays}
                  step={1}
                  value={missionContext.flightDay}
                  onChange={(e) => handleFlightDayChange(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Day 1</span>
                  <span>Day {missionContext.totalPlannedDays}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
