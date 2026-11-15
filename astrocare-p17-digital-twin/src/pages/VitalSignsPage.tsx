import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { HeartPulse, Activity, Flame, ShieldAlert } from 'lucide-react';

interface VitalSignsPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const VitalSignsPage: React.FC<VitalSignsPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const profileMeasurements = measurements.filter((m) => m.astronautId === activeProfile?.id);
  const hrData = profileMeasurements.filter((m) => m.variable === 'resting_heart_rate');
  const sbpData = profileMeasurements.filter((m) => m.variable === 'systolic_bp');
  const vo2Data = profileMeasurements.filter((m) => m.variable === 'vo2_max');

  const latestHr = hrData.filter((m) => m.value !== null).pop()?.value ?? 64;
  const latestSbp = sbpData.filter((m) => m.value !== null).pop()?.value ?? 120;
  const latestVo2 = vo2Data.filter((m) => m.value !== null).pop()?.value ?? 44.8;

  const hrBaseline = activeProfile?.baselineMeasurements?.resting_heart_rate?.baselineValue ?? 58;
  const sbpBaseline = activeProfile?.baselineMeasurements?.systolic_bp?.baselineValue ?? 114;
  const vo2Baseline = activeProfile?.baselineMeasurements?.vo2_max?.baselineValue ?? 48.5;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Vital Signs & Cardiovascular Bio-Telemetry
            </h1>
            <Badge variant="cyan">PRIMARY VITALS MONITOR</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric streams and longitudinal hemodynamic parameters for {activeProfile?.displayName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal">
            <HeartPulse className="w-3.5 h-3.5 mr-1" />
            BIOSENSOR HARNESS ACTIVE
          </Badge>
        </div>
      </div>

      <DisclaimerNotice />

      {/* Vital Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Resting Heart Rate"
          value={latestHr}
          unit="bpm"
          baseline={hrBaseline}
          changePercent={Math.round(((latestHr - hrBaseline) / hrBaseline) * 1000) / 10}
          icon={<HeartPulse className="w-5 h-5" />}
          systemColor="text-rose-400"
          subtext="Wearable Bio-Monitor stream"
        />

        <MetricCard
          label="Systolic Blood Pressure"
          value={latestSbp}
          unit="mmHg"
          baseline={sbpBaseline}
          changePercent={Math.round(((latestSbp - sbpBaseline) / sbpBaseline) * 1000) / 10}
          icon={<Activity className="w-5 h-5" />}
          systemColor="text-cyan-400"
          subtext="Continuous In-Flight Sensor"
        />

        <MetricCard
          label="Cardiorespiratory Capacity (VO2 Max)"
          value={latestVo2}
          unit="mL/kg/min"
          baseline={vo2Baseline}
          changePercent={Math.round(((latestVo2 - vo2Baseline) / vo2Baseline) * 1000) / 10}
          icon={<Flame className="w-5 h-5" />}
          systemColor="text-amber-400"
          subtext="CEVIS Cycle Ergometer test"
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementTrendChart
          title="Resting Heart Rate Longitudinal Progression"
          variableName="Resting Heart Rate"
          unit="bpm"
          measurements={hrData}
          baselineValue={hrBaseline}
          expectedMin={50}
          expectedMax={75}
          color="#f43f5e"
        />

        <MeasurementTrendChart
          title="Systolic Arterial Pressure Trend"
          variableName="Systolic Blood Pressure"
          unit="mmHg"
          measurements={sbpData}
          baselineValue={sbpBaseline}
          expectedMin={100}
          expectedMax={135}
          color="#06b6d4"
        />
      </div>

      <Card className="p-5 space-y-3">
        <h4 className="text-sm font-semibold text-slate-200">
          Hemodynamic Adaptation Context (Flight Day {activeProfile?.missionDay})
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          During early spaceflight, the absence of hydrostatic gravity gradients shifts approximately 1.5 to 2.0 liters of fluid from the lower extremities toward the thorax and head (cephalad shift). This initially stimulates central baroreceptors, triggering compensatory diuresis and a 10–15% contraction in total plasma volume within 48 to 72 hours. Subsequent inflight resting heart rate typically remains slightly elevated to maintain cardiac output against reduced stroke volume.
        </p>
      </Card>
    </div>
  );
};
