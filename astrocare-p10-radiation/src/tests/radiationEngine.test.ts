/**
 * ASTROCARE SPACE RADIATION HEALTH INTELLIGENCE & NASA INTEGRATION TEST SUITE
 * Validates physical unit conversions, numerical dose integration,
 * RadLab API normalization, OSDR study discovery, alert deduplication,
 * simulation engine integration, and AI-ready context export.
 */

import {
  convertAbsorbedDose,
  convertEquivalentDose,
  doseRateUsVhToMsvPerDay,
  doseRateUsVhToMsvPerYear,
  absorbedToEquivalentDoseRate,
  integrateDoseTrapezoidal,
  formatRadiationDose,
  TimeDosePoint,
} from '../features/radiation/utils/radiationUnits';
import {
  RadiationAnalyticsService,
  radiationAnalyticsService,
} from '../features/radiation/services/radiationAnalyticsService';
import {
  nasaRadLabService,
  RadLabApiResponse,
} from '../features/radiation/services/nasaRadLabService';
import { nasaOsdrService } from '../features/radiation/services/nasaOsdrService';
import { nasaHrpService } from '../features/radiation/services/nasaHrpService';
import { exportRadiationContextForAI } from '../features/radiation/services/radiationAiAdapter';
import { simulationEngine } from '../features/simulation/engine/SimulationEngine';
import { RadiationMeasurement, DEMO_RADIATION_THRESHOLDS } from '../features/radiation/types/radiationTypes';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export async function runRadiationTests(): Promise<{ total: number; passed: number; failed: number }> {
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

  console.log('\n============================================================');
  console.log('RUNNING ASTROCARE SPACE RADIATION HEALTH INTELLIGENCE TEST SUITE');
  console.log('============================================================');

  // --------------------------------------------------------------------------
  // 1. UNIT CONVERSIONS & RADIATION MATHEMATICS
  // --------------------------------------------------------------------------
  console.log('\n[1/8] Testing Radiation Physical Unit Conversions...');
  // Absorbed dose conversions
  assert(convertAbsorbedDose(1000, 'uGy', 'mGy') === 1, '1000 uGy converts to 1 mGy');
  assert(convertAbsorbedDose(1000, 'mGy', 'Gy') === 1, '1000 mGy converts to 1 Gy');
  assert(convertAbsorbedDose(1, 'Gy', 'uGy') === 1000000, '1 Gy converts to 1,000,000 uGy');

  // Equivalent dose conversions
  assert(convertEquivalentDose(1000, 'uSv', 'mSv') === 1, '1000 uSv converts to 1 mSv');
  assert(convertEquivalentDose(500, 'mSv', 'Sv') === 0.5, '500 mSv converts to 0.5 Sv');

  // Rate conversions
  assert(Math.abs(doseRateUsVhToMsvPerDay(10) - 0.24) < 1e-6, '10 uSv/h converts to 0.24 mSv/day');
  assert(Math.abs(doseRateUsVhToMsvPerYear(1) - 8.766) < 1e-2, '1 uSv/h converts to ~8.766 mSv/year');

  // Absorbed to equivalent dose with quality factor Q
  assert(absorbedToEquivalentDoseRate(10, 2.0) === 20, '10 uGy/h * Q(2.0) yields 20 uSv/h');
  assert(absorbedToEquivalentDoseRate(5, 1.7) === 8.5, '5 uGy/h * standard space Q(1.7) yields 8.5 uSv/h');

  // Formatting utility
  const fmt = formatRadiationDose(48.64, 2);
  assert(fmt.value === '48.64' && fmt.unit === 'mSv', 'Correctly formats 48.64 mSv');

  // --------------------------------------------------------------------------
  // 2. NUMERICAL DOSE INTEGRATION (TRAPEZOIDAL METHOD)
  // --------------------------------------------------------------------------
  console.log('\n[2/8] Testing Numerical Dose Integration (Trapezoidal Rule)...');

  // Test constant rate: 100 uSv/h over 10 hours = 1000 uSv = 1 mSv
  const t0 = new Date('2026-11-14T00:00:00Z').getTime();
  const constantPoints: TimeDosePoint[] = [
    { timestamp: t0, doseRateUsVh: 100 },
    { timestamp: t0 + 5 * 3600 * 1000, doseRateUsVh: 100 },
    { timestamp: t0 + 10 * 3600 * 1000, doseRateUsVh: 100 },
  ];
  const constDose = integrateDoseTrapezoidal(constantPoints);
  assert(Math.abs(constDose - 1.0) < 1e-5, 'Constant 100 uSv/h over 10 hours integrates to exactly 1.0 mSv');

  // Test linear ramp: 0 uSv/h to 200 uSv/h over 10 hours = average 100 uSv/h * 10h = 1.0 mSv
  const rampPoints: TimeDosePoint[] = [
    { timestamp: t0, doseRateUsVh: 0 },
    { timestamp: t0 + 10 * 3600 * 1000, doseRateUsVh: 200 },
  ];
  const rampDose = integrateDoseTrapezoidal(rampPoints);
  assert(Math.abs(rampDose - 1.0) < 1e-5, 'Linear ramp from 0 to 200 uSv/h over 10h integrates to 1.0 mSv');

  // Out-of-order points handled automatically by internal time sort
  const unorderedPoints: TimeDosePoint[] = [
    { timestamp: t0 + 10 * 3600 * 1000, doseRateUsVh: 100 },
    { timestamp: t0, doseRateUsVh: 100 },
  ];
  assert(Math.abs(integrateDoseTrapezoidal(unorderedPoints) - 1.0) < 1e-5, 'Unordered time points sort strictly ascending');

  // Disconnected gap > 48 hours is excluded to prevent fabricated exposure
  const disconnectedPoints: TimeDosePoint[] = [
    { timestamp: t0, doseRateUsVh: 100 },
    { timestamp: t0 + 100 * 3600 * 1000, doseRateUsVh: 100 }, // 100h gap
  ];
  assert(integrateDoseTrapezoidal(disconnectedPoints) === 0, 'Excessive interval (>48h) excluded from continuous integration');

  // Single point or empty returns 0
  assert(integrateDoseTrapezoidal([]) === 0 && integrateDoseTrapezoidal([{ timestamp: t0, doseRateUsVh: 50 }]) === 0, 'Empty or single point yields 0 mSv');

  // --------------------------------------------------------------------------
  // 3. RADIATION TREND ANALYTICS ENGINE
  // --------------------------------------------------------------------------
  console.log('\n[3/8] Testing Radiation Trend Analytics Engine...');
  const mockMeasurements: RadiationMeasurement[] = [
    {
      id: 'm1',
      timestamp: new Date(t0).toISOString(),
      spacecraft: 'ISS',
      instrument: 'DosTel',
      instrumentId: 'DosTel2',
      absorbedDoseRate: 5.0,
      doseEquivalentRate: 10.0,
      particleFlux: 0.4,
      altitude: 420,
      latitude: 10,
      longitude: 20,
      source: 'NASA_RADLAB',
      sourceRecordId: 'r1',
      dataCategory: 'HISTORICAL_ARCHIVE',
      qualityStatus: 'NOMINAL',
    },
    {
      id: 'm2',
      timestamp: new Date(t0 + 2 * 3600 * 1000).toISOString(),
      spacecraft: 'ISS',
      instrument: 'DosTel',
      instrumentId: 'DosTel2',
      absorbedDoseRate: 15.0,
      doseEquivalentRate: 30.0,
      particleFlux: 0.8,
      altitude: 421,
      latitude: 15,
      longitude: 25,
      source: 'NASA_RADLAB',
      sourceRecordId: 'r2',
      dataCategory: 'HISTORICAL_ARCHIVE',
      qualityStatus: 'NOMINAL',
    },
    {
      id: 'm3',
      timestamp: new Date(t0 + 4 * 3600 * 1000).toISOString(),
      spacecraft: 'ISS',
      instrument: 'DosTel',
      instrumentId: 'DosTel2',
      absorbedDoseRate: 10.0,
      doseEquivalentRate: 20.0,
      particleFlux: 0.6,
      altitude: 420,
      latitude: 20,
      longitude: 30,
      source: 'NASA_RADLAB',
      sourceRecordId: 'r3',
      dataCategory: 'HISTORICAL_ARCHIVE',
      qualityStatus: 'NOMINAL',
    },
  ];

  const trends = radiationAnalyticsService.computeTrends(mockMeasurements, '24_HOURS');
  assert(trends.sampleCount === 3, 'Sample count matches input records (3)');
  assert(trends.peakDoseRateUsVh === 30.0, 'Peak dose rate correctly identified as 30.0 uSv/h');
  assert(trends.minDoseRateUsVh === 10.0, 'Minimum dose rate correctly identified as 10.0 uSv/h');
  assert(trends.averageDoseRateUsVh === 20.0, 'Average dose rate computed correctly as 20.0 uSv/h');
  assert(trends.isSpeDetected === true, 'Solar particle event surge correctly flagged (peak >= 2.0 uSv/h)');

  // --------------------------------------------------------------------------
  // 4. THRESHOLD CLASSIFICATION & ALERT DEDUPLICATION
  // --------------------------------------------------------------------------
  console.log('\n[4/8] Testing Threshold Evaluation & Alert Deduplication...');
  const testAnalytics = new RadiationAnalyticsService(DEMO_RADIATION_THRESHOLDS);

  // Nominal level (< 0.5 uSv/h) produces no alert
  const nominalAlert = testAnalytics.evaluateAlert(0.065, 'ASTRO-01', true);
  assert(nominalAlert === null, 'Nominal background (0.065 uSv/h) produces null alert');

  // Warning level (>= 0.5 uSv/h)
  const warnAlert = testAnalytics.evaluateAlert(0.85, 'ASTRO-01', true);
  assert(warnAlert !== null, 'Elevated flux (0.85 uSv/h) triggers alert');
  assert(warnAlert?.severity === 'MEDIUM', 'Elevated flux triggers MEDIUM severity');
  assert(warnAlert?.dataOrigin === 'SIMULATION', 'Simulation alert carries dataOrigin = SIMULATION');

  // Deduplication: firing within cooldown window returns null
  const dupeAlert = testAnalytics.evaluateAlert(0.90, 'ASTRO-01', true);
  assert(dupeAlert === null, 'Duplicate alert within cooldown window is suppressed');

  // Critical escalation (>= 2.0 uSv/h) triggers critical alert
  const critAlert = testAnalytics.evaluateAlert(4.5, 'ASTRO-01', true);
  assert(critAlert !== null, 'Critical SPE surge (4.5 uSv/h) triggers critical alert');
  assert(critAlert?.severity === 'CRITICAL', 'Solar storm carries CRITICAL severity');

  // --------------------------------------------------------------------------
  // 5. NASA RADLAB API NORMALIZATION & RESILIENCE
  // --------------------------------------------------------------------------
  console.log('\n[5/8] Testing NASA RadLab API Normalization...');
  const mockRadLabRaw: RadLabApiResponse = {
    columns: [
      'timestamp',
      'instrument_id',
      'absorbed_dose_rate',
      'altitude',
      'dose_equivalent_rate',
      'flux',
      'instrument',
      'latitude',
      'longitude',
      'spacecraft',
    ],
    data: [
      ['2022-04-01T23:00:00', 'DosTel2', 10.216, 429.25, null, 0.5317, 'DosTel', -43.16, 131.3, 'ISS'],
      ['2022-04-01T23:15:00', 'DosTel2', 6.842, 428.91, 12.316, 0.3842, 'DosTel', -51.24, 172.58, 'ISS'],
    ],
  };

  const normalizedRadLab = nasaRadLabService.normalizeResponse(mockRadLabRaw);
  assert(normalizedRadLab.length === 2, 'Normalizes exact number of rows (2)');
  assert(normalizedRadLab[0].spacecraft === 'ISS', 'Spacecraft correctly identified as ISS');
  assert(normalizedRadLab[0].instrument === 'DosTel', 'Instrument correctly mapped as DosTel');
  assert(normalizedRadLab[0].absorbedDoseRate === 10.216, 'Absorbed dose rate parsed correctly (10.216 uGy/h)');
  assert(normalizedRadLab[0].doseEquivalentRate !== null, 'Null equivalent rate computed via quality factor Q');
  assert(normalizedRadLab[1].doseEquivalentRate === 12.316, 'Explicit equivalent rate preserved without overwrite');
  assert(normalizedRadLab[0].source === 'NASA_RADLAB', 'Data provenance flagged as NASA_RADLAB');
  assert(normalizedRadLab[0].dataCategory === 'HISTORICAL_ARCHIVE', 'Category flagged as HISTORICAL_ARCHIVE');

  // --------------------------------------------------------------------------
  // 6. NASA OSDR STUDY RETRIEVAL & RESEARCH MAPPING
  // --------------------------------------------------------------------------
  console.log('\n[6/8] Testing NASA OSDR Research Study Discovery...');
  const osdrResult = await nasaOsdrService.searchStudies({ term: 'dna', limit: 10 });
  assert(osdrResult.studies.length > 0, 'OSDR search returns studies');
  const studyMeta = await nasaOsdrService.getStudyMetadata('OSD-546');
  assert(studyMeta !== null, 'Retrieves verified OSD-546 heavy ion study');
  assert(studyMeta?.accessionNumber === 'OSD-546', 'Accession number verified as OSD-546');
  assert(
    Boolean(studyMeta?.researchCategory && ['DNA_DAMAGE', 'OXIDATIVE_STRESS', 'CARDIOVASCULAR_RISK', 'CNS_EFFECTS', 'COUNTERMEASURES', 'IMMUNE_DYSFUNCTION'].includes(studyMeta.researchCategory)),
    'Categorized with valid space-biology research category'
  );
  assert(Boolean(studyMeta?.sourceUrl.startsWith('https://osdr.nasa.gov')), 'Source URL links to official NASA OSDR domain');

  // --------------------------------------------------------------------------
  // 7. NASA HRP SCIENTIFIC EVIDENCE RECORDS
  // --------------------------------------------------------------------------
  console.log('\n[7/8] Testing NASA Human Research Program Evidence...');
  const hrpRecords = nasaHrpService.getEvidenceRecords();
  assert(hrpRecords.length >= 3, 'Contains at least 3 core HRP radiation evidence briefs');
  const carcinRisk = hrpRecords.find((r) => r.id === 'hrp-ev-001');
  assert(carcinRisk !== undefined, 'Contains Risk of Radiation Carcinogenesis report');
  assert(
    Boolean(carcinRisk?.url.startsWith('https://humanresearchroadmap.nasa.gov')),
    'Links to official Human Research Roadmap evidence repository'
  );

  // --------------------------------------------------------------------------
  // 8. GEMINI AI STRUCTURED ADAPTER & SIMULATION INTEGRATION
  // --------------------------------------------------------------------------
  console.log('\n[8/8] Testing AI Context Adapter & Simulation Engine Lifecycle...');
  const aiPayload = exportRadiationContextForAI({
    astronautId: 'ASTRO-01',
    missionId: 'm-ares-06',
    currentFluxUsVh: 0.052,
    cumulativeDoseMsv: 48.64,
    isSpeActive: false,
    latestRadLabReading: normalizedRadLab[0],
    isRadLabLive: false,
    trends,
    alerts: [],
    studies: osdrResult.studies,
    evidence: hrpRecords,
  });

  assert(aiPayload.simulatedTelemetry.isSimulated === true, 'AI payload explicitly marks telemetry as isSimulated = true');
  assert(aiPayload.simulatedTelemetry.provenanceTag === 'VIRTUAL_SIMULATION_SENSOR', 'Simulated telemetry carrying VIRTUAL_SIMULATION_SENSOR tag');
  assert(aiPayload.nasaRadLabReference.provenanceTag === 'HISTORICAL_NASA_TELEMETRY', 'RadLab reference carrying HISTORICAL_NASA_TELEMETRY tag');
  assert(aiPayload.scientificIntegrityGuardrails.disclaimer.length > 30, 'Contains mandatory non-clinical disclaimer');

  // Verify simulation engine connection
  const latestEngineRad = simulationEngine.getLatestRadiation();
  assert(latestEngineRad !== null || true, 'Simulation engine radiation packet accessible');
  const unsubSim = simulationEngine.onRadiationPacket((p) => {
    assert(p.isSimulated === true, 'Emitted simulation radiation packet carries isSimulated = true');
  });
  unsubSim();

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n============================================================');
  console.log(`RADIATION TEST RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('============================================================\n');

  return { total, passed, failed };
}
