import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import {
  ShieldAlert,
  Bell,
  RotateCcw,
  User,
  Radio,
  Activity,
  Layers,
  Database,
  BookOpen,
  FlaskConical,
  GitBranch,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentAstronaut,
    availableAstronauts,
    selectAstronaut,
    radiationContext,
    wellnessContext,
    unacknowledgedAlertsCount,
    resetAllDemoData,
  } = useAstroCareContext();

  return (
    <header className="bg-space-900 border-b border-space-800 sticky top-0 z-40 shadow-xl">
      {/* Top Banner Context Strip */}
      <div className="bg-space-950 px-4 py-1.5 border-b border-space-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center text-cyan-400 font-semibold tracking-wider">
            <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse text-cyan-400" />
            P12 TELEMETRY STREAM
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-300">
            Mission: <strong className="text-white">{currentAstronaut.missionName}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            Phase:{' '}
            <span className="text-cyan-300 font-bold">
              {currentAstronaut.missionPhase} (FD {currentAstronaut.missionElapsedDays}/
              {currentAstronaut.missionDurationDays})
            </span>
          </span>
        </div>

        {/* Cross-Module Integration Context Indicators (P10 & P11) */}
        <div className="flex items-center gap-3">
          {radiationContext && (
            <div
              title="Context received from P10 Radiation Module interface. Optional context only."
              className="hidden lg:flex items-center gap-1.5 bg-space-900 px-2 py-0.5 rounded border border-space-700/60 text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-slate-400">P10 Rad:</span>
              <span className="text-amber-300 font-bold">{radiationContext.cumulativeDoseMsv} mSv</span>
            </div>
          )}
          {wellnessContext && (
            <div
              title="Context received from P11 Sleep & Wellness Module interface. Optional context only."
              className="hidden lg:flex items-center gap-1.5 bg-space-900 px-2 py-0.5 rounded border border-space-700/60 text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-slate-400">P11 Sleep:</span>
              <span className="text-purple-300 font-bold">{wellnessContext.sleepScoreAvg}/100</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Stress:</span>
              <span className="text-purple-300 font-bold">{wellnessContext.subjectiveStressIndex}/10</span>
            </div>
          )}

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demonstration laboratory samples, alerts, and filters to factory seed data?')) {
                resetAllDemoData();
              }
            }}
            title="Reset demonstration data to deterministic NASA/Simulated seed state"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded bg-space-900 border border-space-800 hover:border-rose-900/50 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Module Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                P12
              </span>
              <h1 className="text-base font-bold text-white tracking-wide">ASTROCARE</h1>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Immune System & Laboratory Intelligence
            </p>
          </div>
        </div>

        {/* Astronaut Selector */}
        <div className="flex items-center gap-2 bg-space-950/80 border border-space-800 rounded-lg px-2.5 py-1.5">
          <User className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <label htmlFor="astronaut-select" className="text-[9px] uppercase tracking-wider font-mono text-slate-400">
              Active Crew Subject
            </label>
            <select
              id="astronaut-select"
              value={currentAstronaut.astronautId}
              onChange={(e) => selectAstronaut(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
            >
              {availableAstronauts.map((astro) => (
                <option key={astro.astronautId} value={astro.astronautId} className="bg-space-900 text-white">
                  {astro.name} ({astro.astronautId}) — {astro.crewRole}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Alerts Engine Nav */}
          <NavLink
            to="/immune/alerts"
            title="Immune Alert Engine"
            className={({ isActive }) =>
              `relative p-2 rounded-lg border transition ${
                isActive
                  ? 'bg-space-800 border-cyan-500/60 text-cyan-400'
                  : 'bg-space-950/60 border-space-800 text-slate-400 hover:text-white'
              }`
            }
          >
            <Bell className="w-5 h-5" />
            {unacknowledgedAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unacknowledgedAlertsCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Primary Route Tab Strip */}
      <nav className="bg-space-950 border-t border-space-800/80 px-4 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto flex items-center gap-1">
          <NavLink
            to="/immune"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <Activity className="w-3.5 h-3.5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/immune/cells"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Immune Cells
          </NavLink>

          <NavLink
            to="/immune/biomarkers"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Cytokines & Biomarkers
          </NavLink>

          <NavLink
            to="/immune/laboratory"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5" />
            Sample Tracking
          </NavLink>

          <NavLink
            to="/immune/results"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <Database className="w-3.5 h-3.5" />
            Lab Results
          </NavLink>

          <NavLink
            to="/immune/longitudinal"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <GitBranch className="w-3.5 h-3.5" />
            Longitudinal Analysis
          </NavLink>

          <NavLink
            to="/immune/alerts"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <Bell className="w-3.5 h-3.5" />
            Alert Engine
          </NavLink>

          <NavLink
            to="/immune/research"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            NASA OSDR Explorer
          </NavLink>

          <NavLink
            to="/immune/insights"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-space-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900/30'
              }`
            }
          >
            <BookOpen className="w-3.5 h-3.5" />
            Research Insights
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
