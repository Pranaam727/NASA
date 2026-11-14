/**
 * AstroCare Biomedical Validation Profiles
 * Authoritative boundaries, physiological bounds, operational thresholds,
 * and clinical reference intervals.
 */

import { BiomedicalMetricType, MetricValidationProfile } from '../../types/biomedical';

export const BIOMEDICAL_PROFILES: Record<BiomedicalMetricType, MetricValidationProfile> = {
  heart_rate: {
    metricType: 'heart_rate',
    expectedUnit: 'bpm',
    absoluteMin: 20, // Lower physical limit in human physiology
    absoluteMax: 260, // Upper physical limit (extreme tachyarrhythmia)
    referenceMin: 50, // Typical astronaut resting bradycardia
    referenceMax: 100, // Standard adult resting tachycardia cutoff
    operationalMin: 45, // Flight surgeon low alert threshold
    operationalMax: 165, // In-flight EVA or vigorous aerobic exercise limit
    maxPlausibleDeltaPerMinute: 60, // A delta > 60 bpm in 60s without exercise indicates motion artifact
    notes: 'Resting heart rate in microgravity often exhibits bradycardia due to cephalad fluid shift.',
  },
  blood_pressure_systolic: {
    metricType: 'blood_pressure_systolic',
    expectedUnit: 'mmHg',
    absoluteMin: 40,
    absoluteMax: 300,
    referenceMin: 90,
    referenceMax: 120,
    operationalMin: 85,
    operationalMax: 150,
    maxPlausibleDeltaPerMinute: 40,
    notes: 'Orthostatic intolerance post-landing may alter arterial baroreflex sensitivity.',
  },
  blood_pressure_diastolic: {
    metricType: 'blood_pressure_diastolic',
    expectedUnit: 'mmHg',
    absoluteMin: 20,
    absoluteMax: 180,
    referenceMin: 60,
    referenceMax: 80,
    operationalMin: 50,
    operationalMax: 95,
    maxPlausibleDeltaPerMinute: 30,
    notes: 'Diastolic pressures should strictly remain below systolic pressure.',
  },
  oxygen_saturation: {
    metricType: 'oxygen_saturation',
    expectedUnit: '%',
    absoluteMin: 40,
    absoluteMax: 100, // Physical ceiling: hemoglobin cannot exceed 100% saturation
    referenceMin: 95,
    referenceMax: 100,
    operationalMin: 90, // Cabin EVA hyperbaric/hypobaric threshold
    operationalMax: 100,
    maxPlausibleDeltaPerMinute: 15,
    notes: 'Values > 100% are physically impossible and indicate sensor calibration error.',
  },
  respiratory_rate: {
    metricType: 'respiratory_rate',
    expectedUnit: 'breaths/min',
    absoluteMin: 4,
    absoluteMax: 80,
    referenceMin: 12,
    referenceMax: 20,
    operationalMin: 8,
    operationalMax: 30,
    maxPlausibleDeltaPerMinute: 20,
    notes: 'Hypercapnia in spacecraft environments can induce compensatory tachypnea.',
  },
  body_temperature: {
    metricType: 'body_temperature',
    expectedUnit: 'degC',
    allowedAlternativeUnits: ['degF'],
    absoluteMin: 25.0, // Deep hypothermia
    absoluteMax: 44.0, // Lethal hyperthermia
    referenceMin: 36.1,
    referenceMax: 37.5,
    operationalMin: 35.5,
    operationalMax: 38.3,
    maxPlausibleDeltaPerMinute: 1.5,
    notes: 'Core body temperature elevates in microgravity ("space fever") due to altered convection.',
  },
  sleep_duration: {
    metricType: 'sleep_duration',
    expectedUnit: 'hours',
    absoluteMin: 0,
    absoluteMax: 24,
    referenceMin: 7.0,
    referenceMax: 9.0,
    operationalMin: 5.5,
    operationalMax: 11.0,
    notes: 'Circadian misalignment is common aboard the ISS with 16 sunrises/sunsets per 24 hours.',
  },
  bone_mineral_density: {
    metricType: 'bone_mineral_density',
    expectedUnit: 'g/cm2',
    absoluteMin: 0.2,
    absoluteMax: 2.5,
    referenceMin: 0.9,
    referenceMax: 1.4,
    notes: 'Weight-bearing bones (calcaneus, femoral neck) decondition at ~1% per month in microgravity.',
  },
  muscle_mass: {
    metricType: 'muscle_mass',
    expectedUnit: 'kg',
    absoluteMin: 15,
    absoluteMax: 150,
    referenceMin: 35,
    referenceMax: 85,
    notes: 'Monitored via ultrasound cross-sectional area and countermeasure ARED tracking.',
  },
  blood_biomarker_cortisol: {
    metricType: 'blood_biomarker_cortisol',
    expectedUnit: 'ug/dL',
    absoluteMin: 0.5,
    absoluteMax: 100,
    referenceMin: 5.0,
    referenceMax: 25.0, // Diurnal morning peak
    operationalMin: 3.0,
    operationalMax: 35.0,
    notes: 'Key neuroendocrine marker for acute mission stress and circadian phase shifts.',
  },
  blood_biomarker_ferritin: {
    metricType: 'blood_biomarker_ferritin',
    expectedUnit: 'ng/mL',
    absoluteMin: 5,
    absoluteMax: 2000,
    referenceMin: 20,
    referenceMax: 300,
    operationalMin: 15,
    operationalMax: 500,
    notes: 'Iron stores elevate during spaceflight as red cell mass contracts (neocytolysis).',
  },
  blood_biomarker_ck: {
    metricType: 'blood_biomarker_ck',
    expectedUnit: 'U/L',
    absoluteMin: 10,
    absoluteMax: 10000,
    referenceMin: 30,
    referenceMax: 200,
    operationalMin: 20,
    operationalMax: 600, // Post-vigorous resistance exercise countermeasure
    notes: 'Creatine kinase is an indicator of exercise-induced muscle damage or rhabdomyolysis.',
  },
  radiation_absorbed_dose: {
    metricType: 'radiation_absorbed_dose',
    expectedUnit: 'mGy',
    allowedAlternativeUnits: ['Gy'],
    absoluteMin: 0,
    absoluteMax: 10000, // 10 Gy is lethal
    referenceMin: 0.2, // ISS interior nominal daily dose ~ 0.3 - 0.5 mGy/day
    referenceMax: 1.5,
    operationalMin: 0.0,
    operationalMax: 5.0, // Solar particle event alert band
    notes: 'Absorbed dose in Grays (Gy or mGy). 1 Gy = 1 J/kg.',
  },
  radiation_equivalent_dose: {
    metricType: 'radiation_equivalent_dose',
    expectedUnit: 'mSv',
    allowedAlternativeUnits: ['Sv'],
    absoluteMin: 0,
    absoluteMax: 10000,
    referenceMin: 0.5, // Equivalent daily dose taking into account heavy ions (w_R)
    referenceMax: 2.5,
    operationalMin: 0.0,
    operationalMax: 10.0,
    notes: 'Equivalent dose in Sieverts (Sv or mSv). Incorporates radiation quality factor w_R.',
  },
};
