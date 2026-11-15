import React, { useState } from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import {
  Info,
  RotateCcw,
  Heart,
  Moon,
  Radio,
  Dna,
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  // Scenario Interactive Sliders
  const [sleepDeltaHours, setSleepDeltaHours] = useState<number>(-2.0); // e.g. -2 hours per night
  const [radiationSurgeRate, setRadiationSurgeRate] = useState<number>(3.5); // mSv/day surge
  const [exerciseAdherencePct, setExerciseAdherencePct] = useState<number>(50); // % of scheduled workout completed
  const [cabinCo2MmHg, setCabinCo2MmHg] = useState<number>(3.2); // ambient CO2

  const handleReset = () => {
    setSleepDeltaHours(-2.0);
    setRadiationSurgeRate(3.5);
    setExerciseAdherencePct(50);
    setCabinCo2MmHg(3.2);
  };

  // Deterministic mathematical models for hypothetical outcomes
  // 1. Cognitive Reaction Latency (PVT) increase
  const basePvtMs = 190;
  const sleepDebtFactor = Math.abs(sleepDeltaHours) * 28; // ~28ms slower per hour sleep lost
  const co2Factor = Math.max(0, (cabinCo2MmHg - 1.5) * 12);
  const projectedPvtMs = Math.round(basePvtMs + sleepDebtFactor + co2Factor);

  // 2. Projected monthly bone mineral density loss rate (normal is 1.0%/month)
  const exerciseMissedFraction = (100 - exerciseAdherencePct) / 100;
  const projectedMonthlyBmdLossPct = Number((1.0 + exerciseMissedFraction * 0.8).toFixed(2));

  // 3. Resting Heart Rate Elevation
  const projectedHrElevation = Math.round(Math.abs(sleepDeltaHours) * 3 + (radiationSurgeRate > 2 ? 6 : 0));

  // 4. DNA strand break relative hazard ratio
  const baselineDnaDamageIndex = 1.0;
  const projectedHazardRatio = Number(
    (baselineDnaDamageIndex + radiationSurgeRate * 0.45).toFixed(2)
  );

  return (
    <div className="space-y-6">
      {/* Educational Disclaimer Banner */}
      <div className="p-3.5 rounded-sm bg-astro-bg-subtle/80 border border-astro-border-hairline flex items-start space-x-3 text-xs text-astro-text-secondary">
        <Info className="w-4 h-4 text-astro-text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-astro-text-primary">EDUCATIONAL SIMULATION NOTICE:</span> This
          sandbox uses transparent mathematical heuristics and documented NASA spaceflight physiological literature to
          model multi-stressor cross-coupling. All outputs are strictly hypothetical and do not constitute clinical
          predictions.
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Projected Physiological Strain on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <DossierCard
            title="HYPOTHETICAL MISSION PARAMETERS"
            subtitle="ADJUST MULTI-AXIS ENVIRONMENTAL & ROUTINE STRESSORS"
            action={
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] font-mono text-astro-text-secondary hover:text-astro-text-primary flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            }
          >
            <div className="space-y-5 pt-2">
              {/* Slider 1: Sleep Debt */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-astro-text-primary">1. Sleep Duration Delta</span>
                  <span className="font-bold text-astro-status-caution">{sleepDeltaHours} hrs / night</span>
                </div>
                <input
                  type="range"
                  min="-4.0"
                  max="0.0"
                  step="0.5"
                  value={sleepDeltaHours}
                  onChange={(e) => setSleepDeltaHours(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-astro-text-tertiary">
                  <span>-4.0h (Severe Deprivation)</span>
                  <span>0.0h (Nominal 8h)</span>
                </div>
              </div>

              {/* Slider 2: Radiation Surge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-astro-text-primary">2. Radiation Exposure Surge</span>
                  <span className="font-bold text-astro-status-caution">+{radiationSurgeRate} mSv / day</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.5"
                  value={radiationSurgeRate}
                  onChange={(e) => setRadiationSurgeRate(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-astro-text-tertiary">
                  <span>0.5 mSv/d (Nominal GCR)</span>
                  <span>12.0 mSv/d (Solar Storm Peak)</span>
                </div>
              </div>

              {/* Slider 3: Exercise Countermeasure Adherence */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-astro-text-primary">3. Exercise Countermeasure Completion</span>
                  <span className="font-bold text-astro-text-primary">{exerciseAdherencePct}% Adherence</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={exerciseAdherencePct}
                  onChange={(e) => setExerciseAdherencePct(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-astro-text-tertiary">
                  <span>0% (Full Miss)</span>
                  <span>100% (Completed 2.5h)</span>
                </div>
              </div>

              {/* Slider 4: Ambient CO2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-astro-text-primary">4. Cabin Ambient CO2 Partial Pressure</span>
                  <span className="font-bold text-astro-status-caution">{cabinCo2MmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={cabinCo2MmHg}
                  onChange={(e) => setCabinCo2MmHg(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-astro-text-tertiary">
                  <span>0.5 mmHg (Earth ambient)</span>
                  <span>6.0 mmHg (High Hypercapnia)</span>
                </div>
              </div>
            </div>
          </DossierCard>
        </div>

        {/* Right Column: Dynamic Projected Impact Metrics */}
        <div className="lg:col-span-7 space-y-4">
          <DossierCard
            title="PROJECTED CROSS-SYSTEM PHYSIOLOGICAL STRAIN"
            subtitle="EMPIRICAL DEEP-SPACE DEVIATION RECALCULATION"
            action={<StatusIndicator status="NOMINAL" label="MODEL RUNNING" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Metric 1: Psychomotor Vigilance Latency */}
              <div className="p-4 rounded-sm bg-[#06110F] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[#8CA8A0]">
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    Cognitive Latency (PVT)
                  </span>
                  <Moon className="w-4 h-4 text-[#21E6D0]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-mono text-2xl font-bold text-[#E8F4F0]">
                    {projectedPvtMs}
                  </span>
                  <span className="font-mono text-xs text-[#57766D]">ms</span>
                  <span
                    className={`ml-auto font-mono text-xs font-semibold ${
                      projectedPvtMs > 240 ? 'text-[#F3BB57]' : 'text-[#21E6D0]'
                    }`}
                  >
                    +{projectedPvtMs - basePvtMs} ms
                  </span>
                </div>
                <p className="text-[11px] font-body text-[#8CA8A0] leading-normal">
                  Elevated response delay driven by {Math.abs(sleepDeltaHours)}h cumulative sleep restriction and elevated CO2.
                </p>
              </div>

              {/* Metric 2: Monthly BMD Loss */}
              <div className="p-4 rounded-sm bg-[#06110F] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[#8CA8A0]">
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    Bone Density Loss Rate
                  </span>
                  <Dna className="w-4 h-4 text-[#21E6D0]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-mono text-2xl font-bold text-[#E8F4F0]">
                    {projectedMonthlyBmdLossPct}%
                  </span>
                  <span className="font-mono text-xs text-[#57766D]">/ mo</span>
                  <span className="ml-auto font-mono text-xs font-semibold text-[#F3BB57]">
                    +{Number((projectedMonthlyBmdLossPct - 1.0).toFixed(2))}%
                  </span>
                </div>
                <p className="text-[11px] font-body text-[#8CA8A0] leading-normal">
                  Reduced ARED resistive countermeasure accelerates lumbar & femoral osteoclast activity.
                </p>
              </div>

              {/* Metric 3: Resting Heart Rate Shift */}
              <div className="p-4 rounded-sm bg-[#06110F] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[#8CA8A0]">
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    Resting Pulse Delta
                  </span>
                  <Heart className="w-4 h-4 text-[#21E6D0]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-mono text-2xl font-bold text-[#E8F4F0]">
                    +{projectedHrElevation}
                  </span>
                  <span className="font-mono text-xs text-[#57766D]">BPM</span>
                  <span className="ml-auto font-mono text-xs font-semibold text-[#F3BB57]">
                    Compensatory
                  </span>
                </div>
                <p className="text-[11px] font-body text-[#8CA8A0] leading-normal">
                  Sympathetic adrenergic shift secondary to chronic fatigue and inflammatory stress.
                </p>
              </div>

              {/* Metric 4: Biological DNA Damage Ratio */}
              <div className="p-4 rounded-sm bg-[#06110F] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[#8CA8A0]">
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    DNA Break Hazard Ratio
                  </span>
                  <Radio className="w-4 h-4 text-[#FF6475]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-mono text-2xl font-bold text-[#E8F4F0]">
                    {projectedHazardRatio}x
                  </span>
                  <span className="font-mono text-xs text-[#57766D]">relative</span>
                  <span className="ml-auto font-mono text-xs font-semibold text-[#FF6475]">
                    Elevated
                  </span>
                </div>
                <p className="text-[11px] font-body text-astro-text-secondary leading-normal">
                  Heavy ion flux elevates double-strand cellular breaks without storm-shelter ballast.
                </p>
              </div>
            </div>

            {/* Countermeasure Guidance Recommendation */}
            <div className="mt-4 p-3.5 rounded-sm bg-astro-bg-subtle/60 border border-astro-border-hairline space-y-1">
              <span className="font-mono text-[10px] font-bold text-astro-text-primary uppercase block">
                CORRESPONDING FLIGHT SURGEON COUNTERMEASURE RECOMMENDATION:
              </span>
              <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
                Under the selected scenario parameters: enforce 90-minute circadian rest extension, increase ARED deadlift
                work sets by +15%, verify storm-shelter water-wall ballast integrity, and increase habitat air scrubber
                LiOH canister cycling to keep ambient CO2 below 2.0 mmHg.
              </p>
            </div>
          </DossierCard>
        </div>
      </div>
    </div>
  );
};
