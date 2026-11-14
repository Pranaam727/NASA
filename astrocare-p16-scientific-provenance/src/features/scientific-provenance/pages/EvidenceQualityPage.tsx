import React, { useState } from 'react'
import { Award, Info, Sparkles } from 'lucide-react'
import { EvidenceQualityMatrix } from '../components/EvidenceQualityMatrix'
import { ClaimDetailModal } from '../components/ClaimDetailModal'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { EvidenceRecord } from '../types/evidence.types'
import { ScientificClaim } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'

export const EvidenceQualityPage: React.FC = () => {
  const {
    evidence,
    claims,
    sources,
    validationResults,
    linkSourceToClaim,
    unlinkSourceFromClaim,
    updateClaim,
  } = useScientificProvenance()

  const [activeClaim, setActiveClaim] = useState<ScientificClaim | null>(null)
  const [activeSource, setActiveSource] = useState<ScientificSource | null>(null)

  const handleOpenEvidence = (ev: EvidenceRecord) => {
    const clm = claims.find((c) => c.id === ev.claimId)
    if (clm) {
      setActiveClaim(clm)
    }
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">QUALITY-ASSESSMENT-10</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
            Scientific Rigor & Generalizability
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Evidence Quality, Cohort Sizes & Methodological Transparency
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Detailed transparency into study populations (e.g. n=1 twin flight vs n=17 astronaut QCT cohort), measurement modalities, and experimental limitations. Refrains from generating arbitrary pseudo-scientific numerical scores.
        </p>
      </div>

      <EvidenceQualityMatrix
        evidenceList={evidence}
        claims={claims}
        sources={sources}
        onOpenEvidence={handleOpenEvidence}
      />

      <ClaimDetailModal
        claim={activeClaim}
        onClose={() => setActiveClaim(null)}
        allSources={sources}
        allEvidence={evidence}
        onLinkSource={linkSourceToClaim}
        onUnlinkSource={unlinkSourceFromClaim}
        onUpdateStatus={(clm, status) => updateClaim({ ...clm, claimStatus: status })}
        onOpenSource={(src) => setActiveSource(src)}
      />

      <SourceDetailPanel
        source={activeSource}
        onClose={() => setActiveSource(null)}
        validationResult={activeSource ? validationResults[activeSource.id] : undefined}
        linkedClaims={activeSource ? claims.filter((c) => c.sourceIds.includes(activeSource.id)) : []}
        linkedEvidence={activeSource ? evidence.filter((e) => e.sourceId === activeSource.id) : []}
        onOpenEdit={() => {}}
      />
    </div>
  )
}
