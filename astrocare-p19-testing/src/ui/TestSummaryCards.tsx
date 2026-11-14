import React from 'react';
import { OverallTestReport } from '../types/test-results';
import { CheckCircle2, XCircle, AlertTriangle, ShieldAlert, Clock, Gauge } from 'lucide-react';

interface Props {
  report: OverallTestReport | null;
  isExecuting: boolean;
}

export const TestSummaryCards: React.FC<Props> = ({ report, isExecuting }) => {
  if (!report && !isExecuting) {
    return (
      <div style={{ padding: '24px', background: '#131b2e', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }}>
        No test runs recorded yet. Click "Run All Verification Suites" to execute real in-memory tests.
      </div>
    );
  }

  const summary = report?.summary || {
    passed: 0,
    failed: 0,
    blocked: 0,
    warnings: 0,
    totalTests: 0,
    passRate: 0,
    totalDurationMs: 0,
  };

  const isReady = report?.integrationReadiness?.isReadyForIntegration;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {/* Passed */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
            <span>Passed Tests</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginTop: '6px' }}>
            {summary.passed}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {summary.totalTests > 0 ? `${summary.passRate}% pass rate` : 'Awaiting run'}
          </div>
        </div>

        {/* Failed */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
            <span>Failed Tests</span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: summary.failed > 0 ? '#ef4444' : '#64748b', marginTop: '6px' }}>
            {summary.failed}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {summary.failed > 0 ? 'Resolution required' : 'Zero failures'}
          </div>
        </div>

        {/* Blocked */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
            <span>Blocked Tests</span>
            <AlertTriangle size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: summary.blocked > 0 ? '#8b5cf6' : '#64748b', marginTop: '6px' }}>
            {summary.blocked}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Missing dependency gates
          </div>
        </div>

        {/* Warnings */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
            <span>Quality Warnings</span>
            <ShieldAlert size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: summary.warnings > 0 ? '#f59e0b' : '#64748b', marginTop: '6px' }}>
            {summary.warnings}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Threshold / Rate-of-change flags
          </div>
        </div>

        {/* Duration */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
            <span>Execution Duration</span>
            <Clock size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#38bdf8', marginTop: '6px' }}>
            {summary.totalDurationMs.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>ms</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Total active runtime
          </div>
        </div>

        {/* Integration Readiness */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
            <span>Integration Status</span>
            <Gauge size={18} color={isReady ? '#10b981' : '#f59e0b'} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: isReady ? '#10b981' : '#f59e0b', marginTop: '14px' }}>
            {isReady ? 'READY FOR MERGE' : 'GATE CHECKING'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {report?.integrationReadiness?.blockers.length || 0} blockers identified
          </div>
        </div>
      </div>
    </div>
  );
};
