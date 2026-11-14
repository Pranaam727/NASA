import React, { useState } from 'react';
import { useRiskEvidence } from '../hooks/useRiskEvidence';
import { EvidenceCard } from '../components/EvidenceCard';
import { EvidenceDetailPanel } from '../components/EvidenceDetailPanel';
import { ResearchEvidence } from '../types/evidence.types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  RotateCcw, 
  UserCheck, 
  FlaskConical, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface EvidenceLibraryPageProps {
  onNavigate: (route: string) => void;
}

export const EvidenceLibraryPage: React.FC<EvidenceLibraryPageProps> = ({ onNavigate }) => {
  const {
    filters,
    updateFilters,
    resetFilters,
    filteredEvidence,
    selectedEvidence,
    setSelectedEvidence,
    evidenceStats
  } = useRiskEvidence('ALL');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              NASA Research Evidence Library
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Curated repository of NASA Human Research Program (HRP) publications, flight investigations, ground-based analogs, and pre-clinical models. Each record is verified with official DOIs, NTRS accession numbers, and rigorous methodology documentation.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-space-900 border border-slate-800 text-slate-300">
            <span className="text-cyan-400 font-bold">{evidenceStats.total}</span> Total Records
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{evidenceStats.humanCount} Human In-Flight</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-space-900 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
        
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by keywords, findings, methodology, author, or accession code..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="w-full bg-space-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Risk Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Domain:</label>
            <select
              value={filters.riskCategory}
              onChange={(e) => updateFilters({ riskCategory: e.target.value })}
              className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Risk Domains</option>
              <option value="RAD">RAD - Space Radiation</option>
              <option value="CARDIO">CARDIO - Cardiovascular</option>
              <option value="BONE">BONE - Bone Loss</option>
              <option value="MUSCLE">MUSCLE - Muscle Atrophy</option>
              <option value="IMMUNE">IMMUNE - Immune System</option>
              <option value="SLEEP">SLEEP - Sleep & Circadian</option>
              <option value="BEHAVIOR">BEHAVIOR - Behavioral Health</option>
              <option value="SANS">SANS - Neuro-Ocular Syndrome</option>
            </select>
          </div>

          {/* Study Classification Dropdown */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Study Type:</label>
            <select
              value={filters.studyClassification}
              onChange={(e) => updateFilters({ studyClassification: e.target.value })}
              className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Study Classifications</option>
              <option value="astronaut_human">Direct Astronaut Flight Study</option>
              <option value="ground_analog">Ground Analog (Bed Rest/HERA)</option>
              <option value="animal_model">Animal Model (Rodent/Invertebrate)</option>
              <option value="cell_culture">In-Vitro Cell Culture</option>
              <option value="technical_report">NASA Technical / Evidence Book</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Sort:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="title">Title (Alphabetical)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Direct Astronaut Toggle & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={filters.hasDirectHumanOnly}
                onChange={(e) => updateFilters({ hasDirectHumanOnly: e.target.checked })}
                className="rounded bg-space-950 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
              />
              <span className="font-semibold text-emerald-400">Direct Human Astronaut Studies Only</span>
            </label>

            <div className="flex items-center gap-2 text-slate-400">
              <span>Organism:</span>
              <button
                onClick={() => updateFilters({ organismFilter: 'ALL' })}
                className={`px-2 py-0.5 rounded text-[11px] ${filters.organismFilter === 'ALL' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800' : 'hover:text-slate-200'}`}
              >
                All
              </button>
              <button
                onClick={() => updateFilters({ organismFilter: 'Human' })}
                className={`px-2 py-0.5 rounded text-[11px] ${filters.organismFilter === 'Human' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800' : 'hover:text-slate-200'}`}
              >
                Human
              </button>
              <button
                onClick={() => updateFilters({ organismFilter: 'Animal' })}
                className={`px-2 py-0.5 rounded text-[11px] ${filters.organismFilter === 'Animal' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800' : 'hover:text-slate-200'}`}
              >
                Animal
              </button>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

      </div>

      {/* Mandatory Scientific Translation Notice */}
      <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Scientific Classification Standards:</strong> In accordance with aerospace research integrity rules, animal and cell culture experiments are explicitly segregated from human astronaut flight evidence. In-vitro and rodent data provide mechanistic hypotheses and biological plausibility, but do not prove operational human clinical outcomes.
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map(evidence => (
          <EvidenceCard
            key={evidence.id}
            evidence={evidence}
            onOpenDetails={(ev) => setSelectedEvidence(ev)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredEvidence.length === 0 && (
        <div className="text-center py-12 bg-space-900 border border-slate-800 rounded-xl space-y-2">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No matching research records found</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or unchecking the "Direct Human Astronaut" filter.</p>
          <button
            onClick={resetFilters}
            className="mt-2 px-3 py-1.5 rounded-lg bg-space-800 text-xs text-cyan-300 hover:bg-space-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Evidence Detail Modal */}
      <EvidenceDetailPanel
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

    </div>
  );
};
