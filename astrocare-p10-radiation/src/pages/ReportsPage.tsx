import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';

export const ReportsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Clinical Dossiers & Reports"
        subtitle="Formal scientific publishing engine and vector PDF mission health reports"
        badge={<StatusIndicator status="NOMINAL" label="PDF GENERATOR READY" />}
      />

      <DossierCard
        title="OFFICIAL MISSION HEALTH DOSSIER ARCHIVE"
        subtitle="@REACT-PDF/RENDERER PIPELINE (MODULE 8)"
      >
        <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
          Comprehensive vector PDF reporting engine for flight surgeons, NASA bioastronautics
          review, and crew personal records. Full template rendering activates in Module 8.
        </p>
      </DossierCard>
    </PageContainer>
  );
};
