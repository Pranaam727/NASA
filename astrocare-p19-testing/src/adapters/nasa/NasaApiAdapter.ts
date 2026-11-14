/**
 * AstroCare NASA Open API Adapter (api.nasa.gov)
 * Handles rate limits, authentication (DEMO_KEY vs Registered API Keys),
 * response schema validation, and mock/offline fallback.
 */

import { NasaApiRateLimitInfo, NasaSourceVerificationResult } from '../../types/nasa';

export interface NasaApiConfig {
  apiKey?: string;
  baseUrl?: string;
  mockMode?: boolean;
}

export class NasaApiAdapter {
  private apiKey: string;
  private baseUrl: string;
  private mockMode: boolean;
  private requestCount: number = 0;

  constructor(config?: NasaApiConfig) {
    this.apiKey = config?.apiKey || 'DEMO_KEY';
    this.baseUrl = config?.baseUrl || 'https://api.nasa.gov';
    this.mockMode = config?.mockMode ?? true; // Default to offline deterministic mock
  }

  public getRateLimitInfo(): NasaApiRateLimitInfo {
    const isDemo = this.apiKey === 'DEMO_KEY';
    const limit = isDemo ? 30 : 1000;
    const remaining = Math.max(0, limit - this.requestCount);

    return {
      limitPerHour: limit,
      remainingPerHour: remaining,
      isDemoKey: isDemo,
      rateLimitResetTimestamp: new Date(Date.now() + 3600000).toISOString(),
    };
  }

  /**
   * Validate API availability and schema compliance
   */
  public async verifyConnection(): Promise<NasaSourceVerificationResult> {
    const start = performance.now();
    const rateLimit = this.getRateLimitInfo();
    const errors: string[] = [];
    const warnings: string[] = [];

    if (rateLimit.isDemoKey) {
      warnings.push(
        'Using NASA DEMO_KEY (quota restricted to 30 requests/hour and 50/day). Recommend supplying registered NASA API key for production.'
      );
    }

    if (this.mockMode) {
      this.requestCount++;
      const latency = performance.now() - start;
      return {
        sourceName: 'NASA_OPEN_APIS',
        isReachable: true,
        isMocked: true,
        rateLimitCompliant: true,
        schemaCompliant: true,
        latencyMs: Math.round(latency * 100) / 100,
        errors,
        warnings,
      };
    }

    // Live execution branch with rate-limit safeguard
    if (this.requestCount >= rateLimit.limitPerHour) {
      errors.push('NASA API Rate limit reached. Halting live requests.');
      return {
        sourceName: 'NASA_OPEN_APIS',
        isReachable: false,
        isMocked: false,
        rateLimitCompliant: false,
        schemaCompliant: false,
        latencyMs: performance.now() - start,
        errors,
        warnings,
      };
    }

    try {
      this.requestCount++;
      const res = await fetch(`${this.baseUrl}/planetary/apod?api_key=${this.apiKey}`);
      const latency = performance.now() - start;

      if (!res.ok) {
        errors.push(`HTTP ${res.status}: ${res.statusText}`);
        return {
          sourceName: 'NASA_OPEN_APIS',
          isReachable: false,
          isMocked: false,
          rateLimitCompliant: res.status !== 429,
          schemaCompliant: false,
          latencyMs: Math.round(latency * 100) / 100,
          errors,
          warnings,
        };
      }

      const json = await res.json();
      const hasRequiredFields = 'date' in json && ('title' in json || 'url' in json);

      return {
        sourceName: 'NASA_OPEN_APIS',
        isReachable: true,
        isMocked: false,
        rateLimitCompliant: true,
        schemaCompliant: hasRequiredFields,
        latencyMs: Math.round(latency * 100) / 100,
        errors,
        warnings,
      };
    } catch (err: unknown) {
      errors.push(err instanceof Error ? err.message : String(err));
      return {
        sourceName: 'NASA_OPEN_APIS',
        isReachable: false,
        isMocked: false,
        rateLimitCompliant: true,
        schemaCompliant: false,
        latencyMs: performance.now() - start,
        errors,
        warnings,
      };
    }
  }
}
