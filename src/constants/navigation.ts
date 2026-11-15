import {
  LayoutDashboard,
  Users,
  Activity,
  Dna,
  Brain,
  Radio,
  Sparkles,
  Bell,
  FileText,
  Sliders,
  UserCheck,
  ClipboardCheck,
  FlaskConical,
  AlertOctagon,
  BookOpen,
  Zap,
  Shield,
} from 'lucide-react';
import { NavGroup } from '@/types/navigation';
import { ROUTES } from './routes';
import { UserRole } from '@/types/database.types';

/**
 * Standard default navigation configuration
 */
export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    groupName: 'MISSION OPERATIONS',
    items: [
      {
        name: 'Role Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        badge: 'ACTIVE',
      },
      {
        name: 'Mission Overview',
        path: ROUTES.OVERVIEW,
        icon: LayoutDashboard,
      },
      {
        name: 'Astronaut Roster',
        path: ROUTES.ASTRONAUTS,
        icon: Users,
      },
      {
        name: 'Health Twin Profile',
        path: ROUTES.HEALTH_TWIN,
        icon: UserCheck,
      },
      {
        name: 'Daily Self-Assessment',
        path: ROUTES.SELF_ASSESSMENT,
        icon: ClipboardCheck,
        badge: 'DAILY',
      },
    ],
  },
  {
    groupName: 'HEALTH SYSTEMS',
    items: [
      {
        name: 'Vital Monitoring',
        path: ROUTES.VITALS,
        icon: Activity,
        badge: 'LIVE',
      },
      {
        name: 'Space Health',
        path: ROUTES.SPACE_HEALTH,
        icon: Dna,
      },
      {
        name: 'Mental Wellness',
        path: ROUTES.WELLNESS,
        icon: Brain,
      },
      {
        name: 'Radiation Monitoring',
        path: ROUTES.RADIATION,
        icon: Radio,
      },
      {
        name: 'Laboratory Assays',
        path: ROUTES.LABORATORY,
        icon: FlaskConical,
      },
    ],
  },
  {
    groupName: 'CLINICAL INTELLIGENCE',
    items: [
      {
        name: 'AI Copilot',
        path: ROUTES.INTELLIGENCE,
        icon: Sparkles,
        badge: 'GEMINI',
      },
      {
        name: 'Alerts & Incidents',
        path: ROUTES.ALERTS,
        icon: Bell,
      },
      {
        name: 'Emergency Assistant',
        path: ROUTES.EMERGENCY,
        icon: AlertOctagon,
        badge: 'CRITICAL',
      },
      {
        name: 'Reports & Dossiers',
        path: ROUTES.REPORTS,
        icon: FileText,
      },
      {
        name: 'NASA Research Explorer',
        path: ROUTES.RESEARCH,
        icon: BookOpen,
      },
    ],
  },
  {
    groupName: 'SIMULATION',
    items: [
      {
        name: 'Simulation Lab',
        path: ROUTES.SIMULATION,
        icon: Sliders,
      },
    ],
  },
];

/**
 * Returns role-specific navigation hierarchy with strict access boundaries
 */
