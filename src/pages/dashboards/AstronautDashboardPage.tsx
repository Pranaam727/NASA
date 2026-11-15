import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { CyberEarth3D } from '@/components/3d/CyberEarth3D';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  Moon,
  Radio,
  Dna,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  ShieldCheck,
} from 'lucide-react';

export const AstronautDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { compositeScore, riskLevel, systemWideActiveAlerts } = useHealthAnalytics('ASTRO-01');

  // Interactive AI Assistant State
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'Greetings Commander Chen. I am your grounded personal health assistant. You may ask me to analyze your 30-day baseline, recent sleep shifts, or countermeasure adherence.',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAssistant = (e?: React.FormEvent, preset?: string) => {
    if (e) e.preventDefault();
    const q = preset || chatQuery;
    if (!q.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text: q }];
    setChatHistory(newHistory);
    setChatQuery('');
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();
      if (lower.includes('sleep')) {
        reply =
          'Your sleep duration averaged 7.8 hours over the last 7 Sols, showing +0.4h improvement following circadian lighting adjustments in habitat Module B. Rapid Eye Movement (REM) fraction is 22.8%, well within baseline.';
      } else if (lower.includes('alert')) {
        reply =
          'You currently have 0 active critical alerts. Your resting heart rate (64 bpm) and arterial SpO2 (98.4%) are within your individualized ±1.5σ normal envelope.';
      } else if (lower.includes('indicator') || lower.includes('changed')) {
        reply =
          'Compared to your Earth pre-launch baseline, your resting systolic blood pressure has decreased by 4 mmHg (fluid cephalad redistribution), and bone mineral density loss remains arrested at <0.38% this month due to 100% ARED adherence.';
      } else if (lower.includes('summarize') || lower.includes('week')) {
        reply =
          'Weekly Summary for Cmdr. Chen: Composite risk score is 12/100 (NOMINAL). Total radiation accumulated this week: +0.28 mSv. Exercise sessions completed: 6 of 6. All daily self-assessments submitted on schedule.';
      } else {
        reply = `Analysis for Cmdr. Marcus Chen: Your active telemetry confirms optimal physiological adaptation to Sol 142 microgravity conditions. Vital signs and recovery indices remain stabilized within personal tolerances.`;
      }

      setChatHistory([...newHistory, { sender: 'assistant', text: reply }]);
      setIsAiLoading(false);
    }, 500);
  };

  return (
    <PageContainer>
      {/* Top Banner & Title */}
      <PageHeader
        title="PERSONAL HEALTH COMMAND CENTER"
        subtitle="Welcome back, Commander Marcus Chen. Your mission health overview is ready."
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator status="NOMINAL" label="CREW STATUS: FIT" />
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 font-bold">
              ASTRO-01 · COMMANDER
            </span>
          </div>
        }
        metadata={[
          { label: 'Crew Member', value: currentUser?.name || 'Cmdr. Marcus Chen' },
          { label: 'Mission Sol', value: 'Sol 142 (Transit)' },
          { label: 'Composite Risk', value: `${compositeScore.toFixed(0)} / 100 (${riskLevel})` },
          { label: 'Active Alerts', value: `${systemWideActiveAlerts.length} Active` },
        ]}
      />

      {/* ── 3D Dashboard Hero Panel: Crew Health / Personal Monitoring ── */}
      <div className="relative rounded-2xl cyber-glass-glow border border-[#24E6D0]/30 overflow-hidden p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#071311] border border-[#24E6D0]/30 font-mono text-[9px] uppercase font-bold text-[#8BFFE9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0] animate-pulse" />
              <span>CREW HEALTH // PERSONAL MONITORING</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F4FAF8] tracking-tight">
              ARES-VI ORBITAL BIOMETRICS COCKPIT
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#91A9A4] leading-relaxed">
              Real-time physiological telemetry, individualized biological envelopes, and autonomous diagnostic surveillance during Sol 142 transit.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#24E6D0]">
                HR: 64 BPM (NOMINAL)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#8BFFE9]">
                SLEEP: 7.8 HRS (RESTORED)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#24E6D0]">
                DOSIMETRY: 0.28 mSv/wk
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[380px] h-[220px] relative shrink-0 rounded-xl overflow-hidden border border-[#24E6D0]/20">
            <CyberEarth3D className="min-h-[220px]" interactive={true} />
          </div>
        </div>
      </div>

      {/* ── Widget A: Personal Health Overview Metrics ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricDisplay
          label="Heart Rate"
          value="64"
          unit="BPM"
          trend="flat"
          delta="0"
          status="NOMINAL"
          icon={Heart}
          subtext="μ=64 BPM (BASELINE)"
        />
        <MetricDisplay
          label="Arterial SpO2"
          value="98.4"
          unit="%"
          trend="flat"
          delta="+0.1"
          status="NOMINAL"
          icon={Activity}
          subtext="PO2 OPTIMAL"
        />
        <MetricDisplay
          label="Blood Pressure"
          value="114/74"
          unit="mmHg"
          trend="flat"
          delta="-2"
          status="NOMINAL"
          icon={ShieldCheck}
          subtext="SYSTOLIC STABLE"
        />
        <MetricDisplay
          label="Body Temperature"
          value="36.8"
          unit="°C"
          trend="flat"
          delta="0.0"
          status="NOMINAL"
          icon={Thermometer}
          subtext="CIRCADIAN NOMINAL"
        />
        <MetricDisplay
          label="Respiratory Rate"
          value="14"
          unit="BPM"
          trend="flat"
          delta="0"
          status="NOMINAL"
          icon={Wind}
          subtext="EUPNEIC RHYTHM"
        />
      </div>

      {/* ── Main Dashboard Widgets Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Health Twin, Self-Assessment, Radiation, Exercise */}
        <div className="lg:col-span-8 space-y-6">
          {/* Widget B: Personal Health Twin */}
          <DossierCard
            title="PERSONAL HEALTH TWIN // 30-DAY STATISTICAL BASELINE"
            subtitle="MARCUS CHEN (ASTRO-01) · 5-POINT BIOLOGICAL ENVELOPE"
            badge={
              <Link to={ROUTES.HEALTH_TWIN} className="font-mono text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1">
                <span>INSPECT TWIN</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">RESTING HR (30D)</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">64 BPM</div>
                  <div className="text-[10px] text-[#24E6D0]">Envelope: 60–68 BPM</div>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">ARTERIAL SpO2 (30D)</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">98.4%</div>
                  <div className="text-[10px] text-[#24E6D0]">Envelope: 97–99%</div>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">BLOOD PRESSURE</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">114/74</div>
                  <div className="text-[10px] text-[#24E6D0]">Envelope: 110–120</div>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">BODY TEMP</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">36.8°C</div>
                  <div className="text-[10px] text-[#24E6D0]">Envelope: 36.6–37.1</div>
                </div>
              </div>

              <div className="p-3 bg-[#24E6D0]/10 border border-[#24E6D0]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#24E6D0]" />
                  <span className="font-bold text-[#F4FAF8]">ALL BIOMARKERS WITHIN INDIVIDUAL ±2.0σ TOLERANCE</span>
                </div>
                <span className="text-[10px] text-[#24E6D0] font-bold">0 CRITICAL DRIFTS</span>
              </div>
            </div>
          </DossierCard>

          {/* Widget C: Daily Self-Assessment */}
          <DossierCard
            title="DAILY SELF-ASSESSMENT // DIURNAL PROTOCOL"
            subtitle="MET SOL 142 CHECK-IN STATUS"
            badge={<StatusIndicator status="NOMINAL" label="SOL 142 RECORDED" size="sm" />}
          >
            <div className="space-y-4">
              <div className="p-3.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F4FAF8] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#24E6D0]" />
                    <span>TODAY'S ASSESSMENT RECORDED (MET 142d 07:15)</span>
                  </div>
                  <div className="text-xs text-[#91A9A4]">
                    Fatigue: <strong className="text-[#F4FAF8]">2/10</strong> · Sleep: <strong className="text-[#8BFFE9]">7.8 hrs</strong> · Vertigo: <strong className="text-[#24E6D0]">None</strong> · SANS Vision: <strong className="text-[#24E6D0]">Nominal</strong>
                  </div>
                </div>
                <Link
                  to={ROUTES.SELF_ASSESSMENT}
                  className="px-4 py-2 bg-[#24E6D0] text-[#020807] rounded-xl font-mono text-xs font-bold hover:bg-[#8BFFE9] transition-all flex items-center space-x-1.5 shrink-0 shadow-cyberGlow"
                >
                  <span>UPDATE ASSESSMENT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75] block">PREVIOUS SOL (141)</span>
                  <span className="text-xs font-bold text-[#24E6D0] mt-0.5 block">WELLBEING 8/10</span>
                </div>
                <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75] block">PREVIOUS SOL (140)</span>
                  <span className="text-xs font-bold text-[#24E6D0] mt-0.5 block">WELLBEING 7/10</span>
                </div>
                <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75] block">STREAK</span>
                  <span className="text-xs font-bold text-[#8BFFE9] mt-0.5 block">142 SOLS LOGGED</span>
                </div>
              </div>
            </div>
          </DossierCard>

          {/* Widget D & F: Radiation Exposure & Countermeasure Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Widget D: Radiation Exposure */}
            <DossierCard
              title="RADIATION DOSIMETRY"
              subtitle="CUMULATIVE MISSION EXPOSURE"
              badge={<Radio className="w-4 h-4 text-[#24E6D0]" />}
            >
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-[#F4FAF8]">48.6 mSv</span>
                  <span className="text-[10px] text-[#5B7B75]">LIMIT: 250 mSv (30D)</span>
                </div>
                <div className="w-full h-2 bg-[#020807] rounded-full overflow-hidden border border-[#24E6D0]/20">
                  <div className="h-full bg-[#24E6D0]" style={{ width: '19.4%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#91A9A4]">
                  <span>Current Rate: 0.34 mSv/day</span>
                  <span className="text-[#24E6D0]">Margin: 201.4 mSv Safe</span>
                </div>
                <Link to={ROUTES.RADIATION} className="text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1 pt-1">
                  <span>View Radiation Timeline →</span>
                </Link>
              </div>
            </DossierCard>

            {/* Widget F: Countermeasure Tracking */}
            <DossierCard
              title="COUNTERMEASURE LOG"
              subtitle="ARED & SKELETAL PRESERVATION"
              badge={<Dna className="w-4 h-4 text-[#24E6D0]" />}
            >
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div>
                    <span className="font-bold text-[#F4FAF8] block">ARED Resistance (Squats)</span>
                    <span className="text-[10px] text-[#91A9A4]">185 kg · 4x10 Reps · Completed</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 rounded text-[9px] font-bold">
                    DONE
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div>
                    <span className="font-bold text-[#F4FAF8] block">Vitamin D3 + Calcium</span>
                    <span className="text-[10px] text-[#91A9A4]">2,000 IU Daily Dose</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 rounded text-[9px] font-bold">
                    TAKEN
                  </span>
                </div>
                <Link to={ROUTES.SPACE_HEALTH} className="text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1 pt-1">
                  <span>Open Full Exercise Log →</span>
                </Link>
              </div>
            </DossierCard>
          </div>
        </div>

        {/* Right Column (4 cols): Sleep, Alerts, AI Health Assistant */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget E: Sleep Intelligence */}
          <DossierCard
            title="SLEEP INTELLIGENCE"
            subtitle="SOL 141-142 CIRCADIAN ARCHITECTURE"
            badge={<Moon className="w-4 h-4 text-[#8BFFE9]" />}
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75] block">SLEEP DURATION</span>
                  <span className="text-base font-bold text-[#F4FAF8]">7.8 hrs</span>
                </div>
                <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75] block">QUALITY INDEX</span>
                  <span className="text-base font-bold text-[#24E6D0]">88%</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl text-[11px] text-[#91A9A4]">
                Deep SWS: <strong className="text-[#8BFFE9]">1.9h</strong> · REM: <strong className="text-[#24E6D0]">1.8h</strong> · Light: <strong className="text-[#F4FAF8]">4.1h</strong>
              </div>
              <Link to={ROUTES.WELLNESS} className="text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1">
                <span>View Sleep & Journal →</span>
              </Link>
            </div>
          </DossierCard>

          {/* Widget G: Personal Alerts */}
          <DossierCard
            title="PERSONAL HEALTH ALERTS"
            subtitle="FLIGHT SURGEON NOTIFICATIONS"
            badge={
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 font-bold">
                NOMINAL
              </span>
            }
          >
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-[#24E6D0]">DR. SARAH VANCE (FLIGHT SURGEON)</span>
                  <span className="text-[#5B7B75]">08:00 MET</span>
                </div>
                <p className="text-[11px] text-[#91A9A4] font-body">
                  "Hydration levels nominal for upcoming Sol 144 core drilling EVA. Maintain current electrolyte fluid formulation."
                </p>
              </div>
              <Link to={ROUTES.ALERTS} className="text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1 pt-1">
                <span>View Incident Registry →</span>
              </Link>
            </div>
          </DossierCard>

          {/* Widget H: AI Health Assistant */}
          <DossierCard
            title="AI HEALTH ASSISTANT"
            subtitle="GROUNDED IN MARCUS CHEN'S AUTHORIZED RECORDS"
            badge={<Sparkles className="w-4 h-4 text-[#8BFFE9]" />}
          >
            <div className="space-y-3">
              {/* Chat Log */}
              <div className="h-48 overflow-y-auto space-y-2 p-2 bg-[#020807]/80 border border-[#24E6D0]/18 rounded-xl text-xs font-mono">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl ${
                      msg.sender === 'user'
                        ? 'bg-[#24E6D0] text-[#020807] ml-6 text-right font-semibold'
                        : 'bg-[#071311] text-[#F4FAF8] mr-6 border border-[#24E6D0]/20'
                    }`}
                  >
                    <span className="text-[9px] block text-[#5B7B75] mb-0.5">
                      {msg.sender === 'user' ? 'YOU (CMDR. CHEN)' : 'ASTROCARE COPILOT'}
                    </span>
                    <span className="font-body text-[11px] leading-relaxed block">{msg.text}</span>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="p-2 bg-[#071311] text-[#24E6D0] border border-[#24E6D0]/20 rounded-xl text-[11px] font-mono animate-pulse">
                    Analyzing Marcus Chen baseline envelope...
                  </div>
                )}
              </div>

              {/* Preset Quick Questions */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => handleAskAssistant(undefined, 'How has my sleep changed?')}
                  className="px-2 py-0.5 bg-[#071311] border border-[#24E6D0]/20 rounded-lg hover:border-[#24E6D0] text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
                >
                  How has my sleep changed?
                </button>
                <button
                  type="button"
                  onClick={() => handleAskAssistant(undefined, 'Explain my latest alert.')}
                  className="px-2 py-0.5 bg-[#071311] border border-[#24E6D0]/20 rounded-lg hover:border-[#24E6D0] text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
                >
                  Explain my latest alert.
                </button>
                <button
                  type="button"
                  onClick={() => handleAskAssistant(undefined, 'Summarize my health this week.')}
                  className="px-2 py-0.5 bg-[#071311] border border-[#24E6D0]/20 rounded-lg hover:border-[#24E6D0] text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
                >
                  Summarize this week.
                </button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskAssistant} className="flex space-x-1.5">
                <input
                  type="text"
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="Ask about vitals, sleep, or radiation..."
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[#071311] border border-[#24E6D0]/30 rounded-xl text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0]"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !chatQuery.trim()}
                  className="px-3 py-2 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-cyberGlow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </DossierCard>
        </div>
      </div>
    </PageContainer>
  );
};
