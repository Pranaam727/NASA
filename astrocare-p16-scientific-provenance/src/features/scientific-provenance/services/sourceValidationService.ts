import { ScientificSource } from '../types/source.types'
import { SourceValidationResult, ValidationIssue, ValidationStatus } from '../types/validation.types'

export class SourceValidationService {
  /**
   * Normalizes a URL for duplicate detection
   */
  public static normalizeUrl(url: string): string {
    if (!url) return ''
    try {
      const parsed = new URL(url.trim())
      return `${parsed.hostname.toLowerCase()}${parsed.pathname.replace(/\/+$/, '')}`
    } catch {
      return url.trim().toLowerCase().replace(/\/+$/, '')
    }
  }

  /**
   * Normalizes DOI string (e.g. "10.1126/science.aau8650")
   */
  public static normalizeDoi(doi?: string): string {
    if (!doi) return ''
    return doi.trim().toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
  }

  /**
   * Normalizes dataset identifier
   */
  public static normalizeDatasetId(datasetId?: string): string {
    if (!datasetId) return ''
    return datasetId.trim().toUpperCase()
  }

  /**
   * Validates a single source against a collection of sources to detect duplicates and missing metadata
   */
  public static validateSource(
    source: ScientificSource,
    allSources: ScientificSource[] = []
  ): SourceValidationResult {
    const issues: ValidationIssue[] = []
    let isDuplicate = false
    let duplicateMatchId: string | undefined
    let duplicateMatchReason: string | undefined

    // 1. Mandatory metadata checks
    if (!source.title || source.title.trim() === '') {
      issues.push({
        rule: 'missing_title',
        severity: 'error',
        field: 'title',
        message: 'Source title is required for academic attribution.',
      })
    }

    if (!source.organization || source.organization.trim() === '') {
      issues.push({
        rule: 'missing_organization',
        severity: 'error',
        field: 'organization',
        message: 'Publishing organization or institution is missing.',
      })
    }

    if (!source.url || source.url.trim() === '') {
      issues.push({
        rule: 'missing_url',
        severity: 'error',
        field: 'url',
        message: 'Source original URL is missing.',
      })
    } else {
      // URL syntax check
      try {
        const parsed = new URL(source.url)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          issues.push({
            rule: 'invalid_url_protocol',
            severity: 'error',
            field: 'url',
            message: 'URL must use HTTP or HTTPS protocol.',
          })
        }
      } catch {
        issues.push({
          rule: 'malformed_url',
          severity: 'error',
          field: 'url',
          message: 'URL string is malformed or invalid.',
        })
      }
    }

    // 2. Publication date completeness
    if (!source.publicationDate || source.publicationDate.trim() === '') {
      issues.push({
        rule: 'missing_publication_date',
        severity: 'warning',
        field: 'publicationDate',
        message: 'Publication date is unavailable. Will be marked as n.d. in citations.',
      })
    }

    // 3. Authorship check
    if (!source.authors || source.authors.length === 0) {
      issues.push({
        rule: 'missing_authors',
        severity: 'warning',
        field: 'authors',
        message: 'No individual authors specified; organizational attribution will be used.',
      })
    }

    // 4. Peer-reviewed specific recommendations
    if (source.sourceType === 'peer_reviewed_paper' && !source.doi) {
      issues.push({
        rule: 'missing_doi',
        severity: 'info',
        field: 'doi',
        message: 'Peer-reviewed articles should include a valid Digital Object Identifier (DOI) where available.',
      })
    }

    // 5. NASA OSDR specific checks
    if (source.sourceType === 'nasa_osdr_study' && !source.datasetId) {
      issues.push({
        rule: 'missing_dataset_id',
        severity: 'warning',
        field: 'datasetId',
        message: 'NASA OSDR record should have an authentic study identifier (e.g. OSDR-379).',
      })
    }

    // 6. Duplicate Detection across other sources
    const normalizedUrl = this.normalizeUrl(source.url)
    const normalizedDoi = this.normalizeDoi(source.doi)
    const normalizedDatasetId = this.normalizeDatasetId(source.datasetId)

