import React from 'react'
import { FileText, Sparkles, Download, Layers } from 'lucide-react'
import { ReportBuilder } from '../components/ReportBuilder'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'

export const ResearchReportsPage: React.FC = () => {
  const { claims, sources, evidence } = useScientificProvenance()

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">REPORTS-COMPILER-11</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
            Exportable Audit Dossiers
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Research Transparency & Provenance Dossier Generator
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Compile publication-grade biomedical verification dossiers. Includes claim-to-evidence matrices, study population breakdowns, known research limitations, missing-source warning flags, and academic bibliographies in Markdown, JSON, and CSV.
        </p>
      </div>

      <ReportBuilder claims={claims} sources={sources} evidence={evidence} />
    </div>
  )
}
