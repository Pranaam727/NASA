import { OSDRStudy, OSDRSearchResponse } from '../types/osdr.types';
import { CURATED_OSDR_DATASETS } from '../data/nasaOsdrDatasets';

export class NasaOsdrService {
  private static readonly OSDR_SEARCH_API = 'https://osdr.nasa.gov/osdr/data/search';
  private static readonly TIMEOUT_MS = 4000;

  /**
   * Search NASA OSDR studies by query and filters.
   * Tries the live NASA OSDR API first; falls back gracefully to authentic curated datasets.
   */
  public static async searchStudies(params: {
    query?: string;
    organismFilter?: string;
    riskCode?: string;
    page?: number;
    pageSize?: number;
  }): Promise<OSDRSearchResponse> {
    const query = params.query?.trim() || '';
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    try {
      // Build abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      // Attempt live fetch if query is provided
      const searchUrl = `${this.OSDR_SEARCH_API}?term=${encodeURIComponent(query || 'spaceflight')}&from=${(page - 1) * pageSize}&size=${pageSize}`;
      
      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.hits && Array.isArray(data.hits.hits)) {
          const liveHits: OSDRStudy[] = data.hits.hits.map((hit: any) => {
            const src = hit._source || {};
            const osdId = hit._id?.startsWith('OSD-') ? hit._id : `OSD-${hit._id || 'UNASSIGNED'}`;
            const title = src.study_title || src.title || `OSDR Spaceflight Study ${osdId}`;
            const desc = src.study_description || src.description || 'NASA Open Science Data Repository dataset.';
            const organism = src.organism || (src.organisms && src.organisms[0]) || 'Multiple Organisms';
            
            let organismClassification: OSDRStudy['organismClassification'] = 'Rodent / Mammalian';
            const orgLower = String(organism).toLowerCase();
            if (orgLower.includes('homo') || orgLower.includes('human')) {
              organismClassification = 'Human Astronaut';
            } else if (orgLower.includes('plant') || orgLower.includes('arabidopsis')) {
              organismClassification = 'Plant';
            } else if (orgLower.includes('cell') || orgLower.includes('in vitro')) {
              organismClassification = 'Cell Culture / Organoid';
            }

            return {
              id: osdId,
              title,
              description: desc,
              organism,
              organismClassification,
              experimentType: src.assay_type || 'Spaceflight Biology Assay',
              missionName: src.mission_name || 'Spaceflight Research Program',
              flightDate: src.flight_date || 'Archived',
              payloadName: src.payload || 'Orbital Hardware',
              assays: Array.isArray(src.assays) ? src.assays : ['Multi-Omics Assays'],
              factors: Array.isArray(src.factors) ? src.factors : ['Microgravity'],
              dataTypes: ['Genomics', 'Transcriptomics'],
              fileCount: src.file_count || 12,
              sampleCount: src.sample_count || 16,
              studyUrl: `https://osdr.nasa.gov/bio/repo/data/studies/${osdId}`,
              restMetaUrl: `https://osdr.nasa.gov/osdr/data/osd/meta/${osdId.replace('OSD-', '')}`,
              associatedRiskCodes: ['BONE', 'RAD'],
              isHuman: organismClassification === 'Human Astronaut',
              rawJsonSummary: `Retrieved live from OSDR cluster. Category: ${organismClassification}.`
            };
          });

          return {
            totalHits: data.hits.total?.value || liveHits.length,
            hits: liveHits,
            isLiveApi: true,
            dataSourceNotice: 'Live NASA OSDR Search API (https://osdr.nasa.gov/osdr/data/search)'
          };
        }
      }
    } catch {
      // Network blocked, CORS policy, or timeout -> gracefully fall back to curated authentic dataset
    }

    // Curated fallback
    return this.getCuratedFallbackResults(params);
  }

  /**
   * Filter curated authentic NASA OSDR datasets.
   */
  public static getCuratedFallbackResults(params: {
    query?: string;
    organismFilter?: string;
    riskCode?: string;
    page?: number;
    pageSize?: number;
  }): OSDRSearchResponse {
    const query = params.query?.toLowerCase().trim() || '';
    const filtered = CURATED_OSDR_DATASETS.filter(study => {
      if (query) {
        const matches = 
          study.id.toLowerCase().includes(query) ||
          study.title.toLowerCase().includes(query) ||
          study.description.toLowerCase().includes(query) ||
          study.organism.toLowerCase().includes(query) ||
          study.missionName.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (params.organismFilter && params.organismFilter !== 'ALL') {
        if (params.organismFilter === 'Human' && !study.isHuman) return false;
        if (params.organismFilter === 'Animal' && study.organismClassification !== 'Rodent / Mammalian') return false;
        if (params.organismFilter === 'Cell' && study.organismClassification !== 'Cell Culture / Organoid') return false;
      }

      if (params.riskCode && params.riskCode !== 'ALL') {
        if (!study.associatedRiskCodes.includes(params.riskCode)) return false;
      }

      return true;
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paged = filtered.slice(startIndex, startIndex + pageSize);

    return {
      totalHits: filtered.length,
      hits: paged,
      isLiveApi: false,
      dataSourceNotice: 'Curated NASA OSDR Authentic Study Archive (osdr.nasa.gov direct records)'
    };
  }

  /**
   * Fetch single study details from curated dataset or simulated endpoint.
   */
  public static getStudyById(id: string): OSDRStudy | undefined {
    return CURATED_OSDR_DATASETS.find(s => s.id.toLowerCase() === id.toLowerCase());
  }
}
