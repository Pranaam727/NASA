/**
 * ASTROCARE BASELINE ANALYTICS ENGINE
 * Calculates individual astronaut baseline deviations, z-scores,
 * and physiological deviation significance for telemetry streams.
 */

import { SEED_ASTRONAUTS } from '@/data/seedData';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import {
  AstronautBaselineProfile,
  HealthParameter,
  ParameterDeviation,
  RiskLevel,
} from './types';

// Standard aerospace biological variability standard deviations (1-sigma)
export const PHYSIOLOGICAL_SIGMA: Record<HealthParameter, number> = {
  HEART_RATE: 6.0, // bpm
  SPO2: 1.0, // %
  BLOOD_PRESSURE_SYS: 7.5, // mmHg
  BLOOD_PRESSURE_DIA: 5.0, // mmHg
  RESPIRATORY_RATE: 2.0, // rpm
  CORE_TEMP: 0.25, // °C
  RADIATION_FLUX: 0.015, // uSv/h
};

// Nominal mission population defaults for parameters without individual table overrides
export const NOMINAL_MISSION_BASELINES = {
  respiratoryRate: 14, // rpm
  coreTemp: 36.8, // °C
  radiationFlux: 0.052, // uSv/h
};

/**
 * Resolves the personal baseline profile for an astronaut.
 */
export function getAstronautBaseline(astronautId: string): AstronautBaselineProfile {
  const astro = SEED_ASTRONAUTS.find((a) => a.id === astronautId) || SEED_ASTRONAUTS[0];

  return {
    astronautId: astro.id,
    callsign: astro.profile?.callsign || 'ASTRONAUT',
    fullName: astro.profile?.full_name || 'Crew Member',
    restingHr: astro.baseline_resting_hr,
    spo2: astro.baseline_spo2,
    bpSystolic: astro.baseline_bp_systolic,
    bpDiastolic: astro.baseline_bp_diastolic,
    respiratoryRate: NOMINAL_MISSION_BASELINES.respiratoryRate,
    coreTemp: NOMINAL_MISSION_BASELINES.coreTemp,
    radiationFlux: NOMINAL_MISSION_BASELINES.radiationFlux,
  };
}

/**
 * Evaluates the risk level and clinical significance of a parameter's z-score and absolute value.
 */
function classifyParameterRisk(
  param: HealthParameter,
  current: number,
  _baseline: number,
  zScore: number
): { level: RiskLevel; significance: string } {
  const absZ = Math.abs(zScore);

  switch (param) {
    case 'HEART_RATE': {
      if (current > 150 || current < 40) {
        return {
          level: 'CRITICAL',
          significance: current > 150 ? 'Extreme Tachycardia (>150 bpm)' : 'Severe Bradycardia (<40 bpm)',
        };
      }
      if (current > 125 || current < 48 || absZ >= 3.0) {
        return {
          level: 'WARNING',
          significance: current > 125 ? 'Marked Tachycardia' : 'Marked Bradycardia',
        };
      }
      if (current > 100 || current < 55 || absZ >= 2.0) {
        return {
          level: 'CAUTION',
          significance: 'Elevated Sympathetic Response',
        };
      }
      return { level: 'NORMAL', significance: 'Resting Cardiac Homeostasis' };
    }

    case 'SPO2': {
      if (current <= 86) {
        return { level: 'CRITICAL', significance: 'Acute Severe Hypoxia (SpO2 ≤ 86%)' };
      }
      if (current <= 91) {
        return { level: 'WARNING', significance: 'Moderate Oxygen Desaturation' };
      }
      if (current <= 94) {
        return { level: 'CAUTION', significance: 'Mild Early Hypoxic Drift' };
      }
      return { level: 'NORMAL', significance: 'Optimal Arterial Oxygenation' };
    }

    case 'BLOOD_PRESSURE_SYS': {
      if (current >= 165 || current <= 80) {
        return {
          level: 'CRITICAL',
          significance: current >= 165 ? 'Hypertensive Urgency (≥165 mmHg)' : 'Severe Hypotension (≤80 mmHg)',
        };
      }
      if (current >= 145 || current <= 90 || absZ >= 3.0) {
        return { level: 'WARNING', significance: 'Significant Arterial Deviation' };
      }
      if (current >= 130 || absZ >= 1.8) {
        return { level: 'CAUTION', significance: 'Mild Elevated Pre-Hypertension' };
      }
      return { level: 'NORMAL', significance: 'Nominal Arterial Pressure' };
    }

    case 'BLOOD_PRESSURE_DIA': {
      if (current >= 105 || current <= 45) {
        return { level: 'CRITICAL', significance: 'Critical Diastolic Pressure Extreme' };
      }
      if (current >= 95 || current <= 55 || absZ >= 3.0) {
        return { level: 'WARNING', significance: 'Moderate Diastolic Strain' };
      }
      if (current >= 85 || absZ >= 1.8) {
        return { level: 'CAUTION', significance: 'Mild Diastolic Elevation' };
      }
      return { level: 'NORMAL', significance: 'Nominal Diastolic Tone' };
    }

    case 'RESPIRATORY_RATE': {
      if (current >= 32 || current <= 6) {
        return { level: 'CRITICAL', significance: 'Critical Tachypnea / Respiratory Failure' };
      }
      if (current >= 24 || current <= 8 || absZ >= 3.0) {
        return { level: 'WARNING', significance: 'Moderate Compensatory Tachypnea' };
      }
      if (current >= 20 || absZ >= 2.0) {
        return { level: 'CAUTION', significance: 'Mild Exertional Breathing Rate' };
      }
      return { level: 'NORMAL', significance: 'Eupneic Respiration' };
    }

    case 'CORE_TEMP': {
      if (current >= 39.0 || current <= 34.5) {
        return { level: 'CRITICAL', significance: 'Severe Hyperthermia / Hypothermia Emergency' };
      }
      if (current >= 38.0 || current <= 35.5 || absZ >= 2.8) {
        return { level: 'WARNING', significance: 'Moderate Thermal Regulation Strain' };
      }
      if (current >= 37.5 || current <= 36.0 || absZ >= 1.8) {
        return { level: 'CAUTION', significance: 'Mild Thermal Deviation' };
      }
      return { level: 'NORMAL', significance: 'Normothermic Core Balance' };
    }

    case 'RADIATION_FLUX': {
      if (current >= 1.0) {
        return { level: 'CRITICAL', significance: 'Solar Particle Event (SPE) Flash Surge' };
      }
      if (current >= 0.25) {
        return { level: 'WARNING', significance: 'Elevated Ambient Dosimetry' };
      }
      if (current >= 0.10) {
        return { level: 'CAUTION', significance: 'Above-Baseline Cosmic Flux' };
      }
      return { level: 'NORMAL', significance: 'Quiet Interplanetary Background' };
    }
  }
}

