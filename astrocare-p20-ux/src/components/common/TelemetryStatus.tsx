import React from 'react';
import { Radio, Wifi, WifiOff, Activity } from 'lucide-react';

interface TelemetryStatusProps {
  status: 'connected' | 'degraded' | 'los' | 'simulated';
  lastSync: string;
  className?: string;
}

export const TelemetryStatus: React.FC<TelemetryStatusProps> = ({
  status,
  lastSync,
  className = ''
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return {
          label: 'NOMINAL DOWNLINK',
          color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
          icon: <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        };
      case 'degraded':
        return {
          label: 'DEGRADED BANDWIDTH',
          color: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
          icon: <Activity className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'los':
        return {
          label: 'LOSS OF SIGNAL (LOS)',
          color: 'text-rose-400 bg-rose-950/80 border-rose-500/40',
          icon: <WifiOff className="w-3.5 h-3.5 text-rose-400" />
        };
      case 'simulated':
        return {
          label: 'HIGH-FIDELITY SIMULATION',
          color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
          icon: <Radio className="w-3.5 h-3.5 text-cyan-400" />
        };
    }
  };

  const current = getStatusDisplay();

  return (
    <div className={`flex items-center gap-2 text-xs font-mono ${className}`}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${current.color}`}>
        {current.icon}
        <span className="font-semibold tracking-wider">{current.label}</span>
      </span>
      <span className="text-[11px] text-slate-500 dark:text-slate-400">
        Sync: {lastSync}
      </span>
    </div>
  );
};
