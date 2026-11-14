import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { VitalsHistoryPoint } from '../hooks/useSimulation';
import { ChartContainer, ChartLegend, ChartTooltip } from '@/components/common/Visualization';

interface LiveChartsViewProps {
  history: VitalsHistoryPoint[];
}

export const LiveChartsView: React.FC<LiveChartsViewProps> = ({ history }) => {
  const chartData = history.length > 0 ? history : [{ time: '00:00', heartRate: 65, spo2: 98, systolic: 115, diastolic: 75, respiratoryRate: 14, coreTemp: 36.8, radiationFlux: 0.052 }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Heart Rate & SpO2 Dual Trend */}
      <ChartContainer
        title="CARDIO-RESPIRATORY CONTINUUM"
        subtitle="HEART RATE (BPM) & PULSE OXIMETRY (%) TRAJECTORY"
        legend={
          <ChartLegend
            items={[
              { label: 'Heart Rate (bpm)', color: '#242824' },
              { label: 'SpO2 (%)', color: '#738174' },
            ]}
          />
        }
        height={220}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#D8D4C9" strokeDasharray="2 2" strokeWidth={1} />
            <XAxis
              dataKey="time"
              stroke="#8C9086"
              tick={{ fill: '#73766F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#D8D4C9' }}
            />
            <YAxis
              yAxisId="hr"
              domain={[40, 180]}
              stroke="#8C9086"
              tick={{ fill: '#73766F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#D8D4C9' }}
            />
            <YAxis
              yAxisId="spo2"
              orientation="right"
              domain={[75, 100]}
              stroke="#8C9086"
              tick={{ fill: '#73766F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#D8D4C9' }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              yAxisId="hr"
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate"
              stroke="#242824"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="spo2"
              type="monotone"
              dataKey="spo2"
              name="SpO2"
              stroke="#738174"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 2. Blood Pressure Trend */}
      <ChartContainer
        title="ARTERIAL PRESSURE TRAJECTORY"
        subtitle="SYSTOLIC & DIASTOLIC PRESSURE (mmHg)"
        legend={
          <ChartLegend
            items={[
              { label: 'Systolic (mmHg)', color: '#D16C48' },
              { label: 'Diastolic (mmHg)', color: '#8C9086' },
            ]}
          />
        }
        height={220}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#D8D4C9" strokeDasharray="2 2" strokeWidth={1} />
            <XAxis
              dataKey="time"
              stroke="#8C9086"
              tick={{ fill: '#73766F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#D8D4C9' }}
            />
            <YAxis
              domain={[40, 190]}
              stroke="#8C9086"
              tick={{ fill: '#73766F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#D8D4C9' }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="systolic"
              name="Systolic"
              stroke="#D16C48"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              name="Diastolic"
              stroke="#8C9086"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
