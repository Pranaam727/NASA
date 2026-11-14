import React from 'react';
import { PanelLeftClose, PanelLeft, Shield, User } from 'lucide-react';
import { SidebarNavigation } from './SidebarNavigation';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-astro-text-primary/30 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-astro-bg-secondary border-r border-astro-border-hairline transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-60'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-hidden select-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14 px-3.5 border-b border-astro-border-hairline bg-astro-bg-secondary shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* The Biometric Horizon Logo Mark */}
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <circle cx="16" cy="16" r="14" stroke="#242824" strokeWidth="1.5" />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="14"
                  ry="7"
                  stroke="#738174"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  transform="rotate(-15 16 16)"
                />
                <path
                  d="M6 16H11L13 11L16 21L19 13L21 16H26"
                  stroke="#D16C48"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="16" r="2" fill="#242824" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-display text-xs font-extrabold tracking-wider text-astro-text-primary truncate">
                  ASTROCARE
                </h1>
                <p className="font-mono text-[8px] tracking-tight text-astro-text-secondary truncate">
                  MISSION HEALTH INTEL
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-sm text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle transition-colors"
          >
            {isCollapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation List */}
        <SidebarNavigation isCollapsed={isCollapsed} onNavigate={onMobileClose} />

        {/* User Profile / Status Footer */}
        <div className="p-3 border-t border-astro-border-hairline bg-astro-bg-secondary shrink-0">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } min-w-0`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline flex items-center justify-center shrink-0 text-astro-text-primary">
                <User className="w-3.5 h-3.5" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-[10px] font-semibold text-astro-text-primary truncate">
                      SURGEON-1
                    </span>
                    <Shield className="w-2.5 h-2.5 text-astro-status-healthy shrink-0" />
                  </div>
                  <span className="font-mono text-[8px] text-astro-text-secondary uppercase tracking-tight block truncate">
                    FLIGHT MEDICAL OFFICER
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
