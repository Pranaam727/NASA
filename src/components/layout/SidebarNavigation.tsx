import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getNavigationForRole } from '@/constants/navigation';
import { useRole } from '@/context/RoleContext';
import { ROUTES } from '@/constants/routes';

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isCollapsed,
  onNavigate,
}) => {
  const { currentRole } = useRole();
  const location = useLocation();
  const navGroups = getNavigationForRole(currentRole);

  const checkIsActive = (path: string, exact?: boolean) => {
    if (exact || path === ROUTES.DASHBOARD || path === ROUTES.HOME) {
      return location.pathname === path;
    }
    if (location.pathname === path) return true;

    // Handle dashboard aliases for roles
    if (
      path === ROUTES.ASTRONAUT_DASHBOARD &&
      (location.pathname === ROUTES.ASTRONAUT_DASHBOARD || location.pathname === ROUTES.DASHBOARD)
    ) {
      return true;
    }
    if (
      path === ROUTES.MEDICAL_DASHBOARD &&
      (location.pathname === ROUTES.MEDICAL_DASHBOARD || location.pathname === ROUTES.DASHBOARD)
    ) {
      return true;
    }
    if (
      path === ROUTES.COMMANDER_DASHBOARD &&
      (location.pathname === ROUTES.COMMANDER_DASHBOARD || location.pathname === ROUTES.DASHBOARD)
    ) {
      return true;
    }

    // Handle subroutes (e.g. /astronauts/:id)
    if (path !== '/' && location.pathname.startsWith(path + '/')) {
      return true;
    }
    return false;
  };

  return (
    <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 select-none" aria-label="Main Navigation">
      {navGroups.map((group) => (
        <div key={group.groupName} className="space-y-1">
          {!isCollapsed && (
            <h3 className="px-2.5 pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#57766D] select-none">
              {group.groupName}
            </h3>
          )}

          <ul className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = checkIsActive(item.path, item.exact);

              return (
                <li key={`${group.groupName}-${item.name}-${item.path}`} className="relative group">
                  <Link
                    to={item.path}
                    onClick={onNavigate}
                    className={`relative flex items-center h-9 px-2.5 rounded-xl transition-all duration-200 outline-none text-xs font-mono ${
                      isActive
                        ? 'bg-[#0C2521] border border-[#21E6D0]/40 text-[#E8F4F0] font-bold shadow-[0_0_14px_rgba(33,230,208,0.22)]'
                        : 'text-[#8CA8A0] hover:text-[#E8F4F0] hover:bg-[#0A1715] border border-transparent hover:border-[#21E6D0]/20 hover:shadow-[0_0_8px_rgba(33,230,208,0.12)]'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#21E6D0] rounded-r-full shadow-[0_0_10px_#21E6D0]" />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'text-[#21E6D0] drop-shadow-[0_0_6px_rgba(33,230,208,0.6)]'
                            : 'text-[#57766D] group-hover:text-[#21E6D0]'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className={`truncate text-xs ${isActive ? 'text-[#E8F4F0] font-bold' : 'text-[#8CA8A0]'}`}>
                          {item.name}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                          item.badge === 'LIVE'
                            ? 'bg-[#21E6D0]/15 text-[#21E6D0] border-[#21E6D0]/40 font-bold shadow-[0_0_6px_rgba(33,230,208,0.3)]'
                            : item.badge === 'ACTIVE'
                              ? 'bg-[#21E6D0]/20 text-[#8BFFE9] border-[#21E6D0]/40 font-bold'
                              : item.badge === 'CRITICAL'
                                ? 'bg-[#FF6475]/15 text-[#FF6475] border-[#FF6475]/40 font-bold animate-pulse'
                                : item.badge === 'GEMINI'
                                  ? 'bg-[#8BFFE9]/15 text-[#8BFFE9] border-[#8BFFE9]/30 font-bold'
                                  : 'bg-[#0A1715] text-[#57766D] border-[rgba(55,210,185,0.18)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip in Collapsed Rail Mode */}
                  {isCollapsed && (
                    <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 hidden lg:group-hover:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0A1715] border border-[#21E6D0]/40 text-[#E8F4F0] text-xs font-mono whitespace-nowrap shadow-[0_4px_24px_rgba(0,0,0,0.9)] z-50 pointer-events-none transition-all">
                      <span className="font-medium text-[#E8F4F0]">{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0C2521] border border-[#21E6D0]/40 text-[#21E6D0] font-bold">
                          {item.badge}
                        </span>
                      )}
                      {/* Tooltip Caret */}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0A1715] border-l border-b border-[#21E6D0]/40 rotate-45" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
