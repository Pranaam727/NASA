// AstroCare P11 — Application Constants

export const APP_VERSION = '1.0.0';
export const MODULE_ID = 'P11_WELLNESS';

// Demo configuration
export const DEMO_ASTRONAUT_ID = 'AST-2024-MX7';
export const DEMO_MISSION_ID = 'EXPEDITION-72-ALPHA';
export const DEMO_MISSION_DAYS = 180;

// Wellness thresholds
export const THRESHOLDS = {
  SLEEP: {
    MIN_DURATION_HOURS: 6,
    TARGET_DURATION_HOURS: 7.5,
    MAX_DURATION_HOURS: 9,
    MIN_EFFICIENCY_PCT: 75,
    TARGET_EFFICIENCY_PCT: 85,
    MAX_DEFICIT_HOURS: 10,
    SCHEDULE_DEVIATION_WARN_MIN: 60,
  },
  WELLNESS: {
    MOOD_WARN_THRESHOLD: 4,
    STRESS_WARN_THRESHOLD: 7,
    ENERGY_WARN_THRESHOLD: 3,
    WELLBEING_WARN_THRESHOLD: 4,
  },
  FATIGUE: {
    FATIGUE_WARN_THRESHOLD: 7,
    WORKLOAD_WARN_THRESHOLD: 8,
    ALERTNESS_WARN_THRESHOLD: 3,
  },
  CIRCADIAN: {
    ALIGNMENT_WARN_THRESHOLD: 50,
    DEVIATION_WARN_MINUTES: 90,
  },
  COGNITIVE: {
    ACCURACY_WARN_PCT: 65,
    REACTION_TIME_WARN_MS: 400,
  },
} as const;

// Wellness status rules (documented thresholds)
export const STATUS_RULES = {
  NORMAL: 'All monitored indicators within expected ranges.',
  MONITOR: 'One or more indicators approaching threshold. Increased monitoring recommended.',
  WARNING: 'One or more indicators exceed threshold. Review and intervention recommended.',
  INSUFFICIENT_DATA: 'Insufficient recent data to determine wellness status.',
} as const;

// Scale documentation
export const SCALE_DOCS = {
  MOOD: 'Mood scale 1–10: 1 = very low mood, 10 = excellent mood. Self-reported.',
  STRESS: 'Stress scale 1–10: 1 = minimal stress, 10 = extreme stress. Self-reported.',
  ENERGY: 'Energy scale 1–10: 1 = exhausted, 10 = fully energised. Self-reported.',
  WELLBEING: 'Wellbeing scale 1–10: 1 = very poor, 10 = excellent overall wellbeing. Self-reported.',
  FATIGUE: 'Fatigue scale 1–10: 1 = no fatigue, 10 = extreme fatigue. Self-reported.',
  ALERTNESS: 'Alertness scale 1–10: 1 = extremely drowsy, 10 = fully alert. Self-reported.',
} as const;

// NASA Research URLs (official, verified)
export const NASA_SOURCES = {
  SLEEP_IRREGULAR: 'https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/',
  ISOLATION: 'https://www.nasa.gov/hrp/hazard-isolation-and-confinement/',
  HFBP_RISKS: 'https://www.nasa.gov/hrp/human-factors-and-behavioral-performance/hfbp-risks/',
  BEHAVIORAL_HEALTH: 'https://www.nasa.gov/directorates/esdmd/hhp/behavioral-health-risk/',
  STANDARDIZED_MEASURES: 'https://humanresearchroadmap.nasa.gov/Tasks/task.aspx?i=1623',
  HUMAN_BODY: 'https://www.nasa.gov/humans-in-space/the-human-body-in-space/',
  OSDR: 'https://osdr.nasa.gov/',
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  SLEEP_RECORDS: 'astrocare_p11_sleep',
  WELLNESS_RECORDS: 'astrocare_p11_wellness',
  COGNITIVE_RECORDS: 'astrocare_p11_cognitive',
  SETTINGS: 'astrocare_p11_settings',
  DISCLAIMER_ACCEPTED: 'astrocare_p11_disclaimer',
  DEMO_INITIALIZED: 'astrocare_p11_demo_init',
} as const;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#14b8a6',
  ACCENT: '#8b5cf6',
  AMBER: '#f59e0b',
  GREEN: '#22c55e',
  RED: '#ef4444',
  MUTED: '#4a6080',
  GRID: '#1e2a3a',
  TARGET: '#374151',
} as const;

// Safety disclaimer
export const DISCLAIMER = `This module is a demonstration research tool. 
All data is simulated or user-entered for educational purposes. 
This tool does not provide medical diagnosis, clinical assessment, 
or psychiatric evaluation. It is not a validated medical instrument. 
Do not use this tool for clinical decision-making.` as const;
