import { AIContextBuilder } from '../features/ai/services/aiContextBuilder';
import { DeterministicAIProvider } from '../features/ai/services/deterministicAIProvider';
import { GeminiAIProvider } from '../features/ai/services/geminiAIProvider';
import { AIOrchestrator } from '../features/ai/services/aiOrchestrator';
import { p08PersistenceService } from '../services/p08Persistence';
import { CompositeHealthAssessment } from '../features/analytics/types/analyticsTypes';
import { Astronaut, HealthAlert } from '../types/database.types';
import { VitalSignsPacket, RadiationPacket } from '../types/telemetry';
import { ClinicalInvestigation, FollowUpChecklistItem } from '../features/ai/types/aiTypes';

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
  recommendedAction: 'Immediate supplemental O2 and clinical evaluation.',
  baselineComparisons: {
    HEART_RATE: { parameter: 'HEART_RATE', label: 'Heart Rate', unit: 'bpm', currentValue: 135, baselineValue: 64, absoluteDelta: 71, percentageDelta: 110.9, zScore: 5.9, riskLevel: 'CRITICAL', riskScore: 95, qualityStatus: 'NOMINAL' as const, statusDescription: 'Significantly elevated heart rate' },
    SPO2: { parameter: 'SPO2', label: 'Oxygen Saturation', unit: '%', currentValue: 85, baselineValue: 98, absoluteDelta: -13, percentageDelta: -13.3, zScore: -8.6, riskLevel: 'CRITICAL', riskScore: 98, qualityStatus: 'NOMINAL' as const, statusDescription: 'Critical hypoxia' },
    BLOOD_PRESSURE_SYS: { parameter: 'BLOOD_PRESSURE_SYS', label: 'Blood Pressure Systolic', unit: 'mmHg', currentValue: 140, baselineValue: 114, absoluteDelta: 26, percentageDelta: 22.8, zScore: 2.8, riskLevel: 'WARNING', riskScore: 65, qualityStatus: 'NOMINAL' as const, statusDescription: 'Elevated systolic pressure' },
    BLOOD_PRESSURE_DIA: { parameter: 'BLOOD_PRESSURE_DIA', label: 'Blood Pressure Diastolic', unit: 'mmHg', currentValue: 88, baselineValue: 74, absoluteDelta: 14, percentageDelta: 18.9, zScore: 2.1, riskLevel: 'WARNING', riskScore: 55, qualityStatus: 'NOMINAL' as const, statusDescription: 'Mildly elevated diastolic pressure' },
    CORE_TEMP: { parameter: 'CORE_TEMP', label: 'Core Body Temperature', unit: '°C', currentValue: 37.1, baselineValue: 36.8, absoluteDelta: 0.3, percentageDelta: 0.8, zScore: 0.8, riskLevel: 'NORMAL', riskScore: 10, qualityStatus: 'NOMINAL' as const, statusDescription: 'Within normal range' },
    RESPIRATORY_RATE: { parameter: 'RESPIRATORY_RATE', label: 'Respiratory Rate', unit: 'br/min', currentValue: 26, baselineValue: 14, absoluteDelta: 12, percentageDelta: 85.7, zScore: 4.8, riskLevel: 'CRITICAL', riskScore: 90, qualityStatus: 'NOMINAL' as const, statusDescription: 'Tachypnea detected' },
    RADIATION_FLUX: { parameter: 'RADIATION_FLUX', label: 'Ambient Radiation Flux', unit: 'µSv/h', currentValue: 0.052, baselineValue: 0.05, absoluteDelta: 0.002, percentageDelta: 4.0, zScore: 0.2, riskLevel: 'NORMAL', riskScore: 5, qualityStatus: 'NOMINAL' as const, statusDescription: 'Nominal radiation levels' },
  },
};

