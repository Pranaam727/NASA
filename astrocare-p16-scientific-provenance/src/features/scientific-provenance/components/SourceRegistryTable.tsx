import React, { useState } from 'react'
import {
  ExternalLink,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react'
import { ScientificSource, SourceType, ResearchDomain } from '../types/source.types'
import { SourceValidationResult } from '../types/validation.types'

interface SourceRegistryTableProps {
  sources: ScientificSource[]
  validationResults: Record<string, SourceValidationResult>
  onSelectSource: (source: ScientificSource) => void
  onEditSource: (source: ScientificSource) => void
  onDeleteSource: (sourceId: string) => void
  onAddNew: () => void
}

export const SourceRegistryTable: React.FC<SourceRegistryTableProps> = ({
  sources,
  validationResults,
  onSelectSource,
  onEditSource,
  onDeleteSource,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<SourceType | 'all'>('all')
  const [selectedDomain, setSelectedDomain] = useState<ResearchDomain | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredSources = sources.filter((s) => {
    if (selectedType !== 'all' && s.sourceType !== selectedType) return false
    if (selectedDomain !== 'all' && s.researchDomain !== selectedDomain) return false
    if (selectedStatus !== 'all' && s.verificationStatus !== selectedStatus) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim()
      const inTitle = s.title.toLowerCase().includes(q)
      const inOrg = s.organization.toLowerCase().includes(q)
      const inDoi = s.doi?.toLowerCase().includes(q)
      const inDataset = s.datasetId?.toLowerCase().includes(q)
      const inDesc = s.description.toLowerCase().includes(q)
      if (!inTitle && !inOrg && !inDoi && !inDataset && !inDesc) return false
    }
    return true
  })

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredSources, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `astrocare_scientific_sources_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const exportAsCSV = () => {
    const headers = ['ID', 'Title', 'Organization', 'Source Type', 'Domain', 'Publication Date', 'DOI', 'Dataset ID', 'URL', 'Status', 'Retrieval Date']
    const rows = filteredSources.map((s) => [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.organization.replace(/"/g, '""')}"`,
      s.sourceType,
      s.researchDomain,
      s.publicationDate || 'n.d.',
      s.doi || 'N/A',
      s.datasetId || 'N/A',
      s.url,
      s.verificationStatus,
      s.retrievalDate,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `astrocare_scientific_sources_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const formatSourceTypeLabel = (type: SourceType) => {
    switch (type) {
      case 'nasa_publication':
        return 'NASA Publication'
      case 'nasa_technical_report':
        return 'NASA Technical Report'
      case 'nasa_hrp_page':
        return 'NASA HRP Document'
      case 'nasa_osdr_study':
        return 'NASA OSDR Study'
      case 'peer_reviewed_paper':
        return 'Peer-Reviewed Paper'
      case 'scientific_dataset':
        return 'Scientific Dataset'
      case 'research_institution':
        return 'Research Institution'
      case 'government_official':
        return 'Govt Research Source'
      default:
        return 'Verifiable Source'
    }
  }

  return (
    <div className="bg-astro-surface border border-astro-border rounded-lg shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 border-b border-astro-border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-astro-card/30">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, author, DOI, OSDR ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-astro-darkest/70 border border-astro-border rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-astro-cyan/60"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Showing {filteredSources.length} of {sources.length}
          </span>
        </div>

        {/* Filters and Exports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Source Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="bg-astro-darkest/80 border border-astro-border rounded-md px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-astro-cyan/50 font-mono"
          >
            <option value="all">All Source Categories</option>
            <option value="nasa_publication">NASA Publication</option>
            <option value="nasa_technical_report">NASA Technical Report</option>
            <option value="nasa_hrp_page">NASA HRP Evidence</option>
            <option value="nasa_osdr_study">NASA OSDR Study</option>
            <option value="peer_reviewed_paper">Peer-Reviewed Paper</option>
            <option value="scientific_dataset">Scientific Dataset</option>
            <option value="research_institution">Research Institution</option>
            <option value="other">Other Verifiable</option>
          </select>

          {/* Research Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as any)}
            className="bg-astro-darkest/80 border border-astro-border rounded-md px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-astro-cyan/50 font-mono"
          >
            <option value="all">All Research Domains</option>
            <option value="radiation">Radiation</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="bone_and_muscle">Bone & Muscle</option>
            <option value="immune_system">Immune System</option>
            <option value="sleep_and_circadian">Sleep & Circadian</option>
            <option value="neurovestibular">Neurovestibular / SANS</option>
            <option value="multi_system">Multi-System / Twins</option>
          </select>

          {/* Export Dropdown */}
          <button
            onClick={exportAsCSV}
            title="Export filtered records as CSV"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-300 transition-colors font-mono"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            CSV
          </button>

          <button
            onClick={exportAsJSON}
            title="Export filtered records as JSON"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-300 transition-colors font-mono"
          >
            <FileCode className="w-3.5 h-3.5 text-astro-cyan" />
            JSON
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-astro-border bg-astro-darkest/50 font-mono text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Source ID & Title</th>
              <th className="py-3 px-3">Type & Domain</th>
              <th className="py-3 px-3">Author / Organization</th>
              <th className="py-3 px-3">Identifiers (DOI / OSDR)</th>
              <th className="py-3 px-3">Integrity Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-astro-border/50 text-slate-300">
            {filteredSources.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                  No matching scientific sources found. Adjust filters or register a new source.
                </td>
              </tr>
            ) : (
              filteredSources.map((source) => {
                const validation = validationResults[source.id]
                const hasDuplicate = validation?.isDuplicate
                const isIncomplete = validation?.status === 'incomplete_metadata'

                return (
                  <tr
                    key={source.id}
                    className="hover:bg-astro-card/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectSource(source)}
                  >
                    {/* Source ID & Title */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-mono text-[10px] text-astro-cyan font-semibold flex items-center gap-1.5">
                        {source.id}
                        {source.isUserEntered && (
                          <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            User Entry
                          </span>
                        )}
                      </div>
                      <div className="text-slate-100 font-medium line-clamp-2 mt-0.5 group-hover:text-astro-cyan transition-colors">
                        {source.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Pub Date: {source.publicationDate || <span className="text-amber-400/80">[Unavailable]</span>}
                      </div>
                    </td>

                    {/* Type & Domain */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-astro-card border border-astro-border text-slate-300 mb-1">
                        {formatSourceTypeLabel(source.sourceType)}
                      </span>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {source.researchDomain.replace(/_/g, ' ')}
                      </div>
                    </td>

                    {/* Author / Org */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="text-slate-200 line-clamp-1">
                        {source.authors && source.authors.length > 0 ? (
                          source.authors.slice(0, 2).join(', ') + (source.authors.length > 2 ? ' et al.' : '')
                        ) : (
                          <span className="text-slate-400 italic">[Authors Unavailable]</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {source.organization}
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {source.doi ? (
                        <div className="text-astro-sky truncate max-w-[140px]" title={source.doi}>
                          doi: {source.doi}
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[10px]">[DOI Unavailable]</div>
                      )}
                      {source.datasetId && (
                        <div className="text-teal-400 text-[10px] mt-0.5">
                          ID: {source.datasetId}
                        </div>
                      )}
                    </td>

                    {/* Validation / Integrity */}
                    <td className="py-3 px-3">
                      {hasDuplicate ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          Duplicate
                        </span>
                      ) : isIncomplete ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Incomplete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          title="Open original official source in new tab"
                          className="p-1 rounded text-slate-400 hover:text-astro-cyan hover:bg-astro-card border border-transparent hover:border-astro-border"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onSelectSource(source)}
                          title="View source details"
                          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-astro-card border border-transparent hover:border-astro-border"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditSource(source)}
                          title="Edit metadata"
                          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-astro-card border border-transparent hover:border-astro-border"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete source record ${source.id}? Linked claims will be unlinked.`)) {
                              onDeleteSource(source.id)
                            }
                          }}
                          title="Delete source"
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
