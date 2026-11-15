import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { PersonalHealthTwin } from '@/features/healthTwin/components/PersonalHealthTwin';

export const HealthTwinPage: React.FC = () => {
  return (
    <PageContainer maxWidth="wide">
      <PageHeader
        title="Astronaut Personal Health Twin"
        subtitle="Individual 30-day baseline envelope, deviation analytics, and 5-point clinical reasoning"
        badge={<StatusIndicator status="NOMINAL" label="BASELINE SYNCHRONIZED" />}
      />

      <PersonalHealthTwin />
    </PageContainer>
  );
};
