import React from 'react';
import { SimulationStatus } from '../engine/SimulationEngine';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { Play, Pause, RotateCcw, Square, User } from 'lucide-react';
import { SEED_ASTRONAUTS } from '@/data/seedData';

interface SimulationControlsProps {
  status: SimulationStatus;
  currentSpeed: number;
  currentAstronautId: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStop: () => void;
  onSetSpeed: (multiplier: number) => void;
  onSetAstronaut: (id: string) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  status,
  currentSpeed,
  currentAstronautId,
  onStart,
  onPause,
  onResume,
  onReset,
  onStop,
  onSetSpeed,
  onSetAstronaut,
}) => {
  const speeds = [0.5, 1.0, 2.0, 5.0, 10.0];

  return (
    <div className="bg-[#0A1715]/90 border border-[rgba(55,210,185,0.18)] rounded-sm p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-sm">
      {/* Primary Lifecycle Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {status === 'STOPPED' && (
          <PrimaryButton onClick={onStart} icon={Play} size="md">
            START SIMULATION
          </PrimaryButton>
        )}

        {status === 'RUNNING' && (
          <SecondaryButton onClick={onPause} icon={Pause} size="md">
            PAUSE
          </SecondaryButton>
        )}

        {status === 'PAUSED' && (
          <PrimaryButton onClick={onResume} icon={Play} size="md">
            RESUME
          </PrimaryButton>
        )}

        <SecondaryButton onClick={onReset} icon={RotateCcw} size="md">
          RESET
        </SecondaryButton>

        {status !== 'STOPPED' && (
          <SecondaryButton onClick={onStop} icon={Square} size="md" variant="ghost">
            STOP
          </SecondaryButton>
        )}
      </div>

      {/* Speed Multiplier & Target Astronaut Selector */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Speed Multiplier Bar */}
        <div className="flex items-center space-x-1">
          <span className="font-mono text-[10px] uppercase text-[#8CA8A0] mr-1">
            SPEED:
          </span>
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 font-mono text-[11px] rounded-sm transition-colors ${
                currentSpeed === s
                  ? 'bg-[#21E6D0] text-[#030A09] font-bold'
                  : 'bg-[#06110F] text-[#8CA8A0] border border-[rgba(55,210,185,0.2)] hover:text-[#E8F4F0] hover:border-[#21E6D0]/50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Astronaut Selector */}
        <div className="flex items-center space-x-1.5 border-l border-[rgba(55,210,185,0.2)] pl-4">
          <User className="w-3.5 h-3.5 text-[#21E6D0]" />
          <span className="font-mono text-[10px] uppercase text-[#8CA8A0]">
            TARGET CREW:
          </span>
          <select
            value={currentAstronautId}
            onChange={(e) => onSetAstronaut(e.target.value)}
            className="font-mono text-xs font-semibold bg-[#06110F] border border-[rgba(55,210,185,0.25)] rounded-sm px-2 py-1 text-[#E8F4F0] outline-none focus:border-[#21E6D0]"
          >
            {SEED_ASTRONAUTS.map((astro) => (
              <option key={astro.id} value={astro.id} className="bg-[#0A1715] text-[#E8F4F0]">
                {astro.profile?.callsign}: {astro.profile?.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
