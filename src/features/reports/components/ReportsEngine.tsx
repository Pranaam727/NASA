import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { SEED_MISSION } from '@/data/seedData';
import { FileText, Printer, Sparkles } from 'lucide-react';

export type AerospaceReportType =
  | 'INDIVIDUAL_DOSSIER'
  | 'DAILY_CLINICAL_BRIEF'
  | 'WEEKLY_ORGAN_STATUS'
  | 'RADIATION_DOSSIER'
  | 'MENTAL_WELLNESS_REPORT'
  | 'MEDICAL_INCIDENT_DOSSIER'
  | 'COMMANDER_READINESS_BRIEF';

interface ReportMeta {
  type: AerospaceReportType;
  title: string;
  code: string;
  recipient: string;
  description: string;
}

const REPORT_CATALOG: ReportMeta[] = [
  {
    type: 'INDIVIDUAL_DOSSIER',
    title: 'Individual Astronaut Health Dossier',
    code: 'NASA-MED-REP-01',
    recipient: 'Astronaut & Primary Flight Surgeon',
    description: 'Comprehensive personal baseline envelope, 30-day vitals trends, self-assessment summary, and lab biomarkers.',
  },
  {
    type: 'DAILY_CLINICAL_BRIEF',
    title: 'Daily Flight Clinical Briefing',
    code: 'NASA-MED-REP-02',
    recipient: 'Mission Flight Control Medical Console',
    description: '24-hour crew vital signs summary, active anomaly flags, sleep debt metrics, and exercise countermeasure compliance.',
  },
  {
    type: 'RADIATION_DOSSIER',
    title: 'Space Radiation Dosimetry & PEL Audit',
    code: 'NASA-RAD-REP-04',
    recipient: 'Space Radiation Analysis Group (SRAG)',
    description: 'Cumulative career absorbed dose (mGy), equivalent dose (mSv), solar particle event logs, and PEL margin.',
  },
  {
    type: 'MENTAL_WELLNESS_REPORT',
    title: 'Crew Mental Wellness & Circadian Stability Brief',
    code: 'NASA-BHP-REP-05',
    recipient: 'Behavioral Health & Performance (BHP) Console',
    description: 'Aggregated sleep architecture, cognitive vigilance latency (PVT), and authorized wellness metrics with privacy protections.',
  },
  {
    type: 'COMMANDER_READINESS_BRIEF',
    title: 'Mission Commander Crew Readiness Overview',
    code: 'NASA-OPS-REP-07',
    recipient: 'Ares-VI Flight Director & Mission Commander',
    description: 'Operational crew readiness matrix, critical incident status, and environmental life support summaries.',
  },
];

