import { ScientificSource } from '../types/source.types'
import { CitationStyle, FormattedCitation } from '../types/citation.types'

export class CitationService {
  /**
   * Formats author names for APA: "LastName, F. M., & LastName, F."
   */
  private static formatAuthorsAPA(authors?: string[]): { text: string; missing: boolean } {
    if (!authors || authors.length === 0) {
      return { text: '[Author Unavailable]', missing: true }
    }
    if (authors.length === 1) {
      return { text: authors[0], missing: false }
    }
    if (authors.length <= 7) {
      const allExceptLast = authors.slice(0, -1).join(', ')
      return { text: `${allExceptLast}, & ${authors[authors.length - 1]}`, missing: false }
    }
    // More than 7 authors: first 6, ... last author
    const firstSix = authors.slice(0, 6).join(', ')
    return { text: `${firstSix}, ... ${authors[authors.length - 1]}`, missing: false }
  }

  /**
   * Formats author names for IEEE: "F. M. LastName and F. LastName"
   */
  private static formatAuthorsIEEE(authors?: string[]): { text: string; missing: boolean } {
    if (!authors || authors.length === 0) {
      return { text: '[Author Unavailable]', missing: true }
    }
    if (authors.length === 1) return { text: authors[0], missing: false }
    if (authors.length === 2) return { text: `${authors[0]} and ${authors[1]}`, missing: false }
    return { text: `${authors[0]} et al.`, missing: false }
  }

  /**
   * Formats author names for Vancouver: "LastName FM, LastName F."
   */
  private static formatAuthorsVancouver(authors?: string[]): { text: string; missing: boolean } {
    if (!authors || authors.length === 0) {
      return { text: '[Author Unavailable]', missing: true }
    }
    if (authors.length <= 6) {
      return { text: authors.join(', '), missing: false }
    }
    return { text: `${authors.slice(0, 6).join(', ')}, et al.`, missing: false }
  }

  /**
   * Formats author names for Harvard: "LastName, F. and LastName, F."
   */
  private static formatAuthorsHarvard(authors?: string[]): { text: string; missing: boolean } {
    if (!authors || authors.length === 0) {
      return { text: '[Author Unavailable]', missing: true }
    }
    if (authors.length === 1) return { text: authors[0], missing: false }
    if (authors.length === 2) return { text: `${authors[0]} and ${authors[1]}`, missing: false }
    if (authors.length === 3) return { text: `${authors[0]}, ${authors[1]} and ${authors[2]}`, missing: false }
    return { text: `${authors[0]} et al.`, missing: false }
  }

  /**
   * Extracts year from date string (e.g. "2019-04-12" -> "2019")
   */
  private static extractYear(dateStr?: string): { year: string; missing: boolean } {
    if (!dateStr || dateStr.trim() === '') {
      return { year: 'n.d.', missing: true }
    }
    const match = dateStr.match(/\b(19\d\d|20\d\d)\b/)
    if (match) {
      return { year: match[1], missing: false }
    }
    return { year: dateStr, missing: false }
  }

