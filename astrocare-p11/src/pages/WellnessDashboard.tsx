// AstroCare P11 — Master Wellness Dashboard Page

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Moon,
  Clock,
  Heart,
  Brain,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

import type {
  SleepRecord,
  WellnessRecord,
  CircadianRecord,
  FatigueRecord,
  CognitivePerformanceRecord,
  WellnessAlert,
} from '../types';
import { formatDate, formatTime, formatShortDate, average, roundTo } from '../utils';
import { STATUS_RULES, DEMO_MISSION_ID, DEMO_ASTRONAUT_ID } from '../constants';
import {
  Card,
  MetricCard,
  SectionHeader,
  ScoreRing,
  StatusBadge,
  SeverityBadge,
  LoadingState,
  ErrorState,
  DisclaimerBanner,
  DataOriginTag,
} from '../components/shared';
import { useWellnessContext } from '../context/WellnessContext';
import { useAsyncData } from '../hooks';
import {
  computeWellnessAnalytics,
  computeSleepAnalytics,
} from '../services/wellness/analyticsService';

export function WellnessDashboard() {
  const { astronautId, missionId, dataProvider } = useWellnessContext();

  // Load all telemetry feeds asynchronously
  const { data: sleepRecords, status: sleepStatus } = useAsyncData<SleepRecord[]>(
    () => dataProvider.getSleepRecords(astronautId),
    [astronautId]
  );
  const { data: wellnessRecords, status: wellnessStatus } = useAsyncData<WellnessRecord[]>(
    () => dataProvider.getWellnessRecords(astronautId),
    [astronautId]
  );
  const { data: circadianRecords, status: circStatus } = useAsyncData<CircadianRecord[]>(
    () => dataProvider.getCircadianRecords(astronautId),
    [astronautId]
  );
  const { data: fatigueRecords, status: fatigueStatus } = useAsyncData<FatigueRecord[]>(
    () => dataProvider.getFatigueRecords(astronautId),
    [astronautId]
  );
  const { data: cognitiveRecords, status: cogStatus } = useAsyncData<CognitivePerformanceRecord[]>(
    () => dataProvider.getCognitiveRecords(astronautId),
    [astronautId]
  );
  const { data: alerts, status: alertsStatus } = useAsyncData<WellnessAlert[]>(
    () => dataProvider.getWellnessAlerts(astronautId),
    [astronautId]
  );

  const isLoading =
    sleepStatus === 'loading' ||
    wellnessStatus === 'loading' ||
    circStatus === 'loading' ||
    fatigueStatus === 'loading';

  // Compute overall composite analytics
  const analytics = useMemo(() => {
    return computeWellnessAnalytics(
      wellnessRecords || [],
      sleepRecords || [],
      circadianRecords || [],
      fatigueRecords || [],
      astronautId
    );
  }, [wellnessRecords, sleepRecords, circadianRecords, fatigueRecords, astronautId]);

  const sleepAnalytics = useMemo(() => {
    return computeSleepAnalytics(sleepRecords || [], astronautId);
  }, [sleepRecords, astronautId]);

  const latestWellness = useMemo(() => {
    if (!wellnessRecords || wellnessRecords.length === 0) return null;
    return wellnessRecords[wellnessRecords.length - 1];
  }, [wellnessRecords]);

  const latestFatigue = useMemo(() => {
    if (!fatigueRecords || fatigueRecords.length === 0) return null;
    return fatigueRecords[fatigueRecords.length - 1];
  }, [fatigueRecords]);

  const latestCirc = useMemo(() => {
    if (!circadianRecords || circadianRecords.length === 0) return null;
    return circadianRecords[circadianRecords.length - 1];
  }, [circadianRecords]);

  // 7-day sparkline trend data
  const trendData = useMemo(() => {
    if (!wellnessRecords || wellnessRecords.length === 0) return [];
    return [...wellnessRecords]
      .sort((a, b) => a.missionDay - b.missionDay)
      .slice(-7)
      .map((r) => ({
        day: `D${r.missionDay}`,
        mood: r.moodScore,
        stress: r.stressScore,
        energy: r.energyScore,
      }));
  }, [wellnessRecords]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <DisclaimerBanner />

      {/* Header Profile Bar */}
      <div className="rounded-xl border border-[#1e2a3a] bg-[#0f1520] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] border border-[#2a4a7a] flex items-center justify-center text-[#3b82f6]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#e8edf5]">Astronaut Overview · CREW-07-ALPHA</h1>
              <StatusBadge status={analytics.overallWellnessStatus} />
            </div>
            <p className="text-xs text-[#8fa3be] mt-0.5">
              Mission: Expedition 72 Alpha (ISS) · Day 180 of 180 · Telemetry: Local Demo Provider
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DataOriginTag origin="SIMULATED" />
          <DataOriginTag origin="CALCULATED" />
        </div>
      </div>

      {isLoading && <LoadingState message="Aggregating multi-system wellness telemetry..." />}

      {!isLoading && (
        <>
          {/* Main Hero Grid: Overall Status & Composite Score */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Status Ring & Rule Summary */}
            <Card className="lg:col-span-4 flex flex-col items-center justify-center p-6 text-center">
              <SectionHeader
                title="Overall Wellness Index"
                subtitle="Weighted physiological & subjective composite"
              />
              <div className="my-2">
                <ScoreRing
                  score={analytics.overallScore}
                  size={150}
                  strokeWidth={10}
                  color={
                    analytics.overallScore > 75
                      ? '#22c55e'
                      : analytics.overallScore > 50
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                  label={`${Math.round(analytics.overallScore)}%`}
                  sublabel="Operational Readiness"
                />
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[#0a0d14] border border-[#1e2a3a] w-full text-left text-xs">
                <p className="font-semibold text-[#e8edf5] mb-1">Status Determination Rule:</p>
                <p className="text-[#8fa3be]">{STATUS_RULES[analytics.overallWellnessStatus]}</p>
                <div className="mt-2 pt-2 border-t border-[#1e2a3a] flex items-center justify-between text-[11px] text-[#4a6080]">
                  <span>Last recorded assessment:</span>
                  <span className="text-[#8fa3be]">Day 180 (Latest)</span>
                </div>
              </div>
            </Card>

            {/* Right 8 Cols: 6 Key Metrics Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard
                label="Sleep Duration"
                value={(sleepAnalytics.averageDurationMinutes / 60).toFixed(1)}
                unit="hrs/night"
                subtext="Target: 7.5 hrs"
                color={sleepAnalytics.averageDurationMinutes / 60 < 6.5 ? '#f59e0b' : '#3b82f6'}
                icon={<Moon className="w-4 h-4" />}
              />
              <MetricCard
                label="Sleep Efficiency"
                value={Math.round(sleepAnalytics.averageEfficiencyPercent)}
                unit="%"
                subtext="Target: > 85%"
                color={sleepAnalytics.averageEfficiencyPercent < 80 ? '#f59e0b' : '#22c55e'}
                icon={<Activity className="w-4 h-4" />}
              />
              <MetricCard
                label="Circadian Alignment"
                value={Math.round(analytics.circadianAlignmentEstimate)}
                unit="%"
                subtext="Schedule deviation: ~15m"
                color="#14b8a6"
                icon={<Clock className="w-4 h-4" />}
              />
              <MetricCard
                label="Current Stress Rating"
                value={latestWellness ? latestWellness.stressScore : 4}
                unit="/10"
                subtext="Inverted scale (1-10)"
                color={latestWellness && latestWellness.stressScore > 6 ? '#ef4444' : '#22c55e'}
                icon={<Heart className="w-4 h-4" />}
              />
              <MetricCard
                label="Energy & Alertness"
                value={latestWellness ? latestWellness.energyScore : 7}
                unit="/10"
                subtext="Vitality rating"
                color="#f59e0b"
                icon={<Brain className="w-4 h-4" />}
              />
              <MetricCard
                label="Team Cohesion"
                value="82"
                unit="%"
                subtext="Expedition collective"
                color="#8b5cf6"
                icon={<Users className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Active Alerts Section */}
          <Card>
            <SectionHeader
              title="Active Monitoring Threshold Alerts"
              subtitle="Explainable rule-based triggers requiring operational oversight"
              badge={
                <span className="text-[10px] text-[#f59e0b] bg-[#3d2600] px-2 py-0.5 rounded font-bold">
                  {alerts?.length || 0} Alerts Pending
                </span>
              }
            />
            <div className="space-y-3">
              {(alerts || []).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-[#1e2a3a] bg-[#0a0d14] p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <SeverityBadge severity={alert.severity} />
                    <div>
                      <p className="text-xs font-semibold text-[#e8edf5] flex items-center gap-2">
                        <span>{alert.message}</span>
                        <span className="text-[10px] text-[#8fa3be] bg-[#1e2a3a] px-1.5 py-0.2 rounded uppercase">
                          {alert.category}
                        </span>
                      </p>
                      <p className="text-xs text-[#8fa3be] mt-0.5">{alert.explanation}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#4a6080] flex-shrink-0">
                    <p>Current: {alert.currentValue} | Threshold: {alert.threshold}</p>
                    <p>{formatDate(alert.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Trends Sparkline */}
          <Card>
            <SectionHeader
              title="7-Day Subjective Trajectory"
              subtitle="Recent trends across mood, stress, and energy ratings"
            />
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                  <XAxis dataKey="day" stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                  <YAxis domain={[1, 10]} stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1520',
                      borderColor: '#1e2a3a',
                      borderRadius: '8px',
                      color: '#e8edf5',
                    }}
                  />
                  <Line type="monotone" dataKey="mood" name="Mood" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="stress" name="Stress (Inverted)" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="energy" name="Energy" stroke="#14b8a6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2 text-xs">
              <span className="flex items-center gap-1.5 text-[#3b82f6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Mood
              </span>
              <span className="flex items-center gap-1.5 text-[#ef4444]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Stress (Inverted)
              </span>
              <span className="flex items-center gap-1.5 text-[#14b8a6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]" /> Energy
              </span>
            </div>
          </Card>

          {/* Module Navigation Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-[#8fa3be] uppercase tracking-wider">
              Specialized Intelligence Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/wellness/sleep"
                className="group p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#3b82f6] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e8edf5] group-hover:text-[#3b82f6]">Sleep Analytics</h3>
                    <p className="text-xs text-[#8fa3be]">Duration, efficiency & deficit trends</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4a6080] group-hover:text-[#3b82f6] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/wellness/circadian"
                className="group p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#14b8a6] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#14b8a6]/20 text-[#14b8a6] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e8edf5] group-hover:text-[#14b8a6]">Circadian Rhythm</h3>
                    <p className="text-xs text-[#8fa3be]">24-hr schedule alignment & drift</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4a6080] group-hover:text-[#14b8a6] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/wellness/mental"
                className="group p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#ec4899] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#ec4899]/20 text-[#ec4899] flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e8edf5] group-hover:text-[#ec4899]">Mental Wellness</h3>
                    <p className="text-xs text-[#8fa3be]">Subjective check-ins & private notes</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4a6080] group-hover:text-[#ec4899] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/wellness/cognitive"
                className="group p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#f59e0b] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e8edf5] group-hover:text-[#f59e0b]">Cognitive Battery</h3>
                    <p className="text-xs text-[#8fa3be]">Reaction, attention & memory tasks</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4a6080] group-hover:text-[#f59e0b] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/wellness/team"
                className="group p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#22c55e] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e8edf5] group-hover:text-[#22c55e]">Team Cohesion</h3>
                    <p className="text-xs text-[#8fa3be]">Crew dynamics & isolation metrics</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4a6080] group-hover:text-[#22c55e] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/wellness/research"
                className="group p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#f59e0b] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e8edf5] group-hover:text-[#f59e0b]">NASA Research</h3>
                    <p className="text-xs text-[#8fa3be]">Verified evidence & scientific sources</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4a6080] group-hover:text-[#f59e0b] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
