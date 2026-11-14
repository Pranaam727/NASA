export type ValidationStatus =
  | 'valid'
  | 'incomplete_metadata'
  | 'duplicate_detected'
  | 'url_unreachable'
  | 'manual_review_required'
  | 'not_checked'

export interface ValidationIssue {
  rule: string
  severity: 'error' | 'warning' | 'info'
  field?: string
  message: string
}

export interface SourceValidationResult {
  sourceId: string
  status: ValidationStatus
  issues: ValidationIssue[]
  metadataCheckedAt: string
  reachabilityStatus?: 'reachable' | 'unreachable_or_restricted' | 'skipped'
  reachabilityCheckedAt?: string
  isDuplicate: boolean
  duplicateMatchId?: string
  duplicateMatchReason?: string
}
