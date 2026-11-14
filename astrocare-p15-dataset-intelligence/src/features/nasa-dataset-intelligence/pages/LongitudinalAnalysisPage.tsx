import React from 'react';
import { useLongitudinalData } from '../hooks/useLongitudinalData';
import { ResearchTimeline } from '../components/ResearchTimeline';
import { DatasetRecord } from '../types/dataset.types';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Clock, Calendar, ShieldCheck, 
  User, CheckCircle2, AlertCircle, ArrowRight, Activity 
} from 'lucide-react';

interface LongitudinalAnalysisPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
}

export const LongitudinalAnalysisPage: React.FC<LongitudinalAnalysisPageProps> = ({
  datasets,
  onSelectStudy
}) => {
  const {
    selectedStudyId,
    setSelectedStudyId,
    selectedVarId,
    setSelectedVarId,
    selectedSubjectId,
    setSelectedSubjectId,
    availableVariables,
    currentVariable,
    observations,
    availableSubjects,
    phaseAverages
  } = useLongitudinalData('OSD-575', 'var-il6');

  const currentStudy = datasets.find(d => d.studyId === selectedStudyId);

  // Chart data format
  const chartData = observations.map(obs => ({
    label: obs.phaseDayLabel,
    day: obs.phaseDay,
    value: obs.numericValue,
    subject: obs.subjectId,
    phase: obs.collectionPhase,
    unit: obs.originalUnit,
    condition: obs.experimentalCondition
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-mono font-bold text-cyan-400">{d.label} ({d.phase})</div>
          <div className="text-slate-100 font-mono font-bold">{d.value} {d.unit}</div>
          <div className="text-slate-400">Subject: {d.subject}</div>
          <div className="text-[11px] text-slate-500 max-w-xs">{d.condition}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Mission Phase Dynamics & Kinetic Profiling
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Longitudinal Research Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Temporal trajectory tracking across standardized spaceflight epochs: Preflight baseline (L-44, L-3), Inflight orbital microgravity (FD-2), and Postflight terrestrial recovery (R+1, R+3, R+82).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {observations.length} Longitudinal Points
          </span>
        </div>
      </div>

      {/* Dataset & Variable Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Study Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Spaceflight Study Accession
          </label>
          <select
            value={selectedStudyId}
            onChange={e => {
              setSelectedStudyId(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="OSD-575">OSD-575 (Inspiration4 Astronaut Serum)</option>
            <option value="OSD-661">OSD-661 (Murine Lumbar Bone Density Unloading)</option>
            <option value="OSD-2">OSD-2 (Human Cell Radiation Repair Kinetics)</option>
          </select>
        </div>

        {/* Variable Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Biomedical Parameter
          </label>
          <select
            value={selectedVarId}
            onChange={e => setSelectedVarId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            {availableVariables.map(v => (
              <option key={v.variableId} value={v.variableId}>
                {v.variableName} ({v.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Subject Cohort Stratification
          </label>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="all">All Subjects / Replicates ({availableSubjects.length})</option>
            {availableSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Longitudinal Trajectory Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                {currentVariable?.variableName} Longitudinal Trajectory
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {currentVariable?.unit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological biological progression relative to launch (L) and return (R) epochs.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Population: {currentStudy?.studyType} ({currentStudy?.organism})
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 25, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                dataKey="label" 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                dy={8}
              />
              <YAxis 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={`${currentVariable?.variableName} (${currentVariable?.unit})`}
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#0B0F19', stroke: '#06B6D4', strokeWidth: 2, r: 5 }}
                activeDot={{ fill: '#22D3EE', stroke: '#080C14', strokeWidth: 2, r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Phase Averages Bar Summary */}
        {phaseAverages.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Stratified Phase Cohort Averages:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {phaseAverages.map((pa: any, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block truncate">{pa.phase}</span>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
                    {pa.average} <span className="text-[10px] text-slate-500 font-normal">{pa.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">n={pa.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Epoch Chronology Timeline */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">
          Individual Observational Records & Biorepository Samples
        </h3>
        <ResearchTimeline observations={observations} />
      </div>
    </div>
  );
};
