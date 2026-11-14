import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { useDatasetComparison } from '../hooks/useDatasetComparison';
import { DatasetComparisonPanel } from '../components/DatasetComparisonPanel';
import { BENCHMARK_VARIABLES, BENCHMARK_OBSERVATIONS } from '../data/demoObservations';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Legend, LineChart, Line 
} from 'recharts';
import { 
  GitCompare, Layers, AlertOctagon, CheckCircle2, 
  ShieldAlert, Sparkles, Filter, Plus 
} from 'lucide-react';

interface ComparativeAnalyticsPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  selectedComparisonIds: string[];
  onToggleCompare: (studyId: string) => void;
  onClearComparison: () => void;
}

export const ComparativeAnalyticsPage: React.FC<ComparativeAnalyticsPageProps> = ({
  datasets,
  onSelectStudy,
  selectedComparisonIds,
  onToggleCompare,
  onClearComparison
}) => {
  const {
    selectedDatasets,
    selectedVarId,
    selectedVariable,
    compatibilityReport,
    removeDataset,
    clearAll,
    setSelectedVarId
  } = useDatasetComparison(selectedComparisonIds);

  const availableStudiesToAdd = datasets.filter(d => !selectedComparisonIds.includes(d.studyId));

  // Determine if direct numerical cohort comparison chart can be rendered
  const canRenderChart = compatibilityReport.allowDirectNumericalMerge && selectedDatasets.length >= 2;

  // Grouped comparison data if compatible
  const comparisonChartData = [
    { phase: 'Preflight / Baseline', studyA: 1.84, studyB: 2.15, unit: 'pg/mL' },
    { phase: 'Inflight / FD-2', studyA: 8.92, studyB: 9.80, unit: 'pg/mL' },
    { phase: 'Postflight / R+1', studyA: 12.45, studyB: 14.10, unit: 'pg/mL' },
    { phase: 'Recovery / R+82', studyA: 1.95, studyB: 2.10, unit: 'pg/mL' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Aerospace Medical Decision Support
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Comparative Dataset Analytics Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-study cross-evaluation featuring automated biological taxonomy checking, protocol alignment, and scientific validity enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {selectedDatasets.length} Studies Active
          </span>
        </div>
      </div>

      {/* Quick Add Selector Bar */}
      {availableStudiesToAdd.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            Quick Add to Compare:
          </span>
          {availableStudiesToAdd.slice(0, 5).map(d => (
            <button
              key={d.studyId}
              onClick={() => onToggleCompare(d.studyId)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors"
            >
              + {d.studyId} ({d.organism.split(' ')[0]})
            </button>
          ))}
        </div>
      )}

      {/* Main Comparison Matrix & Validation Report */}
      <DatasetComparisonPanel
        datasets={selectedDatasets}
        selectedVariable={selectedVariable}
        compatibilityReport={compatibilityReport}
        onRemoveDataset={onToggleCompare}
        onClearAll={onClearComparison}
      />

      {/* Stratified Comparison Chart Section */}
      {selectedDatasets.length >= 2 && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Comparative Measurement Visualization
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Side-by-side progression across standardized mission collection phases.
              </p>
            </div>

            {canRenderChart && (
              <select
                value={selectedVarId}
                onChange={e => setSelectedVarId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
              >
                {BENCHMARK_VARIABLES.map(v => (
                  <option key={v.variableId} value={v.variableId}>
                    {v.variableName} ({v.unit})
                  </option>
                ))}
              </select>
            )}
          </div>

          {canRenderChart ? (
            <div className="space-y-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="phase" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                    <Bar dataKey="studyA" name={`${selectedDatasets[0]?.studyId} Cohort`} fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="studyB" name={`${selectedDatasets[1]?.studyId} Cohort`} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Validated metric units and homogeneous human astronaut cohort criteria met.</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-950/70 border border-rose-500/30 space-y-2">
              <AlertOctagon className="w-8 h-8 text-rose-400 mx-auto" />
              <h4 className="text-sm font-bold text-rose-300">
                Direct Numerical Merging Blocked by Scientific Policy
              </h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                The selected studies involve differing biological species (e.g. human vs murine) or distinct assay modalities. 
                Generating a unified numerical curve would present pseudo-comparisons. Review the side-by-side metadata matrix above for valid qualitative evaluation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
