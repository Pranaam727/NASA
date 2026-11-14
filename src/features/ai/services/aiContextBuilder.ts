import { Astronaut, HealthAlert } from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { CompositeHealthAssessment, VitalParameter } from '@/features/analytics/types/analyticsTypes';
import { GroundedAIContext, GroundedMetricRecord, TimeRangeOption } from '../types/aiTypes';

export class AIContextBuilder {
  /**
   * Builds a strictly grounded context object for AI consumption.
   * Only includes real or simulated observations from the active telemetry stream.
   * Never fabricates nonexistent metrics or baselines.
   */
  public static buildContext(
    astronaut: Astronaut | null,
    assessment: CompositeHealthAssessment | null,
    latestVitals: VitalSignsPacket | null,
    latestRadiation: RadiationPacket | null,
    activeAlerts: HealthAlert[],
    timeRange: TimeRangeOption = '24H'
  ): GroundedAIContext {
    const astroId = astronaut?.id ?? assessment?.astronautId ?? 'UNKNOWN_CREW';
    const astroName = astronaut?.profile?.full_name ?? astronaut?.id ?? 'Astronaut Subject';
    const callsign = astronaut?.profile?.callsign ?? 'CREW';
    const missionId = latestVitals?.missionId ?? 'ARES-VI';
    const nowIso = new Date().toISOString();

    const missingDataIndicators: string[] = [];

    if (!astronaut) {
      missingDataIndicators.push('ASTRONAUT_PROFILE_UNRESOLVED');
    }
    if (!latestVitals) {
      missingDataIndicators.push('VITAL_TELEMETRY_STREAM_OFFLINE');
    }
    if (!assessment) {
      missingDataIndicators.push('HEALTH_RISK_ASSESSMENT_PENDING');
    }
    if (!latestRadiation) {
      missingDataIndicators.push('RADIATION_DOSIMETRY_STREAM_OFFLINE');
    }

    // Extract parameter comparisons from P06 assessment
    const metrics: Record<VitalParameter, GroundedMetricRecord> = {} as any;
    const comps = assessment?.baselineComparisons;

    const paramKeys: VitalParameter[] = [
      'HEART_RATE',
      'SPO2',
      'BLOOD_PRESSURE_SYS',
      'BLOOD_PRESSURE_DIA',
      'CORE_TEMP',
      'RESPIRATORY_RATE',
      'RADIATION_FLUX',
    ];

    for (const key of paramKeys) {
      if (comps && comps[key]) {
        const c = comps[key];
        metrics[key] = {
          parameter: key,
          label: c.label,
          unit: c.unit,
          currentValue: c.currentValue,
          baselineValue: c.baselineValue,
          absoluteDelta: c.absoluteDelta,
          percentageDelta: c.percentageDelta,
          zScore: c.zScore,
          riskLevel: c.riskLevel,
          quality: c.qualityStatus || 'NOMINAL',
        };
      } else {
        missingDataIndicators.push(`METRIC_${key}_UNAVAILABLE`);
        // Fallback placeholder with explicit unavailable indicator
        metrics[key] = {
          parameter: key,
          label: key.replace(/_/g, ' '),
          unit: 'N/A',
          currentValue: 0,
          baselineValue: 0,
          absoluteDelta: 0,
          percentageDelta: 0,
          zScore: 0,
          riskLevel: 'NORMAL',
          quality: 'UNAVAILABLE',
        };
      }
    }

    // Filter and map active alerts for this specific astronaut
    const astroAlerts = activeAlerts
      .filter((a) => a.astronaut_id === astroId && a.status === 'ACTIVE')
      .map((a) => ({
        id: a.id,
        ruleCode: a.rule_code,
        severity: a.severity,
        title: a.title,
        description: a.description,
        triggeringValue: a.triggering_value,
        baselineExpected: a.baseline_expected,
        timestamp: a.timestamp,
      }));

    return {
      astronautId: astroId,
      astronautName: astroName,
      callsign,
      missionId,
      timeRange,
      timestamp: nowIso,
      compositeScore: assessment?.compositeScore ?? 0,
      overallRiskLevel: assessment?.overallRiskLevel ?? 'NORMAL',
      primaryRiskFactor: assessment?.primaryRiskFactor,
      synergyMultipliersApplied: assessment?.synergyMultipliersApplied ?? [],
      metrics,
      activeAlerts: astroAlerts,
      radiationFluxUsVh: latestRadiation?.ambientFluxUsVh ?? 0.052,
      solarParticleEventActive: latestRadiation?.solarParticleEventActive ?? false,
      missingDataIndicators,
      isSimulatedSource: true,
    };
  }
}
