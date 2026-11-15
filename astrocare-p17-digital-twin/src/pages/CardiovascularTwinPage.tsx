import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { Heart, Activity, Flame, ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';
import { nasaResearchService } from '../services/nasaResearchService';
import { NasaResearchStudy } from '../types';

interface CardiovascularTwinPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const CardiovascularTwinPage: React.FC<CardiovascularTwinPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const cardioData = measurements.filter(
    (m) => m.astronautId === activeProfile?.id && m.system === 'cardiovascular'
  );
  const hrData = cardioData.filter((m) => m.variable === 'resting_heart_rate');
  const bpData = cardioData.filter((m) => m.variable === 'systolic_bp');
  const vo2Data = cardioData.filter((m) => m.variable === 'vo2_max');

  const research = nasaResearchService.getBySystem('cardiovascular');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              Cardiovascular Digital Twin
            </h1>
            <Badge variant="rose">HEMODYNAMICS & CARDIAC ADAPTATION</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic cardiac volume, autonomic baroreflex adaptation, and aerobic capacity modeling for {activeProfile?.displayName}.
          </p>
        </div>

        <Badge variant="cyan">
          {cardioData.length} CARDIOVASCULAR OBSERVATIONS
        </Badge>
      </div>

      <DisclaimerNotice />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Resting Heart Rate"
          value={hrData.filter((m) => m.value !== null).pop()?.value ?? 64}
          unit="bpm"
          baseline={activeProfile?.baselineMeasurements?.resting_heart_rate?.baselineValue ?? 58}
          icon={<Heart className="w-5 h-5" />}
          systemColor="text-rose-400"
        />
        <MetricCard
          label="Systolic Blood Pressure"
          value={bpData.filter((m) => m.value !== null).pop()?.value ?? 122}
          unit="mmHg"
          baseline={activeProfile?.baselineMeasurements?.systolic_bp?.baselineValue ?? 114}
          icon={<Activity className="w-5 h-5" />}
          systemColor="text-cyan-400"
        />
        <MetricCard
          label="VO2 Max Capacity"
          value={vo2Data.filter((m) => m.value !== null).pop()?.value ?? 44.8}
          unit="mL/kg/min"
          baseline={activeProfile?.baselineMeasurements?.vo2_max?.baselineValue ?? 48.5}
          icon={<Flame className="w-5 h-5" />}
          systemColor="text-amber-400"
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementTrendChart
          title="Resting Cardiac Rate Trend"
          variableName="Resting Heart Rate"
          unit="bpm"
          measurements={hrData}
          baselineValue={activeProfile?.baselineMeasurements?.resting_heart_rate?.baselineValue ?? 58}
          color="#f43f5e"
        />

        <MeasurementTrendChart
          title="Systolic Arterial Pressure Progression"
          variableName="Systolic Blood Pressure"
          unit="mmHg"
          measurements={bpData}
          baselineValue={activeProfile?.baselineMeasurements?.systolic_bp?.baselineValue ?? 114}
          color="#06b6d4"
        />
      </div>

      {/* Research Integration */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            NASA Human Research Program & GeneLab Cardiovascular Studies
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {research.length} Linked Publications
          </span>
        </div>

        <div className="space-y-3">
          {research.map((s: NasaResearchStudy) => (
            <div key={s.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-slate-200">{s.title}</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1 shrink-0"
                >
                  {s.accessionNumber}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-400 text-[11px]">{s.keyFindings[0]}</p>
              <div className="text-[10px] text-slate-500 font-mono">
                Limitations: {s.limitations}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
