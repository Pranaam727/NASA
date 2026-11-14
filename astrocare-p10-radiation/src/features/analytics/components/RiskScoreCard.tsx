import React from 'react';
import { CompositeRiskAssessment, RiskLevel } from '../types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ShieldAlert, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface RiskScoreCardProps {
  assessment: CompositeRiskAssessment;
  isSimulating?: boolean;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ assessment, isSimulating = false }) => {
  const { compositeScore, riskLevel, subsystems, activeSynergies, recommendation } = assessment;

  const levelConfig: Record<RiskLevel, { status: 'NOMINAL' | 'CAUTION' | 'CRITICAL'; icon: React.ComponentType<{ className?: string }>; color: string; ringColor: string }> = {
    NORMAL: {
      status: 'NOMINAL',
      icon: CheckCircle,
      color: '#5E9B62',
      ringColor: 'stroke-astro-status-healthy',
    },
    CAUTION: {
      status: 'CAUTION',
      icon: AlertTriangle,
      color: '#D49439',
      ringColor: 'stroke-astro-status-caution',
    },
    WARNING: {
      status: 'CAUTION',
      icon: AlertTriangle,
      color: '#D16C48',
      ringColor: 'stroke-[#D16C48]',
    },
    CRITICAL: {
      status: 'CRITICAL',
      icon: ShieldAlert,
      color: '#B9473E',
      ringColor: 'stroke-astro-status-critical',
    },
  };

  const currentLevel = levelConfig[riskLevel];
  const Icon = currentLevel.icon;

  return (
    <DossierCard
      title="DETERMINISTIC HEALTH RISK INDEX"
      subtitle="MULTI-SYSTEM PHYSIOLOGICAL & ENVIRONMENTAL COMPOSITE EVALUATION"
      badge={
        <div className="flex items-center space-x-2">
          {isSimulating && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-astro-status-healthy/10 text-astro-status-healthy border border-astro-status-healthy/30 animate-pulse">
              LIVE STREAM EVAL
            </span>
          )}
          <StatusIndicator status={currentLevel.status} label={riskLevel} pulse={riskLevel === 'CRITICAL'} size="sm" />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Score Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-astro-bg-subtle/50 border border-astro-border-hairline rounded-sm text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circular gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-astro-border-hairline"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`transition-all duration-500 ${currentLevel.ringColor}`}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * compositeScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-bold tracking-tight text-astro-text-primary">
                {compositeScore}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-astro-text-tertiary">
                / 100 RISK
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center space-x-1.5 font-mono text-xs font-semibold">
            <Icon className="w-4 h-4" />
            <span style={{ color: currentLevel.color }}>{riskLevel} PROTOCOL</span>
          </div>
        </div>

        {/* Middle & Right: Subsystem Progress Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {Object.values(subsystems).map((sub) => {
              const subLevel = levelConfig[sub.level];
              return (
                <div key={sub.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-astro-text-primary">{sub.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-astro-text-secondary">{sub.primaryParameter}</span>
                      <span
                        className="font-bold px-1.5 py-0.2 rounded-sm text-[10px]"
                        style={{ color: subLevel.color, backgroundColor: `${subLevel.color}15` }}
                      >
                        {sub.score}/100
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-astro-border-hairline/60 rounded-sm overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 rounded-sm"
                      style={{
                        width: `${Math.max(4, sub.score)}%`,
                        backgroundColor: subLevel.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Synergies Badge Banner if Present */}
          {activeSynergies.length > 0 && (
            <div className="p-2.5 rounded-sm bg-astro-status-critical/10 border border-astro-status-critical/30 flex items-start space-x-2 text-xs">
              <Flame className="w-4 h-4 text-astro-status-critical shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold text-astro-status-critical uppercase">
                  COMPOUND PHYSIOLOGICAL SYNERGISM DETECTED ({activeSynergies.length}):
                </span>
                <ul className="list-disc list-inside font-body text-[11px] text-astro-text-primary space-y-0.5">
                  {activeSynergies.map((syn, idx) => (
                    <li key={idx}>{syn}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actionable Clinical Recommendation */}
          <div className="p-2.5 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline font-mono text-xs">
            <span className="text-[10px] font-bold text-astro-text-tertiary uppercase block mb-0.5">
              CLINICAL RECOMMENDATION / CONTINGENCY DIRECTIVE:
            </span>
            <span className="text-astro-text-primary font-semibold leading-relaxed">
              {recommendation}
            </span>
          </div>
        </div>
      </div>
    </DossierCard>
  );
};
