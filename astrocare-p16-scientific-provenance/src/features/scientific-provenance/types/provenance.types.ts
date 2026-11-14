export type ProvenanceMethod =
  | 'nasa_research_based'
  | 'scientific_publication_based'
  | 'dataset_derived'
  | 'user_entered'
  | 'ai_generated_interpretation'
  | 'synthetic_demonstration'
  | 'unverified'

export type SimulationStatus =
  | 'authentic_flight_data'
  | 'ground_analog_data'
  | 'simulated'
  | 'hybrid'

export type ProvenanceReviewStatus =
  | 'verified'
  | 'under_review'
  | 'flagged_unsupported'

export interface InsightProvenance {
  id: string
  insightText: string
  generationMethod: ProvenanceMethod
  relatedHealthDomain: string
  relatedDatasetIds: string[]
  supportingSourceIds: string[]
  createdAt: string
  retrievalDate: string
  aiModelMetadata?: {
    modelName: string
    promptVersion?: string
    temperature?: number
    confidenceScore?: number
  }
  simulationStatus: SimulationStatus
  reviewStatus: ProvenanceReviewStatus
  moduleOrigin?: string // e.g. "P08_Cardiovascular", "P12_Radiation", "P15_GeminiAI"
}
