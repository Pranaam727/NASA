import React, { useState } from 'react'
import {
  GitBranch,
  Bot,
  Database,
  Satellite,
  Info,
  Sparkles,
  PlusCircle,
  FileCode,
} from 'lucide-react'
import { InsightLineageGraph } from '../components/InsightLineageGraph'
import { SourceDetailPanel } from '../components/SourceDetailPanel'
import { ClaimDetailModal } from '../components/ClaimDetailModal'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'
import { ScientificSource } from '../types/source.types'
import { ScientificClaim } from '../types/claim.types'
import { InsightProvenance, ProvenanceMethod, SimulationStatus } from '../types/provenance.types'

export const InsightProvenancePage: React.FC = () => {
  const {
    insights,
    sources,
    datasets,
    claims,
    evidence,
    validationResults,
    addInsight,
    linkSourceToClaim,
    unlinkSourceFromClaim,
    updateClaim,
  } = useScientificProvenance()

  const [activeSource, setActiveSource] = useState<ScientificSource | null>(null)
  const [activeClaim, setActiveClaim] = useState<ScientificClaim | null>(null)

  // Add Insight modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [insightText, setInsightText] = useState('')
  const [domain, setDomain] = useState('cardiovascular')
  const [method, setMethod] = useState<ProvenanceMethod>('ai_generated_interpretation')
  const [simStatus, setSimStatus] = useState<SimulationStatus>('simulated')

  const handleCreateInsight = (e: React.FormEvent) => {
    e.preventDefault()
    if (!insightText.trim()) return

    const newInsight: InsightProvenance = {
      id: `INS-USR-${Date.now().toString(36).toUpperCase()}`,
      insightText: insightText.trim(),
      generationMethod: method,
      relatedHealthDomain: domain,
      relatedDatasetIds: [],
      supportingSourceIds: [],
      createdAt: new Date().toISOString(),
      retrievalDate: new Date().toISOString().split('T')[0],
      simulationStatus: simStatus,
      reviewStatus: 'under_review',
      moduleOrigin: 'P16_ProvenanceStudio',
      aiModelMetadata:
        method === 'ai_generated_interpretation'
          ? {
              modelName: 'Gemini-1.5-Pro Aerospace BioMedical',
              promptVersion: 'v2.4-user-prompt',
              temperature: 0.2,
              confidenceScore: 0.7,
            }
          : undefined,
    }

    addInsight(newInsight)
    setIsAddModalOpen(false)
    setInsightText('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">PROVENANCE-LINEAGE-06</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/30 font-mono">
            Gemini AI Integration Ready
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Insight Provenance & AI Lineage Tracking
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Trace the exact origin of biomedical observations and AI-synthesized research summaries. Distinguishes whether insights stem from authentic flight biosensors, ground analogs, NASA OSDR omics, or predictive generative simulations.
        </p>
      </div>

      {/* Top Banner: Verification Caution */}
      <div className="p-4 rounded-lg bg-astro-card border border-astro-border text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-mono font-bold text-violet-300">
          <Bot className="w-4 h-4 text-violet-400" />
          AstroCare AI Attribution Standard (Mandatory Requirement)
        </div>
        <p className="leading-relaxed">
          In accordance with AstroCare verification guidelines, attaching citations to an AI-generated statement does <strong>NOT</strong> automatically prove its clinical veracity. Every model-derived synthesis must declare its prompt version, temperature, confidence parameters, simulation boundary status, and undergo formal clinician review before operational application.
        </p>
      </div>

      {/* Lineage Graph Component */}
      <InsightLineageGraph
        insights={insights}
        sources={sources}
        datasets={datasets}
        claims={claims}
        onOpenSource={(src) => setActiveSource(src)}
        onOpenClaim={(clm) => setActiveClaim(clm)}
      />

      {/* Modals for Deep Inspection */}
      <SourceDetailPanel
        source={activeSource}
        onClose={() => setActiveSource(null)}
        validationResult={activeSource ? validationResults[activeSource.id] : undefined}
        linkedClaims={activeSource ? claims.filter((c) => c.sourceIds.includes(activeSource.id)) : []}
        linkedEvidence={activeSource ? evidence.filter((e) => e.sourceId === activeSource.id) : []}
        onOpenEdit={() => {}}
      />

      <ClaimDetailModal
        claim={activeClaim}
        onClose={() => setActiveClaim(null)}
        allSources={sources}
        allEvidence={evidence}
        onLinkSource={linkSourceToClaim}
        onUnlinkSource={unlinkSourceFromClaim}
        onUpdateStatus={(clm, status) => updateClaim({ ...clm, claimStatus: status })}
        onOpenSource={(src) => setActiveSource(src)}
      />

      {/* Add Insight Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-astro-surface border border-astro-border rounded-xl w-full max-w-lg shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-astro-border pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
                <GitBranch className="w-4 h-4 text-astro-cyan" />
                Register Module Insight
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInsight} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Insight Text *
                </label>
                <textarea
                  rows={3}
                  value={insightText}
                  onChange={(e) => setInsightText(e.target.value)}
                  placeholder="Clinical synthesis, AI observation, or telemetry correlation..."
                  className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Generation Method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-200 font-mono text-xs"
                  >
                    <option value="ai_generated_interpretation">AI-Generated Summary</option>
                    <option value="nasa_research_based">NASA Research-Based</option>
                    <option value="dataset_derived">Dataset-Derived</option>
                    <option value="synthetic_demonstration">Synthetic Demonstration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Simulation Status
                  </label>
                  <select
                    value={simStatus}
                    onChange={(e) => setSimStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-200 font-mono text-xs"
                  >
                    <option value="simulated">Simulated Data</option>
                    <option value="authentic_flight_data">Authentic Flight Data</option>
                    <option value="ground_analog_data">Ground Analog Data</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
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
                  Save Insight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
