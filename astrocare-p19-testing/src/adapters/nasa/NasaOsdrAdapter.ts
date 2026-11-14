/**
 * AstroCare NASA Open Science Data Repository (OSDR) Adapter
 * Official resources: https://osdr.nasa.gov/ and geode-py ws API
 * Tests dataset search, study metadata retrieval, data file lineage, and biospecimens.
 */

import { NasaOsdrStudyMetadata, NasaSourceVerificationResult } from '../../types/nasa';

export const SAMPLE_OSDR_FIXTURES: Record<string, NasaOsdrStudyMetadata> = {
  'OSD-379': {
    accession: 'OSD-379',
    title: 'Transcriptomic and Epigenetic Profiling of Spaceflight-Associated Immune Alterations',
    description:
      'Investigating crew peripheral blood mononuclear cells pre-, during, and post-flight on ISS missions.',
    organism: 'Homo sapiens',
    missionName: 'ISS Expedition 64/65',
    spaceflightFactor: 'Microgravity and Galactic Cosmic Radiation',
    assaysCount: 4,
    samplesCount: 48,
    releaseDate: '2023-04-12',
    dataFiles: [
      {
        fileName: 'OSD-379_bulkRNAseq_normalized_counts.tsv',
        fileSize: 15420380,
        fileFormat: 'TSV',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-379/download/file1',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        fileName: 'OSD-379_study_metadata.json',
        fileSize: 34500,
        fileFormat: 'JSON',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-379/download/metadata',
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      },
    ],
  },
  'OSD-120': {
    accession: 'OSD-120',
    title: 'Musculoskeletal and Vascular Remodeling in Murine Models of Long-Duration Spaceflight',
    description: 'Histological and biomechanical evaluation of bone loss in Rodent Research missions.',
    organism: 'Mus musculus',
    missionName: 'Rodent Research-1 (RR-1)',
    spaceflightFactor: 'Prolonged Microgravity (30 days)',
    assaysCount: 2,
    samplesCount: 20,
    releaseDate: '2021-08-19',
    dataFiles: [
      {
        fileName: 'OSD-120_microCT_trabecular_parameters.csv',
        fileSize: 4200150,
        fileFormat: 'CSV',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-120/download/microCT',
      },
    ],
  },
};

export class NasaOsdrAdapter {
  private mockMode: boolean;

  constructor(mockMode: boolean = true) {
    this.mockMode = mockMode;
  }

  /**
   * Search OSDR studies
   */
  public async searchStudies(term: string): Promise<NasaOsdrStudyMetadata[]> {
    if (this.mockMode) {
      const lower = term.toLowerCase();
      return Object.values(SAMPLE_OSDR_FIXTURES).filter(
        (s) =>
          s.accession.toLowerCase().includes(lower) ||
          s.title.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower) ||
          (s.spaceflightFactor && s.spaceflightFactor.toLowerCase().includes(lower)) ||
          (s.missionName && s.missionName.toLowerCase().includes(lower)) ||
          s.organism.toLowerCase().includes(lower)
      );
    }

    const res = await fetch(`https://osdr.nasa.gov/geode-py/ws/repo/search?term=${encodeURIComponent(term)}`);
    if (!res.ok) throw new Error(`OSDR Search failed: HTTP ${res.status}`);
    const data = await res.json();
    return this.mapRawOsdrToStudyMetadata(data);
  }

  /**
   * Retrieve single study metadata by accession ID (e.g. "OSD-379")
   */
  public async getStudy(accession: string): Promise<NasaOsdrStudyMetadata | null> {
    if (this.mockMode) {
      return SAMPLE_OSDR_FIXTURES[accession] || null;
    }

    const res = await fetch(`https://osdr.nasa.gov/geode-py/ws/studies/${accession}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`OSDR Study retrieval failed: HTTP ${res.status}`);
    const data = await res.json();
    return this.mapRawOsdrToStudyMetadata(data)[0] || null;
  }

  /**
   * Verify OSDR schema integrity
   */
  public verifyStudySchema(study: NasaOsdrStudyMetadata): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!study.accession || !/^OSD-\d+$/.test(study.accession)) {
      errors.push(`Invalid OSDR accession format: "${study.accession}". Must match pattern OSD-XXX.`);
    }
    if (!study.title || study.title.trim().length === 0) {
      errors.push('Missing or empty study title.');
    }
    if (!study.organism || study.organism.trim().length === 0) {
      errors.push('Missing organism classification.');
    }
    if (typeof study.assaysCount !== 'number' || study.assaysCount < 0) {
      errors.push('Invalid assays count.');
    }
    if (typeof study.samplesCount !== 'number' || study.samplesCount < 0) {
      errors.push('Invalid samples count.');
    }
    if (!study.dataFiles || study.dataFiles.length === 0) {
      errors.push('Study metadata has no registered data files.');
    } else {
      for (const file of study.dataFiles) {
        if (!file.fileName || !file.fileFormat) {
          errors.push(`Incomplete data file record: ${JSON.stringify(file)}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Run verification check on OSDR provider
   */
  public async verifySource(): Promise<NasaSourceVerificationResult> {
    const start = performance.now();
    const sample = await this.getStudy('OSD-379');
    const latency = performance.now() - start;

    if (!sample) {
      return {
        sourceName: 'NASA_OSDR',
        isReachable: false,
        isMocked: this.mockMode,
        rateLimitCompliant: true,
        schemaCompliant: false,
        latencyMs: Math.round(latency * 100) / 100,
        errors: ['Failed to retrieve test accession OSD-379'],
        warnings: [],
      };
    }

    const { isValid, errors } = this.verifyStudySchema(sample);

    return {
      sourceName: 'NASA_OSDR',
      isReachable: true,
      isMocked: this.mockMode,
      rateLimitCompliant: true,
      schemaCompliant: isValid,
      latencyMs: Math.round(latency * 100) / 100,
      errors,
      warnings: [],
    };
  }

  private mapRawOsdrToStudyMetadata(raw: any): NasaOsdrStudyMetadata[] {
    const hits = raw.hits || (raw.study ? [raw.study] : []);
    return hits.map((h: any) => ({
      accession: h.accession || 'OSD-UNKNOWN',
      title: h.title || 'Untitled OSDR Study',
      description: h.description || '',
      organism: h.organism || 'Unknown',
      missionName: h.mission,
      spaceflightFactor: h.spaceflightFactor,
      assaysCount: Array.isArray(h.assays) ? h.assays.length : 1,
      samplesCount: Array.isArray(h.samples) ? h.samples.length : 0,
      releaseDate: h.releaseDate || new Date().toISOString(),
      dataFiles: (h.files || []).map((f: any) => ({
        fileName: f.name || 'unnamed_file',
        fileSize: f.size || 0,
        fileFormat: f.format || 'BINARY',
        remoteUrl: f.url || '',
      })),
    }));
  }
}
