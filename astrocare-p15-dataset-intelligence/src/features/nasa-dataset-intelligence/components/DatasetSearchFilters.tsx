import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { SearchFilterParams, StudyPopulation } from '../types/dataset.types';

interface DatasetSearchFiltersProps {
  filters: SearchFilterParams;
  onFilterChange: (filters: Partial<SearchFilterParams>) => void;
  onReset: () => void;
}

export const DatasetSearchFilters: React.FC<DatasetSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filters.query || ''}
          onChange={e => onFilterChange({ query: e.target.value })}
          placeholder="Search by Accession ID (OSD-575, OSD-53), title, mission, or keyword..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
        />
        {filters.query && (
          <button
            onClick={() => onFilterChange({ query: '' })}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        {/* Study Type / Population */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
            Study Population
          </label>
          <select
            value={filters.studyType || 'all'}
            onChange={e => onFilterChange({ studyType: e.target.value as StudyPopulation | 'all' })}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="all">All Study Populations</option>
            <option value="human-spaceflight">Human Astronaut Flight</option>
            <option value="human-analog">Human Terrestrial Analog</option>
            <option value="animal">Animal Models (Rodents)</option>
            <option value="cell-culture">Cell Culture (In Vitro)</option>
            <option value="microbial">Microbial / Other</option>
          </select>
        </div>

        {/* Research Domain */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
            Biomedical Domain
          </label>
          <select
            value={filters.domain || 'all'}
            onChange={e => onFilterChange({ domain: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="all">All Biomedical Domains</option>
            <option value="Cardiovascular">Cardiovascular Adaptation</option>
            <option value="Immune">Immune System Dysregulation</option>
            <option value="Bone and Muscle">Bone & Muscle Deconditioning</option>
            <option value="Radiation">Radiation & DNA Damage</option>
            <option value="Sleep and Behavioral">Sleep & Behavioral Health</option>
          </select>
        </div>

        {/* Organism */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
            Organism
          </label>
          <select
            value={filters.organism || 'all'}
            onChange={e => onFilterChange({ organism: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="all">All Organisms</option>
            <option value="Homo sapiens">Homo sapiens (Human)</option>
            <option value="Mus musculus">Mus musculus (Mouse)</option>
          </select>
        </div>

        {/* Reset / Action */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
