import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { RiskScoreCard } from '@/features/analytics/components/RiskScoreCard';
import { SubsystemRiskMatrix } from '@/features/analytics/components/SubsystemRiskMatrix';
import { BaselineComparisonTable } from '@/features/analytics/components/BaselineComparisonTable';
import { ActiveAlertsQueue } from '@/features/analytics/components/ActiveAlertsQueue';
import { RiskTrendsChart } from '@/features/analytics/components/RiskTrendsChart';
import { SEED_ASTRONAUTS } from '@/data/seedData';
import { User } from 'lucide-react';

export const SpaceHealthPage: React.FC = () => {
  const {
    astronautId,
    currentAstronaut,
    deviations,
    riskAssessment,
    activeAlerts,
    riskHistory,
    setAstronaut,
    acknowledgeAlert,
    resolveAlert,
    isSimulating,
  } = useHealthAnalytics();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'ORGAN_SYSTEMS'>('ANALYTICS');

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Header with Metadata and Crew Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Deep-Space Health Analytics & Risk Engine"
          subtitle="Deterministic multi-parameter physiological modeling, baseline deviations, and clinical alerting"
          badge={
            <StatusIndicator
              status={riskAssessment.riskLevel === 'CRITICAL' ? 'CRITICAL' : riskAssessment.riskLevel === 'WARNING' || riskAssessment.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              label={`${riskAssessment.riskLevel} PROTOCOL`}
              pulse={riskAssessment.riskLevel === 'CRITICAL'}
            />
          }
          metadata={[
            { label: 'Mission', value: 'ARES-VI' },
            { label: 'Callsign', value: currentAstronaut.profile?.callsign || 'ASTRONAUT' },
            { label: 'Name', value: currentAstronaut.profile?.full_name || 'Crew Member' },
            { label: 'Telemetry Stream', value: isSimulating ? '1Hz LIVE VIRTUAL' : 'BASELINE STANDBY' },
          ]}
        />

        {/* Crew Selector */}
        <div className="flex items-center space-x-2 bg-white border border-astro-border-hairline rounded-sm px-3 py-2 self-start md:self-auto shrink-0 shadow-xs">
          <User className="w-4 h-4 text-astro-text-secondary" />
          <span className="font-mono text-[10px] text-astro-text-tertiary uppercase">CREW SUBJECT:</span>
          <select
            value={astronautId}
            onChange={(e) => setAstronaut(e.target.value)}
            className="font-mono text-xs font-semibold bg-transparent text-astro-text-primary outline-none cursor-pointer"
          >
            {SEED_ASTRONAUTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.profile?.callsign}: {a.profile?.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Navigation Mode Tabs */}
      <div className="flex border-b border-astro-border-hairline font-mono text-xs space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab('ANALYTICS')}
          className={`pb-2 transition-colors relative font-semibold ${
            activeTab === 'ANALYTICS'
              ? 'text-astro-text-primary border-b-2 border-astro-text-primary'
              : 'text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          REAL-TIME DETERMINISTIC RISK & BASELINES
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ORGAN_SYSTEMS')}
          className={`pb-2 transition-colors relative font-semibold ${
            activeTab === 'ORGAN_SYSTEMS'
              ? 'text-astro-text-primary border-b-2 border-astro-text-primary'
              : 'text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          LONG-TERM ORGAN-SYSTEM DEGRADATION
        </button>
      </div>

      {activeTab === 'ANALYTICS' ? (
        <div className="space-y-6">
          {/* 3. Primary Composite Risk Score Gauge */}
          <RiskScoreCard assessment={riskAssessment} isSimulating={isSimulating} />

          {/* 4. Subsystems Breakdown (Cardiovascular, Respiratory, Radiation, Thermal) */}
          <SubsystemRiskMatrix subsystems={riskAssessment.subsystems} />

          {/* 5. Dynamic Risk Trajectory Over Time */}
          <RiskTrendsChart history={riskHistory} />

          {/* 6. Baseline-versus-Current Deviations Table */}
          <BaselineComparisonTable
            deviations={deviations}
            astronautCallsign={`${currentAstronaut.profile?.callsign} (${currentAstronaut.profile?.full_name})`}
          />

          {/* 7. Active Alert Triage Queue with Acknowledge/Resolve Actions */}
          <ActiveAlertsQueue
            alerts={activeAlerts}
            onAcknowledge={acknowledgeAlert}
            onResolve={resolveAlert}
          />
        </div>
      ) : (
        /* Organ-System Long-Term Modeling View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DossierCard
            title="BONE MINERAL DENSITY (DXA)"
            subtitle="LUMBAR SPINE & FEMORAL NECK TRACE"
            badge={<StatusIndicator status="NOMINAL" label="-0.8% / MO" size="sm" />}
          >
            <div className="space-y-2 text-xs font-mono">
              <p className="font-body text-astro-text-secondary leading-relaxed">
                Microgravity osteoclastic demineralization rate within simulated countermeasure tolerances. Dual-energy X-ray absorptiometry modeled every 30 mission days.
              </p>
              <div className="pt-2 border-t border-astro-border-hairline/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">LUMBAR SPINE BMD:</span>
                  <span className="font-bold text-astro-text-primary">0.982 g/cm² (T-score: -0.4)</span>
                </div>
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">FEMORAL NECK BMD:</span>
                  <span className="font-bold text-astro-text-primary">0.914 g/cm² (T-score: -0.6)</span>
                </div>
              </div>
            </div>
          </DossierCard>

          <DossierCard
            title="MUSCLE HEALTH & RESISTANCE LOGS"
            subtitle="ARED & T2 TREADMILL FORCE ACCRUAL"
            badge={<StatusIndicator status="NOMINAL" label="100% PROTOCOL" size="sm" />}
          >
            <div className="space-y-2 text-xs font-mono">
              <p className="font-body text-astro-text-secondary leading-relaxed">
                Tracks peak torque, force dissipation, and strength deconditioning rates under high-load resistive countermeasure regimens.
              </p>
              <div className="pt-2 border-t border-astro-border-hairline/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">ARED DEADLIFT LOAD:</span>
                  <span className="font-bold text-astro-text-primary">130 kg (Nominal target)</span>
                </div>
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">CALORIE BURN (LAST 7D):</span>
                  <span className="font-bold text-astro-text-primary">4,820 kcal mechanical work</span>
                </div>
              </div>
            </div>
          </DossierCard>

          <DossierCard
            title="IMMUNE DYSREGULATION PROFILE"
            subtitle="CYTOKINES & WHITE BLOOD CELL METRICS"
            badge={<StatusIndicator status="CAUTION" label="MILD T-CELL SHIFT" size="sm" />}
          >
            <div className="space-y-2 text-xs font-mono">
              <p className="font-body text-astro-text-secondary leading-relaxed">
                In-flight hematology and leukocyte differential tracking. Chronic cosmic ray exposure coupled with psychological isolation causes mild helper-T-cell downregulation.
              </p>
              <div className="pt-2 border-t border-astro-border-hairline/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">TOTAL LEUKOCYTES:</span>
                  <span className="font-bold text-astro-text-primary">6.4 x 10³/µL (Nominal)</span>
                </div>
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">IL-6 CYTOKINE MARKER:</span>
                  <span className="font-bold text-astro-text-primary">2.8 pg/mL (Slightly Elevated)</span>
                </div>
              </div>
            </div>
          </DossierCard>

          <DossierCard
            title="CARDIOVASCULAR REMODELING"
            subtitle="ORTHOSTATIC INTOLERANCE & FLUID SHIFT"
            badge={<StatusIndicator status="NOMINAL" label="MAP STABLE" size="sm" />}
          >
            <div className="space-y-2 text-xs font-mono">
              <p className="font-body text-astro-text-secondary leading-relaxed">
                Cephalad fluid-shift modeling, stroke volume adaptation, and post-flight orthostatic intolerance risk prediction based on resting pulse pressure.
              </p>
              <div className="pt-2 border-t border-astro-border-hairline/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">PULSE PRESSURE:</span>
                  <span className="font-bold text-astro-text-primary">
                    {deviations.BLOOD_PRESSURE_SYS.currentValue - deviations.BLOOD_PRESSURE_DIA.currentValue} mmHg
                  </span>
                </div>
                <div>
                  <span className="text-astro-text-tertiary block text-[10px]">ORTHOSTATIC RISK INDEX:</span>
                  <span className="font-bold text-astro-text-primary">LOW (Tier 1 Homeostasis)</span>
                </div>
              </div>
            </div>
          </DossierCard>
        </div>
      )}
    </PageContainer>
  );
};
