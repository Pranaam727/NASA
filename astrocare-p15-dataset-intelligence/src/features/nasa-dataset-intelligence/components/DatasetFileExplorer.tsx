import React, { useState } from 'react';
import { DatasetFile } from '../types/dataset.types';
import { StatusBadge } from './StatusBadge';
import { FileText, Download, AlertTriangle, ExternalLink, ShieldAlert, Check } from 'lucide-react';

interface DatasetFileExplorerProps {
  studyId: string;
  files: DatasetFile[];
}

export const DatasetFileExplorer: React.FC<DatasetFileExplorerProps> = ({ studyId, files }) => {
  const [downloadConsentGiven, setDownloadConsentGiven] = useState<Record<string, boolean>>({});
  const [downloadInitiated, setDownloadInitiated] = useState<Record<string, boolean>>({});

  const handleDownloadClick = (file: DatasetFile) => {
    // Large file check (> 10MB)
    const isLarge = file.fileSize > 10 * 1024 * 1024;
    if (isLarge && !downloadConsentGiven[file.fileId]) {
      const confirm = window.confirm(
        `File '${file.fileName}' is ${file.fileSizeFormatted}. Large spaceflight datasets may consume substantial bandwidth. Proceed with direct source retrieval?`
      );
      if (!confirm) return;
      setDownloadConsentGiven(prev => ({ ...prev, [file.fileId]: true }));
    }

    setDownloadInitiated(prev => ({ ...prev, [file.fileId]: true }));
    window.open(file.downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Integrity banner */}
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Repository Access Protocol: </span>
          All listed files originate from the official NASA Open Science Data Repository (OSDR). 
          Files marked as &quot;Download Available&quot; route to NASA authenticated geode-py storage services.
          Metadata indexing does not imply local file caching.
        </div>
      </div>

      {files.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-medium text-slate-300">No Raw Files Discovered</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            This study currently exposes metadata descriptors and publication summaries. Primary sequencing or instrument archives can be requested through OSDR.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {files.map(file => {
                const isLarge = file.fileSize > 10 * 1024 * 1024;
                const initiated = downloadInitiated[file.fileId];

                return (
                  <tr key={file.fileId} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-200 max-w-xs truncate" title={file.fileName}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {file.category}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {file.fileType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {file.fileSizeFormatted}
                      {isLarge && (
                        <span className="ml-1 text-[10px] text-amber-400" title="Large scientific dataset">
                          (Large)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="availability" value={file.availabilityStatus} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {file.availabilityStatus === 'DOWNLOAD_AVAILABLE' ? (
                        <button
                          onClick={() => handleDownloadClick(file)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            initiated
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {initiated ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Link Opened</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3" />
                              <span>Retrieve</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <a
                          href={`https://osdr.nasa.gov/bio/repo/data/studies/${studyId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs"
                        >
                          <span>Request Access</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
