import React from 'react';
import { Eye, HeartPulse, Bone, Moon, Radiation, BrainCircuit } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SUGGESTED_PROMPT_CATEGORIES = [
  {
    category: 'Cardiovascular & SANS',
    icon: Eye,
    color: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60',
    prompts: [
      'Explain the relationship between cephalad fluid shift, elevated cabin CO2, and SANS risk.',
      'How does microgravity hypovolemia impact orthostatic tolerance upon return to Earth?',
      'Interpret our astronaut’s HRV rMSSD trend and cardiovascular vagal modulation.'
    ]
  },
  {
    category: 'Bone & Musculoskeletal',
    icon: Bone,
    color: 'text-amber-400 border-amber-500/30 hover:border-amber-500/60',
    prompts: [
      'Analyze the elevated serum NTX marker: what does it reveal about trabecular bone loss?',
      'How effective is our current ARED resistance training protocol at preventing muscle atrophy?',
      'Summarize NASA HRP Evidence findings on spaceflight-induced osteoporosis.'
    ]
  },
  {
    category: 'Radiation & Dosimetry',
    icon: Radiation,
    color: 'text-rose-400 border-rose-500/30 hover:border-rose-500/60',
    prompts: [
      'Evaluate the cumulative radiation dose of 72.4 mSv against NASA Career LEO Permissible Limits.',
      'Explain the biological difference between GCR heavy ions (HZE) and Solar Particle Events (SPE).',
      'What are the microvascular endothelial risks associated with space radiation?'
    ]
  },
  {
    category: 'Sleep & Immune Axis',
    icon: Moon,
    color: 'text-purple-400 border-purple-500/30 hover:border-purple-500/60',
    prompts: [
      'Correlate the 5.4h sleep debt with salivary EBV reactivation and elevated IL-6.',
      'What chronobiological countermeasures does NASA recommend for circadian misalignment on orbit?',
      'Summarize sleep deficiency data from The Lancet Neurology 2014 study.'
    ]
  },
  {
    category: 'Mission Context Synthesis',
    icon: BrainCircuit,
    color: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60',
    prompts: [
      'Synthesize multi-domain health status for Flight Day 142 and propose Flight Surgeon questions.',
      'Distinguish the factual telemetry observations from pathophysiological hypotheses in this profile.',
      'Summarize the NASA Twins Study (Science 2019) multi-omic results.'
    ]
  }
];

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
        <span>Contextual Biomedical Prompts & Inquiries</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SUGGESTED_PROMPT_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 hover:bg-slate-900/90 transition-all"
            >
              <div className="flex items-center gap-2 mb-2 font-medium text-xs text-slate-200">
                <Icon className={`w-3.5 h-3.5 ${cat.color.split(' ')[0]}`} />
                <span>{cat.category}</span>
              </div>
              <div className="space-y-1.5">
                {cat.prompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => onSelectPrompt(p)}
                    className="w-full text-left text-[11px] text-slate-400 hover:text-cyan-300 bg-slate-950/60 hover:bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-850 hover:border-cyan-500/30 transition-all cursor-pointer leading-snug line-clamp-2"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
