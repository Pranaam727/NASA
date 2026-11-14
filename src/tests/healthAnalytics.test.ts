/**
 * ASTROCARE HEALTH ANALYTICS & RISK ENGINE TEST SUITE
 * Validates baseline analytics, individual parameter deviations, z-scores,
 * multi-parameter composite risk assessment, synergistic compounding multipliers,
 * alert generation, deduplication, cooldown windows, escalation, and lifecycle controls.
 */

import { BaselineEngine } from '../features/analytics/engine/BaselineEngine';
import { HealthRiskEngine } from '../features/analytics/engine/HealthRiskEngine';
import { AlertManager } from '../features/analytics/engine/AlertManager';
import { VitalSignsPacket, RadiationPacket } from '../types/telemetry';
import { Astronaut } from '../types/database.types';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    results.push({ name: testName, passed: true });
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    results.push({ name: testName, passed: false, error: errorMsg || 'Assertion failed' });
    console.error(`  ✗ FAIL: ${testName} - ${errorMsg || 'Assertion failed'}`);
  }
}

// Mock astronaut data with individual baselines
const MOCK_ASTRONAUT_A: Partial<Astronaut> = {
  id: 'ASTRO-01',
  baseline_resting_hr: 64,
  baseline_spo2: 98,
  baseline_bp_systolic: 114,
  baseline_bp_diastolic: 74,
};

const MOCK_ASTRONAUT_B: Partial<Astronaut> = {
  id: 'ASTRO-02',
  baseline_resting_hr: 72,
  baseline_spo2: 99,
  baseline_bp_systolic: 110,
  baseline_bp_diastolic: 70,
};

function createMockVitalPacket(
  astronautId: string,
  overrides?: {
    hr?: number;
    spo2?: number;
    sys?: number;
    dia?: number;
    temp?: number;
    resp?: number;
  }
): VitalSignsPacket {
  return {
    packetId: crypto.randomUUID(),
    astronautId,
    missionId: 'm-ares-06',
    timestamp: new Date().toISOString(),
    dataSource: 'SIMULATOR',
    isSimulated: true,
    vitals: {
      heartRate: { value: overrides?.hr ?? 65, unit: 'bpm', quality: 'NOMINAL' },
      bloodPressure: {
        systolic: overrides?.sys ?? 115,
        diastolic: overrides?.dia ?? 75,
        unit: 'mmHg',
        quality: 'NOMINAL',
      },
      spo2: { value: overrides?.spo2 ?? 98, unit: '%', quality: 'NOMINAL' },
      respiratoryRate: { value: overrides?.resp ?? 14, unit: 'rpm', quality: 'NOMINAL' },
      coreTemp: { value: overrides?.temp ?? 36.8, unit: '°C', quality: 'NOMINAL' },
    },
  };
}

function createMockRadiationPacket(
  astronautId: string,
  flux: number = 0.052,
  isSpe: boolean = false
): RadiationPacket {
  return {
    packetId: crypto.randomUUID(),
    astronautId,
    missionId: 'm-ares-06',
    timestamp: new Date().toISOString(),
    dataSource: 'SIMULATOR',
    isSimulated: true,
    ambientFluxUsVh: flux,
    accumulatedDoseMSv: 48.65,
    solarParticleEventActive: isSpe,
    quality: 'NOMINAL',
  };
}

