import React, { useState } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { ResearchReportData } from '../types/research.types';
import { ReportExportService } from '../services/reportExportService';
import { BENCHMARK_OBSERVATIONS, BENCHMARK_VARIABLES } from '../data/demoObservations';
import { 
  FileText, Download, Copy, Printer, Check, 
  ExternalLink, ShieldCheck, Sparkles, AlertCircle 
} from 'lucide-react';

interface ResearchReportsPageProps {
  datasets: DatasetRecord[];
  selectedComparisonIds: string[];
}

export const ResearchReportsPage: React.FC<ResearchReportsPageProps> = ({
  datasets,
  selectedComparisonIds
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedComparisonIds.length > 0 ? selectedComparisonIds : ['OSD-575', 'OSD-53']
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');

  const selectedStudies = datasets.filter(d => selectedIds.includes(d.studyId));
  const reportData: ResearchReportData = ReportExportService.buildReportData(
    selectedStudies.length > 0 ? selectedStudies : [datasets[0]],
    BENCHMARK_OBSERVATIONS,
    BENCHMARK_VARIABLES
  );

  const markdownContent = ReportExportService.exportToMarkdown(reportData);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    ReportExportService.downloadFile(
      markdownContent,
      `${reportData.reportId}.md`,
      'text/markdown'
    );
  };

  const handleDownloadCSV = () => {
    const csv = ReportExportService.exportObservationsToCSV(BENCHMARK_OBSERVATIONS);
    ReportExportService.downloadFile(
      csv,
      `${reportData.reportId}_observations.csv`,
      'text/csv'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleStudySelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Aerospace Intelligence Dossier Generator
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Research Report Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Synthesize formal scientific intelligence briefings from indexed NASA OSDR datasets, experimental factors, specimen availability audits, and observed physiological findings.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-blue-400 border border-blue-500/30 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Metrics</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Select Studies to Include in Report */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
          Select Studies to Include in Dossier ({selectedIds.length} chosen):
        </span>
        <div className="flex flex-wrap gap-2">
          {datasets.map(d => {
            const isIncluded = selectedIds.includes(d.studyId);
            return (
              <button
                key={d.studyId}
                onClick={() => toggleStudySelection(d.studyId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                  isIncluded
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                {isIncluded ? '✓ ' : '+ '}
                {d.studyId}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher: Styled Preview vs Raw Markdown */}
      <div className="flex border-b border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Structured Scientific Document View
        </button>
        <button
          onClick={() => setActiveTab('markdown')}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === 'markdown'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw GitHub-Flavored Markdown
        </button>
      </div>

      {/* Report Content Body */}
      {activeTab === 'preview' ? (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-8 text-slate-200 leading-relaxed font-sans shadow-xl">
          {/* Header Block */}
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>{reportData.authorAgency}</span>
              <span>Report Ref: {reportData.reportId}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              {reportData.reportTitle}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <span>Generated: {new Date(reportData.generatedAt).toUTCString()}</span>
              <span>Classification: PUBLIC OPEN SCIENCE</span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              1. Executive Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-850">
              {reportData.executiveSummary}
            </p>
          </div>

          {/* 2. Indexed Studies */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              2. Selected NASA Studies Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportData.selectedStudies.map(s => (
                <div key={s.studyId} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-400">{s.studyId}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {s.studyType}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-100 leading-snug">{s.title}</h4>
                  <div className="text-slate-400 text-[11px] truncate">
                    Platform: {s.mission || s.experimentPlatform} • Organism: {s.organism}
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2 pt-1">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Population & Model Breakdown */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              3. Study Population & Model Classification
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">Human Studies</span>
                <span className="text-lg font-bold text-blue-400">{reportData.populationBreakdown.humans}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">Animal Models</span>
                <span className="text-lg font-bold text-amber-400">{reportData.populationBreakdown.animals}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">Cell Culture Assays</span>
                <span className="text-lg font-bold text-violet-400">{reportData.populationBreakdown.cells}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">Other Models</span>
                <span className="text-lg font-bold text-slate-300">{reportData.populationBreakdown.others}</span>
              </div>
            </div>
          </div>

          {/* 4. Observed Findings */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              4. Observed Biomedical Findings
            </h3>
            <ul className="space-y-2 text-xs">
              {reportData.observedBiomedicalFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Scientific Limitations */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              5. Study Limitations & Methodological Constraints
            </h3>
            <ul className="space-y-2 text-xs">
              {reportData.scientificLimitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-850">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-400">{lim}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Primary References */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              6. Primary OSDR Repository References
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {reportData.sourceReferences.map((ref, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-semibold">[{ref.studyId}]</span>
                  <span>{ref.title}</span>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    OSDR Source
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Raw Markdown View */
        <div className="relative">
          <textarea
            readOnly
            value={markdownContent}
            rows={22}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500/60 resize-y"
          />
        </div>
      )}
    </div>
  );
};
