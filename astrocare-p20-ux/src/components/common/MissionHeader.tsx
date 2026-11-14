import React from 'react';
import { Mission, Astronaut } from '../../types/contracts';
import { useTheme } from '../../design-system/ThemeContext';
import { TelemetryStatus } from './TelemetryStatus';
import {
  Orbit,
  Search,
  Sun,
  Moon,
  Menu,
  Activity,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { FOCUS_RING, HEADER_SURFACE } from '../../design-system/utils';

interface MissionHeaderProps {
  mission: Mission;
  crewMembers: Astronaut[];
  selectedAstronaut: Astronaut | null;
  onSelectAstronaut: (astronaut: Astronaut | null) => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({
  mission,
  crewMembers,
  selectedAstronaut,
  onSelectAstronaut,
  onOpenSearch,
  onToggleSidebar,
  isSidebarCollapsed
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-40 ${HEADER_SURFACE}`}>
      <div className="max-w-[1720px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Mission MET */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
            className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer ${FOCUS_RING}`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* AstroCare Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/20 border border-cyan-500/40 flex items-center justify-center glow-cyan shrink-0">
              <Orbit className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sm sm:text-base text-slate-900 dark:text-white">
                  ASTROCARE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  MISSION CONTROL
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:flex items-center gap-1.5">
                <span>{mission.identifier}</span>
                <span>•</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase">{mission.currentPhase.replace(/-/g, ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Mission Elapsed Time (MET) & Destination Pill */}
        <div className="hidden lg:flex items-center gap-4 bg-white/70 dark:bg-slate-900/80 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Mission Elapsed Time</span>
            <span className="font-bold text-slate-800 dark:text-cyan-300 text-sm">
              {mission.missionElapsedTime}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Destination</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {mission.targetDestination}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">System Health</span>
              <span className="font-bold">{mission.systemHealthScorePercent}%</span>
            </div>
          </div>
        </div>

        {/* Right: Astronaut Context Selector, Search, Telemetry Status, Theme Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Telemetry Status Indicator */}
          <div className="hidden md:block">
            <TelemetryStatus
              status={mission.telemetryConnectionStatus}
              lastSync={mission.lastTelemetrySync}
            />
          </div>

          {/* Astronaut Focus Selector */}
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <User className="w-3.5 h-3.5 text-cyan-500 mr-2 shrink-0" />
            <select
              aria-label="Filter context by crew member"
              value={selectedAstronaut?.id || 'all'}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  onSelectAstronaut(null);
                } else {
                  const astronaut = crewMembers.find(a => a.id === e.target.value) || null;
                  onSelectAstronaut(astronaut);
                }
              }}
              className="bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                All Crew (Expedition 72)
              </option>
              {crewMembers.map(a => (
                <option key={a.id} value={a.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {a.name} ({a.callsign})
                </option>
              ))}
            </select>
          </div>

          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-500/50 hover:text-cyan-500 cursor-pointer shadow-sm transition-all ${FOCUS_RING}`}
            title="Global search across astronauts, vitals, and research (Cmd/Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Scientific Workspace theme' : 'Switch to Dark Mission Control theme'}
            className={`p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors ${FOCUS_RING}`}
            title={theme === 'dark' ? 'Switch to Light Workspace Theme' : 'Switch to Dark Mission Control Theme'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
