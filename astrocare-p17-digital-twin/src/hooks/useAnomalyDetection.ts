import { useState, useEffect, useCallback } from 'react';
import { AnomalyRecord, AnomalyReviewStatus } from '../types';
import { anomalyDetectionService, AnomalyDetectionConfig } from '../services/anomalyDetectionService';

export function useAnomalyDetection(astronautId?: string) {
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [config, setConfig] = useState<AnomalyDetectionConfig>(anomalyDetectionService.getConfig());
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAnomalies = useCallback(() => {
    setLoading(true);
    const results = anomalyDetectionService.runDetection(astronautId);
    setAnomalies(results);
    setLoading(false);
  }, [astronautId]);

  useEffect(() => {
    refreshAnomalies();
  }, [refreshAnomalies]);

  const updateStatus = (id: string, status: AnomalyReviewStatus, notes?: string) => {
    const ok = anomalyDetectionService.updateAnomalyStatus(id, status, notes);
    if (ok) {
      refreshAnomalies();
    }
    return ok;
  };

  const updateDetectionConfig = (newConfig: Partial<AnomalyDetectionConfig>) => {
    anomalyDetectionService.updateConfig(newConfig);
    setConfig(anomalyDetectionService.getConfig());
    refreshAnomalies();
  };

  return {
    anomalies,
    config,
    loading,
    refreshAnomalies,
    updateStatus,
    updateDetectionConfig,
  };
}
