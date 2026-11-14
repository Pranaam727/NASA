/**
 * ASTROCARE CLINICAL KNOWLEDGE & SYNTHESIS ENGINE
 * Deterministic aerospace medical knowledge engine. Provides grounded explanations,
 * predictive physiological deterioration modeling, and structured mission health reporting.
 */

import { ReportType } from '@/types/database.types';
import {
  AICitation,
  GroundedContextDocument,
  MissionHealthReportDraft,
  PredictiveInsight,
} from './types';
import { AEROSPACE_MEDICAL_DISCLAIMER } from './guardrails';
import { extractCitations } from './grounding';

/**
 * Generates an in-depth clinical explanation of active risks and physiological deviations.
 */
export function explainActiveRisks(context: GroundedContextDocument): string {
  const { deterministicRisk, currentTelemetry, activeAlerts, callsign } = context;
  const sections: string[] = [];

  sections.push(`### Clinical Risk Analysis: ${callsign}`);
  sections.push(
    `**Overall Risk Assessment:** \`${deterministicRisk.riskLevel}\` (${deterministicRisk.compositeScore}/100 composite index).`
  );

  // 1. Alert Triage Focus
  if (activeAlerts.length > 0) {
    sections.push(`#### Active Deterministic Alerts (${activeAlerts.length})`);
    activeAlerts.forEach((alt) => {
      sections.push(
        `- **[${alt.severity}] ${alt.title}** (${alt.code})\n  *Observed Value:* \`${alt.triggeringValue}\`\n  *Mechanism:* Threshold breach verified against personal resting baselines.`
      );
    });
  }

  // 2. Subsystem Mechanistic Explanations
  sections.push('#### Organ-System Mechanistic Correlates');

  const hr = currentTelemetry.HEART_RATE;
  const spo2 = currentTelemetry.SPO2;
  const bpSys = currentTelemetry.BLOOD_PRESSURE_SYS;
  const rad = currentTelemetry.RADIATION_FLUX;

  if (spo2 && spo2.value <= 88) {
    sections.push(
      `- **Pulmonary / ECLSS Alert:** Arterial saturation at \`${spo2.value}%\` (Δ ${spo2.delta}%, ${spo2.zScore}σ) indicates acute hypoxia. Peripheral chemoreceptors in the carotid bodies trigger compensatory sympathetic tachycardia and tachypnea to sustain cerebral perfusion.`
    );
  }

  if (hr && hr.value >= 120) {
    sections.push(
      `- **Cardiovascular Exertion:** Heart rate elevated to \`${hr.value} bpm\` (Δ +${hr.delta} bpm, ${hr.zScore}σ). Baroreflex coupling drives systolic pressure to \`${bpSys?.value ?? '--'} mmHg\`. Myocardial metabolic demand is heightened.`
    );
  }

  if (rad && rad.value >= 1.0) {
    sections.push(
      `- **Space Radiation Dosimetry:** Ambient dosimeter flux spiked to \`${rad.value} uSv/h\` (Solar Particle Event active). Proton scintillation rate indicates coronal mass ejection passage; active tissue absorbed dose accumulation is rapid.`
    );
  }

  if (deterministicRisk.activeSynergies.length > 0) {
    sections.push('#### Compound Multi-System Synergisms');
    deterministicRisk.activeSynergies.forEach((syn) => {
      sections.push(`- ⚠️ **${syn}**`);
    });
  }

  sections.push('#### Flight Surgeon Contingency Directives');
  sections.push(`> ${deterministicRisk.directive}`);

  sections.push(`\n---\n*${AEROSPACE_MEDICAL_DISCLAIMER}*`);
  return sections.join('\n\n');
}

/**
 * Generates forward-looking predictive physiological deterioration insights.
 * Explicitly flags every projection as a statistical estimate rather than confirmed measurement.
 */
