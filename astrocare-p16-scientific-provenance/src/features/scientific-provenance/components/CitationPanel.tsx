import React, { useState } from 'react'
import {
  Quote,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Layers,
  Search,
  FileCode,
} from 'lucide-react'
import { ScientificSource } from '../types/source.types'
import { CitationStyle } from '../types/citation.types'
import { CitationService } from '../services/citationService'

interface CitationPanelProps {
  sources: ScientificSource[]
  activeStyle: CitationStyle
  onSelectStyle: (style: CitationStyle) => void
}

export const CitationPanel: React.FC<CitationPanelProps> = ({
  sources,
  activeStyle,
  onSelectStyle,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false)

  const formattedCitations = sources.map((s) => ({
    source: s,
    citation: CitationService.formatCitation(s, activeStyle),
  }))

  const filtered = formattedCitations.filter(({ source, citation }) => {
    if (showOnlyIncomplete && citation.isComplete) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim()
      const matchTitle = source.title.toLowerCase().includes(q)
      const matchOrg = source.organization.toLowerCase().includes(q)
      const matchText = citation.formattedText.toLowerCase().includes(q)
      if (!matchTitle && !matchOrg && !matchText) return false
    }
    return true
  })

  const handleCopySingle = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyAll = () => {
    const allText = filtered.map((f, i) => `${i + 1}. ${f.citation.formattedText}`).join('\n\n')
    navigator.clipboard.writeText(allText)
    setCopiedId('ALL')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownloadBibTeX = () => {
    const bibtex = CitationService.exportBibTeX(sources)
    const element = document.createElement('a')
    const file = new Blob([bibtex], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `astrocare_bibliography_${Date.now()}.bib`
    document.body.appendChild(element)
    element.click()
    element.remove()
  }

  const incompleteCount = formattedCitations.filter((f) => !f.citation.isComplete).length

  return (
    <div className="space-y-4">
      {/* Top Controls Card */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Style selector pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-astro-cyan" />
            Citation Standard:
          </span>
          {(['apa', 'ieee', 'vancouver', 'harvard'] as CitationStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`px-3 py-1 rounded text-xs font-mono uppercase font-bold transition-all ${
                activeStyle === style
                  ? 'bg-astro-cyan text-astro-darkest shadow-sm glow-cyan-sm'
                  : 'bg-astro-card hover:bg-astro-cardHover text-slate-300 border border-astro-border'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Global Export / Copy Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-200 transition-colors font-medium"
          >
            {copiedId === 'ALL' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">All Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All ({filtered.length})</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadBibTeX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-cyan/15 hover:bg-astro-cyan/25 border border-astro-cyan/40 text-xs text-astro-cyan transition-colors font-mono font-medium"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export BibTeX</span>
          </button>
        </div>
      </div>

      {/* Filter and Incomplete Warning Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-astro-card/40 border border-astro-border p-3 rounded-lg text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search citation text, authors, journals..."
            className="w-full pl-8 pr-2.5 py-1 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 focus:outline-none focus:border-astro-cyan/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-mono text-[11px]">
            <input
              type="checkbox"
              checked={showOnlyIncomplete}
              onChange={(e) => setShowOnlyIncomplete(e.target.checked)}
              className="rounded bg-astro-darkest border-astro-border text-astro-cyan focus:ring-0"
            />
            <span>Filter Incomplete Metadata ({incompleteCount})</span>
          </label>
        </div>
      </div>

      {/* Citation Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs bg-astro-surface border border-astro-border rounded-lg">
            No citations match your filter criteria.
          </div>
        ) : (
          filtered.map(({ source, citation }) => {
            const isCopied = copiedId === source.id

            return (
              <div
                key={source.id}
                className="bg-astro-surface hover:bg-astro-card/30 border border-astro-border hover:border-astro-borderLight rounded-lg p-4 transition-all shadow-sm space-y-2.5"
              >
                {/* Source header & Copy button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-astro-cyan font-bold">{source.id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-astro-card border border-astro-border font-mono text-slate-400">
                      {source.sourceType.replace(/_/g, ' ')}
                    </span>
                    {source.doi && (
                      <span className="text-[10px] font-mono text-astro-sky">
                        doi: {source.doi}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopySingle(source.id, citation.formattedText)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-astro-card hover:bg-astro-cardHover border border-astro-border text-slate-300 text-[11px] transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formatted Citation Text */}
                <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed pl-2 border-l-2 border-astro-cyan/50">
                  {citation.formattedText}
                </p>

                {/* Incomplete Citation Warning */}
                {!citation.isComplete && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      Incomplete metadata: Missing {citation.missingFields.join(', ')}. Academic standards advise manual verification before formal publication.
                    </span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
