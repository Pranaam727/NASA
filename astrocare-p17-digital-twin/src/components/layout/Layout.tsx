import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AstronautProfile } from '../../types';

interface LayoutProps {
  profiles: AstronautProfile[];
  activeProfile: AstronautProfile;
  onSelectProfile: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={onSelectProfile}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-[#080c14] to-[#0b101d]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
