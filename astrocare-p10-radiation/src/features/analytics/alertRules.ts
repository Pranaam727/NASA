/**
 * ASTROCARE CANONICAL ALERT RULES CATALOG
 * Deterministic threshold and baseline deviation rules for aerospace medical telemetry.
 */

import { AlertSeverity } from '@/types/database.types';
import { VitalSignsPacket, RadiationPacket } from '@/types/telemetry';
import { AstronautBaselineProfile, SubsystemCategory } from './types';

export interface AlertRuleDefinition {
  ruleCode: string;
  title: string;
  category: SubsystemCategory;
  severity: AlertSeverity;
  cooldownSeconds: number;
  evaluate: (
    vitals: VitalSignsPacket['vitals'],
    radiation: RadiationPacket | null,
    baseline: AstronautBaselineProfile
  ) => { triggered: boolean; triggeringValue: string; baselineExpected: string; description: string } | null;
}

export const ALERT_RULES_CATALOG: AlertRuleDefinition[] = [
  // 1. Tachycardia
  {
    ruleCode: 'RULE-CV-TACHY-CRIT',
    title: 'Severe Tachycardia Alert',
    category: 'CARDIOVASCULAR',
    severity: 'CRITICAL',
    cooldownSeconds: 45,
    evaluate: (vitals, _rad, baseline) => {
      const hr = vitals.heartRate.value;
      if (hr >= 145) {
        return {
          triggered: true,
          triggeringValue: `${hr} bpm`,
          baselineExpected: `${baseline.restingHr} ± 10 bpm`,
          description: `Extreme sustained heart rate exceeding critical cardiac ceiling (actual: ${hr} bpm, baseline: ${baseline.restingHr} bpm).`,
        };
      }
      return null;
    },
  },
  {
    ruleCode: 'RULE-CV-TACHY-WARN',
    title: 'Moderate Exertional Tachycardia',
    category: 'CARDIOVASCULAR',
    severity: 'MEDIUM',
    cooldownSeconds: 60,
    evaluate: (vitals, _rad, baseline) => {
      const hr = vitals.heartRate.value;
      if (hr >= 120 && hr < 145) {
        return {
          triggered: true,
          triggeringValue: `${hr} bpm`,
          baselineExpected: `${baseline.restingHr} ± 10 bpm`,
          description: `Elevated heart rate (+${hr - baseline.restingHr} bpm over resting baseline) during mission workload.`,
        };
      }
      return null;
    },
  },

  // 2. Bradycardia
  {
    ruleCode: 'RULE-CV-BRADY-CRIT',
    title: 'Severe Sinus Bradycardia',
    category: 'CARDIOVASCULAR',
    severity: 'CRITICAL',
    cooldownSeconds: 45,
    evaluate: (vitals, _rad, baseline) => {
      const hr = vitals.heartRate.value;
      if (hr <= 42) {
        return {
          triggered: true,
          triggeringValue: `${hr} bpm`,
          baselineExpected: `${baseline.restingHr} bpm`,
          description: `Pathological drop in heart rate below hemodynamic perfusive floor (${hr} bpm).`,
        };
      }
      return null;
    },
  },

  // 3. Hypoxia
  {
    ruleCode: 'RULE-HP-DESAT-CRIT',
    title: 'Acute Arterial Hypoxia Emergency',
    category: 'RESPIRATORY',
    severity: 'CRITICAL',
    cooldownSeconds: 30,
    evaluate: (vitals, _rad, baseline) => {
      const spo2 = vitals.spo2.value;
      if (spo2 <= 88) {
        return {
          triggered: true,
          triggeringValue: `${spo2}% SpO2`,
          baselineExpected: `${baseline.spo2}% SpO2`,
          description: `Dangerous drop in peripheral arterial oxygen saturation (actual: ${spo2}%). Immediate suit/cabin oxygen check required.`,
        };
      }
      return null;
    },
  },
  {
    ruleCode: 'RULE-HP-DESAT-WARN',
    title: 'Moderate Oxygen Desaturation',
    category: 'RESPIRATORY',
    severity: 'HIGH',
    cooldownSeconds: 60,
    evaluate: (vitals, _rad, baseline) => {
      const spo2 = vitals.spo2.value;
      if (spo2 > 88 && spo2 <= 92) {
        return {
          triggered: true,
          triggeringValue: `${spo2}% SpO2`,
          baselineExpected: `${baseline.spo2}% SpO2`,
          description: `Sub-nominal blood oxygen saturation (${spo2}%). Chemoreceptor compensatory breathing active.`,
        };
      }
      return null;
    },
  },

  // 4. Blood Pressure Crisis
  {
    ruleCode: 'RULE-BP-HYPER-HIGH',
    title: 'Hypertensive Pressure Surge',
    category: 'CARDIOVASCULAR',
    severity: 'HIGH',
    cooldownSeconds: 60,
    evaluate: (vitals, _rad, baseline) => {
      const sys = vitals.bloodPressure.systolic;
      const dia = vitals.bloodPressure.diastolic;
      if (sys >= 150 || dia >= 98) {
        return {
          triggered: true,
          triggeringValue: `${sys}/${dia} mmHg`,
          baselineExpected: `${baseline.bpSystolic}/${baseline.bpDiastolic} mmHg`,
          description: `Arterial blood pressure spike above nominal thresholds (${sys}/${dia} mmHg vs baseline ${baseline.bpSystolic}/${baseline.bpDiastolic} mmHg).`,
        };
      }
      return null;
    },
  },

  // 5. Tachypnea
  {
    ruleCode: 'RULE-RR-TACHY-WARN',
    title: 'Compensatory Tachypnea',
    category: 'RESPIRATORY',
    severity: 'MEDIUM',
    cooldownSeconds: 60,
    evaluate: (vitals, _rad, baseline) => {
      const rr = vitals.respiratoryRate.value;
      if (rr >= 24) {
        return {
          triggered: true,
          triggeringValue: `${rr} rpm`,
          baselineExpected: `${baseline.respiratoryRate} rpm`,
          description: `Ventilatory frequency markedly elevated (${rr} rpm vs resting baseline ${baseline.respiratoryRate} rpm).`,
        };
      }
      return null;
    },
  },

  // 6. Radiation Flux
  {
    ruleCode: 'RULE-RD-SPE-CRIT',
    title: 'Solar Particle Event (SPE) Radiation Alarm',
    category: 'RADIATION',
    severity: 'CRITICAL',
    cooldownSeconds: 60,
    evaluate: (_vitals, radiation, baseline) => {
      const flux = radiation?.ambientFluxUsVh ?? baseline.radiationFlux;
      const isSpe = radiation?.solarParticleEventActive ?? false;
      if (isSpe || flux >= 1.0) {
        return {
          triggered: true,
          triggeringValue: `${flux.toFixed(3)} uSv/h`,
          baselineExpected: `${baseline.radiationFlux.toFixed(3)} uSv/h`,
          description: `Dosimeter detects acute solar proton flux spike (${flux.toFixed(3)} uSv/h). Rapid cumulative dose accrual active.`,
        };
      }
      return null;
    },
  },

  // 7. Core Thermal Strain
  {
    ruleCode: 'RULE-TH-HYPER-WARN',
    title: 'Core Hyperthermia Warning',
    category: 'METABOLIC_THERMAL',
    severity: 'MEDIUM',
    cooldownSeconds: 60,
    evaluate: (vitals, _rad, baseline) => {
      const temp = vitals.coreTemp.value;
      if (temp >= 38.2) {
        return {
          triggered: true,
          triggeringValue: `${temp.toFixed(1)}°C`,
          baselineExpected: `${baseline.coreTemp.toFixed(1)}°C`,
          description: `Core body temperature exceeds nominal thermoregulatory threshold (${temp.toFixed(1)}°C).`,
        };
      }
      return null;
    },
  },

  // 8. Multi-Parameter Compound Risk
  {
    ruleCode: 'RULE-COMPOUND-CARDIO-HYPOX',
    title: 'Compound Cardio-Hypoxic Failure Risk',
    category: 'CARDIOVASCULAR',
    severity: 'CRITICAL',
    cooldownSeconds: 30,
    evaluate: (vitals, _rad, baseline) => {
      const hr = vitals.heartRate.value;
      const spo2 = vitals.spo2.value;
      if (spo2 <= 88 && hr >= 120) {
        return {
          triggered: true,
          triggeringValue: `${spo2}% SpO2 & ${hr} bpm`,
          baselineExpected: `${baseline.spo2}% SpO2 / ${baseline.restingHr} bpm`,
          description: `CRITICAL CROSS-SYSTEM SYNERGY: Severe hypoxia coupled with high myocardial oxygen consumption. High risk of decompensation.`,
        };
      }
      return null;
    },
  },
];
