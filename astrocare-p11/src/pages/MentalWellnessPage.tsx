// AstroCare P11 — Mental Wellness & Stress Monitoring Page

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Heart,
  Smile,
  AlertCircle,
  Zap,
  Shield,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import type { WellnessRecord } from '../types';
import { formatDate, formatTime, formatShortDate, average, roundTo, getISONow } from '../utils';
import { SCALE_DOCS, NASA_SOURCES } from '../constants';
import {
  Card,
  MetricCard,
  SectionHeader,
  Button,
  ScaleInput,
  LoadingState,
  ErrorState,
  EmptyState,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
  InfoTooltip,
} from '../components/shared';
import { useWellnessContext } from '../context/WellnessContext';
import { useAsyncData } from '../hooks';

export function MentalWellnessPage() {
  const { astronautId, missionId, dataProvider } = useWellnessContext();

  const { data: records, status, error, refetch } = useAsyncData<WellnessRecord[]>(
    () => dataProvider.getWellnessRecords(astronautId),
    [astronautId]
  );

  // Check-in form state
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(7);
  const [wellbeing, setWellbeing] = useState(7);
  const [privateNotes, setPrivateNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const now = getISONow();
      const currentDay = records && records.length > 0
        ? Math.max(...records.map((r) => r.missionDay)) + 1
        : 180;

      await dataProvider.saveWellnessRecord({
        astronautId,
        missionId,
        timestamp: now,
        missionDay: currentDay,
        moodScore: mood,
        stressScore: stress,
        energyScore: energy,
        wellbeingScore: wellbeing,
        privateNotes: privateNotes.trim() ? privateNotes.trim() : undefined,
        source: 'SELF_REPORT',
        dataOrigin: 'USER_ENTERED',
      });

      setSubmitSuccess(true);
      setPrivateNotes('');
      refetch();
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save wellness check-in', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Recent 14 days chart data
  const chartData = useMemo(() => {
    if (!records) return [];
    return [...records]
      .sort((a, b) => a.missionDay - b.missionDay)
      .slice(-14)
      .map((r) => ({
        day: `Day ${r.missionDay}`,
        date: formatShortDate(r.timestamp),
        mood: r.moodScore,
        stress: r.stressScore,
        energy: r.energyScore,
        wellbeing: r.wellbeingScore,
      }));
  }, [records]);

  // Summary statistics
  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return { avgMood: 0, avgStress: 0, avgEnergy: 0, avgWellbeing: 0, count: 0 };
    }
    const recent = records.slice(-14);
    return {
      avgMood: roundTo(average(recent.map((r) => r.moodScore)), 1),
      avgStress: roundTo(average(recent.map((r) => r.stressScore)), 1),
      avgEnergy: roundTo(average(recent.map((r) => r.energyScore)), 1),
      avgWellbeing: roundTo(average(recent.map((r) => r.wellbeingScore)), 1),
      count: records.length,
    };
  }, [records]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <DisclaimerBanner />

      {/* Safety Notice Card */}
      <div className="rounded-xl border border-[#1e2a3a] bg-[#0f1520] p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#8fa3be] space-y-1">
          <p className="font-semibold text-[#e8edf5]">
            Mental Health & Emotional Well-Being Safety Boundaries
          </p>
          <p>
            This system is an operational support and research-demonstration monitoring tool. It does
            <strong> NOT </strong> diagnose depressive disorders, clinical anxiety, PTSD, or any psychiatric condition.
            Personal reflections and check-in notes are private to the astronaut session and are never broadcast in
            public mission telemetry.
          </p>
        </div>
      </div>

      {/* Page Title & Tags */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8edf5] tracking-tight">Mental Wellness & Stress Intelligence</h1>
          <p className="text-xs text-[#8fa3be] mt-1">
            Subjective well-being check-ins, stress trends, and psycho-social adaptation monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataOriginTag origin="USER_ENTERED" />
          <DataOriginTag origin="SIMULATED" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="14-Day Avg Mood"
          value={stats.avgMood}
          unit="/10"
          subtext="Self-reported scale"
          color="#3b82f6"
          icon={<Smile className="w-4 h-4" />}
        />
        <MetricCard
          label="14-Day Avg Stress"
          value={stats.avgStress}
          unit="/10"
          subtext="Inverted scale"
          color={stats.avgStress > 6 ? '#ef4444' : stats.avgStress > 4 ? '#f59e0b' : '#22c55e'}
          icon={<AlertCircle className="w-4 h-4" />}
        />
        <MetricCard
          label="14-Day Avg Energy"
          value={stats.avgEnergy}
          unit="/10"
          subtext="Vitality rating"
          color="#14b8a6"
          icon={<Zap className="w-4 h-4" />}
        />
        <MetricCard
          label="Overall Well-Being"
          value={stats.avgWellbeing}
          unit="/10"
          subtext="Composite baseline"
          color="#8b5cf6"
          icon={<Heart className="w-4 h-4" />}
        />
      </div>

      {status === 'loading' && <LoadingState message="Loading mental wellness telemetry..." />}
      {status === 'error' && <ErrorState message={error || 'Failed to load telemetry'} onRetry={refetch} />}

      {status === 'success' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Check-in Form */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <SectionHeader
                title="Astronaut Wellness Check-In"
                subtitle="Daily subjective status logging"
                badge={<span className="text-[10px] text-[#3b82f6] bg-[#1e3a5f] px-2 py-0.5 rounded">Active Session</span>}
              />

              {submitSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-[#0d3020] border border-[#1b5e20] flex items-center gap-2 text-xs text-[#4ade80]">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Check-in recorded successfully. Telemetry and trends updated.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium text-[#8fa3be]">Mood Rating</span>
                      <InfoTooltip text={SCALE_DOCS.MOOD} />
                    </div>
                    <ScaleInput
                      label="Current Mood"
                      value={mood}
                      min={1}
                      max={10}
                      onChange={setMood}
                      description="1 = Very Low / Distressed, 10 = Optimal / Uplifted"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium text-[#8fa3be]">Perceived Stress</span>
                      <InfoTooltip text={SCALE_DOCS.STRESS} />
                    </div>
                    <ScaleInput
                      label="Stress Level"
                      value={stress}
                      min={1}
                      max={10}
                      invertColor
                      onChange={setStress}
                      description="1 = Completely Relaxed, 10 = Extreme Overwhelm"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium text-[#8fa3be]">Physical & Mental Energy</span>
                      <InfoTooltip text={SCALE_DOCS.ENERGY} />
                    </div>
                    <ScaleInput
                      label="Energy Level"
                      value={energy}
                      min={1}
                      max={10}
                      onChange={setEnergy}
                      description="1 = Exhausted / Depleted, 10 = Fully Energized"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium text-[#8fa3be]">Overall Sense of Well-Being</span>
                      <InfoTooltip text={SCALE_DOCS.WELLBEING} />
                    </div>
                    <ScaleInput
                      label="Well-Being"
                      value={wellbeing}
                      min={1}
                      max={10}
                      onChange={setWellbeing}
                      description="1 = Marked Discomfort, 10 = Thriving / Excellent"
                    />
                  </div>
                </div>

                {/* Private Notes Field */}
                <div className="pt-2 border-t border-[#1e2a3a]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[#8fa3be] flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
                      Personal Reflections & Context
                    </label>
                    <span className="text-[10px] text-[#f59e0b] bg-[#3d2600] px-1.5 py-0.5 rounded">
                      Private & Encrypted
                    </span>
                  </div>
                  <textarea
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    placeholder="Record notes on sleep quality, mission pressures, interpersonal events, or physical comfort... (Only visible in this private terminal)"
                    rows={3}
                    className="w-full bg-[#0a0d14] border border-[#1e2a3a] rounded-lg p-3 text-xs text-[#e8edf5] placeholder-[#4a6080] focus:border-[#3b82f6] focus:outline-none transition-colors resize-none"
                  />
                  <p className="text-[10px] text-[#4a6080] mt-1">
                    Notes are excluded from public dashboard views and aggregate team metrics.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  icon={<Send className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  Record Daily Check-In
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Trend Visualizations & History */}
          <div className="lg:col-span-7 space-y-6">
            {/* 14-Day Trend Chart */}
            <Card>
              <SectionHeader
                title="14-Day Subjective Trajectory"
                subtitle="Mood, Stress, Energy, and Well-Being dynamics"
              />
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />
                    <XAxis dataKey="day" stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                    <YAxis domain={[1, 10]} stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f1520',
                        borderColor: '#1e2a3a',
                        borderRadius: '8px',
                        color: '#e8edf5',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      name="Mood (1-10)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#moodGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="stress"
                      name="Stress (1-10)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#stressGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="energy"
                      name="Energy (1-10)"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#energyGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3 text-xs">
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

            {/* Check-in Log Table */}
            <Card>
              <SectionHeader
                title="Recent Check-In History"
                subtitle="Last 7 recorded telemetry points (Public fields only)"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1e2a3a] text-[#8fa3be] text-left">
                      <th className="py-2.5 font-medium">Mission Day</th>
                      <th className="py-2.5 font-medium">Timestamp</th>
                      <th className="py-2.5 font-medium text-center">Mood</th>
                      <th className="py-2.5 font-medium text-center">Stress</th>
                      <th className="py-2.5 font-medium text-center">Energy</th>
                      <th className="py-2.5 font-medium text-center">Well-Being</th>
                      <th className="py-2.5 font-medium text-right">Origin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162032]">
                    {[...(records || [])]
                      .sort((a, b) => b.missionDay - a.missionDay)
                      .slice(0, 7)
                      .map((r) => (
                        <tr key={r.id} className="hover:bg-[#19202f] transition-colors">
                          <td className="py-2.5 font-semibold text-[#e8edf5]">Day {r.missionDay}</td>
                          <td className="py-2.5 text-[#8fa3be]">{formatDate(r.timestamp)} {formatTime(r.timestamp)}</td>
                          <td className="py-2.5 text-center font-bold text-[#3b82f6]">{r.moodScore}</td>
                          <td className="py-2.5 text-center font-bold text-[#ef4444]">{r.stressScore}</td>
                          <td className="py-2.5 text-center font-bold text-[#14b8a6]">{r.energyScore}</td>
                          <td className="py-2.5 text-center font-bold text-[#8b5cf6]">{r.wellbeingScore}</td>
                          <td className="py-2.5 text-right">
                            <DataOriginTag origin={r.dataOrigin} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* NASA Research Grounding */}
            <Card className="border-[#3d2600] bg-[#1a1200]/40">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs text-[#8fa3be]">
                  <p className="font-semibold text-[#f59e0b]">NASA Human Research Program Integration</p>
                  <p>
                    NASA's Behavioral Health & Performance element highlights that subjective stress monitoring and
                    regular behavioral check-ins allow early identification of psycho-social adaptation issues before
                    operational performance is compromised.
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                    <NasaSourceLink
                      url={NASA_SOURCES.BEHAVIORAL_HEALTH}
                      label="NASA Behavioral Health Risk Overview"
                    />
                    <NasaSourceLink
                      url={NASA_SOURCES.STANDARDIZED_MEASURES}
                      label="Standardized Behavioral Measures (Task 1623)"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
