import { Database, AlertTriangle, Info, TrendingDown } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { useSimStore } from '../store/simulationStore';
import { barColor } from '../utils/ui';

export default function ResourceManagement() {
  const { currentTelemetry, telemetryHistory, applyRecoveryAction, selectedScenario } = useSimStore();
  const tel = currentTelemetry;

  if (!tel) {
    return (
      <div className="p-4 text-center text-slate-500 font-mono mt-16">
        <Database size={48} className="mx-auto text-slate-700 mb-4" />
        Run a simulation to view resource management data.
      </div>
    );
  }

  const { resources } = tel;
  const hist = telemetryHistory.slice(-80);

  const resHistory = hist.map(h => ({
    t: h.elapsedSec,
    o2: +((h.resources.oxygenRemainingKg / h.resources.oxygenCapacityKg) * 100).toFixed(1),
    water: +((h.resources.waterRemainingLiters / h.resources.waterCapacityLiters) * 100).toFixed(1),
    power: +h.resources.batteryStateOfChargePercent.toFixed(1),
    consumables: +Math.min(100, h.resources.consumableRationDays).toFixed(1),
  }));

  // Depletion projections (simple linear extrapolation)
  function projectDepletion(currentPct: number, firstPct: number, stepCount: number): string {
    if (stepCount === 0) return 'N/A';
    const ratePerStep = (firstPct - currentPct) / stepCount;
    if (ratePerStep <= 0) return '> 90 days';
    const stepsToEmpty = currentPct / ratePerStep;
    const secondsToEmpty = stepsToEmpty * (hist[1]?.t - hist[0]?.t || 10);
    const daysToEmpty = secondsToEmpty / 86400;
    if (daysToEmpty > 90) return '> 90 days';
    if (daysToEmpty < 0.1) return '< 2.4h';
    return `~${daysToEmpty.toFixed(1)} days`;
  }

  const steps = hist.length;
  const firstPct = hist[0];

  const resources_summary = [
    {
      label: 'Oxygen (O₂)',
      remaining: resources.oxygenRemainingKg,
      capacity: resources.oxygenCapacityKg,
      unit: 'kg',
      pct: (resources.oxygenRemainingKg / resources.oxygenCapacityKg) * 100,
      nominal: '0.84 kg/person/day nominal consumption (illustrative model)',
      depletion: steps > 1 ? projectDepletion(resHistory[resHistory.length-1]?.o2, resHistory[0]?.o2, steps) : 'Calculating...',
      critical: 20,
      warning: 40,
    },
    {
      label: 'Water (H₂O)',
      remaining: resources.waterRemainingLiters,
      capacity: resources.waterCapacityLiters,
      unit: 'L',
      pct: (resources.waterRemainingLiters / resources.waterCapacityLiters) * 100,
      nominal: '2.5 L/person/day nominal consumption (illustrative model)',
      depletion: steps > 1 ? projectDepletion(resHistory[resHistory.length-1]?.water, resHistory[0]?.water, steps) : 'Calculating...',
      critical: 20,
      warning: 40,
    },
    {
      label: 'Electrical Power',
      remaining: resources.powerRemainingKWh,
      capacity: resources.powerCapacityKWh,
      unit: 'kWh',
      pct: resources.batteryStateOfChargePercent,
      nominal: '8 kW continuous average load (illustrative model)',
      depletion: steps > 1 ? projectDepletion(resHistory[resHistory.length-1]?.power, resHistory[0]?.power, steps) : 'Calculating...',
      critical: 20,
      warning: 35,
    },
    {
      label: 'Consumables',
      remaining: resources.consumableRationDays,
      capacity: 90,
      unit: 'days',
      pct: (resources.consumableRationDays / 90) * 100,
      nominal: 'Proportional crew mission consumables (illustrative model)',
      depletion: `${resources.consumableRationDays.toFixed(0)} days remaining`,
      critical: 10,
      warning: 25,
    },
  ];

  const barData = resources_summary.map(r => ({ name: r.label.split(' ')[0], value: +r.pct.toFixed(0) }));

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Database size={18} className="text-emerald-400" />
          Resource Management
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Consumption Rate:</span>
          <span className={`font-mono font-bold ${resources.consumptionRateMultiplier > 1.3 ? 'text-rose-400' : resources.consumptionRateMultiplier > 1.1 ? 'text-amber-400' : 'text-emerald-400'}`}>
            ×{resources.consumptionRateMultiplier.toFixed(1)}
          </span>
          <span className="text-xs text-slate-600 font-mono">(emergency events increase rate)</span>
        </div>
      </div>

      <div className="bg-amber-900/20 border border-amber-700/40 rounded px-3 py-2 text-xs text-amber-400 font-mono flex items-center gap-2">
        <Info size={12} />
        Resource models use simplified linear consumption rates. Not exact spacecraft ECLSS engineering calculations.
        Emergency scenarios apply configurable multipliers.
      </div>

      {/* Critical warnings */}
      {resources_summary.filter(r => r.pct < r.critical).map(r => (
        <div key={r.label} className="flex items-center gap-2 p-3 bg-rose-950/30 border border-rose-800/50 rounded alert-blink">
          <AlertTriangle size={14} className="text-rose-400 shrink-0" />
          <span className="text-sm font-mono text-rose-300">CRITICAL: {r.label} at {r.pct.toFixed(0)}% — Depletion {r.depletion}</span>
        </div>
      ))}
      {resources_summary.filter(r => r.pct >= r.critical && r.pct < r.warning).map(r => (
        <div key={r.label} className="flex items-center gap-2 p-3 bg-amber-950/30 border border-amber-800/50 rounded">
          <TrendingDown size={14} className="text-amber-400 shrink-0" />
          <span className="text-sm font-mono text-amber-300">WARNING: {r.label} at {r.pct.toFixed(0)}% — Depletion {r.depletion}</span>
        </div>
      ))}

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources_summary.map(r => (
          <div key={r.label} className="panel p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">{r.label}</h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{r.nominal}</p>
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold text-xl ${barColor(r.pct) === '#10b981' ? 'text-emerald-400' : barColor(r.pct) === '#f59e0b' ? 'text-amber-400' : barColor(r.pct) === '#f97316' ? 'text-orange-400' : 'text-rose-400'}`}>
                  {r.pct.toFixed(0)}%
                </div>
                <div className="text-xs text-slate-500 font-mono">{r.remaining.toFixed(0)} / {r.capacity} {r.unit}</div>
              </div>
            </div>
            <div className="h-3 bg-space-800 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${r.pct}%`, background: barColor(r.pct) }} />
            </div>
            {/* Warning markers */}
            <div className="relative h-1 mb-3">
              <div className="absolute h-4 w-0.5 bg-amber-500/40 top-0" style={{ left: `${r.warning}%` }} />
              <div className="absolute h-4 w-0.5 bg-rose-500/40 top-0" style={{ left: `${r.critical}%` }} />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-600">
              <span>Est. depletion: <span className={r.pct < r.warning ? 'text-amber-400' : 'text-slate-400'}>{r.depletion}</span></span>
              <span className={r.pct < r.critical ? 'text-rose-500' : r.pct < r.warning ? 'text-amber-500' : 'text-slate-600'}>
                {r.pct < r.critical ? '⚠ CRITICAL' : r.pct < r.warning ? '⚠ WARNING' : 'NOMINAL'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overview chart */}
      <div className="panel p-4">
        <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
          <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Resource Trend History</span>
          <span className="sim-label">SIMULATED</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={resHistory}>
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} width={28} />
            <Tooltip contentStyle={{ background: '#101726', border: '1px solid #263756', fontSize: 11 }} />
            <ReferenceLine y={20} stroke="#f43f5e55" strokeDasharray="4 2" />
            <ReferenceLine y={40} stroke="#f59e0b55" strokeDasharray="4 2" />
            <Area type="monotone" dataKey="o2" stroke="#00e5ff" fill="#00e5ff15" name="O₂ %" strokeWidth={1.5} />
            <Area type="monotone" dataKey="water" stroke="#3b82f6" fill="#3b82f615" name="H₂O %" strokeWidth={1.5} />
            <Area type="monotone" dataKey="power" stroke="#f59e0b" fill="#f59e0b15" name="Power %" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs font-mono">
          <span style={{color:'#00e5ff'}}>— O₂%</span>
          <span style={{color:'#3b82f6'}}>— H₂O%</span>
          <span style={{color:'#f59e0b'}}>— Power%</span>
          <span className="text-slate-700 ml-2">Red dashes = Critical 20% | Orange dashes = Warning 40%</span>
        </div>
      </div>

      {/* Comparison snapshot: baseline vs current */}
      <div className="panel p-4">
        <div className="panel-header -mx-4 -mt-4 mb-4 px-4 pt-3">
          <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">Baseline vs Emergency Consumption</span>
          <span className="text-xs text-slate-600 font-mono">Illustrative comparison model</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Nominal Rate</h3>
            {[
              { l: 'O₂', rate: '0.84 kg/person/day' },
              { l: 'H₂O', rate: '2.5 L/person/day' },
              { l: 'Power', rate: '8 kWh/hour continuous' },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-xs font-mono py-1 border-b border-space-800">
                <span className="text-slate-500">{r.l}</span>
                <span className="text-emerald-400">{r.rate}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">
              Emergency Rate (×{resources.consumptionRateMultiplier.toFixed(1)})
            </h3>
            {[
              { l: 'O₂', base: 0.84 * 4 },
              { l: 'H₂O', base: 2.5 * 4 },
              { l: 'Power', base: 8 },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-xs font-mono py-1 border-b border-space-800">
                <span className="text-slate-500">{r.l}</span>
                <span className={resources.consumptionRateMultiplier > 1.1 ? 'text-amber-400' : 'text-emerald-400'}>
                  {(r.base * resources.consumptionRateMultiplier).toFixed(2)} {r.l === 'Power' ? 'kWh/h' : r.l === 'O₂' ? 'kg/day' : 'L/day'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => applyRecoveryAction('power_shed')} className="btn-secondary text-xs flex items-center gap-1">
            Activate Power Shedding
          </button>
          <button onClick={() => applyRecoveryAction('reduce_workload')} className="btn-secondary text-xs flex items-center gap-1">
            Reduce Crew Activity
          </button>
        </div>
      </div>

      {/* Emergency reserve */}
      <div className="panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Emergency Reserves</h2>
          <span className={`font-mono font-bold ${resources.emergencyReservesPercent > 70 ? 'text-emerald-400' : resources.emergencyReservesPercent > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
            {resources.emergencyReservesPercent.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-space-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${resources.emergencyReservesPercent}%`, background: barColor(resources.emergencyReservesPercent) }} />
        </div>
        <p className="text-xs text-slate-600 font-mono mt-2">
          Emergency reserves drawn when primary resources fall below critical thresholds. Illustrative model — not an engineering-calibrated reserve calculation.
        </p>
      </div>
    </div>
  );
}
