/**
 * Unit dictionary and conversion verification utility for aerospace biomedical variables.
 */

export interface VariableDefinition {
  variableKey: string;
  name: string;
  system: string;
  standardUnit: string;
  acceptableUnits: string[];
  description: string;
  isCumulative: boolean;
  typicalPhysiologicalRange: {
    min: number;
    max: number;
  };
}

export const BIOMEDICAL_VARIABLE_REGISTRY: Record<string, VariableDefinition> = {
  resting_heart_rate: {
    variableKey: 'resting_heart_rate',
    name: 'Resting Heart Rate',
    system: 'cardiovascular',
    standardUnit: 'bpm',
    acceptableUnits: ['bpm', 'beats/min'],
    description: 'Autonomous resting cardiac frequency measured in low-activity state.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 45, max: 100 },
  },
  systolic_bp: {
    variableKey: 'systolic_bp',
    name: 'Systolic Blood Pressure',
    system: 'cardiovascular',
    standardUnit: 'mmHg',
    acceptableUnits: ['mmHg'],
    description: 'Peak arterial pressure during cardiac contraction.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 90, max: 140 },
  },
  diastolic_bp: {
    variableKey: 'diastolic_bp',
    name: 'Diastolic Blood Pressure',
    system: 'cardiovascular',
    standardUnit: 'mmHg',
    acceptableUnits: ['mmHg'],
    description: 'Minimum arterial pressure during cardiac relaxation.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 60, max: 90 },
  },
  vo2_max: {
    variableKey: 'vo2_max',
    name: 'Aerobic Capacity (VO2 Max)',
    system: 'cardiovascular',
    standardUnit: 'mL/kg/min',
    acceptableUnits: ['mL/kg/min'],
    description: 'Maximum rate of oxygen consumption measured during cycle ergometer or treadmill test.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 30, max: 70 },
  },
  bone_mineral_density_femoral: {
    variableKey: 'bone_mineral_density_femoral',
    name: 'Femoral Neck BMD T-Score',
    system: 'musculoskeletal',
    standardUnit: 'T-score',
    acceptableUnits: ['T-score', 'g/cm²'],
    description: 'Dual-energy X-ray absorptiometry (DEXA) or quantitative CT bone mineral density normalized against young adult reference.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: -2.5, max: 2.0 },
  },
  muscle_strength_isometric: {
    variableKey: 'muscle_strength_isometric',
    name: 'Isometric Quadriceps Strength',
    system: 'musculoskeletal',
    standardUnit: 'Nm',
    acceptableUnits: ['Nm', 'N*m'],
    description: 'Maximal voluntary isometric torque of knee extensors.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 120, max: 320 },
  },
  lean_muscle_mass: {
    variableKey: 'lean_muscle_mass',
    name: 'Estimated Lean Muscle Mass',
    system: 'musculoskeletal',
    standardUnit: 'kg',
    acceptableUnits: ['kg'],
    description: 'Body composition lean mass assessment.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 40, max: 85 },
  },
  tnf_alpha: {
    variableKey: 'tnf_alpha',
    name: 'Serum TNF-alpha',
    system: 'immune',
    standardUnit: 'pg/mL',
    acceptableUnits: ['pg/mL'],
    description: 'Pro-inflammatory cytokine indicator of systemic immune activation or stress response.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 0.5, max: 12.0 },
  },
  il_6: {
    variableKey: 'il_6',
    name: 'Interleukin-6 (IL-6)',
    system: 'immune',
    standardUnit: 'pg/mL',
    acceptableUnits: ['pg/mL'],
    description: 'Myokine and acute-phase inflammatory cytokine modulated by microgravity and exercise.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 0.2, max: 10.0 },
  },
  t_cell_activation: {
    variableKey: 't_cell_activation',
    name: 'T-Cell CD69 Activation Ratio',
    system: 'immune',
    standardUnit: '%',
    acceptableUnits: ['%'],
    description: 'Early activation marker expression following mitogen challenge.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 50, max: 95 },
  },
  sensorimotor_balance_score: {
    variableKey: 'sensorimotor_balance_score',
    name: 'Postural Balance Equilibrium Index',
    system: 'neurological',
    standardUnit: 'score (0-100)',
    acceptableUnits: ['score (0-100)', 'pts'],
    description: 'Computerized Dynamic Posturography (CDP) sensory orientation test index.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 50, max: 100 },
  },
  cognitive_reaction_speed: {
    variableKey: 'cognitive_reaction_speed',
    name: 'Cognitive Reaction Time (Psychomotor Vigilance)',
    system: 'neurological',
    standardUnit: 'ms',
    acceptableUnits: ['ms'],
    description: '10-minute PVT mean reaction latency.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 180, max: 350 },
  },
  sleep_duration_actual: {
    variableKey: 'sleep_duration_actual',
    name: 'Actigraphy Sleep Duration',
    system: 'sleep_circadian',
    standardUnit: 'hours',
    acceptableUnits: ['hours', 'hrs', 'h'],
    description: 'Total actual nocturnal sleep time recorded by wrist actigraphy.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 4.0, max: 9.5 },
  },
  sleep_efficiency: {
    variableKey: 'sleep_efficiency',
    name: 'Sleep Efficiency',
    system: 'sleep_circadian',
    standardUnit: '%',
    acceptableUnits: ['%'],
    description: 'Percentage of time in bed spent asleep.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 65, max: 98 },
  },
  circadian_phase_delay: {
    variableKey: 'circadian_phase_delay',
    name: 'Dim Light Melatonin Onset (DLMO) Shift',
    system: 'sleep_circadian',
    standardUnit: 'hours',
    acceptableUnits: ['hours', 'hrs'],
    description: 'Phase shift of endogenous melatonin onset relative to target bedtime schedule.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: -3.0, max: 3.0 },
  },
  radiation_cumulative_dose: {
    variableKey: 'radiation_cumulative_dose',
    name: 'Cumulative Absorbed Dose Equivalent',
    system: 'radiation_context',
    standardUnit: 'mSv',
    acceptableUnits: ['mSv'],
    description: 'Personal active dosimeter cumulative space radiation dose equivalent.',
    isCumulative: true,
    typicalPhysiologicalRange: { min: 0, max: 1000 },
  },
  radiation_daily_rate: {
    variableKey: 'radiation_daily_rate',
    name: 'Daily Dose Equivalent Rate',
    system: 'radiation_context',
    standardUnit: 'mSv/day',
    acceptableUnits: ['mSv/day', 'uSv/day'],
    description: 'Daily ambient radiation dosimetric rate in vehicle habitat.',
    isCumulative: false,
    typicalPhysiologicalRange: { min: 0.1, max: 3.5 },
  },
};

/**
 * Validates if two variables and units are compatible for mathematical comparison.
 */
export function areVariablesCompatible(varAKey: string, varBKey: string): {
  compatible: boolean;
  reason?: string;
} {
  if (varAKey === varBKey) {
    return { compatible: true };
  }

  const defA = BIOMEDICAL_VARIABLE_REGISTRY[varAKey];
  const defB = BIOMEDICAL_VARIABLE_REGISTRY[varBKey];

  if (!defA || !defB) {
    return {
      compatible: false,
      reason: 'One or both variables are not registered in standard biomedical taxonomy.',
    };
  }

  if (defA.standardUnit !== defB.standardUnit) {
    return {
      compatible: false,
      reason: `Incompatible measurement units: ${defA.name} uses [${defA.standardUnit}], whereas ${defB.name} uses [${defB.standardUnit}]. Cannot combine scientifically distinct dimensions.`,
    };
  }

  if (defA.isCumulative !== defB.isCumulative) {
    return {
      compatible: false,
      reason: 'Cannot compare a cumulative metric with an instantaneous rate or state measurement.',
    };
  }

  return { compatible: true };
}
