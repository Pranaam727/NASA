import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-astro-bg-primary text-astro-text-primary flex flex-col font-body">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenMobileNav={() => setMobileOpen(true)}
          isSidebarCollapsed={isCollapsed}
        />

        <main
          className={`flex-1 transition-all duration-200 ${
            isCollapsed ? 'lg:pl-16' : 'lg:pl-60'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
