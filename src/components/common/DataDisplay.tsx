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
        dot: 'bg-[#24E6D0] shadow-[0_0_8px_#24E6D0]',
        bg: 'bg-[#24E6D0]/15',
        text: 'text-[#24E6D0]',
        border: 'border-[#24E6D0]/30',
      },
      CAUTION: {
        dot: 'bg-[#F5B94C] shadow-[0_0_8px_#F5B94C]',
        bg: 'bg-[#F5B94C]/15',
        text: 'text-[#F5B94C]',
        border: 'border-[#F5B94C]/30',
      },
      CRITICAL: {
        dot: 'bg-[#FF646E] shadow-[0_0_8px_#FF646E]',
        bg: 'bg-[#FF646E]/15',
        text: 'text-[#FF646E]',
        border: 'border-[#FF646E]/30',
      },
      SIMULATED: {
        dot: 'bg-[#8BFFE9] shadow-[0_0_8px_#8BFFE9]',
        bg: 'bg-[#8BFFE9]/15',
        text: 'text-[#8BFFE9]',
        border: 'border-[#8BFFE9]/30',
      },
      INFO: {
        dot: 'bg-[#91A9A4]',
        bg: 'bg-[#071311]',
        text: 'text-[#91A9A4]',
        border: 'border-[#24E6D0]/15',
      },
    };

  const style = colorMap[status];

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md border font-mono uppercase tracking-wider ${
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
  const label = isSimulated ? 'SIMULATOR' : source;
  const status: StatusLevel = isSimulated ? 'SIMULATED' : 'NOMINAL';

  return <StatusIndicator status={status} label={label} size="sm" />;
};

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'flat';
  delta?: string | number;
  unit?: string;
  isInverseGood?: boolean;
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
      ? 'text-[#5B7B75]'
      : (isUp && isUpGood) || (isDown && !isUpGood)
        ? 'text-[#24E6D0]'
        : 'text-[#F5B94C]';

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
      className={`bg-[#0D1D1B] border border-[#24E6D0]/20 p-5 rounded-2xl shadow-cyberCard transition-all duration-300 hover:border-[#24E6D0]/50 hover:shadow-cyberCardHover flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-wider text-[#91A9A4] flex items-center space-x-1.5 font-semibold">
          {Icon && <Icon className="w-3.5 h-3.5 text-[#24E6D0]" />}
          <span>{label}</span>
        </span>
        <div className="flex items-center space-x-1">
          {isSimulated && <DataSourceLabel source="SIMULATOR" isSimulated={true} />}
          <StatusIndicator status={status} size="sm" />
        </div>
      </div>

      <div className="flex items-baseline space-x-1.5 my-1.5">
        <span className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-[#F4FAF8] tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-xs text-[#91A9A4] tracking-normal font-medium">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#24E6D0]/15">
        {trend && delta !== undefined ? (
          <TrendIndicator direction={trend} delta={delta} />
        ) : (
          <span className="font-mono text-[10px] text-[#5B7B75] uppercase">NOMINAL BAND</span>
        )}
        {subtext && (
          <span className="font-mono text-[10px] text-[#5B7B75] truncate">{subtext}</span>
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
    <div className="flex items-center justify-between py-2 border-b border-[#24E6D0]/15">
      <span className="font-body text-xs text-[#91A9A4] font-medium">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="font-mono text-xs font-bold text-[#F4FAF8] tabular-nums">
          {value} <span className="font-normal text-[#5B7B75]">{unit}</span>
        </span>
        {timestamp && (
          <span className="font-mono text-[10px] text-[#5B7B75]">{timestamp}</span>
        )}
      </div>
    </div>
  );
};
