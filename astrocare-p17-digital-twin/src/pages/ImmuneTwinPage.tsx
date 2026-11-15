import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { ShieldCheck, TestTube2, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import { nasaResearchService } from '../services/nasaResearchService';
import { NasaResearchStudy } from '../types';

interface ImmuneTwinPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const ImmuneTwinPage: React.FC<ImmuneTwinPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const immuneData = measurements.filter(
    (m) => m.astronautId === activeProfile?.id && m.system === 'immune'
  );
  const tnfData = immuneData.filter((m) => m.variable === 'tnf_alpha');
  const validTnf = tnfData.filter((m) => m.value !== null);
  const latestTnf = validTnf.pop()?.value ?? 4.8;
  const tnfBaseline = activeProfile?.baselineMeasurements?.tnf_alpha?.baselineValue ?? 2.1;

  const research = nasaResearchService.getBySystem('immune');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Immune & Cytokine Health Digital Twin
            </h1>
            <Badge variant="emerald">IMMUNE SURVEILLANCE & BIOMARKERS</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Circulating pro-inflammatory cytokine tracking, T-cell activation dynamics, and laboratory biomarker surveillance for {activeProfile?.displayName}.
          </p>
        </div>

        <Badge variant="cyan">
          {immuneData.length} IMMUNE LABORATORY RECORDS
        </Badge>
      </div>

      <DisclaimerNotice />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Serum TNF-Alpha"
          value={latestTnf}
          unit="pg/mL"
          baseline={tnfBaseline}
          changePercent={Math.round(((latestTnf - tnfBaseline) / tnfBaseline) * 1000) / 10}
          icon={<TestTube2 className="w-5 h-5" />}
          systemColor="text-amber-400"
          subtext="i-STAT in-flight immunoassay"
        />
        <MetricCard
          label="T-Cell CD69 Activation"
          value={activeProfile?.baselineMeasurements?.t_cell_activation?.baselineValue ?? 84}
          unit="%"
          baseline={84}
          icon={<ShieldCheck className="w-5 h-5" />}
          systemColor="text-emerald-400"
          subtext="Mitogen stimulation assay"
        />
        <MetricCard
          label="Missing Telemetry Points"
          value={immuneData.filter((m) => m.value === null).length}
          unit="gaps"
          icon={<AlertTriangle className="w-5 h-5" />}
          systemColor="text-amber-400"
          subtext="Centrifuge thermal excursion"
        />
      </div>

      {/* Trend Chart */}
      <MeasurementTrendChart
        title="Serum TNF-alpha Pro-Inflammatory Cytokine Dynamics"
        variableName="Serum TNF-alpha"
        unit="pg/mL"
        measurements={tnfData}
        baselineValue={tnfBaseline}
        expectedMin={1.0}
        expectedMax={3.5}
        color="#10b981"
      />

      {/* Linked NASA OSDR Studies */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            NASA OSDR & Human Spaceflight Immune Research
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
