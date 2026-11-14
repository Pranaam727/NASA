import { Mission, AlertSummary, InvestigationSummary } from '../types/contracts';

export const CURRENT_MISSION: Mission = {
  id: 'EXP-72-ISS',
  name: 'ISS Expedition 72 Long-Duration Science',
  identifier: 'NASA-ISS-EXP72',
  targetDestination: 'ISS Low Earth Orbit (408 km)',
  currentPhase: 'long-duration-orbital',
  missionElapsedTime: 'FD 142 : 14:32:08',
  flightDay: 142,
  totalPlannedDays: 180,
  telemetryConnectionStatus: 'connected',
  lastTelemetrySync: '12 seconds ago',
  systemHealthScorePercent: 94,
  ambientEnvironment: {
    cabinCo2Ppm: 3200, // ~2.4 mmHg
    cabinPressureKpa: 101.3,
    gcrDosimetryRateMicroSvPerDay: 480,
    ambientTempC: 21.8
  }
};

export const MOCK_ALERTS: AlertSummary[] = [
  {
    id: 'ALT-7201',
    timestamp: '28 min ago',
    severity: 'warning',
    title: 'Autonomic Vagal Depression (HRV rMSSD < 35 ms)',
    description: 'Cmdr. Sarah Chen exhibits 18% vagal withdrawal relative to pre-flight baseline, correlating with 4-day cumulative sleep debt.',
    domain: 'cardiovascular',
    astronautId: 'AST-084-SC',
    astronautName: 'Cmdr. Sarah Chen',
    investigationId: 'INV-2026-042',
    acknowledged: false,
    provenance: {
      type: 'live-telemetry',
      sourceSystem: 'Crew Bio-Harness Channel A',
      timestamp: '2026-11-14T15:45:00Z',
      transformationStatus: 'calibrated',
      completenessPercentage: 98.4,
      isSimulated: false
    }
  },
  {
    id: 'ALT-7202',
    timestamp: '2 hours ago',
    severity: 'warning',
    title: 'Elevated Bone Collagen Resorption (Serum NTX 24.2 nM BCE)',
    description: 'Dr. Marcus Vance shows elevated osteoclastic collagen breakdown marker exceeding nominal threshold (22.0 nM BCE).',
    domain: 'musculoskeletal',
    astronautId: 'AST-102-MV',
    astronautName: 'Dr. Marcus Vance',
    investigationId: 'INV-2026-039',
    acknowledged: true,
    provenance: {
      type: 'derived-metric',
      sourceSystem: 'Biomedical Blood Analysis Assay (In-Flight Wet Lab)',
      timestamp: '2026-11-14T14:10:00Z',
      completenessPercentage: 100,
      isSimulated: false
    }
  },
  {
    id: 'ALT-7203',
    timestamp: '5 hours ago',
    severity: 'critical',
    title: 'Severe Slow-Wave Sleep Fragmentation (Deep Sleep < 10%)',
    description: 'Dr. Elena Rostova logged 8 actigraphy micro-awakenings caused by visiting vehicle acoustic noise harmonics.',
    domain: 'sleep',
    astronautId: 'AST-135-ER',
    astronautName: 'Dr. Elena Rostova',
    acknowledged: false,
    provenance: {
      type: 'live-telemetry',
      sourceSystem: 'Crew Sleep Actigraphy Sensor v2',
      timestamp: '2026-11-14T11:20:00Z',
      completenessPercentage: 95.0,
      isSimulated: false
    }
  }
];

export const MOCK_INVESTIGATIONS: InvestigationSummary[] = [
  {
    id: 'INV-2026-042',
    title: 'SANS & Cephalad Venous Congestion Protocolized Surveillance',
    status: 'open',
    priority: 'elevated',
    assignedPhysician: 'Dr. Jonathan Hayes, NASA Lead Flight Surgeon',
    astronautId: 'AST-084-SC',
    astronautName: 'Cmdr. Sarah Chen',
    leadDomain: 'cardiovascular',
    createdAt: '2026-11-12T09:00:00Z',
    updatedAt: '2026-11-14T12:30:00Z',
    targetActions: [
      'Schedule Optical Coherence Tomography (OCT) fundus scan',
      'Increase Lower Body Negative Pressure (LBNP) exposure to 25 mmHg daily',
      'Monitor cabin ambient CO2 levels during sleep shifts'
    ]
  },
  {
    id: 'INV-2026-039',
    title: 'Trabecular Bone Demineralization & Calcium Clearance Oversight',
    status: 'under-review',
    priority: 'routine',
    assignedPhysician: 'Dr. Aris Thorne, Biomedical Countermeasures Engineer',
    astronautId: 'AST-102-MV',
    astronautName: 'Dr. Marcus Vance',
    leadDomain: 'musculoskeletal',
    createdAt: '2026-11-10T14:00:00Z',
    updatedAt: '2026-11-14T08:15:00Z',
    targetActions: [
      'Verify 2.5 L/day hydration protocol adherence',
      'Audit ARED resistive deadlift and squat peak load compliance (>550 lbs)',
      'Review frozen urine sample schedule for return on SpX-32'
    ]
  }
];
