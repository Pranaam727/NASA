import React, { useState, useEffect, useMemo } from 'react';
import { TestOrchestrator } from '../engine/TestOrchestrator';
import { TestReportGenerator } from '../engine/TestReportGenerator';
import { OverallTestReport, TestCategory, TestStatus } from '../types/test-results';
import { createDefaultSuites } from './default-suites';
import { TestSummaryCards } from './TestSummaryCards';
import { ModuleHealthView } from './ModuleHealthView';
import { SecurityPerfView } from './SecurityPerfView';
import {
  Play,
  RotateCcw,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';

export const QADashboard: React.FC = () => {
  const [orchestrator] = useState(() => {
    const orch = new TestOrchestrator();
    const defaultSuites = createDefaultSuites();
    defaultSuites.forEach((s) => orch.registerSuite(s));
    return orch;
  });

  const [report, setReport] = useState<OverallTestReport | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{
    suite: string;
    test: string;
    percent: number;
  }>({ suite: '', test: '', percent: 0 });

  // Filtering states
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [expandedTestIds, setExpandedTestIds] = useState<Set<string>>(new Set());

  // Execute all registered suites
  const handleRunAll = async () => {
    setIsExecuting(true);
    setProgressInfo({ suite: 'Initializing test execution...', test: '', percent: 0 });

    try {
      const generatedReport = await orchestrator.runAll((p) => {
        const pct = Math.round((p.completedTests / p.totalTests) * 100);
        setProgressInfo({
          suite: p.currentSuite,
          test: p.currentTest,
          percent: pct,
        });
      });
      setReport(generatedReport);
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Run automatically on initial mount so real data is immediately displayed
  useEffect(() => {
    handleRunAll();
  }, []);

  const toggleExpand = (testId: string) => {
    setExpandedTestIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) next.delete(testId);
      else next.add(testId);
      return next;
    });
  };

  // Export handlers
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!report) return;
    downloadFile(TestReportGenerator.toJSON(report), `AstroCare_QA_Report_${report.reportId}.json`, 'application/json');
  };

  const handleExportHTML = () => {
    if (!report) return;
    downloadFile(TestReportGenerator.toHTML(report), `AstroCare_QA_Report_${report.reportId}.html`, 'text/html');
  };

  const handleExportCSV = () => {
    if (!report) return;
    downloadFile(TestReportGenerator.toCSV(report), `AstroCare_QA_Report_${report.reportId}.csv`, 'text/csv');
  };

  // Filtered test cases
  const filteredSuites = useMemo(() => {
    if (!report) return [];

    return report.suiteResults
      .filter((s) => {
        if (selectedModule !== 'ALL' && s.moduleName !== selectedModule) return false;
        if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
        return true;
      })
      .map((suite) => {
        const tests = suite.testResults.filter((t) => {
          if (selectedSeverity !== 'ALL' && t.severity !== selectedSeverity) return false;
          if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
          return true;
        });
        return { ...suite, testResults: tests };
      })
      .filter((s) => s.testResults.length > 0);
  }, [report, selectedModule, selectedCategory, selectedSeverity, selectedStatus]);

  // Unique lists for dropdowns
  const availableModules = useMemo(() => {
    if (!report) return [];
    return Array.from(new Set(report.suiteResults.map((s) => s.moduleName)));
  }, [report]);

  const availableCategories: TestCategory[] = [
    'BIOMEDICAL',
    'SCIENTIFIC',
    'AI_GROUNDING',
    'NASA_DATA',
    'SECURITY',
    'PERFORMANCE',
    'REGRESSION',
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#e2e8f0', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: '#0284c7', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                PROMPT 19/21
              </span>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#38bdf8' }}>
                AstroCare Quality Assurance & Scientific Validation Framework
              </h1>
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
              Aerospace Biomedical Intelligence • Automated Test Orchestration • NASA Standards Traceability
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleRunAll}
              disabled={isExecuting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isExecuting ? '#475569' : '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isExecuting ? 'not-allowed' : 'pointer',
              }}
            >
              {isExecuting ? <RotateCcw className="animate-spin" size={16} /> : <Play size={16} />}
              {isExecuting ? 'Executing Tests...' : 'Run All Verification Suites'}
            </button>

            {/* Export Dropdown buttons */}
            <button
              onClick={handleExportHTML}
              disabled={!report || isExecuting}
              title="Download Standalone HTML Report"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                cursor: !report ? 'not-allowed' : 'pointer',
              }}
            >
              <FileCode size={16} />
              HTML Report
            </button>

            <button
              onClick={handleExportJSON}
              disabled={!report || isExecuting}
              title="Download JSON Report"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1e293b',
                color: '#10b981',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                cursor: !report ? 'not-allowed' : 'pointer',
              }}
            >
              <Download size={16} />
              JSON
            </button>

            <button
              onClick={handleExportCSV}
              disabled={!report || isExecuting}
              title="Download CSV Results"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1e293b',
                color: '#f59e0b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                cursor: !report ? 'not-allowed' : 'pointer',
              }}
            >
              <FileSpreadsheet size={16} />
              CSV
            </button>
          </div>
        </div>

        {/* Live execution progress bar */}
        {isExecuting && (
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: '#38bdf8' }}>{progressInfo.suite} &rsaquo; {progressInfo.test}</span>
              <span style={{ fontWeight: 'bold' }}>{progressInfo.percent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressInfo.percent}%`, height: '100%', background: '#38bdf8', transition: 'width 0.2s' }} />
            </div>
          </div>
        )}

        {/* Summary KPI Cards */}
        <TestSummaryCards report={report} isExecuting={isExecuting} />

        {/* Module Health Overview */}
        {report && <ModuleHealthView modules={report.moduleHealth} />}

        {/* Security & Performance Insights */}
        {report && <SecurityPerfView readiness={report.integrationReadiness} />}

        {/* Filters Bar */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
            <Filter size={16} />
            <strong>Filter Test Executions</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {/* Module Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>MODULE</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px 10px', borderRadius: '6px', fontSize: '13px' }}
              >
                <option value="ALL">All Modules ({availableModules.length})</option>
                {availableModules.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>CATEGORY</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px 10px', borderRadius: '6px', fontSize: '13px' }}
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>SEVERITY</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px 10px', borderRadius: '6px', fontSize: '13px' }}
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>STATUS</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px 10px', borderRadius: '6px', fontSize: '13px' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="WARNING">WARNING</option>
              </select>
            </div>
          </div>
        </div>

        {/* Suites & Test Cases List */}
        <div>
          {filteredSuites.length === 0 ? (
            <div style={{ padding: '40px', background: '#131b2e', borderRadius: '10px', textAlign: 'center', color: '#94a3b8' }}>
              No test suites match the selected filter criteria.
            </div>
          ) : (
            filteredSuites.map((suite) => (
              <div
                key={suite.id}
                style={{
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Suite Header */}
                <div
                  style={{
                    background: '#1a233a',
                    padding: '16px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #1e293b',
                    gap: '12px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#f1f5f9' }}>{suite.name}</h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      {suite.moduleName} • Category: <span style={{ color: '#38bdf8' }}>{suite.category}</span> • Duration: {suite.durationMs.toFixed(1)} ms
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                      {suite.passed} PASS
                    </span>
                    {suite.failed > 0 && (
                      <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                        {suite.failed} FAIL
                      </span>
                    )}
                    {suite.blocked > 0 && (
                      <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                        {suite.blocked} BLOCKED
                      </span>
                    )}
                    {suite.warnings > 0 && (
                      <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                        {suite.warnings} WARN
                      </span>
                    )}
                  </div>
                </div>

                {/* Test Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#111827', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                        <th style={{ padding: '10px 16px', width: '40px' }}></th>
                        <th style={{ padding: '10px 16px', width: '90px' }}>Status</th>
                        <th style={{ padding: '10px 16px', width: '100px' }}>Test ID</th>
                        <th style={{ padding: '10px 16px' }}>Name & Description</th>
                        <th style={{ padding: '10px 16px', width: '100px' }}>Severity</th>
                        <th style={{ padding: '10px 16px', width: '90px', textAlign: 'right' }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suite.testResults.map((test) => {
                        const isExpanded = expandedTestIds.has(test.id);
                        const statusColors: Record<TestStatus, string> = {
                          PASS: '#10b981',
                          FAIL: '#ef4444',
                          BLOCKED: '#8b5cf6',
                          WARNING: '#f59e0b',
                          SKIPPED: '#64748b',
                        };

                        return (
                          <React.Fragment key={test.id}>
                            <tr
                              onClick={() => toggleExpand(test.id)}
                              style={{
                                borderBottom: '1px solid #1e293b',
                                cursor: 'pointer',
                                background: isExpanded ? '#1a233a' : 'transparent',
                              }}
                            >
                              <td style={{ padding: '12px 16px', color: '#64748b' }}>
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    background: statusColors[test.status],
                                  }}
                                >
                                  {test.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#94a3b8' }}>
                                {test.id}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{test.name}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{test.description}</div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color:
                                      test.severity === 'CRITICAL'
                                        ? '#ef4444'
                                        : test.severity === 'HIGH'
                                        ? '#f59e0b'
                                        : '#38bdf8',
                                  }}
                                >
                                  {test.severity}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'monospace', color: '#cbd5e1' }}>
                                {test.durationMs.toFixed(2)} ms
                              </td>
                            </tr>

                            {/* Expanded Details Row */}
                            {isExpanded && (
                              <tr style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
                                <td colSpan={6} style={{ padding: '16px 24px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '12px' }}>
                                    <div>
                                      <div style={{ color: '#64748b', marginBottom: '4px' }}>EXECUTION METADATA</div>
                                      <div><strong>Module:</strong> {test.moduleName}</div>
                                      <div><strong>Category:</strong> {test.category}</div>
                                      <div><strong>Timestamp:</strong> {test.timestamp}</div>
                                    </div>

                                    {test.failureDetails && (
                                      <div style={{ gridColumn: '1 / -1', background: '#1e1b2e', borderLeft: '3px solid #ef4444', padding: '12px', borderRadius: '4px' }}>
                                        <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '4px' }}>
                                          FAILURE OR BLOCKING DETAILS
                                        </div>
                                        <pre style={{ margin: 0, color: '#fca5a5', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                          {test.failureDetails.message}
                                        </pre>
                                        {test.failureDetails.stack && (
                                          <pre style={{ margin: '8px 0 0 0', color: '#94a3b8', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px' }}>
                                            {test.failureDetails.stack}
                                          </pre>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
