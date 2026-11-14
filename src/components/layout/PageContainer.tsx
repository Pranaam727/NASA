import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'standard' | 'wide' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = 'standard',
}) => {
  const maxMap = {
    standard: 'max-w-7xl',
    wide: 'max-w-[1600px]',
    full: 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 ${maxMap[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  metadata?: Array<{ label: string; value: string | number }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  metadata,
  className = '',
}) => {
  return (
    <div
      className={`pb-5 border-b border-astro-border-hairline flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center space-x-2.5">
          <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-astro-text-primary">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && <p className="font-body text-xs md:text-sm text-astro-text-secondary">{subtitle}</p>}
        {metadata && metadata.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 font-mono text-[10px] text-astro-text-tertiary">
            {metadata.map((item, idx) => (
              <span key={idx} className="flex items-center space-x-1">
                <span className="uppercase">{item.label}:</span>
                <span className="text-astro-text-primary font-semibold">{item.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
    </div>
  );
};

export const SectionHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, description, action, className = '' }) => {
  return (
    <div className={`flex items-center justify-between pb-2 border-b border-astro-border-hairline/60 ${className}`}>
      <div>
        <h3 className="font-display text-xs md:text-sm font-semibold tracking-tight text-astro-text-primary uppercase">
          {title}
        </h3>
        {description && (
          <p className="font-body text-[11px] text-astro-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
