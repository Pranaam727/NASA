import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, RotateCcw, StepForward, Zap, Shield,
  Users, Database, ChevronRight, Info, AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip, ReferenceLine
} from 'recharts';
import { useSimStore, type SimSpeedOption } from '../store/simulationStore';
import { getSeverityBg, getReadinessBg } from '../utils/ui';

const SPEEDS: SimSpeedOption[] = [1, 2, 10, 60, 300];

function SpeedBtn({ speed }: { speed: SimSpeedOption }) {
  const { speed: current, setSpeed } = useSimStore();
  return (
    <button onClick={() => setSpeed(speed)}
      className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
        current === speed ? 'bg-astro-blue text-white' : 'bg-space-800 text-slate-500 hover:text-slate-200'
      }`}>
      {speed}×
    </button>
  );
}

function MiniChart({ data, dataKey, color, unit, refValue, refLabel }: {
  data: any[]; dataKey: string; color: string; unit: string; refValue?: number; refLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <XAxis dataKey="t" hide />
        <YAxis tick={{ fontSize: 9, fill: '#475569' }} />
        <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 10 }}
          formatter={(v: any) => [`${Number(v).toFixed(1)} ${unit}`, dataKey]} />
        {refValue !== undefined && (
          <ReferenceLine y={refValue} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: refLabel, fill: '#f43f5e', fontSize: 9 }} />
        )}
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color + '20'} dot={false} strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function RecoveryActionPanel() {
  const { applyRecoveryAction, currentTelemetry } = useSimStore();
  const tel = currentTelemetry;

  const actions = [
    { id: 'shelter_ingress', label: 'Storm Shelter Ingress', color: 'btn-danger', show: tel?.radiation.speActive && !tel?.radiation.stormShelterActive },
    { id: 'shelter_egress', label: 'Storm Shelter Egress', color: 'btn-secondary', show: tel?.radiation.stormShelterActive },
    { id: 'activate_backup_o2', label: 'Activate Backup O₂', color: 'btn-warning', show: tel && tel.environment.oxygenPercent < 19 },
    { id: 'activate_backup_scrubber', label: 'Backup CO₂ Scrubber', color: 'btn-warning', show: tel && tel.environment.co2KPa > 0.5 },
    { id: 'reduce_workload', label: 'Reduce Crew Workload', color: 'btn-secondary', show: tel && tel.crew.workloadIndex > 60 },
    { id: 'mandatory_rest', label: 'Mandatory Rest Period', color: 'btn-secondary', show: tel && tel.crew.fatigueIndex > 55 },
    { id: 'restore_tcs', label: 'Restore Thermal Control', color: 'btn-warning', show: tel && tel.environment.tcsStatus !== 'Nominal' },
    { id: 'power_shed', label: 'Power Shedding Mode', color: 'btn-secondary', show: tel && tel.resources.batteryStateOfChargePercent < 50 },
    { id: 'repair_pressure_leak', label: 'Isolate Pressure Leak', color: 'btn-warning', show: tel && tel.environment.leakRatePercentPerDay > 1 },
    { id: 'restore_comms', label: 'Restore Communications', color: 'btn-secondary', show: true },
  ].filter(a => a.show !== false);

  return (
    <div className="panel p-4">
      <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
        <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Recovery Actions</span>
        <span className="text-xs text-slate-600 font-mono">Not operationally approved procedures</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(a => (
          <button key={a.id} onClick={() => applyRecoveryAction(a.id)}
            className={`${a.color} text-xs py-2 px-3 text-left`}>
            {a.label}
          </button>
        ))}
      </div>
      {actions.length === 0 && (
        <p className="text-xs text-slate-600 font-mono text-center py-4">No active recovery actions suggested.</p>
      )}
    </div>
  );
}

export default function LiveSimulation() {
  const navigate = useNavigate();
  const {
    isRunning, isPaused, selectedScenario, currentTelemetry, telemetryHistory,
    startSimulation, pauseSimulation, resumeSimulation, resetSimulation, stepSimulation, speed,
  } = useSimStore();

  const tel = currentTelemetry;
  const hist = telemetryHistory.slice(-80);

  if (!selectedScenario) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <Shield size={48} className="text-slate-700" />
        <h2 className="text-xl font-bold text-slate-400">No Scenario Loaded</h2>
        <p className="text-sm text-slate-600 max-w-sm">
          Load a scenario from the library or build a custom scenario before running the simulation.
        </p>
        <button onClick={() => navigate('/library')} className="btn-primary flex items-center gap-2">
          <ChevronRight size={14} /> Go to Scenario Library
        </button>
      </div>
    );
  }

  const crewData = hist.map(h => ({
    t: h.elapsedSec,
    spO2: +h.crew.oxygenSaturationPercent.toFixed(1),
    hr: +h.crew.heartRateBpm.toFixed(0),
    fatigue: +h.crew.fatigueIndex.toFixed(0),
    readiness: +h.crew.readinessScorePercent.toFixed(0),
    stress: +h.crew.cognitiveStressIndex.toFixed(0),
  }));

  const envData = hist.map(h => ({
    t: h.elapsedSec,
    pressure: +h.environment.cabinPressureKPa.toFixed(1),
    co2: +(h.environment.co2KPa * 10).toFixed(2), // scaled x10 for visibility
    temp: +h.environment.temperatureC.toFixed(1),
  }));

  const radData = hist.map(h => ({
    t: h.elapsedSec,
    rate: +h.radiation.effectiveDoseRateMicroSvPerHour.toFixed(0),
    accum: +h.radiation.accumulatedEquivalentDoseMilliSv.toFixed(2),
  }));

  const resData = hist.map(h => ({
    t: h.elapsedSec,
    o2: +((h.resources.oxygenRemainingKg / h.resources.oxygenCapacityKg) * 100).toFixed(0),
    power: +h.resources.batteryStateOfChargePercent.toFixed(0),
    water: +((h.resources.waterRemainingLiters / h.resources.waterCapacityLiters) * 100).toFixed(0),
  }));

  return (
    <div className="p-4 max-w-screen-2xl mx-auto space-y-4">
      {/* Controls Header */}
      <div className="panel p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">SCENARIO:</span>
            <span className="font-mono text-sm text-astro-cyan font-semibold">{selectedScenario.name}</span>
            <span className={`status-badge border ${getSeverityBg(selectedScenario.severityClassification)}`}>
              {selectedScenario.severityClassification}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Speed */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-600 font-mono">SPEED:</span>
              {SPEEDS.map(s => <SpeedBtn key={s} speed={s} />)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {!isRunning && !isPaused && (
                <button onClick={startSimulation} className="btn-success flex items-center gap-1 text-xs">
                  <Play size={12} /> Start
                </button>
              )}
              {isRunning && (
                <button onClick={pauseSimulation} className="btn-warning flex items-center gap-1 text-xs">
                  <Pause size={12} /> Pause
                </button>
              )}
              {isPaused && (
                <button onClick={resumeSimulation} className="btn-success flex items-center gap-1 text-xs">
                  <Play size={12} /> Resume
                </button>
              )}
              <button onClick={stepSimulation} disabled={isRunning}
                className="btn-secondary flex items-center gap-1 text-xs disabled:opacity-40">
                <StepForward size={12} /> Step
              </button>
              <button onClick={resetSimulation} className="btn-danger flex items-center gap-1 text-xs">
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {tel && (
              <div className="font-mono text-sm text-slate-200 bg-space-850 px-3 py-1 rounded border border-space-700">
                {tel.timestampFormatted}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-900/15 border border-amber-800/30 rounded px-3 py-1.5 text-xs text-amber-500 font-mono flex items-center gap-2">
        <Info size={11} />
        All values are SIMULATED MODEL OUTPUTS — not validated NASA mission operations data.
      </div>

      {/* Active Alerts */}
      {tel && tel.activeAlerts.length > 0 && (
        <div className="panel border-rose-800/60 bg-rose-950/20 p-3 space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className="text-rose-400 alert-blink" />
            <span className="font-mono text-xs text-rose-400 font-bold uppercase tracking-widest">Operational Alerts</span>
          </div>
          {tel.activeAlerts.map((a, i) => (
            <div key={i} className="text-xs font-mono text-rose-300">▶ {a}</div>
          ))}
        </div>
      )}

      {tel && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main telemetry charts - 3 cols */}
          <div className="xl:col-span-3 space-y-4">
            {/* Row 1: Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="panel p-4">
                <div className="panel-header -mx-4 -mt-4 mb-3 px-4 pt-3">
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-blue-400" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Crew Vitals</span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${
                    tel.crew.readinessCategory === 'Optimal' ? 'text-emerald-400' :
                    tel.crew.readinessCategory === 'Nominal' ? 'text-blue-400' :
                    tel.crew.readinessCategory === 'Degraded' ? 'text-amber-400' :
                    tel.crew.readinessCategory === 'Impaired' ? 'text-orange-400' : 'text-rose-400'
                  }`}>{tel.crew.readinessCategory}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'SpO₂', value: tel.crew.oxygenSaturationPercent.toFixed(1), unit: '%',
                      ok: tel.crew.oxygenSaturationPercent >= 95 },
                    { label: 'HR', value: tel.crew.heartRateBpm.toFixed(0), unit: 'bpm',
                      ok: tel.crew.heartRateBpm < 100 && tel.crew.heartRateBpm > 50 },
                    { label: 'RR', value: tel.crew.respiratoryRateBpm.toFixed(0), unit: 'br/m',
                      ok: tel.crew.respiratoryRateBpm < 20 },
                  ].map(m => (
                    <div key={m.label} className="bg-space-850 rounded p-2 text-center border border-space-750">
                      <div className="metric-label">{m.label}</div>
                      <div className={`font-mono font-bold text-base ${m.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.value}
                      </div>
                      <div className="text-xs text-slate-600 font-mono">{m.unit}</div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={crewData}>
                    <XAxis dataKey="t" hide />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#475569' }} width={24} />
                    <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 10 }} />
                    <Line type="monotone" dataKey="spO2" stroke="#00e5ff" dot={false} name="SpO₂%" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="readiness" stroke="#10b981" dot={false} name="Readiness%" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="fatigue" stroke="#f59e0b" dot={false} name="Fatigue" strokeWidth={1.5} />
                    <ReferenceLine y={95} stroke="#f43f5e55" strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="panel p-4">
                <div className="panel-header -mx-4 -mt-4 mb-3 px-4 pt-3">
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-teal-400" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Environment</span>
                  </div>
                  <span className={`font-mono text-xs ${tel.environment.tcsStatus === 'Nominal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    TCS: {tel.environment.tcsStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Press.', value: tel.environment.cabinPressureKPa.toFixed(1), unit: 'kPa',
                      ok: tel.environment.cabinPressureKPa >= 95 },
                    { label: 'CO₂', value: tel.environment.co2KPa.toFixed(2), unit: 'kPa',
                      ok: tel.environment.co2KPa < 0.5 },
                    { label: 'Temp', value: tel.environment.temperatureC.toFixed(1), unit: '°C',
                      ok: tel.environment.temperatureC >= 18 && tel.environment.temperatureC <= 27 },
                  ].map(m => (
                    <div key={m.label} className="bg-space-850 rounded p-2 text-center border border-space-750">
                      <div className="metric-label">{m.label}</div>
                      <div className={`font-mono font-bold text-base ${m.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.value}
                      </div>
                      <div className="text-xs text-slate-600 font-mono">{m.unit}</div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={envData}>
                    <XAxis dataKey="t" hide />
                    <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={28} />
                    <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 10 }} />
                    <Line type="monotone" dataKey="pressure" stroke="#3b82f6" dot={false} name="Press kPa" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="temp" stroke="#f59e0b" dot={false} name="Temp°C" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="co2" stroke="#f43f5e" dot={false} name="CO₂×10 kPa" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Radiation + Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="panel p-4">
                <div className="panel-header -mx-4 -mt-4 mb-3 px-4 pt-3">
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-violet-400" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Radiation</span>
                  </div>
                  {tel.radiation.speActive && (
                    <span className="status-badge status-critical alert-blink">SPE ACTIVE</span>
                  )}
                  {tel.radiation.stormShelterActive && (
                    <span className="status-badge status-warning">SHELTER</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Eff. Rate', value: tel.radiation.effectiveDoseRateMicroSvPerHour.toFixed(0), unit: 'µSv/h',
                      ok: tel.radiation.effectiveDoseRateMicroSvPerHour < 300 },
                    { label: 'Accum Sv', value: tel.radiation.accumulatedEquivalentDoseMilliSv.toFixed(1), unit: 'mSv',
                      ok: tel.radiation.accumulatedEquivalentDoseMilliSv < 50 },
                  ].map(m => (
                    <div key={m.label} className="bg-space-850 rounded p-2 text-center border border-space-750">
                      <div className="metric-label">{m.label}</div>
                      <div className={`font-mono font-bold text-base ${m.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{m.value}</div>
                      <div className="text-xs text-slate-600 font-mono">{m.unit}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-amber-600 font-mono mb-2">
                  Abs: {tel.radiation.accumulatedAbsorbedDoseMilliGy.toFixed(1)} mGy ≠ {tel.radiation.accumulatedEquivalentDoseMilliSv.toFixed(1)} mSv
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={radData}>
                    <XAxis dataKey="t" hide />
                    <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={28} />
                    <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 10 }} />
                    <ReferenceLine y={1000} stroke="#f43f5e55" strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="#8b5cf620" name="µSv/h" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="panel p-4">
                <div className="panel-header -mx-4 -mt-4 mb-3 px-4 pt-3">
                  <div className="flex items-center gap-2">
                    <Database size={12} className="text-emerald-400" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Resources</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500">×{tel.resources.consumptionRateMultiplier.toFixed(1)} rate</span>
                </div>
                {[
                  { label: 'O₂', pct: (tel.resources.oxygenRemainingKg/tel.resources.oxygenCapacityKg)*100, val: `${tel.resources.oxygenRemainingKg.toFixed(0)} kg` },
                  { label: 'H₂O', pct: (tel.resources.waterRemainingLiters/tel.resources.waterCapacityLiters)*100, val: `${tel.resources.waterRemainingLiters.toFixed(0)} L` },
                  { label: 'Power', pct: tel.resources.batteryStateOfChargePercent, val: `${tel.resources.powerRemainingKWh.toFixed(0)} kWh` },
                  { label: 'Consumables', pct: Math.min(100, tel.resources.consumableRationDays), val: `${tel.resources.consumableRationDays.toFixed(0)} d` },
                ].map(r => (
                  <div key={r.label} className="mb-2">
                    <div className="flex justify-between text-xs font-mono mb-0.5">
                      <span className="text-slate-500">{r.label}</span>
                      <span className={r.pct < 20 ? 'text-rose-400' : r.pct < 40 ? 'text-amber-400' : 'text-emerald-400'}>
                        {r.val} ({r.pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${r.pct}%`,
                          background: r.pct < 20 ? '#f43f5e' : r.pct < 40 ? '#f59e0b' : '#10b981'
                        }} />
                    </div>
                  </div>
                ))}
                <ResponsiveContainer width="100%" height={70} className="mt-2">
                  <LineChart data={resData}>
                    <XAxis dataKey="t" hide />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#475569' }} width={24} />
                    <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 10 }} />
                    <Line type="monotone" dataKey="o2" stroke="#00e5ff" dot={false} name="O₂%" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="power" stroke="#f59e0b" dot={false} name="Power%" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="water" stroke="#3b82f6" dot={false} name="H₂O%" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Event feed */}
            <div className="panel p-4">
              <div className="panel-header -mx-4 -mt-4 mb-3 px-4 pt-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Dispatched Events</span>
                <span className="text-xs text-slate-600 font-mono">{selectedScenario.events.filter(e => e.applied).length} / {selectedScenario.events.length}</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedScenario.events.filter(e => e.applied).reverse().map(ev => (
                  <div key={ev.id} className={`flex items-center gap-2 text-xs p-1.5 rounded ${
                    ev.severity === 'Critical' ? 'bg-rose-950/30 text-rose-300' :
                    ev.severity === 'High' ? 'bg-orange-950/30 text-orange-300' :
                    ev.severity === 'Warning' ? 'bg-amber-950/30 text-amber-300' : 'bg-space-850 text-blue-300'
                  }`}>
                    <span className="font-mono shrink-0">T+{ev.triggerTimeSec}s</span>
                    <span className="font-semibold">{ev.title}</span>
                    <span className="text-slate-500 ml-auto">{ev.category}</span>
                  </div>
                ))}
                {selectedScenario.events.filter(e => e.applied).length === 0 && (
                  <p className="text-xs text-slate-600 font-mono py-2 text-center">No events dispatched yet. Start the simulation.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recovery actions sidebar */}
          <div className="xl:col-span-1">
            <RecoveryActionPanel />
          </div>
        </div>
      )}
    </div>
  );
}
