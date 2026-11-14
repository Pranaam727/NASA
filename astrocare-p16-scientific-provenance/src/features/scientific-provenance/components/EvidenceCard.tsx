import React from 'react'
import {
  FileCheck2,
  Users,
  Microscope,
  HelpCircle,
  ExternalLink,
  Tag,
  Sparkles,
} from 'lucide-react'
import { EvidenceRecord, EvidenceType, SupportingRelationship } from '../types/evidence.types'
import { ScientificClaim } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'

interface EvidenceCardProps {
  evidence: EvidenceRecord
  claim?: ScientificClaim
  source?: ScientificSource
  onOpenSource?: (source: ScientificSource) => void
  onOpenClaim?: (claim: ScientificClaim) => void
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  claim,
  source,
  onOpenSource,
  onOpenClaim,
}) => {
  const getStudyTypeBadge = (type: EvidenceType) => {
    switch (type) {
      case 'human_astronaut_study':
        return 'bg-astro-cyan/15 text-astro-cyan border-astro-cyan/40'
      case 'ground_human_analog':
        return 'bg-astro-sky/15 text-astro-sky border-astro-sky/40'
      case 'animal_experiment':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
      case 'cell_culture':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40'
      case 'computational_model':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/40'
      case 'technical_report':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40'
      case 'review_article':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/40'
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600'
    }
  }

  const getRelationshipBadge = (rel: SupportingRelationship) => {
    switch (rel) {
      case 'direct_support':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'corroborative':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30'
      case 'contextual':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30'
      case 'conflicting':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      case 'inconclusive':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
  }

  return (
    <div className="bg-astro-card hover:bg-astro-cardHover border border-astro-border rounded-lg p-4 transition-all shadow-sm space-y-3.5">
      {/* Top Header: ID, Study Type, Supporting Relationship */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-astro-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">{evidence.id}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getStudyTypeBadge(
              evidence.studyType
            )}`}
          >
            {evidence.studyType.replace(/_/g, ' ')}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getRelationshipBadge(
              evidence.supportingRelationship
            )}`}
          >
            {evidence.supportingRelationship.replace(/_/g, ' ')}
          </span>
        </div>

        {evidence.sampleSize && (
          <span className="text-[11px] font-mono text-slate-300 bg-astro-darkest px-2 py-0.5 rounded border border-astro-border">
            Sample: {evidence.sampleSize}
          </span>
        )}
      </div>

      {/* Associated Claim & Source Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Associated Claim */}
        <div className="p-2 rounded bg-astro-darkest/70 border border-astro-border space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Associated Claim:</span>
          {claim ? (
            <div
              onClick={() => onOpenClaim && onOpenClaim(claim)}
              className="text-slate-200 font-medium line-clamp-1 hover:text-astro-cyan cursor-pointer transition-colors"
            >
              [{claim.id}] {claim.claimText}
            </div>
          ) : (
            <span className="text-slate-400 font-mono">{evidence.claimId}</span>
          )}
        </div>

        {/* Associated Source */}
        <div className="p-2 rounded bg-astro-darkest/70 border border-astro-border space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Underlying Source:</span>
          {source ? (
            <div
              onClick={() => onOpenSource && onOpenSource(source)}
              className="text-slate-200 font-medium line-clamp-1 hover:text-astro-cyan cursor-pointer transition-colors"
            >
              [{source.id}] {source.title}
            </div>
          ) : (
            <span className="text-slate-400 font-mono">{evidence.sourceId}</span>
          )}
        </div>
      </div>

      {/* Key Findings */}
      <div>
        <h4 className="text-[11px] font-mono font-semibold uppercase text-slate-300 mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-astro-cyan" />
          Key Research Findings
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-astro-darkest/50 p-2.5 rounded border border-astro-border/50">
          {evidence.keyFindings}
        </p>
      </div>

      {/* Methodology & Limitations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1 mb-0.5">
            <Microscope className="w-3 h-3 text-teal-400" />
            Methodology & Measurement:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{evidence.methodology}</p>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1 mb-0.5">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            Study Limitations:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{evidence.limitations}</p>
        </div>
      </div>

      {/* Footer Info: Organism & URL */}
      <div className="pt-2 border-t border-astro-border/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-slate-300">
          <Users className="w-3 h-3 text-slate-500" />
          {evidence.organism} • {evidence.population}
        </span>

        {evidence.originalSourceUrl && (
          <a
            href={evidence.originalSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-astro-cyan hover:underline flex items-center gap-1"
          >
            Source Link <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}
