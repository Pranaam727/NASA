import React, { useState } from 'react';
import { DatasetRecord, ProvenanceType } from '../types/dataset.types';
import { DatasetSummaryCards } from '../components/DatasetSummaryCards';
import { DatasetCard } from '../components/DatasetCard';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { 
  Layers, Rocket, UserCheck, Shield, Activity, 
  ExternalLink, ArrowUpRight, Compass, Sparkles, Filter 
} from 'lucide-react';

interface DatasetOverviewPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
  provenance: ProvenanceType;
}

export const DatasetOverviewPage: React.FC<DatasetOverviewPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds,
  provenance
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'human' | 'animal' | 'cell'>('all');

  const humanCount = datasets.filter(d => d.studyType === 'human-spaceflight' || d.studyType === 'human-analog').length;
  const animalCount = datasets.filter(d => d.studyType === 'animal').length;
  const cellCount = datasets.filter(d => d.studyType === 'cell-culture').length;

  // Chart 1: Study Type Distribution
  const studyTypeData = [
    { name: 'Human Spaceflight', count: datasets.filter(d => d.studyType === 'human-spaceflight').length, color: '#3B82F6' },
    { name: 'Animal Models', count: animalCount, color: '#F59E0B' },
    { name: 'Cell Culture (In Vitro)', count: cellCount, color: '#8B5CF6' },
    { name: 'Human Analog', count: datasets.filter(d => d.studyType === 'human-analog').length, color: '#14B8A6' }
  ];

  // Chart 2: Domain Coverage
  const domainCounts: Record<string, number> = {};
  datasets.forEach(d => {
    domainCounts[d.primaryDomain] = (domainCounts[d.primaryDomain] || 0) + 1;
  });
  const domainData = Object.entries(domainCounts).map(([domain, count]) => ({
    domain,
    count
  }));

  // Chart 3: Missions
  const missionCounts: Record<string, number> = {};
  datasets.forEach(d => {
    const key = d.mission.includes('Inspiration4') ? 'Inspiration4' :
                d.mission.includes('ISS') ? 'ISS Missions' :
                d.mission.includes('STS') ? 'Space Shuttle' :
                d.mission.includes('Bion') ? 'Bion-M1' :
                d.mission.includes('Brookhaven') ? 'NSRL Radiation' : 'Ground Analog';
    missionCounts[key] = (missionCounts[key] || 0) + 1;
  });
  const missionData = Object.entries(missionCounts).map(([name, count]) => ({ name, count }));

  const filteredList = datasets.filter(d => {
    if (selectedFilter === 'human') return d.studyType === 'human-spaceflight' || d.studyType === 'human-analog';
    if (selectedFilter === 'animal') return d.studyType === 'animal';
    if (selectedFilter === 'cell') return d.studyType === 'cell-culture';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              NASA OSDR Module P15
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Spaceflight Biomedical Intelligence Platform</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            NASA Dataset Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            High-fidelity exploration, multi-omics indexing, and comparative biomedical analytics across NASA Open Science Data Repository (OSDR) spaceflight and cosmic analog investigations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://osdr.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-slate-800 text-xs font-medium transition-colors"
          >
            <span>OSDR Gateway</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 1. Summary Cards Section */}
      <DatasetSummaryCards
        totalDiscovered={709}
        biomedicalIndexed={datasets.length}
        humanCount={humanCount}
        animalCount={animalCount}
        cellCount={cellCount}
        categoriesCount={Object.keys(domainCounts).length}
        latestRetrievalTime={new Date().toLocaleTimeString()}
        provenance={provenance}
      />

      {/* 2 & 3. Key Visualizations: Distribution by Study Type & Domain Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Type Distribution Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Dataset Distribution by Study Population</h3>
            </div>
            <span className="font-mono text-xs text-slate-500">N={datasets.length} Studies</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748B" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400">
            Strict stratification between living human astronauts, ground-based bed rest analogs, animal models (e.g. Mus musculus), and in vitro cell lines.
          </div>
        </div>

        {/* Mission-Related Distribution Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Mission & Platform Distribution</h3>
            </div>
            <span className="font-mono text-xs text-slate-500">Orbital vs Ground</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missionData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10 }} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400">
            Encompasses SpaceX Inspiration4, International Space Station expeditions, Space Shuttle payloads, and NSRL particle accelerator simulations.
          </div>
        </div>
      </div>

      {/* 4. Filterable Recent Dataset Discoveries Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Curated Spaceflight Biomedical Studies
            </h3>
            <p className="text-xs text-slate-400">
              Verified NASA OSDR accessions featuring multi-omics, cytokine arrays, and bone/muscle densitometry.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({datasets.length})
            </button>
            <button
              onClick={() => setSelectedFilter('human')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedFilter === 'human' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Human ({humanCount})
            </button>
            <button
              onClick={() => setSelectedFilter('animal')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedFilter === 'animal' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Animal ({animalCount})
            </button>
            <button
              onClick={() => setSelectedFilter('cell')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedFilter === 'cell' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cell ({cellCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map(dataset => (
            <DatasetCard
              key={dataset.studyId}
              dataset={dataset}
              isSelectedForComparison={selectedComparisonIds.includes(dataset.studyId)}
              onToggleComparison={onToggleCompare}
              onSelectDetails={onSelectStudy}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
