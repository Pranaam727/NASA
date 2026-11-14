import React, { useState } from 'react';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { immuneService } from '../../services/immune/immuneService';
import { StateBadge } from '../../components/shared/StateBadge';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  GitBranch,
  TrendingUp,
  Activity,
  Layers,
  Info,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
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
  BarChart,
  Bar,
} from 'recharts';

export const LongitudinalAnalysisPage: React.FC = () => {
  const { currentAstronaut } = useAstroCareContext();

  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('IL_6');

  const longitudinalList = immuneService.getAllLongitudinalMetrics(currentAstronaut.astronautId);
  const activeMetricSummary = immuneService.calculateLongitudinalMetric(
    currentAstronaut.astronautId,
    selectedMetricKey
  );

  const timelinePoints = immuneService.getLongitudinalTimeline(currentAstronaut.astronautId);

  // Formatted data for phase comparison bar chart (Pre-Flight vs In-Flight)
  const phaseComparisonData = longitudinalList.slice(0, 8).map((m) => ({
    name: m.metricName.split(' ')[0],
    fullName: m.metricName,
    unit: m.unit,
    preFlight: m.phaseAverages.preFlight ?? 0,
    inFlight: m.phaseAverages.inFlight ?? 0,
  }));

  // Selected Metric Time-series
  const selectedMetricTimeSeries = timelinePoints.map((p) => ({
    day: `FD ${p.missionDay}`,
    phase: p.missionPhase,
    value: p.values[selectedMetricKey] ?? null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module F — Trajectory & Kinetics
            </span>
            <DataOriginBadge origin="SIMULATED" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-cyan-400" />
            Longitudinal Immune Monitoring & Baseline Kinetics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-phase physiological comparisons tracking adaptive immune shifts, inflammatory emergence,
            and functional cell kinetics from Pre-Flight baseline (L-180) across In-Flight mission days.
          </p>
        </div>

        {/* Metric Selector Dropdown */}
        <div className="bg-space-950 px-3 py-2 rounded-lg border border-space-800 font-mono text-xs flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase">Analyte:</span>
          <select
            value={selectedMetricKey}
            onChange={(e) => setSelectedMetricKey(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            {longitudinalList.map((m) => (
              <option key={m.metricKey} value={m.metricKey} className="bg-space-900">
                {m.metricName} ({m.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zero Baseline and Statistical Caution */}
      <div className="bg-space-950/80 border border-space-800 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 font-semibold block mb-0.5">
            Statistical Rigor: Division-by-Zero Protection & Longitudinal Rules
          </strong>
          <span className="text-slate-400">
            Percentage change calculations are strictly suppressed when the pre-flight baseline is zero or undetectable
            (such as latent viral DNA copy counts), reporting non-calculable rather than generating mathematical artifacts.
            Trends must be evaluated against established physiological deviation bounds rather than simple point variations.
          </span>
        </div>
      </div>

      {/* Selected Metric Drill-Down Card */}
      {activeMetricSummary && (
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-space-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">
                {activeMetricSummary.category}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {activeMetricSummary.metricName}
                <span className="text-xs font-mono font-normal text-slate-400">
                  [{activeMetricSummary.unit}]
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Pattern: <strong className="text-cyan-300">{activeMetricSummary.trendPattern.replace(/_/g, ' ')}</strong>
              </span>
              <StateBadge state={activeMetricSummary.monitoringState} size="sm" />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 my-4 font-mono text-xs">
            <div className="bg-space-950 p-3 rounded-lg border border-space-800">
              <span className="text-[10px] text-slate-500 uppercase block">Baseline (L-180)</span>
              <span className="text-base font-bold text-white">
                {activeMetricSummary.preFlightBaseline !== null ? `${activeMetricSummary.preFlightBaseline}` : 'N/A'}
              </span>
            </div>

            <div className="bg-space-950 p-3 rounded-lg border border-space-800">
              <span className="text-[10px] text-slate-500 uppercase block">Latest In-Flight</span>
              <span className="text-base font-bold text-cyan-400">
                {activeMetricSummary.latestValue !== null ? `${activeMetricSummary.latestValue}` : 'N/A'}
              </span>
            </div>

            <div className="bg-space-950 p-3 rounded-lg border border-space-800">
              <span className="text-[10px] text-slate-500 uppercase block">Absolute Δ</span>
              <span
                className={`text-base font-bold ${
                  (activeMetricSummary.absoluteChange ?? 0) > 0
                    ? 'text-amber-400'
                    : (activeMetricSummary.absoluteChange ?? 0) < 0
                    ? 'text-sky-400'
                    : 'text-slate-300'
                }`}
              >
                {activeMetricSummary.absoluteChange !== null
                  ? `${activeMetricSummary.absoluteChange > 0 ? '+' : ''}${activeMetricSummary.absoluteChange}`
                  : 'N/A'}
              </span>
            </div>

            <div className="bg-space-950 p-3 rounded-lg border border-space-800">
              <span className="text-[10px] text-slate-500 uppercase block">% Change</span>
              <span
                className={`text-base font-bold ${
                  (activeMetricSummary.percentChange ?? 0) > 0
                    ? 'text-amber-400'
                    : (activeMetricSummary.percentChange ?? 0) < 0
                    ? 'text-sky-400'
                    : 'text-slate-300'
                }`}
              >
                {activeMetricSummary.isCalculable && activeMetricSummary.percentChange !== null
                  ? `${activeMetricSummary.percentChange > 0 ? '+' : ''}${activeMetricSummary.percentChange}%`
                  : 'N/A (Zero Base)'}
              </span>
            </div>

            <div className="bg-space-950 p-3 rounded-lg border border-space-800">
              <span className="text-[10px] text-slate-500 uppercase block">Sampling Rate</span>
              <span className="text-base font-bold text-slate-200">
                {activeMetricSummary.totalMeasurements}/{activeMetricSummary.expectedMeasurements} pts
              </span>
            </div>

            <div className="bg-space-950 p-3 rounded-lg border border-space-800">
              <span className="text-[10px] text-slate-500 uppercase block">Missing Data</span>
              <span className="text-base font-bold text-slate-400">
                {activeMetricSummary.missingDataPercent}%
              </span>
            </div>
          </div>

          {/* Time Series Chart for Selected Metric */}
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedMetricTimeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={`${activeMetricSummary.metricName} (${activeMetricSummary.unit})`}
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-3 italic">
            Clinical context: {activeMetricSummary.notes}
          </p>
        </div>
      )}

      {/* Comprehensive Longitudinal Kinetics Table */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Longitudinal Kinetics Summary Matrix ({longitudinalList.length} Tracked Parameters)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Baseline: L-180 | Current: FD 88
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Analyte</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Baseline</th>
                <th className="pb-2">In-Flight Avg</th>
                <th className="pb-2">Latest</th>
                <th className="pb-2">Unit</th>
                <th className="pb-2">Δ Absolute</th>
                <th className="pb-2">% Change</th>
                <th className="pb-2">Trend Pattern</th>
                <th className="pb-2">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {longitudinalList.map((m) => (
                <tr
                  key={m.metricKey}
                  onClick={() => setSelectedMetricKey(m.metricKey)}
                  className={`cursor-pointer transition ${
                    selectedMetricKey === m.metricKey ? 'bg-space-850' : 'hover:bg-space-850/50'
                  }`}
                >
                  <td className="py-2.5 font-bold text-white">{m.metricName}</td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{m.category}</td>
                  <td className="py-2.5 text-slate-300">
                    {m.preFlightBaseline !== null ? m.preFlightBaseline : '—'}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {m.phaseAverages.inFlight !== null ? m.phaseAverages.inFlight : '—'}
                  </td>
                  <td className="py-2.5 font-bold text-cyan-300">
                    {m.latestValue !== null ? m.latestValue : '—'}
                  </td>
                  <td className="py-2.5 text-slate-400">{m.unit}</td>
                  <td className="py-2.5">
                    {m.absoluteChange !== null ? (
                      <span
                        className={
                          m.absoluteChange > 0
                            ? 'text-amber-400'
                            : m.absoluteChange < 0
                            ? 'text-sky-400'
                            : 'text-slate-400'
                        }
                      >
                        {m.absoluteChange > 0 ? `+${m.absoluteChange}` : m.absoluteChange}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-2.5">
                    {m.isCalculable && m.percentChange !== null ? (
                      <span
                        className={`inline-flex items-center text-[11px] font-semibold px-1 py-0.5 rounded ${
                          m.percentChange > 0
                            ? 'text-amber-300 bg-amber-950/60'
                            : m.percentChange < 0
                            ? 'text-sky-300 bg-sky-950/60'
                            : 'text-slate-400'
                        }`}
                      >
                        {m.percentChange > 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : m.percentChange < 0 ? (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <Minus className="w-3 h-3 mr-0.5" />
                        )}
                        {m.percentChange > 0 ? `+${m.percentChange}%` : `${m.percentChange}%`}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-[10px]">Zero baseline</span>
                    )}
                  </td>
                  <td className="py-2.5 text-[11px] text-slate-300">
                    {m.trendPattern.replace(/_/g, ' ')}
                  </td>
                  <td className="py-2.5">
                    <StateBadge state={m.monitoringState} size="sm" />
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
