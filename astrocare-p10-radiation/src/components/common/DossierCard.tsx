import React from 'react';

interface DossierCardProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export const DossierCard: React.FC<DossierCardProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  contentClassName = '',
  noPadding = false,
}) => {
  const hasHeader = title || subtitle || badge || action;

  return (
    <div
      className={`bg-white border border-astro-border-hairline rounded-sm transition-shadow duration-150 ${className}`}
    >
      {hasHeader && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-astro-border-hairline bg-astro-bg-surface">
          <div className="flex items-center space-x-2 min-w-0">
            <div>
              {title && (
                <h4 className="font-display text-xs md:text-sm font-semibold tracking-tight text-astro-text-primary truncate">
                  {title}
                </h4>
              )}
              {subtitle && (
                <p className="font-mono text-[10px] text-astro-text-secondary truncate">
                  {subtitle}
                </p>
              )}
            </div>
            {badge && <div>{badge}</div>}
          </div>
          {action && <div className="shrink-0 ml-2">{action}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-4'} ${contentClassName}`}>{children}</div>
    </div>
  );
};
