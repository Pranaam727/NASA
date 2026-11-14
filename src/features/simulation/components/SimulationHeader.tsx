import React from 'react';
import { SimulationState } from '../engine/SimulationEngine';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { Sliders, Clock, Gauge, ShieldAlert } from 'lucide-react';

interface SimulationHeaderProps {
  state: SimulationState;
}

export const SimulationHeader: React.FC<SimulationHeaderProps> = ({ state }) => {
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const statusMap = {
    RUNNING: { label: 'SIMULATION ACTIVE', status: 'NOMINAL' as const, pulse: true },
    PAUSED: { label: 'SIMULATION PAUSED', status: 'CAUTION' as const, pulse: false },
    STOPPED: { label: 'SIMULATOR IDLE', status: 'INFO' as const, pulse: false },
  }[state.status];

  return (
    <div className="bg-white border border-astro-border-hairline rounded-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline flex items-center justify-center shrink-0">
          <Sliders className="w-5 h-5 text-astro-text-primary" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-display text-sm md:text-base font-bold text-astro-text-primary">
              Virtual Telemetry Simulation Testbed
            </h2>
            <StatusIndicator status={statusMap.status} label={statusMap.label} pulse={statusMap.pulse} size="sm" />
          </div>
          <p className="font-mono text-[11px] text-astro-text-secondary mt-0.5">
            CURRENT SCENARIO: <span className="font-semibold text-astro-text-primary uppercase">{state.scenario.name}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm">
          <Clock className="w-3.5 h-3.5 text-astro-text-secondary" />
          <span className="text-[10px] text-astro-text-tertiary uppercase">SESSION TIME:</span>
          <span className="font-semibold tabular-nums text-astro-text-primary">
            {formatSeconds(state.elapsedSeconds)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm">
          <Gauge className="w-3.5 h-3.5 text-astro-text-secondary" />
          <span className="text-[10px] text-astro-text-tertiary uppercase">RATE:</span>
          <span className="font-semibold text-astro-text-primary">{state.speedMultiplier}x</span>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-astro-status-caution" />
          <span className="text-[10px] text-astro-text-tertiary uppercase">SEVERITY:</span>
          <span className="font-semibold text-astro-text-primary">{state.scenario.severity}</span>
        </div>
      </div>
    </div>
  );
};
