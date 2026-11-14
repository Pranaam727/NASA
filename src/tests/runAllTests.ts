import { runAllTests as runDataLayerTests } from './dataLayer.test';
import { runSimulationTests } from './simulationEngine.test';
import { runHealthAnalyticsTests } from './healthAnalytics.test';
import { runAIIntelligenceTests } from './aiIntelligence.test';
import { runClinicalCopilotTests } from './clinicalCopilot.test';
import { runRadiationTests } from './radiation.test';

async function main() {
  console.log('############################################################');
  console.log('# ASTROCARE MASTER AUTOMATED VERIFICATION SUITE            #');
  console.log('############################################################');

  const dataLayer = await runDataLayerTests();
  const sim = await runSimulationTests();
  const analytics = await runHealthAnalyticsTests();
  const ai = await runAIIntelligenceTests();
  const copilot = await runClinicalCopilotTests();
  const radiation = await runRadiationTests();

  const total = dataLayer.total + sim.total + analytics.total + ai.total + copilot.total + radiation.total;
  const passed = dataLayer.passed + sim.passed + analytics.passed + ai.passed + copilot.passed + radiation.passed;
  const failed = dataLayer.failed + sim.failed + analytics.failed + ai.failed + copilot.failed + radiation.failed;

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
