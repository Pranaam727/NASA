import { AstronautHealthPayload, MissionContext } from '../types';

export const DEFAULT_ASTRONAUT_PROFILES: {
  astronaut: AstronautHealthPayload;
  missionContext: MissionContext;
}[] = [
  {
    astronaut: {
      astronautId: 'AST-084-SC',
      astronautName: 'Cmdr. Sarah Chen',
      callsign: 'Valkyrie-1',
      age: 42,
      sex: 'female',
      role: 'ISS Commander & Lead Biomedical Scientist',
      dataOrigin: 'synthetic-telemetry',
      timestamp: '2026-11-14T12:00:00Z',
      domains: {
        cardiovascular: {
          domain: 'cardiovascular',
          displayName: 'Cardiovascular & Hemodynamics',
          overallStatus: 'nominal-shift',
          keyObservation: 'Mild cephalad fluid shift with increased jugular venous distension; resting heart rate stable but HRV rMSSD depressed by 18% vs baseline.',
          metrics: [
            {
              id: 'cv-hr-rest',
              name: 'Resting Heart Rate',
              domain: 'cardiovascular',
              value: 68,
              unit: 'bpm',
              baseline: 60,
              nominalRange: [50, 80],
              status: 'normal',
              trend: 'stable',
              description: 'Resting morning pulse captured during sedentary cabin shift.',
              lastUpdated: '10 min ago'
            },
            {
              id: 'cv-bp-sys',
              name: 'Systolic Blood Pressure',
              domain: 'cardiovascular',
              value: 128,
              unit: 'mmHg',
              baseline: 114,
              nominalRange: [100, 130],
              status: 'nominal-shift',
              trend: 'increasing',
              description: 'Mild elevation correlating with cephalad fluid redistribution and cabin CO2 levels.',
              lastUpdated: '10 min ago'
            },
            {
              id: 'cv-bp-dia',
              name: 'Diastolic Blood Pressure',
              domain: 'cardiovascular',
              value: 84,
              unit: 'mmHg',
              baseline: 72,
              nominalRange: [65, 85],
              status: 'normal',
              trend: 'stable',
              description: 'Diastolic systemic vascular resistance within operational margins.',
              lastUpdated: '10 min ago'
            },
            {
              id: 'cv-hrv-rmssd',
              name: 'HRV (rMSSD)',
              domain: 'cardiovascular',
              value: 38,
              unit: 'ms',
              baseline: 54,
              nominalRange: [40, 75],
              status: 'warning',
              trend: 'decreasing',
              description: 'Vagal tone reduction indicating cumulative physiological autonomic stress.',
              lastUpdated: '35 min ago'
            },
            {
              id: 'cv-stroke-vol',
              name: 'Stroke Volume Index',
              domain: 'cardiovascular',
              value: 41,
              unit: 'mL/m²',
              baseline: 47,
              nominalRange: [38, 55],
              status: 'normal',
              trend: 'decreasing',
              description: 'Gradual microgravity hypovolemia adaptation.',
              lastUpdated: '2 hours ago'
            }
          ]
        },
        musculoskeletal: {
          domain: 'musculoskeletal',
          displayName: 'Bone & Musculoskeletal',
          overallStatus: 'nominal-shift',
          keyObservation: 'Trochanter bone turnover marker (NTX) moderately elevated (+38%); ARED compliance at 94% has successfully protected lumbar spine bone density.',
          metrics: [
            {
              id: 'ms-bmd-femur',
              name: 'Femoral Neck BMD Delta',
              domain: 'musculoskeletal',
              value: -2.8,
              unit: '%',
              baseline: 0.0,
              nominalRange: [-4.0, 1.0],
              status: 'nominal-shift',
              trend: 'decreasing',
              description: 'Monthly degradation rate is 0.6% (lower than historic 1.2% average due to ARED).',
              lastUpdated: '3 days ago'
            },
            {
              id: 'ms-serum-ntx',
              name: 'Serum NTX (Bone Resorption)',
              domain: 'musculoskeletal',
              value: 24.2,
              unit: 'nM BCE',
              baseline: 15.0,
              nominalRange: [10.0, 22.0],
              status: 'warning',
              trend: 'increasing',
              description: 'Osteoclast collagen breakdown products elevated in circulation.',
              lastUpdated: 'Yesterday'
            },
            {
              id: 'ms-calf-csa',
              name: 'Calf Muscle Cross-Section Area',
              domain: 'musculoskeletal',
              value: -4.1,
              unit: '%',
              baseline: 0.0,
              nominalRange: [-7.0, 2.0],
              status: 'normal',
              trend: 'decreasing',
              description: 'Soleus and gastrocnemius volume maintained well by eccentric loading.',
              lastUpdated: '5 days ago'
            },
            {
              id: 'ms-grip-strength',
              name: 'Isometric Grip Strength',
              domain: 'musculoskeletal',
              value: 42,
              unit: 'kg',
              baseline: 44,
              nominalRange: [38, 52],
              status: 'normal',
              trend: 'stable',
              description: 'Upper body isometric capacity fully preserved.',
              lastUpdated: 'Yesterday'
            }
          ]
        },
        radiation: {
          domain: 'radiation',
          displayName: 'Radiation Dosimetry',
          overallStatus: 'normal',
          keyObservation: 'Cumulative mission dose at 72.4 mSv over 142 flight days; well within NASA Career LEO Permissible Exposure Limits (PEL).',
          metrics: [
            {
              id: 'rad-cum-dose',
              name: 'Cumulative Absorbed Dose',
              domain: 'radiation',
              value: 72.4,
              unit: 'mSv',
              baseline: 0.0,
              nominalRange: [0, 150],
              status: 'normal',
              trend: 'increasing',
              description: 'Measured via Crew Personal Active Dosimeter (CPAD).',
              lastUpdated: 'Live telemetry'
            },
            {
              id: 'rad-daily-rate',
              name: 'Daily Dose Rate (LEO Ambient)',
              domain: 'radiation',
              value: 0.48,
              unit: 'mSv/day',
              baseline: 0.01,
              nominalRange: [0.3, 0.8],
              status: 'normal',
              trend: 'stable',
              description: 'Standard orbital background passing through South Atlantic Anomaly (SAA).',
              lastUpdated: 'Live telemetry'
            },
            {
              id: 'rad-spe-alert',
              name: 'Solar Particle Event Flux',
              domain: 'radiation',
              value: 1.2,
              unit: 'pfu',
              baseline: 0.8,
              nominalRange: [0, 10],
              status: 'normal',
              trend: 'stable',
              description: 'Quiet solar weather; no active coronal mass ejection threats.',
              lastUpdated: '15 min ago'
            }
          ]
        },
        sleep: {
          domain: 'sleep',
          displayName: 'Sleep & Circadian Architecture',
          overallStatus: 'warning',
          keyObservation: 'Chronic sleep debt: 4-day rolling average sleep duration 5.4 hrs/night; deep slow-wave sleep diminished by 26% following visiting vehicle docking.',
          metrics: [
            {
              id: 'sl-duration',
              name: 'Total Sleep Duration',
              domain: 'sleep',
              value: 5.4,
              unit: 'hours',
              baseline: 7.5,
              nominalRange: [6.5, 8.5],
              status: 'warning',
              trend: 'decreasing',
              description: 'Wrist actigraphy recording over last 24-hour cycle.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-rem-percent',
              name: 'REM Sleep Proportion',
              domain: 'sleep',
              value: 19.5,
              unit: '%',
              baseline: 23.0,
              nominalRange: [20.0, 26.0],
              status: 'nominal-shift',
              trend: 'fluctuating',
              description: 'Mild deficit in rapid eye movement cognitive consolidation.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-deep-percent',
              name: 'Deep Slow-Wave Sleep (N3)',
              domain: 'sleep',
              value: 11.2,
              unit: '%',
              baseline: 18.0,
              nominalRange: [15.0, 22.0],
              status: 'warning',
              trend: 'decreasing',
              description: 'Physiological restorative sleep suppressed by cabin acoustic noise and circadian shift.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-awakenings',
              name: 'Awakenings / Disruptions',
              domain: 'sleep',
              value: 6,
              unit: 'events',
              baseline: 2,
              nominalRange: [1, 4],
              status: 'warning',
              trend: 'increasing',
              description: 'Micro-arousals logged during sleep period.',
              lastUpdated: 'Morning sync'
            }
          ]
        },
        immune: {
          domain: 'immune',
          displayName: 'Immune System & Biomarkers',
          overallStatus: 'nominal-shift',
          keyObservation: 'Subclinical immune activation: Salivary EBV DNA copies slightly elevated (+1.8 log); IL-6 elevated at 4.2 pg/mL; no overt infection symptoms.',
          metrics: [
            {
              id: 'im-il6',
              name: 'Interleukin-6 (IL-6)',
              domain: 'immune',
              value: 4.2,
              unit: 'pg/mL',
              baseline: 1.8,
              nominalRange: [1.0, 3.5],
              status: 'warning',
              trend: 'increasing',
              description: 'Systemic inflammatory cytokine marker.',
              lastUpdated: 'Yesterday lab run'
            },
            {
              id: 'im-cortisol',
              name: 'Salivary Cortisol (Awakening)',
              domain: 'immune',
              value: 18.4,
              unit: 'nmol/L',
              baseline: 14.2,
              nominalRange: [10.0, 22.0],
              status: 'normal',
              trend: 'fluctuating',
              description: 'Endocrine stress response within acceptable bounds.',
              lastUpdated: 'Morning lab run'
            },
            {
              id: 'im-ebv-shed',
              name: 'Salivary EBV Reactivation Index',
              domain: 'immune',
              value: 2.1,
              unit: 'log copies',
              baseline: 0.2,
              nominalRange: [0.0, 1.0],
              status: 'warning',
              trend: 'increasing',
              description: 'Latent herpesvirus shedding triggered by sleep debt and mission workload.',
              lastUpdated: '3 days ago'
            },
            {
              id: 'im-wbc',
              name: 'White Blood Cell Count',
              domain: 'immune',
              value: 6.8,
              unit: 'x10³/µL',
              baseline: 6.2,
              nominalRange: [4.5, 10.0],
              status: 'normal',
              trend: 'stable',
              description: 'Total leukocyte count remains normal without granulocytosis.',
              lastUpdated: 'Yesterday lab run'
            }
          ]
        }
      }
    },
    missionContext: {
      missionId: 'EXP-72-ISS',
      missionName: 'ISS Expedition 72 Long-Duration Science',
      targetDestination: 'ISS Low Earth Orbit',
      currentPhase: 'long-duration-orbital',
      flightDay: 142,
      totalPlannedDays: 180,
      evaCount: 3,
      lastEvaFlightDay: 128,
      environmental: {
        cabinCo2Ppm: 3200, // ~2.4 mmHg
        cabinPressureKpa: 101.3,
        gcrDosimetryRateMicroSvPerDay: 480,
        ambientTemperatureC: 21.8,
        dailyExerciseCompletedHours: 2.2,
        exerciseCompliancePercentage: 94
      }
    }
  },
  {
    astronaut: {
      astronautId: 'AST-102-MV',
      astronautName: 'Dr. Marcus Vance',
      callsign: 'Apex-2',
      age: 48,
      sex: 'male',
      role: 'Flight Surgeon & Lunar Habitat Specialist',
      dataOrigin: 'synthetic-telemetry',
      timestamp: '2026-11-14T12:00:00Z',
      domains: {
        cardiovascular: {
          domain: 'cardiovascular',
          displayName: 'Cardiovascular & Hemodynamics',
          overallStatus: 'warning',
          keyObservation: 'Marked resting tachycardia (HR 82 bpm) and blood pressure elevation (138/88 mmHg); SANS screening shows grade 1 optic disc hyper-reflectivity.',
          metrics: [
            {
              id: 'cv-hr-rest',
              name: 'Resting Heart Rate',
              domain: 'cardiovascular',
              value: 82,
              unit: 'bpm',
              baseline: 62,
              nominalRange: [50, 80],
              status: 'warning',
              trend: 'increasing',
              description: 'Elevated sympathetic tone during deep space transit.',
              lastUpdated: '15 min ago'
            },
            {
              id: 'cv-bp-sys',
              name: 'Systolic Blood Pressure',
              domain: 'cardiovascular',
              value: 138,
              unit: 'mmHg',
              baseline: 118,
              nominalRange: [100, 130],
              status: 'warning',
              trend: 'increasing',
              description: 'Stage 1 hypertensive reading under elevated ambient CO2.',
              lastUpdated: '15 min ago'
            },
            {
              id: 'cv-bp-dia',
              name: 'Diastolic Blood Pressure',
              domain: 'cardiovascular',
              value: 88,
              unit: 'mmHg',
              baseline: 76,
              nominalRange: [65, 85],
              status: 'warning',
              trend: 'increasing',
              description: 'Elevated peripheral resistance.',
              lastUpdated: '15 min ago'
            },
            {
              id: 'cv-hrv-rmssd',
              name: 'HRV (rMSSD)',
              domain: 'cardiovascular',
              value: 29,
              unit: 'ms',
              baseline: 48,
              nominalRange: [40, 75],
              status: 'critical',
              trend: 'decreasing',
              description: 'Severe parasympathetic withdrawal.',
              lastUpdated: '30 min ago'
            },
            {
              id: 'cv-stroke-vol',
              name: 'Stroke Volume Index',
              domain: 'cardiovascular',
              value: 36,
              unit: 'mL/m²',
              baseline: 45,
              nominalRange: [38, 55],
              status: 'warning',
              trend: 'decreasing',
              description: 'Progressive hypovolemia.',
              lastUpdated: '3 hours ago'
            }
          ]
        },
        musculoskeletal: {
          domain: 'musculoskeletal',
          displayName: 'Bone & Musculoskeletal',
          overallStatus: 'normal',
          keyObservation: 'High countermeasure compliance (98%); bone turnover within expected post-insertion range.',
          metrics: [
            {
              id: 'ms-bmd-femur',
              name: 'Femoral Neck BMD Delta',
              domain: 'musculoskeletal',
              value: -0.9,
              unit: '%',
              baseline: 0.0,
              nominalRange: [-4.0, 1.0],
              status: 'normal',
              trend: 'stable',
              description: 'Flight day 38 shows minimal microstructural loss.',
              lastUpdated: '4 days ago'
            },
            {
              id: 'ms-serum-ntx',
              name: 'Serum NTX (Bone Resorption)',
              domain: 'musculoskeletal',
              value: 18.5,
              unit: 'nM BCE',
              baseline: 14.0,
              nominalRange: [10.0, 22.0],
              status: 'normal',
              trend: 'increasing',
              description: 'Expected early adaptive osteoclastic rise.',
              lastUpdated: '2 days ago'
            },
            {
              id: 'ms-calf-csa',
              name: 'Calf Muscle Cross-Section Area',
              domain: 'musculoskeletal',
              value: -1.2,
              unit: '%',
              baseline: 0.0,
              nominalRange: [-7.0, 2.0],
              status: 'normal',
              trend: 'stable',
              description: 'Full adherence to flywheel ergometer loads.',
              lastUpdated: '5 days ago'
            },
            {
              id: 'ms-grip-strength',
              name: 'Isometric Grip Strength',
              domain: 'musculoskeletal',
              value: 46,
              unit: 'kg',
              baseline: 47,
              nominalRange: [38, 52],
              status: 'normal',
              trend: 'stable',
              description: 'Baseline grip preserved.',
              lastUpdated: 'Yesterday'
            }
          ]
        },
        radiation: {
          domain: 'radiation',
          displayName: 'Radiation Dosimetry',
          overallStatus: 'warning',
          keyObservation: 'Deep space transit dose rate 1.45 mSv/day (3x higher than LEO); dosimeter logged 55.1 mSv in 38 days due to unshielded GCR flux beyond Van Allen belts.',
          metrics: [
            {
              id: 'rad-cum-dose',
              name: 'Cumulative Absorbed Dose',
              domain: 'radiation',
              value: 55.1,
              unit: 'mSv',
              baseline: 0.0,
              nominalRange: [0, 150],
              status: 'warning',
              trend: 'increasing',
              description: 'Higher trajectory accumulation rate outside Earth magnetosphere.',
              lastUpdated: 'Live telemetry'
            },
            {
              id: 'rad-daily-rate',
              name: 'Daily Dose Rate (Deep Space GCR)',
              domain: 'radiation',
              value: 1.45,
              unit: 'mSv/day',
              baseline: 0.01,
              nominalRange: [0.3, 1.2],
              status: 'warning',
              trend: 'stable',
              description: 'Persistent galactic cosmic ray background.',
              lastUpdated: 'Live telemetry'
            },
            {
              id: 'rad-spe-alert',
              name: 'Solar Particle Event Flux',
              domain: 'radiation',
              value: 3.4,
              unit: 'pfu',
              baseline: 0.8,
              nominalRange: [0, 10],
              status: 'normal',
              trend: 'fluctuating',
              description: 'Sub-threshold solar wind flux, active shielding nominal.',
              lastUpdated: '10 min ago'
            }
          ]
        },
        sleep: {
          domain: 'sleep',
          displayName: 'Sleep & Circadian Architecture',
          overallStatus: 'warning',
          keyObservation: 'Severe slow wave sleep fragmentation: total sleep 5.1 hrs; 8 logged micro-awakenings per cycle.',
          metrics: [
            {
              id: 'sl-duration',
              name: 'Total Sleep Duration',
              domain: 'sleep',
              value: 5.1,
              unit: 'hours',
              baseline: 7.2,
              nominalRange: [6.5, 8.5],
              status: 'warning',
              trend: 'decreasing',
              description: 'Actigraphy indicates chronic sleep truncation.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-rem-percent',
              name: 'REM Sleep Proportion',
              domain: 'sleep',
              value: 17.8,
              unit: '%',
              baseline: 22.0,
              nominalRange: [20.0, 26.0],
              status: 'warning',
              trend: 'decreasing',
              description: 'Suppressed REM sleep.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-deep-percent',
              name: 'Deep Slow-Wave Sleep (N3)',
              domain: 'sleep',
              value: 9.8,
              unit: '%',
              baseline: 17.5,
              nominalRange: [15.0, 22.0],
              status: 'critical',
              trend: 'decreasing',
              description: 'Profound deep restorative sleep loss.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-awakenings',
              name: 'Awakenings / Disruptions',
              domain: 'sleep',
              value: 8,
              unit: 'events',
              baseline: 2,
              nominalRange: [1, 4],
              status: 'warning',
              trend: 'increasing',
              description: 'Elevated due to vehicle ventilation harmonics.',
              lastUpdated: 'Morning sync'
            }
          ]
        },
        immune: {
          domain: 'immune',
          displayName: 'Immune System & Biomarkers',
          overallStatus: 'nominal-shift',
          keyObservation: 'Serum cortisol elevated (25.1 nmol/L); salivary EBV shedding at 1.4 log copies.',
          metrics: [
            {
              id: 'im-il6',
              name: 'Interleukin-6 (IL-6)',
              domain: 'immune',
              value: 3.1,
              unit: 'pg/mL',
              baseline: 1.5,
              nominalRange: [1.0, 3.5],
              status: 'normal',
              trend: 'increasing',
              description: 'Mild systemic inflammation.',
              lastUpdated: 'Yesterday'
            },
            {
              id: 'im-cortisol',
              name: 'Salivary Cortisol (Awakening)',
              domain: 'immune',
              value: 25.1,
              unit: 'nmol/L',
              baseline: 15.0,
              nominalRange: [10.0, 22.0],
              status: 'warning',
              trend: 'increasing',
              description: 'Hyper-cortisolemia driven by high transit operational stress.',
              lastUpdated: 'Morning'
            },
            {
              id: 'im-ebv-shed',
              name: 'Salivary EBV Reactivation Index',
              domain: 'immune',
              value: 1.4,
              unit: 'log copies',
              baseline: 0.1,
              nominalRange: [0.0, 1.0],
              status: 'warning',
              trend: 'increasing',
              description: 'Moderate viral reactivation signature.',
              lastUpdated: '2 days ago'
            },
            {
              id: 'im-wbc',
              name: 'White Blood Cell Count',
              domain: 'immune',
              value: 7.4,
              unit: 'x10³/µL',
              baseline: 6.0,
              nominalRange: [4.5, 10.0],
              status: 'normal',
              trend: 'stable',
              description: 'Normal leukocyte profile.',
              lastUpdated: 'Yesterday'
            }
          ]
        }
      }
    },
    missionContext: {
      missionId: 'ARTEMIS-GW-2',
      missionName: 'Artemis Gateway Transit & Habitat Deployment',
      targetDestination: 'Lunar Gateway',
      currentPhase: 'lunar-transit',
      flightDay: 38,
      totalPlannedDays: 90,
      evaCount: 1,
      lastEvaFlightDay: 30,
      environmental: {
        cabinCo2Ppm: 4100, // ~3.1 mmHg, elevated
        cabinPressureKpa: 98.5,
        gcrDosimetryRateMicroSvPerDay: 1450,
        ambientTemperatureC: 22.4,
        dailyExerciseCompletedHours: 2.5,
        exerciseCompliancePercentage: 98
      }
    }
  },
  {
    astronaut: {
      astronautId: 'AST-119-AR',
      astronautName: 'Lt. Alex Rivera',
      callsign: 'Pioneer-3',
      age: 36,
      sex: 'male',
      role: 'EVA Specialist & Systems Flight Engineer',
      dataOrigin: 'synthetic-telemetry',
      timestamp: '2026-11-14T12:00:00Z',
      domains: {
        cardiovascular: {
          domain: 'cardiovascular',
          displayName: 'Cardiovascular & Hemodynamics',
          overallStatus: 'normal',
          keyObservation: 'Robust autonomic cardiovascular profile; VO2 max maintained at 95% of pre-flight baseline through rigorous cycle intervals.',
          metrics: [
            {
              id: 'cv-hr-rest',
              name: 'Resting Heart Rate',
              domain: 'cardiovascular',
              value: 54,
              unit: 'bpm',
              baseline: 52,
              nominalRange: [50, 80],
              status: 'normal',
              trend: 'stable',
              description: 'Athletic baseline maintained.',
              lastUpdated: '10 min ago'
            },
            {
              id: 'cv-bp-sys',
              name: 'Systolic Blood Pressure',
              domain: 'cardiovascular',
              value: 116,
              unit: 'mmHg',
              baseline: 112,
              nominalRange: [100, 130],
              status: 'normal',
              trend: 'stable',
              description: 'Optimal arterial pressure.',
              lastUpdated: '10 min ago'
            },
            {
              id: 'cv-bp-dia',
              name: 'Diastolic Blood Pressure',
              domain: 'cardiovascular',
              value: 74,
              unit: 'mmHg',
              baseline: 70,
              nominalRange: [65, 85],
              status: 'normal',
              trend: 'stable',
              description: 'Nominal diastolic pressure.',
              lastUpdated: '10 min ago'
            },
            {
              id: 'cv-hrv-rmssd',
              name: 'HRV (rMSSD)',
              domain: 'cardiovascular',
              value: 58,
              unit: 'ms',
              baseline: 62,
              nominalRange: [40, 75],
              status: 'normal',
              trend: 'stable',
              description: 'High vagal autonomic reserve.',
              lastUpdated: '25 min ago'
            },
            {
              id: 'cv-stroke-vol',
              name: 'Stroke Volume Index',
              domain: 'cardiovascular',
              value: 46,
              unit: 'mL/m²',
              baseline: 49,
              nominalRange: [38, 55],
              status: 'normal',
              trend: 'stable',
              description: 'Cardiac stroke volume stable.',
              lastUpdated: '1 hour ago'
            }
          ]
        },
        musculoskeletal: {
          domain: 'musculoskeletal',
          displayName: 'Bone & Musculoskeletal',
          overallStatus: 'normal',
          keyObservation: 'Exceptional musculoskeletal preservation; bone turnover delta minimal; localized shoulder muscular fatigue noted following 7-hour EVA.',
          metrics: [
            {
              id: 'ms-bmd-femur',
              name: 'Femoral Neck BMD Delta',
              domain: 'musculoskeletal',
              value: -1.4,
              unit: '%',
              baseline: 0.0,
              nominalRange: [-4.0, 1.0],
              status: 'normal',
              trend: 'stable',
              description: 'Flight day 210 with minimal demineralization.',
              lastUpdated: '10 days ago'
            },
            {
              id: 'ms-serum-ntx',
              name: 'Serum NTX (Bone Resorption)',
              domain: 'musculoskeletal',
              value: 16.2,
              unit: 'nM BCE',
              baseline: 13.5,
              nominalRange: [10.0, 22.0],
              status: 'normal',
              trend: 'stable',
              description: 'Stable bone turnover balance.',
              lastUpdated: '4 days ago'
            },
            {
              id: 'ms-calf-csa',
              name: 'Calf Muscle Cross-Section Area',
              domain: 'musculoskeletal',
              value: -2.1,
              unit: '%',
              baseline: 0.0,
              nominalRange: [-7.0, 2.0],
              status: 'normal',
              trend: 'stable',
              description: 'High compliance prevents soleus atrophy.',
              lastUpdated: '7 days ago'
            },
            {
              id: 'ms-grip-strength',
              name: 'Isometric Grip Strength',
              domain: 'musculoskeletal',
              value: 51,
              unit: 'kg',
              baseline: 52,
              nominalRange: [38, 52],
              status: 'normal',
              trend: 'stable',
              description: 'Grip strength intact.',
              lastUpdated: 'Yesterday'
            }
          ]
        },
        radiation: {
          domain: 'radiation',
          displayName: 'Radiation Dosimetry',
          overallStatus: 'nominal-shift',
          keyObservation: 'Cumulative dose 118.2 mSv over 210 days; 4 completed spacewalks (EVAs) contributed 14.5 mSv additional external dose.',
          metrics: [
            {
              id: 'rad-cum-dose',
              name: 'Cumulative Absorbed Dose',
              domain: 'radiation',
              value: 118.2,
              unit: 'mSv',
              baseline: 0.0,
              nominalRange: [0, 150],
              status: 'nominal-shift',
              trend: 'increasing',
              description: 'Nearing 80% of 1-year mission guideline limit (150 mSv).',
              lastUpdated: 'Live telemetry'
            },
            {
              id: 'rad-daily-rate',
              name: 'Daily Dose Rate (LEO Ambient)',
              domain: 'radiation',
              value: 0.52,
              unit: 'mSv/day',
              baseline: 0.01,
              nominalRange: [0.3, 0.8],
              status: 'normal',
              trend: 'stable',
              description: 'Ambient rate nominal inside habitat.',
              lastUpdated: 'Live telemetry'
            },
            {
              id: 'rad-spe-alert',
              name: 'Solar Particle Event Flux',
              domain: 'radiation',
              value: 1.0,
              unit: 'pfu',
              baseline: 0.8,
              nominalRange: [0, 10],
              status: 'normal',
              trend: 'stable',
              description: 'No active coronal threats.',
              lastUpdated: '20 min ago'
            }
          ]
        },
        sleep: {
          domain: 'sleep',
          displayName: 'Sleep & Circadian Architecture',
          overallStatus: 'normal',
          keyObservation: 'Good sleep hygiene: averages 6.8 hrs/night with consistent 22% REM and 16.5% deep sleep.',
          metrics: [
            {
              id: 'sl-duration',
              name: 'Total Sleep Duration',
              domain: 'sleep',
              value: 6.8,
              unit: 'hours',
              baseline: 7.4,
              nominalRange: [6.5, 8.5],
              status: 'normal',
              trend: 'stable',
              description: 'Stable sleep duration.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-rem-percent',
              name: 'REM Sleep Proportion',
              domain: 'sleep',
              value: 22.1,
              unit: '%',
              baseline: 23.5,
              nominalRange: [20.0, 26.0],
              status: 'normal',
              trend: 'stable',
              description: 'Normal REM proportion.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-deep-percent',
              name: 'Deep Slow-Wave Sleep (N3)',
              domain: 'sleep',
              value: 16.5,
              unit: '%',
              baseline: 18.0,
              nominalRange: [15.0, 22.0],
              status: 'normal',
              trend: 'stable',
              description: 'Effective physical recovery.',
              lastUpdated: 'Morning sync'
            },
            {
              id: 'sl-awakenings',
              name: 'Awakenings / Disruptions',
              domain: 'sleep',
              value: 3,
              unit: 'events',
              baseline: 2,
              nominalRange: [1, 4],
              status: 'normal',
              trend: 'stable',
              description: 'Low fragmentation.',
              lastUpdated: 'Morning sync'
            }
          ]
        },
        immune: {
          domain: 'immune',
          displayName: 'Immune System & Biomarkers',
          overallStatus: 'normal',
          keyObservation: 'All inflammatory markers and viral shedding within baseline limits.',
          metrics: [
            {
              id: 'im-il6',
              name: 'Interleukin-6 (IL-6)',
              domain: 'immune',
              value: 2.2,
              unit: 'pg/mL',
              baseline: 1.9,
              nominalRange: [1.0, 3.5],
              status: 'normal',
              trend: 'stable',
              description: 'Low inflammatory status.',
              lastUpdated: '2 days ago'
            },
            {
              id: 'im-cortisol',
              name: 'Salivary Cortisol (Awakening)',
              domain: 'immune',
              value: 15.3,
              unit: 'nmol/L',
              baseline: 14.8,
              nominalRange: [10.0, 22.0],
              status: 'normal',
              trend: 'stable',
              description: 'Nominal circadian cortisol response.',
              lastUpdated: 'Morning'
            },
            {
              id: 'im-ebv-shed',
              name: 'Salivary EBV Reactivation Index',
              domain: 'immune',
              value: 0.3,
              unit: 'log copies',
              baseline: 0.1,
              nominalRange: [0.0, 1.0],
              status: 'normal',
              trend: 'stable',
              description: 'Minimal latent reactivation.',
              lastUpdated: '4 days ago'
            },
            {
              id: 'im-wbc',
              name: 'White Blood Cell Count',
              domain: 'immune',
              value: 6.1,
              unit: 'x10³/µL',
              baseline: 5.9,
              nominalRange: [4.5, 10.0],
              status: 'normal',
              trend: 'stable',
              description: 'Normal circulating leukocytes.',
              lastUpdated: '2 days ago'
            }
          ]
        }
      }
    },
    missionContext: {
      missionId: 'SIM-MARS-210',
      missionName: 'Long-Duration Analog & High-EVA Operational Verification',
      targetDestination: 'Mars Transit',
      currentPhase: 'deep-space-transit',
      flightDay: 210,
      totalPlannedDays: 365,
      evaCount: 4,
      lastEvaFlightDay: 195,
      environmental: {
        cabinCo2Ppm: 2800, // ~2.1 mmHg
        cabinPressureKpa: 101.3,
        gcrDosimetryRateMicroSvPerDay: 520,
        ambientTemperatureC: 21.0,
        dailyExerciseCompletedHours: 2.6,
        exerciseCompliancePercentage: 96
      }
    }
  }
];
