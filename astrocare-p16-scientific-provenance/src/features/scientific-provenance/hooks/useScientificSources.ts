import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { SourceType, ResearchDomain } from '../types/source.types'

export const useScientificSources = (options?: {
  searchQuery?: string
  sourceType?: SourceType | 'all'
  researchDomain?: ResearchDomain | 'all'
  verificationStatus?: string | 'all'
}) => {
  const { sources, addSource, updateSource, deleteSource, validationResults } = useScientificProvenance()

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      if (options?.sourceType && options.sourceType !== 'all' && s.sourceType !== options.sourceType) {
        return false
      }
      if (options?.researchDomain && options.researchDomain !== 'all' && s.researchDomain !== options.researchDomain) {
        return false
      }
      if (options?.verificationStatus && options.verificationStatus !== 'all' && s.verificationStatus !== options.verificationStatus) {
        return false
      }
      if (options?.searchQuery) {
        const q = options.searchQuery.toLowerCase().trim()
        const matchesTitle = s.title.toLowerCase().includes(q)
        const matchesOrg = s.organization.toLowerCase().includes(q)
        const matchesDesc = s.description.toLowerCase().includes(q)
        const matchesDoi = s.doi?.toLowerCase().includes(q)
        const matchesDataset = s.datasetId?.toLowerCase().includes(q)
        const matchesAuthors = s.authors?.some((a) => a.toLowerCase().includes(q))
        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesDoi && !matchesDataset && !matchesAuthors) {
          return false
        }
      }
      return true
    })
  }, [sources, options?.searchQuery, options?.sourceType, options?.researchDomain, options?.verificationStatus])

  return {
    sources: filteredSources,
    allSources: sources,
    totalCount: sources.length,
    validationResults,
    addSource,
    updateSource,
    deleteSource,
  }
}
