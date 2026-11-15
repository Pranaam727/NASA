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
      className={`bg-[#0D1D1B] border border-[#24E6D0]/20 rounded-2xl shadow-cyberCard transition-all duration-300 hover:border-[#24E6D0]/50 hover:shadow-cyberCardHover ${className}`}
    >
      {hasHeader && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#24E6D0]/15 bg-[#0A1716]/80 rounded-t-2xl">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div>
              {title && (
                <h4 className="font-display text-xs md:text-sm font-bold tracking-tight text-[#F4FAF8] truncate uppercase">
                  {title}
                </h4>
              )}
              {subtitle && (
                <p className="font-mono text-[10px] text-[#91A9A4] tracking-wider truncate uppercase">
                  {subtitle}
                </p>
              )}
            </div>
            {badge && <div>{badge}</div>}
          </div>
          {action && <div className="shrink-0 ml-2">{action}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-5'} text-[#91A9A4] ${contentClassName}`}>{children}</div>
    </div>
  );
};