export const getNavigationForRole = (role?: UserRole): NavGroup[] => {
  if (role === 'ASTRONAUT') {
    return [
      {
        groupName: 'MISSION OPERATIONS',
        items: [
          {
            name: 'Overview',
            path: ROUTES.ASTRONAUT_DASHBOARD,
            icon: LayoutDashboard,
            badge: 'ACTIVE',
          },
          {
            name: 'Personal Health Twin',
            path: ROUTES.HEALTH_TWIN,
            icon: UserCheck,
          },
          {
            name: 'Daily Assessment',
            path: ROUTES.SELF_ASSESSMENT,
            icon: ClipboardCheck,
            badge: 'DAILY',
          },
          {
            name: 'Countermeasures',
            path: ROUTES.SELF_ASSESSMENT,
            icon: Zap,
          },
        ],
      },
      {
        groupName: 'HEALTH SYSTEMS',
        items: [
          {
            name: 'Vital Monitoring',
            path: ROUTES.VITALS,
            icon: Activity,
            badge: 'LIVE',
          },
          {
            name: 'Space Health',
            path: ROUTES.SPACE_HEALTH,
            icon: Dna,
          },
          {
            name: 'Mental Wellness',
            path: ROUTES.WELLNESS,
            icon: Brain,
          },
          {
            name: 'Radiation Monitoring',
            path: ROUTES.RADIATION,
            icon: Radio,
          },
        ],
      },
      {
        groupName: 'CLINICAL INTELLIGENCE',
        items: [
          {
            name: 'Emergency Assistance',
            path: ROUTES.EMERGENCY,
            icon: AlertOctagon,
            badge: 'CRITICAL',
          },
          {
            name: 'Reports',
            path: ROUTES.REPORTS,
            icon: FileText,
          },
        ],
      },
    ];
  }

  if (role === 'MEDICAL_OFFICER') {
    return [
      {
        groupName: 'MISSION OPERATIONS',
        items: [
          {
            name: 'Medical Overview',
            path: ROUTES.MEDICAL_DASHBOARD,
            icon: LayoutDashboard,
            badge: 'ACTIVE',
          },
          {
            name: 'Crew Monitoring',
            path: ROUTES.OVERVIEW,
            icon: Users,
            badge: 'CREW',
          },
          {
            name: 'Health Twin',
            path: ROUTES.HEALTH_TWIN,
            icon: UserCheck,
          },
          {
            name: 'Daily Assessments',
            path: ROUTES.SELF_ASSESSMENT,
            icon: ClipboardCheck,
          },
        ],
      },
      {
        groupName: 'HEALTH SYSTEMS',
        items: [
          {
            name: 'Vital Monitoring',
            path: ROUTES.VITALS,
            icon: Activity,
            badge: 'LIVE',
          },
          {
            name: 'Biomarker Laboratory',
            path: ROUTES.LABORATORY,
            icon: FlaskConical,
            badge: 'LAB',
          },
          {
            name: 'Mental Wellness',
            path: ROUTES.WELLNESS,
            icon: Brain,
          },
          {
            name: 'Radiation Monitoring',
            path: ROUTES.RADIATION,
            icon: Radio,
          },
        ],
      },
      {
        groupName: 'CLINICAL INTELLIGENCE',
        items: [
          {
            name: 'AI Copilot',
            path: ROUTES.INTELLIGENCE,
            icon: Sparkles,
            badge: 'GEMINI',
          },
          {
            name: 'Alerts & Incidents',
            path: ROUTES.ALERTS,
            icon: Bell,
          },
          {
            name: 'Emergency Protocols',
            path: ROUTES.EMERGENCY,
            icon: AlertOctagon,
            badge: 'CRITICAL',
          },
          {
            name: 'Research Explorer',
            path: ROUTES.RESEARCH,
            icon: BookOpen,
          },
          {
            name: 'Reports',
            path: ROUTES.REPORTS,
            icon: FileText,
          },
        ],
      },
    ];
  }

  if (role === 'MISSION_COMMANDER' || role === 'MISSION_CONTROLLER') {
    return [
      {
        groupName: 'MISSION OPERATIONS',
        items: [
          {
            name: 'Mission Overview',
            path: ROUTES.COMMANDER_DASHBOARD,
            icon: LayoutDashboard,
            badge: 'ACTIVE',
          },
          {
            name: 'Crew Readiness',
            path: ROUTES.OVERVIEW,
            icon: Users,
          },
          {
            name: 'Astronaut Roster',
            path: ROUTES.ASTRONAUTS,
            icon: Users,
          },
        ],
      },
      {
        groupName: 'HEALTH SYSTEMS',
        items: [
          {
            name: 'Mission Health',
            path: ROUTES.VITALS,
            icon: Activity,
            badge: 'LIVE',
          },
          {
            name: 'Environmental Systems',
            path: ROUTES.COMMANDER_DASHBOARD,
            icon: Shield,
            badge: 'ECLSS',
          },
          {
            name: 'Radiation Overview',
            path: ROUTES.RADIATION,
            icon: Radio,
          },
        ],
      },
      {
        groupName: 'CLINICAL INTELLIGENCE',
        items: [
          {
            name: 'Risk Intelligence',
            path: ROUTES.INTELLIGENCE,
            icon: Sparkles,
          },
          {
            name: 'Reports',
            path: ROUTES.REPORTS,
            icon: FileText,
          },
        ],
      },
      {
        groupName: 'SIMULATION',
        items: [
          {
            name: 'Mission Timeline',
            path: ROUTES.SIMULATION,
            icon: Sliders,
            badge: 'SIM',
          },
        ],
      },
    ];
  }

  // Fallback default
  return NAVIGATION_CONFIG;
};
