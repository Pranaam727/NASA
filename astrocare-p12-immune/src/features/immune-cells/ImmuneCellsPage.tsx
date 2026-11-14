import React, { useState } from 'react';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { immuneService } from '../../services/immune/immuneService';
import { MetricCard } from '../../components/shared/MetricCard';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import { StateBadge } from '../../components/shared/StateBadge';
import {
  ShieldAlert,
  Activity,
  Layers,
  Info,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const ImmuneCellsPage: React.FC = () => {
  const { currentAstronaut } = useAstroCareContext();

  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | 'LEUKOCYTE' | 'LYMPHOCYTE_SUBSET' | 'FUNCTIONAL_ASSAY'
  >('ALL');
  const [selectedPhase, setSelectedPhase] = useState<'ALL' | 'PRE_FLIGHT' | 'IN_FLIGHT'>('ALL');

  const records = immuneService.getImmuneCellRecords({
    astronautId: currentAstronaut.astronautId,
    category: selectedCategory,
    phase: selectedPhase,
  });

  const longitudinal = immuneService.getAllLongitudinalMetrics(currentAstronaut.astronautId);

  // Group latest records by cellType
  const latestProfile = immuneService.getLatestImmuneProfile(currentAstronaut.astronautId);

  // Distribution Data for Pie Chart (Leukocyte differential %)
  const wbcDifferentialData = [
    { name: 'Neutrophils', value: 72.3, count: '6.8 x10^9/L', color: '#38bdf8' },
    { name: 'Lymphocytes', value: 19.1, count: '1.8 x10^9/L', color: '#818cf8' },
    { name: 'Monocytes', value: 6.2, count: '0.58 x10^9/L', color: '#34d399' },
    { name: 'Eosinophils', value: 1.9, count: '0.18 x10^9/L', color: '#fbbf24' },
    { name: 'Basophils', value: 0.4, count: '0.04 x10^9/L', color: '#f87171' },
  ];

  // Lymphocyte subset comparison (cells/µL)
  const subsetComparisonData = [
    {
      subset: 'CD4 Helper T',
      baseline: longitudinal.find((l) => l.metricKey === 'CD4_HELPER_T')?.preFlightBaseline || 905,
      latest: latestProfile.cells['CD4_HELPER_T']?.absoluteCount || 620,
      refLow: 400,
      refHigh: 1400,
      unit: 'cells/µL',
    },
    {
      subset: 'CD8 Cytotoxic T',
      baseline: longitudinal.find((l) => l.metricKey === 'CD8_CYTOTOXIC_T')?.preFlightBaseline || 460,
      latest: latestProfile.cells['CD8_CYTOTOXIC_T']?.absoluteCount || 510,
      refLow: 200,
      refHigh: 900,
      unit: 'cells/µL',
    },
    {
      subset: 'B Cells (CD19)',
      baseline: longitudinal.find((l) => l.metricKey === 'B_CELL_CD19')?.preFlightBaseline || 280,
      latest: latestProfile.cells['B_CELL_CD19']?.absoluteCount || 260,
      refLow: 100,
      refHigh: 500,
      unit: 'cells/µL',
    },
    {
      subset: 'NK Cells (CD16/56)',
      baseline: longitudinal.find((l) => l.metricKey === 'NK_CELL_CD16_56')?.preFlightBaseline || 240,
      latest: latestProfile.cells['NK_CELL_CD16_56']?.absoluteCount || 210,
      refLow: 90,
      refHigh: 600,
      unit: 'cells/µL',
    },
  ];

  // Functional Assays comparison (Count vs Function Distinction)
  const functionalData = [
    {
      assay: 'NK Cytotoxicity (% Lysis)',
      baseline: 37.2,
      latest: 15.4,
      threshold: 20.0,
      state: 'WARNING',
      note: 'Significant decrease in lytic capacity despite normal circulating NK count',
    },
    {
      assay: 'T-Cell Blastogenesis (PHA SI)',
      baseline: 64.0,
      latest: 28.2,
      threshold: 35.0,
      state: 'WARNING',
      note: 'Reduced mitogenic activation index in microgravity',
    },
    {
      assay: 'Salivary EBV Copy Detection',
      baseline: 0,
      latest: 84,
      threshold: 50,
      state: 'WARNING',
      note: 'Subclinical latent herpesvirus shedding in saliva',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module B — Cytometric Intelligence
            </span>
            <DataOriginBadge origin="SIMULATED" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            Immune-Cell Analytics & Functional Immunophenotyping
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Standardized flow cytometry panels (NTRS-20230016983) and functional ex-vivo assays tracking
            circulating leukocyte distributions, T/B/NK lymphocyte ratios, and cell-mediated cytolytic capacity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="bg-space-950 px-2.5 py-1.5 rounded-lg border border-space-800 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-space-900">All Categories</option>
              <option value="LEUKOCYTE" className="bg-space-900">Leukocyte Profile</option>
              <option value="LYMPHOCYTE_SUBSET" className="bg-space-900">Lymphocyte Subsets</option>
              <option value="FUNCTIONAL_ASSAY" className="bg-space-900">Functional Assays</option>
            </select>
          </div>

          <div className="bg-space-950 px-2.5 py-1.5 rounded-lg border border-space-800 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-space-900">All Mission Phases</option>
              <option value="PRE_FLIGHT" className="bg-space-900">Pre-Flight Only</option>
              <option value="IN_FLIGHT" className="bg-space-900">In-Flight Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Critical Scientific Note on Count vs Function */}
      <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 font-semibold block mb-0.5">
            Scientific Principle: Cell Counts vs Functional Activity (NTRS-20230016983 & HRR-85)
          </strong>
          <span className="text-slate-300">
            A normal circulating lymphocyte or NK-cell count does not establish normal cell function. NASA spaceflight
            studies demonstrate that while cell numbers frequently remain within terrestrial reference limits, ex-vivo
            cytolytic efficacy and early activation signaling (CD69/CD25 upregulation) are routinely depressed during prolonged
            spaceflight missions.
          </span>
        </div>
      </div>

      {/* Visual Analytics Strip: Distribution vs Subset Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leukocyte Distribution (Pie / Donut) */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              Latest In-Flight Leukocyte Differential
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Relative Percentage Breakdown (Flight Day 88)
            </p>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wbcDifferentialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {wbcDifferentialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.count})`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-space-800">
            {wbcDifferentialData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400">{d.name}:</span>
                <span className="font-bold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lymphocyte Subset Bar Comparison */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Lymphocyte Subsets: Pre-Flight Baseline vs Latest
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Absolute Counts (cells/µL) via Multiparameter Flow Cytometry
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subsetComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="subset" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 1500]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="baseline" name="Baseline (L-180)" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="latest" name="In-Flight Latest (FD88)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-space-800">
            <span>Reference Intervals: CD4 (400-1400) | CD8 (200-900) | B (100-500) | NK (90-600)</span>
            <span className="text-cyan-400">CD4/CD8 Ratio: 1.22</span>
          </div>
        </div>
      </div>

      {/* Functional Assays Dedicated Panel */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Functional Immune Competence & Viral Reactivation Assays
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Quantitative ex-vivo stimulation and real-time qPCR viral shedding indicators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {functionalData.map((f) => (
            <div key={f.assay} className="bg-space-950 p-4 rounded-lg border border-space-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-200">{f.assay}</span>
                  <StateBadge state={f.state} size="sm" />
                </div>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-2xl font-mono font-bold text-white">{f.latest}</span>
                  <span className="text-xs font-mono text-slate-400">
                    (Baseline: {f.baseline})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {f.note}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-space-800 text-[10px] font-mono text-amber-400">
                Warning Threshold: {f.threshold}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtered Records Table */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Telemetry Records Log ({records.length} Records)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Subject: {currentAstronaut.astronautId}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2">ID</th>
                <th className="pb-2">Cell / Assay</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Observed</th>
                <th className="pb-2">Unit</th>
                <th className="pb-2">Ref Range</th>
                <th className="pb-2">Phase</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-space-850/50 transition">
                  <td className="py-2.5 font-bold text-slate-300">{r.id}</td>
                  <td className="py-2.5 text-white font-medium">{r.cellName}</td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{r.category}</td>
                  <td className="py-2.5 font-bold text-cyan-300">{r.absoluteCount}</td>
                  <td className="py-2.5 text-slate-400">{r.unit}</td>
                  <td className="py-2.5 text-slate-400">
                    {r.referenceLow} – {r.referenceHigh}
                  </td>
                  <td className="py-2.5 text-slate-300">{r.missionPhase}</td>
                  <td className="py-2.5">
                    <StateBadge state={r.monitoringState} size="sm" />
                  </td>
                  <td className="py-2.5 text-slate-400 truncate max-w-[150px]" title={r.assayMethod}>
                    {r.assayMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
