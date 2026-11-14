import React, { useState } from 'react';
import { RESEARCH_INSIGHTS, ResearchInsight } from '../data/researchInsights';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Dna, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResearchInsightsPageProps {
  onNavigate: (route: string) => void;
}

export const ResearchInsightsPage: React.FC<ResearchInsightsPageProps> = ({ onNavigate }) => {
  const [expandedId, setExpandedId] = useState<string>(RESEARCH_INSIGHTS[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? '' : id);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Aerospace Biomedical Research Insights & Syntheses
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mechanistic syntheses of fundamental spaceflight physiology questions grounded in NASA Human Research Program publications, ISS flight findings, and ground analogs.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-space-900 border border-slate-800 text-xs font-mono text-cyan-400">
          {RESEARCH_INSIGHTS.length} In-Depth Scientific Explanations
        </div>
      </div>

      {/* Accordion List of Insights */}
      <div className="space-y-4">
        {RESEARCH_INSIGHTS.map((insight) => {
          const isExpanded = expandedId === insight.id;

          return (
            <div
              key={insight.id}
              className={`bg-space-900 border rounded-2xl transition-all overflow-hidden ${
                isExpanded ? 'border-cyan-800/80 shadow-lg shadow-cyan-950/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header Banner */}
              <button
                onClick={() => toggleExpand(insight.id)}
                className="w-full p-5 flex items-start justify-between gap-4 text-left bg-space-950/40 hover:bg-space-950/80 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-space-800 text-cyan-300 border border-slate-700">
                      {insight.riskCategoryCode}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">NASA HRP Evidence Synthesis</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 leading-snug">
                    {insight.question}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {insight.summary}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-space-800 text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Detailed Scientific Content */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-800/80 space-y-6 text-xs text-slate-300 bg-space-900/60 animate-in fade-in">
                  
                  {/* Deep Dive Prose */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                      Scientific Background & Pathophysiology
                    </h4>
                    <p className="leading-relaxed text-slate-200 bg-space-950/80 p-4 rounded-xl border border-slate-800">
                      {insight.scientificDeepDive}
                    </p>
                  </div>

                  {/* Biological Mechanisms */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Dna className="w-4 h-4 text-cyan-400" /> Primary Biological Mechanisms
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {insight.biologicalMechanism.map((mech, mIdx) => (
                        <div key={mIdx} className="p-3.5 rounded-xl bg-space-950 border border-slate-800 text-slate-200 text-xs leading-relaxed">
                          {mech}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Validated Findings */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Validated Flight Observations
                    </h4>
                    <ul className="space-y-2 bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl">
                      {insight.keyFindings.map((finding, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scientific Limitations */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Documented Research Limitations
                    </h4>
                    <ul className="space-y-1.5 bg-amber-950/10 border border-amber-900/30 p-4 rounded-xl">
                      {insight.scientificLimitations.map((limit, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2 text-amber-200/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>{limit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Original Sources */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-slate-400 font-medium">Original Verified References:</span>
                    <div className="flex flex-wrap items-center gap-3">
                      {insight.sourceCitations.map((cite, cIdx) => (
                        <a
                          key={cIdx}
                          href={cite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors font-medium text-[11px]"
                        >
                          {cite.source} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
