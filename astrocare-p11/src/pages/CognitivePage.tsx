// AstroCare P11 — Fatigue & Cognitive Performance Page

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Brain,
  Timer,
  Zap,
  Target,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
} from 'lucide-react';

import type { CognitivePerformanceRecord, CognitiveTaskType } from '../types';
import { formatShortDate, average, roundTo, getISONow } from '../utils';
import { NASA_SOURCES, THRESHOLDS } from '../constants';
import {
  Card,
  MetricCard,
  SectionHeader,
  Button,
  Tabs,
  LoadingState,
  ErrorState,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
  ScoreRing,
} from '../components/shared';
import { useWellnessContext } from '../context/WellnessContext';
import { useAsyncData } from '../hooks';
import { reactionTimeToScore } from '../services/wellness/analyticsService';

export function CognitivePage() {
  const { astronautId, missionId, dataProvider } = useWellnessContext();

  const { data: records, status, refetch } = useAsyncData<CognitivePerformanceRecord[]>(
    () => dataProvider.getCognitiveRecords(astronautId),
    [astronautId]
  );

  const [activeTab, setActiveTab] = useState<'tests' | 'analytics'>('tests');
  const [activeTest, setActiveTest] = useState<CognitiveTaskType>('REACTION_TIME');

  // =========================================================================
  // TEST 1: REACTION TIME TEST
  // =========================================================================
  const [rtState, setRtState] = useState<'IDLE' | 'WAITING' | 'READY' | 'RESULT'>('IDLE');
  const [rtStartTime, setRtStartTime] = useState<number>(0);
  const [rtResultMs, setRtResultMs] = useState<number | null>(null);
  const [rtMessage, setRtMessage] = useState<string>('');
  const rtTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startReactionTimeTest = () => {
    setRtState('WAITING');
    setRtMessage('Wait for the circle to turn emerald green...');
    setRtResultMs(null);

    const delay = 1500 + Math.random() * 2500;
    rtTimeoutRef.current = setTimeout(() => {
      setRtStartTime(Date.now());
      setRtState('READY');
      setRtMessage('CLICK NOW!');
    }, delay);
  };

  const handleRtClick = async () => {
    if (rtState === 'WAITING') {
      if (rtTimeoutRef.current) clearTimeout(rtTimeoutRef.current);
      setRtState('IDLE');
      setRtMessage('False start! You clicked before it turned green. Try again.');
      return;
    }

    if (rtState === 'READY') {
      const elapsed = Date.now() - rtStartTime;
      setRtResultMs(elapsed);
      setRtState('RESULT');
      const normScore = reactionTimeToScore(elapsed);

      await dataProvider.saveCognitiveRecord({
        astronautId,
        missionId,
        timestamp: getISONow(),
        missionDay: 180,
        taskType: 'REACTION_TIME',
        reactionTimeMs: elapsed,
        accuracyPercent: 100,
        completionTimeMs: elapsed,
        scoreRaw: elapsed,
        scoreNormalized: normScore,
        source: 'USER_TEST',
        dataOrigin: 'USER_ENTERED',
      });
      refetch();
    }
  };

  // =========================================================================
  // TEST 2: ATTENTION SCANNER (5x5 GRID COUNT)
  // =========================================================================
  const [attState, setAttState] = useState<'IDLE' | 'ACTIVE' | 'RESULT'>('IDLE');
  const [attGrid, setAttGrid] = useState<string[]>([]);
  const [attTarget, setAttTarget] = useState<string>('Δ');
  const [attTargetCount, setAttTargetCount] = useState<number>(0);
  const [attUserAnswer, setAttUserAnswer] = useState<string>('');
  const [attStartTime, setAttStartTime] = useState<number>(0);
  const [attResult, setAttResult] = useState<{ accurate: boolean; userAns: number; actual: number; timeMs: number } | null>(null);

  const symbols = ['Δ', 'Ω', 'Ψ', 'Σ', 'Φ', 'Θ'];

  const startAttentionTest = () => {
    const target = symbols[Math.floor(Math.random() * symbols.length)];
    const grid: string[] = [];
    let count = 0;

    for (let i = 0; i < 25; i++) {
      const isTarget = Math.random() < 0.28;
      if (isTarget) {
        grid.push(target);
        count++;
      } else {
        const pool = symbols.filter((s) => s !== target);
        grid.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }

    setAttTarget(target);
    setAttTargetCount(count);
    setAttGrid(grid);
    setAttUserAnswer('');
    setAttStartTime(Date.now());
    setAttResult(null);
    setAttState('ACTIVE');
  };

  const handleAttentionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ansNum = parseInt(attUserAnswer, 10);
    const elapsed = Date.now() - attStartTime;
    const isCorrect = ansNum === attTargetCount;
    const accuracy = isCorrect ? 100 : Math.max(0, 100 - Math.abs(ansNum - attTargetCount) * 20);

    setAttResult({
      accurate: isCorrect,
      userAns: ansNum,
      actual: attTargetCount,
      timeMs: elapsed,
    });
    setAttState('RESULT');

    await dataProvider.saveCognitiveRecord({
      astronautId,
      missionId,
      timestamp: getISONow(),
      missionDay: 180,
      taskType: 'ATTENTION',
      accuracyPercent: accuracy,
      completionTimeMs: elapsed,
      scoreRaw: accuracy,
      scoreNormalized: accuracy,
      source: 'USER_TEST',
      dataOrigin: 'USER_ENTERED',
    });
    refetch();
  };

  // =========================================================================
  // TEST 3: SHORT-TERM MEMORY SEQUENCE
  // =========================================================================
  const [memState, setMemState] = useState<'IDLE' | 'DISPLAY' | 'INPUT' | 'RESULT'>('IDLE');
  const [memSequence, setMemSequence] = useState<number[]>([]);
  const [memUserClicks, setMemUserClicks] = useState<number[]>([]);
  const [memActiveIndex, setMemActiveIndex] = useState<number | null>(null);
  const [memResult, setMemResult] = useState<{ accuracy: number; correct: number; total: number } | null>(null);

  const dotColors = ['#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const startMemoryTest = () => {
    const seq = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6));
    setMemSequence(seq);
    setMemUserClicks([]);
    setMemState('DISPLAY');
    setMemResult(null);

    // Playback sequence
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setMemActiveIndex(seq[step]);
        step++;
        setTimeout(() => setMemActiveIndex(null), 500);
      } else {
        clearInterval(interval);
        setMemState('INPUT');
      }
    }, 900);
  };

  const handleMemDotClick = async (index: number) => {
    if (memState !== 'INPUT') return;
    const newClicks = [...memUserClicks, index];
    setMemUserClicks(newClicks);

    if (newClicks.length === memSequence.length) {
      // Completed input
      let correct = 0;
      for (let i = 0; i < memSequence.length; i++) {
        if (newClicks[i] === memSequence[i]) correct++;
      }
      const accuracy = Math.round((correct / memSequence.length) * 100);

      setMemResult({ accuracy, correct, total: memSequence.length });
      setMemState('RESULT');

      await dataProvider.saveCognitiveRecord({
        astronautId,
        missionId,
        timestamp: getISONow(),
        missionDay: 180,
        taskType: 'MEMORY',
        accuracyPercent: accuracy,
        completionTimeMs: 5000,
        scoreRaw: accuracy,
        scoreNormalized: accuracy,
        source: 'USER_TEST',
        dataOrigin: 'USER_ENTERED',
      });
      refetch();
    }
  };

  // =========================================================================
  // ANALYTICS & TREND DATA
  // =========================================================================
  const rtHistory = useMemo(() => {
    if (!records) return [];
    return records
      .filter((r) => r.taskType === 'REACTION_TIME' && r.reactionTimeMs)
      .slice(-15)
      .map((r) => ({
        day: `Day ${r.missionDay}`,
        rt: r.reactionTimeMs,
        score: r.scoreNormalized,
      }));
  }, [records]);

  const accHistory = useMemo(() => {
    if (!records) return [];
    return records
      .filter((r) => r.taskType === 'ATTENTION' || r.taskType === 'MEMORY')
      .slice(-15)
      .map((r) => ({
        day: `Day ${r.missionDay}`,
        accuracy: r.accuracyPercent,
        type: r.taskType,
      }));
  }, [records]);

  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return { avgRt: 0, avgAcc: 0, totalTests: 0 };
    }
    const rtRecords = records.filter((r) => r.reactionTimeMs);
    const avgRt = rtRecords.length > 0 ? average(rtRecords.map((r) => r.reactionTimeMs!)) : 0;
    const avgAcc = average(records.map((r) => r.accuracyPercent));

    return {
      avgRt: roundTo(avgRt, 0),
      avgAcc: roundTo(avgAcc, 1),
      totalTests: records.length,
    };
  }, [records]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <DisclaimerBanner />

      {/* Safety Notice Card */}
      <div className="rounded-xl border border-[#1e2a3a] bg-[#0f1520] p-4 flex items-start gap-3">
        <Brain className="w-5 h-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#8fa3be] space-y-1">
          <p className="font-semibold text-[#e8edf5]">
            Demonstration Cognitive Battery Boundaries
          </p>
          <p>
            These interactive assessments are educational demonstration tasks inspired by NASA spaceflight human
            factors research. They are <strong>NOT</strong> validated neuropsychological diagnostics (such as WinSCAT or
            standardized clinical CNS batteries) and must not be used to diagnose clinical cognitive impairment or
            neurological conditions.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8edf5] tracking-tight">Fatigue & Cognitive Performance</h1>
          <p className="text-xs text-[#8fa3be] mt-1">
            Psychomotor vigilance, spatial scanning, working memory retention, and fatigue tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataOriginTag origin="USER_ENTERED" />
          <DataOriginTag origin="SIMULATED" />
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Mean Reaction Latency"
          value={stats.avgRt}
          unit="ms"
          subtext="Target: < 300 ms"
          color={stats.avgRt > 350 ? '#ef4444' : '#3b82f6'}
          icon={<Timer className="w-4 h-4" />}
        />
        <MetricCard
          label="Average Task Accuracy"
          value={stats.avgAcc}
          unit="%"
          subtext="Attention & Memory composite"
          color={stats.avgAcc < 75 ? '#f59e0b' : '#22c55e'}
          icon={<Target className="w-4 h-4" />}
        />
        <MetricCard
          label="Recorded Test Sessions"
          value={stats.totalTests}
          subtext="Historical mission logs"
          color="#8b5cf6"
          icon={<History className="w-4 h-4" />}
        />
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as 'tests' | 'analytics')}
        tabs={[
          { id: 'tests', label: 'Interactive Assessment Battery', icon: <Zap className="w-4 h-4" /> },
          { id: 'analytics', label: 'Historical Analytics & Trends', icon: <History className="w-4 h-4" /> },
        ]}
      />

      {activeTab === 'tests' && (
        <div className="space-y-6">
          {/* Sub Navigation for Tests */}
          <div className="flex flex-wrap gap-2 border-b border-[#1e2a3a] pb-3">
            <button
              onClick={() => setActiveTest('REACTION_TIME')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTest === 'REACTION_TIME'
                  ? 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a]'
                  : 'text-[#8fa3be] hover:bg-[#131924]'
              }`}
            >
              1. Psychomotor Reaction Time
            </button>
            <button
              onClick={() => setActiveTest('ATTENTION')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTest === 'ATTENTION'
                  ? 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a]'
                  : 'text-[#8fa3be] hover:bg-[#131924]'
              }`}
            >
              2. Focused Attention Scan
            </button>
            <button
              onClick={() => setActiveTest('MEMORY')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTest === 'MEMORY'
                  ? 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a]'
                  : 'text-[#8fa3be] hover:bg-[#131924]'
              }`}
            >
              3. Visual Working Memory
            </button>
          </div>

          {/* TEST 1 UI: REACTION TIME */}
          {activeTest === 'REACTION_TIME' && (
            <Card className="p-8">
              <SectionHeader
                title="Psychomotor Vigilance Task (PVT-Demonstration)"
                subtitle="Measures visual-motor response latency. Sleep loss typically degrades reaction speed."
              />

              <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div
                  onClick={handleRtClick}
                  className={`w-64 h-64 rounded-full flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-150 border-4 shadow-2xl ${
                    rtState === 'IDLE'
                      ? 'bg-[#131924] border-[#1e2a3a] hover:border-[#3b82f6]'
                      : rtState === 'WAITING'
                      ? 'bg-[#ef4444]/20 border-[#ef4444] animate-pulse'
                      : rtState === 'READY'
                      ? 'bg-[#22c55e] border-[#4ade80] scale-105'
                      : 'bg-[#1e3a5f] border-[#3b82f6]'
                  }`}
                >
                  {rtState === 'IDLE' && (
                    <div className="text-center p-4">
                      <Play className="w-10 h-10 text-[#3b82f6] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#e8edf5]">Start Test</p>
                      <p className="text-[10px] text-[#8fa3be] mt-1">Click to arm sensor</p>
                    </div>
                  )}
                  {rtState === 'WAITING' && (
                    <div className="text-center p-4">
                      <p className="text-base font-bold text-[#ef4444]">WAIT...</p>
                      <p className="text-[10px] text-[#8fa3be] mt-1">Do not click yet</p>
                    </div>
                  )}
                  {rtState === 'READY' && (
                    <div className="text-center p-4">
                      <p className="text-2xl font-black text-[#0a0d14]">CLICK!</p>
                    </div>
                  )}
                  {rtState === 'RESULT' && rtResultMs && (
                    <div className="text-center p-4">
                      <p className="text-3xl font-black text-[#e8edf5]">{rtResultMs} ms</p>
                      <p className="text-xs text-[#3b82f6] font-semibold mt-1">
                        Score: {reactionTimeToScore(rtResultMs)}/100
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center max-w-md">
                  {rtState === 'IDLE' && (
                    <Button variant="primary" onClick={startReactionTimeTest}>
                      Begin Trial
                    </Button>
                  )}
                  {rtState === 'RESULT' && (
                    <Button variant="secondary" onClick={startReactionTimeTest} icon={<RotateCcw className="w-4 h-4" />}>
                      Retest Reaction Time
                    </Button>
                  )}
                  {rtMessage && <p className="text-xs text-[#8fa3be] mt-3">{rtMessage}</p>}
                </div>
              </div>
            </Card>
          )}

          {/* TEST 2 UI: ATTENTION SCANNER */}
          {activeTest === 'ATTENTION' && (
            <Card className="p-8">
              <SectionHeader
                title="Target Visual Cancellation Task"
                subtitle="Evaluate selective visual attention by rapidly scanning a symbol array under cognitive load."
              />

              {attState === 'IDLE' && (
                <div className="text-center py-12 space-y-4 max-w-md mx-auto">
                  <Target className="w-12 h-12 text-[#14b8a6] mx-auto" />
                  <h3 className="text-base font-semibold text-[#e8edf5]">Symbol Discrimination Task</h3>
                  <p className="text-xs text-[#8fa3be]">
                    A 5×5 matrix of symbols will be generated. You will be assigned a designated target symbol and must
                    count the exact occurrences within the matrix.
                  </p>
                  <Button variant="primary" onClick={startAttentionTest}>
                    Generate Matrix & Start
                  </Button>
                </div>
              )}

              {attState === 'ACTIVE' && (
                <div className="space-y-6 max-w-lg mx-auto py-4">
                  <div className="p-4 rounded-xl bg-[#0f1520] border border-[#1e2a3a] flex items-center justify-between">
                    <span className="text-xs text-[#8fa3be]">Target Symbol to Count:</span>
                    <span className="text-2xl font-black text-[#14b8a6] px-3 py-1 bg-[#0d3030] rounded-lg border border-[#14b8a6]/40">
                      {attTarget}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5 p-4 rounded-xl bg-[#0a0d14] border border-[#1e2a3a]">
                    {attGrid.map((sym, idx) => (
                      <div
                        key={idx}
                        className="h-12 flex items-center justify-center rounded-lg bg-[#131924] border border-[#1e2a3a] text-lg font-bold text-[#e8edf5]"
                      >
                        {sym}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAttentionSubmit} className="flex gap-3">
                    <input
                      type="number"
                      required
                      placeholder="Enter target count..."
                      value={attUserAnswer}
                      onChange={(e) => setAttUserAnswer(e.target.value)}
                      className="flex-1 bg-[#0a0d14] border border-[#1e2a3a] rounded-lg px-4 py-2 text-sm text-[#e8edf5] focus:border-[#14b8a6] focus:outline-none"
                    />
                    <Button variant="primary" type="submit">
                      Submit Count
                    </Button>
                  </form>
                </div>
              )}

              {attState === 'RESULT' && attResult && (
                <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                      attResult.accurate ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}
                  >
                    {attResult.accurate ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>
                  <h3 className="text-lg font-bold text-[#e8edf5]">
                    {attResult.accurate ? 'Perfect Accuracy!' : 'Count Discrepancy'}
                  </h3>
                  <div className="text-xs text-[#8fa3be] space-y-1">
                    <p>Your count: <strong className="text-[#e8edf5]">{attResult.userAns}</strong></p>
                    <p>Actual target count: <strong className="text-[#14b8a6]">{attResult.actual}</strong></p>
                    <p>Elapsed processing time: <strong className="text-[#e8edf5]">{(attResult.timeMs / 1000).toFixed(1)}s</strong></p>
                  </div>
                  <Button variant="secondary" onClick={startAttentionTest} icon={<RotateCcw className="w-4 h-4" />}>
                    Try Another Matrix
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* TEST 3 UI: SHORT-TERM MEMORY */}
          {activeTest === 'MEMORY' && (
            <Card className="p-8">
              <SectionHeader
                title="Visual Sequential Memory Span"
                subtitle="Assesses short-term working memory capacity through sequential color recall."
              />

              {memState === 'IDLE' && (
                <div className="text-center py-12 space-y-4 max-w-md mx-auto">
                  <Brain className="w-12 h-12 text-[#8b5cf6] mx-auto" />
                  <h3 className="text-base font-semibold text-[#e8edf5]">Color Sequence Reproduction</h3>
                  <p className="text-xs text-[#8fa3be]">
                    A sequence of 5 color flashes will be presented. Memorize the order and click the color pads to
                    reproduce the exact sequence.
                  </p>
                  <Button variant="primary" onClick={startMemoryTest}>
                    Start Memory Flash
                  </Button>
                </div>
              )}

              {(memState === 'DISPLAY' || memState === 'INPUT') && (
                <div className="space-y-6 max-w-md mx-auto py-6 text-center">
                  <p className="text-xs font-semibold text-[#8fa3be]">
                    {memState === 'DISPLAY' ? 'OBSERVE COLOR SEQUENCE' : `REPRODUCE SEQUENCE (${memUserClicks.length}/5)`}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {dotColors.map((color, idx) => {
                      const isHighlighted = memActiveIndex === idx;
                      return (
                        <button
                          key={idx}
                          disabled={memState !== 'INPUT'}
                          onClick={() => handleMemDotClick(idx)}
                          className={`h-24 rounded-2xl border-2 transition-all flex items-center justify-center ${
                            isHighlighted ? 'scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: color,
                            borderColor: isHighlighted ? '#ffffff' : 'transparent',
                            transform: isHighlighted ? 'scale(1.08)' : 'scale(1)',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {memState === 'RESULT' && memResult && (
                <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                  <ScoreRing score={memResult.accuracy} size={110} color="#8b5cf6" label={`${memResult.accuracy}%`} sublabel="Sequence Recall" />
                  <h3 className="text-base font-bold text-[#e8edf5]">
                    {memResult.accuracy === 100 ? 'Flawless Sequence Recall!' : 'Partial Memory Retention'}
                  </h3>
                  <p className="text-xs text-[#8fa3be]">
                    You matched {memResult.correct} of {memResult.total} positions in the assigned sequence.
                  </p>
                  <Button variant="secondary" onClick={startMemoryTest} icon={<RotateCcw className="w-4 h-4" />}>
                    Retest Sequence
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <SectionHeader
              title="Psychomotor Latency Trend"
              subtitle="Reaction time (ms) trajectory across mission timeline"
            />
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rtHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                  <XAxis dataKey="day" stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1520',
                      borderColor: '#1e2a3a',
                      borderRadius: '8px',
                      color: '#e8edf5',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rt"
                    name="Reaction Time (ms)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionHeader
              title="Attention & Memory Accuracy"
              subtitle="Performance percentage on cognitive batteries"
            />
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                  <XAxis dataKey="day" stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                  <YAxis domain={[50, 100]} stroke="#4a6080" tick={{ fill: '#8fa3be', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1520',
                      borderColor: '#1e2a3a',
                      borderRadius: '8px',
                      color: '#e8edf5',
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* NASA Context Footer */}
      <Card className="border-[#1e2a3a] bg-[#0f1520]">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#8fa3be] space-y-1">
            <p className="font-semibold text-[#e8edf5]">NASA Human Factors & Behavioral Performance Research</p>
            <p>
              NASA's HFBP research element has demonstrated that cumulative sleep deprivation, circadian desynchrony,
              and high mission workload lead to progressive degradation in vigilance and attention. Compact, non-intrusive
              software tools are evaluated for autonomous astronaut performance self-monitoring.
            </p>
            <div className="pt-2 flex gap-4">
              <NasaSourceLink url={NASA_SOURCES.STANDARDIZED_MEASURES} label="NASA Task 1623: Standardized Behavioral Measures" />
              <NasaSourceLink url={NASA_SOURCES.HFBP_RISKS} label="NASA HFBP Risks Evidence" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
