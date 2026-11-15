import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { Bone, Dumbbell, Shield, BookOpen, ExternalLink } from 'lucide-react';
import { nasaResearchService } from '../services/nasaResearchService';
import { NasaResearchStudy } from '../types';

interface MusculoskeletalTwinPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const MusculoskeletalTwinPage: React.FC<MusculoskeletalTwinPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const mskData = measurements.filter(
    (m) => m.astronautId === activeProfile?.id && m.system === 'musculoskeletal'
  );
  const bmdData = mskData.filter((m) => m.variable === 'bone_mineral_density_femoral');
  const strengthData = mskData.filter((m) => m.variable === 'muscle_strength_isometric');

  const research = nasaResearchService.getBySystem('musculoskeletal');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Bone className="w-6 h-6 text-blue-500" />
              Bone & Muscle Digital Twin
            </h1>
            <Badge variant="blue">OSTEOGENESIS & SKELETAL MOTOR TWIN</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Longitudinal bone mineral density demineralization tracking and ARED resistive countermeasure effectiveness for {activeProfile?.displayName}.
          </p>
        </div>

        <Badge variant="cyan">
          {mskData.length} MUSCULOSKELETAL OBSERVATIONS
        </Badge>
      </div>

      <DisclaimerNotice />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Femoral Neck BMD"
          value={bmdData.filter((m) => m.value !== null).pop()?.value ?? 0.71}
          unit="T-score"
          baseline={activeProfile?.baselineMeasurements?.bone_mineral_density_femoral?.baselineValue ?? 0.85}
          icon={<Bone className="w-5 h-5" />}
          systemColor="text-blue-400"
          subtext="Quantitative DEXA scan model"
        />
        <MetricCard
          label="Isometric Quadriceps Torque"
          value={strengthData.filter((m) => m.value !== null).pop()?.value ?? 228}
          unit="Nm"
          baseline={activeProfile?.baselineMeasurements?.muscle_strength_isometric?.baselineValue ?? 245}
          icon={<Dumbbell className="w-5 h-5" />}
          systemColor="text-cyan-400"
          subtext="ARED In-flight load-cell test"
        />
        <MetricCard
          label="Countermeasure Protocol"
          value="ARED 6d/wk"
          unit=""
          icon={<Shield className="w-5 h-5" />}
          systemColor="text-emerald-400"
          subtext="High-strain resistive loading"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementTrendChart
          title="Femoral Neck BMD Progression"
          variableName="Femoral Neck BMD T-Score"
          unit="T-score"
          measurements={bmdData}
          baselineValue={activeProfile?.baselineMeasurements?.bone_mineral_density_femoral?.baselineValue ?? 0.85}
          color="#3b82f6"
        />

        <MeasurementTrendChart
          title="Isometric Quadriceps Muscle Torque"
          variableName="Isometric Quadriceps Strength"
          unit="Nm"
          measurements={strengthData}
          baselineValue={activeProfile?.baselineMeasurements?.muscle_strength_isometric?.baselineValue ?? 245}
          color="#14b8a6"
        />
      </div>

      {/* Linked NASA Research */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            NASA Human Research Program Bone Mineral Studies
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