export async function runHealthAnalyticsTests(): Promise<{
  total: number;
  passed: number;
  failed: number;
}> {
  console.log('\n============================================================');
  console.log('RUNNING ASTROCARE HEALTH ANALYTICS & RISK ENGINE TEST SUITE');
  console.log('============================================================\n');

  const baselineEngine = new BaselineEngine();
  const riskEngine = new HealthRiskEngine();

  // --------------------------------------------------------------------------
  // TEST 1: BASELINE RESOLUTION & INDIVIDUALIZATION
  // --------------------------------------------------------------------------
  console.log('[1/10] Testing Baseline Resolution & Astronaut Individualization...');
  const hrA = baselineEngine.getBaselineValue('HEART_RATE', MOCK_ASTRONAUT_A);
  const hrB = baselineEngine.getBaselineValue('HEART_RATE', MOCK_ASTRONAUT_B);
  assert(hrA === 64, 'Correctly resolves Astronaut A individual baseline resting HR (64 bpm)');
  assert(hrB === 72, 'Correctly resolves Astronaut B individual baseline resting HR (72 bpm)');
  assert(hrA !== hrB, 'Individual baselines are astronaut-isolated without cross-talk');

  // Fallback check
  const fallbackHr = baselineEngine.getBaselineValue('HEART_RATE', null);
  assert(fallbackHr === 68, 'Falls back to standard astronaut default baseline when astronaut is unspecified');

  // --------------------------------------------------------------------------
  // TEST 2: MATHEMATICAL DEVIATION & Z-SCORE ACCURACY
  // --------------------------------------------------------------------------
  console.log('\n[2/10] Testing Absolute Delta, % Deviation & Z-Score...');
  // Current HR: 76 bpm vs Baseline: 64 bpm -> Delta = +12, % Delta = +18.75%, std = 6.0 -> z-score = +2.0
  const comp = baselineEngine.calculateComparison('HEART_RATE', 76, MOCK_ASTRONAUT_A);
  assert(comp.absoluteDelta === 12, 'Calculates exact absolute delta (+12 bpm)');
  assert(comp.percentageDelta === 18.75, 'Calculates exact percentage deviation (+18.75%)');
  assert(comp.zScore === 2.0, 'Calculates exact biological z-score (+2.0σ)');

  // --------------------------------------------------------------------------
  // TEST 3: INDIVIDUAL PARAMETER RISK THRESHOLDS (All 4 Levels)
  // --------------------------------------------------------------------------
  console.log('\n[3/10] Testing Parameter Risk Classification...');
  // Normal SpO2
  const spo2Nominal = baselineEngine.calculateComparison('SPO2', 98, MOCK_ASTRONAUT_A);
  assert(spo2Nominal.riskLevel === 'NORMAL', 'SpO2 98% classified as NORMAL');

  // Caution SpO2 (93%)
  const spo2Caution = baselineEngine.calculateComparison('SPO2', 93, MOCK_ASTRONAUT_A);
  assert(spo2Caution.riskLevel === 'CAUTION', 'SpO2 93% classified as CAUTION');

  // Warning SpO2 (89%)
  const spo2Warning = baselineEngine.calculateComparison('SPO2', 89, MOCK_ASTRONAUT_A);
  assert(spo2Warning.riskLevel === 'WARNING', 'SpO2 89% classified as WARNING');

  // Critical SpO2 (84%)
  const spo2Critical = baselineEngine.calculateComparison('SPO2', 84, MOCK_ASTRONAUT_A);
  assert(spo2Critical.riskLevel === 'CRITICAL', 'SpO2 84% classified as CRITICAL');

  // Extreme Tachycardia (>160 bpm)
  const hrCritical = baselineEngine.calculateComparison('HEART_RATE', 168, MOCK_ASTRONAUT_A);
  assert(hrCritical.riskLevel === 'CRITICAL', 'HR 168 bpm classified as CRITICAL');

  // Bradycardia (<40 bpm)
  const hrBrady = baselineEngine.calculateComparison('HEART_RATE', 36, MOCK_ASTRONAUT_A);
  assert(hrBrady.riskLevel === 'CRITICAL', 'HR 36 bpm (severe bradycardia) classified as CRITICAL');

  // --------------------------------------------------------------------------
  // TEST 4: COMPOSITE HEALTH RISK ASSESSMENT (Nominal State)
  // --------------------------------------------------------------------------
  console.log('\n[4/10] Testing Composite Risk Assessment under Nominal Telemetry...');
  const nominalPacket = createMockVitalPacket('ASTRO-01', { hr: 64, spo2: 98, sys: 114, dia: 74, temp: 36.8, resp: 14 });
  const nominalRad = createMockRadiationPacket('ASTRO-01', 0.052, false);
  const nominalAssessment = riskEngine.evaluateAssessment(nominalPacket, nominalRad, MOCK_ASTRONAUT_A);

  assert(nominalAssessment.compositeScore < 25, `Nominal composite score is in healthy range (${nominalAssessment.compositeScore}/100)`);
  assert(nominalAssessment.overallRiskLevel === 'NORMAL', 'Overall risk level is NORMAL');
  assert(nominalAssessment.synergyMultipliersApplied.length === 0, 'No synergistic distress multipliers applied during nominal flight');

  // --------------------------------------------------------------------------
  // TEST 5: MULTI-PARAMETER SYNERGY COMPOUNDING (Hypoxia + Tachycardia)
  // --------------------------------------------------------------------------
  console.log('\n[5/10] Testing Synergistic Multiplier Compounding...');
  // Suit microleak: SpO2 collapses to 85% and HR spikes to 142 bpm
  const hypoxiaPacket = createMockVitalPacket('ASTRO-01', { hr: 142, spo2: 85, sys: 130, dia: 82, resp: 28 });
  const hypoxiaAssessment = riskEngine.evaluateAssessment(hypoxiaPacket, nominalRad, MOCK_ASTRONAUT_A);

  assert(
    hypoxiaAssessment.synergyMultipliersApplied.includes('ACUTE_HYPOXIA_COMPENSATORY_TACHYCARDIA'),
    'Applies ACUTE_HYPOXIA_COMPENSATORY_TACHYCARDIA synergy bonus'
  );
  assert(hypoxiaAssessment.compositeScore >= 75, `Composite score reaches CRITICAL tier (Actual: ${hypoxiaAssessment.compositeScore}/100)`);
  assert(hypoxiaAssessment.overallRiskLevel === 'CRITICAL', 'Overall risk level escalated to CRITICAL');

  // --------------------------------------------------------------------------
  // TEST 6: SOLAR PARTICLE EVENT (SPE) RADIATION ELEVATION
  // --------------------------------------------------------------------------
  console.log('\n[6/10] Testing Solar Particle Event Floor Escalation...');
  const speRadPacket = createMockRadiationPacket('ASTRO-01', 3.45, true);
  const speAssessment = riskEngine.evaluateAssessment(nominalPacket, speRadPacket, MOCK_ASTRONAUT_A);

  assert(
    speAssessment.synergyMultipliersApplied.includes('SPE_RADIATION_EVENT_ACTIVE'),
    'Applies SPE_RADIATION_EVENT_ACTIVE synergy multiplier'
  );
  assert(speAssessment.compositeScore >= 78, 'Forces composite score floor >= 78 during active SPE solar storm');
  assert(speAssessment.overallRiskLevel === 'CRITICAL', 'SPE event forces CRITICAL flight triage');

  // --------------------------------------------------------------------------
  // TEST 7: ALERT GENERATION FROM ABNORMAL TELEMETRY
  // --------------------------------------------------------------------------
  console.log('\n[7/10] Testing Alert Generation...');
  const alertMgr = new AlertManager(60);

  const alertsGenerated = alertMgr.evaluateTelemetry(hypoxiaPacket, hypoxiaAssessment, nominalRad, MOCK_ASTRONAUT_A);
  assert(alertsGenerated.length >= 1, `Generates at least 1 alert from hypoxic crisis (Generated: ${alertsGenerated.length})`);

  const hypoxiaAlert = alertsGenerated.find((a) => a.rule_code === 'RULE_HYPOXIA_CRITICAL');
  assert(hypoxiaAlert !== undefined, 'Generated RULE_HYPOXIA_CRITICAL alert');
  assert(hypoxiaAlert?.severity === 'CRITICAL', 'Alert severity is CRITICAL');
  assert(hypoxiaAlert?.status === 'ACTIVE', 'Alert initializes in ACTIVE status');
  assert(hypoxiaAlert?.astronaut_id === 'ASTRO-01', 'Alert carries correct astronaut ID');

  // --------------------------------------------------------------------------
  // TEST 8: ALERT DEDUPLICATION & COOLDOWN WINDOW
  // --------------------------------------------------------------------------
  console.log('\n[8/10] Testing Alert Deduplication & Cooldown Windows...');
  // Dispatch identical packet immediately within 60s cooldown window
  const duplicateAlerts = alertMgr.evaluateTelemetry(hypoxiaPacket, hypoxiaAssessment, nominalRad, MOCK_ASTRONAUT_A);
  assert(duplicateAlerts.length === 0, 'Duplicate alerts blocked by 60s cooldown window');

  // Escalation bypass test: a WARNING level alert followed by a CRITICAL level alert MUST bypass cooldown
  const mildHrPacket = createMockVitalPacket('ASTRO-02', { hr: 135 }); // Warning tachycardia
  const mildAssessment = riskEngine.evaluateAssessment(mildHrPacket, nominalRad, MOCK_ASTRONAUT_B);
  const initialAlerts = alertMgr.evaluateTelemetry(mildHrPacket, mildAssessment, nominalRad, MOCK_ASTRONAUT_B);
  assert(initialAlerts.length >= 1, 'Generates initial tachycardia warning for ASTRO-02');

  // Now escalate to CRITICAL (>160 bpm)
  const extremeHrPacket = createMockVitalPacket('ASTRO-02', { hr: 168 }); // Critical tachycardia
  const extremeAssessment = riskEngine.evaluateAssessment(extremeHrPacket, nominalRad, MOCK_ASTRONAUT_B);
  const escalatedAlerts = alertMgr.evaluateTelemetry(extremeHrPacket, extremeAssessment, nominalRad, MOCK_ASTRONAUT_B);
  assert(escalatedAlerts.length >= 1, 'Escalated CRITICAL reading bypasses cooldown and generates priority alert');
  assert(escalatedAlerts[0].severity === 'CRITICAL', 'Escalated alert has CRITICAL severity');

  // --------------------------------------------------------------------------
  // TEST 9: ALERT LIFECYCLE (Acknowledgement & Resolution)
  // --------------------------------------------------------------------------
  console.log('\n[9/10] Testing Alert Lifecycle Controls (Ack / Resolve)...');
  const alertToTriage = alertsGenerated[0];
  const ackResult = alertMgr.acknowledgeAlert(alertToTriage.id, 'SURGEON_SARAH', 'Oxygen mask deployed');
  assert(ackResult !== null, 'acknowledgeAlert returns updated alert');
  assert(ackResult?.status === 'ACKNOWLEDGED', 'Alert status transitioned to ACKNOWLEDGED');
  assert(ackResult?.acknowledged_by === 'SURGEON_SARAH', 'Records acknowledging medical officer');

  const resolveResult = alertMgr.resolveAlert(alertToTriage.id, 'SURGEON_SARAH', 'SpO2 recovered to 98%');
  assert(resolveResult !== null, 'resolveAlert returns resolved alert');
  assert(resolveResult?.status === 'RESOLVED', 'Alert status transitioned to RESOLVED');

  const activeRemaining = alertMgr.getActiveAlerts('ASTRO-01');
  assert(
    !activeRemaining.some((a) => a.id === alertToTriage.id),
    'Resolved alert is excluded from active triage queue'
  );

  // --------------------------------------------------------------------------
  // TEST 10: DETERMINISTIC CALCULATIONS & MULTI-ASTRONAUT ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n[10/10] Testing Determinism & Mathematical Invariance...');
  const packet1 = createMockVitalPacket('ASTRO-01', { hr: 88, spo2: 96, sys: 122, dia: 78 });
  const eval1 = riskEngine.evaluateAssessment(packet1, nominalRad, MOCK_ASTRONAUT_A);
  const eval2 = riskEngine.evaluateAssessment(packet1, nominalRad, MOCK_ASTRONAUT_A);

  assert(eval1.compositeScore === eval2.compositeScore, 'Identical telemetry inputs yield bit-exact composite scores');
  assert(eval1.overallRiskLevel === eval2.overallRiskLevel, 'Identical inputs yield bit-exact risk levels');
  assert(
    eval1.parameterRisks.HEART_RATE.riskScore === eval2.parameterRisks.HEART_RATE.riskScore,
    'Parameter risk scores are strictly deterministic'
  );

  // Astronaut Isolation: Same HR of 72 bpm has DIFFERENT z-scores and risk contributions for ASTRO-01 vs ASTRO-02
  const commonPacketA = createMockVitalPacket('ASTRO-01', { hr: 72 });
  const commonPacketB = createMockVitalPacket('ASTRO-02', { hr: 72 });
  const evalAstroA = riskEngine.evaluateAssessment(commonPacketA, nominalRad, MOCK_ASTRONAUT_A);
  const evalAstroB = riskEngine.evaluateAssessment(commonPacketB, nominalRad, MOCK_ASTRONAUT_B);

  // For Astro A (base 64), 72 is +8 bpm (+1.33σ)
  // For Astro B (base 72), 72 is 0 bpm (0σ, resting)
  assert(
    evalAstroA.baselineComparisons.HEART_RATE.absoluteDelta === 8,
    'Astro A (baseline 64) delta is +8 bpm'
  );
  assert(
    evalAstroB.baselineComparisons.HEART_RATE.absoluteDelta === 0,
    'Astro B (baseline 72) delta is 0 bpm'
  );
  assert(
    evalAstroA.baselineComparisons.HEART_RATE.riskScore >
      evalAstroB.baselineComparisons.HEART_RATE.riskScore,
    'Astro A experiences higher strain score than Astro B for identical 72 bpm heart rate'
  );

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n============================================================');
  console.log(`HEALTH ANALYTICS TEST RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('============================================================\n');

  return { total, passed, failed };
}

// Execute tests directly if invoked from CLI
runHealthAnalyticsTests().catch((err) => {
  console.error('Fatal health analytics test error:', err);
  process.exit(1);
});
