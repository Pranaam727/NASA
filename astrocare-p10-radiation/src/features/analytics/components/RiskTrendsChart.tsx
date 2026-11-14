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
import { RiskHistoryPoint } from '../types';
import { ChartContainer, ChartLegend, ChartTooltip } from '@/components/common/Visualization';

interface RiskTrendsChartProps {
  history: RiskHistoryPoint[];
}

export const RiskTrendsChart: React.FC<RiskTrendsChartProps> = ({ history }) => {
  const chartData =
    history.length > 0
      ? history
      : [
          {
            time: '00:00',
            timestamp: new Date().toISOString(),
            compositeScore: 12,
            cardioScore: 10,
            respiratoryScore: 5,
            radiationScore: 8,
          },
        ];

  return (
    <ChartContainer
      title="DYNAMIC MULTI-PARAMETER RISK TRAJECTORY"
      subtitle="REAL-TIME DETERMINISTIC SUBSYSTEM SCORE ACCRUAL (0-100 INDEX)"
      legend={
        <ChartLegend
          items={[
            { label: 'Composite Risk', color: '#B9473E' },
            { label: 'Cardiovascular', color: '#242824' },
            { label: 'Respiratory/SpO2', color: '#738174' },
            { label: 'Radiation', color: '#D49439' },
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
            domain={[0, 100]}
            stroke="#8C9086"
            tick={{ fill: '#73766F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            tickLine={{ stroke: '#D8D4C9' }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="compositeScore"
            name="Composite Risk"
            stroke="#B9473E"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="cardioScore"
            name="Cardiovascular"
            stroke="#242824"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="respiratoryScore"
            name="Respiratory"
            stroke="#738174"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="radiationScore"
            name="Radiation"
            stroke="#D49439"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
