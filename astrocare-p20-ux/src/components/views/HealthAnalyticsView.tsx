import React, { useState } from 'react';
import { Astronaut, HealthMetric } from '../../types/contracts';
import { MetricTrendChart } from '../charts/MetricTrendChart';
import { BaselineComparisonChart } from '../charts/BaselineComparisonChart';
import { MultiMetricComparisonChart } from '../charts/MultiMetricComparisonChart';
import { HealthMetricCard } from '../cards/HealthMetricCard';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { BarChart2, TrendingUp, Layers, Activity } from 'lucide-react';
import { CARD_SURFACE } from '../../design-system/utils';

interface HealthAnalyticsViewProps {
  astronaut: Astronaut;
  metrics: HealthMetric[];
  onOpenMetricDrawer: (metric: HealthMetric) => void;
}

export const HealthAnalyticsView: React.FC<HealthAnalyticsViewProps> = ({
  astronaut,
  metrics,
  onOpenMetricDrawer
}) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string>(metrics[0]?.id || 'metric-hrv');

  const activeMetric = metrics.find(m => m.id === selectedMetricId) || metrics[0];
  const secondaryMetric = metrics.find(m => m.id === 'metric-sleep-duration') || metrics[1] || metrics[0];

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white">
              Biomedical Analytics & Baseline Comparisons
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
              {astronaut.name} ({astronaut.callsign})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Tracking individual multi-domain physiological adaptation curves and departures from 1-G terrestrial baselines.
          </p>
        </div>

        <DataProvenanceBadge type="derived-metric" />
      </div>

      {/* Grid of Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <HealthMetricCard
            key={m.id}
            metric={m}
            onClick={() => {
              setSelectedMetricId(m.id);
              onOpenMetricDrawer(m);
            }}
            className={selectedMetricId === m.id ? 'ring-2 ring-cyan-500/50' : ''}
          />
        ))}
      </div>

      {/* Active Metric Time-Series Trend */}
      {activeMetric && (
        <MetricTrendChart metric={activeMetric} height={260} />
      )}

      {/* Baseline Comparison Index */}
      <BaselineComparisonChart metrics={metrics} height={260} />

      {/* Multi-Metric Correlation */}
      {activeMetric && secondaryMetric && activeMetric.id !== secondaryMetric.id && (
        <MultiMetricComparisonChart
          primaryMetric={activeMetric}
          secondaryMetric={secondaryMetric}
          height={260}
        />
      )}

    </div>
  );
};
