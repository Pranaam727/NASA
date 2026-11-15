import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, RotateCcw, Play, Settings2 } from 'lucide-react';
import { useSimStore, BASELINE_ENVIRONMENT, BASELINE_RADIATION, BASELINE_CREW, BASELINE_RESOURCES } from '../store/simulationStore';
import { PREDEFINED_SCENARIOS } from '../data/scenarios';
import type { ScenarioDefinition, ScenarioEvent } from '../contracts/index';

type NumericField = { label: string; min: number; max: number; step: number; unit: string };

const ENV_FIELDS: Record<string, NumericField> = {
  cabinPressureKPa: { label: 'Cabin Pressure', min: 30, max: 115, step: 0.1, unit: 'kPa' },
  oxygenPercent: { label: 'Oxygen %', min: 10, max: 25, step: 0.1, unit: '%' },
  co2Percent: { label: 'CO₂ %', min: 0.03, max: 3.0, step: 0.01, unit: '%' },
  temperatureC: { label: 'Temperature', min: 10, max: 45, step: 0.5, unit: '°C' },
  humidityPercent: { label: 'Humidity', min: 15, max: 90, step: 1, unit: '%' },
  scrubberEfficiencyPercent: { label: 'CO₂ Scrubber Eff.', min: 0, max: 100, step: 1, unit: '%' },
};

const CREW_FIELDS: Record<string, NumericField> = {
  heartRateBpm: { label: 'Heart Rate', min: 40, max: 200, step: 1, unit: 'bpm' },
  oxygenSaturationPercent: { label: 'SpO₂', min: 70, max: 100, step: 0.1, unit: '%' },
  respiratoryRateBpm: { label: 'Respiratory Rate', min: 8, max: 40, step: 1, unit: 'br/min' },
  fatigueIndex: { label: 'Fatigue Index', min: 0, max: 100, step: 1, unit: '/100' },
  circadianDisruptionIndex: { label: 'Circadian Disruption', min: 0, max: 100, step: 1, unit: '/100' },
  cognitiveStressIndex: { label: 'Stress Index', min: 0, max: 100, step: 1, unit: '/100' },
  workloadIndex: { label: 'Workload Index', min: 0, max: 100, step: 1, unit: '%' },
};

const RAD_FIELDS: Record<string, NumericField> = {
  effectiveDoseRateMicroSvPerHour: { label: 'Eff. Dose Rate', min: 0, max: 10000, step: 1, unit: 'µSv/h' },
  shieldingThicknessGCm2: { label: 'Shielding Thickness', min: 1, max: 50, step: 0.5, unit: 'g/cm²' },
};

const RES_FIELDS: Record<string, NumericField> = {
  oxygenRemainingKg: { label: 'O₂ Reserve', min: 0, max: 500, step: 1, unit: 'kg' },
  waterRemainingLiters: { label: 'Water Reserve', min: 0, max: 1000, step: 1, unit: 'L' },
  powerRemainingKWh: { label: 'Power Reserve', min: 0, max: 200, step: 1, unit: 'kWh' },
  consumableRationDays: { label: 'Consumables', min: 0, max: 180, step: 1, unit: 'days' },
};