/**
 * Computes individual baseline deviation metrics for a single parameter.
 */
function buildDeviation(
  param: HealthParameter,
  label: string,
  unit: string,
  current: number,
  baseline: number
): ParameterDeviation {
  const delta = parseFloat((current - baseline).toFixed(2));
  const percentDelta = baseline !== 0 ? parseFloat(((delta / baseline) * 100).toFixed(1)) : 0;
  const sigma = PHYSIOLOGICAL_SIGMA[param];
  const zScore = parseFloat((delta / sigma).toFixed(2));

  let direction: 'ELEVATED' | 'DEPRESSED' | 'NOMINAL' = 'NOMINAL';
  if (Math.abs(delta) > 0.01) {
    direction = delta > 0 ? 'ELEVATED' : 'DEPRESSED';
  }

  const { level, significance } = classifyParameterRisk(param, current, baseline, zScore);

  return {
    parameter: param,
    label,
    unit,
    currentValue: current,
    baselineValue: baseline,
    delta,
    percentDelta,
    zScore,
    direction,
    riskLevel: level,
    clinicalSignificance: significance,
  };
}

/**
 * Calculates comprehensive baseline deviations across all physiological and environmental streams.
 */
export function calculateAllDeviations(
  vitals: VitalSignsPacket['vitals'],
  radiation: RadiationPacket | null,
  baseline: AstronautBaselineProfile
): Record<HealthParameter, ParameterDeviation> {
  const radFlux = radiation?.ambientFluxUsVh ?? baseline.radiationFlux;

  return {
    HEART_RATE: buildDeviation(
      'HEART_RATE',
      'Heart Rate',
      'bpm',
      vitals.heartRate.value,
      baseline.restingHr
    ),
    SPO2: buildDeviation(
      'SPO2',
      'Oxygen Saturation',
      '%',
      vitals.spo2.value,
      baseline.spo2
    ),
    BLOOD_PRESSURE_SYS: buildDeviation(
      'BLOOD_PRESSURE_SYS',
      'Systolic Arterial Pressure',
      'mmHg',
      vitals.bloodPressure.systolic,
      baseline.bpSystolic
    ),
    BLOOD_PRESSURE_DIA: buildDeviation(
      'BLOOD_PRESSURE_DIA',
      'Diastolic Arterial Pressure',
      'mmHg',
      vitals.bloodPressure.diastolic,
      baseline.bpDiastolic
    ),
    RESPIRATORY_RATE: buildDeviation(
      'RESPIRATORY_RATE',
      'Respiratory Rate',
      'rpm',
      vitals.respiratoryRate.value,
      baseline.respiratoryRate
    ),
    CORE_TEMP: buildDeviation(
      'CORE_TEMP',
      'Core Body Temperature',
      '°C',
      vitals.coreTemp.value,
      baseline.coreTemp
    ),
    RADIATION_FLUX: buildDeviation(
      'RADIATION_FLUX',
      'Ambient Radiation Flux',
      'uSv/h',
      radFlux,
      baseline.radiationFlux
    ),
  };
}
