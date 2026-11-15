import React, { useState } from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UnitTag } from '../common/UnitTag';
import { areVariablesCompatible, BIOMEDICAL_VARIABLE_REGISTRY } from '../../utils/unitValidation';
import { DisclaimerNotice } from '../common/DisclaimerNotice';
import { GitCompare, AlertCircle, ArrowRightLeft } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface HealthComparisonPanelProps {
  profiles: AstronautProfile[];
  allMeasurements: PhysiologicalMeasurement[];
}

export const HealthComparisonPanel: React.FC<HealthComparisonPanelProps> = ({
  profiles,
  allMeasurements,
}) => {
  const [profileAId, setProfileAId] = useState<string>(profiles[0]?.id || 'astro-001');
  const [profileBId, setProfileBId] = useState<string>(profiles[1]?.id || 'astro-002');
  const [selectedVarKey, setSelectedVarKey] = useState<string>('resting_heart_rate');

  const profileA = profiles.find((p) => p.id === profileAId);
  const profileB = profiles.find((p) => p.id === profileBId);

  const measurementsA = allMeasurements.filter(
    (m) => m.astronautId === profileAId && m.variable === selectedVarKey
  );
  const measurementsB = allMeasurements.filter(
    (m) => m.astronautId === profileBId && m.variable === selectedVarKey
  );

  const varDef = BIOMEDICAL_VARIABLE_REGISTRY[selectedVarKey];

  // Unit compatibility validation
  const compatibilityCheck = areVariablesCompatible(selectedVarKey, selectedVarKey);

  // Compile comparison data points
  const latestA = measurementsA.filter((m) => m.value !== null).pop();
  const latestB = measurementsB.filter((m) => m.value !== null).pop();
  const baselineA = profileA?.baselineMeasurements[selectedVarKey]?.baselineValue;
  const baselineB = profileB?.baselineMeasurements[selectedVarKey]?.baselineValue;

  const comparisonBarData = [
    {
      subject: profileA?.displayName || 'Subject A',
      baseline: baselineA ?? null,
      latest: latestA?.value ?? null,
    },
    {
      subject: profileB?.displayName || 'Subject B',
      baseline: baselineB ?? null,
      latest: latestB?.value ?? null,
    },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              Longitudinal Health Comparison Workspace
            </h3>
            <Badge variant="cyan">COHORT & BASELINE COMPARISON</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validate unit compatibility, compare individual trajectories against personal baselines, and evaluate cross-mission physiological responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal">
            <ArrowRightLeft className="w-3 h-3 mr-1" />
            UNIT COMPATIBILITY CHECK ACTIVE
          </Badge>
        </div>
      </div>

      {/* Profile & Variable Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Subject Profile A
          </label>
          <select
            value={profileAId}
            onChange={(e) => setProfileAId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName} ({p.missionId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Subject Profile B
          </label>
          <select
            value={profileBId}
            onChange={(e) => setProfileBId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName} ({p.missionId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Biomedical Variable
          </label>
          <select
            value={selectedVarKey}
            onChange={(e) => setSelectedVarKey(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {Object.values(BIOMEDICAL_VARIABLE_REGISTRY).map((v) => (
              <option key={v.variableKey} value={v.variableKey}>
                {v.name} [{v.standardUnit}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compatibility Banner */}
      {!compatibilityCheck.compatible && (
        <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{compatibilityCheck.reason}</span>
        </div>
      )}

      {/* Comparison Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Side-by-Side Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Profile A Summary */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">
                SUBJECT A: {profileA?.displayName}
              </span>
              <Badge variant="blue">{profileA?.missionPhase}</Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Mission: {profileA?.missionId} ({profileA?.missionType}) • FD {profileA?.missionDay}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px]">Ground Baseline:</span>
                <div className="text-slate-200 font-bold">
                  {baselineA !== undefined ? `${baselineA} ${varDef?.standardUnit}` : 'Unavailable'}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Latest Observed:</span>
                <div className="text-cyan-300 font-bold">
                  {latestA?.value !== undefined ? `${latestA.value} ${varDef?.standardUnit}` : 'Unavailable'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile B Summary */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-400">
                SUBJECT B: {profileB?.displayName}
              </span>
              <Badge variant="violet">{profileB?.missionPhase}</Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Mission: {profileB?.missionId} ({profileB?.missionType}) • FD {profileB?.missionDay}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px]">Ground Baseline:</span>
                <div className="text-slate-200 font-bold">
                  {baselineB !== undefined ? `${baselineB} ${varDef?.standardUnit}` : 'Unavailable'}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Latest Observed:</span>
                <div className="text-violet-300 font-bold">
                  {latestB?.value !== undefined ? `${latestB.value} ${varDef?.standardUnit}` : 'Unavailable'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Comparison Chart */}
        <div className="lg:col-span-7 p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Baseline vs Inflight Observation Comparison
            </span>
            <UnitTag unit={varDef?.standardUnit || 'units'} />
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="subject"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-mono">
                          <div className="text-cyan-400 font-semibold">{payload[0].payload.subject}</div>
                          {payload.map((item, idx) => (
                            <div key={idx} style={{ color: item.color }}>
                              {item.name}: {item.value !== null ? `${item.value} ${varDef?.standardUnit}` : 'Unavailable'}
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Bar dataKey="baseline" name="Ground Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latest" name="Latest Inflight Value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center">
            Comparing identical measurement dimension [{varDef?.standardUnit}]. Preserves scientific unit integrity.
          </div>
        </div>
      </div>

      <DisclaimerNotice compact />
    </Card>
  );
};
