import React, { useState } from 'react'
import {
  GitBranch,
  Bot,
  Database,
  Satellite,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react'
import { InsightProvenance, ProvenanceMethod, SimulationStatus } from '../types/provenance.types'
import { ScientificSource } from '../types/source.types'
import { DatasetAttribution } from '../types/dataset.types'
import { ScientificClaim } from '../types/claim.types'

interface InsightLineageGraphProps {
  insights: InsightProvenance[]
  sources: ScientificSource[]
  datasets: DatasetAttribution[]
  claims: ScientificClaim[]
  onOpenSource: (source: ScientificSource) => void
  onOpenClaim: (claim: ScientificClaim) => void
}

export const InsightLineageGraph: React.FC<InsightLineageGraphProps> = ({
  insights,
  sources,
  datasets,
  claims,
  onOpenSource,
  onOpenClaim,
}) => {
  const [selectedInsightId, setSelectedInsightId] = useState<string>(insights[0]?.id || '')

  const sourceMap = new Map(sources.map((s) => [s.id, s]))
  const datasetMap = new Map(datasets.map((d) => [d.datasetId, d]))

  const selectedInsight = insights.find((i) => i.id === selectedInsightId) || insights[0]

  const getMethodBadge = (method: ProvenanceMethod) => {
    switch (method) {
      case 'nasa_research_based':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40'
      case 'scientific_publication_based':
        return 'bg-astro-cyan/15 text-astro-cyan border-astro-cyan/40'
      case 'dataset_derived':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/40'
      case 'ai_generated_interpretation':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/40'
      case 'synthetic_demonstration':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40'
      case 'unverified':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40'
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600'
    }
  }

  const getSimulationBadge = (status: SimulationStatus) => {
    switch (status) {
      case 'authentic_flight_data':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      case 'ground_analog_data':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30'
      case 'simulated':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      case 'hybrid':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30'
    }
  }

  const exportLineageJSON = () => {
    if (!selectedInsight) return
    const lineageData = {
      insight: selectedInsight,
      linkedSources: selectedInsight.supportingSourceIds.map((id) => sourceMap.get(id)).filter(Boolean),
      linkedDatasets: selectedInsight.relatedDatasetIds.map((id) => datasetMap.get(id)).filter(Boolean),
      relatedClaims: claims.filter((c) =>
        c.sourceIds.some((sid) => selectedInsight.supportingSourceIds.includes(sid))
      ),
      exportedAt: new Date().toISOString(),
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lineageData, null, 2))
    const dlAnchor = document.createElement('a')
    dlAnchor.setAttribute('href', dataStr)
    dlAnchor.setAttribute('download', `provenance_lineage_${selectedInsight.id}.json`)
    document.body.appendChild(dlAnchor)
    dlAnchor.click()
    dlAnchor.remove()
  }

  return (
    <div className="space-y-4">
      {/* Insight Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-astro-border">
        {insights.map((ins) => (
          <button
            key={ins.id}
            onClick={() => setSelectedInsightId(ins.id)}
            className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-2 ${
              selectedInsightId === ins.id
                ? 'bg-astro-card text-astro-cyan border-astro-cyan/50 shadow-sm'
                : 'bg-astro-surface hover:bg-astro-card text-slate-400 border-astro-border'
            }`}
          >
            {ins.generationMethod === 'ai_generated_interpretation' ? (
              <Bot className="w-3.5 h-3.5 text-violet-400" />
            ) : ins.generationMethod === 'dataset_derived' ? (
              <Database className="w-3.5 h-3.5 text-teal-400" />
            ) : (
              <Satellite className="w-3.5 h-3.5 text-astro-cyan" />
            )}
            <span>{ins.id}</span>
            <span className="text-[10px] opacity-70 capitalize">
              ({ins.relatedHealthDomain.replace(/_/g, ' ')})
            </span>
          </button>
        ))}
      </div>

      {selectedInsight && (
        <div className="space-y-4">
          {/* Active Insight Card */}
          <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-astro-cyan font-bold">
                  {selectedInsight.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getMethodBadge(
                    selectedInsight.generationMethod
                  )}`}
                >
                  {selectedInsight.generationMethod.replace(/_/g, ' ')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getSimulationBadge(
                    selectedInsight.simulationStatus
                  )}`}
                >
                  Status: {selectedInsight.simulationStatus.replace(/_/g, ' ')}
                </span>
                {selectedInsight.moduleOrigin && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-astro-card border border-astro-border text-slate-300 font-mono">
                    Origin: {selectedInsight.moduleOrigin}
                  </span>
                )}
              </div>

              <button
                onClick={exportLineageJSON}
                className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-slate-300 transition-colors font-mono"
              >
                <Download className="w-3.5 h-3.5 text-astro-cyan" />
                Export Lineage JSON
              </button>
            </div>

            {/* Insight Statement */}
            <p className="text-sm font-medium text-slate-100 leading-relaxed bg-astro-darkest/60 p-3 rounded-lg border border-astro-border/60">
              "{selectedInsight.insightText}"
            </p>

            {/* AI Model metadata info if applicable */}
            {selectedInsight.aiModelMetadata && (
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30 text-xs text-violet-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-violet-300">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  AI Synthesis Metadata (Gemini Engine Integration Specification)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
                  <div>Model: {selectedInsight.aiModelMetadata.modelName}</div>
                  <div>Prompt: {selectedInsight.aiModelMetadata.promptVersion || 'N/A'}</div>
                  <div>Temperature: {selectedInsight.aiModelMetadata.temperature ?? 'N/A'}</div>
                  <div>Confidence: {selectedInsight.aiModelMetadata.confidenceScore ?? 'N/A'}</div>
                </div>
                <div className="text-[10px] text-amber-300/90 italic pt-1">
                  * Note: Citations attached to AI summaries do not automatically prove veracity. Independent expert review required.
                </div>
              </div>
            )}
          </div>

          {/* Interactive Lineage Flow Visualization */}
          <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-astro-cyan" />
              Complete Scientific Lineage & Attribution Trace
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Step 1: Open Science Datasets */}
              <div className="bg-astro-card border border-astro-border rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-astro-border pb-1.5">
                  <span className="text-[10px] font-mono uppercase text-teal-400 font-bold flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    1. Primary Datasets ({selectedInsight.relatedDatasetIds.length})
                  </span>
                </div>

                {selectedInsight.relatedDatasetIds.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No OSDR dataset directly linked to this specific insight.
                  </p>
                ) : (
                  selectedInsight.relatedDatasetIds.map((did) => {
                    const ds = datasetMap.get(did)
                    return (
                      <div
                        key={did}
                        className="p-2.5 rounded bg-astro-darkest border border-astro-border text-xs space-y-1 hover:border-teal-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-teal-400 font-bold">
                            {did}
                          </span>
                          {ds && (
                            <a
                              href={ds.originalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-white"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-200 line-clamp-2">
                          {ds ? ds.title : 'Registered open science study'}
                        </p>
                        {ds?.assayType && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Assay: {ds.assayType}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Step 2: Supporting Research Sources */}
              <div className="bg-astro-card border border-astro-border rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-astro-border pb-1.5">
                  <span className="text-[10px] font-mono uppercase text-astro-cyan font-bold flex items-center gap-1">
                    <Satellite className="w-3 h-3" />
                    2. Verified Sources ({selectedInsight.supportingSourceIds.length})
                  </span>
                </div>

                {selectedInsight.supportingSourceIds.length === 0 ? (
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Unsupported insight: Zero verified sources attached.</span>
                  </div>
                ) : (
                  selectedInsight.supportingSourceIds.map((sid) => {
                    const src = sourceMap.get(sid)
                    return (
                      <div
                        key={sid}
                        className="p-2.5 rounded bg-astro-darkest border border-astro-border text-xs space-y-1 hover:border-astro-cyan/40 transition-colors cursor-pointer"
                        onClick={() => src && onOpenSource(src)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-astro-cyan font-bold">
                            {sid}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-astro-surface border border-astro-border text-slate-400 font-mono">
                            {src?.sourceType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-200 line-clamp-2">
                          {src ? src.title : sid}
                        </p>
                        <div className="text-[10px] text-slate-400">
                          {src?.organization} ({src?.publicationDate || 'n.d.'})
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Step 3: Associated Scientific Claims */}
              <div className="bg-astro-card border border-astro-border rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-astro-border pb-1.5">
                  <span className="text-[10px] font-mono uppercase text-astro-violet font-bold flex items-center gap-1">
                    <FileCheck2 className="w-3 h-3" />
                    3. Formal Scientific Claims
                  </span>
                </div>

                {(() => {
                  const matchingClaims = claims.filter((c) =>
                    c.sourceIds.some((sid) => selectedInsight.supportingSourceIds.includes(sid))
                  )

                  if (matchingClaims.length === 0) {
                    return (
                      <p className="text-xs text-slate-500 italic py-2">
                        No scientific claims currently cross-referenced with these sources.
                      </p>
                    )
                  }

                  return matchingClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-2.5 rounded bg-astro-darkest border border-astro-border text-xs space-y-1 hover:border-astro-violet/40 transition-colors cursor-pointer"
                      onClick={() => onOpenClaim(claim)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-astro-violet font-bold">
                          {claim.id}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono uppercase">
                          {claim.claimStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-200 line-clamp-2">{claim.claimText}</p>
                    </div>
                  ))
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
