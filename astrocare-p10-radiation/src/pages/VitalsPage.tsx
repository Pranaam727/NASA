import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay, StatusLevel } from '@/components/common/DataDisplay';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';
import { useTelemetry } from '@/features/simulation/hooks/useTelemetry';
import { CARDIO_THRESHOLDS } from '@/features/health/cardiovascular/constants/cardioThresholds';

export const VitalsPage: React.FC = () => {
  const { latestPacket } = useTelemetry();
  const vitals = latestPacket?.vitals;

  const hrStatus: StatusLevel = vitals
    ? vitals.heartRate.value >= CARDIO_THRESHOLDS.critical.heartRate
      ? 'CRITICAL'
      : vitals.heartRate.value >= CARDIO_THRESHOLDS.warning.heartRate
      ? 'CAUTION'
      : 'NOMINAL'
    : 'NOMINAL';

  const bpStatus: StatusLevel = vitals
    ? vitals.bloodPressure.systolic >= CARDIO_THRESHOLDS.critical.systolic
      ? 'CRITICAL'
      : vitals.bloodPressure.systolic >= CARDIO_THRESHOLDS.warning.systolic
      ? 'CAUTION'
      : 'NOMINAL'
    : 'NOMINAL';

  const spo2Status: StatusLevel = vitals
    ? vitals.spo2.value <= CARDIO_THRESHOLDS.critical.spo2
      ? 'CRITICAL'
      : vitals.spo2.value <= CARDIO_THRESHOLDS.warning.spo2
      ? 'CAUTION'
      : 'NOMINAL'
    : 'NOMINAL';

  const hrValue = vitals ? vitals.heartRate.value.toString() : '68';
  const bpValue = vitals ? `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}` : '116/76';
  const spo2Value = vitals ? vitals.spo2.value.toString() : '98';
  const tempValue = vitals ? vitals.coreTemp.value.toFixed(1) : '36.8';

  return (
    <PageContainer>
      <PageHeader
        title="Real-Time Vital Monitoring"
        subtitle="Continuous telemetry streams, multi-channel physiological sensors, and ECG sweeps"
        badge={<StatusIndicator status="NOMINAL" label="1Hz STREAM ACTIVE" pulse />}
        metadata={[
          { label: 'Subject', value: 'CDR. MARCUS CHEN (ASTRO-01)' },
          { label: 'Sensor Link', value: 'VIRTUAL TELEMETRY ADAPTER' },
          { label: 'Sampling Rate', value: 'ECG 50Hz // Vitals 1Hz' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Heart Rate (ECG Lead II)"
          value={hrValue}
          unit="bpm"
          trend="flat"
          delta="0 bpm"
          status={hrStatus}
          icon={Heart}
          isSimulated
        />
        <MetricDisplay
          label="Blood Pressure (MAP)"
          value={bpValue}
          unit="mmHg"
          trend="flat"
          delta="-- "
          status={bpStatus}
          icon={Activity}
          isSimulated
        />
        <MetricDisplay
          label="Oxygen Saturation (SpO2)"
          value={spo2Value}
          unit="%"
          trend="flat"
          delta="0.0%"
          status={spo2Status}
          icon={Wind}
          isSimulated
        />
        <MetricDisplay
          label="Core Body Temp"
          value={tempValue}
          unit="°C"
          trend="flat"
          delta="-- "
          status="NOMINAL"
          icon={Thermometer}
          isSimulated
        />
      </div>

      <DossierCard
        title="ECG OSCILLOSCOPE CHANNEL // LEAD-II RHYTHM STRIP"
        subtitle="50Hz NATIVE CANVAS SWEEP RENDERER"
        badge={<StatusIndicator status="SIMULATED" label="SYNTHETIC PACING" size="sm" />}
      >
        <div className="h-44 bg-[#1A1D1A] rounded-sm border border-astro-border-hairline p-4 flex flex-col justify-between font-mono text-xs">
          <div className="flex justify-between text-[10px] text-[#738174]">
            <span>CH-01: 25mm/s // 10mm/mV // GAIN: 1.0</span>
            <span>FILTER: 0.05Hz - 150Hz</span>
          </div>

          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[#738174] uppercase tracking-wider block">
                [ OSCILLOSCOPE SWEEP ACTIVE // NORMAL SINUS RHYTHM ]
              </span>
              <span className="text-[10px] text-astro-text-secondary">
                Hardware emulation engine operational. Continuous virtual telemetry stream active.
              </span>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-astro-text-secondary border-t border-[#2A302A] pt-1">
            <span>CALIBRATION: 1.0 mV PULSE</span>
            <span>PACING: AUTONOMOUS SINUS</span>
          </div>
        </div>
      </DossierCard>
    </PageContainer>
  );
};
