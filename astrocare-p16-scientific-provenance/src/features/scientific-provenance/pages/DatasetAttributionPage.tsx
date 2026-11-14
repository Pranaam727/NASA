import React, { useState } from 'react'
import {
  FolderGit2,
  ExternalLink,
  PlusCircle,
  Database,
  Search,
  Download,
  BookmarkCheck,
  GitBranch,
  Dna,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { DatasetAttribution } from '../types/dataset.types'

export const DatasetAttributionPage: React.FC = () => {
  const { datasets, claims, insights, sources, addDataset } = useScientificProvenance()
  const [searchTerm, setSearchTerm] = useState('')

  // Add dataset modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDatasetId, setNewDatasetId] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newOrganism, setNewOrganism] = useState('Mus musculus (Mouse)')
  const [newStudyType, setNewStudyType] = useState('Transcriptomics (RNA-seq)')
  const [newPlatform, setNewPlatform] = useState('Illumina NovaSeq 6000')
  const [newUrl, setNewUrl] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const filteredDatasets = datasets.filter((ds) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim()
      const inId = ds.datasetId.toLowerCase().includes(q)
      const inTitle = ds.title.toLowerCase().includes(q)
      const inOrg = ds.organism.toLowerCase().includes(q)
      const inType = ds.studyType.toLowerCase().includes(q)
      if (!inId && !inTitle && !inOrg && !inType) return false
    }
    return true
  })

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDatasetId.trim() || !newTitle.trim()) return

    const ds: DatasetAttribution = {
      datasetId: newDatasetId.trim().toUpperCase(),
      title: newTitle.trim(),
      organization: 'NASA Open Science Data Repository',
      originalUrl: newUrl.trim() || `https://osdr.nasa.gov/bio/repo/data/studies/${newDatasetId.trim().toUpperCase()}`,
      retrievalDate: new Date().toISOString().split('T')[0],
      studyType: newStudyType.trim(),
      organism: newOrganism.trim(),
      platform: newPlatform.trim() || undefined,
      associatedClaims: [],
      associatedInsights: [],
      relatedPublications: [],
      status: 'active',
      description: newDesc.trim() || 'NASA OSDR open biological study.',
    }

    addDataset(ds)
    setIsAddModalOpen(false)
    setNewDatasetId('')
    setNewTitle('')
    setNewUrl('')
    setNewDesc('')
  }

  const exportDatasetsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(datasets, null, 2))
    const dl = document.createElement('a')
    dl.setAttribute('href', dataStr)
    dl.setAttribute('download', `astrocare_osdr_datasets_${Date.now()}.json`)
    document.body.appendChild(dl)
    dl.click()
    dl.remove()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-astro-cyan font-bold">DATASET-ATTRIBUTION-07</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono">
              NASA OSDR • GeneLab
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 mt-1">
            NASA Open Science Data Repository Attribution
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-4xl leading-relaxed">
            Direct biological attribution to NASA OSDR accessions (STS-135, RR-1, RR-3, Bion-M1). Preserves original study identifiers, platforms, sequencing assays, and links to downstream AstroCare claims.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportDatasetsJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-200 transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5 text-astro-cyan" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-astro-cyan text-astro-darkest font-semibold text-xs hover:bg-cyan-300 transition-all font-mono shadow-sm glow-cyan-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Dataset</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search OSDR ID (e.g. OSDR-379), assay, organism, title..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 focus:outline-none focus:border-astro-cyan/50 font-mono"
          />
        </div>

        <a
          href="https://osdr.nasa.gov/"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-mono hidden sm:flex"
        >
          NASA OSDR Official Repository <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Dataset Attribution Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDatasets.map((ds) => (
          <div
            key={ds.datasetId}
            className="bg-astro-card hover:bg-astro-cardHover border border-astro-border hover:border-teal-500/40 rounded-lg p-4 transition-all shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                    {ds.datasetId}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-astro-darkest border border-astro-border text-slate-400 font-mono">
                    {ds.studyType}
                  </span>
                </div>

                <a
                  href={ds.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-teal-300 p-1 rounded bg-astro-darkest border border-astro-border transition-colors"
                  title="Open NASA OSDR official accession"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h3 className="text-xs font-semibold text-slate-100 leading-snug">
                {ds.title}
              </h3>

              {ds.description && (
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {ds.description}
                </p>
              )}

              {/* Biological Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="bg-astro-darkest/70 p-2 rounded border border-astro-border/50">
                  <span className="text-slate-500 text-[10px] block uppercase">Organism</span>
                  <span className="text-slate-200">{ds.organism}</span>
                </div>
                <div className="bg-astro-darkest/70 p-2 rounded border border-astro-border/50">
                  <span className="text-slate-500 text-[10px] block uppercase">Flight / Mission</span>
                  <span className="text-slate-200">{ds.missionOrFlight || 'ISS Standard'}</span>
                </div>
                <div className="bg-astro-darkest/70 p-2 rounded border border-astro-border/50">
                  <span className="text-slate-500 text-[10px] block uppercase">Platform</span>
                  <span className="text-slate-200 truncate block">{ds.platform || 'Multi-platform'}</span>
                </div>
                <div className="bg-astro-darkest/70 p-2 rounded border border-astro-border/50">
                  <span className="text-slate-500 text-[10px] block uppercase">Assay Type</span>
                  <span className="text-slate-200 truncate block">{ds.assayType || 'Omics'}</span>
                </div>
              </div>
            </div>

            {/* Traceability Linkages */}
            <div className="pt-2 border-t border-astro-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookmarkCheck className="w-3 h-3 text-astro-cyan" />
                {ds.associatedClaims.length} Claims Linked
              </span>
              <span className="flex items-center gap-1.5">
                <GitBranch className="w-3 h-3 text-violet-400" />
                {ds.associatedInsights.length} Insights Linked
              </span>
              <span>Retrieved: {ds.retrievalDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dataset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-astro-surface border border-astro-border rounded-xl w-full max-w-lg shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-astro-border pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
                <FolderGit2 className="w-4 h-4 text-teal-400" />
                Register NASA OSDR Dataset
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDataset} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    OSDR Accession ID *
                  </label>
                  <input
                    type="text"
                    value={newDatasetId}
                    onChange={(e) => setNewDatasetId(e.target.value)}
                    placeholder="e.g. OSDR-542"
                    className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Organism *
                  </label>
                  <input
                    type="text"
                    value={newOrganism}
                    onChange={(e) => setNewOrganism(e.target.value)}
                    placeholder="e.g. Human (Homo sapiens)"
                    className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Study Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Epigenetic landscape in astronaut blood samples..."
                  className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Assay / Study Type
                  </label>
                  <input
                    type="text"
                    value={newStudyType}
                    onChange={(e) => setNewStudyType(e.target.value)}
                    placeholder="e.g. Transcriptomics"
                    className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Sequencing Platform
                  </label>
                  <input
                    type="text"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="e.g. Illumina NovaSeq"
                    className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Accession URL
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://osdr.nasa.gov/..."
                  className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 font-mono"
                />
              </div>

              <div className="pt-2 border-t border-astro-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-astro-cyan text-astro-darkest font-semibold hover:bg-cyan-300"
                >
                  Register Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
