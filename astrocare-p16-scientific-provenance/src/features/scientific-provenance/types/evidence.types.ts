export type EvidenceType =
  | 'human_astronaut_study'
  | 'ground_human_analog'
  | 'animal_experiment'
  | 'cell_culture'
  | 'computational_model'
  | 'technical_report'
  | 'review_article'
  | 'research_summary'

export type SupportingRelationship =
  | 'direct_support'
  | 'corroborative'
  | 'contextual'
  | 'conflicting'
  | 'inconclusive'

export interface EvidenceRecord {
  id: string
  claimId: string
  sourceId: string
  studyType: EvidenceType
  organism: string
  population: string
  sampleSize?: string
  researchObjective: string
  methodology: string
  keyFindings: string
  limitations: string
  supportingRelationship: SupportingRelationship
  evidenceNotes?: string
  originalSourceUrl: string
  pageOrSection?: string
}

export interface CitationRelationship {
  id: string
  claimId: string
  sourceId: string
  evidenceId: string
  supportingSummary: string
  relationshipStatus: 'active' | 'under_review' | 'archived'
}
