import React, { useState } from 'react';
import { useResearchSearch } from '../hooks/useResearchSearch';
import { OSDRStudy } from '../types/osdr.types';
import { 
  Database, 
  Search, 
  ExternalLink, 
  FileCode, 
  Layers, 
  Microscope, 
  Rocket, 
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface ResearchExplorerPageProps {
  onNavigate: (route: string) => void;
}

export const ResearchExplorerPage: React.FC<ResearchExplorerPageProps> = ({ onNavigate }) => {
  const {
    query,
    setQuery,
    organismFilter,
    setOrganismFilter,
    riskCode,
    setRiskCode,
    loading,
    results,
    totalHits,
    isLiveApi,
    notice,
    page,
    setPage,
    refreshSearch
  } = useResearchSearch();

  const [selectedStudy, setSelectedStudy] = useState<OSDRStudy | null>(null);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              NASA Open Science Data Repository (OSDR) Discovery
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live discovery and metadata explorer interfacing with NASA Open Science Data Repository (osdr.nasa.gov). Access multi-omics datasets, flight payloads, assay protocols, and spaceflight bio-specimen metadata.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`px-3 py-1.5 rounded-lg border font-mono flex items-center gap-2 ${
            isLiveApi 
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300' 
              : 'bg-space-900 border-slate-800 text-cyan-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
            <span>{isLiveApi ? 'Live OSDR API Connected' : 'Curated OSDR Study Cache Active'}</span>
          </div>

          <a
            href="https://osdr.nasa.gov/bio/repo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            OSDR Web Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Attribution & Data Disclaimer */}
      <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="text-slate-200 font-semibold">Data Attribution:</span> {notice}. NASA OSDR archives spaceflight multi-omics from human astronauts, rodents, plants, and microorganisms. Individual datasets must be evaluated for their respective biological model.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-space-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search OSDR by title, organism (Mus musculus, Homo sapiens), payload, assay..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-full bg-space-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Organism Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Model:</label>
          <select
            value={organismFilter}
            onChange={(e) => { setOrganismFilter(e.target.value); setPage(1); }}
            className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Organisms</option>
            <option value="Human">Human Astronaut (Homo sapiens)</option>
            <option value="Animal">Rodent / Mammalian</option>
            <option value="Cell">In-Vitro Cell Culture</option>
          </select>
        </div>

        {/* Associated Risk Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Domain:</label>
          <select
            value={riskCode}
            onChange={(e) => { setRiskCode(e.target.value); setPage(1); }}
            className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Domains</option>
            <option value="BONE">Bone Health (BONE)</option>
            <option value="MUSCLE">Muscle Function (MUSCLE)</option>
            <option value="RAD">Space Radiation (RAD)</option>
            <option value="CARDIO">Cardiovascular (CARDIO)</option>
            <option value="IMMUNE">Immune System (IMMUNE)</option>
            <option value="SANS">Neuro-Ocular (SANS)</option>
            <option value="SLEEP">Sleep & Circadian (SLEEP)</option>
          </select>
        </div>

        {/* Refresh button */}
        <button
          onClick={refreshSearch}
          className="p-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 border border-slate-700 transition-colors"
          title="Refresh search from OSDR"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Found <strong className="text-slate-200 font-mono">{totalHits}</strong> NASA OSDR studies</span>
        {loading && <span className="text-cyan-400 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Querying NASA OSDR...</span>}
      </div>

      {/* Dataset Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map(study => (
          <div
            key={study.id}
            className="bg-space-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-space-800 text-cyan-400 border border-slate-700">
                    {study.id}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    study.isHuman 
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800' 
                      : 'bg-space-800 text-slate-300 border-slate-700'
                  }`}>
                    {study.organismClassification}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {study.fileCount} Files Indexed
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
                {study.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                {study.description}
              </p>

              {/* Payload & Mission info */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-space-950/70 border border-slate-800/80 text-[11px] text-slate-400 mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mission</span>
                  <span className="text-slate-200 truncate block">{study.missionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Organism</span>
                  <span className="text-slate-200 italic truncate block">{study.organism}</span>
                </div>
              </div>

              {/* Assays Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {study.assays.slice(0, 3).map((assay, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-slate-700/60 truncate max-w-[200px]">
                    {assay}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedStudy(study)}
                className="text-xs px-2.5 py-1 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Inspect Metadata
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={study.studyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
                >
                  View on OSDR <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalHits > 10 && (
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800 text-xs">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 rounded-lg bg-space-900 border border-slate-800 text-slate-300 hover:bg-space-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="font-mono text-slate-400">
            Page {page} of {Math.ceil(totalHits / 10)}
          </span>
          <button
            disabled={page * 10 >= totalHits}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 rounded-lg bg-space-900 border border-slate-800 text-slate-300 hover:bg-space-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Study Metadata Inspection Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-space-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-space-800 text-cyan-400 border border-slate-700">
                  {selectedStudy.id}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {selectedStudy.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedStudy(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedStudy.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Organism</span>
                <span className="text-slate-200 italic">{selectedStudy.organism}</span>
              </div>
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Payload</span>
                <span className="text-slate-200">{selectedStudy.payloadName || 'Standard Flight Rack'}</span>
              </div>
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Mission</span>
                <span className="text-slate-200">{selectedStudy.missionName}</span>
              </div>
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Samples / Files</span>
                <span className="text-slate-200 font-mono">{selectedStudy.sampleCount} samples / {selectedStudy.fileCount} files</span>
              </div>
            </div>

            {selectedStudy.rawJsonSummary && (
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800 text-xs">
                <span className="text-cyan-400 font-semibold block mb-1">NASA OSDR Payload Summary:</span>
                <p className="text-slate-300 text-[11px] font-mono leading-relaxed">
                  {selectedStudy.rawJsonSummary}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <a
                href={selectedStudy.studyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                Download Files on OSDR Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedStudy(null)}
                className="px-4 py-1.5 rounded-lg bg-space-800 text-slate-200 hover:bg-space-700 font-medium"
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
