import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ChevronRight, AlertTriangle, Info, X, Play,
  CheckCircle, Zap, Shield, Users, Database, Radio
} from 'lucide-react';
import { PREDEFINED_SCENARIOS } from '../data/scenarios';
import { useSimStore } from '../store/simulationStore';
import { getSeverityBg } from '../utils/ui';
import type { ScenarioDefinition } from '../contracts/index';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Environmental: <Zap size={14} className="text-teal-400" />,
  Radiation: <Shield size={14} className="text-violet-400" />,
  Crew: <Users size={14} className="text-blue-400" />,
  System: <Database size={14} className="text-amber-400" />,
  Comms: <Radio size={14} className="text-orange-400" />,
  Medical: <AlertTriangle size={14} className="text-rose-400" />,
  Compound: <AlertTriangle size={14} className="text-rose-400" />,
};

function ScenarioCard({ scenario, onSelect, onInspect }: {
  scenario: ScenarioDefinition;
  onSelect: () => void;
  onInspect: () => void;
}) {
  const sevColor = getSeverityBg(scenario.severityClassification);

  return (
    <div className="panel hover:border-space-700 transition-colors cursor-default group">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-600">{scenario.id}</span>
          </div>
          <span className={`status-badge border text-xs ${sevColor}`}>
            {scenario.severityClassification}
          </span>
        </div>
        <h3 className="font-semibold text-slate-100 mb-1 text-sm">{scenario.name}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">{scenario.description}</p>

        <div className="text-xs font-mono text-slate-600 mb-3">
          <span>Phase: </span><span className="text-slate-400">{scenario.missionPhase}</span>
          <span className="ml-3">Events: </span><span className="text-slate-400">{scenario.events.length}</span>
        </div>

        {/* Affected systems */}
        <div className="flex flex-wrap gap-1 mb-4">
          {scenario.affectedSystems.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-space-800 border border-space-700 rounded px-2 py-0.5 text-slate-500 font-mono">
              {s}
            </span>
          ))}
          {scenario.affectedSystems.length > 3 && (
            <span className="text-xs text-slate-600 font-mono py-0.5">+{scenario.affectedSystems.length - 3} more</span>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={onInspect} className="btn-secondary flex-1 flex items-center justify-center gap-1 py-1.5 text-xs">
            <Info size={12} /> Inspect
          </button>
          <button onClick={onSelect} className="btn-primary flex-1 flex items-center justify-center gap-1 py-1.5 text-xs">
            <Play size={12} /> Load
          </button>
        </div>
      </div>
    </div>
  );
}

function ScenarioDetail({ scenario, onClose, onLoad }: {
  scenario: ScenarioDefinition;
  onClose: () => void;
  onLoad: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="panel w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="panel-header sticky top-0 bg-space-900 z-10">
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-astro-cyan" />
            <div>
              <span className="font-mono text-xs text-slate-500">{scenario.id}</span>
              <h2 className="font-bold text-slate-100">{scenario.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={16} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-amber-900/20 border border-amber-700/40 rounded px-3 py-2 text-xs text-amber-400 font-mono">
            ⚠ This is a SIMULATED scenario for educational and decision-support purposes only.
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Phase', scenario.missionPhase],
              ['Severity', scenario.severityClassification],
              ['Events', scenario.events.length.toString()],
              ['Systems', scenario.affectedSystems.length.toString()],
            ].map(([k, v]) => (
              <div key={k} className="bg-space-850 rounded p-3 border border-space-750">
                <div className="metric-label">{k}</div>
                <div className="font-mono text-sm text-slate-100 font-semibold">{v}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{scenario.description}</p>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Scenario Events ({scenario.events.length})</h3>
            <div className="space-y-2">
              {scenario.events.map(ev => (
                <div key={ev.id} className={`flex gap-3 p-3 rounded border text-sm ${
                  ev.severity === 'Critical' ? 'border-rose-800/50 bg-rose-950/20' :
                  ev.severity === 'High' ? 'border-orange-800/50 bg-orange-950/20' :
                  ev.severity === 'Warning' ? 'border-amber-800/50 bg-amber-950/20' :
                  'border-space-700 bg-space-850'
                }`}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    {CATEGORY_ICONS[ev.category] || <Info size={14} />}
                    <span className="text-xs font-mono text-slate-600 mt-1">T+{ev.triggerTimeSec}s</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-100 text-xs">{ev.title}</span>
                      <span className={`status-badge text-xs ${
                        ev.severity === 'Critical' ? 'status-critical' :
                        ev.severity === 'High' ? 'status-high' :
                        ev.severity === 'Warning' ? 'status-warning' : 'status-info'
                      }`}>{ev.severity}</span>
                    </div>
                    <p className="text-xs text-slate-500">{ev.description}</p>
                    {ev.suggestedMitigation && (
                      <p className="text-xs text-teal-500 mt-1">
                        <span className="font-semibold">Mitigation:</span> {ev.suggestedMitigation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery objectives */}
          <div>
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Recovery Objectives</h3>
            <ul className="space-y-1">
              {scenario.recoveryObjectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Evaluation criteria */}
          <div>
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Evaluation Criteria</h3>
            <ul className="space-y-1">
              {scenario.evaluationCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-astro-cyan mt-0.5 shrink-0 font-mono">→</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-2 border-t border-space-700">
            <button onClick={onClose} className="btn-secondary flex-1">Close</button>
            <button onClick={onLoad} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Play size={14} /> Load & Simulate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioLibrary() {
  const { loadScenario, customScenarios } = useSimStore();
  const navigate = useNavigate();
  const [inspected, setInspected] = useState<ScenarioDefinition | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const allScenarios = [...PREDEFINED_SCENARIOS, ...customScenarios];
  const severities = ['All', 'Low', 'Medium', 'High', 'Extreme'];
  const filtered = filter === 'All' ? allScenarios : allScenarios.filter(s => s.severityClassification === filter);

  function handleLoad(scenario: ScenarioDefinition) {
    loadScenario(scenario);
    navigate('/simulation');
  }

  return (
    <div className="p-4 max-w-screen-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen size={18} className="text-astro-cyan" />
            Scenario Library
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {allScenarios.length} scenarios available ({customScenarios.length} custom)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {severities.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                filter === s ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-500 hover:text-slate-300'
              }`}>
              {s}
            </button>
          ))}
          <button onClick={() => navigate('/builder')} className="btn-primary flex items-center gap-1 text-xs">
            + Custom
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map(scenario => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onSelect={() => handleLoad(scenario)}
            onInspect={() => setInspected(scenario)}
          />
        ))}
      </div>

      {/* Detail modal */}
      {inspected && (
        <ScenarioDetail
          scenario={inspected}
          onClose={() => setInspected(null)}
          onLoad={() => { handleLoad(inspected); setInspected(null); }}
        />
      )}

      {/* NASA disclaimer */}
      <div className="panel p-3 mt-4">
        <p className="text-xs text-slate-600 font-mono leading-relaxed">
          <span className="text-amber-600">MODEL NOTICE:</span> All scenarios are educational simulation models.
          Events and thresholds are informed by publicly available NASA HRP documentation (NASA-STD-3001, HRR) but
          are NOT operationally validated mission flight rules. Radiation values are illustrative simplified models;
          actual mission radiation environments require HZETRN or equivalent validated codes.
        </p>
      </div>
    </div>
  );
}
