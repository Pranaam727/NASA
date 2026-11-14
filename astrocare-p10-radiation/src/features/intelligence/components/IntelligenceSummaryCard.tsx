import React from 'react';
import { GroundedContextDocument } from '../types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { Sparkles, ShieldAlert, Heart, Wind, Radio, Activity } from 'lucide-react';

interface IntelligenceSummaryCardProps {
  context: GroundedContextDocument;
}

export const IntelligenceSummaryCard: React.FC<IntelligenceSummaryCardProps> = ({ context }) => {
  const { callsign, fullName, deterministicRisk, currentTelemetry, activeAlerts } = context;

  const statusBadge =
    deterministicRisk.riskLevel === 'CRITICAL'
      ? 'CRITICAL'
      : deterministicRisk.riskLevel === 'WARNING' || deterministicRisk.riskLevel === 'CAUTION'
      ? 'CAUTION'
      : 'NOMINAL';

  const hr = currentTelemetry.HEART_RATE;
  const spo2 = currentTelemetry.SPO2;
  const sys = currentTelemetry.BLOOD_PRESSURE_SYS;
  const dia = currentTelemetry.BLOOD_PRESSURE_DIA;
  const rad = currentTelemetry.RADIATION_FLUX;

  return (
    <DossierCard
      title="GROUNDED CLINICAL SUMMARY"
      subtitle={`SUBJECT: ${callsign} (${fullName}) // REAL-TIME RISK STATUS`}
      badge={<StatusIndicator status={statusBadge} label={deterministicRisk.riskLevel} size="sm" />}
    >
      <div className="space-y-4">
        {/* Status header banner */}
        <div className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm flex items-start space-x-3">
          <div className="w-8 h-8 rounded-sm bg-white border border-astro-border-hairline flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-astro-status-caution" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-astro-text-primary">
              <span>RISK INDEX: {deterministicRisk.compositeScore}/100</span>
              <span>·</span>
              <span className="uppercase text-astro-text-secondary">
                {deterministicRisk.riskLevel} PROTOCOL
              </span>
            </div>
            <p className="font-body text-xs text-astro-text-secondary leading-snug">
              {deterministicRisk.directive}
            </p>
          </div>
        </div>

        {/* 4 Key Vital Sign Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <div className="p-2 bg-white border border-astro-border-hairline rounded-sm space-y-0.5">
            <div className="flex items-center space-x-1 text-[10px] text-astro-text-tertiary">
              <Heart className="w-3 h-3 text-astro-status-critical" />
              <span>HEART RATE</span>
            </div>
            <div className="font-bold text-astro-text-primary text-sm">
              {hr?.value ?? '--'} <span className="text-[10px] font-normal">bpm</span>
            </div>
            <div className="text-[9px] text-astro-text-secondary">
              Δ {hr?.delta > 0 ? `+${hr.delta}` : hr?.delta ?? 0} ({hr?.zScore ?? 0}σ)
            </div>
          </div>

          <div className="p-2 bg-white border border-astro-border-hairline rounded-sm space-y-0.5">
            <div className="flex items-center space-x-1 text-[10px] text-astro-text-tertiary">
              <Wind className="w-3 h-3 text-astro-status-healthy" />
              <span>PULSE OX</span>
            </div>
            <div className="font-bold text-astro-text-primary text-sm">
              {spo2?.value ?? '--'} <span className="text-[10px] font-normal">%</span>
            </div>
            <div className="text-[9px] text-astro-text-secondary">
              Δ {spo2?.delta ?? 0}% ({spo2?.status ?? 'NORMAL'})
            </div>
          </div>

          <div className="p-2 bg-white border border-astro-border-hairline rounded-sm space-y-0.5">
            <div className="flex items-center space-x-1 text-[10px] text-astro-text-tertiary">
              <Activity className="w-3 h-3 text-astro-text-secondary" />
              <span>ARTERIAL BP</span>
            </div>
            <div className="font-bold text-astro-text-primary text-sm">
              {sys?.value ?? '--'}/{dia?.value ?? '--'}
            </div>
            <div className="text-[9px] text-astro-text-secondary">
              mmHg (MAP Sync)
            </div>
          </div>

          <div className="p-2 bg-white border border-astro-border-hairline rounded-sm space-y-0.5">
            <div className="flex items-center space-x-1 text-[10px] text-astro-text-tertiary">
              <Radio className="w-3 h-3 text-astro-status-caution" />
              <span>DOSIMETRY</span>
            </div>
            <div className="font-bold text-astro-text-primary text-sm truncate">
              {rad?.value?.toFixed(3) ?? '--'}
            </div>
            <div className="text-[9px] text-astro-text-secondary">
              uSv/h flux
            </div>
          </div>
        </div>

        {/* Active Alert Flag Notice */}
        {activeAlerts.length > 0 && (
          <div className="p-2.5 bg-astro-status-critical/10 border border-astro-status-critical/30 rounded-sm flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-astro-status-critical shrink-0" />
              <span className="font-bold text-astro-status-critical">
                {activeAlerts.length} UNRESOLVED TELEMETRY ALERT{activeAlerts.length > 1 ? 'S' : ''}
              </span>
            </div>
            <span className="text-[10px] text-astro-text-secondary uppercase">
              TRIAGE ACTIVE
            </span>
          </div>
        )}
      </div>
    </DossierCard>
  );
};
