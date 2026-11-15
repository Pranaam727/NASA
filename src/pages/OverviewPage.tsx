import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { CyberEarth3D } from '@/components/3d/CyberEarth3D';
import {
  Activity,
  ShieldCheck,
  Radio,
  AlertTriangle,
  ArrowRight,
  Wifi,
  WifiOff,
  UserCheck,
  CheckCircle2,
  Stethoscope,
  Heart,
  Dna,
  FileText,
  Sliders,
  ShieldAlert,
  Zap,
  Lock,
  Layers,
  Thermometer,
} from 'lucide-react';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { RiskLevel } from '@/features/analytics/types/analyticsTypes';
import { ROUTES } from '@/constants/routes';
import { useRole } from '@/context/RoleContext';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import {
  SEED_ASTRONAUTS,
  SEED_MEDICAL_PROTOCOLS,
  SEED_LAB_BIOMARKERS,
  SEED_SELF_ASSESSMENTS,
} from '@/data/seedData';

function riskLevelToStatus(level: RiskLevel): 'NOMINAL' | 'CAUTION' | 'CRITICAL' {
  switch (level) {
    case 'CRITICAL':
      return 'CRITICAL';
    case 'WARNING':
    case 'CAUTION':
      return 'CAUTION';
    default:
      return 'NOMINAL';
  }
}

