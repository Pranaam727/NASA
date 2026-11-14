export type CitationStyle = 'apa' | 'ieee' | 'vancouver' | 'harvard'

export interface FormattedCitation {
  sourceId: string
  style: CitationStyle
  formattedText: string
  isComplete: boolean
  missingFields: string[]
  rawMetadata: {
    authors?: string[]
    title: string
    organization: string
    publicationDate?: string
    journal?: string
    doi?: string
    url: string
  }
}
