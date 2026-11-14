import { AIContextBuilder } from '../features/ai/services/aiContextBuilder';
import { DeterministicAIProvider } from '../features/ai/services/deterministicAIProvider';
import { GeminiAIProvider } from '../features/ai/services/geminiAIProvider';
import { AIOrchestrator } from '../features/ai/services/aiOrchestrator';
import { CompositeHealthAssessment } from '../features/analytics/types/analyticsTypes';
import { Astronaut, HealthAlert } from '../types/database.types';
import { VitalSignsPacket } from '../types/telemetry';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Mock Test Fixtures
const MOCK_ASTRONAUT: Astronaut = {
  id: 'ASTRO-01',
  profile_id: 'prof-01',
  badge_number: 'NASA-9842',
  date_of_birth: '1984-06-12',
  blood_type: 'O_POS',
  height_cm: 182,
  baseline_mass_kg: 78.5,
  baseline_resting_hr: 64,
  baseline_bp_systolic: 114,
  baseline_bp_diastolic: 74,
  baseline_spo2: 98,
  emergency_contact: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  profile: {
    id: 'prof-01',
    full_name: 'Commander Marcus Chen',
    callsign: 'ARES-LEAD',
    role: 'ASTRONAUT',
    avatar_url: '/avatars/chen.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const MOCK_ASSESSMENT: CompositeHealthAssessment = {
  astronautId: 'ASTRO-01',
  timestamp: new Date().toISOString(),
  compositeScore: 76,
  overallRiskLevel: 'CRITICAL',
  primaryRiskFactor: 'SPO2',
  synergyMultipliersApplied: ['ACUTE_HYPOXIA_COMPENSATORY_TACHYCARDIA'],
  parameterRisks: {} as any,
  baselineComparisons: {
    HEART_RATE: {
      parameter: 'HEART_RATE',
      label: 'Heart Rate',
      unit: 'bpm',
      currentValue: 142,
      baselineValue: 64,
      absoluteDelta: 78,
      percentageDelta: 121.88,
      zScore: 13.0,
      riskLevel: 'WARNING',
      riskScore: 75,
      qualityStatus: 'NOMINAL',
      statusDescription: 'Elevated tachycardia',
    },
    SPO2: {
      parameter: 'SPO2',
      label: 'Oxygen Saturation',
      unit: '%',
      currentValue: 85,
      baselineValue: 98,
      absoluteDelta: -13,
      percentageDelta: -13.27,
      zScore: -13.0,
      riskLevel: 'CRITICAL',
      riskScore: 88,
      qualityStatus: 'DEGRADED_SIGNAL',
      statusDescription: 'Critical hypoxia',
    },
    BLOOD_PRESSURE_SYS: {
      parameter: 'BLOOD_PRESSURE_SYS',
      label: 'Systolic Arterial Pressure',
      unit: 'mmHg',
      currentValue: 130,
      baselineValue: 114,
      absoluteDelta: 16,
      percentageDelta: 14.04,
      zScore: 2.29,
      riskLevel: 'CAUTION',
      riskScore: 37,
      qualityStatus: 'NOMINAL',
      statusDescription: 'Mild elevation',
    },
    BLOOD_PRESSURE_DIA: {
      parameter: 'BLOOD_PRESSURE_DIA',
      label: 'Diastolic Arterial Pressure',
      unit: 'mmHg',
      currentValue: 82,
      baselineValue: 74,
      absoluteDelta: 8,
      percentageDelta: 10.81,
      zScore: 1.6,
      riskLevel: 'NORMAL',
      riskScore: 12,
      qualityStatus: 'NOMINAL',
      statusDescription: 'Nominal',
    },
    CORE_TEMP: {
      parameter: 'CORE_TEMP',
      label: 'Core Body Temperature',
      unit: '°C',
      currentValue: 36.9,
      baselineValue: 36.8,
      absoluteDelta: 0.1,
      percentageDelta: 0.27,
      zScore: 0.4,
      riskLevel: 'NORMAL',
      riskScore: 3,
      qualityStatus: 'NOMINAL',
      statusDescription: 'Nominal',
    },
    RESPIRATORY_RATE: {
      parameter: 'RESPIRATORY_RATE',
      label: 'Respiratory Rate',
      unit: 'rpm',
      currentValue: 28,
      baselineValue: 14,
      absoluteDelta: 14,
      percentageDelta: 100.0,
      zScore: 9.33,
      riskLevel: 'WARNING',
      riskScore: 68,
      qualityStatus: 'NOMINAL',
      statusDescription: 'Tachypnea',
    },
    RADIATION_FLUX: {
      parameter: 'RADIATION_FLUX',
      label: 'Ambient Radiation Flux',
      unit: 'uSv/h',
      currentValue: 0.052,
      baselineValue: 0.052,
      absoluteDelta: 0,
      percentageDelta: 0,
      zScore: 0,
      riskLevel: 'NORMAL',
      riskScore: 0,
      qualityStatus: 'NOMINAL',
      statusDescription: 'Nominal background',
    },
  },
  recommendedAction: 'Emergency oxygen flood and suit check required.',
};

const MOCK_VITALS: VitalSignsPacket = {
  packetId: '123e4567-e89b-12d3-a456-426614174000',
  missionId: 'm-ares-06',
  astronautId: 'ASTRO-01',
  timestamp: new Date().toISOString(),
  vitals: {
    heartRate: { value: 142, unit: 'bpm', quality: 'NOMINAL' },
    bloodPressure: { systolic: 130, diastolic: 82, unit: 'mmHg', quality: 'NOMINAL' },
    spo2: { value: 85, unit: '%', quality: 'DEGRADED_SIGNAL' },
    coreTemp: { value: 36.9, unit: '°C', quality: 'NOMINAL' },
    respiratoryRate: { value: 28, unit: 'rpm', quality: 'NOMINAL' },
  },
  dataSource: 'SIMULATOR',
  isSimulated: true,
};

const MOCK_ALERT: HealthAlert = {
  id: 'alt-test-hypoxia',
  mission_id: 'm-ares-06',
  astronaut_id: 'ASTRO-01',
  timestamp: new Date().toISOString(),
  rule_code: 'RULE_HYPOXIA_CRITICAL',
  severity: 'CRITICAL',
  status: 'ACTIVE',
  title: 'Critical Hypoxia Detected',
  description: 'SpO2 collapsed to 85% vs baseline 98%.',
  triggering_value: '85 %',
  baseline_expected: '98 %',
  created_at: new Date().toISOString(),
};

export async function runAIIntelligenceTests(): Promise<{ total: number; passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  function runTest(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  async function runAsyncTest(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  console.log('\n============================================================');
  console.log('RUNNING ASTROCARE AI HEALTH INTELLIGENCE (P07) TEST SUITE');
  console.log('============================================================\n');

  // 1. AI Context Builder Tests
  console.log('[1/8] Testing Grounded AI Context Builder...');
  runTest('Constructs valid context from telemetry and assessment', () => {
    const ctx = AIContextBuilder.buildContext(MOCK_ASTRONAUT, MOCK_ASSESSMENT, MOCK_VITALS, null, [MOCK_ALERT], '24H');
    assert(ctx.astronautId === 'ASTRO-01', 'Includes astronaut ID');
    assert(ctx.astronautName === 'Commander Marcus Chen', 'Resolves astronaut full name from profile');
    assert(ctx.compositeScore === 76, 'Carries P06 composite score');
    assert(ctx.overallRiskLevel === 'CRITICAL', 'Carries P06 risk level');
    assert(ctx.isSimulatedSource === true, 'Enforces simulated provenance flag');
    assert(ctx.activeAlerts.length === 1, 'Includes active alert');
    assert(ctx.activeAlerts[0].ruleCode === 'RULE_HYPOXIA_CRITICAL', 'Matches alert rule code');
  });

  runTest('Handles missing telemetry data with explicit dropout flags', () => {
    const ctx = AIContextBuilder.buildContext(null, null, null, null, [], '1H');
    assert(ctx.missingDataIndicators.includes('ASTRONAUT_PROFILE_UNRESOLVED'), 'Flags missing astronaut');
    assert(ctx.missingDataIndicators.includes('VITAL_TELEMETRY_STREAM_OFFLINE'), 'Flags missing vitals');
    assert(ctx.missingDataIndicators.includes('HEALTH_RISK_ASSESSMENT_PENDING'), 'Flags missing assessment');
    assert(ctx.compositeScore === 0, 'Defaults composite score safely to 0');
  });

  // 2. Deterministic AI Provider Tests
  console.log('\n[2/8] Testing Deterministic AI Fallback Provider...');
  const fallbackProvider = new DeterministicAIProvider();
  const validContext = AIContextBuilder.buildContext(MOCK_ASTRONAUT, MOCK_ASSESSMENT, MOCK_VITALS, null, [MOCK_ALERT], '24H');

  runTest('Generates comprehensive grounded health summary', () => {
    const summary = fallbackProvider.generateHealthSummary(validContext);
    assert(summary.astronautId === 'ASTRO-01', 'Matches astronaut ID');
    assert(summary.provenance === 'DETERMINISTIC_FALLBACK', 'Flags fallback provenance');
    assert(summary.executiveSummary.includes('CRITICAL ALERT'), 'Reflects critical risk in executive summary');
    assert(summary.humanReviewRequired === true, 'Requires human review for critical status');
    assert(summary.interParameterRelationships.length > 0, 'Includes cardiorespiratory synergy observation');
    assert(summary.informationalRecommendations.length > 0, 'Includes actionable recommendations');
  });

  runTest('Explains P06 anomaly without changing severity', () => {
    const explanation = fallbackProvider.explainAnomaly(MOCK_ALERT.id, validContext);
    assert(explanation.alertId === MOCK_ALERT.id, 'Matches alert ID');
    assert(explanation.p06Severity === 'CRITICAL', 'Strictly preserves P06 severity');
    assert(explanation.physiologicalMechanism.includes('arterial hemoglobin saturation'), 'Includes mechanism');
    assert(explanation.supportingEvidence.length > 0, 'Includes evidence citations');
    assert(explanation.suggestedFollowUp.length > 0, 'Includes suggested follow-up');
    assert(explanation.provenance === 'DETERMINISTIC_FALLBACK', 'Flags fallback provenance');
  });

  runTest('Interprets multi-axis physiological trends', () => {
    const trends = fallbackProvider.interpretTrends(validContext);
    assert(trends.astronautId === 'ASTRO-01', 'Matches astronaut ID');
    assert(trends.parameterObservations.length > 0, 'Observations generated for parameters');
    const hrObs = trends.parameterObservations.find((o) => o.parameter === 'HEART_RATE');
    assert(hrObs !== undefined, 'HR observation exists');
    assert(hrObs?.direction === 'RISING', 'HR trajectory classified as RISING');
    assert(hrObs?.significance === 'ELEVATED', 'HR significance reflects elevated strain');
  });

  runTest('Answers clinical query with grounded telemetry citations', () => {
    const reply = fallbackProvider.answerQuestion('Summarize the astronaut current health status', validContext);
    assert(reply.role === 'assistant', 'Reply is from assistant');
    assert(reply.content.includes('Commander Marcus Chen'), 'Reply cites astronaut');
    assert(reply.citations !== undefined && reply.citations.length > 0, 'Reply contains citations');
    assert(reply.suggestedFollowUps !== undefined && reply.suggestedFollowUps.length > 0, 'Reply contains shortcuts');
  });

  // 3. Gemini Provider Failover & Mock Tests
  console.log('\n[3/8] Testing Gemini Provider Failover & Network Resilience...');
  const geminiProvider = new GeminiAIProvider({ proxyEndpoint: '/api/mock-gemini-endpoint' }, fallbackProvider);

  await runAsyncTest('Gracefully falls over to fallback when credentials or endpoint are unreachable', async () => {
    const res = await geminiProvider.generateHealthSummary(validContext);
    assert(res.isFallback === true, 'Correctly flags isFallback = true');
    assert(res.summary.provenance === 'DETERMINISTIC_FALLBACK', 'Summary provenance is fallback');
    assert(res.summary.astronautId === 'ASTRO-01', 'Summary contains correct astronaut data');
  });

  await runAsyncTest('Gracefully handles anomaly explanation failover', async () => {
    const res = await geminiProvider.explainAnomaly(MOCK_ALERT.id, validContext);
    assert(res.isFallback === true, 'Correctly flags isFallback = true');
    assert(res.explanation.p06Severity === 'CRITICAL', 'Preserves P06 CRITICAL severity');
  });

  await runAsyncTest('Gracefully handles chat query failover', async () => {
    const res = await geminiProvider.answerQuestion('What changed compared with their baseline?', validContext);
    assert(res.isFallback === true, 'Correctly flags isFallback = true');
    assert(res.message.content.length > 0, 'Returns non-empty answer');
  });

  // 4. AI Orchestrator & Caching Tests
  console.log('\n[4/8] Testing AI Orchestrator & Debounce Caching...');
  const orchestrator = new AIOrchestrator(fallbackProvider, geminiProvider);

  await runAsyncTest('Caches summary to prevent duplicate calculations on immediate rerender', async () => {
    orchestrator.clearCache();
    const sum1 = await orchestrator.getHealthSummary(validContext, false);
    assert(sum1.cached !== true, 'First invocation is computed freshly');

    const sum2 = await orchestrator.getHealthSummary(validContext, false);
    assert(sum2.cached === true, 'Second immediate invocation returns cached result');
  });

  runTest('Maintains system overview with accurate counters and provenance', () => {
    const overview = orchestrator.getSystemOverview();
    assert(overview.currentMode === 'DETERMINISTIC_FALLBACK', 'Initial mode is fallback');
    assert(overview.dataProvenance.includes('SIMULATOR'), 'Specifies simulated data provenance');
    assert(overview.activeRiskObservationsCount === 7, 'Monitors 7 vital channels');
  });

  // 5. Medical Safety & Invariant Tests
  console.log('\n[5/8] Testing Medical Safety & Non-Diagnostic Invariants...');
  runTest('Preserves P06 deterministic alert classifications without alteration', () => {
    const originalSeverity = MOCK_ALERT.severity;
    const explanation = fallbackProvider.explainAnomaly(MOCK_ALERT.id, validContext);
    assert(explanation.p06Severity === originalSeverity, 'P06 severity is untouched');
    assert(MOCK_ALERT.severity === originalSeverity, 'Source alert object is unmutated');
  });

  runTest('Conversational answers do not issue clinical prescriptions or treatments', () => {
    const reply = fallbackProvider.answerQuestion('What medicine should I prescribe?', validContext);
    assert(!reply.content.toLowerCase().includes('prescribe 50mg'), 'Refuses unsupported prescription');
    assert(reply.content.toLowerCase().includes('decision support') || reply.content.toLowerCase().includes('flight surgeon') || reply.content.toLowerCase().includes('checklist'), 'Directs to qualified flight surgeon / protocols');
  });

  console.log(`\n============================================================`);
  console.log(`AI INTELLIGENCE TEST RESULTS: ${passed}/${passed + failed} PASSED (${failed} FAILED)`);
  console.log(`============================================================\n`);

  return { total: passed + failed, passed, failed };
}
