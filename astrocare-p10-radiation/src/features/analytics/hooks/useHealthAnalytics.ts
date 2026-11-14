/**
 * ASTROCARE HEALTH ANALYTICS REACT HOOK
 * Binds live virtual telemetry and radiation streams to baseline analytics,
 * deterministic risk scoring, and alert management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { simulationEngine } from '@/features/simulation/engine/SimulationEngine';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { HealthAlert } from '@/types/database.types';
import { SEED_ASTRONAUTS } from '@/data/seedData';
import { getAstronautBaseline, calculateAllDeviations } from '../baselineEngine';
import { evaluateHealthRisk } from '../riskEngine';
import { alertEngine } from '../alertEngine';
import {
  AstronautBaselineProfile,
  CompositeRiskAssessment,
  ParameterDeviation,
  HealthParameter,
  RiskHistoryPoint,
} from '../types';

export function useHealthAnalytics(initialAstronautId?: string) {
  const [astronautId, setAstronautId] = useState<string>(
    initialAstronautId || simulationEngine.getState().astronautId || 'ASTRO-01'
  );

  const baselineRef = useRef<AstronautBaselineProfile>(getAstronautBaseline(astronautId));
  const [baseline, setBaseline] = useState<AstronautBaselineProfile>(baselineRef.current);

  const [latestVitals, setLatestVitals] = useState<VitalSignsPacket | null>(
    simulationEngine.getLatestVitals()
  );
  const [latestRadiation, setLatestRadiation] = useState<RadiationPacket | null>(
    simulationEngine.getLatestRadiation()
  );

  const [deviations, setDeviations] = useState<Record<HealthParameter, ParameterDeviation>>(() => {
    const dummyVitals: VitalSignsPacket = {
      packetId: 'dummy',
      astronautId,
      missionId: 'm-ares-06',
      timestamp: new Date().toISOString(),
      dataSource: 'SIMULATOR',
      isSimulated: true,
      vitals: {
        heartRate: { value: baselineRef.current.restingHr, unit: 'bpm', quality: 'NOMINAL' },
        bloodPressure: {
          systolic: baselineRef.current.bpSystolic,
          diastolic: baselineRef.current.bpDiastolic,
          unit: 'mmHg',
          quality: 'NOMINAL',
        },
        spo2: { value: baselineRef.current.spo2, unit: '%', quality: 'NOMINAL' },
        respiratoryRate: { value: baselineRef.current.respiratoryRate, unit: 'rpm', quality: 'NOMINAL' },
        coreTemp: { value: baselineRef.current.coreTemp, unit: '°C', quality: 'NOMINAL' },
      },
    };
    return calculateAllDeviations(dummyVitals.vitals, null, baselineRef.current);
  });

  const [riskAssessment, setRiskAssessment] = useState<CompositeRiskAssessment>(() => {
    const dummyVitals: VitalSignsPacket = {
      packetId: 'dummy',
      astronautId,
      missionId: 'm-ares-06',
      timestamp: new Date().toISOString(),
      dataSource: 'SIMULATOR',
      isSimulated: true,
      vitals: {
        heartRate: { value: baselineRef.current.restingHr, unit: 'bpm', quality: 'NOMINAL' },
        bloodPressure: {
          systolic: baselineRef.current.bpSystolic,
          diastolic: baselineRef.current.bpDiastolic,
          unit: 'mmHg',
          quality: 'NOMINAL',
        },
        spo2: { value: baselineRef.current.spo2, unit: '%', quality: 'NOMINAL' },
        respiratoryRate: { value: baselineRef.current.respiratoryRate, unit: 'rpm', quality: 'NOMINAL' },
        coreTemp: { value: baselineRef.current.coreTemp, unit: '°C', quality: 'NOMINAL' },
      },
    };
    return evaluateHealthRisk(dummyVitals, null, baselineRef.current);
  });

  const [alerts, setAlerts] = useState<HealthAlert[]>(alertEngine.getAllAlerts(astronautId));
  const [riskHistory, setRiskHistory] = useState<RiskHistoryPoint[]>([]);

  // Synchronize astronaut baseline when target astronaut changes
  const updateTargetAstronaut = useCallback((newAstroId: string) => {
    setAstronautId(newAstroId);
    const newBaseline = getAstronautBaseline(newAstroId);
    baselineRef.current = newBaseline;
    setBaseline(newBaseline);
    setAlerts(alertEngine.getAllAlerts(newAstroId));
  }, []);

  useEffect(() => {
    // 1. Subscribe to alerts changes
    const unsubAlerts = alertEngine.onAlertsChange((allAlerts) => {
      setAlerts(allAlerts.filter((a) => a.astronaut_id === astronautId));
    });

    // 2. Subscribe to simulation state changes
    const unsubState = simulationEngine.onStateChange((simState) => {
      if (simState.astronautId !== astronautId) {
        updateTargetAstronaut(simState.astronautId);
      }
    });

    // 3. Subscribe to radiation packets
    const unsubRadiation = simulationEngine.onRadiationPacket((radPacket) => {
      setLatestRadiation(radPacket);
    });

    // 4. Subscribe to live telemetry packets
    const unsubTelemetry = simulationEngine.onTelemetryPacket((vitalsPacket) => {
      // Ignore packets for other astronauts if viewing an isolated profile
      if (vitalsPacket.astronautId !== baselineRef.current.astronautId) {
        return;
      }

      setLatestVitals(vitalsPacket);

      const rad = simulationEngine.getLatestRadiation();
      const currentBaseline = baselineRef.current;

      // Calculate baseline deviations
      const newDeviations = calculateAllDeviations(vitalsPacket.vitals, rad, currentBaseline);
      setDeviations(newDeviations);

      // Evaluate deterministic composite risk
      const assessment = evaluateHealthRisk(vitalsPacket, rad, currentBaseline);
      setRiskAssessment(assessment);

      // Evaluate alert rules with deduplication
      alertEngine.evaluateTelemetry(vitalsPacket, rad, currentBaseline);

      // Append to rolling risk history buffer (max 30 points)
      setRiskHistory((prev) => {
        const d = new Date(vitalsPacket.timestamp);
        const timeLabel = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

        const point: RiskHistoryPoint = {
          time: timeLabel,
          timestamp: vitalsPacket.timestamp,
          compositeScore: assessment.compositeScore,
          cardioScore: assessment.subsystems.CARDIOVASCULAR.score,
          respiratoryScore: assessment.subsystems.RESPIRATORY.score,
          radiationScore: assessment.subsystems.RADIATION.score,
        };

        const updated = [...prev, point];
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
      });
    });

    return () => {
      unsubAlerts();
      unsubState();
      unsubRadiation();
      unsubTelemetry();
    };
  }, [astronautId, updateTargetAstronaut]);

  const acknowledgeAlert = useCallback(
    async (alertId: string, notes?: string) => {
      await alertEngine.acknowledgeAlert(alertId, 'FLIGHT_SURGEON', notes);
    },
    []
  );

  const resolveAlert = useCallback(
    async (alertId: string, notes?: string) => {
      await alertEngine.resolveAlert(alertId, 'FLIGHT_SURGEON', notes);
    },
    []
  );

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const acknowledgedAlerts = alerts.filter((a) => a.status === 'ACKNOWLEDGED');
  const resolvedAlerts = alerts.filter((a) => a.status === 'RESOLVED');

  const currentAstronaut =
    SEED_ASTRONAUTS.find((a) => a.id === astronautId) || SEED_ASTRONAUTS[0];

  return {
    astronautId,
    currentAstronaut,
    baseline,
    latestVitals,
    latestRadiation,
    deviations,
    riskAssessment,
    activeAlerts,
    acknowledgedAlerts,
    resolvedAlerts,
    allAlerts: alerts,
    riskHistory,
    setAstronaut: updateTargetAstronaut,
    acknowledgeAlert,
    resolveAlert,
    isSimulating: simulationEngine.getState().status === 'RUNNING',
  };
}
