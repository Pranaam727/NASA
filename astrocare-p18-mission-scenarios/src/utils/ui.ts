import type { RiskSeverity } from '../contracts/index';

export function getSeverityColor(severity: RiskSeverity | string): string {
  switch (severity) {
    case 'Critical': return 'text-rose-400';
    case 'High':     return 'text-orange-400';
    case 'Moderate': return 'text-amber-400';
    case 'Low':      return 'text-yellow-400';
    default:         return 'text-emerald-400';
  }
}

export function getSeverityBg(severity: RiskSeverity | string): string {
  switch (severity) {
    case 'Critical': return 'bg-rose-900/40 border-rose-700/50 text-rose-300';
    case 'High':     return 'bg-orange-900/40 border-orange-700/50 text-orange-300';
    case 'Moderate': return 'bg-amber-900/40 border-amber-700/50 text-amber-300';
    case 'Low':      return 'bg-yellow-900/40 border-yellow-700/50 text-yellow-300';
    default:         return 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300';
  }
}

export function getReadinessColor(cat: string): string {
  switch (cat) {
    case 'Optimal':  return 'text-emerald-400';
    case 'Nominal':  return 'text-blue-400';
    case 'Degraded': return 'text-amber-400';
    case 'Impaired': return 'text-orange-400';
    case 'Critical': return 'text-rose-400';
    default:         return 'text-slate-400';
  }
}

export function getReadinessBg(cat: string): string {
  switch (cat) {
    case 'Optimal':  return 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300';
    case 'Nominal':  return 'bg-blue-900/40 border-blue-700/50 text-blue-300';
    case 'Degraded': return 'bg-amber-900/40 border-amber-700/50 text-amber-300';
    case 'Impaired': return 'bg-orange-900/40 border-orange-700/50 text-orange-300';
    case 'Critical': return 'bg-rose-900/40 border-rose-700/50 text-rose-300';
    default:         return 'bg-slate-900/40 border-slate-700/50 text-slate-300';
  }
}

export function formatElapsed(sec: number): string {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `D${String(d).padStart(2,'0')}+${String(h).padStart(2,'0')}h${String(m).padStart(2,'0')}m`;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function barColor(pct: number): string {
  if (pct >= 70) return '#10b981'; // emerald
  if (pct >= 40) return '#f59e0b'; // amber
  if (pct >= 20) return '#f97316'; // orange
  return '#f43f5e'; // rose
}

export function gaugeColor(value: number, good: [number,number], warn: [number,number]): string {
  if (value >= good[0] && value <= good[1]) return '#10b981';
  if (value >= warn[0] && value <= warn[1]) return '#f59e0b';
  return '#f43f5e';
}
