import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ReportsEngine } from '@/features/reports/components/ReportsEngine';

export const ReportsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Clinical Dossiers & Aerospace Reports"
        subtitle="Formal scientific publishing engine, vector PDF print rendering, and audit archives"
        badge={<StatusIndicator status="NOMINAL" label="PDF PIPELINE ACTIVE" />}
      />

      <ReportsEngine />
    </PageContainer>
  );
};
