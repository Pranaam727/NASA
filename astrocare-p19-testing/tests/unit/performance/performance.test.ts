import { describe, it, expect } from 'vitest';
import { PerformanceBenchmarker } from '../../../src/performance/PerformanceBenchmarker';
import { BiomedicalValidator } from '../../../src/validation/biomedical/BiomedicalValidator';
import { CalculationValidator } from '../../../src/validation/scientific/CalculationValidator';

describe('Performance Benchmarks & Scalability Budgets', () => {
  const bioValidator = new BiomedicalValidator();

  it('validates 10,000 telemetry records within 100ms latency budget', async () => {
    const batch = PerformanceBenchmarker.generateSyntheticBatch(10000);

    const benchmark = await PerformanceBenchmarker.runBenchmark(
      'parse_10k_telemetry',
      10000,
      () => {
        bioValidator.validate(batch as any);
      },
      100 // 100ms budget
    );

    expect(benchmark.datasetSize).toBe(10000);
    expect(benchmark.durationMs).toBeLessThanOrEqual(benchmark.budgetMaxDurationMs);
    expect(benchmark.budgetPassed).toBe(true);
    expect(benchmark.throughputPerSecond).toBeGreaterThan(50000);
    expect(benchmark.hardwareEnvironment.platform).toBeDefined();
  });

  it('computes 10,000 element moving averages within 50ms latency budget', async () => {
    const series = new Array(10000).fill(0).map((_, i) => 70 + (i % 10));

    const benchmark = await PerformanceBenchmarker.runBenchmark(
      'calculate_10k_moving_avg',
      10000,
      () => {
        CalculationValidator.movingAverage(series, 10);
      },
      50 // 50ms budget
    );

    expect(benchmark.budgetPassed).toBe(true);
    expect(benchmark.durationMs).toBeLessThanOrEqual(50);
  });
});
