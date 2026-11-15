// AstroCare P11 — Wellness Recommendation Engine Page

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Filter,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Moon,
  Clock,
  Heart,
  Brain,
  Users,
} from 'lucide-react';

import type { AlertCategory, WellnessRecommendation } from '../types';
import { NASA_SOURCES } from '../constants';
import {
  Card,
  SectionHeader,
  Button,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
  SeverityBadge,
} from '../components/shared';
import { useWellnessContext } from '../context/WellnessContext';
import { useAsyncData } from '../hooks';
import { generateRecommendations } from '../services/wellness/recommendationEngine';
import { computeSleepAnalytics } from '../services/wellness/analyticsService';

export function WellnessRecommendationsPage() {
  const { astronautId, missionId, dataProvider } = useWellnessContext();

  const { data: sleepRecords } = useAsyncData(
    () => dataProvider.getSleepRecords(astronautId),
    [astronautId]
  );
  const { data: wellnessRecords } = useAsyncData(
    () => dataProvider.getWellnessRecords(astronautId),
    [astronautId]
  );
  const { data: circadianRecords } = useAsyncData(
    () => dataProvider.getCircadianRecords(astronautId),
    [astronautId]
  );
  const { data: fatigueRecords } = useAsyncData(
    () => dataProvider.getFatigueRecords(astronautId),
    [astronautId]
  );
  const { data: cognitiveRecords } = useAsyncData(
    () => dataProvider.getCognitiveRecords(astronautId),
    [astronautId]
  );
  const { data: teamRecords } = useAsyncData(
    () => dataProvider.getTeamWellnessRecords(missionId),
    [missionId]
  );

  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'ALL'>('ALL');

  // Generate recommendations dynamically from actual current data
  const recommendations: WellnessRecommendation[] = useMemo(() => {
    const sleepAnalytics = sleepRecords ? computeSleepAnalytics(sleepRecords, astronautId) : null;
    const latestWellness = wellnessRecords && wellnessRecords.length > 0
      ? wellnessRecords[wellnessRecords.length - 1]
      : null;
    const latestFatigue = fatigueRecords && fatigueRecords.length > 0
      ? fatigueRecords[fatigueRecords.length - 1]
      : null;
    const latestCircadian = circadianRecords && circadianRecords.length > 0
      ? circadianRecords[circadianRecords.length - 1]
      : null;
    const latestTeam = teamRecords && teamRecords.length > 0
      ? teamRecords[teamRecords.length - 1]
      : null;

    const avgCogAcc = cognitiveRecords && cognitiveRecords.length > 0
      ? cognitiveRecords.reduce((acc, r) => acc + r.accuracyPercent, 0) / cognitiveRecords.length
      : 85;

    return generateRecommendations({
      avgSleepHours: sleepAnalytics ? sleepAnalytics.averageDurationMinutes / 60 : 7.2,
      sleepEfficiency: sleepAnalytics ? sleepAnalytics.averageEfficiencyPercent : 85,
      sleepConsistency: sleepAnalytics ? sleepAnalytics.consistencyScore : 80,
      stressScore: latestWellness ? latestWellness.stressScore : 4,
      fatigueScore: latestFatigue ? latestFatigue.fatigueScore : 4,
      energyScore: latestWellness ? latestWellness.energyScore : 7,
      circadianAlignment: latestCircadian ? latestCircadian.alignmentScore : 85,
      moodScore: latestWellness ? latestWellness.moodScore : 7,
      teamCohesion: latestTeam ? latestTeam.cohesionScore : 80,
      isolationDays: 180,
      cognitiveAccuracy: avgCogAcc,
    });
  }, [sleepRecords, wellnessRecords, fatigueRecords, circadianRecords, teamRecords, cognitiveRecords, astronautId]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'ALL') return recommendations;
    return recommendations.filter((r) => r.category === selectedCategory);
  }, [recommendations, selectedCategory]);

  const categoryIcons: Record<AlertCategory, React.ReactNode> = {
    SLEEP: <Moon className="w-4 h-4 text-[#8b5cf6]" />,
    CIRCADIAN: <Clock className="w-4 h-4 text-[#14b8a6]" />,
    STRESS: <Heart className="w-4 h-4 text-[#ef4444]" />,
    FATIGUE: <Brain className="w-4 h-4 text-[#f59e0b]" />,
    TEAM: <Users className="w-4 h-4 text-[#22c55e]" />,
    WELLNESS: <Sparkles className="w-4 h-4 text-[#3b82f6]" />,
    COGNITIVE: <Brain className="w-4 h-4 text-[#ec4899]" />,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <DisclaimerBanner />

      {/* Safety Notice */}
      <div className="rounded-xl border border-[#1e2a3a] bg-[#0f1520] p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#8fa3be] space-y-1">
          <p className="font-semibold text-[#e8edf5]">
            Algorithmic Recommendation Engine Boundaries
          </p>
          <p>
            This service utilizes deterministic rule engines and NASA Human Research Program operational literature
            to produce lifestyle, sleep scheduling, and recovery recommendations. It does <strong>NOT</strong> provide
            pharmacological advice, clinical therapy, or psychiatric directives.
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8edf5] tracking-tight">Wellness Guidance & Countermeasures</h1>
          <p className="text-xs text-[#8fa3be] mt-1">
            Rules-based, research-informed operational countermeasures triggered by ongoing mission telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataOriginTag origin="CALCULATED" />
          <DataOriginTag origin="NASA_RESEARCH" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1e2a3a] pb-3">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a]'
              : 'text-[#8fa3be] hover:bg-[#131924]'
          }`}
        >
          All Categories ({recommendations.length})
        </button>
        {(['SLEEP', 'CIRCADIAN', 'STRESS', 'FATIGUE', 'WELLNESS', 'TEAM', 'COGNITIVE'] as AlertCategory[]).map((cat) => {
          const count = recommendations.filter((r) => r.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a]'
                  : 'text-[#8fa3be] hover:bg-[#131924]'
              }`}
            >
              {categoryIcons[cat]}
              <span>{cat}</span>
              {count > 0 && <span className="text-[10px] bg-[#1e2a3a] px-1.5 py-0.2 rounded-full">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle className="w-10 h-10 text-[#22c55e] mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-[#e8edf5]">All Telemetry Indicators Nominal</h3>
            <p className="text-xs text-[#8fa3be] max-w-md mx-auto mt-1">
              No elevated risks or threshold deviations triggered recommendations in this category.
            </p>
          </Card>
        ) : (
          filtered.map((rec) => (
            <Card key={rec.id} className="border-l-4 border-l-[#3b82f6] space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {categoryIcons[rec.category]}
                  <span className="text-xs font-bold text-[#e8edf5] uppercase tracking-wider">{rec.category} COUNTERMEASURE</span>
                  <span className="text-[10px] text-[#3b82f6] bg-[#1e3a5f] px-2 py-0.5 rounded">Trigger: {rec.triggerMetric}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  {rec.researchInformed && (
                    <span className="text-[#f59e0b] bg-[#3d2600] px-2 py-0.5 rounded font-semibold">
                      NASA Research-Informed
                    </span>
                  )}
                  <span className="text-[#8fa3be] bg-[#1e2a3a] px-2 py-0.5 rounded">Simulated Rule</span>
                </div>
              </div>

              <h2 className="text-base font-bold text-[#e8edf5]">{rec.title}</h2>
              <p className="text-xs text-[#8fa3be] leading-relaxed">{rec.explanation}</p>

              <div className="rounded-lg bg-[#0a0d14] border border-[#1e2a3a] p-3">
                <p className="text-[10px] font-semibold text-[#3b82f6] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Recommended Action Protocol:
                </p>
                <p className="text-xs text-[#e8edf5]">{rec.suggestedAction}</p>
              </div>

              {rec.supportingSource && rec.supportingSourceUrl && (
                <div className="pt-2 border-t border-[#1e2a3a] flex items-center justify-between text-xs">
                  <span className="text-[#4a6080] text-[11px]">NASA Evidence Reference:</span>
                  <NasaSourceLink url={rec.supportingSourceUrl} label={rec.supportingSource} />
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
