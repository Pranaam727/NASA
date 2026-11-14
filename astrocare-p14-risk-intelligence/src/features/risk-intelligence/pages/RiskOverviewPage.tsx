import React, { useState } from 'react';
import { RiskSummaryCards } from '../components/RiskSummaryCards';
import { RiskCategoryCard } from '../components/RiskCategoryCard';
import { RiskComparisonChart } from '../components/RiskComparisonChart';
import { ResearchTimeline } from '../components/ResearchTimeline';
import { EvidenceDetailPanel } from '../components/EvidenceDetailPanel';
import { NASA_RISK_CATEGORIES } from '../data/nasaRiskCategories';
import { NASA_EVIDENCE_LIBRARY } from '../data/nasaEvidenceLibrary';
import { NASA_MITIGATION_STRATEGIES } from '../data/nasaMitigations';
import { RiskCategory } from '../types/risk.types';
import { ResearchEvidence } from '../types/evidence.types';
import { 
  Rocket, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  Activity, 
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface RiskOverviewPageProps {
  onNavigate: (route: string) => void;
}

export const RiskOverviewPage: React.FC<RiskOverviewPageProps> = ({ onNavigate }) => {
  const [selectedEvidence, setSelectedEvidence] = useState<ResearchEvidence | null>(null);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState<RiskCategory | null>(null);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            NASA Human Research Program (HRP) Evidence Alignment
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            Human-Spaceflight Risk Intelligence Platform
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Comprehensive aerospace biomedical intelligence module tracking physiological adaptations, space radiation hazards, microgravity deconditioning, and validated countermeasures across Low Earth Orbit, Lunar Artemis expeditions, and Mars exploration missions.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/risks/categories')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              Explore 8 Risk Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/risks/mission-analysis')}
              className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-400" /> Run Mission Analysis
            </button>
            <button
              onClick={() => onNavigate('/risks/evidence')}
              className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-violet-400" /> Evidence Library
            </button>
          </div>
        </div>

        {/* Decorative Grid Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Quantitative Summary Cards */}
      <RiskSummaryCards />

      {/* Scientific Integrity Callout */}
      <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-slate-100">NASA Evidence-Based Governance:</strong> This platform utilizes genuine NASA Human Research Program (HRP) publications, NTRS technical reports, and peer-reviewed human spaceflight data. In accordance with aerospace medical ethics, all risk evaluations are presented as qualitative research assessments rather than ungrounded speculative mathematical probabilities.
        </div>
      </div>

      {/* Interactive Multi-Domain Research Analytics */}
      <RiskComparisonChart categoryIds={['RAD', 'CARDIO', 'BONE', 'SANS']} />

      {/* Core Health Risk Categories Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Human Spaceflight Health Risk Categories
            </h2>
            <p className="text-xs text-slate-400">
              Eight primary biomedical risk categories established by the NASA Human Research Roadmap
            </p>
          </div>
          <button
            onClick={() => onNavigate('/risks/categories')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
          >
            View All Categories & Physiological Systems <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {NASA_RISK_CATEGORIES.slice(0, 4).map(category => (
            <RiskCategoryCard
              key={category.id}
              category={category}
              onSelect={(cat) => setSelectedQuickCategory(cat)}
              onNavigateDetail={(route) => onNavigate(route)}
            />
          ))}
        </div>
      </div>

      {/* Research Discoveries & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Timeline */}
        <div className="lg:col-span-2">
          <ResearchTimeline />
        </div>

        {/* Right Col: NASA Evidence Highlights */}
        <div className="bg-space-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Landmark Human Research Highlights
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct evidence extracted from long-duration orbital missions
              </p>
            </div>

            <div className="space-y-3">
              {NASA_EVIDENCE_LIBRARY.slice(0, 3).map(ev => (
                <div 
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev)}
                  className="p-3 rounded-lg bg-space-950/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-400 font-semibold">{ev.evidenceCode}</span>
                    <span className="text-slate-400">{ev.publicationDate}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug hover:text-cyan-300">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {ev.findings}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/risks/evidence')}
            className="w-full py-2 rounded-lg bg-space-800 hover:bg-space-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            Access Full Evidence Library ({NASA_EVIDENCE_LIBRARY.length} Studies) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Quick Category Modal */}
      {selectedQuickCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-space-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-space-800 text-cyan-400 border border-slate-700">
                  {selectedQuickCategory.code}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  {selectedQuickCategory.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedQuickCategory(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedQuickCategory.fullDescription}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400">Primary Biological Mechanisms</h4>
              {selectedQuickCategory.mechanisms.map((m, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-space-950 border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200">{m.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{m.description}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <a
                href={selectedQuickCategory.hrpRiskUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                NASA HRP Web Documentation <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setSelectedQuickCategory(null)}
                className="px-4 py-1.5 rounded-lg bg-space-800 text-slate-200 hover:bg-space-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Detail Modal */}
      <EvidenceDetailPanel
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

    </div>
  );
};
