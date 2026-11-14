/**
 * ASTROCARE DATA LAYER & SECURITY AUTOMATED TEST SUITE
 * Validates telemetry invariants, database interfaces, demo provider,
 * data provenance, and RLS role-based privacy gating.
 */

import {
  SingleTelemetryReadingSchema,
  VitalSignsPacketSchema,
  RadiationPacketSchema,
} from '../types/telemetry';
import {
  demoMissionService,
  demoAstronautService,
  demoTelemetryService,
  demoRadiationService,
  demoAlertService,
  demoWellnessService,
} from '../services/demoDataProvider';
import { canAccessPrivateJournal, canModifyMedicalRecord, canManageAlerts } from '../utils/security';

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

export async function runAllTests(): Promise<{ total: number; passed: number; failed: number }> {
  console.log('\n============================================================');
  console.log('RUNNING ASTROCARE DATA LAYER & SECURITY TEST SUITE');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: TELEMETRY SCHEMA VALIDATION (Nominal readings pass)
  // --------------------------------------------------------------------------
  console.log('[1/8] Testing Telemetry Schema Validation...');
  const validReading = {
    readingId: '00000000-0000-0000-0000-000000000001',
    astronautId: 'ASTRO-01',
    missionId: 'ARES-VI',
    timestamp: new Date().toISOString(),
    dataSource: 'SIMULATOR',
    isSimulated: true,
    measurementType: 'HEART_RATE',
    value: 68,
    unit: 'bpm',
    qualityStatus: 'NOMINAL',
  };

  const parsedValid = SingleTelemetryReadingSchema.safeParse(validReading);
  assert(parsedValid.success, 'Valid single heart rate telemetry parses successfully');

  const validPacket = {
    packetId: '00000000-0000-0000-0000-000000000002',
    astronautId: 'ASTRO-01',
    missionId: 'ARES-VI',
    timestamp: new Date().toISOString(),
    dataSource: 'SIMULATOR',
    isSimulated: true,
    vitals: {
      heartRate: { value: 72, unit: 'bpm', quality: 'NOMINAL' },
      bloodPressure: { systolic: 118, diastolic: 76, unit: 'mmHg', quality: 'NOMINAL' },
      spo2: { value: 99, unit: '%', quality: 'NOMINAL' },
      respiratoryRate: { value: 14, unit: 'rpm', quality: 'NOMINAL' },
      coreTemp: { value: 36.8, unit: '°C', quality: 'NOMINAL' },
    },
  };
  const parsedPacket = VitalSignsPacketSchema.safeParse(validPacket);
  assert(parsedPacket.success, 'Grouped vital signs broadcast packet parses successfully');

  // --------------------------------------------------------------------------
  // TEST 2: INVALID MEASUREMENT REJECTION (Boundary invariants)
  // --------------------------------------------------------------------------
  console.log('\n[2/8] Testing Invalid Measurement Rejection...');
  const invalidHr = {
    ...validReading,
    readingId: '00000000-0000-0000-0000-000000000003',
    value: 320, // Beyond maximum 250 bpm
  };
  const parseInvalidHr = SingleTelemetryReadingSchema.safeParse(invalidHr);
  assert(!parseInvalidHr.success, 'Rejects heart rate above biological ceiling (>250 bpm)');

  const invalidSpo2 = {
    ...validPacket,
    packetId: '00000000-0000-0000-0000-000000000004',
    vitals: {
      ...validPacket.vitals,
      spo2: { value: 108, unit: '%', quality: 'NOMINAL' }, // SpO2 cannot exceed 100%
    },
  };
  const parseInvalidSpo2 = VitalSignsPacketSchema.safeParse(invalidSpo2);
  assert(!parseInvalidSpo2.success, 'Rejects oxygen saturation above 100%');

  const invalidRad = {
    packetId: '00000000-0000-0000-0000-000000000005',
    astronautId: 'ASTRO-01',
    missionId: 'ARES-VI',
    timestamp: new Date().toISOString(),
    dataSource: 'SIMULATOR',
    isSimulated: true,
    ambientFluxUsVh: -5.0, // Negative radiation flux impossible
    accumulatedDoseMSv: 12.0,
    solarParticleEventActive: false,
    quality: 'NOMINAL',
  };
  const parseInvalidRad = RadiationPacketSchema.safeParse(invalidRad);
  assert(!parseInvalidRad.success, 'Rejects negative radiation flux (<0 uSv/h)');

  // --------------------------------------------------------------------------
  // TEST 3: DATABASE SERVICE INTERFACES
  // --------------------------------------------------------------------------
  console.log('\n[3/8] Testing Database Service Interfaces...');
  const missionRes = await demoMissionService.getActiveMission();
  assert(missionRes.data !== null && missionRes.data.code === 'ARES-VI', 'getActiveMission returns ARES-VI mission');

  const astroRes = await demoAstronautService.getAstronautsByMission('m-ares-06');
  assert(astroRes.data !== null && astroRes.data.length === 4, 'getAstronautsByMission returns 4 crew members');

  const vitalsRes = await demoTelemetryService.getLatestVitals('ASTRO-01');
  assert(vitalsRes.data !== null && vitalsRes.data.heart_rate_bpm > 0, 'getLatestVitals returns valid telemetry record');

  const radRes = await demoRadiationService.getLatestRadiation('m-ares-06');
  assert(radRes.data !== null && radRes.data.ambient_flux_usv_per_hour > 0, 'getLatestRadiation returns ambient flux');

  // --------------------------------------------------------------------------
  // TEST 4: DEMO PROVIDER FUNCTIONALITY & STATE PERSISTENCE
  // --------------------------------------------------------------------------
  console.log('\n[4/8] Testing Demo Provider Functionality...');
  assert(missionRes.isDemoMode === true, 'Provider explicitly reports isDemoMode = true');

  // Ingest synthetic packet
  const newPacket = {
    packetId: '00000000-0000-0000-0000-000000000006',
    astronautId: 'ASTRO-01',
    missionId: 'm-ares-06',
    timestamp: new Date().toISOString(),
    dataSource: 'SIMULATOR' as const,
    isSimulated: true,
    vitals: {
      heartRate: { value: 74, unit: 'bpm' as const, quality: 'NOMINAL' as const },
      bloodPressure: { systolic: 116, diastolic: 75, unit: 'mmHg' as const, quality: 'NOMINAL' as const },
      spo2: { value: 98, unit: '%' as const, quality: 'NOMINAL' as const },
      respiratoryRate: { value: 15, unit: 'rpm' as const, quality: 'NOMINAL' as const },
      coreTemp: { value: 36.9, unit: '°C' as const, quality: 'NOMINAL' as const },
    },
  };
  const recorded = await demoTelemetryService.recordVitalPacket(newPacket);
  assert(recorded.data !== null && recorded.data.heart_rate_bpm === 74, 'recordVitalPacket persists in in-memory queue');

  // Alert acknowledgement
  const ackRes = await demoAlertService.acknowledgeAlert('alt-001', 'user-02', 'Clinically reviewed');
  assert(ackRes.data !== null && ackRes.data.status === 'ACKNOWLEDGED', 'acknowledgeAlert updates alert status to ACKNOWLEDGED');

  // --------------------------------------------------------------------------
  // TEST 5: DATA PROVENANCE VERIFICATION
  // --------------------------------------------------------------------------
  console.log('\n[5/8] Testing Data Provenance Flagging...');
  assert(recorded.data?.is_simulated === true, 'Telemetry record contains explicit is_simulated = true');
  assert(recorded.data?.data_source === 'SIMULATOR', 'Telemetry record specifies data_source = SIMULATOR');
  assert(radRes.data?.is_simulated === true, 'Radiation record contains explicit is_simulated = true');

  // --------------------------------------------------------------------------
  // TEST 6: ROLE PERMISSION LOGIC
  // --------------------------------------------------------------------------
  console.log('\n[6/8] Testing Role Authorization Matrix...');
  assert(canModifyMedicalRecord('MEDICAL_OFFICER') === true, 'Flight Surgeon (MEDICAL_OFFICER) can modify clinical records');
  assert(canModifyMedicalRecord('ASTRONAUT') === false, 'Astronaut CANNOT modify clinical records');
  assert(canModifyMedicalRecord('MISSION_CONTROLLER') === false, 'Mission Controller CANNOT modify clinical records');
  assert(canManageAlerts('MISSION_CONTROLLER') === true, 'Mission Controller can acknowledge mission alerts');

  // --------------------------------------------------------------------------
  // TEST 7: PRIVATE WELLNESS JOURNAL PRIVACY GATING
  // --------------------------------------------------------------------------
  console.log('\n[7/8] Testing Private Wellness Journal Access Controls...');
  const authorId = 'user-01'; // Marcus Chen
  const surgeonId = 'user-02'; // Dr. Vance
  const controllerId = 'user-99'; // Mission Controller

  // 7a. Author astronaut accesses own journal
  const authorCanRead = canAccessPrivateJournal(authorId, authorId, 'ASTRONAUT', false);
  assert(authorCanRead === true, 'Astronaut can access their own private journal');

  // 7b. Flight Surgeon accesses unconsented entry
  const surgeonReadUnshared = canAccessPrivateJournal(authorId, surgeonId, 'MEDICAL_OFFICER', false);
  assert(surgeonReadUnshared === false, 'Flight Surgeon is DENIED access to unshared journal entry');

  // 7c. Flight Surgeon accesses consented entry
  const surgeonReadConsented = canAccessPrivateJournal(authorId, surgeonId, 'MEDICAL_OFFICER', true);
  assert(surgeonReadConsented === true, 'Flight Surgeon can read journal entry when explicitly consented');

  // 7d. Mission Controller is strictly denied regardless of consent
  const controllerRead = canAccessPrivateJournal(authorId, controllerId, 'MISSION_CONTROLLER', true);
  assert(controllerRead === false, 'Mission Controller is STRICTLY DENIED access to private wellness journals');

  // 7e. Test via demo service
  const surgeonJournalQuery = await demoWellnessService.getPrivateJournalEntries('ASTRO-01', surgeonId, 'MEDICAL_OFFICER');
  const onlyConsented = surgeonJournalQuery.data?.every((j) => j.share_with_medical_officer) ?? false;
  assert(onlyConsented && (surgeonJournalQuery.data?.length ?? 0) > 0, 'demoWellnessService filters out unshared journal entries for medical officer');

  const controllerJournalQuery = await demoWellnessService.getPrivateJournalEntries('ASTRO-01', controllerId, 'MISSION_CONTROLLER');
  assert(controllerJournalQuery.data?.length === 0, 'demoWellnessService returns 0 entries for Mission Controller');

  // --------------------------------------------------------------------------
  // TEST 8: MISSION-TO-ASTRONAUT RELATIONAL INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n[8/8] Testing Mission-to-Astronaut Relationships...');
  const allCrew = await demoAstronautService.getAstronautsByMission(missionRes.data!.id);
  assert(allCrew.data?.length === 4, 'Mission ARES-VI is linked to exactly 4 crew members');

  const roles = allCrew.data?.map((a) => a.profile?.callsign) || [];
  assert(roles.includes('COMMANDER') && roles.includes('FLIGHT SURGEON'), 'Roster includes Commander and Flight Surgeon assignments');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n============================================================');
  console.log(`TEST RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('============================================================\n');

  return { total, passed, failed };
}

// Execute tests if invoked directly as standalone
if (process.argv[1]?.includes('dataLayer.test')) {
  runAllTests().catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
}
