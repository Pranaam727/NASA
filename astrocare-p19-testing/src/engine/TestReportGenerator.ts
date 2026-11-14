/**
 * AstroCare Test Report Generator
 * Generates JSON, HTML, and CSV reports based on real execution results.
 * Strictly adheres to truthfulness: never fabricates success metrics.
 */

import {
  OverallTestReport,
  TestSuiteResult,
  TestCaseResult,
  ModuleHealthSummary,
  IntegrationReadinessReport,
  TestCategory,
} from '../types/test-results';

export class TestReportGenerator {
  /**
   * Builds an OverallTestReport from the collection of executed suite results.
   */
  public static generateReport(
    suiteResults: TestSuiteResult[],
    environmentOptions?: { offlineMode?: boolean; customNotes?: string }
  ): OverallTestReport {
    const reportId = `AC-QA-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const generatedAt = new Date().toISOString();

    let totalTests = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let blocked = 0;
    let warnings = 0;
    let totalDurationMs = 0;

    const allFailures: TestCaseResult[] = [];
    const allWarnings: TestCaseResult[] = [];
    const moduleMap = new Map<string, { total: number; passed: number; failed: number; blocked: number; warnings: number }>();
    const categoryMap = new Map<TestCategory, { total: number; passed: number }>();

    for (const suite of suiteResults) {
      totalDurationMs += suite.durationMs;
      totalTests += suite.totalTests;
      passed += suite.passed;
      failed += suite.failed;
      skipped += suite.skipped;
      blocked += suite.blocked;
      warnings += suite.warnings;

      // Module breakdown
      const modStats = moduleMap.get(suite.moduleName) || {
        total: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
        warnings: 0,
      };
      modStats.total += suite.totalTests;
      modStats.passed += suite.passed;
      modStats.failed += suite.failed;
      modStats.blocked += suite.blocked;
      modStats.warnings += suite.warnings;
      moduleMap.set(suite.moduleName, modStats);

      // Category breakdown
      const catStats = categoryMap.get(suite.category) || { total: 0, passed: 0 };
      catStats.total += suite.totalTests;
      catStats.passed += suite.passed;
      categoryMap.set(suite.category, catStats);

      // Collect failures and warnings
      for (const t of suite.testResults) {
        if (t.status === 'FAIL') allFailures.push(t);
        if (t.status === 'WARNING' || (t.warnings && t.warnings.length > 0)) allWarnings.push(t);
      }
    }

    const passRate = totalTests > 0 ? (passed / totalTests) * 100 : 0;

    // Module Health Summaries
    const moduleHealth: ModuleHealthSummary[] = Array.from(moduleMap.entries()).map(
      ([modName, stats]) => {
        const score = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
        let status: 'HEALTHY' | 'DEGRADED' | 'FAILING' | 'BLOCKED' = 'HEALTHY';
        if (stats.blocked > 0) status = 'BLOCKED';
        else if (stats.failed > 0 && score < 70) status = 'FAILING';
        else if (stats.failed > 0 || stats.warnings > 0) status = 'DEGRADED';

        return {
          moduleName: modName,
          totalTests: stats.total,
          passed: stats.passed,
          failed: stats.failed,
          blocked: stats.blocked,
          warnings: stats.warnings,
          healthScore: score,
          status,
        };
      }
    );

    // Integration Readiness Assessment
    const categoryBreakdown: Record<TestCategory, { total: number; passed: number; score: number }> = {} as any;
    const allCategories: TestCategory[] = [
      'FUNCTIONAL',
      'UNIT',
      'INTEGRATION',
      'E2E',
      'API',
      'BIOMEDICAL',
      'SCIENTIFIC',
      'AI_GROUNDING',
      'NASA_DATA',
      'SECURITY',
      'PERFORMANCE',
      'ACCESSIBILITY',
      'REGRESSION',
    ];

    for (const cat of allCategories) {
      const stats = categoryMap.get(cat) || { total: 0, passed: 0 };
      categoryBreakdown[cat] = {
        total: stats.total,
        passed: stats.passed,
        score: stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 100,
      };
    }

    const blockers: string[] = [];
    const recommendations: string[] = [];

    if (failed > 0) {
      blockers.push(`${failed} test failure(s) detected across test suites.`);
    }
    if (blocked > 0) {
      blockers.push(`${blocked} test(s) BLOCKED due to missing dependencies.`);
    }

    const criticalFailures = allFailures.filter((f) => f.severity === 'CRITICAL');
    if (criticalFailures.length > 0) {
      blockers.push(`${criticalFailures.length} CRITICAL severity test failure(s) require immediate resolution.`);
    }

    if (categoryBreakdown.SECURITY.total > 0 && categoryBreakdown.SECURITY.score < 100) {
      blockers.push('Security verification contains unresolved vulnerabilities or secret leaks.');
    }

    if (categoryBreakdown.BIOMEDICAL.total > 0 && categoryBreakdown.BIOMEDICAL.score < 100) {
      recommendations.push('Review biomedical validation threshold edge cases before flight integration.');
    }

    if (categoryBreakdown.AI_GROUNDING.total > 0 && categoryBreakdown.AI_GROUNDING.score < 100) {
      recommendations.push('Tighten clinical copilot grounding prompts to prevent hallucinated measurements.');
    }

    const overallScore = Math.round(passRate);
    const isReadyForIntegration = blockers.length === 0 && overallScore >= 95;

    const integrationReadiness: IntegrationReadinessReport = {
      overallScore,
      isReadyForIntegration,
      blockers,
      recommendations,
      categoryBreakdown,
      nasaComplianceNote:
        'AstroCare software verification aligns with principles from NASA NPR 7150.2D and NASA-STD-8739.8B. This report is an engineering quality assessment for research and mission decision-support and does not constitute formal NASA flight-qualification certification.',
    };

    return {
      reportId,
      frameworkVersion: '1.0.0',
      generatedAt,
      environment: {
        nodeVersion: typeof process !== 'undefined' ? process.version : 'browser-jsdom',
        os: typeof process !== 'undefined' ? process.platform : 'browser',
        platform: 'AstroCare Quality Architecture v1',
        offlineMode: environmentOptions?.offlineMode ?? true,
      },
      summary: {
        totalSuites: suiteResults.length,
        totalTests,
        passed,
        failed,
        skipped,
        blocked,
        warnings,
        passRate: Math.round(passRate * 10) / 10,
        totalDurationMs: Math.round(totalDurationMs * 10) / 10,
      },
      moduleHealth,
      integrationReadiness,
      suiteResults,
      failures: allFailures,
      warnings: allWarnings,
    };
  }

  /**
   * Export report as JSON formatted string
   */
  public static toJSON(report: OverallTestReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export report as CSV table for analysis
   */
  public static toCSV(report: OverallTestReport): string {
    const headers = [
      'SuiteID',
      'ModuleName',
      'Category',
      'TestID',
      'TestName',
      'Severity',
      'Status',
      'DurationMs',
      'FailureReason',
    ];

    const rows: string[] = [];
    rows.push(headers.join(','));

    for (const suite of report.suiteResults) {
      for (const test of suite.testResults) {
        const failureReason = test.failureDetails
          ? `"${test.failureDetails.message.replace(/"/g, '""')}"`
          : '""';
        const row = [
          `"${suite.id}"`,
          `"${suite.moduleName}"`,
          `"${suite.category}"`,
          `"${test.id}"`,
          `"${test.name.replace(/"/g, '""')}"`,
          `"${test.severity}"`,
          `"${test.status}"`,
          test.durationMs,
          failureReason,
        ];
        rows.push(row.join(','));
      }
    }

    return rows.join('\n');
  }

  /**
   * Export report as standalone, interactive HTML document
   */
  public static toHTML(report: OverallTestReport): string {
    const statusColor = (status: string) => {
      switch (status) {
        case 'PASS':
          return '#10b981';
        case 'FAIL':
          return '#ef4444';
        case 'BLOCKED':
          return '#8b5cf6';
        case 'WARNING':
          return '#f59e0b';
        case 'SKIPPED':
          return '#6b7280';
        default:
          return '#9ca3af';
      }
    };

    const modulesHtml = report.moduleHealth
      .map(
        (m) => `
        <div class="module-card">
          <div class="module-header">
            <h4>${m.moduleName}</h4>
            <span class="badge ${m.status.toLowerCase()}">${m.status} (${m.healthScore}%)</span>
          </div>
          <div class="stats-mini">
            <span>Passed: <strong>${m.passed}</strong></span>
            <span>Failed: <strong style="color: #ef4444">${m.failed}</strong></span>
            <span>Blocked: <strong style="color: #8b5cf6">${m.blocked}</strong></span>
            <span>Total: ${m.totalTests}</span>
          </div>
        </div>
      `
      )
      .join('');

    const suitesHtml = report.suiteResults
      .map(
        (s) => `
        <div class="suite-card">
          <div class="suite-header">
            <div>
              <h3>${s.name}</h3>
              <p class="sub">${s.moduleName} • Category: ${s.category} • ${s.durationMs.toFixed(1)}ms</p>
            </div>
            <div class="suite-counts">
              <span class="pill pass">${s.passed} PASS</span>
              ${s.failed > 0 ? `<span class="pill fail">${s.failed} FAIL</span>` : ''}
              ${s.blocked > 0 ? `<span class="pill blocked">${s.blocked} BLOCKED</span>` : ''}
              ${s.warnings > 0 ? `<span class="pill warn">${s.warnings} WARN</span>` : ''}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Test ID</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              ${s.testResults
                .map(
                  (t) => `
                <tr class="${t.status.toLowerCase()}">
                  <td><span class="tag" style="background:${statusColor(t.status)}">${t.status}</span></td>
                  <td><code>${t.id}</code></td>
                  <td>
                    <strong>${t.name}</strong><br/>
                    <small>${t.description}</small>
                    ${
                      t.failureDetails
                        ? `<pre class="error-box">${escapeHtml(t.failureDetails.message)}</pre>`
                        : ''
                    }
                  </td>
                  <td>${t.severity}</td>
                  <td>${t.durationMs.toFixed(2)} ms</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AstroCare Verification Report - ${report.reportId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    h1 { margin: 0 0 8px 0; color: #38bdf8; font-size: 24px; }
    .sub { color: #94a3b8; font-size: 13px; margin: 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi { background: #131b2e; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; text-align: center; }
    .kpi .num { font-size: 32px; font-weight: bold; margin-top: 4px; }
    .kpi.pass .num { color: #10b981; }
    .kpi.fail .num { color: #ef4444; }
    .kpi.blocked .num { color: #8b5cf6; }
    .module-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .module-card { background: #131b2e; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; }
    .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .module-header h4 { margin: 0; font-size: 16px; color: #f1f5f9; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .badge.healthy { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .badge.degraded { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .badge.failing { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .badge.blocked { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
    .stats-mini { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
    .suite-card { background: #131b2e; border: 1px solid #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .suite-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 12px; }
    .suite-header h3 { margin: 0; font-size: 18px; color: #e2e8f0; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 8px 12px; color: #64748b; font-weight: 600; border-bottom: 1px solid #1e293b; }
    td { padding: 10px 12px; border-bottom: 1px solid #0f172a; vertical-align: top; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; color: #fff; font-size: 10px; font-weight: bold; }
    .pill { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-left: 6px; }
    .pill.pass { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .pill.fail { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .pill.blocked { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
    .pill.warn { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .error-box { background: #1e1b2e; color: #f87171; border-left: 3px solid #ef4444; padding: 8px; margin-top: 6px; font-size: 11px; white-space: pre-wrap; font-family: monospace; border-radius: 4px; }
    .compliance-box { background: #0f172a; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 4px; margin-top: 24px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>AstroCare Quality Assurance & Verification Report</h1>
        <p class="sub">Report ID: ${report.reportId} | Generated: ${report.generatedAt} | Environment: ${report.environment.platform} (Offline Mode: ${report.environment.offlineMode})</p>
      </div>
      <div>
        <span class="pill ${report.integrationReadiness.isReadyForIntegration ? 'pass' : 'fail'}" style="font-size: 14px; padding: 8px 16px;">
          ${report.integrationReadiness.isReadyForIntegration ? 'READY FOR INTEGRATION' : 'INTEGRATION BLOCKED'}
        </span>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi pass">
        <div class="sub">Passed Tests</div>
        <div class="num">${report.summary.passed}</div>
      </div>
      <div class="kpi fail">
        <div class="sub">Failed Tests</div>
        <div class="num">${report.summary.failed}</div>
      </div>
      <div class="kpi blocked">
        <div class="sub">Blocked Tests</div>
        <div class="num">${report.summary.blocked}</div>
      </div>
      <div class="kpi">
        <div class="sub">Pass Rate</div>
        <div class="num">${report.summary.passRate}%</div>
      </div>
      <div class="kpi">
        <div class="sub">Execution Time</div>
        <div class="num">${report.summary.totalDurationMs.toFixed(0)}ms</div>
      </div>
    </div>

    <h2 style="font-size: 18px; margin-bottom: 12px; color: #94a3b8;">Module Verification Status</h2>
    <div class="module-grid">
      ${modulesHtml}
    </div>

    <h2 style="font-size: 18px; margin-bottom: 12px; color: #94a3b8;">Test Suites Execution Detail</h2>
    ${suitesHtml}

    <div class="compliance-box">
      <strong>Engineering Assurance Standards Notice:</strong><br/>
      ${report.integrationReadiness.nasaComplianceNote}
    </div>
  </div>
</body>
</html>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
