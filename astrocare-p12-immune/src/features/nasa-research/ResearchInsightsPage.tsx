import React, { useState } from 'react';
import { nasaResearchService } from '../../services/nasa/nasaResearchService';
import { ImmuneResearchInsightTopic } from '../../types';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  BookOpen,
  Orbit,
  Zap,
  Activity,
  ShieldAlert,
  Bug,
  Layers,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const ResearchInsightsPage: React.FC = () => {
  const topics = nasaResearchService.getInsightTopics();
  const officialResources = nasaResearchService.getOfficialResources();

  const [activeTopicId, setActiveTopicId] = useState<string>(topics[0].id);
  const activeTopic = topics.find((t) => t.id === activeTopicId) || topics[0];

  const getTopicIcon = (name: string) => {
    switch (name) {
      case 'Orbit':
        return <Orbit className="w-5 h-5 text-cyan-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-purple-400" />;
      case 'Bug':
        return <Bug className="w-5 h-5 text-emerald-400" />;
      case 'Layers':
      default:
        return <Layers className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module H — Aerospace Immunology Insights
            </span>
            <DataOriginBadge origin="NASA_RESEARCH" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            NASA Spaceflight Immune Research Insights
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Scientific taxonomy synthesizing empirical findings from the NASA Immunology & Virology Laboratory,
            Human Research Roadmap (Risk i=85), and Flow Cytometry protocols (NTRS-20230016983).
          </p>
        </div>
      </div>

      {/* Epistemological Distinction Banner */}
      <div className="bg-space-950 p-4 rounded-xl border border-space-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300 font-bold mb-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Scientific Epistemology: Distinguishing Evidence Levels</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
          <div className="bg-space-900 p-2.5 rounded border border-space-800/80">
            <strong className="text-emerald-400 block mb-0.5">1. Observed Findings</strong>
            <span className="text-slate-300">Empirical, reproducible analytical measurements from astronaut cohorts.</span>
          </div>
          <div className="bg-space-900 p-2.5 rounded border border-space-800/80">
            <strong className="text-sky-400 block mb-0.5">2. Possible Mechanisms</strong>
            <span className="text-slate-300">Biophysical pathways (e.g. integrin mechanotransduction, HPA axis).</span>
          </div>
          <div className="bg-space-900 p-2.5 rounded border border-space-800/80">
            <strong className="text-amber-400 block mb-0.5">3. Working Hypotheses</strong>
            <span className="text-slate-300">Current scientific models undergoing active exploration on ISS/analog missions.</span>
          </div>
          <div className="bg-space-900 p-2.5 rounded border border-space-800/80">
            <strong className="text-rose-400 block mb-0.5">4. Clinical Boundaries</strong>
            <span className="text-slate-300">Associations do not constitute causality; biomarkers alone do not dictate diagnosis.</span>
          </div>
        </div>
      </div>

      {/* Interactive Topic Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Research Insight Modules
          </h3>
          {topics.map((topic) => {
            const isSelected = topic.id === activeTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-space-850 border-cyan-500/80 shadow-md shadow-cyan-950/30'
                    : 'bg-space-900 border-space-800 hover:border-space-700 hover:bg-space-850/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-space-950 border border-space-800">
                    {getTopicIcon(topic.iconName)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">{topic.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{topic.summary}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 transition ${
                    isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Selected Topic Detailed Deep-Dive Card */}
        <div className="lg:col-span-8 bg-space-900 border border-space-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-space-950 border border-space-800">
                {getTopicIcon(activeTopic.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Scientific Briefing
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">{activeTopic.title}</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 pb-4 border-b border-space-800 leading-relaxed font-sans">
              {activeTopic.summary}
            </p>

            {/* Section 1: Observed Research Findings */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Empirical Observed Findings (NASA In-Flight Studies)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-5 list-disc font-sans">
                {activeTopic.observedFindings.map((finding, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Possible Biological Mechanisms */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-sky-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                Proposed Biological Mechanisms
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-5 list-disc font-sans">
                {activeTopic.possibleMechanisms.map((mech, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {mech}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Active Working Hypotheses */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Exploratory Working Hypotheses
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-5 list-disc font-sans">
                {activeTopic.hypotheses.map((hyp, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {hyp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: Clinical Distinction Guardrail */}
            <div className="mt-5 bg-space-950 p-3.5 rounded-lg border border-rose-900/40 text-xs">
              <strong className="text-rose-400 font-mono font-bold uppercase block mb-1">
                Clinical Boundary & Caveat:
              </strong>
              <p className="text-slate-300 leading-relaxed font-sans">
                {activeTopic.clinicalDistinction}
              </p>
            </div>
          </div>

          {/* Section 5: Related NASA Sources */}
          <div className="mt-6 pt-4 border-t border-space-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400">Related NASA Citations:</span>
            <div className="flex flex-wrap items-center gap-2">
              {activeTopic.relatedNasaResources.map((resId) => {
                const match = officialResources.find((r) => r.id === resId);
                return (
                  <a
                    key={resId}
                    href={match?.officialUrl || 'https://www.nasa.gov'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-space-950 hover:bg-space-800 text-cyan-400 border border-cyan-900/60 transition text-[11px]"
                  >
                    <span>{match?.title || resId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
