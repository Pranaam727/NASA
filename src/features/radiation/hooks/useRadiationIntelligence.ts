import { useState, useEffect, useMemo } from 'react';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import {
  RadiationDoseReading,
  RadiationEventRecord,
  BiologicalRiskEvaluation,
  ShieldingScenarioConfig,
  ShieldingScenarioResult,
  NASAResearchReference,
} from '../types/radiationTypes';
import { RadiationAnalyticsEngine } from '../services/radiationAnalytics';
import { NASAResearchAdapter } from '../services/nasaResearchAdapter';

export function useRadiationIntelligence(initialAstronautId: string = 'ASTRO-01') {
  const {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    latestRadiation,
    isStreaming,
    assessment,
    activeAlerts,
  } = useHealthAnalytics(initialAstronautId);

  // Dose Readings State
  const currentFlux = latestRadiation?.ambientFluxUsVh ?? 0.052;
  const accumulatedDose = latestRadiation?.accumulatedDoseMSv ?? 48.64;
  const isSpeActive = latestRadiation?.solarParticleEventActive ?? currentFlux > 1.0;

  // Active Radiation Reading Object
  const currentReading: RadiationDoseReading = useMemo(() => ({
    timestamp: latestRadiation?.timestamp || new Date().toISOString(),
    ambientFluxUsVh: currentFlux,
    fluxGcrUsVh: Math.min(currentFlux, 0.22),
    fluxSpeUsVh: Math.max(0, currentFlux - 0.22),
    accumulatedDoseMsv: accumulatedDose,
    careerDoseMsv: 42.0 + accumulatedDose,
    isSimulated: true,
    dataSource: 'SIMULATOR',
  }), [latestRadiation, currentFlux, accumulatedDose]);

  // Biological Risk Evaluation
  const biologicalRisk: BiologicalRiskEvaluation = useMemo(() => {
    return RadiationAnalyticsEngine.evaluateBiologicalRisk(accumulatedDose, 42.0, currentFlux);
  }, [accumulatedDose, currentFlux]);

  // Active / Historical SPE Events
  const [events, setEvents] = useState<RadiationEventRecord[]>([
    {
      id: 'SPE-EVT-001',
      timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
      speClass: 'S2_MODERATE',
      peakFluxUsVh: 4.82,
      durationMinutes: 145,
      protonEnergyMev: 50,
      active: false,
      stormShelterOrdered: false,
      summary: 'Coronal mass ejection glancing pass. Minor dosimeter deflection registered in Node 2 forward bay.',
    },
  ]);

  // Shielding Scenario State
  const [scenarioConfig, setScenarioConfig] = useState<ShieldingScenarioConfig>({
    environment: 'CISLUNAR',
    material: 'POLYETHYLENE',
    thicknessGcm2: 20,
    stormShelterActive: false,
  });

  const scenarioResult: ShieldingScenarioResult = useMemo(() => {
    return RadiationAnalyticsEngine.calculateShieldingScenario(scenarioConfig);
  }, [scenarioConfig]);

  // NASA Research References
  const researchReferences: NASAResearchReference[] = useMemo(() => {
    return NASAResearchAdapter.getEvidenceBase();
  }, []);

  // Sync active SPE event when simulation sensor fires
  useEffect(() => {
    if (isSpeActive) {
      const activeEvt = events.find((e) => e.active);
      if (!activeEvt) {
        const newEvent: RadiationEventRecord = {
          id: `SPE-EVT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          speClass: RadiationAnalyticsEngine.classifySPEEvent(currentFlux),
          peakFluxUsVh: currentFlux,
          durationMinutes: 15,
          protonEnergyMev: 100,
          active: true,
          stormShelterOrdered: currentFlux > 5.0,
          summary: 'ACTIVE SOLAR PROTON SURGE: Scintillation dosimeters indicate significant ionizing event exceeding baseline.',
        };
        setEvents((prev) => [newEvent, ...prev]);
      }
    }
  }, [isSpeActive, currentFlux, events]);

  return {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    currentReading,
    biologicalRisk,
    events,
    scenarioConfig,
    setScenarioConfig,
    scenarioResult,
    researchReferences,
    isStreaming,
    assessment,
    activeAlerts,
  };
}
