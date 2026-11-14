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
    <div className="bg-white border border-astro-border-hairline rounded-sm p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
          <span className="font-mono text-[10px] uppercase text-astro-text-tertiary mr-1">
            SPEED:
          </span>
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 font-mono text-[11px] rounded-sm transition-colors ${
                currentSpeed === s
                  ? 'bg-astro-text-primary text-astro-bg-primary font-bold'
                  : 'bg-astro-bg-subtle text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle/80'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Astronaut Selector */}
        <div className="flex items-center space-x-1.5 border-l border-astro-border-hairline pl-4">
          <User className="w-3.5 h-3.5 text-astro-text-secondary" />
          <span className="font-mono text-[10px] uppercase text-astro-text-tertiary">
            TARGET CREW:
          </span>
          <select
            value={currentAstronautId}
            onChange={(e) => onSetAstronaut(e.target.value)}
            className="font-mono text-xs font-semibold bg-white border border-astro-border-hairline rounded-sm px-2 py-1 text-astro-text-primary outline-none focus:border-astro-border-focus"
          >
            {SEED_ASTRONAUTS.map((astro) => (
              <option key={astro.id} value={astro.id}>
                {astro.profile?.callsign}: {astro.profile?.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
