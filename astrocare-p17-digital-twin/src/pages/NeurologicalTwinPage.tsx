import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { Brain, Compass, Gauge, BookOpen, ExternalLink } from 'lucide-react';
import { nasaResearchService } from '../services/nasaResearchService';
import { NasaResearchStudy } from '../types';

interface NeurologicalTwinPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const NeurologicalTwinPage: React.FC<NeurologicalTwinPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const neuroData = measurements.filter(
    (m) => m.astronautId === activeProfile?.id && m.system === 'neurological'
  );
  const pvtData = neuroData.filter((m) => m.variable === 'cognitive_reaction_speed');
  const latestPvt = pvtData.filter((m) => m.value !== null).pop()?.value ?? 242;
  const pvtBaseline = activeProfile?.baselineMeasurements?.cognitive_reaction_speed?.baselineValue ?? 215;

  const research = nasaResearchService.getBySystem('neurological');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Brain className="w-6 h-6 text-violet-500" />
              Neurological & Sensorimotor Digital Twin
            </h1>
            <Badge variant="violet">NEUROVESTIBULAR & SANS MONITORING</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sensorimotor balance adaptation, psychomotor vigilance task (PVT) latencies, and spaceflight-associated neuro-ocular context for {activeProfile?.displayName}.
          </p>
        </div>

        <Badge variant="cyan">
          {neuroData.length} NEUROLOGICAL RECORDS
        </Badge>
      </div>

      <DisclaimerNotice />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Cognitive PVT Reaction Latency"
          value={latestPvt}
          unit="ms"
          baseline={pvtBaseline}
          changePercent={Math.round(((latestPvt - pvtBaseline) / pvtBaseline) * 1000) / 10}
          icon={<Gauge className="w-5 h-5" />}
          systemColor="text-violet-400"
          subtext="NASA PVT-B Tablet protocol"
        />
        <MetricCard
          label="Equilibrium Postural Index"
          value={activeProfile?.baselineMeasurements?.sensorimotor_balance_score?.baselineValue ?? 92.5}
          unit="score"
          baseline={92.5}
          icon={<Compass className="w-5 h-5" />}
          systemColor="text-cyan-400"
          subtext="Dynamic posturography"
        />
        <MetricCard
          label="Neuro-Ocular (SANS) Risk Tier"
          value="Low / Monitored"
          unit=""
          icon={<Brain className="w-5 h-5" />}
          systemColor="text-teal-400"
          subtext="OCT retinal scan scheduled"
        />
      </div>

      {/* Charts */}
      <MeasurementTrendChart
        title="Psychomotor Vigilance Reaction Latency (PVT)"
        variableName="Cognitive Reaction Time (PVT)"
        unit="ms"
        measurements={pvtData}
        baselineValue={pvtBaseline}
        expectedMin={190}
        expectedMax={260}
        color="#8b5cf6"
      />

      {/* Research Integration */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            NASA Human Research Roadmap Neuro-Ocular & Vestibular Studies
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {research.length} Linked Studies
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
