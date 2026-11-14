export interface ResearchReportConfig {
  title: string
  includedClaimIds: string[]
  includeEvidenceClassifications: boolean
  includeStudyPopulations: boolean
  includeMethodology: boolean
  includeLimitations: boolean
  includeMissingSourceWarnings: boolean
  includeCitationList: boolean
  citationStyle: 'apa' | 'ieee' | 'vancouver' | 'harvard'
  includeProvenanceLineage: boolean
  includeDatasetAttribution: boolean
  generatedBy: string
}

export interface GeneratedReport {
  id: string
  title: string
  generatedAt: string
  generatedBy: string
  claimCount: number
  sourceCount: number
  evidenceCount: number
  missingSourceWarningCount: number
  markdownContent: string
  jsonExport: any
}
