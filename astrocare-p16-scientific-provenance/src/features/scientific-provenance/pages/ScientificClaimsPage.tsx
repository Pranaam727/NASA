import React, { useState } from 'react'
import {
  BookmarkCheck,
  PlusCircle,
  Search,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react'
import { ScientificClaimCard } from '../components/ScientificClaimCard'
import { ClaimDetailModal } from '../components/ClaimDetailModal'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ScientificClaim, ClaimStatus, ClaimCategory } from '../types/claim.types'
import { ResearchDomain, ScientificSource } from '../types/source.types'

export const ScientificClaimsPage: React.FC = () => {
  const {
    claims,
    sources,
    evidence,
    validationResults,
    addClaim,
    updateClaim,
    deleteClaim,
    linkSourceToClaim,
    unlinkSourceFromClaim,
  } = useScientificProvenance()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'all'>('all')
  const [selectedDomain, setSelectedDomain] = useState<ResearchDomain | 'all'>('all')

  const [activeClaim, setActiveClaim] = useState<ScientificClaim | null>(null)
  const [activeSource, setActiveSource] = useState<ScientificSource | null>(null)

  // New claim modal state
  const [isAddClaimModalOpen, setIsAddClaimModalOpen] = useState(false)
  const [newClaimText, setNewClaimText] = useState('')
  const [newClaimDomain, setNewClaimDomain] = useState<ResearchDomain>('bone_and_muscle')
  const [newClaimCategory, setNewClaimCategory] = useState<ClaimCategory>('physiological_adaptation')
  const [newClaimStatus, setNewClaimStatus] = useState<ClaimStatus>('needs_review')
  const [newClaimEvidenceDesc, setNewClaimEvidenceDesc] = useState('')
  const [newClaimPopulation, setNewClaimPopulation] = useState('')
  const [newClaimMethodology, setNewClaimMethodology] = useState('')
  const [newClaimLimitations, setNewClaimLimitations] = useState('')

  const sourceMap = new Map(sources.map((s) => [s.id, s]))

  const filteredClaims = claims.filter((c) => {
    if (selectedStatus !== 'all' && c.claimStatus !== selectedStatus) return false
    if (selectedDomain !== 'all' && c.researchDomain !== selectedDomain) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim()
      const matchText = c.claimText.toLowerCase().includes(q)
      const matchId = c.id.toLowerCase().includes(q)
      const matchDesc = c.evidenceDescription.toLowerCase().includes(q)
      if (!matchText && !matchId && !matchDesc) return false
    }
    return true
  })

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClaimText.trim()) return

    const newClaim: ScientificClaim = {
      id: `CLM-USR-${Date.now().toString(36).toUpperCase()}`,
      claimText: newClaimText.trim(),
      researchDomain: newClaimDomain,
      claimCategory: newClaimCategory,
      sourceIds: [],
      evidenceIds: [],
      evidenceDescription: newClaimEvidenceDesc.trim() || 'Awaiting initial evidence mapping.',
      studyPopulation: newClaimPopulation.trim() || undefined,
      researchMethodology: newClaimMethodology.trim() || undefined,
      limitations: newClaimLimitations.trim() || undefined,
      claimStatus: newClaimStatus,
      lastReviewed: new Date().toISOString().split('T')[0],
      reviewerNotes: 'User-created claim. Requires linking supporting scientific publications.',
    }

    addClaim(newClaim)
    setIsAddClaimModalOpen(false)
    setNewClaimText('')
    setNewClaimEvidenceDesc('')
    setNewClaimPopulation('')
    setNewClaimMethodology('')
    setNewClaimLimitations('')
  }

  const unsupportedCount = claims.filter((c) => c.sourceIds.length === 0).length

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-astro-cyan font-bold">CLAIMS-05</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
              {claims.length} Scientific Assertions
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 mt-1">
            Scientific Claim Registry & Evidence Association
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage research claims presented across AstroCare modules. Every statement must be supported by authentic scientific evidence.
          </p>
        </div>

        <button
          onClick={() => setIsAddClaimModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-astro-cyan text-astro-darkest font-semibold text-xs hover:bg-cyan-300 transition-all font-mono shadow-sm glow-cyan-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Claim</span>
        </button>
      </div>

      {/* Warning on Unsupported Claims if any */}
      {unsupportedCount > 0 && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Integrity Alert:</strong> {unsupportedCount} claim(s) currently lack supporting sources. These cannot be presented as verified findings in astronaut health assessments.
            </span>
          </div>
          <button
            onClick={() => setSelectedStatus('unsupported')}
            className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[11px] font-mono hover:bg-amber-500/30 shrink-0 transition-colors"
          >
            Filter Unsupported
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm text-xs">
        <div className="relative flex-1 md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claim statements, IDs, categories..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 focus:outline-none focus:border-astro-cyan/50 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-astro-darkest border border-astro-border rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-astro-cyan/50"
          >
            <option value="all">All Claim Statuses</option>
            <option value="supported">Supported</option>
            <option value="partially_supported">Partially Supported</option>
            <option value="needs_review">Needs Review</option>
            <option value="unsupported">Unsupported</option>
            <option value="disputed">Disputed</option>
            <option value="outdated">Outdated</option>
          </select>

          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as any)}
            className="bg-astro-darkest border border-astro-border rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-astro-cyan/50"
          >
            <option value="all">All Research Domains</option>
            <option value="radiation">Radiation</option>
            <option value="bone_and_muscle">Bone & Muscle</option>
            <option value="immune_system">Immune System</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="sleep_and_circadian">Sleep & Circadian</option>
            <option value="neurovestibular">Neurovestibular / SANS</option>
            <option value="multi_system">Multi-System</option>
          </select>
        </div>
      </div>

      {/* Claims List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClaims.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 font-mono text-xs bg-astro-surface border border-astro-border rounded-lg">
            No scientific claims match the filter criteria.
          </div>
        ) : (
          filteredClaims.map((claim) => (
            <ScientificClaimCard
              key={claim.id}
              claim={claim}
              sourceMap={sourceMap}
              onViewDetails={(c) => setActiveClaim(c)}
            />
          ))
        )}
      </div>

      {/* Claim Detail Modal for Traceability */}
      <ClaimDetailModal
        claim={activeClaim}
        onClose={() => setActiveClaim(null)}
        allSources={sources}
        allEvidence={evidence}
        onLinkSource={linkSourceToClaim}
        onUnlinkSource={unlinkSourceFromClaim}
        onUpdateStatus={(claim, status) => {
          const updated = { ...claim, claimStatus: status, lastReviewed: new Date().toISOString().split('T')[0] }
          updateClaim(updated)
          setActiveClaim(updated)
        }}
        onOpenSource={(src) => setActiveSource(src)}
      />

      {/* Source Detail Modal if user inspects underlying source from claim */}
      <SourceDetailPanel
        source={activeSource}
        onClose={() => setActiveSource(null)}
        validationResult={activeSource ? validationResults[activeSource.id] : undefined}
        linkedClaims={activeSource ? claims.filter((c) => c.sourceIds.includes(activeSource.id)) : []}
        linkedEvidence={activeSource ? evidence.filter((e) => e.sourceId === activeSource.id) : []}
        onOpenEdit={() => {}}
      />

      {/* Modal to Register New Claim */}
      {isAddClaimModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-astro-surface border border-astro-border rounded-xl w-full max-w-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-astro-border pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
                <BookmarkCheck className="w-4 h-4 text-astro-cyan" />
                Register New Scientific Claim
              </h3>
              <button
                onClick={() => setIsAddClaimModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Scientific Statement *
                </label>
                <textarea
                  rows={2}
                  value={newClaimText}
                  onChange={(e) => setNewClaimText(e.target.value)}
                  placeholder="e.g. Microgravity causes bone mineral density loss in weight-bearing bones..."
                  className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Domain
                  </label>
                  <select
                    value={newClaimDomain}
                    onChange={(e) => setNewClaimDomain(e.target.value as ResearchDomain)}
                    className="w-full px-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-200"
                  >
                    <option value="bone_and_muscle">Bone & Muscle</option>
                    <option value="radiation">Radiation</option>
                    <option value="cardiovascular">Cardiovascular</option>
                    <option value="immune_system">Immune System</option>
                    <option value="sleep_and_circadian">Sleep & Circadian</option>
                    <option value="neurovestibular">Neurovestibular / SANS</option>
                    <option value="multi_system">Multi-System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newClaimStatus}
                    onChange={(e) => setNewClaimStatus(e.target.value as ClaimStatus)}
                    className="w-full px-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-200"
                  >
                    <option value="needs_review">Needs Review</option>
                    <option value="supported">Supported</option>
                    <option value="partially_supported">Partially Supported</option>
                    <option value="unsupported">Unsupported</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Evidence Summary
                </label>
                <textarea
                  rows={2}
                  value={newClaimEvidenceDesc}
                  onChange={(e) => setNewClaimEvidenceDesc(e.target.value)}
                  placeholder="Summary of physiological or mechanistic evidence..."
                  className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/50"
                />
              </div>

              <div className="pt-2 border-t border-astro-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClaimModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-astro-cyan text-astro-darkest font-semibold hover:bg-cyan-300"
                >
                  Create Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
