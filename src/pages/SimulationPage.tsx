import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { useSimulation } from '@/features/simulation/hooks/useSimulation';
import { SimulationHeader } from '@/features/simulation/components/SimulationHeader';
import { SimulationControls } from '@/features/simulation/components/SimulationControls';
import { ScenarioSelector } from '@/features/simulation/components/ScenarioSelector';
import { LiveInstrumentRack } from '@/features/simulation/components/LiveInstrumentRack';
import { EcgOscilloscopeView } from '@/features/simulation/components/EcgOscilloscopeView';
import { LiveChartsView } from '@/features/simulation/components/LiveChartsView';
import { EventTimelineView } from '@/features/simulation/components/EventTimelineView';
import { SEED_ASTRONAUTS } from '@/data/seedData';

export const SimulationPage: React.FC = () => {
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
        subtitle="Autonomous physiological and environmental mathematical simulation testbed"
        metadata={[
          { label: 'Mission', value: 'ARES-VI' },
          { label: 'Subject', value: `${currentAstro.profile?.callsign} (${currentAstro.profile?.full_name})` },
          { label: 'Scenario', value: state.scenario.name },
          { label: 'Engine Clock', value: `${state.speedMultiplier}x Rate` },
        ]}
      />

      {/* 2. Top Status Strip */}
      <SimulationHeader state={state} />

      {/* 3. Primary Lifecycle Controls */}
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

      {/* 4. Live Multi-Channel Instruments */}
      <LiveInstrumentRack vitals={latestVitals} radiation={latestRadiation} />

      {/* 5. Real-Time 50Hz ECG Oscilloscope Strip */}
      <EcgOscilloscopeView
        currentHeartRate={latestVitals?.vitals.heartRate.value ?? currentAstro.baseline_resting_hr}
        isRunning={isRunning}
      />

      {/* 6. Live Recharts Trends */}
      <LiveChartsView history={vitalsHistory} />

      {/* 7. Scenario Selection Repertoire */}
      <ScenarioSelector
        currentScenarioId={state.scenario.id}
        onSelectScenario={(id) => {
          setScenario(id);
          if (!isRunning && !isPaused) {
            start(id);
          }
        }}
      />

      {/* 8. Event Timeline Log */}
      <EventTimelineView events={events} />
    </PageContainer>
  );
};