const MOCK_VITALS: VitalSignsPacket = {
  packetId: 'pkt-01',
  astronautId: 'ASTRO-01',
  missionId: 'ARES-VI',
  timestamp: new Date().toISOString(),
  vitals: {
    heartRate: { value: 135, unit: 'bpm', quality: 'NOMINAL' },
    bloodPressure: { systolic: 140, diastolic: 88, unit: 'mmHg', quality: 'NOMINAL' },
    spo2: { value: 85, unit: '%', quality: 'NOMINAL' },
    coreTemp: { value: 37.1, unit: '°C', quality: 'NOMINAL' },
    respiratoryRate: { value: 26, unit: 'rpm', quality: 'NOMINAL' },
  },
  isSimulated: true,
  dataSource: 'SIMULATOR',
};

const MOCK_RADIATION: RadiationPacket = {
  packetId: 'rad-01',
  astronautId: 'ASTRO-01',
  missionId: 'ARES-VI',
  timestamp: new Date().toISOString(),
  ambientFluxUsVh: 0.052,
  accumulatedDoseMSv: 48.64,
  solarParticleEventActive: false,
  quality: 'NOMINAL',
  isSimulated: true,
  dataSource: 'SIMULATOR',
};

const MOCK_ALERT: HealthAlert = {
  id: 'ALT-HYPOXIA-01',
  mission_id: 'ARES-VI',
  astronaut_id: 'ASTRO-01',
  timestamp: new Date().toISOString(),
  rule_code: 'RULE_HYPOXIA_CRITICAL',
  severity: 'CRITICAL',
  title: 'Severe Arterial Hypoxia',
  description: 'Blood oxygen saturation has dropped below 88% critical floor.',
  status: 'ACTIVE',
  triggering_value: '85 %',
  baseline_expected: '98 %',
  created_at: new Date().toISOString(),
};

