import React from 'react';
import { ArrowUp, ArrowDown, Minus, LucideIcon } from 'lucide-react';

export type StatusLevel = 'NOMINAL' | 'CAUTION' | 'CRITICAL' | 'SIMULATED' | 'INFO';

interface HealthMetricCardProps {
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
  dark?: boolean;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
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
  dark = false,
}) => {
  const statusStyles: Record<StatusLevel, { dot: string; text: string; bg: string }> = {
    NOMINAL: { dot: 'bg-[#75D8DC]', text: 'text-[#111111]', bg: 'bg-[#75D8DC]/20 border-[#75D8DC]/40' },
    CAUTION: { dot: 'bg-[#FF6B35]', text: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/15 border-[#FF6B35]/40' },
    CRITICAL: { dot: 'bg-[#E03616]', text: 'text-[#E03616]', bg: 'bg-[#E03616]/20 border-[#E03616]/40' },
    SIMULATED: { dot: 'bg-[#B8B8B3]', text: 'text-[#888882]', bg: 'bg-[#B8B8B3]/20 border-[#B8B8B3]/40' },
    INFO: { dot: 'bg-[#444444]', text: 'text-[#444444]', bg: 'bg-[#DCD8CD]/30 border-[#DCD8CD]' },
  };

  const currentStatus = statusStyles[status];

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${
        dark
          ? 'bg-[#1A1A1A] border-white/10 text-[#F2F0EA] hover:border-white/30'
          : 'bg-[#FFFFFF] border-[#DCD8CD] text-[#111111] hover:border-[#111111] shadow-subtle'
      } flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#888882] flex items-center space-x-1.5 truncate">
          {Icon && <Icon className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />}
          <span className="truncate">{label}</span>
        </span>

        <div className="flex items-center space-x-1 shrink-0">
          {isSimulated && (
            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-[#B8B8B3] bg-[#F2F0EA] text-[#444444]">
              SIMULATED
            </span>
          )}
          <span
            className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border ${currentStatus.bg} ${
              dark ? 'text-[#F2F0EA]' : currentStatus.text
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
            <span>{status}</span>
          </span>
        </div>
      </div>

      <div className="flex items-baseline space-x-1.5 my-1">
        <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-xs text-[#888882] tracking-normal">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DCD8CD]/60 font-mono text-[10px]">
        {trend && delta !== undefined ? (
          <span className="inline-flex items-center space-x-1 text-[#444444]">
            {trend === 'up' && <ArrowUp className="w-3 h-3 text-[#FF6B35]" />}
            {trend === 'down' && <ArrowDown className="w-3 h-3 text-[#75D8DC]" />}
            {trend === 'flat' && <Minus className="w-3 h-3 text-[#888882]" />}
            <span className="tabular-nums font-semibold">{delta}</span>
          </span>
        ) : (
          <span className="text-[#888882]">±2σ BASELINE</span>
        )}
        {subtext && (
          <span className="text-[#888882] truncate max-w-[130px]">{subtext}</span>
        )}
      </div>
    </div>
  );
};
