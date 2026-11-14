import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Astronaut, HealthAlert } from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { CompositeHealthAssessment, RiskLevel } from '../types/analyticsTypes';
import { HealthRiskEngine } from '../engine/HealthRiskEngine';
import { alertManager } from '../engine/AlertManager';
import { simulationEngine } from '@/features/simulation/engine/SimulationEngine';
import { astronautService, alertService } from '@/services/dataProvider';
import { SEED_ASTRONAUTS } from '@/data/seedData';

const riskEngine = new HealthRiskEngine();

export function useHealthAnalytics(initialAstronautId: string = 'ASTRO-01') {
  const [astronauts, setAstronauts] = useState<Astronaut[]>(SEED_ASTRONAUTS);
  const [selectedAstronautId, setSelectedAstronautId] = useState<string>(initialAstronautId);
  const [latestVitals, setLatestVitals] = useState<VitalSignsPacket | null>(() => simulationEngine.getLatestVitals());
  const [latestRadiation, setLatestRadiation] = useState<RadiationPacket | null>(() => simulationEngine.getLatestRadiation());
  const [assessment, setAssessment] = useState<CompositeHealthAssessment | null>(null);
  const [history, setHistory] = useState<CompositeHealthAssessment[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>(() => alertManager.getAllAlerts());
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const selectedAstroRef = useRef<Astronaut | null>(null);

  // Find active astronaut
  const selectedAstronaut = useMemo(() => {
    const found = astronauts.find((a) => a.id === selectedAstronautId);
    return found || astronauts[0] || SEED_ASTRONAUTS[0];
  }, [astronauts, selectedAstronautId]);

  selectedAstroRef.current = selectedAstronaut;

  // Load crew data from service
  useEffect(() => {
    let mounted = true;
    astronautService.getAstronautsByMission('m-ares-06').then((res) => {
      if (mounted && res.data && res.data.length > 0) {
        setAstronauts(res.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch initial alerts
  useEffect(() => {
    let mounted = true;
    alertService.getAllAlerts('m-ares-06').then((res) => {
      if (mounted && res.data && res.data.length > 0) {
        // Sync with AlertManager if empty
        if (alertManager.getAllAlerts().length === 0) {
          res.data.forEach((alt) => alertManager.getActiveAlerts().push(alt));
        }
        setAlerts(alertManager.getAllAlerts());
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Subscribe to AlertManager changes
  useEffect(() => {
    return alertManager.onAlertsChanged((updatedAlerts) => {
      setAlerts([...updatedAlerts]);
    });
  }, []);

  // Process incoming telemetry packet
  const processTelemetry = useCallback(
    (packet: VitalSignsPacket, rad?: RadiationPacket | null) => {
      const currentAstro = selectedAstroRef.current;
      // Only process telemetry matching the currently observed astronaut
      if (packet.astronautId !== currentAstro?.id) {
        return;
      }

      setLatestVitals(packet);
      setIsStreaming(true);

      const radData = rad !== undefined ? rad : simulationEngine.getLatestRadiation();
      if (radData) setLatestRadiation(radData);

      // Evaluate physiological strain & risks
      const newAssessment = riskEngine.evaluateAssessment(packet, radData, currentAstro);
      setAssessment(newAssessment);

      // Evaluate rule thresholds & generate alerts
      const generated = alertManager.evaluateTelemetry(packet, newAssessment, radData, currentAstro);
      if (generated.length > 0 && alertService.createAlert) {
        generated.forEach((alt) => {
          alertService.createAlert?.(alt).catch((err) => {
            console.error('Error recording generated alert:', err);
          });
        });
      }

      // Append to bounded history (last 40 points)
      setHistory((prev) => {
        const next = [...prev, newAssessment];
        if (next.length > 40) next.shift();
        return next;
      });
    },
    []
  );

  // Subscribe to Simulation Engine Telemetry Streams
  useEffect(() => {
    const unsubTelemetry = simulationEngine.onTelemetryPacket((packet) => {
      processTelemetry(packet);
    });

    const unsubRadiation = simulationEngine.onRadiationPacket((radPacket) => {
      setLatestRadiation(radPacket);
    });

    const unsubState = simulationEngine.onStateChange((state) => {
      setIsStreaming(state.status === 'RUNNING');
    });

    // If an initial packet exists, evaluate immediately
    const initialPacket = simulationEngine.getLatestVitals();
    if (initialPacket && initialPacket.astronautId === selectedAstronautId) {
      processTelemetry(initialPacket);
    }

    return () => {
      unsubTelemetry();
      unsubRadiation();
      unsubState();
    };
  }, [processTelemetry, selectedAstronautId]);

  // Acknowledge Alert Handler
  const handleAcknowledgeAlert = useCallback(async (alertId: string, notes?: string) => {
    alertManager.acknowledgeAlert(alertId, 'FLIGHT_SURGEON', notes);
    await alertService.acknowledgeAlert(alertId, 'FLIGHT_SURGEON', notes);
  }, []);

  // Resolve Alert Handler
  const handleResolveAlert = useCallback(async (alertId: string, notes?: string) => {
    alertManager.resolveAlert(alertId, 'FLIGHT_SURGEON', notes);
    if (alertService.resolveAlert) {
      await alertService.resolveAlert(alertId, 'FLIGHT_SURGEON', notes);
    }
  }, []);

  // Filtered alerts for the selected astronaut
  const astronautActiveAlerts = useMemo(() => {
    return alerts.filter(
      (a) => a.astronaut_id === selectedAstronautId && a.status === 'ACTIVE'
    );
  }, [alerts, selectedAstronautId]);

  const astronautAllAlerts = useMemo(() => {
    return alerts.filter((a) => a.astronaut_id === selectedAstronautId);
  }, [alerts, selectedAstronautId]);

  return {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    latestVitals,
    latestRadiation,
    assessment,
    history,
    riskLevel: (assessment?.overallRiskLevel || 'NORMAL') as RiskLevel,
    compositeScore: assessment?.compositeScore ?? 0,
    activeAlerts: astronautActiveAlerts,
    allAlerts: astronautAllAlerts,
    systemWideActiveAlerts: alerts.filter((a) => a.status === 'ACTIVE'),
    systemWideAllAlerts: alerts,
    acknowledgeAlert: handleAcknowledgeAlert,
    resolveAlert: handleResolveAlert,
    isStreaming,
    recalculate: processTelemetry,
  };
}
