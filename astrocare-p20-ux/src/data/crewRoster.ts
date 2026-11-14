import { Astronaut } from '../types/contracts';

export const CREW_MEMBERS: Astronaut[] = [
  {
    id: 'AST-084-SC',
    name: 'Cmdr. Sarah Chen',
    callsign: 'Valkyrie-1',
    role: 'ISS Commander & Lead Biomedical Scientist',
    agency: 'NASA',
    age: 42,
    gender: 'female',
    flightDay: 142,
    evaCount: 3,
    dataAvailability: 'full-stream',
    overallHealthStatus: 'warning',
    primaryVitals: {
      heartRateBpm: 68,
      bloodPressureSys: 128,
      bloodPressureDia: 84,
      spo2Percent: 98,
      hrvRmssdMs: 38,
      coreTempC: 36.8
    },
    latestObservation: 'Mild cephalad fluid shift; autonomic vagal withdrawal with HRV depressed 18% vs baseline.',
    activeAlertCount: 1,
    monitoredDomains: ['cardiovascular', 'musculoskeletal', 'radiation', 'sleep', 'immune']
  },
  {
    id: 'AST-102-MV',
    name: 'Dr. Marcus Vance',
    callsign: 'Apex-2',
    role: 'Flight Surgeon & Lunar Habitat Specialist',
    agency: 'NASA',
    age: 48,
    gender: 'male',
    flightDay: 142,
    evaCount: 1,
    dataAvailability: 'full-stream',
    overallHealthStatus: 'warning',
    primaryVitals: {
      heartRateBpm: 82,
      bloodPressureSys: 138,
      bloodPressureDia: 88,
      spo2Percent: 97,
      hrvRmssdMs: 29,
      coreTempC: 37.0
    },
    latestObservation: 'Resting tachycardia with mild blood pressure elevation; serum NTX resorption elevated at 24.2 nM BCE.',
    activeAlertCount: 1,
    monitoredDomains: ['cardiovascular', 'musculoskeletal', 'radiation', 'sleep']
  },
  {
    id: 'AST-119-AR',
    name: 'Lt. Alex Rivera',
    callsign: 'Pioneer-3',
    role: 'EVA Specialist & Systems Flight Engineer',
    agency: 'NASA',
    age: 36,
    gender: 'male',
    flightDay: 142,
    evaCount: 4,
    dataAvailability: 'full-stream',
    overallHealthStatus: 'nominal',
    primaryVitals: {
      heartRateBpm: 54,
      bloodPressureSys: 116,
      bloodPressureDia: 74,
      spo2Percent: 99,
      hrvRmssdMs: 58,
      coreTempC: 36.7
    },
    latestObservation: 'Cardiovascular reserve exceptional; isolated right shoulder muscular fatigue following 7-hour EVA.',
    activeAlertCount: 0,
    monitoredDomains: ['cardiovascular', 'musculoskeletal', 'radiation', 'sleep']
  },
  {
    id: 'AST-135-ER',
    name: 'Dr. Elena Rostova',
    callsign: 'Nova-4',
    role: 'Biomedical Engineer & Payload Specialist',
    agency: 'ESA',
    age: 39,
    gender: 'female',
    flightDay: 142,
    evaCount: 2,
    dataAvailability: 'full-stream',
    overallHealthStatus: 'critical',
    primaryVitals: {
      heartRateBpm: 74,
      bloodPressureSys: 122,
      bloodPressureDia: 80,
      spo2Percent: 98,
      hrvRmssdMs: 34,
      coreTempC: 36.9
    },
    latestObservation: 'Chronic sleep debt (4.8 hrs rolling average); deep slow-wave sleep suppressed below 10%.',
    activeAlertCount: 1,
    monitoredDomains: ['sleep', 'immune', 'cardiovascular', 'behavioral']
  }
];
