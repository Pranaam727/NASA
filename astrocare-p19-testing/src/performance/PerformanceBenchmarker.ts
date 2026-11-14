/**
 * AstroCare Performance Benchmarker
 * Real execution latency and throughput measurements against synthetic datasets.
 * Configurable performance budgets and environment identification.
 * Does not fabricate benchmarks.
 */

export interface PerformanceBudget {
  name: string;
  maxDurationMs: number;
}

export interface BenchmarkResult {
  benchmarkName: string;
  datasetSize: number;
  durationMs: number;
  throughputPerSecond: number;
  budgetPassed: boolean;
  budgetMaxDurationMs: number;
  hardwareEnvironment: {
    platform: string;
    nodeVersion: string;
    timestamp: string;
  };
}

export class PerformanceBenchmarker {
  private static DEFAULT_BUDGETS: Record<string, number> = {
    'parse_10k_telemetry': 100, // 10,000 records must parse in < 100ms
    'calculate_10k_moving_avg': 50, // 10,000 numbers in < 50ms
    'radiation_aggregation_1k': 25, // 1,000 radiation samples in < 25ms
    'report_generation_100_suites': 50, // 100 suites report generated in < 50ms
  };

  /**
   * Benchmark synchronous or asynchronous task
   */
  public static async runBenchmark(
    name: string,
    datasetSize: number,
    taskFn: () => Promise<void> | void,
    customBudgetMs?: number
  ): Promise<BenchmarkResult> {
    const budgetMs = customBudgetMs || this.DEFAULT_BUDGETS[name] || 200;

    const start = performance.now();
    await taskFn();
    const duration = performance.now() - start;

    const throughput = datasetSize > 0 ? (datasetSize / Math.max(duration, 0.001)) * 1000 : 0;

    return {
      benchmarkName: name,
      datasetSize,
      durationMs: Math.round(duration * 100) / 100,
      throughputPerSecond: Math.round(throughput),
      budgetPassed: duration <= budgetMs,
      budgetMaxDurationMs: budgetMs,
      hardwareEnvironment: {
        platform: typeof process !== 'undefined' ? process.platform : 'browser',
        nodeVersion: typeof process !== 'undefined' ? process.version : 'browser-jsdom',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Helper to generate synthetic telemetry batches for load testing
   */
  public static generateSyntheticBatch(count: number): Array<{
    recordId: string;
    astronautId: string;
    missionId: string;
    timestamp: string;
    metricType: 'heart_rate';
    value: number;
    unit: 'bpm';
    sourceDevice: string;
  }> {
    const baseTime = Date.now();
    const records = new Array(count);

    for (let i = 0; i < count; i++) {
      records[i] = {
        recordId: `SYNTH-REC-${i}`,
        astronautId: `ASTRO-${i % 6}`,
        missionId: 'MISSION-ARTEMIS-III',
        timestamp: new Date(baseTime + i * 1000).toISOString(),
        metricType: 'heart_rate',
        value: 60 + Math.sin(i / 10) * 15 + (i % 5),
        unit: 'bpm',
        sourceDevice: 'BioVest-Sensor-Array-Alpha',
      };
    }

    return records;
  }
}
