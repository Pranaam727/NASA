import React from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  legend?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  badge,
  legend,
  children,
  height = 240,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-astro-border-hairline rounded-sm p-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-3 border-b border-astro-border-hairline/60 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-display text-xs md:text-sm font-semibold tracking-tight text-astro-text-primary">
              {title}
            </h4>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="font-mono text-[10px] text-astro-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        {legend && <div className="shrink-0">{legend}</div>}
      </div>
      <div style={{ height }} className="w-full">
        {children}
      </div>
    </div>
  );
};

export interface ChartTooltipPayloadItem {
  name: string;
  value: number | string;
  color?: string;
  unit?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
    payload?: { unit?: string };
  }>;
  label?: string | number;
  unit?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, unit }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-astro-border-hairline p-2.5 rounded-sm shadow-subtle font-mono text-[11px] min-w-[120px]">
      {label !== undefined && (
        <div className="text-[10px] uppercase text-astro-text-tertiary border-b border-astro-border-hairline/60 pb-1 mb-1.5">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={`tooltip-item-${idx}`} className="flex items-center justify-between space-x-3">
            <span className="flex items-center space-x-1.5 text-astro-text-secondary">
              <span className="w-2 h-2 rounded-none" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}:</span>
            </span>
            <span className="font-semibold text-astro-text-primary tabular-nums">
              {entry.value} {entry.payload?.unit || unit || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartLegend: React.FC<{
  items: Array<{ label: string; color: string; dashed?: boolean }>;
}> = ({ items }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-astro-text-secondary">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-1.5">
          <span
            className="w-3 h-0.5 inline-block"
            style={{
              backgroundColor: item.color,
              borderTop: item.dashed ? `1px dashed ${item.color}` : 'none',
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export const TimelineContainer: React.FC<{
  title: string;
  metLabel?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, metLabel, children, className = '' }) => {
  return (
    <div className={`bg-white border border-astro-border-hairline rounded-sm p-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-astro-border-hairline">
        <h5 className="font-display text-xs font-semibold uppercase tracking-wider text-astro-text-primary">
          {title}
        </h5>
        {metLabel && (
          <span className="font-mono text-[10px] text-astro-text-tertiary">{metLabel}</span>
        )}
      </div>
      <div className="relative pl-3 border-l border-astro-border-hairline space-y-4">
        {children}
      </div>
    </div>
  );
};
