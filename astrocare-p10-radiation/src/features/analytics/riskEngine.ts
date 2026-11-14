/**
 * ASTROCARE DETERMINISTIC HEALTH RISK ENGINE
 * Multi-parameter cross-system physiological risk scoring,
 * compound synergism detection, and clinical status classification.
 */

import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import {
  AstronautBaselineProfile,
  CompositeRiskAssessment,
  HealthParameter,
  ParameterDeviation,
  RiskLevel,
  SubsystemCategory,
  SubsystemRisk,
} from './types';
import { calculateAllDeviations } from './baselineEngine';

/**
 * Maps a continuous score (0 - 100) to a standardized discrete RiskLevel.
 */
export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'WARNING';
  if (score >= 25) return 'CAUTION';
  return 'NORMAL';
}

/**
 * Calculates cardiovascular subsystem risk score (0 - 100).
 */
function evaluateCardiovascularRisk(
  hrDev: ParameterDeviation,
  sysDev: ParameterDeviation,
  diaDev: ParameterDeviation
): SubsystemRisk {
  const factors: string[] = [];
  let score = 0;

  // 1. Heart rate component (max 60 points)
  const hrZ = Math.abs(hrDev.zScore);
  if (hrDev.currentValue > 150) {
    score += 60;
    factors.push(`Extreme tachycardia: ${hrDev.currentValue} bpm (+${hrDev.delta} over baseline)`);
  } else if (hrDev.currentValue > 125) {
    score += 42;
    factors.push(`Marked tachycardia: ${hrDev.currentValue} bpm`);
  } else if (hrDev.currentValue > 100) {
    score += 24;
    factors.push(`Mild tachycardia: ${hrDev.currentValue} bpm`);
  } else if (hrDev.currentValue < 45) {
    score += 55;
    factors.push(`Severe bradycardia: ${hrDev.currentValue} bpm`);
  } else if (hrZ >= 2.0) {
    score += 15;
    factors.push(`Cardiac rate shift: z = ${hrDev.zScore}`);
  }

  // 2. Arterial Blood Pressure component (max 40 points)
  if (sysDev.currentValue >= 165 || sysDev.currentValue <= 80) {
    score += 40;
    factors.push(`Critical arterial pressure: ${sysDev.currentValue}/${diaDev.currentValue} mmHg`);
  } else if (sysDev.currentValue >= 145 || sysDev.currentValue <= 90) {
    score += 28;
    factors.push(`Elevated systolic pressure: ${sysDev.currentValue} mmHg`);
  } else if (sysDev.currentValue >= 135 || Math.abs(sysDev.zScore) >= 2.0) {
    score += 16;
    factors.push(`Pre-hypertensive systolic shift: ${sysDev.currentValue} mmHg`);
  }

  // Diastolic extreme check
  if (diaDev.currentValue >= 100) {
    score += 15;
    factors.push(`High peripheral resistance (diastolic: ${diaDev.currentValue} mmHg)`);
  }

  const boundedScore = Math.min(100, Math.round(score));
  return {
    category: 'CARDIOVASCULAR',
    name: 'Cardiovascular Dynamics',
    score: boundedScore,
    level: scoreToRiskLevel(boundedScore),
    contributingFactors: factors.length > 0 ? factors : ['Normal rhythm and arterial pressures'],
    primaryParameter: `${hrDev.currentValue} bpm / ${sysDev.currentValue} mmHg`,
  };
}

/**
 * Calculates respiratory and arterial oxygenation risk score (0 - 100).
 */
