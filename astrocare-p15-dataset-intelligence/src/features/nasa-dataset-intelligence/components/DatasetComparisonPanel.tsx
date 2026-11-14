import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { MeasurementVariable } from '../types/observation.types';
import { ScientificCompatibilityReport } from '../types/comparison.types';
import { StatusBadge } from './StatusBadge';
import { 
  AlertOctagon, CheckCircle2, AlertTriangle, ShieldCheck, 
  XCircle, ArrowRight, Layers, User, PawPrint, TestTube, Scale
} from 'lucide-react';

interface DatasetComparisonPanelProps {
  datasets: DatasetRecord[];
  selectedVariable?: MeasurementVariable;
  compatibilityReport: ScientificCompatibilityReport;
  onRemoveDataset: (studyId: string) => void;
  onSelectVariable?: (variableId: string) => void;
  onClearAll: () => void;
}

export const DatasetComparisonPanel: React.FC<DatasetComparisonPanelProps> = ({
  datasets,
  selectedVariable,
  compatibilityReport,
  onRemoveDataset,
  onClearAll
}) => {
  if (datasets.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <Scale className="w-10 h-10 text-slate-600 mx-auto" />
        <h3 className="text-base font-semibold text-slate-200">No Studies Selected for Comparison</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Select at least two NASA OSDR studies from the Dataset Explorer, Catalogue, or Domain pages to perform scientific compatibility analysis and side-by-side evaluation.
        </p>
      </div>
    );
  }

  const { status, allowDirectNumericalMerge, blockingReasons, scientificNotes, checks } = compatibilityReport;

  return (
    <div className="space-y-6">
      {/* Compatibility Status Banner */}
      <div className={`p-5 rounded-2xl border ${
        status === 'INCOMPATIBLE'
          ? 'bg-rose-950/20 border-rose-500/40'
          : status === 'PARTIALLY_COMPATIBLE'
          ? 'bg-amber-950/20 border-amber-500/40'
          : 'bg-emerald-950/20 border-emerald-500/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {status === 'INCOMPATIBLE' ? (
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
            ) : status === 'PARTIALLY_COMPATIBLE' ? (
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Scientific Compatibility Status:{' '}
                  <span className={
                    status === 'INCOMPATIBLE' ? 'text-rose-400' :
                    status === 'PARTIALLY_COMPATIBLE' ? 'text-amber-400' : 'text-emerald-400'
                  }>
                    {status === 'INCOMPATIBLE' ? 'CROSS-SPECIES / MODEL INCOMPATIBLE' :
                     status === 'PARTIALLY_COMPATIBLE' ? 'QUALIFIED FOR STRATIFIED COMPARISON' : 'FULLY COMPATIBLE COHORT'}
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {allowDirectNumericalMerge
                  ? 'Studies share homogeneous biological models and measurement domains. Direct statistical stratification permitted.'
                  : 'CRITICAL SCIENTIFIC INTEGRITY ENFORCEMENT: Direct numerical merging is blocked to prevent false physiological conclusions across disparate species or assays.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Clear Comparison ({datasets.length})
            </button>
          </div>
        </div>

        {/* Blocking Reasons Alert */}
        {blockingReasons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-rose-500/20 space-y-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
              Validation Violations & Blocking Reasons:
            </span>
            <ul className="space-y-1.5 text-xs text-rose-200">
              {blockingReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scientific Notes */}
        {scientificNotes.length > 0 && (
          <div className="mt-3 text-xs text-slate-400 space-y-1">
            {scientificNotes.map((note, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5-Point Scientific Verification Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className={`p-3 rounded-xl border text-xs ${
          checks.organismCheck.passed ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-200">
            <span>1. Organism Check</span>
            {checks.organismCheck.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {checks.organismCheck.message}
          </p>
        </div>

        <div className={`p-3 rounded-xl border text-xs ${
          checks.populationCheck.passed ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-200">
            <span>2. Population Model</span>
            {checks.populationCheck.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {checks.populationCheck.message}
          </p>
        </div>

        <div className={`p-3 rounded-xl border text-xs ${
          checks.unitCheck.passed ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-200">
            <span>3. Unit Consistency</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {checks.unitCheck.message}
          </p>
        </div>

        <div className={`p-3 rounded-xl border text-xs ${
          checks.environmentCheck.passed ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-200">
            <span>4. Environment</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {checks.environmentCheck.message}
          </p>
        </div>

        <div className={`p-3 rounded-xl border text-xs bg-slate-900 border-slate-800 text-slate-300`}>
          <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-200">
            <span>5. Temporal Phases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {checks.temporalCheck.message}
          </p>
        </div>
      </div>

      {/* Side-by-Side Metadata Comparison Matrix */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
        <table className="w-full text-left text-xs divide-y divide-slate-800">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4 w-48 bg-slate-950/90 sticky left-0 z-10 border-r border-slate-800">
                Dimension
              </th>
              {datasets.map(d => (
                <th key={d.studyId} className="p-4 min-w-[260px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-cyan-400 font-bold">{d.studyId}</span>
                    <button
                      onClick={() => onRemoveDataset(d.studyId)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove from comparison"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {/* Title */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 sticky left-0 border-r border-slate-800">
                Study Title
              </td>
              {datasets.map(d => (
                <td key={d.studyId} className="p-4 font-medium text-slate-200 leading-snug">
                  {d.title}
                </td>
              ))}
            </tr>

            {/* Organism & Model */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 sticky left-0 border-r border-slate-800">
                Organism & Model
              </td>
              {datasets.map(d => (
                <td key={d.studyId} className="p-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200">{d.organism}</div>
                    <StatusBadge type="population" value={d.studyType} />
                  </div>
                </td>
              ))}
            </tr>

            {/* Mission / Environment */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 sticky left-0 border-r border-slate-800">
                Mission / Environment
              </td>
              {datasets.map(d => (
                <td key={d.studyId} className="p-4 text-slate-300">
                  <div className="font-mono text-cyan-300">{d.mission || 'Spaceflight'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{d.experimentPlatform || d.flightProgram}</div>
                </td>
              ))}
            </tr>

            {/* Assay Technologies */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 sticky left-0 border-r border-slate-800">
                Assay Technologies
              </td>
              {datasets.map(d => (
                <td key={d.studyId} className="p-4 text-slate-300 space-y-1">
                  {d.assayTypes.map((a, i) => (
                    <div key={i} className="text-[11px] text-slate-300">
                      • {a}
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Biospecimen Types */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 sticky left-0 border-r border-slate-800">
                Specimens Analyzed
              </td>
              {datasets.map(d => (
                <td key={d.studyId} className="p-4 text-slate-300">
                  <div className="flex flex-wrap gap-1">
                    {d.sampleTypes.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Repository Files */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 sticky left-0 border-r border-slate-800">
                Repository Files
              </td>
              {datasets.map(d => (
                <td key={d.studyId} className="p-4 text-slate-400 font-mono text-[11px]">
                  {d.availableFiles?.length || 0} files indexed
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
