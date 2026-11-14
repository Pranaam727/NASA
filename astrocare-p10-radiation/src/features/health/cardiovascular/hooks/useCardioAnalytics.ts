import { useEffect, useState } from 'react';
import { useTelemetry } from '@/features/simulation/hooks/useTelemetry';
import { CARDIO_THRESHOLDS } from '@/features/health/cardiovascular/constants/cardioThresholds';
import { alertService } from '@/services/dataProvider';
import { HealthAlert } from '@/types/database.types';

/**
 * Hook that analyses cardiovascular telemetry in real time.
 * It computes resting HR, HRV (simple std dev), exercise spikes, and fires alerts
 * when thresholds are exceeded.
 */
export const useCardioAnalytics = () => {
  const { latestPacket, history } = useTelemetry();
  const [restingHR, setRestingHR] = useState<number | null>(null);
  const [hrv, setHRV] = useState<number | null>(null);
  const [exerciseSpike, setExerciseSpike] = useState<boolean>(false);

  // Helper to compute standard deviation
  const stdDev = (arr: number[]) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + (b - avg) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
  };

  useEffect(() => {
    if (!latestPacket) return;
    const { vitals, activity } = latestPacket;
    const hr = vitals?.heartRate?.value;
    const astronautId = latestPacket.astronautId || 'ASTRO-01';

    if (hr !== undefined && alertService.recordAlert) {
      // Alert based on thresholds
      const warnHr = CARDIO_THRESHOLDS.warning.heartRate;
      const critHr = CARDIO_THRESHOLDS.critical.heartRate;
      if (hr >= critHr) {
        const alert: HealthAlert = {
          id: `alrt-hr-crit-${Date.now()}`,
          mission_id: 'm-ares-06',
          astronaut_id: astronautId,
          timestamp: new Date().toISOString(),
          rule_code: 'HR_CRITICAL',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          title: 'Critical Heart Rate',
          description: `Heart rate ${hr} bpm exceeds critical threshold ${critHr}.`,
          triggering_value: hr.toString(),
          baseline_expected: warnHr.toString(),
          created_at: new Date().toISOString(),
        };
        alertService.recordAlert(alert);
      } else if (hr >= warnHr) {
        const alert: HealthAlert = {
          id: `alrt-hr-warn-${Date.now()}`,
          mission_id: 'm-ares-06',
          astronaut_id: astronautId,
          timestamp: new Date().toISOString(),
          rule_code: 'HR_WARNING',
          severity: 'MEDIUM',
          status: 'ACTIVE',
          title: 'High Heart Rate',
          description: `Heart rate ${hr} bpm exceeds warning threshold ${warnHr}.`,
          triggering_value: hr.toString(),
          baseline_expected: warnHr.toString(),
          created_at: new Date().toISOString(),
        };
        alertService.recordAlert(alert);
      }
    }

    // Resting HR: average over last 30 seconds where activity speedMultiplier <= 1
    const restingSamples = history
      .filter((p) => (p.activity?.speedMultiplier ?? 1) <= 1)
      .slice(-30)
      .map((p) => p.vitals?.heartRate?.value)
      .filter((v): v is number => v !== undefined);
    if (restingSamples.length > 0) {
      const avg = restingSamples.reduce((a: number, b: number) => a + b, 0) / restingSamples.length;
      setRestingHR(Math.round(avg));
    }

    // HRV: std dev of last 20 heart rate samples
    const hrSamples = history
      .map((p) => p.vitals?.heartRate?.value)
      .filter((v): v is number => v !== undefined)
      .slice(-20);
    if (hrSamples.length > 1) {
      setHRV(Math.round(stdDev(hrSamples)));
    }

    // Exercise spike detection: if activity speedMultiplier > 1 and HR exceeds baseline + 20%
    if (activity?.speedMultiplier && activity.speedMultiplier > 1 && hr) {
      const baseline = restingHR ?? 0;
      if (baseline > 0 && hr > baseline * 1.2) {
        setExerciseSpike(true);
        if (alertService.recordAlert) {
          const alert: HealthAlert = {
            id: `alrt-hr-spike-${Date.now()}`,
            mission_id: 'm-ares-06',
            astronaut_id: astronautId,
            timestamp: new Date().toISOString(),
            rule_code: 'EXERCISE_SPIKE',
            severity: 'LOW',
            status: 'ACTIVE',
            title: 'Exercise Heart Rate Spike',
            description: `Heart rate ${hr} bpm spike during elevated activity.`,
            triggering_value: hr.toString(),
            baseline_expected: baseline.toString(),
            created_at: new Date().toISOString(),
          };
          alertService.recordAlert(alert);
        }
      } else {
        setExerciseSpike(false);
      }
    }
  }, [latestPacket, history, restingHR]);

  return { restingHR, hrv, exerciseSpike };
};
