import React, { createContext, useContext, useState, useEffect } from 'react'
import { ScientificSource } from '../types/source.types'
import { ScientificClaim } from '../types/claim.types'
import { EvidenceRecord } from '../types/evidence.types'
import { InsightProvenance } from '../types/provenance.types'
import { DatasetAttribution } from '../types/dataset.types'
import { ActivityRecord, AuditAction } from '../types/audit.types'
import { SourceValidationResult } from '../types/validation.types'
import { INITIAL_SOURCES } from '../data/demoSources'
import { INITIAL_CLAIMS } from '../data/demoClaims'
import { INITIAL_EVIDENCE } from '../data/demoEvidence'
import { INITIAL_INSIGHTS } from '../data/demoInsights'
import { INITIAL_DATASETS } from '../data/demoDatasets'
import { SourceValidationService } from '../services/sourceValidationService'

interface ProvenanceContextValue {
  sources: ScientificSource[]
  claims: ScientificClaim[]
  evidence: EvidenceRecord[]
  insights: InsightProvenance[]
  datasets: DatasetAttribution[]
  auditLog: ActivityRecord[]
  validationResults: Record<string, SourceValidationResult>
  selectedCitationStyle: 'apa' | 'ieee' | 'vancouver' | 'harvard'
  setSelectedCitationStyle: (style: 'apa' | 'ieee' | 'vancouver' | 'harvard') => void

  // Actions
  addSource: (source: ScientificSource) => void
  updateSource: (source: ScientificSource) => void
  deleteSource: (id: string) => void
  
  addClaim: (claim: ScientificClaim) => void
  updateClaim: (claim: ScientificClaim) => void
  deleteClaim: (id: string) => void

  addEvidence: (evidence: EvidenceRecord) => void
  updateEvidence: (evidence: EvidenceRecord) => void
  deleteEvidence: (id: string) => void

  linkSourceToClaim: (claimId: string, sourceId: string) => void
  unlinkSourceFromClaim: (claimId: string, sourceId: string) => void

  addInsight: (insight: InsightProvenance) => void
  updateInsight: (insight: InsightProvenance) => void
  deleteInsight: (id: string) => void

  addDataset: (dataset: DatasetAttribution) => void
  updateDataset: (dataset: DatasetAttribution) => void

  runValidationForAll: () => void
  runValidationForSource: (sourceId: string) => SourceValidationResult | null
  resetToDefaults: () => void
  logActivity: (
    action: AuditAction,
    affectedRecordId: string,
    recordType: ActivityRecord['recordType'],
    description: string,
    previousState?: any,
    newState?: any
  ) => void
}

const STORAGE_KEY = 'astrocare_p16_provenance_store_v1'

const ProvenanceContext = createContext<ProvenanceContextValue | undefined>(undefined)

