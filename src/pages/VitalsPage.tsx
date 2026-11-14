import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MetricDisplay } from '@/components/common/DataDisplay';
import { Activity, Heart, Thermometer, Wind, Radio, User } from 'lucide-react';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { EcgOscilloscopeView } from '@/features/simulation/components/EcgOscilloscopeView';
import { BaselineComparisonMatrix } from '@/features/analytics/components/BaselineComparisonMatrix';
import { ParameterRiskCards } from '@/features/analytics/components/ParameterRiskCards';
import { CompositeRiskGauge } from '@/features/analytics/components/CompositeRiskGauge';

export const VitalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'ANALYTICS' | 'MATRIX'>('METRICS');
  const {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    latestVitals,
    latestRadiation,
    assessment,
    isStreaming,
  } = useHealthAnalytics();

  const comps = assessment?.baselineComparisons;
  const currentHr = latestVitals?.vitals.heartRate.value ?? selectedAstronaut.baseline_resting_hr;
  const currentSys = latestVitals?.vitals.bloodPressure.systolic ?? selectedAstronaut.baseline_bp_systolic;
  const currentDia = latestVitals?.vitals.bloodPressure.diastolic ?? selectedAstronaut.baseline_bp_diastolic;
  const currentSpo2 = latestVitals?.vitals.spo2.value ?? selectedAstronaut.baseline_spo2;
  const currentTemp = latestVitals?.vitals.coreTemp.value ?? 36.8;
  const currentResp = latestVitals?.vitals.respiratoryRate.value ?? 14;
  const currentRad = latestRadiation?.ambientFluxUsVh ?? 0.052;

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Header with Live Status & Subject */}
      <PageHeader
        title="Real-Time Vital Monitoring & Baseline Analytics"
        subtitle="Continuous telemetry streams, individualized baseline deviation analysis, and 50Hz ECG"
        badge={
          <StatusIndicator
            status={isStreaming ? 'NOMINAL' : 'INFO'}
            label={isStreaming ? '1HZ TELEMETRY ACTIVE' : 'STREAM STANDBY'}
            pulse={isStreaming}
          />
        }
        metadata={[
          { label: 'Mission', value: 'ARES-VI' },
          { label: 'Subject', value: `${selectedAstronaut.profile?.callsign} (${selectedAstronaut.profile?.full_name})` },
          { label: 'Sampling Rate', value: 'ECG 50Hz // Vitals 1Hz' },
          { label: 'Data Source', value: latestVitals?.dataSource || 'SIMULATOR' },
        ]}
      />

      {/* 2. Astronaut Switcher Strip */}
      <div className="bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <User className="w-4 h-4 text-astro-text-secondary" />
          <span className="text-astro-text-secondary uppercase">Monitored Crew Member:</span>
          <span className="font-bold text-astro-text-primary">
            {selectedAstronaut.profile?.full_name} ({selectedAstronaut.badge_number})
          </span>
        </div>

        <div className="flex items-center space-x-1.5 font-mono text-xs">
          {astronauts.map((astro) => (
            <button
              key={astro.id}
              onClick={() => setSelectedAstronautId(astro.id)}
              className={`px-3 py-1 rounded-sm border text-[11px] uppercase tracking-wider transition-colors ${
                selectedAstronautId === astro.id
                  ? 'bg-astro-text-primary text-astro-text-inverted border-astro-text-primary font-bold'
                  : 'bg-astro-bg-surface text-astro-text-secondary border-astro-border-hairline hover:bg-astro-bg-subtle'
              }`}
            >
              {astro.profile?.callsign || astro.id}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Navigation View Tabs */}
      <div className="flex border-b border-astro-border-hairline font-mono text-xs space-x-1">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`px-4 py-2 uppercase tracking-wider transition-colors border-b-2 font-medium ${
            activeTab === 'METRICS'
              ? 'border-astro-text-primary text-astro-text-primary font-bold'
              : 'border-transparent text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          Primary Telemetry
        </button>
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2 uppercase tracking-wider transition-colors border-b-2 font-medium ${
            activeTab === 'ANALYTICS'
              ? 'border-astro-text-primary text-astro-text-primary font-bold'
              : 'border-transparent text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          Risk & Strain Assessment
        </button>
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-4 py-2 uppercase tracking-wider transition-colors border-b-2 font-medium ${
            activeTab === 'MATRIX'
              ? 'border-astro-text-primary text-astro-text-primary font-bold'
              : 'border-transparent text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          Baseline Comparison Matrix
        </button>
      </div>

      {/* 4. Tab Views */}
      {activeTab === 'METRICS' && (
        <div className="space-y-4">
          {/* Top Metric Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricDisplay
              label="Heart Rate (ECG Lead II)"
              value={currentHr.toString()}
              unit="bpm"
              trend={comps ? (comps.HEART_RATE.absoluteDelta > 0 ? 'up' : comps.HEART_RATE.absoluteDelta < 0 ? 'down' : 'flat') : 'flat'}
              delta={comps ? `${comps.HEART_RATE.absoluteDelta > 0 ? '+' : ''}${comps.HEART_RATE.absoluteDelta} bpm` : '0 bpm'}
              status={comps?.HEART_RATE.riskLevel === 'CRITICAL' ? 'CRITICAL' : comps?.HEART_RATE.riskLevel === 'WARNING' || comps?.HEART_RATE.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              icon={Heart}
              subtext={`BASE: ${selectedAstronaut.baseline_resting_hr} BPM`}
              isSimulated
            />
            <MetricDisplay
              label="Blood Pressure (MAP)"
              value={`${currentSys}/${currentDia}`}
              unit="mmHg"
              trend={comps ? (comps.BLOOD_PRESSURE_SYS.absoluteDelta > 0 ? 'up' : comps.BLOOD_PRESSURE_SYS.absoluteDelta < 0 ? 'down' : 'flat') : 'flat'}
              delta={comps ? `${comps.BLOOD_PRESSURE_SYS.absoluteDelta > 0 ? '+' : ''}${comps.BLOOD_PRESSURE_SYS.absoluteDelta} mmHg` : '--'}
              status={comps?.BLOOD_PRESSURE_SYS.riskLevel === 'CRITICAL' ? 'CRITICAL' : comps?.BLOOD_PRESSURE_SYS.riskLevel === 'WARNING' || comps?.BLOOD_PRESSURE_SYS.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              icon={Activity}
              subtext={`BASE: ${selectedAstronaut.baseline_bp_systolic}/${selectedAstronaut.baseline_bp_diastolic}`}
              isSimulated
            />
            <MetricDisplay
              label="Oxygen Saturation (SpO2)"
              value={currentSpo2.toString()}
              unit="%"
              trend={comps ? (comps.SPO2.absoluteDelta > 0 ? 'up' : comps.SPO2.absoluteDelta < 0 ? 'down' : 'flat') : 'flat'}
              delta={comps ? `${comps.SPO2.absoluteDelta > 0 ? '+' : ''}${comps.SPO2.absoluteDelta}%` : '0.0%'}
              status={comps?.SPO2.riskLevel === 'CRITICAL' ? 'CRITICAL' : comps?.SPO2.riskLevel === 'WARNING' || comps?.SPO2.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              icon={Wind}
              subtext={`BASE: ${selectedAstronaut.baseline_spo2}%`}
              isSimulated
            />
            <MetricDisplay
              label="Core Body Temp"
              value={currentTemp.toFixed(1)}
              unit="°C"
              trend={comps ? (comps.CORE_TEMP.absoluteDelta > 0 ? 'up' : comps.CORE_TEMP.absoluteDelta < 0 ? 'down' : 'flat') : 'flat'}
              delta={comps ? `${comps.CORE_TEMP.absoluteDelta > 0 ? '+' : ''}${comps.CORE_TEMP.absoluteDelta}°C` : '--'}
              status={comps?.CORE_TEMP.riskLevel === 'CRITICAL' ? 'CRITICAL' : comps?.CORE_TEMP.riskLevel === 'WARNING' || comps?.CORE_TEMP.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              icon={Thermometer}
              subtext="BASE: 36.8°C"
              isSimulated
            />
          </div>

          {/* 50Hz Native Canvas ECG Oscilloscope Strip */}
          <EcgOscilloscopeView
            currentHeartRate={currentHr}
            isRunning={isStreaming}
          />

          {/* Secondary Parameters Bar (Respiratory & Radiation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricDisplay
              label="Respiratory Rate (Breathing)"
              value={currentResp.toString()}
              unit="rpm"
              trend={comps ? (comps.RESPIRATORY_RATE.absoluteDelta > 0 ? 'up' : comps.RESPIRATORY_RATE.absoluteDelta < 0 ? 'down' : 'flat') : 'flat'}
              delta={comps ? `${comps.RESPIRATORY_RATE.absoluteDelta > 0 ? '+' : ''}${comps.RESPIRATORY_RATE.absoluteDelta} rpm` : '0 rpm'}
              status={comps?.RESPIRATORY_RATE.riskLevel === 'CRITICAL' ? 'CRITICAL' : comps?.RESPIRATORY_RATE.riskLevel === 'WARNING' || comps?.RESPIRATORY_RATE.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              icon={Wind}
              subtext="BASE: 14 RPM"
              isSimulated
            />
            <MetricDisplay
              label="Ambient Radiation Flux"
              value={currentRad.toFixed(3)}
              unit="uSv/h"
              trend={comps ? (comps.RADIATION_FLUX.absoluteDelta > 0 ? 'up' : 'flat') : 'flat'}
              delta={comps ? `${comps.RADIATION_FLUX.absoluteDelta > 0 ? '+' : ''}${comps.RADIATION_FLUX.absoluteDelta} uSv/h` : '0 uSv/h'}
              status={comps?.RADIATION_FLUX.riskLevel === 'CRITICAL' ? 'CRITICAL' : comps?.RADIATION_FLUX.riskLevel === 'WARNING' || comps?.RADIATION_FLUX.riskLevel === 'CAUTION' ? 'CAUTION' : 'NOMINAL'}
              icon={Radio}
              subtext="BG LIMIT: 0.080 uSv/h"
              isSimulated
            />
          </div>
        </div>
      )}

      {activeTab === 'ANALYTICS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CompositeRiskGauge assessment={assessment} className="lg:col-span-1" />
            <div className="lg:col-span-2 space-y-3">
              <DossierCard
                title="PHYSIOLOGICAL PARAMETER RISK ASSESSMENTS"
                subtitle="STANDARDIZED RISK CONTRIBUTIONS AND THRESHOLD CLASSIFICATION"
              >
                <ParameterRiskCards parameterRisks={assessment?.parameterRisks} />
              </DossierCard>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MATRIX' && (
        <BaselineComparisonMatrix comparisons={assessment?.baselineComparisons} />
      )}
    </PageContainer>
  );
};