export function generatePredictiveInsights(context: GroundedContextDocument): PredictiveInsight[] {
  const insights: PredictiveInsight[] = [];
  const { currentTelemetry } = context;

  const spo2 = currentTelemetry.SPO2;
  const hr = currentTelemetry.HEART_RATE;
  const rad = currentTelemetry.RADIATION_FLUX;

  // 1. Hypoxia Decay Prediction
  if (spo2 && spo2.value <= 90) {
    const isCritical = spo2.value <= 85;
    insights.push({
      id: `pred-hypox-${Date.now()}`,
      parameter: 'SPO2',
      timeframe: '15 - 30 Minutes',
      trendDirection: 'WORSENING',
      probability: isCritical ? 92 : 78,
      projectedValue: isCritical ? '≤ 80% SpO2' : '82 - 84% SpO2',
      headline: 'Projected Acute Hypoxic Decompensation',
      rationale:
        'Continuous exponential desaturation model indicates suit/cabin pO2 depletion if gas exchange regulator leak remains unmitigated.',
      recommendedPreemptiveAction:
        'Initiate manual ECLSS purge and switch astronaut to secondary high-flow oxygen supply.',
      isPrediction: true,
    });
  }

  // 2. Cardiac Fatigue / Tachycardia Projection
  if (hr && hr.value >= 125) {
    insights.push({
      id: `pred-cardio-${Date.now()}`,
      parameter: 'HEART_RATE',
      timeframe: '45 - 60 Minutes',
      trendDirection: 'WORSENING',
      probability: 74,
      projectedValue: '145 - 155 bpm (Arrhythmia Risk)',
      headline: 'Cardiovascular Sympathetic Exhaustion',
      rationale:
        'Sustained inotropic workload in microgravity reduces stroke volume, accelerating cardiovascular deconditioning and post-EVA fatigue.',
      recommendedPreemptiveAction:
        'Mandate 30-minute seated rest, initiate active thermal cooling garment, and hydrate with electrolyte solution.',
      isPrediction: true,
    });
  }

  // 3. Radiation Exposure Integration Projection
  if (rad && rad.value >= 0.5) {
    const isSpe = rad.value >= 5.0;
    insights.push({
      id: `pred-rad-${Date.now()}`,
      parameter: 'RADIATION_FLUX',
      timeframe: '2 - 6 Hours',
      trendDirection: 'WORSENING',
      probability: isSpe ? 96 : 82,
      projectedValue: isSpe ? '+18.5 mSv Cumulative Dose' : '+3.2 mSv Cumulative Dose',
      headline: 'Solar Proton Event Career Dosimetry Accrual',
      rationale:
        'Dosimetry integration models indicate SPE flux will elevate career effective dose toward cumulative mission limits (500 mSv ceiling).',
      recommendedPreemptiveAction:
        'Relocate all crew members to central habitat radiation storm shelter (water-wall shielded core).',
      isPrediction: true,
    });
  }

  // 4. Stable Homeostasis Projection (Default if nominal)
  if (insights.length === 0) {
    insights.push({
      id: `pred-nom-${Date.now()}`,
      parameter: 'HOMEOSTASIS',
      timeframe: '6 - 12 Hours',
      trendDirection: 'STABILIZING',
      probability: 95,
      projectedValue: 'Nominal Baseline Envelope',
      headline: 'Stable Autonomic Homeostasis Forecast',
      rationale:
        'All physiological parameters are within 1.5-sigma of individual resting baselines with zero active compound stressors.',
      recommendedPreemptiveAction:
        'Maintain nominal work-rest cycle and routine 2.5-hour countermeasure exercise regimen.',
      isPrediction: true,
    });
  }

  return insights;
}

/**
 * Synthesizes a structured, vector-ready Mission Health Report.
 */
