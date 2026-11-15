// AstroCare P11 — Utility Functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, differenceInMinutes, addDays } from 'date-fns';

// ─── Class Name Helper ─────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ─────────────────────────────────────────

export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), 'dd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'dd MMM yyyy');
  } catch {
    return iso;
  }
}

export function formatTime(iso: string): string {
  try {
    return format(parseISO(iso), 'HH:mm');
  } catch {
    return iso;
  }
}

export function formatShortDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d');
  } catch {
    return iso;
  }
}

export function minutesToHoursDisplay(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? '-' : '';
  return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${m}m`;
}

export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

export function getISONow(): string {
  return new Date().toISOString();
}

export function getMissionDate(missionStartISO: string, dayOffset: number): string {
  return addDays(parseISO(missionStartISO), dayOffset).toISOString();
}

// ─── Score / Analytics Helpers ──────────────────────────────

export function clampScore(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function normalizeScore(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return clampScore(((value - min) / (max - min)) * 100);
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ─── Sleep Calculations ─────────────────────────────────────

export function calculateSleepDurationMinutes(sleepStart: string, sleepEnd: string): number {
  try {
    const start = parseISO(sleepStart);
    const end = parseISO(sleepEnd);
    const diff = differenceInMinutes(end, start);
    // Handle cross-midnight: if end before start, add 24h
    return diff < 0 ? diff + 1440 : diff;
  } catch {
    return 0;
  }
}

export function calculateSleepEfficiency(
  totalSleepMinutes: number,
  timeInBedMinutes: number
): number {
  if (timeInBedMinutes <= 0) return 0;
  return clampScore((totalSleepMinutes / timeInBedMinutes) * 100);
}

export function calculateSleepDeficit(
  records: { totalSleepDurationMinutes: number }[],
  targetMinutes: number
): number {
  if (records.length === 0) return 0;
  return records.reduce((acc, r) => {
    const deficit = targetMinutes - r.totalSleepDurationMinutes;
    return acc + Math.max(0, deficit);
  }, 0);
}

// ─── Wellness Status Logic ───────────────────────────────────

export function computeWellnessStatus(
  indicators: { value: number; warnThreshold: number; invertedScale?: boolean }[]
): import('../types').WellnessStatus {
  const hasData = indicators.some((i) => i.value > 0);
  if (!hasData) return 'INSUFFICIENT_DATA';

  const anyWarning = indicators.some((i) => {
    if (i.invertedScale) return i.value >= i.warnThreshold;
    return i.value <= i.warnThreshold;
  });

  if (anyWarning) return 'WARNING';

  const anyMonitor = indicators.some((i) => {
    const margin = i.invertedScale
      ? i.warnThreshold - i.value
      : i.value - i.warnThreshold;
    return margin <= 10 && margin >= 0;
  });

  return anyMonitor ? 'MONITOR' : 'NORMAL';
}

// ─── Color Helpers ───────────────────────────────────────────

export function getStatusColor(status: import('../types').WellnessStatus): string {
  switch (status) {
    case 'NORMAL': return '#22c55e';
    case 'MONITOR': return '#f59e0b';
    case 'WARNING': return '#ef4444';
    case 'INSUFFICIENT_DATA': return '#4a6080';
    default: return '#4a6080';
  }
}

export function getSeverityColor(severity: import('../types').AlertSeverity): string {
  switch (severity) {
    case 'INFO': return '#3b82f6';
    case 'CAUTION': return '#f59e0b';
    case 'WARNING': return '#ef4444';
    case 'CRITICAL': return '#dc2626';
    default: return '#4a6080';
  }
}

export function getScoreColor(score: number, invert = false): string {
  const v = invert ? 100 - score : score;
  if (v >= 70) return '#22c55e';
  if (v >= 50) return '#f59e0b';
  return '#ef4444';
}

// ─── ID Generation ───────────────────────────────────────────

export function generateId(prefix = 'REC'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// ─── Trend Helpers ───────────────────────────────────────────

export function computeTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  const recent = values.slice(-3);
  const delta = recent[recent.length - 1] - recent[0];
  if (delta > 0.5) return 'up';
  if (delta < -0.5) return 'down';
  return 'stable';
}

// ─── LocalStorage Helpers ────────────────────────────────────

export function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeSetJSON<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