    for (const other of allSources) {
      if (other.id === source.id) continue

      // Check URL duplicate
      if (normalizedUrl && this.normalizeUrl(other.url) === normalizedUrl) {
        isDuplicate = true
        duplicateMatchId = other.id
        duplicateMatchReason = `Duplicate URL matches existing source ${other.id} ("${other.title}")`
        issues.push({
          rule: 'duplicate_url',
          severity: 'error',
          field: 'url',
          message: duplicateMatchReason,
        })
        break
      }

      // Check DOI duplicate
      if (normalizedDoi && this.normalizeDoi(other.doi) === normalizedDoi) {
        isDuplicate = true
        duplicateMatchId = other.id
        duplicateMatchReason = `Duplicate DOI (${source.doi}) matches existing source ${other.id}`
        issues.push({
          rule: 'duplicate_doi',
          severity: 'error',
          field: 'doi',
          message: duplicateMatchReason,
        })
        break
      }

      // Check Dataset ID duplicate
      if (normalizedDatasetId && this.normalizeDatasetId(other.datasetId) === normalizedDatasetId) {
        isDuplicate = true
        duplicateMatchId = other.id
        duplicateMatchReason = `Duplicate Dataset ID (${source.datasetId}) matches existing source ${other.id}`
        issues.push({
          rule: 'duplicate_dataset_id',
          severity: 'error',
          field: 'datasetId',
          message: duplicateMatchReason,
        })
        break
      }
    }

    // 7. Determine overall validation status
    let status: ValidationStatus = 'valid'
    const hasErrors = issues.some((i) => i.severity === 'error')
    const hasWarnings = issues.some((i) => i.severity === 'warning')

    if (isDuplicate) {
      status = 'duplicate_detected'
    } else if (hasErrors) {
      status = 'incomplete_metadata'
    } else if (hasWarnings) {
      status = 'manual_review_required'
    } else {
      status = 'valid'
    }

    return {
      sourceId: source.id,
      status,
      issues,
      metadataCheckedAt: new Date().toISOString(),
      isDuplicate,
      duplicateMatchId,
      duplicateMatchReason,
      reachabilityStatus: 'skipped', // live HTTP reachability is isolated from static metadata verification
    }
  }

  /**
   * Scans an entire list of sources for duplicates
   */
  public static findDuplicates(sources: ScientificSource[]): {
    duplicatesByUrl: Map<string, ScientificSource[]>
    duplicatesByDoi: Map<string, ScientificSource[]>
    duplicatesByDatasetId: Map<string, ScientificSource[]>
  } {
    const duplicatesByUrl = new Map<string, ScientificSource[]>()
    const duplicatesByDoi = new Map<string, ScientificSource[]>()
    const duplicatesByDatasetId = new Map<string, ScientificSource[]>()

    sources.forEach((s) => {
      const urlKey = this.normalizeUrl(s.url)
      if (urlKey) {
        const list = duplicatesByUrl.get(urlKey) || []
        list.push(s)
        duplicatesByUrl.set(urlKey, list)
      }

      const doiKey = this.normalizeDoi(s.doi)
      if (doiKey) {
        const list = duplicatesByDoi.get(doiKey) || []
        list.push(s)
        duplicatesByDoi.set(doiKey, list)
      }

      const datasetKey = this.normalizeDatasetId(s.datasetId)
      if (datasetKey) {
        const list = duplicatesByDatasetId.get(datasetKey) || []
        list.push(s)
        duplicatesByDatasetId.set(datasetKey, list)
      }
    })

    // Filter maps to only keys with > 1 entry
    const filterMultiples = (map: Map<string, ScientificSource[]>) => {
      const filtered = new Map<string, ScientificSource[]>()
      map.forEach((value, key) => {
        if (value.length > 1) filtered.set(key, value)
      })
      return filtered
    }

    return {
      duplicatesByUrl: filterMultiples(duplicatesByUrl),
      duplicatesByDoi: filterMultiples(duplicatesByDoi),
      duplicatesByDatasetId: filterMultiples(duplicatesByDatasetId),
    }
  }
}
