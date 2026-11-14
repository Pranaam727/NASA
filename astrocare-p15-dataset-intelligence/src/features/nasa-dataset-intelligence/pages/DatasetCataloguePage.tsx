import React, { useState } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { DatasetMetadataTable } from '../components/DatasetMetadataTable';
import { 
  Database, LayoutGrid, Table, Search, Filter, 
  UserCheck, ShieldAlert, SunMedium, HeartPulse, Bone, Moon 
} from 'lucide-react';

interface DatasetCataloguePageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const DatasetCataloguePage: React.FC<DatasetCataloguePageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All Catalogued Datasets', icon: Database, count: datasets.length },
    { id: 'human', label: 'Human Spaceflight', icon: UserCheck, count: datasets.filter(d => d.studyType === 'human-spaceflight').length },
    { id: 'immune', label: 'Immune Research', icon: ShieldAlert, count: datasets.filter(d => d.primaryDomain.includes('Immune')).length },
    { id: 'radiation', label: 'Radiation Biology', icon: SunMedium, count: datasets.filter(d => d.primaryDomain.includes('Radiation')).length },
    { id: 'cardio', label: 'Cardiovascular', icon: HeartPulse, count: datasets.filter(d => d.primaryDomain.includes('Cardio')).length },
    { id: 'bone', label: 'Bone & Muscle', icon: Bone, count: datasets.filter(d => d.primaryDomain.includes('Bone')).length },
    { id: 'sleep', label: 'Sleep & Behavioral', icon: Moon, count: datasets.filter(d => d.primaryDomain.includes('Sleep')).length }
  ];

  const filteredDatasets = datasets.filter(d => {
    // Category match
    if (activeCategory === 'human' && d.studyType !== 'human-spaceflight') return false;
    if (activeCategory === 'immune' && !d.primaryDomain.includes('Immune')) return false;
    if (activeCategory === 'radiation' && !d.primaryDomain.includes('Radiation')) return false;
    if (activeCategory === 'cardio' && !d.primaryDomain.includes('Cardio')) return false;
    if (activeCategory === 'bone' && !d.primaryDomain.includes('Bone')) return false;
    if (activeCategory === 'sleep' && !d.primaryDomain.includes('Sleep')) return false;

    // Search query match
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.studyId.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.organism.toLowerCase().includes(q) ||
        d.mission.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              NASA Curated Spaceflight Archives
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Biomedical Dataset Catalogue
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Exhaustive scientific repository catalogue indexed by physiological domain, biological model taxonomy, mission flight profile, and primary assay technologies.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Compact Metadata Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Domain Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 border transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-semibold shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-slate-400">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Filter catalogued studies by keyword, accession, organism, or flight mission..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
        />
      </div>

      {/* Dataset Content View */}
      {filteredDatasets.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
          <Database className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-medium text-slate-300">No Studies Found in this Category</h4>
          <p className="text-xs text-slate-500">Try selecting &quot;All Catalogued Datasets&quot; or refining your search keywords.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDatasets.map(d => (
            <DatasetCard
              key={d.studyId}
              dataset={d}
              isSelectedForComparison={selectedComparisonIds.includes(d.studyId)}
              onToggleComparison={onToggleCompare}
              onSelectDetails={onSelectStudy}
            />
          ))}
        </div>
      ) : (
        <DatasetMetadataTable
          datasets={filteredDatasets}
          onSelectStudy={onSelectStudy}
          onToggleCompare={onToggleCompare}
          selectedIds={selectedComparisonIds}
        />
      )}
    </div>
  );
};
