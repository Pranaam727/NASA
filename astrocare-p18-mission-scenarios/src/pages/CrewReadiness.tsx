import { Users, Info, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useSimStore } from '../store/simulationStore';
import { getReadinessBg, getReadinessColor } from '../utils/ui';

function IndicatorBar({ label, value, good, warn }: { label: string; value: number; good: number; warn: number }) {
  const color = value >= good ? '#10b981' : value >= warn ? '#f59e0b' : '#f43f5e';
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-slate-500">{label}</span>
        <span style={{ color }}>{value.toFixed(0)}/100</span>
      </div>
      <div className="h-2 bg-space-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function CrewReadiness() {
  const { currentTelemetry, telemetryHistory, applyRecoveryAction } = useSimStore();
  const tel = currentTelemetry;

  if (!tel) {
    return (
      <div className="p-4 text-center text-slate-500 font-mono mt-16">
        <Users size={48} className="mx-auto text-slate-700 mb-4" />
        Run a simulation to view crew readiness data.
      </div>
    );
  }

  const { crew, environment, risks } = tel;

  // Radar data
  const radarData = [
    { subject: 'SpO₂', score: crew.oxygenSaturationPercent },
    { subject: 'Alertness', score: 100 - crew.fatigueIndex },
    { subject: 'Stress-Free', score: 100 - crew.cognitiveStressIndex },
    { subject: 'Work Cap.', score: 100 - crew.workloadIndex },
    { subject: 'Sleep', score: 100 - crew.circadianDisruptionIndex },
    { subject: 'Environ.', score: environment.oxygenPercent > 20 ? 100 : (environment.oxygenPercent - 15) * 20 },
  ];

  const readinessHistory = telemetryHistory.slice(-40).map(h => h.crew.readinessScorePercent);

  // Decision support
  const concerns: Array<{ concern: string; evidence: string; options: string[]; tradeoffs: string }> = [];

  if (crew.oxygenSaturationPercent < 95) {
    concerns.push({
      concern: 'Hypoxia Risk — SpO₂ Below Nominal',
      evidence: `SpO₂: ${crew.oxygenSaturationPercent.toFixed(1)}% | ppO₂: ${environment.oxygenKPa.toFixed(1)} kPa | Respiratory rate: ${crew.respiratoryRateBpm.toFixed(0)} br/min`,
      options: ['Activate supplemental O₂', 'Increase O₂ flow rate', 'Reduce metabolic activity', 'Medical assessment'],
      tradeoffs: 'Supplemental O₂ reduces reserve. Reduced activity may delay mission tasks.',
    });
  }

  if (crew.fatigueIndex > 55) {
    concerns.push({
      concern: 'Cognitive Fatigue Accumulation',
      evidence: `Fatigue index: ${crew.fatigueIndex.toFixed(0)}/100 | Circadian disruption: ${crew.circadianDisruptionIndex.toFixed(0)}/100 | Workload: ${crew.workloadIndex.toFixed(0)}%`,
      options: ['Mandatory rest period (8h)', 'Reduce task complexity', 'Buddy-check protocol', 'Psychomotor vigilance monitoring'],
      tradeoffs: 'Rest restores cognitive performance but delays timeline. Buddy-checks add workload.',
    });
  }

  if (environment.co2KPa > 0.5) {
    concerns.push({
      concern: 'Elevated CO₂ Concentration',
      evidence: `CO₂: ${environment.co2KPa.toFixed(2)} kPa | Scrubber: ${environment.scrubberEfficiencyPercent.toFixed(0)}% | HR: ${crew.heartRateBpm.toFixed(0)} bpm`,
      options: ['Activate backup CO₂ scrubber', 'Deploy LiOH canisters', 'Reduce metabolic load', 'Cabin ventilation purge'],
      tradeoffs: 'LiOH canisters are single-use consumables. Purge wastes O₂.',
    });
  }

  if (concerns.length === 0) {
    concerns.push({
      concern: 'All Crew Indicators Nominal',
      evidence: `Readiness: ${crew.readinessScorePercent.toFixed(0)}% | SpO₂: ${crew.oxygenSaturationPercent.toFixed(1)}% | Fatigue: ${crew.fatigueIndex.toFixed(0)}/100`,
      options: ['Continue standard monitoring', 'Maintain current schedule'],
      tradeoffs: 'No active trade-offs required.',
    });
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          Crew Readiness & Decision Support
        </h1>
        <div className={`px-4 py-2 rounded border font-mono font-bold text-lg ${getReadinessBg(crew.readinessCategory)}`}>
          {crew.readinessCategory} — {crew.readinessScorePercent.toFixed(0)}%
        </div>
      </div>

      <div className="bg-amber-900/20 border border-amber-700/40 rounded px-4 py-2 text-xs text-amber-400 font-mono flex items-center gap-2">
        <Info size={12} />
        Readiness score is a simplified composite heuristic. Not a validated clinical or operational metric.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: indicators + radar */}
        <div className="xl:col-span-1 space-y-4">
          <div className="panel p-4 space-y-3">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Crew Condition Indicators</h2>
            <IndicatorBar label="SpO₂ Saturation" value={crew.oxygenSaturationPercent} good={95} warn={90} />
            <IndicatorBar label="Alertness (100 − Fatigue)" value={100 - crew.fatigueIndex} good={60} warn={40} />
            <IndicatorBar label="Stress Resilience (100 − Stress)" value={100 - crew.cognitiveStressIndex} good={60} warn={40} />
            <IndicatorBar label="Circadian Alignment (100 − Disruption)" value={100 - crew.circadianDisruptionIndex} good={70} warn={50} />
            <IndicatorBar label="Workload Headroom (100 − Workload)" value={100 - crew.workloadIndex} good={40} warn={20} />
          </div>

          <div className="panel p-4">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Readiness Radar</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#263756" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 10 }} />
                <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} name="Crew Score" />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick vital snapshot */}
          <div className="panel p-4">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Clinical Summary</h2>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { l: 'Heart Rate', v: `${crew.heartRateBpm.toFixed(0)} bpm`, ok: crew.heartRateBpm >= 50 && crew.heartRateBpm <= 100 },
                { l: 'SpO₂', v: `${crew.oxygenSaturationPercent.toFixed(1)}%`, ok: crew.oxygenSaturationPercent >= 95 },
                { l: 'Resp. Rate', v: `${crew.respiratoryRateBpm.toFixed(0)} br/m`, ok: crew.respiratoryRateBpm <= 20 },
                { l: 'Fatigue', v: `${crew.fatigueIndex.toFixed(0)}/100`, ok: crew.fatigueIndex <= 50 },
              ].map(m => (
                <div key={m.l} className="bg-space-850 rounded p-2 border border-space-750 text-center">
                  <div className="metric-label">{m.l}</div>
                  <div className={`font-mono font-semibold text-sm ${m.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{m.v}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-mono">{crew.clinicalSummary}</p>
          </div>
        </div>

        {/* Right: Decision support */}
        <div className="xl:col-span-2 space-y-4">
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-amber-400" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Decision Support Panel</span>
              </div>
              <span className="text-xs text-slate-600 font-mono">Suggested — not operationally approved</span>
            </div>

            <div className="space-y-4">
              {concerns.map((c, i) => (
                <div key={i} className={`p-4 rounded border ${
                  c.concern.includes('Nominal') ? 'border-emerald-800/40 bg-emerald-950/20' :
                  'border-amber-800/40 bg-amber-950/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {c.concern.includes('Nominal')
                      ? <CheckCircle size={14} className="text-emerald-400" />
                      : <AlertTriangle size={14} className="text-amber-400" />
                    }
                    <span className="font-semibold text-sm text-slate-100">{c.concern}</span>
                  </div>

                  <div className="text-xs font-mono text-slate-500 mb-3 p-2 bg-space-900 rounded">
                    <span className="text-slate-400">Evidence: </span>{c.evidence}
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2">Response Options</span>
                    <div className="grid grid-cols-2 gap-2">
                      {c.options.map((o, j) => (
                        <div key={j} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <span className="text-astro-cyan mt-0.5 shrink-0">→</span>
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 italic">
                    <span className="font-semibold">Trade-offs:</span> {c.tradeoffs}
                  </div>

                  <div className="mt-2 text-xs text-orange-500 font-mono">
                    ⚠ Remaining uncertainty: Simulation uses simplified physiological model. Individual crew member response may vary. Consult flight surgeon guidance.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery actions */}
          <div className="panel p-4">
            <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
              <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Recovery Actions</span>
              <span className="text-xs text-slate-600 font-mono">Not operationally approved procedures</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'reduce_workload', label: 'Reduce Workload', desc: 'Drops workload index by 25' },
                { id: 'mandatory_rest', label: 'Mandatory Rest', desc: 'Drops workload by 40, reduces fatigue accumulation' },
                { id: 'activate_backup_o2', label: 'Supplement O₂', desc: 'Boosts ppO₂ by 2%' },
                { id: 'activate_backup_scrubber', label: 'Backup Scrubber', desc: 'Increases CO₂ removal efficiency' },
              ].map(a => (
                <button key={a.id} onClick={() => applyRecoveryAction(a.id)}
                  className="btn-secondary text-left p-3 h-auto flex flex-col gap-1">
                  <span className="font-semibold text-xs text-slate-200">{a.label}</span>
                  <span className="text-xs text-slate-500">{a.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
