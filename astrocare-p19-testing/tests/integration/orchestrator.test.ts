import { describe, it, expect } from 'vitest';
import { TestOrchestrator } from '../../src/engine/TestOrchestrator';
import { TestRegistry } from '../../src/engine/TestRegistry';
import { TestReportGenerator } from '../../src/engine/TestReportGenerator';
import { TestSuiteDefinition } from '../../src/types/test-results';

describe('Test Orchestrator & Report Generator Integration', () => {
  it('executes suites and tracks PASS, FAIL, and BLOCKED statuses accurately', async () => {
    const registry = new TestRegistry();
    const orchestrator = new TestOrchestrator(registry);

    const testSuite: TestSuiteDefinition = {
      id: 'suite-integration-sample',
      name: 'Integration Pipeline Test Suite',
      moduleName: 'Core Platform',
      category: 'INTEGRATION',
      description: 'Tests orchestrator status sequencing and dependency resolution.',
      tests: [
        {
          id: 'test-primary-pass',
          name: 'Primary Passing Test',
          category: 'INTEGRATION',
          moduleName: 'Core Platform',
          description: 'A simple passing test.',
          severity: 'HIGH',
          fn: () => {
            // Passes
          },
        },
        {
          id: 'test-dependent-pass',
          name: 'Dependent Passing Test',
          category: 'INTEGRATION',
          moduleName: 'Core Platform',
          description: 'Depends on test-primary-pass.',
          severity: 'MEDIUM',
          dependsOn: ['test-primary-pass'],
          fn: () => {
            // Should execute and pass
          },
        },
        {
          id: 'test-primary-fail',
          name: 'Failing Test',
          category: 'INTEGRATION',
          moduleName: 'Core Platform',
          description: 'Deliberately throws error.',
          severity: 'CRITICAL',
          fn: () => {
            throw new Error('Simulated critical failure in integration pipeline.');
          },
        },
        {
          id: 'test-blocked-by-failure',
          name: 'Blocked Test',
          category: 'INTEGRATION',
          moduleName: 'Core Platform',
          description: 'Depends on test-primary-fail, so it must be marked BLOCKED.',
          severity: 'HIGH',
          dependsOn: ['test-primary-fail'],
          fn: () => {
            // Should NOT execute!
            throw new Error('This should not have run because it was blocked.');
          },
        },
      ],
    };

    orchestrator.registerSuite(testSuite);
    const report = await orchestrator.runAll();

    expect(report.summary.totalSuites).toBe(1);
    expect(report.summary.totalTests).toBe(4);
    expect(report.summary.passed).toBe(2);
    expect(report.summary.failed).toBe(1);
    expect(report.summary.blocked).toBe(1);

    // Verify blocked test details
    const blockedRes = report.failures.concat(
      report.suiteResults[0].testResults.filter((t) => t.status === 'BLOCKED')
    );
    const blockedItem = blockedRes.find((t) => t.id === 'test-blocked-by-failure');
    expect(blockedItem).toBeDefined();
    expect(blockedItem!.status).toBe('BLOCKED');
    expect(blockedItem!.failureDetails?.blockingReason).toContain('Blocked by test-primary-fail');
  });

  it('exports valid JSON, CSV, and HTML reports', async () => {
    const registry = new TestRegistry();
    const orchestrator = new TestOrchestrator(registry);

    orchestrator.registerSuite({
      id: 'suite-export-test',
      name: 'Export Format Verification',
      moduleName: 'Reporting',
      category: 'FUNCTIONAL',
      description: 'Tests report serializations.',
      tests: [
        {
          id: 'test-export-01',
          name: 'Quick Verification',
          category: 'FUNCTIONAL',
          moduleName: 'Reporting',
          description: 'Passes quickly.',
          severity: 'LOW',
          fn: () => {},
        },
      ],
    });

    const report = await orchestrator.runAll();

    // JSON export
    const jsonStr = TestReportGenerator.toJSON(report);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.reportId).toBe(report.reportId);
    expect(parsed.summary.passed).toBe(1);

    // CSV export
    const csvStr = TestReportGenerator.toCSV(report);
    expect(csvStr).toContain('SuiteID,ModuleName,Category,TestID');
    expect(csvStr).toContain('test-export-01');

    // HTML export
    const htmlStr = TestReportGenerator.toHTML(report);
    expect(htmlStr).toContain('<!DOCTYPE html>');
    expect(htmlStr).toContain('AstroCare Quality Assurance & Verification Report');
    expect(htmlStr).toContain('test-export-01');
  });
});
