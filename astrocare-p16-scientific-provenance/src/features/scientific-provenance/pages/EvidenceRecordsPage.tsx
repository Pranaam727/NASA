import React, { useState } from 'react'
import {
  FileCheck2,
  Filter,
  Search,
  PlusCircle,
  ExternalLink,
  Users,
  Microscope,
} from 'lucide-react'
import { EvidenceCard } from '../components/EvidenceCard'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { ClaimDetailModal } from '../components/ClaimDetailModal'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { EvidenceType, SupportingRelationship, EvidenceRecord } from '../types/evidence.types'
import { ScientificClaim } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'

export const EvidenceRecordsPage: React.FC = () => {
  const {
    evidence,
    claims,
    sources,
    validationResults,
    linkSourceToClaim,
    unlinkSourceFromClaim,
    updateClaim,
  } = useScientificProvenance()

  const [selectedStudyType, setSelectedStudyType] = useState<EvidenceType | 'all'>('all')
  const [selectedRelationship, setSelectedRelationship] = useState<SupportingRelationship | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [activeSource, setActiveSource] = useState<ScientificSource | null>(null)
  const [activeClaim, setActiveClaim] = useState<ScientificClaim | null>(null)

  const claimMap = new Map(claims.map((c) => [c.id, c]))
  const sourceMap = new Map(sources.map((s) => [s.id, s]))

  const filteredEvidence = evidence.filter((ev) => {
    if (selectedStudyType !== 'all' && ev.studyType !== selectedStudyType) return false
    if (selectedRelationship !== 'all' && ev.supportingRelationship !== selectedRelationship) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim()
      const inFindings = ev.keyFindings.toLowerCase().includes(q)
      const inMethod = ev.methodology.toLowerCase().includes(q)
      const inOrg = ev.organism.toLowerCase().includes(q)
      const inId = ev.id.toLowerCase().includes(q)
      if (!inFindings && !inMethod && !inOrg && !inId) return false
    }
    return true
  })

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">EVIDENCE-04</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
            {evidence.length} Documented Records
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Biomedical Evidence Records & Study Classifications
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Granular scientific evidence units linking specific observational data, animal omics, or clinical astronaut cohorts to AstroCare research claims. Transparently discloses study populations, sample sizes, and known limitations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm text-xs">
        <div className="relative flex-1 md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search findings, methodology, organism, cohort..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 focus:outline-none focus:border-astro-cyan/50 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Study Type Filter */}
          <select
            value={selectedStudyType}
            onChange={(e) => setSelectedStudyType(e.target.value as any)}
            className="bg-astro-darkest border border-astro-border rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-astro-cyan/50"
          >
            <option value="all">All Study Classifications</option>
            <option value="human_astronaut_study">Human Astronaut Study</option>
            <option value="ground_human_analog">Ground Human Analog</option>
            <option value="animal_experiment">Animal Experiment</option>
            <option value="cell_culture">Cell Culture</option>
            <option value="computational_model">Computational Model</option>
            <option value="technical_report">Technical Report</option>
            <option value="review_article">Review Article</option>
          </select>

          {/* Relationship Filter */}
          <select
            value={selectedRelationship}
            onChange={(e) => setSelectedRelationship(e.target.value as any)}
            className="bg-astro-darkest border border-astro-border rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-astro-cyan/50"
          >
            <option value="all">All Supporting Relationships</option>
            <option value="direct_support">Direct Support</option>
            <option value="corroborative">Corroborative</option>
            <option value="contextual">Contextual</option>
            <option value="conflicting">Conflicting</option>
            <option value="inconclusive">Inconclusive</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 font-mono text-xs bg-astro-surface border border-astro-border rounded-lg">
            No evidence records match your search criteria.
          </div>
        ) : (
          filteredEvidence.map((ev) => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              claim={claimMap.get(ev.claimId)}
              source={sourceMap.get(ev.sourceId)}
              onOpenSource={(s) => setActiveSource(s)}
              onOpenClaim={(c) => setActiveClaim(c)}
            />
          ))
        )}
      </div>

      {/* Modals for Deep Inspection */}
      <SourceDetailPanel
        source={activeSource}
        onClose={() => setActiveSource(null)}
        validationResult={activeSource ? validationResults[activeSource.id] : undefined}
        linkedClaims={activeSource ? claims.filter((c) => c.sourceIds.includes(activeSource.id)) : []}
        linkedEvidence={activeSource ? evidence.filter((e) => e.sourceId === activeSource.id) : []}
        onOpenEdit={() => {}}
      />

      <ClaimDetailModal
        claim={activeClaim}
        onClose={() => setActiveClaim(null)}
        allSources={sources}
        allEvidence={evidence}
        onLinkSource={linkSourceToClaim}
        onUnlinkSource={unlinkSourceFromClaim}
        onUpdateStatus={(claim, status) => updateClaim({ ...claim, claimStatus: status })}
        onOpenSource={(src) => setActiveSource(src)}
      />
    </div>
  )
}
