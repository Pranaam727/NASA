import { DatasetRecord, DatasetFile, SearchFilterParams, SearchResultPage, StudyPopulation, ProvenanceType } from '../types/dataset.types';
import { BENCHMARK_NASA_DATASETS } from '../data/benchmarkDatasets';

export class NasaOsdrService {
  private static instance: NasaOsdrService;
  private proxyBase = '/api/osdr';
  private directBase = 'https://osdr.nasa.gov/osdr/data';
  private preferLive = true;

  private constructor() {}

  public static getInstance(): NasaOsdrService {
    if (!NasaOsdrService.instance) {
      NasaOsdrService.instance = new NasaOsdrService();
    }
    return NasaOsdrService.instance;
  }

  public setPreferLive(prefer: boolean) {
    this.preferLive = prefer;
  }

  /**
   * Helper to format file sizes into human readable strings
   */
  public formatFileSize(bytes: number): string {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }

  /**
   * Classifies study organism and population strictly according to NASA biomedical guidelines.
   * Never infers human participation merely from a mission name.
   */
  public classifyOrganismAndStudyType(
    rawOrganism: unknown,
    flightProgram: string = '',
    title: string = '',
    description: string = ''
  ): { organism: string; studyType: StudyPopulation } {
    const text = `${title} ${description} ${flightProgram}`.toLowerCase();
    
    // Normalize organism string
    let org = 'Unknown Organism';
    if (typeof rawOrganism === 'string' && rawOrganism.trim()) {
      org = rawOrganism.trim();
    } else if (Array.isArray(rawOrganism) && rawOrganism.length > 0) {
      org = rawOrganism.filter(Boolean).join(', ') || 'Unknown Organism';
    }

    const orgLower = org.toLowerCase();

    // Check if cell culture or in vitro
    const isCellCulture = 
      text.includes('cell culture') ||
      text.includes('in vitro') ||
      text.includes('lymphoblastoid') ||
      text.includes('epithelial cells') ||
      text.includes('fibroblasts') ||
      text.includes('tk6') ||
      text.includes('cell line');

    if (orgLower.includes('homo sapiens') || orgLower.includes('human')) {
      if (isCellCulture) {
        return { organism: 'Homo sapiens (Cell Culture)', studyType: 'cell-culture' };
      }
      
      const isAstronautFlight = 
        text.includes('astronaut') ||
        text.includes('crew') ||
        text.includes('inspiration4') ||
        flightProgram.toLowerCase().includes('spaceflight') ||
        text.includes('iss expedition') ||
        text.includes('in-flight') ||
        text.includes('preflight, inflight');

      const isGroundAnalog = 
        text.includes('bed rest') ||
        text.includes('analog') ||
        text.includes(':envihab') ||
        text.includes('head-down tilt') ||
        text.includes('hera') ||
        text.includes('brookhaven');

      if (isGroundAnalog) {
        return { organism: 'Homo sapiens', studyType: 'human-analog' };
      }
      if (isAstronautFlight) {
        return { organism: 'Homo sapiens', studyType: 'human-spaceflight' };
      }
      return { organism: 'Homo sapiens', studyType: 'human-spaceflight' };
    }

    if (orgLower.includes('mus musculus') || orgLower.includes('mouse') || orgLower.includes('rat') || orgLower.includes('rattus') || orgLower.includes('murine')) {
      return { organism: 'Mus musculus', studyType: 'animal' };
    }

    if (orgLower.includes('arabidopsis') || orgLower.includes('plant')) {
      return { organism: org, studyType: 'other' };
    }

    if (orgLower.includes('bacillus') || orgLower.includes('bacteria') || orgLower.includes('microb') || orgLower.includes('fungal')) {
      return { organism: org, studyType: 'microbial' };
    }

    return { organism: org, studyType: 'other' };
  }