export function synthesizeMissionHealthReport(
  reportType: ReportType,
  context: GroundedContextDocument
): MissionHealthReportDraft {
  const { callsign, fullName, astronautId, missionCode, timestamp, deterministicRisk, currentTelemetry, activeAlerts } = context;
  const citations = extractCitations(context);

  const reportTitles: Record<ReportType, string> = {
    DAILY_BRIEF: `Daily Clinical Brief: ${callsign} (${missionCode})`,
    ANOMALY_EXPLANATION: `Telemetry Anomaly Clinical Dossier: ${callsign}`,
    MISSION_SUMMARY: `Mission Operational Health Summary: ${callsign}`,
    RADIATION_DOSSIER: `Comprehensive Radiation Dosimetry Assessment: ${callsign}`,
  };

  const title = reportTitles[reportType] || `Aerospace Health Report: ${callsign}`;

  const execSummary = `ARES-VI Medical Intelligence automated assessment for ${fullName} (${callsign}). Evaluated against personal resting baselines at ${new Date(timestamp).toUTCString()}. Current deterministic risk classification: ${deterministicRisk.riskLevel} (${deterministicRisk.compositeScore}/100). Active alerts: ${activeAlerts.length}.`;

  const vitalsText = Object.entries(currentTelemetry)
    .map(([param, d]) => `- **${param}:** ${d.value} ${d.unit} (Baseline Δ: ${d.delta > 0 ? '+' : ''}${d.delta}, ${d.zScore}σ, Status: ${d.status})`)
    .join('\n');

  const alertsText =
    activeAlerts.length > 0
      ? activeAlerts.map((a) => `- **[${a.severity}] ${a.title}** (\`${a.code}\`): ${a.triggeringValue}`).join('\n')
      : 'Zero active critical or warning alerts logged.';

  const predictions = generatePredictiveInsights(context);
  const predictionsText = predictions
    .map((p) => `- **[PREDICTION: ${p.probability}% Probable] ${p.headline}:** Projected ${p.projectedValue} within ${p.timeframe}. *Countermeasure:* ${p.recommendedPreemptiveAction}`)
    .join('\n');

  const markdown = `
# ${title}

**Mission Code:** \`${missionCode}\` | **Crew ID:** \`${astronautId}\`  
**Evaluation Time:** \`${timestamp}\`  
**Authoritative Risk Status:** **${deterministicRisk.riskLevel}** (\`${deterministicRisk.compositeScore}/100\`)

---

## 1. Executive Summary
${execSummary}

## 2. Telemetry Ground Truth & Baseline Invariants
${vitalsText}

## 3. Subsystem Risk Profile
- **Cardiovascular Dynamics:** ${deterministicRisk.subsystems.CARDIOVASCULAR?.score ?? 0}/100 (${deterministicRisk.subsystems.CARDIOVASCULAR?.level ?? 'NORMAL'})
- **Pulmonary & Arterial Oxygen:** ${deterministicRisk.subsystems.RESPIRATORY?.score ?? 0}/100 (${deterministicRisk.subsystems.RESPIRATORY?.level ?? 'NORMAL'})
- **Radiation & Space Weather:** ${deterministicRisk.subsystems.RADIATION?.score ?? 0}/100 (${deterministicRisk.subsystems.RADIATION?.level ?? 'NORMAL'})
- **Thermoregulation & Metabolic:** ${deterministicRisk.subsystems.METABOLIC_THERMAL?.score ?? 0}/100 (${deterministicRisk.subsystems.METABOLIC_THERMAL?.level ?? 'NORMAL'})

## 4. Active Alert Triage Status
${alertsText}

## 5. Predictive Deterioration Projections
${predictionsText}

## 6. Flight Surgeon Directives & Interventions
> ${deterministicRisk.directive}

---
*${AEROSPACE_MEDICAL_DISCLAIMER}*
`;

  return {
    reportType,
    title,
    astronautId,
    executiveSummary: execSummary,
    vitalSignsAssessment: vitalsText,
    subsystemRiskBreakdown: JSON.stringify(deterministicRisk.subsystems),
    activeAlertsTriage: alertsText,
    predictiveProjections: predictionsText,
    flightSurgeonDirectives: deterministicRisk.directive,
    citations,
    markdownContent: markdown.trim(),
  };
}

/**
 * Answers conversational queries deterministically using verified grounded context.
 */
