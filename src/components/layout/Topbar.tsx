import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Wifi, WifiOff, Clock } from 'lucide-react';
import { ROUTE_TITLES } from '@/constants/routes';
import { IS_DEMO_MODE } from '@/services/supabaseClient';

interface TopbarProps {
  onOpenMobileNav: () => void;
  isSidebarCollapsed: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileNav, isSidebarCollapsed }) => {
  const location = useLocation();

  // Find matching title from current pathname
  const currentTitle = ROUTE_TITLES[location.pathname] || 'Mission Console';

  // Running Mission Elapsed Time (MET) counter
  // Base: Sol 142, 18h 22m 04s
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

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-astro-bg-primary/95 backdrop-blur-sm border-b border-astro-border-hairline transition-all duration-200 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}
    >
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="p-1.5 rounded-sm text-astro-text-secondary hover:text-astro-text-primary lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-1.5 font-mono text-[9px] text-astro-text-tertiary uppercase tracking-wider">
            <span>ARES-VI</span>
            <span>/</span>
            <span className="truncate">{currentTitle}</span>
          </div>
          <h2 className="font-display text-xs md:text-sm font-bold text-astro-text-primary tracking-tight truncate">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right: Technical Instrumentation (Mission Identifier, MET, Comms Status, Notifications) */}
      <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
        {/* Mission Elapsed Time (MET) */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-astro-border-hairline rounded-sm">
          <Clock className="w-3.5 h-3.5 text-astro-text-secondary" />
          <div className="flex flex-col text-right">
            <span className="font-mono text-[8px] uppercase tracking-wider text-astro-text-tertiary leading-none">
              MET
            </span>
            <span className="font-mono text-xs font-semibold tabular-nums text-astro-text-primary leading-none mt-0.5">
              {formatMet(secondsElapsed)}
            </span>
          </div>
        </div>

        {/* Backend Connection Status Badge */}
        <div
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-sm border font-mono text-[10px] uppercase tracking-wider ${
            IS_DEMO_MODE
              ? 'bg-astro-status-sandstone/20 text-[#7A6643] border-astro-status-sandstone/40'
              : 'bg-astro-status-healthy/10 text-astro-status-healthy border-astro-status-healthy/30'
          }`}
          title={
            IS_DEMO_MODE
              ? 'Demo Mode Active: High-fidelity in-memory virtual simulation engine'
              : 'Supabase Database Connected'
          }
        >
          {IS_DEMO_MODE ? (
            <>
              <WifiOff className="w-3 h-3 text-astro-status-caution shrink-0" />
              <span className="hidden md:inline">DEMO SIMULATION</span>
              <span className="md:hidden">DEMO</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 text-astro-status-healthy shrink-0" />
              <span className="hidden md:inline">SUPABASE SYNC</span>
              <span className="md:hidden">LIVE</span>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="View system alerts"
          className="relative p-1.5 rounded-sm text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-astro-status-critical rounded-full ring-2 ring-astro-bg-primary" />
        </button>
      </div>
    </header>
  );
};
