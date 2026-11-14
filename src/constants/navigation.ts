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
} from 'lucide-react';
import { NavGroup } from '@/types/navigation';
import { ROUTES } from './routes';

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    groupName: 'MISSION OPERATIONS',
    items: [
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
    groupName: 'INTELLIGENCE',
    items: [
      {
        name: 'AI Intelligence',
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
        name: 'Reports & Dossiers',
        path: ROUTES.REPORTS,
        icon: FileText,
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
