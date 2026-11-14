import React from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DatasetCard } from '../components/DatasetCard';
import { Moon, Brain, Clock, ShieldCheck } from 'lucide-react';

interface SleepBehavioralPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const SleepBehavioralPage: React.FC<SleepBehavioralPageProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const sleepStudies = datasets.filter(d => 
    d.primaryDomain.includes('Sleep') ||
    d.title.toLowerCase().includes('sleep') ||
    d.title.toLowerCase().includes('follicles') ||
    d.title.toLowerCase().includes('brain') ||
    d.title.toLowerCase().includes('behavior')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Circadian Chronobiology & Neurobehavioral Health
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Sleep and Behavioral Research Datasets
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Evaluation of peripheral circadian gene expression (CLOCK, PER1, BMAL1) in astronaut biospecimens, neuro-inflammatory signaling (OSD-751), and confinement sleep fragmentation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-violet-400 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <Moon className="w-4 h-4" />
          <span>{sleepStudies.length} Studies Indexed</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Circadian Clock Desynchrony</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Astronaut serial hair follicle biopsies (OSD-174) reveal phase shifts in PER1/BMAL1 transcription under low Earth orbit 90-minute day-night light cycles.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Cerebral Neuro-inflammation</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Mice flown on ISS (OSD-751) exhibit cortical NLRP3 inflammasome upregulation, demonstrating potential CNS stress risks during prolonged exploration.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
          <h4 className="font-semibold text-slate-200 mb-1">Endocrine Stress Regulation</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Glucocorticoid and cortisol diurnal rhythms reflect acute psychophysiological demands during dynamic launch and landing mission milestones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sleepStudies.map(dataset => (
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
