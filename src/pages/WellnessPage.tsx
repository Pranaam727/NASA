import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';

export const WellnessPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Psychological Wellness & Journal"
        subtitle="Circadian rhythm monitoring, fatigue indices, and private encrypted journal"
        badge={<StatusIndicator status="NOMINAL" label="PRIVACY SHIELD ACTIVE" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DossierCard title="CIRCADIAN SLEEP ARCHITECTURE" subtitle="ACTIGRAPHY & SLEEP LOGS">
          <p className="font-body text-xs text-astro-text-secondary">
            Module 5 sleep monitoring will plot REM, deep sleep ratios, and micro-awakenings.
          </p>
        </DossierCard>

        <DossierCard title="PSYCHOLOGICAL RESILIENCE & JOURNAL" subtitle="END-TO-END RLS PRIVACY PROTECTED">
          <p className="font-body text-xs text-astro-text-secondary">
            Astronaut private check-in portal with optional consent sharing for flight surgeons.
          </p>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
