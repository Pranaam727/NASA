// ============================================================================
// AstroCare Hackathon Demonstration Scenarios
// SYNTHETIC DEMONSTRATION DATA — NOT REAL ASTRONAUT TELEMETRY
// Preloaded aerospace medical presentation scenarios for evaluation & judging
// ============================================================================

import { DemoScenario } from '../types';

export const DEMO_SCENARIOS_DATA: DemoScenario[] = [
  {
    id: 'scenario-nominal',
    name: '1. Nominal Astronaut Health Monitoring',
    code: 'SCENARIO-A01-NOMINAL',
    description: 'Routine in-flight biometric surveillance of Expedition 72 Commander during low-exertion orbital research operations. All vitals within predicted microgravity adaptation tolerances.',
    astronautName: 'Cmdr. Sarah Chen',
    astronautId: 'AST-072-SC',
    missionPhase: 'Flight Day 142 (ISS Orbit)',
    met: '142d 08h 24m 10s',
    clinicalSeverity: 'Nominal',
    vitals: {
      heartRate: 64,
      spo2: 98.4,
      systolicBp: 118,
      diastolicBp: 76,
      coreTemp: 37.0,
      radiationAccumulated: 42.6 // mSv
    },
    keyFindings: [
      'Resting heart rate stable at 64 bpm with healthy sinus rhythm.',
      'Pulse oximetry at 98.4% with nominal cabin atmospheric partial pressure of O2.',
      'Cephalad fluid shift countermeasure compliance: 100% on ARED resistance trainer.',
      'Sleep architecture indicates 7.4 hours total sleep with 22% REM.'
    ],
    suggestedClinicalActions: [
      'Maintain standard 2.5h daily countermeasure workout regimen.',
      'Routine weekly acoustic dosimeter log review.',
      'No flight surgeon intervention required.'
    ],
    evidenceSource: 'NASA Human Research Program (HRP) Evidence Book: Risk of Adverse Health Consequences and Decrements in Performance resulting from Spaceflight Countermeasure non-compliance.'
  },
  {
    id: 'scenario-anomaly',
    name: '2. Multi-System Anomaly Requiring Investigation',
    code: 'SCENARIO-B02-ANOMALY',
    description: 'Post-EVA (Extravehicular Activity) physiological telemetry anomaly showing sustained nocturnal tachycardia, elevated systolic arterial pressure, and acute micro-hematuria biomarkers.',
    astronautName: 'Dr. Marcus Vance',
    astronautId: 'AST-072-MV',
    missionPhase: 'Flight Day 89 (Post-EVA 3)',
    met: '089d 19h 42m 00s',
    clinicalSeverity: 'Critical',
    vitals: {
      heartRate: 112,
      spo2: 94.8,
      systolicBp: 148,
      diastolicBp: 96,
      coreTemp: 38.3,
      radiationAccumulated: 68.2 // mSv
    },
    keyFindings: [
      'Persistent resting tachycardia (112 bpm) following 6.5-hour spacewalk exertion.',
      'Elevated body temperature at 38.3°C indicating potential thermal regulation stress or acute subclinical inflammatory response.',
      'Cumulative EVA radiation exposure delta: +12.4 mSv due to coronal mass ejection (CME) solar particle alert.',
      'Orthostatic intolerance baseline deviation: -18% stroke volume index.'
    ],
    suggestedClinicalActions: [
      'Immediate IV hydration with 1000 mL normal saline equivalent or oral electrolyte rehydration protocol.',
      'Perform targeted ultrasound examination (Optic Nerve Sheath Diameter & bladder imaging).',
      'Deploy AstroCare Gemini AI Assistant to cross-reference recent spaceflight heat exhaustion protocols.',
      'Restrict heavy exercise countermeasures for next 48 hours under flight surgeon surveillance.'
    ],
    evidenceSource: 'NASA Life Sciences Data Archive (LSDA): In-flight EVA physiological strain, thermoregulatory decoupling, and orthostatic intolerance registries.'
  },
  {
    id: 'scenario-decision-support',
    name: '3. Mission Medical Decision-Support Workflow',
    code: 'SCENARIO-C03-DECISION',
    description: 'Interactive clinical decision-support triage for Spaceflight-Associated Neuro-ocular Syndrome (SANS) accompanied by acute visual blur and optic disc edema.',
    astronautName: 'Dr. Elena Rostova',
    astronautId: 'AST-072-ER',
    missionPhase: 'Flight Day 204 (Long-Duration Microgravity)',
    met: '204d 11h 15m 30s',
    clinicalSeverity: 'Advisory',
    vitals: {
      heartRate: 72,
      spo2: 97.2,
      systolicBp: 132,
      diastolicBp: 84,
      coreTemp: 37.2,
      radiationAccumulated: 78.9 // mSv
    },
    keyFindings: [
      'Subjective visual acuity degradation in right eye from 20/20 to 20/40 over 30 days.',
      'Fundoscopy telemetry reveals Grade 1 optic disc edema (Frisén Scale) with choroidal folds.',
      'Venous jugular flow stasis detected via in-flight ultrasound.',
      'Cognitive performance tests show nominal reaction time but elevated subjective visual fatigue.'
    ],
    suggestedClinicalActions: [
      'Initiate in-flight optical coherence tomography (OCT) volume scan of retinal nerve fiber layer.',
      'Prescribe adjustable focal length corrective flight glasses for station duties.',
      'Review lower body negative pressure (LBNP) countermeasure protocol to reduce cephalad venous pressure.',
      'Schedule telemedicine teleconference with JSC Flight Medicine Clinic.'
    ],
    evidenceSource: 'NASA Human Research Program (HRP) Evidence Report: Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS).'
  }
];
