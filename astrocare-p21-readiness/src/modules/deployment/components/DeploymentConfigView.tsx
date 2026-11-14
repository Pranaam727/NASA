// ============================================================================
// AstroCare Module H: Deployment Configuration Center View
// Production manifests, edge rewrites, and container manifests for target platforms.
// ============================================================================

import React, { useState } from 'react';
import { 
  Cloud, 
  Box, 
  Server, 
  HardDrive, 
  Copy, 
  Check, 
  FileCode, 
  ExternalLink,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { DeploymentTargetConfig } from '../types';
import { DEPLOYMENT_TARGETS_DATA } from '../data/deploymentTargetsData';

export const DeploymentConfigView: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<DeploymentTargetConfig>(DEPLOYMENT_TARGETS_DATA[0]);
  const [copiedFile, setCopiedFile] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              DEPLOYMENT TARGETS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Vercel / Docker / Netlify / Node / NGINX
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Multi-Target Deployment Manifests & Edge Routing Architecture
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Production-ready configuration templates with single-page application (SPA) client rewrites, reverse proxies, and backend secret isolation.
          </p>
        </div>
      </div>

      {/* Target Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {DEPLOYMENT_TARGETS_DATA.map(target => {
          const isSelected = selectedTarget.targetId === target.targetId;
          return (
            <button
              key={target.targetId}
              onClick={() => setSelectedTarget(target)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-500 ring-1 ring-cyan-500 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold">
                  {target.targetId}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <div className="text-xs font-bold text-white line-clamp-1">
                {target.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Target Configuration Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specs Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
              TARGET SPECIFICATIONS
            </span>
            <h3 className="text-base font-bold text-white">{selectedTarget.name}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {selectedTarget.description}
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Build Command</span>
              <span className="text-cyan-300 font-bold">{selectedTarget.buildCommand}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Output Directory</span>
              <span className="text-emerald-400">{selectedTarget.outputDirectory}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Runtime Platform</span>
              <span className="text-slate-200">{selectedTarget.runtimeRequirements}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">SPA Routing Fallback</span>
              <span className="text-slate-300 text-[11px]">{selectedTarget.spaRoutingConfig}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-850 text-xs text-slate-300">
            <span className="text-cyan-400 font-bold block mb-1">Backend Deployment Note:</span>
            {selectedTarget.backendRequirement}
          </div>
        </div>

        {/* Configuration Code Editor / Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">
                  {selectedTarget.sampleConfigFileName}
                </span>
              </div>

              <button
                onClick={() => handleCopy(selectedTarget.sampleConfigContent)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-850 leading-relaxed max-h-96">
              {selectedTarget.sampleConfigContent}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Ready for copy & paste into repository root</span>
            <span className="text-cyan-400">Validated SPA Structure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
