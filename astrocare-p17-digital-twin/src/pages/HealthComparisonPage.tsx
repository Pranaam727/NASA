import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { HealthComparisonPanel } from '../components/digital-twin/HealthComparisonPanel';
import { Badge } from '../components/common/Badge';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

interface HealthComparisonPageProps {
  profiles: AstronautProfile[];
  measurements: PhysiologicalMeasurement[];
}

export const HealthComparisonPage: React.FC<HealthComparisonPageProps> = ({
  profiles,
  measurements,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Cross-Profile Health Comparison
            </h1>
            <Badge variant="cyan">COMPARATIVE PHYSIOLOGY</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validate unit compatibility, compare personal baselines vs inflight adaptations, and cross-reference astronaut cohort responses.
          </p>
        </div>
      </div>

      <DisclaimerNotice />

      <HealthComparisonPanel
        profiles={profiles}
        allMeasurements={measurements}
      />
    </div>
  );
};
