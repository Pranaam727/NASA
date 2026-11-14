import { ResearchDomain } from './source.types'

export type ClaimCategory =
  | 'physiological_adaptation'
  | 'pathological_risk'
  | 'countermeasure_efficacy'
  | 'biomarker_response'
  | 'environmental_stress'
  | 'operational_performance'

export type ClaimStatus =
  | 'supported'
  | 'partially_supported'
  | 'needs_review'
  | 'unsupported'
  | 'outdated'
  | 'disputed'

export interface ScientificClaim {
  id: string
  claimText: string
  researchDomain: ResearchDomain
  claimCategory: ClaimCategory
  sourceIds: string[]
  evidenceIds: string[]
  evidenceDescription: string
  studyPopulation?: string
  researchMethodology?: string
  limitations?: string
  claimStatus: ClaimStatus
  lastReviewed: string
  reviewerNotes?: string
}
