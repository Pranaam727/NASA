/**
 * ASTROCARE HEALTH ANALYTICS & RISK ENGINE AUTOMATED TEST SUITE
 * Validates individual astronaut baselines, z-score deviations,
 * deterministic subsystem scoring, compound risk synergies,
 * alert generation, deduplication cooldowns, and alert lifecycle.
 */

import { getAstronautBaseline, calculateAllDeviations } from '../features/analytics/baselineEngine';
import { evaluateHealthRisk } from '../features/analytics/riskEngine';
import { AlertEngine } from '../features/analytics/alertEngine';
import { VitalSignsPacket, RadiationPacket } from '../types/telemetry';

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

function createMockVitals(overrides: Partial<VitalSignsPacket['vitals']> = {}, astronautId = 'ASTRO-01'): VitalSignsPacket {
  return {
    packetId: '00000000-0000-0000-0000-000000000001',
    astronautId,
    missionId: 'm-ares-06',
    timestamp: '2026-11-13T20:00:00.000Z',
    dataSource: 'SIMULATOR',
    isSimulated: true,
    vitals: {
      heartRate: { value: 64, unit: 'bpm', quality: 'NOMINAL' },
      bloodPressure: { systolic: 114, diastolic: 74, unit: 'mmHg', quality: 'NOMINAL' },
      spo2: { value: 98, unit: '%', quality: 'NOMINAL' },
      respiratoryRate: { value: 14, unit: 'rpm', quality: 'NOMINAL' },
      coreTemp: { value: 36.8, unit: '°C', quality: 'NOMINAL' },
      ...overrides,
    },
  };
}

function createMockRadiation(flux = 0.052, isSpe = false): RadiationPacket {
  return {
    packetId: '00000000-0000-0000-0000-000000000002',
    astronautId: 'ASTRO-01',
    missionId: 'm-ares-06',
    timestamp: '2026-11-13T20:00:00.000Z',
    dataSource: 'SIMULATOR',
    isSimulated: true,
    ambientFluxUsVh: flux,
    accumulatedDoseMSv: 48.64,
    solarParticleEventActive: isSpe,
    quality: 'NOMINAL',
  };
}

