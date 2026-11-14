import React from 'react';
import { ModuleHealthSummary } from '../types/test-results';
import { Activity } from 'lucide-react';

interface Props {
  modules: ModuleHealthSummary[];
}

export const ModuleHealthView: React.FC<Props> = ({ modules }) => {
  if (!modules || modules.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return '#10b981';
      case 'DEGRADED':
        return '#f59e0b';
      case 'FAILING':
        return '#ef4444';
      case 'BLOCKED':
        return '#8b5cf6';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', color: '#cbd5e1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={18} color="#38bdf8" />
        AstroCare Module Health & Contract Validation
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {modules.map((m) => {
          const color = getStatusColor(m.status);
          return (
            <div
              key={m.moduleName}
              style={{
                background: '#131b2e',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '16px',
                borderLeft: `4px solid ${color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#f1f5f9' }}>{m.moduleName}</h4>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: `${color}22`,
                    color,
                  }}
                >
                  {m.status} ({m.healthScore}%)
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', margin: '10px 0', overflow: 'hidden' }}>
                <div style={{ width: `${m.healthScore}%`, height: '100%', background: color }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                <span>Passed: <strong style={{ color: '#10b981' }}>{m.passed}</strong></span>
                {m.failed > 0 && <span>Failed: <strong style={{ color: '#ef4444' }}>{m.failed}</strong></span>}
                {m.blocked > 0 && <span>Blocked: <strong style={{ color: '#8b5cf6' }}>{m.blocked}</strong></span>}
                {m.warnings > 0 && <span>Warnings: <strong style={{ color: '#f59e0b' }}>{m.warnings}</strong></span>}
                <span>Total: {m.totalTests}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
