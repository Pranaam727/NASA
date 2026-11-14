import React from 'react';
import { MissionNavigation } from './MissionNavigation';
import { Orbit, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { FOCUS_RING } from '../../design-system/utils';

interface MissionSidebarProps {
  currentRouteId: string;
  onNavigate: (routeId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const MissionSidebar: React.FC<MissionSidebarProps> = ({
  currentRouteId,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen bg-slate-50 dark:bg-[#070a12] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200 shrink-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-[60px] px-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Orbit className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="font-bold text-sm tracking-wide text-slate-900 dark:text-white truncate">
                ASTROCARE
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4">
          <MissionNavigation
            currentRouteId={currentRouteId}
            onNavigate={(routeId) => {
              onNavigate(routeId);
              onCloseMobile();
            }}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/40">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>P20/21 Module</span>
              </div>
              <button
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer ${FOCUS_RING}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer ${FOCUS_RING}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
