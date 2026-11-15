// AstroCare P11 — Application Layout

import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import {
  Activity,
  Moon,
  Clock,
  Heart,
  Brain,
  Users,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Satellite,
} from 'lucide-react';

const navItems = [
  { to: '/wellness', label: 'Dashboard', icon: Activity, end: true },
  { to: '/wellness/sleep', label: 'Sleep Analytics', icon: Moon },
  { to: '/wellness/circadian', label: 'Circadian', icon: Clock },
  { to: '/wellness/mental', label: 'Mental Wellness', icon: Heart },
  { to: '/wellness/cognitive', label: 'Cognitive', icon: Brain },
  { to: '/wellness/team', label: 'Team Cohesion', icon: Users },
  { to: '/wellness/recommendations', label: 'Guidance', icon: Sparkles },
  { to: '/wellness/research', label: 'NASA Research', icon: BookOpen },
];

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find(
    (n) => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0d14]">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-[#1e2a3a] bg-[#0f1520] transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-56'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1e2a3a]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
            <Satellite className="w-4 h-4 text-[#3b82f6]" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-bold text-[#e8edf5] leading-none">AstroCare</p>
              <p className="text-xs text-[#8fa3be] mt-0.5">P11 · Wellness</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors mb-0.5',
                  isActive
                    ? 'bg-[#1e3a5f] text-[#3b82f6]'
                    : 'text-[#8fa3be] hover:text-[#e8edf5] hover:bg-[#131924]'
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Mission info */}
        {!sidebarCollapsed && (
          <div className="border-t border-[#1e2a3a] px-4 py-3">
            <p className="text-xs text-[#4a6080] mb-1">Active Mission</p>
            <p className="text-xs font-medium text-[#8fa3be]">Expedition 72 Alpha</p>
            <p className="text-xs text-[#4a6080]">Day 180 · CREW-07-ALPHA</p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="border-t border-[#1e2a3a] px-4 py-2.5 text-[#4a6080] hover:text-[#8fa3be] flex items-center justify-center transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[#1e2a3a] bg-[#0f1520]">
          <div>
            <h1 className="text-sm font-semibold text-[#e8edf5]">
              {currentPage?.label || 'Wellness'}
            </h1>
            <p className="text-xs text-[#4a6080]">Astronaut Health Intelligence · Demonstration Module</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#f59e0b]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulated Data</span>
            </div>
            <div className="w-px h-4 bg-[#1e2a3a]" />
            <div className="text-xs text-[#4a6080]">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
