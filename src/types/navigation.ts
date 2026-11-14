import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export interface MissionContextState {
  missionCode: string;
  targetDestination: string;
  missionElapsedTimeSeconds: number;
  commsStatus: 'NOMINAL' | 'DELAYED' | 'DISCONNECTED';
  commsLatencyMs: number;
}
