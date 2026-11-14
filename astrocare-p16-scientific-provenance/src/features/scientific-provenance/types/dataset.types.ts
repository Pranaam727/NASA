export interface DatasetAttribution {
  datasetId: string
  title: string
  organization: string
  originalUrl: string
  retrievalDate: string
  studyType: string
  organism: string
  platform?: string
  assayType?: string
  missionOrFlight?: string
  associatedClaims: string[]
  associatedInsights: string[]
  relatedPublications: string[]
  status: 'active' | 'archived'
  description?: string
}
