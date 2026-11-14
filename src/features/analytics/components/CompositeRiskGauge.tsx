import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity } from 'lucide-react';
import { CompositeHealthAssessment, RiskLevel } from '../types/analyticsTypes';

interface CompositeRiskGaugeProps {
  assessment: CompositeHealthAssessment | null;
  className?: string;
}

export const CompositeRiskGauge: React.FC<CompositeRiskGaugeProps> = ({
  assessment,
  className = '',
}) => {
  const score = assessment?.compositeScore ?? 0;
  const riskLevel: RiskLevel = assessment?.overallRiskLevel ?? 'NORMAL';
  const primaryFactor = assessment?.primaryRiskFactor?.replace('_', ' ') ?? 'ALL NOMINAL';
  const synergies = assessment?.synergyMultipliersApplied ?? [];

  // Color mapping based on design system
  const colorConfig: Record<
    RiskLevel,
    { text: string; bg: string; border: string; bar: string; icon: typeof ShieldCheck }
  > = {
    NORMAL: {
      text: 'text-astro-status-healthy',
      bg: 'bg-astro-status-healthy/10',
      border: 'border-astro-status-healthy/30',
      bar: '#738174', // Sage green
      icon: ShieldCheck,
    },
    CAUTION: {
      text: 'text-astro-status-caution',
      bg: 'bg-astro-status-caution/10',
      border: 'border-astro-status-caution/30',
      bar: '#D16C48', // Terracotta
      icon: AlertTriangle,
    },
    WARNING: {
      text: 'text-[#C87D20]',
      bg: 'bg-[#C87D20]/10',
      border: 'border-[#C87D20]/30',
      bar: '#C87D20', // Amber
      icon: AlertTriangle,
    },
    CRITICAL: {
      text: 'text-astro-status-critical',
      bg: 'bg-astro-status-critical/10',
      border: 'border-astro-status-critical/30',
      bar: '#B9473E', // Critical red
      icon: AlertOctagon,
    },
  };

  const currentConfig = colorConfig[riskLevel];
  const IconComponent = currentConfig.icon;

  return (
    <div
      className={`bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-5 flex flex-col justify-between ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-astro-border-hairline pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-astro-text-secondary" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-astro-text-secondary">
            COMPOSITE PHYSIOLOGICAL STRAIN INDEX (PSI)
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-sm border text-[10px] font-mono uppercase tracking-wider font-semibold ${currentConfig.bg} ${currentConfig.text} ${currentConfig.border}`}
        >
          {riskLevel}
        </span>
      </div>

      {/* Main Gauge Graphic */}
      <div className="relative flex flex-col items-center justify-center my-4">
        <svg className="w-48 h-28 overflow-visible" viewBox="0 0 200 120">
          {/* Background Track Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="#D8D4C9"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Active Colored Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke={currentConfig.bar}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="235"
            strokeDashoffset={235 - (235 * Math.min(100, score)) / 100}
            className="transition-all duration-500 ease-out"
          />
          {/* Score Display In Center */}
          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="font-mono text-4xl font-bold fill-astro-text-primary"
          >
            {score}
          </text>
          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="font-mono text-[10px] tracking-widest uppercase fill-astro-text-tertiary"
          >
            SCORE / 100
          </text>
        </svg>

        <div className="flex items-center space-x-1.5 mt-2">
          <IconComponent className={`w-3.5 h-3.5 ${currentConfig.text}`} />
          <span className="text-xs font-mono text-astro-text-primary uppercase tracking-tight">
            PRIMARY DRIVER: <span className="font-semibold">{primaryFactor}</span>
          </span>
        </div>
      </div>

      {/* Synergies & Recommendations */}
      <div className="space-y-2 border-t border-astro-border-hairline pt-3 text-xs">
        {synergies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {synergies.map((syn) => (
              <span
                key={syn}
                className="px-1.5 py-0.5 rounded-sm bg-astro-status-critical/10 border border-astro-status-critical/20 text-astro-status-critical font-mono text-[9px] uppercase"
              >
                + {syn.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        <p className="text-[11px] text-astro-text-secondary leading-relaxed font-sans">
          {assessment?.recommendedAction ||
            'Monitoring physiological streams against nominal mission baseline parameters.'}
        </p>
      </div>
    </div>
  );
};
