import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { EmergencyMedicalAssistant } from '@/features/emergency/components/EmergencyMedicalAssistant';

export const EmergencyPage: React.FC = () => {
  return (
    <PageContainer maxWidth="wide">
      <PageHeader
        title="Space Medical Emergency Assistant"
        subtitle="Version-controlled clinical protocol execution, step checklists, and red alert dispatch"
        badge={<StatusIndicator status="NOMINAL" label="EMERGENCY RACK ONLINE" />}
      />

      <EmergencyMedicalAssistant />
    </PageContainer>
  );
};