function evaluateRespiratoryRisk(
  spo2Dev: ParameterDeviation,
  rrDev: ParameterDeviation
): SubsystemRisk {
  const factors: string[] = [];
  let score = 0;

  // 1. SpO2 Hypoxia component (heavily weighted, max 70 points)
  if (spo2Dev.currentValue <= 85) {
    score += 70;
    factors.push(`Critical arterial desaturation: ${spo2Dev.currentValue}% (Suit/ECLSS emergency)`);
  } else if (spo2Dev.currentValue <= 88) {
    score += 55;
    factors.push(`Acute hypoxia: ${spo2Dev.currentValue}%`);
  } else if (spo2Dev.currentValue <= 92) {
    score += 35;
    factors.push(`Moderate oxygen desaturation: ${spo2Dev.currentValue}%`);
  } else if (spo2Dev.currentValue <= 94) {
    score += 18;
    factors.push(`Borderline oxygenation: ${spo2Dev.currentValue}%`);
  }

  // 2. Respiratory Rate Tachypnea / Bradypnea (max 30 points)
  if (rrDev.currentValue >= 32 || rrDev.currentValue <= 6) {
    score += 30;
    factors.push(`Critical respiratory frequency: ${rrDev.currentValue} rpm`);
  } else if (rrDev.currentValue >= 24) {
    score += 20;
    factors.push(`Compensatory tachypnea: ${rrDev.currentValue} rpm`);
  } else if (rrDev.currentValue >= 20 || Math.abs(rrDev.zScore) >= 2.0) {
    score += 12;
    factors.push(`Accelerated ventilation rate: ${rrDev.currentValue} rpm`);
  }

  const boundedScore = Math.min(100, Math.round(score));
  return {
    category: 'RESPIRATORY',
    name: 'Pulmonary & Oxygenation',
    score: boundedScore,
    level: scoreToRiskLevel(boundedScore),
    contributingFactors: factors.length > 0 ? factors : ['Optimal saturation and eupnea'],
    primaryParameter: `${spo2Dev.currentValue}% SpO2 / ${rrDev.currentValue} rpm`,
  };
}

/**
 * Calculates radiation dosimetry and environmental flux risk (0 - 100).
 */
function evaluateRadiationRisk(
  radDev: ParameterDeviation,
  radiation: RadiationPacket | null
): SubsystemRisk {
  const factors: string[] = [];
  let score = 0;

  const flux = radDev.currentValue;
  const isSpe = radiation?.solarParticleEventActive ?? false;

  if (isSpe || flux >= 10.0) {
    score += 85;
    factors.push(`ACTIVE SOLAR PARTICLE EVENT: ${flux.toFixed(2)} uSv/h`);
  } else if (flux >= 2.0) {
    score += 65;
    factors.push(`Severe radiation flare surge: ${flux.toFixed(2)} uSv/h`);
  } else if (flux >= 0.5) {
    score += 40;
    factors.push(`Elevated ambient dosimeter flux: ${flux.toFixed(3)} uSv/h`);
  } else if (flux >= 0.15) {
    score += 20;
    factors.push(`Above nominal galactic cosmic background: ${flux.toFixed(3)} uSv/h`);
  }

  if (radiation?.accumulatedDoseMSv && radiation.accumulatedDoseMSv > 250) {
    score += 20;
    factors.push(`Cumulative mission career dose threshold exceeded (>250 mSv)`);
  }

  const boundedScore = Math.min(100, Math.round(score));
  return {
    category: 'RADIATION',
    name: 'Dosimetry & Space Weather',
    score: boundedScore,
    level: scoreToRiskLevel(boundedScore),
    contributingFactors: factors.length > 0 ? factors : ['Interplanetary background within shielded limits'],
    primaryParameter: `${flux.toFixed(3)} uSv/h`,
  };
}

/**
 * Calculates core thermal and metabolic stability risk (0 - 100).
 */
