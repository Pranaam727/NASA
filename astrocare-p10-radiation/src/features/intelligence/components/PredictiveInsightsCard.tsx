import React from 'react';
import { PredictiveInsight } from '../types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { TrendingDown, TrendingUp, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

interface PredictiveInsightsCardProps {
  insights: PredictiveInsight[];
  callsign: string;
}

export const PredictiveInsightsCard: React.FC<PredictiveInsightsCardProps> = ({
  insights,
  callsign,
}) => {
  const trendIcon = (trend: PredictiveInsight['trendDirection']) => {
    switch (trend) {
      case 'WORSENING':
        return <TrendingDown className="w-4 h-4 text-astro-status-critical" />;
      case 'IMPROVING':
      case 'STABILIZING':
        return <TrendingUp className="w-4 h-4 text-astro-status-healthy" />;
      case 'VOLATILE':
        return <AlertTriangle className="w-4 h-4 text-astro-status-caution" />;
    }
  };

  const statusBadge = (trend: PredictiveInsight['trendDirection']) => {
    switch (trend) {
      case 'WORSENING':
        return 'CRITICAL' as const;
      case 'VOLATILE':
        return 'CAUTION' as const;
      case 'IMPROVING':
      case 'STABILIZING':
      default:
        return 'NOMINAL' as const;
    }
  };

  return (
    <DossierCard
      title="PREDICTIVE DETERIORATION PROJECTIONS"
      subtitle={`EARLY WARNING TRAJECTORY MODELS // SUBJECT: ${callsign}`}
      badge={
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm bg-[#4878D1]/10 text-[#4878D1] border border-[#4878D1]/30">
          PROBABILISTIC FORECAST
        </span>
      }
    >
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-3.5 bg-white border border-astro-border-hairline rounded-sm space-y-2 hover:border-astro-border-strong transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                {trendIcon(insight.trendDirection)}
                <h4 className="font-display text-xs font-bold text-astro-text-primary">
                  {insight.headline}
                </h4>
                <StatusIndicator status={statusBadge(insight.trendDirection)} label={insight.trendDirection} size="sm" />
              </div>

              <div className="flex items-center space-x-2 font-mono text-[10px] text-astro-text-secondary">
                <Clock className="w-3 h-3 text-astro-text-tertiary" />
                <span>TIMEFRAME: {insight.timeframe}</span>
                <span>·</span>
                <span className="font-bold text-astro-text-primary">{insight.probability}% PROBABLE</span>
              </div>
            </div>

            <p className="font-body text-xs text-astro-text-secondary leading-snug">
              {insight.rationale}
            </p>

            <div className="pt-2 border-t border-astro-border-hairline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-astro-text-tertiary uppercase">PROJECTED VALUE: </span>
                <span className="font-bold text-astro-status-critical">{insight.projectedValue}</span>
              </div>

              <div className="text-[10px] text-astro-text-secondary flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-astro-status-healthy shrink-0" />
                <span>PREEMPTIVE DIRECTIVE: {insight.recommendedPreemptiveAction}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Clear Invariant Distinction Notice */}
        <div className="pt-1 text-[9px] font-mono text-astro-text-tertiary text-center">
          * PROJECTIONS ARE STATISTICAL MODEL ESTIMATES AND MUST BE DISTINGUISHED FROM CONFIRMED MEASURED TELEMETRY *
        </div>
      </div>
    </DossierCard>
  );
};