export async function runClinicalCopilotTests() {
  console.log('============================================================');
  console.log('RUNNING ASTROCARE CLINICAL COPILOT & DECISION SUPPORT (P08) SUITE');
  console.log('============================================================');

  let passed = 0;
  let failed = 0;

  function runTest(name: string, fn: () => void) {
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

  const context = AIContextBuilder.buildContext(
    MOCK_ASTRONAUT,
    MOCK_ASSESSMENT,
    MOCK_VITALS,
    MOCK_RADIATION,
    [MOCK_ALERT],
    '24H'
  );

  const deterministicProvider = new DeterministicAIProvider();
  const geminiProvider = new GeminiAIProvider({ proxyEndpoint: '/api/mock-gemini-endpoint' }, deterministicProvider);
  const orchestrator = new AIOrchestrator(deterministicProvider, geminiProvider);

  // 1. Copilot Overview & Situation Brief Tests
  console.log('\n[1/5] Testing Copilot Overview & Health Situation Brief...');
  runTest('Generates structured Copilot Overview with deterministic provenance', () => {
    const overview = deterministicProvider.generateCopilotOverview(context);
    assert(overview.astronautId === 'ASTRO-01', 'Correct astronaut target');
    assert(overview.providerMode === 'DETERMINISTIC_FALLBACK', 'Flags deterministic mode');
    assert(overview.activeAnomaliesCount >= 1, 'Reflects active alerts');
    assert(overview.highPriorityObservations.length > 0, 'Includes high-priority observations');
  });

  runTest('Health Situation Brief includes non-diagnostic safety preface', () => {
    const brief = deterministicProvider.generateHealthSituationBrief(context, '24H');
    assert(brief.executiveSummary.includes('DETERMINISTIC FALLBACK — NOT GENERATED BY GEMINI'), 'Contains provenance badge');
    assert(brief.telemetryObservations.length > 0, 'Observations grounded in telemetry');
    assert(brief.humanReviewNotes.length > 0, 'Includes human review safety note');
  });

  // 2. Clinical Investigations & Report Synthesis Tests
  console.log('\n[2/5] Testing Clinical Investigation & Diagnostic Synthesis...');
  const mockInv: ClinicalInvestigation = {
    investigationId: 'INV-TEST-01',
    title: 'EVA Desaturation Inquiry',
    astronautId: 'ASTRO-01',
    missionId: 'ARES-VI',
    primaryMetric: 'SPO2',
    relatedAlertIds: ['ALT-HYPOXIA-01'],
    timeRange: '24H',
    notes: 'Investigating potential cabin seal leak.',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  runTest('Synthesizes investigation report with plausible etiologies without making ungrounded claims', () => {
    const report = deterministicProvider.analyzeInvestigation(mockInv, context);
    assert(report.investigationId === 'INV-TEST-01', 'Report tied to investigation');
    assert(report.primaryObservation.includes('DETERMINISTIC FALLBACK'), 'Prefixes fallback disclaimer');
    assert(report.possibleContributingFactors.length >= 2, 'Lists possible contributing factors');
    assert(report.supportingMetrics.length > 0, 'Includes supporting biometric channels');
  });

  // 3. Multi-Metric Correlation Engine Tests
  console.log('\n[3/5] Testing Multi-Metric Cross-Coupling Analysis...');
  runTest('Calculates compensatory inverse correlation between HR and SpO2', () => {
    const result = deterministicProvider.analyzeMultipleMetrics(['HEART_RATE', 'SPO2'], '24H', context);
    assert(result.metrics.length === 2, 'Analyzed two parameters');
    assert(result.correlationCoefficient !== undefined && result.correlationCoefficient < 0, 'Hypoxia tachycardia produces inverse correlation');
    assert(result.interpretation.includes('compensatory physiological reflex'), 'Interprets physiological mechanism');
  });

  // 4. Follow-up Checklists & Persistence Tests
  console.log('\n[4/5] Testing Follow-Up Suggestions & Persistence Layer...');
  runTest('Generates prioritized clinical action items', () => {
    const items = deterministicProvider.suggestFollowUps(mockInv.investigationId, context);
    assert(items.length >= 2, 'Generates at least 2 checklist items');
    assert(items.some((i) => i.priority === 'URGENT' || i.priority === 'HIGH'), 'Prioritizes urgent cardiorespiratory actions');
  });

  await runAsyncTest('Persists and retrieves investigations through fallback store', async () => {
    const saved = await p08PersistenceService.saveInvestigation(mockInv);
    assert(saved.investigationId === mockInv.investigationId, 'Saved successfully');
    const loaded = await p08PersistenceService.loadInvestigations(mockInv.astronautId);
    assert(loaded.some((i) => i.investigationId === mockInv.investigationId), 'Retrieved saved investigation');
  });

  await runAsyncTest('Persists and updates follow-up checklist items', async () => {
    const item: FollowUpChecklistItem = {
      itemId: 'CHK-TEST-01',
      investigationId: mockInv.investigationId,
      description: 'Check cabin oxygen scrubbers',
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    await p08PersistenceService.saveChecklistItem(item);
    const loaded = await p08PersistenceService.loadChecklistItems(mockInv.investigationId);
    assert(loaded.some((i) => i.itemId === 'CHK-TEST-01'), 'Retrieved checklist item');
  });

  // 5. Orchestrator Prompt 08 Passthrough & Gemini Failover Tests
  console.log('\n[5/5] Testing AI Orchestrator Prompt 08 Passthrough & Resilient Fallback...');
  await runAsyncTest('AI Orchestrator dispatches Copilot Overview with graceful fallback', async () => {
    orchestrator.setProviderMode('GEMINI_LIVE');
    const overview = await orchestrator.generateCopilotOverview(context, true);
    assert(overview.providerMode === 'DETERMINISTIC_FALLBACK', 'Gracefully fell over to deterministic overview');
    assert(overview.astronautId === 'ASTRO-01', 'Maintains correct subject');
  });

  await runAsyncTest('AI Orchestrator analyzes multi-metric coupling cleanly', async () => {
    const res = await orchestrator.analyzeMultipleMetrics(['HEART_RATE', 'SPO2'], '24H', context);
    assert(res.metrics.includes('HEART_RATE'), 'Results include target channels');
  });

  console.log(`\n============================================================`);
  console.log(`CLINICAL COPILOT (P08) TEST RESULTS: ${passed}/${passed + failed} PASSED (${failed} FAILED)`);
  console.log(`============================================================\n`);

  return { total: passed + failed, passed, failed };
}
