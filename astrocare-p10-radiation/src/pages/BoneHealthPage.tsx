import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ChartContainer } from '@/components/common/Visualization';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useBoneAnalytics } from '@/features/health/bone/hooks/useBoneAnalytics';
import { SEED_ASTRONAUTS } from '@/data/seedData';

export const BoneHealthPage: React.FC = () => {
  const astronautId = SEED_ASTRONAUTS[0].id; // For demo, first astronaut
  const profile = useBoneAnalytics(astronautId);

  const chartData = profile?.baseline && profile?.latest ? [
    { label: 'Baseline', femoral: profile.baseline.femoralNeckBmd, lumbar: profile.baseline.lumbarSpineBmd },
    { label: 'Latest', femoral: profile.latest.femoralNeckBmd, lumbar: profile.latest.lumbarSpineBmd },
  ] : [];

  const isDegraded = (profile?.percentageChangeFemoralNeck !== undefined && profile.percentageChangeFemoralNeck < -5) ||
    (profile?.percentageChangeLumbarSpine !== undefined && profile.percentageChangeLumbarSpine < -5);

  return (
    <PageContainer maxWidth="wide">
      <PageHeader
        title="Bone Health"
        subtitle="DXA based bone mineral density monitoring"
        badge={<StatusIndicator status={isDegraded ? 'CAUTION' : 'NOMINAL'} label="BMD" />}
      />
      <DossierCard title="BMD Trend" subtitle="Femoral Neck & Lumbar Spine">
        <ChartContainer title="Bone Mineral Density (g/cm²)" height={250}>
          <LineChart width={800} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[0.8, 1.2]} />
            <Tooltip />
            <Line type="monotone" dataKey="femoral" stroke="#3B82F6" name="Femoral Neck" dot={false} />
            <Line type="monotone" dataKey="lumbar" stroke="#10B981" name="Lumbar Spine" dot={false} />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 text-sm text-astro-text-secondary">
          {profile && (
            <>
              <p>Femoral Neck change: {profile.percentageChangeFemoralNeck?.toFixed(1)}%</p>
              <p>Lumbar Spine change: {profile.percentageChangeLumbarSpine?.toFixed(1)}%</p>
            </>
          )}
        </div>
      </DossierCard>
    </PageContainer>
  );
};
