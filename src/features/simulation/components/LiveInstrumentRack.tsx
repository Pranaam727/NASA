import React from 'react';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { MetricDisplay } from '@/components/common/DataDisplay';
import { Heart, Activity, Wind, Thermometer, Radio, ShieldAlert } from 'lucide-react';

interface LiveInstrumentRackProps {
  vitals: VitalSignsPacket | null;
  radiation: RadiationPacket | null;
}

export const LiveInstrumentRack: React.FC<LiveInstrumentRackProps> = ({ vitals, radiation }) => {
  const hr = vitals?.vitals.heartRate.value ?? 65;
  const sys = vitals?.vitals.bloodPressure.systolic ?? 115;
  const dia = vitals?.vitals.bloodPressure.diastolic ?? 75;
  const spo2 = vitals?.vitals.spo2.value ?? 98;
  const rr = vitals?.vitals.respiratoryRate.value ?? 14;
  const temp = vitals?.vitals.coreTemp.value ?? 36.8;

  const flux = radiation?.ambientFluxUsVh ?? 0.052;
  const dose = radiation?.accumulatedDoseMSv ?? 48.64;
  const isSpe = radiation?.solarParticleEventActive ?? false;

  const hrStatus = hr > 120 || hr < 48 ? 'CRITICAL' : hr > 100 ? 'CAUTION' : 'NOMINAL';
  const spo2Status = spo2 < 88 ? 'CRITICAL' : spo2 < 93 ? 'CAUTION' : 'NOMINAL';
  const radStatus = isSpe || flux > 1.0 ? 'CRITICAL' : flux > 0.1 ? 'CAUTION' : 'NOMINAL';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Heart Rate */}
      <MetricDisplay
        label="Heart Rate"
        value={hr}
        unit="bpm"
        trend={hr > 75 ? 'up' : hr < 60 ? 'down' : 'flat'}
        delta={hr > 65 ? `+${hr - 65}` : `${hr - 65}`}
        status={hrStatus}
        icon={Heart}
        subtext="ECG LEAD-II CH1"
        isSimulated
      />

      {/* 2. Blood Pressure */}
      <MetricDisplay
        label="Arterial Pressure"
        value={`${sys}/${dia}`}
        unit="mmHg"
        status={sys > 140 ? 'CAUTION' : 'NOMINAL'}
        icon={Activity}
        subtext="MAP COUPLED"
        isSimulated
      />

      {/* 3. SpO2 */}
      <MetricDisplay
        label="Pulse Oximetry"
        value={spo2}
        unit="%"
        status={spo2Status}
        icon={Wind}
        subtext={spo2 < 90 ? 'HYPOXIA WARNING' : 'NOMINAL SATURATION'}
        isSimulated
      />

      {/* 4. Respiratory Rate */}
      <MetricDisplay
        label="Respiratory Rate"
        value={rr}
        unit="rpm"
        status={rr > 22 ? 'CAUTION' : 'NOMINAL'}
        icon={Wind}
        subtext="CHEST IMPEDANCE"
        isSimulated
      />

      {/* 5. Core Body Temp */}
      <MetricDisplay
        label="Core Body Temp"
        value={temp.toFixed(1)}
        unit="°C"
        status={temp > 38.0 ? 'CAUTION' : 'NOMINAL'}
        icon={Thermometer}
        subtext="TYMPANIC PROBE"
        isSimulated
      />

      {/* 6. Radiation Flux */}
      <MetricDisplay
        label="Radiation Flux"
        value={flux.toFixed(3)}
        unit="uSv/h"
        status={radStatus}
        icon={isSpe ? ShieldAlert : Radio}
        subtext={`DOSE: ${dose.toFixed(2)} mSv`}
        isSimulated
      />
    </div>
  );
};
