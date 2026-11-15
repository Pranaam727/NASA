import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { CheckSquare, Square, Flame, Award, ArrowRight, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

interface DailyTask {
  id: string;
  title: string;
  category: 'Biometrics' | 'Wellness' | 'Nutrition' | 'Exercise';
  time: string;
  completed: boolean;
}

const INITIAL_TASKS: DailyTask[] = [
  { id: '1', title: 'Complete Morning Biometric Ingest & Sensor Calibration', category: 'Biometrics', time: '06:30 MET', completed: true },
  { id: '2', title: 'Record Resting Blood Pressure & Pulse Pressure Profile', category: 'Biometrics', time: '07:00 MET', completed: true },
  { id: '3', title: 'Continuous 50Hz Lead-II ECG Stream Verification', category: 'Biometrics', time: '08:00 MET', completed: true },
  { id: '4', title: 'Log Sleep Architecture & Circadian Rest Quality', category: 'Wellness', time: '08:30 MET', completed: true },
  { id: '5', title: 'Complete Psychological Mood & Cognitive Resilience Check-in', category: 'Wellness', time: '12:00 MET', completed: false },
  { id: '6', title: 'Log Hydration Volume (Target: 2.8L) & Micronutrient Packet', category: 'Nutrition', time: '14:00 MET', completed: false },
  { id: '7', title: 'Perform 2.5-Hour ARED Resistive & T2 Treadmill Countermeasure', category: 'Exercise', time: '16:00 MET', completed: false },
  { id: '8', title: 'Evening Radiation Dosimeter Audit & SPE Forecast Review', category: 'Biometrics', time: '20:30 MET', completed: false },
];

export const DailyMissionSection: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <section id="daily-mission" className="relative py-28 bg-[#05070B] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              CREW WELLNESS PROTOCOLS
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            EVERY DAY IS A
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              HEALTH MISSION.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            Structured daily biomedical habits and countermeasure checklists designed to maintain
            peak astronaut physical readiness and psychological resilience.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Daily Checklist */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/25 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  SOL 142 // MISSION DAY CHECKLIST
                </div>
                <h3 className="text-xl font-space font-bold text-white mt-0.5">
                  Astronaut Daily Readiness Protocol
                </h3>
              </div>

              {/* Progress Summary */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">Completion</span>
                  <div className="text-lg font-space font-bold text-cyan-300">
                    {completedCount} / {tasks.length} ({progressPercent}%)
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-cyan-400/30 flex items-center justify-center font-mono font-bold text-xs text-white bg-black/40">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Task list with interactive toggles */}
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-cyan-950/20 border-cyan-500/30 text-slate-200'
                      : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                      {task.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Interactive preview — click any task to toggle status</span>
              <button
                onClick={() => navigate(ROUTES.WELLNESS)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <span>Open Crew Wellness Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Mission Streak & Aerospace Achievement Badges */}
          <div className="lg:col-span-4 space-y-6">
            {/* Streak Counter Card */}
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Flame className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>

              <div>
                <div className="text-3xl font-space font-extrabold text-white">SOL 142</div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mt-0.5">
                  12-DAY CONSECUTIVE CHECK-IN STREAK
                </div>
              </div>

              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Consistency in daily micro-assessments dramatically accelerates early anomaly
                detection and algorithmic predictive calibration.
              </p>
            </div>

            {/* Achievement Badges */}
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Award className="w-4 h-4" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  MISSION READINESS BADGES
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-black/40 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-space font-bold text-white">Orbital Resilience</div>
                    <div className="text-[10px] font-mono text-emerald-400">30/30 Days Vitals Monitored</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl bg-black/40 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-space font-bold text-white">Dosimetry Guardian</div>
                    <div className="text-[10px] font-mono text-cyan-400">Zero PEL Safety Violations</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl bg-black/40 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-space font-bold text-white">Circadian Synchrony</div>
                    <div className="text-[10px] font-mono text-slate-400">92% Deep Sleep Stability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
