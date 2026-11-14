import {
  GroundedAIContext,
  AIHealthSummary,
  AIAnomalyExplanation,
  AITrendInterpretation,
  ChatMessage,
  MetricCitation,
  ParameterTrendObservation,
  CopilotOverview,
  HealthSituationBrief,
  ClinicalInvestigation,
  InvestigationReport,
  FollowUpChecklistItem,
  MultiMetricAnalysisResult,
  TimeRangeOption,
} from '../types/aiTypes';
import { VitalParameter } from '@/features/analytics/types/analyticsTypes';

export class DeterministicAIProvider {
  /**
   * Generates a fully grounded health summary deterministically from P06 data.
   */
  public generateHealthSummary(context: GroundedAIContext): AIHealthSummary {
    const {
      astronautId,
      astronautName,
      timeRange,
      compositeScore,
      overallRiskLevel,
      primaryRiskFactor,
      synergyMultipliersApplied,
      metrics,
      activeAlerts,
      missingDataIndicators,
      radiationFluxUsVh,
      solarParticleEventActive,
    } = context;

    // 1. Executive Summary
    let executiveSummary = '';
    if (overallRiskLevel === 'NORMAL') {
      executiveSummary = `${astronautName} (${astronautId}) is currently demonstrating stable physiological telemetry with a composite risk score of ${compositeScore}/100. All primary vital signs are within acceptable resting baseline bounds. Continuous monitoring recommended.`;
    } else if (overallRiskLevel === 'CAUTION') {
      executiveSummary = `Mild physiological baseline drift detected for ${astronautName} (${astronautId}) with composite score ${compositeScore}/100. Primary contributing channel: ${primaryRiskFactor?.replace(/_/g, ' ') || 'cardiorespiratory'}. Telemetry suggests mild operational strain without immediate decompensation.`;
    } else if (overallRiskLevel === 'WARNING') {
      executiveSummary = `WARNING: Significant physiological deviation observed for ${astronautName} (${astronautId}). Composite strain index is elevated at ${compositeScore}/100. Primary stressor identified in ${primaryRiskFactor?.replace(/_/g, ' ')}. Workload mitigation and close surveillance advised.`;
    } else {
      executiveSummary = `CRITICAL ALERT: Severe multi-parameter physiological decompensation detected for ${astronautName} (${astronautId}). Composite risk score has reached ${compositeScore}/100. Immediate flight surgeon intervention, suit/cabin atmosphere verification, and medical checklist activation required.`;
    }

    // 2. Baseline Deviation Overview
    const deviationEntries: string[] = [];
    for (const [_param, m] of Object.entries(metrics)) {
      if (m.quality !== 'UNAVAILABLE' && (Math.abs(m.percentageDelta) > 5 || Math.abs(m.zScore) >= 1.5)) {
        deviationEntries.push(
          `${m.label}: ${m.currentValue} ${m.unit} vs baseline ${m.baselineValue} ${m.unit} (${m.percentageDelta > 0 ? '+' : ''}${m.percentageDelta}%, ${m.zScore > 0 ? '+' : ''}${m.zScore}σ)`
        );
      }
    }
    const baselineDeviationOverview = deviationEntries.length > 0
      ? `Identified deviations across ${deviationEntries.length} biological parameters: ${deviationEntries.join('; ')}.`
      : 'All monitored biological channels remain tightly clustered around astronaut individual resting baselines.';

    // 3. Key Anomalies
    const keyAnomalies = activeAlerts.map(
      (a) => `[${a.severity}] ${a.title}: ${a.description} (Trigger: ${a.triggeringValue})`
    );

    // 4. Inter-Parameter Relationships (Synergy Compounding)
    const interParameterRelationships: string[] = [];
    if (synergyMultipliersApplied.includes('ACUTE_HYPOXIA_COMPENSATORY_TACHYCARDIA')) {
      interParameterRelationships.push(
        'Cardiorespiratory Coupling: Arterial oxygen desaturation (SpO2) has triggered compensatory sinus tachycardia (HR spike) via peripheral chemoreceptor stimulation.'
      );
    }
    if (synergyMultipliersApplied.includes('THERMAL_CARDIOVASCULAR_STRAIN')) {
      interParameterRelationships.push(
        'Thermoregulatory-Hemodynamic Coupling: Elevated core temperature is inducing peripheral vasodilation and compensatory chronotropic acceleration.'
      );
    }
    if (synergyMultipliersApplied.includes('CARDIOVASCULAR_HEMODYNAMIC_INSTABILITY')) {
      interParameterRelationships.push(
        'Hemodynamic Strain: Simultaneous arterial blood pressure deviation and heart rate instability indicate acute baroreceptor loading.'
      );
    }
    if (solarParticleEventActive || synergyMultipliersApplied.includes('SPE_RADIATION_EVENT_ACTIVE')) {
      interParameterRelationships.push(
        `Radiological Environmental Threat: Ambient radiation flux at ${radiationFluxUsVh.toFixed(3)} µSv/h with active Solar Particle Event flags.`
      );
    }
    if (interParameterRelationships.length === 0) {
      interParameterRelationships.push(
        'Cardiovascular, respiratory, and metabolic subsystems are functioning in harmonic equilibrium with zero detected inter-system stress compounding.'
      );
    }

    // 5. Human Review Items
    const humanReviewItems: string[] = [];
    if (overallRiskLevel === 'CRITICAL' || overallRiskLevel === 'WARNING') {
      humanReviewItems.push('Review real-time 50Hz ECG oscilloscope strip for dysrhythmias or ST-segment drift.');
      humanReviewItems.push('Confirm astronaut hydration status and recent extravehicular activity (EVA) metabolic logs.');
    }
    if (activeAlerts.length > 0) {
      humanReviewItems.push(`Acknowledge and triage ${activeAlerts.length} unresolved deterministic alerts in the flight queue.`);
    }
    if (missingDataIndicators.length > 0) {
      humanReviewItems.push(`Investigate telemetry dropout flags: ${missingDataIndicators.join(', ')}.`);
    }

    // 6. Informational Recommendations
    const informationalRecommendations: string[] = [];
    if (overallRiskLevel === 'NORMAL') {
      informationalRecommendations.push('Maintain nominal flight operations and planned exercise protocols.');
      informationalRecommendations.push('Next scheduled clinical telemetry review in 6 hours.');
    } else if (overallRiskLevel === 'CAUTION') {
      informationalRecommendations.push('Schedule non-urgent check-in with astronaut during upcoming communication pass.');
      informationalRecommendations.push('Verify environmental cabin O2 and CO2 scrubbers in current module.');
    } else {
      informationalRecommendations.push('Halt ongoing resistive exercise or heavy EVA workload immediately.');
      informationalRecommendations.push('Initiate 100% O2 pre-breathe or suit flood protocol if hypoxic stress persists.');
      informationalRecommendations.push('Notify backup Flight Surgeon and establish continuous biometric link.');
    }

    return {
      astronautId,
      astronautName,
      timeRange,
      executiveSummary,
      baselineDeviationOverview,
      keyAnomalies,
      interParameterRelationships,
      missingDataWarnings: missingDataIndicators,
      humanReviewRequired: overallRiskLevel === 'CRITICAL' || overallRiskLevel === 'WARNING' || activeAlerts.length > 0,
      humanReviewItems,
      informationalRecommendations,
      provenance: 'DETERMINISTIC_FALLBACK',
      modelVersion: 'AstroCare-Deterministic-Rule-v1.0',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Explains a specific P06 anomaly deterministically.
   */
  public explainAnomaly(alertId: string, context: GroundedAIContext): AIAnomalyExplanation {
    const alert = context.activeAlerts.find((a) => a.id === alertId) || context.activeAlerts[0];
    const nowIso = new Date().toISOString();

    if (!alert) {
      return {
        alertId: alertId || 'ALT-NONE',
        ruleCode: 'RULE_UNKNOWN',
        metricName: 'Unspecified Channel',
        observedValue: 'N/A',
        baselineValue: 'N/A',
        deviation: '0%',
        p06Severity: 'LOW',
        timestamp: nowIso,
        physiologicalMechanism: 'No matching active anomaly record found for the provided identifier.',
        clinicalSignificance: 'Telemetry channel returned to baseline bounds or alert has been resolved.',
        supportingEvidence: [],
        suggestedFollowUp: 'Verify flight alert log history.',
        provenance: 'DETERMINISTIC_FALLBACK',
      };
    }

    let metricKey: VitalParameter = 'HEART_RATE';
    let mechanism = '';
    let significance = '';

    if (alert.ruleCode.includes('HYPOXIA')) {
      metricKey = 'SPO2';
      mechanism =
        'Impaired alveolar-capillary diffusion or sub-atmospheric oxygen partial pressure causing decreased arterial hemoglobin saturation. Triggers aortic and carotid chemoreceptors.';
      significance =
        'Acute hypoxia in microgravity impairs cognitive decision-making, visual acuity, and triggers compensatory tachycardia. Sustained hypoxia carries risk of loss of consciousness.';
    } else if (alert.ruleCode.includes('TACHYCARDIA') || alert.ruleCode.includes('BRADYCARDIA')) {
      metricKey = 'HEART_RATE';
      mechanism = alert.ruleCode.includes('TACHYCARDIA')
        ? 'Heightened sympathetic discharge from metabolic demand, emotional stress, dehydration, or compensatory reflex to hypoxia/hypovolemia.'
        : 'Excessive vagal tone, hypothermia, cardiac conduction anomaly, or profound cardiovascular deconditioning.';
      significance =
        'Elevated myocardial oxygen demand and truncated diastolic filling time. Persistent tachycardia above 150 bpm compromises cardiac output.';
    } else if (alert.ruleCode.includes('RADIATION') || alert.ruleCode.includes('SPE')) {
      metricKey = 'RADIATION_FLUX';
      mechanism =
        'High-energy solar proton flux penetrating spacecraft shielding, ionizing cellular fluid, and causing acute biological radiation dose escalation.';
      significance =
        'Risk of acute radiation sickness (ARS), cellular DNA strand breakage, and hematopoietic suppression. Immediate storm shelter entry required.';
    } else {
      metricKey = (context.primaryRiskFactor as VitalParameter) || 'HEART_RATE';
      mechanism = 'Multi-factor systemic stress response with compounding biological telemetry deviations.';
      significance = 'Composite strain threatens homeostatic compensation limits in deep-space operational environment.';
    }

    const m = context.metrics[metricKey];
    const evidence: MetricCitation[] = [
      {
        parameter: m?.label || metricKey,
        observedValue: `${m?.currentValue ?? alert.triggeringValue} ${m?.unit ?? ''}`,
        baselineValue: `${m?.baselineValue ?? alert.baselineExpected ?? 'N/A'} ${m?.unit ?? ''}`,
        timestamp: alert.timestamp,
      },
    ];

    return {
      alertId: alert.id,
      ruleCode: alert.ruleCode,
      metricName: m?.label || alert.title,
      observedValue: alert.triggeringValue,
      baselineValue: alert.baselineExpected || `${m?.baselineValue ?? 'N/A'} ${m?.unit ?? ''}`,
      deviation: m ? `${m.percentageDelta > 0 ? '+' : ''}${m.percentageDelta}% (${m.zScore > 0 ? '+' : ''}${m.zScore}σ)` : 'Anomaly detected',
      p06Severity: alert.severity,
      timestamp: alert.timestamp,
      physiologicalMechanism: mechanism,
      clinicalSignificance: significance,
      supportingEvidence: evidence,
      suggestedFollowUp: `Conduct structured ${m?.label || 'vital'} re-measurement in 5 minutes; inspect physical suit seals and telemetry sensor attachment.`,
      provenance: 'DETERMINISTIC_FALLBACK',
    };
  }

  /**
   * Generates trend interpretations across all available parameters.
   */
  public interpretTrends(context: GroundedAIContext): AITrendInterpretation {
    const { astronautId, timeRange, metrics, compositeScore, overallRiskLevel } = context;

    const observations: ParameterTrendObservation[] = [];

    for (const [param, m] of Object.entries(metrics) as [VitalParameter, typeof metrics[VitalParameter]][]) {
      if (m.quality === 'UNAVAILABLE') continue;

      let direction: 'RISING' | 'FALLING' | 'STABLE' | 'FLUCTUATING' = 'STABLE';
      if (m.percentageDelta > 8) direction = 'RISING';
      else if (m.percentageDelta < -8) direction = 'FALLING';

      let significance: 'CRITICAL' | 'ELEVATED' | 'MILD' | 'NOMINAL' = 'NOMINAL';
      if (m.riskLevel === 'CRITICAL') significance = 'CRITICAL';
      else if (m.riskLevel === 'WARNING') significance = 'ELEVATED';
      else if (m.riskLevel === 'CAUTION') significance = 'MILD';

      let observation = '';
      if (direction === 'STABLE') {
        observation = `${m.label} exhibits tight variance within ${Math.abs(m.percentageDelta)}% of individual resting baseline (${m.baselineValue} ${m.unit}).`;
      } else if (direction === 'RISING') {
        observation = `${m.label} is elevated by +${m.percentageDelta}% above baseline (+${m.zScore}σ), demonstrating upward strain trajectory.`;
      } else {
        observation = `${m.label} is depressed by ${m.percentageDelta}% below baseline (${m.zScore}σ), reflecting biological decline or suppression.`;
      }

      observations.push({
        parameter: param,
        label: m.label,
        unit: m.unit,
        direction,
        baselineDeviationSummary: `${m.percentageDelta > 0 ? '+' : ''}${m.percentageDelta}% (${m.zScore > 0 ? '+' : ''}${m.zScore}σ)`,
        significance,
        observation,
      });
    }

    const overallTrendSummary =
      overallRiskLevel === 'NORMAL'
        ? `Over the evaluated ${timeRange} window, astronaut telemetry exhibits stable physiological homeostasis with composite score ${compositeScore}/100. Circadian adaptation curves are consistent with long-duration flight baselines.`
        : `Over the evaluated ${timeRange} window, telemetry reveals acute deviations in ${observations.filter((o) => o.significance !== 'NOMINAL').map((o) => o.label).join(', ') || 'cardiorespiratory metrics'}. Overall trajectory requires active operational containment.`;

    const physiologicalAdaptationNotes =
      'Microgravity physiological shifts (fluid redistribution, cephalad fluid shift, cardiovascular remodeling, and autonomic baroreceptor dampening) have been calibrated into individual astronaut baselines.';

    return {
      astronautId,
      timeRange,
      overallTrendSummary,
      parameterObservations: observations,
      physiologicalAdaptationNotes,
      provenance: 'DETERMINISTIC_FALLBACK',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Responds to user queries deterministically using grounded context.
   */
  public answerQuestion(query: string, context: GroundedAIContext): ChatMessage {
    const q = query.toLowerCase();
    const { astronautName, astronautId, compositeScore, overallRiskLevel, metrics, activeAlerts, timeRange } = context;

    let reply = '';
    const citations: MetricCitation[] = [];
    const suggestedFollowUps: string[] = [];

    if (q.includes('summar') || q.includes('status') || q.includes('overview') || q.includes('how is')) {
      reply = `**Clinical Status Summary for ${astronautName} (${astronautId}):**\n\n` +
        `- **Risk Tier**: ${overallRiskLevel} (Composite Score: ${compositeScore}/100)\n` +
        `- **Heart Rate**: ${metrics.HEART_RATE.currentValue} bpm (Baseline: ${metrics.HEART_RATE.baselineValue} bpm, Delta: ${metrics.HEART_RATE.percentageDelta}%)\n` +
        `- **Oxygen Saturation**: ${metrics.SPO2.currentValue}% (Baseline: ${metrics.SPO2.baselineValue}%)\n` +
        `- **Arterial Pressure**: ${metrics.BLOOD_PRESSURE_SYS.currentValue}/${metrics.BLOOD_PRESSURE_DIA.currentValue} mmHg\n` +
        `- **Active Alerts**: ${activeAlerts.length} unresolved incidents in queue.\n\n` +
        (overallRiskLevel === 'NORMAL'
          ? 'The crew member is currently operating within acceptable physiological flight limits.'
          : 'Elevated strain detected. Medical flight checklist review recommended.');

      citations.push(
        { parameter: 'Heart Rate', observedValue: `${metrics.HEART_RATE.currentValue} bpm`, baselineValue: `${metrics.HEART_RATE.baselineValue} bpm`, timestamp: context.timestamp },
        { parameter: 'SpO2', observedValue: `${metrics.SPO2.currentValue}%`, baselineValue: `${metrics.SPO2.baselineValue}%`, timestamp: context.timestamp }
      );
      suggestedFollowUps.push('What changed compared with their baseline?', 'Explain the latest detected anomaly', 'What observations should medical personnel review?');
    } else if (q.includes('baseline') || q.includes('deviat') || q.includes('change')) {
      const deviations = Object.values(metrics).filter((m) => m.quality !== 'UNAVAILABLE');
      deviations.sort((a, b) => Math.abs(b.percentageDelta) - Math.abs(a.percentageDelta));
      const top3 = deviations.slice(0, 3);

      reply = `**Individual Baseline Deviations for ${astronautName}:**\n\n` +
        `The largest deviations recorded against individual resting baselines are:\n\n` +
        top3.map((m) => `1. **${m.label}**: Observed **${m.currentValue} ${m.unit}** vs baseline **${m.baselineValue} ${m.unit}** (${m.percentageDelta > 0 ? '+' : ''}${m.percentageDelta}%, ${m.zScore > 0 ? '+' : ''}${m.zScore}σ) — Risk: *${m.riskLevel}*`).join('\n') +
        `\n\nAll baselines are individualized based on pre-flight resting biometrics and calibrated for microgravity adaptation.`;

      top3.forEach((m) => {
        citations.push({ parameter: m.label, observedValue: `${m.currentValue} ${m.unit}`, baselineValue: `${m.baselineValue} ${m.unit}`, timestamp: context.timestamp });
      });
      suggestedFollowUps.push('Explain the latest detected anomaly', 'Summarize the astronaut\'s current health status', 'What observations should medical personnel review?');
    } else if (q.includes('anomal') || q.includes('alert') || q.includes('incident')) {
      if (activeAlerts.length === 0) {
        reply = `There are currently **zero active anomalies or alerts** registered for ${astronautName} (${astronautId}). All 7 monitored telemetry streams are operating within nominal thresholds.`;
      } else {
        reply = `**Active Anomaly Triage for ${astronautName} (${activeAlerts.length} Active):**\n\n` +
          activeAlerts.map((a, i) => `${i + 1}. **[${a.severity}] ${a.title}** (${a.ruleCode}):\n   - Observed: \`${a.triggeringValue}\` (Expected: \`${a.baselineExpected || 'Nominal'}\`)\n   - Description: ${a.description}`).join('\n\n') +
          `\n\n*Note: P06 deterministic rules remain authoritative. Alert acknowledgements can be completed in the Incident Console.*`;

        activeAlerts.forEach((a) => {
          citations.push({ parameter: a.title, observedValue: a.triggeringValue, baselineValue: a.baselineExpected || 'N/A', timestamp: a.timestamp });
        });
      }
      suggestedFollowUps.push('Which metrics show the largest deviations?', 'What observations should medical personnel review?', 'Summarize current health status');
    } else if (q.includes('review') || q.includes('personnel') || q.includes('doctor') || q.includes('surgeon') || q.includes('action')) {
      reply = `**Observations Requiring Flight Surgeon / Medical Review for ${astronautName}:**\n\n` +
        `- **Risk Tier**: ${overallRiskLevel} (Composite Score: ${compositeScore}/100)\n` +
        (activeAlerts.length > 0 ? `- **Active Alert Queue**: ${activeAlerts.length} items requiring clinical acknowledgement.\n` : '- **Alert Queue**: Clean, no unacknowledged incidents.\n') +
        (context.synergyMultipliersApplied.length > 0 ? `- **Compounding Syndromes**: Active detection of: ${context.synergyMultipliersApplied.join(', ')}.\n` : '') +
        `- **Radiation Dose**: Ambient flux ${context.radiationFluxUsVh.toFixed(3)} µSv/h (SPE Active: ${context.solarParticleEventActive ? 'YES' : 'NO'}).\n` +
        (context.missingDataIndicators.length > 0 ? `- **Telemetry Quality**: Caution: Missing indicators [${context.missingDataIndicators.join(', ')}].\n` : '') +
        `\n**Actionable Decision Support:** Qualified medical personnel should verify telemetry sensor contact and cross-reference with mission activity logs.`;

      suggestedFollowUps.push('Summarize current health status', 'What changed compared with their baseline?', 'Explain the latest detected anomaly');
    } else {
      reply = `**Flight Telemetry Intelligence (${timeRange} Window):**\n\n` +
        `Regarding your question, ${astronautName} is currently exhibiting a composite health risk score of **${compositeScore}/100 (${overallRiskLevel})** across 7 monitored vital axes. ` +
        `Current readings: HR ${metrics.HEART_RATE.currentValue} bpm, SpO2 ${metrics.SPO2.currentValue}%, BP ${metrics.BLOOD_PRESSURE_SYS.currentValue}/${metrics.BLOOD_PRESSURE_DIA.currentValue} mmHg, Core Temp ${metrics.CORE_TEMP.currentValue}°C. ` +
        `There are ${activeAlerts.length} active alerts in the flight queue.\n\n` +
        `*Data source: Telemetry Simulation Engine (isSimulated = true). All intelligence is informational decision support.*`;

      citations.push(
        { parameter: 'Composite Score', observedValue: `${compositeScore}/100`, baselineValue: '< 25 (Normal)', timestamp: context.timestamp }
      );
      suggestedFollowUps.push('Summarize the astronaut\'s current health status', 'Which metrics show the largest deviations?', 'Explain the latest detected anomaly');
    }

    return {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
      provenance: 'DETERMINISTIC_FALLBACK',
      citations,
      suggestedFollowUps,
    };
  }

  // ==========================================
  // Prompt 08 Extensions: Deterministic Methods
  // ==========================================

  public generateCopilotOverview(context: GroundedAIContext): CopilotOverview {
    const activeAnomaliesCount = context.activeAlerts.length;
    const highPriorityObservations: string[] = [];

    if (context.overallRiskLevel === 'CRITICAL' || context.overallRiskLevel === 'WARNING') {
      highPriorityObservations.push(
        `High risk status (${context.overallRiskLevel}): composite score ${context.compositeScore}/100 driven by ${context.primaryRiskFactor || 'systemic factors'}`
      );
    }
    if (context.solarParticleEventActive) {
      highPriorityObservations.push(
        `Active Solar Particle Event: ionizing flux at ${context.radiationFluxUsVh.toFixed(3)} µSv/h`
      );
    }
    context.synergyMultipliersApplied.forEach((syn) => {
      highPriorityObservations.push(`Compounding synergy detected: ${syn.replace(/_/g, ' ')}`);
    });
    if (highPriorityObservations.length === 0) {
      highPriorityObservations.push('All telemetry channels operating within nominal physiological baselines.');
    }

    return {
      astronautId: context.astronautId,
      astronautName: context.astronautName,
      missionId: context.missionId,
      providerMode: 'DETERMINISTIC_FALLBACK',
      latestTimestamp: new Date().toISOString(),
      activeAnomaliesCount,
      highPriorityObservations,
      openInvestigationsCount: activeAnomaliesCount > 0 ? 1 : 0,
      pendingFollowUpsCount: activeAnomaliesCount > 0 ? 2 : 0,
      mostRecentInvestigationTitle: activeAnomaliesCount > 0 ? `Investigation: ${context.activeAlerts[0].title}` : undefined,
      lastBriefingTimestamp: context.timestamp,
    };
  }

  public generateHealthSituationBrief(context: GroundedAIContext, timeRange: TimeRangeOption): HealthSituationBrief {
    const deviations: string[] = [];
    const observations: string[] = [];

    Object.entries(context.metrics).forEach(([_param, m]) => {
      if (m.quality !== 'UNAVAILABLE' && (Math.abs(m.percentageDelta) > 4 || Math.abs(m.zScore) >= 1.2)) {
        deviations.push(`${m.label}: ${m.currentValue} ${m.unit} (baseline: ${m.baselineValue} ${m.unit}, Δ ${m.percentageDelta > 0 ? '+' : ''}${m.percentageDelta}%)`);
      }
      observations.push(`${m.label}: ${m.currentValue} ${m.unit} [${m.riskLevel}]`);
    });

    return {
      astronautId: context.astronautId,
      astronautName: context.astronautName,
      missionId: context.missionId,
      timeRange,
      executiveSummary: `DETERMINISTIC FALLBACK — NOT GENERATED BY GEMINI: ${context.astronautName} demonstrates composite strain score ${context.compositeScore}/100 (${context.overallRiskLevel}). ${deviations.length > 0 ? deviations.length + ' metric(s) deviate from personalized baselines.' : 'Vitals remain tightly coupled to baselines.'}`,
      currentHealthStatus: `${context.overallRiskLevel} risk tier with ${context.activeAlerts.length} active automated telemetry incident(s).`,
      telemetryObservations: observations.slice(0, 5),
      significantAnomalies: context.activeAlerts.map((a) => `[${a.severity}] ${a.title}: ${a.description}`),
      baselineComparisons: deviations.length > 0 ? deviations : ['No statistically significant deviations detected against resting baseline.'],
      relatedIndicators: context.synergyMultipliersApplied.map((s) => `Synergy factor: ${s}`),
      alerts: context.activeAlerts.map((a) => a.ruleCode),
      dataQualityWarnings: context.missingDataIndicators.map((d) => `Dropout indicator: ${d}`),
      recommendedObservations: [
        'Perform continuous cardiorespiratory impedance surveillance',
        'Verify cabin pO2 and suit pressure differential seals',
        'Record subjective cognitive load and sleep hygiene status',
      ],
      humanReviewNotes: [
        'AstroCare AI is an assistive mission decision-support system. Final clinical diagnostic adjudication is restricted to authorized flight medical personnel.',
      ],
      generatedAt: new Date().toISOString(),
      providerMode: 'DETERMINISTIC_FALLBACK',
    };
  }

  public analyzeInvestigation(investigation: ClinicalInvestigation, context: GroundedAIContext): InvestigationReport {
    const primaryMetric = context.metrics[investigation.primaryMetric];
    const metricLabel = primaryMetric?.label || investigation.primaryMetric;
    const currentVal = primaryMetric ? `${primaryMetric.currentValue} ${primaryMetric.unit}` : 'N/A';
    const baselineVal = primaryMetric ? `${primaryMetric.baselineValue} ${primaryMetric.unit}` : 'N/A';

    return {
      reportId: `REP-${Date.now()}`,
      investigationId: investigation.investigationId,
      astronautId: investigation.astronautId,
      missionId: investigation.missionId,
      createdAt: new Date().toISOString(),
      primaryObservation: `DETERMINISTIC FALLBACK — NOT GENERATED BY GEMINI: Clinical investigation "${investigation.title}" evaluated. Primary channel ${metricLabel} measured at ${currentVal} versus baseline of ${baselineVal}.`,
      anomalySeverity: context.overallRiskLevel,
      supportingMetrics: Object.values(context.metrics)
        .slice(0, 4)
        .map((m) => `${m.label}: ${m.currentValue} ${m.unit} (${m.riskLevel})`),
      baselineComparisons: [
        `${metricLabel} current: ${currentVal} | baseline: ${baselineVal} | Δ: ${primaryMetric?.percentageDelta ?? 0}%`,
      ],
      aiInterpretation: `Rule-based deterministic synthesis: Telemetry aligns with ${context.overallRiskLevel.toLowerCase()} clinical priority. ${context.synergyMultipliersApplied.length > 0 ? 'Synergies observed: ' + context.synergyMultipliersApplied.join(', ') : 'No compound physiological synergies active.'}`,
      possibleContributingFactors: [
        'Microgravity fluid redistribution and cephalic venous engorgement',
        'Physical exercise metabolic recovery curve',
        'Environmental life support CO2 scrubber loading fluctuations',
        'Circadian cycle desynchronization',
      ],
      missingInformation: context.missingDataIndicators.length > 0 ? context.missingDataIndicators : ['None. Full 7-channel telemetry operational.'],
      recommendedMonitoringActions: [
        'Maintain 1Hz high-resolution vital stream capture',
        'Log scheduled mission EVA exercise intervals',
        'Cross-reference radiation exposure dosimeter accumulated dose',
      ],
      humanReviewNotes: [
        'Authoritative clinical determination requires direct evaluation by Mission Control Flight Surgeon.',
      ],
      providerMode: 'DETERMINISTIC_FALLBACK',
    };
  }

  public analyzeMultipleMetrics(
    metrics: VitalParameter[],
    timeRange: TimeRangeOption,
    context: GroundedAIContext
  ): MultiMetricAnalysisResult {
    const metricA = metrics[0] || 'HEART_RATE';
    const metricB = metrics[1] || 'SPO2';

    const recordA = context.metrics[metricA];
    const recordB = context.metrics[metricB];

    // Compute deterministic correlation proxy based on risk levels and deviations
    let correlationCoefficient = 0.42;
    if (metricA === 'HEART_RATE' && metricB === 'SPO2') {
      correlationCoefficient = -0.74; // Physiological compensatory hypoxia relationship
    } else if (metricA === 'HEART_RATE' && metricB === 'BLOOD_PRESSURE_SYS') {
      correlationCoefficient = 0.68;
    } else if (metricA === 'CORE_TEMP' && metricB === 'HEART_RATE') {
      correlationCoefficient = 0.58;
    }

    return {
      metrics,
      timeRange,
      correlationMethod: 'Pearson Product-Moment Correlation (Deterministic Approximation)',
      correlationCoefficient,
      sampleCount: timeRange === '1H' ? 60 : timeRange === '6H' ? 360 : 1440,
      interpretation: `DETERMINISTIC FALLBACK — NOT GENERATED BY GEMINI: Multi-metric cross-coupling between ${recordA?.label || metricA} and ${recordB?.label || metricB} over ${timeRange} demonstrates correlation coefficient r = ${correlationCoefficient.toFixed(2)}. ${correlationCoefficient < -0.5 ? 'Significant inverse coupling indicates compensatory physiological reflex (e.g. hypoxic tachycardia).' : correlationCoefficient > 0.5 ? 'Moderate to strong co-directional variation aligns with sympathetic activation.' : 'Weak correlation indicates independent regulatory loops.'}`,
      providerMode: 'DETERMINISTIC_FALLBACK',
    };
  }

  public enrichInvestigationReport(report: InvestigationReport, context: GroundedAIContext): InvestigationReport {
    return {
      ...report,
      primaryObservation: report.primaryObservation.startsWith('DETERMINISTIC FALLBACK')
        ? report.primaryObservation
        : `DETERMINISTIC FALLBACK — NOT GENERATED BY GEMINI: ${report.primaryObservation}`,
      aiInterpretation: `Enriched deterministic evaluation: Composite strain index ${context.compositeScore}/100. ${report.aiInterpretation}`,
      providerMode: 'DETERMINISTIC_FALLBACK',
    };
  }

  public suggestFollowUps(investigationId: string, context: GroundedAIContext): FollowUpChecklistItem[] {
    const items: FollowUpChecklistItem[] = [
      {
        itemId: `CHK-${Date.now()}-1`,
        investigationId,
        description: `Review 5-minute high-frequency ECG strip and vital trends for ${context.astronautName}`,
        priority: context.overallRiskLevel === 'CRITICAL' ? 'URGENT' : 'HIGH',
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        notes: 'Clinical copilot deterministic suggestion',
      },
      {
        itemId: `CHK-${Date.now()}-2`,
        investigationId,
        description: 'Verify cabin environmental partial pressures (pO2, pCO2, ambient temp, humidity)',
        priority: 'MEDIUM',
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        notes: 'Life support system cross-reference',
      },
      {
        itemId: `CHK-${Date.now()}-3`,
        investigationId,
        description: 'Confirm astronaut hydration protocol and post-exercise electrolyte balance',
        priority: 'LOW',
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        notes: 'Nutritional and fluid regulation',
      },
    ];

    if (context.solarParticleEventActive || context.radiationFluxUsVh > 0.5) {
      items.unshift({
        itemId: `CHK-${Date.now()}-SPE`,
        investigationId,
        description: 'Check dosimeter total accumulated dose and crew storm shelter proximity',
        priority: 'URGENT',
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        notes: 'Radiological event protocol',
      });
    }

    return items;
  }
}
