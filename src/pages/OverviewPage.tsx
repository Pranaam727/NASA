import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { Activity, ShieldCheck, Radio, AlertTriangle, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { RiskLevel } from '@/features/analytics/types/analyticsTypes';
import { ROUTES } from '@/constants/routes';

// ── Helpers ───────────────────────────────────────────────────────────────────

function riskLevelToStatus(level: RiskLevel): 'NOMINAL' | 'CAUTION' | 'CRITICAL' {
  switch (level) {
    case 'CRITICAL': return 'CRITICAL';
    case 'WARNING':  return 'CAUTION';
    case 'CAUTION':  return 'CAUTION';
    default:         return 'NOMINAL';
  }
}

function riskBadgeClasses(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'bg-astro-status-critical/15 text-astro-status-critical border-astro-status-critical/40';
    case 'WARNING':  return 'bg-astro-status-warning/15 text-astro-status-warning border-astro-status-warning/40';
    case 'CAUTION':  return 'bg-astro-status-caution/15 text-astro-status-caution border-astro-status-caution/40';
    default:         return 'bg-astro-status-healthy/15 text-astro-status-healthy border-astro-status-healthy/40';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const OverviewPage: React.FC = () => {
  const {
    astronauts,
    selectedAstronautId,
    setSelectedAstronautId,
    assessment,
    compositeScore,
    riskLevel,
    systemWideActiveAlerts,
    isStreaming,
  } = useHealthAnalytics('ASTRO-01');

  // Derive crew summary: for each astronaut, show their ID and static role info
  const crewMeta: Record<string, { name: string; role: string }> = {
    'ASTRO-01': { name: 'CDR. MARCUS CHEN',    role: 'COMMANDER' },
    'ASTRO-02': { name: 'DR. SARAH VANCE',     role: 'FLIGHT SURGEON' },
    'ASTRO-03': { name: 'DR. ELENA ROSTOVA',   role: 'SCIENCE OFFICER' },
    'ASTRO-04': { name: 'LT. JAMES WILSON',    role: 'FLIGHT ENGINEER' },
  };

  // Count alerts by severity
  const criticalCount = useMemo(
    () => systemWideActiveAlerts.filter((a) => a.severity === 'CRITICAL').length,
    [systemWideActiveAlerts]
  );
  const highCount = useMemo(
    () => systemWideActiveAlerts.filter((a) => a.severity === 'HIGH').length,
    [systemWideActiveAlerts]
  );

  const latestVitals = assessment;
  const overallStatus = riskLevelToStatus(riskLevel);

  return (
    <PageContainer>
      <PageHeader
        title="Mission Health Intelligence Overview"
        subtitle="Operational telemetry matrix and crew biological readiness monitor"
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator status={overallStatus} label={`CREW ${overallStatus}`} />
            <span className={`flex items-center space-x-1 font-mono text-[10px] px-2 py-0.5 rounded-sm border ${isStreaming ? 'text-astro-status-healthy border-astro-status-healthy/40 bg-astro-status-healthy/10' : 'text-astro-text-secondary border-astro-border-hairline bg-astro-bg-subtle'}`}>
              {isStreaming ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isStreaming ? 'LIVE TELEMETRY' : 'STANDBY'}</span>
            </span>
          </div>
        }
        metadata={[
          { label: 'Mission',      value: 'ARES-VI' },
          { label: 'Destination', value: 'Mars Jezero Crater' },
          { label: 'Active Crew', value: `${astronauts.length} Astronauts` },
          { label: 'Risk Level',  value: riskLevel },
        ]}
      />

      {/* ── Live Metric Strip ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Composite Risk Score"
          value={compositeScore.toFixed(0)}
          unit="/ 100"
          trend={compositeScore > 50 ? 'up' : 'flat'}
          delta={compositeScore > 50 ? `+${(compositeScore - 25).toFixed(0)}` : '0'}
          status={overallStatus}
          icon={Activity}
          subtext={`RISK: ${riskLevel}`}
          isSimulated
        />
        <MetricDisplay
          label="Cumulative Radiation"
          value={latestVitals ? '48.6' : '—'}
          unit="mSv"
          trend="up"
          delta="+0.04"
          status="NOMINAL"
          icon={Radio}
          subtext="9.7% OF MISSION THRESHOLD"
          isSimulated
        />
        <MetricDisplay
          label="Crew Vital Readiness"
          value={riskLevel === 'NORMAL' ? '98.2' : riskLevel === 'CAUTION' ? '82.0' : riskLevel === 'WARNING' ? '61.0' : '34.0'}
          unit="%"
          trend={riskLevel === 'NORMAL' ? 'up' : 'down'}
          delta={riskLevel === 'NORMAL' ? '+0.4%' : '—'}
          status={overallStatus}
          icon={ShieldCheck}
          subtext={riskLevel === 'NORMAL' ? 'ALL CREW WITHIN TOLERANCE' : `ELEVATED STRAIN DETECTED`}
        />
        <MetricDisplay
          label="Active Health Alerts"
          value={String(systemWideActiveAlerts.length)}
          unit={criticalCount > 0 ? 'CRITICAL' : highCount > 0 ? 'HIGH' : 'ACTIVE'}
          status={criticalCount > 0 ? 'CRITICAL' : highCount > 0 ? 'CAUTION' : systemWideActiveAlerts.length > 0 ? 'CAUTION' : 'NOMINAL'}
          icon={AlertTriangle}
          subtext={systemWideActiveAlerts.length === 0 ? 'NO ACTIVE INCIDENTS' : `${criticalCount} CRITICAL, ${highCount} HIGH`}
        />
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Risk Summary + Quick Nav */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Risk Summary */}
          <DossierCard
            title="LIVE HEALTH RISK SUMMARY"
            subtitle={`COMPOSITE ASSESSMENT // ${isStreaming ? 'STREAMING' : 'STANDBY'}`}
            badge={
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border ${riskBadgeClasses(riskLevel)}`}>
                {riskLevel}
              </span>
            }
          >
            <div className="space-y-3">
              {/* Score bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] text-astro-text-secondary">
                  <span>COMPOSITE HEALTH RISK</span>
                  <span>{compositeScore.toFixed(0)} / 100</span>
                </div>
                <div className="h-2 bg-astro-bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(compositeScore, 100)}%`,
                      backgroundColor:
                        riskLevel === 'CRITICAL' ? '#B9473E' :
                        riskLevel === 'WARNING'  ? '#D16C48' :
                        riskLevel === 'CAUTION'  ? '#B89A58' : '#738174',
                    }}
                  />
                </div>
              </div>

              {assessment?.synergyMultipliersApplied && assessment.synergyMultipliersApplied.length > 0 && (
                <div className="p-2.5 bg-astro-status-warning/5 border border-astro-status-warning/20 rounded-sm">
                  <div className="font-mono text-[10px] font-bold text-astro-status-warning mb-1">
                    ACTIVE SYNERGY COMPOUNDING:
                  </div>
                  <div className="space-y-0.5">
                    {assessment.synergyMultipliersApplied.map((s) => (
                      <div key={s} className="font-mono text-[10px] text-astro-text-secondary">
                        ⚡ {s.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assessment?.recommendedAction && (
                <div className="p-2.5 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm font-body text-xs text-astro-text-secondary leading-relaxed">
                  <span className="font-mono text-[10px] font-bold text-astro-text-primary block mb-1">RECOMMENDED ACTION:</span>
                  {assessment.recommendedAction}
                </div>
              )}

              {!assessment && (
                <div className="p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm text-center font-mono text-xs text-astro-text-secondary">
                  Start simulation to begin live telemetry analysis →{' '}
                  <Link to={ROUTES.SIMULATION} className="text-astro-sage underline hover:no-underline">
                    Simulation Lab
                  </Link>
                </div>
              )}

              <div className="flex space-x-2 pt-1">
                <Link
                  to={ROUTES.VITALS}
                  className="flex items-center space-x-1 text-[11px] font-mono text-astro-sage border border-astro-border-hairline px-3 py-1.5 rounded-sm hover:bg-astro-bg-subtle transition-colors"
                >
                  <span>VITALS DEEP DIVE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to={ROUTES.ALERTS}
                  className="flex items-center space-x-1 text-[11px] font-mono text-astro-text-secondary border border-astro-border-hairline px-3 py-1.5 rounded-sm hover:bg-astro-bg-subtle transition-colors"
                >
                  <span>ALERTS ({systemWideActiveAlerts.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </DossierCard>

          {/* Module Quick Nav */}
          <DossierCard
            title="MISSION HEALTH MODULES"
            subtitle="ACTIVE DEVELOPMENT MODULES // P01–P06 COMPLETE"
            badge={<StatusIndicator status="NOMINAL" label="ONLINE" size="sm" />}
          >
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {[
                { label: 'VITAL MONITORING',   route: ROUTES.VITALS,       status: 'LIVE',    sub: 'P05 + P06' },
                { label: 'ALERTS & INCIDENTS', route: ROUTES.ALERTS,       status: systemWideActiveAlerts.length > 0 ? `${systemWideActiveAlerts.length} ACTIVE` : 'CLEAR', sub: 'P06' },
                { label: 'SPACE HEALTH',       route: ROUTES.SPACE_HEALTH, status: 'READY',   sub: 'P07 PENDING' },
                { label: 'SIMULATION LAB',     route: ROUTES.SIMULATION,   status: 'ONLINE',  sub: 'P05' },
                { label: 'AI COPILOT',         route: ROUTES.INTELLIGENCE, status: 'STAGED',  sub: 'P08 PENDING' },
                { label: 'RADIATION MONITOR',  route: ROUTES.RADIATION,    status: 'READY',   sub: 'P07 PENDING' },
              ].map(({ label, route, status, sub }) => (
                <Link
                  key={route}
                  to={route}
                  className="p-2.5 bg-astro-bg-primary border border-astro-border-hairline rounded-sm hover:border-astro-sage/50 hover:bg-astro-bg-subtle transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-astro-text-primary">{label}</span>
                    <ArrowRight className="w-3 h-3 text-astro-text-secondary group-hover:text-astro-sage transition-colors" />
                  </div>
                  <div className="mt-1 text-[10px] text-astro-text-secondary">{sub}</div>
                  <div className="mt-1 text-[9px] font-bold text-astro-sage">{status}</div>
                </Link>
              ))}
            </div>
          </DossierCard>
        </div>

        {/* Right: Crew Biometric Roster */}
        <div>
          <DossierCard
            title="CREW BIOMETRIC ROSTER"
            subtitle={`${astronauts.length} CREW MEMBERS MANIFESTED`}
            badge={<StatusIndicator status={overallStatus} label={`${astronauts.length} ACTIVE`} size="sm" />}
          >
            <div className="space-y-2 font-mono text-xs">
              {astronauts.map((astronaut) => {
                const meta = crewMeta[astronaut.id] ?? { name: astronaut.id, role: 'CREW' };
                const isSelected = astronaut.id === selectedAstronautId;
                return (
                  <button
                    key={astronaut.id}
                    onClick={() => setSelectedAstronautId(astronaut.id)}
                    className={`w-full p-2.5 border rounded-sm flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-astro-sage/10 border-astro-sage/40'
                        : 'bg-astro-bg-primary border-astro-border-hairline hover:border-astro-sage/30 hover:bg-astro-bg-subtle'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-astro-text-primary text-[11px]">{meta.name}</div>
                      <div className="text-[10px] text-astro-text-secondary">
                        {meta.role} // {astronaut.id}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <StatusIndicator
                        status={isSelected ? overallStatus : 'NOMINAL'}
                        size="sm"
                      />
                      {isSelected && (
                        <span className="text-[9px] text-astro-sage font-bold">MONITORED</span>
                      )}
                    </div>
                  </button>
                );
              })}
              <Link
                to={ROUTES.ASTRONAUTS}
                className="mt-1 flex items-center justify-center space-x-1 text-[10px] text-astro-text-secondary hover:text-astro-sage border border-astro-border-hairline rounded-sm py-1.5 hover:border-astro-sage/30 transition-colors"
              >
                <span>FULL CREW DOSSIERS</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </DossierCard>

          {/* Alert summary panel */}
          {systemWideActiveAlerts.length > 0 && (
            <DossierCard
              title="ACTIVE TRIAGE QUEUE"
              subtitle={`${systemWideActiveAlerts.length} UNRESOLVED INCIDENTS`}
              className="mt-4"
              badge={
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm border bg-astro-status-critical/15 text-astro-status-critical border-astro-status-critical/40">
                  ATTENTION
                </span>
              }
            >
              <div className="space-y-1.5">
                {systemWideActiveAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2 bg-astro-bg-primary border border-astro-border-hairline rounded-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-astro-text-primary truncate pr-1">
                        {alert.rule_code.replace(/_/g, ' ')}
                      </span>
                      <span className={`font-mono text-[9px] px-1 py-0.5 rounded-sm border flex-shrink-0 ${
                        alert.severity === 'CRITICAL' ? 'text-astro-status-critical border-astro-status-critical/40' :
                        alert.severity === 'HIGH'     ? 'text-astro-status-warning border-astro-status-warning/40' :
                        'text-astro-status-caution border-astro-status-caution/40'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-astro-text-secondary mt-0.5 truncate">
                      {alert.astronaut_id} · {alert.triggering_value}
                    </div>
                  </div>
                ))}
                {systemWideActiveAlerts.length > 4 && (
                  <div className="font-mono text-[10px] text-astro-text-secondary text-center py-1">
                    +{systemWideActiveAlerts.length - 4} more
                  </div>
                )}
                <Link
                  to={ROUTES.ALERTS}
                  className="mt-1 flex items-center justify-center space-x-1 text-[10px] text-astro-status-critical hover:text-astro-status-critical/80 border border-astro-status-critical/30 rounded-sm py-1.5 hover:border-astro-status-critical/50 transition-colors"
                >
                  <span>OPEN TRIAGE CONSOLE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </DossierCard>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
