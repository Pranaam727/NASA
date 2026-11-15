import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PanelLeftClose,
  PanelLeft,
  Orbit,
  X,
  LogOut,
  Settings,
  User,
  ChevronUp,
} from 'lucide-react';
import { SidebarNavigation } from './SidebarNavigation';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';

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
  const { currentUser: authUser, logout } = useAuth();
  const { currentRole } = useRole();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // User display name & callsign
  const userName = authUser?.name || 'Cmdr. Marcus Chen';
  const roleDisplay = (authUser?.role || currentRole || 'ASTRONAUT').replace(/_/g, ' ');

  // Compute initials
  const initials = userName
    .split(' ')
    .filter((part) => !part.endsWith('.'))
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AC';

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-[#020807]/85 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Layered Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#06110F] border-r border-[rgba(55,210,185,0.18)] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[68px]' : 'w-[240px]'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-hidden select-none shadow-[4px_0_30px_rgba(0,0,0,0.9)]`}
      >
        {/* Layered Visual Depth: Radial Emerald & Cyan Flares */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-[radial-gradient(circle,_rgba(36,230,208,0.15)_0%,_rgba(0,175,160,0.04)_45%,_transparent_70%)] pointer-events-none blur-2xl -z-10" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[radial-gradient(circle,_rgba(0,175,160,0.08)_0%,_transparent_70%)] pointer-events-none blur-2xl -z-10" />

        {/* Faint Orbital Contour Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#24E6D0]/[0.025] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#24E6D0]/[0.02] pointer-events-none -z-10" />

        {/* Header: Logo, Brand Wordmark & Collapse Controls */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[rgba(80,210,185,0.18)] bg-[#06110F]/90 backdrop-blur-md shrink-0 relative z-10">
          <Link
            to={ROUTES.HOME}
            title="Return to Experience Overview"
            onClick={onMobileClose}
            className={`flex items-center ${
              isCollapsed ? 'justify-center w-full' : 'space-x-3'
            } min-w-0 group`}
          >
            {/* The Cyber Orbital Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-[#0A1916] border border-[#24E6D0]/40 flex items-center justify-center shrink-0 text-[#24E6D0] group-hover:border-[#24E6D0] group-hover:shadow-[0_0_15px_rgba(36,230,208,0.35)] transition-all duration-300">
              <Orbit className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 text-[#24E6D0]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-display text-sm font-extrabold tracking-wider text-[#F4FAF8] truncate leading-tight">
                  ASTRO<span className="text-[#24E6D0]">CARE</span>
                </h1>
                <p className="font-mono text-[8px] uppercase tracking-wider text-[#718C84] truncate">
                  SPACE HEALTH INTELLIGENCE
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse / Expand Toggle Button */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-[#718C84] hover:text-[#24E6D0] bg-[#0A1916]/60 hover:bg-[#0A1916] border border-[rgba(80,210,185,0.18)] hover:border-[#24E6D0]/40 transition-all duration-200"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Drawer Close Button */}
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation drawer"
            className="flex lg:hidden items-center justify-center w-7 h-7 rounded-lg text-[#718C84] hover:text-[#24E6D0] bg-[#0A1916] border border-[rgba(80,210,185,0.18)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Expand Button for Collapsed Rail Mode (Placed under header) */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-[rgba(80,210,185,0.12)]">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#718C84] hover:text-[#24E6D0] bg-[#0A1916]/80 hover:bg-[#0C2521] border border-[rgba(80,210,185,0.18)] hover:border-[#24E6D0]/40 transition-all duration-200 shadow-[0_0_8px_rgba(36,230,208,0.1)]"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Section with Scrollbar */}
        <SidebarNavigation isCollapsed={isCollapsed} onNavigate={onMobileClose} />

        {/* Profile Menu Popup Drawer (When profile clicked) */}
        {profileMenuOpen && !isCollapsed && (
          <div className="mx-2.5 mb-2 p-2 rounded-xl bg-[#0A1916] border border-[#24E6D0]/30 shadow-[0_4px_24px_rgba(0,0,0,0.9)] space-y-1 z-30 font-mono text-xs">
            <Link
              to={ROUTES.PROFILE}
              onClick={() => {
                setProfileMenuOpen(false);
                onMobileClose();
              }}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[#D7E8E3] hover:text-[#24E6D0] hover:bg-[#0C2521] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#24E6D0]" />
              <span>Astronaut Profile</span>
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              onClick={() => {
                setProfileMenuOpen(false);
                onMobileClose();
              }}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[#D7E8E3] hover:text-[#24E6D0] hover:bg-[#0C2521] transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#24E6D0]" />
              <span>Station Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[#FF646E] hover:bg-[#FF646E]/10 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate Session</span>
            </button>
          </div>
        )}

        {/* Bottom Profile & Status Section */}
        <div className="p-3 border-t border-[rgba(80,210,185,0.18)] bg-[#06110F]/95 backdrop-blur-md shrink-0 relative z-20">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } min-w-0`}
          >
            {/* User Details & Clickable Profile Area */}
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              title={isCollapsed ? `${userName} (${roleDisplay})` : 'Toggle Profile Menu'}
              className="flex items-center space-x-2.5 min-w-0 text-left group outline-none"
            >
              {/* User Avatar with Pulsing Online Beacon */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-[#0A1916] border border-[#24E6D0]/30 flex items-center justify-center font-mono text-xs font-bold text-[#24E6D0] group-hover:border-[#24E6D0] group-hover:shadow-[0_0_10px_rgba(36,230,208,0.25)] transition-all">
                  {initials}
                </div>
                {/* Live Online Telemetry Indicator Beacon */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#24E6D0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#24E6D0] border-2 border-[#06110F]" />
                </span>
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold text-[#D7E8E3] group-hover:text-[#F4FAF8] truncate transition-colors">
                      {userName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span
                      className={`inline-block font-mono text-[8px] px-1.5 py-0.2 rounded uppercase tracking-wider font-semibold ${
                        currentRole === 'ASTRONAUT'
                          ? 'bg-[#24E6D0]/15 text-[#24E6D0] border border-[#24E6D0]/30'
                          : currentRole === 'MEDICAL_OFFICER'
                            ? 'bg-[#8BFFE9]/15 text-[#8BFFE9] border border-[#8BFFE9]/30'
                            : 'bg-[#F5B94C]/15 text-[#F5B94C] border border-[#F5B94C]/30'
                      }`}
                    >
                      {roleDisplay}
                    </span>
                    <span className="font-mono text-[8px] text-[#24E6D0] tracking-tight">ONLINE</span>
                  </div>
                </div>
              )}
            </button>

            {/* Profile Menu Caret Toggle (Expanded Mode Only) */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label="Toggle profile actions"
                className="p-1 rounded-lg text-[#718C84] hover:text-[#24E6D0] hover:bg-[#0A1916] transition-colors"
              >
                <ChevronUp
                  className={`w-4 h-4 transition-transform duration-200 ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Collapsed Tooltip for Profile */}
          {isCollapsed && (
            <div className="absolute left-[calc(100%+10px)] bottom-3 hidden lg:group-hover:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0A1916] border border-[#24E6D0]/40 text-[#D7E8E3] text-xs font-mono whitespace-nowrap shadow-[0_4px_24px_rgba(0,0,0,0.9)] z-50 pointer-events-none">
              <span className="font-medium text-[#F4FAF8]">{userName}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0C2521] border border-[#24E6D0]/30 text-[#24E6D0]">
                {roleDisplay}
              </span>
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0A1916] border-l border-b border-[#24E6D0]/40 rotate-45" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
