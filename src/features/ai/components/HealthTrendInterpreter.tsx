import React from 'react';
import { AITrendInterpretation, TimeRangeOption } from '../types/aiTypes';
import { DossierCard } from '@/components/common/DossierCard';
import { TrendingUp, TrendingDown, Minus, Clock, ShieldCheck } from 'lucide-react';

interface HealthTrendInterpreterProps {
  trends: AITrendInterpretation | null;
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
  className?: string;
}

export const HealthTrendInterpreter: React.FC<HealthTrendInterpreterProps> = ({
  trends,
  timeRange,
  onTimeRangeChange,
  className = '',
}) => {
  const timeRanges: TimeRangeOption[] = ['1H', '6H', '24H', '7D'];

  return (
    <DossierCard
      title="HEALTH TREND INTERPRETATION"
      subtitle={`MULTI-AXIS PHYSIOLOGICAL DRIFT & TRAJECTORY // ${timeRange} WINDOW`}
      className={className}
      badge={
        <div className="flex items-center bg-astro-bg-primary border border-astro-border-hairline rounded-sm p-0.5 font-mono text-[10px]">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`px-2 py-0.5 rounded-sm transition-all ${
                timeRange === r
                  ? 'bg-astro-sage/20 text-astro-text-primary font-bold'
                  : 'text-astro-text-secondary hover:text-astro-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Overall Trend Summary */}
        <div className="p-3 bg-astro-bg-primary border border-astro-border-hairline rounded-sm space-y-1">
          <div className="flex items-center space-x-1.5 font-mono text-[10px] font-bold text-astro-text-primary uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-astro-sage" />
            <span>Temporal Synthesis ({timeRange} Window)</span>
          </div>
          <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
            {trends?.overallTrendSummary || 'Awaiting telemetry trend data...'}
          </p>
        </div>

        {/* Parameter Observations Grid */}
        {trends && trends.parameterObservations.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-astro-text-secondary uppercase">
              Parameter Trajectories & Baseline Drift:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {trends.parameterObservations.map((obs) => {
                const isCritical = obs.significance === 'CRITICAL';
                const isElevated = obs.significance === 'ELEVATED';

                return (
                  <div
                    key={obs.parameter}
                    className={`p-2.5 bg-astro-bg-subtle border rounded-sm space-y-1.5 transition-all ${
                      isCritical
                        ? 'border-astro-status-critical/40 bg-astro-status-critical/5'
                        : isElevated
                        ? 'border-astro-status-warning/40'
                        : 'border-astro-border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-astro-text-primary">
                        {obs.label}
                      </span>
                      <div className="flex items-center space-x-1 font-mono text-[10px]">
                        {obs.direction === 'RISING' && (
                          <span className="text-astro-status-warning flex items-center">
                            <TrendingUp className="w-3 h-3 mr-0.5" />
                            RISING
                          </span>
                        )}
                        {obs.direction === 'FALLING' && (
                          <span className="text-astro-status-healthy flex items-center">
                            <TrendingDown className="w-3 h-3 mr-0.5" />
                            FALLING
                          </span>
                        )}
                        {obs.direction === 'STABLE' && (
                          <span className="text-astro-text-secondary flex items-center">
                            <Minus className="w-3 h-3 mr-0.5" />
                            STABLE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-mono text-[10px] text-astro-text-secondary flex justify-between">
                      <span>BASELINE DELTA:</span>
                      <span className="font-bold text-astro-text-primary">{obs.baselineDeviationSummary}</span>
                    </div>

                    <p className="font-body text-[11px] text-astro-text-secondary leading-relaxed pt-1 border-t border-astro-border-hairline/40">
                      {obs.observation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Microgravity Adaptation Notes */}
        {trends?.physiologicalAdaptationNotes && (
          <div className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm space-y-1 font-body text-xs text-astro-text-secondary">
            <span className="font-mono text-[10px] font-bold text-astro-text-primary uppercase block flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-astro-sage" />
              <span>Microgravity Baseline Adaptation Grounding:</span>
            </span>
            <p className="text-[11px] leading-relaxed">{trends.physiologicalAdaptationNotes}</p>
          </div>
        )}
      </div>
    </DossierCard>
  );
};