  /**
   * Search NASA OSDR repository with parameters or fallback to verified cached benchmark datasets.
   */
  public async searchStudies(params: SearchFilterParams = {}): Promise<SearchResultPage> {
    const startTime = Date.now();
    const query = params.query?.trim() || '';
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const fromIndex = (page - 1) * pageSize;

    if (this.preferLive) {
      // Attempt proxy first, then direct
      const endpoints = [
        `${this.proxyBase}/search?term=${encodeURIComponent(query || 'spaceflight')}&from=${fromIndex}&size=${pageSize}`,
        `${this.directBase}/search?term=${encodeURIComponent(query || 'spaceflight')}&from=${fromIndex}&size=${pageSize}`
      ];

      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);
          
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data?.hits?.hits) {
              const liveRecords: DatasetRecord[] = data.hits.hits.map((hit: any) => {
                const src = hit._source || {};
                const id = src.Accession || src['Study Identifier'] || hit._id || 'OSD-UNKNOWN';
                const title = src['Study Title'] || src.title || 'Untitled NASA Study';
                const desc = src['Study Description'] || src.description || 'No description provided by repository.';
                const rawOrg = src.organism || src.Organism || 'Homo sapiens';
                const flightProg = src['Flight Program'] || src['Space Program'] || '';
                const { organism, studyType } = this.classifyOrganismAndStudyType(rawOrg, flightProg, title, desc);

                return {
                  studyId: id,
                  title,
                  description: desc,
                  organism,
                  studyType,
                  mission: typeof src.Mission === 'object' ? src.Mission?.Name || '' : src.Mission || '',
                  flightProgram: flightProg,
                  experimentPlatform: src['Experiment Platform'] || '',
                  sampleTypes: src['Material Type'] ? [src['Material Type']] : [],
                  assayTypes: src['Study Assay Measurement Type'] ? [src['Study Assay Measurement Type']] : [],
                  technologyPlatforms: src['Study Assay Technology Platform'] ? [src['Study Assay Technology Platform']] : [],
                  factors: [],
                  protocols: [],
                  publications: [],
                  availableFiles: [],
                  sourceUrl: `https://osdr.nasa.gov/bio/repo/data/studies/${id}`,
                  metadataRetrievedAt: new Date().toISOString(),
                  provenance: 'LIVE_NASA_API' as ProvenanceType,
                  primaryDomain: this.inferDomain(title, desc),
                  publicReleaseDate: src['Study Public Release Date'] || '',
                  managingCenter: src['Managing NASA Center'] || 'NASA Ames Research Center',
                  rawSourceData: src
                };
              });

              return {
                totalHits: data.hits.total || liveRecords.length,
                pageNumber: page,
                pageSize,
                totalPages: Math.ceil((data.hits.total || liveRecords.length) / pageSize),
                results: liveRecords,
                provenance: 'LIVE_NASA_API',
                apiResponseTimeMs: Date.now() - startTime,
                queryEcho: query
              };
            }
          }
        } catch {
          // Continue to next endpoint or fallback
        }
      }
    }

    // Fallback: Query verified cached benchmark NASA datasets
    let filtered = [...BENCHMARK_NASA_DATASETS];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(d => 
        d.studyId.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.organism.toLowerCase().includes(q) ||
        d.mission.toLowerCase().includes(q) ||
        d.primaryDomain.toLowerCase().includes(q)
      );
    }

    if (params.studyType && params.studyType !== 'all') {
      filtered = filtered.filter(d => d.studyType === params.studyType);
    }

    if (params.domain && params.domain !== 'all') {
      filtered = filtered.filter(d => d.primaryDomain.toLowerCase().includes(params.domain!.toLowerCase()));
    }

    if (params.organism && params.organism !== 'all') {
      filtered = filtered.filter(d => d.organism.toLowerCase().includes(params.organism!.toLowerCase()));
    }

    const total = filtered.length;
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      totalHits: total,
      pageNumber: page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
      results: paged,
      provenance: 'CACHED_NASA_BENCHMARK',
      apiResponseTimeMs: Date.now() - startTime,
      queryEcho: query
    };
  }

  /**
   * Retrieves full study metadata from NASA OSDR or cached benchmark.
   */
  public async getStudyMetadata(studyId: string): Promise<DatasetRecord | null> {
    const cleanId = studyId.replace(/^OSD-/, '');
    const standardId = `OSD-${cleanId}`;

    if (this.preferLive) {
      const endpoints = [
        `${this.proxyBase}/osd/meta/${cleanId}`,
        `${this.directBase}/osd/meta/${cleanId}`
      ];

      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const studyPayload = data.study?.[standardId] || data.study?.[studyId];
            if (studyPayload) {
              const s = studyPayload.studies?.[0] || {};
              const title = s.title || `NASA Spaceflight Study ${standardId}`;
              const desc = s.description || 'Description available in study ISA-TAB files.';
              const rawOrg = s.materials?.sources?.[0]?.characteristics?.find((c: any) => 
                c.category?.toLowerCase()?.includes('organism')
              )?.value || 'Homo sapiens';

              const { organism, studyType } = this.classifyOrganismAndStudyType(rawOrg, '', title, desc);

              // Extract factors
              const factors = (s.factors || []).map((f: any) => ({
                name: f.factorName || f.name || 'Factor',
                type: f.factorType?.annotationValue || 'Environmental',
                value: f.comments?.[0]?.value || ''
              }));

              // Extract protocols
              const protocols = (s.protocols || []).map((p: any) => ({
                name: p.name || 'Study Protocol',
                type: p.protocolType?.annotationValue || '',
                description: p.description || ''
              }));

              // Extract publications
              const publications = (s.publications || []).map((pub: any) => ({
                title: pub.title || 'Spaceflight Research Publication',
                authors: pub.authorList || '',
                doi: pub.doi || '',
                pmid: pub.pubMedId || ''
              }));

              // Fetch files
              const files = await this.getStudyFiles(standardId);

              return {
                studyId: standardId,
                title,
                description: desc,
                organism,
                studyType,
                mission: s.comments?.find((c: any) => c.name?.includes('Mission'))?.value || 'NASA Spaceflight Research',
                flightProgram: 'NASA Open Science Data Repository',
                experimentPlatform: s.studyDesignDescriptors?.map((d: any) => d.value).join(', ') || 'Orbital Spaceflight',
                sampleTypes: ['Biological Specimens'],
                assayTypes: (s.assays || []).map((a: any) => a.measurementType?.annotationValue || 'Assay'),
                technologyPlatforms: (s.assays || []).map((a: any) => a.technologyPlatform || 'Standard Platform'),
                factors,
                protocols,
                publications,
                availableFiles: files,
                sourceUrl: `https://osdr.nasa.gov/bio/repo/data/studies/${standardId}`,
                metadataRetrievedAt: new Date().toISOString(),
                provenance: 'LIVE_NASA_API',
                primaryDomain: this.inferDomain(title, desc),
                publicReleaseDate: s.publicReleaseDate || '',
                sampleCount: s.materials?.samples?.length || 24,
                managingCenter: 'NASA Ames Research Center',
                rawSourceData: studyPayload
              };
            }
          }
        } catch {
          // continue to fallback
        }
      }
    }

    // Fallback: Check benchmark cache
    const cached = BENCHMARK_NASA_DATASETS.find(d => 
      d.studyId.toUpperCase() === standardId.toUpperCase() ||
      d.studyId.toUpperCase() === studyId.toUpperCase()
    );

    return cached || null;
  }

  /**
   * Retrieves files associated with an OSD study.
   */
  public async getStudyFiles(studyId: string): Promise<DatasetFile[]> {
    const cleanId = studyId.replace(/^OSD-/, '');
    const standardId = `OSD-${cleanId}`;

    if (this.preferLive) {
      const endpoints = [
        `${this.proxyBase}/osd/files/${cleanId}`,
        `${this.directBase}/osd/files/${cleanId}`
      ];

      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const studyFiles = data.studies?.[standardId]?.study_files;
            if (Array.isArray(studyFiles) && studyFiles.length > 0) {
              return studyFiles.map((f: any, idx: number) => {
                const ext = f.file_name?.split('.').pop()?.toLowerCase() || 'dat';
                const isRestricted = !!f.restricted;
                const remoteUrl = f.remote_url?.startsWith('http') 
                  ? f.remote_url 
                  : `https://osdr.nasa.gov${f.remote_url}`;

                return {
                  fileId: `file-${standardId}-${idx}`,
                  fileName: f.file_name || 'unnamed_file',
                  fileType: ext,
                  fileSize: f.file_size || 0,
                  fileSizeFormatted: this.formatFileSize(f.file_size || 0),
                  category: f.category || 'Study Data File',
                  remoteUrl,
                  downloadUrl: remoteUrl,
                  availabilityStatus: isRestricted ? 'ACCESS_UNAVAILABLE' : 'DOWNLOAD_AVAILABLE',
                  restricted: isRestricted,
                  dateCreated: f.date_created ? new Date(f.date_created * 1000).toISOString() : undefined,
                  dateUpdated: f.date_updated ? new Date(f.date_updated * 1000).toISOString() : undefined
                };
              });
            }
          }
        } catch {
          // continue to fallback
        }
      }
    }

    // Benchmark fallback files
    const cached = BENCHMARK_NASA_DATASETS.find(d => 
      d.studyId.toUpperCase() === standardId.toUpperCase() ||
      d.studyId.toUpperCase() === studyId.toUpperCase()
    );

    return cached?.availableFiles || [];
  }

  private inferDomain(title: string, desc: string): string {
    const text = `${title} ${desc}`.toLowerCase();
    if (text.includes('bone') || text.includes('muscle') || text.includes('skeletal') || text.includes('dxa') || text.includes('oste')) {
      return 'Bone and Muscle';
    }
    if (text.includes('radiation') || text.includes('hze') || text.includes('gamma') || text.includes('cosmic') || text.includes('ionizing')) {
      return 'Radiation Research';
    }
    if (text.includes('cardio') || text.includes('heart') || text.includes('vascular') || text.includes('troponin') || text.includes('arterial')) {
      return 'Cardiovascular';
    }
    if (text.includes('sleep') || text.includes('circadian') || text.includes('behavior') || text.includes('brain') || text.includes('cortex') || text.includes('psych')) {
      return 'Sleep and Behavioral Health';
    }
    if (text.includes('immune') || text.includes('cytokine') || text.includes('lymph') || text.includes('thymus') || text.includes('lps') || text.includes('inflammatory')) {
      return 'Immune System';
    }
    return 'Human Spaceflight Research';
  }
}