function evaluateThermalRisk(tempDev: ParameterDeviation): SubsystemRisk {
  const factors: string[] = [];
  let score = 0;

  const temp = tempDev.currentValue;

  if (temp >= 39.0 || temp <= 34.5) {
    score += 75;
    factors.push(`Critical core temperature extreme: ${temp.toFixed(1)}°C`);
  } else if (temp >= 38.2 || temp <= 35.5) {
    score += 50;
    factors.push(temp >= 38.2 ? `Significant hyperthermia: ${temp.toFixed(1)}°C` : `Hypothermia onset: ${temp.toFixed(1)}°C`);
  } else if (temp >= 37.6 || Math.abs(tempDev.zScore) >= 2.0) {
    score += 22;
    factors.push(`Elevated core temperature: ${temp.toFixed(1)}°C (+${tempDev.delta}°C)`);
  }

  const boundedScore = Math.min(100, Math.round(score));
  return {
    category: 'METABOLIC_THERMAL',
    name: 'Thermoregulation & Core State',
    score: boundedScore,
    level: scoreToRiskLevel(boundedScore),
    contributingFactors: factors.length > 0 ? factors : ['Core temperature homeostatic'],
    primaryParameter: `${temp.toFixed(1)}°C`,
  };
}

/**
 * Evaluates physiological synergies and compounding multi-parameter risks.
 */
function evaluateSynergies(
  vitals: VitalSignsPacket['vitals'],
  radiation: RadiationPacket | null,
  _deviations: Record<HealthParameter, ParameterDeviation>
): { synergyPenalty: number; activeSynergies: string[] } {
  const activeSynergies: string[] = [];
  let synergyPenalty = 0;

  const hr = vitals.heartRate.value;
  const spo2 = vitals.spo2.value;
  const sys = vitals.bloodPressure.systolic;
  const isSpe = radiation?.solarParticleEventActive ?? false;

  // Synergy 1: Cardio-Hypoxic Compound Distress (Hypoxia with Compensatory Tachycardia)
  if (spo2 <= 88 && hr >= 115) {
    synergyPenalty += 40;
    activeSynergies.push(
      'Cardio-Hypoxic Synergistic Strain: Acute oxygen desaturation compounded by extreme myocardial oxygen demand'
    );
  } else if (spo2 <= 92 && hr >= 105) {
    synergyPenalty += 18;
    activeSynergies.push(
      'Early Hypoxic Tachycardia: Pulmonary oxygen debt triggering sympathetic cardiac acceleration'
    );
  }

  // Synergy 2: Hypertensive Sympathetic Surge (Tachycardia + Hypertension)
  if (hr >= 125 && sys >= 148) {
    synergyPenalty += 12;
    activeSynergies.push(
      'Acute Sympathetic Overdrive: Combined high inotropic rate and elevated peripheral vascular resistance'
    );
  }

  // Synergy 3: Environmental Solar Event during Physical Compromise
  if ((isSpe || (radiation?.ambientFluxUsVh ?? 0) > 1.0) && (spo2 <= 90 || hr >= 130)) {
    synergyPenalty += 25;
    activeSynergies.push(
      'Compound Environmental EVA Emergency: Active solar radiation surge coupled with acute physiological distress'
    );
  }

  return { synergyPenalty, activeSynergies };
}

/**
 * Generates actionable clinical and operational recommendations based on composite risk.
 */
function generateRecommendation(
  level: RiskLevel,
  synergies: string[],
  subsystems: Record<SubsystemCategory, SubsystemRisk>
): string {
  if (level === 'CRITICAL') {
    if (synergies.some((s) => s.includes('Environmental EVA'))) {
      return 'IMMEDIATE EVA TERMINATION: Abort spacewalk, seek Storm Shelter / Water-Wall habitat module, initiate high-flow supplemental O2.';
    }
    if (subsystems.RESPIRATORY.score >= 70) {
      return 'CRITICAL HYPOXIA INTERVENTION: Check suit/cabin pO2 levels, inspect ECLSS regulator for pressure decay, administer emergency O2.';
    }
    return 'CRITICAL MEDICAL PROTOCOL: Alert Flight Surgeon, initiate telemetry high-rate capture, prep Advanced Life Support equipment.';
  }

  if (level === 'WARNING') {
    if (subsystems.CARDIOVASCULAR.score >= 50) {
      return 'REST & RECOVERY PROTOCOL: Cease high-resistance exercise workload, verify fluid intake, observe for orthostatic intolerance.';
    }
    if (subsystems.RADIATION.score >= 50) {
      return 'RADIATION ADVISORY: Restrict crew to central habitat shielding, verify active dosimeter status, log SPE trajectory.';
    }
    return 'CLINICAL WATCH: Heighten monitoring frequency, cross-reference lab panels, review crew work-rest cycle.';
  }

  if (level === 'CAUTION') {
    return 'NOMINAL ELEVATION: Biometrics indicate moderate physical or cognitive workload; continue standard mission protocol.';
  }

  return 'ALL SYSTEMS NOMINAL: Autonomous homeostasis verified against personal resting baselines.';
}

