import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ChartContainer } from '@/components/common/Visualization';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMuscleAnalytics } from '@/features/health/muscle/hooks/useMuscleAnalytics';
import { SEED_ASTRONAUTS } from '@/data/seedData';

export const MuscleHealthPage: React.FC = () => {
  const astronautId = SEED_ASTRONAUTS[0].id;
  const profile = useMuscleAnalytics(astronautId);

  const chartData = profile?.baseline && profile?.latest ? [
    { label: 'Baseline', grip: profile.baseline.gripStrengthKg },
    { label: 'Latest', grip: profile.latest.gripStrengthKg },
  ] : [];

  const isDegraded = profile?.percentageChangeGrip !== undefined && profile.percentageChangeGrip < -5;

  return (
    <PageContainer maxWidth="wide">
      <PageHeader
        title="Muscle Health"
        subtitle="Grip strength and resistance training metrics"
        badge={<StatusIndicator status={isDegraded ? 'CAUTION' : 'NOMINAL'} label="Strength" />}
      />
      <DossierCard title="Grip Strength Trend" subtitle="Isometric grip over time">
        <ChartContainer title="Grip Strength (kg)" height={250}>
          <LineChart width={800} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[30, 80]} />
            <Tooltip />
            <Line type="monotone" dataKey="grip" stroke="#F59E0B" dot={false} />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 text-sm text-astro-text-secondary">
          {profile && <p>Grip change: {profile.percentageChangeGrip?.toFixed(1)}%</p>}
        </div>
      </DossierCard>
    </PageContainer>
  );
};
