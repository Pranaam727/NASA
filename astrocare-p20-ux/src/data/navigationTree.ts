import { NavigationGroup } from '../types/navigation';

export const ASTROCARE_NAVIGATION_TREE: NavigationGroup[] = [
  {
    id: 'mission-operations',
    title: 'Mission Operations',
    routes: [
      {
        id: 'mission-overview',
        label: 'Mission Overview',
        groupId: 'mission-operations',
        iconName: 'LayoutDashboard',
        isImplementedInP20: true,
        routeContractPath: '/operations/overview',
        description: 'Comprehensive mission-control overview, crew health status, activity timeline, and telemetry sync.'
      },
      {
        id: 'crew-roster',
        label: 'Crew Roster',
        groupId: 'mission-operations',
        iconName: 'Users',
        badge: 4,
        badgeVariant: 'neutral',
        isImplementedInP20: true,
        routeContractPath: '/operations/crew',
        description: 'Active monitored astronaut profiles, mission roles, data connectivity, and individual vitals.'
      },
      {
        id: 'mission-timeline',
        label: 'Mission Timeline',
        groupId: 'mission-operations',
        iconName: 'Clock',
        badge: 'Live',
        badgeVariant: 'nominal',
        isImplementedInP20: true,
        routeContractPath: '/operations/timeline',
        description: 'Chronological timeline of biomedical observations, telemetry anomalies, and flight surgeon events.'
      }
    ]
  },
  {
    id: 'health-monitoring',
    title: 'Health Monitoring',
    routes: [
      {
        id: 'vital-monitoring',
        label: 'Vital Monitoring',
        groupId: 'health-monitoring',
        iconName: 'Activity',
        badge: 'Stream',
        badgeVariant: 'nominal',
        isImplementedInP20: true,
        routeContractPath: '/health/vitals',
        description: 'Real-time physiological vital streams (ECG, HR, BP, SpO2, HRV rMSSD, core temp).'
      },
      {
        id: 'health-analytics',
        label: 'Health Analytics',
        groupId: 'health-monitoring',
        iconName: 'BarChart2',
        isImplementedInP20: true,
        routeContractPath: '/health/analytics',
        description: 'Baseline comparison analytics, multi-metric time-series, and trend evaluation.'
      },
      {
        id: 'cardiovascular-health',
        label: 'Cardiovascular Health',
        groupId: 'health-monitoring',
        iconName: 'Heart',
        isImplementedInP20: false,
        targetPModule: 'P05',
        routeContractPath: '/health/cardiovascular',
        description: 'Hemodynamic adaptation, cephalad fluid shift metrics, and SANS surveillance.'
      },
      {
        id: 'bone-muscle-health',
        label: 'Bone and Muscle Health',
        groupId: 'health-monitoring',
        iconName: 'Bone',
        isImplementedInP20: false,
        targetPModule: 'P06',
        routeContractPath: '/health/musculoskeletal',
        description: 'Bone mineral resorption dynamics, ARED exercise compliance, and soleus muscle preservation.'
      },
      {
        id: 'radiation-monitoring',
        label: 'Radiation Monitoring',
        groupId: 'health-monitoring',
        iconName: 'Radiation',
        isImplementedInP20: false,
        targetPModule: 'P07',
        routeContractPath: '/health/radiation',
        description: 'CPAD active dosimeter tracking, GCR cumulative dose models, and SPE storm shelters.'
      },
      {
        id: 'wellness-sleep',
        label: 'Wellness and Sleep',
        groupId: 'health-monitoring',
        iconName: 'Moon',
        badge: 'Warning',
        badgeVariant: 'warning',
        isImplementedInP20: false,
        targetPModule: 'P08',
        routeContractPath: '/health/sleep-wellness',
        description: 'Actigraphy sleep debt scoring, circadian phase alignment, and cognitive resilience.'
      },
      {
        id: 'immune-lab-analytics',
        label: 'Immune & Laboratory',
        groupId: 'health-monitoring',
        iconName: 'Shield',
        isImplementedInP20: false,
        targetPModule: 'P09',
        routeContractPath: '/health/immune',
        description: 'Cytokine multiplex assays, latent herpesvirus reactivation, and WBC leukocyte distribution.'
      }
    ]
  },
  {
    id: 'intelligence',
    title: 'Intelligence & Decision Support',
    routes: [
      {
        id: 'ai-intelligence',
        label: 'AI Intelligence Assistant',
        groupId: 'intelligence',
        iconName: 'Sparkles',
        badge: 'Gemini',
        badgeVariant: 'nominal',
        isImplementedInP20: false,
        targetPModule: 'P13',
        routeContractPath: '/intelligence/assistant',
        description: 'Gemini-powered biomedical copilot, multi-turn clinical chat, and telemetry interpretation.'
      },
      {
        id: 'clinical-copilot',
        label: 'Clinical Copilot',
        groupId: 'intelligence',
        iconName: 'Stethoscope',
        isImplementedInP20: false,
        targetPModule: 'P14',
        routeContractPath: '/intelligence/copilot',
        description: 'Protocolized decision support for aerospace flight surgeons and biomedical engineers.'
      },
      {
        id: 'anomaly-detection',
        label: 'Anomaly Detection',
        groupId: 'intelligence',
        iconName: 'AlertTriangle',
        badge: 3,
        badgeVariant: 'warning',
        isImplementedInP20: false,
        targetPModule: 'P15',
        routeContractPath: '/intelligence/anomalies',
        description: 'Statistical telemetry deviation detection and predictive health pattern alerts.'
      },
      {
        id: 'risk-intelligence',
        label: 'Risk Intelligence',
        groupId: 'intelligence',
        iconName: 'Layers',
        isImplementedInP20: false,
        targetPModule: 'P16',
        routeContractPath: '/intelligence/risk-matrix',
        description: 'Probabilistic risk assessment across mission elapsed duration and planetary transit corridors.'
      }
    ]
  },
  {
    id: 'scientific-research',
    title: 'Scientific Research & Provenance',
    routes: [
      {
        id: 'nasa-sources',
        label: 'NASA Data Sources & Provenance',
        groupId: 'scientific-research',
        iconName: 'Compass',
        badge: 'NASA HRP',
        badgeVariant: 'nominal',
        isImplementedInP20: true,
        routeContractPath: '/research/nasa-sources',
        description: 'Official NASA HRP, OSDR, NLSP, and Ongoing Research sources with verification provenance.'
      },
      {
        id: 'research-explorer',
        label: 'Research Explorer',
        groupId: 'scientific-research',
        iconName: 'BookOpen',
        isImplementedInP20: true,
        routeContractPath: '/research/explorer',
        description: 'Interactive space life-sciences study explorer with study identifiers and metadata.'
      },
      {
        id: 'evidence-citations',
        label: 'Evidence and Citations',
        groupId: 'scientific-research',
        iconName: 'FileCheck',
        isImplementedInP20: true,
        routeContractPath: '/research/citations',
        description: 'Verifiable clinical and countermeasure citation library for flight surgeons.'
      }
    ]
  },
  {
    id: 'operations',
    title: 'Operations & Governance',
    routes: [
      {
        id: 'investigations',
        label: 'Investigations',
        groupId: 'operations',
        iconName: 'FileSearch',
        badge: 2,
        badgeVariant: 'warning',
        isImplementedInP20: true,
        routeContractPath: '/operations/investigations',
        description: 'Active medical investigations, assigned flight surgeons, and targeted clinical actions.'
      },
      {
        id: 'reports',
        label: 'Mission Reports',
        groupId: 'operations',
        iconName: 'FileText',
        isImplementedInP20: false,
        targetPModule: 'P17',
        routeContractPath: '/operations/reports',
        description: 'Daily executive biomedical summaries and shift handover logs.'
      },
      {
        id: 'settings',
        label: 'Settings & Accessibility',
        groupId: 'operations',
        iconName: 'Sliders',
        isImplementedInP20: true,
        routeContractPath: '/system/settings',
        description: 'Theme toggle (Dark/Light), high contrast mode, unit system, and data refresh rates.'
      }
    ]
  }
];
