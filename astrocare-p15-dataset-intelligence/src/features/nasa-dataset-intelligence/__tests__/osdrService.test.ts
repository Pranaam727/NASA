import { describe, it, expect, beforeEach } from 'vitest';
import { NasaOsdrService } from '../services/nasaOsdrService';

describe('NasaOsdrService', () => {
  const service = NasaOsdrService.getInstance();

  beforeEach(() => {
    service.setPreferLive(false);
  });

  it('correctly classifies human spaceflight study without confusing with mission title alone', () => {
    const res = service.classifyOrganismAndStudyType(
      'Homo sapiens',
      'Commercial Crew / Inspiration4',
      'SpaceX Inspiration4 Blood Serum Metabolic Panel',
      'Astronaut crew collected biospecimens before, during, and after flight'
    );
    expect(res.organism).toBe('Homo sapiens');
    expect(res.studyType).toBe('human-spaceflight');
  });

  it('correctly classifies murine animal studies', () => {
    const res = service.classifyOrganismAndStudyType(
      'Mus musculus',
      'Space Transportation System (STS)',
      'Microarray Analysis of Space-flown Murine Thymus Tissue',
      'C57BL/6J mice flown aboard Space Shuttle mission STS-118'
    );
    expect(res.organism).toBe('Mus musculus');
    expect(res.studyType).toBe('animal');
  });

  it('correctly classifies in vitro human cell culture studies', () => {
    const res = service.classifyOrganismAndStudyType(
      'Homo sapiens',
      'Ground Simulation',
      'Response of human lymphoblastoid cells to HZE',
      'Human lymphoblastoid TK6 cell line irradiated at Brookhaven NSRL'
    );
    expect(res.studyType).toBe('cell-culture');
  });

  it('formats file sizes accurately into human readable strings', () => {
    expect(service.formatFileSize(1024)).toBe('1.0 KB');
    expect(service.formatFileSize(1048576)).toBe('1.0 MB');
    expect(service.formatFileSize(71702)).toBe('70.0 KB');
    expect(service.formatFileSize(0)).toBe('0 B');
  });

  it('retrieves cached benchmark metadata when offline or fallback mode', async () => {
    const study = await service.getStudyMetadata('OSD-575');
    expect(study).not.toBeNull();
    expect(study?.studyId).toBe('OSD-575');
    expect(study?.organism).toBe('Homo sapiens');
    expect(study?.studyType).toBe('human-spaceflight');
    expect(study?.availableFiles.length).toBeGreaterThan(0);
  });

  it('performs search across benchmark studies in fallback mode', async () => {
    const res = await service.searchStudies({ query: 'Inspiration4' });
    expect(res.totalHits).toBeGreaterThan(0);
    expect(res.results[0].studyId).toBe('OSD-575');
    expect(res.provenance).toBe('CACHED_NASA_BENCHMARK');
  });
});
