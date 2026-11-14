import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';

export const SpaceHealthPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Deep-Space Health Analytics"
        subtitle="Long-term organ-system degradation modeling (Cardio, Bone, Muscle, Immune)"
        badge={<StatusIndicator status="NOMINAL" label="ANALYTICS ENGINE READY" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DossierCard title="BONE MINERAL DENSITY (DXA)" subtitle="LUMBAR SPINE & FEMORAL NECK LOSS">
          <p className="font-body text-xs text-astro-text-secondary">
            Long-term microgravity osteoclastic activity tracking. Module 4 analytical models will render
            comparative baseline regression curves.
          </p>
        </DossierCard>

        <DossierCard title="MUSCLE HEALTH & RESISTANCE LOGS" subtitle="ARED & T2 TREADMILL LOAD ANALYSIS">
          <p className="font-body text-xs text-astro-text-secondary">
            Calculates force dissipation and strength deconditioning rates over mission duration.
          </p>
        </DossierCard>

        <DossierCard title="IMMUNE DYSREGULATION PROFILE" subtitle="CYTOKINES & WHITE BLOOD CELL METRICS">
          <p className="font-body text-xs text-astro-text-secondary">
            In-flight hematology and leukocyte differential tracking.
          </p>
        </DossierCard>

        <DossierCard title="CARDIOVASCULAR REMODELING" subtitle="ORTHOSTATIC INTOLERANCE RISK">
          <p className="font-body text-xs text-astro-text-secondary">
            Stroke volume and arterial stiffness modeling under fluid-shift conditions.
          </p>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
