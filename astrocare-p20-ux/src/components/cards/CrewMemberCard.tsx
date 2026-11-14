import React from 'react';
import { Astronaut } from '../../types/contracts';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { 
  Heart, 
  Activity, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  User
} from 'lucide-react';
import { CARD_SURFACE, FOCUS_RING } from '../../design-system/utils';

interface CrewMemberCardProps {
  astronaut: Astronaut;
  isSelected?: boolean;
  onSelect: (astronaut: Astronaut) => void;
  onOpenDetails?: (astronaut: Astronaut) => void;
}

export const CrewMemberCard: React.FC<CrewMemberCardProps> = ({
  astronaut,
  isSelected = false,
  onSelect,
  onOpenDetails
}) => {
  const getStatusBadge = () => {
    switch (astronaut.overallHealthStatus) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            CRITICAL ATTENTION
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            MONITORING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            NOMINAL
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(astronaut)}
      className={`rounded-2xl p-5 cursor-pointer transition-all ${CARD_SURFACE} ${
        isSelected
          ? 'border-cyan-500 dark:border-cyan-500 ring-2 ring-cyan-500/40 glow-cyan'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-sm text-cyan-500 font-mono shrink-0">
            {astronaut.callsign.split('-')[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
                {astronaut.name}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {astronaut.agency}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {astronaut.role} • {astronaut.age}y ({astronaut.gender})
            </p>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Vital Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3.5 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-850 font-mono">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500" /> Pulse
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {astronaut.primaryVitals.heartRateBpm} <span className="text-[10px] font-normal text-slate-400">bpm</span>
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-500" /> BP Arterial
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {astronaut.primaryVitals.bloodPressureSys}/{astronaut.primaryVitals.bloodPressureDia}
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Wind className="w-3 h-3 text-blue-500" /> SpO₂
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {astronaut.primaryVitals.spo2Percent}%
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-500" /> HRV rMSSD
          </span>
          <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">
            {astronaut.primaryVitals.hrvRmssdMs} <span className="text-[10px] font-normal text-slate-400">ms</span>
          </span>
        </div>
      </div>

      {/* Latest Clinical Observation */}
      <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 mb-3 line-clamp-2">
        <strong className="text-slate-800 dark:text-slate-200">Latest Observation:</strong> {astronaut.latestObservation}
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <DataProvenanceBadge type={astronaut.dataAvailability === 'simulated' ? 'simulated-data' : 'live-telemetry'} />
          <span className="text-[11px] font-mono text-slate-400">
            {astronaut.evaCount} EVAs logged
          </span>
        </div>

        {onOpenDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(astronaut);
            }}
            className={`flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-mono text-xs cursor-pointer ${FOCUS_RING}`}
          >
            <span>Health Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
