import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { HazardCanvas, HazardType } from '../3d/HazardCanvas';
import { Radiation, Lock, Globe2, Weight, Box, CheckCircle2, ChevronRight } from 'lucide-react';

interface HazardCardData {
  id: HazardType;
  num: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  tagColor: string;
  explanation: string;
  nasaContext: string;
  indicators: string[];
  simulationRoute: string;
}

const HAZARDS: HazardCardData[] = [
  {
    id: 'radiation',
    num: '01',
    title: 'SPACE RADIATION',
    subtitle: 'Galactic Cosmic Rays & Solar Particle Events',
    icon: Radiation,
    color: '#FF3366',
    tagColor: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
    explanation:
      'Exposure to galactic cosmic rays (GCR) and solar particle events (SPE) damages cellular DNA, degrades microvascular endothelium, and elevates lifetime excess risk of cancer and cardiovascular pathology.',
    nasaContext:
      'NASA PEL (Permissible Exposure Limit) standard caps astronaut career radiation to 600 mSv. Deep space missions to Mars project 300–450 mSv per transit.',
    indicators: ['Radiation Exposure Rate (mSv/d)', 'Cumulative Mission Dose', 'Biological DNA Double-Strand Breaks'],
    simulationRoute: ROUTES.RADIATION,
  },
  {
    id: 'isolation',
    num: '02',
    title: 'ISOLATION & CONFINEMENT',
    subtitle: 'Circadian Desynchrony & Psychological Load',
    icon: Lock,
    color: '#8B6CFF',
    tagColor: 'text-purple-400 bg-purple-950/40 border-purple-800/60',
    explanation:
      'Long periods of confined habitat isolation disrupt neurobehavioral stability, degrade slow-wave sleep architecture, and increase chronic stress hormone secretion in small crews.',
    nasaContext:
      'NASA behavioral health researchers employ daily self-report journals, acoustic speech biomarkers, and actigraphy to detect subclinical depression or interpersonal tension.',
    indicators: ['Mood & Behavioral Health Score', 'Sleep Architecture (REM/Deep)', 'Cognitive Reaction Latency (PVT)'],
    simulationRoute: ROUTES.WELLNESS,
  },
  {
    id: 'distance',
    num: '03',
    title: 'DISTANCE FROM EARTH',
    subtitle: 'Telemetry Latency & Medical Autonomy',
    icon: Globe2,
    color: '#00D9FF',
    tagColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60',
    explanation:
      'As distance to Mars reaches 400 million kilometers, round-trip radio transmission delays exceed 44 minutes. Ground flight surgeons cannot provide real-time resuscitation guidance.',
    nasaContext:
      'Requires deterministic onboard clinical reasoning copilots capable of local anomaly triage, pharmacological guidance, and autonomous medical contingency handling.',
    indicators: ['Self-Assessment Completion', 'Autonomous Telemetry Triaging', 'Clinical Escalation Protocol'],
    simulationRoute: ROUTES.INTELLIGENCE,
  },
  {
    id: 'gravity',
    num: '04',
    title: 'GRAVITY FIELDS',
    subtitle: 'Microgravity, Lunar (0.16g) & Martian (0.38g)',
    icon: Weight,
    color: '#65CFFF',
    tagColor: 'text-blue-400 bg-blue-950/40 border-blue-800/60',
    explanation:
      'Weightlessness causes immediate cephalad fluid redistribution (2 liters shifting from lower limbs to thorax/head), followed by bone mineral demineralization (1.0–1.5% bone density lost per month).',
    nasaContext:
      'Countermeasures include high-load resistive exercise (ARED), penguin suits, lower body negative pressure (LBNP), and daily cardiovascular conditioning.',
    indicators: ['Systolic / Diastolic Blood Pressure', 'Mean Arterial Pressure (MAP)', 'Musculoskeletal Bone Turnover Markers'],
    simulationRoute: ROUTES.SPACE_HEALTH,
  },
  {
    id: 'environment',
    num: '05',
    title: 'HOSTILE CLOSED ENVIRONMENTS',
    subtitle: 'Life Support, CO2 Accumulation & Microbiome',
    icon: Box,
    color: '#00FFAA',
    tagColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
    explanation:
      'Hermetically sealed spacecraft environments concentrate elevated ambient carbon dioxide (CO2 > 3.0 mmHg), microgravity aerosolized allergens, and virulent opportunistic microbial biofilms.',
    nasaContext:
      'Spaceflight-associated neuro-ocular syndrome (SANS) and headaches correlate strongly with chronic mild hypercapnia and elevated intracranial pressure in closed habitats.',
    indicators: ['Core Body Temperature', 'Cabin O2 / CO2 Partial Pressures', 'Hydration & Nutrition Biomarkers'],
    simulationRoute: ROUTES.SIMULATION,
  },
];

