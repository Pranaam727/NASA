import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { Activity, ShieldCheck, Radio, AlertTriangle } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Mission Health Intelligence Overview"
        subtitle="Operational telemetry matrix and crew biological readiness monitor"
        badge={<StatusIndicator status="NOMINAL" label="CREW NOMINAL" />}
        metadata={[
          { label: 'Mission', value: 'ARES-VI' },
          { label: 'Destination', value: 'Mars Jezero Crater' },
          { label: 'Active Crew', value: '4 Astronauts' },
          { label: 'Telemetry Stream', value: '1Hz Nominal' },
        ]}
      />

      {/* Top Level Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Crew Vital Readiness"
          value="98.2"
          unit="%"
          trend="up"
          delta="+0.4%"
          status="NOMINAL"
          icon={Activity}
          subtext="ALL CREW WITHIN TOLERANCE"
        />
        <MetricDisplay
          label="Cumulative Radiation"
          value="48.6"
          unit="mSv"
          trend="up"
          delta="+0.04"
          status="NOMINAL"
          icon={Radio}
          subtext="9.7% OF MISSION THRESHOLD"
          isSimulated
        />
        <MetricDisplay
          label="Cardiovascular Baseline"
          value="66"
          unit="bpm avg"
          trend="flat"
          delta="0.0"
          status="NOMINAL"
          icon={ShieldCheck}
          subtext="RESTING STATE SYNCHRONIZED"
        />
        <MetricDisplay
          label="Active Health Alerts"
          value="0"
          unit="CRITICAL"
          status="NOMINAL"
          icon={AlertTriangle}
          subtext="NO ACTIVE INCIDENTS"
        />
      </div>

      {/* Operational Dossier Staging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DossierCard
            title="MISSION HEALTH FOUNDATION // SYSTEM INITIALIZATION"
            subtitle="SUBSYSTEM STATUS: READY FOR MODULE 2 INTEGRATION"
            badge={<StatusIndicator status="NOMINAL" label="ONLINE" size="sm" />}
          >
            <div className="space-y-4 text-xs font-body text-astro-text-secondary leading-relaxed">
              <p>
                The AstroCare mission health architecture is initialized in the active workspace.
                The standardized telemetry contracts, design tokens, and application routing are
                operational.
              </p>
              <div className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-astro-text-primary block">
                  Next Development Sequence:
                </span>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                  <li>PROMPT 04: Virtual Sensor & Telemetry Simulation Engine</li>
                  <li>PROMPT 05: Real-Time Mission Control Dashboard & ECG Waveform</li>
                  <li>PROMPT 06: Deterministic Risk Detection Engine</li>
                </ul>
              </div>
            </div>
          </DossierCard>
        </div>

        <div>
          <DossierCard
            title="CREW BIOMETRIC ROSTER"
            subtitle="4 CREW MEMBERS MANIFESTED"
            badge={<StatusIndicator status="NOMINAL" label="4 ACTIVE" size="sm" />}
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 bg-astro-bg-primary border border-astro-border-hairline rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-astro-text-primary">CDR. MARCUS CHEN</div>
                  <div className="text-[10px] text-astro-text-secondary">COMMANDER // HR: 64 bpm</div>
                </div>
                <StatusIndicator status="NOMINAL" size="sm" />
              </div>
              <div className="p-2.5 bg-astro-bg-primary border border-astro-border-hairline rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-astro-text-primary">DR. SARAH VANCE</div>
                  <div className="text-[10px] text-astro-text-secondary">FLIGHT SURGEON // HR: 68 bpm</div>
                </div>
                <StatusIndicator status="NOMINAL" size="sm" />
              </div>
              <div className="p-2.5 bg-astro-bg-primary border border-astro-border-hairline rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-astro-text-primary">DR. ELENA ROSTOVA</div>
                  <div className="text-[10px] text-astro-text-secondary">SCIENCE OFFICER // HR: 71 bpm</div>
                </div>
                <StatusIndicator status="NOMINAL" size="sm" />
              </div>
              <div className="p-2.5 bg-astro-bg-primary border border-astro-border-hairline rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-astro-text-primary">LT. JAMES WILSON</div>
                  <div className="text-[10px] text-astro-text-secondary">FLIGHT ENGINEER // HR: 62 bpm</div>
                </div>
                <StatusIndicator status="NOMINAL" size="sm" />
              </div>
            </div>
          </DossierCard>
        </div>
      </div>
    </PageContainer>
  );
};
