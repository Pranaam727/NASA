import { useState, useEffect, useCallback } from 'react';
import {
  simulationEngine,
  SimulationState,
  SimulationTimelineEvent,
} from '../engine/SimulationEngine';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { ScenarioId } from '../scenarios/scenarioTypes';

export interface VitalsHistoryPoint {
  time: string;
  heartRate: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  respiratoryRate: number;
  coreTemp: number;
  radiationFlux: number;
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(simulationEngine.getState());
  const [latestVitals, setLatestVitals] = useState<VitalSignsPacket | null>(
    simulationEngine.getLatestVitals()
  );
  const [latestRadiation, setLatestRadiation] = useState<RadiationPacket | null>(
    simulationEngine.getLatestRadiation()
  );
  const [vitalsHistory, setVitalsHistory] = useState<VitalsHistoryPoint[]>([]);
  const [events, setEvents] = useState<SimulationTimelineEvent[]>([]);

  useEffect(() => {
    // 1. Subscribe to State changes
    const unsubState = simulationEngine.onStateChange((newState) => {
      setState({ ...newState });
    });

    // 2. Subscribe to Telemetry Packets
    const unsubTelemetry = simulationEngine.onTelemetryPacket((packet) => {
      setLatestVitals(packet);

      // Append to bounded history (max 30 points for smooth charts)
      setVitalsHistory((prev) => {
        const d = new Date(packet.timestamp);
        const timeLabel = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

        const point: VitalsHistoryPoint = {
          time: timeLabel,
          heartRate: packet.vitals.heartRate.value,
          spo2: packet.vitals.spo2.value,
          systolic: packet.vitals.bloodPressure.systolic,
          diastolic: packet.vitals.bloodPressure.diastolic,
          respiratoryRate: packet.vitals.respiratoryRate.value,
          coreTemp: packet.vitals.coreTemp.value,
          radiationFlux: latestRadiation?.ambientFluxUsVh || 0.052,
        };

        const updated = [...prev, point];
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
      });
    });

    // 3. Subscribe to Radiation Packets
    const unsubRadiation = simulationEngine.onRadiationPacket((packet) => {
      setLatestRadiation(packet);
    });

    // 4. Subscribe to Simulation Events
    const unsubEvents = simulationEngine.onSimulationEvent((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 20));
    });

    return () => {
      unsubState();
      unsubTelemetry();
      unsubRadiation();
      unsubEvents();
    };
  }, [latestRadiation]);

  const start = useCallback((scenarioId?: ScenarioId, astronautId?: string) => {
    simulationEngine.start(scenarioId, astronautId);
  }, []);

  const pause = useCallback(() => {
    simulationEngine.pause();
  }, []);

  const resume = useCallback(() => {
    simulationEngine.resume();
  }, []);

  const reset = useCallback(() => {
    simulationEngine.reset();
    setVitalsHistory([]);
    setEvents([]);
  }, []);

  const setSpeed = useCallback((multiplier: number) => {
    simulationEngine.setSpeed(multiplier);
  }, []);

  const setScenario = useCallback((scenarioId: ScenarioId) => {
    simulationEngine.setScenario(scenarioId);
  }, []);

  const setAstronaut = useCallback((astronautId: string) => {
    simulationEngine.setAstronaut(astronautId);
  }, []);

  return {
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
    isRunning: state.status === 'RUNNING',
    isPaused: state.status === 'PAUSED',
    isStopped: state.status === 'STOPPED',
  };
}
