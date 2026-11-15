import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Activity,
  HeartPulse,
  History,
  Heart,
  Bone,
  ShieldCheck,
  Brain,
  Moon,
  Radiation,
  TrendingUp,
  AlertTriangle,
  Compass,
  GitCompare,
  FileText,
  Settings,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const navItems: NavItem[] = [
    {
      name: 'Digital Twin Overview',
      path: '/digital-twin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      category: 'Core Twin',
    },
    {
      name: 'Astronaut Profiles',
      path: '/digital-twin/profiles',
      icon: <Users className="w-4 h-4" />,
      category: 'Core Twin',
    },
    {
      name: 'Physiological Dashboard',
      path: '/digital-twin/physiology',
      icon: <Activity className="w-4 h-4" />,
      category: 'Core Twin',
    },
    {
      name: 'Vital Signs Monitoring',
      path: '/digital-twin/vitals',
      icon: <HeartPulse className="w-4 h-4" />,
      category: 'Longitudinal Telemetry',
    },
    {
      name: 'Health Timeline',
      path: '/digital-twin/timeline',
      icon: <History className="w-4 h-4" />,
      category: 'Longitudinal Telemetry',
    },
    {
      name: 'Cardiovascular Twin',
      path: '/digital-twin/cardiovascular',
      icon: <Heart className="w-4 h-4" />,
      category: 'Physiological Domains',
    },
    {
      name: 'Bone & Muscle Twin',
      path: '/digital-twin/musculoskeletal',
      icon: <Bone className="w-4 h-4" />,
      category: 'Physiological Domains',
    },
    {
      name: 'Immune Health Twin',
      path: '/digital-twin/immune',
      icon: <ShieldCheck className="w-4 h-4" />,
      category: 'Physiological Domains',
    },
    {
      name: 'Neurological Health Twin',
      path: '/digital-twin/neurological',
      icon: <Brain className="w-4 h-4" />,
      category: 'Physiological Domains',
    },
    {
      name: 'Sleep & Circadian Twin',
      path: '/digital-twin/sleep',
      icon: <Moon className="w-4 h-4" />,
      category: 'Physiological Domains',
    },
    {
      name: 'Radiation Exposure Context',
      path: '/digital-twin/radiation',
      icon: <Radiation className="w-4 h-4" />,
      category: 'Physiological Domains',
    },
    {
      name: 'Predictive Analytics',
      path: '/digital-twin/predictions',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'Intelligence & Modeling',
      badge: 'ML/Stats',
    },
    {
      name: 'Anomaly Detection',
      path: '/digital-twin/anomalies',
      icon: <AlertTriangle className="w-4 h-4" />,
      category: 'Intelligence & Modeling',
    },
    {
      name: 'Mission Simulation',
      path: '/digital-twin/simulator',
      icon: <Compass className="w-4 h-4" />,
      category: 'Intelligence & Modeling',
    },
    {
      name: 'Health Comparison',
      path: '/digital-twin/comparison',
      icon: <GitCompare className="w-4 h-4" />,
      category: 'Analysis & Output',
    },
    {
      name: 'Reports & Insights',
      path: '/digital-twin/reports',
      icon: <FileText className="w-4 h-4" />,
      category: 'Analysis & Output',
    },
    {
      name: 'Settings',
      path: '/digital-twin/settings',
      icon: <Settings className="w-4 h-4" />,
      category: 'System',
    },
  ];

  // Group items by category
  const categories = Array.from(new Set(navItems.map((item) => item.category)));

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {categories.map((cat) => (
          <div key={cat} className="space-y-1">
            <h4 className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              {cat}
            </h4>
            {navItems
              .filter((item) => item.category === cat)
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/digital-twin'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>AstroCare Engine</span>
          <span className="font-mono text-cyan-400">v17.0.4</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-600">
          Module Isolated Standalone Build
        </p>
      </div>
    </aside>
  );
};
