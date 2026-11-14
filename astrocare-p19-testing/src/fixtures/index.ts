/**
 * AstroCare Quality Assurance Fixtures Library
 * All records are synthetic for verification and testing purposes.
 * Does not contain real NASA astronaut medical records or personal PII.
 */

import { TelemetryRecord } from '../types/biomedical';
import { RadiationExposureRecord } from '../types/calculations';
import { AstroCareModuleManifest } from '../types/modules';

export const SYNTHETIC_ASTRONAUTS = [
  {
    astronautId: 'ASTRO-CDR-01',
    name: 'Cmdr. Elena Vance (Synthetic)',
    callsign: 'Aegis',
    missionId: 'MISSION-ARTEMIS-III',
    role: 'Mission Commander',
    assignedVessel: 'Orion MPCV / Starship HLS',
    baselineRestingHeartRate: 58,
    baselineBloodPressure: '112/74',
    bloodType: 'O-POS',
  },
  {
    astronautId: 'ASTRO-PLT-02',
    name: 'Lt. Marcus Sterling (Synthetic)',
    callsign: 'Kestrel',
    missionId: 'MISSION-ARTEMIS-III',
    role: 'Command Module Pilot',
    assignedVessel: 'Lunar Gateway Station',
    baselineRestingHeartRate: 64,
    baselineBloodPressure: '118/76',
    bloodType: 'A-POS',
  },
  {
    astronautId: 'ASTRO-SCI-03',
    name: 'Dr. Sarah Lin (Synthetic)',
    callsign: 'Nova',
    missionId: 'ISS-EXPEDITION-71',
    role: 'Science Officer & Flight Engineer',
    assignedVessel: 'ISS Harmony Node',
    baselineRestingHeartRate: 62,
    baselineBloodPressure: '110/72',
    bloodType: 'B-POS',
  },
];

export const SYNTHETIC_TELEMETRY_SERIES: TelemetryRecord[] = [
  // Nominal sequence for ASTRO-CDR-01
  {
    recordId: 'REC-HR-001',
    astronautId: 'ASTRO-CDR-01',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T08:00:00.000Z',
    metricType: 'heart_rate',
    value: 62,
    unit: 'bpm',
    sourceDevice: 'BioVest-ECG-01',
  },
  {
    recordId: 'REC-HR-002',
    astronautId: 'ASTRO-CDR-01',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T08:01:00.000Z',
    metricType: 'heart_rate',
    value: 64,
    unit: 'bpm',
    sourceDevice: 'BioVest-ECG-01',
  },
  // SpO2 Nominal
  {
    recordId: 'REC-SPO2-001',
    astronautId: 'ASTRO-CDR-01',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T08:01:00.000Z',
    metricType: 'oxygen_saturation',
    value: 98,
    unit: '%',
    sourceDevice: 'PulseOximeter-02',
  },
  // Blood pressure nominal
  {
    recordId: 'REC-BPS-001',
    astronautId: 'ASTRO-CDR-01',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T08:00:00.000Z',
    metricType: 'blood_pressure_systolic',
    value: 115,
    unit: 'mmHg',
    sourceDevice: 'ArterialCuff-01',
  },
  {
    recordId: 'REC-BPD-001',
    astronautId: 'ASTRO-CDR-01',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T08:00:00.000Z',
    metricType: 'blood_pressure_diastolic',
    value: 75,
    unit: 'mmHg',
    sourceDevice: 'ArterialCuff-01',
  },
  // Temperature
  {
    recordId: 'REC-TEMP-001',
    astronautId: 'ASTRO-CDR-01',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T08:00:00.000Z',
    metricType: 'body_temperature',
    value: 36.8,
    unit: 'degC',
    sourceDevice: 'TympanicCore-01',
  },
];

