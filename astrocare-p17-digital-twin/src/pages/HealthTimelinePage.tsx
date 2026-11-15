import React, { useState } from 'react';
import { AstronautProfile, PhysiologicalMeasurement, MissionPhase } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { UnitTag } from '../components/common/UnitTag';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { History, Filter, AlertCircle, Calendar, Layers } from 'lucide-react';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';

interface HealthTimelinePageProps {
  activeProfile: AstronautProfile;
  measurements: PhysiologicalMeasurement[];
}

export const HealthTimelinePage: React.FC<HealthTimelinePageProps> = ({
  activeProfile,
  measurements,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<MissionPhase | 'All'>('All');
  const [systemFilter, setSystemFilter] = useState<string>('All');
  const [variableFilter, setVariableFilter] = useState<string>('resting_heart_rate');

  const profileMeasurements = measurements.filter((m) => m.astronautId === activeProfile?.id);

  // Filtered timeline stream
  const filteredTimeline = profileMeasurements
    .filter((m) => {
      const matchPhase = phaseFilter === 'All' || m.missionPhase === phaseFilter;
      const matchSystem = systemFilter === 'All' || m.system === systemFilter;
      return matchPhase && matchSystem;
    })
    .sort((a, b) => a.missionDay - b.missionDay);

  const selectedVariableMeasurements = profileMeasurements.filter(
    (m) => m.variable === variableFilter
  );

  const currentVarObj = profileMeasurements.find((m) => m.variable === variableFilter);
  const baselineVal = activeProfile?.baselineMeasurements[variableFilter]?.baselineValue;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Longitudinal Health Timeline
            </h1>
            <Badge variant="cyan">MISSION CHRONOLOGY</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological multi-phase observation ledger across Preflight, Inflight, and Postflight readaptation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal">
            <History className="w-3.5 h-3.5 mr-1" />
            {filteredTimeline.length} TIMELINE NODES
          </Badge>
        </div>
      </div>

      <DisclaimerNotice />

      {/* Filter Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Mission Phase Filter
          </label>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Phases</option>
            <option value="Preflight">Preflight</option>
            <option value="Inflight">Inflight</option>
            <option value="Postflight">Postflight</option>
            <option value="Recovery">Recovery</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Physiological Domain
          </label>
          <select
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Systems</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="musculoskeletal">Musculoskeletal</option>
            <option value="immune">Immune</option>
            <option value="neurological">Neurological & Vestibular</option>
            <option value="sleep_circadian">Sleep & Circadian</option>
            <option value="radiation_context">Radiation Context</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Focused Variable Chart
          </label>
          <select
            value={variableFilter}
            onChange={(e) => setVariableFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="resting_heart_rate">Resting Heart Rate [bpm]</option>
            <option value="systolic_bp">Systolic BP [mmHg]</option>
            <option value="vo2_max">Aerobic Capacity (VO2 Max) [mL/kg/min]</option>
            <option value="bone_mineral_density_femoral">Femoral BMD [T-Score]</option>
            <option value="muscle_strength_isometric">Isometric Strength [Nm]</option>
            <option value="tnf_alpha">Serum TNF-alpha [pg/mL]</option>
            <option value="cognitive_reaction_speed">Reaction Time (PVT) [ms]</option>
            <option value="sleep_duration_actual">Sleep Duration [hours]</option>
            <option value="radiation_cumulative_dose">Cumulative Radiation [mSv]</option>
          </select>
        </div>
      </div>

      {/* Primary Variable Trend Chart */}
      <MeasurementTrendChart
        title={`Longitudinal Observation Series: ${currentVarObj?.variableName || variableFilter}`}
        variableName={currentVarObj?.variableName || variableFilter}
        unit={currentVarObj?.unit || 'units'}
        measurements={selectedVariableMeasurements}
        baselineValue={baselineVal}
        color="#06b6d4"
      />

      {/* Chronological Observation Ledger */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Chronological Observation Record Ledger
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {filteredTimeline.length} Ingested Events
          </span>
        </div>

        <div className="space-y-3">
          {filteredTimeline.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800">
              No observation events matching the selected filters.
            </div>
          ) : (
            filteredTimeline.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                  item.value === null
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {item.missionDay < 0 ? `L${item.missionDay}` : `FD ${item.missionDay}`}
                    </span>
                    <Badge variant={item.missionPhase === 'Inflight' ? 'cyan' : 'blue'} size="sm">
                      {item.missionPhase}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-sm">
                        {item.variableName}
                      </span>
                      <UnitTag unit={item.unit} />
                      <span className="text-slate-500 font-mono text-[11px]">
                        [{item.system}]
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Source: {item.sourceReference} ({item.sourceType})
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-amber-300/90 italic flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto font-mono text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Observed Value</span>
                    {item.value !== null ? (
                      <span className="text-base font-bold text-slate-100">
                        {item.value} {item.unit}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 italic">
                        Missing / Gap
                      </span>
                    )}
                  </div>

                  <div className="border-l border-slate-800 pl-3">
                    <span className="text-[10px] text-slate-500 block">Quality</span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {item.qualityScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
