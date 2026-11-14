import React from 'react';
import { ResearchObservation } from '../types/observation.types';
import { Calendar, Rocket, Clock, CheckCircle } from 'lucide-react';

interface ResearchTimelineProps {
  observations: ResearchObservation[];
  onSelectObservation?: (obs: ResearchObservation) => void;
  selectedObsId?: string;
}

export const ResearchTimeline: React.FC<ResearchTimelineProps> = ({
  observations,
  onSelectObservation,
  selectedObsId
}) => {
  if (observations.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
        No longitudinal timepoints registered for this observation series.
      </div>
    );
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Preflight':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Inflight':
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40';
      case 'Postflight':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'Ground Control':
        return 'text-slate-400 bg-slate-800 border-slate-700';
      case 'Analog Confinement':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Analog Recovery':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider">Mission Chronology & Sampling Epochs</span>
        </div>
        <span className="font-mono">{observations.length} discrete observations</span>
      </div>

      <div className="relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800 space-y-4">
        {observations.map((obs) => {
          const isSelected = selectedObsId === obs.observationId;
          const colorClass = getPhaseColor(obs.collectionPhase);

          return (
            <div
              key={obs.observationId}
              onClick={() => onSelectObservation?.(obs)}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500/60 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[1.8rem] top-4 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center ${
                obs.collectionPhase === 'Inflight' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
              }`} />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${colorClass}`}>
                    {obs.phaseDayLabel} ({obs.collectionPhase})
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Subject: {obs.subjectId}
                  </span>
                </div>

                <div className="font-mono text-sm font-bold text-slate-100">
                  {obs.numericValue} <span className="text-xs font-normal text-slate-400">{obs.originalUnit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="text-slate-400 truncate max-w-sm">
                  {obs.experimentalCondition}
                </span>
                <span className="font-mono text-slate-500 shrink-0">
                  Sample: {obs.sampleId}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
