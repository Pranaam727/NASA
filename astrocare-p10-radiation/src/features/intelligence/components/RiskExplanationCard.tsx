import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { Stethoscope } from 'lucide-react';

interface RiskExplanationCardProps {
  explanationMarkdown: string;
  callsign: string;
}

export const RiskExplanationCard: React.FC<RiskExplanationCardProps> = ({
  explanationMarkdown,
  callsign,
}) => {
  return (
    <DossierCard
      title="AEROSPACE PHYSIOLOGY & MECHANISTIC ANALYSIS"
      subtitle={`DEEP-SPACE CLINICAL PATHOLOGY // SUBJECT: ${callsign}`}
      badge={
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-astro-text-secondary">
          <Stethoscope className="w-3.5 h-3.5 text-astro-text-primary" />
          <span>PHYSIOLOGICAL GROUNDING</span>
        </div>
      }
    >
      <div className="space-y-4 font-body text-xs text-astro-text-primary leading-relaxed">
        <div className="prose prose-xs max-w-none text-astro-text-secondary font-body whitespace-pre-line leading-normal">
          {explanationMarkdown}
        </div>
      </div>
    </DossierCard>
  );
};
