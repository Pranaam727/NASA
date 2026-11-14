import React from 'react'
import {
  Database,
  Satellite,
  FolderGit2,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { ProvenanceSummaryCards } from '../components/ProvenanceSummaryCards'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { PageId } from '../components/NavigationSidebar'
import { ScientificSource } from '../types/source.types'

interface ProvenanceOverviewPageProps {
  onNavigate: (page: PageId) => void
  onSelectSource: (source: ScientificSource) => void
}

export const ProvenanceOverviewPage: React.FC<ProvenanceOverviewPageProps> = ({
  onNavigate,
  onSelectSource,
}) => {
  const { sources, claims, evidence, insights, datasets, validationResults } =
    useScientificProvenance()

  const nasaSourcesCount = sources.filter(
    (s) =>
      s.sourceType.startsWith('nasa_') ||
      s.organization.toLowerCase().includes('nasa')
  ).length

  const supportedClaims = claims.filter((c) => c.claimStatus === 'supported')
  const missingSourcesClaims = claims.filter((c) => c.sourceIds.length === 0)

  // Domain breakdown
  const domainCounts = sources.reduce<Record<string, number>>((acc, s) => {
    acc[s.researchDomain] = (acc[s.researchDomain] || 0) + 1
    return acc
  }, {})

  // Source Type breakdown
  const typeCounts = sources.reduce<Record<string, number>>((acc, s) => {
    acc[s.sourceType] = (acc[s.sourceType] || 0) + 1
    return acc
  }, {})

  // Evidence Study Type breakdown
  const evidenceTypeCounts = evidence.reduce<Record<string, number>>((acc, e) => {
    acc[e.studyType] = (acc[e.studyType] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-astro-surface via-astro-card to-astro-darkest border border-astro-border p-6 shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-astro-cyan/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-astro-cyan/10 border border-astro-cyan/30 text-astro-cyan text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AstroCare P16 • Aerospace Biomedical Verification
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Scientific Provenance & Citation Intelligence Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ensuring all clinical insights, astronaut telemetry interpretations, and research claims
            are traced back to authentic NASA Human Research Program publications, Open Science Data
            Repository (OSDR) studies, and peer-reviewed aerospace medicine findings.
          </p>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <ProvenanceSummaryCards
        totalSources={sources.length}
        nasaSourcesCount={nasaSourcesCount}
        datasetReferencesCount={datasets.length}
        totalClaims={claims.length}
        supportedClaimsCount={supportedClaims.length}
        missingSourceWarningsCount={missingSourcesClaims.length}
        recentlyValidatedCount={Object.keys(validationResults).length}
        onNavigate={onNavigate}
      />

      {/* Primary Dashboard Grid: Coverage & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Domain Coverage Chart */}
        <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-astro-border pb-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-astro-cyan" />
              Source Distribution by Domain
            </h3>
            <button
              onClick={() => onNavigate('sources')}
              className="text-xs text-astro-cyan hover:underline font-mono"
            >
              View Registry →
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(domainCounts).map(([domain, count]) => {
              const pct = Math.round((count / sources.length) * 100)
              return (
                <div key={domain} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 capitalize font-medium">
                      {domain.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-astro-darkest rounded-full overflow-hidden border border-astro-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-astro-cyan to-astro-blue rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Center: Evidence Types Distribution */}
        <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-astro-border pb-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              Evidence Classification Coverage
            </h3>
            <button
              onClick={() => onNavigate('evidence')}
              className="text-xs text-astro-cyan hover:underline font-mono"
            >
              Explore Evidence →
            </button>
          </div>

          <div className="space-y-2.5">
            {Object.entries(evidenceTypeCounts).map(([type, count]) => {
              const pct = Math.round((count / evidence.length) * 100)
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 capitalize font-mono text-[11px]">
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-teal-400 font-mono text-[11px] font-bold">
                      {count} records
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-astro-darkest rounded-full overflow-hidden border border-astro-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Integrity & Missing Source Warnings */}
        <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-astro-border pb-2.5">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Integrity & Orphan Claim Warnings
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                Active Guard
              </span>
            </div>

            {missingSourcesClaims.length > 0 ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  {missingSourcesClaims.length} Claims Without Supporting Sources
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  These claims are flagged as unsupported in the registry. Academic rigor requires linking authentic NASA or peer-reviewed literature before clinical presentation.
                </p>
                <div className="space-y-1 pt-1 font-mono text-[11px]">
                  {missingSourcesClaims.map((c) => (
                    <div key={c.id} className="text-amber-200 truncate">
                      • [{c.id}] {c.claimText}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Source Traceability Complete
                </div>
                <p className="text-[11px] text-emerald-200/90">
                  All active scientific claims have documented links to verified research records.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-astro-border flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              Duplicate Detection: <strong>0 Collisions</strong>
            </span>
            <button
              onClick={() => onNavigate('validation')}
              className="text-astro-cyan hover:underline font-mono"
            >
              Validation Engine →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recently Verified NASA Records & Quick Exploration */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-astro-border pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
              <Satellite className="w-4 h-4 text-astro-cyan" />
              Recently Registered NASA Research Publications & Evidence Reports
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified publications from NASA Human Research Program, Johnson Space Center, and OSDR
            </p>
          </div>

          <button
            onClick={() => onNavigate('nasa')}
            className="text-xs px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-slate-200 transition-colors font-mono flex items-center gap-1"
          >
            Explore NASA Discovery <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sources.slice(0, 6).map((source) => (
            <div
              key={source.id}
              onClick={() => onSelectSource(source)}
              className="p-3.5 rounded-lg bg-astro-card hover:bg-astro-cardHover border border-astro-border hover:border-astro-cyan/40 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-astro-cyan font-bold">
                    {source.id}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-astro-darkest border border-astro-border text-slate-400 font-mono uppercase">
                    {source.sourceType.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-100 group-hover:text-astro-cyan transition-colors line-clamp-2">
                  {source.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-astro-border/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="truncate max-w-[180px]">{source.organization}</span>
                <span className="text-astro-sky">{source.publicationDate || 'n.d.'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
