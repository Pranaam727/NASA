import { MissionProfile, QualitativeRiskRelevance, RiskRelevanceAssessment } from '../types/mission.types';

export const PRESET_MISSION_PROFILES: MissionProfile[] = [
  {
    id: 'mission-iss-leo',
    missionName: 'ISS Long-Duration Expedition (6 Months)',
    missionType: 'LEO',
    destination: 'Low Earth Orbit (408 km, 51.6° inclination)',
    durationDays: 180,
    crewSize: 6,
    environment: {
      radiationFieldType: 'LEO_GEOMAGNETIC_SHIELDED',
      gravityField: 'MICROGRAVITY',
      communicationLatencyMinutes: 0.001,
      evacuationTimeDays: 0.3,
      habitatVolumePerCrewM3: 65
    },
    activePhase: 'ORBITAL_STATION_OPS',
    isHypothetical: false,
    notes: 'Operational baseline for all NASA long-duration human spaceflight standards. Daily resupply and immediate Earth return capability.'
  },
  {
    id: 'mission-artemis-lunar-surface',
    missionName: 'Artemis Base Camp Expedition (Lunar South Pole)',
    missionType: 'LUNAR_SURFACE',
    destination: 'Moon (Shackleton Crater Rim, 89.9°S)',
    durationDays: 30,
    crewSize: 4,
    environment: {
      radiationFieldType: 'CISLUNAR_UNSHIELDED',
      gravityField: 'LUNAR_SIXTH',
      communicationLatencyMinutes: 0.022, // ~1.3 seconds
      evacuationTimeDays: 3.5,
      habitatVolumePerCrewM3: 28
    },
    activePhase: 'SURFACE_EXTRAVEHICULAR',
    isHypothetical: false,
    notes: 'Partial gravity (0.166 G), high regolith dust toxicity exposure, EVA suits with high metabolic demands, solar particle event risk without Earth magnetosphere.'
  },
  {
    id: 'mission-mars-conjunction',
    missionName: 'Mars Exploration Conjunction-Class Expedition (1000 Days)',
    missionType: 'MARS_CONJUNCTION',
    destination: 'Mars (Chryse Planitia Surface + Deep Space Transit)',
    durationDays: 1000,
    crewSize: 4,
    environment: {
      radiationFieldType: 'INTERPLANETARY_GCR_SPE',
      gravityField: 'MICROGRAVITY', // Transit is microgravity, surface is 0.38 G
      communicationLatencyMinutes: 14.5, // 3 to 22 minutes range
      evacuationTimeDays: 280, // No emergency abort return
      habitatVolumePerCrewM3: 35
    },
    activePhase: 'ASCENT_TRANSIT_OUTBOUND',
    isHypothetical: true,
    notes: 'Long-duration interplanetary mission. 6 months outbound transit, ~500 days on Martian surface (3/8 G), 6 months inbound transit. No abort, complete medical autonomy required.'
  },
  {
    id: 'mission-deep-space-gateway',
    missionName: 'Lunar Gateway Deep-Space Habitat Sortie',
    missionType: 'LUNAR_ORBIT',
    destination: 'Near-Rectilinear Halo Orbit (NRHO)',
    durationDays: 60,
    crewSize: 4,
    environment: {
      radiationFieldType: 'CISLUNAR_UNSHIELDED',
      gravityField: 'MICROGRAVITY',
      communicationLatencyMinutes: 0.022,
      evacuationTimeDays: 4.5,
      habitatVolumePerCrewM3: 22
    },
    activePhase: 'ORBITAL_STATION_OPS',
    isHypothetical: false,
    notes: 'Cislunar proving ground testing deep-space radiation shielding, autonomous environmental control systems, and crew autonomy beyond the Van Allen belts.'
  },
  {
    id: 'mission-deep-space-neo',
    missionName: 'Near-Earth Asteroid Flyby & Sample Sortie',
    missionType: 'DEEP_SPACE_NEO',
    destination: 'Interplanetary Asteroid 1999 AO10',
    durationDays: 360,
    crewSize: 3,
    environment: {
      radiationFieldType: 'INTERPLANETARY_GCR_SPE',
      gravityField: 'MICROGRAVITY',
      communicationLatencyMinutes: 5.2,
      evacuationTimeDays: 180,
      habitatVolumePerCrewM3: 30
    },
    activePhase: 'ASCENT_TRANSIT_OUTBOUND',
    isHypothetical: true,
    notes: 'Continuous microgravity and unattenuated interplanetary GCR radiation with high physical and psychological isolation.'
  }
];

