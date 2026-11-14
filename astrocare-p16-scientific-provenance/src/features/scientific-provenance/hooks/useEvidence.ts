import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { EvidenceType, SupportingRelationship } from '../types/evidence.types'

export const useEvidence = (options?: {
  studyType?: EvidenceType | 'all'
  relationship?: SupportingRelationship | 'all'
  claimId?: string
  sourceId?: string
}) => {
  const { evidence, claims, sources, addEvidence, updateEvidence, deleteEvidence } =
    useScientificProvenance()

  const filteredEvidence = useMemo(() => {
    return evidence.filter((ev) => {
      if (options?.studyType && options.studyType !== 'all' && ev.studyType !== options.studyType) {
        return false
      }
      if (options?.relationship && options.relationship !== 'all' && ev.supportingRelationship !== options.relationship) {
        return false
      }
      if (options?.claimId && ev.claimId !== options.claimId) {
        return false
      }
      if (options?.sourceId && ev.sourceId !== options.sourceId) {
        return false
      }
      return true
    })
  }, [evidence, options?.studyType, options?.relationship, options?.claimId, options?.sourceId])

  const claimMap = useMemo(() => new Map(claims.map((c) => [c.id, c])), [claims])
  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources])

  return {
    evidenceList: filteredEvidence,
    allEvidence: evidence,
    claimMap,
    sourceMap,
    addEvidence,
    updateEvidence,
    deleteEvidence,
  }
}
