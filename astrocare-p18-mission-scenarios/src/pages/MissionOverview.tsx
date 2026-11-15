import { useNavigate } from 'react-router-dom';
import {
  Satellite, Shield, Users, Zap, Database, AlertTriangle,
  TrendingUp, Calendar, ChevronRight, Info
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, ResponsiveContainer, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell
} from 'recharts';
import { useSimStore } from '../store/simulationStore';
import { getSeverityBg, getReadinessBg, barColor } from '../utils/ui';

const DISCLAIMER = '⚠ All values are SIMULATED MODEL OUTPUTS. Not validated NASA mission operations data.';

function StatusPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="panel p-3 flex flex-col gap-1">
      <span className="metric-label">{label}</span>
      <span className={`font-mono font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}

export default function MissionOverview() {
  const { missionProfile, selectedScenario, currentTelemetry, telemetryHistory, loadScenario } = useSimStore();
  const navigate = useNavigate();
  const tel = currentTelemetry;

  // Build chart data from history (last 60 entries)
  const histSlice = telemetryHistory.slice(-60);
  const crewTrend = histSlice.map(h => ({
    t: h.timestampFormatted.slice(0, 8),
    spO2: +h.crew.oxygenSaturationPercent.toFixed(1),
    hr: +h.crew.heartRateBpm.toFixed(0),
    fatigue: +h.crew.fatigueIndex.toFixed(0),
    readiness: +h.crew.readinessScorePercent.toFixed(0),
  }));

  const envTrend = histSlice.map(h => ({
    t: h.timestampFormatted.slice(0, 8),
    pressure: +h.environment.cabinPressureKPa.toFixed(1),
    co2: +h.environment.co2KPa.toFixed(2),
    temp: +h.environment.temperatureC.toFixed(1),
  }));

  const radTrend = histSlice.map(h => ({
    t: h.timestampFormatted.slice(0, 8),
    rate: +h.radiation.effectiveDoseRateMicroSvPerHour.toFixed(0),
    accum: +h.radiation.accumulatedEquivalentDoseMilliSv.toFixed(2),
  }));

  const resourceData = tel ? [
    { name: 'O₂', value: (tel.resources.oxygenRemainingKg / tel.resources.oxygenCapacityKg) * 100 },
    { name: 'H₂O', value: (tel.resources.waterRemainingLiters / tel.resources.waterCapacityLiters) * 100 },
    { name: 'Power', value: tel.resources.batteryStateOfChargePercent },
    { name: 'Consumables', value: Math.min(100, tel.resources.consumableRationDays) },
  ] : [];

  const riskRadar = tel ? tel.risks.map(r => ({
    subject: r.category.replace(' ', '\n'),
    score: r.riskScore,
    fullMark: 25,
  })) : [];

  return (
    <div className="p-4 space-y-4 max-w-screen-2xl mx-auto">
      {/* Disclaimer */}
      <div className="bg-amber-900/20 border border-amber-700/40 rounded px-4 py-2 flex items-center gap-2 text-xs text-amber-400 font-mono">
        <Info size={12} />
        {DISCLAIMER}
      </div>

      {/* Mission Header */}
      <div className="panel p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-astro-blue/10 rounded-lg border border-astro-blue/30">
              <Satellite size={28} className="text-astro-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-100">{missionProfile.name}</h1>
                <span className="status-badge status-info">{missionProfile.identifier}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-mono">
                <span>🚀 {missionProfile.spacecraftType}</span>
                <span>👨‍🚀 {missionProfile.crewSize} crew</span>
                <span>📅 Day {missionProfile.currentDay} of {missionProfile.durationDays}</span>
                <span>🛸 {missionProfile.phase}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {selectedScenario ? (
              <>
                <span className="text-xs text-slate-500 font-mono">ACTIVE SCENARIO</span>
                <span className="font-mono font-bold text-astro-cyan">{selectedScenario.name}</span>
                <span className={`status-badge border ${getSeverityBg(selectedScenario.severityClassification)}`}>
                  {selectedScenario.severityClassification} SEVERITY
                </span>
              </>
            ) : (
              <button onClick={() => navigate('/library')} className="btn-primary flex items-center gap-2">
                Load Scenario <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Operational Status Grid */}
      {tel ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <StatusPill label="Mission Status" value={selectedScenario ? 'ACTIVE' : 'STANDBY'}
            color={selectedScenario ? 'text-astro-cyan' : 'text-slate-500'} />
          <StatusPill label="Crew Readiness" value={tel.crew.readinessCategory}
            color={getReadinessBg(tel.crew.readinessCategory).split(' ')[2] || 'text-slate-300'} />
          <StatusPill label="Cabin Pressure" value={`${tel.environment.cabinPressureKPa.toFixed(1)} kPa`}
            color={tel.environment.cabinPressureKPa < 90 ? 'text-rose-400' : tel.environment.cabinPressureKPa < 95 ? 'text-amber-400' : 'text-emerald-400'} />
          <StatusPill label="Eff. Dose Rate" value={`${tel.radiation.effectiveDoseRateMicroSvPerHour.toFixed(0)} µSv/h`}
            color={tel.radiation.effectiveDoseRateMicroSvPerHour > 1000 ? 'text-rose-400' : tel.radiation.effectiveDoseRateMicroSvPerHour > 300 ? 'text-amber-400' : 'text-emerald-400'} />
          <StatusPill label="O₂ Reserve" value={`${((tel.resources.oxygenRemainingKg/tel.resources.oxygenCapacityKg)*100).toFixed(0)}%`}
            color={tel.resources.oxygenRemainingKg/tel.resources.oxygenCapacityKg < 0.3 ? 'text-rose-400' : 'text-emerald-400'} />
          <StatusPill label="Active Anomalies" value={tel.activeAlerts.length.toString()}
            color={tel.activeAlerts.length > 0 ? 'text-rose-400 alert-blink' : 'text-slate-500'} />
          <StatusPill label="Risk Score" value={tel.compoundRiskScore.toFixed(0)}
            color={tel.compoundRiskScore > 60 ? 'text-rose-400' : tel.compoundRiskScore > 30 ? 'text-amber-400' : 'text-emerald-400'} />
        </div>
      ) : (
        <div className="panel p-6 text-center text-slate-500 font-mono text-sm">
          No scenario loaded. <button onClick={() => navigate('/library')} className="text-astro-cyan underline">Load a scenario</button> to begin simulation.
        </div>
      )}

      {/* Active Alerts */}
      {tel && tel.activeAlerts.length > 0 && (
        <div className="panel border-rose-800/60 bg-rose-950/20 p-3 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-rose-400 alert-blink" />
            <span className="font-mono text-xs text-rose-400 font-bold uppercase tracking-widest">Active Operational Alerts</span>
          </div>
          {tel.activeAlerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono text-rose-300">
              <span className="text-rose-600">▶</span> {alert}
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      {tel && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Crew Health Trend */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-blue-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Crew Health Trend</span>
              </div>
              <span className="sim-label">SIMULATED</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={crewTrend}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} width={28} />
                <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="spO2" stroke="#00e5ff" dot={false} name="SpO2 %" strokeWidth={1.5} />
                <Line type="monotone" dataKey="readiness" stroke="#10b981" dot={false} name="Readiness %" strokeWidth={1.5} />
                <Line type="monotone" dataKey="fatigue" stroke="#f59e0b" dot={false} name="Fatigue" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono">
              <span style={{color:'#00e5ff'}}>— SpO2%</span>
              <span style={{color:'#10b981'}}>— Readiness%</span>
              <span style={{color:'#f59e0b'}}>— Fatigue</span>
            </div>
          </div>

          {/* Environmental Trend */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-teal-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Environmental Trend</span>
              </div>
              <span className="sim-label">SIMULATED</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={envTrend}>
                <XAxis dataKey="t" hide />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={36} />
                <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" dot={false} name="Pressure kPa" strokeWidth={1.5} />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" dot={false} name="Temp °C" strokeWidth={1.5} />
                <Line type="monotone" dataKey="co2" stroke="#f43f5e" dot={false} name="CO₂ kPa" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono">
              <span style={{color:'#3b82f6'}}>— Pressure</span>
              <span style={{color:'#f59e0b'}}>— Temp°C</span>
              <span style={{color:'#f43f5e'}}>— CO₂</span>
            </div>
          </div>

          {/* Radiation Trend */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-violet-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Radiation Exposure (Eff. Dose)</span>
              </div>
              <span className="sim-label">SIMULATED</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={radTrend}>
                <XAxis dataKey="t" hide />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }} />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="#8b5cf620" name="Rate µSv/h" strokeWidth={1.5} />
                <Line type="monotone" dataKey="accum" stroke="#f43f5e" dot={false} name="Accum. mSv" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-xs font-mono text-slate-500 mt-1">
              Abs: {tel.radiation.accumulatedAbsorbedDoseMilliGy.toFixed(1)} mGy &nbsp;|&nbsp;
              Eff: {tel.radiation.accumulatedEquivalentDoseMilliSv.toFixed(1)} mSv
              &nbsp;<span className="text-amber-600">(Gy ≠ Sv — different quantities)</span>
            </div>
          </div>

          {/* Resource Bars */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-emerald-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Resource Reserves</span>
              </div>
              <span className="sim-label">SIMULATED</span>
            </div>
            <div className="space-y-3">
              {resourceData.map(r => (
                <div key={r.name}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">{r.name}</span>
                    <span style={{ color: barColor(r.value) }}>{r.value.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-space-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${r.value}%`, background: barColor(r.value) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Radar */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-rose-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Mission Risk Distribution</span>
              </div>
              <span className="sim-label">SIMULATED</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={riskRadar}>
                <PolarGrid stroke="#263756" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }} />
                <Radar name="Risk Score" dataKey="score" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="text-xs font-mono text-slate-600 text-center mt-1">
              Score = Likelihood(1-5) × Consequence(1-5). Max = 25.
            </div>
          </div>

          {/* Event Timeline mini */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-amber-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Recent Events</span>
              </div>
              <button onClick={() => navigate('/timeline')} className="text-xs text-astro-cyan hover:underline font-mono">
                Full Timeline →
              </button>
            </div>
            {tel && selectedScenario?.events.filter(e => e.applied).length ? (
              <div className="space-y-2 overflow-y-auto max-h-48">
                {selectedScenario.events.filter(e => e.applied).slice(-5).reverse().map(ev => (
                  <div key={ev.id} className={`flex items-start gap-2 p-2 rounded border text-xs ${
                    ev.severity === 'Critical' ? 'border-rose-800/50 bg-rose-950/20' :
                    ev.severity === 'High' ? 'border-orange-800/50 bg-orange-950/20' :
                    ev.severity === 'Warning' ? 'border-amber-800/50 bg-amber-950/20' :
                    'border-space-700 bg-space-850/50'}`}>
                    <span className={`font-mono font-bold mt-0.5 ${
                      ev.severity === 'Critical' ? 'text-rose-400' :
                      ev.severity === 'High' ? 'text-orange-400' :
                      ev.severity === 'Warning' ? 'text-amber-400' : 'text-blue-400'
                    }`}>●</span>
                    <div>
                      <div className="font-mono font-semibold text-slate-200">{ev.title}</div>
                      <div className="text-slate-500">{ev.category} · T+{ev.triggerTimeSec}s</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-mono text-center py-6">
                No events dispatched yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* No scenario yet — landing prompt */}
      {!tel && (
        <div className="panel p-12 text-center space-y-4">
          <Satellite size={48} className="text-astro-cyan/30 mx-auto" />
          <h2 className="text-xl font-bold text-slate-400">Mission Simulation Not Started</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Select a scenario from the library to begin an operational simulation.
            All outputs are labelled as simulated model data.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate('/library')} className="btn-primary flex items-center gap-2">
              <BookOpen size={14} /> Browse Scenario Library
            </button>
            <button onClick={() => navigate('/builder')} className="btn-secondary flex items-center gap-2">
              <Settings2 size={14} /> Build Custom Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldAlert({ size, className }: { size: number; className?: string }) {
  return <Shield size={size} className={className} />;
}

function BookOpen({ size, className }: { size: number; className?: string }) {
  return <Calendar size={size} className={className} />;
}

function Settings2({ size, className }: { size: number; className?: string }) {
  return <Settings size={size} className={className} />;
}
