import React, { useState } from 'react';
import { MissionEvent, EventCategory } from '../../types/contracts';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  FileSearch, 
  Clock, 
  CheckCircle2, 
  Radio, 
  CheckSquare 
} from 'lucide-react';

interface MissionTimelineProps {
  events: MissionEvent[];
  onOpenInvestigation?: (invId: string) => void;
  className?: string;
}

const CATEGORY_FILTERS: { id: EventCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Mission Activity' },
  { id: 'anomaly-detection', label: 'Anomalies' },
  { id: 'health-observation', label: 'Observations' },
  { id: 'ai-report', label: 'AI Reports' },
  { id: 'medical-investigation', label: 'Investigations' },
  { id: 'telemetry-event', label: 'Telemetry' },
  { id: 'data-sync', label: 'Data Sync' }
];

export const MissionTimeline: React.FC<MissionTimelineProps> = ({
  events,
  onOpenInvestigation,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  const filteredEvents = events.filter(e => {
    return selectedCategory === 'all' || e.category === selectedCategory;
  });

  const getCategoryIcon = (category: EventCategory, severity: MissionEvent['severity']) => {
    switch (category) {
      case 'anomaly-detection':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'health-observation':
        return <Activity className="w-4 h-4 text-cyan-500" />;
      case 'ai-report':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'medical-investigation':
        return <FileSearch className="w-4 h-4 text-rose-400" />;
      case 'follow-up-action':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'telemetry-event':
        return <Radio className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm ${className}`}>
      
      {/* Timeline Header & Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span>Mission Activity & Chronological Telemetry Log</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Real-time audit log of medical events, sensor anomalies, and AI evaluations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedCategory(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === f.id
                  ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="relative flex items-start gap-4 pl-1">
            
            {/* Event Dot Icon */}
            <div className="relative z-10 w-7 h-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm shrink-0 mt-0.5">
              {getCategoryIcon(evt.category, evt.severity)}
            </div>

            {/* Event Card */}
            <div className="flex-1 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    {evt.title}
                  </span>
                  {evt.astronautName && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-850 text-slate-600 dark:text-slate-300">
                      {evt.astronautName}
                    </span>
                  )}
                </div>

                <span className="font-mono text-[10px] text-slate-400">
                  {evt.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-850 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="capitalize text-slate-400">Category: {evt.category.replace(/-/g, ' ')}</span>
                  <span className="text-slate-400">•</span>
                  <DataProvenanceBadge type={evt.provenance.type} />
                </div>

                {evt.investigationId && onOpenInvestigation && (
                  <button
                    onClick={() => onOpenInvestigation(evt.investigationId!)}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                  >
                    View Investigation ({evt.investigationId}) →
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
