import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useRole } from '@/context/RoleContext';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { SEED_EXERCISE_RECORDS } from '@/data/seedData';
import { ExerciseRecord } from '@/types/database.types';
import {
  Bone,
  Activity,
  Plus,
  Info,
  Zap,
} from 'lucide-react';

export const SpaceHealthPage: React.FC = () => {
  const { selectedAstronaut } = useRole();
  const { enqueueSyncItem } = useOfflineSync();

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseRecord[]>(SEED_EXERCISE_RECORDS);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form State
  const [exerciseType, setExerciseType] = useState<ExerciseRecord['exercise_type']>('ARED_SQUAT');
  const [duration, setDuration] = useState<number>(45);
  const [load, setLoad] = useState<number>(185);
  const [peakHr, setPeakHr] = useState<number>(155);
  const [calories, setCalories] = useState<number>(400);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ExerciseRecord = {
      id: `ex-${Date.now()}`,
      astronaut_id: selectedAstronaut.id,
      date: new Date().toISOString().split('T')[0],
      exercise_type: exerciseType,
      duration_minutes: duration,
      load_kg_or_watts: load,
      peak_heart_rate: peakHr,
      calories_burned: calories,
      notes: 'Logged via Crew Exercise Terminal',
    };

    setExerciseLogs([newRecord, ...exerciseLogs]);
    enqueueSyncItem('EXERCISE_LOG', newRecord as unknown as Record<string, unknown>);
    setShowLogModal(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Deep-Space Health Analytics"
        subtitle="Long-term organ-system adaptation & musculoskeletal deconditioning monitoring"
        badge={<StatusIndicator status="NOMINAL" label="ANALYTICS ENGINE READY" />}
      />

      <div className="space-y-6">
        {/* Top Disclaimer */}
        <div className="p-3.5 rounded-sm bg-astro-bg-subtle/80 border border-astro-border-hairline flex items-start space-x-3 text-xs text-astro-text-secondary">
          <Info className="w-4 h-4 text-astro-text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-astro-text-primary">PHYSIOLOGICAL ADAPTATION PROTOCOL:</span> In
            microgravity, weight-bearing skeletal unloading accelerates osteoclast resorption (~1.0–1.5% BMD lost per
            month without countermeasures). Daily 2.5-hour high-load resistive (ARED) and cardiovascular exercise is
            the primary NASA operational mitigation.
          </div>
        </div>

        {/* 4 Organ-System Key Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Lumbar Spine BMD Loss
              </span>
              <Bone className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#F3BB57] tabular-nums">
                -3.2%
              </span>
              <span className="font-mono text-xs text-[#57766D]">over 142 Sols</span>
            </div>
            <div className="text-[10px] font-mono text-[#21E6D0]">
              ● Within expected countermeasure envelope
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Femoral Neck BMD Loss
              </span>
              <Bone className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#F3BB57] tabular-nums">
                -2.8%
              </span>
              <span className="font-mono text-xs text-[#57766D]">over 142 Sols</span>
            </div>
            <div className="text-[10px] font-mono text-[#21E6D0]">
              ● T-Score: -0.4 (Normal Range)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Muscular Peak Power
              </span>
              <Zap className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                94.8%
              </span>
              <span className="font-mono text-xs text-[#57766D]">of baseline</span>
            </div>
            <div className="text-[10px] font-mono text-[#21E6D0]">
              ● ARED compliance: 96.2%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Cardiovascular Stroke Vol.
              </span>
              <Activity className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                88 mL
              </span>
              <span className="font-mono text-xs text-[#57766D]">(-8% delta)</span>
            </div>
            <div className="text-[10px] font-mono text-[#8CA8A0]">
              ● Cephalad volume contraction
            </div>
          </div>
        </div>

        {/* Structured ARED & Aerobic Exercise Log */}
        <DossierCard
          title="ARED & AEROBIC COUNTERMEASURE EXERCISE LOG"
          subtitle="ASTRONAUT RESISTIVE SKELETAL PRESERVATION RECORDS"
          action={
            <button
              type="button"
              onClick={() => setShowLogModal(!showLogModal)}
              className="px-4 py-2 bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-cyberGlow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>LOG WORKOUT SESSION</span>
            </button>
          }
        >
          {showLogModal && (
            <form
              onSubmit={handleAddExercise}
              className="mb-6 p-5 rounded-2xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.25)] space-y-4 shadow-cyberCard"
            >
              <span className="font-mono text-xs font-bold text-[#E8F4F0] uppercase block tracking-wider">
                RECORD WORKOUT ENTRY
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Exercise Type
                  </label>
                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value as ExerciseRecord['exercise_type'])}
                    className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none cursor-pointer"
                  >
                    <option value="ARED_SQUAT" className="bg-[#0A1715]">ARED Squat</option>
                    <option value="ARED_DEADLIFT" className="bg-[#0A1715]">ARED Deadlift</option>
                    <option value="ARED_BENCH" className="bg-[#0A1715]">ARED Bench Press</option>
                    <option value="CYCLE_ERGOMETER" className="bg-[#0A1715]">Cycle Ergometer</option>
                    <option value="T2_TREADMILL" className="bg-[#0A1715]">T2 Treadmill</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Load (kg / Watts)
                  </label>
                  <input
                    type="number"
                    value={load}
                    onChange={(e) => setLoad(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Peak Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    value={peakHr}
                    onChange={(e) => setPeakHr(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-mono border border-[rgba(55,210,185,0.2)] text-[#8CA8A0] hover:text-[#E8F4F0] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl font-bold shadow-cyberGlow"
                >
                  Save Workout
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-[rgba(55,210,185,0.18)] rounded-xl overflow-hidden">
              <thead className="bg-[#0A1715] text-[#8CA8A0] text-left">
                <tr>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">DATE</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">EXERCISE PROTOCOL</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">DURATION</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">EQUIVALENT LOAD</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">PEAK HR</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">ENERGY EXPENDITURE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(55,210,185,0.1)] bg-[#0D1E1A]">
                {exerciseLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#10251F] transition-colors">
                    <td className="p-3 font-semibold text-[#E8F4F0]">{log.date}</td>
                    <td className="p-3 font-bold text-[#E8F4F0]">{log.exercise_type.replace('_', ' ')}</td>
                    <td className="p-3 text-[#8CA8A0]">{log.duration_minutes} min</td>
                    <td className="p-3 text-[#21E6D0] font-bold">{log.load_kg_or_watts} kg</td>
                    <td className="p-3 text-[#E8F4F0]">{log.peak_heart_rate} BPM</td>
                    <td className="p-3 text-[#8CA8A0]">{log.calories_burned} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
