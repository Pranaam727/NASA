import React, { useState } from 'react';
import { Radio, Search, Bell, Shield, ExternalLink, Menu, X, Orbit } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProvenanceType } from '../types/dataset.types';

interface NavbarProps {
  onSearchSubmit?: (query: string) => void;
  provenance?: ProvenanceType;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchSubmit,
  provenance = 'CACHED_NASA_BENCHMARK',
  onToggleSidebar,
  isSidebarOpen = true
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit?.(searchInput);
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Brand & Module Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Orbit className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-slate-100 uppercase">
                AstroCare
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                P15
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              NASA Biomedical Dataset Intelligence & OSDR Explorer
            </div>
          </div>
        </div>
      </div>

      {/* Global Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search OSDR study (e.g. OSD-575, Inspiration4, radiation)..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Right Telemetry & Status Badges */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <StatusBadge type="provenance" value={provenance} />
        </div>

        <a
          href="https://osdr.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
        >
          <span>NASA OSDR Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Notification Bell */}
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            AC
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <div className="font-semibold text-slate-200">Biomed Officer</div>
            <div className="text-[10px] text-slate-500">Flight Surgeon Console</div>
          </div>
        </div>
      </div>
    </header>
  );
};
