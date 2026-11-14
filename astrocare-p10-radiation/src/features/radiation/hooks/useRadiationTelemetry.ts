import { useState, useEffect, useRef } from 'react';
import { simulationEngine } from '@/features/simulation/engine/SimulationEngine';
import { RadiationPacket } from '@/types/telemetry';
import { radiationAnalyticsService } from '../services/radiationAnalyticsService';
import { RadiationAlert } from '../types/radiationTypes';

export interface RadiationHistoryPoint {
  time: string;
  timestamp: string;
  fluxUsVh: number;
  accumulatedDoseMSv: number;
  isSpeActive: boolean;
}

export function useRadiationTelemetry(astronautId: string = 'ASTRO-01') {
  const [latestPacket, setLatestPacket] = useState<RadiationPacket | null>(
    simulationEngine.getLatestRadiation()
  );

  const [history, setHistory] = useState<RadiationHistoryPoint[]>(() => {
    const base = simulationEngine.getLatestRadiation()?.ambientFluxUsVh ?? 0.052;
    const baseDose = simulationEngine.getLatestRadiation()?.accumulatedDoseMSv ?? 48.64;
    const now = Date.now();
    const initial: RadiationHistoryPoint[] = [];
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now - i * 1000);
      const timeLabel = `${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
      initial.push({
        time: timeLabel,
        timestamp: t.toISOString(),
        fluxUsVh: Number((base + Math.sin(i * 0.5) * 0.003).toFixed(3)),
        accumulatedDoseMSv: Number((baseDose - i * 0.00001).toFixed(4)),
        isSpeActive: false,
      });
    }
    return initial;
  });

  const [activeAlert, setActiveAlert] = useState<RadiationAlert | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<RadiationAlert[]>([]);
  const lastPacketRef = useRef<RadiationPacket | null>(latestPacket);

  useEffect(() => {
    const unsub = simulationEngine.onRadiationPacket((packet) => {
      setLatestPacket(packet);
      lastPacketRef.current = packet;

      const d = new Date(packet.timestamp);
      const timeLabel = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

      setHistory((prev) => {
        const point: RadiationHistoryPoint = {
          time: timeLabel,
          timestamp: packet.timestamp,
          fluxUsVh: packet.ambientFluxUsVh,
          accumulatedDoseMSv: packet.accumulatedDoseMSv,
          isSpeActive: packet.solarParticleEventActive,
        };
        const updated = [...prev, point];
        return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
      });

      // Threshold alert evaluation
      const triggered = radiationAnalyticsService.evaluateAlert(
        packet.ambientFluxUsVh,
        astronautId,
        packet.isSimulated
      );

      if (triggered) {
        setActiveAlert(triggered);
        setRecentAlerts((prev) => [triggered, ...prev].slice(0, 10));
      } else if (packet.ambientFluxUsVh < 0.5) {
        // Clear active alert when flux returns to nominal
        setActiveAlert(null);
      }
    });

    return () => unsub();
  }, [astronautId]);

  const acknowledgeAlert = (alertId: string) => {
    setActiveAlert((prev) =>
      prev?.id === alertId ? { ...prev, acknowledgementStatus: 'ACKNOWLEDGED' } : prev
    );
    setRecentAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledgementStatus: 'ACKNOWLEDGED' } : a))
    );
  };

  return {
    latestPacket,
    fluxUsVh: latestPacket?.ambientFluxUsVh ?? 0.052,
    accumulatedDoseMSv: latestPacket?.accumulatedDoseMSv ?? 48.64,
    isSpeActive: latestPacket?.solarParticleEventActive ?? false,
    quality: latestPacket?.quality ?? 'NOMINAL',
    history,
    activeAlert,
    recentAlerts,
    acknowledgeAlert,
    isSimulated: true,
  };
}
