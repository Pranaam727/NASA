import { runAllTests as runDataLayerTests } from './dataLayer.test';
import { runSimulationTests } from './simulationEngine.test';
import { runRiskEngineTests } from './riskEngine.test';
import { runRadiationTests } from './radiationEngine.test';

async function main() {
  console.log('############################################################');
  console.log('# ASTROCARE MASTER AUTOMATED VERIFICATION SUITE            #');
  console.log('############################################################');

  const dataLayer = await runDataLayerTests();
  const sim = await runSimulationTests();
  const risk = await runRiskEngineTests();
  const rad = await runRadiationTests();

  const total = dataLayer.total + sim.total + risk.total + rad.total;
  const passed = dataLayer.passed + sim.passed + risk.passed + rad.passed;
  const failed = dataLayer.failed + sim.failed + risk.failed + rad.failed;

  console.log('############################################################');
  console.log(`TOTAL SUITE RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('############################################################');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
