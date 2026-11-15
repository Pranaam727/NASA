import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { Moon, Clock, BedDouble, Sun, BookOpen, ExternalLink } from 'lucide-react';
import { nasaResearchService } from '../services/nasaResearchService';
import { NasaResearchStudy } from '../types';

interface SleepCircadianTwinPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const SleepCircadianTwinPage: React.FC<SleepCircadianTwinPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const sleepData = measurements.filter(
    (m) => m.astronautId === activeProfile?.id && m.system === 'sleep_circadian'
  );
  const durationData = sleepData.filter((m) => m.variable === 'sleep_duration_actual');
  const latestDuration = durationData.filter((m) => m.value !== null).pop()?.value ?? 6.2;
  const durationBaseline = activeProfile?.baselineMeasurements?.sleep_duration_actual?.baselineValue ?? 7.6;

  const research = nasaResearchService.getBySystem('sleep_circadian');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Moon className="w-6 h-6 text-cyan-400" />
              Sleep & Circadian Rhythm Digital Twin
            </h1>
            <Badge variant="cyan">ACTIGRAPHY & CHRONOBIOLOGY</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Orbital actigraphic sleep architecture, cumulative sleep debt, and solid-state lighting countermeasure compliance for {activeProfile?.displayName}.
          </p>
        </div>

        <Badge variant="teal">
          {sleepData.length} ACTIGRAPHY SESSIONS
        </Badge>
      </div>

      <DisclaimerNotice />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Actigraphy Sleep Duration"
          value={latestDuration}
          unit="hours"
          baseline={durationBaseline}
          changePercent={Math.round(((latestDuration - durationBaseline) / durationBaseline) * 1000) / 10}
          icon={<Moon className="w-5 h-5" />}
          systemColor="text-cyan-400"
          subtext="Wrist actigraphy sensor"
        />
        <MetricCard
          label="Sleep Efficiency Index"
          value={activeProfile?.baselineMeasurements?.sleep_efficiency?.baselineValue ?? 91}
          unit="%"
          baseline={91}
          icon={<BedDouble className="w-5 h-5" />}
          systemColor="text-emerald-400"
          subtext="Nocturnal sleep continuity"
        />
        <MetricCard
          label="Lighting Countermeasure"
          value="SSLA Dynamic"
          unit=""
          icon={<Sun className="w-5 h-5" />}
          systemColor="text-amber-400"
          subtext="480nm morning blue peak"
        />
      </div>

      {/* Charts */}
      <MeasurementTrendChart
        title="Actigraphy Actual Sleep Duration Progression"
        variableName="Actigraphy Sleep Duration"
        unit="hours"
        measurements={durationData}
        baselineValue={durationBaseline}
        expectedMin={6.0}
        expectedMax={8.5}
        color="#06b6d4"
      />

      {/* NASA Chronobiology Research */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            NASA Technical Reports: Orbital Sleep & Circadian Medicine
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
