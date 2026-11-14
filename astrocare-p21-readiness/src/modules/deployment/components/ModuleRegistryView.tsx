// ============================================================================
// AstroCare Module B: Module Integration Verification Registry View
// Tracks and verifies all 21 AstroCare modules across the project lifecycle.
// ============================================================================

import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Code2
} from 'lucide-react';
import { ModuleIntegrationStatus, ModuleIntegrationStatusType } from '../types';
import { StatusBadge } from './StatusBadge';

interface ModuleRegistryViewProps {
  modules: ModuleIntegrationStatus[];
  onOpenDependencyGraph: () => void;
  onUpdateModuleStatus?: (promptId: string, newStatus: ModuleIntegrationStatusType) => void;
}

export const ModuleRegistryView: React.FC<ModuleRegistryViewProps> = ({
  modules,
  onOpenDependencyGraph,
  onUpdateModuleStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [inspectedModule, setInspectedModule] = useState<ModuleIntegrationStatus | null>(null);

  const filteredModules = modules.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.promptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.componentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const integratedCount = modules.filter(m => m.status === 'integrated').length;
  const partialCount = modules.filter(m => m.status === 'partially_integrated').length;
  const pendingCount = modules.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              MODULE REGISTRY (P01 – P21)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total Tracked: {modules.length} Modules
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            AstroCare Module Integration & Route Contract Verification
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Every module must define route contracts, service dependencies, and TypeScript interfaces. External modules are cleanly isolated with documented placeholders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDependencyGraph}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors"
          >
            <Network className="w-4 h-4" />
            <span>Dependency Graph</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, or route..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Categories (6)</option>
            <option value="core">Core Mission</option>
            <option value="clinical">Clinical Biomedical</option>
            <option value="intelligence">Clinical Intelligence</option>
            <option value="research">Scientific Research</option>
            <option value="operations">Operations & Records</option>
            <option value="readiness">Deployment Readiness</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Statuses ({modules.length})</option>
            <option value="integrated">Integrated ({integratedCount})</option>
            <option value="partially_integrated">Partially Integrated ({partialCount})</option>
            <option value="pending">Pending External ({pendingCount})</option>
            <option value="not_verified">Not Verified</option>
          </select>
        </div>
      </div>

      {/* Modules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Prompt ID</th>
                <th className="py-3 px-4">Module Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Integration Status</th>
                <th className="py-3 px-4">Route Contract</th>
                <th className="py-3 px-4">Dependencies</th>
                <th className="py-3 px-4">Tests</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredModules.map(module => (
                <tr 
                  key={module.promptId} 
                  className="hover:bg-slate-850/60 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {module.promptId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{module.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{module.componentName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {module.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={module.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-cyan-300 whitespace-nowrap">
                    {module.route}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {module.serviceDependencies.slice(0, 2).map((dep, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {dep}
                        </span>
                      ))}
                      {module.serviceDependencies.length > 2 && (
                        <span className="text-[10px] font-mono text-slate-500">
                          +{module.serviceDependencies.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`font-mono text-[11px] ${
                      module.testStatus === 'passed' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {module.testStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setInspectedModule(module)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-800 hover:bg-slate-750 rounded border border-slate-700 transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over / Modal Inspector for selected module */}
      {inspectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {inspectedModule.promptId}
                </span>
                <StatusBadge status={inspectedModule.status} />
              </div>
              <button
                onClick={() => setInspectedModule(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {inspectedModule.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {inspectedModule.description}
              </p>
            </div>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Route Contract:</span>
                <span className="text-cyan-300">{inspectedModule.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Component Name:</span>
                <span className="text-white">{inspectedModule.componentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data Provider:</span>
                <span className={inspectedModule.dataProviderAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                  {inspectedModule.dataProviderAvailable ? 'Active & Ready' : 'Pending Staging'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Verified:</span>
                <span className="text-slate-400">{new Date(inspectedModule.lastVerified).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 font-mono">
                Required Service Dependencies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectedModule.serviceDependencies.map((dep, idx) => (
                  <span key={idx} className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                    {dep}
                  </span>
                ))}
              </div>
            </div>

            {inspectedModule.notes && (
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <span className="text-cyan-400 font-bold block mb-1">Integration Notes:</span>
                {inspectedModule.notes}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectedModule(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
