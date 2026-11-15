// AstroCare P11 — Sleep Analytics Page

import React, { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Moon,
  Clock,
  TrendingUp,
  Activity,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

import type { SleepRecord } from '../types';
import { formatTime, formatDate, minutesToHours, minutesToHoursDisplay, getISONow } from '../utils';
import { THRESHOLDS, CHART_COLORS, NASA_SOURCES } from '../constants';
import {
  Card,
  MetricCard,
  SectionHeader,
  Button,
  LoadingState,
  ErrorState,
  EmptyState,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
  ProgressBar,
} from '../components/shared';
import { useWellnessContext } from '../context/WellnessContext';
import { useAsyncData } from '../hooks';
import {
  computeSleepAnalytics,
  sleepToChartPoints,
} from '../services/wellness/analyticsService';

// ─── Form State ──────────────────────────────────────────────

interface SleepFormState {
  sleepStart: string;
  sleepEnd: string;
  awakenings: number;
  notes: string;
}

const defaultForm = (): SleepFormState => ({
  sleepStart: '',
  sleepEnd: '',
  awakenings: 1,
  notes: '',
});

// ─── Custom Tooltip ──────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#1e2a3a] bg-[#0f1520] p-3 text-xs shadow-xl">
      <p className="mb-2 font-semibold text-[#e8edf5]">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Sleep Log Table ─────────────────────────────────────────

function SleepLogTable({ records }: { records: SleepRecord[] }) {
  const recent = [...records].sort((a, b) => b.missionDay - a.missionDay).slice(0, 14);

  if (recent.length === 0) {
    return <EmptyState message="No sleep records found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#1e2a3a] text-[#8fa3be]">
            <th className="pb-3 pr-4 text-left font-medium uppercase tracking-wider">Day</th>
            <th className="pb-3 pr-4 text-left font-medium uppercase tracking-wider">Sleep Start</th>
            <th className="pb-3 pr-4 text-left font-medium uppercase tracking-wider">Sleep End</th>
            <th className="pb-3 pr-4 text-right font-medium uppercase tracking-wider">Duration</th>
            <th className="pb-3 pr-4 text-right font-medium uppercase tracking-wider">Efficiency</th>
            <th className="pb-3 text-right font-medium uppercase tracking-wider">Awakenings</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((r) => {
            const hrs = minutesToHours(r.totalSleepDurationMinutes);
            const effColor =
              r.sleepEfficiencyPercent >= THRESHOLDS.SLEEP.TARGET_EFFICIENCY_PCT
                ? '#22c55e'
                : r.sleepEfficiencyPercent >= THRESHOLDS.SLEEP.MIN_EFFICIENCY_PCT
                ? '#f59e0b'
                : '#ef4444';
            const durColor =
              hrs >= THRESHOLDS.SLEEP.TARGET_DURATION_HOURS
                ? '#22c55e'
                : hrs >= THRESHOLDS.SLEEP.MIN_DURATION_HOURS
                ? '#f59e0b'
                : '#ef4444';

            return (
              <tr
                key={r.id}
                className="border-b border-[#1e2a3a]/50 transition-colors hover:bg-[#19202f]/40"
              >
                <td className="py-2.5 pr-4 font-mono text-[#e8edf5]">D{r.missionDay}</td>
                <td className="py-2.5 pr-4 text-[#8fa3be]">{formatTime(r.sleepStart)}</td>
                <td className="py-2.5 pr-4 text-[#8fa3be]">{formatTime(r.sleepEnd)}</td>
                <td className="py-2.5 pr-4 text-right font-semibold" style={{ color: durColor }}>
                  {minutesToHoursDisplay(r.totalSleepDurationMinutes)}
                </td>
                <td className="py-2.5 pr-4 text-right">
                  <span className="font-semibold" style={{ color: effColor }}>
                    {r.sleepEfficiencyPercent}%
                  </span>
                </td>
                <td className="py-2.5 text-right text-[#8fa3be]">
                  {r.awakeningsCount ?? 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Add Sleep Record Form ────────────────────────────────────

interface AddSleepFormProps {
  astronautId: string;
  missionId: string;
  onSaved: () => void;
  onCancel: () => void;
  dataProvider: ReturnType<typeof useWellnessContext>['dataProvider'];
}

function AddSleepForm({ astronautId, missionId, onSaved, onCancel, dataProvider }: AddSleepFormProps) {
  const [form, setForm] = useState<SleepFormState>(defaultForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.sleepStart || !form.sleepEnd) {
      setError('Sleep start and end times are required.');
      return;
    }

    const startMs = new Date(form.sleepStart).getTime();
    const endMs = new Date(form.sleepEnd).getTime();

    if (endMs <= startMs) {
      setError('Sleep end must be after sleep start.');
      return;
    }

    const durationMinutes = Math.round((endMs - startMs) / 60000);
    const timeInBed = durationMinutes;
    const sleepEfficiencyPercent = Math.min(
      100,
      Math.round(((durationMinutes - form.awakenings * 5) / timeInBed) * 100)
    );

    setSaving(true);
    try {
      await dataProvider.saveSleepRecord({
        astronautId,
        missionId,
        timestamp: getISONow(),
        sleepStart: new Date(form.sleepStart).toISOString(),
        sleepEnd: new Date(form.sleepEnd).toISOString(),
        totalSleepDurationMinutes: durationMinutes,
        sleepEfficiencyPercent: Math.max(0, sleepEfficiencyPercent),
        awakeningsCount: form.awakenings,
        missionDay: 180,
        source: 'SELF_REPORT',
        dataOrigin: 'USER_ENTERED',
        notes: form.notes || undefined,
      });
      setForm(defaultForm());
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#8fa3be] uppercase tracking-wider">
            Sleep Start
          </label>
          <input
            type="datetime-local"
            value={form.sleepStart}
            onChange={(e) => setForm((f) => ({ ...f, sleepStart: e.target.value }))}
            className="w-full rounded-lg border border-[#1e2a3a] bg-[#0f1520] px-3 py-2 text-sm text-[#e8edf5] focus:border-[#3b82f6] focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#8fa3be] uppercase tracking-wider">
            Sleep End
          </label>
          <input
            type="datetime-local"
            value={form.sleepEnd}
            onChange={(e) => setForm((f) => ({ ...f, sleepEnd: e.target.value }))}
            className="w-full rounded-lg border border-[#1e2a3a] bg-[#0f1520] px-3 py-2 text-sm text-[#e8edf5] focus:border-[#3b82f6] focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#8fa3be] uppercase tracking-wider">
          Awakenings Count
        </label>
        <input
          type="number"
          min={0}
          max={20}
          value={form.awakenings}
          onChange={(e) => setForm((f) => ({ ...f, awakenings: Number(e.target.value) }))}
          className="w-32 rounded-lg border border-[#1e2a3a] bg-[#0f1520] px-3 py-2 text-sm text-[#e8edf5] focus:border-[#3b82f6] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#8fa3be] uppercase tracking-wider">
          Notes <span className="text-[#4a6080] normal-case">(optional)</span>
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Any relevant notes about this sleep period…"
          rows={2}
          className="w-full rounded-lg border border-[#1e2a3a] bg-[#0f1520] px-3 py-2 text-sm text-[#e8edf5] placeholder-[#4a6080] focus:border-[#3b82f6] focus:outline-none resize-none"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-[#5a1a1a] bg-[#3f1515] px-3 py-2 text-xs text-[#ef4444]">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={saving} icon={<PlusCircle className="w-4 h-4" />}>
          Save Sleep Record
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export function SleepPage() {
  const { astronautId, missionId, dataProvider } = useWellnessContext();
  const [showForm, setShowForm] = useState(false);

  const fetcher = useCallback(
    () => dataProvider.getSleepRecords(astronautId),
    [astronautId, dataProvider]
  );

  const { data: records, status, error, refetch } = useAsyncData<SleepRecord[]>(fetcher, [
    astronautId,
  ]);

  const analytics = records && records.length > 0 ? computeSleepAnalytics(records, astronautId) : null;
  const chartPoints = records ? sleepToChartPoints(records).slice(-30) : [];

  const avgHours = analytics ? minutesToHours(analytics.averageDurationMinutes) : 0;
  const deficitHours = analytics ? minutesToHours(analytics.estimatedSleepDeficitMinutes) : 0;

  const effColor =
    (analytics?.averageEfficiencyPercent ?? 0) >= THRESHOLDS.SLEEP.TARGET_EFFICIENCY_PCT
      ? CHART_COLORS.GREEN
      : (analytics?.averageEfficiencyPercent ?? 0) >= THRESHOLDS.SLEEP.MIN_EFFICIENCY_PCT
      ? CHART_COLORS.AMBER
      : CHART_COLORS.RED;

  const durColor =
    avgHours >= THRESHOLDS.SLEEP.TARGET_DURATION_HOURS
      ? CHART_COLORS.GREEN
      : avgHours >= THRESHOLDS.SLEEP.MIN_DURATION_HOURS
      ? CHART_COLORS.AMBER
      : CHART_COLORS.RED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e8edf5] flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#3b82f6]" />
            Sleep Analytics
          </h1>
          <p className="mt-1 text-sm text-[#8fa3be]">
            Mission sleep duration, efficiency, and deficit tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataOriginTag origin="SIMULATED" />
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={refetch}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Hide Form' : 'Log Sleep'}
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Loading / Error */}
      {status === 'loading' && <LoadingState message="Loading sleep records…" />}
      {status === 'error' && (
        <ErrorState message={error ?? 'Failed to load sleep records.'} onRetry={refetch} />
      )}

      {status === 'success' && records && (
        <>
          {/* Add Sleep Form */}
          {showForm && (
            <Card>
              <SectionHeader
                title="Log New Sleep Record"
                subtitle="Enter your sleep period details to track your rest pattern."
              />
              <AddSleepForm
                astronautId={astronautId}
                missionId={missionId}
                dataProvider={dataProvider}
                onSaved={() => {
                  setShowForm(false);
                  refetch();
                }}
                onCancel={() => setShowForm(false)}
              />
            </Card>
          )}

          {/* Summary Metrics */}
          <div>
            <SectionHeader
              title="Summary Metrics"
              subtitle={`Computed from ${records.length} recorded sleep periods`}
            />
            {analytics ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MetricCard
                  label="Avg Duration"
                  value={avgHours.toFixed(1)}
                  unit="hrs"
                  subtext={`Target: ${THRESHOLDS.SLEEP.TARGET_DURATION_HOURS}h`}
                  color={durColor}
                  icon={<Clock className="w-4 h-4" />}
                />
                <MetricCard
                  label="Avg Efficiency"
                  value={`${analytics.averageEfficiencyPercent.toFixed(1)}`}
                  unit="%"
                  subtext={`Target: ≥${THRESHOLDS.SLEEP.TARGET_EFFICIENCY_PCT}%`}
                  color={effColor}
                  icon={<Activity className="w-4 h-4" />}
                />
                <MetricCard
                  label="Consistency"
                  value={analytics.consistencyScore.toFixed(1)}
                  unit="/100"
                  subtext="Duration regularity score"
                  color={analytics.consistencyScore >= 70 ? CHART_COLORS.GREEN : CHART_COLORS.AMBER}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <MetricCard
                  label="Est. Deficit"
                  value={deficitHours.toFixed(1)}
                  unit="hrs"
                  subtext="Cumulative below target"
                  color={deficitHours > THRESHOLDS.SLEEP.MAX_DEFICIT_HOURS ? CHART_COLORS.RED : CHART_COLORS.AMBER}
                />
              </div>
            ) : (
              <EmptyState message="No analytics available. Add sleep records to get started." />
            )}
          </div>

          {/* Efficiency Progress Bar Overview */}
          {analytics && (
            <Card>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8fa3be]">Sleep Efficiency</span>
                    <span style={{ color: effColor }}>{analytics.averageEfficiencyPercent.toFixed(1)}%</span>
                  </div>
                  <ProgressBar
                    value={analytics.averageEfficiencyPercent}
                    color={effColor}
                    height={8}
                    showLabel={false}
                  />
                  <p className="text-xs text-[#4a6080]">Target ≥{THRESHOLDS.SLEEP.TARGET_EFFICIENCY_PCT}%</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8fa3be]">Schedule Consistency</span>
                    <span className="text-[#e8edf5]">{analytics.consistencyScore.toFixed(1)} / 100</span>
                  </div>
                  <ProgressBar
                    value={analytics.consistencyScore}
                    color={analytics.consistencyScore >= 70 ? CHART_COLORS.GREEN : CHART_COLORS.AMBER}
                    height={8}
                  />
                  <p className="text-xs text-[#4a6080]">Deviation mean: {analytics.scheduleDeviationMeanMinutes.toFixed(0)} min</p>
                </div>
              </div>
            </Card>
          )}

          {/* Duration Line Chart */}
          <Card>
            <SectionHeader
              title="Sleep Duration Trend"
              subtitle="Duration per mission day (last 30 records). Reference line = 7.5h target."
              badge={<DataOriginTag origin="SIMULATED" />}
            />
            {chartPoints.length === 0 ? (
              <EmptyState message="No chart data available." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartPoints} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#8fa3be', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[4, 10]}
                    tick={{ fill: '#8fa3be', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}h`}
                    width={36}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: '#8fa3be', paddingTop: 8 }}
                  />
                  <ReferenceLine
                    y={THRESHOLDS.SLEEP.TARGET_DURATION_HOURS}
                    stroke={CHART_COLORS.AMBER}
                    strokeDasharray="6 3"
                    label={{ value: '7.5h target', fill: '#f59e0b', fontSize: 10, position: 'right' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="durationHours"
                    name="Duration (hrs)"
                    stroke={CHART_COLORS.PRIMARY}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Efficiency Bar Chart */}
          <Card>
            <SectionHeader
              title="Sleep Efficiency"
              subtitle="Efficiency % per mission day (last 30 records). Target ≥85%."
              badge={<DataOriginTag origin="SIMULATED" />}
            />
            {chartPoints.length === 0 ? (
              <EmptyState message="No chart data available." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartPoints} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#8fa3be', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[50, 100]}
                    tick={{ fill: '#8fa3be', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                    width={40}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    y={THRESHOLDS.SLEEP.TARGET_EFFICIENCY_PCT}
                    stroke={CHART_COLORS.AMBER}
                    strokeDasharray="6 3"
                  />
                  <Bar
                    dataKey="efficiency"
                    name="Efficiency (%)"
                    fill={CHART_COLORS.SECONDARY}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Sleep Log Table */}
          <Card>
            <SectionHeader
              title="Sleep Log"
              subtitle="Most recent 14 sleep records"
              badge={<DataOriginTag origin="SIMULATED" />}
            />
            <SleepLogTable records={records} />
          </Card>

          {/* NASA Research Context */}
          <Card>
            <SectionHeader
              title="NASA Research Context"
              subtitle="Evidence base for sleep targets in spaceflight"
            />
            <div className="space-y-3 text-xs text-[#8fa3be] leading-relaxed">
              <p>
                NASA research has established that astronauts on long-duration missions commonly
                experience sleep disruption due to microgravity, light exposure irregularities,
                high cognitive workload, and psychological stressors associated with isolation and
                confinement.
              </p>
              <p>
                The 7.5-hour target duration is based on guidelines informed by sleep science
                research within NASA's Human Research Program (HRP). Insufficient sleep is
                categorized as a key operational risk.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <NasaSourceLink
                  url={NASA_SOURCES.SLEEP_IRREGULAR}
                  label="Risk from Inadequate Sleep"
                />
                <NasaSourceLink
                  url={NASA_SOURCES.HUMAN_BODY}
                  label="Human Body in Space"
                />
                <NasaSourceLink
                  url={NASA_SOURCES.HFBP_RISKS}
                  label="HFBP Risk Registry"
                />
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
