import { ParameterRiskConfig, VitalParameter } from '../types/analyticsTypes';

/**
 * DEFAULT AEROSPACE HEALTH ANALYTICS THRESHOLDS
 * Standardized operational limits based on aerospace medicine and terrestrial telemetry protocols.
 * All thresholds are configurable per mission or operational profile.
 */
export const DEFAULT_PARAMETER_CONFIGS: Record<VitalParameter, ParameterRiskConfig> = {
  HEART_RATE: {
    parameter: 'HEART_RATE',
    label: 'Heart Rate',
    unit: 'bpm',
    weight: 0.20,
    standardDeviation: 6.0,
    thresholds: {
      cautionLow: 50,
      warningLow: 45,
      criticalLow: 38,
      cautionHigh: 100,
      warningHigh: 130,
      criticalHigh: 160,
    },
  },
  SPO2: {
    parameter: 'SPO2',
    label: 'Oxygen Saturation',
    unit: '%',
    weight: 0.25,
    standardDeviation: 1.0,
    thresholds: {
      cautionLow: 94,
      warningLow: 90,
      criticalLow: 86,
    },
  },
  BLOOD_PRESSURE_SYS: {
    parameter: 'BLOOD_PRESSURE_SYS',
    label: 'Systolic Arterial Pressure',
    unit: 'mmHg',
    weight: 0.10,
    standardDeviation: 7.0,
    thresholds: {
      cautionLow: 95,
      warningLow: 85,
      criticalLow: 75,
      cautionHigh: 135,
      warningHigh: 155,
      criticalHigh: 175,
    },
  },
  BLOOD_PRESSURE_DIA: {
    parameter: 'BLOOD_PRESSURE_DIA',
    label: 'Diastolic Arterial Pressure',
    unit: 'mmHg',
    weight: 0.08,
    standardDeviation: 5.0,
    thresholds: {
      cautionLow: 60,
      warningLow: 50,
      criticalLow: 40,
      cautionHigh: 88,
      warningHigh: 98,
      criticalHigh: 110,
    },
  },
  CORE_TEMP: {
    parameter: 'CORE_TEMP',
    label: 'Core Body Temperature',
    unit: '°C',
    weight: 0.12,
    standardDeviation: 0.25,
    thresholds: {
      cautionLow: 36.2,
      warningLow: 35.5,
      criticalLow: 34.5,
      cautionHigh: 37.5,
      warningHigh: 38.5,
      criticalHigh: 39.5,
    },
  },
  RESPIRATORY_RATE: {
    parameter: 'RESPIRATORY_RATE',
    label: 'Respiratory Rate',
    unit: 'rpm',
    weight: 0.10,
    standardDeviation: 1.5,
    thresholds: {
      cautionLow: 9,
      warningLow: 7,
      criticalLow: 5,
      cautionHigh: 20,
      warningHigh: 26,
      criticalHigh: 34,
    },
  },
  RADIATION_FLUX: {
    parameter: 'RADIATION_FLUX',
    label: 'Ambient Radiation Flux',
    unit: 'uSv/h',
    weight: 0.15,
    standardDeviation: 0.015,
    thresholds: {
      cautionHigh: 0.20,
      warningHigh: 0.80,
      criticalHigh: 2.0,
    },
  },
};

export const DEFAULT_ASTRONAUT_FALLBACK_BASELINES = {
  restingHr: 68,
  spo2: 98,
  bpSystolic: 115,
  bpDiastolic: 75,
  coreTemp: 36.8,
  respiratoryRate: 14,
  radiationFlux: 0.052,
};
