import React, { useState } from 'react';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { immuneService } from '../../services/immune/immuneService';
import { StateBadge } from '../../components/shared/StateBadge';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  FlaskConical,
  Activity,
  Filter,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const BiomarkersPage: React.FC = () => {
  const { currentAstronaut } = useAstroCareContext();

  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | 'CYTOKINE' | 'INFLAMMATORY' | 'STRESS_HORMONAL'
  >('ALL');
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>('IL_6');
  const [expandedRow, setExpandedRow] = useState<string | null>('BM-014');

  const records = immuneService.getBiomarkerRecords({
    astronautId: currentAstronaut.astronautId,
    category: selectedCategory,
  });

  const timelinePoints = immuneService.getLongitudinalTimeline(currentAstronaut.astronautId);
  const longitudinalSummaries = immuneService.getAllLongitudinalMetrics(currentAstronaut.astronautId);

  // Cytokine trend line data (pg/mL unit group only!)
  const cytokineTrendData = timelinePoints.map((p) => ({
    day: `FD ${p.missionDay}`,
    IL6: p.values.IL_6 ?? null,
    TNF: p.values.TNF_ALPHA ?? null,
    IL10: p.values.IL_10 ?? null,
    IFNg: p.values.IFN_GAMMA ?? null,
  }));

  // Inflammatory and stress indicators
  const inflammatoryTrendData = timelinePoints.map((p) => ({
    day: `FD ${p.missionDay}`,
    CRP: p.values.CRP_HS ?? null,
  }));

  const stressTrendData = timelinePoints.map((p) => ({
    day: `FD ${p.missionDay}`,
    CortisolSalivary: p.values.CORTISOL_SALIVARY ?? null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module C — Biomarker Intelligence
            </span>
            <DataOriginBadge origin="SIMULATED" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            Cytokine & Inflammatory Biomarker Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            High-sensitivity multiplex cytokine arrays (OSD-575 paradigm), acute-phase reactants, and neuroendocrine
            stress indicators characterizing systemic inflammatory shifts and immune remodeling in spaceflight.
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-space-950 px-3 py-1.5 rounded-lg border border-space-800 flex items-center gap-2 font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-space-900">All Biomarkers</option>
            <option value="CYTOKINE" className="bg-space-900">Cytokines (pg/mL)</option>
            <option value="INFLAMMATORY" className="bg-space-900">Inflammatory Reactants</option>
            <option value="STRESS_HORMONAL" className="bg-space-900">Stress Hormones</option>
          </select>
        </div>
      </div>

      {/* Axis Unit Compatibility Notice */}
      <div className="bg-space-900/60 border border-space-800 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 font-semibold block mb-0.5">
            Biomedical Metrology Notice: Distinct Physical Units
          </strong>
          <span className="text-slate-400">
            In accordance with strict clinical data science guidelines, markers with incompatible units
            (Cytokines in pg/mL, hs-CRP in mg/L, Cortisol in nmol/L) are presented on segregated axes and
            independent charts to prevent deceptive scaling artifacts.
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multiplex Cytokine Array Trend (pg/mL) */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Serum Cytokine Kinetics (pg/mL)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Luminex Multiplex Panel: IL-6, TNF-α, IL-10, IFN-γ
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cytokineTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="IL6" name="IL-6" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="TNF" name="TNF-α" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="IL10" name="IL-10" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="IFNg" name="IFN-γ" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-space-800">
            <span>Reference Threshold: IL-6 &lt; 5.0 pg/mL</span>
            <span className="text-rose-400">IL-6 Elevated (FD88)</span>
          </div>
        </div>

        {/* Inflammatory Reactant (hs-CRP) & Salivary Cortisol Dual Panel */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Inflammation (hs-CRP mg/L) & Stress (Cortisol nmol/L)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Segregated physiological axis tracking
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 35]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="CortisolSalivary"
                    name="Morning Salivary Cortisol (nmol/L)"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-space-800">
            <span>Upper Ref Cutoff: 27.0 nmol/L</span>
            <span className="text-amber-400">FD88: 28.5 nmol/L (Elevated)</span>
          </div>
        </div>
      </div>

      {/* Biomarker Detailed Records Table with Expandable Row View */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Biomarker Telemetry Log ({records.length} Assays)
          </h3>
          <span className="text-xs font-mono text-slate-400">Click any row to view provenance & clinical rationale</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2">ID</th>
                <th className="pb-2">Biomarker</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Observed</th>
                <th className="pb-2">Unit</th>
                <th className="pb-2">Reference Interval</th>
                <th className="pb-2">Sample Type</th>
                <th className="pb-2">Phase</th>
                <th className="pb-2">State</th>
                <th className="pb-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {records.map((b) => {
                const isExpanded = expandedRow === b.id;
                return (
                  <React.Fragment key={b.id}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : b.id)}
                      className={`cursor-pointer transition ${
                        isExpanded ? 'bg-space-850' : 'hover:bg-space-850/50'
                      }`}
                    >
                      <td className="py-2.5 font-bold text-slate-300">{b.id}</td>
                      <td className="py-2.5 text-white font-medium">{b.name}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{b.category}</td>
                      <td className="py-2.5 font-bold text-cyan-300">{b.value}</td>
                      <td className="py-2.5 text-slate-400">{b.unit}</td>
                      <td className="py-2.5 text-slate-400">{b.referenceRangeText}</td>
                      <td className="py-2.5 text-slate-300">{b.sampleType}</td>
                      <td className="py-2.5 text-slate-400">{b.missionPhase}</td>
                      <td className="py-2.5">
                        <StateBadge state={b.monitoringState} size="sm" />
                      </td>
                      <td className="py-2.5 text-right text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                      </td>
                    </tr>

                    {/* Expandable Details Row */}
                    {isExpanded && (
                      <tr className="bg-space-950/80">
                        <td colSpan={10} className="p-4 border-b border-space-800">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                            <div>
                              <span className="text-[10px] uppercase text-slate-400 block">Assay Method & Lab</span>
                              <span className="text-white font-medium">{b.assayMethod}</span>
                              <span className="text-slate-400 text-[11px] block mt-0.5">{b.source}</span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase text-slate-400 block">Reference Interval Provenance</span>
                              <span className="text-cyan-300">{b.referenceSource}</span>
                              <span className="text-slate-400 text-[10px] block mt-0.5">
                                Terrestrial reference standard. Spaceflight fluid shifts may alter basal ranges.
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase text-slate-400 block">Sample ID & Timestamp</span>
                              <span className="text-white">{b.sampleId}</span>
                              <span className="text-slate-400 text-[11px] block mt-0.5">{b.timestamp}</span>
                            </div>
                          </div>

                          {b.notes && (
                            <div className="mt-3 pt-2 border-t border-space-800/80 text-[11px] text-amber-300/90 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span>Clinical Note: {b.notes}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
