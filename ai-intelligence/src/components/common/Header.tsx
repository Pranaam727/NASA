import React from 'react';
import { useAstroCareAI } from '../../providers/ProviderContext';
import { AstronautHealthPayload, MissionContext } from '../../types';
import { DEFAULT_ASTRONAUT_PROFILES } from '../../data/astronautProfiles';
import {
  Sparkles,
  Zap,
  Server,
  User,
  Orbit,
  BookOpen,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentAstronaut: AstronautHealthPayload;
  missionContext: MissionContext;
  onSelectAstronaut: (profile: { astronaut: AstronautHealthPayload; missionContext: MissionContext }) => void;
  onOpenIntegrationGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAstronaut,
  missionContext,
  onSelectAstronaut,
  onOpenIntegrationGuide
}) => {
  const { mode, setMode, providerStatus, refreshStatus, isLoadingStatus } = useAstroCareAI();

  return (
    <header className="bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Module Brand & Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/20 border border-cyan-500/40 flex items-center justify-center glow-cyan shrink-0">
            <Orbit className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base text-white">ASTROCARE</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                ai-intelligence
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Aerospace Biomedical Intelligence Platform</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400/90 font-mono">Gemini AI Module</span>
            </p>
          </div>
        </div>

        {/* Center: Mission Context Quick Pill */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-200">{missionContext.missionName}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            Flight Day <span className="font-mono font-bold text-cyan-400">{missionContext.flightDay}</span>
            <span className="text-slate-500 font-mono">/{missionContext.totalPlannedDays}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400 font-mono text-[11px] truncate max-w-[130px]">
            {missionContext.targetDestination}
          </div>
        </div>

        {/* Right: Astronaut Selector, Mode Switcher, Guide */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Astronaut Selector */}
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-xs text-slate-200">
            <User className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
            <select
              value={currentAstronaut.astronautId}
              onChange={(e) => {
                const selected = DEFAULT_ASTRONAUT_PROFILES.find(p => p.astronaut.astronautId === e.target.value);
                if (selected) onSelectAstronaut(selected);
              }}
              className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {DEFAULT_ASTRONAUT_PROFILES.map(p => (
                <option key={p.astronaut.astronautId} value={p.astronaut.astronautId} className="bg-slate-900 text-slate-100">
                  {p.astronaut.astronautName} ({p.astronaut.callsign})
                </option>
              ))}
            </select>
          </div>

          {/* AI Provider Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-md border border-slate-800 text-xs">
            <button
              onClick={() => setMode('gemini-live')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                mode === 'gemini-live'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Connects to secure backend proxy using Google Gemini API"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Gemini Live</span>
            </button>
            <button
              onClick={() => setMode('mock-simulation')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                mode === 'mock-simulation'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Runs standalone high-fidelity biomedical simulation without API key"
            >
              <Server className="w-3 h-3 text-purple-400" />
              <span>Mock Engine</span>
            </button>
          </div>

          {/* Provider Status Pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border ${
              providerStatus.isAvailable
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
            }`}
            title={providerStatus.message || 'AI Provider connection status'}
          >
            {providerStatus.isAvailable ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <Zap className="w-3 h-3 text-amber-400" />
            )}
            <span className="truncate max-w-[120px]">{providerStatus.model}</span>
            {providerStatus.latencyMs && (
              <span className="text-[10px] text-slate-400 font-mono">
                {providerStatus.latencyMs}ms
              </span>
            )}
            <button
              onClick={() => refreshStatus()}
              disabled={isLoadingStatus}
              title="Re-check provider status"
              className="text-slate-400 hover:text-slate-200 ml-0.5 cursor-pointer"
            >
              <RotateCcw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          {/* Integration Guide Button */}
          <button
            onClick={onOpenIntegrationGuide}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Integration Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
};
