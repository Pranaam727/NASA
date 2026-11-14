/**
 * AstroCare Central Test Orchestrator
 * Controls suite discovery, execution sequencing, dependency resolution,
 * timing, error isolation, and aggregated report synthesis.
 */

import {
  TestSuiteDefinition,
  TestSuiteResult,
  TestCaseResult,
  OverallTestReport,
  TestStatus,
} from '../types/test-results';
import { TestRegistry } from './TestRegistry';
import { TestReportGenerator } from './TestReportGenerator';

export type ProgressCallback = (progress: {
  currentSuite: string;
  currentTest: string;
  completedTests: number;
  totalTests: number;
  latestResult: TestCaseResult;
}) => void;

export class TestOrchestrator {
  private registry: TestRegistry;
  private isExecuting: boolean = false;

  constructor(registry?: TestRegistry) {
    this.registry = registry || new TestRegistry();
  }

  public getRegistry(): TestRegistry {
    return this.registry;
  }

  /**
   * Register a suite directly into the orchestrator
   */
  public registerSuite(suite: TestSuiteDefinition): void {
    this.registry.registerSuite(suite);
  }

  /**
   * Discover and return registered suites
   */
  public discoverSuites(): TestSuiteDefinition[] {
    return this.registry.getAllSuites();
  }

  /**
   * Run all registered suites sequentially with dependency tracking
   */
  public async runAll(onProgress?: ProgressCallback): Promise<OverallTestReport> {
    const suites = this.registry.getAllSuites();
    return this.runSuites(suites, onProgress);
  }

  /**
   * Run specific suites by their IDs
   */
  public async runSuitesByIds(
    suiteIds: string[],
    onProgress?: ProgressCallback
  ): Promise<OverallTestReport> {
    const suites = this.registry
      .getAllSuites()
      .filter((s) => suiteIds.includes(s.id));
    return this.runSuites(suites, onProgress);
  }

  /**
   * Core execution pipeline
   */
  public async runSuites(
    suites: TestSuiteDefinition[],
    onProgress?: ProgressCallback
  ): Promise<OverallTestReport> {
    if (this.isExecuting) {
      throw new Error('TestOrchestrator is already executing a run.');
    }
    this.isExecuting = true;

    const suiteResults: TestSuiteResult[] = [];
    const testStatusMap = new Map<string, TestStatus>();

    // Calculate total tests for progress tracking
    const totalTestsToRun = suites.reduce((acc, s) => acc + s.tests.length, 0);
    let completedTestsCount = 0;

    try {
      for (const suite of suites) {
        const suiteStartTime = performance.now();
        const testResults: TestCaseResult[] = [];

        let passed = 0;
        let failed = 0;
        let skipped = 0;
        let blocked = 0;
        let warnings = 0;

        for (const test of suite.tests) {
          // Check dependencies
          let isBlocked = false;
          let blockingDep = '';
          if (test.dependsOn && test.dependsOn.length > 0) {
            for (const depId of test.dependsOn) {
              const depStatus = testStatusMap.get(depId);
              if (depStatus !== 'PASS') {
                isBlocked = true;
                blockingDep = `${depId} (status: ${depStatus || 'NOT_EXECUTED'})`;
                break;
              }
            }
          }

          let result: TestCaseResult;
          const testTimestamp = new Date().toISOString();

          if (isBlocked) {
            result = {
              id: test.id,
              name: test.name,
              category: test.category,
              moduleName: test.moduleName,
              description: test.description,
              severity: test.severity,
              status: 'BLOCKED',
              durationMs: 0,
              timestamp: testTimestamp,
              failureDetails: {
                message: `Prerequisite dependency test "${blockingDep}" did not pass.`,
                blockingReason: `Blocked by ${blockingDep}`,
              },
            };
            blocked++;
          } else {
            const startTest = performance.now();
            try {
              // Execute test function with optional timeout
              if (test.timeoutMs && test.timeoutMs > 0) {
                await Promise.race([
                  test.fn(),
                  new Promise((_, reject) =>
                    setTimeout(
                      () => reject(new Error(`Test timed out after ${test.timeoutMs}ms`)),
                      test.timeoutMs
                    )
                  ),
                ]);
              } else {
                await test.fn();
              }
              const duration = performance.now() - startTest;

              result = {
                id: test.id,
                name: test.name,
                category: test.category,
                moduleName: test.moduleName,
                description: test.description,
                severity: test.severity,
                status: 'PASS',
                durationMs: Math.round(duration * 100) / 100,
                timestamp: testTimestamp,
              };
              passed++;
            } catch (err: unknown) {
              const duration = performance.now() - startTest;
              const error = err instanceof Error ? err : new Error(String(err));
              const isWarning = (err as any)?.isWarning || false;

              result = {
                id: test.id,
                name: test.name,
                category: test.category,
                moduleName: test.moduleName,
                description: test.description,
                severity: test.severity,
                status: isWarning ? 'WARNING' : 'FAIL',
                durationMs: Math.round(duration * 100) / 100,
                timestamp: testTimestamp,
                failureDetails: {
                  message: error.message,
                  stack: error.stack,
                  expected: (err as any)?.expected,
                  actual: (err as any)?.actual,
                },
              };

              if (isWarning) warnings++;
              else failed++;
            }
          }

          testStatusMap.set(test.id, result.status);
          testResults.push(result);
          this.registry.recordResult(result);
          completedTestsCount++;

          if (onProgress) {
            onProgress({
              currentSuite: suite.name,
              currentTest: test.name,
              completedTests: completedTestsCount,
              totalTests: totalTestsToRun,
              latestResult: result,
            });
          }
        }

        const suiteDuration = performance.now() - suiteStartTime;
        suiteResults.push({
          id: suite.id,
          name: suite.name,
          moduleName: suite.moduleName,
          category: suite.category,
          durationMs: Math.round(suiteDuration * 100) / 100,
          totalTests: suite.tests.length,
          passed,
          failed,
          skipped,
          blocked,
          warnings,
          testResults,
        });
      }

      return TestReportGenerator.generateReport(suiteResults);
    } finally {
      this.isExecuting = false;
    }
  }
}
