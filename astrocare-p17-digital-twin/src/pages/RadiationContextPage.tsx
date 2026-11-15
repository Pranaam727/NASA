import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { Radiation, Shield, Activity, BookOpen, ExternalLink } from 'lucide-react';
import { nasaResearchService } from '../services/nasaResearchService';
import { NasaResearchStudy } from '../types';

interface RadiationContextPageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const RadiationContextPage: React.FC<RadiationContextPageProps> = ({
  activeProfile,
  measurements,
}) => {
  const radData = measurements.filter(
    (m) => m.astronautId === activeProfile?.id && m.system === 'radiation_context'
  );
  const dailyRateData = radData.filter((m) => m.variable === 'radiation_daily_rate');
  const cumulativeData = radData.filter((m) => m.variable === 'radiation_cumulative_dose');

  const latestDailyRate = dailyRateData.filter((m) => m.value !== null).pop()?.value ?? 0.48;
  const latestCumul = cumulativeData.filter((m) => m.value !== null).pop()?.value ?? 30.2;

  const research = nasaResearchService.getBySystem('radiation_context');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Radiation className="w-6 h-6 text-amber-500" />
              Space Radiation Exposure Context
            </h1>
            <Badge variant="amber">DOSIMETRIC MODELING</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Galactic cosmic ray (GCR) and solar particle event (SPE) dosimetric monitoring and permissible exposure limits (PEL) for {activeProfile?.displayName}.
          </p>
        </div>

        <Badge variant="cyan">
          {radData.length} DOSIMETER RECORDS
        </Badge>
      </div>

      <DisclaimerNotice />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          label="Cumulative Dose Equivalent"
          value={latestCumul}
          unit="mSv"
          baseline="0.0 mSv"
          icon={<Radiation className="w-5 h-5" />}
          systemColor="text-amber-400"
          subtext="Career limit: 600 mSv (NASA-STD-3001)"
        />
        <MetricCard
          label="Daily Dose Equivalent Rate"
          value={latestDailyRate}
          unit="mSv/day"
          baseline="0.001 mSv/d"
          icon={<Activity className="w-5 h-5" />}
          systemColor="text-cyan-400"
          subtext="CPDS active directional sensor"
        />
        <MetricCard
          label="Radiation Environment"
          value={activeProfile?.missionType === 'Lunar Gateway' ? 'Cislunar NRHO' : 'LEO ISS'}
          unit=""
          icon={<Shield className="w-5 h-5" />}
          systemColor="text-emerald-400"
          subtext="Geomagnetic shielding active"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementTrendChart
          title="Daily Radiation Dose Rate Progression"
          variableName="Daily Dose Equivalent Rate"
          unit="mSv/day"
          measurements={dailyRateData}
          expectedMin={0.2}
          expectedMax={1.5}
          color="#f59e0b"
        />

        <MeasurementTrendChart
          title="Cumulative Absorbed Dose Equivalent"
          variableName="Cumulative Absorbed Dose Equivalent"
          unit="mSv"
          measurements={cumulativeData}
          expectedMin={0}
          expectedMax={100}
          color="#e11d48"
        />
      </div>

      {/* NASA Space Radiation PEL Studies */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            NASA Technical Reports & Radiation Permissible Limits
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
