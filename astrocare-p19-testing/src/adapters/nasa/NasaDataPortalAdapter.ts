/**
 * AstroCare NASA Open Data Portal Adapter (data.nasa.gov)
 * Validates dataset discovery and metadata catalog references.
 * Note: data.nasa.gov is a metadata catalogue; actual datasets are hosted
 * across specialized archives (OSDR, PDS, DAACs, Earthdata).
 */

import { NasaDataPortalRecord, NasaSourceVerificationResult } from '../../types/nasa';

export const SAMPLE_DATA_PORTAL_FIXTURES: NasaDataPortalRecord[] = [
  {
    datasetId: 'DATA-NASA-AERO-01',
    title: 'ISS Spaceflight Environmental and Radiation Dosimetry Records',
    description: 'Aggregated passive dosimeter and active silicon detector measurements.',
    landingPage: 'https://data.nasa.gov/dataset/ISS-Dosimetry-Records',
    publisher: 'NASA Johnson Space Center SRAG',
    theme: ['Aerospace', 'Human Spaceflight', 'Radiation'],
    distributionFormats: ['CSV', 'JSON'],
    hostedArchive: 'OSDR',
  },
  {
    datasetId: 'DATA-NASA-EXERCISE-02',
    title: 'ARED Resistance Exercise Protocol and Load Cell Telemetry',
    description: 'Biomechanical loading telemetry from the Advanced Resistive Exercise Device.',
    landingPage: 'https://data.nasa.gov/dataset/ARED-Exercise-Telemetry',
    publisher: 'NASA Human Research Program',
    theme: ['Physiology', 'Exercise Countermeasures'],
    distributionFormats: ['HDF5', 'CSV'],
    hostedArchive: 'LSDA',
  },
];

export class NasaDataPortalAdapter {
  private mockMode: boolean;

  constructor(mockMode: boolean = true) {
    this.mockMode = mockMode;
  }

  public async queryCatalog(themeFilter?: string): Promise<NasaDataPortalRecord[]> {
    if (this.mockMode) {
      if (!themeFilter) return SAMPLE_DATA_PORTAL_FIXTURES;
      const lower = themeFilter.toLowerCase();
      return SAMPLE_DATA_PORTAL_FIXTURES.filter((rec) =>
        rec.theme.some((t) => t.toLowerCase().includes(lower))
      );
    }

    const res = await fetch(`https://data.nasa.gov/data.json`);
    if (!res.ok) throw new Error(`data.nasa.gov catalog fetch failed: HTTP ${res.status}`);
    const data = await res.json();
    return (data.dataset || []).slice(0, 10).map((d: any) => ({
      datasetId: d.identifier || 'UNKNOWN',
      title: d.title || 'Untitled Dataset',
      description: d.description || '',
      landingPage: d.landingPage || '',
      publisher: d.publisher?.name || 'NASA',
      theme: d.theme || [],
      distributionFormats: (d.distribution || []).map((dist: any) => dist.format || 'UNKNOWN'),
      hostedArchive: 'External NASA Archive',
    }));
  }

  public verifyRecord(record: NasaDataPortalRecord): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    if (!record.datasetId) warnings.push('Missing dataset catalogue ID.');
    if (!record.landingPage.startsWith('http')) warnings.push('Landing page is not a valid HTTP URL.');
    if (!record.hostedArchive) {
      warnings.push('Record does not specify target host archive (catalogue only).');
    }
    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }

  public async verifySource(): Promise<NasaSourceVerificationResult> {
    const start = performance.now();
    const records = await this.queryCatalog();
    const latency = performance.now() - start;

    return {
      sourceName: 'NASA_DATA_PORTAL',
      isReachable: records.length > 0,
      isMocked: this.mockMode,
      rateLimitCompliant: true,
      schemaCompliant: records.length > 0 && records[0].datasetId.length > 0,
      latencyMs: Math.round(latency * 100) / 100,
      errors: records.length === 0 ? ['No catalogue records returned.'] : [],
      warnings: [
        'data.nasa.gov records are metadata pointers; download of underlying payload requires repository adapter.',
      ],
    };
  }
}
