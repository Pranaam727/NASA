/**
 * AstroCare P18 — Scenario Library
 * Ten predefined mission scenarios, each with full configuration.
 * Based on NASA HRP risk categories and operational precedents.
 */

import type { ScenarioDefinition } from '../contracts/index';

export const PREDEFINED_SCENARIOS: ScenarioDefinition[] = [
  // ─────────────────────────────────────────────
  // S01: NOMINAL MISSION OPERATIONS
  // ─────────────────────────────────────────────
  {
    id: 'S01-NOMINAL',
    name: 'Nominal Mission Operations',
    description:
      'Baseline mission conditions with stable cabin environment, well-rested crew, and all systems functioning within nominal parameters. Used as the reference state for comparative analysis.',
    missionPhase: 'Deep Space Cruise',
    severityClassification: 'Low',
    affectedSystems: ['None — all systems nominal'],
    expectedSimulationVariables: ['Stable SpO2 ~98%', 'Stable pressure ~101.3 kPa', 'Background GCR dose rate ~60 µSv/h'],
    recoveryObjectives: ['Maintain stable crew readiness', 'Sustain resource consumption at nominal rate'],
    evaluationCriteria: ['All vitals within nominal bounds', 'Risk score < 5', 'No anomalies triggered'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0,
        humidityPercent: 45.0, leakRatePercentPerDay: 0.05,
        scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25,
        effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 0,
        accumulatedEquivalentDoseMilliSv: 0,
        stormShelterActive: false,
        shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 68, oxygenSaturationPercent: 98,
        respiratoryRateBpm: 15, fatigueIndex: 15,
        circadianDisruptionIndex: 10, cognitiveStressIndex: 12,
        workloadIndex: 30, readinessScorePercent: 92, readinessCategory: 'Optimal',
        clinicalSummary: 'Crew well-rested, all vitals nominal.',
      },
      resources: {
        oxygenRemainingKg: 480, oxygenCapacityKg: 500,
        waterRemainingLiters: 950, waterCapacityLiters: 1000,
        powerRemainingKWh: 180, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 90, consumableRationDays: 90,
        emergencyReservesPercent: 100, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S01-E01', triggerTimeSec: 0, applied: false,
        title: 'Nominal Operations Begin', category: 'Environmental', severity: 'Info',
        description: 'All systems initialized at nominal parameters.',
        parameters: {}, suggestedMitigation: 'Continue standard monitoring protocol.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S02: SOLAR PARTICLE EVENT
  // ─────────────────────────────────────────────
  {
    id: 'S02-SPE',
    name: 'Solar Particle Event (SPE)',
    description:
      'An energetic solar particle event (ground level enhancement class) produces a sudden increase in proton flux > 10 MeV, raising the effective dose rate. Crew must assess storm-shelter protocols.',
    missionPhase: 'Deep Space Cruise',
    severityClassification: 'High',
    affectedSystems: ['Radiation Monitors', 'Storm Shelter', 'EVA Schedule', 'Communication (HF)'],
    expectedSimulationVariables: ['Dose rate surge to > 1000 µSv/h', 'Accumulated effective dose increase', 'EVA abort trigger'],
    recoveryObjectives: ['Move to storm shelter within 30 min', 'Accumulate < 150 mSv effective dose', 'Resume normal operations after SPE clearance'],
    evaluationCriteria: ['Shelter protocol executed within prescribed window', 'Post-SPE dose below career limit fraction', 'No ARS symptoms triggered'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0,
        humidityPercent: 45.0, leakRatePercentPerDay: 0.05,
        scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25,
        effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 0,
        accumulatedEquivalentDoseMilliSv: 0,
        stormShelterActive: false,
        shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 70, oxygenSaturationPercent: 98,
        respiratoryRateBpm: 15, fatigueIndex: 20,
        circadianDisruptionIndex: 15, cognitiveStressIndex: 18,
        workloadIndex: 35, readinessScorePercent: 88, readinessCategory: 'Nominal',
        clinicalSummary: 'Pre-event nominal status.',
      },
      resources: {
        oxygenRemainingKg: 480, oxygenCapacityKg: 500,
        waterRemainingLiters: 940, waterCapacityLiters: 1000,
        powerRemainingKWh: 170, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 85, consumableRationDays: 85,
        emergencyReservesPercent: 100, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S02-E01', triggerTimeSec: 300, applied: false,
        title: 'Space Weather Alert: SPE Onset Detected', category: 'Radiation', severity: 'Warning',
        description: 'NOAA Space Weather Center (simulated) alerts crew of incoming S2 solar radiation storm.',
        parameters: { speActive: true, speFluxProtonsPerCm2Sec: 500 },
        suggestedMitigation: 'Monitor dose rate trend. Alert crew. Prepare shelter ingress checklist.',
      },
      {
        id: 'S02-E02', triggerTimeSec: 600, applied: false,
        title: 'SPE Intensity: Storm Level S3', category: 'Radiation', severity: 'High',
        description: 'Proton flux exceeds 1000 protons/cm²/s. Dose rate surpasses 1 mSv/h threshold.',
        parameters: { speFluxProtonsPerCm2Sec: 1500, effectiveDoseRateMicroSvPerHour: 1800 },
        suggestedMitigation: 'Execute storm-shelter ingress. Cancel all EVAs.',
      },
      {
        id: 'S02-E03', triggerTimeSec: 1200, applied: false,
        title: 'Crew Storm Shelter Activation', category: 'Radiation', severity: 'High',
        description: 'Crew moves to shielded storm shelter. Shielding increases to 25 g/cm² aluminum equivalent.',
        parameters: { stormShelterActive: true, shieldingThicknessGCm2: 25.0, shieldingAttenuationFactor: 0.15 },
        suggestedMitigation: 'Monitor accumulated dose. Maintain shelter until dose rate < 100 µSv/h.',
      },
      {
        id: 'S02-E04', triggerTimeSec: 5400, applied: false,
        title: 'SPE Peak Passing — Dose Rate Declining', category: 'Radiation', severity: 'Warning',
        description: 'Solar event intensity reducing. Flux decreasing toward pre-event background.',
        parameters: { speFluxProtonsPerCm2Sec: 200, effectiveDoseRateMicroSvPerHour: 180 },
        suggestedMitigation: 'Monitor for secondary particle events before shelter exit.',
      },
      {
        id: 'S02-E05', triggerTimeSec: 7200, applied: false,
        title: 'All-Clear: Storm Shelter Exit Authorized', category: 'Radiation', severity: 'Info',
        description: 'SPE flux returns to background. Crew exits storm shelter. Normal operations resume.',
        parameters: { speActive: false, stormShelterActive: false, speFluxProtonsPerCm2Sec: 0,
          shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0, effectiveDoseRateMicroSvPerHour: 60 },
        suggestedMitigation: 'Log total accumulated dose. File incident report.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S03: CABIN PRESSURE ANOMALY
  // ─────────────────────────────────────────────
  {
    id: 'S03-PRESSURE',
    name: 'Cabin Pressure Anomaly',
    description:
      'A gradual cabin pressure loss consistent with a small-diameter micrometeorite hull breach or seal degradation. Crew must identify source, don suits if needed, and restore pressure.',
    missionPhase: 'Deep Space Cruise',
    severityClassification: 'High',
    affectedSystems: ['Cabin Pressure Control', 'Life Support', 'Suit/EMU Interface'],
    expectedSimulationVariables: ['Cabin pressure drop from 101.3 → 70 kPa', 'Increased respiratory rate', 'Crew stress index elevation'],
    recoveryObjectives: ['Identify and isolate leak within 15 minutes', 'Restore pressure above 70.3 kPa contingency floor', 'Suit donning within 3 minutes if below 70 kPa'],
    evaluationCriteria: ['Cabin pressure stabilised above contingency limit', 'No crew hypoxia symptoms', 'Leak isolated'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0, humidityPercent: 45.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0, accumulatedAbsorbedDoseMilliGy: 0,
        accumulatedEquivalentDoseMilliSv: 0, stormShelterActive: false,
        shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 68, oxygenSaturationPercent: 98,
        respiratoryRateBpm: 15, fatigueIndex: 18,
        circadianDisruptionIndex: 12, cognitiveStressIndex: 14,
        workloadIndex: 30, readinessScorePercent: 90, readinessCategory: 'Optimal',
        clinicalSummary: 'Nominal pre-incident status.',
      },
      resources: {
        oxygenRemainingKg: 475, oxygenCapacityKg: 500,
        waterRemainingLiters: 940, waterCapacityLiters: 1000,
        powerRemainingKWh: 165, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 82, consumableRationDays: 80,
        emergencyReservesPercent: 100, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S03-E01', triggerTimeSec: 120, applied: false,
        title: 'Pressure Anomaly Detected', category: 'Environmental', severity: 'Warning',
        description: 'Master caution: Cabin pressure decay rate exceeds 0.1 kPa/min. Possible hull integrity issue.',
        parameters: { leakRatePercentPerDay: 8.0, cabinPressureKPa: 100.5 },
        suggestedMitigation: 'Begin leak-isolation procedure. Alert Mission Control.',
      },
      {
        id: 'S03-E02', triggerTimeSec: 600, applied: false,
        title: 'Pressure Dropping — Isolate Module', category: 'Environmental', severity: 'High',
        description: 'Pressure now 88 kPa. Partial module isolation ordered. Crew respirations increasing.',
        parameters: { cabinPressureKPa: 88.0, oxygenPercent: 20.4, leakRatePercentPerDay: 12.0 },
        suggestedMitigation: 'Isolate suspect module. Crew don emergency pressure suits.',
      },
      {
        id: 'S03-E03', triggerTimeSec: 1200, applied: false,
        title: 'Leak Source Identified — Repair Underway', category: 'Environmental', severity: 'Warning',
        description: 'Faulty O-ring identified on Node connector. Repair initiated. Leak rate reducing.',
        parameters: { leakRatePercentPerDay: 2.0, cabinPressureKPa: 83.0 },
        suggestedMitigation: 'Monitor pressure while crew completes temporary patch.',
      },
      {
        id: 'S03-E04', triggerTimeSec: 2400, applied: false,
        title: 'Pressure Stabilised — Repair Successful', category: 'Environmental', severity: 'Info',
        description: 'O-ring replacement complete. Cabin pressure recovering.',
        parameters: { leakRatePercentPerDay: 0.05, cabinPressureKPa: 90.0 },
        suggestedMitigation: 'Allow pressure to recover naturally. Confirm scrubber nominal.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S04: HYPOXIA EMERGENCY
  // ─────────────────────────────────────────────
  {
    id: 'S04-HYPOXIA',
    name: 'Hypoxia Emergency',
    description:
      'Oxygen generation system (OGS) failure reduces cabin ppO2 below safe thresholds. Crew experience progressive hypoxia symptoms requiring oxygen from reserve cylinders and OGS repair.',
    missionPhase: 'Lunar Orbit Insertion',
    severityClassification: 'Extreme',
    affectedSystems: ['Oxygen Generation System (OGS)', 'Emergency O2 Supply', 'Life Support Monitoring'],
    expectedSimulationVariables: ['ppO2 < 16 kPa hypoxia threshold', 'SpO2 < 90%', 'Heart rate elevation', 'Cognitive impairment indicator'],
    recoveryObjectives: ['Restore ppO2 > 19.5 kPa', 'Maintain crew SpO2 > 94%', 'OGS repair or switchover within 20 min'],
    evaluationCriteria: ['No crew loss of consciousness (LoC) modelled', 'Emergency O2 reserve not fully depleted', 'OGS or backup system restored'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0, humidityPercent: 45.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 0, accumulatedEquivalentDoseMilliSv: 0,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 70, oxygenSaturationPercent: 98, respiratoryRateBpm: 15,
        fatigueIndex: 20, circadianDisruptionIndex: 14, cognitiveStressIndex: 16,
        workloadIndex: 35, readinessScorePercent: 88, readinessCategory: 'Nominal',
        clinicalSummary: 'Pre-failure nominal status.',
      },
      resources: {
        oxygenRemainingKg: 460, oxygenCapacityKg: 500,
        waterRemainingLiters: 920, waterCapacityLiters: 1000,
        powerRemainingKWh: 155, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 78, consumableRationDays: 75,
        emergencyReservesPercent: 100, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S04-E01', triggerTimeSec: 60, applied: false,
        title: 'OGS Failure — O2 Generation Halted', category: 'System', severity: 'Critical',
        description: 'Electrolysis unit fault. OGS producing 0% rated O2 output. ppO2 starting to decline.',
        parameters: { oxygenPercent: 20.5, oxygenKPa: 20.7 },
        suggestedMitigation: 'Switch to emergency backup O2 tanks. Begin OGS troubleshooting.',
      },
      {
        id: 'S04-E02', triggerTimeSec: 600, applied: false,
        title: 'ppO2 at Hypoxia Warning Threshold', category: 'Environmental', severity: 'High',
        description: 'ppO2 has declined to 16.5 kPa. Crew report mild headaches. Cognitive performance may be subtly reduced.',
        parameters: { oxygenPercent: 16.3, oxygenKPa: 16.5, co2Percent: 0.6 },
        suggestedMitigation: 'Open emergency O2 valve. Alert crew to conserve activity. Reduce workload.',
      },
      {
        id: 'S04-E03', triggerTimeSec: 1200, applied: false,
        title: 'Emergency O2 Supply Activated', category: 'System', severity: 'Warning',
        description: 'Backup O2 cylinder valve opened. ppO2 beginning recovery.',
        parameters: { oxygenPercent: 18.5, oxygenKPa: 18.7, consumptionRateMultiplier: 1.4 },
        suggestedMitigation: 'Monitor backup O2 consumption rate. Expedite OGS repair.',
      },
      {
        id: 'S04-E04', triggerTimeSec: 2400, applied: false,
        title: 'OGS Restarted — Supplemental O2 Continuing', category: 'System', severity: 'Info',
        description: 'OGS membrane fault isolated. Unit restarted at 60% capacity.',
        parameters: { oxygenPercent: 20.1, oxygenKPa: 20.3 },
        suggestedMitigation: 'Maintain backup O2 supplementation until ppO2 fully stable above 20 kPa.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S05: THERMAL REGULATION FAILURE
  // ─────────────────────────────────────────────
  {
    id: 'S05-THERMAL',
    name: 'Thermal Control System Failure',
    description:
      'Active Thermal Control System (ATCS) pump failure eliminates primary heat rejection. Cabin temperature begins rising. Crew must manage activities, power loads, and passive cooling.',
    missionPhase: 'Lunar Orbit Insertion',
    severityClassification: 'High',
    affectedSystems: ['Active Thermal Control System (ATCS)', 'Heat Rejection Radiators', 'Avionics Cooling', 'Crew Thermal Comfort'],
    expectedSimulationVariables: ['Cabin temperature rise from 22°C to > 32°C', 'Increased crew heart rate and thermal stress', 'Avionics thermal derating'],
    recoveryObjectives: ['Restore temperature < 27°C within 2 hours', 'Prevent avionics thermal derating above 40°C', 'Activate backup ATCS loop'],
    evaluationCriteria: ['Crew core temperature not modelled above safe bounds', 'Primary backup ATCS loop activated', 'No equipment thermal shutdown'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0, humidityPercent: 45.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 0, accumulatedEquivalentDoseMilliSv: 0,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 70, oxygenSaturationPercent: 98, respiratoryRateBpm: 15,
        fatigueIndex: 22, circadianDisruptionIndex: 15, cognitiveStressIndex: 18,
        workloadIndex: 40, readinessScorePercent: 85, readinessCategory: 'Nominal',
        clinicalSummary: 'Nominal pre-failure status.',
      },
      resources: {
        oxygenRemainingKg: 460, oxygenCapacityKg: 500,
        waterRemainingLiters: 920, waterCapacityLiters: 1000,
        powerRemainingKWh: 150, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 75, consumableRationDays: 72,
        emergencyReservesPercent: 95, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S05-E01', triggerTimeSec: 60, applied: false,
        title: 'ATCS Pump A Failure', category: 'System', severity: 'High',
        description: 'Primary ATCS Loop A pump seized. Heat rejection capacity reduced to 30%.',
        parameters: { tcsStatus: 'Degraded', temperatureC: 23.5 },
        suggestedMitigation: 'Switch to Loop B. Reduce electrical load. Notify Mission Control.',
      },
      {
        id: 'S05-E02', triggerTimeSec: 600, applied: false,
        title: 'Loop B Running at Limit — Temperature Rising', category: 'Environmental', severity: 'Warning',
        description: 'Temperature 28°C. Crew reporting warm discomfort. Increase water intake.',
        parameters: { temperatureC: 28.0, tcsStatus: 'Degraded', humidityPercent: 58 },
        suggestedMitigation: 'Further reduce power loads. Postpone non-essential activities.',
      },
      {
        id: 'S05-E03', triggerTimeSec: 1800, applied: false,
        title: 'Backup Loop Restored Partially', category: 'System', severity: 'Warning',
        description: 'Engineering patch allows Loop A to operate at 50% capacity. Temperature stabilising.',
        parameters: { temperatureC: 29.5, tcsStatus: 'Degraded' },
        suggestedMitigation: 'Monitor avionics bay temps. Continue power shed plan.',
      },
      {
        id: 'S05-E04', triggerTimeSec: 3600, applied: false,
        title: 'ATCS Fully Recovered', category: 'System', severity: 'Info',
        description: 'Loop A pump replaced via onboard spare. Full heat rejection restored. Temperature declining.',
        parameters: { tcsStatus: 'Nominal', temperatureC: 25.0 },
        suggestedMitigation: 'Allow cabin to cool. Resume normal crew schedule.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S06: SLEEP & CIRCADIAN DISRUPTION
  // ─────────────────────────────────────────────
  {
    id: 'S06-SLEEP',
    name: 'Sleep and Circadian Disruption',
    description:
      'An extended multi-day mission critical phase forces crew to work 20-hour periods with fragmented sleep blocks. Fatigue and cognitive performance gradually degrade over 72 simulated hours.',
    missionPhase: 'Surface Operations',
    severityClassification: 'Medium',
    affectedSystems: ['Crew Cognitive Performance', 'Psychomotor Vigilance Task (PVT)', 'Error Rate Indicators', 'Task Scheduling System'],
    expectedSimulationVariables: ['Fatigue index rising to 70+', 'Circadian disruption index > 60', 'Readiness degrading to Degraded/Impaired', 'SpO2 mildly reduced'],
    recoveryObjectives: ['Restore minimum 8-hour sleep opportunity', 'Reduce fatigue index below 40 within 24 hours', 'Return readiness to Nominal'],
    evaluationCriteria: ['Crew not assigned to safety-critical tasks when readiness is Impaired', 'Recovery sleep schedule successfully implemented'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.40, co2KPa: 0.40, temperatureC: 22.0, humidityPercent: 46.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 97, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 10, accumulatedEquivalentDoseMilliSv: 25,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 72, oxygenSaturationPercent: 97, respiratoryRateBpm: 15,
        fatigueIndex: 30, circadianDisruptionIndex: 25, cognitiveStressIndex: 28,
        workloadIndex: 65, readinessScorePercent: 76, readinessCategory: 'Nominal',
        clinicalSummary: 'Early fatigue accumulation. Crew beginning extended work period.',
      },
      resources: {
        oxygenRemainingKg: 445, oxygenCapacityKg: 500,
        waterRemainingLiters: 900, waterCapacityLiters: 1000,
        powerRemainingKWh: 140, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 70, consumableRationDays: 65,
        emergencyReservesPercent: 90, consumptionRateMultiplier: 1.2,
      },
    },
    events: [
      {
        id: 'S06-E01', triggerTimeSec: 0, applied: false,
        title: 'Extended Mission Phase Initiated — Reduced Sleep Window', category: 'Crew', severity: 'Warning',
        description: 'Mission schedule requires 20-hour activity blocks. Sleep reduced to 4 hours per cycle.',
        parameters: { workloadIndex: 75, fatigueIndex: 35 },
        suggestedMitigation: 'Log cognitive performance baseline. Flag tasks for review.',
      },
      {
        id: 'S06-E02', triggerTimeSec: 3600, applied: false,
        title: 'Day 2 — Moderate Fatigue', category: 'Crew', severity: 'Warning',
        description: 'Cumulative fatigue rising. Psychomotor vigilance beginning to decline noticeably.',
        parameters: { fatigueIndex: 55, circadianDisruptionIndex: 45, cognitiveStressIndex: 42, workloadIndex: 80 },
        suggestedMitigation: 'Remove from solo operations. Buddy system required.',
      },
      {
        id: 'S06-E03', triggerTimeSec: 7200, applied: false,
        title: 'Day 3 — Significant Cognitive Impairment Risk', category: 'Crew', severity: 'High',
        description: 'Fatigue index > 70. PVT performance simulated at 2-3x normal error rate threshold.',
        parameters: { fatigueIndex: 72, circadianDisruptionIndex: 65, cognitiveStressIndex: 60, workloadIndex: 85, readinessScorePercent: 48 },
        suggestedMitigation: 'Implement mandatory 8-hour rest. Remove from critical task assignment.',
      },
      {
        id: 'S06-E04', triggerTimeSec: 10800, applied: false,
        title: 'Recovery Sleep Period Completed', category: 'Crew', severity: 'Info',
        description: 'Full 8-hour sleep period completed. Fatigue beginning to recover.',
        parameters: { fatigueIndex: 45, circadianDisruptionIndex: 42, cognitiveStressIndex: 35, workloadIndex: 50 },
        suggestedMitigation: 'Allow 24-hour adaptive period before returning to full workload.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S07: COMMUNICATION BLACKOUT
  // ─────────────────────────────────────────────
  {
    id: 'S07-COMMS',
    name: 'Communication Blackout',
    description:
      'Loss of all communication links with Mission Control due to lunar occultation and equipment fault. Crew must operate autonomously for 48+ hours using onboard decision support systems.',
    missionPhase: 'Lunar Orbit Insertion',
    severityClassification: 'Medium',
    affectedSystems: ['S-band Communications', 'Optical Comms Link', 'Mission Control Data Relay', 'Crew Autonomous Operations'],
    expectedSimulationVariables: ['Communication delay → ∞', 'Crew stress increase', 'Decision latency increase', 'Workload increase'],
    recoveryObjectives: ['Maintain mission operations without MCC guidance', 'Restore comms within 48 hours', 'Document all anomalies for debrief'],
    evaluationCriteria: ['No mission-critical decisions deferred unnecessarily', 'Crew stress managed < 70', 'Backup comms checklist completed'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0, humidityPercent: 45.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 8, accumulatedEquivalentDoseMilliSv: 20,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 70, oxygenSaturationPercent: 98, respiratoryRateBpm: 15,
        fatigueIndex: 25, circadianDisruptionIndex: 18, cognitiveStressIndex: 22,
        workloadIndex: 55, readinessScorePercent: 83, readinessCategory: 'Nominal',
        clinicalSummary: 'Nominal. Slight stress elevation anticipated from isolation.',
      },
      resources: {
        oxygenRemainingKg: 450, oxygenCapacityKg: 500,
        waterRemainingLiters: 905, waterCapacityLiters: 1000,
        powerRemainingKWh: 148, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 74, consumableRationDays: 68,
        emergencyReservesPercent: 95, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S07-E01', triggerTimeSec: 60, applied: false,
        title: 'All Comms Links Lost', category: 'Comms', severity: 'High',
        description: 'S-band and optical communication links non-functional. Lunar occultation + antenna fault combination.',
        parameters: { cognitiveStressIndex: 38, workloadIndex: 65 },
        suggestedMitigation: 'Activate autonomous operations mode. Run communications recovery checklist.',
      },
      {
        id: 'S07-E02', triggerTimeSec: 1800, applied: false,
        title: '30-min Blackout — Crew Stress Rising', category: 'Comms', severity: 'Warning',
        description: 'All restoration attempts unsuccessful. Crew acknowledged isolation. Stress rising.',
        parameters: { cognitiveStressIndex: 48, workloadIndex: 70 },
        suggestedMitigation: 'Implement isolation protocol. Increase crew interaction. Delegate tasks.',
      },
      {
        id: 'S07-E03', triggerTimeSec: 7200, applied: false,
        title: 'Partial Comms Restored — Low Bandwidth', category: 'Comms', severity: 'Info',
        description: 'Backup low-gain antenna link established. Text-only 8 kbps data channel available.',
        parameters: { cognitiveStressIndex: 35, workloadIndex: 60 },
        suggestedMitigation: 'Prioritise safety-critical messages. Compress data. Avoid video.',
      },
      {
        id: 'S07-E04', triggerTimeSec: 14400, applied: false,
        title: 'Full Comms Restored', category: 'Comms', severity: 'Info',
        description: 'Primary S-band link restored following orbital geometry change. Normal communications resume.',
        parameters: { cognitiveStressIndex: 24, workloadIndex: 48 },
        suggestedMitigation: 'Full mission control briefing. File all anomaly reports.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S08: EQUIPMENT FAILURE
  // ─────────────────────────────────────────────
  {
    id: 'S08-EQUIP',
    name: 'Equipment and Sensor Failure',
    description:
      'CO₂ scrubber (CDRA) faults combined with environmental sensor failures. CO₂ concentration starts rising before crew detects via symptoms.',
    missionPhase: 'Deep Space Cruise',
    severityClassification: 'High',
    affectedSystems: ['CO2 Removal Assembly (CDRA)', 'Environmental Monitors', 'Life Support Backups'],
    expectedSimulationVariables: ['ppCO2 rising above 0.5 kPa', 'Crew headache indicators', 'Respiratory rate increase'],
    recoveryObjectives: ['CO2 < 0.4 kPa within 1 hour of backup activation', 'Scrubber replacement within 4 hours'],
    evaluationCriteria: ['Crew ppCO2 exposure minimised', 'Backup system successfully activated', 'No lasting cognitive effects simulated'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0, humidityPercent: 45.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 12, accumulatedEquivalentDoseMilliSv: 30,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 70, oxygenSaturationPercent: 98, respiratoryRateBpm: 15,
        fatigueIndex: 20, circadianDisruptionIndex: 15, cognitiveStressIndex: 16,
        workloadIndex: 42, readinessScorePercent: 86, readinessCategory: 'Nominal',
        clinicalSummary: 'Nominal. No symptoms.',
      },
      resources: {
        oxygenRemainingKg: 440, oxygenCapacityKg: 500,
        waterRemainingLiters: 890, waterCapacityLiters: 1000,
        powerRemainingKWh: 140, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 70, consumableRationDays: 60,
        emergencyReservesPercent: 88, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S08-E01', triggerTimeSec: 120, applied: false,
        title: 'CDRA Bed A Fault — Efficiency Reduced', category: 'System', severity: 'Warning',
        description: 'Carbon Dioxide Removal Assembly Bed A zeolite sieve failed. Scrubber at 45% efficiency.',
        parameters: { scrubberEfficiencyPercent: 45, co2Percent: 0.52, co2KPa: 0.52 },
        suggestedMitigation: 'Activate Bed B. Alert crew. Reduce metabolic activity.',
      },
      {
        id: 'S08-E02', triggerTimeSec: 900, applied: false,
        title: 'CO2 Rising — Crew Symptoms Beginning', category: 'Environmental', severity: 'High',
        description: 'ppCO2 at 0.9 kPa. Crew report mild headaches and shortness of breath.',
        parameters: { co2Percent: 0.90, co2KPa: 0.90, respiratoryRateBpm: 19, cognitiveStressIndex: 42 },
        suggestedMitigation: 'Emergency CDRA bypass using LiOH canisters. Open CO2 vent purge valve.',
      },
      {
        id: 'S08-E03', triggerTimeSec: 1800, applied: false,
        title: 'LiOH Canister Emergency Activated', category: 'System', severity: 'Warning',
        description: 'LiOH chemical absorbers activated. CO2 declining.',
        parameters: { scrubberEfficiencyPercent: 72, co2Percent: 0.62, co2KPa: 0.62 },
        suggestedMitigation: 'Monitor LiOH canister depletion rate. Repair CDRA Bed A.',
      },
      {
        id: 'S08-E04', triggerTimeSec: 3600, applied: false,
        title: 'CDRA Repaired — Nominal CO2 Removal', category: 'System', severity: 'Info',
        description: 'Replacement zeolite sieve installed. CO2 returning to nominal.',
        parameters: { scrubberEfficiencyPercent: 96, co2Percent: 0.40, co2KPa: 0.40 },
        suggestedMitigation: 'Monitor for 4 hours post-repair. Document LiOH reserve depletion.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S09: MEDICAL EMERGENCY
  // ─────────────────────────────────────────────
  {
    id: 'S09-MEDICAL',
    name: 'Medical Emergency',
    description:
      'An acute medical event (simulated cardiac arrhythmia) affects one crew member. Medical officer must triage, stabilise, and determine whether mission abort criteria are met.',
    missionPhase: 'Surface Operations',
    severityClassification: 'Extreme',
    affectedSystems: ['Medical Diagnosis Equipment', 'Crew Readiness', 'Mission Scheduling', 'Emergency Return Planning'],
    expectedSimulationVariables: ['Crew member incapacitated', 'Remaining crew workload surge', 'Medical resource consumption'],
    recoveryObjectives: ['Stabilise affected crew member', 'Determine mission continuation criteria', 'File medical incident report'],
    evaluationCriteria: ['Crew medical responder available', 'Defibrillator and medical kit accessibility', 'Mission abort decision within defined timeline'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.38, co2KPa: 0.38, temperatureC: 22.0, humidityPercent: 45.0,
        leakRatePercentPerDay: 0.05, scrubberEfficiencyPercent: 98, tcsStatus: 'Nominal',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 25, effectiveDoseRateMicroSvPerHour: 60,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 15, accumulatedEquivalentDoseMilliSv: 38,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 72, oxygenSaturationPercent: 97, respiratoryRateBpm: 15,
        fatigueIndex: 30, circadianDisruptionIndex: 22, cognitiveStressIndex: 25,
        workloadIndex: 55, readinessScorePercent: 78, readinessCategory: 'Nominal',
        clinicalSummary: 'Pre-event nominal status.',
      },
      resources: {
        oxygenRemainingKg: 420, oxygenCapacityKg: 500,
        waterRemainingLiters: 860, waterCapacityLiters: 1000,
        powerRemainingKWh: 130, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 65, consumableRationDays: 55,
        emergencyReservesPercent: 85, consumptionRateMultiplier: 1.0,
      },
    },
    events: [
      {
        id: 'S09-E01', triggerTimeSec: 60, applied: false,
        title: 'Crew Member: Acute Cardiac Event Simulated', category: 'Medical', severity: 'Critical',
        description: 'Simulated arrhythmia in Crew Member 2. Loss of effective workload capacity. Medical officer response required.',
        parameters: { workloadIndex: 85, cognitiveStressIndex: 70, heartRateBpm: 115 },
        suggestedMitigation: 'Medical officer assumes command. Defibrillator readied. Notify Mission Control.',
      },
      {
        id: 'S09-E02', triggerTimeSec: 600, applied: false,
        title: 'Acute Phase Stabilised', category: 'Medical', severity: 'High',
        description: 'Cardiac event stabilised with onboard cardioverter. Patient monitoring continuous.',
        parameters: { heartRateBpm: 88, cognitiveStressIndex: 58, consumptionRateMultiplier: 1.3 },
        suggestedMitigation: 'Assign light-duty only. Increase medical monitoring interval to 30 minutes.',
      },
      {
        id: 'S09-E03', triggerTimeSec: 2400, applied: false,
        title: 'Mission Continuation Assessment Complete', category: 'Medical', severity: 'Warning',
        description: 'Flight surgeon (MCC, simulated) advises mission continuation with modified ops tempo.',
        parameters: { workloadIndex: 65, cognitiveStressIndex: 42 },
        suggestedMitigation: 'Adjust crew task allocation. Increase rest schedule. Document for de-brief.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S10: MULTI-SYSTEM EMERGENCY
  // ─────────────────────────────────────────────
  {
    id: 'S10-COMPOUND',
    name: 'Multi-System Emergency (Compound)',
    description:
      'A compounded emergency: an SPE occurs while CDRA is already operating at reduced capacity, comms are degraded, and crew fatigue is elevated. All systems interact. Crew must prioritise and triage.',
    missionPhase: 'Deep Space Cruise',
    severityClassification: 'Extreme',
    affectedSystems: ['Radiation Shielding', 'CO2 Removal (CDRA)', 'Communications', 'Life Support', 'Crew Cognitive Performance', 'Resource Reserves'],
    expectedSimulationVariables: ['SPE dose rate surge', 'CO2 rise', 'Stress spike to > 75', 'Readiness declining to Critical'],
    recoveryObjectives: ['Crew sheltered from SPE within 20 min', 'CO2 mitigated below 1 kPa', 'Comms partially restored', 'Resource budget maintained'],
    evaluationCriteria: ['Compound risk score peak tracked', 'Crew readiness recovery path visible', 'All major risks addressed in priority order'],
    initialConditions: {
      environment: {
        cabinPressureKPa: 101.3, oxygenPercent: 21.0, oxygenKPa: 21.3,
        co2Percent: 0.52, co2KPa: 0.52, temperatureC: 24.0, humidityPercent: 50.0,
        leakRatePercentPerDay: 0.08, scrubberEfficiencyPercent: 55, tcsStatus: 'Degraded',
      },
      radiation: {
        backgroundDoseRateMicroGyPerHour: 28, effectiveDoseRateMicroSvPerHour: 68,
        speActive: false, speFluxProtonsPerCm2Sec: 0,
        accumulatedAbsorbedDoseMilliGy: 20, accumulatedEquivalentDoseMilliSv: 50,
        stormShelterActive: false, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0,
      },
      crew: {
        heartRateBpm: 78, oxygenSaturationPercent: 97, respiratoryRateBpm: 17,
        fatigueIndex: 48, circadianDisruptionIndex: 40, cognitiveStressIndex: 45,
        workloadIndex: 72, readinessScorePercent: 62, readinessCategory: 'Degraded',
        clinicalSummary: 'Pre-compound event: crew already fatigued, CO2 mildly elevated.',
      },
      resources: {
        oxygenRemainingKg: 380, oxygenCapacityKg: 500,
        waterRemainingLiters: 780, waterCapacityLiters: 1000,
        powerRemainingKWh: 100, powerCapacityKWh: 200,
        batteryStateOfChargePercent: 50, consumableRationDays: 42,
        emergencyReservesPercent: 65, consumptionRateMultiplier: 1.4,
      },
    },
    events: [
      {
        id: 'S10-E01', triggerTimeSec: 60, applied: false,
        title: 'SPE Onset — Storm Warning', category: 'Radiation', severity: 'Critical',
        description: 'Major SPE detected. Dose rate surging past 1500 µSv/h. Crew must shelter immediately.',
        parameters: { speActive: true, speFluxProtonsPerCm2Sec: 2000, effectiveDoseRateMicroSvPerHour: 2200 },
        suggestedMitigation: 'Emergency shelter ingress. Prioritise SPE mitigation over all other tasks.',
      },
      {
        id: 'S10-E02', triggerTimeSec: 300, applied: false,
        title: 'CO2 Scrubber Fault — CO2 Accelerating', category: 'System', severity: 'Critical',
        description: 'CDRA fully offline during shelter ingress. CO2 rising rapidly.',
        parameters: { co2Percent: 0.80, co2KPa: 0.80, scrubberEfficiencyPercent: 0 },
        suggestedMitigation: 'Deploy LiOH canisters from emergency supply. CO2 mitigation at shelter.',
      },
      {
        id: 'S10-E03', triggerTimeSec: 600, applied: false,
        title: 'Comms Blackout — High-Gain Antenna Failure', category: 'Comms', severity: 'High',
        description: 'SPE-induced static disables primary HGA. Only crew-to-crew local comms available.',
        parameters: { cognitiveStressIndex: 78, workloadIndex: 92 },
        suggestedMitigation: 'Crew operates autonomously. Use onboard decision-support systems.',
      },
      {
        id: 'S10-E04', triggerTimeSec: 1200, applied: false,
        title: 'Shelter Activated — SPE Attenuation Active', category: 'Radiation', severity: 'Warning',
        description: 'Full storm shelter engaged. Shielding 25 g/cm². CO2 control improving with LiOH.',
        parameters: { stormShelterActive: true, shieldingThicknessGCm2: 25.0, shieldingAttenuationFactor: 0.15, co2Percent: 0.72, co2KPa: 0.72 },
        suggestedMitigation: 'Prioritise CO2 management within shelter. Conserve power.',
      },
      {
        id: 'S10-E05', triggerTimeSec: 3600, applied: false,
        title: 'SPE Peak Passing — CO2 Improving', category: 'Radiation', severity: 'Warning',
        description: 'SPE flux declining. CO2 controlled at 0.6 kPa via LiOH. Crew stress peak.',
        parameters: { speFluxProtonsPerCm2Sec: 400, effectiveDoseRateMicroSvPerHour: 420, co2Percent: 0.60 },
        suggestedMitigation: 'Maintain shelter until dose rate < 200 µSv/h. Begin CDRA restart sequence.',
      },
      {
        id: 'S10-E06', triggerTimeSec: 7200, applied: false,
        title: 'Compound Emergency Resolved', category: 'System', severity: 'Info',
        description: 'All-clear issued. SPE ended. CO2 nominal. Partial comms restored. Crew exiting shelter.',
        parameters: { speActive: false, stormShelterActive: false, co2Percent: 0.40, scrubberEfficiencyPercent: 80,
          effectiveDoseRateMicroSvPerHour: 65, shieldingThicknessGCm2: 5.0, shieldingAttenuationFactor: 1.0 },
        suggestedMitigation: 'Begin phased recovery. Debrief. Assess resource budget and remaining mission viability.',
      },
    ],
  },
];