function RangeInput({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="metric-label">{label}</label>
        <span className="font-mono text-sm text-slate-200">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}
          <span className="text-xs text-slate-500 ml-1">{unit}</span>
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-space-700 rounded-full appearance-none cursor-pointer accent-astro-blue" />
      <div className="flex justify-between text-xs font-mono text-slate-700">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function ScenarioBuilder() {
  const navigate = useNavigate();
  const { loadScenario, saveCustomScenario } = useSimStore();

  const [name, setName] = useState('Custom Scenario');
  const [description, setDescription] = useState('User-defined mission simulation scenario.');
  const [phase, setPhase] = useState('Deep Space Cruise');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Extreme'>('Medium');
  const [baseScenarioId, setBaseScenarioId] = useState('');

  const [env, setEnv] = useState({ ...BASELINE_ENVIRONMENT });
  const [rad, setRad] = useState({ ...BASELINE_RADIATION });
  const [crew, setCrew] = useState({ ...BASELINE_CREW });
  const [res, setRes] = useState({ ...BASELINE_RESOURCES });
  const [events, setEvents] = useState<ScenarioEvent[]>([]);

  const applyBase = useCallback((id: string) => {
    const base = PREDEFINED_SCENARIOS.find(s => s.id === id);
    if (!base) return;
    setBaseScenarioId(id);
    setName(`${base.name} (Modified)`);
    setDescription(base.description);
    setPhase(base.missionPhase);
    setSeverity(base.severityClassification);
    setEnv({ ...BASELINE_ENVIRONMENT, ...base.initialConditions.environment } as typeof BASELINE_ENVIRONMENT);
    setRad({ ...BASELINE_RADIATION, ...base.initialConditions.radiation } as typeof BASELINE_RADIATION);
    setCrew({ ...BASELINE_CREW, ...base.initialConditions.crew } as typeof BASELINE_CREW);
    setRes({ ...BASELINE_RESOURCES, ...base.initialConditions.resources } as typeof BASELINE_RESOURCES);
    setEvents(base.events.map(e => ({ ...e, applied: false })));
  }, []);

  const reset = () => {
    setName('Custom Scenario');
    setDescription('User-defined mission simulation scenario.');
    setPhase('Deep Space Cruise');
    setSeverity('Medium');
    setBaseScenarioId('');
    setEnv({ ...BASELINE_ENVIRONMENT });
    setRad({ ...BASELINE_RADIATION });
    setCrew({ ...BASELINE_CREW });
    setRes({ ...BASELINE_RESOURCES });
    setEvents([]);
  };

  const addEvent = () => {
    const ev: ScenarioEvent = {
      id: `custom-ev-${Date.now()}`,
      triggerTimeSec: events.length > 0 ? Math.max(...events.map(e => e.triggerTimeSec)) + 300 : 60,
      title: 'Custom Event',
      description: 'Describe this event.',
      category: 'Environmental',
      severity: 'Warning',
      applied: false,
      parameters: {},
      suggestedMitigation: '',
    };
    setEvents(prev => [...prev, ev]);
  };

  const updateEvent = (id: string, field: keyof ScenarioEvent, val: any) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const removeEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const buildScenario = (): ScenarioDefinition => ({
    id: `CUSTOM-${Date.now()}`,
    name,
    description,
    missionPhase: phase,
    severityClassification: severity,
    initialConditions: { environment: env, radiation: rad, crew, resources: res },
    events: [...events].sort((a, b) => a.triggerTimeSec - b.triggerTimeSec),
    affectedSystems: [...new Set(events.map(e => e.category))],
    expectedSimulationVariables: ['User-configured parameters'],
    recoveryObjectives: ['User-defined recovery targets'],
    evaluationCriteria: ['User-defined criteria'],
    isCustom: true,
  });

  const handleSave = () => {
    saveCustomScenario(buildScenario());
    alert('Scenario saved to local storage.');
  };

  const handleLoadAndRun = () => {
    loadScenario(buildScenario());
    navigate('/simulation');
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Settings2 size={18} className="text-astro-cyan" />
          Scenario Builder
        </h1>
        <div className="flex gap-2">
          <button onClick={reset} className="btn-secondary flex items-center gap-1 text-xs">
            <RotateCcw size={12} /> Reset
          </button>
          <button onClick={handleSave} className="btn-secondary flex items-center gap-1 text-xs">
            <Save size={12} /> Save Custom
          </button>
          <button onClick={handleLoadAndRun} className="btn-primary flex items-center gap-1 text-xs">
            <Play size={12} /> Load & Run
          </button>
        </div>
      </div>

      <div className="bg-amber-900/20 border border-amber-700/40 rounded px-4 py-2 text-xs text-amber-400 font-mono">
        ⚠ Simulation bounds are illustrative. They do not represent official NASA operational flight rules or clinical limits.
      </div>

      {/* Base from predefined */}
      <div className="panel p-4">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Start from predefined scenario (optional)</h2>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_SCENARIOS.map(s => (
            <button key={s.id} onClick={() => applyBase(s.id)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                baseScenarioId === s.id ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-400 hover:text-slate-200'
              }`}>
              {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="panel p-4 space-y-3">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Scenario Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="metric-label block mb-1">Scenario Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue" />
          </div>
          <div>
            <label className="metric-label block mb-1">Mission Phase</label>
            <select value={phase} onChange={e => setPhase(e.target.value)}
              className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue">
              {['Pre-Launch', 'Trans-Lunar Injection', 'Lunar Orbit Insertion', 'Surface Operations', 'Earth Return', 'Deep Space Cruise'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="metric-label block mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
            className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <span className="metric-label">Severity:</span>
          {(['Low', 'Medium', 'High', 'Extreme'] as const).map(s => (
            <button key={s} onClick={() => setSeverity(s)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                severity === s ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-500 hover:text-slate-300'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters in a 2-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Environmental */}
        <div className="panel p-4 space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Initial Environmental Parameters</h2>
          {Object.entries(ENV_FIELDS).map(([key, cfg]) => (
            <RangeInput key={key} {...cfg}
              value={(env as any)[key]}
              onChange={v => setEnv(prev => ({ ...prev, [key]: v }))} />
          ))}
          <div className="flex items-center gap-3">
            <span className="metric-label">TCS Status:</span>
            {(['Nominal', 'Degraded', 'Failed'] as const).map(s => (
              <button key={s} onClick={() => setEnv(prev => ({ ...prev, tcsStatus: s }))}
                className={`px-2 py-1 rounded text-xs font-mono ${env.tcsStatus === s ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-500'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Crew */}
        <div className="panel p-4 space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Initial Crew Physiological Parameters</h2>
          {Object.entries(CREW_FIELDS).map(([key, cfg]) => (
            <RangeInput key={key} {...cfg}
              value={(crew as any)[key]}
              onChange={v => setCrew(prev => ({ ...prev, [key]: v }))} />
          ))}
        </div>

        {/* Radiation */}
        <div className="panel p-4 space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Initial Radiation Parameters</h2>
          {Object.entries(RAD_FIELDS).map(([key, cfg]) => (
            <RangeInput key={key} {...cfg}
              value={(rad as any)[key]}
              onChange={v => setRad(prev => ({ ...prev, [key]: v }))} />
          ))}
          <div className="p-3 bg-space-850 rounded border border-space-750 text-xs text-slate-500 font-mono">
            Note: Absorbed dose (Gy) ≠ Equivalent dose (Sv). Engine tracks both separately per radiation physics conventions.
          </div>
        </div>

        {/* Resources */}
        <div className="panel p-4 space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Initial Resource Levels</h2>
          {Object.entries(RES_FIELDS).map(([key, cfg]) => (
            <RangeInput key={key} {...cfg}
              value={(res as any)[key]}
              onChange={v => setRes(prev => ({ ...prev, [key]: v }))} />
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Scenario Events ({events.length})</h2>
          <button onClick={addEvent} className="btn-secondary flex items-center gap-1 text-xs">
            <Plus size={12} /> Add Event
          </button>
        </div>
        {events.length === 0 && (
          <div className="text-center text-slate-600 font-mono text-xs py-6">
            No events configured. Add events to trigger scenario changes over time.
          </div>
        )}
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-space-850 border border-space-750 rounded p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <div>
                    <label className="metric-label text-xs">Title</label>
                    <input value={ev.title} onChange={e => updateEvent(ev.id, 'title', e.target.value)}
                      className="mt-0.5 bg-space-800 border border-space-700 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none w-48" />
                  </div>
                  <div>
                    <label className="metric-label text-xs">T+ (seconds)</label>
                    <input type="number" value={ev.triggerTimeSec} min={0} max={86400}
                      onChange={e => updateEvent(ev.id, 'triggerTimeSec', parseInt(e.target.value))}
                      className="mt-0.5 bg-space-800 border border-space-700 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none w-24" />
                  </div>
                  <div>
                    <label className="metric-label text-xs">Category</label>
                    <select value={ev.category} onChange={e => updateEvent(ev.id, 'category', e.target.value)}
                      className="mt-0.5 bg-space-800 border border-space-700 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none">
                      {['Environmental','Radiation','Crew','System','Comms','Medical','Compound'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="metric-label text-xs">Severity</label>
                    <select value={ev.severity} onChange={e => updateEvent(ev.id, 'severity', e.target.value)}
                      className="mt-0.5 bg-space-800 border border-space-700 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none">
                      {['Info','Warning','High','Critical'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => removeEvent(ev.id)} className="btn-icon text-rose-500 hover:text-rose-400 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
              <div>
                <label className="metric-label text-xs">Description</label>
                <input value={ev.description} onChange={e => updateEvent(ev.id, 'description', e.target.value)}
                  className="mt-0.5 w-full bg-space-800 border border-space-700 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
