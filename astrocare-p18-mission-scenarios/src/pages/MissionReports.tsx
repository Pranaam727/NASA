import { useState } from 'react';
import { FileText, Download, Info, CheckCircle } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';
import type { MissionSimulationReport } from '../contracts/index';
import { SCIENTIFIC_MODEL_DISCLAIMERS } from '../data/nasaReferences';

function generateReport(state: ReturnType<typeof useSimStore.getState>): MissionSimulationReport | null {
  const { missionProfile, selectedScenario, currentTelemetry, telemetryHistory } = state;
  if (!selectedScenario || !currentTelemetry) return null;

  const history = telemetryHistory;
  const minSpO2 = history.length > 0 ? Math.min(...history.map(h => h.crew.oxygenSaturationPercent)) : currentTelemetry.crew.oxygenSaturationPercent;
  const maxHR = history.length > 0 ? Math.max(...history.map(h => h.crew.heartRateBpm)) : currentTelemetry.crew.heartRateBpm;
  const peakRadRate = history.length > 0 ? Math.max(...history.map(h => h.radiation.effectiveDoseRateMicroSvPerHour)) : currentTelemetry.radiation.effectiveDoseRateMicroSvPerHour;
  const minPressure = history.length > 0 ? Math.min(...history.map(h => h.environment.cabinPressureKPa)) : currentTelemetry.environment.cabinPressureKPa;
  const lowestReadiness = history.length > 0 ? Math.min(...history.map(h => h.crew.readinessScorePercent)) : currentTelemetry.crew.readinessScorePercent;

  return {
    reportId: `RPT-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    missionProfile,
    scenarioExecuted: selectedScenario,
    totalDurationSimulatedSec: currentTelemetry.elapsedSec,
    initialConditions: {
      environment: selectedScenario.initialConditions.environment,
      crew: selectedScenario.initialConditions.crew,
      radiation: selectedScenario.initialConditions.radiation,
      resources: selectedScenario.initialConditions.resources,
    },
    finalConditions: {
      environment: currentTelemetry.environment,
      crew: currentTelemetry.crew,
      radiation: currentTelemetry.radiation,
      resources: currentTelemetry.resources,
    },
    criticalEventsEncountered: selectedScenario.events.filter(e => e.applied && (e.severity === 'Critical' || e.severity === 'High')),
    interventionsApplied: [],
    telemetryLogSummary: {
      minSpO2,
      maxHeartRate: maxHR,
      peakRadiationDoseRateMicroSvPerH: peakRadRate,
      totalAbsorbedDoseMilliGy: currentTelemetry.radiation.accumulatedAbsorbedDoseMilliGy,
      totalEffectiveDoseMilliSv: currentTelemetry.radiation.accumulatedEquivalentDoseMilliSv,
      minCabinPressureKPa: minPressure,
      lowestReadinessPercent: lowestReadiness,
      oxygenRemainingPercent: (currentTelemetry.resources.oxygenRemainingKg / currentTelemetry.resources.oxygenCapacityKg) * 100,
      finalRiskScore: currentTelemetry.compoundRiskScore,
    },
    scientificAssumptionsAndDisclaimers: SCIENTIFIC_MODEL_DISCLAIMERS,
  };
}

function exportJSON(report: MissionSimulationReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AstroCare_P18_Report_${report.reportId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(report: MissionSimulationReport) {
  const rows = [
    ['Field', 'Value'],
    ['Report ID', report.reportId],
    ['Generated At', report.generatedAt],
    ['Mission', report.missionProfile.name],
    ['Scenario', report.scenarioExecuted.name],
    ['Duration Simulated (s)', report.totalDurationSimulatedSec.toString()],
    ['Min SpO2 (%)', report.telemetryLogSummary.minSpO2.toFixed(1)],
    ['Max HR (bpm)', report.telemetryLogSummary.maxHeartRate.toFixed(0)],
    ['Peak Radiation (µSv/h)', report.telemetryLogSummary.peakRadiationDoseRateMicroSvPerH.toFixed(0)],
    ['Total Absorbed Dose (mGy)', report.telemetryLogSummary.totalAbsorbedDoseMilliGy.toFixed(2)],
    ['Total Effective Dose (mSv)', report.telemetryLogSummary.totalEffectiveDoseMilliSv.toFixed(2)],
    ['Min Cabin Pressure (kPa)', report.telemetryLogSummary.minCabinPressureKPa.toFixed(1)],
    ['Lowest Readiness (%)', report.telemetryLogSummary.lowestReadinessPercent.toFixed(0)],
    ['O2 Remaining (%)', report.telemetryLogSummary.oxygenRemainingPercent.toFixed(0)],
    ['Final Risk Score', report.telemetryLogSummary.finalRiskScore.toFixed(0)],
    ['Disclaimers', report.scientificAssumptionsAndDisclaimers.join(' | ')],
  ];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AstroCare_P18_Report_${report.reportId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MissionReports() {
  const store = useSimStore();
  const { selectedScenario, currentTelemetry, missionProfile } = store;
  const [generated, setGenerated] = useState<MissionSimulationReport | null>(null);

  function handleGenerate() {
    const report = generateReport(useSimStore.getState());
    setGenerated(report);
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FileText size={18} className="text-slate-400" />
          Mission Simulation Reports
        </h1>
        <div className="flex gap-2">
          <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 text-sm">
            <FileText size={14} /> Generate Report
          </button>
          {generated && (
            <>
              <button onClick={() => exportJSON(generated)} className="btn-secondary flex items-center gap-2 text-sm">
                <Download size={14} /> Export JSON
              </button>
              <button onClick={() => exportCSV(generated)} className="btn-secondary flex items-center gap-2 text-sm">
                <Download size={14} /> Export CSV
              </button>
            </>
          )}
        </div>
      </div>

      {!selectedScenario || !currentTelemetry ? (
        <div className="panel p-12 text-center text-slate-600 font-mono">
          Run a simulation scenario to generate a mission report.
        </div>
      ) : (
        <>
          {!generated ? (
            <div className="panel p-6 text-center space-y-3">
              <FileText size={36} className="mx-auto text-slate-700" />
              <p className="text-slate-500 font-mono text-sm">Click "Generate Report" to compile the current simulation state into a mission simulation report.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Disclaimer */}
              <div className="bg-amber-900/20 border border-amber-700/40 rounded px-4 py-2 text-xs text-amber-400 font-mono flex items-start gap-2">
                <Info size={12} className="shrink-0 mt-0.5" />
                <div>
                  {SCIENTIFIC_MODEL_DISCLAIMERS.map((d, i) => <div key={i} className="mb-0.5">{d}</div>)}
                </div>
              </div>

              {/* Header block */}
              <div className="panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-slate-100">Simulation Report — {generated.reportId}</h2>
                  <span className="text-xs text-slate-500 font-mono">{new Date(generated.generatedAt).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: 'Mission', v: generated.missionProfile.name },
                    { l: 'Scenario', v: generated.scenarioExecuted.name },
                    { l: 'Sim Duration', v: `${(generated.totalDurationSimulatedSec / 60).toFixed(1)} min` },
                    { l: 'Severity', v: generated.scenarioExecuted.severityClassification },
                  ].map(r => (
                    <div key={r.l} className="bg-space-850 rounded p-3 border border-space-750">
                      <div className="metric-label">{r.l}</div>
                      <div className="font-mono text-sm text-slate-100 font-semibold mt-0.5">{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key metrics */}
              <div className="panel p-4">
                <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Mission Performance Summary <span className="text-amber-600">(SIMULATED)</span></h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { l: 'Min SpO₂', v: `${generated.telemetryLogSummary.minSpO2.toFixed(1)}%`, ok: generated.telemetryLogSummary.minSpO2 >= 94 },
                    { l: 'Max HR', v: `${generated.telemetryLogSummary.maxHeartRate.toFixed(0)} bpm`, ok: generated.telemetryLogSummary.maxHeartRate <= 110 },
                    { l: 'Peak Dose Rate', v: `${generated.telemetryLogSummary.peakRadiationDoseRateMicroSvPerH.toFixed(0)} µSv/h`, ok: generated.telemetryLogSummary.peakRadiationDoseRateMicroSvPerH < 300 },
                    { l: 'Min Pressure', v: `${generated.telemetryLogSummary.minCabinPressureKPa.toFixed(1)} kPa`, ok: generated.telemetryLogSummary.minCabinPressureKPa >= 70 },
                    { l: 'Min Readiness', v: `${generated.telemetryLogSummary.lowestReadinessPercent.toFixed(0)}%`, ok: generated.telemetryLogSummary.lowestReadinessPercent >= 50 },
                    { l: 'Accum. Eff. Dose', v: `${generated.telemetryLogSummary.totalEffectiveDoseMilliSv.toFixed(2)} mSv`, ok: generated.telemetryLogSummary.totalEffectiveDoseMilliSv < 50 },
                    { l: 'Accum. Abs. Dose', v: `${generated.telemetryLogSummary.totalAbsorbedDoseMilliGy.toFixed(2)} mGy`, ok: true },
                    { l: 'O₂ Remaining', v: `${generated.telemetryLogSummary.oxygenRemainingPercent.toFixed(0)}%`, ok: generated.telemetryLogSummary.oxygenRemainingPercent >= 20 },
                    { l: 'Final Risk Score', v: generated.telemetryLogSummary.finalRiskScore.toFixed(0), ok: generated.telemetryLogSummary.finalRiskScore <= 30 },
                  ].map(m => (
                    <div key={m.l} className={`rounded p-3 border text-center ${m.ok ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-rose-950/20 border-rose-800/40'}`}>
                      <div className="metric-label">{m.l}</div>
                      <div className={`font-mono font-bold mt-1 ${m.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{m.v}</div>
                      <div className="text-xs mt-0.5">{m.ok ? <span className="text-emerald-600">✓ PASS</span> : <span className="text-rose-600">✗ FLAG</span>}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical events */}
              {generated.criticalEventsEncountered.length > 0 && (
                <div className="panel p-4">
                  <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Critical Events Encountered</h2>
                  <div className="space-y-2">
                    {generated.criticalEventsEncountered.map(ev => (
                      <div key={ev.id} className="flex items-center gap-3 p-2 rounded border border-orange-800/40 bg-orange-950/20 text-xs">
                        <span className="font-mono text-slate-500 shrink-0">T+{ev.triggerTimeSec}s</span>
                        <span className={`font-bold shrink-0 ${ev.severity === 'Critical' ? 'text-rose-400' : 'text-orange-400'}`}>
                          [{ev.severity}]
                        </span>
                        <span className="text-slate-200">{ev.title}</span>
                        <span className="text-slate-500 ml-auto">{ev.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Initial vs Final conditions */}
              <div className="panel p-4">
                <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Initial vs Final Simulation State <span className="text-amber-600">(SIMULATED)</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Initial Conditions', data: generated.initialConditions },
                    { title: 'Final Conditions', data: generated.finalConditions },
                  ].map(col => (
                    <div key={col.title}>
                      <h3 className="text-xs font-mono text-slate-400 mb-2">{col.title}</h3>
                      <pre className="bg-space-950 rounded border border-space-800 p-3 text-xs font-mono text-slate-400 overflow-auto max-h-60">
                        {JSON.stringify(col.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model limitations */}
              <div className="panel p-4">
                <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Model Limitations & Assumptions</h2>
                <ul className="space-y-2">
                  {[
                    'Atmospheric gas dynamics: Lumped-parameter ideal gas model, not 3D CFD. Mixing assumed instantaneous.',
                    'Radiation: Simplified 1D slab shielding attenuation. Not HZETRN or Monte Carlo MCNP. Quality factors are approximate.',
                    'Physiology: Heuristic transfer functions correlating environmental conditions to vital sign proxies. Not validated clinical models.',
                    'Resources: Linear consumption approximations with configurable multipliers. Not spacecraft ECLSS engineering calculations.',
                    'Risk scoring: Deterministic 5×5 matrix from telemetry thresholds. Not probabilistic mission risk analysis.',
                    'Radiation quantities: Absorbed dose (Gy) and effective dose (Sv) are tracked separately and correctly not combined.',
                    'All outputs are illustrative educational models. No NASA, ESA, or medical authority has validated this simulation.',
                  ].map((l, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle size={12} className="text-slate-700 shrink-0 mt-0.5" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
