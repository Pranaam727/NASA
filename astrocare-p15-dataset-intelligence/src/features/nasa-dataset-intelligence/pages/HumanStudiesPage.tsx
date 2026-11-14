import React, { useState } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { StatusBadge } from '../components/StatusBadge';
import { 
  UserCheck, ShieldCheck, Orbit, Compass, Users, 
  ExternalLink, CheckCircle2, AlertTriangle, Layers 
} from 'lucide-react';

interface HumanStudiesPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const HumanStudiesPage: React.FC<HumanStudiesPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const [activeSubtype, setActiveSubtype] = useState<'all' | 'flight' | 'analog'>('all');

  const humanStudies = datasets.filter(d => 
    d.studyType === 'human-spaceflight' || d.studyType === 'human-analog'
  );

  const flightStudies = humanStudies.filter(d => d.studyType === 'human-spaceflight');
  const analogStudies = humanStudies.filter(d => d.studyType === 'human-analog');

  const filtered = activeSubtype === 'flight' 
    ? flightStudies 
    : activeSubtype === 'analog' 
    ? analogStudies 
    : humanStudies;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              NASA Human Research Program (HRP) Cohorts
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Human Spaceflight Studies
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Curated NASA spaceflight investigations featuring living astronaut cohorts and verified terrestrial human analogs (bed rest, :envihab, head-down tilt).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30">
            {humanStudies.length} Certified Human Studies
          </span>
        </div>
      </div>

      {/* Human Participation & Scientific Integrity Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-100">
            Strict Human Biological Model Verification Protocol:
          </div>
          <p className="text-slate-400 leading-relaxed">
            Human participation is strictly authenticated against NASA OSDR clinical metadata and biospecimen records. 
            Mission name alone is never utilized to infer human participation. Non-human mammalian specimens (such as Rodent Research flights) are strictly excluded from this category and maintained in animal model sections.
          </p>
        </div>
      </div>

      {/* Subtype Filter Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveSubtype('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            activeSubtype === 'all'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-semibold'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          All Human Investigations ({humanStudies.length})
        </button>
        <button
          onClick={() => setActiveSubtype('flight')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            activeSubtype === 'flight'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-semibold'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          Orbital Astronaut Flight ({flightStudies.length})
        </button>
        <button
          onClick={() => setActiveSubtype('analog')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            activeSubtype === 'analog'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-semibold'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
          }`}
        >
          Terrestrial Human Analogs ({analogStudies.length})
        </button>
      </div>

      {/* Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(dataset => (
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
  );
};
