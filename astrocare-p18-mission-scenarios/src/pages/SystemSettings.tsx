import { useState } from 'react';
import { Settings, Info, ExternalLink } from 'lucide-react';
import { useSimStore, type SimSpeedOption } from '../store/simulationStore';
import { NASA_REFERENCES } from '../data/nasaReferences';

const SPEEDS: SimSpeedOption[] = [1, 2, 10, 60, 300];

export default function SystemSettings() {
  const { speed, setSpeed, missionProfile, setMissionProfile, customScenarios, deleteCustomScenario } = useSimStore();
  const [profile, setProfile] = useState(missionProfile);

  function handleSave() {
    setMissionProfile(profile);
    alert('Mission profile saved.');
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <Settings size={18} className="text-slate-400" />
        System Settings
      </h1>

      {/* Simulation speed */}
      <div className="panel p-4">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Default Simulation Speed</h2>
        <div className="flex gap-2">
          {SPEEDS.map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-4 py-2 rounded font-mono text-sm ${speed === s ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-400 hover:text-slate-200'}`}>
              {s}×
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 font-mono mt-2">
          Speed multiplier determines how many simulated seconds pass per real-time second of engine tick.
        </p>
      </div>

      {/* Mission profile */}
      <div className="panel p-4 space-y-3">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Mission Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Mission Name', key: 'name' },
            { label: 'Mission Identifier', key: 'identifier' },
          ].map(f => (
            <div key={f.key}>
              <label className="metric-label block mb-1">{f.label}</label>
              <input value={(profile as any)[f.key]}
                onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue" />
            </div>
          ))}
          <div>
            <label className="metric-label block mb-1">Spacecraft Type</label>
            <select value={profile.spacecraftType}
              onChange={e => setProfile(p => ({ ...p, spacecraftType: e.target.value as any }))}
              className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue">
              {['Orion MPCV', 'Deep Space Habitat', 'Lunar Gateway', 'Mars Transit Vehicle'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="metric-label block mb-1">Mission Duration (days)</label>
            <input type="number" min={1} max={1000} value={profile.durationDays}
              onChange={e => setProfile(p => ({ ...p, durationDays: parseInt(e.target.value) }))}
              className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue" />
          </div>
          <div>
            <label className="metric-label block mb-1">Crew Size</label>
            <input type="number" min={1} max={10} value={profile.crewSize}
              onChange={e => setProfile(p => ({ ...p, crewSize: parseInt(e.target.value) }))}
              className="w-full bg-space-800 border border-space-700 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-astro-blue" />
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm">Save Profile</button>
      </div>

      {/* Custom scenarios */}
      {customScenarios.length > 0 && (
        <div className="panel p-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
            Saved Custom Scenarios ({customScenarios.length})
          </h2>
          <div className="space-y-2">
            {customScenarios.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-space-850 rounded border border-space-750">
                <div>
                  <span className="font-mono text-xs text-slate-500">{s.id}</span>
                  <span className="ml-3 font-semibold text-sm text-slate-200">{s.name}</span>
                </div>
                <button onClick={() => deleteCustomScenario(s.id)} className="btn-danger text-xs py-1 px-2">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NASA References */}
      <div className="panel p-4">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Scientific References & Grounding</h2>
        <div className="bg-amber-900/20 border border-amber-700/40 rounded px-3 py-2 text-xs text-amber-400 font-mono mb-3 flex items-center gap-2">
          <Info size={12} />
          All models are informed by but do not claim validation against these sources. Simulation outputs are illustrative only.
        </div>
        <div className="space-y-3">
          {NASA_REFERENCES.map(ref => (
            <div key={ref.id} className="p-3 bg-space-850 rounded border border-space-750">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="font-mono text-xs text-slate-500">{ref.code} · {ref.publicationYear}</span>
                  <h3 className="font-semibold text-sm text-slate-200 mt-0.5">{ref.title}</h3>
                </div>
                <span className="text-xs bg-space-800 border border-space-700 rounded px-2 py-0.5 font-mono text-slate-500 shrink-0">
                  {ref.domain.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-1">{ref.scientificContext}</p>
              <div className="text-xs text-teal-600 mb-1">
                <span className="font-semibold">Implementation: </span>{ref.modelImplementationNote}
              </div>
              <div className="text-xs text-amber-600">
                <span className="font-semibold">Limitations: </span>{ref.limitations}
              </div>
              <a href={ref.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-astro-cyan hover:underline flex items-center gap-1 mt-1">
                <ExternalLink size={10} /> {ref.url}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Version info */}
      <div className="panel p-4 text-xs font-mono text-slate-700 space-y-1">
        <div>AstroCare P18 — Mission Scenarios, Operational Simulation & Mission Readiness Intelligence</div>
        <div>Version 1.0.0 · Standalone Module · React + TypeScript + Vite + Tailwind CSS + Recharts + Zustand</div>
        <div>All simulation outputs are SIMULATED MODEL DATA. Not validated NASA mission operations tools.</div>
        <div>Integration contracts: src/contracts/index.ts · Engine: src/engine/SimulationEngine.ts · Store: src/store/simulationStore.ts</div>
      </div>
    </div>
  );
}
