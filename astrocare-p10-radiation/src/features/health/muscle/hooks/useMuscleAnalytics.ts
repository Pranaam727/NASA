import { useEffect, useState } from 'react';
import { healthAssessmentService, alertService } from '@/services/dataProvider';
import { MuscleHealthProfile } from '@/features/health/muscle/types';
import { HealthAlert } from '@/types/database.types';

/**
 * Hook that provides muscle health analytics for a given astronaut.
 * It calculates baseline, latest, percentage change in grip strength and fires alerts
 * when loss exceeds 5%.
 */
export const useMuscleAnalytics = (astronautId: string) => {
  const [profile, setProfile] = useState<MuscleHealthProfile>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await healthAssessmentService.getMuscleAssessments(astronautId);
      const records = res?.data;
      if (!records || records.length === 0) {
        setProfile({});
        return;
      }
      const baselineRecord = records[0];
      const latestRecord = records[records.length - 1];

      const baselineGrip = baselineRecord.isometric_grip_strength_kg;
      const latestGrip = latestRecord.isometric_grip_strength_kg;
      const percChangeGrip = ((latestGrip - baselineGrip) / baselineGrip) * 100;

      if (percChangeGrip < -5 && alertService.recordAlert) {
        const alert: HealthAlert = {
          id: `alrt-muscle-${Date.now()}`,
          mission_id: 'm-ares-06',
          astronaut_id: astronautId,
          timestamp: new Date().toISOString(),
          rule_code: 'MUSCLE_GRIP_LOSS',
          severity: 'MEDIUM',
          status: 'ACTIVE',
          title: 'Grip Strength Decline',
          description: `Grip strength decreased ${percChangeGrip.toFixed(1)}% from baseline.`,
          triggering_value: latestGrip.toString(),
          baseline_expected: baselineGrip.toString(),
          created_at: new Date().toISOString(),
        };
        alertService.recordAlert(alert);
      }

      setProfile({
        baseline: {
          astronautId,
          timestamp: baselineRecord.assessment_date,
          gripStrengthKg: baselineGrip,
        },
        latest: {
          astronautId,
          timestamp: latestRecord.assessment_date,
          gripStrengthKg: latestGrip,
        },
        percentageChangeGrip: percChangeGrip,
      });
    };
    fetchData();
  }, [astronautId]);

  return profile;
};
