import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  HeartPulse, 
  Dumbbell, 
  Zap, 
  Shield, 
  Moon, 
  Eye, 
  BookOpen, 
  Search, 
  Wrench, 
  Rocket, 
  Settings,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentRoute,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems = [
    { label: 'Overview', route: '/risks', icon: LayoutDashboard },
    { label: 'Spaceflight Risk Dashboard', route: '/risks/dashboard', icon: Activity },
    { label: 'Risk Categories', route: '/risks/categories', icon: ShieldAlert },
    
    // Dedicated physiological risks
    { label: 'Cardiovascular Risks', route: '/risks/cardiovascular', icon: HeartPulse, section: 'Biomedical Domains' },
    { label: 'Bone and Muscle Risks', route: '/risks/bone-muscle', icon: Dumbbell },
    { label: 'Radiation Risks', route: '/risks/radiation', icon: Zap },
    { label: 'Immune System Risks', route: '/risks/immune', icon: Shield },
    { label: 'Sleep and Psychological Risks', route: '/risks/sleep-psychological', icon: Moon },
    { label: 'Vision and Neurological Risks', route: '/risks/vision-neurological', icon: Eye },

    // Research & Evidence
    { label: 'NASA Evidence Library', route: '/risks/evidence', icon: BookOpen, section: 'NASA Evidence & Systems' },
    { label: 'Research Explorer (OSDR)', route: '/risks/research', icon: Search },
    { label: 'Mitigation Strategies', route: '/risks/mitigation', icon: Wrench },
    { label: 'Mission Risk Analysis', route: '/risks/mission-analysis', icon: Rocket },
    { label: 'Settings', route: '/risks/settings', icon: Settings, section: 'Platform' }
  ];

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-space-950 border-r border-slate-800/90 
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Branding */}
        <div>
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-900/30">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold tracking-tight text-slate-100 text-sm">
                  ASTROCARE
                </span>
                <span className="text-[10px] font-mono text-cyan-400 block -mt-1 tracking-wider">
                  P14 • RISK INTEL
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)] text-xs">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;

              return (
                <React.Fragment key={idx}>
                  {item.section && (
                    <div className="px-3 pt-3 pb-1 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                      {item.section}
                    </div>
                  )}
                  <button
                    onClick={() => handleItemClick(item.route)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all
                      ${isActive 
                        ? 'bg-cyan-950/70 text-cyan-300 font-medium border border-cyan-800/60 shadow-sm' 
                        : 'text-slate-300 hover:text-slate-100 hover:bg-space-900/80'}
                    `}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Bottom NASA HRP Link Box */}
        <div className="p-3 border-t border-slate-800/80 bg-space-900/40 m-2 rounded-xl">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1">
            <span>NASA HRP Standard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight mb-2">
            Grounded in Human Research Roadmap & NTRS evidence.
          </p>
          <a
            href="https://humanresearchroadmap.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
          >
            Roadmap Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
};
