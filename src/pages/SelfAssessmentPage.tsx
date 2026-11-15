import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { DailySelfAssessment } from '@/features/selfAssessment/components/DailySelfAssessment';

export const SelfAssessmentPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Daily Astronaut Self-Assessment"
        subtitle="Subjective wellness monitoring, fatigue & symptom logging, and automatic clinical escalation"
        badge={<StatusIndicator status="NOMINAL" label="CHECK-IN OPEN" />}
      />

      <DailySelfAssessment />
    </PageContainer>
  );
};
