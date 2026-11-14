import { MissionEvent } from '../types/contracts';

export const MISSION_ACTIVITY_TIMELINE: MissionEvent[] = [
  {
    id: 'EVT-142-08',
    timestamp: '15:45 UTC (FD 142)',
    category: 'anomaly-detection',
    title: 'Autonomic Vagal Depression Flagged by Bio-Harness',
    description: 'Cmdr. Sarah Chen HRV rMSSD dropped below 40 ms operational warning boundary (measured at 38 ms). Correlated with 4-day sleep duration truncation.',
    astronautId: 'AST-084-SC',
    astronautName: 'Cmdr. Sarah Chen',
    severity: 'warning',
    provenance: {
      type: 'live-telemetry',
      sourceSystem: 'Crew Health Bio-Harness Channel A',
      timestamp: '2026-11-14T15:45:00Z',
      transformationStatus: 'calibrated',
      completenessPercentage: 99.1,
      isSimulated: false
    },
    investigationId: 'INV-2026-042'
  },
  {
    id: 'EVT-142-07',
    timestamp: '14:20 UTC (FD 142)',
    category: 'ai-report',
    title: 'Gemini Biomedical Intelligence Multi-Domain Synthesis',
    description: 'Autonomous multi-domain analysis completed for Flight Day 142. Flagged cross-domain interaction between sleep deficit and subclinical latent Epstein-Barr virus reactivation.',
    severity: 'informational',
    provenance: {
      type: 'ai-generated-interpretation',
      sourceSystem: 'AstroCare Gemini Intelligence Assistant (Module ai-intelligence)',
      timestamp: '2026-11-14T14:20:00Z',
      completenessPercentage: 100,
      isSimulated: false
    }
  },
  {
    id: 'EVT-142-06',
    timestamp: '13:05 UTC (FD 142)',
    category: 'medical-investigation',
    title: 'Flight Surgeon OCT Fundoscopy Protocol Opened',
    description: 'Lead Flight Surgeon Dr. Jonathan Hayes initiated Investigation INV-2026-042 to assess optic nerve sheath diameter (ONSD) and SANS progression under current 3200 ppm cabin CO2.',
    astronautId: 'AST-084-SC',
    astronautName: 'Cmdr. Sarah Chen',
    severity: 'warning',
    provenance: {
      type: 'nasa-research-source',
      sourceSystem: 'NASA HRP SANS Evidence Book (NASA/TP-2021-220087)',
      timestamp: '2026-11-14T13:05:00Z',
      completenessPercentage: 100,
      isSimulated: false
    },
    investigationId: 'INV-2026-042'
  },
  {
    id: 'EVT-142-05',
    timestamp: '11:30 UTC (FD 142)',
    category: 'health-observation',
    title: 'ARED Resistance Exercise Session Logged',
    description: 'Lt. Alex Rivera completed scheduled 2.5-hour ARED eccentric resistance cycle (squat & deadlift loads > 580 lbs). Muscle preservation nominal.',
    astronautId: 'AST-119-AR',
    astronautName: 'Lt. Alex Rivera',
    severity: 'nominal',
    provenance: {
      type: 'live-telemetry',
      sourceSystem: 'ARED Telemetry Sensor Interface',
      timestamp: '2026-11-14T11:30:00Z',
      completenessPercentage: 100,
      isSimulated: false
    }
  },
  {
    id: 'EVT-142-04',
    timestamp: '09:15 UTC (FD 142)',
    category: 'data-sync',
    title: 'NASA OSDR Benchmarking Synchronization',
    description: 'Synchronized baseline omics references and cytokine reference distribution curves from NASA Open Science Data Repository (OSDR Study OSDR-542).',
    severity: 'informational',
    provenance: {
      type: 'nasa-research-source',
      sourceSystem: 'NASA Open Science Data Repository API',
      timestamp: '2026-11-14T09:15:00Z',
      completenessPercentage: 100,
      isSimulated: false
    }
  },
  {
    id: 'EVT-142-03',
    timestamp: '07:00 UTC (FD 142)',
    category: 'health-observation',
    title: 'Wrist Actigraphy Sleep Summary Downlinked',
    description: 'Crew sleep scoring downlinked. Crew average duration 5.4 hrs; Dr. Elena Rostova recorded deep slow-wave deficit due to visiting vehicle thermal loop acoustics.',
    astronautId: 'AST-135-ER',
    astronautName: 'Dr. Elena Rostova',
    severity: 'warning',
    provenance: {
      type: 'derived-metric',
      sourceSystem: 'Actigraphy Sleep Scoring Algorithm',
      timestamp: '2026-11-14T07:00:00Z',
      completenessPercentage: 96.5,
      isSimulated: false
    }
  },
  {
    id: 'EVT-142-02',
    timestamp: '04:45 UTC (FD 142)',
    category: 'telemetry-event',
    title: 'South Atlantic Anomaly (SAA) Passage Dosimeter Logging',
    description: 'Orbital ground track crossed South Atlantic Anomaly. CPAD dosimeters logged nominal 0.48 mSv/day daily rate without solar proton event enhancement.',
    severity: 'nominal',
    provenance: {
      type: 'live-telemetry',
      sourceSystem: 'Crew Personal Active Dosimeter (CPAD)',
      timestamp: '2026-11-14T04:45:00Z',
      completenessPercentage: 100,
      isSimulated: false
    }
  },
  {
    id: 'EVT-142-01',
    timestamp: '00:00 UTC (FD 142)',
    category: 'follow-up-action',
    title: 'Flight Day 142 Operational Shift Handover',
    description: 'Mission Control Houston / Biomedical Engineering (BME) shift transition complete. 4 astronauts monitored, 1 active investigation open.',
    severity: 'nominal',
    provenance: {
      type: 'live-telemetry',
      sourceSystem: 'Flight Surgeon Mission Log Console',
      timestamp: '2026-11-14T00:00:00Z',
      completenessPercentage: 100,
      isSimulated: false
    }
  }
];
