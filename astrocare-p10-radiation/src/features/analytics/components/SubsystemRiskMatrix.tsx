import React from 'react';
import { SubsystemRisk } from '../types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { Heart, Wind, Radio, Thermometer } from 'lucide-react';

interface SubsystemRiskMatrixProps {
  subsystems: Record<string, SubsystemRisk>;
}

export const SubsystemRiskMatrix: React.FC<SubsystemRiskMatrixProps> = ({ subsystems }) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    CARDIOVASCULAR: Heart,
    RESPIRATORY: Wind,
    RADIATION: Radio,
    METABOLIC_THERMAL: Thermometer,
  };

  const statusMap = {
    NORMAL: 'NOMINAL' as const,
    CAUTION: 'CAUTION' as const,
    WARNING: 'CAUTION' as const,
    CRITICAL: 'CRITICAL' as const,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Object.values(subsystems).map((sub) => {
        const Icon = icons[sub.category] || Heart;
        const statusBadge = statusMap[sub.level];

        return (
          <DossierCard
            key={sub.category}
            title={sub.name.toUpperCase()}
            subtitle={`PRIMARY: ${sub.primaryParameter}`}
            badge={<StatusIndicator status={statusBadge} label={sub.level} size="sm" />}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline flex items-center justify-center">
                    <Icon className="w-4 h-4 text-astro-text-primary" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-astro-text-tertiary uppercase block">
                      SUBSYSTEM SCORE
                    </span>
                    <span className="font-mono text-base font-bold text-astro-text-primary">
                      {sub.score} <span className="text-[10px] text-astro-text-tertiary">/ 100</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[9px] uppercase text-astro-text-tertiary block">
                    STATUS
                  </span>
                  <span className="font-mono text-xs font-bold text-astro-text-primary">
                    {sub.level}
                  </span>
                </div>
              </div>

              {/* Contributing factors */}
              <div className="pt-2 border-t border-astro-border-hairline/60">
                <span className="font-mono text-[9px] font-semibold text-astro-text-tertiary uppercase block mb-1">
                  OBSERVED PARAMETERS:
                </span>
                <ul className="space-y-1">
                  {sub.contributingFactors.map((factor, idx) => (
                    <li
                      key={idx}
                      className="font-mono text-[10px] text-astro-text-secondary leading-tight flex items-start space-x-1"
                    >
                      <span className="text-astro-text-tertiary">›</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DossierCard>
        );
      })}
    </div>
  );
};