export const OverviewPage: React.FC = () => {
  const { currentRole, selectedAstronautId, setSelectedAstronautId, currentUser } = useRole();
  const { isOffline, pendingQueue } = useOfflineSync();

  const {
    astronauts,
    compositeScore,
    riskLevel,
    systemWideActiveAlerts,
    isStreaming,
  } = useHealthAnalytics(selectedAstronautId || 'ASTRO-01');

  // Count alerts by severity
  const criticalCount = useMemo(
    () => systemWideActiveAlerts.filter((a) => a.severity === 'CRITICAL').length,
    [systemWideActiveAlerts]
  );
  const highCount = useMemo(
    () => systemWideActiveAlerts.filter((a) => a.severity === 'HIGH').length,
    [systemWideActiveAlerts]
  );

  const overallStatus = riskLevelToStatus(riskLevel);

  // Latest self-assessment for active astronaut
  const latestAssessment = useMemo(
    () =>
      SEED_SELF_ASSESSMENTS.find((s) => s.astronaut_id === selectedAstronautId) ||
      SEED_SELF_ASSESSMENTS[0],
    [selectedAstronautId]
  );

  // Out-of-range lab biomarkers
  const abnormalLabs = useMemo(
    () => SEED_LAB_BIOMARKERS.filter((l) => l.is_abnormal),
    []
  );

  return (
    <PageContainer>
      {/* ── Page Header ── */}
      <PageHeader
        title={
          currentRole === 'ASTRONAUT'
            ? `Mission Health Overview // ${currentUser.name}`
            : currentRole === 'MEDICAL_OFFICER'
            ? 'Flight Surgeon Triage & Clinical Operations'
            : 'Mission Commander Biological Readiness Monitor'
        }
        subtitle={
          currentRole === 'ASTRONAUT'
            ? 'Individual physiological baseline envelope, daily self-check, and personal countermeasures'
            : currentRole === 'MEDICAL_OFFICER'
            ? 'Crew health triage matrix, diagnostic laboratory assays, and emergency medical protocols'
            : 'Deep space operational telemetry, EVA clearance status, and environmental life support'
        }
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator status={overallStatus} label={`STATUS ${overallStatus}`} />
            <span
              className={`flex items-center space-x-1 font-mono text-[10px] px-2.5 py-0.5 rounded-lg border ${
                isOffline
                  ? 'text-[#F3BB57] border-[#F3BB57]/40 bg-[#F3BB57]/10'
                  : isStreaming
                  ? 'text-[#21E6D0] border-[#21E6D0]/40 bg-[#21E6D0]/10'
                  : 'text-[#8CA8A0] border-[rgba(55,210,185,0.18)] bg-[#0A1715]'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3 h-3 text-[#F3BB57]" />
                  <span>OFFLINE BUFFER ({pendingQueue.length})</span>
                </>
              ) : isStreaming ? (
                <>
                  <Wifi className="w-3 h-3 text-[#21E6D0]" />
                  <span>LIVE TELEMETRY</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>STANDBY</span>
                </>
              )}
            </span>
          </div>
        }
        metadata={[
          { label: 'Mission', value: 'ARES-VI (Transit)' },
          { label: 'Role Clearance', value: currentRole.replace(/_/g, ' ') },
          { label: 'Active Subject', value: selectedAstronautId },
          { label: 'Risk State', value: riskLevel },
        ]}
      />

      {/* ── 3D Earth Dashboard Hero Panel ── */}
      <div className="relative rounded-2xl cyber-glass-glow border border-[#21E6D0]/30 overflow-hidden p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1715] border border-[#21E6D0]/30 font-mono text-[9px] uppercase font-bold text-[#8BFFE9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#21E6D0] animate-pulse" />
              <span>ARES-VI // ORBITAL BIOMETRICS & FLIGHT INTELLIGENCE</span>
            </div>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#E8F4F0] tracking-tight">
              PERSONAL HEALTH COMMAND CENTER
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#8CA8A0] leading-relaxed">
              Real-time physiological telemetry, individualized biological envelopes (μ ± 2σ), and autonomous diagnostic surveillance during Sol 142 cruise to Mars.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#030A09]/80 border border-[#21E6D0]/25 font-mono text-[10px] text-[#21E6D0]">
                READINESS: 96.4% NOMINAL
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#030A09]/80 border border-[#21E6D0]/25 font-mono text-[10px] text-[#8BFFE9]">
                RESTING HR: 64 BPM
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#030A09]/80 border border-[#21E6D0]/25 font-mono text-[10px] text-[#21E6D0]">
                SLEEP: 7.8H AVG
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#030A09]/80 border border-[#21E6D0]/25 font-mono text-[10px] text-[#F3BB57]">
                DOSIMETRY: 48.6 mSv
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[380px] h-[220px] relative shrink-0 rounded-xl overflow-hidden border border-[#21E6D0]/20">
            <CyberEarth3D className="min-h-[220px]" interactive={true} />
          </div>
        </div>
      </div>

      {/* ── Role Persona Banner ── */}
      <div className="p-4 bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-cyberCard">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#0A1715] border border-[#21E6D0]/30 rounded-xl text-[#21E6D0]">
            {currentRole === 'ASTRONAUT' ? (
              <UserCheck className="w-4 h-4" />
            ) : currentRole === 'MEDICAL_OFFICER' ? (
              <Stethoscope className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-[#E8F4F0] uppercase tracking-wide">
              AUTHENTICATED AS {currentUser.name} ({currentUser.callsign})
            </div>
            <div className="font-mono text-[10px] text-[#8CA8A0] mt-0.5">
              {currentRole === 'ASTRONAUT'
                ? 'Astronaut Self-Monitoring Mode · Personal Health Twin & Countermeasures Active'
                : currentRole === 'MEDICAL_OFFICER'
                ? 'Clinical Authority Active · Full Medical Envelopes & Emergency Protocol Authorizations Unlocked'
                : 'Mission Command Mode · High-Level Crew Readiness & Environmental Telemetry Displayed'}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[10px]">
          <span className="text-[#57766D]">CLEARANCE:</span>
          <span className="px-2 py-0.5 bg-[#0A1715] border border-[#21E6D0]/30 rounded-lg text-[#21E6D0] font-bold">
            {currentRole}
          </span>
        </div>
      </div>

      {/* ── Metric Strip (Role-Weighted) ── */}
      {currentRole === 'ASTRONAUT' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricDisplay
            label="Personal Resting HR"
            value="64"
            unit="BPM"
            trend="flat"
            delta="0"
            status="NOMINAL"
            icon={Heart}
            subtext="WITHIN 30-DAY BASELINE (μ=64)"
          />
          <MetricDisplay
            label="Arterial SpO2"
            value="98.4"
            unit="%"
            trend="flat"
            delta="+0.1"
            status="NOMINAL"
            icon={Activity}
            subtext="OPTIMAL PULMONARY OXYGENATION"
          />
          <MetricDisplay
            label="Daily Self-Check"
            value="COMPLETED"
            unit="SOL 142"
            status="NOMINAL"
            icon={CheckCircle2}
            subtext="FATIGUE 2/10 · SLEEP 7.5H"
          />
          <MetricDisplay
            label="Health Twin Envelope"
            value="NOMINAL"
            unit="0 ALERTS"
            status="NOMINAL"
            icon={Dna}
            subtext="ALL 7 BIOMARKERS IN ±2σ RANGE"
          />
        </div>
      ) : currentRole === 'MEDICAL_OFFICER' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricDisplay
            label="Crew Composite Risk"
            value={compositeScore.toFixed(0)}
            unit="/ 100"
            trend={compositeScore > 40 ? 'up' : 'flat'}
            delta={compositeScore > 40 ? `+${(compositeScore - 25).toFixed(0)}` : '0'}
            status={overallStatus}
            icon={Activity}
            subtext={`CREW TRIAGE: ${riskLevel}`}
          />
          <MetricDisplay
            label="Active Clinical Alerts"
            value={String(systemWideActiveAlerts.length)}
            unit={criticalCount > 0 ? 'CRITICAL' : 'TRIAGE'}
            status={criticalCount > 0 ? 'CRITICAL' : systemWideActiveAlerts.length > 0 ? 'CAUTION' : 'NOMINAL'}
            icon={AlertTriangle}
            subtext={systemWideActiveAlerts.length === 0 ? 'ALL VITALS STABLE' : `${criticalCount} CRITICAL, ${highCount} HIGH`}
          />
          <MetricDisplay
            label="In-Flight Lab Assays"
            value={String(abnormalLabs.length)}
            unit="OUT-OF-RANGE"
            status={abnormalLabs.length > 0 ? 'CAUTION' : 'NOMINAL'}
            icon={Thermometer}
            subtext={`${SEED_LAB_BIOMARKERS.length} TOTAL BIOMARKERS LOGGED`}
          />
          <MetricDisplay
            label="Emergency Protocol Readiness"
            value="100"
            unit="%"
            status="NOMINAL"
            icon={ShieldAlert}
            subtext="4 APPROVED PROTOCOLS AVAILABLE"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricDisplay
            label="Crew Mission Readiness"
            value="96.4"
            unit="%"
            trend="up"
            delta="+0.8%"
            status="NOMINAL"
            icon={ShieldCheck}
            subtext="4/4 CREW CLEARED FOR EVA"
          />
          <MetricDisplay
            label="Cumulative Radiation"
            value="48.6"
            unit="mSv"
            trend="up"
            delta="+0.04"
            status="NOMINAL"
            icon={Radio}
            subtext="19.4% OF 250 mSv 30-DAY LIMIT"
          />
          <MetricDisplay
            label="Cabin Life Support (ECLSS)"
            value="101.3"
            unit="kPa"
            status="NOMINAL"
            icon={Layers}
            subtext="pO2: 21.0 kPa · pCO2: 0.28 kPa"
          />
          <MetricDisplay
            label="Cognitive Readiness"
            value="88.2"
            unit="/ 100"
            status="NOMINAL"
            icon={Zap}
            subtext="AGGREGATED CREW SLEEP SYNC"
          />
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* ASTRONAUT SPECIFIC CONTENT */}
          {currentRole === 'ASTRONAUT' && (
            <>
              {/* Daily Self-Assessment Spotlight */}
              <DossierCard
                title="DAILY SELF-ASSESSMENT // FLIGHT CHECK-IN"
                subtitle="SOL 142 CIRCADIAN CHECK-IN LOG"
                badge={<StatusIndicator status="NOMINAL" label="VERIFIED" size="sm" />}
              >
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#E8F4F0]">
                        TODAY'S RECORD SUBMITTED · MET 142d 07:15
                      </div>
                      <div className="text-xs text-[#8CA8A0] mt-1.5">
                        Physical fatigue: <span className="font-bold text-[#E8F4F0]">2/10 (Mild)</span> · Sleep duration:{' '}
                        <span className="font-bold text-[#E8F4F0]">7.5 hours</span> · SANS visual disturbance:{' '}
                        <span className="font-bold text-[#21E6D0]">None</span>
                      </div>
                      {latestAssessment.notes && (
                        <div className="mt-2 text-xs text-[#8CA8A0] italic bg-[#0D1E1A] p-2.5 border border-[rgba(55,210,185,0.18)] rounded-lg">
                          "{latestAssessment.notes}"
                        </div>
                      )}
                    </div>
                    <Link
                      to={ROUTES.SELF_ASSESSMENT}
                      className="px-3.5 py-2 text-xs font-mono font-bold bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl transition-all flex items-center space-x-1.5 shrink-0 shadow-cyberGlow"
                    >
                      <span>OPEN LOG</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">FATIGUE SCORE</div>
                      <div className="text-sm font-bold text-[#21E6D0] mt-1">2 / 10</div>
                    </div>
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">SLEEP QUALITY</div>
                      <div className="text-sm font-bold text-[#21E6D0] mt-1">85%</div>
                    </div>
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">APPETITE / HYDRATION</div>
                      <div className="text-sm font-bold text-[#21E6D0] mt-1">NOMINAL</div>
                    </div>
                  </div>
                </div>
              </DossierCard>

              {/* Personal Health Twin Baseline Summary */}
              <DossierCard
                title="PERSONAL HEALTH TWIN // 30-DAY STATISTICAL ENVELOPE"
                subtitle="MARCUS CHEN (ASTRO-01) · 5-POINT BIOLOGICAL DEVIATION MONITOR"
                badge={
                  <Link
                    to={ROUTES.HEALTH_TWIN}
                    className="font-mono text-xs text-[#21E6D0] hover:underline flex items-center space-x-1"
                  >
                    <span>FULL TWIN VIEW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                }
              >
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">RESTING HR</div>
                      <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">64 BPM</div>
                      <div className="text-[9px] text-[#21E6D0]">BASELINE 60–68</div>
                    </div>
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">BLOOD PRESSURE</div>
                      <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">114/74</div>
                      <div className="text-[9px] text-[#21E6D0]">BASELINE 110–120</div>
                    </div>
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">BLOOD SpO2</div>
                      <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">98.4%</div>
                      <div className="text-[9px] text-[#21E6D0]">BASELINE 97–99%</div>
                    </div>
                    <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                      <div className="text-[10px] text-[#57766D] uppercase">CORE TEMP</div>
                      <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">36.8°C</div>
                      <div className="text-[9px] text-[#21E6D0]">BASELINE 36.6–37.1</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A1715] border border-[#21E6D0]/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#21E6D0]" />
                      <span className="text-[#E8F4F0] font-bold text-xs">
                        NO MULTI-SIGMA DEVIATIONS DETECTED TODAY
                      </span>
                    </div>
                    <span className="text-[10px] text-[#21E6D0] font-mono">μ ± 2.0σ IN BOUNDS</span>
                  </div>
                </div>
              </DossierCard>
            </>
          )}

          {/* MEDICAL OFFICER SPECIFIC CONTENT */}
          {currentRole === 'MEDICAL_OFFICER' && (
            <>
              {/* Emergency Protocol Quick-Launcher */}
              <DossierCard
                title="SPACE MEDICAL EMERGENCY PROTOCOLS // QUICK-LAUNCH"
                subtitle="APPROVED NASA-MED INTERVENTION CHECKLISTS"
                badge={<StatusIndicator status="NOMINAL" label="4 READY" size="sm" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SEED_MEDICAL_PROTOCOLS.map((protocol) => (
                    <div
                      key={protocol.id}
                      className="p-3.5 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl hover:border-[#21E6D0]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#8CA8A0]">
                            {protocol.code}
                          </span>
                          <span
                            className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border ${
                              protocol.severity === 'CRITICAL'
                                ? 'bg-[#FF6475]/15 text-[#FF6475] border-[#FF6475]/40 font-bold'
                                : 'bg-[#F3BB57]/15 text-[#F3BB57] border-[#F3BB57]/40 font-bold'
                            }`}
                          >
                            {protocol.severity}
                          </span>
                        </div>
                        <h4 className="font-space text-xs font-bold text-[#E8F4F0] mt-1.5">
                          {protocol.title}
                        </h4>
                        <p className="text-[11px] text-[#8CA8A0] mt-1 line-clamp-2">
                          {protocol.indications[0] || 'NASA Clinical Intervention Protocol'}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[rgba(55,210,185,0.15)] flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#57766D]">
                          {protocol.steps.length} CHECKS
                        </span>
                        <Link
                          to={ROUTES.EMERGENCY}
                          className="font-mono text-xs font-bold text-[#FF6475] hover:underline flex items-center space-x-1"
                        >
                          <span>EXECUTE CHECKLIST</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              {/* In-Flight Biomarker Laboratory Highlights */}
              <DossierCard
                title="IN-FLIGHT BIOMARKER LABORATORY STATUS"
                subtitle="RECENT PICR / DRIED BLOOD SPOT / SPECTROMETRY ASSAYS"
                badge={
                  <Link
                    to={ROUTES.LABORATORY}
                    className="font-mono text-xs text-[#21E6D0] hover:underline flex items-center space-x-1"
                  >
                    <span>FULL LAB BENCH</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(55,210,185,0.18)] text-[#57766D] text-[10px]">
                        <th className="py-2.5">ASSAY</th>
                        <th className="py-2.5">CATEGORY</th>
                        <th className="py-2.5">VALUE</th>
                        <th className="py-2.5">REFERENCE</th>
                        <th className="py-2.5 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(55,210,185,0.1)]">
                      {SEED_LAB_BIOMARKERS.slice(0, 4).map((lab) => (
                        <tr key={lab.id} className="hover:bg-[#0A1715]/60 transition-colors">
                          <td className="py-2.5 font-bold text-[#E8F4F0]">{lab.biomarker_name}</td>
                          <td className="py-2.5 text-[#8CA8A0] text-[11px]">{lab.category}</td>
                          <td className="py-2.5 font-bold text-[#E8F4F0]">
                            {lab.observed_value} {lab.unit}
                          </td>
                          <td className="py-2.5 text-[#8CA8A0] text-[11px]">
                            {lab.reference_low}–{lab.reference_high} {lab.unit}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-lg border text-[9px] ${
                                lab.is_abnormal
                                  ? 'bg-[#F3BB57]/15 text-[#F3BB57] border-[#F3BB57]/40 font-bold'
                                  : 'bg-[#21E6D0]/15 text-[#21E6D0] border-[#21E6D0]/40 font-bold'
                              }`}
                            >
                              {lab.is_abnormal ? 'ABNORMAL' : 'NOMINAL'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DossierCard>
            </>
          )}

          {/* MISSION COMMANDER SPECIFIC CONTENT */}
          {(currentRole === 'MISSION_CONTROLLER' || currentRole === 'MISSION_COMMANDER') && (
            <>
              {/* Mission Operational Readiness Grid */}
              <DossierCard
                title="ARES-VI OPERATIONAL READINESS & EVA CLEARANCE"
                subtitle="SCHEDULED EVA SOL 144 // JEZERO CRATER CORE DRILL"
                badge={<StatusIndicator status="NOMINAL" label="ALL CLEARED" size="sm" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {SEED_ASTRONAUTS.map((astro) => (
                    <div
                      key={astro.id}
                      className="p-3.5 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#E8F4F0] text-xs">
                          {astro.profile?.full_name}
                        </div>
                        <div className="text-[10px] text-[#8CA8A0] mt-0.5">
                          {astro.profile?.callsign} · {astro.badge_number}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-[#21E6D0]/15 text-[#21E6D0] border border-[#21E6D0]/40 rounded-lg text-[10px] font-bold">
                          FIT FOR EVA
                        </span>
                        <div className="text-[9px] text-[#57766D] mt-1">RESTING HR: {astro.baseline_resting_hr}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              {/* Environmental Life Support Telemetry (ECLSS) */}
              <DossierCard
                title="CABIN ENVIRONMENTAL LIFE SUPPORT (ECLSS)"
                subtitle="ATMOSPHERIC AND LIFE HABITAT TELEMETRY // MARS TRANSIT VEHICLE"
                badge={<StatusIndicator status="NOMINAL" label="OPTIMAL" size="sm" />}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                    <div className="text-[10px] text-[#57766D] uppercase">CABIN PRESSURE</div>
                    <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">101.3 kPa</div>
                    <div className="text-[9px] text-[#21E6D0]">1.00 ATM (NOMINAL)</div>
                  </div>
                  <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                    <div className="text-[10px] text-[#57766D] uppercase">OXYGEN PARTIAL (pO2)</div>
                    <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">21.0 kPa</div>
                    <div className="text-[9px] text-[#21E6D0]">NORMOBARIC 20.9%</div>
                  </div>
                  <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                    <div className="text-[10px] text-[#57766D] uppercase">CO2 PARTIAL (pCO2)</div>
                    <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">0.28 kPa</div>
                    <div className="text-[9px] text-[#21E6D0]">&lt; 0.40 kPa TARGET</div>
                  </div>
                  <div className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl">
                    <div className="text-[10px] text-[#57766D] uppercase">WATER RECYCLE</div>
                    <div className="font-bold text-[#E8F4F0] text-sm mt-0.5">98.4%</div>
                    <div className="text-[9px] text-[#21E6D0]">ECLSS PURIFIER STABLE</div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl flex items-center space-x-2 text-xs text-[#8CA8A0]">
                  <Lock className="w-3.5 h-3.5 text-[#57766D] shrink-0" />
                  <span className="font-mono text-[10px]">
                    <strong className="text-[#E8F4F0]">CONFIDENTIALITY ENFORCED:</strong> Individual psychological
                    journals and private wellness disclosures are masked for Mission Command per NASA STD-3001.
                  </span>
                </div>
              </DossierCard>
            </>
          )}

          {/* Module Navigation Grid for All Roles */}
          <DossierCard
            title="MISSION HEALTH MODULES CATALOG"
            subtitle="INTEGRATED NASA BIOMEDICAL SUITE"
            badge={<StatusIndicator status="NOMINAL" label="ALL ACTIVE" size="sm" />}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              {[
                { label: 'HEALTH TWIN', route: ROUTES.HEALTH_TWIN, icon: Dna, sub: 'Baseline Envelopes' },
                { label: 'DAILY CHECK-IN', route: ROUTES.SELF_ASSESSMENT, icon: CheckCircle2, sub: 'Self-Assessments' },
                { label: 'EMERGENCY PROTOCOLS', route: ROUTES.EMERGENCY, icon: ShieldAlert, sub: 'NASA-MED Checklists' },
                { label: 'LABORATORY ASSAYS', route: ROUTES.LABORATORY, icon: Thermometer, sub: 'Biomarkers & Assays' },
                { label: 'NASA RESEARCH', route: ROUTES.RESEARCH, icon: FileText, sub: 'OSDR / HRP Evidence' },
                { label: 'SIMULATOR & WHAT-IF', route: ROUTES.SIMULATION, icon: Sliders, sub: 'Multi-Stressor Sandbox' },
              ].map(({ label, route, icon: Icon, sub }) => (
                <Link
                  key={route}
                  to={route}
                  className="p-3.5 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl hover:border-[#21E6D0]/50 hover:bg-[#0C2521] transition-all group shadow-cyberCard"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-[#21E6D0]" />
                    <ArrowRight className="w-3.5 h-3.5 text-[#8CA8A0] group-hover:text-[#21E6D0] transition-colors" />
                  </div>
                  <div className="mt-2.5 font-bold text-[#E8F4F0] text-xs">{label}</div>
                  <div className="text-[10px] text-[#57766D] mt-0.5">{sub}</div>
                </Link>
              ))}
            </div>
          </DossierCard>
        </div>

        {/* Right Column: Crew Biometrics & Triage Queue */}
        <div className="space-y-6">
          {/* Crew Biometric Roster */}
          <DossierCard
            title="CREW BIOMETRIC ROSTER"
            subtitle={`${astronauts.length} CREW MEMBERS MANIFESTED`}
            badge={<StatusIndicator status={overallStatus} label={`${astronauts.length} ACTIVE`} size="sm" />}
          >
            <div className="space-y-2 font-mono text-xs">
              {SEED_ASTRONAUTS.map((astronaut) => {
                const isSelected = astronaut.id === selectedAstronautId;
                return (
                  <button
                    key={astronaut.id}
                    onClick={() => {
                      setSelectedAstronautId(astronaut.id);
                    }}
                    className={`w-full p-3 border rounded-xl flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-[#10251F] border-[#21E6D0] shadow-cyberGlow'
                        : 'bg-[#0A1715] border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 hover:bg-[#0D1E1A]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#E8F4F0] text-xs">
                        {astronaut.profile?.full_name}
                      </div>
                      <div className="text-[10px] text-[#8CA8A0] mt-0.5">
                        {astronaut.profile?.callsign} // {astronaut.id}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <StatusIndicator status={isSelected ? overallStatus : 'NOMINAL'} size="sm" />
                      {isSelected && (
                        <span className="text-[9px] text-[#21E6D0] font-bold">MONITORED</span>
                      )}
                    </div>
                  </button>
                );
              })}
              <Link
                to={ROUTES.ASTRONAUTS}
                className="mt-2.5 flex items-center justify-center space-x-1.5 text-xs text-[#8CA8A0] hover:text-[#21E6D0] border border-[rgba(55,210,185,0.18)] rounded-xl py-2 hover:border-[#21E6D0]/40 transition-colors"
              >
                <span>FULL CREW DOSSIERS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </DossierCard>

          {/* Active Triage Queue */}
          <DossierCard
            title="ACTIVE TRIAGE QUEUE"
            subtitle={`${systemWideActiveAlerts.length} UNRESOLVED INCIDENTS`}
            badge={
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-lg border bg-[#FF6475]/15 text-[#FF6475] border-[#FF6475]/40 font-bold">
                {criticalCount > 0 ? `${criticalCount} CRITICAL` : 'ATTENTION'}
              </span>
            }
          >
            <div className="space-y-2">
              {systemWideActiveAlerts.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#8CA8A0] font-mono bg-[#0A1715] rounded-xl border border-[rgba(55,210,185,0.15)]">
                  All physiological telemetry is within nominal tolerance envelopes.
                </div>
              ) : (
                systemWideActiveAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-[#0A1715] border border-[rgba(55,210,185,0.18)] rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#E8F4F0] truncate pr-1">
                        {alert.rule_code.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.5 rounded border flex-shrink-0 ${
                          alert.severity === 'CRITICAL'
                            ? 'text-[#FF6475] border-[#FF6475]/40 bg-[#FF6475]/10 font-bold'
                            : alert.severity === 'HIGH'
                            ? 'text-[#F3BB57] border-[#F3BB57]/40 bg-[#F3BB57]/10 font-bold'
                            : 'text-[#F3BB57] border-[#F3BB57]/40 bg-[#F3BB57]/10'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#8CA8A0] mt-1 truncate">
                      {alert.astronaut_id} · {alert.triggering_value}
                    </div>
                  </div>
                ))
              )}

              <Link
                to={ROUTES.ALERTS}
                className="mt-2.5 flex items-center justify-center space-x-1.5 text-xs text-[#FF6475] hover:text-[#FF6475]/80 border border-[#FF6475]/30 rounded-xl py-2 hover:border-[#FF6475]/50 transition-colors font-mono"
              >
                <span>OPEN TRIAGE CONSOLE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </DossierCard>

          {/* Quick Aerospace Report Launcher */}
          <DossierCard
            title="AEROSPACE MEDICAL REPORTS"
            subtitle="NASA-STD-3001 COMPLIANT TELEMETRY DOSSIERS"
            badge={<FileText className="w-4 h-4 text-[#21E6D0]" />}
          >
            <div className="space-y-3 font-mono text-xs">
              <p className="text-[11px] text-[#8CA8A0] leading-relaxed">
                Generate and print standardized aerospace health reports for flight surgeons and flight directors.
              </p>
              <Link
                to={ROUTES.REPORTS}
                className="w-full py-2.5 bg-[#0A1715] border border-[rgba(55,210,185,0.25)] hover:border-[#21E6D0] text-[#E8F4F0] rounded-xl flex items-center justify-center space-x-2 transition-all font-bold text-xs shadow-cyberCard"
              >
                <FileText className="w-3.5 h-3.5 text-[#21E6D0]" />
                <span>OPEN REPORTS ENGINE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </DossierCard>
        </div>
      </div>
    </PageContainer>
  );
};
