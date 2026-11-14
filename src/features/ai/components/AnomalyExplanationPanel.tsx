import React from 'react';
import { AIAnomalyExplanation } from '../types/aiTypes';
import { HealthAlert } from '@/types/database.types';
import { DossierCard } from '@/components/common/DossierCard';
import { ArrowRight, ShieldCheck, Microscope } from 'lucide-react';

interface AnomalyExplanationPanelProps {
  alerts: HealthAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alertId: string) => void;
  explanation: AIAnomalyExplanation | null;
  className?: string;
}

export const AnomalyExplanationPanel: React.FC<AnomalyExplanationPanelProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  explanation,
  className = '',
}) => {
  return (
    <DossierCard
      title="DETERMINISTIC ANOMALY EXPLANATION"
      subtitle="AI PHYSIOLOGICAL MECHANISM SYNTHESIS // P06 SEVERITY PRESERVED"
      className={className}
      badge={
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm bg-astro-sage/10 text-astro-sage border border-astro-sage/30">
          NON-MUTATING EXPLANATION
        </span>
      }
    >
      <div className="space-y-4">
        {/* Anomaly selector strip if multiple alerts exist */}
        {alerts.length > 0 ? (
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-astro-text-secondary uppercase">
              Select P06 Anomaly to Explain ({alerts.length} Detected):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {alerts.map((alt) => {
                const isSelected = alt.id === selectedAlertId;
                const isCritical = alt.severity === 'CRITICAL';
                return (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlert(alt.id)}
                    className={`font-mono text-[10px] px-2.5 py-1 rounded-sm border flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? isCritical
                          ? 'bg-astro-status-critical/15 text-astro-status-critical border-astro-status-critical font-bold'
                          : 'bg-astro-sage/20 text-astro-text-primary border-astro-sage font-bold'
                        : 'border-astro-border-hairline text-astro-text-secondary hover:border-astro-sage/40 hover:bg-astro-bg-subtle'
                    }`}
                  >
                    <span>{alt.rule_code.replace(/RULE_/g, '')}</span>
                    <span className="text-[8px] opacity-80">({alt.severity})</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm text-center font-mono text-xs text-astro-text-secondary">
            No active anomalies detected by P06 engine.
          </div>
        )}

        {/* Detailed Explanation View */}
        {explanation ? (
          <div className="space-y-3.5 pt-2 border-t border-astro-border-hairline/60">
            {/* Metric & Severity Header */}
            <div className="p-3 bg-astro-bg-primary border border-astro-border-hairline rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-astro-text-primary">
                  {explanation.metricName}
                </span>
                <span
                  className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase font-bold ${
                    explanation.p06Severity === 'CRITICAL'
                      ? 'bg-astro-status-critical/15 text-astro-status-critical border-astro-status-critical/40'
                      : explanation.p06Severity === 'HIGH'
                      ? 'bg-astro-status-warning/15 text-astro-status-warning border-astro-status-warning/40'
                      : 'bg-astro-status-caution/15 text-astro-status-caution border-astro-status-caution/40'
                  }`}
                >
                  P06 SEVERITY: {explanation.p06Severity}
                </span>
              </div>

              {/* Observation vs Baseline metrics */}
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pt-1 border-t border-astro-border-hairline/50">
                <div>
                  <span className="text-astro-text-secondary block">OBSERVED VALUE</span>
                  <span className="font-bold text-astro-status-critical text-xs">
                    {explanation.observedValue}
                  </span>
                </div>
                <div>
                  <span className="text-astro-text-secondary block">INDIVIDUAL BASELINE</span>
                  <span className="text-astro-text-primary text-xs">{explanation.baselineValue}</span>
                </div>
                <div>
                  <span className="text-astro-text-secondary block">DEVIATION</span>
                  <span className="font-bold text-astro-text-primary text-xs">
                    {explanation.deviation}
                  </span>
                </div>
              </div>
            </div>

            {/* Physiological Mechanism */}
            <div className="space-y-1.5">
              <div className="font-mono text-[10px] font-bold text-astro-text-primary uppercase flex items-center space-x-1">
                <Microscope className="w-3.5 h-3.5 text-astro-sage" />
                <span>Physiological Mechanism:</span>
              </div>
              <p className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm font-body text-xs text-astro-text-secondary leading-relaxed">
                {explanation.physiologicalMechanism}
              </p>
            </div>

            {/* Clinical Significance */}
            <div className="space-y-1.5">
              <div className="font-mono text-[10px] font-bold text-astro-text-primary uppercase flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-astro-status-warning" />
                <span>Operational Clinical Significance:</span>
              </div>
              <p className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm font-body text-xs text-astro-text-secondary leading-relaxed">
                {explanation.clinicalSignificance}
              </p>
            </div>

            {/* Supporting Evidence Citations */}
            {explanation.supportingEvidence.length > 0 && (
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] font-bold text-astro-text-secondary uppercase">
                  Supporting Telemetry Evidence:
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  {explanation.supportingEvidence.map((ev, i) => (
                    <div
                      key={i}
                      className="p-2 bg-astro-bg-primary border border-astro-border-hairline rounded-sm flex items-center justify-between"
                    >
                      <span className="font-bold text-astro-text-primary">{ev.parameter}</span>
                      <span className="text-astro-text-secondary">
                        Obs: <span className="text-astro-status-critical">{ev.observedValue}</span> | Base: {ev.baselineValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Follow-up Observation */}
            <div className="p-3 bg-astro-sage/5 border border-astro-sage/20 rounded-sm space-y-1">
              <div className="font-mono text-[10px] font-bold text-astro-sage uppercase flex items-center space-x-1">
                <ArrowRight className="w-3 h-3 text-astro-sage" />
                <span>Suggested Follow-up Observation:</span>
              </div>
              <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
                {explanation.suggestedFollowUp}
              </p>
            </div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="py-6 text-center font-mono text-xs text-astro-text-secondary">
            Select an anomaly above to view detailed AI mechanism explanation.
          </div>
        ) : null}
      </div>
    </DossierCard>
  );
};
