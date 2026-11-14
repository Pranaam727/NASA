import React from 'react';
import { ParameterRiskAssessment, RiskLevel, VitalParameter } from '../types/analyticsTypes';
import { Heart, Wind, Activity, Thermometer, Radio } from 'lucide-react';

interface ParameterRiskCardsProps {
  parameterRisks: Record<VitalParameter, ParameterRiskAssessment> | undefined;
  className?: string;
}

export const ParameterRiskCards: React.FC<ParameterRiskCardsProps> = ({
  parameterRisks,
  className = '',
}) => {
  if (!parameterRisks) return null;

  const cards = Object.values(parameterRisks);

  const getBorderColor = (level: RiskLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return 'border-l-4 border-l-astro-status-critical border-astro-border-hairline';
      case 'WARNING':
        return 'border-l-4 border-l-[#C87D20] border-astro-border-hairline';
      case 'CAUTION':
        return 'border-l-4 border-l-astro-status-caution border-astro-border-hairline';
      default:
        return 'border-l-4 border-l-astro-status-healthy border-astro-border-hairline';
    }
  };

  const getBadgeStyle = (level: RiskLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-astro-status-critical/10 text-astro-status-critical border-astro-status-critical/30';
      case 'WARNING':
        return 'bg-[#C87D20]/10 text-[#C87D20] border-[#C87D20]/30';
      case 'CAUTION':
        return 'bg-astro-status-caution/10 text-astro-status-caution border-astro-status-caution/30';
      default:
        return 'bg-astro-status-healthy/10 text-astro-status-healthy border-astro-status-healthy/30';
    }
  };

  const getIcon = (param: VitalParameter) => {
    switch (param) {
      case 'HEART_RATE':
        return <Heart className="w-3.5 h-3.5 text-astro-text-secondary" />;
      case 'SPO2':
      case 'RESPIRATORY_RATE':
        return <Wind className="w-3.5 h-3.5 text-astro-text-secondary" />;
      case 'BLOOD_PRESSURE_SYS':
      case 'BLOOD_PRESSURE_DIA':
        return <Activity className="w-3.5 h-3.5 text-astro-text-secondary" />;
      case 'CORE_TEMP':
        return <Thermometer className="w-3.5 h-3.5 text-astro-text-secondary" />;
      case 'RADIATION_FLUX':
        return <Radio className="w-3.5 h-3.5 text-astro-text-secondary" />;
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
      {cards.map((card) => (
        <div
          key={card.parameter}
          className={`bg-astro-bg-surface border rounded-sm p-3.5 flex flex-col justify-between ${getBorderColor(
            card.riskLevel
          )}`}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              {getIcon(card.parameter)}
              <span className="text-[11px] font-sans font-medium text-astro-text-secondary truncate">
                {card.label}
              </span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded-sm border text-[9px] font-mono uppercase font-semibold ${getBadgeStyle(
                card.riskLevel
              )}`}
            >
              {card.riskLevel}
            </span>
          </div>

          {/* Current Value */}
          <div className="my-2.5 flex items-baseline justify-between">
            <div>
              <span className="font-mono text-2xl font-bold text-astro-text-primary">
                {card.currentValue}
              </span>
              <span className="ml-1 text-xs font-mono text-astro-text-tertiary">{card.unit}</span>
            </div>
            <span className="text-[10px] font-mono text-astro-text-secondary">
              Base: {card.baselineValue} {card.unit}
            </span>
          </div>

          {/* Risk Score Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-astro-text-tertiary">
              <span>Strain Score</span>
              <span>{card.riskScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-astro-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  card.riskScore >= 75
                    ? 'bg-astro-status-critical'
                    : card.riskScore >= 50
                    ? 'bg-[#C87D20]'
                    : card.riskScore >= 25
                    ? 'bg-astro-status-caution'
                    : 'bg-astro-status-healthy'
                }`}
                style={{ width: `${Math.min(100, card.riskScore)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
