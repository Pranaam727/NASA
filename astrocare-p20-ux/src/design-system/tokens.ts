/**
 * AstroCare Unified Design System Tokens
 * Module: P20/21 - Mission-Wide UI/UX Experience
 * 
 * Provides centralized tokens for Dark Mission-Control & Light Scientific Workspace themes,
 * status levels, chart palettes, data provenance indicators, and typography scales.
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export const DESIGN_TOKENS = {
  // Brand identity colors
  brand: {
    navy: '#070a12',
    spaceDark: '#0b101d',
    surfaceDark: '#0f172a',
    surfaceDarkElevated: '#1e293b',
    surfaceLight: '#f8fafc',
    surfaceLightElevated: '#ffffff',
    cyan: '#06b6d4',
    cyanGlow: 'rgba(6, 182, 212, 0.25)',
    blue: '#3b82f6',
    purple: '#8b5cf6',
  },

  // Aerospace status colors (controlled and accessible)
  status: {
    nominal: {
      dark: { bg: '#064e3b', text: '#34d399', border: '#059669', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' },
      light: { bg: '#d1fae5', text: '#065f46', border: '#10b981', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      label: 'Nominal'
    },
    warning: {
      dark: { bg: '#78350f', text: '#fbbf24', border: '#d97706', badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
      light: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
      label: 'Warning'
    },
    critical: {
      dark: { bg: '#881337', text: '#fda4af', border: '#e11d48', badge: 'bg-rose-950/90 text-rose-300 border-rose-500/50' },
      light: { bg: '#ffe4e6', text: '#9f1239', border: '#f43f5e', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
      label: 'Critical'
    },
    info: {
      dark: { bg: '#164e63', text: '#67e8f9', border: '#0891b2', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' },
      light: { bg: '#cffafe', text: '#155e75', border: '#06b6d4', badge: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
      label: 'Informational'
    }
  },

  // Provenance badges
  provenance: {
    'live-telemetry': {
      label: 'LIVE TELEMETRY',
      dark: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
      light: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      description: 'Downlinked in-flight telemetry stream'
    },
    'simulated-data': {
      label: 'SIMULATED DATA',
      dark: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50',
      light: 'bg-cyan-50 text-cyan-700 border-cyan-300',
      description: 'High-fidelity NASA biomedical mathematical simulation'
    },
    'nasa-research-source': {
      label: 'NASA RESEARCH SOURCE',
      dark: 'bg-blue-950/90 text-blue-300 border-blue-500/50',
      light: 'bg-blue-50 text-blue-700 border-blue-300',
      description: 'Peer-reviewed NASA HRP / OSDR empirical benchmark'
    },
    'derived-metric': {
      label: 'DERIVED METRIC',
      dark: 'bg-purple-950/90 text-purple-300 border-purple-500/50',
      light: 'bg-purple-50 text-purple-700 border-purple-300',
      description: 'Calculated from primary physiological telemetry channels'
    },
    'ai-generated-interpretation': {
      label: 'AI-GENERATED INTERPRETATION',
      dark: 'bg-indigo-950/90 text-indigo-300 border-indigo-500/50',
      light: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      description: 'Synthesized via Gemini biomedical clinical intelligence model'
    },
    'deterministic-fallback': {
      label: 'DETERMINISTIC FALLBACK',
      dark: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      light: 'bg-amber-50 text-amber-700 border-amber-300',
      description: 'Evaluated using deterministic rule engine during link severance'
    },
    'incomplete-data': {
      label: 'INCOMPLETE DATA',
      dark: 'bg-slate-900 text-slate-400 border-slate-700',
      light: 'bg-slate-100 text-slate-600 border-slate-300',
      description: 'Channel packet loss or sensor offline'
    }
  },

  // Scientific Chart Colors
  charts: {
    primary: '#06b6d4',      // Cyan (active metric)
    baseline: '#94a3b8',     // Slate (pre-flight baseline)
    secondary: '#3b82f6',    // Blue (secondary series)
    accent: '#a855f7',       // Purple (derived/correlation)
    warning: '#f59e0b',      // Amber (warning threshold)
    critical: '#f43f5e',     // Rose (critical threshold)
    nominalBand: 'rgba(16, 185, 129, 0.12)',
    gridDark: '#1e293b',
    gridLight: '#e2e8f0',
    tooltipDark: '#0b101d',
    tooltipLight: '#ffffff'
  },

  // Typography Scales
  typography: {
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem' // 30px
    }
  },

  // Layout Dimensions
  dimensions: {
    sidebarWidthExpanded: '260px',
    sidebarWidthCollapsed: '64px',
    headerHeight: '60px',
    drawerWidth: '480px'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const;

export type ThemeMode = 'dark' | 'light';
