import { RadiationAnalyticsEngine } from '../features/radiation/services/radiationAnalytics';
import { NASAResearchAdapter } from '../features/radiation/services/nasaResearchAdapter';
import { ShieldingScenarioConfig } from '../features/radiation/types/radiationTypes';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function runRadiationTests() {
  console.log('============================================================');
  console.log('RUNNING ASTROCARE SPACE RADIATION INTELLIGENCE (P09) SUITE');
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

  // 1. Biological Risk & REID Evaluation Tests
  console.log('\n[1/4] Testing Biological Risk & REID Evaluation Engine...');
  runTest('Accurately calculates NASA career exposure percentage', () => {
    const risk = RadiationAnalyticsEngine.evaluateBiologicalRisk(48.64, 42.0, 0.052);
    // (48.64 + 42) / 600 * 100 = 15.1%
    assert(risk.careerDosePercent > 14.5 && risk.careerDosePercent < 15.5, 'Career % within tolerance');
    assert(risk.careerLimitMsv === 600, 'Matches NASA 600 mSv limit');
    assert(risk.excessLifetimeCancerRiskPercent > 0, 'Computes excess cancer risk (REID)');
  });

  runTest('Elevates biological risk tier during hazardous solar particle surge', () => {
    const risk = RadiationAnalyticsEngine.evaluateBiologicalRisk(48.64, 42.0, 12.5);
    assert(risk.biologicalRiskTier === 'CRITICAL', 'Flux > 10 triggers CRITICAL tier');
    assert(risk.recommendedAction.includes('storm shelter'), 'Directs crew to storm shelter');
  });

  // 2. Shielding Attenuation & Mass Transport Tests
  console.log('\n[2/4] Testing Shielding Mass Attenuation & Mitigation Simulator...');
  runTest('Demonstrates exponential beam attenuation in high-density polyethylene', () => {
    const config: ShieldingScenarioConfig = {
      environment: 'CISLUNAR',
      material: 'POLYETHYLENE',
      thicknessGcm2: 25,
      stormShelterActive: false,
    };
    const res = RadiationAnalyticsEngine.calculateShieldingScenario(config);
    assert(res.attenuatedFluxUsVh < res.unshieldedFluxUsVh, 'Attenuated flux is reduced');
    assert(res.doseReductionPercentage > 75, '25 g/cm² HDPE achieves >75% reduction');
    assert(res.mitigationEfficacy === 'EXCELLENT', 'Efficacy classified as EXCELLENT');
  });

  runTest('Shelter wall activation provides additional shielding factor', () => {
    const base = RadiationAnalyticsEngine.calculateShieldingScenario({
      environment: 'MARS_TRANSIT',
      material: 'WATER',
      thicknessGcm2: 15,
      stormShelterActive: false,
    });
    const withShelter = RadiationAnalyticsEngine.calculateShieldingScenario({
      environment: 'MARS_TRANSIT',
      material: 'WATER',
      thicknessGcm2: 15,
      stormShelterActive: true,
    });
    assert(withShelter.attenuatedFluxUsVh < base.attenuatedFluxUsVh, 'Shelter adds further attenuation');
    assert(withShelter.doseReductionPercentage > base.doseReductionPercentage, 'Higher dose reduction');
  });

  // 3. Solar Radiation Storm Classification (S1 - S5) Tests
  console.log('\n[3/4] Testing NOAA Space Weather Solar Storm Classification...');
  runTest('Classifies NOAA S1 through S5 event scales correctly', () => {
    assert(RadiationAnalyticsEngine.classifySPEEvent(0.05) === 'NONE', '0.05 is NONE');
    assert(RadiationAnalyticsEngine.classifySPEEvent(0.3) === 'S1_MINOR', '0.3 is S1');
    assert(RadiationAnalyticsEngine.classifySPEEvent(2.0) === 'S2_MODERATE', '2.0 is S2');
    assert(RadiationAnalyticsEngine.classifySPEEvent(8.0) === 'S3_STRONG', '8.0 is S3');
    assert(RadiationAnalyticsEngine.classifySPEEvent(30.0) === 'S4_SEVERE', '30.0 is S4');
    assert(RadiationAnalyticsEngine.classifySPEEvent(150.0) === 'S5_EXTREME', '150.0 is S5');
  });

  // 4. NASA Research Evidence Base Tests
  console.log('\n[4/4] Testing NASA HRP Scientific Evidence Repository...');
  runTest('Loads grounded peer-reviewed citations and key findings', () => {
    const evidence = NASAResearchAdapter.getEvidenceBase();
    assert(evidence.length >= 4, 'Contains at least 4 NASA archival references');
    const filtered = NASAResearchAdapter.getReferencesForTopic('cardiovascular');
    assert(filtered.length >= 1, 'Filters topic citations');
    assert(filtered[0].title.toLowerCase().includes('cardiovascular'), 'Title matches topic query');
  });

  console.log(`\n============================================================`);
  console.log(`RADIATION INTELLIGENCE (P09) TEST RESULTS: ${passed}/${passed + failed} PASSED (${failed} FAILED)`);
  console.log(`============================================================\n`);

  return { total: passed + failed, passed, failed };
}