export const ReportsEngine: React.FC = () => {
  const { selectedAstronaut } = useRole();
  const [selectedReportType, setSelectedReportType] = useState<AerospaceReportType>('INDIVIDUAL_DOSSIER');

  const activeMeta = REPORT_CATALOG.find((r) => r.type === selectedReportType) || REPORT_CATALOG[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print-only CSS style injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 24px;
          }
        }
      `}</style>

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-astro-text-secondary" />
          <span className="font-display text-sm font-bold text-astro-text-primary">
            AEROSPACE MEDICAL REPORTING ENGINE
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-astro-text-primary text-astro-text-inverted hover:bg-black rounded-sm font-mono text-xs font-semibold flex items-center space-x-2 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE AS PDF</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {REPORT_CATALOG.map((rep) => {
          const isSelected = rep.type === selectedReportType;
          return (
            <button
              type="button"
              key={rep.type}
              onClick={() => setSelectedReportType(rep.type)}
              className={`px-3 py-1.5 rounded-sm border text-xs font-mono transition-colors ${
                isSelected
                  ? 'bg-[#21E6D0] text-[#030A09] border-[#21E6D0] font-bold shadow-md'
                  : 'bg-[#06110F] text-[#8CA8A0] border-[rgba(55,210,185,0.2)] hover:border-[#21E6D0]/50 hover:text-[#E8F4F0]'
              }`}
            >
              {rep.code}
            </button>
          );
        })}
      </div>

      {/* Printable Report Canvas */}
      <div id="printable-report" className="p-8 rounded-sm bg-[#0A1715] border border-[rgba(55,210,185,0.2)] shadow-xl space-y-6 print:bg-white print:border-black print:text-black">
        {/* Report Official Aerospace Letterhead */}
        <div className="border-b-2 border-[#21E6D0]/40 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-[#E8F4F0] print:text-black">
                ARES-VI EXPEDITION // NASA BIOASTRONAUTICS
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.2 bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#21E6D0] rounded-sm print:bg-transparent print:border-black print:text-black">
                OFFICIAL FLIGHT RECORD
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-[#E8F4F0] print:text-black">
              {activeMeta.title}
            </h2>
            <div className="font-mono text-[10px] text-[#8CA8A0] print:text-neutral-600">
              DOCUMENT IDENTIFIER: {activeMeta.code} // REVISION 2026.4
            </div>
          </div>

          <div className="text-right text-xs font-mono space-y-0.5 text-[#8CA8A0] print:text-neutral-600">
            <div>Generated: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</div>
            <div>Mission: {SEED_MISSION.code} (Mars Transit)</div>
            <div>Security Tier: RESTRICTED MEDICAL // PHI PROTECTED</div>
          </div>
        </div>

        {/* Astronaut Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#06110F] border border-[rgba(55,210,185,0.18)] font-mono text-xs print:bg-neutral-50 print:border-black">
          <div>
            <span className="text-[9px] text-[#57766D] uppercase block">ASTRONAUT / CALLSIGN</span>
            <span className="font-bold text-[#E8F4F0] print:text-black">{selectedAstronaut.profile?.full_name}</span>
          </div>
          <div>
            <span className="text-[9px] text-astro-text-tertiary uppercase block">BADGE / ROLE</span>
            <span className="font-bold text-astro-text-primary">{selectedAstronaut.badge_number} ({selectedAstronaut.profile?.role})</span>
          </div>
          <div>
            <span className="text-[9px] text-astro-text-tertiary uppercase block">REPORTING PERIOD</span>
            <span className="font-bold text-astro-text-primary">MET 142d (Sol 142)</span>
          </div>
          <div>
            <span className="text-[9px] text-astro-text-tertiary uppercase block">PRIMARY RECIPIENT</span>
            <span className="font-bold text-astro-text-primary">{activeMeta.recipient}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-astro-text-primary uppercase tracking-wider">
            1. EXECUTIVE CLINICAL SUMMARY
          </h3>
          <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
            Astronaut vital signs and physical countermeasure performance during the reporting window indicate nominal
            physiological stability. Daily resting pulse (72 bpm) reflects expected sympathetic adjustment to ongoing
            mission workloads (+8 bpm delta from established 64 bpm baseline, Z-Score: +1.9σ). Oxygen saturation (98%)
            and core tympanic temperature (36.8°C) remain fully within individual safety margins. No acute medical
            escalations or uncontrolled decompression events were logged during Sol 142.
          </p>
        </div>

        {/* Tabular Telemetry Breakdown */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-astro-text-primary uppercase tracking-wider">
            2. OBSERVATIONAL TELEMETRY & BASELINE DELTAS
          </h3>
          <table className="w-full text-xs font-mono border border-astro-border-hairline">
            <thead className="bg-astro-bg-subtle text-astro-text-secondary text-left">
              <tr>
                <th className="p-2 border-b border-astro-border-hairline">INDICATOR</th>
                <th className="p-2 border-b border-astro-border-hairline">OBSERVED VALUE</th>
                <th className="p-2 border-b border-astro-border-hairline">BASELINE MEAN</th>
                <th className="p-2 border-b border-astro-border-hairline">STATISTICAL DELTA</th>
                <th className="p-2 border-b border-astro-border-hairline">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-astro-border-hairline">
              <tr>
                <td className="p-2 font-semibold">Resting Heart Rate</td>
                <td className="p-2">72 BPM</td>
                <td className="p-2">{selectedAstronaut.baseline_resting_hr} BPM</td>
                <td className="p-2 text-astro-status-caution">+8 BPM (+1.9σ)</td>
                <td className="p-2 text-astro-status-healthy font-bold">NOMINAL</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Blood Pressure (Systolic / Diastolic)</td>
                <td className="p-2">118 / 76 mmHg</td>
                <td className="p-2">{selectedAstronaut.baseline_bp_systolic} / {selectedAstronaut.baseline_bp_diastolic} mmHg</td>
                <td className="p-2">+4 / +2 mmHg (+0.6σ)</td>
                <td className="p-2 text-astro-status-healthy font-bold">NOMINAL</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Pulse Oximetry (SpO2)</td>
                <td className="p-2">98%</td>
                <td className="p-2">{selectedAstronaut.baseline_spo2}%</td>
                <td className="p-2">0% (0.0σ)</td>
                <td className="p-2 text-astro-status-healthy font-bold">OPTIMAL</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Accumulated Mission Radiation</td>
                <td className="p-2">48.2 mSv</td>
                <td className="p-2">PEL Ceiling: 600 mSv</td>
                <td className="p-2">8.03% Career Ceiling</td>
                <td className="p-2 text-astro-status-healthy font-bold">SAFE MARGIN</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Health Intelligence Summary Section */}
        <div className="p-4 rounded-sm bg-astro-bg-subtle/50 border border-astro-border-hairline space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-astro-text-primary" />
            <span className="font-mono text-xs font-bold text-astro-text-primary uppercase tracking-wider">
              3. AI CLINICAL COPILOT SYNTHESIS // DETERMINISTICALLY GROUNDED
            </span>
          </div>
          <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
            Multi-metric correlation analysis indicates that slight elevation in resting pulse is physiological and
            attributable to circadian sleep compression (7.2h logged vs 8.0h target) alongside high-load ARED squat
            workouts. The cognitive reaction time (190 ms) confirms intact psychomotor vigilance. No cardiovascular
            decompensation or acute SANS edema patterns are indicated by present measurements.
          </p>
        </div>

        {/* Formal Medical Officer Attestation & Signature Block */}
        <div className="pt-6 border-t border-astro-border-hairline grid grid-cols-2 gap-8 text-xs font-mono">
          <div className="space-y-4">
            <span className="text-[10px] text-astro-text-tertiary uppercase block">
              PRIMARY EXAMINING MEDICAL OFFICER
            </span>
            <div className="font-bold text-astro-text-primary">
              Dr. Sarah Vance, MD, PhD
            </div>
            <div className="text-[10px] text-astro-text-secondary">
              Ares-VI Crew Flight Surgeon // ESA Medical Operations
            </div>
            <div className="h-6 border-b border-astro-border-strong w-48" />
          </div>

          <div className="space-y-4 text-right">
            <span className="text-[10px] text-astro-text-tertiary uppercase block">
              DATA INTEGRITY & DEMONSTRATION NOTICE
            </span>
            <div className="text-[10px] text-astro-text-secondary leading-normal">
              AstroCare is an aerospace biomedical research software system developed for educational and mission
              simulation purposes. All readings represent high-fidelity virtual sensor simulation models.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
