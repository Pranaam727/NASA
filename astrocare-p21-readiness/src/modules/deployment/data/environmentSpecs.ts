// ============================================================================
// AstroCare Environment Variable Specifications & Validation Rules
// ============================================================================

import { EnvironmentVariableSpec } from '../types';

export const ENVIRONMENT_SPECS: EnvironmentVariableSpec[] = [
  {
    key: 'NASA_API_KEY',
    description: 'NASA Open APIs token for querying official NASA REST telemetry and data services (api.nasa.gov).',
    required: false,
    isSecret: true,
    expectedPattern: /^[A-Za-z0-9_-]{30,50}$/,
    formatDescription: 'Alphanumeric string (30-50 chars) or DEMO_KEY for initial exploration',
    defaultMockAllowed: true
  },
  {
    key: 'GEMINI_API_KEY',
    description: 'Google Gemini API key for AstroCare P13 AI Clinical Intelligence Assistant.',
    required: true,
    isSecret: true,
    expectedPattern: /^AIza[0-9A-Za-z-_]{35}$/,
    formatDescription: 'Standard Google API key format starting with "AIza..." (39 characters)',
    defaultMockAllowed: true // P13 has built-in MockAIProvider fallback
  },
  {
    key: 'SUPABASE_URL',
    description: 'PostgreSQL backend project URL for telemetry history and user audit logging.',
    required: false,
    isSecret: false,
    expectedPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co$/,
    formatDescription: 'HTTPS Supabase domain (https://<project-ref>.supabase.co)',
    defaultMockAllowed: true
  },
  {
    key: 'SUPABASE_ANON_KEY',
    description: 'Public client anon JWT key for accessing Supabase Row Level Security endpoints.',
    required: false,
    isSecret: true,
    expectedPattern: /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
    formatDescription: 'JWT bearer token format starting with "eyJ..."',
    defaultMockAllowed: true
  },
  {
    key: 'BACKEND_API_URL',
    description: 'Secure proxy backend endpoint that routes AI and telemetry requests without client-side key leakage.',
    required: true,
    isSecret: false,
    expectedPattern: /^https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*)?$/,
    formatDescription: 'Valid HTTP/HTTPS URL (e.g. http://localhost:3001 or https://api.astrocare.space)',
    defaultMockAllowed: true
  },
  {
    key: 'FRONTEND_URL',
    description: 'Client application origin for CORS origin policy and trusted redirect validation.',
    required: true,
    isSecret: false,
    expectedPattern: /^https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?$/,
    formatDescription: 'Valid HTTP/HTTPS origin (e.g. http://localhost:5173 or https://astrocare.space)',
    defaultMockAllowed: false
  },
  {
    key: 'APPLICATION_ENV',
    description: 'Runtime environment profile configuring logging verbosity, mock providers, and telemetry rates.',
    required: true,
    isSecret: false,
    expectedPattern: /^(development|staging|production|test)$/,
    formatDescription: 'One of: development | staging | production | test',
    defaultMockAllowed: false
  },
  {
    key: 'DEMO_MODE',
    description: 'Global hackathon demonstration flag. When true, loads synthetic astronaut scenarios without live telemetry uplink.',
    required: true,
    isSecret: false,
    expectedPattern: /^(true|false|1|0)$/,
    formatDescription: 'Boolean flag: "true" or "false"',
    defaultMockAllowed: true
  }
];
