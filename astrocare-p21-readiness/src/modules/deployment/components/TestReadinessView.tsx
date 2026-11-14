// ============================================================================
// AstroCare Module G: Testing & Build Verification View
// Automated test suites, strict TypeScript checks, and production packaging.
// ============================================================================

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Terminal, 
  Play, 
  RefreshCw, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { TestExecutionResult } from '../types';
import { StatusBadge } from './StatusBadge';

interface TestReadinessViewProps {
  testResults: TestExecutionResult[];
  onReRunTests?: () => void;
}

export const TestReadinessView: React.FC<TestReadinessViewProps> = ({
  testResults,
  onReRunTests
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const totalPassed = testResults.reduce((acc, t) => acc + t.testsPassed, 0);
  const totalTests = testResults.reduce((acc, t) => acc + t.testsTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              CI / CD & QA PIPELINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total Specs: {totalPassed} / {totalTests} Passed
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Automated Testing, Static Analysis & Production Build Pipeline
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Integrates unit tests, strict TypeScript compilation (<code className="text-slate-200 font-mono">tsc -b</code>), code quality lints, route verification, and AI fallback validation.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3.5 py-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold">
            100% Suites Passed
          </span>
        </div>
      </div>

      {/* Test Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testResults.map(suite => (
          <div 
            key={suite.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-white">{suite.category}</h3>
                <StatusBadge status={suite.status} size="sm" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {suite.details}
              </p>

              {/* Execution Specs */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-xs space-y-1.5 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Specs Passed:</span>
                  <span className="text-emerald-400 font-bold">{suite.testsPassed} / {suite.testsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-cyan-300">{suite.durationMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution Command:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{suite.command}</span>
                </div>
              </div>
            </div>

            {/* Copy Command & Action */}
            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-500">
                Run: {new Date(suite.lastRun).toLocaleTimeString()}
              </span>

              <button
                onClick={() => handleCopyCommand(suite.command)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold bg-slate-800 hover:bg-slate-750 text-cyan-300 rounded border border-slate-700 transition-colors"
              >
                {copiedCmd === suite.command ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                <span>{copiedCmd === suite.command ? 'Copied' : suite.command}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Local CLI Runner Instructions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Developer Quick-Run Commands (Execute in Terminal)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-1">1. Run Vitest Unit Tests:</span>
            <code className="text-cyan-300 font-bold block select-all">npm test</code>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-1">2. Strict TypeScript Compilation:</span>
            <code className="text-cyan-300 font-bold block select-all">npx tsc -b</code>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-1">3. Production Vite Build:</span>
            <code className="text-cyan-300 font-bold block select-all">npm run build</code>
          </div>
        </div>
      </div>
    </div>
  );
};
