import React from 'react';
import { Activity, Radio, UserCheck, Shield } from 'lucide-react';
import { AstronautProfile } from '../../types';
import { Badge } from '../common/Badge';

interface NavbarProps {
  profiles: AstronautProfile[];
  activeProfile: AstronautProfile;
  onSelectProfile: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0b101d]/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
            P17
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-100 text-sm">
                ASTROCARE
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-800/60 font-medium">
                DIGITAL TWIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Biomedical Intelligence & Longitudinal Health
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800/80">
          <Badge variant="teal" size="sm">
            <Radio className="w-3 h-3 mr-1 animate-pulse text-teal-400" />
            SYNTHETIC TELEMETRY ENGINE
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Active Astronaut Profile Selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 px-3">
          <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Subject Profile
            </span>
            <select
              value={activeProfile?.id}
              onChange={(e) => onSelectProfile(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.displayName} ({p.missionId} - {p.missionPhase})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mission Day Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg">
          <Activity className="w-4 h-4 text-blue-400" />
          <div className="text-xs">
            <span className="text-slate-400">Day: </span>
            <span className="font-mono font-bold text-cyan-300">
              {activeProfile ? (activeProfile.missionDay >= 0 ? `FD ${activeProfile.missionDay}` : `L${activeProfile.missionDay}`) : 'FD --'}
            </span>
            <span className="text-slate-500 text-[11px] ml-1">/ {activeProfile?.missionDurationDays || 180}d</span>
          </div>
        </div>

        {/* Phase Pill */}
        <Badge
          variant={
            activeProfile?.missionPhase === 'Inflight'
              ? 'cyan'
              : activeProfile?.missionPhase === 'Preflight'
              ? 'blue'
              : activeProfile?.missionPhase === 'Postflight'
              ? 'violet'
              : 'emerald'
          }
          size="md"
        >
          {activeProfile?.missionPhase || 'Inflight'}
        </Badge>
      </div>
    </header>
  );
};
