/**
 * AstroCare NASA Technical Reports Server (NTRS) Adapter
 * Official website: https://ntrs.nasa.gov/
 * Official API: https://ntrs.nasa.gov/api/openapi/
 * Validates publications, peer-reviewed citations, aerospace medicine literature.
 */

import { NasaNtrsCitation, NasaSourceVerificationResult } from '../../types/nasa';

export const SAMPLE_NTRS_FIXTURES: Record<string, NasaNtrsCitation> = {
  '20210018596': {
    id: '20210018596',
    title: 'Evidence Report: Risk of Adverse Health Effects Due to Host-Microorganism Interactions',
    authors: [
      { name: 'Crucian, Brian', affiliation: 'NASA Johnson Space Center' },
      { name: 'Sams, Clarence', affiliation: 'NASA Johnson Space Center' },
    ],
    publicationDate: '2021-05-01',
    abstract:
      'Human spaceflight results in an environment of microgravity, isolation, confinement, and altered radiation fields that impact the human immune system.',
    subjectCategories: ['Aerospace Medicine', 'Life Sciences (General)'],
    documentType: 'Technical Report',
    pdfAvailable: true,
    landingPageUrl: 'https://ntrs.nasa.gov/citations/20210018596',
  },
  '20205001712': {
    id: '20205001712',
    title: 'NASA Space Cancer Risk (NSCR-2020) Model and Radiation Quality Factor Formulation',
    authors: [
      { name: 'Cucinotta, Francis A.', affiliation: 'University of Nevada Las Vegas' },
      { name: 'Kim, Myung-Hee Y.', affiliation: 'NASA Langley Research Center' },
    ],
    publicationDate: '2020-03-15',
    abstract:
      'Formulation of space radiation cancer risk projections, heavy ion track structures, and non-targeted radiation effects for exploration missions.',
    subjectCategories: ['Space Radiation and Environmental Protection'],
    documentType: 'Conference Paper',
    pdfAvailable: true,
    landingPageUrl: 'https://ntrs.nasa.gov/citations/20205001712',
  },
};

export class NasaNtrsAdapter {
  private mockMode: boolean;

  constructor(mockMode: boolean = true) {
    this.mockMode = mockMode;
  }

  /**
   * Search publications in NTRS
   */
  public async searchCitations(query: string): Promise<NasaNtrsCitation[]> {
    if (this.mockMode) {
      const q = query.toLowerCase();
      return Object.values(SAMPLE_NTRS_FIXTURES).filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.abstract.toLowerCase().includes(q) ||
          c.authors.some((a) => a.name.toLowerCase().includes(q))
      );
    }

    const res = await fetch(`https://ntrs.nasa.gov/api/citations/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`NTRS Search failed: HTTP ${res.status}`);
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      id: String(r.id),
      title: r.title || 'Untitled Publication',
      authors: (r.authorAffiliations || []).map((a: any) => ({
        name: a.meta?.author?.name || 'Unknown Author',
        affiliation: a.meta?.organization?.name,
      })),
      publicationDate: r.published || '',
      abstract: r.abstract || '',
      subjectCategories: r.subjectCategories || [],
      documentType: r.distribution || 'Technical Paper',
      pdfAvailable: Array.isArray(r.downloads) && r.downloads.length > 0,
      landingPageUrl: `https://ntrs.nasa.gov/citations/${r.id}`,
    }));
  }

  /**
   * Fetch single citation by NTRS ID
   */
  public async getCitation(id: string): Promise<NasaNtrsCitation | null> {
    if (this.mockMode) {
      return SAMPLE_NTRS_FIXTURES[id] || null;
    }

    const res = await fetch(`https://ntrs.nasa.gov/api/citations/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`NTRS Citation retrieval failed: HTTP ${res.status}`);
    const r = await res.json();
    return {
      id: String(r.id),
      title: r.title,
      authors: (r.authorAffiliations || []).map((a: any) => ({
        name: a.meta?.author?.name || 'Unknown Author',
        affiliation: a.meta?.organization?.name,
      })),
      publicationDate: r.published || '',
      abstract: r.abstract || '',
      subjectCategories: r.subjectCategories || [],
      documentType: r.distribution || 'Technical Paper',
      pdfAvailable: Array.isArray(r.downloads) && r.downloads.length > 0,
      landingPageUrl: `https://ntrs.nasa.gov/citations/${r.id}`,
    };
  }

  /**
   * Validate citation completeness according to scientific citation standards
   */
  public validateCitationCompleteness(citation: NasaNtrsCitation): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!citation.id || citation.id.trim() === '') {
      errors.push('Missing publication identifier.');
    }
    if (!citation.title || citation.title.trim().length === 0) {
      errors.push('Missing publication title.');
    }
    if (!citation.authors || citation.authors.length === 0) {
      warnings.push('Citation lists no identifiable authors.');
    }
    if (!citation.landingPageUrl || !citation.landingPageUrl.startsWith('https://ntrs.nasa.gov/')) {
      errors.push('Invalid landing page URL.');
    }
    // As per NASA requirements: not every publication has a downloadable full-text PDF
    if (!citation.pdfAvailable) {
      warnings.push('Full-text PDF document is not attached to this citation metadata.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Run verification check on NTRS adapter
   */
  public async verifySource(): Promise<NasaSourceVerificationResult> {
    const start = performance.now();
    const citation = await this.getCitation('20210018596');
    const latency = performance.now() - start;

    if (!citation) {
      return {
        sourceName: 'NASA_NTRS',
        isReachable: false,
        isMocked: this.mockMode,
        rateLimitCompliant: true,
        schemaCompliant: false,
        latencyMs: Math.round(latency * 100) / 100,
        errors: ['Failed to retrieve test citation 20210018596'],
        warnings: [],
      };
    }

    const { isValid, errors, warnings } = this.validateCitationCompleteness(citation);

    return {
      sourceName: 'NASA_NTRS',
      isReachable: true,
      isMocked: this.mockMode,
      rateLimitCompliant: true,
      schemaCompliant: isValid,
      latencyMs: Math.round(latency * 100) / 100,
      errors,
      warnings,
    };
  }
}
