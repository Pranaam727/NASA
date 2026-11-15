import React, { useState } from 'react';
import { MissionScenario, ScenarioSimulationResult } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { DisclaimerNotice } from '../common/DisclaimerNotice';
import { Compass, Play, RefreshCw, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface MissionScenarioEditorProps {
  scenarios: MissionScenario[];
  activeScenario: MissionScenario;
  onSelectScenario: (id: string) => void;
  onRunSimulation: (id: string) => ScenarioSimulationResult | null;
  onSaveScenario?: (scenario: MissionScenario) => void;
}

export const MissionScenarioEditor: React.FC<MissionScenarioEditorProps> = ({
  scenarios,
  activeScenario,
  onSelectScenario,
  onRunSimulation,
}) => {
  const [currentScenario, setCurrentScenario] = useState<MissionScenario>(activeScenario);
  const [simulationResult, setSimulationResult] = useState<ScenarioSimulationResult | null>(
    onRunSimulation(activeScenario.id)
  );

  const handleParamChange = (field: string, val: any) => {
    const updated = { ...currentScenario, [field]: val };
    setCurrentScenario(updated);
  };

  const handleNestedParamChange = (parent: 'exerciseSchedule' | 'sleepSchedule' | 'radiationScenario', field: string, val: any) => {
    const updated = {
      ...currentScenario,
      [parent]: {
        ...currentScenario[parent],
        [field]: val,
      },
    };
    setCurrentScenario(updated);
  };

  const handleExecute = () => {
    const res = onRunSimulation(currentScenario.id);
    setSimulationResult(res);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Interactive Mission Environment Simulator
            </h3>
            <Badge variant="cyan">COUNTERMEASURE MODELING</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate the interaction of mission duration, exercise countermeasure volume, sleep architecture, and cosmic radiation exposure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeScenario.id}
            onChange={(e) => {
              onSelectScenario(e.target.value);
              const found = scenarios.find((s) => s.id === e.target.value);
              if (found) {
                setCurrentScenario(found);
                setSimulationResult(onRunSimulation(found.id));
              }
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={handleExecute}
          >
            Simulate
          </Button>
        </div>
      </div>

      {/* Parameter Adjustment Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Duration: <strong className="text-cyan-400 font-mono">{currentScenario.durationDays} Days</strong>
          </label>
          <input
            type="range"
            min={30}
            max={720}
            step={30}
            value={currentScenario.durationDays}
            onChange={(e) => handleParamChange('durationDays', parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>1 Mo</span>
            <span>1 Yr</span>
            <span>2 Yrs</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Resistive ARED: <strong className="text-cyan-400 font-mono">{currentScenario.exerciseSchedule.resistiveHoursPerDay}h / day</strong>
          </label>
          <input
            type="range"
            min={0}
            max={2.5}
            step={0.25}
            value={currentScenario.exerciseSchedule.resistiveHoursPerDay}
            onChange={(e) =>
              handleNestedParamChange('exerciseSchedule', 'resistiveHoursPerDay', parseFloat(e.target.value))
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono">
            {currentScenario.exerciseSchedule.daysPerWeek} days/week loading
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Aerobic Training: <strong className="text-cyan-400 font-mono">{currentScenario.exerciseSchedule.aerobicHoursPerDay}h / day</strong>
          </label>
          <input
            type="range"
            min={0}
            max={2.0}
            step={0.25}
            value={currentScenario.exerciseSchedule.aerobicHoursPerDay}
            onChange={(e) =>
              handleNestedParamChange('exerciseSchedule', 'aerobicHoursPerDay', parseFloat(e.target.value))
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono">Cycle & Treadmill</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Target Sleep: <strong className="text-cyan-400 font-mono">{currentScenario.sleepSchedule.targetHours}h / night</strong>
          </label>
          <input
            type="range"
            min={5.0}
            max={9.0}
            step={0.5}
            value={currentScenario.sleepSchedule.targetHours}
            onChange={(e) =>
              handleNestedParamChange('sleepSchedule', 'targetHours', parseFloat(e.target.value))
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="circadianLight"
              checked={currentScenario.sleepSchedule.circadianLighting}
              onChange={(e) =>
                handleNestedParamChange('sleepSchedule', 'circadianLighting', e.target.checked)
              }
              className="accent-cyan-400 rounded"
            />
            <label htmlFor="circadianLight" className="text-[11px] text-slate-400 cursor-pointer">
              Dynamic SSLA Lighting
            </label>
          </div>
        </div>
      </div>

      {/* Simulation Results Section */}
      {simulationResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Projected System Impacts & Readiness Index
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Mission Readiness Score:</span>
              <span className="font-mono text-base font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800">
                {simulationResult.overallReadinessScore} / 100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {simulationResult.systemImpacts.map((impact) => (
              <div
                key={impact.system}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    {impact.system}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      impact.projectedChangePercent < -10
                        ? 'text-amber-400'
                        : impact.projectedChangePercent < -5
                        ? 'text-cyan-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {impact.projectedChangePercent > 0 ? `+${impact.projectedChangePercent}%` : `${impact.projectedChangePercent}%`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {impact.keyDrivers.join(' • ')}
                </p>
                <div className="text-[10px] text-slate-500 font-mono truncate" title={impact.evidenceReferences[0]}>
                  Ref: {impact.evidenceReferences[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Biomarker Multi-Line Trend Chart */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Projected Biomarker Deconditioning Curves Across Mission Days
            </span>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={simulationResult.projectedBiomarkerTrends}
                  margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    label={{ value: 'Mission Flight Day', fill: '#64748b', fontSize: 10, position: 'insideBottomRight' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-mono">
                            <div className="text-cyan-400 font-semibold">Day {d.day}</div>
                            <div className="text-blue-400">Bone Loss: {d.estimatedBoneLossPct}%</div>
                            <div className="text-rose-400">VO2 Max Drop: {d.estimatedVo2MaxPct}%</div>
                            <div className="text-amber-400">Cumul. Dose: {d.estimatedCumulativeDoseMsv} mSv</div>
                            <div className="text-cyan-400">Sleep Deficit: {d.estimatedSleepDeficitHours}h</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="estimatedBoneLossPct" stroke="#3b82f6" name="Bone Loss (%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimatedVo2MaxPct" stroke="#f43f5e" name="VO2 Max Drop (%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimatedCumulativeDoseMsv" stroke="#f59e0b" name="Radiation Dose (mSv)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimatedSleepDeficitHours" stroke="#06b6d4" name="Sleep Deficit (hrs)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <DisclaimerNotice
        compact
        context="Scenario simulator uses analytical estimation models based on published NASA HRP human spaceflight literature. Not certified clinical medical software."
      />
    </Card>
  );
};