export function evaluateMissionRiskRelevance(mission: MissionProfile, riskId: string): RiskRelevanceAssessment {
  const isMars = mission.missionType === 'MARS_CONJUNCTION' || mission.missionType === 'MARS_OPPOSITION';
  const isLunar = mission.missionType === 'LUNAR_ORBIT' || mission.missionType === 'LUNAR_SURFACE';
  const isLEO = mission.missionType === 'LEO';
  const isLongDuration = mission.durationDays >= 180;
  const isInterplanetary = mission.environment.radiationFieldType === 'INTERPLANETARY_GCR_SPE' || mission.environment.radiationFieldType === 'CISLUNAR_UNSHIELDED';

  switch (riskId) {
    case 'RAD': {
      let qualitativeRelevance: QualitativeRiskRelevance = 'MODERATE';
      if (isMars) qualitativeRelevance = 'CRITICAL';
      else if (isLunar || isInterplanetary) qualitativeRelevance = 'HIGH';
      else if (isLEO) qualitativeRelevance = 'MONITORED_CONTROLLED';

      return {
        riskCategoryId: 'RAD',
        qualitativeRelevance,
        primaryRationale: isMars 
          ? 'Deep-space transit and Martian surface lack geomagnetic shielding. Projected cumulative dose exceeds NASA career limit of 600 mSv without breakthrough transit speed or active shielding.'
          : isLunar 
          ? 'Cislunar environment exposes crew to unattenuated GCR background and acute SPE vulnerability requiring rapid shelter access.'
          : 'Low Earth Orbit geomagnetic cutoff attenuates ~60% of GCR; operational exposure primarily driven by South Atlantic Anomaly crossings.',
        environmentalDrivers: [
          mission.environment.radiationFieldType,
          `Mission duration: ${mission.durationDays} days`,
          'Absence of magnetic deflection field'
        ],
        recommendedMitigations: ['MIT-RAD-01', 'MIT-RAD-02', 'MIT-RAD-03'],
        keyResearchGaps: [
          'High-Z high-energy (HZE) ion biological effectiveness for late central nervous system effects',
          'Synergistic interaction of microgravity and continuous low-dose-rate space radiation'
        ],
        supportingEvidenceCodes: ['HRP-RAD-DOS-01', 'HRP-RAD-TWINS-02', 'HRP-RAD-STD-05'],
        criticalMissionConstraints: [
          'Vehicle storm shelter mass allocation limit',
          'Solar cycle timing (solar maximum lowers GCR but increases SPE frequency)'
        ],
        assumptions: [
          'Standard passive 20 g/cm² aluminum equivalent spacecraft hull shielding assumed.',
          'Assumes absence of major Solar Particle Event directly intercepting spacecraft during unshielded EVA.'
        ]
      };
    }

    case 'CARDIO': {
      let qualitativeRelevance: QualitativeRiskRelevance = 'MODERATE';
      if (isMars) qualitativeRelevance = 'CRITICAL';
      else if (isLunar && !isLongDuration) qualitativeRelevance = 'MODERATE';
      else if (isLongDuration) qualitativeRelevance = 'HIGH';

      return {
        riskCategoryId: 'CARDIO',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'After 6-9 months of zero-gravity deconditioning, crew must perform critical automated descent and unassisted surface egress in 0.38-G with severe orthostatic vulnerability.'
          : 'Microgravity cephalad fluid shift leads to plasma volume contraction, left ventricular mass remodeling, and post-flight orthostatic intolerance.',
        environmentalDrivers: [
          `Gravity state: ${mission.environment.gravityField}`,
          `Evacuation timeline: ${mission.environment.evacuationTimeDays} days`
        ],
        recommendedMitigations: ['MIT-CARDIO-01', 'MIT-CARDIO-02', 'MIT-CARDIO-03'],
        keyResearchGaps: [
          'Long-term venous stasis and jugular thrombosis prevention protocols',
          'Minimum effective dose of daily resistive/aerobic exercise in volume-constrained vehicles'
        ],
        supportingEvidenceCodes: ['HRP-CARDIO-HEMO-01', 'HRP-CARDIO-ORTHO-02', 'HRP-CARDIO-MYO-03'],
        criticalMissionConstraints: [
          'Daily exercise volume and power requirements aboard exploration vehicles',
          'Availability of fluid loading salts and active compression garments for landing'
        ],
        assumptions: [
          'Crew maintains at least 30 minutes daily aerobic cycle exercise compliance.',
          'No underlying subclinical cardiovascular pathology prior to launch.'
        ]
      };
    }

    case 'BONE': {
      let qualitativeRelevance: QualitativeRiskRelevance = isMars ? 'HIGH' : (isLongDuration ? 'HIGH' : 'LOW');
      return {
        riskCategoryId: 'BONE',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'Continuous mechanical skeletal unburdening over 1000 days causes trabecular microarchitectural deterioration and elevated nephrolithiasis risk during mission phases without ground hospital care.'
          : isLongDuration
          ? 'Progressive demineralization of weight-bearing bones (~1% per month in microgravity) with recovery requiring 12+ months post-flight.'
          : 'Short mission duration allows minimal cumulative skeletal loss within physiologic safety margins.',
        environmentalDrivers: [
          `Mission duration: ${mission.durationDays} days`,
          `Ambient gravity level: ${mission.environment.gravityField}`
        ],
        recommendedMitigations: ['MIT-BONE-01', 'MIT-BONE-02', 'MIT-MUSCLE-01'],
        keyResearchGaps: [
          'Threshold of partial gravity (0.16-G Moon vs 0.38-G Mars) required to preserve bone homeostasis without heavy exercise devices',
          'Trabecular structural connectivity restoration kinetics'
        ],
        supportingEvidenceCodes: ['HRP-BONE-ARED-01', 'HRP-BONE-PRACT-02', 'HRP-BONE-RODENT-03'],
        criticalMissionConstraints: [
          'Resistive exercise device mass and vibration isolation envelope',
          'Dietary calcium, vitamin D, and sodium balance monitoring'
        ],
        assumptions: [
          'Astronauts have access to high-load resistive equipment capable of generating ≥ 400 lbs axial load.',
          'Urine volume maintained above 2.0 L/day to mitigate renal stone precipitation.'
        ]
      };
    }

    case 'MUSCLE': {
      let qualitativeRelevance: QualitativeRiskRelevance = isMars ? 'CRITICAL' : (isLongDuration ? 'HIGH' : 'MODERATE');
      return {
        riskCategoryId: 'MUSCLE',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'Severe risk of impaired physical performance during immediate post-landing Martian EVAs. Muscle fiber-type shifts compromise endurance and power required for emergency hatch opening or manual terrain navigation.'
          : 'Postural antigravity calf and back muscles rapidly lose volume and force capacity without dedicated resistive training.',
        environmentalDrivers: [
          `Continuous microgravity duration: ${mission.durationDays} days`,
          `EVA frequency and suited workload requirements`
        ],
        recommendedMitigations: ['MIT-BONE-01', 'MIT-MUSCLE-01'],
        keyResearchGaps: [
          'Compact resistance mechanisms delivering adequate eccentric overload in volume-constrained capsules',
          'Biomarkers predicting individual rate of muscle protein proteolysis'
        ],
        supportingEvidenceCodes: ['HRP-MUSCLE-BIOPSY-01', 'HRP-MUSCLE-SARCO-02'],
        criticalMissionConstraints: [
          'Exercise countermeasure hardware uptime and reliability',
          'Nutritional caloric balance preventing net negative energy expenditure'
        ],
        assumptions: [
          'Astronauts achieve daily protein intake of ≥ 1.2 g/kg/day.',
          'Countermeasure exercise hardware is operational without extended down-time.'
        ]
      };
    }

    case 'IMMUNE': {
      let qualitativeRelevance: QualitativeRiskRelevance = isMars ? 'HIGH' : (isLongDuration ? 'MODERATE' : 'LOW');
      return {
        riskCategoryId: 'IMMUNE',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'Chronic closed-loop environmental recycling, synergistic radiation damage to bone marrow stem cells, and high psychosocial stress heighten vulnerability to opportunistic microbial infection and delayed wound healing without resupply.'
          : 'Subclinical latent herpesvirus reactivation occurs in > 60% of crew, managed conservatively in LEO but potentially hazardous during austere exploration.',
        environmentalDrivers: [
          'Closed spacecraft ecosystem / Environmental Control & Life Support System',
          `Distance from terrestrial medical support: ${mission.environment.evacuationTimeDays} days`
        ],
        recommendedMitigations: ['MIT-IMMUNE-01', 'MIT-RAD-03'],
        keyResearchGaps: [
          'Clinical significance of subclinical viral shedding on multi-year exploration flights',
          'Microbial virulence and biofilm resistance changes in spaceflight habitats'
        ],
        supportingEvidenceCodes: ['HRP-IMMUNE-SHED-01', 'HRP-IMMUNE-TCELL-02'],
        criticalMissionConstraints: [
          'Spacecraft HEPA air filtration and antimicrobial surface coatings',
          'Diagnostic capability for in-situ pathogen sequencing'
        ],
        assumptions: [
          'Pre-flight quarantine protocol effectively eliminates communicable respiratory/enteric pathogens before launch.',
          'Habitat water and surface microbial cleanliness standards are maintained.'
        ]
      };
    }

    case 'SLEEP': {
      let qualitativeRelevance: QualitativeRiskRelevance = isMars ? 'HIGH' : (isLunar ? 'HIGH' : 'MODERATE');
      return {
        riskCategoryId: 'SLEEP',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'Circadian desynchrony exacerbated by the 24h 39m Martian day (sol) requiring continuous phase shifts, combined with mission-critical autonomous night-time operations.'
          : isLunar
          ? 'Short-duration lunar operations impose severe work schedules, high task density, and disrupted sleep architectures.'
          : 'ISS orbital cycle (16 sunrises/sunsets daily) and ambient acoustic noise produce chronic sleep restriction averaging < 6 hours/night.',
        environmentalDrivers: [
          'Habitat acoustic levels and thermal regulation',
          'Operational task schedule and communication shifts'
        ],
        recommendedMitigations: ['MIT-SLEEP-01'],
        keyResearchGaps: [
          'Efficacy of dynamic spectral lighting during Martian sol entrainment',
          'Non-pharmacological countermeasures for acute sleep architecture fragmentation'
        ],
        supportingEvidenceCodes: ['HRP-SLEEP-ACTI-01'],
        criticalMissionConstraints: [
          'Crew sleep station acoustic isolation (< 50 dBA)',
          'Solid-state lighting spectrum programmability'
        ],
        assumptions: [
          'Crew is scheduled for at least 8.0 hours continuous sleep opportunity daily.',
          'Cognitive fatigue is monitored regularly via psychomotor vigilance testing.'
        ]
      };
    }

    case 'BEHAVIOR': {
      let qualitativeRelevance: QualitativeRiskRelevance = isMars ? 'CRITICAL' : (mission.crewSize <= 4 && isLongDuration ? 'HIGH' : 'MODERATE');
      return {
        riskCategoryId: 'BEHAVIOR',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'Deep-space communication latency (up to 22 minutes one-way) eliminates real-time conversation with Earth and flight surgeons. Complete isolation, loss of visual Earth contact, and confinement in cramped quarters over 3 years creates extreme psychological strain.'
          : 'Confinement in closed environments demands high interpersonal compatibility and autonomous conflict resolution.',
        environmentalDrivers: [
          `Communication latency: ${mission.environment.communicationLatencyMinutes} minutes`,
          `Habitable volume per crew: ${mission.environment.habitatVolumePerCrewM3} m³`,
          `No Earth visual contact for deep space`
        ],
        recommendedMitigations: ['MIT-BEHAVIOR-01'],
        keyResearchGaps: [
          'Autonomous psychosocial support tools capable of functioning without real-time Ground intervention',
          'Impact of Earth-out-of-view phenomenon on human existential coping'
        ],
        supportingEvidenceCodes: ['HRP-BEHAV-HERA-01'],
        criticalMissionConstraints: [
          'Crew psychological compatibility screening and training',
          'Habitable volume and private quarters allocations'
        ],
        assumptions: [
          'Autonomous conflict resolution protocols are integrated into pre-flight crew training.',
          'Crew members have private quarters with noise and visual isolation.'
        ]
      };
    }

    case 'SANS': {
      let qualitativeRelevance: QualitativeRiskRelevance = isMars ? 'CRITICAL' : (isLongDuration ? 'HIGH' : 'LOW');
      return {
        riskCategoryId: 'SANS',
        qualitativeRelevance,
        primaryRationale: isMars
          ? 'In long-duration spaceflight, SANS optic disc edema progresses monotonically over 6-12 months. On a 3-year Mars mission, cumulative unreversed cephalad pressure may induce irreversible optic nerve atrophy and severe permanent visual field loss.'
          : isLongDuration
          ? 'Affects ~70% of ISS crew to varying degrees; monitored with orbital OCT to prevent irreversible visual impairment.'
          : 'Short duration (< 30 days) insufficient for progressive optic disc edema and globe flattening to reach clinical impairment thresholds.',
        environmentalDrivers: [
          `Continuous microgravity duration: ${mission.durationDays} days`,
          'Cephalad fluid redistribution and intracranial pressure gradient shift'
        ],
        recommendedMitigations: ['MIT-SANS-01', 'MIT-SANS-02'],
        keyResearchGaps: [
          'Long-term efficacy and crew tolerance of daily lower body negative pressure (LBNP) suits',
          'Validation of non-invasive intracranial pressure monitoring in microgravity'
        ],
        supportingEvidenceCodes: ['HRP-SANS-OCT-01', 'HRP-SANS-GENE-02', 'HRP-SANS-LBNP-03'],
        criticalMissionConstraints: [
          'Availability of in-flight Optical Coherence Tomography (OCT) diagnostics',
          'Power and ergonomic footprint for daily LBNP sessions'
        ],
        assumptions: [
          'Astronauts undergo pre-flight genetic and anatomical ophthalmic baseline screening.',
          'Cabin carbon dioxide is maintained strictly below 2.0 mmHg to avoid exacerbating cerebral edema.'
        ]
      };
    }

    default:
      return {
        riskCategoryId: riskId,
        qualitativeRelevance: 'MODERATE',
        primaryRationale: 'General human-spaceflight physiological stressor requiring standard monitoring.',
        environmentalDrivers: ['Microgravity', 'Closed environment'],
        recommendedMitigations: [],
        keyResearchGaps: [],
        supportingEvidenceCodes: [],
        criticalMissionConstraints: [],
        assumptions: ['Standard spaceflight environmental baselines apply.']
      };
  }
}
