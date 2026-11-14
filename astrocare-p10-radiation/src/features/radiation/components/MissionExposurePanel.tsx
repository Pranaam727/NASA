import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { Shield, Clock, Compass } from 'lucide-react';

interface MissionExposurePanelProps {
  cumulativeDoseMsv: number;
  missionDay?: number;
  totalMissionDays?: number;
  careerLimitMsv?: number;
}

export const MissionExposurePanel: React.FC<MissionExposurePanelProps> = ({
  cumulativeDoseMsv,
  missionDay = 48,
  totalMissionDays = 900,
  careerLimitMsv = 500,
}) => {
  const percentCareerUsed = Math.min(100, (cumulativeDoseMsv / careerLimitMsv) * 100);
  const remainingCareerBudgetMsv = Math.max(0, careerLimitMsv - cumulativeDoseMsv);

  // Daily average accumulation rate so far
  const dailyRateMsv = cumulativeDoseMsv / (missionDay || 1);
  const projectedMissionEndDoseMsv = dailyRateMsv * totalMissionDays;
  const isProjectedOverLimit = projectedMissionEndDoseMsv > careerLimitMsv;

  return (
    <DossierCard
      title="Mission Exposure Context & Career Radioprotection Budget"
      subtitle="ARES-VI EXPEDITION // 900-DAY TRANSIT BIO-DOSIMETRIC MODEL"
      badge={
        <span className="font-mono text-xs text-astro-text-secondary">
          MISSION DAY: {missionDay} / {totalMissionDays}
        </span>
      }
    >
      <div className="space-y-4">
        {/* Career Exposure Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-astro-text-secondary">CAREER EXPOSURE CONSUMED</span>
            <span className="font-semibold text-astro-ink">
              {cumulativeDoseMsv.toFixed(2)} / {careerLimitMsv} mSv ({percentCareerUsed.toFixed(1)}%)
            </span>
          </div>

          <div className="w-full h-3 bg-[#EAE6DC] rounded-full overflow-hidden border border-astro-border-hairline p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentCareerUsed > 80
                  ? 'bg-[#B9473E]'
                  : percentCareerUsed > 50
                  ? 'bg-[#D16C48]'
                  : 'bg-[#738174]'
              }`}
              style={{ width: `${Math.min(100, percentCareerUsed)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-astro-text-secondary mt-1">
            <span>0 mSv</span>
            <span>250 mSv (Exploration Milestone)</span>
            <span>{careerLimitMsv} mSv (Career Limit)</span>
          </div>
        </div>

        {/* 3 Grid Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-[#EAE6DC]/50 rounded border border-astro-border-hairline">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#738174] mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>REMAINING BUDGET</span>
            </div>
            <p className="font-mono text-lg font-bold text-astro-ink">
              {remainingCareerBudgetMsv.toFixed(1)} <span className="text-xs font-normal">mSv</span>
            </p>
            <p className="text-[10px] text-astro-text-secondary mt-0.5">
              Available before reaching career regulatory ceiling.
            </p>
          </div>

          <div className="p-3 bg-[#EAE6DC]/50 rounded border border-astro-border-hairline">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#738174] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>DAILY MEAN ACCRUAL</span>
            </div>
            <p className="font-mono text-lg font-bold text-astro-ink">
              {dailyRateMsv.toFixed(3)} <span className="text-xs font-normal">mSv/day</span>
            </p>
            <p className="text-[10px] text-astro-text-secondary mt-0.5">
              Reflects transit Galactic Cosmic Background and SPE shielding.
            </p>
          </div>

          <div className="p-3 bg-[#EAE6DC]/50 rounded border border-astro-border-hairline">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#738174] mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>PROJECTED MISSION END</span>
            </div>
            <p
              className={`font-mono text-lg font-bold ${
                isProjectedOverLimit ? 'text-[#B9473E]' : 'text-astro-ink'
              }`}
            >
              {projectedMissionEndDoseMsv.toFixed(1)} <span className="text-xs font-normal">mSv</span>
            </p>
            <p className="text-[10px] text-astro-text-secondary mt-0.5">
              {isProjectedOverLimit
                ? '⚠️ Projected cumulative exceeds 500 mSv career limit.'
                : 'Nominal projection within acceptable career limits.'}
            </p>
          </div>
        </div>
      </div>
    </DossierCard>
  );
};
