import React, { useState } from 'react'
import {
  X,
  BookmarkCheck,
  FileCheck2,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Microscope,
  HelpCircle,
} from 'lucide-react'
import { ScientificClaim, ClaimStatus } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'
import { EvidenceRecord } from '../types/evidence.types'

interface ClaimDetailModalProps {
  claim: ScientificClaim | null
  onClose: () => void
  allSources: ScientificSource[]
  allEvidence: EvidenceRecord[]
  onLinkSource: (claimId: string, sourceId: string) => void
  onUnlinkSource: (claimId: string, sourceId: string) => void
  onUpdateStatus: (claim: ScientificClaim, newStatus: ClaimStatus) => void
  onOpenSource: (source: ScientificSource) => void
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({
  claim,
  onClose,
  allSources,
  allEvidence,
  onLinkSource,
  onUnlinkSource,
  onUpdateStatus,
  onOpenSource,
}) => {
  const [selectedSourceToLink, setSelectedSourceToLink] = useState('')

  if (!claim) return null

  const sourceMap = new Map(allSources.map((s) => [s.id, s]))
  const claimEvidence = allEvidence.filter((e) => claim.evidenceIds.includes(e.id) || e.claimId === claim.id)
  const unlinkedSources = allSources.filter((s) => !claim.sourceIds.includes(s.id))

  const handleLink = () => {
    if (selectedSourceToLink) {
      onLinkSource(claim.id, selectedSourceToLink)
      setSelectedSourceToLink('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-astro-surface border border-astro-border rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-astro-border bg-astro-card flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-astro-cyan font-bold">{claim.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-astro-darkest text-slate-300 border border-astro-border font-mono capitalize">
                {claim.researchDomain.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-astro-darkest text-slate-400 border border-astro-border font-mono">
                {claim.claimCategory.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-100">
              Claim-to-Source Traceability Architecture
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-astro-darkest transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Claim Statement Card */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Scientific Statement
              </span>

              {/* Status Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-mono">Status:</span>
                <select
                  value={claim.claimStatus}
                  onChange={(e) => onUpdateStatus(claim, e.target.value as ClaimStatus)}
                  className="bg-astro-darkest border border-astro-border rounded px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-astro-cyan/50"
                >
                  <option value="supported">Supported</option>
                  <option value="partially_supported">Partially Supported</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="unsupported">Unsupported</option>
                  <option value="disputed">Disputed</option>
                  <option value="outdated">Outdated</option>
                </select>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              "{claim.claimText}"
            </p>

            <div className="pt-2 border-t border-astro-border/50 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Last Documented Review: <strong className="text-slate-200">{claim.lastReviewed}</strong></span>
              {claim.reviewerNotes && <span className="italic">{claim.reviewerNotes}</span>}
            </div>
          </div>

          {/* Missing Source Warning */}
          {claim.sourceIds.length === 0 && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                MISSING SOURCE REFERENCE WARNING
              </div>
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                This scientific statement is currently registered without supporting research evidence.
                In accordance with AstroCare verification guidelines, this claim must NOT be presented as a verified finding.
              </p>
            </div>
          )}

          {/* Supporting Sources Traceability */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5 text-astro-cyan" />
                Supporting Research Sources ({claim.sourceIds.length})
              </h3>

              {/* Link new source tool */}
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedSourceToLink}
                  onChange={(e) => setSelectedSourceToLink(e.target.value)}
                  className="bg-astro-darkest border border-astro-border rounded px-2 py-1 text-xs text-slate-300 font-mono max-w-xs truncate"
                >
                  <option value="">Select source to link...</option>
                  {unlinkedSources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}: {s.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!selectedSourceToLink}
                  onClick={handleLink}
                  className="px-2.5 py-1 rounded bg-astro-cyan text-astro-darkest font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-300 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Link
                </button>
              </div>
            </div>

            {claim.sourceIds.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No sources linked yet. Use the dropdown above to associate an authentic research source.
              </p>
            ) : (
              <div className="space-y-2">
                {claim.sourceIds.map((sid) => {
                  const src = sourceMap.get(sid)
                  if (!src) {
                    return (
                      <div
                        key={sid}
                        className="p-2.5 rounded bg-astro-darkest border border-astro-border flex items-center justify-between text-xs text-amber-400"
                      >
                        <span>Unresolved source ID: {sid}</span>
                        <button
                          onClick={() => onUnlinkSource(claim.id, sid)}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={sid}
                      className="p-3 rounded-md bg-astro-darkest/80 border border-astro-border hover:border-astro-cyan/30 transition-all flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-astro-cyan font-semibold">
                            {src.id}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-astro-card border border-astro-border font-mono text-slate-400">
                            {src.sourceType.replace(/_/g, ' ')}
                          </span>
                          {src.doi && (
                            <span className="text-[10px] font-mono text-astro-sky truncate max-w-xs">
                              doi: {src.doi}
                            </span>
                          )}
                        </div>

                        <div className="font-medium text-slate-200">{src.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {src.organization} • {src.publicationDate || 'n.d.'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onOpenSource(src)}
                          className="p-1.5 rounded bg-astro-card hover:bg-astro-cardHover text-slate-300 hover:text-white border border-astro-border transition-colors text-[11px]"
                          title="View source details"
                        >
                          Inspect Source
                        </button>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded bg-astro-card hover:bg-astro-cardHover text-slate-300 hover:text-astro-cyan border border-astro-border transition-colors"
                          title="Open external repository"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onUnlinkSource(claim.id, sid)}
                          className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Unlink source from this claim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Evidence Details, Population, Methodology & Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Population & Methodology */}
            <div className="bg-astro-card border border-astro-border rounded-lg p-3.5 space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-astro-sky" />
                Study Population / Cohort
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {claim.studyPopulation || <span className="text-slate-500 italic">Not documented</span>}
              </p>

              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pt-2">
                <Microscope className="w-3.5 h-3.5 text-teal-400" />
                Research Methodology
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {claim.researchMethodology || <span className="text-slate-500 italic">Not documented</span>}
              </p>
            </div>

            {/* Limitations & Synthesis */}
            <div className="bg-astro-card border border-astro-border rounded-lg p-3.5 space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Known Scientific Limitations
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {claim.limitations || <span className="text-slate-500 italic">None documented</span>}
              </p>

              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pt-2">
                <FileCheck2 className="w-3.5 h-3.5 text-astro-cyan" />
                Evidence Synthesis Excerpt
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {claim.evidenceDescription}
              </p>
            </div>
          </div>

          {/* Linked Evidence Records */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-astro-cyan" />
              Detailed Evidence Records ({claimEvidence.length})
            </h3>

            {claimEvidence.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No formal evidence breakdown cards created for this claim yet.
              </p>
            ) : (
              <div className="space-y-2">
                {claimEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-md bg-astro-darkest border border-astro-border text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-astro-cyan font-bold">{ev.id}</span>
                        <span className="px-1.5 py-0.2 rounded bg-astro-card border border-astro-border font-mono text-[10px] text-slate-300 uppercase">
                          {ev.studyType.replace(/_/g, ' ')}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-teal-500/10 border border-teal-500/30 font-mono text-[10px] text-teal-400">
                          {ev.supportingRelationship.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">{ev.sampleSize}</span>
                    </div>

                    <p className="text-slate-200">{ev.keyFindings}</p>
                    <div className="text-[11px] text-slate-400">
                      <strong>Method:</strong> {ev.methodology}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
