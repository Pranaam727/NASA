import { MissionScenario, ScenarioSimulationResult } from '../types';

export const DEMO_SCENARIOS: MissionScenario[] = [
  {
    id: 'scen-001',
    name: 'ISS Standard Low Earth Orbit Expedition (6 Months)',
    destination: 'Low Earth Orbit (ISS/Axiom)',
    durationDays: 180,
    environmentDescription: '400 km altitude, 51.6-degree inclination, geomagnetic field protection against GCR, microgravity (10^-6 g). Standard ISS environmental life support (ECLSS).',
    exerciseSchedule: {
      aerobicHoursPerDay: 1.0,
      resistiveHoursPerDay: 1.5,
      daysPerWeek: 6,
    },
    sleepSchedule: {
      targetHours: 8.0,
      circadianLighting: true,
      noiseLevelDb: 58,
    },
    radiationScenario: {
      environment: 'Low (LEO Van Allen Protected)',
      estimatedDailyDoseMsv: 0.45,
      stormShelterAvailable: true,
    },
    assumptions: [
      'Standard ARED resistive exercise protocol followed with >=90% compliance',
      'T2 treadmill and CEVIS cycle ergometer daily operational availability',
      'Geomagnetic shielding shields vehicle from ~50% of deep-space galactic cosmic rays',
      'ISS Solid State Lighting Assembly (SSLA) tuned to 480nm morning blue-enriched schedule',
    ],
    scientificNotes: 'NASA Human Research Program baseline profile for long-duration microgravity acclimation and countermeasure effectiveness.',
    createdAt: '2026-06-01T00:00:00Z',
    isPreconfigured: true,
  },
  {
    id: 'scen-002',
    name: 'Artemis Lunar Gateway Habitation & Surface Sortie (45 Days)',
    destination: 'Lunar Gateway / Artemis',
    durationDays: 45,
    environmentDescription: 'Near-Rectilinear Halo Orbit (NRHO) around the Moon. Outside Earth geomagnetic shielding. Intermittent 1/6 g on lunar surface, zero-g in Gateway habitat.',
    exerciseSchedule: {
      aerobicHoursPerDay: 0.75,
      resistiveHoursPerDay: 1.0,
      daysPerWeek: 5,
    },
    sleepSchedule: {
      targetHours: 7.5,
      circadianLighting: true,
      noiseLevelDb: 62,
    },
    radiationScenario: {
      environment: 'Moderate (Lunar Surface/Transit)',
      estimatedDailyDoseMsv: 1.35,
      stormShelterAvailable: true,
    },
    assumptions: [
      'Compact exercise countermeasure device (E-STALL or MED-2) utilized due to Gateway volume constraints',
      'Unshielded GCR exposure rate ~3x higher than LEO baseline',
      'Water wall secondary storm shelter deployed in crew quarters during SPE events',
    ],
    scientificNotes: 'Artemis lunar architecture physiological stressors including partial gravity transitions and elevated cislunar dosimetric loads.',
    createdAt: '2026-07-01T00:00:00Z',
    isPreconfigured: true,
  },
  {
    id: 'scen-003',
    name: 'Mars Conjunction Class Transit & Surface Stay (500 Days)',
    destination: 'Mars Transit / Habitat',
    durationDays: 500,
    environmentDescription: 'Interplanetary heliocentric cruise (200 days outward, 500 days surface at 0.38g, 200 days return). No Earth magnetospheric protection. Extreme communication delay (up to 22 mins).',
    exerciseSchedule: {
      aerobicHoursPerDay: 1.25,
      resistiveHoursPerDay: 1.5,
      daysPerWeek: 6,
    },
    sleepSchedule: {
      targetHours: 8.0,
      circadianLighting: true,
      noiseLevelDb: 55,
    },
    radiationScenario: {
      environment: 'Elevated (Interplanetary SPE/GCR)',
      estimatedDailyDoseMsv: 1.85,
      stormShelterAvailable: true,
    },
    assumptions: [
      'Autonomous crew medical decision-support required due to 20-minute communication latency',
      'Continuous GCR heavy ion exposure (Fe, Si, O) with stochastic biological risks',
      'Martian diurnal cycle (sol = 24h 39m) creates continuous circadian phase pressure',
    ],
    scientificNotes: 'NASA Human Research Roadmap Path to Mars critical risk profile for multi-year deep space habitation.',
    createdAt: '2026-08-01T00:00:00Z',
    isPreconfigured: true,
  },
  {
    id: 'scen-004',
    name: 'CHAPEA / HERA High-Fidelity Isolation Analog (365 Days)',
    destination: 'Ground-based Isolation Analog (HERA/CHAPEA)',
    durationDays: 365,
    environmentDescription: 'Ground-based 1,700 sq ft 3D-printed Mars habitat analog at NASA Johnson Space Center. Earth gravity (1.0g), zero cosmic radiation, simulated communications delay.',
    exerciseSchedule: {
      aerobicHoursPerDay: 1.0,
      resistiveHoursPerDay: 1.0,
      daysPerWeek: 5,
    },
    sleepSchedule: {
      targetHours: 8.0,
      circadianLighting: false,
      noiseLevelDb: 50,
    },
    radiationScenario: {
      environment: 'Low (LEO Van Allen Protected)',
      estimatedDailyDoseMsv: 0.01,
      stormShelterAvailable: false,
    },
    assumptions: [
      'Ground 1G gravity eliminates bone demineralization and cephalad fluid shift',
      'Focus strictly on behavioral health, sensorimotor fatigue, circadian rhythms and immune modulation from confinement',
    ],
    scientificNotes: 'NASA Crew Health and Performance Exploration Analog study baseline.',
    createdAt: '2026-09-01T00:00:00Z',
    isPreconfigured: true,
  },
];

