// AstroCare P11 — Unit Tests: Recommendation Engine & Rules

import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../services/wellness/recommendationEngine';

describe('generateRecommendations', () => {
  it('triggers sleep duration recommendation when sleep is under 7 hours', () => {
    const recs = generateRecommendations({
      avgSleepHours: 6.2,
      sleepEfficiency: 88,
      sleepConsistency: 85,
      stressScore: 3,
      fatigueScore: 3,
      energyScore: 8,
      circadianAlignment: 88,
      moodScore: 8,
      teamCohesion: 85,
      isolationDays: 180,
      cognitiveAccuracy: 90,
    });

    const sleepRec = recs.find((r) => r.triggerMetric === 'averageSleepHours');
    expect(sleepRec).toBeDefined();
    expect(sleepRec?.category).toBe('SLEEP');
    expect(sleepRec?.researchInformed).toBe(true);
    expect(sleepRec?.supportingSourceUrl).toBeDefined();
  });

  it('triggers stress recommendation when stress is 7 or higher', () => {
    const recs = generateRecommendations({
      avgSleepHours: 7.5,
      sleepEfficiency: 90,
      sleepConsistency: 90,
      stressScore: 8,
      fatigueScore: 4,
      energyScore: 7,
      circadianAlignment: 85,
      moodScore: 6,
      teamCohesion: 80,
      isolationDays: 180,
      cognitiveAccuracy: 88,
    });

    const stressRec = recs.find((r) => r.category === 'STRESS');
    expect(stressRec).toBeDefined();
    expect(stressRec?.title).toContain('Stress');
  });

  it('triggers fatigue recommendation when fatigue is 7 or higher', () => {
    const recs = generateRecommendations({
      avgSleepHours: 7.5,
      sleepEfficiency: 90,
      sleepConsistency: 90,
      stressScore: 3,
      fatigueScore: 8,
      energyScore: 5,
      circadianAlignment: 85,
      moodScore: 6,
      teamCohesion: 80,
      isolationDays: 180,
      cognitiveAccuracy: 88,
    });

    const fatRec = recs.find((r) => r.category === 'FATIGUE');
    expect(fatRec).toBeDefined();
  });

  it('triggers team recommendation when cohesion is below 65', () => {
    const recs = generateRecommendations({
      avgSleepHours: 7.5,
      sleepEfficiency: 90,
      sleepConsistency: 90,
      stressScore: 3,
      fatigueScore: 3,
      energyScore: 7,
      circadianAlignment: 85,
      moodScore: 7,
      teamCohesion: 55,
      isolationDays: 180,
      cognitiveAccuracy: 88,
    });

    const teamRec = recs.find((r) => r.category === 'TEAM');
    expect(teamRec).toBeDefined();
  });

  it('triggers circadian drift recommendation when alignment is below 55', () => {
    const recs = generateRecommendations({
      avgSleepHours: 7.5,
      sleepEfficiency: 90,
      sleepConsistency: 90,
      stressScore: 3,
      fatigueScore: 3,
      energyScore: 7,
      circadianAlignment: 45,
      moodScore: 7,
      teamCohesion: 80,
      isolationDays: 180,
      cognitiveAccuracy: 88,
    });

    const circRec = recs.find((r) => r.category === 'CIRCADIAN');
    expect(circRec).toBeDefined();
  });

  it('returns empty array when all indicators are nominal', () => {
    const recs = generateRecommendations({
      avgSleepHours: 8.0,
      sleepEfficiency: 92,
      sleepConsistency: 90,
      stressScore: 2,
      fatigueScore: 2,
      energyScore: 9,
      circadianAlignment: 92,
      moodScore: 9,
      teamCohesion: 90,
      isolationDays: 180,
      cognitiveAccuracy: 95,
    });

    expect(recs.length).toBe(0);
  });
});
