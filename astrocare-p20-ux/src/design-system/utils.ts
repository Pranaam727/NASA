import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Common accessible focus visible styling for interactive elements
 */
export const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 focus-visible:ring-offset-white';

/**
 * Surface card styles for dark & light themes
 */
export const CARD_SURFACE = 'bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm transition-colors';

/**
 * Header bar surface style
 */
export const HEADER_SURFACE = 'bg-slate-50/90 dark:bg-[#070a12]/90 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md transition-colors';
