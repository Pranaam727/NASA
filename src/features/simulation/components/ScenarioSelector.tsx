import React from 'react';
import { SIMULATION_SCENARIOS } from '../scenarios/scenarioDefinitions';
import { ScenarioId, SimulationScenarioDefinition } from '../scenarios/scenarioTypes';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { Check } from 'lucide-react';

interface ScenarioSelectorProps {
  currentScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  disabled?: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenarioId,
  onSelectScenario,
  disabled = false,
}) => {
  return (
    <DossierCard
      title="SIMULATION SCENARIO REPERTOIRE"
      subtitle="7 STANDARDIZED & DETERMINISTIC FLIGHT DEMONSTRATION PROFILES"
      badge={<span className="font-mono text-[10px] text-astro-text-secondary">SEEDED PRNG</span>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {SIMULATION_SCENARIOS.map((scen: SimulationScenarioDefinition) => {
          const isSelected = scen.id === currentScenarioId;

          const severityBadge = {
            LOW: 'NOMINAL' as const,
            MEDIUM: 'CAUTION' as const,
            HIGH: 'CAUTION' as const,
            CRITICAL: 'CRITICAL' as const,
          }[scen.severity];

          return (
            <button
              key={scen.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectScenario(scen.id)}
              className={`text-left p-3 rounded-sm border transition-all duration-150 relative flex flex-col justify-between ${
                isSelected
                  ? 'border-astro-text-primary bg-astro-bg-subtle ring-1 ring-astro-text-primary'
                  : 'border-astro-border-hairline bg-white hover:border-astro-border-strong hover:bg-astro-bg-subtle/40'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="space-y-1.5 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-astro-text-tertiary">
                    {scen.code}
                  </span>
                  <div className="flex items-center space-x-1">
                    <StatusIndicator status={severityBadge} label={scen.severity} size="sm" />
                    {isSelected && <Check className="w-3.5 h-3.5 text-astro-text-primary shrink-0 ml-1" />}
                  </div>
                </div>

                <h4 className="font-display text-xs font-bold text-astro-text-primary leading-tight">
                  {scen.name}
                </h4>

                <p className="font-body text-[11px] text-astro-text-secondary leading-snug">
                  {scen.description}
                </p>
              </div>

              <div className="pt-2 border-t border-astro-border-hairline/60 font-mono text-[9px] text-astro-text-tertiary leading-tight">
                <span className="uppercase text-astro-text-secondary block font-semibold">Effect:</span>
                <span>{scen.expectedBehavior}</span>
              </div>
            </button>
          );
        })}
      </div>
    </DossierCard>
  );
};
