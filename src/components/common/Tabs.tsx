import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div
      role="tablist"
      className={`flex items-center space-x-1 border-b border-astro-border-hairline ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative py-2 px-3 text-xs md:text-sm font-medium transition-colors duration-150 outline-none ${
              isActive
                ? 'text-astro-text-primary font-semibold'
                : 'text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`font-mono text-[10px] px-1 py-0.2 rounded-sm ${
                    isActive
                      ? 'bg-astro-text-primary text-astro-bg-primary'
                      : 'bg-astro-bg-subtle text-astro-text-secondary'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-astro-text-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
};
