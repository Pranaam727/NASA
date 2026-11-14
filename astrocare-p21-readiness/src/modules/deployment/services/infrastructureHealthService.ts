// ============================================================================
// AstroCare Infrastructure & API Health Service
// Health checks for frontend client, proxy backend, database, and AI service.
// Supports both live network probes and calibrated simulation mode.
// ============================================================================

import { InfrastructureHealthResult } from '../types';

export const INITIAL_INFRASTRUCTURE_HEALTH: InfrastructureHealthResult[] = [
  {
    serviceId: 'srv-frontend',
    name: 'AstroCare SPA Frontend (Vite/React)',
    type: 'frontend',
    endpoint: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
    status: 'healthy',
    latencyMs: 12,
    uptimePercent: 99.98,
    lastChecked: new Date().toISOString(),
    dependencies: [],
    isSimulated: false
  },
  {
    serviceId: 'srv-ai-proxy',
    name: 'Gemini AI Proxy Gateway',
    type: 'ai_proxy',
    endpoint: '/api/chat',
    status: 'healthy',
    latencyMs: 145,
    uptimePercent: 99.85,
    lastChecked: new Date().toISOString(),
    dependencies: ['Google Gemini v1.5 Flash API', 'Secret Vault'],
    isSimulated: true // Labelled as simulated when running in standalone client mode
  },
  {
    serviceId: 'srv-telemetry',
    name: 'Physiological Telemetry WebSocket Downlink',
    type: 'telemetry_stream',
    endpoint: 'wss://telemetry.astrocare.space/vitals',
    status: 'healthy',
    latencyMs: 48,
    uptimePercent: 99.95,
    lastChecked: new Date().toISOString(),
    dependencies: ['ISS TDRSS Ku-Band Relay Simulator'],
    isSimulated: true
  },
  {
    serviceId: 'srv-database',
    name: 'Biomedical Telemetry PostgreSQL Store (Supabase)',
    type: 'database',
    endpoint: 'https://db.astrocare.space/rest/v1/health',
    status: 'healthy',
    latencyMs: 82,
    uptimePercent: 99.90,
    lastChecked: new Date().toISOString(),
    dependencies: ['Supabase PostgreSQL 15', 'Row-Level Security Policies'],
    isSimulated: true
  },
  {
    serviceId: 'srv-auth',
    name: 'Flight Surgeon Auth & Session Manager',
    type: 'auth_service',
    endpoint: '/auth/v1/status',
    status: 'healthy',
    latencyMs: 36,
    uptimePercent: 99.99,
    lastChecked: new Date().toISOString(),
    dependencies: ['JWT HMAC-SHA256 Token Signer'],
    isSimulated: true
  }
];

export async function pingServiceEndpoint(
  service: InfrastructureHealthResult,
  useSimulation: boolean = true
): Promise<InfrastructureHealthResult> {
  const startTime = Date.now();

  if (useSimulation) {
    // Calibrated simulation probe
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 150));
    const latency = Math.floor(25 + Math.random() * 75);
    return {
      ...service,
      status: 'healthy',
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      isSimulated: true
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(service.endpoint, {
      method: 'HEAD',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const latency = Date.now() - startTime;
    return {
      ...service,
      status: res.ok ? 'healthy' : 'degraded',
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      isSimulated: false,
      errorDetails: res.ok ? undefined : `HTTP ${res.status}: ${res.statusText}`
    };
  } catch (err) {
    const elapsed = Date.now() - startTime;
    return {
      ...service,
      status: 'degraded',
      latencyMs: elapsed,
      lastChecked: new Date().toISOString(),
      isSimulated: false,
      errorDetails: err instanceof Error ? err.message : 'Network probe failed'
    };
  }
}
