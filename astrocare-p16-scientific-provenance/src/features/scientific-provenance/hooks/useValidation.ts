import { useMemo } from 'react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { SourceValidationService } from '../services/sourceValidationService'

export const useValidation = () => {
  const { sources, validationResults, runValidationForAll, runValidationForSource } =
    useScientificProvenance()

  const duplicateSummary = useMemo(() => {
    return SourceValidationService.findDuplicates(sources)
  }, [sources])

  const stats = useMemo(() => {
    let valid = 0
    let incomplete = 0
    let duplicates = 0
    let manualReview = 0

    Object.values(validationResults).forEach((res) => {
      if (res.isDuplicate || res.status === 'duplicate_detected') duplicates++
      else if (res.status === 'valid') valid++
      else if (res.status === 'incomplete_metadata') incomplete++
      else if (res.status === 'manual_review_required') manualReview++
    })

    return {
      total: sources.length,
      valid,
      incomplete,
      duplicates,
      manualReview,
    }
  }, [sources, validationResults])

  return {
    validationResults,
    duplicateSummary,
    stats,
    runValidationForAll,
    runValidationForSource,
  }
}