export function simulateMissionScenario(scenario: MissionScenario): ScenarioSimulationResult {
  // Scientific estimation factors based on published NASA HRP evidence
  const isMicrogravity = scenario.destination !== 'Ground-based Isolation Analog (HERA/CHAPEA)';
  const days = scenario.durationDays;
  const resistiveWeeklyHours = scenario.exerciseSchedule.resistiveHoursPerDay * scenario.exerciseSchedule.daysPerWeek;
  const aerobicWeeklyHours = scenario.exerciseSchedule.aerobicHoursPerDay * scenario.exerciseSchedule.daysPerWeek;

  // Expected bone loss rate: ~1% per month in microgravity with 0 exercise, reduced to ~0.3-0.5% with optimal resistive
  const boneLossFactorPerDay = isMicrogravity
    ? Math.max(0.005, 0.033 - resistiveWeeklyHours * 0.0028)
    : 0.0;
  const projectedBoneLossPct = Math.min(25, Math.round(boneLossFactorPerDay * days * 10) / 10);

  // VO2 max change: affected by aerobic volume vs microgravity plasma volume drop
  const plasmaDrop = isMicrogravity ? 8.0 : 0.0;
  const aerobicMitigation = Math.min(10, aerobicWeeklyHours * 1.5);
  const vo2LossPct = Math.round(Math.max(0, plasmaDrop + (days > 90 ? 4 : 2) - aerobicMitigation) * 10) / 10;

  // Radiation cumulative:
  const cumulativeDose = Math.round(scenario.radiationScenario.estimatedDailyDoseMsv * days * 10) / 10;

  // Sleep deficit:
  const targetSleep = scenario.sleepSchedule.targetHours;
  const estimatedActualSleep = scenario.sleepSchedule.circadianLighting ? Math.min(targetSleep, targetSleep * 0.88) : targetSleep * 0.78;
  const dailyDeficit = Math.max(0, targetSleep - estimatedActualSleep);
  const projectedSleepDeficitTotal = Math.round(dailyDeficit * days * 10) / 10;

  // Dynamic system impacts
  const systemImpacts = [
    {
      system: 'Musculoskeletal System',
      projectedChangePercent: -projectedBoneLossPct,
      confidenceLevel: 'High (HRP ARED Studies)',
      keyDrivers: [
        `Resistive training: ${resistiveWeeklyHours.toFixed(1)} hrs/week`,
        isMicrogravity ? 'Microgravity weightlessness unloading' : 'Earth 1G ground loading',
      ],
      evidenceReferences: [
        'NASA HRP Risk of Early Onset Osteoporosis Due to Spaceflight',
        'Sibonga et al. (2019) Bone Mineral Density Maintenance on ISS with ARED',
      ],
    },
    {
      system: 'Cardiovascular System',
      projectedChangePercent: -vo2LossPct,
      confidenceLevel: 'Moderate (ISS CEVIS & T2 Archive)',
      keyDrivers: [
        isMicrogravity ? 'Cephalad fluid shift & ~15% plasma volume contraction' : 'Standard 1G orthostatic pressure',
        `Aerobic countermeasure: ${aerobicWeeklyHours.toFixed(1)} hrs/week`,
      ],
      evidenceReferences: [
        'NASA HRP Risk of Orthostatic Intolerance and Cardiac Deconditioning',
        'Levine et al. (2021) Ventricular Remodeling in Long-Duration Spaceflight',
      ],
    },
    {
      system: 'Radiation & Cellular Integrity',
      projectedChangePercent: cumulativeDose > 100 ? -14.5 : cumulativeDose > 40 ? -6.2 : -1.8,
      confidenceLevel: 'Moderate (Dosimetric Simulation)',
      keyDrivers: [
        `Cumulative estimated absorbed dose: ${cumulativeDose} mSv`,
        `Environment: ${scenario.radiationScenario.environment}`,
      ],
      evidenceReferences: [
        'NASA Technical Standard NASA-STD-3001 Space Permissible Exposure Limits',
        'Cucinotta et al. Space Radiation Cancer Risk Projections for Exploration Missions',
      ],
    },
    {
      system: 'Sleep & Neurobehavioral Health',
      projectedChangePercent: -(Math.min(20, Math.round(dailyDeficit * 12 * 10) / 10)),
      confidenceLevel: 'High (Actigraphy Data Collections)',
      keyDrivers: [
        `Projected sleep duration: ${estimatedActualSleep.toFixed(1)} hrs/day (target: ${targetSleep} hrs)`,
        scenario.sleepSchedule.circadianLighting ? 'SSLA dynamic lighting countermeasures active' : 'Standard static lighting',
      ],
      evidenceReferences: [
        'Barger et al. (2014) Operational Sleep Deprivation in Astronauts During Space Missions',
        'NASA Human Research Roadmap Risk of Behavioral Health Conditions',
      ],
    },
  ];

  // Overall readiness index
  const readiness = Math.max(
    40,
    Math.round(100 - (projectedBoneLossPct * 1.5 + vo2LossPct * 1.2 + Math.min(25, cumulativeDose / 15) + dailyDeficit * 8))
  );

  // Biomarker timeline slices (every 10% of mission)
  const steps = 10;
  const projectedBiomarkerTrends = [];
  for (let i = 0; i <= steps; i++) {
    const day = Math.round((i / steps) * days);
    projectedBiomarkerTrends.push({
      day,
      estimatedBoneLossPct: Math.round(((i / steps) * projectedBoneLossPct) * 10) / 10,
      estimatedVo2MaxPct: Math.round(((i / steps) * vo2LossPct) * 10) / 10,
      estimatedCumulativeDoseMsv: Math.round(((i / steps) * cumulativeDose) * 10) / 10,
      estimatedSleepDeficitHours: Math.round(((i / steps) * projectedSleepDeficitTotal) * 10) / 10,
    });
  }

  return {
    scenarioId: scenario.id,
    systemImpacts,
    overallReadinessScore: readiness,
    projectedBiomarkerTrends,
  };
}
