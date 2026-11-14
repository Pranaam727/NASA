import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { CitationService } from '../services/citationService'
import { CitationStyle, FormattedCitation } from '../types/citation.types'
import { ScientificSource } from '../types/source.types'

export const useCitations = (styleOverride?: CitationStyle) => {
  const { sources, selectedCitationStyle, setSelectedCitationStyle } = useScientificProvenance()
  const activeStyle = styleOverride || selectedCitationStyle

  const citations = useMemo<FormattedCitation[]>(() => {
    return sources.map((source) => CitationService.formatCitation(source, activeStyle))
  }, [sources, activeStyle])

  const incompleteCount = useMemo(() => {
    return citations.filter((c) => !c.isComplete).length
  }, [citations])

  const getCitationForSource = (source: ScientificSource, style?: CitationStyle) => {
    return CitationService.formatCitation(source, style || activeStyle)
  }

  const exportBibTeX = () => {
    return CitationService.exportBibTeX(sources)
  }

  return {
    citations,
    activeStyle,
    setActiveStyle: setSelectedCitationStyle,
    incompleteCount,
    getCitationForSource,
    exportBibTeX,
  }
}