export async function runRiskEngineTests(): Promise<{ total: number; passed: number; failed: number }> {
  console.log('\n============================================================');
  console.log('RUNNING ASTROCARE HEALTH ANALYTICS & RISK ENGINE TEST SUITE');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: INDIVIDUAL ASTRONAUT BASELINES & DEVIATION CALCULATION
  // --------------------------------------------------------------------------
  console.log('[1/10] Testing Astronaut Baseline Profiling & Z-Score Deviations...');
  const baselineAstro1 = getAstronautBaseline('ASTRO-01');
  assert(baselineAstro1.restingHr === 64, 'ASTRO-01 baseline HR is 64 bpm');
  assert(baselineAstro1.bpSystolic === 114, 'ASTRO-01 baseline systolic BP is 114 mmHg');

  const baselineAstro2 = getAstronautBaseline('ASTRO-02');
  assert(baselineAstro2.restingHr !== baselineAstro1.restingHr, 'Different astronauts carry isolated personal baselines');

  const vitalsDev = createMockVitals({
    heartRate: { value: 76, unit: 'bpm', quality: 'NOMINAL' },
  });
  const deviations = calculateAllDeviations(vitalsDev.vitals, null, baselineAstro1);

  assert(deviations.HEART_RATE.delta === 12, 'Calculates exact absolute delta (+12 bpm)');
  assert(deviations.HEART_RATE.percentDelta === 18.8, 'Calculates percent delta (+18.8%)');
  assert(deviations.HEART_RATE.zScore === 2.0, 'Calculates standardized 2.0 sigma z-score (12 / 6.0)');
  assert(deviations.HEART_RATE.direction === 'ELEVATED', 'Identifies elevated direction');

  // --------------------------------------------------------------------------
  // TEST 2: NOMINAL BIOMETRICS RISK CLASSIFICATION
  // --------------------------------------------------------------------------
  console.log('\n[2/10] Testing Nominal Resting Biometrics...');
  const nominalVitals = createMockVitals();
  const nominalRad = createMockRadiation(0.052, false);
  const nominalAssessment = evaluateHealthRisk(nominalVitals, nominalRad, baselineAstro1);

  assert(nominalAssessment.riskLevel === 'NORMAL', 'Nominal vitals classify as NORMAL risk level');
  assert(nominalAssessment.compositeScore < 25, `Composite score is within homeostatic floor (Score: ${nominalAssessment.compositeScore})`);
  assert(nominalAssessment.activeSynergies.length === 0, 'No active synergies detected during resting homeostasis');

  // --------------------------------------------------------------------------
  // TEST 3: ISOLATED TACHYCARDIA RISK EVALUATION
  // --------------------------------------------------------------------------
  console.log('\n[3/10] Testing Isolated Cardiovascular Tachycardia...');
  const tachyVitals = createMockVitals({
    heartRate: { value: 140, unit: 'bpm', quality: 'NOMINAL' },
  });
  const tachyAssessment = evaluateHealthRisk(tachyVitals, nominalRad, baselineAstro1);

  assert(tachyAssessment.subsystems.CARDIOVASCULAR.score >= 40, 'Cardiovascular subsystem score elevates under marked tachycardia');
  assert(tachyAssessment.compositeScore > nominalAssessment.compositeScore + 10, 'Composite score increases proportionally');

  // --------------------------------------------------------------------------
  // TEST 4: ACUTE HYPOXIA OXYGEN DESATURATION
  // --------------------------------------------------------------------------
  console.log('\n[4/10] Testing Acute Hypoxia Oxygen Desaturation...');
  const hypoxiaVitals = createMockVitals({
    spo2: { value: 84, unit: '%', quality: 'DEGRADED_SIGNAL' },
    respiratoryRate: { value: 26, unit: 'rpm', quality: 'NOMINAL' },
  });
  const hypoxiaAssessment = evaluateHealthRisk(hypoxiaVitals, nominalRad, baselineAstro1);

  assert(hypoxiaAssessment.subsystems.RESPIRATORY.score >= 70, 'Respiratory score reaches high danger zone under acute hypoxia (84% SpO2)');
  assert(hypoxiaAssessment.riskLevel === 'CRITICAL' || hypoxiaAssessment.riskLevel === 'WARNING', 'Acute hypoxia escalates to critical/warning protocol');

  // --------------------------------------------------------------------------
  // TEST 5: SOLAR PARTICLE EVENT (SPE) DOSIMETRY FLUX SPIKE
  // --------------------------------------------------------------------------
  console.log('\n[5/10] Testing Solar Particle Event Radiation Risk...');
  const speRadiation = createMockRadiation(12.75, true);
  const speAssessment = evaluateHealthRisk(nominalVitals, speRadiation, baselineAstro1);

  assert(speAssessment.subsystems.RADIATION.score >= 80, 'Radiation subsystem score spikes under active SPE surge');
  assert(speAssessment.subsystems.RADIATION.level === 'CRITICAL', 'Radiation subsystem classifies as CRITICAL');

  // --------------------------------------------------------------------------
  // TEST 6: MULTI-PARAMETER COMPOUND RISK SYNERGISM
  // --------------------------------------------------------------------------
  console.log('\n[6/10] Testing Multi-Parameter Compound Risk Synergism...');
  // Compound scenario: acute hypoxia (85% SpO2) PLUS marked tachycardia (135 bpm)
  const compoundVitals = createMockVitals({
    spo2: { value: 85, unit: '%', quality: 'DEGRADED_SIGNAL' },
    heartRate: { value: 135, unit: 'bpm', quality: 'NOMINAL' },
  });
  const compoundAssessment = evaluateHealthRisk(compoundVitals, nominalRad, baselineAstro1);

  assert(compoundAssessment.activeSynergies.length > 0, 'Compound synergism detected for cardio-hypoxic strain');
  assert(compoundAssessment.compositeScore >= 75, `Compound crisis achieves CRITICAL risk score (Score: ${compoundAssessment.compositeScore})`);
  assert(compoundAssessment.riskLevel === 'CRITICAL', 'Compound distress classifies strictly as CRITICAL');

  // --------------------------------------------------------------------------
  // TEST 7: DETERMINISTIC REPRODUCIBILITY
  // --------------------------------------------------------------------------
  console.log('\n[7/10] Testing Deterministic Calculation Consistency...');
  const eval1 = evaluateHealthRisk(compoundVitals, nominalRad, baselineAstro1);
  const eval2 = evaluateHealthRisk(compoundVitals, nominalRad, baselineAstro1);

  assert(eval1.compositeScore === eval2.compositeScore, 'Identical telemetry packets yield bit-exact composite scores');
  assert(eval1.riskLevel === eval2.riskLevel, 'Identical telemetry packets yield identical risk classification');

  // --------------------------------------------------------------------------
  // TEST 8: ALERT ENGINE GENERATION & THRESHOLD FIRING
  // --------------------------------------------------------------------------
  console.log('\n[8/10] Testing Alert Generation & Threshold Evaluation...');
  const alertEng = new AlertEngine();
  alertEng.clearCooldowns();

  // Trigger hypoxia alert
  const triggeredAlerts = alertEng.evaluateTelemetry(hypoxiaVitals, nominalRad, baselineAstro1);
  assert(triggeredAlerts.length > 0, 'Alert engine triggers alerts upon critical telemetry threshold violation');

  const hypoxiaAlert = triggeredAlerts.find((a) => a.rule_code === 'RULE-HP-DESAT-CRIT');
  assert(hypoxiaAlert !== undefined, 'Generated alert contains expected canonical rule code');
  assert(hypoxiaAlert?.severity === 'CRITICAL', 'Alert carries CRITICAL severity');
  assert(hypoxiaAlert?.astronaut_id === 'ASTRO-01', 'Alert tags correct astronaut ID');
  assert(hypoxiaAlert?.triggering_value === '84% SpO2', 'Alert captures triggering value');

  // --------------------------------------------------------------------------
  // TEST 9: ALERT DEDUPLICATION & COOLDOWN SUPPRESSION
  // --------------------------------------------------------------------------
  console.log('\n[9/10] Testing Alert Deduplication & Cooldown Window...');
  // Same critical vitals evaluated immediately within cooldown window
  const duplicateAlerts = alertEng.evaluateTelemetry(hypoxiaVitals, nominalRad, baselineAstro1);
  const duplicateHypoxia = duplicateAlerts.find((a) => a.rule_code === 'RULE-HP-DESAT-CRIT');
  assert(duplicateHypoxia === undefined, 'Duplicate alert is suppressed within cooldown window');

  // Severity Escalation Bypass:
  // Fire a MEDIUM alert first, then immediate CRITICAL alert
  alertEng.clearCooldowns();
  const medTachyVitals = createMockVitals({ heartRate: { value: 125, unit: 'bpm', quality: 'NOMINAL' } });
  const critTachyVitals = createMockVitals({ heartRate: { value: 155, unit: 'bpm', quality: 'NOMINAL' } });

  const medAlerts = alertEng.evaluateTelemetry(medTachyVitals, nominalRad, baselineAstro1);
  assert(medAlerts.some((a) => a.severity === 'MEDIUM'), 'Fires initial MEDIUM tachycardia alert');

  const critAlerts = alertEng.evaluateTelemetry(critTachyVitals, nominalRad, baselineAstro1);
  assert(critAlerts.some((a) => a.severity === 'CRITICAL'), 'Severity escalation bypasses cooldown window immediately');

  // --------------------------------------------------------------------------
  // TEST 10: ALERT LIFECYCLE (Acknowledgement & Resolution Transitions)
  // --------------------------------------------------------------------------
  console.log('\n[10/10] Testing Alert Lifecycle State Transitions...');
  alertEng.clearCooldowns();
  const freshAlerts = alertEng.evaluateTelemetry(hypoxiaVitals, nominalRad, baselineAstro1);
  const targetAlert = freshAlerts[0];

  assert(targetAlert.status === 'ACTIVE', 'Alert initializes in ACTIVE state');

  const ackAlert = await alertEng.acknowledgeAlert(targetAlert.id, 'DR_VANCE', 'Administering emergency O2 mask');
  assert(ackAlert?.status === 'ACKNOWLEDGED', 'acknowledgeAlert transitions status to ACKNOWLEDGED');
  assert(ackAlert?.acknowledged_by === 'DR_VANCE', 'Records acknowledging medical officer');

  const resAlert = await alertEng.resolveAlert(targetAlert.id, 'DR_VANCE', 'SpO2 recovered to 98%');
  assert(resAlert?.status === 'RESOLVED', 'resolveAlert transitions status to RESOLVED');

  const activeRemaining = alertEng.getActiveAlerts('ASTRO-01');
  assert(!activeRemaining.some((a) => a.id === targetAlert.id), 'Resolved alert is removed from active triage queue');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n============================================================');
  console.log(`HEALTH ANALYTICS & RISK ENGINE TEST RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('============================================================\n');

  return { total, passed, failed };
}

// Support direct node execution if run as standalone script
if (process.argv[1]?.includes('riskEngine.test')) {
  runRiskEngineTests().catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
}