export const SYNTHETIC_ANOMALOUS_RECORDS: TelemetryRecord[] = [
  // Physical impossibility: SpO2 = 105%
  {
    recordId: 'REC-ANOM-01',
    astronautId: 'ASTRO-PLT-02',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T09:00:00.000Z',
    metricType: 'oxygen_saturation',
    value: 105,
    unit: '%',
    sourceDevice: 'PulseOx-Fail',
  },
  // Incompatible unit: Heart rate in mmHg
  {
    recordId: 'REC-ANOM-02',
    astronautId: 'ASTRO-PLT-02',
    missionId: 'MISSION-ARTEMIS-III',
    timestamp: '2026-11-14T09:01:00.000Z',
    metricType: 'heart_rate',
    value: 80,
    unit: 'mmHg' as any,
    sourceDevice: 'Sensor-Glitch',
  },
  // Implausible rate-of-change spike: HR 60 -> 180 in 15 seconds
  {
    recordId: 'REC-ANOM-03',
    astronautId: 'ASTRO-SCI-03',
    missionId: 'ISS-EXPEDITION-71',
    timestamp: '2026-11-14T09:00:00.000Z',
    metricType: 'heart_rate',
    value: 60,
    unit: 'bpm',
    sourceDevice: 'ECG-Array',
  },
  {
    recordId: 'REC-ANOM-04',
    astronautId: 'ASTRO-SCI-03',
    missionId: 'ISS-EXPEDITION-71',
    timestamp: '2026-11-14T09:00:15.000Z',
    metricType: 'heart_rate',
    value: 180,
    unit: 'bpm',
    sourceDevice: 'ECG-Array',
  },
];

export const SYNTHETIC_RADIATION_EVENTS: RadiationExposureRecord[] = [
  {
    timestamp: '2026-11-14T01:00:00.000Z',
    particleType: 'proton',
    absorbedDoseGy: 0.0002, // 0.2 mGy
    radiationWeightingFactor: 2.0, // w_R = 2 -> 0.4 mSv
    location: 'ISS_INTERIOR',
    detectorId: 'DOS-SILICON-A',
  },
  {
    timestamp: '2026-11-14T02:00:00.000Z',
    particleType: 'hze_heavy_ion',
    absorbedDoseGy: 0.00005, // 0.05 mGy
    radiationWeightingFactor: 20.0, // w_R = 20 -> 1.0 mSv
    location: 'LUNAR_GATEWAY',
    detectorId: 'DOS-TEPC-01',
  },
  {
    timestamp: '2026-11-14T03:00:00.000Z',
    particleType: 'neutron_fast',
    absorbedDoseGy: 0.0001, // 0.1 mGy
    radiationWeightingFactor: 20.0, // w_R = 20 -> 2.0 mSv
    location: 'EVA_SUIT',
    detectorId: 'DOS-EVA-BADGE',
  },
];

export const SYNTHETIC_SAMPLE_MANIFESTS: AstroCareModuleManifest[] = [
  {
    moduleId: 'astrocare-biomedical-core',
    moduleName: 'AstroCare Biomedical Monitoring Module',
    moduleVersion: '1.2.0',
    category: 'BIOMEDICAL',
    requiredServices: ['telemetry-stream-service'],
    providedServices: ['biomedical-vital-service', 'anomaly-detection-service'],
    exportedTypes: ['TelemetryRecord', 'BiomedicalMetricType'],
    registeredRoutes: ['/health', '/biometrics'],
    dataContracts: [
      {
        contractId: 'contract-telemetry-v1',
        version: '1.0.0',
        schemaDefinition: 'TelemetryRecordSchema',
        inputTypes: ['RawTelemetryPacket'],
        outputTypes: ['ValidatedTelemetryRecord'],
      },
    ],
  },
  {
    moduleId: 'astrocare-aerospace-radiation',
    moduleName: 'Space Radiation & Environmental Intelligence',
    moduleVersion: '1.1.0',
    category: 'AEROSPACE',
    requiredServices: ['biomedical-vital-service'],
    providedServices: ['radiation-dosimetry-service', 'spe-alert-service'],
    exportedTypes: ['RadiationExposureRecord'],
    registeredRoutes: ['/radiation', '/space-environment'],
    dataContracts: [
      {
        contractId: 'contract-radiation-v1',
        version: '1.0.0',
        schemaDefinition: 'RadiationRecordSchema',
        inputTypes: ['DetectorSample'],
        outputTypes: ['EquivalentDoseSummary'],
      },
    ],
  },
  {
    moduleId: 'astrocare-ai-copilot',
    moduleName: 'Clinical Reasoning Copilot Module',
    moduleVersion: '2.0.0',
    category: 'AI_INTELLIGENCE',
    requiredServices: ['biomedical-vital-service', 'radiation-dosimetry-service'],
    providedServices: ['clinical-reasoning-service', 'ai-copilot-service'],
    exportedTypes: ['AIResponsePayload', 'HealthContextInput'],
    registeredRoutes: ['/copilot', '/clinical-reasoning'],
    dataContracts: [
      {
        contractId: 'contract-ai-reasoning-v1',
        version: '1.0.0',
        schemaDefinition: 'AIReasoningSchema',
        inputTypes: ['HealthContextInput'],
        outputTypes: ['AIResponsePayload'],
      },
    ],
  },
];
