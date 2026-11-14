// ============================================================================
// AstroCare Module F: Security & Privacy Readiness Review View
// 12-point aerospace biomedical cybersecurity and privacy posture assessment.
// ============================================================================

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { SecurityCheck } from '../types';
import { StatusBadge } from './StatusBadge';

interface SecurityReadinessViewProps {
  securityChecks: SecurityCheck[];
}

export const SecurityReadinessView: React.FC<SecurityReadinessViewProps> = ({
  securityChecks
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = Array.from(new Set(securityChecks.map(s => s.category)));

  const filteredChecks = filterCategory === 'all'
    ? securityChecks
    : securityChecks.filter(s => s.category === filterCategory);

  const compliantCount = securityChecks.filter(s => s.status === 'compliant').length;
  const warningCount = securityChecks.filter(s => s.status === 'warning').length;
  const criticalCount = securityChecks.filter(s => s.status === 'critical_finding').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              SECURITY & PRIVACY READINESS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              12 Security Vector Domains
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Aerospace Biomedical Cybersecurity & PHI Quarantine Review
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Evaluates credential boundaries, JWT transmission, Zod input sanitization, non-diagnostic disclaimers, and zero PHI leakage against OWASP Top 10 and NASA-STD-2820.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            {compliantCount} Compliant
          </span>
          {warningCount > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800">
              {warningCount} Advisories
            </span>
          )}
          {criticalCount > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800">
              {criticalCount} Critical
            </span>
          )}
        </div>
      </div>

      {/* Mandatory Aerospace Disclaimer */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="text-emerald-400 font-bold block mb-0.5">
            Aerospace Biomedical Security Compliance Disclaimer:
          </span>
          A passing status on this readiness matrix confirms adherence to rigorous software engineering best practices, client-side secret quarantine, and synthetic PHI segregation. It does not replace an official Flight Readiness Review (FRR) or authority-to-operate (ATO) certification from NASA Flight Telemetry Security.
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            filterCategory === 'all'
              ? 'bg-cyan-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Domains (12)
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Security Checks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChecks.map(chk => (
          <div 
            key={chk.id} 
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    {chk.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{chk.title}</h3>
                </div>
                <StatusBadge status={chk.status} size="sm" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {chk.description}
              </p>

              {/* Finding Box */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-xs font-mono space-y-1.5 mb-3">
                <div className="text-slate-300">
                  <span className="text-emerald-400 font-bold">Audit Finding: </span>
                  {chk.finding}
                </div>
                <div className="text-slate-400 text-[11px]">
                  <span className="text-cyan-400 font-bold">Recommended Policy: </span>
                  {chk.recommendedFix}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Standard: {chk.standardReference}</span>
              <span>Audited: {new Date(chk.lastAudited).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
