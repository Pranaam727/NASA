import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ClaimStatus } from '../types/claim.types'
import { ResearchDomain } from '../types/source.types'

export const useScientificClaims = (options?: {
  searchQuery?: string
  claimStatus?: ClaimStatus | 'all'
  researchDomain?: ResearchDomain | 'all'
}) => {
  const {
    claims,
    sources,
    evidence,
    addClaim,
    updateClaim,
    deleteClaim,
    linkSourceToClaim,
    unlinkSourceFromClaim,
  } = useScientificProvenance()

  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      if (options?.claimStatus && options.claimStatus !== 'all' && c.claimStatus !== options.claimStatus) {
        return false
      }
      if (options?.researchDomain && options.researchDomain !== 'all' && c.researchDomain !== options.researchDomain) {
        return false
      }
      if (options?.searchQuery) {
        const q = options.searchQuery.toLowerCase().trim()
        const matchText = c.claimText.toLowerCase().includes(q)
        const matchDesc = c.evidenceDescription.toLowerCase().includes(q)
        const matchCategory = c.claimCategory.toLowerCase().includes(q)
        if (!matchText && !matchDesc && !matchCategory) return false
      }
      return true
    })
  }, [claims, options?.searchQuery, options?.claimStatus, options?.researchDomain])

  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources])
  const evidenceMap = useMemo(() => new Map(evidence.map((e) => [e.id, e])), [evidence])

  return {
    claims: filteredClaims,
    allClaims: claims,
    totalCount: claims.length,
    sourceMap,
    evidenceMap,
    addClaim,
    updateClaim,
    deleteClaim,
    linkSourceToClaim,
    unlinkSourceFromClaim,
  }
}
