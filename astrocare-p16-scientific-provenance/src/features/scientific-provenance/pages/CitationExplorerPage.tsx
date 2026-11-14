import React from 'react'
import { Quote, Sparkles, Layers } from 'lucide-react'
import { CitationPanel } from '../components/CitationPanel'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'

export const CitationExplorerPage: React.FC = () => {
  const { sources, selectedCitationStyle, setSelectedCitationStyle } = useScientificProvenance()

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">CITATION-ENGINE-03</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
            Multi-Standard Academic Engine
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Scientific Citation & Reference Explorer
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Format, verify, and export standardized academic citations across <strong>APA 7th</strong>, <strong>IEEE</strong>, <strong>Vancouver</strong>, and <strong>Harvard</strong> styles. If essential metadata (such as authors, publication year, or DOI) is missing, warnings are explicitly flagged rather than inventing unsupported data.
        </p>
      </div>

      {/* Citation Engine Panel */}
      <CitationPanel
        sources={sources}
        activeStyle={selectedCitationStyle}
        onSelectStyle={setSelectedCitationStyle}
      />
    </div>
  )
}
