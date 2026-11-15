import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';
import { getSeverityBg, getSeverityColor } from '../utils/ui';
import type { MissionRiskAssessment } from '../contracts/index';

function RiskCard({ risk }: { risk: MissionRiskAssessment }) {
  const colorClass = getSeverityColor(risk.severity);
  const bgClass = getSeverityBg(risk.severity);

  return (
    <div className={`panel p-4 border ${bgClass.includes('rose') ? 'border-rose-800/50' : bgClass.includes('orange') ? 'border-orange-800/50' : bgClass.includes('amber') ? 'border-amber-800/50' : 'border-space-700'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono font-bold text-sm text-slate-100">{risk.category}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`status-badge border ${bgClass}`}>{risk.severity}</span>
          <span className={`font-mono font-bold text-lg ${colorClass}`}>{risk.riskScore}</span>
        </div>
      </div>

      {/* 5×5 score breakdown */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
        <span>L({risk.likelihood}) × C({risk.consequence}) = {risk.riskScore}</span>
        <span className="text-slate-700">|</span>
        <span>Max possible: 25</span>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-slate-500">Observed conditions: </span>
          <span className="text-slate-300 font-mono">{risk.observedConditions}</span>
        </div>
        {risk.triggeringEvents.length > 0 && (
          <div>
            <span className="text-slate-500">Triggered by: </span>
            <span className="text-slate-300">{risk.triggeringEvents.join(', ')}</span>
          </div>
        )}
        <div>
          <span className="text-slate-500">Rationale: </span>
          <span className="text-slate-400">{risk.rationale}</span>
        </div>
        <div className="p-2 bg-space-850 rounded border border-space-750 mt-2">
          <span className="text-teal-500 font-semibold">Suggested Response: </span>
          <span className="text-teal-300">{risk.suggestedOperationalResponse}</span>
        </div>
      </div>
    </div>
  );
}

export default function RiskAssessment() {
  const { currentTelemetry } = useSimStore();
  const tel = currentTelemetry;

  const risks = tel?.risks ?? [];
  const ordered = [...risks].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert size={18} className="text-rose-400" />
          Risk Assessment
        </h1>
        {tel && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">Compound Risk Score:</span>
            <span className={`font-mono font-bold text-xl ${
              tel.compoundRiskScore > 60 ? 'text-rose-400' :
              tel.compoundRiskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
            }`}>{tel.compoundRiskScore.toFixed(0)}</span>
            <span className="text-xs text-slate-600 font-mono">(sum of all categories)</span>
          </div>
        )}
      </div>

      <div className="bg-amber-900/20 border border-amber-700/40 rounded px-4 py-2 text-xs text-amber-400 font-mono flex items-center gap-2">
        <Info size={12} />
        Risk scores use a simplified 5×5 Likelihood–Consequence matrix inspired by NASA Systems Engineering SP-2016-6105.
        These are NOT NASA-approved mission flight rules. Scores are computed deterministically from simulated telemetry thresholds.
      </div>

      {/* Score explanation */}
      <div className="panel p-4">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Risk Score Methodology</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { label: 'Nominal', l: 1, c: 1, score: '1', color: 'text-emerald-400' },
            { label: 'Low', l: 2, c: 2, score: '4', color: 'text-yellow-400' },
            { label: 'Moderate', l: 3, c: 3, score: '9', color: 'text-amber-400' },
            { label: 'High', l: 4, c: 4, score: '16', color: 'text-orange-400' },
            { label: 'Critical', l: 5, c: 5, score: '25', color: 'text-rose-400' },
          ].map(r => (
            <div key={r.label} className="bg-space-850 border border-space-750 rounded p-2 text-center">
              <div className={`font-bold ${r.color}`}>{r.label}</div>
              <div className="text-slate-600 mt-1">L{r.l} × C{r.c}</div>
              <div className={`font-bold text-lg ${r.color}`}>{r.score}</div>
            </div>
          ))}
        </div>
      </div>

      {!tel ? (
        <div className="panel p-12 text-center text-slate-500 font-mono">
          Run a simulation to generate risk assessments.
        </div>
      ) : (
        <>
          {ordered.some(r => r.severity === 'Critical') && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/30 border border-rose-800/50 rounded alert-blink">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span className="text-sm font-mono text-rose-300 font-bold">
                CRITICAL RISK DETECTED — High-severity events remain visible even when other systems are nominal.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ordered.map(r => <RiskCard key={r.category} risk={r} />)}
          </div>
        </>
      )}
    </div>
  );
}

function ShieldAlert({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
