import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import {
  ShieldingScenarioConfig,
  ShieldingScenarioResult,
  RadiationEnvironmentType,
  ShieldingMaterialType,
} from '../types/radiationTypes';
import { Layers } from 'lucide-react';

interface ShieldingScenarioToolProps {
  config: ShieldingScenarioConfig;
  onChangeConfig: (config: ShieldingScenarioConfig) => void;
  result: ShieldingScenarioResult;
}

export const ShieldingScenarioTool: React.FC<ShieldingScenarioToolProps> = ({
  config,
  onChangeConfig,
  result,
}) => {
  return (
    <div className="space-y-6">
      <DossierCard
        title="SPACECRAFT RADIATION SHIELDING & MITIGATION SCENARIO LAB"
        subtitle="HYDROGENOUS & IN-SITU MASS ATTENUATION SIMULATION // EXPONENTIAL BEAM ABSORPTION"
        action={
          <span className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase font-bold ${
            result.mitigationEfficacy === 'EXCELLENT'
              ? 'bg-astro-status-healthy/15 text-astro-status-healthy border-astro-status-healthy/40'
              : result.mitigationEfficacy === 'ACCEPTABLE'
              ? 'bg-astro-blue/15 text-astro-blue border-astro-blue/40'
              : 'bg-astro-status-warning/15 text-astro-status-warning border-astro-status-warning/40'
          }`}>
            {result.mitigationEfficacy} ATTENUATION EFFICACY
          </span>
        }
      >
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-3.5 bg-astro-bg-subtle/50 border border-astro-border-hairline rounded-sm font-mono text-xs">
            <div>
              <label className="text-astro-text-secondary block mb-1 text-[10px] uppercase">
                Mission Environment
              </label>
              <select
                value={config.environment}
                onChange={(e) => onChangeConfig({ ...config, environment: e.target.value as RadiationEnvironmentType })}
                className="w-full bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-1.5 text-astro-text-primary outline-none"
              >
                <option value="LEO">Low Earth Orbit (LEO)</option>
                <option value="CISLUNAR">Cislunar Space (Gateway)</option>
                <option value="LUNAR_SURFACE">Lunar South Pole Surface</option>
                <option value="MARS_TRANSIT">Interplanetary Mars Transit</option>
                <option value="MARS_SURFACE">Martian Surface</option>
              </select>
            </div>

            <div>
              <label className="text-astro-text-secondary block mb-1 text-[10px] uppercase">
                Primary Shielding Material
              </label>
              <select
                value={config.material}
                onChange={(e) => onChangeConfig({ ...config, material: e.target.value as ShieldingMaterialType })}
                className="w-full bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-1.5 text-astro-text-primary outline-none"
              >
                <option value="POLYETHYLENE">High-Density Polyethylene (HDPE)</option>
                <option value="WATER">Water Provisions Wall</option>
                <option value="ALUMINUM">Aerospace Aluminum 2219</option>
                <option value="CARBON_COMPOSITE">Carbon Fiber Composite</option>
                <option value="REGOLITH">In-Situ Regolith Sintering</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-[10px] uppercase text-astro-text-secondary">
                <span>Areal Density</span>
                <span className="font-bold text-astro-text-primary">{config.thicknessGcm2} g/cm²</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={config.thicknessGcm2}
                onChange={(e) => onChangeConfig({ ...config, thicknessGcm2: parseFloat(e.target.value) })}
                className="w-full accent-astro-sage cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-center pt-2 sm:pt-0">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stormShelterActive}
                  onChange={(e) => onChangeConfig({ ...config, stormShelterActive: e.target.checked })}
                  className="accent-astro-sage w-4 h-4 rounded-xs"
                />
                <span className="text-xs font-mono font-bold text-astro-text-primary uppercase">
                  +15 g/cm² Shelter Wall
                </span>
              </label>
            </div>
          </div>

          {/* Results Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-3 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Unshielded Baseline Flux</span>
              <span className="text-xl font-bold text-astro-text-primary mt-1 block">
                {result.unshieldedFluxUsVh.toFixed(3)} µSv/h
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">Deep-space external exposure</span>
            </div>

            <div className="p-3 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Attenuated Cabin Flux</span>
              <span className="text-xl font-bold text-astro-status-healthy mt-1 block">
                {result.attenuatedFluxUsVh.toFixed(3)} µSv/h
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">Inside pressurized habitat</span>
            </div>

            <div className="p-3 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Dose Reduction Factor</span>
              <span className="text-xl font-bold text-astro-sage mt-1 block">
                -{result.doseReductionPercentage}%
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">Exponential attenuation</span>
            </div>

            <div className="p-3 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Days to 30-Day Limit</span>
              <span className="text-xl font-bold text-astro-text-primary mt-1 block">
                {result.timeToThirtyDayLimitDays > 900 ? '>900 days' : `${result.timeToThirtyDayLimitDays} days`}
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">NASA 250 mSv threshold</span>
            </div>
          </div>

          {/* Engineering Synthesis Notes */}
          <div className="p-3.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-1.5">
            <div className="font-mono text-xs uppercase text-astro-text-secondary flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-astro-sage" />
              <span>Materials Engineering & Spallation Synthesis</span>
            </div>
            <p className="font-body text-xs text-astro-text-primary leading-relaxed">
              {result.engineeringNotes}
            </p>
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