/**
 * Executes full deterministic risk assessment for a telemetry and radiation packet.
 */
export function evaluateHealthRisk(
  vitalsPacket: VitalSignsPacket,
  radiationPacket: RadiationPacket | null,
  baseline: AstronautBaselineProfile
): CompositeRiskAssessment {
  const deviations = calculateAllDeviations(vitalsPacket.vitals, radiationPacket, baseline);

  // 1. Subsystem Risk Evaluations
  const cvRisk = evaluateCardiovascularRisk(
    deviations.HEART_RATE,
    deviations.BLOOD_PRESSURE_SYS,
    deviations.BLOOD_PRESSURE_DIA
  );

  const respRisk = evaluateRespiratoryRisk(
    deviations.SPO2,
    deviations.RESPIRATORY_RATE
  );

  const radRisk = evaluateRadiationRisk(
    deviations.RADIATION_FLUX,
    radiationPacket
  );

  const thRisk = evaluateThermalRisk(deviations.CORE_TEMP);

  // 2. Synergistic Cross-System Penalties
  const { synergyPenalty, activeSynergies } = evaluateSynergies(
    vitalsPacket.vitals,
    radiationPacket,
    deviations
  );

  // 3. Composite Score Calculation (Weighted blend + synergy addition)
  // Respiratory: 35%, Cardiovascular: 30%, Radiation: 25%, Thermal: 10%
  const baseScore =
    respRisk.score * 0.35 +
    cvRisk.score * 0.30 +
    radRisk.score * 0.25 +
    thRisk.score * 0.10;

  let rawComposite = Math.round(baseScore + synergyPenalty);

  // Aerospace Safety Invariant: If any individual subsystem is in a CRITICAL state,
  // composite risk cannot drop below WARNING protocol (minimum floor of 55)
  const hasCriticalSubsystem = [respRisk, cvRisk, radRisk, thRisk].some((s) => s.level === 'CRITICAL');
  if (hasCriticalSubsystem) {
    rawComposite = Math.max(rawComposite, 55);
  }

  // If a critical subsystem is compounded by an active multi-parameter synergy, escalate to CRITICAL (>= 75)
  if (hasCriticalSubsystem && activeSynergies.length > 0) {
    rawComposite = Math.max(rawComposite, 78);
  }

  const compositeScore = Math.max(0, Math.min(100, rawComposite));
  const compositeLevel = scoreToRiskLevel(compositeScore);

  const subsystems: Record<SubsystemCategory, SubsystemRisk> = {
    CARDIOVASCULAR: cvRisk,
    RESPIRATORY: respRisk,
    RADIATION: radRisk,
    METABOLIC_THERMAL: thRisk,
  };

  const recommendation = generateRecommendation(compositeLevel, activeSynergies, subsystems);

  return {
    astronautId: baseline.astronautId,
    missionId: vitalsPacket.missionId,
    timestamp: vitalsPacket.timestamp,
    compositeScore,
    riskLevel: compositeLevel,
    subsystems,
    activeSynergies,
    recommendation,
  };
}
