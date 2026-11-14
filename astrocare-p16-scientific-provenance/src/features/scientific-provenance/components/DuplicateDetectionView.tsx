import React from 'react'
import {
  CopyCheck,
  AlertCircle,
  ExternalLink,
  Trash2,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react'
import { ScientificSource } from '../types/source.types'
import { SourceValidationService } from '../services/sourceValidationService'

interface DuplicateDetectionViewProps {
  sources: ScientificSource[]
  onDeleteSource: (sourceId: string) => void
  onSelectSource: (source: ScientificSource) => void
  onAddDuplicateDemo: () => void
}

export const DuplicateDetectionView: React.FC<DuplicateDetectionViewProps> = ({
  sources,
  onDeleteSource,
  onSelectSource,
  onAddDuplicateDemo,
}) => {
  const { duplicatesByUrl, duplicatesByDoi, duplicatesByDatasetId } =
    SourceValidationService.findDuplicates(sources)

  const totalDuplicateGroups =
    duplicatesByUrl.size + duplicatesByDoi.size + duplicatesByDatasetId.size

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
            <CopyCheck className="w-4 h-4 text-astro-cyan" />
            Duplicate Detection & Canonical Source Identification
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalizes URLs (ignoring trailing slashes and tracking queries), DOIs, and NASA OSDR study IDs to detect duplicate entries.
          </p>
        </div>

        <button
          onClick={onAddDuplicateDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-300 transition-colors font-mono shrink-0"
          title="Insert a deliberate duplicate URL for validation testing"
        >
          <PlusCircle className="w-3.5 h-3.5 text-astro-cyan" />
          Inject Test Duplicate
        </button>
      </div>

      {totalDuplicateGroups === 0 ? (
        <div className="p-10 text-center bg-astro-card/30 border border-astro-border rounded-lg space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            No Duplicate Records Detected
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All registered scientific sources possess distinct canonical URLs, Digital Object Identifiers, and NASA OSDR study accession numbers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Duplicate URLs */}
          {duplicatesByUrl.size > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Duplicate Canonical URLs ({duplicatesByUrl.size} collisions)
              </h4>

              {Array.from(duplicatesByUrl.entries()).map(([urlKey, groupSources]) => (
                <div
                  key={urlKey}
                  className="bg-astro-surface border border-rose-500/30 rounded-lg p-3.5 space-y-2.5"
                >
                  <div className="text-xs font-mono text-slate-300 bg-astro-darkest p-2 rounded border border-astro-border flex items-center justify-between">
                    <span className="text-astro-sky truncate max-w-lg">Canonical: {urlKey}</span>
                    <span className="text-rose-400 font-bold">{groupSources.length} records</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupSources.map((src) => (
                      <div
                        key={src.id}
                        className="p-2.5 rounded bg-astro-card border border-astro-border text-xs flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono text-astro-cyan font-bold">{src.id}</span>
                          <p className="text-slate-200 line-clamp-1 font-medium">{src.title}</p>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Added: {src.retrievalDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onSelectSource(src)}
                            className="p-1 rounded text-slate-300 hover:text-white bg-astro-darkest"
                            title="Inspect"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => onDeleteSource(src.id)}
                            className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                            title="Delete duplicate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Duplicate DOIs */}
          {duplicatesByDoi.size > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Duplicate DOIs ({duplicatesByDoi.size} collisions)
              </h4>

              {Array.from(duplicatesByDoi.entries()).map(([doiKey, groupSources]) => (
                <div
                  key={doiKey}
                  className="bg-astro-surface border border-rose-500/30 rounded-lg p-3.5 space-y-2"
                >
                  <div className="text-xs font-mono text-slate-300 bg-astro-darkest p-2 rounded border border-astro-border">
                    Normalized DOI: <strong className="text-astro-sky">{doiKey}</strong>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupSources.map((src) => (
                      <div
                        key={src.id}
                        className="p-2.5 rounded bg-astro-card border border-astro-border text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono text-astro-cyan font-bold">{src.id}</span>
                          <p className="text-slate-200 line-clamp-1">{src.title}</p>
                        </div>
                        <button
                          onClick={() => onDeleteSource(src.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
