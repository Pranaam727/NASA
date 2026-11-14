import React, { useState } from 'react'
import {
  FileText,
  Copy,
  Check,
  Download,
  FileCode,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react'
import { ScientificClaim } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'
import { EvidenceRecord } from '../types/evidence.types'
import { ResearchReportConfig, GeneratedReport } from '../types/report.types'
import { ReportService } from '../services/reportService'
import { CitationStyle } from '../types/citation.types'

interface ReportBuilderProps {
  claims: ScientificClaim[]
  sources: ScientificSource[]
  evidence: EvidenceRecord[]
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  claims,
  sources,
  evidence,
}) => {
  const [reportTitle, setReportTitle] = useState('AstroCare Biomedical Provenance & Evidence Verification Audit')
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>(claims.map((c) => c.id))
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('apa')
  const [includeStudyPopulations, setIncludeStudyPopulations] = useState(true)
  const [includeMethodology, setIncludeMethodology] = useState(true)
  const [includeLimitations, setIncludeLimitations] = useState(true)
  const [includeEvidenceClassifications, setIncludeEvidenceClassifications] = useState(true)
  const [includeMissingSourceWarnings, setIncludeMissingSourceWarnings] = useState(true)
  const [includeCitationList, setIncludeCitationList] = useState(true)
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSelectAllClaims = (selectAll: boolean) => {
    setSelectedClaimIds(selectAll ? claims.map((c) => c.id) : [])
  }

  const toggleClaim = (id: string) => {
    setSelectedClaimIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const handleGenerate = () => {
    const config: ResearchReportConfig = {
      title: reportTitle,
      includedClaimIds: selectedClaimIds,
      includeEvidenceClassifications,
      includeStudyPopulations,
      includeMethodology,
      includeLimitations,
      includeMissingSourceWarnings,
      includeCitationList,
      citationStyle,
      includeProvenanceLineage: true,
      includeDatasetAttribution: true,
      generatedBy: 'AstroCare Senior Flight Surgeon & Verification Officer',
    }

    const rep = ReportService.generateReport(config, claims, sources, evidence)
    setGeneratedReport(rep)
  }

  const handleCopyMarkdown = () => {
    if (!generatedReport) return
    navigator.clipboard.writeText(generatedReport.markdownContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadMarkdown = () => {
    if (!generatedReport) return
    const element = document.createElement('a')
    const file = new Blob([generatedReport.markdownContent], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${generatedReport.id}_AstroCare_Research_Report.md`
    document.body.appendChild(element)
    element.click()
    element.remove()
  }

  const handleDownloadJSON = () => {
    if (!generatedReport) return
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(generatedReport.jsonExport, null, 2)], {
      type: 'application/json',
    })
    element.href = URL.createObjectURL(file)
    element.download = `${generatedReport.id}_AstroCare_Report_Data.json`
    document.body.appendChild(element)
    element.click()
    element.remove()
  }

  const handleDownloadCSV = () => {
    const csvContent = ReportService.exportCSV(
      claims.filter((c) => selectedClaimIds.includes(c.id)),
      sources,
      evidence
    )
    const element = document.createElement('a')
    const file = new Blob([csvContent], { type: 'text/csv' })
    element.href = URL.createObjectURL(file)
    element.download = `AstroCare_Evidence_Matrix_${Date.now()}.csv`
    document.body.appendChild(element)
    element.click()
    element.remove()
  }

  return (
    <div className="space-y-5">
      {/* Configuration Grid */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
          <FileText className="w-4 h-4 text-astro-cyan" />
          Research Transparency Report Builder
        </h3>

        {/* Report Title */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Report Document Title
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-100 focus:outline-none focus:border-astro-cyan/60 font-medium"
          />
        </div>

        {/* Section Inclusion Checkboxes */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono text-slate-400 uppercase">
            Included Transparency Sections
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer bg-astro-card p-2 rounded border border-astro-border">
              <input
                type="checkbox"
                checked={includeStudyPopulations}
                onChange={(e) => setIncludeStudyPopulations(e.target.checked)}
                className="rounded bg-astro-darkest border-astro-border text-astro-cyan"
              />
              <span>Study Populations</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-astro-card p-2 rounded border border-astro-border">
              <input
                type="checkbox"
                checked={includeMethodology}
                onChange={(e) => setIncludeMethodology(e.target.checked)}
                className="rounded bg-astro-darkest border-astro-border text-astro-cyan"
              />
              <span>Research Methodologies</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-astro-card p-2 rounded border border-astro-border">
              <input
                type="checkbox"
                checked={includeLimitations}
                onChange={(e) => setIncludeLimitations(e.target.checked)}
                className="rounded bg-astro-darkest border-astro-border text-astro-cyan"
              />
              <span>Scientific Limitations</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-astro-card p-2 rounded border border-astro-border">
              <input
                type="checkbox"
                checked={includeEvidenceClassifications}
                onChange={(e) => setIncludeEvidenceClassifications(e.target.checked)}
                className="rounded bg-astro-darkest border-astro-border text-astro-cyan"
              />
              <span>Evidence Detail Table</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-astro-card p-2 rounded border border-astro-border">
              <input
                type="checkbox"
                checked={includeMissingSourceWarnings}
                onChange={(e) => setIncludeMissingSourceWarnings(e.target.checked)}
                className="rounded bg-astro-darkest border-astro-border text-astro-cyan"
              />
              <span>Missing Source Warnings</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-astro-card p-2 rounded border border-astro-border">
              <input
                type="checkbox"
                checked={includeCitationList}
                onChange={(e) => setIncludeCitationList(e.target.checked)}
                className="rounded bg-astro-darkest border-astro-border text-astro-cyan"
              />
              <span>Full Bibliography</span>
            </label>
          </div>
        </div>

        {/* Citation Style Picker for Report */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Bibliography Standard:</span>
          <div className="flex gap-1.5">
            {(['apa', 'ieee', 'vancouver', 'harvard'] as CitationStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setCitationStyle(style)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase transition-colors ${
                  citationStyle === style
                    ? 'bg-astro-cyan text-astro-darkest font-bold'
                    : 'bg-astro-card text-slate-300 border border-astro-border hover:bg-astro-cardHover'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Claims Selection Checklist */}
        <div className="space-y-2 pt-2 border-t border-astro-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              Select Scientific Claims to Audit ({selectedClaimIds.length} of {claims.length})
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => handleSelectAllClaims(true)}
                className="text-astro-cyan hover:underline"
              >
                Select All
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => handleSelectAllClaims(false)}
                className="text-slate-400 hover:text-white"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-astro-darkest rounded border border-astro-border">
            {claims.map((claim) => (
              <label
                key={claim.id}
                className="flex items-start gap-2.5 p-2 rounded bg-astro-card/50 hover:bg-astro-card border border-astro-border/50 text-xs cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedClaimIds.includes(claim.id)}
                  onChange={() => toggleClaim(claim.id)}
                  className="rounded bg-astro-darkest border-astro-border text-astro-cyan mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-astro-cyan font-semibold">
                      {claim.id}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-astro-darkest border border-astro-border text-slate-400 uppercase font-mono">
                      {claim.claimStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-200 line-clamp-1">{claim.claimText}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Trigger */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-astro-border">
          <div className="text-[11px] text-slate-400 font-mono">
            Ready to compile evidence synthesis across {selectedClaimIds.length} selected claims.
          </div>

          <button
            onClick={handleGenerate}
            disabled={selectedClaimIds.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-astro-cyan text-astro-darkest font-semibold text-xs hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm glow-cyan-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate Transparency Report
          </button>
        </div>
      </div>

      {/* Report Preview & Output */}
      {generatedReport && (
        <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-astro-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-astro-cyan font-bold">
                  {generatedReport.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  COMPILED REPORT
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mt-1">
                {generatedReport.title}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-200 transition-colors font-mono"
              >
                <Download className="w-3.5 h-3.5 text-astro-cyan" />
                <span>Download .MD</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-200 transition-colors font-mono"
              >
                <FileCode className="w-3.5 h-3.5 text-astro-sky" />
                <span>JSON</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-card hover:bg-astro-cardHover border border-astro-border text-xs text-slate-200 transition-colors font-mono"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Rendered Preview */}
          <div className="p-4 bg-astro-darkest rounded-lg border border-astro-border font-mono text-xs text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
            {generatedReport.markdownContent}
          </div>
        </div>
      )}
    </div>
  )
}
