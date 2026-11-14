import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '@/constants/navigation';

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isCollapsed,
  onNavigate,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5" aria-label="Main Navigation">
      {NAVIGATION_CONFIG.map((group) => (
        <div key={group.groupName} className="space-y-1">
          {!isCollapsed && (
            <h3 className="px-2.5 pb-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-astro-text-tertiary select-none">
              {group.groupName}
            </h3>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group relative flex items-center h-8 px-2.5 rounded-sm transition-colors duration-150 outline-none text-xs ${
                        isActive
                          ? 'bg-astro-bg-subtle text-astro-text-primary font-semibold'
                          : 'text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle/60'
                      } ${isCollapsed ? 'justify-center' : 'justify-between'}`
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {/* Active left indicator bar */}
                          {isActive && (
                            <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-astro-text-primary rounded-r-sm" />
                          )}
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive
                                ? 'text-astro-text-primary'
                                : 'text-astro-text-secondary group-hover:text-astro-text-primary'
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span
                            className={`font-mono text-[9px] px-1 py-0.2 rounded-sm border ${
                              item.badge === 'LIVE'
                                ? 'bg-astro-status-healthy/10 text-astro-status-healthy border-astro-status-healthy/30'
                                : item.badge === 'GEMINI'
                                  ? 'bg-astro-status-caution/10 text-astro-status-caution border-astro-status-caution/30'
                                  : 'bg-astro-bg-subtle text-astro-text-secondary border-astro-border-hairline'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
