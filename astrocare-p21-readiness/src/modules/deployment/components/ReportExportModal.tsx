// ============================================================================
// AstroCare Final Deployment Report Modal
// Allows previewing, copying, and downloading deployment audit reports.
// ============================================================================

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, FileCode, FileSpreadsheet } from 'lucide-react';
import { DeploymentReport } from '../types';
import {
  formatReportAsMarkdown,
  formatReportAsJSON,
  formatReportAsCSV,
  downloadFile
} from '../services/reportExporter';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DeploymentReport;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const [format, setFormat] = useState<'markdown' | 'json' | 'csv'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let content = '';
  let filename = '';
  let mimeType = '';

  if (format === 'markdown') {
    content = formatReportAsMarkdown(report);
    filename = `AstroCare_Deployment_Report_${new Date().toISOString().slice(0, 10)}.md`;
    mimeType = 'text/markdown';
  } else if (format === 'json') {
    content = formatReportAsJSON(report);
    filename = `AstroCare_Deployment_Report_${new Date().toISOString().slice(0, 10)}.json`;
    mimeType = 'application/json';
  } else {
    content = formatReportAsCSV(report);
    filename = `AstroCare_Deployment_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    mimeType = 'text/csv';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(content, filename, mimeType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800/60">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Export Mission Deployment Audit Report
              </h2>
              <p className="text-xs text-slate-400">
                Official flight-readiness assessment artifact for evaluation committees and engineering sign-off.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'markdown'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Markdown (.md)
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'json'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> JSON (.json)
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'csv'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV (.csv)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap select-all font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};