export const ProvenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<ScientificSource[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sources`)
      return saved ? JSON.parse(saved) : INITIAL_SOURCES
    } catch {
      return INITIAL_SOURCES
    }
  })

  const [claims, setClaims] = useState<ScientificClaim[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_claims`)
      return saved ? JSON.parse(saved) : INITIAL_CLAIMS
    } catch {
      return INITIAL_CLAIMS
    }
  })

  const [evidence, setEvidence] = useState<EvidenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_evidence`)
      return saved ? JSON.parse(saved) : INITIAL_EVIDENCE
    } catch {
      return INITIAL_EVIDENCE
    }
  })

  const [insights, setInsights] = useState<InsightProvenance[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_insights`)
      return saved ? JSON.parse(saved) : INITIAL_INSIGHTS
    } catch {
      return INITIAL_INSIGHTS
    }
  })

  const [datasets, setDatasets] = useState<DatasetAttribution[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_datasets`)
      return saved ? JSON.parse(saved) : INITIAL_DATASETS
    } catch {
      return INITIAL_DATASETS
    }
  })

  const [auditLog, setAuditLog] = useState<ActivityRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit`)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return [
      {
        id: 'ACT-INIT-001',
        action: 'source_created',
        affectedRecordId: 'SRC-NASA-HRP-001',
        recordType: 'source',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        actor: 'Flight Surgeon / System Admin',
        description: 'Initialized authentic NASA HRP baseline evidence publication.',
        isLocalDemonstration: true,
      },
      {
        id: 'ACT-INIT-002',
        action: 'claim_created',
        affectedRecordId: 'CLM-BONE-001',
        recordType: 'claim',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        actor: 'Scientific Reviewer',
        description: 'Registered verified claim regarding microgravity bone mineral density loss.',
        isLocalDemonstration: true,
      },
      {
        id: 'ACT-INIT-003',
        action: 'validation_run',
        affectedRecordId: 'ALL_SOURCES',
        recordType: 'source',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        actor: 'Automated Integrity Watcher',
        description: 'Completed automated metadata validation and duplicate scan across registered sources.',
        isLocalDemonstration: true,
      },
    ]
  })

  const [validationResults, setValidationResults] = useState<Record<string, SourceValidationResult>>({})
  const [selectedCitationStyle, setSelectedCitationStyle] = useState<'apa' | 'ieee' | 'vancouver' | 'harvard'>('apa')

  // Run initial validation whenever sources change
  useEffect(() => {
    const results: Record<string, SourceValidationResult> = {}
    sources.forEach((s) => {
      results[s.id] = SourceValidationService.validateSource(s, sources)
    })
    setValidationResults(results)
  }, [sources])

  // Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sources`, JSON.stringify(sources))
      localStorage.setItem(`${STORAGE_KEY}_claims`, JSON.stringify(claims))
      localStorage.setItem(`${STORAGE_KEY}_evidence`, JSON.stringify(evidence))
      localStorage.setItem(`${STORAGE_KEY}_insights`, JSON.stringify(insights))
      localStorage.setItem(`${STORAGE_KEY}_datasets`, JSON.stringify(datasets))
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLog))
    } catch (e) {
      console.warn('LocalStorage save error:', e)
    }
  }, [sources, claims, evidence, insights, datasets, auditLog])

  const logActivity = (
    action: AuditAction,
    affectedRecordId: string,
    recordType: ActivityRecord['recordType'],
    description: string,
    previousState?: any,
    newState?: any
  ) => {
    const newRecord: ActivityRecord = {
      id: `ACT-${Date.now().toString(36).toUpperCase()}`,
      action,
      affectedRecordId,
      recordType,
      timestamp: new Date().toISOString(),
      actor: 'Local Scientific Curator',
      description,
      previousState,
      newState,
      isLocalDemonstration: true,
    }
    setAuditLog((prev) => [newRecord, ...prev])
  }

  const addSource = (source: ScientificSource) => {
    setSources((prev) => [source, ...prev])
    logActivity('source_created', source.id, 'source', `Added new source: "${source.title}"`, undefined, source)
  }

  const updateSource = (source: ScientificSource) => {
    const oldSource = sources.find((s) => s.id === source.id)
    setSources((prev) => prev.map((s) => (s.id === source.id ? source : s)))
    logActivity('source_updated', source.id, 'source', `Updated metadata for source "${source.title}"`, oldSource, source)
  }

  const deleteSource = (id: string) => {
    const oldSource = sources.find((s) => s.id === id)
    setSources((prev) => prev.filter((s) => s.id !== id))
    // Also unlink from claims
    setClaims((prev) =>
      prev.map((c) => ({
        ...c,
        sourceIds: c.sourceIds.filter((sid) => sid !== id),
      }))
    )
    logActivity('source_deleted', id, 'source', `Deleted source "${oldSource?.title || id}"`, oldSource, undefined)
  }

  const addClaim = (claim: ScientificClaim) => {
    setClaims((prev) => [claim, ...prev])
    logActivity('claim_created', claim.id, 'claim', `Registered new scientific claim: "${claim.claimText.slice(0, 50)}..."`, undefined, claim)
  }

  const updateClaim = (claim: ScientificClaim) => {
    const oldClaim = claims.find((c) => c.id === claim.id)
    setClaims((prev) => prev.map((c) => (c.id === claim.id ? claim : c)))
    logActivity('claim_updated', claim.id, 'claim', `Updated scientific claim ${claim.id}`, oldClaim, claim)
  }

  const deleteClaim = (id: string) => {
    const oldClaim = claims.find((c) => c.id === id)
    setClaims((prev) => prev.filter((c) => c.id !== id))
    // Also delete linked evidence
    setEvidence((prev) => prev.filter((e) => e.claimId !== id))
    logActivity('claim_deleted', id, 'claim', `Removed claim ${id}`, oldClaim, undefined)
  }

  const addEvidence = (ev: EvidenceRecord) => {
    setEvidence((prev) => [ev, ...prev])
    // Update claim's evidenceIds if not present
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === ev.claimId && !c.evidenceIds.includes(ev.id)) {
          return { ...c, evidenceIds: [...c.evidenceIds, ev.id] }
        }
        return c
      })
    )
    logActivity('evidence_linked', ev.id, 'evidence', `Linked new ${ev.studyType} evidence to claim ${ev.claimId}`, undefined, ev)
  }

  const updateEvidence = (ev: EvidenceRecord) => {
    setEvidence((prev) => prev.map((e) => (e.id === ev.id ? ev : e)))
  }

  const deleteEvidence = (id: string) => {
    const oldEv = evidence.find((e) => e.id === id)
    setEvidence((prev) => prev.filter((e) => e.id !== id))
    setClaims((prev) =>
      prev.map((c) => ({
        ...c,
        evidenceIds: c.evidenceIds.filter((eid) => eid !== id),
      }))
    )
    if (oldEv) {
      logActivity('evidence_unlinked', id, 'evidence', `Unlinked evidence ${id} from claim ${oldEv.claimId}`)
    }
  }

  const linkSourceToClaim = (claimId: string, sourceId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId && !c.sourceIds.includes(sourceId)) {
          return { ...c, sourceIds: [...c.sourceIds, sourceId] }
        }
        return c
      })
    )
    logActivity('evidence_linked', sourceId, 'source', `Linked source ${sourceId} to claim ${claimId}`)
  }

  const unlinkSourceFromClaim = (claimId: string, sourceId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return { ...c, sourceIds: c.sourceIds.filter((id) => id !== sourceId) }
        }
        return c
      })
    )
    logActivity('evidence_unlinked', sourceId, 'source', `Unlinked source ${sourceId} from claim ${claimId}`)
  }

  const addInsight = (insight: InsightProvenance) => {
    setInsights((prev) => [insight, ...prev])
  }

  const updateInsight = (insight: InsightProvenance) => {
    setInsights((prev) => prev.map((i) => (i.id === insight.id ? insight : i)))
  }

  const deleteInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id))
  }

  const addDataset = (dataset: DatasetAttribution) => {
    setDatasets((prev) => [dataset, ...prev])
  }

  const updateDataset = (dataset: DatasetAttribution) => {
    setDatasets((prev) => prev.map((d) => (d.datasetId === dataset.datasetId ? dataset : d)))
  }

  const runValidationForAll = () => {
    const results: Record<string, SourceValidationResult> = {}
    sources.forEach((s) => {
      results[s.id] = SourceValidationService.validateSource(s, sources)
    })
    setValidationResults(results)
    logActivity('validation_run', 'ALL_SOURCES', 'source', 'Manual trigger: executed integrity validation check across all registered sources.')
  }

  const runValidationForSource = (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId)
    if (!source) return null
    const res = SourceValidationService.validateSource(source, sources)
    setValidationResults((prev) => ({ ...prev, [sourceId]: res }))
    return res
  }

  const resetToDefaults = () => {
    setSources(INITIAL_SOURCES)
    setClaims(INITIAL_CLAIMS)
    setEvidence(INITIAL_EVIDENCE)
    setInsights(INITIAL_INSIGHTS)
    setDatasets(INITIAL_DATASETS)
    localStorage.removeItem(`${STORAGE_KEY}_sources`)
    localStorage.removeItem(`${STORAGE_KEY}_claims`)
    localStorage.removeItem(`${STORAGE_KEY}_evidence`)
    localStorage.removeItem(`${STORAGE_KEY}_insights`)
    localStorage.removeItem(`${STORAGE_KEY}_datasets`)
    logActivity('status_changed', 'SYSTEM_RESET', 'source', 'Reset all demonstration repositories to default authentic baseline records.')
  }

  return (
    <ProvenanceContext.Provider
      value={{
        sources,
        claims,
        evidence,
        insights,
        datasets,
        auditLog,
        validationResults,
        selectedCitationStyle,
        setSelectedCitationStyle,
        addSource,
        updateSource,
        deleteSource,
        addClaim,
        updateClaim,
        deleteClaim,
        addEvidence,
        updateEvidence,
        deleteEvidence,
        linkSourceToClaim,
        unlinkSourceFromClaim,
        addInsight,
        updateInsight,
        deleteInsight,
        addDataset,
        updateDataset,
        runValidationForAll,
        runValidationForSource,
        resetToDefaults,
        logActivity,
      }}
    >
      {children}
    </ProvenanceContext.Provider>
  )
}

export const useScientificProvenance = () => {
  const context = useContext(ProvenanceContext)
  if (!context) {
    throw new Error('useScientificProvenance must be used within a ProvenanceProvider')
  }
  return context
}
