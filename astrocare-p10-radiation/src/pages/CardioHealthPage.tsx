import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { MetricDisplay, StatusIndicator } from '@/components/common/DataDisplay';
import { Heart, Activity, Wind } from 'lucide-react';
import { useCardioAnalytics } from '@/features/health/cardiovascular/hooks/useCardioAnalytics';
import { useTelemetry } from '@/features/simulation/hooks/useTelemetry';
import { ChartContainer } from '@/components/common/Visualization';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const CardioHealthPage: React.FC = () => {
  const { latestPacket, history } = useTelemetry();
  const { restingHR, hrv, exerciseSpike } = useCardioAnalytics();

  const vitals = latestPacket?.vitals;

  // Prepare chart data (last 60 points)
  const chartData = history.slice(0, 60).map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hr: p.vitals?.heartRate?.value,
  })).reverse(); // oldest first

  return (
    <PageContainer maxWidth="wide">
      <PageHeader
        title="Cardiovascular Health"
        subtitle="Real‑time heart rate, blood pressure and derived metrics"
        badge={<StatusIndicator status={exerciseSpike ? 'CAUTION' : 'NOMINAL'} label={exerciseSpike ? 'Exercise Spike' : 'Nominal'} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <MetricDisplay label="Heart Rate" value={vitals?.heartRate?.value?.toString() ?? '--'} unit="bpm" icon={Heart} status="NOMINAL" />
        <MetricDisplay label="Blood Pressure" value={vitals ? `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}` : '--'} unit="mmHg" icon={Activity} status="NOMINAL" />
        <MetricDisplay label="SpO₂" value={vitals?.spo2?.value?.toString() ?? '--'} unit="%" icon={Wind} status="NOMINAL" />
        <MetricDisplay label="HRV (σ)" value={hrv?.toString() ?? '--'} unit="bpm" icon={Heart} status="NOMINAL" />
        <MetricDisplay label="Resting HR" value={restingHR?.toString() ?? '--'} unit="bpm" icon={Heart} status="NOMINAL" />
      </div>
      <ChartContainer title="Heart‑Rate Trend (last 60 s)" className="mt-6">
        <LineChart width={800} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[40, 180]} label={{ value: 'bpm', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="hr" stroke="#EF4444" dot={false} />
        </LineChart>
      </ChartContainer>
    </PageContainer>
  );
};
