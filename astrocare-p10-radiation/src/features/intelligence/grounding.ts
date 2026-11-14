/**
 * ASTROCARE EVIDENCE GROUNDING PIPELINE
 * Compiles structured baseline, telemetry, risk assessment, and active alert
 * data into deterministic evidence context documents for Gemini synthesis.
 */

import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { HealthAlert } from '@/types/database.types';
import {
  AstronautBaselineProfile,
  CompositeRiskAssessment,
  ParameterDeviation,
} from '@/features/analytics/types';
import { AICitation, GroundedContextDocument } from './types';

/**
 * Compiles real-time telemetry, baselines, and risk evaluations into a grounded context document.
 */
export function compileGroundedContext(
  baseline: AstronautBaselineProfile,
  vitals: VitalSignsPacket | null,
  _radiation: RadiationPacket | null,
  deviations: Record<string, ParameterDeviation>,
  riskAssessment: CompositeRiskAssessment,
  alerts: HealthAlert[]
): GroundedContextDocument {
  const currentTelemetry: GroundedContextDocument['currentTelemetry'] = {};

  Object.values(deviations).forEach((d) => {
    currentTelemetry[d.parameter] = {
      value: d.currentValue,
      unit: d.unit,
      delta: d.delta,
      zScore: d.zScore,
      status: d.riskLevel,
    };
  });

  const activeAlerts = alerts
    .filter((a) => a.status === 'ACTIVE')
    .map((a) => ({
      code: a.rule_code,
      title: a.title,
      severity: a.severity,
      triggeringValue: a.triggering_value,
    }));

  const subsystems: GroundedContextDocument['deterministicRisk']['subsystems'] = {};
  Object.values(riskAssessment.subsystems).forEach((sub) => {
    subsystems[sub.category] = {
      score: sub.score,
      level: sub.level,
      primary: sub.primaryParameter,
    };
  });

  return {
    astronautId: baseline.astronautId,
    callsign: baseline.callsign,
    fullName: baseline.fullName,
    missionCode: vitals?.missionId || 'm-ares-06',
    timestamp: vitals?.timestamp || new Date().toISOString(),
    baselineSummary: `Resting HR: ${baseline.restingHr} bpm, SpO2: ${baseline.spo2}%, Arterial BP: ${baseline.bpSystolic}/${baseline.bpDiastolic} mmHg, RR: ${baseline.respiratoryRate} rpm, Temp: ${baseline.coreTemp}°C, Background Flux: ${baseline.radiationFlux} uSv/h`,
    currentTelemetry,
    deterministicRisk: {
      compositeScore: riskAssessment.compositeScore,
      riskLevel: riskAssessment.riskLevel,
      subsystems,
      activeSynergies: riskAssessment.activeSynergies,
      directive: riskAssessment.recommendation,
    },
    activeAlerts,
    provenanceDeclaration:
      'All metrics are sourced directly from verified telemetry packets and authoritative Layer 4 deterministic risk calculations. No speculative metrics.',
  };
}

/**
 * Extracts verifiable citations from a grounded context document.
 */
export function extractCitations(context: GroundedContextDocument): AICitation[] {
  const citations: AICitation[] = [];
  const ts = context.timestamp;

  // 1. Vital citations
  Object.entries(context.currentTelemetry).forEach(([param, data]) => {
    citations.push({
      source: 'LIVE_TELEMETRY_STREAM',
      metric: param,
      value: `${data.value} ${data.unit} (Δ: ${data.delta > 0 ? '+' : ''}${data.delta}, ${data.zScore}σ)`,
      timestamp: ts,
    });
  });

  // 2. Risk score citations
  citations.push({
    source: 'LAYER_4_RISK_ENGINE',
    metric: 'COMPOSITE_RISK_SCORE',
    value: `${context.deterministicRisk.compositeScore}/100 (${context.deterministicRisk.riskLevel})`,
    timestamp: ts,
  });

  // 3. Active alert citations
  context.activeAlerts.forEach((alt) => {
    citations.push({
      source: 'DETERMINISTIC_ALERT_ENGINE',
      metric: alt.code,
      value: `${alt.severity} - ${alt.title} (${alt.triggeringValue})`,
      timestamp: ts,
    });
  });

  return citations;
}

/**
 * Formats the grounded context into markdown text suitable for LLM context injection.
 */
export function formatGroundedContextForPrompt(context: GroundedContextDocument): string {
  const vitalsLines = Object.entries(context.currentTelemetry)
    .map(
      ([param, d]) =>
        `- **${param}**: ${d.value} ${d.unit} (Baseline Δ: ${d.delta > 0 ? '+' : ''}${d.delta}, ${d.zScore}σ, Status: ${d.status})`
    )
    .join('\n');

  const alertLines =
    context.activeAlerts.length > 0
      ? context.activeAlerts
          .map((a) => `- [${a.severity}] **${a.code}**: ${a.title} (Trigger: ${a.triggeringValue})`)
          .join('\n')
      : '- [NOMINAL] No active critical or warning alerts in triage queue.';

  const synergyLines =
    context.deterministicRisk.activeSynergies.length > 0
      ? context.deterministicRisk.activeSynergies.map((s) => `- ⚠️ ${s}`).join('\n')
      : '- None detected.';

  return `
=== VERIFIED GROUND TRUTH DOSSIER ===
**Subject:** ${context.callsign} (${context.fullName}) [ID: ${context.astronautId}]
**Mission:** ${context.missionCode} | **Timestamp:** ${context.timestamp}

### 1. Personal Resting Baseline Profile
${context.baselineSummary}

### 2. Current Telemetry Readings & Invariant Checks
${vitalsLines}

### 3. Layer 4 Deterministic Risk Assessment
- **Composite Score:** ${context.deterministicRisk.compositeScore}/100 (**${context.deterministicRisk.riskLevel}**)
- **Subsystem Breakdown:**
  * Cardiovascular: ${context.deterministicRisk.subsystems.CARDIOVASCULAR?.score ?? 0}/100 (${context.deterministicRisk.subsystems.CARDIOVASCULAR?.level ?? 'NORMAL'})
  * Pulmonary & Hypoxia: ${context.deterministicRisk.subsystems.RESPIRATORY?.score ?? 0}/100 (${context.deterministicRisk.subsystems.RESPIRATORY?.level ?? 'NORMAL'})
  * Radiation & Space Weather: ${context.deterministicRisk.subsystems.RADIATION?.score ?? 0}/100 (${context.deterministicRisk.subsystems.RADIATION?.level ?? 'NORMAL'})
  * Thermoregulation: ${context.deterministicRisk.subsystems.METABOLIC_THERMAL?.score ?? 0}/100 (${context.deterministicRisk.subsystems.METABOLIC_THERMAL?.level ?? 'NORMAL'})
- **Active Compounding Synergies:**
${synergyLines}
- **Authoritative Operational Directive:**
${context.deterministicRisk.directive}

### 4. Active Rule-Based Alerts (Authoritative)
${alertLines}
======================================
`;
}
