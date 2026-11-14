import React, { useState } from 'react'
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileText,
  Calendar,
  Building,
  User,
  Link as LinkIcon,
  BookmarkCheck,
} from 'lucide-react'
import { ScientificSource } from '../types/source.types'
import { ScientificClaim } from '../types/claim.types'
import { EvidenceRecord } from '../types/evidence.types'
import { SourceValidationResult } from '../types/validation.types'
import { CitationService } from '../services/citationService'
import { CitationStyle } from '../types/citation.types'

interface SourceDetailPanelProps {
  source: ScientificSource | null
  onClose: () => void
  validationResult?: SourceValidationResult
  linkedClaims: ScientificClaim[]
  linkedEvidence: EvidenceRecord[]
  onOpenEdit: (source: ScientificSource) => void
}

export const SourceDetailPanel: React.FC<SourceDetailPanelProps> = ({
  source,
  onClose,
  validationResult,
  linkedClaims,
  linkedEvidence,
  onOpenEdit,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('apa')
  const [copied, setCopied] = useState(false)

  if (!source) return null

  const formattedCitation = CitationService.formatCitation(source, selectedStyle)

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(formattedCitation.formattedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-astro-surface border-l border-astro-border h-full flex flex-col shadow-2xl">
        {/* Panel Header */}
        <div className="p-4 border-b border-astro-border bg-astro-card flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-astro-cyan font-bold">{source.id}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-astro-darkest border border-astro-border font-mono text-slate-300 uppercase">
                {source.sourceType.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-astro-cyan/10 text-astro-cyan border border-astro-cyan/30 font-mono capitalize">
                {source.researchDomain.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-100 leading-snug">
              {source.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenEdit(source)}
              className="px-2.5 py-1 text-xs rounded-md bg-astro-darkest hover:bg-astro-card border border-astro-border text-slate-200 transition-colors"
            >
              Edit Metadata
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-astro-darkest transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Validation Banner */}
          {validationResult && validationResult.issues.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Integrity Notice: Incomplete or Flagged Metadata
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-200/90 font-mono">
                {validationResult.issues.map((iss, i) => (
                  <li key={i}>{iss.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Metadata Grid */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-astro-cyan" />
              Source Bibliographic Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" /> Authors:
                </span>
                <p className="font-medium text-slate-200 mt-0.5">
                  {source.authors && source.authors.length > 0 ? (
                    source.authors.join(', ')
                  ) : (
                    <span className="text-amber-400 italic">[Authors Unavailable]</span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-500" /> Organization / Publisher:
                </span>
                <p className="font-medium text-slate-200 mt-0.5">{source.organization}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> Publication Date:
                </span>
                <p className="font-mono text-slate-200 mt-0.5">
                  {source.publicationDate || (
                    <span className="text-amber-400 italic">[Unavailable - marked n.d.]</span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> Verification / Retrieval Date:
                </span>
                <p className="font-mono text-slate-200 mt-0.5">{source.retrievalDate}</p>
              </div>

              {source.doi && (
                <div>
                  <span className="text-[11px] text-slate-400">Digital Object Identifier (DOI):</span>
                  <p className="font-mono text-astro-sky mt-0.5">{source.doi}</p>
                </div>
              )}

              {source.datasetId && (
                <div>
                  <span className="text-[11px] text-slate-400">NASA OSDR Study ID:</span>
                  <p className="font-mono text-teal-400 font-semibold mt-0.5">{source.datasetId}</p>
                </div>
              )}

              {source.publicationMetadata?.reportNumber && (
                <div>
                  <span className="text-[11px] text-slate-400">Technical Report Number:</span>
                  <p className="font-mono text-slate-200 mt-0.5">{source.publicationMetadata.reportNumber}</p>
                </div>
              )}

              {source.publicationMetadata?.journal && (
                <div>
                  <span className="text-[11px] text-slate-400">Journal & Volume:</span>
                  <p className="font-mono text-slate-200 mt-0.5">
                    {source.publicationMetadata.journal} {source.publicationMetadata.volume || ''}
                  </p>
                </div>
              )}
            </div>

            {/* Original URL action */}
            <div className="pt-2 border-t border-astro-border/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-slate-500" /> Authentic Repository:
              </span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-astro-cyan hover:underline flex items-center gap-1 font-mono"
              >
                Open Official Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Description / Abstract */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Research Abstract / Descriptive Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {source.description}
            </p>
          </div>

          {/* Formatted Citations Engine */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-astro-cyan" />
                Citation Formatting Engine
              </h3>

              {/* Style selector pills */}
              <div className="flex items-center gap-1 bg-astro-darkest p-1 rounded-md border border-astro-border">
                {(['apa', 'ieee', 'vancouver', 'harvard'] as CitationStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                      selectedStyle === style
                        ? 'bg-astro-cyan text-astro-darkest font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Citation text box */}
            <div className="p-3 bg-astro-darkest rounded-md border border-astro-border/70 text-xs text-slate-200 leading-relaxed font-sans relative group">
              {formattedCitation.formattedText}

              <button
                onClick={handleCopyCitation}
                className="absolute top-2 right-2 p-1.5 rounded bg-astro-card hover:bg-astro-cardHover border border-astro-border text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                title="Copy formatted citation"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[10px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {!formattedCitation.isComplete && (
              <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Incomplete citation warning: Missing {formattedCitation.missingFields.join(', ')}.
              </div>
            )}
          </div>

          {/* Linked Scientific Claims */}
          <div className="bg-astro-card border border-astro-border rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-astro-cyan" />
              Linked Scientific Claims ({linkedClaims.length})
            </h3>

            {linkedClaims.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                This source has not yet been attached to any specific AstroCare scientific claims.
              </p>
            ) : (
              <div className="space-y-2">
                {linkedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-2.5 rounded bg-astro-darkest/70 border border-astro-border text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-astro-cyan font-semibold">
                        {claim.id}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                        {claim.claimStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-200 line-clamp-2">{claim.claimText}</p>
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
