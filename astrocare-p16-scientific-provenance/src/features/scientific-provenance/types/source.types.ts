export type SourceType =
  | 'nasa_publication'
  | 'nasa_technical_report'
  | 'nasa_hrp_page'
  | 'nasa_osdr_study'
  | 'peer_reviewed_paper'
  | 'scientific_dataset'
  | 'research_institution'
  | 'government_official'
  | 'other'

export type ResearchDomain =
  | 'radiation'
  | 'cardiovascular'
  | 'bone_and_muscle'
  | 'immune_system'
  | 'sleep_and_circadian'
  | 'neurovestibular'
  | 'behavioral'
  | 'multi_system'

export type VerificationStatus =
  | 'verified_authentic'
  | 'pending_verification'
  | 'unverified'
  | 'incomplete_metadata'
  | 'disputed'

export interface PublicationMetadata {
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  publisher?: string
  reportNumber?: string
  conference?: string
}

export interface ScientificSource {
  id: string
  title: string
  authors?: string[]
  organization: string
  sourceType: SourceType
  researchDomain: ResearchDomain
  publicationDate?: string // ISO or YYYY / YYYY-MM
  url: string
  doi?: string
  datasetId?: string
  description: string
  retrievalDate: string
  publicationMetadata?: PublicationMetadata
  verificationStatus: VerificationStatus
  isUserEntered?: boolean
  retrievalSource?: 'nasa_hrp' | 'nasa_ntrs' | 'nasa_osdr' | 'manual_entry' | 'crossref'
}
