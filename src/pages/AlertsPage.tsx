import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { ActiveAlertsList } from '@/features/analytics/components/ActiveAlertsList';
import { ShieldAlert, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const {
    systemWideActiveAlerts,
    systemWideAllAlerts,
    acknowledgeAlert,
    resolveAlert,
    isStreaming,
  } = useHealthAnalytics();

  const criticalCount = systemWideActiveAlerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = systemWideActiveAlerts.filter((a) => a.severity === 'HIGH').length;
  const acknowledgedCount = systemWideAllAlerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
  const resolvedCount = systemWideAllAlerts.filter((a) => a.status === 'RESOLVED').length;

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Header */}
      <PageHeader
        title="Incident & Real-Time Alert Management"
        subtitle="Deterministic rule engine, individual baseline anomaly detection, and automated flight triage"
        badge={
          <StatusIndicator
            status={criticalCount > 0 ? 'CRITICAL' : systemWideActiveAlerts.length > 0 ? 'CAUTION' : 'NOMINAL'}
            label={`${systemWideActiveAlerts.length} ACTIVE ALERTS`}
            pulse={criticalCount > 0}
          />
        }
        metadata={[
          { label: 'Mission', value: 'ARES-VI' },
          { label: 'Rule Engine', value: 'DETERMINISTIC 1HZ TELEMETRY' },
          { label: 'Deduplication Window', value: '60s Cooldown / Escalation Bypass' },
          { label: 'Telemetry Link', value: isStreaming ? 'ACTIVE' : 'STANDBY' },
        ]}
      />

      {/* 2. Top Metric Triage Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Critical Severity Alerts"
          value={criticalCount.toString()}
          unit="ALERTS"
          status={criticalCount > 0 ? 'CRITICAL' : 'NOMINAL'}
          icon={ShieldAlert}
          subtext="IMMEDIATE FLIGHT SURGEON INTERVENTION"
        />
        <MetricDisplay
          label="Elevated / High Alerts"
          value={highCount.toString()}
          unit="ALERTS"
          status={highCount > 0 ? 'CAUTION' : 'NOMINAL'}
          icon={AlertTriangle}
          subtext="PHYSIOLOGICAL THRESHOLD DRIFT"
        />
        <MetricDisplay
          label="Under Investigation"
          value={acknowledgedCount.toString()}
          unit="ACK'D"
          status="NOMINAL"
          icon={Activity}
          subtext="MEDICAL OFFICER REVIEW LOGGED"
        />
        <MetricDisplay
          label="Resolved Incidents"
          value={resolvedCount.toString()}
          unit="RESOLVED"
          status="NOMINAL"
          icon={CheckCircle2}
          subtext="STABILIZED TO NOMINAL BASELINE"
        />
      </div>

      {/* 3. Real-Time Alert Triage Queue */}
      <ActiveAlertsList
        alerts={systemWideAllAlerts}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
      />

      {/* 4. Automated Rule Matrix Dossier */}
      <DossierCard
        title="AUTONOMOUS ALERT EVALUATION RULES & THRESHOLDS"
        subtitle="MULTI-FACTOR PARAMETRIC FLIGHT SAFETY CRITERIA"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-astro-text-secondary">
          <div className="p-3 bg-astro-bg-subtle/50 rounded-sm border border-astro-border-hairline space-y-1">
            <span className="font-bold text-astro-text-primary block text-[11px] uppercase">
              RULE: ACUTE HYPOXIA
            </span>
            <p className="text-[10px] text-astro-text-tertiary">
              SpO2 &lt; 90% (Warning) // &lt; 86% (Critical). Checks suit partial pressure and triggers hypoxia compensation protocol.
            </p>
          </div>
          <div className="p-3 bg-astro-bg-subtle/50 rounded-sm border border-astro-border-hairline space-y-1">
            <span className="font-bold text-astro-text-primary block text-[11px] uppercase">
              RULE: TACHYCARDIA / BRADYCARDIA
            </span>
            <p className="text-[10px] text-astro-text-tertiary">
              HR &gt; 160 bpm or &gt; baseline+85 (Critical) // HR &lt; 40 bpm (Critical). Evaluated with 60s deduplication cooldown.
            </p>
          </div>
          <div className="p-3 bg-astro-bg-subtle/50 rounded-sm border border-astro-border-hairline space-y-1">
            <span className="font-bold text-astro-text-primary block text-[11px] uppercase">
              RULE: SOLAR PARTICLE EVENT (SPE)
            </span>
            <p className="text-[10px] text-astro-text-tertiary">
              Ambient flux &gt; 2.0 uSv/h or SPE flag asserted. Forces minimum composite risk score to 78/100 (Critical tier).
            </p>
          </div>
        </div>
      </DossierCard>
    </PageContainer>
  );
};
