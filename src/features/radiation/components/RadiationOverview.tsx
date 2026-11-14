import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { MetricDisplay } from '@/components/common/DataDisplay';
import { RadiationDoseReading, BiologicalRiskEvaluation } from '../types/radiationTypes';
import { Radio, ShieldAlert, Activity, SunMedium, Flame } from 'lucide-react';

interface RadiationOverviewProps {
  reading: RadiationDoseReading;
  risk: BiologicalRiskEvaluation;
}

export const RadiationOverview: React.FC<RadiationOverviewProps> = ({ reading, risk }) => {
  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return 'text-astro-status-critical border-astro-status-critical/40 bg-astro-status-critical/10';
      case 'HAZARDOUS':
        return 'text-astro-status-warning border-astro-status-warning/40 bg-astro-status-warning/10';
      case 'ELEVATED':
        return 'text-astro-status-caution border-astro-status-caution/40 bg-astro-status-caution/10';
      default:
        return 'text-astro-status-healthy border-astro-status-healthy/40 bg-astro-status-healthy/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Ambient Ionizing Flux"
          value={reading.ambientFluxUsVh.toFixed(3)}
          unit="µSv/h"
          status={reading.ambientFluxUsVh > 1.0 ? 'CRITICAL' : reading.ambientFluxUsVh > 0.25 ? 'CAUTION' : 'NOMINAL'}
          icon={Radio}
          isSimulated
          subtext={`GCR: ${reading.fluxGcrUsVh.toFixed(3)} | SPE: ${reading.fluxSpeUsVh.toFixed(3)}`}
        />

        <MetricDisplay
          label="Mission Absorbed Dose"
          value={reading.accumulatedDoseMsv.toFixed(2)}
          unit="mSv"
          status={reading.accumulatedDoseMsv > 250 ? 'CAUTION' : 'NOMINAL'}
          icon={ShieldAlert}
          isSimulated
          subtext="30-DAY LIMIT: 250 mSv"
        />

        <MetricDisplay
          label="Cumulative Career Exposure"
          value={reading.careerDoseMsv.toFixed(1)}
          unit="mSv"
          status={risk.careerDosePercent > 75 ? 'CAUTION' : 'NOMINAL'}
          icon={Activity}
          isSimulated
          subtext={`NASA LIMIT: ${risk.careerLimitMsv} mSv (${risk.careerDosePercent}%)`}
        />

        <MetricDisplay
          label="Solar Storm Threat"
          value={reading.fluxSpeUsVh > 0.5 ? 'ACTIVE SPE' : 'NOMINAL'}
          unit={reading.fluxSpeUsVh > 0 ? `+${reading.fluxSpeUsVh.toFixed(2)} µSv/h` : 'BACKGROUND'}
          status={reading.fluxSpeUsVh > 1.0 ? 'CRITICAL' : reading.fluxSpeUsVh > 0 ? 'CAUTION' : 'NOMINAL'}
          icon={SunMedium}
          subtext="HELIOSPHERIC OBSERVATORY FEED"
        />
      </div>

      {/* Main Status Dossier */}
      <DossierCard
        title="SPACE RADIATION DOSIMETRY STATUS & DIRECTIVE"
        subtitle="SPECTROMETER SENSORS CH-01 TO CH-04 | TIME INTEGRATED"
        action={
          <span className={`font-mono text-[9px] px-2.5 py-0.5 rounded-sm border uppercase font-bold ${getRiskColor(risk.biologicalRiskTier)}`}>
            {risk.biologicalRiskTier} BIOLOGICAL RISK TIER
          </span>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-astro-bg-subtle/50 border border-astro-border-hairline rounded-sm flex items-start space-x-3">
            <Flame className="w-4 h-4 text-astro-sage shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-[10px] text-astro-text-secondary uppercase block mb-0.5">
                Flight Surgeon Radiation Directive:
              </span>
              <p className="font-body text-xs text-astro-text-primary leading-relaxed">
                {risk.recommendedAction}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono text-xs">
            <div className="p-2.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Excess Cancer Risk (REID)</span>
              <span className="text-base font-bold text-astro-text-primary mt-1 block">
                +{risk.excessLifetimeCancerRiskPercent}%
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">NASA Standard ≤ 3.0%</span>
            </div>

            <div className="p-2.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">DNA Double-Strand Breaks</span>
              <span className="text-base font-bold text-astro-text-primary mt-1 block">
                {risk.dnaDoubleStrandBreaksPerCell} / cell
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">Heavy ion cluster lesions</span>
            </div>

            <div className="p-2.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Acute Rad Sickness (ARS)</span>
              <span className={`text-base font-bold mt-1 block ${risk.acuteRadiationSicknessRisk !== 'NEGLIGIBLE' ? 'text-astro-status-warning' : 'text-astro-status-healthy'}`}>
                {risk.acuteRadiationSicknessRisk}
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">Prodromal index</span>
            </div>

            <div className="p-2.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm">
              <span className="text-[10px] text-astro-text-secondary uppercase block">Tissue Degradation Score</span>
              <span className="text-base font-bold text-astro-text-primary mt-1 block">
                {risk.tissueDegradationScore} / 100
              </span>
              <span className="text-[9px] text-astro-text-secondary mt-0.5 block">Microvasculature & Lens</span>
            </div>
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
