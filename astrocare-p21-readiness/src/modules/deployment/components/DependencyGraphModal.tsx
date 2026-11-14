// ============================================================================
// AstroCare Module Integration Dependency Graph Modal
// Visualizes inter-module service dependencies and readiness status across all 21 prompts.
// ============================================================================

import React, { useState } from 'react';
import { X, Network, ArrowRight, Layers, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ModuleIntegrationStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface DependencyGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: ModuleIntegrationStatus[];
}

export const DependencyGraphModal: React.FC<DependencyGraphModalProps> = ({
  isOpen,
  onClose,
  modules
}) => {
  const [selectedModule, setSelectedModule] = useState<ModuleIntegrationStatus | null>(null);

  if (!isOpen) return null;

  const categories = [
    { key: 'core', label: '1. Mission Core & Telemetry' },
    { key: 'clinical', label: '2. Clinical Aerospace Biomedical' },
    { key: 'intelligence', label: '3. Intelligence & Clinical AI' },
    { key: 'research', label: '4. Scientific Research & Provenance' },
    { key: 'operations', label: '5. Flight Operations & Records' },
    { key: 'readiness', label: '6. UX & Deployment Readiness' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800/60">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                AstroCare 21-Module Integration Dependency Graph
              </h2>
              <p className="text-xs text-slate-400">
                Architectural relationships, route bindings, and service dependencies across all prompt modules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Graph Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Category Pipelines */}
          <div className="lg:col-span-2 space-y-6">
            {categories.map(cat => {
              const catModules = modules.filter(m => m.category === cat.key);
              return (
                <div key={cat.key} className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {catModules.filter(m => m.status === 'integrated').length}/{catModules.length} Integrated
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {catModules.map(m => {
                      const isSelected = selectedModule?.promptId === m.promptId;
                      return (
                        <div
                          key={m.promptId}
                          onClick={() => setSelectedModule(m)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-mono text-xs font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                              {m.promptId}
                            </span>
                            <StatusBadge status={m.status} size="sm" />
                          </div>
                          <div className="text-xs font-semibold text-white line-clamp-1">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-1">
                            {m.route}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Col: Module Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            {selectedModule ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {selectedModule.promptId}
                  </span>
                  <StatusBadge status={selectedModule.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {selectedModule.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedModule.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span className="text-slate-500">Route Contract:</span>
                    <span className="font-mono text-cyan-300">{selectedModule.route}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span className="text-slate-500">Target Component:</span>
                    <span className="font-mono text-white">{selectedModule.componentName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span className="text-slate-500">Data Provider:</span>
                    <span className={selectedModule.dataProviderAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                      {selectedModule.dataProviderAvailable ? 'Available' : 'Pending Staging'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span className="text-slate-500">Type Compatibility:</span>
                    <span className={selectedModule.typeCompatible ? 'text-emerald-400' : 'text-rose-400'}>
                      {selectedModule.typeCompatible ? 'Strictly Typed' : 'Needs Interface Def'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                    Service Dependencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModule.serviceDependencies.length > 0 ? (
                      selectedModule.serviceDependencies.map((dep, idx) => (
                        <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No external services required</span>
                    )}
                  </div>
                </div>

                {selectedModule.notes && (
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-1">Integration Notes:</span>
                    {selectedModule.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Network className="w-12 h-12 stroke-[1.5] mb-3 text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Select a Module</p>
                <p className="text-xs max-w-xs mt-1">
                  Click on any of the 21 AstroCare prompt modules to inspect its route contracts, required service dependencies, and live integration state.
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
