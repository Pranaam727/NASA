// AstroCare P11 — Shared UI Components

import React from 'react';
import { cn, getStatusColor, getSeverityColor } from '../../utils';
import type { WellnessStatus, AlertSeverity } from '../../types';
import { AlertTriangle, CheckCircle, Clock, Info, Loader2 } from 'lucide-react';

// ─── Card ─────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#1e2a3a] bg-[#131924] p-5',
        hoverable && 'cursor-pointer transition-colors hover:bg-[#19202f] hover:border-[#2a3a52]',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────

export function StatusBadge({ status }: { status: WellnessStatus }) {
  const color = getStatusColor(status);
  const labels: Record<WellnessStatus, string> = {
    NORMAL: 'Normal',
    MONITOR: 'Monitor',
    WARNING: 'Warning',
    INSUFFICIENT_DATA: 'Insufficient Data',
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {labels[status]}
    </span>
  );
}

// ─── Alert Severity Badge ─────────────────────────────────────

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const color = getSeverityColor(severity);
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {severity}
    </span>
  );
}

// ─── Metric Card ──────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendGood?: 'up' | 'down'; // which direction is positive
}

export function MetricCard({ label, value, unit, subtext, color, icon, trend, trendGood }: MetricCardProps) {
  const isPositive = trend && trend === trendGood;
  const isNegative = trend && trend !== trendGood && trend !== 'stable';

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#8fa3be] uppercase tracking-wider mb-2">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-2xl font-bold"
              style={{ color: color || '#e8edf5' }}
            >
              {value}
            </span>
            {unit && <span className="text-sm text-[#8fa3be]">{unit}</span>}
          </div>
          {subtext && <p className="text-xs text-[#4a6080] mt-1">{subtext}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && <div className="text-[#4a6080]">{icon}</div>}
          {trend && trend !== 'stable' && (
            <span
              className={cn(
                'text-xs font-medium',
                isPositive && 'text-[#22c55e]',
                isNegative && 'text-[#ef4444]',
                !isPositive && !isNegative && 'text-[#8fa3be]'
              )}
            >
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Score Ring ───────────────────────────────────────────────

interface ScoreRingProps {
  score: number;    // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ScoreRing({
  score,
  size = 100,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
  sublabel,
}: ScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1e2a3a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {label && (
        <div className="text-center -mt-2">
          <p className="text-xl font-bold text-[#e8edf5]">{label}</p>
          {sublabel && <p className="text-xs text-[#8fa3be]">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Loading / Error / Empty States ──────────────────────────

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#8fa3be]">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <AlertTriangle className="w-8 h-8 text-[#ef4444]" />
      <p className="text-sm text-[#ef4444]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-[#3b82f6] hover:text-[#60a5fa] underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#4a6080]">
      {icon || <Info className="w-8 h-8" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, badge, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-[#e8edf5]">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-[#8fa3be]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Data Origin Tag ──────────────────────────────────────────

export function DataOriginTag({ origin }: { origin: string }) {
  const styles: Record<string, string> = {
    SIMULATED: 'text-[#8fa3be] bg-[#1e2a3a]',
    USER_ENTERED: 'text-[#14b8a6] bg-[#0d3030]',
    CALCULATED: 'text-[#8b5cf6] bg-[#2d1f4e]',
    NASA_RESEARCH: 'text-[#f59e0b] bg-[#3d2600]',
  };
  const labels: Record<string, string> = {
    SIMULATED: 'Simulated Data',
    USER_ENTERED: 'User Entered',
    CALCULATED: 'Calculated',
    NASA_RESEARCH: 'NASA Research',
  };
  return (
    <span
      className={cn(
        'inline-block rounded px-2 py-0.5 text-xs font-medium',
        styles[origin] || 'text-[#8fa3be] bg-[#1e2a3a]'
      )}
    >
      {labels[origin] || origin}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────

interface ProgressBarProps {
  value: number;  // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, color = '#3b82f6', height = 6, showLabel = false }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height, background: '#1e2a3a' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[#8fa3be] w-10 text-right">{Math.round(value)}%</span>
      )}
    </div>
  );
}

// ─── Disclaimer Banner ────────────────────────────────────────

export function DisclaimerBanner() {
  return (
    <div className="rounded-lg border border-[#3d2600] bg-[#1a1200] px-4 py-3 flex gap-3">
      <Info className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[#c8930a] leading-relaxed">
        <strong>Educational Demonstration Tool:</strong> All data shown is simulated or user-entered
        for research education purposes. This module does not provide medical diagnosis, clinical
        assessment, or psychiatric evaluation. It is not a validated medical instrument. Do not
        use for clinical decision-making.
      </p>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  const variants = {
    primary: 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a] hover:bg-[#2a4a7a]',
    secondary: 'bg-[#131924] text-[#8fa3be] border border-[#1e2a3a] hover:bg-[#19202f] hover:text-[#e8edf5]',
    ghost: 'text-[#8fa3be] hover:text-[#e8edf5] hover:bg-[#131924]',
    danger: 'bg-[#3f1515] text-[#ef4444] border border-[#5a1a1a] hover:bg-[#5a1a1a]',
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], (disabled || loading) && 'opacity-50 cursor-not-allowed', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ─── Tooltip wrapper ──────────────────────────────────────────

export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-block">
      <Info className="w-3.5 h-3.5 text-[#4a6080] cursor-help" />
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 w-56 rounded-lg border border-[#1e2a3a] bg-[#0f1520] p-2 text-xs text-[#8fa3be] shadow-xl pointer-events-none">
        {text}
      </span>
    </span>
  );
}

// ─── Scale Input ──────────────────────────────────────────────

interface ScaleInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  description?: string;
  invertColor?: boolean; // true = high value is bad (stress, fatigue)
}

export function ScaleInput({
  label,
  value,
  min = 1,
  max = 10,
  onChange,
  description,
  invertColor = false,
}: ScaleInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const color = invertColor
    ? pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#22c55e'
    : pct > 70 ? '#22c55e' : pct > 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#e8edf5]">{label}</label>
        <span className="text-lg font-bold" style={{ color }}>{value}</span>
      </div>
      {description && <p className="text-xs text-[#4a6080]">{description}</p>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, #1e2a3a ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-[#4a6080]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-[#0f1520] border border-[#1e2a3a]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-[#131924] text-[#e8edf5] shadow'
              : 'text-[#8fa3be] hover:text-[#e8edf5]'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Timestamp display ────────────────────────────────────────

export function Timestamp({ iso, prefix = 'Updated' }: { iso: string; prefix?: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-[#4a6080]">
      <Clock className="w-3 h-3" />
      <span>{prefix} {new Date(iso).toLocaleDateString()} {new Date(iso).toLocaleTimeString()}</span>
    </div>
  );
}

// ─── NASA Source Link ─────────────────────────────────────────

export function NasaSourceLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
    >
      <span className="font-medium">{label}</span>
      <span>↗</span>
    </a>
  );
}
