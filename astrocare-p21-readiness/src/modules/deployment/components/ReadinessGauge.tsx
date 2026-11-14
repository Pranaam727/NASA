// ============================================================================
// AstroCare Deployment Readiness Score Gauge & Domain Breakdown
// ============================================================================

import React from 'react';
import { ReadinessScoreBreakdown } from '../services/readinessCalculator';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface ReadinessGaugeProps {
  breakdown: ReadinessScoreBreakdown;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  breakdown,
  onRefresh,
  isRefreshing
}) => {
  const { overallScore, statusLabel } = breakdown;

  // Determine stroke color based on realistic aerospace threshold
  let strokeColor = '#06b6d4'; // cyan
  if (overallScore < 60) strokeColor = '#ef4444'; // red
  else if (overallScore < 80) strokeColor = '#f59e0b'; // amber
  else strokeColor = '#10b981'; // emerald

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
              {/* Background Track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {overallScore}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Readiness
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded uppercase font-semibold tracking-wider bg-slate-800 text-cyan-400 border border-cyan-800/50">
                P21 VERIFICATION STATUS
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                statusLabel === 'READINESS_BLOCKED' 
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800' 
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
              }`}>
                {statusLabel.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Mission Deployment Readiness Cockpit
            </h2>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Real-time multi-vector evaluation across 21 modules, NASA API connectivity, secret quarantine, security policies, and test suites.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> {breakdown.passedCount} Passed
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" /> {breakdown.warningCount} Advisories
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-3.5 h-3.5" /> {breakdown.activeBlockersCount} Blockers
              </span>
            </div>
          </div>
        </div>

        {/* Domain Score Bars */}
        <div className="w-full md:w-80 grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Modules</span>
              <span className="font-mono text-cyan-300 font-semibold">{breakdown.moduleScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.moduleScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Environment</span>
              <span className="font-mono text-cyan-300 font-semibold">{breakdown.environmentScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.environmentScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>NASA Sources</span>
              <span className="font-mono text-cyan-300 font-semibold">{breakdown.nasaScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.nasaScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Security</span>
              <span className="font-mono text-cyan-300 font-semibold">{breakdown.securityScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.securityScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Test Suites</span>
              <span className="font-mono text-cyan-300 font-semibold">{breakdown.testScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.testScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Release Checklist</span>
              <span className="font-mono text-cyan-300 font-semibold">{breakdown.checklistScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.checklistScore}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
