import React, { useState } from 'react'
import { PlusCircle, Database, Sparkles } from 'lucide-react'
import { SourceRegistryTable } from '../components/SourceRegistryTable'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { AddSourceModal } from '../components/AddSourceModal'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ScientificSource } from '../types/source.types'

export const SourceRegistryPage: React.FC = () => {
  const {
    sources,
    claims,
    evidence,
    validationResults,
    addSource,
    updateSource,
    deleteSource,
  } = useScientificProvenance()

  const [selectedSource, setSelectedSource] = useState<ScientificSource | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [sourceToEdit, setSourceToEdit] = useState<ScientificSource | null>(null)

  const handleOpenEdit = (source: ScientificSource) => {
    setSourceToEdit(source)
    setIsAddModalOpen(true)
  }

  const handleSaveSource = (source: ScientificSource) => {
    if (sourceToEdit) {
      updateSource(source)
      if (selectedSource?.id === source.id) {
        setSelectedSource(source)
      }
    } else {
      addSource(source)
    }
    setSourceToEdit(null)
  }

  const linkedClaims = selectedSource
    ? claims.filter((c) => c.sourceIds.includes(selectedSource.id))
    : []

  const linkedEvidence = selectedSource
    ? evidence.filter((e) => e.sourceId === selectedSource.id)
    : []

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-astro-cyan font-bold">REGISTRY-01</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
              {sources.length} Verified Sources
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 mt-1">
            Scientific Source Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Catalog of authentic NASA Technical Reports, Evidence Books, Open Science datasets, and peer-reviewed aerospace medicine literature.
          </p>
        </div>

        <button
          onClick={() => {
            setSourceToEdit(null)
            setIsAddModalOpen(true)
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-astro-cyan text-astro-darkest font-semibold text-xs hover:bg-cyan-300 transition-all shadow-sm glow-cyan-sm font-mono shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Source</span>
        </button>
      </div>

      {/* Main Table */}
      <SourceRegistryTable
        sources={sources}
        validationResults={validationResults}
        onSelectSource={(s) => setSelectedSource(s)}
        onEditSource={handleOpenEdit}
        onDeleteSource={deleteSource}
        onAddNew={() => {
          setSourceToEdit(null)
          setIsAddModalOpen(true)
        }}
      />

      {/* Detail Slideover / Panel */}
      <SourceDetailPanel
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
        validationResult={selectedSource ? validationResults[selectedSource.id] : undefined}
        linkedClaims={linkedClaims}
        linkedEvidence={linkedEvidence}
        onOpenEdit={handleOpenEdit}
      />

      {/* Add / Edit Modal */}
      <AddSourceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSourceToEdit(null)
        }}
        onSave={handleSaveSource}
        initialSource={sourceToEdit}
      />
    </div>
  )
}
