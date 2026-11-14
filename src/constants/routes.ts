export const ROUTES = {
  HOME: '/',
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
} as const;

export const ROUTE_TITLES: Record<string, string> = {
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
};
