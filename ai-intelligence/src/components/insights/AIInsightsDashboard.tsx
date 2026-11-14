import React, { useState, useEffect } from 'react';
import { useAstroCareAI } from '../../providers/ProviderContext';
import {
  AstronautHealthPayload,
  MissionContext,
  AIInsightsResult
} from '../../types';
import {
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AIInsightsDashboardProps {
  currentAstronaut: AstronautHealthPayload;
  missionContext: MissionContext;
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  currentAstronaut,
  missionContext
}) => {
  const { provider, mode } = useAstroCareAI();

  const [insights, setInsights] = useState<AIInsightsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const res = await provider.generateBiomedicalInsights(currentAstronaut, missionContext);
      setInsights(res);
    } catch (err) {
      console.error('Failed to generate insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [currentAstronaut.astronautId, missionContext.flightDay, missionContext.currentPhase]);

  const getSeverityBadge = (sev: 'low' | 'moderate' | 'elevated' | 'high') => {
    switch (sev) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500">HIGH RISK</span>;
      case 'elevated':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/50">ELEVATED</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">MODERATE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              Cross-Domain Biomedical Insights & Clinical Risk Patterns
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              SYNTHESIS ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Continuous surveillance synthesizing cardiovascular, bone, radiation, circadian, and immune indicators for Flight Surgeons.
          </p>
        </div>

        <button
          onClick={loadInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Re-evaluate Synthesis</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-slate-950 p-12 rounded-xl border border-slate-800 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <div className="text-sm font-semibold text-slate-200">
            Synthesizing multi-domain telemetry and NASA Human Research Program benchmarks...
          </div>
          <p className="text-xs text-slate-500 font-mono">Evaluating {currentAstronaut.astronautName} on Flight Day {missionContext.flightDay}</p>
        </div>
      ) : insights ? (
        <>
          {/* Executive Summary Card */}
          <div className="bg-slate-950 rounded-xl border border-cyan-500/30 p-5 shadow-xl glow-cyan space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Executive Physiological Synthesis
              </span>
              <span className="font-mono text-slate-500 text-[11px]">
                Generated {new Date(insights.generatedAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {insights.statusOverview}
            </p>
          </div>

          {/* Cross-Domain Correlations */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Cross-Disciplinary Physiological Correlations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {insights.crossDomainCorrelations.map((corr, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 space-y-2 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex flex-wrap gap-1">
                    {corr.domains.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 capitalize">
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-snug">
                    {corr.relationship}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <strong className="text-slate-300">Clinical Impact:</strong> {corr.clinicalSignificance}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Pattern Matrix */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Aerospace Biomedical Risk Matrix</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                Non-diagnostic surveillance risk stratification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {insights.riskMatrix.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2 hover:border-slate-750 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-xs text-white">
                      {item.riskArea}
                    </h4>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.rationale}
                  </p>
                  <div className="bg-slate-950/80 p-2.5 rounded border border-slate-850 text-[11px] text-emerald-300 flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-400">Countermeasure:</strong> {item.recommendedMitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Inquiries for Flight Surgeons */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Recommended Inquiries for Flight Surgeons & BME Team</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {insights.suggestedQuestionsForFlightSurgeons.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-200"
                >
                  <span className="font-mono text-cyan-400 font-bold shrink-0">Q{idx + 1}</span>
                  <span className="leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Data Disclosure (Grounding Guardrail) */}
          {insights.missingDataNotes.length > 0 && (
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Telemetry Integrity & Grounding Disclosure:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                {insights.missingDataNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}

    </div>
  );
};
