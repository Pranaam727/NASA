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
    <div className="bg-[#0A1715]/90 border border-[rgba(55,210,185,0.18)] rounded-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-sm bg-[#06110F] border border-[rgba(55,210,185,0.3)] flex items-center justify-center shrink-0">
          <Sliders className="w-5 h-5 text-[#21E6D0]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-display text-sm md:text-base font-bold text-[#E8F4F0]">
              Virtual Telemetry Simulation Testbed
            </h2>
            <StatusIndicator status={statusMap.status} label={statusMap.label} pulse={statusMap.pulse} size="sm" />
          </div>
          <p className="font-mono text-[11px] text-[#8CA8A0] mt-0.5">
            CURRENT SCENARIO: <span className="font-semibold text-[#21E6D0] uppercase">{state.scenario.name}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm">
          <Clock className="w-3.5 h-3.5 text-[#21E6D0]" />
          <span className="text-[10px] text-[#8CA8A0] uppercase">SESSION TIME:</span>
          <span className="font-semibold tabular-nums text-[#E8F4F0]">
            {formatSeconds(state.elapsedSeconds)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm">
          <Gauge className="w-3.5 h-3.5 text-[#21E6D0]" />
          <span className="text-[10px] text-[#8CA8A0] uppercase">RATE:</span>
          <span className="font-semibold text-[#E8F4F0]">{state.speedMultiplier}x</span>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-[#F3BB57]" />
          <span className="text-[10px] text-[#8CA8A0] uppercase">SEVERITY:</span>
          <span className="font-semibold text-[#E8F4F0]">{state.scenario.severity}</span>
        </div>
      </div>
    </div>
  );
};
