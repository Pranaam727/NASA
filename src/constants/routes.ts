export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',

  // Astronaut Auth
  ASTRONAUT_SIGNIN: '/astronaut/signin',
  ASTRONAUT_SIGNUP: '/astronaut/signup',

  // Medical Officer Auth
  MEDICAL_SIGNIN: '/medical/signin',
  MEDICAL_SIGNUP: '/medical/signup',

  // Mission Commander Auth
  COMMANDER_SIGNIN: '/commander/signin',
  COMMANDER_SIGNUP: '/commander/signup',

  // Dashboards
  DASHBOARD: '/dashboard',
  ASTRONAUT_DASHBOARD: '/astronaut/dashboard',
  MEDICAL_DASHBOARD: '/medical/dashboard',
  COMMANDER_DASHBOARD: '/commander/dashboard',

  // Common Account & Access
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ACCESS_DENIED: '/access-denied',

  // Core Platform Modules
  OVERVIEW: '/overview',
  ASTRONAUTS: '/astronauts',
  ASTRONAUT_DETAIL: '/astronauts/:id',
  VITALS: '/vitals',
  SPACE_HEALTH: '/space-health',
  WELLNESS: '/wellness',
  RADIATION: '/radiation',
  INTELLIGENCE: '/intelligence',
  ALERTS: '/alerts',
  REPORTS: '/reports',
  SIMULATION: '/simulation',
  HEALTH_TWIN: '/health-twin',
  SELF_ASSESSMENT: '/self-assessment',
  EMERGENCY: '/emergency',
  LABORATORY: '/laboratory',
  RESEARCH: '/research',
} as const;

export const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.AUTH]: 'Personnel Authentication Portal',
  [ROUTES.ASTRONAUT_SIGNIN]: 'Astronaut Secure Sign-In',
  [ROUTES.ASTRONAUT_SIGNUP]: 'Astronaut Mission Registration',
  [ROUTES.MEDICAL_SIGNIN]: 'Medical Officer Sign-In',
  [ROUTES.MEDICAL_SIGNUP]: 'Medical Officer Registration',
  [ROUTES.COMMANDER_SIGNIN]: 'Mission Commander Sign-In',
  [ROUTES.COMMANDER_SIGNUP]: 'Mission Commander Provisioning',
  [ROUTES.DASHBOARD]: 'Mission Health Command Dashboard',
  [ROUTES.ASTRONAUT_DASHBOARD]: 'Personal Health Command Center',
  [ROUTES.MEDICAL_DASHBOARD]: 'Flight Medical Operations Center',
  [ROUTES.COMMANDER_DASHBOARD]: 'Mission Command & Crew Readiness',
  [ROUTES.FORGOT_PASSWORD]: 'Password Recovery',
  [ROUTES.RESET_PASSWORD]: 'Cryptographic Key Reset',
  [ROUTES.PROFILE]: 'Mission Personnel Profile',
  [ROUTES.SETTINGS]: 'System & Telemetry Settings',
  [ROUTES.ACCESS_DENIED]: 'Security Clearance Violation',
  [ROUTES.OVERVIEW]: 'Mission Control Overview',
  [ROUTES.ASTRONAUTS]: 'Astronaut Medical Roster',
  [ROUTES.VITALS]: 'Real-Time Vital Monitoring',
  [ROUTES.SPACE_HEALTH]: 'Deep-Space Health Analytics',
  [ROUTES.WELLNESS]: 'Psychological Wellness & Journal',
  [ROUTES.RADIATION]: 'Radiation Dosimetry & SPE Monitor',
  [ROUTES.INTELLIGENCE]: 'AI Health Intelligence Copilot',
  [ROUTES.ALERTS]: 'Incident & Alert Management',
  [ROUTES.REPORTS]: 'Clinical Dossiers & Reports',
  [ROUTES.SIMULATION]: 'Virtual Telemetry Simulation Lab',
  [ROUTES.HEALTH_TWIN]: 'Astronaut Personal Health Twin',
  [ROUTES.SELF_ASSESSMENT]: 'Daily Astronaut Self-Assessment',
  [ROUTES.EMERGENCY]: 'Space Medical Emergency Assistant',
  [ROUTES.LABORATORY]: 'Immune & Laboratory Intelligence',
  [ROUTES.RESEARCH]: 'NASA Research Evidence Explorer',
};
