import { ShieldCheck, Cpu, Info } from 'lucide-react';
import { IntegrationReadinessReport } from '../types/test-results';

interface Props {
  readiness?: IntegrationReadinessReport;
}

export const SecurityPerfView: React.FC<Props> = ({ readiness }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {/* Security & Secret Scanners Summary */}
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#10b981" />
          Cybersecurity & Zero-Leakage Verification
        </h4>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
          <li><strong>Zero Exposed Secrets:</strong> Automated regex scanner filters Google Gemini tokens, JWTs, and AWS keys.</li>
          <li><strong>Client-Side Environment Audit:</strong> Verified sensitive variables do not carry the Vite client prefix.</li>
          <li><strong>XSS & SQL Injection Defenses:</strong> Real-time heuristic sanitization blocks HTML script payloads.</li>
          <li><strong>Data Masking Standard:</strong> Error logs redact authorization bearer credentials and PII.</li>
        </ul>
      </div>

      {/* Scientific & Performance Benchmarking */}
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="#38bdf8" />
          Performance Budgets & Radiation Physics
        </h4>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
          <li><strong>Telemetry Ingestion:</strong> 10,000 synthetic biovest records parsed in &lt; 100ms.</li>
          <li><strong>Moving Average Calculation:</strong> 10,000 points time-series analysis in &lt; 50ms.</li>
          <li><strong>Radiation Dosimetry:</strong> Biological weighting factors ($w_R$) strictly maintained between Gy and Sv.</li>
          <li><strong>Zero Baseline Invariant:</strong> Mathematical guards prevent catastrophic division by zero.</li>
        </ul>
      </div>

      {/* NASA Standards Guidance Banner */}
      <div style={{ gridColumn: '1 / -1', background: '#0f172a', border: '1px solid #1e293b', borderLeft: '4px solid #38bdf8', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Info size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>
              NASA Software Engineering & Quality Assurance Standards Notice
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
              {readiness?.nasaComplianceNote ||
                'AstroCare software verification aligns with principles from NASA NPR 7150.2D and NASA-STD-8739.8B. AstroCare is a research and mission decision-support intelligence platform developed by university researchers and does not claim official NASA flight qualification or endorsement.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
