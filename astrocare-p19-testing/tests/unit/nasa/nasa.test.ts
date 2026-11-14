import { describe, it, expect } from 'vitest';
import { NasaApiAdapter } from '../../../src/adapters/nasa/NasaApiAdapter';
import { NasaOsdrAdapter } from '../../../src/adapters/nasa/NasaOsdrAdapter';
import { NasaNtrsAdapter } from '../../../src/adapters/nasa/NasaNtrsAdapter';
import { NasaDataPortalAdapter } from '../../../src/adapters/nasa/NasaDataPortalAdapter';

describe('NASA Data Sources & Scientific Resource Validation', () => {
  describe('NASA Open APIs (api.nasa.gov)', () => {
    it('verifies connection and respects DEMO_KEY rate limits (30 req/hr)', async () => {
      const adapter = new NasaApiAdapter({ apiKey: 'DEMO_KEY', mockMode: true });
      const rateInfo = adapter.getRateLimitInfo();

      expect(rateInfo.limitPerHour).toBe(30);
      expect(rateInfo.isDemoKey).toBe(true);

      const verification = await adapter.verifyConnection();
      expect(verification.isReachable).toBe(true);
      expect(verification.schemaCompliant).toBe(true);
    });

    it('handles registered API key quotas properly', () => {
      const adapter = new NasaApiAdapter({ apiKey: 'REGISTERED_NASA_KEY_123', mockMode: true });
      const rateInfo = adapter.getRateLimitInfo();

      expect(rateInfo.limitPerHour).toBe(1000);
      expect(rateInfo.isDemoKey).toBe(false);
    });
  });

  describe('NASA Open Science Data Repository (OSDR)', () => {
    const osdr = new NasaOsdrAdapter(true);

    it('searches studies by keyword and retrieves matching studies', async () => {
      const results = await osdr.searchStudies('Microgravity');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].accession).toMatch(/^OSD-\d+$/);
    });

    it('fetches specific study metadata for OSD-379 and validates schema', async () => {
      const study = await osdr.getStudy('OSD-379');
      expect(study).not.toBeNull();
      expect(study!.accession).toBe('OSD-379');

      const check = osdr.verifyStudySchema(study!);
      expect(check.isValid).toBe(true);
      expect(check.errors).toHaveLength(0);
    });

    it('validates study data file lineage and metadata fields', async () => {
      const study = await osdr.getStudy('OSD-379');
      expect(study!.dataFiles.length).toBeGreaterThan(0);
      expect(study!.dataFiles[0].fileName).toBeDefined();
      expect(study!.dataFiles[0].remoteUrl).toContain('osdr.nasa.gov');
    });
  });

  describe('NASA Technical Reports Server (NTRS)', () => {
    const ntrs = new NasaNtrsAdapter(true);

    it('retrieves citation metadata and checks completeness', async () => {
      const citation = await ntrs.getCitation('20210018596');
      expect(citation).not.toBeNull();
      expect(citation!.title).toContain('Host-Microorganism');

      const check = ntrs.validateCitationCompleteness(citation!);
      expect(check.isValid).toBe(true);
      expect(check.errors).toHaveLength(0);
    });

    it('searches aerospace citations by query terms', async () => {
      const citations = await ntrs.searchCitations('Cancer Risk');
      expect(citations.length).toBeGreaterThan(0);
      expect(citations[0].id).toBe('20205001712');
    });
  });

  describe('NASA Open Data Portal (data.nasa.gov)', () => {
    const portal = new NasaDataPortalAdapter(true);

    it('queries dataset discovery catalogue and validates records', async () => {
      const records = await portal.queryCatalog('Aerospace');
      expect(records.length).toBeGreaterThan(0);
      expect(records[0].datasetId).toBeDefined();

      const check = portal.verifyRecord(records[0]);
      expect(check.isValid).toBe(true);
    });
  });
});
