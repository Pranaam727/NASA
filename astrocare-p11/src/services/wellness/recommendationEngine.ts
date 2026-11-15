// AstroCare P11 — Recommendation Engine
// Rules-based, research-informed. No AI. No medical diagnosis.

import type { WellnessRecommendation, AlertCategory } from '../../types';
import { NASA_SOURCES } from '../../constants';
import { generateId, getISONow } from '../../utils';

interface RecommendationInput {
  avgSleepHours: number;
  sleepEfficiency: number;
  sleepConsistency: number;
  stressScore: number;
  fatigueScore: number;
  energyScore: number;
  circadianAlignment: number;
  moodScore: number;
  teamCohesion: number;
  isolationDays: number;
  cognitiveAccuracy: number;
}

type RecommendationRule = {
  category: AlertCategory;
  triggerMetric: string;
  triggerThreshold: number;
  triggerFn: (input: RecommendationInput) => boolean;
  triggerValue: (input: RecommendationInput) => number;
  title: string;
  explanation: string;
  suggestedAction: string;
  supportingSource?: string;
  supportingSourceUrl?: string;
  researchInformed: boolean;
};

const RULES: RecommendationRule[] = [
  {
    category: 'SLEEP',
    triggerMetric: 'averageSleepHours',
    triggerThreshold: 7.0,
    triggerFn: (i) => i.avgSleepHours < 7.0,
    triggerValue: (i) => i.avgSleepHours,
    title: 'Increase Sleep Duration',
    explanation:
      'Average sleep duration is below the 7-hour mission target. NASA research documents that ISS astronauts frequently obtain less sleep than recommended, with cumulative effects on cognitive performance and mood.',
    suggestedAction:
      'Review workload scheduling to protect sleep windows. Consider whether pre-sleep activities can be rescheduled. Maintain a consistent pre-sleep routine.',
    supportingSource: 'NASA HRP — Risk of Inadequate Sleep and Irregular Schedules',
    supportingSourceUrl: NASA_SOURCES.SLEEP_IRREGULAR,
    researchInformed: true,
  },
  {
    category: 'SLEEP',
    triggerMetric: 'sleepEfficiency',
    triggerThreshold: 80,
    triggerFn: (i) => i.sleepEfficiency < 80,
    triggerValue: (i) => i.sleepEfficiency,
    title: 'Review Sleep Quality Factors',
    explanation:
      'Sleep efficiency is below 80%. Low sleep efficiency may indicate disrupted sleep, environmental noise, or delayed sleep onset. Improving sleep hygiene and environment conditions may help.',
    suggestedAction:
      'Assess pre-sleep environment. Reduce ambient light and noise before sleep. Avoid stimulating activities in the 60 minutes before scheduled sleep.',
    supportingSource: 'NASA HRP — Risk of Inadequate Sleep and Irregular Schedules',
    supportingSourceUrl: NASA_SOURCES.SLEEP_IRREGULAR,
    researchInformed: true,
  },
  {
    category: 'SLEEP',
    triggerMetric: 'sleepConsistency',
    triggerThreshold: 65,
    triggerFn: (i) => i.sleepConsistency < 65,
    triggerValue: (i) => i.sleepConsistency,
    title: 'Improve Sleep Schedule Consistency',
    explanation:
      'Sleep schedule shows high variability. Irregular sleep/wake times can disrupt circadian rhythms and reduce overall sleep quality, even when total sleep time is adequate.',
    suggestedAction:
      'Establish and protect consistent sleep and wake times. Minimize schedule deviations where mission operations allow.',
    supportingSource: 'NASA HRP — Risk of Inadequate Sleep and Irregular Schedules',
    supportingSourceUrl: NASA_SOURCES.SLEEP_IRREGULAR,
    researchInformed: true,
  },
  {
    category: 'CIRCADIAN',
    triggerMetric: 'circadianAlignment',
    triggerThreshold: 55,
    triggerFn: (i) => i.circadianAlignment < 55,
    triggerValue: (i) => i.circadianAlignment,
    title: 'Address Circadian Schedule Drift',
    explanation:
      'Schedule-alignment estimate indicates significant circadian drift. Circadian desynchronization is a recognized NASA spaceflight risk that can compound sleep difficulties and affect performance.',
    suggestedAction:
      'Review light exposure scheduling. Structured exposure to bright light at appropriate times can help re-anchor circadian timing. Consult mission support for schedule adjustment options.',
    supportingSource: 'NASA HRP — Risk of Inadequate Sleep and Irregular Schedules',
    supportingSourceUrl: NASA_SOURCES.SLEEP_IRREGULAR,
    researchInformed: true,
  },
  {
    category: 'STRESS',
    triggerMetric: 'stressScore',
    triggerThreshold: 7,
    triggerFn: (i) => i.stressScore >= 7,
    triggerValue: (i) => i.stressScore,
    title: 'Elevated Self-Reported Stress',
    explanation:
      'Self-reported stress has reached elevated levels. Persistent high stress in a small isolated confined environment can affect interpersonal dynamics and wellbeing over extended missions.',
    suggestedAction:
      'Schedule regular check-in conversations. Ensure adequate unstructured rest time. Consider stress-reduction techniques appropriate to the mission context.',
    supportingSource: 'NASA HRP — Behavioral Health Risk',
    supportingSourceUrl: NASA_SOURCES.BEHAVIORAL_HEALTH,
    researchInformed: true,
  },
  {
    category: 'FATIGUE',
    triggerMetric: 'fatigueScore',
    triggerThreshold: 7,
    triggerFn: (i) => i.fatigueScore >= 7,
    triggerValue: (i) => i.fatigueScore,
    title: 'High Fatigue — Review Critical Task Scheduling',
    explanation:
      'Self-reported fatigue is elevated. High fatigue states are associated with performance decrements. Avoid scheduling high-consequence tasks during simulated high-fatigue periods where possible.',
    suggestedAction:
      'Review task scheduling. Identify opportunities for recovery rest. Avoid overtime on safety-critical activities during high-fatigue states.',
    supportingSource: 'NASA HRP — Human Factors and Behavioral Performance',
    supportingSourceUrl: NASA_SOURCES.HFBP_RISKS,
    researchInformed: true,
  },
  {
    category: 'WELLNESS',
    triggerMetric: 'moodScore',
    triggerThreshold: 4,
    triggerFn: (i) => i.moodScore <= 4,
    triggerValue: (i) => i.moodScore,
    title: 'Low Mood — Encourage Regular Check-Ins',
    explanation:
      'Self-reported mood is below expected levels. Regular wellness check-ins support awareness of mood trends. Social interaction and meaningful activities can contribute to sustained wellbeing during long missions.',
    suggestedAction:
      'Encourage regular wellness check-ins. Schedule enjoyable and meaningful leisure activities. Ensure communication with ground support and family where available.',
    supportingSource: 'NASA HRP — Behavioral Health Risk',
    supportingSourceUrl: NASA_SOURCES.BEHAVIORAL_HEALTH,
    researchInformed: true,
  },
  {
    category: 'TEAM',
    triggerMetric: 'teamCohesion',
    triggerThreshold: 65,
    triggerFn: (i) => i.teamCohesion < 65,
    triggerValue: (i) => i.teamCohesion,
    title: 'Team Cohesion Requires Attention',
    explanation:
      'Team cohesion indicators have trended lower. NASA research on isolation and confinement identifies interpersonal dynamics as a key mission risk in extended missions. Proactive team maintenance is recommended.',
    suggestedAction:
      'Schedule structured team activities and collaborative tasks. Address any interpersonal conflicts early through facilitated discussion. Reinforce shared mission objectives.',
    supportingSource: 'NASA HRP — Hazard: Isolation and Confinement',
    supportingSourceUrl: NASA_SOURCES.ISOLATION,
    researchInformed: true,
  },
  {
    category: 'WELLNESS',
    triggerMetric: 'energyScore',
    triggerThreshold: 4,
    triggerFn: (i) => i.energyScore <= 4,
    triggerValue: (i) => i.energyScore,
    title: 'Low Energy — Review Rest and Recovery',
    explanation:
      'Energy levels are consistently low. Persistent low energy may reflect inadequate sleep, high workload, or emotional exhaustion. Addressing contributing factors systematically is recommended.',
    suggestedAction:
      'Review sleep quantity and quality. Assess current workload balance. Ensure adequate unstructured downtime and opportunities for physical activity.',
    researchInformed: true,
  },
  {
    category: 'COGNITIVE',
    triggerMetric: 'cognitiveAccuracy',
    triggerThreshold: 70,
    triggerFn: (i) => i.cognitiveAccuracy < 70,
    triggerValue: (i) => i.cognitiveAccuracy,
    title: 'Cognitive Task Performance Below Baseline',
    explanation:
      'Demonstration cognitive task accuracy has declined. Sleep restriction and fatigue are well-documented contributors to cognitive performance decrements. This is an educational indicator only.',
    suggestedAction:
      'Review sleep and fatigue status. Prioritise sleep recovery. Avoid high-consequence activities when fatigue and low performance indicators coincide.',
    supportingSource: 'NASA HRP — Standardized Behavioral Measures (Task 1623)',
    supportingSourceUrl: NASA_SOURCES.STANDARDIZED_MEASURES,
    researchInformed: true,
  },
];

export function generateRecommendations(
  input: RecommendationInput
): WellnessRecommendation[] {
  const now = getISONow();
  return RULES
    .filter((rule) => rule.triggerFn(input))
    .map((rule) => ({
      id: generateId('REC'),
      category: rule.category,
      triggerMetric: rule.triggerMetric,
      triggerValue: rule.triggerValue(input),
      triggerThreshold: rule.triggerThreshold,
      title: rule.title,
      explanation: rule.explanation,
      suggestedAction: rule.suggestedAction,
      supportingSource: rule.supportingSource,
      supportingSourceUrl: rule.supportingSourceUrl,
      isSimulated: true,
      researchInformed: rule.researchInformed,
      timestamp: now,
    }));
}
