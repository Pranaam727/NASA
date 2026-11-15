import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Bot, User, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface ConversationExample {
  id: string;
  astronautQuery: string;
  astroCareResponse: string;
  contextTag: string;
  indicators: string[];
}

const EXAMPLES: ConversationExample[] = [
  {
    id: 'sleep',
    astronautQuery: 'My sleep duration has decreased over the last few days. What should I understand?',
    astroCareResponse:
      'Your recorded telemetry indicates sleep duration contracted from your 7.4-hour baseline to 5.6 hours over the last 3 days. In microgravity, sleep fragmentation frequently stems from circadian lighting phase shifts, acoustic habitat ventilation peaks (>60 dBA), and microgravity spinal elongation discomfort. Recommended countermeasure: verify your sleeping quarter blue-depleted circadian lighting protocol and engage in 15-minute passive lower-body decompression before rest. If cognitive latency on the PVT exceeds 200 ms, report persistent symptoms to your mission flight surgeon.',
    contextTag: 'CIRCADIAN & SLEEP ARCHITECTURE',
    indicators: ['Sleep Duration: 5.6h (-24%)', 'REM Fraction: 18%', 'PVT Latency: 168 ms'],
  },
  {
    id: 'radiation',
    astronautQuery: 'Radiation flux spiked during my EVA yesterday. What is my cumulative risk profile?',
    astroCareResponse:
      'During EVA-03, your active personal dosimeter registered an integrated dose of 1.84 mSv over 6.5 hours of extravehicular activity. Your current 30-day cumulative dose is 14.8 mSv, well within the NASA 30-day PEL guideline of 250 mSv. However, mild inflammatory cytokine elevation (IL-6 +14%) is commonly observed following acute particulate exposure. Countermeasure protocol: optimize dietary antioxidant intake with evening nutrient formulation and maintain shielded sleep quarters.',
    contextTag: 'SPACE DOSIMETRY & PEL TRACKING',
    indicators: ['EVA Dose: 1.84 mSv', '30-Day Total: 14.8 mSv', 'PEL Margin: 94.1% Remaining'],
  },
  {
    id: 'sans',
    astronautQuery: 'I noticed increased head fullness and mild blurry vision upon waking.',
    astroCareResponse:
      'Head fullness upon waking is consistent with cephalad fluid redistribution and elevated internal jugular venous pressure inherent to microgravity. However, blurry vision may indicate early Spaceflight-Associated Neuro-ocular Syndrome (SANS) involving mild optic disc edema or posterior globe flattening. Recommended action: schedule a high-resolution fundoscopic or optical coherence tomography (OCT) exam at the onboard medical station and alert Mission Medical Control for scheduled flight surgeon review.',
    contextTag: 'NEURO-OCULAR & CEPHALAD FLUID SHIFT',
    indicators: ['MAP: 92 mmHg', 'ONSD Estimate: 5.4 mm', 'Visual Acuity: 20/25'],
  },
];

export const AIGuidanceSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedExampleId, setSelectedExampleId] = useState<string>('sleep');

  const current = EXAMPLES.find((e) => e.id === selectedExampleId) || EXAMPLES[0];

  return (
    <section className="relative py-28 bg-[#05070B] overflow-hidden border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              CLINICAL REASONING COPILOT
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            INTELLIGENCE THAT HELPS YOU
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              MAKE BETTER DECISIONS.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            Natural-language biomedical reasoning grounded in aerospace medicine literature,
            multimodal telemetry correlation, and individual baseline history.
          </p>
        </div>

        {/* Preset Query Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExampleId(ex.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedExampleId === ex.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-glowCyan'
                  : 'glass-panel-subtle border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              QUERY: {ex.contextTag}
            </button>
          ))}
        </div>

        {/* AI Console Interactive Terminal Card */}
        <div className="glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
          {/* Terminal Top Bar */}
          <div className="bg-[#080F1C] px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                ASTROCARE BIOMEDICAL COPILOT // TERMINAL v2.4
              </span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
              DEMONSTRATION CONVERSATION
            </span>
          </div>

          {/* Conversation Stream */}
          <div className="p-6 sm:p-8 space-y-6 bg-black/40">
            {/* Astronaut Query Bubble */}
            <div className="flex items-start space-x-4 max-w-3xl">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    CDR. SARAH CHEN
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">14:22 MET</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white leading-relaxed">
                  "{current.astronautQuery}"
                </div>
              </div>
            </div>

            {/* AstroCare AI Copilot Response Bubble */}
            <div className="flex items-start space-x-4 max-w-3xl ml-auto">
              <div className="space-y-3 flex-1 text-right sm:text-left">
                <div className="flex items-center justify-end sm:justify-start space-x-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    ASTROCARE CLINICAL COPILOT
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">14:22:04 MET</span>
                </div>

                <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-sm text-cyan-100 leading-relaxed space-y-3 text-left">
                  <p>{current.astroCareResponse}</p>

                  {/* Contextual telemetry badges */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-800/40">
                    {current.indicators.map((ind, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-cyan-700/50 text-cyan-300"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Clinical Safety Compliance Footer */}
          <div className="bg-[#080F1C] p-4 px-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5 text-slate-400 text-xs font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                SAFETY COMPLIANCE: Decision-support prototype only. Does not provide medical diagnoses
                or replace certified NASA aerospace flight surgeons.
              </span>
            </div>

            <button
              onClick={() => navigate(ROUTES.INTELLIGENCE)}
              className="group shrink-0 px-4 py-2 rounded-lg text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center space-x-2 shadow-glowCyan"
            >
              <span>OPEN AI COPILOT WORKBENCH</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
