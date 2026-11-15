import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Wifi,
  WifiOff,
  Clock,
  Shield,
  Orbit,
  RefreshCw,
  LogOut,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { ROUTE_TITLES, ROUTES } from '@/constants/routes';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { UserRole } from '@/types/database.types';

interface TopbarProps {
  onOpenMobileNav: () => void;
  isSidebarCollapsed?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setRole } = useRole();
  const { currentUser, logout } = useAuth();
  const { status: syncStatus, isOffline, pendingQueue, toggleOfflineSimulation } = useOfflineSync();

  // Find matching title from current pathname
  const currentTitle = ROUTE_TITLES[location.pathname] || 'Mission Console';

  // Running Mission Elapsed Time (MET) counter
  const [secondsElapsed, setSecondsElapsed] = useState(142 * 86400 + 18 * 3600 + 22 * 60 + 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMet = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const getDashboardRoute = () => {
    if (currentRole === 'ASTRONAUT') return ROUTES.ASTRONAUT_DASHBOARD;
    if (currentRole === 'MEDICAL_OFFICER') return ROUTES.MEDICAL_DASHBOARD;
    return ROUTES.COMMANDER_DASHBOARD;
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-[#06110F]/95 backdrop-blur-md border-b border-[rgba(55,210,185,0.18)] transition-colors duration-200"
    >
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="p-1.5 rounded-lg text-[#91A9A4] hover:text-[#24E6D0] hover:bg-[#0A1716] lg:hidden transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-1.5 font-mono text-[9px] text-[#5B7B75] uppercase tracking-wider">
            <span className="text-[#24E6D0] font-bold">NASA ARES-VI</span>
            <span>/</span>
            <span className="truncate">{currentTitle}</span>
          </div>
          <h2 className="font-space text-xs md:text-sm font-bold text-[#F4FAF8] tracking-tight truncate">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right: Technical Instrumentation */}
      <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
        {/* Dedicated Role Dashboard Shortcut */}
        <Link
          to={getDashboardRoute()}
          title="Open Dedicated Role Dashboard"
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-semibold bg-[#0A1716] border border-[#24E6D0]/25 rounded-lg hover:border-[#24E6D0] text-[#F4FAF8] transition-all shadow-cyberGlow"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#24E6D0]" />
          <span className="hidden xl:inline">MY DASHBOARD</span>
        </Link>

        {/* Link back to 3D Landing Page */}
        <Link
          to={ROUTES.HOME}
          title="Return to 3D Landing Page"
          className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-semibold bg-[#0A1716] border border-[#24E6D0]/20 rounded-lg hover:border-[#24E6D0] text-[#91A9A4] hover:text-[#F4FAF8] transition-all shadow-sm"
        >
          <Orbit className="w-3.5 h-3.5 text-[#24E6D0]" />
          <span>3D EARTH</span>
        </Link>

        {/* Role Switcher Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#0A1716] border border-[#24E6D0]/25 rounded-lg text-xs font-mono shadow-sm">
          <Shield className="w-3.5 h-3.5 text-[#24E6D0]" />
          <span className="text-[10px] text-[#5B7B75] uppercase hidden sm:inline">ROLE:</span>
          <select
            value={currentRole === 'MISSION_COMMANDER' ? 'MISSION_CONTROLLER' : currentRole}
            onChange={(e) => {
              const r = e.target.value as UserRole;
              setRole(r);
            }}
            className="bg-transparent font-bold text-[#F4FAF8] text-xs focus:outline-none cursor-pointer"
          >
            <option value="ASTRONAUT" className="bg-[#0A1716] text-[#F4FAF8]">Astronaut (Cmdr. Chen)</option>
            <option value="MEDICAL_OFFICER" className="bg-[#0A1716] text-[#F4FAF8]">Medical Officer (Dr. Vance)</option>
            <option value="MISSION_CONTROLLER" className="bg-[#0A1716] text-[#F4FAF8]">Mission Commander (Dir. Hayes)</option>
          </select>
        </div>

        {/* Offline Sync Status & Toggle */}
        <button
          type="button"
          onClick={toggleOfflineSimulation}
          title={`Click to toggle offline mode simulation. Pending items: ${pendingQueue.length}`}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-colors shadow-sm ${
            isOffline
              ? 'bg-[#FF646E]/15 text-[#FF646E] border-[#FF646E]/40'
              : syncStatus === 'SYNCING'
              ? 'bg-[#24E6D0]/15 text-[#8BFFE9] border-[#24E6D0]/40'
              : 'bg-[#0A1716] text-[#24E6D0] border-[#24E6D0]/30'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3 h-3 shrink-0" />
              <span>OFFLINE (MARS DELAY)</span>
            </>
          ) : syncStatus === 'SYNCING' ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
              <span>SYNCING...</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 shrink-0 text-[#24E6D0]" />
              <span className="hidden sm:inline">ONLINE {pendingQueue.length > 0 ? `(${pendingQueue.length} Q)` : ''}</span>
              <span className="sm:hidden">SYNC</span>
            </>
          )}
        </button>

        {/* Mission Elapsed Time (MET) */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-[#0A1716] border border-[#24E6D0]/25 rounded-lg shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#5B7B75]" />
          <div className="flex flex-col text-right">
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#5B7B75] leading-none">
              MET
            </span>
            <span className="font-mono text-xs font-bold tabular-nums text-[#8BFFE9] leading-none mt-0.5">
              {formatMet(secondsElapsed)}
            </span>
          </div>
        </div>

        {/* Profile Link */}
        <Link
          to={ROUTES.PROFILE}
          title={currentUser ? `${currentUser.name} (${currentUser.role})` : 'User Profile'}
          className="p-1.5 rounded-lg text-[#91A9A4] hover:text-[#24E6D0] hover:bg-[#0A1716] transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>

        {/* Notification Bell */}
        <Link
          to={ROUTES.ALERTS}
          aria-label="View system alerts"
          className="relative p-1.5 rounded-lg text-[#91A9A4] hover:text-[#24E6D0] hover:bg-[#0A1716] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF646E] rounded-full ring-2 ring-[#020807]" />
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out / Change Identity"
          className="p-1.5 rounded-lg text-[#91A9A4] hover:text-[#FF646E] hover:bg-[#0A1716] transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
