/**
 * Formatting utilities for dates, mission numbers, and biomedical numbers.
 */

export function formatMissionDay(day: number): string {
  if (day < 0) return `L${day}`; // e.g. L-30 Preflight
  if (day === 0) return 'Launch (FD 0)';
  return `FD ${day}`; // Flight Day
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
  } catch {
    return isoString;
  }
}

export function formatNumericValue(val: number | null | undefined, unit: string, decimals = 1): string {
  if (val === null || val === undefined) {
    return 'Unavailable';
  }
  return `${val.toFixed(decimals)} ${unit}`;
}

export function getSystemColor(system: string): {
  primary: string;
  bg: string;
  border: string;
  text: string;
} {
  switch (system) {
    case 'cardiovascular':
      return {
        primary: '#f43f5e',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      };
    case 'musculoskeletal':
      return {
        primary: '#3b82f6',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      };
    case 'immune':
      return {
        primary: '#10b981',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      };
    case 'neurological':
      return {
        primary: '#8b5cf6',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/30',
        text: 'text-violet-400',
      };
    case 'sleep_circadian':
      return {
        primary: '#06b6d4',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
      };
    case 'radiation_context':
      return {
        primary: '#f59e0b',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
      };
    default:
      return {
        primary: '#14b8a6',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/30',
        text: 'text-teal-400',
      };
  }
}
