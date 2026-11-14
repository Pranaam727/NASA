import React, { useState } from 'react';
import { ASTROCARE_NAVIGATION_TREE } from '../../data/navigationTree';
import { NavigationRoute } from '../../types/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  Activity,
  BarChart2,
  Heart,
  Bone,
  Radiation,
  Moon,
  Shield,
  Sparkles,
  Stethoscope,
  AlertTriangle,
  Layers,
  Compass,
  BookOpen,
  FileCheck,
  FileSearch,
  FileText,
  Sliders,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FOCUS_RING } from '../../design-system/utils';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Clock,
  Activity,
  BarChart2,
  Heart,
  Bone,
  Radiation,
  Moon,
  Shield,
  Sparkles,
  Stethoscope,
  AlertTriangle,
  Layers,
  Compass,
  BookOpen,
  FileCheck,
  FileSearch,
  FileText,
  Sliders
};

interface MissionNavigationProps {
  currentRouteId: string;
  onNavigate: (routeId: string) => void;
  isCollapsed?: boolean;
}

export const MissionNavigation: React.FC<MissionNavigationProps> = ({
  currentRouteId,
  onNavigate,
  isCollapsed = false
}) => {
  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'mission-operations': true,
    'health-monitoring': true,
    'intelligence': true,
    'scientific-research': true,
    'operations': true
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const renderBadge = (route: NavigationRoute) => {
    if (!route.badge) return null;

    let badgeClasses = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    if (route.badgeVariant === 'nominal') {
      badgeClasses = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40';
    } else if (route.badgeVariant === 'warning') {
      badgeClasses = 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40';
    } else if (route.badgeVariant === 'critical') {
      badgeClasses = 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40';
    }

    return (
      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${badgeClasses}`}>
        {route.badge}
      </span>
    );
  };

  return (
    <nav aria-label="Mission Control Navigation" className="space-y-4 text-xs font-sans">
      {ASTROCARE_NAVIGATION_TREE.map((group) => {
        const isExpanded = expandedGroups[group.id] !== false;

        return (
          <div key={group.id} className="space-y-1">
            {/* Group Header (if not collapsed sidebar) */}
            {!isCollapsed && (
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${FOCUS_RING}`}
              >
                <span>{group.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Routes */}
            {(isCollapsed || isExpanded) && (
              <div className="space-y-0.5">
                {group.routes.map((route) => {
                  const isActive = currentRouteId === route.id;
                  const Icon = ICON_MAP[route.iconName] || LayoutDashboard;

                  return (
                    <button
                      key={route.id}
                      onClick={() => onNavigate(route.id)}
                      title={`${route.label}${!route.isImplementedInP20 ? ` (Integration Route: ${route.targetPModule})` : ''}`}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${FOCUS_RING} ${
                        isActive
                          ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 font-semibold border border-cyan-300 dark:border-cyan-500/40 shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`} />
                      
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{route.label}</span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                            {!route.isImplementedInP20 && (
                              <span className="text-[9px] font-mono px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {route.targetPModule}
                              </span>
                            )}
                            {renderBadge(route)}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
