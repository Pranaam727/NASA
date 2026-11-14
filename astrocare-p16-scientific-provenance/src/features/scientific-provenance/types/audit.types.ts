export type AuditAction =
  | 'source_created'
  | 'source_updated'
  | 'source_deleted'
  | 'claim_created'
  | 'claim_updated'
  | 'claim_deleted'
  | 'evidence_linked'
  | 'evidence_unlinked'
  | 'validation_run'
  | 'status_changed'
  | 'citation_exported'
  | 'report_generated'

export interface ActivityRecord {
  id: string
  action: AuditAction
  affectedRecordId: string
  recordType: 'source' | 'claim' | 'evidence' | 'insight' | 'dataset'
  timestamp: string
  previousState?: any
  newState?: any
  actor: string
  description: string
  isLocalDemonstration: boolean
}
