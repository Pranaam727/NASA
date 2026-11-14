import React from 'react';
import { ArrowUp, ArrowDown, Minus, LucideIcon } from 'lucide-react';
import { DataSourceType } from '@/types/telemetry';

export type StatusLevel = 'NOMINAL' | 'CAUTION' | 'CRITICAL' | 'SIMULATED' | 'INFO';

interface StatusIndicatorProps {
  status: StatusLevel;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse = false,
}) => {
  const colorMap: Record<StatusLevel, { dot: string; bg: string; text: string; border: string }> =
    {
      NOMINAL: {
        dot: 'bg-astro-status-healthy',
        bg: 'bg-astro-status-healthy/10',
        text: 'text-astro-status-healthy',
        border: 'border-astro-status-healthy/30',
      },
      CAUTION: {
        dot: 'bg-astro-status-caution',
        bg: 'bg-astro-status-caution/10',
        text: 'text-astro-status-caution',
        border: 'border-astro-status-caution/30',
      },
      CRITICAL: {
        dot: 'bg-astro-status-critical',
        bg: 'bg-astro-status-critical/10',
        text: 'text-astro-status-critical',
        border: 'border-astro-status-critical/30',
      },
      SIMULATED: {
        dot: 'bg-astro-status-sandstone',
        bg: 'bg-astro-status-sandstone/20',
        text: 'text-[#7A6643]',
        border: 'border-astro-status-sandstone/40',
      },
      INFO: {
        dot: 'bg-astro-text-secondary',
        bg: 'bg-astro-bg-subtle',
        text: 'text-astro-text-secondary',
        border: 'border-astro-border-hairline',
      },
    };

  const style = colorMap[status];

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm border font-mono uppercase tracking-wider ${
        size === 'sm' ? 'text-[9px]' : 'text-[10px]'
      } ${style.bg} ${style.text} ${style.border}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${pulse ? 'animate-pulse' : ''}`}
      />
      {label && <span>{label}</span>}
    </span>
  );
};

interface DataSourceLabelProps {
  source: DataSourceType;
  isSimulated?: boolean;
}

export const DataSourceLabel: React.FC<DataSourceLabelProps> = ({ source, isSimulated }) => {
  const label = isSimulated ? 'SIMULATED' : source;
  const status: StatusLevel = isSimulated ? 'SIMULATED' : 'NOMINAL';

  return <StatusIndicator status={status} label={label} size="sm" />;
};

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'flat';
  delta?: string | number;
  unit?: string;
  isInverseGood?: boolean; // e.g. lower heart rate can be good
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  direction,
  delta,
  unit,
  isInverseGood = false,
}) => {
  const isUpGood = !isInverseGood;
  const isUp = direction === 'up';
  const isDown = direction === 'down';

  const colorClass =
    direction === 'flat'
      ? 'text-astro-text-secondary'
      : (isUp && isUpGood) || (isDown && !isUpGood)
        ? 'text-astro-status-healthy'
        : 'text-astro-status-caution';

  return (
    <span className={`inline-flex items-center space-x-0.5 font-mono text-[11px] ${colorClass}`}>
      {direction === 'up' && <ArrowUp className="w-3 h-3" />}
      {direction === 'down' && <ArrowDown className="w-3 h-3" />}
      {direction === 'flat' && <Minus className="w-3 h-3" />}
      {delta !== undefined && (
        <span className="tabular-nums">
          {delta}
          {unit ? ` ${unit}` : ''}
        </span>
      )}
    </span>
  );
};

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string | number;
  trend?: 'up' | 'down' | 'flat';
  status?: StatusLevel;
  icon?: LucideIcon;
  subtext?: string;
  isSimulated?: boolean;
  className?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  unit,
  delta,
  trend,
  status = 'NOMINAL',
  icon: Icon,
  subtext,
  isSimulated,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-astro-border-hairline p-3.5 rounded-sm flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-wider text-astro-text-secondary flex items-center space-x-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-astro-text-tertiary" />}
          <span>{label}</span>
        </span>
        <div className="flex items-center space-x-1">
          {isSimulated && <DataSourceLabel source="SIMULATOR" isSimulated={true} />}
          <StatusIndicator status={status} size="sm" />
        </div>
      </div>

      <div className="flex items-baseline space-x-1.5 my-1">
        <span className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-astro-text-primary tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-xs text-astro-text-secondary tracking-normal">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-1 pt-1 border-t border-astro-border-hairline/60">
        {trend && delta !== undefined ? (
          <TrendIndicator direction={trend} delta={delta} />
        ) : (
          <span className="font-mono text-[10px] text-astro-text-tertiary">NOMINAL BAND</span>
        )}
        {subtext && (
          <span className="font-mono text-[10px] text-astro-text-tertiary truncate">{subtext}</span>
        )}
      </div>
    </div>
  );
};

export const MeasurementDisplay: React.FC<{
  label: string;
  value: string | number;
  unit: string;
  timestamp?: string;
}> = ({ label, value, unit, timestamp }) => {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-astro-border-hairline/60">
      <span className="font-body text-xs text-astro-text-secondary">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="font-mono text-xs font-semibold text-astro-text-primary tabular-nums">
          {value} <span className="font-normal text-astro-text-secondary">{unit}</span>
        </span>
        {timestamp && (
          <span className="font-mono text-[10px] text-astro-text-tertiary">{timestamp}</span>
        )}
      </div>
    </div>
  );
};
