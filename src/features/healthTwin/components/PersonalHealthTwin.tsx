import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Shield,
  Clock,
  User,
  Zap,
} from 'lucide-react';

interface MetricTwin {
  name: string;
  key: string;
  current: number;
  baseline: number;
  unit: string;
  stdDev: number;
  icon: React.ElementType;
  whatChanged: string;
  whenChanged: string;
  correlations: string[];
  requiresReview: boolean;
  recommendedAction: string;
}

export const PersonalHealthTwin: React.FC = () => {
  const { selectedAstronaut, currentRole } = useRole();
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('hr');

  // Baseline envelope calculations for selected astronaut
  const metrics: MetricTwin[] = [
    {
      name: 'Resting Heart Rate',
      key: 'hr',
      current: selectedAstronaut.baseline_resting_hr + 8, // simulated current
      baseline: selectedAstronaut.baseline_resting_hr,
      unit: 'BPM',
      stdDev: 4.2,
      icon: Heart,
      whatChanged: 'Resting pulse elevated +8 bpm over 30-day pre-flight baseline envelope.',
      whenChanged: 'Detected at 06:45 MET during morning physiological ingest.',
      correlations: [
        'Post-EVA thermal elevation (Suit Egress)',
        'Circadian sleep compression (-1.2h last Sol)',
        'Mild sympathetic adrenergic drive',
      ],
      requiresReview: false,
      recommendedAction: 'Maintain target hydration volume (2.8L). Re-assess during evening rest protocol.',
    },
    {
      name: 'Blood Pressure (Systolic)',
      key: 'bp_sys',
      current: selectedAstronaut.baseline_bp_systolic + 4,
      baseline: selectedAstronaut.baseline_bp_systolic,
      unit: 'mmHg',
      stdDev: 6.0,
      icon: Activity,
      whatChanged: 'Systolic pressure stable at +4 mmHg delta, well within normal envelope.',
      whenChanged: 'Continuous oscillometric reading updated 14m ago.',
      correlations: [
        'Microgravity cephalad fluid redistribution',
        'Normal baroreceptor adaptation',
      ],
      requiresReview: false,
      recommendedAction: 'Nominal physiological variation. Continue daily monitoring schedule.',
    },
    {
      name: 'Oxygen Saturation (SpO2)',
      key: 'spo2',
      current: 98,
      baseline: selectedAstronaut.baseline_spo2,
      unit: '%',
      stdDev: 0.8,
      icon: Wind,
      whatChanged: 'Oxygen saturation maintains optimal alveolar diffusion at 98%.',
      whenChanged: 'Photoplethysmography stream nominal at 1.0 Hz.',
      correlations: [
        'Cabin habitat pO2 at 21.2 kPa',
        'Normal respiratory rate (14 rpm)',
      ],
      requiresReview: false,
      recommendedAction: 'No countermeasure adjustment required.',
    },
    {
      name: 'Core Body Temperature',
      key: 'temp',
      current: 37.2,
      baseline: 36.8,
      unit: '°C',
      stdDev: 0.3,
      icon: Thermometer,
      whatChanged: 'Core temperature +0.4°C higher than resting baseline.',
      whenChanged: 'Logged 45m post-workout session.',
      correlations: [
        'Microgravity reduced convective heat dissipation ("Space Fever")',
        'Recent ARED 185 kg deadlift workout load',
      ],
      requiresReview: false,
      recommendedAction: 'Allow 60-minute passive equilibration with active habitat airflow.',
    },
  ];

  const activeMetric = metrics.find((m) => m.key === selectedMetricKey) || metrics[0];
  const delta = activeMetric.current - activeMetric.baseline;
  const zScore = Number((delta / activeMetric.stdDev).toFixed(2));
  const isElevated = Math.abs(zScore) >= 2.0;

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner: Dark Amber / Graphite Surface */}
      <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[#F3BB57]/30 flex items-start space-x-3.5 text-xs shadow-cyberCard">
        <AlertTriangle className="w-4 h-4 text-[#F3BB57] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-[#F3BB57] tracking-wider uppercase block">
            SCIENTIFIC & MEDICAL DISCLAIMER
          </span>
          <p className="text-[#8CA8A0] leading-relaxed">
            This module provides an empirical baseline-deviation data representation. It is an aerospace decision-support tool
            and does not constitute an autonomous clinical digital twin or validated predictive diagnostic device.
          </p>
        </div>
      </div>

      {/* Profile & Baseline Header: 4 Dark Elevated Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Astronaut Profile */}
        <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all shadow-cyberCard space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#57766D] font-bold">
              ASTRONAUT PROFILE
            </span>
            <User className="w-3.5 h-3.5 text-[#21E6D0]" />
          </div>
          <div className="font-space text-sm font-bold text-[#E8F4F0] truncate">
            {selectedAstronaut.profile?.full_name}
          </div>
          <span className="font-mono text-[10px] text-[#8CA8A0] block">
            {selectedAstronaut.badge_number} · {selectedAstronaut.profile?.callsign}
          </span>
        </div>

        {/* Card 2: Established Baseline */}
        <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all shadow-cyberCard space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#57766D] font-bold">
              ESTABLISHED BASELINE
            </span>
            <Clock className="w-3.5 h-3.5 text-[#21E6D0]" />
          </div>
          <div className="font-mono text-sm font-bold text-[#E8F4F0]">
            30-DAY PRE-FLIGHT
          </div>
          <span className="font-mono text-[10px] text-[#21E6D0] font-semibold block">
            CALIBRATED ENVELOPE (μ ± 2σ)
          </span>
        </div>

        {/* Card 3: Deviation Status */}
        <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all shadow-cyberCard space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#57766D] font-bold">
              DEVIATION STATUS
            </span>
            <Zap className="w-3.5 h-3.5 text-[#21E6D0]" />
          </div>
          <div>
            <span
              className={`font-mono text-sm font-bold ${
                isElevated ? 'text-[#F3BB57]' : 'text-[#21E6D0]'
              }`}
            >
              {isElevated ? 'ELEVATED DEVIATION' : 'NOMINAL ENVELOPE'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#8CA8A0] block">
            Max Z-Score: {zScore}σ
          </span>
        </div>

        {/* Card 4: Monitoring Role */}
        <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 transition-all shadow-cyberCard space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#57766D] font-bold">
              MONITORING ROLE
            </span>
            <Shield className="w-3.5 h-3.5 text-[#21E6D0]" />
          </div>
          <div className="font-mono text-sm font-bold text-[#E8F4F0]">
            {currentRole.replace(/_/g, ' ')}
          </div>
          <span className="font-mono text-[10px] text-[#8CA8A0] block">
            ACTIVE SESSION AUDITED
          </span>
        </div>
      </div>

      {/* Main Metric Cards Grid: 4 Interactive Dark Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const mDelta = m.current - m.baseline;
          const mZ = Number((mDelta / m.stdDev).toFixed(2));
          const isSelected = m.key === selectedMetricKey;
          const Icon = m.icon;

          return (
            <div
              key={m.key}
              onClick={() => setSelectedMetricKey(m.key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all shadow-cyberCard ${
                isSelected
                  ? 'bg-[#10251F] border-[#21E6D0] shadow-[0_0_15px_rgba(33,230,208,0.25)]'
                  : 'bg-[#0D1E1A] border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/40 hover:bg-[#0F221E]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8CA8A0] font-semibold">
                  {m.name}
                </span>
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-[#21E6D0]' : 'text-[#57766D]'
                  }`}
                />
              </div>

              <div className="flex items-baseline space-x-2 my-1">
                <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                  {m.current}
                </span>
                <span className="font-mono text-xs text-[#57766D]">{m.unit}</span>
                <span
                  className={`ml-auto font-mono text-xs font-semibold ${
                    mDelta > 0 ? 'text-[#F3BB57]' : 'text-[#21E6D0]'
                  }`}
                >
                  {mDelta >= 0 ? `+${mDelta}` : mDelta} ({mZ}σ)
                </span>
              </div>

              {/* Baseline reference comparison */}
              <div className="mt-3 pt-2 border-t border-[rgba(55,210,185,0.18)] flex justify-between text-[10px] font-mono text-[#57766D]">
                <span>Baseline: {m.baseline} {m.unit}</span>
                <span>±2σ: {(m.baseline - 2 * m.stdDev).toFixed(0)}–{(m.baseline + 2 * m.stdDev).toFixed(0)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Deviation Engine Deep-Dive Card */}
      <DossierCard
        title={`INDIVIDUAL DEVIATION ENGINE // ${activeMetric.name.toUpperCase()}`}
        subtitle="DETERMINISTIC 5-POINT CLINICAL REASONING TRACE"
        action={
          <StatusIndicator
            status={isElevated ? 'CAUTION' : 'NOMINAL'}
            label={isElevated ? 'ANOMALY DETECTED' : 'WITHIN 2σ ENVELOPE'}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Left Column: Questions 1-3 */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-[#21E6D0] uppercase block tracking-wider">
                1. WHAT CHANGED?
              </span>
              <p className="font-body text-xs text-[#E8F4F0] leading-relaxed">
                {activeMetric.whatChanged}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-[#21E6D0] uppercase block tracking-wider">
                2. WHEN DID IT CHANGE?
              </span>
              <p className="font-body text-xs text-[#E8F4F0] leading-relaxed">
                {activeMetric.whenChanged}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#21E6D0] uppercase block tracking-wider">
                3. HOW DOES IT COMPARE WITH THE BASELINE?
              </span>
              <div className="space-y-1.5 text-xs font-mono text-[#E8F4F0]">
                <div className="flex justify-between border-b border-[rgba(55,210,185,0.1)] pb-1">
                  <span className="text-[#8CA8A0]">Observed Flight Reading:</span>
                  <span className="font-bold text-[#8BFFE9]">{activeMetric.current} {activeMetric.unit}</span>
                </div>
                <div className="flex justify-between border-b border-[rgba(55,210,185,0.1)] pb-1">
                  <span className="text-[#8CA8A0]">Baseline Mean (μ):</span>
                  <span className="font-bold">{activeMetric.baseline} {activeMetric.unit}</span>
                </div>
                <div className="flex justify-between border-b border-[rgba(55,210,185,0.1)] pb-1">
                  <span className="text-[#8CA8A0]">Standard Deviation (σ):</span>
                  <span className="font-bold">±{activeMetric.stdDev} {activeMetric.unit}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#8CA8A0]">Biological Z-Score:</span>
                  <span className="font-bold text-[#21E6D0]">
                    {zScore}σ ({Math.abs(zScore) < 2 ? 'Inside 95% Normalcy Window' : 'Outside 95% Envelope'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Questions 4-5 & Actions */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#21E6D0] uppercase block tracking-wider">
                4. WHICH OTHER OBSERVATIONS MAY BE RELEVANT?
              </span>
              <ul className="space-y-2 text-xs font-body text-[#E8F4F0]">
                {activeMetric.correlations.map((c, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#21E6D0] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#21E6D0] uppercase block tracking-wider">
                5. DOES THE CHANGE REQUIRE FLIGHT SURGEON REVIEW?
              </span>
              <div className="flex items-center space-x-2 text-xs font-semibold py-1">
                {activeMetric.requiresReview ? (
                  <span className="text-[#F3BB57] flex items-center space-x-1.5 bg-[#F3BB57]/10 px-2.5 py-1 rounded-lg border border-[#F3BB57]/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>YES // MEDICAL ESCALATION RECOMMENDED</span>
                  </span>
                ) : (
                  <span className="text-[#21E6D0] flex items-center space-x-1.5 bg-[#21E6D0]/10 px-2.5 py-1 rounded-lg border border-[#21E6D0]/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>NO // OBSERVATION ONLY (WITHIN SAFETY MARGIN)</span>
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-[#8CA8A0] leading-relaxed pt-1">
                <strong className="text-[#E8F4F0]">Recommended Countermeasure Action:</strong> {activeMetric.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
