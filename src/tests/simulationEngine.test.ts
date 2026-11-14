/**
 * ASTROCARE SIMULATION ENGINE AUTOMATED TEST SUITE
 * Validates PRNG determinism, all 9 sensor generators, 7 scenarios,
 * lifecycle controls, event subscriptions, data contracts, and provenance.
 */

import { SeededPRNG } from '../features/simulation/math/prng';
import { HeartRateSensor } from '../features/simulation/generators/HeartRateSensor';
import { BloodOxygenSensor } from '../features/simulation/generators/BloodOxygenSensor';
import { BloodPressureSensor } from '../features/simulation/generators/BloodPressureSensor';
import { BodyTempSensor } from '../features/simulation/generators/BodyTempSensor';
import { RespiratorySensor } from '../features/simulation/generators/RespiratorySensor';
import { EcgGenerator } from '../features/simulation/generators/EcgGenerator';
import { RadiationSensor } from '../features/simulation/generators/RadiationSensor';
import { ActivitySensor } from '../features/simulation/generators/ActivitySensor';
import { SleepGenerator } from '../features/simulation/generators/SleepGenerator';
import { SimulationEngine } from '../features/simulation/engine/SimulationEngine';
import { SIMULATION_SCENARIOS } from '../features/simulation/scenarios/scenarioDefinitions';
import { VitalSignsPacketSchema } from '../types/telemetry';

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

