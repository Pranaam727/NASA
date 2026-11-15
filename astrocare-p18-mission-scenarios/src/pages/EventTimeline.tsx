import { useState } from 'react';
import { List, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';
import type { ScenarioEvent } from '../contracts/index';

type SevFilter = 'All' | 'Info' | 'Warning' | 'High' | 'Critical';
type CatFilter = 'All' | 'Environmental' | 'Radiation' | 'Crew' | 'System' | 'Comms' | 'Medical' | 'Compound';

function EventRow({ event, expanded, onToggle }: {
  event: ScenarioEvent & { applied: boolean };
  expanded: boolean;
  onToggle: () => void;
}) {
  const sevColor = event.severity === 'Critical' ? 'text-rose-400 bg-rose-950/30 border-rose-800/50'
    : event.severity === 'High' ? 'text-orange-400 bg-orange-950/30 border-orange-800/50'
    : event.severity === 'Warning' ? 'text-amber-400 bg-amber-950/30 border-amber-800/50'
    : 'text-blue-400 bg-blue-950/30 border-blue-800/50';

  const catColor = {
    Environmental: 'text-teal-400', Radiation: 'text-violet-400', Crew: 'text-blue-400',
    System: 'text-amber-400', Comms: 'text-orange-400', Medical: 'text-rose-400', Compound: 'text-rose-400',
  }[event.category] || 'text-slate-400';

  return (
    <div className={`border rounded mb-1 overflow-hidden ${sevColor} ${!event.applied ? 'opacity-50' : ''}`}>
      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left" onClick={onToggle}>
        <span className="font-mono text-xs text-slate-600 shrink-0 w-16">T+{event.triggerTimeSec}s</span>
        <span className={`font-mono text-xs font-bold shrink-0 uppercase tracking-wider ${catColor}`}>{event.category}</span>
        <span className="text-xs font-semibold text-slate-200 flex-1">{event.title}</span>
        <span className={`status-badge text-xs shrink-0 ${
          event.severity === 'Critical' ? 'status-critical' :
          event.severity === 'High' ? 'status-high' :
          event.severity === 'Warning' ? 'status-warning' : 'status-info'
        }`}>{event.severity}</span>
        <span className={`text-xs font-mono shrink-0 ${event.applied ? 'text-emerald-400' : 'text-slate-600'}`}>
          {event.applied ? '● DISPATCHED' : '○ PENDING'}
        </span>
        {expanded ? <ChevronUp size={12} className="text-slate-500 shrink-0" /> : <ChevronDown size={12} className="text-slate-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 border-t border-current border-opacity-20 space-y-2 text-xs">
          <p className="text-slate-400 mt-2">{event.description}</p>
          {event.suggestedMitigation && (
            <div className="p-2 bg-space-900 rounded border border-space-750">
              <span className="text-teal-500 font-semibold">Suggested Mitigation: </span>
              <span className="text-teal-300">{event.suggestedMitigation}</span>
            </div>
          )}
          {Object.keys(event.parameters).length > 0 && (
            <div>
              <span className="text-slate-500 font-mono">Parameter Changes: </span>
              <span className="text-slate-400 font-mono">{JSON.stringify(event.parameters, null, 0)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EventTimeline() {
  const { selectedScenario, currentTelemetry, elapsedSec } = useSimStore();
  const [sevFilter, setSevFilter] = useState<SevFilter>('All');
  const [catFilter, setCatFilter] = useState<CatFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const events = selectedScenario?.events ?? [];
  const filtered = events.filter(e =>
    (sevFilter === 'All' || e.severity === sevFilter) &&
    (catFilter === 'All' || e.category === catFilter)
  );

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <List size={18} className="text-amber-400" />
          Mission Event Timeline
        </h1>
        {currentTelemetry && (
          <div className="font-mono text-sm text-slate-300 bg-space-850 px-3 py-1 rounded border border-space-700">
            {currentTelemetry.timestampFormatted}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="panel p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-slate-500" />
          <span className="text-xs font-mono text-slate-500">SEVERITY:</span>
          {(['All', 'Info', 'Warning', 'High', 'Critical'] as SevFilter[]).map(s => (
            <button key={s} onClick={() => setSevFilter(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono ${sevFilter === s ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-500 hover:text-slate-200'}`}>
              {s}
            </button>
          ))}
          <span className="text-slate-700">|</span>
          <span className="text-xs font-mono text-slate-500">CATEGORY:</span>
          {(['All', 'Environmental', 'Radiation', 'Crew', 'System', 'Comms', 'Medical'] as CatFilter[]).map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2 py-0.5 rounded text-xs font-mono ${catFilter === c ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-500 hover:text-slate-200'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline bar */}
      {selectedScenario && selectedScenario.events.length > 0 && (
        <div className="panel p-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Timeline View</h2>
          <div className="relative h-8 bg-space-800 rounded-full overflow-hidden">
            {/* Progress bar */}
            {currentTelemetry && (
              <div className="absolute top-0 left-0 h-full bg-astro-blue/20 rounded-full transition-all"
                style={{ width: `${Math.min(100, (elapsedSec / Math.max(...selectedScenario.events.map(e => e.triggerTimeSec), 1)) * 100)}%` }} />
            )}
            {/* Event markers */}
            {selectedScenario.events.map(ev => {
              const maxTime = Math.max(...selectedScenario.events.map(e => e.triggerTimeSec), 1);
              const pct = (ev.triggerTimeSec / maxTime) * 100;
              const color = ev.severity === 'Critical' ? '#f43f5e' : ev.severity === 'High' ? '#f97316' : ev.severity === 'Warning' ? '#f59e0b' : '#3b82f6';
              return (
                <div key={ev.id} className="absolute top-0 bottom-0 w-0.5 group"
                  style={{ left: `${pct}%`, background: color + (ev.applied ? 'ff' : '55') }}>
                  <div className="hidden group-hover:block absolute bottom-full mb-1 left-0 -translate-x-1/2 bg-space-900 border border-space-700 rounded px-2 py-1 text-xs font-mono whitespace-nowrap z-10">
                    T+{ev.triggerTimeSec}s: {ev.title}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-700 mt-1">
            <span>T+0s</span>
            <span>T+{Math.max(...selectedScenario.events.map(e => e.triggerTimeSec))}s</span>
          </div>
        </div>
      )}

      {/* Event list */}
      {!selectedScenario ? (
        <div className="panel p-12 text-center text-slate-600 font-mono">
          Load a scenario to view its event timeline.
        </div>
      ) : (
        <div>
          <div className="text-xs font-mono text-slate-600 mb-2">
            {filtered.length} events shown | {events.filter(e => e.applied).length} dispatched | {events.filter(e => !e.applied).length} pending
          </div>
          <div>
            {filtered.map(ev => (
              <EventRow key={ev.id} event={ev}
                expanded={expandedId === ev.id}
                onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)} />
            ))}
            {filtered.length === 0 && (
              <div className="panel p-6 text-center text-slate-600 font-mono">No events match the selected filters.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
