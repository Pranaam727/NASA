import { useEffect, useState } from 'react';
import { healthAssessmentService, alertService } from '@/services/dataProvider';
import { BoneHealthProfile } from '@/features/health/bone/types';
import { HealthAlert } from '@/types/database.types';

/**
 * Hook that provides bone health analytics for a given astronaut.
 * It calculates baseline, latest, percentage changes and fires alerts
 * when bone mineral density loss exceeds 5%.
 */
export const useBoneAnalytics = (astronautId: string) => {
  const [profile, setProfile] = useState<BoneHealthProfile>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await healthAssessmentService.getBoneAssessments(astronautId);
      const records = res?.data;
      if (!records || records.length === 0) {
        setProfile({});
        return;
      }
      // Sort or assume records are sorted by date
      const baseline = records[0];
      const latest = records[records.length - 1];
      const baseFemoral = baseline.femoral_neck_bmd_g_cm2;
      const latestFemoral = latest.femoral_neck_bmd_g_cm2;
      const baseLumbar = baseline.lumbar_spine_bmd_g_cm2;
      const latestLumbar = latest.lumbar_spine_bmd_g_cm2;

      const percChangeFemoral = ((latestFemoral - baseFemoral) / baseFemoral) * 100;
      const percChangeLumbar = ((latestLumbar - baseLumbar) / baseLumbar) * 100;

      // Alert if loss > 5% (negative change)
      if (percChangeFemoral < -5 && alertService.recordAlert) {
        const alert: HealthAlert = {
          id: `alrt-bone-femoral-${Date.now()}`,
          mission_id: 'm-ares-06',
          astronaut_id: astronautId,
          timestamp: new Date().toISOString(),
          rule_code: 'BONE_FEMORAL_LOSS',
          severity: 'MEDIUM',
          status: 'ACTIVE',
          title: 'Femoral Neck BMD Loss',
          description: `Femoral neck BMD decreased ${percChangeFemoral.toFixed(1)}% from baseline.`,
          triggering_value: latestFemoral.toString(),
          baseline_expected: baseFemoral.toString(),
          created_at: new Date().toISOString(),
        };
        alertService.recordAlert(alert);
      }
      if (percChangeLumbar < -5 && alertService.recordAlert) {
        const alert: HealthAlert = {
          id: `alrt-bone-lumbar-${Date.now()}`,
          mission_id: 'm-ares-06',
          astronaut_id: astronautId,
          timestamp: new Date().toISOString(),
          rule_code: 'BONE_LUMBAR_LOSS',
          severity: 'MEDIUM',
          status: 'ACTIVE',
          title: 'Lumbar Spine BMD Loss',
          description: `Lumbar spine BMD decreased ${percChangeLumbar.toFixed(1)}% from baseline.`,
          triggering_value: latestLumbar.toString(),
          baseline_expected: baseLumbar.toString(),
          created_at: new Date().toISOString(),
        };
        alertService.recordAlert(alert);
      }

      setProfile({
        baseline: {
          astronautId,
          timestamp: baseline.assessment_date,
          femoralNeckBmd: baseFemoral,
          lumbarSpineBmd: baseLumbar,
        },
        latest: {
          astronautId,
          timestamp: latest.assessment_date,
          femoralNeckBmd: latestFemoral,
          lumbarSpineBmd: latestLumbar,
        },
        percentageChangeFemoralNeck: percChangeFemoral,
        percentageChangeLumbarSpine: percChangeLumbar,
      });
    };
    fetchData();
  }, [astronautId]);

  return profile;
};
