import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { NASAResearchExplorer } from '@/features/research/components/NASAResearchExplorer';

export const ResearchPage: React.FC = () => {
  return (
    <PageContainer maxWidth="wide">
      <PageHeader
        title="NASA Research Evidence Explorer"
        subtitle="Authoritative peer-reviewed spaceflight publications, NASA OSDR datasets, and HRP evidence books"
        badge={<StatusIndicator status="NOMINAL" label="OPEN SCIENCE SYNC" />}
      />

      <NASAResearchExplorer />
    </PageContainer>
  );
};
