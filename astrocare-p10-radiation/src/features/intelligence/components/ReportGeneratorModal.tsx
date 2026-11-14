import React, { useState } from 'react';
import { ReportType } from '@/types/database.types';
import { MissionHealthReportDraft } from '../types';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { FileText, Copy, Download, Check, X, Sparkles } from 'lucide-react';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: ReportType) => Promise<MissionHealthReportDraft>;
  activeReport: MissionHealthReportDraft | null;
  callsign: string;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  activeReport,
  callsign,
}) => {
  const [selectedType, setSelectedType] = useState<ReportType>('DAILY_BRIEF');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const reportTypes: Array<{ type: ReportType; label: string; desc: string }> = [
    {
      type: 'DAILY_BRIEF',
      label: 'Daily Clinical Brief',
      desc: '24-hour physiological baseline drift, work-rest cycles, and flight surgeon status.',
    },
    {
      type: 'ANOMALY_EXPLANATION',
      label: 'Telemetry Anomaly Dossier',
      desc: 'In-depth root cause analysis and physiological mechanisms of active threshold alerts.',
    },
    {
      type: 'MISSION_SUMMARY',
      label: 'Mission Operational Summary',
      desc: 'Cumulative multi-system adaptation and countermeasure compliance review.',
    },
    {
      type: 'RADIATION_DOSSIER',
      label: 'Radiation Dosimetry Assessment',
      desc: 'Solar particle event flux history, SPE surge flags, and career absorbed dose limits.',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(selectedType);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!activeReport) return;
    navigator.clipboard.writeText(activeReport.markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeReport) return;
    const blob = new Blob([activeReport.markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASTROCARE_${activeReport.reportType}_${callsign}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-astro-text-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-astro-border-strong rounded-sm max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-astro-border-hairline flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-astro-text-primary" />
            <div>
              <h3 className="font-display text-sm font-bold text-astro-text-primary">
                Mission Health Dossier Generator
              </h3>
              <p className="font-mono text-[10px] text-astro-text-secondary">
                SUBJECT: {callsign} // AUTHORITATIVE CLINICAL ARCHIVE PERSISTED
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-astro-text-tertiary hover:text-astro-text-primary p-1 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Report Type Selector */}
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-astro-text-tertiary">
              SELECT REPORT PROTOCOL:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reportTypes.map((rt) => (
                <button
                  key={rt.type}
                  type="button"
                  onClick={() => setSelectedType(rt.type)}
                  className={`p-2.5 rounded-sm border text-left transition-all ${
                    selectedType === rt.type
                      ? 'border-astro-text-primary bg-astro-bg-subtle ring-1 ring-astro-text-primary'
                      : 'border-astro-border-hairline hover:border-astro-border-strong bg-white'
                  }`}
                >
                  <div className="font-display text-xs font-bold text-astro-text-primary">
                    {rt.label}
                  </div>
                  <div className="font-body text-[10px] text-astro-text-secondary mt-0.5 leading-snug">
                    {rt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <PrimaryButton
              size="md"
              icon={Sparkles}
              disabled={isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? 'SYNTHESIZING DOSSIER...' : 'GENERATE REPORT'}
            </PrimaryButton>
          </div>

          {/* Generated Report Preview Area */}
          {activeReport && (
            <div className="space-y-2 pt-2 border-t border-astro-border-hairline">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-astro-text-tertiary">
                  REPORT PREVIEW (SAVED TO REPOSITORY):
                </span>
                <div className="flex items-center space-x-2">
                  <SecondaryButton size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
                    {copied ? 'COPIED' : 'COPY MARKDOWN'}
                  </SecondaryButton>
                  <SecondaryButton size="sm" icon={Download} onClick={handleDownload}>
                    EXPORT .MD
                  </SecondaryButton>
                </div>
              </div>

              <div className="p-4 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm max-h-72 overflow-y-auto font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-astro-text-primary">
                {activeReport.markdownContent}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-astro-border-hairline bg-astro-bg-subtle flex items-center justify-between text-[10px] font-mono text-astro-text-tertiary">
          <span>SAVES ASYNCHRONOUSLY TO IReportService REPOSITORY</span>
          <SecondaryButton size="sm" onClick={onClose}>
            CLOSE
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
