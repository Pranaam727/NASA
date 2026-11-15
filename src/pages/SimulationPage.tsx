import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { useSimulation } from '@/features/simulation/hooks/useSimulation';
import { SimulationHeader } from '@/features/simulation/components/SimulationHeader';
import { SimulationControls } from '@/features/simulation/components/SimulationControls';
import { ScenarioSelector } from '@/features/simulation/components/ScenarioSelector';
import { LiveInstrumentRack } from '@/features/simulation/components/LiveInstrumentRack';
import { EcgOscilloscopeView } from '@/features/simulation/components/EcgOscilloscopeView';
import { LiveChartsView } from '@/features/simulation/components/LiveChartsView';
import { EventTimelineView } from '@/features/simulation/components/EventTimelineView';
import { WhatIfSimulator } from '@/features/simulator/components/WhatIfSimulator';
import { SEED_ASTRONAUTS } from '@/data/seedData';
import { Activity, Sliders } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'WHAT_IF'>('TELEMETRY');

  const {
    state,
    latestVitals,
    latestRadiation,
    vitalsHistory,
    events,
    start,
    pause,
    resume,
    reset,
    setSpeed,
    setScenario,
    setAstronaut,
    isRunning,
    isPaused,
  } = useSimulation();

  const currentAstro =
    SEED_ASTRONAUTS.find((a) => a.id === state.astronautId) || SEED_ASTRONAUTS[0];

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Page Header */}
      <PageHeader
        title="Virtual Sensor & Telemetry Simulation Lab"
        subtitle="Autonomous physiological, environmental, and hypothetical multi-stressor simulation testbed"
        metadata={[
          { label: 'Mission', value: 'ARES-VI' },
          { label: 'Subject', value: `${currentAstro.profile?.callsign} (${currentAstro.profile?.full_name})` },
          { label: 'Mode', value: activeTab === 'TELEMETRY' ? 'Virtual Sensor Loop' : 'What-If Explorer' },
        ]}
      />

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-astro-border-hairline mb-6 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('TELEMETRY')}
          className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${
            activeTab === 'TELEMETRY'
              ? 'bg-astro-text-primary text-astro-text-inverted font-bold'
              : 'text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>VIRTUAL SENSOR & 50Hz TELEMETRY STREAM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('WHAT_IF')}
          className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${
            activeTab === 'WHAT_IF'
              ? 'bg-astro-text-primary text-astro-text-inverted font-bold'
              : 'text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>WHAT-IF MULTI-STRESSOR SCENARIO SANDBOX</span>
        </button>
      </div>

      {activeTab === 'WHAT_IF' ? (
        <WhatIfSimulator />
      ) : (
        <div className="space-y-6">
          {/* Top Status Strip */}
          <SimulationHeader state={state} />

          {/* Primary Lifecycle Controls */}
          <SimulationControls
            status={state.status}
            currentSpeed={state.speedMultiplier}
            currentAstronautId={state.astronautId}
            onStart={() => start()}
            onPause={() => pause()}
            onResume={() => resume()}
            onReset={() => reset()}
            onStop={() => reset()}
            onSetSpeed={setSpeed}
            onSetAstronaut={setAstronaut}
          />

          {/* Live Multi-Channel Instruments */}
          <LiveInstrumentRack vitals={latestVitals} radiation={latestRadiation} />

          {/* Real-Time 50Hz ECG Oscilloscope Strip */}
          <EcgOscilloscopeView
            currentHeartRate={latestVitals?.vitals.heartRate.value ?? currentAstro.baseline_resting_hr}
            isRunning={isRunning}
          />

          {/* Live Recharts Trends */}
          <LiveChartsView history={vitalsHistory} />

          {/* Scenario Selection Repertoire */}
          <ScenarioSelector
            currentScenarioId={state.scenario.id}
            onSelectScenario={(id) => {
              setScenario(id);
              if (!isRunning && !isPaused) {
                start(id);
              }
            }}
          />

          {/* Event Timeline Log */}
          <EventTimelineView events={events} />
        </div>
      )}
    </PageContainer>
  );
};
