import React, { useState } from 'react'
import { ShieldCheck, Layers } from 'lucide-react'
import { SourceValidationPanel } from '../components/SourceValidationPanel'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ScientificSource } from '../types/source.types'

export const SourceValidationPage: React.FC = () => {
  const {
    sources,
    claims,
    evidence,
    validationResults,
    runValidationForAll,
    updateSource,
  } = useScientificProvenance()

  const [selectedSource, setSelectedSource] = useState<ScientificSource | null>(null)

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">VALIDATION-08</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
            Integrity Watchdog
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Source Validation & Metadata Integrity Audit
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Automated evaluation of URL syntax, publication dates, author attributions, and Digital Object Identifiers. Transparently demonstrates the difference between static bibliographic schema checks and live network accessibility.
        </p>
      </div>

      <SourceValidationPanel
        sources={sources}
        validationResults={validationResults}
        onRunValidationAll={runValidationForAll}
        onSelectSource={(s) => setSelectedSource(s)}
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
