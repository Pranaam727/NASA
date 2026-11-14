import React from 'react';
import { AIHealthSummary } from '../types/aiTypes';
import { DossierCard } from '@/components/common/DossierCard';
import { Activity, AlertTriangle, AlertOctagon, CheckCircle2, ShieldCheck, Zap, Info } from 'lucide-react';

interface AstronautHealthSummaryCardProps {
  summary: AIHealthSummary | null;
  isLoading?: boolean;
  className?: string;
}

export const AstronautHealthSummaryCard: React.FC<AstronautHealthSummaryCardProps> = ({
  summary,
  isLoading = false,
  className = '',
}) => {
  if (isLoading && !summary) {
    return (
      <DossierCard
        title="INTELLIGENT HEALTH SUMMARY"
        subtitle="SYNTHESIZING TELEMETRY STREAMS..."
        className={className}
      >
        <div className="py-12 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-astro-sage border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-astro-text-secondary">
            Evaluating physiological parameters and historical baselines...
          </p>
        </div>
      </DossierCard>
    );
  }

  if (!summary) {
    return (
      <DossierCard
        title="INTELLIGENT HEALTH SUMMARY"
        subtitle="AWAITING TELEMETRY STREAM"
        className={className}
      >
        <div className="py-8 text-center font-mono text-xs text-astro-text-secondary">
          No telemetry records available to synthesize.
        </div>
      </DossierCard>
    );
  }

  const isFallback = summary.provenance === 'DETERMINISTIC_FALLBACK';

  return (
    <DossierCard
      title="INTELLIGENT ASTRONAUT HEALTH SUMMARY"
      subtitle={`${summary.astronautName.toUpperCase()} (${summary.astronautId}) // ${summary.timeRange} WINDOW`}
      className={className}
      badge={
        <span
          className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase ${
            isFallback
              ? 'bg-[#B89A58]/15 text-[#7A6643] border-[#B89A58]/40'
              : 'bg-astro-status-healthy/15 text-astro-status-healthy border-astro-status-healthy/40'
          }`}
        >
          {isFallback ? 'DETERMINISTIC FALLBACK' : 'GEMINI 1.5 SYNTHESIS'}
        </span>
      }
    >
      <div className="space-y-4">
        {/* Executive Summary */}
        <div className="p-3.5 bg-astro-bg-primary border border-astro-border-hairline rounded-sm space-y-1.5">
          <div className="flex items-center space-x-1.5 font-mono text-[10px] font-bold text-astro-text-primary uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-astro-sage" />
            <span>Executive Physiological Assessment</span>
          </div>
          <p className="font-body text-xs text-astro-text-primary leading-relaxed">
            {summary.executiveSummary}
          </p>
        </div>

        {/* Baseline Deviations Overview */}
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] font-bold text-astro-text-secondary uppercase">
            Baseline Deviation Profile:
          </div>
          <div className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm font-body text-xs text-astro-text-secondary leading-relaxed">
            {summary.baselineDeviationOverview}
          </div>
        </div>

        {/* Inter-Parameter Relationships (Synergies) */}
        {summary.interParameterRelationships && summary.interParameterRelationships.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] font-bold text-astro-text-secondary uppercase flex items-center space-x-1">
              <Zap className="w-3 h-3 text-astro-status-warning" />
              <span>Inter-System Couplings & Syndromes:</span>
            </div>
            <div className="space-y-1">
              {summary.interParameterRelationships.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-astro-status-warning/5 border border-astro-status-warning/20 rounded-sm font-mono text-[11px] text-astro-text-secondary flex items-start space-x-2"
                >
                  <span className="text-astro-status-warning font-bold">⚡</span>
                  <span>{rel}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Anomalies */}
        {summary.keyAnomalies && summary.keyAnomalies.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] font-bold text-astro-status-critical uppercase flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-astro-status-critical" />
              <span>Notable Anomalies Identified:</span>
            </div>
            <div className="space-y-1">
              {summary.keyAnomalies.map((anomaly, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-astro-status-critical/5 border border-astro-status-critical/20 rounded-sm font-mono text-[10px] text-astro-status-critical flex items-start space-x-2"
                >
                  <AlertOctagon className="w-3 h-3 text-astro-status-critical shrink-0 mt-0.5" />
                  <span>{anomaly}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observations Requiring Human Review */}
        {summary.humanReviewRequired && summary.humanReviewItems.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] font-bold text-astro-status-warning uppercase flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-astro-status-warning" />
              <span>Observations Requiring Flight Surgeon Review:</span>
            </div>
            <ul className="space-y-1 list-disc list-inside font-body text-xs text-astro-text-secondary p-2.5 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm">
              {summary.humanReviewItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Data Warnings */}
        {summary.missingDataWarnings && summary.missingDataWarnings.length > 0 && (
          <div className="p-2 bg-astro-status-caution/10 border border-astro-status-caution/30 rounded-sm font-mono text-[10px] text-astro-status-caution flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Missing Data / Telemetry Dropout Flags: {summary.missingDataWarnings.join(', ')}</span>
          </div>
        )}

        {/* Informational Recommendations */}
        {summary.informationalRecommendations && summary.informationalRecommendations.length > 0 && (
          <div className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-astro-text-primary uppercase block">
              Operational Recommendations (Informational):
            </span>
            <div className="space-y-1 font-body text-xs text-astro-text-secondary">
              {summary.informationalRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3 h-3 text-astro-sage shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer timestamp & model version */}
        <div className="flex items-center justify-between text-[10px] font-mono text-astro-text-secondary pt-2 border-t border-astro-border-hairline/60">
          <span>MODEL: {summary.modelVersion}</span>
          <span>GENERATED: {new Date(summary.generatedAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </DossierCard>
  );
};
