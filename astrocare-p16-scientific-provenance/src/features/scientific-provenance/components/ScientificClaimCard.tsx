import React from 'react'
import {
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Flame,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { ScientificClaim, ClaimStatus } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'

interface ScientificClaimCardProps {
  claim: ScientificClaim
  sourceMap: Map<string, ScientificSource>
  onViewDetails: (claim: ScientificClaim) => void
  onLinkSource?: (claimId: string) => void
}

export const ScientificClaimCard: React.FC<ScientificClaimCardProps> = ({
  claim,
  sourceMap,
  onViewDetails,
}) => {
  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            SUPPORTED
          </span>
        )
      case 'partially_supported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <CheckCircle2 className="w-3 h-3" />
            PARTIALLY SUPPORTED
          </span>
        )
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            NEEDS REVIEW
          </span>
        )
      case 'unsupported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            UNSUPPORTED
          </span>
        )
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Flame className="w-3 h-3 text-purple-400" />
            DISPUTED
          </span>
        )
      case 'outdated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-700/50 text-slate-400 border border-slate-600">
            <HelpCircle className="w-3 h-3" />
            OUTDATED
          </span>
        )
    }
  }

  const hasMissingSources = claim.sourceIds.length === 0

  return (
    <div
      onClick={() => onViewDetails(claim)}
      className="group cursor-pointer bg-astro-card hover:bg-astro-cardHover border border-astro-border hover:border-astro-cyan/40 rounded-lg p-4 transition-all shadow-sm flex flex-col justify-between space-y-3"
    >
      {/* Top Bar: Claim ID, Status, Domain */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">{claim.id}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-astro-darkest text-slate-400 border border-astro-border font-mono capitalize">
            {claim.researchDomain.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-astro-darkest text-slate-400 border border-astro-border font-mono">
            {claim.claimCategory.replace(/_/g, ' ')}
          </span>
        </div>
        {getStatusBadge(claim.claimStatus)}
      </div>

      {/* Claim Statement */}
      <div>
        <p className="text-xs sm:text-sm font-medium text-slate-100 group-hover:text-astro-cyan transition-colors leading-relaxed">
          "{claim.claimText}"
        </p>
      </div>

      {/* Missing source warning alert if any */}
      {hasMissingSources ? (
        <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Warning: No supporting scientific sources linked to this statement.</span>
        </div>
      ) : (
        /* Linked Sources Pills */
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Supporting Sources ({claim.sourceIds.length}):
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {claim.sourceIds.map((sid) => {
              const src = sourceMap.get(sid)
              return (
                <span
                  key={sid}
                  title={src ? src.title : sid}
                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-astro-darkest border border-astro-border text-slate-300 truncate max-w-xs"
                >
                  <BookmarkCheck className="w-2.5 h-2.5 text-astro-cyan" />
                  {sid}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom info & detail button */}
      <div className="pt-2 border-t border-astro-border/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-slate-500" />
            {claim.evidenceIds.length} Evidence Records
          </span>
          <span>Reviewed: {claim.lastReviewed}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(claim)
          }}
          className="text-astro-cyan hover:underline flex items-center gap-0.5 font-sans text-xs font-medium"
        >
          Inspect Traceability <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
