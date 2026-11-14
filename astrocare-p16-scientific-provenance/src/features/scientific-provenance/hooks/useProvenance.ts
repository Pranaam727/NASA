import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ProvenanceMethod, SimulationStatus } from '../types/provenance.types'

export const useProvenance = (options?: {
  generationMethod?: ProvenanceMethod | 'all'
  simulationStatus?: SimulationStatus | 'all'
  searchQuery?: string
}) => {
  const { insights, sources, datasets, claims, addInsight, updateInsight, deleteInsight } =
    useScientificProvenance()

  const filteredInsights = useMemo(() => {
    return insights.filter((ins) => {
      if (options?.generationMethod && options.generationMethod !== 'all' && ins.generationMethod !== options.generationMethod) {
        return false
      }
      if (options?.simulationStatus && options.simulationStatus !== 'all' && ins.simulationStatus !== options.simulationStatus) {
        return false
      }
      if (options?.searchQuery) {
        const q = options.searchQuery.toLowerCase().trim()
        if (!ins.insightText.toLowerCase().includes(q) && !ins.relatedHealthDomain.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })
  }, [insights, options?.generationMethod, options?.simulationStatus, options?.searchQuery])

  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources])
  const datasetMap = useMemo(() => new Map(datasets.map((d) => [d.datasetId, d])), [datasets])

  // Get full lineage graph for an insight
  const getInsightLineage = (insightId: string) => {
    const ins = insights.find((i) => i.id === insightId)
    if (!ins) return null

    const linkedSources = ins.supportingSourceIds.map((id) => sourceMap.get(id)).filter(Boolean)
    const linkedDatasets = ins.relatedDatasetIds.map((id) => datasetMap.get(id)).filter(Boolean)
    const linkedClaims = claims.filter((c) =>
      c.sourceIds.some((sid) => ins.supportingSourceIds.includes(sid))
    )

    return {
      insight: ins,
      linkedSources,
      linkedDatasets,
      linkedClaims,
    }
  }

  return {
    insights: filteredInsights,
    allInsights: insights,
    getInsightLineage,
    addInsight,
    updateInsight,
    deleteInsight,
  }
}
