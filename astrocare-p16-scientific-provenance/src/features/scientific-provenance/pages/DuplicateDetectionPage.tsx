import React, { useState } from 'react'
import { CopyCheck, Sparkles } from 'lucide-react'
import { DuplicateDetectionView } from '../components/DuplicateDetectionView'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ScientificSource } from '../types/source.types'

export const DuplicateDetectionPage: React.FC = () => {
  const {
    sources,
    claims,
    evidence,
    validationResults,
    deleteSource,
    addSource,
  } = useScientificProvenance()

  const [selectedSource, setSelectedSource] = useState<ScientificSource | null>(null)

  const handleInjectDuplicateDemo = () => {
    // Inject a duplicate entry targeting an existing verified source to demonstrate the detector
    const targetSource = sources[0]
    if (!targetSource) return

    const duplicateEntry: ScientificSource = {
      id: `SRC-DUP-${Date.now().toString(36).toUpperCase()}`,
      title: `${targetSource.title} (Duplicate Submission)`,
      organization: targetSource.organization,
      publicationDate: targetSource.publicationDate,
      sourceType: targetSource.sourceType,
      researchDomain: targetSource.researchDomain,
      url: `${targetSource.url}/?utm_source=demo_test/`, // Normalized URL test
      doi: targetSource.doi,
      datasetId: targetSource.datasetId,
      description: 'Injected test duplicate record to demonstrate normalized canonical collision detection.',
      retrievalDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'disputed',
      isUserEntered: true,
      retrievalSource: 'manual_entry',
    }

    addSource(duplicateEntry)
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">DUPLICATE-GUARD-09</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
            Canonical URL & Identifier Normalization
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Duplicate Source & Identifier Collision Engine
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Detects duplicate publications entered under varying URL forms (http vs https, trailing slashes, tracking parameters), casing differences in DOIs, or duplicate NASA OSDR accession numbers.
        </p>
      </div>

      <DuplicateDetectionView
        sources={sources}
        onDeleteSource={deleteSource}
        onSelectSource={(s) => setSelectedSource(s)}
        onAddDuplicateDemo={handleInjectDuplicateDemo}
      />

      <SourceDetailPanel
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
        validationResult={selectedSource ? validationResults[selectedSource.id] : undefined}
        linkedClaims={selectedSource ? claims.filter((c) => c.sourceIds.includes(selectedSource.id)) : []}
        linkedEvidence={selectedSource ? evidence.filter((e) => e.sourceId === selectedSource.id) : []}
        onOpenEdit={() => {}}
      />
    </div>
  )
}
