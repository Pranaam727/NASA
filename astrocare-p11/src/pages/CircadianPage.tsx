// AstroCare P11 — Circadian Rhythm Monitoring Page

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Sun, Moon, Clock, AlertCircle } from 'lucide-react';

import type { CircadianRecord } from '../types';
import { formatShortDate, average, roundTo } from '../utils';
import { THRESHOLDS, CHART_COLORS, NASA_SOURCES } from '../constants';
import {
  Card,
  MetricCard,
  SectionHeader,
  ScoreRing,
  LoadingState,
  ErrorState,
  EmptyState,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
} from '../components/shared';
import { DEMO_CIRCADIAN_RECORDS } from '../data/demoData';
import {
  circadianToAlignmentPoints,
} from '../services/wellness/analyticsService';

// ─── 24-hour Timeline SVG ────────────────────────────────────

interface TimelineEvent {
  label: string;
  startHour: number;
  durationHours: number;
  color: string;
  pattern: 'solid' | 'striped';
}

function parseHHMM(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h + (m ?? 0) / 60;
}

function CircadianTimeline({ record }: { record: CircadianRecord }) {
  const W = 700;
  const H = 72;
  const PAD_LEFT = 32;
  const PAD_RIGHT = 16;
  const BAR_Y = 20;
  const BAR_H = 32;
  const chartW = W - PAD_LEFT - PAD_RIGHT;

  const hourToX = (hour: number) => PAD_LEFT + (hour / 24) * chartW;

  const scheduledSleep = parseHHMM(record.scheduledSleepTime); // e.g. 22.5
  const scheduledWake = parseHHMM(record.scheduledWakeTime);   // e.g. 6.0

  // Sleep window spans midnight: from scheduledSleep to 24 + scheduledWake
  const sleepDuration = scheduledSleep < scheduledWake
    ? scheduledWake - scheduledSleep
    : (24 - scheduledSleep) + scheduledWake;

  // Work windows: simple heuristic — two work blocks 09:00-13:00 and 14:00-18:00
  const events: TimelineEvent[] = [
    {
      label: 'Sleep',
      startHour: scheduledSleep,
      durationHours: sleepDuration,
      color: '#1e3a5f',
      pattern: 'solid',
    },
    {
      label: 'Work',
      startHour: 9,
      durationHours: 4,
      color: '#3d2800',
      pattern: 'striped',
    },
    {
      label: 'Work',
      startHour: 14,
      durationHours: 4,
      color: '#3d2800',
      pattern: 'striped',
    },
  ];

  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <div className="overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H + 10}`}
        style={{ minWidth: 320 }}
        aria-label="24-hour circadian timeline"
      >
        {/* Background bar */}
        <rect
          x={PAD_LEFT}
          y={BAR_Y}
          width={chartW}
          height={BAR_H}
          fill="#0f1520"
          rx={6}
        />

        {/* Event blocks */}
        {events.map((ev, idx) => {
          // Handle wrap-around for sleep that crosses midnight
          const start1 = ev.startHour;
          const end1 = Math.min(24, start1 + ev.durationHours);
          const overflow = start1 + ev.durationHours - 24;

          const x1 = hourToX(start1);
          const w1 = hourToX(end1) - x1;

          return (
            <g key={idx}>
              <rect
                x={x1}
                y={BAR_Y}
                width={Math.max(0, w1)}
                height={BAR_H}
                fill={ev.color}
                rx={4}
                opacity={0.9}
              />
              {overflow > 0 && (
                <rect
                  x={hourToX(0)}
                  y={BAR_Y}
                  width={Math.max(0, hourToX(overflow) - hourToX(0))}
                  height={BAR_H}
                  fill={ev.color}
                  rx={4}
                  opacity={0.9}
                />
              )}
              {/* Label */}
              {w1 > 30 && (
                <text
                  x={x1 + w1 / 2}
                  y={BAR_Y + BAR_H / 2 + 4}
                  fill={ev.label === 'Sleep' ? '#3b82f6' : '#f59e0b'}
                  fontSize={9}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {ev.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Hour ticks and labels */}
        {hours.map((h) => {
          const x = hourToX(h);
          return (
            <g key={h}>
              <line
                x1={x}
                y1={BAR_Y - 4}
                x2={x}
                y2={BAR_Y}
                stroke="#1e2a3a"
                strokeWidth={1}
              />
              <text
                x={x}
                y={BAR_Y - 7}
                fill="#4a6080"
                fontSize={8}
                textAnchor="middle"
              >
                {h === 24 ? '0' : h < 10 ? `0${h}` : h}
              </text>
            </g>
          );
        })}

        {/* Actual sleep time marker (if recorded) */}
        {record.actualSleepTime && (
          <line
            x1={hourToX(parseHHMM(record.actualSleepTime))}
            y1={BAR_Y - 2}
            x2={hourToX(parseHHMM(record.actualSleepTime))}
            y2={BAR_Y + BAR_H + 2}
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="4 2"
          />
        )}

        {/* Legend */}
        <g transform={`translate(${PAD_LEFT}, ${BAR_Y + BAR_H + 10})`}>
          <rect width={8} height={8} fill="#1e3a5f" rx={1} />
          <text x={12} y={7} fill="#8fa3be" fontSize={8}>
            Scheduled Sleep
          </text>
          <rect x={90} width={8} height={8} fill="#3d2800" rx={1} />
          <text x={102} y={7} fill="#8fa3be" fontSize={8}>
            Work Block
          </text>
          {record.actualSleepTime && (
            <>
              <line x1={180} y1={4} x2={192} y2={4} stroke="#22c55e" strokeWidth={2} strokeDasharray="3 1" />
              <text x={196} y={7} fill="#8fa3be" fontSize={8}>
                Actual Sleep
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

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
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Summary Stats Card ──────────────────────────────────────

interface CircadianSummaryStatsProps {
  records: CircadianRecord[];
}

function CircadianSummaryStats({ records }: CircadianSummaryStatsProps) {
  const avgAlignment = roundTo(average(records.map((r) => r.alignmentScore)), 1);
  const avgDeviation = roundTo(average(records.map((r) => Math.abs(r.scheduleDeviationMinutes))), 1);

  // Most common sleep time (mode of scheduledSleepTime)
  const sleepTimeCounts: Record<string, number> = {};
  records.forEach((r) => {
    sleepTimeCounts[r.scheduledSleepTime] = (sleepTimeCounts[r.scheduledSleepTime] ?? 0) + 1;
  });
  const commonSleep = Object.entries(sleepTimeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const wakeTimeCounts: Record<string, number> = {};
  records.forEach((r) => {
    wakeTimeCounts[r.scheduledWakeTime] = (wakeTimeCounts[r.scheduledWakeTime] ?? 0) + 1;
  });
  const commonWake = Object.entries(wakeTimeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const alignColor =
    avgAlignment >= 70 ? CHART_COLORS.GREEN : avgAlignment >= 50 ? CHART_COLORS.AMBER : CHART_COLORS.RED;
  const devColor =
    avgDeviation <= THRESHOLDS.CIRCADIAN.DEVIATION_WARN_MINUTES
      ? CHART_COLORS.GREEN
      : CHART_COLORS.RED;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricCard
        label="Avg Alignment"
        value={avgAlignment}
        unit="/100"
        subtext="Schedule-derived score"
        color={alignColor}
        icon={<Sun className="w-4 h-4" />}
      />
      <MetricCard
        label="Avg Deviation"
        value={`${avgDeviation}`}
        unit="min"
        subtext={`Warn > ${THRESHOLDS.CIRCADIAN.DEVIATION_WARN_MINUTES} min`}
        color={devColor}
        icon={<Clock className="w-4 h-4" />}
      />
      <MetricCard
        label="Common Sleep Time"
        value={commonSleep}
        subtext="Scheduled onset"
        color={CHART_COLORS.PRIMARY}
        icon={<Moon className="w-4 h-4" />}
      />
      <MetricCard
        label="Common Wake Time"
        value={commonWake}
        subtext="Scheduled wakeup"
        color={CHART_COLORS.SECONDARY}
        icon={<Sun className="w-4 h-4" />}
      />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export function CircadianPage() {
  const records = DEMO_CIRCADIAN_RECORDS;

  const latestRecord = records[records.length - 1];
  const latestAlignment = latestRecord?.alignmentScore ?? 0;

  const alignmentPoints = useMemo(() => {
    return circadianToAlignmentPoints(records).slice(-30).map((p) => ({
      ...p,
      date: formatShortDate(
        records.find((r) => r.missionDay === p.missionDay)?.timestamp ?? ''
      ) || `D${p.missionDay}`,
    }));
  }, [records]);

  const deviationPoints = useMemo(() => {
    return records.slice(-30).map((r) => ({
      date: formatShortDate(r.timestamp),
      missionDay: r.missionDay,
      deviation: Math.abs(r.scheduleDeviationMinutes),
    }));
  }, [records]);

  const alignColor =
    latestAlignment >= 70
      ? CHART_COLORS.GREEN
      : latestAlignment >= 50
      ? CHART_COLORS.AMBER
      : CHART_COLORS.RED;

  if (records.length === 0) {
    return (
      <div className="space-y-6">
        <DisclaimerBanner />
        <EmptyState
          message="No circadian records available."
          icon={<Moon className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e8edf5] flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#f59e0b]" />
            Circadian Rhythm Monitor
          </h1>
          <p className="mt-1 text-sm text-[#8fa3be]">
            Schedule alignment, deviation tracking, and 24-hour rhythm visualization
          </p>
        </div>
        <DataOriginTag origin="SIMULATED" />
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Measurement Disclaimer */}
      <div className="rounded-lg border border-[#1e3a5f] bg-[#0a1628] px-4 py-3 flex gap-3">
        <AlertCircle className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#8fa3be] leading-relaxed">
          <span className="font-semibold text-[#3b82f6]">Important measurement note: </span>
          The alignment score shown is derived from schedule data only. It does not measure
          melatonin, cortisol, or biological circadian phase. This is a schedule-adherence
          indicator, not a clinical circadian assessment.
        </p>
      </div>

      {/* Summary Stats */}
      <div>
        <SectionHeader
          title="Summary Statistics"
          subtitle={`Computed from ${records.length} circadian records`}
          badge={<DataOriginTag origin="CALCULATED" />}
        />
        <CircadianSummaryStats records={records} />
      </div>

      {/* Score Ring + Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Score Ring */}
        <Card className="flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-xs font-medium uppercase tracking-wider text-[#8fa3be]">
            Latest Alignment Score
          </p>
          <ScoreRing
            score={latestAlignment}
            size={140}
            strokeWidth={12}
            color={alignColor}
            label={`${latestAlignment}`}
            sublabel="Schedule alignment"
          />
          <p className="text-xs text-[#4a6080] text-center max-w-[160px]">
            Derived from scheduled vs. actual sleep/wake times. Not a biological measurement.
          </p>
          <DataOriginTag origin="CALCULATED" />
        </Card>

        {/* 24-hour Timeline */}
        <Card className="lg:col-span-2">
          <SectionHeader
            title="24-Hour Schedule Timeline"
            subtitle={`Latest day — Day ${latestRecord.missionDay} | Scheduled: ${latestRecord.scheduledSleepTime}–${latestRecord.scheduledWakeTime}`}
            badge={<DataOriginTag origin="SIMULATED" />}
          />
          <CircadianTimeline record={latestRecord} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-[#1e2a3a] bg-[#0f1520] p-3">
              <p className="text-[#4a6080] mb-1">Scheduled Sleep</p>
              <p className="font-semibold text-[#3b82f6]">{latestRecord.scheduledSleepTime}</p>
            </div>
            <div className="rounded-lg border border-[#1e2a3a] bg-[#0f1520] p-3">
              <p className="text-[#4a6080] mb-1">Scheduled Wake</p>
              <p className="font-semibold text-[#14b8a6]">{latestRecord.scheduledWakeTime}</p>
            </div>
            <div className="rounded-lg border border-[#1e2a3a] bg-[#0f1520] p-3">
              <p className="text-[#4a6080] mb-1">Deviation</p>
              <p
                className="font-semibold"
                style={{
                  color:
                    Math.abs(latestRecord.scheduleDeviationMinutes) >
                    THRESHOLDS.CIRCADIAN.DEVIATION_WARN_MINUTES
                      ? CHART_COLORS.RED
                      : CHART_COLORS.GREEN,
                }}
              >
                {latestRecord.scheduleDeviationMinutes >= 0 ? '+' : ''}
                {latestRecord.scheduleDeviationMinutes} min
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alignment Trend Chart */}
      <Card>
        <SectionHeader
          title="Alignment Score Trend"
          subtitle="Schedule alignment score over last 30 mission days (0–100)"
          badge={<DataOriginTag origin="CALCULATED" />}
        />
        {alignmentPoints.length === 0 ? (
          <EmptyState message="No trend data." />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={alignmentPoints} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#8fa3be', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#8fa3be', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={THRESHOLDS.CIRCADIAN.ALIGNMENT_WARN_THRESHOLD}
                stroke={CHART_COLORS.RED}
                strokeDasharray="6 3"
                label={{ value: 'Warn threshold', fill: '#ef4444', fontSize: 9, position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Alignment Score"
                stroke={CHART_COLORS.PRIMARY}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Schedule Deviation Bar Chart */}
      <Card>
        <SectionHeader
          title="Schedule Deviation Trend"
          subtitle="Absolute deviation from scheduled sleep time (minutes), last 30 days"
          badge={<DataOriginTag origin="SIMULATED" />}
        />
        {deviationPoints.length === 0 ? (
          <EmptyState message="No deviation data." />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deviationPoints} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#8fa3be', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#8fa3be', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}m`}
                width={36}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={THRESHOLDS.CIRCADIAN.DEVIATION_WARN_MINUTES}
                stroke={CHART_COLORS.AMBER}
                strokeDasharray="6 3"
                label={{ value: `${THRESHOLDS.CIRCADIAN.DEVIATION_WARN_MINUTES}m warn`, fill: '#f59e0b', fontSize: 9, position: 'right' }}
              />
              <Bar
                dataKey="deviation"
                name="Deviation (min)"
                fill={CHART_COLORS.ACCENT}
                radius={[2, 2, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* NASA Research Context */}
      <Card>
        <SectionHeader
          title="NASA Research Context"
          subtitle="Circadian science in long-duration spaceflight"
          badge={<DataOriginTag origin="NASA_RESEARCH" />}
        />
        <div className="space-y-4 text-xs text-[#8fa3be] leading-relaxed">
          <p>
            Circadian rhythm disruption is a well-documented risk in long-duration spaceflight.
            The absence of natural Earth light-dark cycles on the ISS—combined with up to 16 sunrises
            per day—creates unique challenges for maintaining stable circadian alignment.
          </p>
          <p>
            NASA's Human Research Program has identified irregular schedules and inadequate sleep as
            a significant risk factor for astronaut health and performance. Research indicates that
            circadian misalignment can impair cognitive function, immune response, and psychological
            wellbeing over extended missions.
          </p>
          <p>
            Light therapy protocols and scheduled sleep windows are primary countermeasures used
            on current ISS missions to maintain circadian alignment. This tool tracks schedule
            adherence as a proxy indicator only.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 border-t border-[#1e2a3a]">
            <NasaSourceLink
              url={NASA_SOURCES.SLEEP_IRREGULAR}
              label="Risk from Irregular Schedules"
            />
            <NasaSourceLink
              url={NASA_SOURCES.BEHAVIORAL_HEALTH}
              label="Behavioral Health Risk"
            />
            <NasaSourceLink
              url={NASA_SOURCES.HFBP_RISKS}
              label="HRP Risk Registry"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
