import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { CyberEarth3D } from '@/components/3d/CyberEarth3D';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { SEED_ASTRONAUTS, SEED_MISSION } from '@/data/seedData';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Layers,
  Lock,
  ArrowRight,
  FileText,
  Gauge,
  Orbit,
} from 'lucide-react';

export const CommanderDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <PageContainer>
      {/* Top Banner & Header */}
      <PageHeader
        title="MISSION COMMAND AND CREW READINESS"
        subtitle="Welcome, Director Gregory Hayes. Real-time orbital mission status and crew readiness overview."
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator status="NOMINAL" label="MISSION PHASE: CRUISE" />
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#F5B94C]/15 text-[#F5B94C] border border-[#F5B94C]/30 font-bold">
              DIR-05 · FLIGHT DIRECTOR
            </span>
          </div>
        }
        metadata={[
          { label: 'Director', value: currentUser?.name || 'Director Gregory Hayes' },
          { label: 'Mission', value: SEED_MISSION.code },
          { label: 'Destination', value: SEED_MISSION.target_destination },
          { label: 'Crew Manifest', value: `${SEED_ASTRONAUTS.length} Astronauts Manifested` },
        ]}
      />

      {/* ── 3D Hero Panel: Mission Control / Crew Readiness ── */}
      <div className="relative rounded-2xl cyber-glass-glow border border-[#24E6D0]/30 overflow-hidden p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#071311] border border-[#24E6D0]/30 font-mono text-[9px] uppercase font-bold text-[#8BFFE9]">
              <Orbit className="w-3.5 h-3.5 text-[#24E6D0]" />
              <span>MISSION CONTROL // CREW READINESS</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F4FAF8] tracking-tight">
              ARES-VI ORBITAL EXPEDITION COMMAND
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#91A9A4] leading-relaxed">
              Global mission trajectory, deep space radiation budget tracking against NASA PEL, and environmental biosensors across Sol 142 cruise.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#24E6D0]">
                READINESS: 96.4% NOMINAL
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#8BFFE9]">
                4/4 CREW CLEARED FOR EVA
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#020807]/80 border border-[#24E6D0]/20 font-mono text-[10px] text-[#F5B94C]">
                RADIATION: 19.4% OF 30D LIMIT
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[380px] h-[220px] relative shrink-0 rounded-xl overflow-hidden border border-[#24E6D0]/20">
            <CyberEarth3D className="min-h-[220px]" interactive={true} />
          </div>
        </div>
      </div>

      {/* ── Executive Metric Strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricDisplay
          label="Crew Readiness Index"
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
          subtext="19.4% OF 250 mSv 30D LIMIT"
        />
        <MetricDisplay
          label="ECLSS Atmospheric Purity"
          value="101.3"
          unit="kPa"
          status="NOMINAL"
          icon={Layers}
          subtext="pO2: 21.0 kPa · pCO2: 0.28 kPa"
        />
        <MetricDisplay
          label="Critical Incidents"
          value="0"
          unit="ACTIVE"
          status="NOMINAL"
          icon={ShieldAlert}
          subtext="NO MISSION COMPROMISE"
        />
      </div>

      {/* ── Main Executive Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Mission Overview, Readiness, Radiation, ECLSS */}
        <div className="lg:col-span-8 space-y-6">
          {/* Widget A: Mission Overview */}
          <DossierCard
            title="ARES-VI DEEP SPACE TRANSIT OVERVIEW"
            subtitle="TRANS-MARS INJECTION PHASE // SOL 142 OF 570"
            badge={<StatusIndicator status="NOMINAL" label="NOMINAL CRUISE" size="sm" />}
          >
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">MISSION CODE</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">{SEED_MISSION.code}</div>
                  <div className="text-[9px] text-[#91A9A4]">Ares Expedition VI</div>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">DESTINATION</div>
                  <div className="text-sm font-bold text-[#F4FAF8] mt-0.5">Jezero Crater</div>
                  <div className="text-[9px] text-[#91A9A4]">Mars Surface Base</div>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">MISSION ELAPSED</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">Sol 142</div>
                  <div className="text-[9px] text-[#91A9A4]">24.9% Completed</div>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <div className="text-[10px] text-[#5B7B75]">CREW COUNT</div>
                  <div className="text-base font-bold text-[#F4FAF8] mt-0.5">4 Active</div>
                  <div className="text-[9px] text-[#24E6D0]">100% Operational</div>
                </div>
              </div>
            </div>
          </DossierCard>

          {/* Widget B & F: Crew Readiness & Operational Availability */}
          <DossierCard
            title="CREW READINESS & OPERATIONAL CLEARANCE"
            subtitle="SCHEDULED EVA SOL 144 // JEZERO CRATER CORE SAMPLING"
            badge={<StatusIndicator status="NOMINAL" label="ALL CLEARED" size="sm" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {SEED_ASTRONAUTS.map((astro) => (
                <div
                  key={astro.id}
                  className="p-3.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-[#F4FAF8] text-xs">
                      {astro.profile?.full_name}
                    </div>
                    <div className="text-[10px] text-[#91A9A4]">
                      {astro.profile?.callsign} · {astro.badge_number}
                    </div>
                    <div className="text-[10px] text-[#5B7B75] mt-1">
                      Resting HR: {astro.baseline_resting_hr} BPM · SpO2: {astro.baseline_spo2}%
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 rounded-sm text-[10px] font-bold">
                      FIT FOR EVA
                    </span>
                    <div className="text-[9px] text-[#91A9A4] mt-1">Readiness 98%</div>
                  </div>
                </div>
              ))}
            </div>
          </DossierCard>

          {/* Widget C: Radiation Budget & NASA PEL Tracking */}
          <DossierCard
            title="MISSION RADIATION BUDGET & CONFIGURABLE NASA PEL"
            subtitle="NASA-STD-3001 VOL 1 REVISION B DOSIMETRY THRESHOLDS"
            badge={
              <Link to={ROUTES.RADIATION} className="font-mono text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1">
                <span>RADIATION LAB</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75]">CUMULATIVE DOSE</span>
                  <div className="text-xl font-bold text-[#F4FAF8] mt-0.5">48.6 mSv</div>
                  <span className="text-[10px] text-[#91A9A4]">Galactic Cosmic Rays (GCR)</span>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75]">NASA 30-DAY PEL</span>
                  <div className="text-xl font-bold text-[#F4FAF8] mt-0.5">250.0 mSv</div>
                  <span className="text-[10px] text-[#24E6D0]">19.4% Budget Consumed</span>
                </div>
                <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                  <span className="text-[10px] text-[#5B7B75]">NASA CAREER PEL</span>
                  <div className="text-xl font-bold text-[#F4FAF8] mt-0.5">600.0 mSv</div>
                  <span className="text-[10px] text-[#24E6D0]">Safe Margin: 551.4 mSv</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl flex items-center justify-between text-[11px] text-[#91A9A4]">
                <span>Solar Weather Sensor: GREEN (No coronal mass ejection / SPE in transit corridor)</span>
                <span className="text-[#24E6D0] font-bold">FLUX NORMAL</span>
              </div>
            </div>
          </DossierCard>

          {/* Widget D: ECLSS Telemetry */}
          <DossierCard
            title="ECLSS CABIN BIOSPHERE TELEMETRY"
            subtitle="LIFE SUPPORT SYSTEMS · MARS TRANSIT HABITAT"
            badge={<Gauge className="w-4 h-4 text-[#24E6D0]" />}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                <div className="text-[10px] text-[#5B7B75]">CABIN PRESSURE</div>
                <div className="text-base font-bold text-[#F4FAF8] mt-0.5">101.3 kPa</div>
                <div className="text-[9px] text-[#24E6D0]">1.00 ATM (NOMINAL)</div>
              </div>
              <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                <div className="text-[10px] text-[#5B7B75]">OXYGEN PARTIAL (pO2)</div>
                <div className="text-base font-bold text-[#F4FAF8] mt-0.5">21.0 kPa</div>
                <div className="text-[9px] text-[#24E6D0]">20.9% Normobaric</div>
              </div>
              <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                <div className="text-[10px] text-[#5B7B75]">CARBON DIOXIDE (pCO2)</div>
                <div className="text-base font-bold text-[#F4FAF8] mt-0.5">0.28 kPa</div>
                <div className="text-[9px] text-[#24E6D0]">&lt; 0.40 kPa TARGET</div>
              </div>
              <div className="p-3 bg-[#071311] border border-[#24E6D0]/18 rounded-xl">
                <div className="text-[10px] text-[#5B7B75]">CABIN TEMPERATURE</div>
                <div className="text-base font-bold text-[#F4FAF8] mt-0.5">21.5°C</div>
                <div className="text-[9px] text-[#24E6D0]">Optimal Thermal Loop</div>
              </div>
            </div>
          </DossierCard>
        </div>

        {/* Right Column (4 cols): Privacy Enforcement, Incident Center, Executive Reports */}
        <div className="lg:col-span-4 space-y-6">
          {/* CRITICAL PRIVACY REQUIREMENT: Masked Psychological Journals */}
          <DossierCard
            title="MEDICAL CONFIDENTIALITY ENFORCEMENT"
            subtitle="NASA-STD-3001 MANDATED PRIVACY ENCLAVE"
            badge={<Lock className="w-4 h-4 text-[#F5B94C]" />}
          >
            <div className="p-4 bg-[#F5B94C]/5 border border-[#F5B94C]/20 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-[#F5B94C] font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>INDIVIDUAL PSYCHOLOGICAL NOTES SHIELDED</span>
              </div>
              <p className="font-body text-xs text-[#91A9A4] leading-relaxed">
                By operational mandate and federal privacy standards, individual astronaut psychological journals and
                private emotional disclosures are cryptographically masked from the Mission Commander.
              </p>
              <div className="p-2.5 bg-[#020807]/60 border border-[#24E6D0]/15 rounded-lg text-[10px] text-[#5B7B75]">
                Direct medical inquiries regarding crew psychological fitness must be directed through authorized Flight Surgeon Dr. Sarah Vance.
              </div>
            </div>
          </DossierCard>

          {/* Widget E: Mission Incident Center */}
          <DossierCard
            title="MISSION INCIDENT LOG"
            subtitle="OPERATIONAL LOGISTICS QUEUE"
            badge={
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30 font-bold">
                0 ACTIVE
              </span>
            }
          >
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#071311] border border-[#24E6D0]/18 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[#F4FAF8]">ECLSS SCRUBBER B-CYCLE</span>
                  <span className="text-[#5B7B75]">Sol 141</span>
                </div>
                <p className="text-[11px] text-[#91A9A4]">
                  Routine regeneration cycle completed without pressure drop.
                </p>
              </div>
              <Link to={ROUTES.ALERTS} className="text-[10px] text-[#24E6D0] hover:underline flex items-center space-x-1 pt-1">
                <span>View Full Mission Log →</span>
              </Link>
            </div>
          </DossierCard>

          {/* Widget H: Executive Reports */}
          <DossierCard
            title="EXECUTIVE READINESS REPORTS"
            subtitle="NASA FLIGHT DIRECTOR BRIEFINGS"
            badge={<FileText className="w-4 h-4 text-[#F5B94C]" />}
          >
            <div className="space-y-2 font-mono text-xs">
              <p className="text-[11px] text-[#91A9A4]">
                Generate and print consolidated operational readiness summaries for Mission Command and Earth relay.
              </p>
              <Link
                to={ROUTES.REPORTS}
                className="w-full py-2 bg-[#0A1716] hover:bg-[#071311] text-[#F4FAF8] border border-[#24E6D0]/30 hover:border-[#24E6D0] rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-cyberGlow"
              >
                <FileText className="w-3.5 h-3.5 text-[#F5B94C]" />
                <span>Executive Reports Engine</span>
              </Link>
            </div>
          </DossierCard>
        </div>
      </div>
    </PageContainer>
  );
};