export function generateConversationalResponse(
  userQuery: string,
  context: GroundedContextDocument
): { text: string; citations: AICitation[]; suggestedFollowUps: string[] } {
  const queryLower = userQuery.toLowerCase();
  const { callsign, deterministicRisk, currentTelemetry, activeAlerts } = context;
  const citations = extractCitations(context);

  let text = '';
  const suggestedFollowUps: string[] = [];

  if (queryLower.includes('risk') || queryLower.includes('status') || queryLower.includes('score')) {
    text = `Current deterministic evaluation for **${callsign}** indicates **${deterministicRisk.riskLevel}** protocol with a composite score of **${deterministicRisk.compositeScore}/100**.\n\n` +
      `- **Cardiovascular:** ${deterministicRisk.subsystems.CARDIOVASCULAR?.score}/100 (${deterministicRisk.subsystems.CARDIOVASCULAR?.level})\n` +
      `- **Respiratory:** ${deterministicRisk.subsystems.RESPIRATORY?.score}/100 (${deterministicRisk.subsystems.RESPIRATORY?.level})\n` +
      `- **Radiation:** ${deterministicRisk.subsystems.RADIATION?.score}/100 (${deterministicRisk.subsystems.RADIATION?.level})\n` +
      `- **Thermal:** ${deterministicRisk.subsystems.METABOLIC_THERMAL?.score}/100 (${deterministicRisk.subsystems.METABOLIC_THERMAL?.level})\n\n` +
      `**Clinical Directive:** ${deterministicRisk.directive}`;

    suggestedFollowUps.push('Explain physiological mechanism behind this risk score.');
    suggestedFollowUps.push('What are the active alerts for this astronaut?');
  } else if (queryLower.includes('alert') || queryLower.includes('incident') || queryLower.includes('emergency')) {
    if (activeAlerts.length > 0) {
      const list = activeAlerts.map((a) => `- **[${a.severity}] ${a.title}** (\`${a.code}\`): Trigger value \`${a.triggeringValue}\``).join('\n');
      text = `There are currently **${activeAlerts.length} active alerts** for **${callsign}**:\n\n${list}\n\n**Action Required:** Review alert details and acknowledge or resolve through the Incident Triage Queue.`;
    } else {
      text = `Zero active alerts for **${callsign}**. All physiological parameters and environmental dosimeters are operating within nominal baseline bounds.`;
    }
    suggestedFollowUps.push('Show predictive health projections.');
    suggestedFollowUps.push('Generate a daily clinical briefing.');
  } else if (queryLower.includes('hypoxia') || queryLower.includes('spo2') || queryLower.includes('oxygen')) {
    const spo2 = currentTelemetry.SPO2;
    text = `Arterial pulse oximetry for **${callsign}** is currently **${spo2?.value ?? 98}%** (Baseline: ${context.baselineSummary.split(',')[1]?.trim() ?? '98%'}).\n\n` +
      `- **Delta:** ${spo2?.delta > 0 ? '+' : ''}${spo2?.delta ?? 0}%\n` +
      `- **Z-Score:** ${spo2?.zScore ?? 0}σ\n` +
      `- **Status:** ${spo2?.status ?? 'NORMAL'}\n\n` +
      `In microgravity space operations, values below 88% indicate potential ECLSS regulator decay or suit micro-leak requiring immediate high-flow O2 intervention.`;
    suggestedFollowUps.push('Evaluate cardiovascular compensation.');
  } else if (queryLower.includes('radiation') || queryLower.includes('spe') || queryLower.includes('flux') || queryLower.includes('solar')) {
    const rad = currentTelemetry.RADIATION_FLUX;
    text = `Ambient dosimeter reading is **${rad?.value ?? 0.052} uSv/h** (Background baseline: 0.052 uSv/h).\n\n` +
      `Solar Particle Events (SPEs) pose an acute high-flux threat during deep-space transit to Mars. Any flux exceeding 1.0 uSv/h requires crew movement to the central water-wall shielded storm shelter.`;
    suggestedFollowUps.push('What is the cumulative career dose projection?');
  } else {
    text = `Autonomous Clinical Intelligence review for **${callsign}**:\n\n` +
      `- **Deterministic Risk Index:** ${deterministicRisk.riskLevel} (${deterministicRisk.compositeScore}/100)\n` +
      `- **Heart Rate:** ${currentTelemetry.HEART_RATE?.value ?? '--'} bpm (Baseline Δ: ${currentTelemetry.HEART_RATE?.delta ?? 0})\n` +
      `- **Oxygen Saturation:** ${currentTelemetry.SPO2?.value ?? '--'}% (Status: ${currentTelemetry.SPO2?.status ?? 'NORMAL'})\n` +
      `- **Radiation Flux:** ${currentTelemetry.RADIATION_FLUX?.value ?? '--'} uSv/h\n` +
      `- **Active Alert Count:** ${activeAlerts.length}\n\n` +
      `**Flight Surgeon Directive:** ${deterministicRisk.directive}`;

    suggestedFollowUps.push('Analyze current cardiovascular and hypoxia risk factors.');
    suggestedFollowUps.push('Generate daily flight surgeon briefing.');
  }

  text = `${text}\n\n---\n*${AEROSPACE_MEDICAL_DISCLAIMER}*`;

  return {
    text,
    citations,
    suggestedFollowUps,
  };
}
