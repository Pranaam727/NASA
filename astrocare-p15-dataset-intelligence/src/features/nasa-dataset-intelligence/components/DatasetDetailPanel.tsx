import React, { useState } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { StatusBadge } from './StatusBadge';
import { DatasetFileExplorer } from './DatasetFileExplorer';
import { 
  X, ExternalLink, Calendar, Compass, Layers, Users, 
  BookOpen, FileCode, CheckCircle2, FlaskConical, Share2, Copy 
} from 'lucide-react';

interface DatasetDetailPanelProps {
  dataset: DatasetRecord;
  onClose: () => void;
  onToggleCompare?: (studyId: string) => void;
  isComparing?: boolean;
}

export const DatasetDetailPanel: React.FC<DatasetDetailPanelProps> = ({
  dataset,
  onClose,
  onToggleCompare,
  isComparing = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'protocols' | 'publications'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dataset.sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {dataset.studyId}
              </span>
              <StatusBadge type="population" value={dataset.studyType} />
              <StatusBadge type="provenance" value={dataset.provenance} />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
              {dataset.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(dataset.studyId)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  isComparing
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {isComparing ? 'In Comparison' : '+ Add to Compare'}
              </button>
            )}
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy NASA OSDR Link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={dataset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="View on NASA OSDR official portal"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-800 bg-slate-950 flex gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Study Overview & Metadata
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'files'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Repository Files</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {dataset.availableFiles?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'protocols'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Experimental Protocols ({dataset.protocols?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('publications')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'publications'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Publications ({dataset.publications?.length || 0})
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Abstract / Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Research Abstract & Objectives
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                  {dataset.description}
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Organism</span>
                  </div>
                  <div className="font-semibold text-slate-200">{dataset.organism}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 mb-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mission / Platform</span>
                  </div>
                  <div className="font-semibold text-slate-200 truncate">{dataset.mission || 'Spaceflight'}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>Public Release Date</span>
                  </div>
                  <div className="font-semibold text-slate-200 font-mono">
                    {dataset.publicReleaseDate || 'Historical'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 mb-1 flex items-center gap-1">
                    <FlaskConical className="w-3.5 h-3.5 text-violet-400" />
                    <span>Managing Center</span>
                  </div>
                  <div className="font-semibold text-slate-200 truncate">
                    {dataset.managingCenter || 'NASA Ames'}
                  </div>
                </div>
              </div>

              {/* Factors & Variables */}
              {dataset.factors && dataset.factors.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Experimental Factors & Environmental Perturbations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {dataset.factors.map((factor, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-200">{factor.name}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {factor.type}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{factor.value || 'Configured in study parameters'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biological Specimen Types */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Biospecimen & Assay Technology Matrix
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dataset.sampleTypes.map((sample, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs">
                      Specimen: {sample}
                    </span>
                  ))}
                  {dataset.assayTypes.map((assay, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs">
                      Assay: {assay}
                    </span>
                  ))}
                  {dataset.technologyPlatforms.map((plat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/30 text-xs">
                      Platform: {plat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <DatasetFileExplorer studyId={dataset.studyId} files={dataset.availableFiles || []} />
          )}

          {activeTab === 'protocols' && (
            <div className="space-y-3">
              {dataset.protocols && dataset.protocols.length > 0 ? (
                dataset.protocols.map((proto, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-slate-200">{proto.name}</h5>
                      {proto.type && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {proto.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{proto.description}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Protocols are archived within the study ISA-TAB metadata package.
                </div>
              )}
            </div>
          )}

          {activeTab === 'publications' && (
            <div className="space-y-3">
              {dataset.publications && dataset.publications.length > 0 ? (
                dataset.publications.map((pub, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h5 className="text-sm font-semibold text-slate-200 leading-snug">{pub.title}</h5>
                    <div className="text-xs text-slate-400">{pub.authors}</div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      {pub.journal && <span>{pub.journal} ({pub.year})</span>}
                      {pub.doi && <span>DOI: {pub.doi}</span>}
                      {pub.pmid && (
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          PubMed: {pub.pmid}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No peer-reviewed publications linked in public OSDR index for this entry.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>NASA Open Science Data Repository Accession:</span>
            <a 
              href={dataset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-mono inline-flex items-center gap-1"
            >
              {dataset.studyId}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
