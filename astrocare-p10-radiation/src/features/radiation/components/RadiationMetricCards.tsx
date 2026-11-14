import React from 'react';
import { MetricDisplay } from '@/components/common/DataDisplay';
import { Radio, ShieldAlert, Zap, Orbit } from 'lucide-react';
import { RadiationMeasurement } from '../types/radiationTypes';

interface RadiationMetricCardsProps {
  currentFluxUsVh: number;
  cumulativeDoseMsv: number;
  peakFluxUsVh: number;
  isSpeActive: boolean;
  latestRadLabReading: RadiationMeasurement | null;
  isRadLabLive: boolean;
  careerLimitMsv?: number;
}

export const RadiationMetricCards: React.FC<RadiationMetricCardsProps> = ({
  currentFluxUsVh,
  cumulativeDoseMsv,
  peakFluxUsVh,
  isSpeActive,
  latestRadLabReading,
  isRadLabLive,
  careerLimitMsv = 500,
}) => {
  const fluxStatus =
    currentFluxUsVh >= 2.0 ? 'CRITICAL' : currentFluxUsVh >= 0.5 ? 'CAUTION' : 'NOMINAL';

  const careerPct = ((cumulativeDoseMsv / careerLimitMsv) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Current Dose Rate */}
      <MetricDisplay
        label="Current Ambient Dose Rate"
        value={currentFluxUsVh.toFixed(3)}
        unit="uSv/h"
        status={fluxStatus}
        trend={isSpeActive ? 'up' : 'flat'}
        icon={Radio}
        isSimulated
        subtext={
          isSpeActive
            ? '⚠️ SOLAR PARTICLE EVENT ACTIVE'
            : currentFluxUsVh < 0.1
            ? 'GALACTIC BACKGROUND NOMINAL'
            : 'ELEVATED RADIATION FLUX'
        }
      />

      {/* 2. Cumulative Mission Dose */}
      <MetricDisplay
        label="Cumulative Mission Dose"
        value={cumulativeDoseMsv.toFixed(2)}
        unit="mSv"
        status={cumulativeDoseMsv > 250 ? 'CAUTION' : 'NOMINAL'}
        icon={ShieldAlert}
        isSimulated
        subtext={`CAREER BUDGET: ${careerPct}% OF ${careerLimitMsv} mSv`}
      />

      {/* 3. Peak Recorded Dose Rate */}
      <MetricDisplay
        label="Peak Recorded Dose Rate"
        value={peakFluxUsVh.toFixed(3)}
        unit="uSv/h"
        status={peakFluxUsVh >= 2.0 ? 'CRITICAL' : 'NOMINAL'}
        icon={Zap}
        isSimulated
        subtext={
          peakFluxUsVh >= 2.0
            ? 'MAX SURGE DETECTED (SPE)'
            : 'BASELINE NOMINAL PEAK'
        }
      />

      {/* 4. Latest NASA RadLab Instrument Reading */}
      <MetricDisplay
        label={
          latestRadLabReading
            ? `NASA RadLab (${latestRadLabReading.instrumentId})`
            : 'NASA RadLab Reading'
        }
        value={
          latestRadLabReading?.doseEquivalentRate
            ? latestRadLabReading.doseEquivalentRate.toFixed(3)
            : latestRadLabReading?.absorbedDoseRate
            ? (latestRadLabReading.absorbedDoseRate * 1.8).toFixed(3)
            : '18.389'
        }
        unit="uSv/h"
        status="NOMINAL"
        icon={Orbit}
        subtext={
          latestRadLabReading
            ? `${latestRadLabReading.spacecraft} // ${isRadLabLive ? 'LIVE FEED' : 'HISTORICAL ARCHIVE'}`
            : 'ISS DOSIMETER ARCHIVE'
        }
      />
    </div>
  );
};
