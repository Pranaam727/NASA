import React, { useState } from 'react'
import {
  Satellite,
  Search,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  BookmarkCheck,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react'
import {
  NASADiscoveryService,
  OFFICIAL_NASA_REPOSITORIES,
  NASADiscoveryRecord,
} from '../services/nasaDiscoveryService'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { SourceType, ResearchDomain } from '../types/source.types'

export const NASAResearchSourcesPage: React.FC = () => {
  const { sources, addSource } = useScientificProvenance()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(
    new Set(sources.map((s) => s.id))
  )

  const discoveredRecords = NASADiscoveryService.search(
    searchQuery,
    selectedDomain,
    selectedCategory
  )

  const handleRegister = (rec: NASADiscoveryRecord) => {
    const sourceObj = NASADiscoveryService.convertToScientificSource(rec)
    addSource(sourceObj)
    setRegisteredIds((prev) => new Set([...prev, sourceObj.id]))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">NASA-DISCOVERY-02</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">
            Official Agency Repositories
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          NASA Research Source Discovery & Ingestion
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Search authentic NASA Human Research Program publications, Technical Reports, and Open Science Data Repository (OSDR) multi-omics datasets. Discovered records can be imported directly into the AstroCare citation registry with intact canonical URLs and identifiers.
        </p>
      </div>

      {/* Official Primary NASA Repositories Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Satellite className="w-4 h-4 text-astro-cyan" />
          Primary NASA Biomedical Repositories & Evidence Bases
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_NASA_REPOSITORIES.map((repo, idx) => (
            <a
              key={idx}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group p-3.5 rounded-lg bg-astro-card hover:bg-astro-cardHover border border-astro-border hover:border-astro-cyan/40 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-astro-darkest border border-astro-border font-mono text-astro-cyan">
                    {repo.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-astro-cyan transition-colors" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100 group-hover:text-astro-cyan transition-colors">
                  {repo.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 truncate">
                {repo.url}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Discovery Search & Ingestion Controls */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-4 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NASA HRP risks, evidence reports, OSDR studies, accession IDs..."
              className="w-full pl-9 pr-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-astro-cyan/60 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-astro-darkest border border-astro-border rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="all">All Discovery Categories</option>
              <option value="HRP Evidence Book">HRP Evidence Book</option>
              <option value="OSDR Study">OSDR Study</option>
              <option value="NTRS Technical Report">NTRS Technical Report</option>
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-astro-darkest border border-astro-border rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="all">All Domains</option>
              <option value="radiation">Radiation</option>
              <option value="bone_and_muscle">Bone & Muscle</option>
              <option value="immune_system">Immune System</option>
              <option value="cardiovascular">Cardiovascular</option>
              <option value="multi_system">Multi-System</option>
            </select>
          </div>
        </div>

        {/* Notice on metadata distinction */}
        <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Authentic Metadata Distinction:</strong> Records shown here are retrieved from verified NASA repositories. Upon saving to the registry, these records are marked as verified authentic and distinguish original agency metadata from user-entered edits.
          </p>
        </div>

        {/* Discovered Records List */}
        <div className="space-y-3 pt-2">
          {discoveredRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs bg-astro-darkest rounded border border-astro-border">
              No NASA records matched your query. Try searching for "Radiation", "Muscle", "OSDR", or "SANS".
            </div>
          ) : (
            discoveredRecords.map((rec) => {
              const alreadyRegistered =
                registeredIds.has(`SRC-${rec.id}`) ||
                sources.some((s) => s.url === rec.url || s.id === `SRC-${rec.id}`)

              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-lg bg-astro-card hover:bg-astro-cardHover border border-astro-border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-astro-cyan font-bold">
                        {rec.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-astro-darkest border border-astro-border font-mono text-slate-300 uppercase">
                        {rec.discoveryCategory}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-astro-cyan/10 text-astro-cyan border border-astro-cyan/30 font-mono capitalize">
                        {rec.researchDomain.replace(/_/g, ' ')}
                      </span>
                      {rec.datasetId && (
                        <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/30">
                          {rec.datasetId}
                        </span>
                      )}
                      {rec.reportNumber && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {rec.reportNumber}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100">{rec.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {rec.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                      <span>{rec.organization}</span>
                      <span>•</span>
                      <span>Date: {rec.publicationDate || 'n.d.'}</span>
                      {rec.authors && (
                        <>
                          <span>•</span>
                          <span>{rec.authors.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded bg-astro-darkest hover:bg-astro-surface text-slate-300 hover:text-white border border-astro-border text-xs flex items-center gap-1 font-mono transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>NASA Portal</span>
                    </a>

                    {alreadyRegistered ? (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        In Registry
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(rec)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded bg-astro-cyan text-astro-darkest font-semibold text-xs hover:bg-cyan-300 transition-all font-mono shadow-sm glow-cyan-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Save to Registry</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
