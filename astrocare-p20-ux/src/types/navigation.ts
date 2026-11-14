/**
 * Navigation and Information Architecture Types
 * Module: P20/21 - Mission-Wide UI/UX Experience
 */

export type NavigationGroupId = 
  | 'mission-operations'
  | 'health-monitoring'
  | 'intelligence'
  | 'scientific-research'
  | 'operations';

export interface NavigationRoute {
  id: string;
  label: string;
  groupId: NavigationGroupId;
  iconName: string;
  badge?: string | number;
  badgeVariant?: 'nominal' | 'warning' | 'critical' | 'neutral';
  isImplementedInP20: boolean;
  targetPModule?: string; // e.g. "P05", "P08", "P13", "P17"
  routeContractPath: string; // e.g. "/health/cardiovascular"
  description: string;
}

export interface NavigationGroup {
  id: NavigationGroupId;
  title: string;
  routes: NavigationRoute[];
}

export interface BreadcrumbItem {
  label: string;
  routeId?: string;
}
