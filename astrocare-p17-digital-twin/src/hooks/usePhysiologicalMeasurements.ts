import { useState, useEffect, useCallback } from 'react';
import {
  PhysiologicalMeasurement,
  PhysiologicalSystemType,
  SystemStatusSummary,
} from '../types';
import { measurementService } from '../services/measurementService';

export function usePhysiologicalMeasurements(astronautId: string) {
  const [measurements, setMeasurements] = useState<PhysiologicalMeasurement[]>([]);
  const [systemSummaries, setSystemSummaries] = useState<SystemStatusSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshMeasurements = useCallback(() => {
    if (!astronautId) return;
    setLoading(true);
    const data = measurementService.getByAstronaut(astronautId);
    setMeasurements(data);
    const summaries = measurementService.getSystemSummaries(astronautId);
    setSystemSummaries(summaries);
    setLoading(false);
  }, [astronautId]);

  useEffect(() => {
    refreshMeasurements();
  }, [refreshMeasurements]);

  const getSystemMeasurements = (system: PhysiologicalSystemType) => {
    return measurements.filter((m) => m.system === system);
  };

  const getVariableMeasurements = (variable: string) => {
    return measurements
      .filter((m) => m.variable === variable)
      .sort((a, b) => a.missionDay - b.missionDay);
  };

  const addMeasurement = (measurement: Omit<PhysiologicalMeasurement, 'id'>) => {
    const created = measurementService.addMeasurement(measurement);
    refreshMeasurements();
    return created;
  };

  return {
    measurements,
    systemSummaries,
    loading,
    refreshMeasurements,
    getSystemMeasurements,
    getVariableMeasurements,
    addMeasurement,
  };
}
