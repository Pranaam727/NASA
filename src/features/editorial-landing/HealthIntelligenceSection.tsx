import React, { useState } from 'react';
import { SectionReveal } from '@/components/editorial/SectionReveal';
import { HealthMetricCard } from '@/components/editorial/HealthMetricCard';
import { HealthTrendChart } from '@/components/editorial/HealthTrendChart';
import { Heart, Moon, Radio, Zap, ShieldAlert, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const HealthIntelligenceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heart' | 'sleep' | 'radiation' | 'biomarkers'>('heart');

  const heartData = [
    { time: '00:00', value: 58 },
    { time: '04:00', value: 54 },
    { time: '08:00', value: 68 },
    { time: '12:00', value: 72 },
    { time: '16:00', value: 128 }, // ARED exercise spike
    { time: '20:00', value: 64 },
  ];

  const sleepData = [
    { time: 'Sol 137', value: 7.2 },
    { time: 'Sol 138', value: 6.8 },
    { time: 'Sol 139', value: 7.4 },
    { time: 'Sol 140', value: 6.5 },
    { time: 'Sol 141', value: 7.1 },
    { time: 'Sol 142', value: 7.3 },
  ];

  const radiationData = [
    { time: 'Sol 137', value: 0.38 },
    { time: 'Sol 138', value: 0.41 },
    { time: 'Sol 139', value: 0.39 },
    { time: 'Sol 140', value: 0.44 },
    { time: 'Sol 141', value: 0.40 },
    { time: 'Sol 142', value: 0.42 },
  ];

  const biomarkerData = [
    { time: 'Pre-flight', value: 2.1 },
    { time: 'Sol 30', value: 2.8 },
    { time: 'Sol 60', value: 3.2 },
    { time: 'Sol 90', value: 3.6 },
    { time: 'Sol 120', value: 3.3 },
    { time: 'Sol 142', value: 3.4 },
  ];

  return (
    <section id="intelligence" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F2F0EA] relative">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <SectionReveal className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#111111] text-[#111111] font-mono text-[10px] uppercase font-bold tracking-widest shadow-sm">
            <Activity className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>SECTION 04 // BIOMETRIC SCANNING & CLINICAL INTELLIGENCE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#111111] tracking-tight leading-[0.92] uppercase">
                HEALTH DATA
                <br />
                THAT THINKS
                <br />
                <span className="text-[#75D8DC] bg-[#111111] px-2 rounded">AHEAD.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body text-sm sm:text-base text-[#444444] leading-relaxed">
                Rather than isolated numerical telemetry, AstroCare continuously contextualizes astronaut vitals against individual circadian patterns, mission elapsed time, and NASA spaceflight baseline bounds.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <HealthMetricCard
            label="Resting Heart Rate"
            value="64"
            unit="BPM"
            trend="flat"
            delta="0"
            status="NOMINAL"
            icon={Heart}
            subtext="μ=64 BPM (BASELINE)"
          />
          <HealthMetricCard
            label="Sleep Architecture"
            value="7.3"
            unit="HRS"
            trend="up"
            delta="+0.4"
            status="NOMINAL"
            icon={Moon}
            subtext="22.4% REM FRACTION"
          />
          <HealthMetricCard
            label="PVT Reaction Latency"
            value="214"
            unit="MS"
            trend="down"
            delta="-12"
            status="NOMINAL"
            icon={Zap}
            subtext="ALERTNESS OPTIMAL"
          />
          <HealthMetricCard
            label="Radiation Dosimetry"
            value="0.42"
            unit="mSv/d"
            trend="flat"
            delta="+0.02"
            status="NOMINAL"
            icon={Radio}
            subtext="GCR BASELINE FLUX"
          />
          <HealthMetricCard
            label="Serum IL-6 Assay"
            value="3.4"
            unit="pg/mL"
            trend="down"
            delta="-0.2"
            status="NOMINAL"
            icon={ShieldAlert}
            subtext="NOMINAL (<5.0)"
          />
        </div>

        {/* Interactive Deep-Dive Chart Console */}
        <div className="editorial-frame bg-[#FFFFFF] border-2 border-[#111111] p-6 sm:p-10 shadow-editorial space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCD8CD] pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider">
                LIVE TELEMETRY STREAM // CDR. MARCUS CHEN (SOL 142)
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center space-x-1.5 p-1 bg-[#F2F0EA] rounded-full border border-[#DCD8CD] font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('heart')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'heart'
                    ? 'bg-[#111111] text-[#F2F0EA] font-bold shadow-sm'
                    : 'text-[#444444] hover:text-[#111111]'
                }`}
              >
                Heart Rate (24h)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sleep')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'sleep'
                    ? 'bg-[#111111] text-[#F2F0EA] font-bold shadow-sm'
                    : 'text-[#444444] hover:text-[#111111]'
                }`}
              >
                Sleep Architecture
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('radiation')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'radiation'
                    ? 'bg-[#111111] text-[#F2F0EA] font-bold shadow-sm'
                    : 'text-[#444444] hover:text-[#111111]'
                }`}
              >
                Radiation Flux
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('biomarkers')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'biomarkers'
                    ? 'bg-[#111111] text-[#F2F0EA] font-bold shadow-sm'
                    : 'text-[#444444] hover:text-[#111111]'
                }`}
              >
                IL-6 Inflammatory
              </button>
            </div>
          </div>

          {/* Active Chart Display */}
          <div className="pt-2">
            {activeTab === 'heart' && (
              <HealthTrendChart
                data={heartData}
                title="Circadian Heart Rate Profile (24-Hour Sol Interval)"
                unit="BPM"
                baselineMin={54}
                baselineMax={76}
                strokeColor="#111111"
                height={180}
              />
            )}
            {activeTab === 'sleep' && (
              <HealthTrendChart
                data={sleepData}
                title="7-Sol Total Sleep Duration vs Flight Surgeon Target (7.0h)"
                unit="HOURS"
                baselineMin={6.5}
                baselineMax={8.0}
                strokeColor="#75D8DC"
                height={180}
              />
            )}
            {activeTab === 'radiation' && (
              <HealthTrendChart
                data={radiationData}
                title="Galactic Cosmic Ray Dosimetry Trend (mSv/d)"
                unit="mSv/d"
                baselineMin={0.3}
                baselineMax={0.5}
                strokeColor="#FF6B35"
                height={180}
              />
            )}
            {activeTab === 'biomarkers' && (
              <HealthTrendChart
                data={biomarkerData}
                title="IL-6 Inflammatory Response Across Mission Phases"
                unit="pg/mL"
                baselineMin={1.5}
                baselineMax={4.5}
                strokeColor="#111111"
                height={180}
              />
            )}
          </div>

          <div className="pt-4 border-t border-[#DCD8CD] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[#888882]">
              Mathematical Z-Score deviation currently at +0.02σ across composite baseline envelope.
            </span>
            <Link
              to={ROUTES.HEALTH_TWIN}
              className="px-4 py-2 bg-[#111111] text-[#F2F0EA] hover:bg-[#242424] rounded-full font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <span>OPEN FULL 30-DAY TWIN</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#75D8DC]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
