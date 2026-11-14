import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { ActiveAlertsQueue } from '@/features/analytics/components/ActiveAlertsQueue';
import { ALERT_RULES_CATALOG } from '@/features/analytics/alertRules';
import { Bell, ShieldAlert, CheckCircle, Clock, BookOpen, User } from 'lucide-react';
import { SEED_ASTRONAUTS } from '@/data/seedData';

export const AlertsPage: React.FC = () => {
  const {
    astronautId,
    currentAstronaut,
    allAlerts,
    activeAlerts,
    acknowledgedAlerts,
    resolvedAlerts,
    setAstronaut,
    acknowledgeAlert,
    resolveAlert,
    isSimulating,
  } = useHealthAnalytics();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredHistory = allAlerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const criticalCount = allAlerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = allAlerts.filter((a) => a.severity === 'HIGH').length;

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Page Header & Crew Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Incident & Alert Management"
          subtitle="Deterministic rule engine, personal baseline anomaly detection, and crew triage center"
          badge={
            <StatusIndicator
              status={activeAlerts.length > 0 ? 'CRITICAL' : 'NOMINAL'}
              label={`${activeAlerts.length} ACTIVE ALERTS`}
              pulse={activeAlerts.length > 0}
            />
          }
          metadata={[
            { label: 'Mission', value: 'ARES-VI' },
            { label: 'Subject', value: `${currentAstronaut.profile?.callsign}: ${currentAstronaut.profile?.full_name}` },
            { label: 'Deduplication', value: 'Active (60s Cooldown)' },
            { label: 'Engine State', value: isSimulating ? '1Hz LIVE EVAL' : 'STANDBY' },
          ]}
        />

        {/* Crew Selector */}
        <div className="flex items-center space-x-2 bg-white border border-astro-border-hairline rounded-sm px-3 py-2 self-start md:self-auto shrink-0 shadow-xs">
          <User className="w-4 h-4 text-astro-text-secondary" />
          <span className="font-mono text-[10px] text-astro-text-tertiary uppercase">CREW FILTER:</span>
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

      {/* 2. Top Metric Tally Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Active Incidents"
          value={activeAlerts.length}
          unit="ALERTS"
          status={activeAlerts.length > 0 ? 'CRITICAL' : 'NOMINAL'}
          icon={Bell}
          subtext="UNRESOLVED ANOMALIES"
        />
        <MetricDisplay
          label="Critical Flags"
          value={criticalCount}
          unit="CRITICAL"
          status={criticalCount > 0 ? 'CRITICAL' : 'NOMINAL'}
          icon={ShieldAlert}
          subtext={`${criticalCount} CRIT // ${highCount} HIGH FLAGS`}
        />
        <MetricDisplay
          label="Acknowledged"
          value={acknowledgedAlerts.length}
          unit="IN-TRIAGE"
          status="CAUTION"
          icon={Clock}
          subtext="SURGEON REVIEWED"
        />
        <MetricDisplay
          label="Resolved Log"
          value={resolvedAlerts.length}
          unit="RESOLVED"
          status="NOMINAL"
          icon={CheckCircle}
          subtext="RESTORED TO BASELINE"
        />
      </div>

      {/* 3. Real-Time Active Triage Queue */}
      <ActiveAlertsQueue
        alerts={allAlerts}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
      />

      {/* 4. Complete Audit History Table */}
      <DossierCard
        title="TELEMETRY ANOMALY AUDIT TRAIL"
        subtitle={`HISTORICAL EVENT LOG // SUBJECT: ${currentAstronaut.profile?.callsign}`}
        badge={
          <div className="flex items-center space-x-2 font-mono text-[10px]">
            <span className="text-astro-text-tertiary uppercase">SEVERITY:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                  filterSeverity === sev
                    ? 'bg-astro-text-primary text-astro-bg-primary font-bold'
                    : 'text-astro-text-secondary hover:text-astro-text-primary'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        }
      >
        {filteredHistory.length === 0 ? (
          <div className="py-6 text-center font-mono text-xs text-astro-text-secondary">
            [ NO HISTORICAL ALERTS RECORDED FOR SELECTED SEVERITY FILTER ]
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-astro-border-hairline text-[10px] text-astro-text-tertiary uppercase">
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Rule Code</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Alert Title</th>
                  <th className="py-2 px-3">Trigger Value</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Resolution Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-astro-border-hairline/60">
                {filteredHistory.map((alt) => (
                  <tr key={alt.id} className="hover:bg-astro-bg-subtle/30 transition-colors">
                    <td className="py-2.5 px-3 text-astro-text-secondary whitespace-nowrap">
                      {new Date(alt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-astro-text-primary">
                      {alt.rule_code}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusIndicator
                        status={
                          alt.severity === 'CRITICAL'
                            ? 'CRITICAL'
                            : alt.severity === 'HIGH' || alt.severity === 'MEDIUM'
                            ? 'CAUTION'
                            : 'NOMINAL'
                        }
                        label={alt.severity}
                        size="sm"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-display font-bold text-astro-text-primary">
                      {alt.title}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-astro-status-critical">
                      {alt.triggering_value}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                          alt.status === 'ACTIVE'
                            ? 'bg-astro-status-critical/10 text-astro-status-critical'
                            : alt.status === 'ACKNOWLEDGED'
                            ? 'bg-astro-status-caution/10 text-astro-status-caution'
                            : 'bg-astro-status-healthy/10 text-astro-status-healthy'
                        }`}
                      >
                        {alt.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-body text-[11px] text-astro-text-secondary max-w-xs truncate">
                      {alt.resolution_notes || '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DossierCard>

      {/* 5. Canonical Alert Rules Catalog Reference */}
      <DossierCard
        title="DETERMINISTIC THRESHOLD RULES CATALOG"
        subtitle="10 STANDARDIZED AEROSPACE MEDICAL RULES // RECOVERY & PERSISTENCE ENGINE"
        badge={
          <span className="font-mono text-[10px] text-astro-text-secondary flex items-center space-x-1">
            <BookOpen className="w-3 h-3" />
            <span>STANDARD SPEC</span>
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALERT_RULES_CATALOG.map((rule) => (
            <div
              key={rule.ruleCode}
              className="p-3 rounded-sm border border-astro-border-hairline bg-astro-bg-subtle/30 space-y-1 font-mono text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-astro-text-primary text-[11px]">
                  {rule.ruleCode}
                </span>
                <StatusIndicator
                  status={rule.severity === 'CRITICAL' ? 'CRITICAL' : 'CAUTION'}
                  label={rule.severity}
                  size="sm"
                />
              </div>
              <h5 className="font-display font-bold text-astro-text-primary text-xs">
                {rule.title}
              </h5>
              <div className="flex items-center justify-between text-[10px] text-astro-text-tertiary pt-1 border-t border-astro-border-hairline/40">
                <span>CATEGORY: {rule.category}</span>
                <span>COOLDOWN: {rule.cooldownSeconds}s</span>
              </div>
            </div>
          ))}
        </div>
      </DossierCard>
    </PageContainer>
  );
};
