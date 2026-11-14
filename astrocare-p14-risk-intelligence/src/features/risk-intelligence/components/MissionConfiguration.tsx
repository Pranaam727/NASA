import React from 'react';
import { 
  Rocket, 
  Clock, 
  Users, 
  MapPin, 
  Zap, 
  Radio, 
  Activity, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MissionProfile, MissionType, MissionPhase } from '../types/mission.types';

interface MissionConfigurationProps {
  mission: MissionProfile;
  presets: MissionProfile[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onChange: (updated: Partial<MissionProfile>) => void;
  titlePrefix?: string;
}

export const MissionConfiguration: React.FC<MissionConfigurationProps> = ({
  mission,
  presets,
  selectedPresetId,
  onSelectPreset,
  onChange,
  titlePrefix = 'Mission Profile'
}) => {
  return (
    <div className="bg-space-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      
      {/* Header & Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              {titlePrefix}: {mission.missionName}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {mission.isHypothetical ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-700/60 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> HYPOTHETICAL RESEARCH CONFIGURATION
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 font-semibold">
                NASA OPERATIONAL BASELINE
              </span>
            )}
            <span className="text-xs text-slate-400 truncate">
              {mission.destination}
            </span>
          </div>
        </div>

        {/* Preset Loader */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Presets:</label>
          <select
            value={selectedPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="text-xs bg-space-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                {p.missionName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Mission Name & Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-slate-400" /> Mission Architecture
          </label>
          <select
            value={mission.missionType}
            onChange={(e) => onChange({ missionType: e.target.value as MissionType })}
            className="w-full text-xs bg-space-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="LEO">Low Earth Orbit (ISS / LEO)</option>
            <option value="LUNAR_ORBIT">Lunar Orbital (Gateway)</option>
            <option value="LUNAR_SURFACE">Lunar Surface (Artemis Base)</option>
            <option value="MARS_CONJUNCTION">Mars Conjunction (1000 Days)</option>
            <option value="MARS_OPPOSITION">Mars Opposition (Fast Transit)</option>
            <option value="DEEP_SPACE_NEO">Deep-Space Asteroid (NEO)</option>
            <option value="HYPOTHETICAL_CUSTOM">Hypothetical Custom Profile</option>
          </select>
        </div>

        {/* Mission Duration Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration (Days)
            </label>
            <span className="font-mono text-cyan-300 font-semibold">{mission.durationDays} d ({(mission.durationDays / 30.4).toFixed(1)} mo)</span>
          </div>
          <input
            type="range"
            min="14"
            max="1200"
            step="14"
            value={mission.durationDays}
            onChange={(e) => onChange({ durationDays: parseInt(e.target.value, 10) })}
            className="w-full accent-cyan-400 h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Crew Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Crew Complement
            </label>
            <span className="font-mono text-slate-200 font-semibold">{mission.crewSize} astronauts</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={mission.crewSize}
            onChange={(e) => onChange({ crewSize: parseInt(e.target.value, 10) })}
            className="w-full accent-cyan-400 h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Mission Active Phase */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" /> Active Mission Phase
          </label>
          <select
            value={mission.activePhase}
            onChange={(e) => onChange({ activePhase: e.target.value as MissionPhase })}
            className="w-full text-xs bg-space-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="PRE_LAUNCH_QUARANTINE">Pre-Launch Quarantine</option>
            <option value="ASCENT_TRANSIT_OUTBOUND">Ascent & Outbound Transit</option>
            <option value="ORBITAL_STATION_OPS">Orbital Station Operations</option>
            <option value="SURFACE_EXTRAVEHICULAR">Surface EVA Operations</option>
            <option value="TRANSIT_INBOUND">Inbound Transit to Earth</option>
            <option value="POST_FLIGHT_REHABILITATION">Post-Flight Rehabilitation</option>
          </select>
        </div>

      </div>

      {/* Environmental Parameters Sub-Grid */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* Radiation Field Specification */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-violet-400" /> Radiation Field Environment
          </label>
          <select
            value={mission.environment.radiationFieldType}
            onChange={(e) => onChange({
              environment: {
                ...mission.environment,
                radiationFieldType: e.target.value as any
              }
            })}
            className="w-full bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
          >
            <option value="LEO_GEOMAGNETIC_SHIELDED">LEO (Magnetosphere Shielded)</option>
            <option value="CISLUNAR_UNSHIELDED">Cislunar / Gateway (Unshielded GCR + SPE)</option>
            <option value="INTERPLANETARY_GCR_SPE">Interplanetary Deep Space (Full GCR & SPE)</option>
            <option value="MARS_SURFACE_ATMOSPHERE">Mars Surface (Atmospheric Partial Attenuation)</option>
          </select>
        </div>

        {/* Gravity State */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Gravitational State
          </label>
          <select
            value={mission.environment.gravityField}
            onChange={(e) => onChange({
              environment: {
                ...mission.environment,
                gravityField: e.target.value as any
              }
            })}
            className="w-full bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
          >
            <option value="MICROGRAVITY">Microgravity (0-G Weightlessness)</option>
            <option value="LUNAR_SIXTH">Lunar Gravity (0.166-G / 1/6th-G)</option>
            <option value="MARTIAN_THREE_EIGHTHS">Martian Gravity (0.38-G / 3/8th-G)</option>
            <option value="VARIABLE_CENTRIFUGE">Centrifuge Artificial Gravity (Intermittent)</option>
            <option value="ONE_G">Standard Terrestrial (1-G)</option>
          </select>
        </div>

        {/* Telemedicine Round-Trip Delay */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-teal-400" /> Comm Latency & Evacuation
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-space-950 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 truncate">
              Lag: {(mission.environment.communicationLatencyMinutes * 2).toFixed(2)} min round-trip
            </div>
            <div className="flex-1 bg-space-950 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 truncate">
              Abort: {mission.environment.evacuationTimeDays} d
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
