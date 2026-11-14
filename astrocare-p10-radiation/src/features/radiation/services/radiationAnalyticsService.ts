import {
  RadiationMeasurement,
  RadiationTrendAnalytics,
  RadiationTimeRange,
  RadiationAlert,
  DEMO_RADIATION_THRESHOLDS,
  RadiationThresholdConfig,
} from '../types/radiationTypes';
import { integrateDoseTrapezoidal, TimeDosePoint } from '../utils/radiationUnits';
import { alertService } from '@/services/dataProvider';
import { HealthAlert } from '@/types/database.types';

export class RadiationAnalyticsService {
  private thresholds: RadiationThresholdConfig;
  private lastAlertTimestamp: Record<string, number> = {};
  private alertCooldownMs = 30000; // 30 second cooldown window for deduplication

  constructor(thresholds: RadiationThresholdConfig = DEMO_RADIATION_THRESHOLDS) {
    this.thresholds = thresholds;
  }

  public getThresholds(): RadiationThresholdConfig {
    return { ...this.thresholds };
  }

  /**
   * Filter measurements within a specified time range window
   */
  public filterByTimeRange(
    records: RadiationMeasurement[],
    range: RadiationTimeRange,
    now: Date = new Date()
  ): RadiationMeasurement[] {
    if (!records || records.length === 0) return [];

    let cutoffMs = 0;
    const nowMs = now.getTime();

    switch (range) {
      case '24_HOURS':
        cutoffMs = nowMs - 24 * 3600 * 1000;
        break;
      case '7_DAYS':
        cutoffMs = nowMs - 7 * 24 * 3600 * 1000;
        break;
      case '30_DAYS':
        cutoffMs = nowMs - 30 * 24 * 3600 * 1000;
        break;
      case 'MISSION_DURATION':
      default:
        return [...records].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }

    return records
      .filter((r) => new Date(r.timestamp).getTime() >= cutoffMs)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Computes statistical trend analytics over a measurement series
   */
  public computeTrends(
    records: RadiationMeasurement[],
    range: RadiationTimeRange = '24_HOURS'
  ): RadiationTrendAnalytics {
    if (!records || records.length === 0) {
      return {
        timeRange: range,
        sampleCount: 0,
        durationHours: 0,
        averageDoseRateUsVh: 0,
        peakDoseRateUsVh: 0,
        minDoseRateUsVh: 0,
        cumulativeDoseMsv: 0,
        percentageChangeRate: 0,
        dataCoveragePct: 0,
        isSpeDetected: false,
      };
    }

    const rates = records
      .map((r) => r.doseEquivalentRate ?? (r.absorbedDoseRate ? r.absorbedDoseRate * 1.8 : null))
      .filter((v): v is number => v !== null && !isNaN(v));

    if (rates.length === 0) {
      return {
        timeRange: range,
        sampleCount: 0,
        durationHours: 0,
        averageDoseRateUsVh: 0,
        peakDoseRateUsVh: 0,
        minDoseRateUsVh: 0,
        cumulativeDoseMsv: 0,
        percentageChangeRate: 0,
        dataCoveragePct: 0,
        isSpeDetected: false,
      };
    }

    const sum = rates.reduce((a, b) => a + b, 0);
    const avg = sum / rates.length;
    const peak = Math.max(...rates);
    const min = Math.min(...rates);

    // Trapezoidal numerical integration for cumulative dose
    const integrationPoints: TimeDosePoint[] = records
      .map((r) => ({
        timestamp: r.timestamp,
        doseRateUsVh: r.doseEquivalentRate ?? (r.absorbedDoseRate ? r.absorbedDoseRate * 1.8 : 0),
      }))
      .filter((p) => p.doseRateUsVh > 0);

    const cumulativeDoseMsv = integrateDoseTrapezoidal(integrationPoints);

    // Duration in hours
    const firstTime = new Date(records[0].timestamp).getTime();
    const lastTime = new Date(records[records.length - 1].timestamp).getTime();
    const durationHours = Math.max(0.1, (lastTime - firstTime) / (1000 * 3600));

    // Rate change (compare first quarter average to last quarter average)
    const quarterLen = Math.max(1, Math.floor(rates.length / 4));
    const firstQuarterAvg = rates.slice(0, quarterLen).reduce((a, b) => a + b, 0) / quarterLen;
    const lastQuarterAvg = rates.slice(-quarterLen).reduce((a, b) => a + b, 0) / quarterLen;
    const percentageChangeRate =
      firstQuarterAvg > 0 ? ((lastQuarterAvg - firstQuarterAvg) / firstQuarterAvg) * 100 : 0;

    // Check for Solar Particle Event surge
    const isSpeDetected = peak >= this.thresholds.criticalFluxUsVh;

    return {
      timeRange: range,
      sampleCount: records.length,
      durationHours: Number(durationHours.toFixed(1)),
      averageDoseRateUsVh: Number(avg.toFixed(3)),
      peakDoseRateUsVh: Number(peak.toFixed(3)),
      minDoseRateUsVh: Number(min.toFixed(3)),
      cumulativeDoseMsv: Number(cumulativeDoseMsv.toFixed(4)),
      percentageChangeRate: Number(percentageChangeRate.toFixed(1)),
      dataCoveragePct: Math.min(100, Number(((records.length / (durationHours * 4 || 1)) * 100).toFixed(1))),
      isSpeDetected,
    };
  }

  /**
   * Evaluates current radiation telemetry against thresholds
   * Applies alert deduplication and records to AstroCare alertService
   */
  public evaluateAlert(
    currentFluxUsVh: number,
    astronautId: string = 'ASTRO-01',
    isSimulated: boolean = true
  ): RadiationAlert | null {
    const now = Date.now();

    if (currentFluxUsVh >= this.thresholds.criticalFluxUsVh) {
      const alertKey = `SPE_CRITICAL_${astronautId}`;
      const lastTime = this.lastAlertTimestamp[alertKey] || 0;

      if (now - lastTime > this.alertCooldownMs) {
        this.lastAlertTimestamp[alertKey] = now;

        const radAlert: RadiationAlert = {
          id: `rad-alrt-crit-${now}`,
          severity: 'CRITICAL',
          metric: 'RADIATION_FLUX',
          currentValue: currentFluxUsVh,
          threshold: this.thresholds.criticalFluxUsVh,
          unit: 'uSv/h',
          timestamp: new Date().toISOString(),
          message: `CRITICAL RADIATION SURGE: Ambient flux at ${currentFluxUsVh.toFixed(2)} uSv/h exceeds storm threshold (${this.thresholds.criticalFluxUsVh} uSv/h). Execute storm shelter protocol.`,
          acknowledgementStatus: 'UNACKNOWLEDGED',
          dataOrigin: isSimulated ? 'SIMULATION' : 'HISTORICAL_TELEMETRY',
        };

        if (alertService.recordAlert) {
          const healthAlert: HealthAlert = {
            id: radAlert.id,
            mission_id: 'm-ares-06',
            astronaut_id: astronautId,
            timestamp: radAlert.timestamp,
            rule_code: 'RAD_SPE_CRITICAL',
            severity: 'CRITICAL',
            status: 'ACTIVE',
            title: 'Critical Space Radiation Surge (SPE)',
            description: radAlert.message,
            triggering_value: `${currentFluxUsVh.toFixed(2)} uSv/h`,
            baseline_expected: `< ${this.thresholds.ambientNormalMaxUsVh} uSv/h`,
            created_at: radAlert.timestamp,
          };
          alertService.recordAlert(healthAlert);
        }

        return radAlert;
      }
    } else if (currentFluxUsVh >= this.thresholds.warningFluxUsVh) {
      const alertKey = `RAD_WARNING_${astronautId}`;
      const lastTime = this.lastAlertTimestamp[alertKey] || 0;

      if (now - lastTime > this.alertCooldownMs) {
        this.lastAlertTimestamp[alertKey] = now;

        const radAlert: RadiationAlert = {
          id: `rad-alrt-warn-${now}`,
          severity: 'MEDIUM',
          metric: 'RADIATION_FLUX',
          currentValue: currentFluxUsVh,
          threshold: this.thresholds.warningFluxUsVh,
          unit: 'uSv/h',
          timestamp: new Date().toISOString(),
          message: `ELEVATED RADIATION FLUX: Ambient rate at ${currentFluxUsVh.toFixed(2)} uSv/h exceeds warning threshold (${this.thresholds.warningFluxUsVh} uSv/h). Monitor dosimeter sweeps.`,
          acknowledgementStatus: 'UNACKNOWLEDGED',
          dataOrigin: isSimulated ? 'SIMULATION' : 'HISTORICAL_TELEMETRY',
        };

        if (alertService.recordAlert) {
          const healthAlert: HealthAlert = {
            id: radAlert.id,
            mission_id: 'm-ares-06',
            astronaut_id: astronautId,
            timestamp: radAlert.timestamp,
            rule_code: 'RAD_FLUX_WARNING',
            severity: 'MEDIUM',
            status: 'ACTIVE',
            title: 'Elevated Ambient Radiation Flux',
            description: radAlert.message,
            triggering_value: `${currentFluxUsVh.toFixed(2)} uSv/h`,
            baseline_expected: `< ${this.thresholds.ambientNormalMaxUsVh} uSv/h`,
            created_at: radAlert.timestamp,
          };
          alertService.recordAlert(healthAlert);
        }

        return radAlert;
      }
    }

    return null;
  }
}

export const radiationAnalyticsService = new RadiationAnalyticsService();
