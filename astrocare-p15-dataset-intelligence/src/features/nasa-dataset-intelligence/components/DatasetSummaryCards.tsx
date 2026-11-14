import React from 'react';
import { Database, UserCheck, PawPrint, TestTube, Layers, Clock, Activity } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProvenanceType } from '../types/dataset.types';

interface DatasetSummaryCardsProps {
  totalDiscovered: number;
  biomedicalIndexed: number;
  humanCount: number;
  animalCount: number;
  cellCount: number;
  categoriesCount: number;
  latestRetrievalTime: string;
  provenance: ProvenanceType;
}

export const DatasetSummaryCards: React.FC<DatasetSummaryCardsProps> = ({
  totalDiscovered,
  biomedicalIndexed,
  humanCount,
  animalCount,
  cellCount,
  categoriesCount,
  latestRetrievalTime,
  provenance
}) => {
  const cards = [
    {
      label: 'Datasets Discovered',
      value: totalDiscovered.toLocaleString(),
      subtext: 'NASA OSDR Public Repository',
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      label: 'Biomedical Studies Indexed',
      value: biomedicalIndexed.toLocaleString(),
      subtext: 'Curated space biology studies',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Human Research Datasets',
      value: humanCount.toLocaleString(),
      subtext: 'Astronauts & terrestrial analogs',
      icon: UserCheck,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20'
    },
    {
      label: 'Animal Research Models',
      value: animalCount.toLocaleString(),
      subtext: 'Murine & rodent flight studies',
      icon: PawPrint,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      label: 'Cell Culture Assays',
      value: cellCount.toLocaleString(),
      subtext: 'In vitro simulated cosmic radiation',
      icon: TestTube,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20'
    },
    {
      label: 'Research Categories',
      value: categoriesCount.toString(),
      subtext: 'Cardio, Bone, Immune, Radiation, Sleep',
      icon: Layers,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Telemetry & Data Source Status:
          </span>
          <StatusBadge type="provenance" value={provenance} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Last sync: {latestRetrievalTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl bg-slate-900/80 border ${c.borderColor} hover:bg-slate-900 transition-colors shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium leading-tight">{c.label}</span>
                <div className={`p-1.5 rounded-lg ${c.bgColor}`}>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-slate-100">{c.value}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
