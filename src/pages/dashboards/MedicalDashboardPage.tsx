import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { CyberEarth3D } from '@/components/3d/CyberEarth3D';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import {
  SEED_ASTRONAUTS,
  SEED_LAB_BIOMARKERS,
  SEED_MEDICAL_PROTOCOLS,
} from '@/data/seedData';
import {
  Activity,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Thermometer,
  FileText,
  Search,
  Stethoscope,
} from 'lucide-react';

export const MedicalDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { systemWideActiveAlerts } = useHealthAnalytics('ASTRO-01');

  const [selectedCrewId, setSelectedCrewId] = useState<string>('ASTRO-01');
  const [protocolQuery, setProtocolQuery] = useState('');

  // AI Copilot state
  const [copilotSummary, setCopilotSummary] = useState<string>(
    'Clinical Copilot ready. Ares-VI crew physiological telemetry is stable. ASTRO-01 (Cmdr. Chen) resting heart rate and arterial SpO2 are within calibrated 30-day baseline envelopes. No acute hypoxia or ventricular ectopy detected.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSynthesizeSummary = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setCopilotSummary(
        `Clinical Evaluation Update [MET 142d 08:45]: Analysis of 4 crew members indicates nominal microgravity adaptation. Serum hs-CRP and IL-6 assays show mild subclinical inflammatory shifts consistent with long-duration transit. All crew are cleared for scheduled Sol 144 extravehicular operations.`
      );
      setIsSynthesizing(false);
    }, 600);
  };

  const filteredProtocols = SEED_MEDICAL_PROTOCOLS.filter(
    (p) =>
      p.title.toLowerCase().includes(protocolQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(protocolQuery.toLowerCase())
  );

  return (
    <PageContainer>
      {/* Top Banner & Header */}
      <PageHeader
        title="FLIGHT MEDICAL OPERATIONS CENTER"
        subtitle="Welcome, Dr. Sarah Vance. Crew medical monitoring and clinical intervention systems are ready."
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator status="NOMINAL" label="CREW HEALTH NOMINAL" />
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 font-bold">
              SURG-02 · FLIGHT SURGEON
            </span>
          </div>
        }
        metadata={[
          { label: 'Officer', value: currentUser?.name || 'Dr. Sarah Vance' },
          { label: 'Assigned Crew', value: '4 Astronauts' },
          { label: 'Active Alerts', value: `${systemWideActiveAlerts.length} Alerts` },
          { label: 'Lab Status', value: 'All Panels Current' },
        ]}
      />

      {/* ── 3D Hero Panel: Medical Operations Center ── */}
      <div className="relative rounded-2xl cyber-glass-glow border border-[#24E6D0]/30 overflow-hidden p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#071311] border border-[#24E6D0]/30 font-mono text-[9px] uppercase font-bold text-[#8BFFE9]">
              <Stethoscope className="w-3.5 h-3.5 text-[#24E6D0]" />
              <span>CLINICAL OPERATIONS // FLIGHT SURGEON DECK</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F4FAF8] tracking-tight">
              ARES-VI CREW HEALTH TRIAGE CENTER
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#91A9A4] leading-relaxed">
              Consolidated medical oversight across all 4 crew members, real-time vital sign telemetry, biomarker assay intelligence, and authoritative emergency protocols.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#24E6D0]">
                4 OF 4 CREW MONITORED
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#8BFFE9]">
                0 ACTIVE CRITICAL INCIDENTS
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#F5B94C]">
                1 REVIEW PENDING (SANS)
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[380px] h-[220px] relative shrink-0 rounded-xl overflow-hidden border border-[#24E6D0]/20">
            <CyberEarth3D className="min-h-[220px]" interactive={true} />
          </div>
        </div>
      </div>

      {/* ── Widget A: Crew Health Overview ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricDisplay
          label="Total Assigned Crew"
          value="4"
          unit="ASTRONAUTS"
          status="NOMINAL"
          icon={Users}
          subtext="100% TELEMETRY ACTIVE"
        />
        <MetricDisplay
          label="Requiring Review"
          value="1"
          unit="CREW MEMBER"
          status="CAUTION"
          icon={AlertTriangle}
          subtext="ASTRO-03 (POST-EVA SANS)"
        />
        <MetricDisplay
          label="Active Medical Alerts"
          value={String(systemWideActiveAlerts.length)}
          unit={systemWideActiveAlerts.length === 0 ? 'NOMINAL' : 'TRIAGE'}
          status={systemWideActiveAlerts.length === 0 ? 'NOMINAL' : 'CAUTION'}
          icon={Activity}
          subtext="0 CRITICAL ALERTS"
        />
        <MetricDisplay
          label="Pending Lab Assays"
          value="2"
          unit="UNDER REVIEW"
          status="NOMINAL"
          icon={Thermometer}
          subtext="DRIED BLOOD SPOT CART B"
        />
      </div>

      {/* ── Main Clinical Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Triage Matrix, Lab Intelligence, Emergency Center */}
        <div className="lg:col-span-8 space-y-6">
          {/* Widget B: Crew Triage Matrix */}
          <DossierCard
            title="CREW BIOMETRIC TRIAGE MATRIX"
            subtitle="AUTHORIZATION FILTER: ARES-VI FLIGHT MANIFEST"
            badge={<StatusIndicator status="NOMINAL" label="4 MONITORED" size="sm" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#24E6D0]/18 text-[10px] text-[#5B7B75]">
                    <th className="py-2.5">ASTRONAUT</th>
                    <th className="py-2.5">ROLE</th>
                    <th className="py-2.5">LATEST VITALS</th>
                    <th className="py-2.5">HEALTH STATUS</th>
                    <th className="py-2.5">LAST CHECK-IN</th>
                    <th className="py-2.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24E6D0]/15">
                  {SEED_ASTRONAUTS.map((astro) => {
                    const isSelected = astro.id === selectedCrewId;
                    return (
                      <tr
                        key={astro.id}
                        className={`hover:bg-[#071311] transition-colors ${
                          isSelected ? 'bg-[#24E6D0]/10' : ''
                        }`}
                      >
                        <td className="py-2.5 font-bold text-[#F4FAF8]">
                          {astro.profile?.full_name}
                          <span className="block text-[10px] text-[#5B7B75] font-normal">
                            {astro.id} · {astro.badge_number}
                          </span>
                        </td>
                        <td className="py-2.5 text-[#91A9A4] text-[11px]">
                          {astro.profile?.callsign}
                        </td>
                        <td className="py-2.5 text-[#F4FAF8] text-[11px]">
                          HR: {astro.baseline_resting_hr} · SpO2: {astro.baseline_spo2}%
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-sm border text-[9px] font-bold bg-[#24E6D0]/15 text-[#24E6D0] border-[#24E6D0]/30">
                            FIT FOR DUTY
                          </span>
                        </td>
                        <td className="py-2.5 text-[#91A9A4] text-[10px]">
                          Sol 142 (Nominal)
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCrewId(astro.id)}
                            className="text-[10px] text-[#24E6D0] hover:text-[#8BFFE9] font-bold"
                          >
                            Select Dossier
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DossierCard>

          {/* Widget D: Laboratory Intelligence */}
          <DossierCard
            title="IN-FLIGHT BIOMARKER LABORATORY INTELLIGENCE"
            subtitle="BIO-ANALYZER MICRO-ASSAYS // CYTOKINE & DNA OXIDATIVE DAMAGE"
            badge={
              <Link to={ROUTES.LABORATORY} className="font-mono text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1">
                <span>OPEN LAB BENCH</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
              {SEED_LAB_BIOMARKERS.slice(0, 5).map((lab) => (
                <div key={lab.id} className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#5B7B75] block truncate" title={lab.biomarker_name}>
                    {lab.biomarker_name}
                  </span>
                  <div className="text-sm font-bold text-[#F4FAF8]">
                    {lab.observed_value} {lab.unit}
                  </div>
                  <div className="text-[9px] text-[#91A9A4]">
                    Ref: {lab.reference_low}–{lab.reference_high}
                  </div>
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded-sm border text-[8px] font-bold ${
                      lab.is_abnormal
                        ? 'bg-[#F5B94C]/15 text-[#F5B94C] border-[#F5B94C]/30'
                        : 'bg-[#24E6D0]/15 text-[#24E6D0] border-[#24E6D0]/30'
                    }`}
                  >
                    {lab.is_abnormal ? 'ELEVATED' : 'NOMINAL'}
                  </span>
                </div>
              ))}
            </div>
          </DossierCard>

          {/* Widget F: Emergency Protocol Center */}
          <DossierCard
            title="SPACE MEDICAL EMERGENCY PROTOCOL CENTER"
            subtitle="CURATED NASA-MED CLINICAL INTERVENTION CHECKLISTS"
            badge={
              <Link to={ROUTES.EMERGENCY} className="font-mono text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1">
                <span>FULL PROTOCOL SUITE</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#5B7B75]" />
                <input
                  type="text"
                  value={protocolQuery}
                  onChange={(e) => setProtocolQuery(e.target.value)}
                  placeholder="Search emergency checklists e.g. Hypoxia, Cardiac, DCS..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#071311] border border-[#24E6D0]/20 rounded-xl text-xs text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProtocols.slice(0, 4).map((protocol) => (
                  <div key={protocol.id} className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-[#91A9A4]">{protocol.code}</span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-[#FF646E]/15 text-[#FF646E] border border-[#FF646E]/30 font-bold text-[9px]">
                          {protocol.severity}
                        </span>
                      </div>
                      <h4 className="font-display text-xs font-bold text-[#F4FAF8] mt-1">
                        {protocol.title}
                      </h4>
                      <p className="text-[10px] text-[#91A9A4] mt-1 line-clamp-1">
                        {protocol.indications[0]}
                      </p>
                    </div>
                    <Link
                      to={ROUTES.EMERGENCY}
                      className="mt-3 pt-2 border-t border-[#24E6D0]/15 text-[11px] font-bold text-[#24E6D0] hover:text-[#8BFFE9] flex items-center justify-between"
                    >
                      <span>Execute Checklist ({protocol.steps.length} checks)</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </DossierCard>
        </div>

        {/* Right Column (4 cols): AI Copilot, Alerts, Health Twin Analysis, Reports */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget G: AI Clinical Copilot */}
          <DossierCard
            title="AI CLINICAL COPILOT"
            subtitle="DETERMINISTIC TELEMETRY SYNTHESIS"
            badge={<Sparkles className="w-4 h-4 text-[#8BFFE9]" />}
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl font-body text-xs text-[#91A9A4] leading-relaxed">
                {copilotSummary}
              </div>
              <button
                type="button"
                onClick={handleSynthesizeSummary}
                disabled={isSynthesizing}
                className="w-full py-2 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-cyberGlow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSynthesizing ? 'SYNTHESIZING TELEMETRY...' : 'Re-Synthesize Clinical Summary'}</span>
              </button>
            </div>
          </DossierCard>

          {/* Widget C: Medical Alerts */}
          <DossierCard
            title="ACTIVE MEDICAL ALERTS"
            subtitle={`${systemWideActiveAlerts.length} FLIGHT INCIDENTS REGISTERED`}
            badge={
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 font-bold">
                TRIAGE NOMINAL
              </span>
            }
          >
            <div className="space-y-2 font-mono text-xs">
              {systemWideActiveAlerts.length === 0 ? (
                <div className="p-3 text-center text-[#91A9A4] bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  All active telemetry channels are within individual and collective tolerance bands.
                </div>
              ) : (
                systemWideActiveAlerts.map((alert) => (
                  <div key={alert.id} className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-[#F4FAF8]">{alert.rule_code}</span>
                      <span className="px-1.5 py-0.2 rounded-sm bg-[#F5B94C]/15 text-[#F5B94C] border border-[#F5B94C]/30">
                        {alert.severity}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#91A9A4]">
                      Subject: {alert.astronaut_id} · Trigger: {alert.triggering_value}
                    </div>
                  </div>
                ))
              )}
              <Link to={ROUTES.ALERTS} className="text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1 pt-1">
                <span>Manage Alert Registry →</span>
              </Link>
            </div>
          </DossierCard>

          {/* Widget H: Medical Reports */}
          <DossierCard
            title="AEROSPACE MEDICAL REPORTS"
            subtitle="7 DOWNLOADABLE NASA-STD-3001 DOSSIERS"
            badge={<FileText className="w-4 h-4 text-[#8BFFE9]" />}
          >
            <div className="space-y-2 font-mono text-xs">
              <p className="text-[11px] text-[#91A9A4]">
                Generate clinical briefs, weekly organ system evaluations, and radiation dosimetry dossiers.
              </p>
              <Link
                to={ROUTES.REPORTS}
                className="w-full py-2 bg-[#0A1716] hover:bg-[#071311] text-[#F4FAF8] border border-[#24E6D0]/30 hover:border-[#24E6D0] rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-cyberGlow"
              >
                <FileText className="w-3.5 h-3.5 text-[#24E6D0]" />
                <span>Open Aerospace Reports Engine</span>
              </Link>
            </div>
          </DossierCard>
        </div>
      </div>
    </PageContainer>
  );
};
