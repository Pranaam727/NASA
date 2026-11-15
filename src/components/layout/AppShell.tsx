import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030A09] text-[#E8F4F0] flex flex-col font-body selection:bg-[#21E6D0] selection:text-[#030A09]">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 bg-[#030A09] cyber-grid transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-[240px]'
        }`}
      >
        <Topbar
          onOpenMobileNav={() => setMobileOpen(true)}
          isSidebarCollapsed={isCollapsed}
        />

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
