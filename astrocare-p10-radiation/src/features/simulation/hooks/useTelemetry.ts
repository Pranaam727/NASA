import { useState, useEffect } from 'react';
import { simulationEngine } from '../engine/SimulationEngine';
import { VitalSignsPacket } from '@/types/telemetry';

export interface TelemetryHistoryPacket extends VitalSignsPacket {
  activity?: { speedMultiplier: number };
}

export function useTelemetry() {
  const [latestPacket, setLatestPacket] = useState<TelemetryHistoryPacket | null>(() => {
    const vitals = simulationEngine.getLatestVitals();
    return vitals ? { ...vitals, activity: { speedMultiplier: simulationEngine.getState().speedMultiplier } } : null;
  });
  const [history, setHistory] = useState<TelemetryHistoryPacket[]>([]);

  useEffect(() => {
    const unsub = simulationEngine.onTelemetryPacket((packet) => {
      const enriched: TelemetryHistoryPacket = {
        ...packet,
        activity: { speedMultiplier: simulationEngine.getState().speedMultiplier },
      };
      setLatestPacket(enriched);
      setHistory((prev) => [enriched, ...prev].slice(0, 100));
    });
    return () => unsub();
  }, []);

  return { latestPacket, history };
}
