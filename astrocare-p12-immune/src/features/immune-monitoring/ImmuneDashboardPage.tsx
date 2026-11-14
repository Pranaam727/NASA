import React from 'react';
import { Link } from 'react-router-dom';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { immuneService } from '../../services/immune/immuneService';
import { laboratoryService } from '../../services/laboratory/laboratoryService';
import { alertService } from '../../services/alerts/alertService';
import { MetricCard } from '../../components/shared/MetricCard';
import { StateBadge } from '../../components/shared/StateBadge';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  ShieldAlert,
  FlaskConical,
  Activity,
  Layers,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Info,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export const ImmuneDashboardPage: React.FC = () => {
  const { currentAstronaut } = useAstroCareContext();

  const latestProfile = immuneService.getLatestImmuneProfile(currentAstronaut.astronautId);
  const samples = laboratoryService.getSamples({ astronautId: currentAstronaut.astronautId });
  const recentAlerts = alertService.getAlerts({
    astronautId: currentAstronaut.astronautId,
    unacknowledgedOnly: true,
  });
  const longitudinalSummaries = immuneService.getAllLongitudinalMetrics(currentAstronaut.astronautId);
  const timelinePoints = immuneService.getLongitudinalTimeline(currentAstronaut.astronautId);

  // Formatting chart points
  const leukocyteTrendData = timelinePoints.map((p) => ({
    day: `FD ${p.missionDay}`,
    wbc: p.values.WBC_TOTAL ?? null,
    neutrophils: p.values.NEUTROPHIL_ABS ?? null,
    lymphocytes: p.values.LYMPHOCYTE_ABS ?? null,
  }));

  const cytokineBarData = [
    {
      name: 'IL-6',
      baseline: longitudinalSummaries.find((s) => s.metricKey === 'IL_6')?.preFlightBaseline || 1.4,
      latest: latestProfile.biomarkers['IL_6']?.value || 6.4,
      refLimit: 5.0,
      unit: 'pg/mL',
    },
    {
      name: 'TNF-α',
      baseline: longitudinalSummaries.find((s) => s.metricKey === 'TNF_ALPHA')?.preFlightBaseline || 2.1,
      latest: latestProfile.biomarkers['TNF_ALPHA']?.value || 4.8,
      refLimit: 6.0,
      unit: 'pg/mL',
    },
    {
      name: 'IL-10',
      baseline: longitudinalSummaries.find((s) => s.metricKey === 'IL_10')?.preFlightBaseline || 3.2,
      latest: latestProfile.biomarkers['IL_10']?.value || 6.5,
      refLimit: 8.0,
      unit: 'pg/mL',
    },
    {
      name: 'IFN-γ',
      baseline: 0.8,
      latest: latestProfile.biomarkers['IFN_GAMMA']?.value || 2.8,
      refLimit: 4.5,
      unit: 'pg/mL',
    },
  ];

  // Helper to extract baseline for a key
  const getBaseline = (key: string) =>
    longitudinalSummaries.find((s) => s.metricKey === key)?.preFlightBaseline;

  const getPct = (key: string) =>
    longitudinalSummaries.find((s) => s.metricKey === key)?.percentChange;

  return (
    <div className="space-y-6">
      {/* Page Title & Mission Context Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Mission Phase Monitoring
            </span>
            <DataOriginBadge origin={currentAstronaut.dataOrigin} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Immune Health Overview — {currentAstronaut.name}
            <span className="text-sm font-normal text-slate-400 font-mono">
              ({currentAstronaut.astronautId})
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Longitudinal immune surveillance integrating leukocyte subsets, cytokine multiplex arrays,
            acute-phase reactants, and latent herpesvirus copy tracking.
          </p>
        </div>

        {/* Mission Status Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs bg-space-950 p-3 rounded-lg border border-space-800">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Mission</span>
            <span className="font-bold text-white">{currentAstronaut.missionId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Flight Day</span>
            <span className="font-bold text-cyan-400">
              FD {currentAstronaut.missionElapsedDays} / {currentAstronaut.missionDurationDays}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Latest Sample</span>
            <span className="font-bold text-slate-200">
              {currentAstronaut.latestSampleDate.split('T')[0]}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Overall State</span>
            <StateBadge state={currentAstronaut.overallMonitoringState} size="sm" />
          </div>
        </div>
      </div>

      {/* Alert Notification Banner if active alerts exist */}
      {recentAlerts.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                {recentAlerts.length} Active Immune Surveillance{' '}
                {recentAlerts.length === 1 ? 'Alert' : 'Alerts'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                {recentAlerts[0].explanation}
              </p>
            </div>
          </div>
          <Link
            to="/immune/alerts"
            className="flex-shrink-0 text-xs font-mono font-bold text-amber-300 hover:text-white bg-amber-900/40 hover:bg-amber-800/60 px-3 py-1.5 rounded border border-amber-700/60 transition flex items-center gap-1"
          >
            Review Alerts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 8 Core Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Latest WBC */}
        <MetricCard
          title="Total Leukocytes (WBC)"
          category="Leukocyte Profile"
          value={latestProfile.cells['WBC_TOTAL']?.absoluteCount ?? 9.4}
          unit="x10^9 / L"
          baselineValue={getBaseline('WBC_TOTAL')}
          percentChange={getPct('WBC_TOTAL')}
          referenceLow={4.5}
          referenceHigh={11.0}
          referenceSource="NASA HHP Clinical Laboratory Standards"
          timestamp={latestProfile.cells['WBC_TOTAL']?.timestamp}
          monitoringState={latestProfile.cells['WBC_TOTAL']?.monitoringState ?? 'NORMAL'}
          provenance="ISS In-Flight Analyzer"
        />

        {/* Card 2: Absolute Neutrophil Count */}
        <MetricCard
          title="Neutrophils (ANC)"
          category="Granulocyte Profile"
          value={latestProfile.cells['NEUTROPHIL_ABS']?.absoluteCount ?? 6.8}
          unit="x10^9 / L"
          baselineValue={getBaseline('NEUTROPHIL_ABS')}
          percentChange={getPct('NEUTROPHIL_ABS')}
          referenceLow={1.8}
          referenceHigh={7.7}
          referenceSource="NASA HHP Standards"
          timestamp={latestProfile.cells['NEUTROPHIL_ABS']?.timestamp}
          monitoringState={latestProfile.cells['NEUTROPHIL_ABS']?.monitoringState ?? 'NORMAL'}
          provenance="ISS HRF Blood Analyzer"
        />

        {/* Card 3: CD4/CD8 Ratio */}
        <MetricCard
          title="CD4 / CD8 T-Cell Ratio"
          category="Lymphocyte Subsets"
          value={latestProfile.cells['CD4_CD8_RATIO']?.absoluteCount ?? 1.22}
          unit="ratio"
          baselineValue={getBaseline('CD4_CD8_RATIO')}
          percentChange={getPct('CD4_CD8_RATIO')}
          referenceLow={1.0}
          referenceHigh={3.5}
          referenceSource="NTRS-20230016983 Flow Reference"
          timestamp={latestProfile.cells['CD4_CD8_RATIO']?.timestamp}
          monitoringState={latestProfile.cells['CD4_CD8_RATIO']?.monitoringState ?? 'MONITOR'}
          provenance="Microfluidic Flow Cytometry"
          notes="Downward drift toward 1.0; monitor for viral reactivation."
        />

        {/* Card 4: NK Cytotoxicity Functional Response */}
        <MetricCard
          title="NK Cell Cytotoxicity"
          category="Functional Immune Assay"
          value={latestProfile.cells['NK_CYTOTOXICITY_LYSIS']?.absoluteCount ?? 15.4}
          unit="% Lysis"
          baselineValue={getBaseline('NK_CYTOTOXICITY_LYSIS')}
          percentChange={getPct('NK_CYTOTOXICITY_LYSIS')}
          referenceLow={20.0}
          referenceHigh={50.0}
          referenceSource="NASA HRR-85 Risk Assessment"
          timestamp={latestProfile.cells['NK_CYTOTOXICITY_LYSIS']?.timestamp}
          monitoringState={latestProfile.cells['NK_CYTOTOXICITY_LYSIS']?.monitoringState ?? 'WARNING'}
          provenance="K562 Target Lysis Ex-Vivo"
          notes="Depressed innate cytolytic response."
        />

        {/* Card 5: Interleukin-6 (IL-6) */}
        <MetricCard
          title="Interleukin-6 (IL-6)"
          category="Cytokine Array"
          value={latestProfile.biomarkers['IL_6']?.value ?? 6.4}
          unit="pg/mL"
          baselineValue={getBaseline('IL_6')}
          percentChange={getPct('IL_6')}
          referenceLow={0.5}
          referenceHigh={5.0}
          referenceSource="OSD-575 Multiplex Reference"
          timestamp={latestProfile.biomarkers['IL_6']?.timestamp}
          monitoringState={latestProfile.biomarkers['IL_6']?.monitoringState ?? 'WARNING'}
          provenance="Luminex 37-Plex Bead Array"
          notes="Elevated +357% over pre-flight baseline."
        />

        {/* Card 6: High-Sensitivity CRP */}
        <MetricCard
          title="High-Sensitivity CRP"
          category="Inflammatory Reactant"
          value={latestProfile.biomarkers['CRP_HS']?.value ?? 3.42}
          unit="mg/L"
          baselineValue={getBaseline('CRP_HS')}
          percentChange={getPct('CRP_HS')}
          referenceLow={0.1}
          referenceHigh={3.0}
          referenceSource="AHA / CDC Clinical Standards"
          timestamp={latestProfile.biomarkers['CRP_HS']?.timestamp}
          monitoringState={latestProfile.biomarkers['CRP_HS']?.monitoringState ?? 'WARNING'}
          provenance="High-Sensitivity Immunoturbidimetry"
          notes="Elevated above 3.0 mg/L warning threshold."
        />

        {/* Card 7: Morning Salivary Cortisol */}
        <MetricCard
          title="Salivary Cortisol (AM)"
          category="Endocrine Stress Axis"
          value={latestProfile.biomarkers['CORTISOL_SALIVARY']?.value ?? 28.5}
          unit="nmol/L"
          baselineValue={getBaseline('CORTISOL_SALIVARY')}
          percentChange={getPct('CORTISOL_SALIVARY')}
          referenceLow={3.5}
          referenceHigh={27.0}
          referenceSource="NASA Circadian Standard"
          timestamp={latestProfile.biomarkers['CORTISOL_SALIVARY']?.timestamp}
          monitoringState={latestProfile.biomarkers['CORTISOL_SALIVARY']?.monitoringState ?? 'WARNING'}
          provenance="Chemiluminescence Immunoassay"
          notes="Elevated morning awakening response."
        />

        {/* Card 8: Salivary EBV DNA Shedding */}
        <MetricCard
          title="Salivary EBV DNA"
          category="Virology Surveillance"
          value={latestProfile.cells['VIRAL_SHEDDING_EBV']?.absoluteCount ?? 84}
          unit="copies/mL"
          baselineValue={0}
          referenceLow={0}
          referenceHigh={50}
          referenceSource="NASA Latent Virus Reactivation Studies"
          timestamp={latestProfile.cells['VIRAL_SHEDDING_EBV']?.timestamp}
          monitoringState={latestProfile.cells['VIRAL_SHEDDING_EBV']?.monitoringState ?? 'WARNING'}
          provenance="WetLab-2 qPCR Automated Assay"
          notes="Subclinical latent herpesvirus shedding detected."
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leukocyte Trend Over Flight Days */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Leukocyte Dynamics Across Mission Phases
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                WBC Total, Neutrophils, Lymphocytes (x10^9 / L)
              </p>
            </div>
            <Link
              to="/immune/cells"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              Full Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leukocyteTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWbc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNeutrophils" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 14]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="wbc"
                  name="WBC Total"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWbc)"
                />
                <Area
                  type="monotone"
                  dataKey="neutrophils"
                  name="Neutrophils"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNeutrophils)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-space-800">
            <span>Pre-Flight Baseline: L-180</span>
            <span className="text-cyan-400">Current Phase: In-Flight FD 88</span>
          </div>
        </div>

        {/* Cytokine Profile Baseline vs Latest */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                Cytokine Shift (Baseline vs Latest In-Flight)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Multiplex Bead Array Concentrations (pg/mL)
              </p>
            </div>
            <Link
              to="/immune/biomarkers"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              All Biomarkers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cytokineBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="baseline" name="Pre-Flight Baseline" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latest" name="In-Flight Latest" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-space-800">
            <span>Source: NASA OSDR OSD-575 Assay Paradigm</span>
            <span className="text-amber-400">IL-6 Above Ref Cutoff (5.0 pg/mL)</span>
          </div>
        </div>
      </div>

      {/* Laboratory Sample Workflow & NASA Insights Summary Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Status Card */}
        <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Laboratory Biospecimen Collection Status
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Recent Blood, Serum, Saliva & Urine Telemetry
              </p>
            </div>
            <Link
              to="/immune/laboratory"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              Manage Samples <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-space-800 text-slate-400 text-[10px] uppercase">
                  <th className="pb-2">Sample ID</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Collection Date</th>
                  <th className="pb-2">Phase</th>
                  <th className="pb-2">Workflow Status</th>
                  <th className="pb-2">Laboratory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800/60">
                {samples.slice(0, 4).map((sample) => (
                  <tr key={sample.id} className="hover:bg-space-850/50 transition">
                    <td className="py-2.5 font-bold text-white">{sample.id}</td>
                    <td className="py-2.5 text-cyan-300">{sample.sampleType}</td>
                    <td className="py-2.5 text-slate-300">{sample.collectionTimestamp.split('T')[0]}</td>
                    <td className="py-2.5 text-slate-400">{sample.missionPhase}</td>
                    <td className="py-2.5">
                      <StateBadge state={sample.workflowStatus} size="sm" />
                    </td>
                    <td className="py-2.5 text-slate-400 truncate max-w-[140px]" title={sample.laboratory}>
                      {sample.laboratory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NASA Research Integration Teaser Card */}
        <div className="bg-gradient-to-b from-space-900 to-space-950 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                NASA Research Anchor
              </span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              OSDR Dataset Integration
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              P12 correlates in-flight immune changes with real spaceflight datasets, including{' '}
              <strong className="text-slate-200">OSD-575</strong> (Inspiration4 civilian cytokine panel),{' '}
              <strong className="text-slate-200">OSD-53</strong> (ISS astronaut whole-blood RNA-Seq), and{' '}
              <strong className="text-slate-200">Gap IM-106</strong> from the NASA Human Research Roadmap.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-space-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">5 Verified Studies Catalogued</span>
            <Link
              to="/immune/research"
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Explore OSDR <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
