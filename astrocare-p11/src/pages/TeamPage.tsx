// AstroCare P11 — Team Cohesion & Isolation Page

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
  Legend,
} from 'recharts';
import {
  Users,
  Compass,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
} from 'lucide-react';

import type { TeamWellnessRecord } from '../types';
import { average, roundTo } from '../utils';
import { NASA_SOURCES } from '../constants';
import {
  Card,
  MetricCard,
  SectionHeader,
  ScoreRing,
  LoadingState,
  ErrorState,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
  ProgressBar,
} from '../components/shared';
import { useWellnessContext } from '../context/WellnessContext';
import { useAsyncData } from '../hooks';

export function TeamPage() {
  const { missionId, dataProvider } = useWellnessContext();

  const { data: records, status, error, refetch } = useAsyncData<TeamWellnessRecord[]>(
    () => dataProvider.getTeamWellnessRecords(missionId),
    [missionId]
  );

  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        cohesion: 0,
        communication: 0,
        collaboration: 0,
        conflict: 0,
        isolationDays: 180,
        interactions: 0,
      };
    }
    const latest = records[records.length - 1];
    return {
      cohesion: latest.cohesionScore,
      communication: latest.communicationScore,
      collaboration: latest.collaborationScore,
      conflict: latest.conflictIndicator,
      isolationDays: latest.isolationDurationDays,
      interactions: latest.crewInteractionFrequency,
    };
  }, [records]);

  const chartData = useMemo(() => {
    if (!records) return [];
    return records.map((r) => ({
      day: `Day ${r.missionDay}`,
      cohesion: r.cohesionScore,
      communication: r.communicationScore,
      collaboration: r.collaborationScore,
      conflict: r.conflictIndicator,
    }));
  }, [records]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <DisclaimerBanner />

      {/* Safety Notice Card */}
      <div className="rounded-xl border border-[#1e2a3a] bg-[#0f1520] p-4 flex items-start gap-3">
        <Users className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#8fa3be] space-y-1">
          <p className="font-semibold text-[#e8edf5]">
            Team Dynamics & Collective Privacy Safeguards
          </p>
          <p>
            Indicators displayed represent aggregate crew synthetic dynamics. No individual astronaut psychological
            scores, conflict attributions, or personal behavioral evaluations are broadcast. NASA spaceflight guidelines
            prioritize crew trust and psychological safety.
          </p>
        </div>
      </div>

      {/* Page Title & Tags */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8edf5] tracking-tight">Team Cohesion & Psycho-Social Isolation</h1>
          <p className="text-xs text-[#8fa3be] mt-1">
            Interpersonal synergy, crew communication cadence, collaboration density, and confinement duration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataOriginTag origin="SIMULATED" />
          <DataOriginTag origin="CALCULATED" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Crew Complement"
          value="4"
          unit="Members"
          subtext="Expedition 72 Alpha"
          color="#3b82f6"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Mission Duration"
          value={stats.isolationDays}
          unit="Days"
          subtext="Total Planned: 180 d"
          color="#14b8a6"
          icon={<Calendar className="w-4 h-4" />}
        />
        <MetricCard
          label="Interaction Frequency"
          value={stats.interactions}
          unit="Sessions / Day"
          subtext="Debriefs & social syncs"
          color="#8b5cf6"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <MetricCard
          label="Friction Indicator"
          value={stats.conflict}
          unit="pts"
          subtext="Low index (< 30 pts)"
          color={stats.conflict > 40 ? '#ef4444' : '#22c55e'}
          icon={<ShieldAlert className="w-4 h-4" />}
        />
      </div>

      {/* Team Cohesion Ring Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <ScoreRing score={stats.cohesion} size={130} color="#22c55e" label={`${stats.cohesion}%`} sublabel="Team Cohesion" />
          <h3 className="text-sm font-semibold text-[#e8edf5] mt-4">Collective Cohesion Index</h3>
          <p className="text-xs text-[#8fa3be] mt-1">
            Measures mutual bonding, shared mission goal alignment, and psychological group trust.
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <ScoreRing score={stats.communication} size={130} color="#3b82f6" label={`${stats.communication}%`} sublabel="Communication" />
          <h3 className="text-sm font-semibold text-[#e8edf5] mt-4">Interpersonal Communication</h3>
          <p className="text-xs text-[#8fa3be] mt-1">
            Evaluates operational transmission clarity, active listening, and open feedback exchange.
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <ScoreRing score={stats.collaboration} size={130} color="#14b8a6" label={`${stats.collaboration}%`} sublabel="Collaboration" />
          <h3 className="text-sm font-semibold text-[#e8edf5] mt-4">Operational Collaboration</h3>
          <p className="text-xs text-[#8fa3be] mt-1">
            Reflects cross-training coordination, multi-crew task sharing, and contingency response synchronization.
          </p>
        </Card>
      </div>

      {/* Confinement Timeline */}
      <Card>
        <SectionHeader
          title="Mission Confinement & Isolation Progress"
          subtitle="Cumulative isolated operational profile under microgravity / habitat boundaries"
        />
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-[#8fa3be]">
            <span>Day 0 (Launch / Ingress)</span>
            <span className="font-semibold text-[#3b82f6]">Day 180 (Full Mission Envelope)</span>
          </div>
          <ProgressBar value={(stats.isolationDays / 180) * 100} color="#3b82f6" height={10} showLabel />
          <p className="text-xs text-[#4a6080]">
            Extended confinement is recognized by NASA as a significant psychological hazard that can trigger
            behavioral drift, third-quarter mission morale decline, and communication friction with Earth ground control.
          </p>
        </div>
      </Card>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader
            title="Team Synergy Trajectory"
            subtitle="Cohesion, Communication, and Collaboration trends over mission duration"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                <XAxis dataKey="day" stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                <YAxis domain={[40, 100]} stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1520',
                    borderColor: '#1e2a3a',
                    borderRadius: '8px',
                    color: '#e8edf5',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="cohesion" name="Cohesion" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="communication" name="Communication" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="collaboration" name="Collaboration" stroke="#14b8a6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Friction / Tension Indicator Index"
            subtitle="Synthetic micro-indicator tracking potential communication stress"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                <XAxis dataKey="day" stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                <YAxis domain={[0, 60]} stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1520',
                    borderColor: '#1e2a3a',
                    borderRadius: '8px',
                    color: '#e8edf5',
                  }}
                />
                <Bar dataKey="conflict" name="Friction Index" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* NASA Research Grounding */}
      <Card className="border-[#1e2a3a] bg-[#0f1520]">
        <div className="flex items-start gap-3">
          <Compass className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#8fa3be] space-y-1">
            <p className="font-semibold text-[#e8edf5]">NASA Isolation & Confinement Research Foundation</p>
            <p>
              NASA's Human Research Program Hazard: Isolation and Confinement explores human performance in extreme,
              confined analog environments (such as HERA, NEEMO, and Antarctica). Research proves that structured
              interpersonal communication, equitable workload distribution, and scheduled social connection serve as
              effective operational countermeasures against psycho-social isolation.
            </p>
            <div className="pt-2 flex gap-4">
              <NasaSourceLink url={NASA_SOURCES.ISOLATION} label="NASA Hazard: Isolation & Confinement" />
              <NasaSourceLink url={NASA_SOURCES.HFBP_RISKS} label="Human Factors & Behavioral Performance Risks" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