export const SpaceflightHazardsSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('radiation');

  const activeData = HAZARDS.find((h) => h.id === selectedHazard) || HAZARDS[0];

  return (
    <section id="hazards" className="relative py-28 bg-[#05070B] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-950/20 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              NASA HUMAN RESEARCH PROGRAM (HRP) TAXONOMY
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            FIVE HAZARDS.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              ONE HUMAN BODY.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            Space changes the environment. Understanding how it changes the human body is essential
            for safer exploration.
          </p>
        </div>

        {/* Hazard Selector Pills (Horizontal on Desktop) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {HAZARDS.map((hazard) => {
            const isSelected = selectedHazard === hazard.id;
            const Icon = hazard.icon;
            return (
              <button
                key={hazard.id}
                onClick={() => setSelectedHazard(hazard.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-400 text-cyan-300 shadow-glowCyan'
                    : 'glass-panel-subtle border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: isSelected ? hazard.color : undefined }} />
                <span>
                  {hazard.num} // {hazard.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Hazard Spotlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#151515] rounded-2xl p-6 sm:p-10 border border-[#262626] shadow-card">
          {/* Left Column: 3D Animated Canvas Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full rounded-xl overflow-hidden bg-[#0D0D0D] border border-[#262626] p-2">
              <HazardCanvas hazard={selectedHazard} />
              <div className="absolute top-3 left-3 text-[10px] font-mono text-[#00A3FF] bg-[#0D0D0D]/90 px-2 py-0.5 rounded border border-[#00A3FF]/30">
                REAL-TIME 3D SIMULATION // {activeData.id.toUpperCase()}
              </div>
            </div>
            <div className="mt-3 text-[11px] font-mono text-[#817E7B] text-center">
              Particle accelerator physics & biological target envelope
            </div>
          </div>

          {/* Right Column: Deep Biomedical Explanations & Indicators */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <span className="text-xs font-mono text-[#00A3FF] font-bold tracking-wider">
                  HAZARD {activeData.num} OF 05
                </span>
                <h3 className="text-2xl sm:text-3xl font-space font-bold text-[#E2DED9] mt-0.5">
                  {activeData.title}
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${activeData.tagColor}`}>
                CRITICAL MISSION FACTOR
              </span>
            </div>

            <p className="text-[#C6C2BB] text-sm sm:text-base leading-relaxed">
              {activeData.explanation}
            </p>

            {/* NASA Research Context */}
            <div className="p-4 rounded-xl bg-[#0A1220] border border-[#00A3FF]/20 text-xs sm:text-sm text-[#C6C2BB] leading-relaxed">
              <strong className="text-[#00A3FF] font-mono block mb-1">AEROSPACE RESEARCH CONTEXT:</strong>
              {activeData.nasaContext}
            </div>

            {/* Associated Monitoring Indicators */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-[#817E7B] tracking-wider uppercase">
                RELEVANT ASTROCARE INDICATORS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeData.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#0D0D0D] border border-[#262626] flex items-start space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00A3FF] mt-0.5 shrink-0" />
                    <span className="text-xs font-mono text-[#E2DED9]">{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Link to Simulated Telemetry */}
            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => navigate(activeData.simulationRoute)}
                className="group flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold text-black bg-[#00A3FF] hover:bg-[#38BDF8] transition-colors shadow-glowCyan"
              >
                <span>OPEN {activeData.title} DASHBOARD</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
