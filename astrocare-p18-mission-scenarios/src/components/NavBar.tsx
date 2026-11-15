import { NavLink, useNavigate } from 'react-router-dom';
import {
  Satellite, BookOpen, Settings2, Activity, ShieldAlert, Users,
  Gauge, List, FileText, Settings, Rocket, AlertTriangle, Play, Pause
} from 'lucide-react';
import { useSimStore } from '../store/simulationStore';

const navItems = [
  { to: '/overview',    label: 'Mission Overview',    icon: Satellite },
  { to: '/library',     label: 'Scenario Library',    icon: BookOpen },
  { to: '/builder',     label: 'Scenario Builder',    icon: Settings2 },
  { to: '/simulation',  label: 'Live Simulation',     icon: Activity },
  { to: '/risk',        label: 'Risk Assessment',     icon: ShieldAlert },
  { to: '/crew',        label: 'Crew Readiness',      icon: Users },
  { to: '/resources',   label: 'Resource Mgmt',       icon: Gauge },
  { to: '/timeline',    label: 'Event Timeline',      icon: List },
  { to: '/reports',     label: 'Mission Reports',     icon: FileText },
  { to: '/settings',    label: 'System Settings',     icon: Settings },
];

export default function NavBar() {
  const { isRunning, isPaused, selectedScenario, startSimulation, pauseSimulation, resumeSimulation, currentTelemetry } = useSimStore();
  const navigate = useNavigate();

  const hasAlerts = (currentTelemetry?.activeAlerts?.length ?? 0) > 0;
  const compoundScore = currentTelemetry?.compoundRiskScore ?? 0;

  return (
    <header className="bg-space-900 border-b border-space-700 flex flex-col z-30 shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-space-800">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Rocket size={20} className="text-astro-cyan" />
          <span className="font-mono font-bold text-astro-cyan tracking-widest text-sm">ASTROCARE</span>
          <span className="text-space-700">|</span>
          <span className="text-xs text-slate-500 font-mono tracking-wide">P18 · MISSION SCENARIOS & SIMULATION</span>
        </div>

        {/* Centre: mission clock + scenario */}
        <div className="flex items-center gap-4">
          {selectedScenario && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">ACTIVE SCENARIO:</span>
              <span className="text-xs text-astro-cyan font-mono font-semibold">{selectedScenario.id}</span>
            </div>
          )}
          {currentTelemetry && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">MET:</span>
              <span className="font-mono text-sm text-slate-200 pulse-soft">{currentTelemetry.timestampFormatted}</span>
            </div>
          )}
        </div>

        {/* Right: status + controls */}
        <div className="flex items-center gap-3">
          {hasAlerts && (
            <div className="flex items-center gap-1 alert-blink">
              <AlertTriangle size={14} className="text-rose-400" />
              <span className="text-xs text-rose-400 font-mono font-bold">
                {currentTelemetry?.activeAlerts.length} ALERT{currentTelemetry!.activeAlerts.length > 1 ? 'S' : ''}
              </span>
            </div>
          )}
          {compoundScore > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 font-mono">RISK:</span>
              <span className={`font-mono text-sm font-bold ${
                compoundScore > 60 ? 'text-rose-400' : compoundScore > 35 ? 'text-amber-400' : 'text-emerald-400'
              }`}>{compoundScore.toFixed(0)}</span>
            </div>
          )}

          {/* Sim controls in header */}
          {selectedScenario && (
            <div className="flex items-center gap-1">
              {!isRunning && !isPaused && (
                <button onClick={() => { startSimulation(); navigate('/simulation'); }}
                  className="btn-success flex items-center gap-1 py-1 px-3 text-xs">
                  <Play size={12} /> RUN
                </button>
              )}
              {isRunning && (
                <button onClick={pauseSimulation} className="btn-warning flex items-center gap-1 py-1 px-3 text-xs">
                  <Pause size={12} /> PAUSE
                </button>
              )}
              {isPaused && (
                <button onClick={resumeSimulation} className="btn-success flex items-center gap-1 py-1 px-3 text-xs">
                  <Play size={12} /> RESUME
                </button>
              )}
            </div>
          )}

          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 pulse-soft' : isPaused ? 'bg-amber-400' : 'bg-slate-600'}`} />
          <span className="text-xs font-mono text-slate-500">
            {isRunning ? 'RUNNING' : isPaused ? 'PAUSED' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-0 overflow-x-auto px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-astro-cyan text-astro-cyan'
                  : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-space-700'
              }`
            }
          >
            <Icon size={12} />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
