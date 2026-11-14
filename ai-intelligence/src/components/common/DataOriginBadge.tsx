import React from 'react';
import { DataOrigin } from '../../types';
import { Activity, Database, Satellite } from 'lucide-react';

export const DataOriginBadge: React.FC<{ origin: DataOrigin; className?: string }> = ({ origin, className = '' }) => {
  if (origin === 'synthetic-telemetry') {
    return (
      <span
        title="Simulated high-fidelity telemetry based on NASA spaceflight parameters"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 ${className}`}
      >
        <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
        SYNTHETIC TELEMETRY (SIMULATED)
      </span>
    );
  }

  if (origin === 'nasa-hrp-ground-truth') {
    return (
      <span
        title="Verified empirical data from NASA Human Research Program Evidence Reports"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 ${className}`}
      >
        <Database className="w-3 h-3 text-emerald-400" />
        NASA HRP GROUND TRUTH (VERIFIED)
      </span>
    );
  }

  return (
    <span
      title="Realtime in-flight telemetry downlink"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-purple-950/70 border border-purple-500/40 text-purple-300 ${className}`}
    >
      <Satellite className="w-3 h-3 text-purple-400" />
      IN-FLIGHT REALTIME
    </span>
  );
};
