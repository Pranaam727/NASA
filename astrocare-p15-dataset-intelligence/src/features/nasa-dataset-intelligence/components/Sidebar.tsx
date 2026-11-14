import React from 'react';
import { 
  LayoutDashboard, Search, Database, Stethoscope, User, 
  ShieldAlert, SunMedium, HeartPulse, Bone, Moon, 
  GitCompare, TrendingUp, BarChart2, FileText, Settings,
  Sparkles
} from 'lucide-react';

export type NavigationPage = 
  | 'overview'
  | 'explorer'
  | 'catalogue'
  | 'biomedical'
  | 'human-studies'
  | 'immune'
  | 'radiation'
  | 'cardiovascular'
  | 'bone-muscle'
  | 'sleep-behavioral'
  | 'comparison'
  | 'longitudinal'
  | 'visualization'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpen?: boolean;
  comparisonCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen = true,
  comparisonCount = 0
}) => {
  const navSections = [
    {
      category: 'DATA REPOSITORY DISCOVERY',
      items: [
        { id: 'overview' as NavigationPage, label: 'Overview', icon: LayoutDashboard },
        { id: 'explorer' as NavigationPage, label: 'NASA Dataset Explorer', icon: Search },
        { id: 'catalogue' as NavigationPage, label: 'Dataset Catalogue', icon: Database },
        { id: 'biomedical' as NavigationPage, label: 'Biomedical Research', icon: Stethoscope },
        { id: 'human-studies' as NavigationPage, label: 'Human Spaceflight Studies', icon: User }
      ]
    },
    {
      category: 'PHYSIOLOGICAL RESEARCH DOMAINS',
      items: [
        { id: 'immune' as NavigationPage, label: 'Immune System Datasets', icon: ShieldAlert },
        { id: 'radiation' as NavigationPage, label: 'Radiation Research', icon: SunMedium },
        { id: 'cardiovascular' as NavigationPage, label: 'Cardiovascular Research', icon: HeartPulse },
        { id: 'bone-muscle' as NavigationPage, label: 'Bone and Muscle Research', icon: Bone },
        { id: 'sleep-behavioral' as NavigationPage, label: 'Sleep and Behavioral Research', icon: Moon }
      ]
    },
    {
      category: 'ADVANCED ANALYTICS & STUDIO',
      items: [
        { 
          id: 'comparison' as NavigationPage, 
          label: 'Comparative Analytics', 
          icon: GitCompare,
          badge: comparisonCount > 0 ? comparisonCount : undefined 
        },
        { id: 'longitudinal' as NavigationPage, label: 'Longitudinal Analysis', icon: TrendingUp },
        { id: 'visualization' as NavigationPage, label: 'Data Visualization Studio', icon: BarChart2 },
        { id: 'reports' as NavigationPage, label: 'Research Reports', icon: FileText },
        { id: 'settings' as NavigationPage, label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={`w-72 bg-slate-950 border-r border-slate-800/80 shrink-0 flex flex-col justify-between transition-all duration-300 z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="overflow-y-auto py-5 px-3 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {section.category}
            </div>
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer telemetry */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/60 text-[11px] text-slate-500 space-y-1 font-mono">
        <div className="flex items-center justify-between">
          <span>NASA OSDR Engine</span>
          <span className="text-emerald-400 font-bold">ONLINE</span>
        </div>
        <div className="text-[10px] text-slate-600 truncate">
          AstroCare Spaceflight Biomedical Intel
        </div>
      </div>
    </aside>
  );
};