  /**
   * Generates a citation in the specified style
   */
  public static formatCitation(source: ScientificSource, style: CitationStyle = 'apa'): FormattedCitation {
    const missingFields: string[] = []
    const rawMetadata = {
      authors: source.authors,
      title: source.title,
      organization: source.organization,
      publicationDate: source.publicationDate,
      journal: source.publicationMetadata?.journal,
      doi: source.doi,
      url: source.url,
    }

    if (!source.authors || source.authors.length === 0) {
      missingFields.push('Authors')
    }
    if (!source.publicationDate) {
      missingFields.push('Publication Date')
    }
    if (!source.url) {
      missingFields.push('URL')
    }
    if (source.sourceType === 'peer_reviewed_paper' && !source.doi) {
      missingFields.push('DOI (Recommended for peer-reviewed paper)')
    }

    const yearInfo = this.extractYear(source.publicationDate)
    const publisherOrOrg = source.publicationMetadata?.publisher || source.organization
    const journal = source.publicationMetadata?.journal
    const volume = source.publicationMetadata?.volume
    const issue = source.publicationMetadata?.issue ? `(${source.publicationMetadata.issue})` : ''
    const pages = source.publicationMetadata?.pages ? `, ${source.publicationMetadata.pages}` : ''
    const reportNum = source.publicationMetadata?.reportNumber ? ` (${source.publicationMetadata.reportNumber})` : ''
    const doiPart = source.doi ? ` https://doi.org/${source.doi}` : ''
    const urlPart = source.url ? ` Available at: ${source.url}` : ''

    let formattedText = ''

    switch (style) {
      case 'apa': {
        const authorInfo = this.formatAuthorsAPA(source.authors)
        const authorStr = authorInfo.missing ? source.organization : authorInfo.text
        if (journal) {
          formattedText = `${authorStr} (${yearInfo.year}). ${source.title}. ${journal}, ${volume || ''}${issue}${pages}.${doiPart || ` ${source.url}`}`
        } else {
          formattedText = `${authorStr} (${yearInfo.year}). ${source.title}${reportNum}. ${publisherOrOrg}.${doiPart || ` ${source.url}`}`
        }
        break
      }

      case 'ieee': {
        const authorInfo = this.formatAuthorsIEEE(source.authors)
        const authorStr = authorInfo.missing ? source.organization : authorInfo.text
        if (journal) {
          formattedText = `${authorStr}, "${source.title}," ${journal}, vol. ${volume || 'n/a'}${issue ? ', no. ' + source.publicationMetadata?.issue : ''}${pages}, ${yearInfo.year}.${doiPart ? ` doi: ${source.doi}.` : ` [Online]. Available: ${source.url}`}`
        } else {
          formattedText = `${authorStr}, "${source.title}," ${publisherOrOrg}${reportNum}, ${yearInfo.year}. [Online]. Available: ${source.url}`
        }
        break
      }

      case 'vancouver': {
        const authorInfo = this.formatAuthorsVancouver(source.authors)
        const authorStr = authorInfo.missing ? source.organization : authorInfo.text
        if (journal) {
          formattedText = `${authorStr}. ${source.title}. ${journal}. ${yearInfo.year}${volume ? ';' + volume : ''}${issue}${pages ? ':' + source.publicationMetadata?.pages : ''}.${doiPart || ` Available from: ${source.url}`}`
        } else {
          formattedText = `${authorStr}. ${source.title}${reportNum}. ${publisherOrOrg}; ${yearInfo.year}.${doiPart || ` Available from: ${source.url}`}`
        }
        break
      }

      case 'harvard': {
        const authorInfo = this.formatAuthorsHarvard(source.authors)
        const authorStr = authorInfo.missing ? source.organization : authorInfo.text
        if (journal) {
          formattedText = `${authorStr} (${yearInfo.year}) '${source.title}', ${journal}, ${volume || ''}${issue}${pages}.${urlPart}`
        } else {
          formattedText = `${authorStr} (${yearInfo.year}) ${source.title}${reportNum}, ${publisherOrOrg}.${urlPart}`
        }
        break
      }
    }

    return {
      sourceId: source.id,
      style,
      formattedText,
      isComplete: missingFields.length === 0,
      missingFields,
      rawMetadata,
    }
  }

  /**
   * Exports a collection of sources as a formatted BibTeX string
   */
  public static exportBibTeX(sources: ScientificSource[]): string {
    return sources.map((s) => {
      const citeKey = s.id.replace(/[^a-zA-Z0-9_-]/g, '_')
      const authors = s.authors && s.authors.length > 0 ? s.authors.join(' and ') : s.organization
      const year = s.publicationDate?.match(/\b(19\d\d|20\d\d)\b/)?.[1] || 'n.d.'
      const entryType = s.sourceType === 'peer_reviewed_paper' ? 'article' : 'techreport'

      let bib = `@${entryType}{${citeKey},\n`
      bib += `  title = {${s.title}},\n`
      bib += `  author = {${authors}},\n`
      bib += `  year = {${year}},\n`
      if (s.publicationMetadata?.journal) {
        bib += `  journal = {${s.publicationMetadata.journal}},\n`
      }
      if (s.publicationMetadata?.volume) {
        bib += `  volume = {${s.publicationMetadata.volume}},\n`
      }
      if (s.publicationMetadata?.pages) {
        bib += `  pages = {${s.publicationMetadata.pages}},\n`
      }
      if (s.publicationMetadata?.reportNumber) {
        bib += `  number = {${s.publicationMetadata.reportNumber}},\n`
      }
      bib += `  institution = {${s.organization}},\n`
      if (s.doi) {
        bib += `  doi = {${s.doi}},\n`
      }
      bib += `  url = {${s.url}},\n`
      bib += `  note = {Retrieved: ${s.retrievalDate}}\n`
      bib += `}`
      return bib
    }).join('\n\n')
  }
}
