import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { AuditAction, ActivityRecord } from '../types/audit.types'

export const useAudit = (options?: {
  action?: AuditAction | 'all'
  recordType?: ActivityRecord['recordType'] | 'all'
  searchQuery?: string
}) => {
  const { auditLog, logActivity } = useScientificProvenance()

  const filteredLogs = useMemo(() => {
    return auditLog.filter((log) => {
      if (options?.action && options.action !== 'all' && log.action !== options.action) {
        return false
      }
      if (options?.recordType && options.recordType !== 'all' && log.recordType !== options.recordType) {
        return false
      }
      if (options?.searchQuery) {
        const q = options.searchQuery.toLowerCase().trim()
        if (
          !log.description.toLowerCase().includes(q) &&
          !log.affectedRecordId.toLowerCase().includes(q) &&
          !log.actor.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [auditLog, options?.action, options?.recordType, options?.searchQuery])

  return {
    auditLog: filteredLogs,
    allLogs: auditLog,
    totalCount: auditLog.length,
    logActivity,
  }
}
