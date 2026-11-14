import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  ShieldCheck, 
  User, 
  ExternalLink,
  X
} from 'lucide-react';

interface HeaderNavProps {
  onOpenMobileMenu: () => void;
  onSearchSubmit?: (query: string) => void;
  activeMissionName?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenMobileMenu,
  onSearchSubmit,
  activeMissionName = 'ISS Expedition Baseline'
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'OSDR Dataset Cache Synced',
      time: '12m ago',
      desc: 'Authentic studies OSD-37 through OSD-483 indexed with verified metadata.'
    },
    {
      id: 2,
      title: 'NASA 600 mSv Standard Active',
      time: '1h ago',
      desc: 'Radiation risk threshold updated to the unified 2022 HRP career standard.'
    },
    {
      id: 3,
      title: 'TBone HR-pQCT Update',
      time: 'Yesterday',
      desc: '12-month post-flight trabecular microarchitectural kinetics documented.'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchVal.trim()) {
      onSearchSubmit(searchVal);
    }
  };

  return (
    <header className="h-16 bg-space-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      
      {/* Left Mobile Menu Toggle + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-space-900"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search NASA risks, evidence, OSDR datasets, countermeasures..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-space-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Active Mission Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-space-900 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-400">Context:</span>
          <span className="font-medium text-slate-200 truncate max-w-[150px]">
            {activeMissionName}
          </span>
        </div>

        {/* Live OSDR API Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>NASA OSDR Verified</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-space-900 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-space-900 border border-slate-700/80 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-slate-200">
                <span>Biomedical Intelligence Alerts</span>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                </button>
              </div>
              <div className="divide-y divide-slate-800/60 mt-1 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 text-center">
                <a
                  href="https://humanresearchroadmap.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
                >
                  NASA HRP Roadmap Updates <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 p-0.5">
            <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center">
              <User className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              Flight Surgeon / PI
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              HRP Research Node
            </div>
          </div>
        </div>

      </div>

    </header>
  );
};
