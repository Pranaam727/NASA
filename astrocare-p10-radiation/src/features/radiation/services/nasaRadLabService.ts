import { RadiationMeasurement } from '../types/radiationTypes';
import { HISTORICAL_RADLAB_FIXTURES } from '../data/radLabFixtures';

export interface RadLabQueryParams {
  spacecraft?: string;
  instrument?: string;
  instrumentId?: string;
  module?: string;
  minTimestamp?: string;
  maxTimestamp?: string;
  minDoseRate?: number;
  limit?: number;
}

export interface RadLabApiResponse {
  columns: string[];
  index?: number[];
  data: any[][];
}

export interface RadLabServiceResult {
  measurements: RadiationMeasurement[];
  isLive: boolean;
  sourceUrl: string;
  retrievedAt: string;
  error?: string;
}

class NasaRadLabService {
  private baseUrl = 'https://visualization.osdr.nasa.gov/radlab/api/';
  private cache = new Map<string, { data: RadLabServiceResult; expiry: number }>();
  private cacheTtlMs = 5 * 60 * 1000; // 5 minutes

  /**
   * Builds the query string according to the NASA RadLab API documentation
   */
  public buildQueryUrl(params: RadLabQueryParams): string {
    const url = new URL(this.baseUrl);
    const searchParams = url.searchParams;

    // Filters
    if (params.spacecraft) searchParams.set('spacecraft', params.spacecraft);
    if (params.instrument) searchParams.set('instrument', params.instrument);
    if (params.instrumentId) searchParams.set('instrument_id', params.instrumentId);
    if (params.module) searchParams.set('module', params.module);

    if (params.minTimestamp) {
      searchParams.set('timestamp>=', params.minTimestamp);
    }
    if (params.maxTimestamp) {
      searchParams.set('timestamp<', params.maxTimestamp);
    }
    if (params.minDoseRate !== undefined) {
      searchParams.set('absorbed_dose_rate>=', params.minDoseRate.toString());
    }

    // Required output fields
    searchParams.append('absorbed_dose_rate', '');
    searchParams.append('dose_equivalent_rate', '');
    searchParams.append('flux', '');
    searchParams.append('altitude', '');
    searchParams.append('latitude', '');
    searchParams.append('longitude', '');
    searchParams.set('format', 'json');

    return url.toString().replace(/=(?=&|$)/g, ''); // NASA RadLab format handles empty flags
  }

  /**
   * Normalizes raw Pandas split format JSON into AstroCare RadiationMeasurement entities
   */
  public normalizeResponse(
    raw: RadLabApiResponse,
    _sourceUrl?: string
  ): RadiationMeasurement[] {
    if (!raw || !raw.columns || !Array.isArray(raw.data)) {
      return [];
    }

    const colMap = new Map<string, number>();
    raw.columns.forEach((col, idx) => {
      colMap.set(col.toLowerCase(), idx);
    });

    const getVal = (row: any[], colName: string): any => {
      const idx = colMap.get(colName.toLowerCase());
      return idx !== undefined ? row[idx] : null;
    };

    return raw.data.map((row, index) => {
      const timestamp = getVal(row, 'timestamp') || new Date().toISOString();
      const instrumentId = getVal(row, 'instrument_id') || 'RADLAB_SENSOR';
      const instrument = getVal(row, 'instrument') || 'DosTel';
      const spacecraft = getVal(row, 'spacecraft') || 'ISS';
      const moduleName = getVal(row, 'module') || undefined;

      const rawAbsorbed = getVal(row, 'absorbed_dose_rate');
      const absorbedDoseRate =
        typeof rawAbsorbed === 'number' && !isNaN(rawAbsorbed) ? rawAbsorbed : null;

      const rawEquivalent = getVal(row, 'dose_equivalent_rate');
      let doseEquivalentRate =
        typeof rawEquivalent === 'number' && !isNaN(rawEquivalent) ? rawEquivalent : null;

      // When equivalent dose rate is null, compute using space radiation quality factor
      if (doseEquivalentRate === null && absorbedDoseRate !== null) {
        doseEquivalentRate = absorbedDoseRate * 1.8;
      }

      const rawFlux = getVal(row, 'flux');
      const particleFlux =
        typeof rawFlux === 'number' && !isNaN(rawFlux) ? rawFlux : null;

      const rawAlt = getVal(row, 'altitude');
      const altitude = typeof rawAlt === 'number' && !isNaN(rawAlt) ? rawAlt : null;

      const rawLat = getVal(row, 'latitude');
      const latitude = typeof rawLat === 'number' && !isNaN(rawLat) ? rawLat : null;

      const rawLon = getVal(row, 'longitude');
      const longitude = typeof rawLon === 'number' && !isNaN(rawLon) ? rawLon : null;

      return {
        id: `radlab-${instrumentId}-${index}-${new Date(timestamp).getTime()}`,
        timestamp: new Date(timestamp).toISOString(),
        spacecraft,
        instrument,
        instrumentId,
        module: moduleName,
        absorbedDoseRate,
        doseEquivalentRate,
        particleFlux,
        altitude,
        latitude,
        longitude,
        source: 'NASA_RADLAB',
        sourceRecordId: `radlab-row-${index}`,
        dataCategory: 'HISTORICAL_ARCHIVE',
        qualityStatus: 'NOMINAL',
      };
    });
  }

  /**
   * Retrieves radiation telemetry with automatic caching and resilience fallback
   */
  public async getTelemetry(params: RadLabQueryParams = {}): Promise<RadLabServiceResult> {
    const queryUrl = this.buildQueryUrl(params);
    const cacheKey = queryUrl;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(queryUrl, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`NASA RadLab API responded with HTTP status ${response.status}`);
      }

      const json: RadLabApiResponse = await response.json();
      const normalized = this.normalizeResponse(json, queryUrl);

      const result: RadLabServiceResult = {
        measurements: params.limit ? normalized.slice(0, params.limit) : normalized,
        isLive: true,
        sourceUrl: queryUrl,
        retrievedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, { data: result, expiry: Date.now() + this.cacheTtlMs });
      return result;
    } catch (err: any) {
      console.warn('Live NASA RadLab API call failed or timed out. Falling back to authentic fixtures:', err?.message || err);

      // Filter local historical fixtures according to query params where applicable
      let fallbackData = [...HISTORICAL_RADLAB_FIXTURES];
      if (params.spacecraft) {
        fallbackData = fallbackData.filter((m) => m.spacecraft.toLowerCase() === params.spacecraft?.toLowerCase());
      }
      if (params.instrument) {
        fallbackData = fallbackData.filter((m) =>
          m.instrument.toLowerCase().includes(params.instrument!.toLowerCase())
        );
      }
      if (params.limit) {
        fallbackData = fallbackData.slice(0, params.limit);
      }

      const fallbackResult: RadLabServiceResult = {
        measurements: fallbackData,
        isLive: false,
        sourceUrl: queryUrl,
        retrievedAt: new Date().toISOString(),
        error: err?.message || 'Network unavailable; authentic historical RadLab fixtures loaded.',
      };

      return fallbackResult;
    }
  }
}

export const nasaRadLabService = new NasaRadLabService();