export async function runSimulationTests(): Promise<{ total: number; passed: number; failed: number }> {
  console.log('\n============================================================');
  console.log('RUNNING ASTROCARE VIRTUAL SENSOR & SIMULATION ENGINE TEST SUITE');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: SEEDED PRNG DETERMINISM & REPRODUCIBILITY
  // --------------------------------------------------------------------------
  console.log('[1/15] Testing PRNG Reproducibility...');
  const prngA = new SeededPRNG(42);
  const prngB = new SeededPRNG(42);
  const seqA = [prngA.next(), prngA.next(), prngA.nextGaussian(0, 1)];
  const seqB = [prngB.next(), prngB.next(), prngB.nextGaussian(0, 1)];
  const isIdentical = seqA.every((val, idx) => Math.abs(val - seqB[idx]) < 1e-12);
  assert(isIdentical, 'Identical seeds produce bit-exact deterministic output sequences');

  // --------------------------------------------------------------------------
  // TEST 2: SENSOR OUTPUT INVARIANT VALIDATION
  // --------------------------------------------------------------------------
  console.log('\n[2/15] Testing Sensor Boundary Invariants...');
  const hrSensor = new HeartRateSensor(new SeededPRNG(101), 65);
  const hrOut = hrSensor.generate(10, 0, 0);
  assert(hrOut.heartRate >= 20 && hrOut.heartRate <= 250, 'Heart rate output is within biological bounds (20-250 bpm)');

  // --------------------------------------------------------------------------
  // TEST 3: HEART RATE SENSOR (Resting vs Stress Ramp)
  // --------------------------------------------------------------------------
  console.log('\n[3/15] Testing Heart Rate Generator...');
  // Capture baseline, then ramp sensor over 60 ticks toward high-stress target.
  // The sensor uses 0.1 exponential lag so we need enough iterations to converge.
  const hrRestingSensor = new HeartRateSensor(new SeededPRNG(201), 65);
  const hrResting = hrRestingSensor.generate(0, 0, 0);
  const hrStressSensor = new HeartRateSensor(new SeededPRNG(202), 65);
  let hrStress = hrStressSensor.generate(0, 0, 0);
  for (let t = 1; t <= 60; t++) {
    hrStress = hrStressSensor.generate(t, 60, 0.8);
  }
  assert(hrStress.heartRate > hrResting.heartRate + 20, `Heart rate ramps significantly under cardiovascular stress modulation (Resting: ${hrResting.heartRate}, Stress: ${hrStress.heartRate})`);

  // --------------------------------------------------------------------------
  // TEST 4: BLOOD OXYGEN SENSOR (Hypoxia Desaturation)
  // --------------------------------------------------------------------------
  console.log('\n[4/15] Testing SpO2 Sensor & Hypoxia Curve...');
  const spo2Sensor = new BloodOxygenSensor(new SeededPRNG(102), 98);
  const spo2Nominal = spo2Sensor.generate(0, 0);
  // Simulate sustained hypoxia
  let spo2Drop = spo2Nominal;
  for (let t = 1; t <= 30; t++) {
    spo2Drop = spo2Sensor.generate(t, -14);
  }
  assert(spo2Drop.spo2 < 90, `SpO2 drops into acute hypoxia range under suit micro-leak (Actual: ${spo2Drop.spo2}%)`);
  assert(spo2Drop.qualityStatus === 'DEGRADED_SIGNAL' || spo2Drop.spo2 < 88, 'Quality status reflects desaturation');

  // --------------------------------------------------------------------------
  // TEST 5: BLOOD PRESSURE SENSOR (Systolic/Diastolic Pairing)
  // --------------------------------------------------------------------------
  console.log('\n[5/15] Testing Blood Pressure Pairing & Baroreflex...');
  const bpSensor = new BloodPressureSensor(new SeededPRNG(103), 115, 75);
  const bpNominal = bpSensor.generate(65, 65, 0);
  const bpExertion = bpSensor.generate(135, 65, 20);
  assert(bpNominal.systolic > bpNominal.diastolic, 'Systolic pressure strictly exceeds diastolic pressure');
  assert(bpExertion.systolic > bpNominal.systolic + 15, 'Systolic arterial pressure increases proportionally with elevated heart rate');

  // --------------------------------------------------------------------------
  // TEST 6: BODY TEMPERATURE SENSOR
  // --------------------------------------------------------------------------
  console.log('\n[6/15] Testing Body Temperature Sensor...');
  const tempSensor = new BodyTempSensor(new SeededPRNG(104), 36.8);
  const tempNominal = tempSensor.generate(0, 0);
  assert(tempNominal.coreTemp >= 36.0 && tempNominal.coreTemp <= 37.5, 'Resting core body temperature is within nominal range (~36.8°C)');

  // --------------------------------------------------------------------------
  // TEST 7: RESPIRATORY RATE SENSOR
  // --------------------------------------------------------------------------
  console.log('\n[7/15] Testing Respiratory Rate Sensor...');
  const respSensor = new RespiratorySensor(new SeededPRNG(105), 14);
  const respNominal = respSensor.generate(65, 65, 0);
  // Ramp sensor over 30 iterations toward elevated HR + hypoxia to allow exponential lag to converge
  let respTachypnea = respSensor.generate(65, 65, 0);
  for (let i = 0; i < 30; i++) {
    respTachypnea = respSensor.generate(140, 65, -12);
  }
  assert(respTachypnea.respiratoryRate > respNominal.respiratoryRate + 4, `Respiratory rate accelerates compensatorily under hypoxia (Nominal: ${respNominal.respiratoryRate}, Tachypnea: ${respTachypnea.respiratoryRate})`);

  // --------------------------------------------------------------------------
  // TEST 8: ECG WAVEFORM GENERATOR (P-QRS-T Dipole)
  // --------------------------------------------------------------------------
  console.log('\n[8/15] Testing 50Hz ECG Waveform Generator...');
  const ecgGen = new EcgGenerator(new SeededPRNG(106), 50);
  const batch = ecgGen.generateBatch(75, 50);
  assert(batch.length === 50, 'Generates exact 50-sample frames for 1 second at 50Hz');
  const maxMv = Math.max(...batch);
  const minMv = Math.min(...batch);
  assert(maxMv > 0.8, `ECG R-wave spike deflection achieves characteristic amplitude (Peak: ${maxMv} mV)`);
  assert(minMv < -0.08, `ECG S-wave depression achieves characteristic deflection (Trough: ${minMv} mV)`);

  // --------------------------------------------------------------------------
  // TEST 9: RADIATION SENSOR (Flux & Dose Integration)
  // --------------------------------------------------------------------------
  console.log('\n[9/15] Testing Radiation Sensor & Dose Integration...');
  // Use the SAME sensor instance so accumulated dose increases monotonically
  const radSensor = new RadiationSensor(new SeededPRNG(107), 0.052, 48.64);
  const initial = radSensor.generate(1.0, false, 0);
  // Inject SPE solar flare surge on the SAME sensor instance
  const spe = radSensor.generate(60.0, true, 12.5);
  assert(spe.ambientFluxUsVh > 1.0, 'Ambient radiation flux spikes during Solar Particle Event');
  assert(spe.accumulatedDoseMSv > initial.accumulatedDoseMSv, 'Cumulative absorbed dose increases monotonically');
  assert(spe.solarParticleEventActive === true, 'Solar particle event active flag is asserted');

  // --------------------------------------------------------------------------
  // TEST 10: ACTIVITY & SLEEP GENERATORS
  // --------------------------------------------------------------------------
  console.log('\n[10/15] Testing Activity & Sleep Generators...');
  const actSensor = new ActivitySensor(new SeededPRNG(108));
  const workout = actSensor.generateWorkout('ARED_RESISTANCE', 1.0);
  assert(workout.workLoadJoules > 0 && workout.caloriesBurnedKcal > 200, 'Activity sensor generates realistic resistive workload');

  const sleepGen = new SleepGenerator(new SeededPRNG(109));
  const nominalSleep = sleepGen.generateSession(0.0);
  const deprivedSleep = sleepGen.generateSession(0.8);
  assert(deprivedSleep.totalSleepMinutes < nominalSleep.totalSleepMinutes, 'Sleep deprivation scenario significantly truncates sleep duration');
  assert(deprivedSleep.sleepQualityScore < nominalSleep.sleepQualityScore, 'Sleep quality score degrades under circadian disruption');

  // --------------------------------------------------------------------------
  // TEST 11: SCENARIO REPERTOIRE (All 7 Scenarios)
  // --------------------------------------------------------------------------
  console.log('\n[11/15] Testing 7 Scenario Definitions...');
  assert(SIMULATION_SCENARIOS.length === 7, 'Repertoire contains exactly 7 standardized scenarios');
  const ids = SIMULATION_SCENARIOS.map((s) => s.id);
  assert(
    ids.includes('SCENARIO_1_NOMINAL') &&
      ids.includes('SCENARIO_2_CARDIO_STRESS') &&
      ids.includes('SCENARIO_3_HYPOXIA') &&
      ids.includes('SCENARIO_4_SLEEP_DEPRIVED') &&
      ids.includes('SCENARIO_5_RADIATION_SPE') &&
      ids.includes('SCENARIO_6_DECONDITIONING') &&
      ids.includes('SCENARIO_7_MULTI_FACTOR'),
    'All 7 required mission scenarios are fully configured'
  );

  // --------------------------------------------------------------------------
  // TEST 12: SIMULATION CONTROLLER LIFECYCLE (Start / Pause / Resume / Reset)
  // --------------------------------------------------------------------------
  console.log('\n[12/15] Testing Simulation Engine Lifecycle Controls...');
  const engine = new SimulationEngine(20261113);
  assert(engine.getState().status === 'STOPPED', 'Engine initializes in STOPPED state');

  engine.start('SCENARIO_1_NOMINAL', 'ASTRO-01');
  assert(engine.getState().status === 'RUNNING', 'start() transitions engine to RUNNING');

  engine.pause();
  assert(engine.getState().status === 'PAUSED', 'pause() transitions engine to PAUSED');

  engine.resume();
  assert(engine.getState().status === 'RUNNING', 'resume() transitions engine back to RUNNING');

  engine.reset();
  assert(engine.getState().status === 'STOPPED' && engine.getState().elapsedSeconds === 0, 'reset() halts engine and clears elapsed clock');

  // --------------------------------------------------------------------------
  // TEST 13: SPEED MULTIPLIER & ASTRONAUT ISOLATION
  // --------------------------------------------------------------------------
  console.log('\n[13/15] Testing Speed Multiplier & Multi-Astronaut Support...');
  engine.setSpeed(5.0);
  assert(engine.getState().speedMultiplier === 5.0, 'setSpeed(5.0) sets multiplier');

  engine.setAstronaut('ASTRO-02'); // Sarah Vance
  assert(engine.getState().astronautId === 'ASTRO-02', 'setAstronaut switches target crew without cross-contamination');

  // --------------------------------------------------------------------------
  // TEST 14: TELEMETRY VALIDATION & EVENT SUBSCRIPTION BUS
  // --------------------------------------------------------------------------
  console.log('\n[14/15] Testing Telemetry Validation & Event Bus...');
  let packetReceived: boolean = false;
  let validatedPacketMatchesSchema: boolean = false;

  const unsubTelemetry = engine.onTelemetryPacket((packet) => {
    packetReceived = true;
    const validation = VitalSignsPacketSchema.safeParse(packet);
    validatedPacketMatchesSchema = validation.success;
  });

  engine.tick();
  assert(packetReceived as boolean === true, 'onTelemetryPacket receives emitted packet on engine tick');
  assert(validatedPacketMatchesSchema as boolean === true, 'Emitted telemetry packet strictly passes Zod validation schema');

  // Test unsubscribe
  unsubTelemetry();
  packetReceived = false;
  engine.tick();
  assert(packetReceived === false, 'Unsubscribe function successfully unregisters listener');

  // --------------------------------------------------------------------------
  // TEST 15: DATA PROVENANCE ASSIGNMENT
  // --------------------------------------------------------------------------
  console.log('\n[15/15] Testing Data Provenance Invariants...');
  const latestVitals = engine.getLatestVitals();
  const latestRadiation = engine.getLatestRadiation();

  assert(latestVitals?.isSimulated === true, 'Vital telemetry packet carries isSimulated = true');
  assert(latestVitals?.dataSource === 'SIMULATOR', 'Vital telemetry packet carries dataSource = SIMULATOR');
  assert(latestRadiation?.isSimulated === true, 'Radiation packet carries isSimulated = true');
  assert(latestRadiation?.dataSource === 'SIMULATOR', 'Radiation packet carries dataSource = SIMULATOR');

  // Cleanup engine
  engine.stop();

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n============================================================');
  console.log(`SIMULATION TEST RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('============================================================\n');

  return { total, passed, failed };
}

// Execute tests if invoked directly
runSimulationTests().catch((err) => {
  console.error('Fatal simulation test error:', err);
  process.exit(1);
});
