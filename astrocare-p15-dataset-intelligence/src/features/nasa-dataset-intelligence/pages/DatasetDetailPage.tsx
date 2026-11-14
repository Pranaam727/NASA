import React from 'react';
import { useDatasetMetadata } from '../hooks/useDatasetMetadata';
import { StatusBadge } from '../components/StatusBadge';
import { DatasetFileExplorer } from '../components/DatasetFileExplorer';
import { 
  ArrowLeft, ExternalLink, Calendar, Compass, Layers, 
  FlaskConical, CheckSquare, Square, Share2, Copy 
} from 'lucide-react';

interface DatasetDetailPageProps {
  studyId: string;
  onBack: () => void;
  onToggleCompare?: (studyId: string) => void;
  isComparing?: boolean;
}

export const DatasetDetailPage: React.FC<DatasetDetailPageProps> = ({
  studyId,
  onBack,
  onToggleCompare,
  isComparing = false
}) => {
  const { dataset, files, loading, error } = useDatasetMetadata(studyId);
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'protocols' | 'publications'>('overview');

  function useState<T>(init: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    return React.useState<T>(init);
  }

  if (loading) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-sm font-semibold text-slate-300">Retrieving NASA OSDR Study Metadata...</h3>
        <p className="text-xs text-slate-500 font-mono">Accession: {studyId}</p>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-3">
        <h3 className="text-base font-bold text-rose-300">Study Metadata Retrieval Failed</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{error || 'Study not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
        >
          Return to Dataset Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar with Back and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studies</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(dataset.studyId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isComparing
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              {isComparing ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>In Comparison</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>+ Add to Compare</span>
                </>
              )}
            </button>
          )}

          <a
            href={dataset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-colors"
          >
            <span>Official NASA OSDR Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Title Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold px-3 py-1 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/40">
            {dataset.studyId}
          </span>
          <StatusBadge type="population" value={dataset.studyType} />
          <StatusBadge type="provenance" value={dataset.provenance} />
        </div>

        <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 leading-snug">
          {dataset.title}
        </h1>

        {/* Quick Metadata Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Organism</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{dataset.organism}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-855">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Mission Platform</span>
            <span className="font-semibold text-slate-200 mt-0.5 block truncate">{dataset.mission || 'Spaceflight'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Primary Domain</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{dataset.primaryDomain}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Public Release</span>
            <span className="font-semibold text-slate-200 mt-0.5 block font-mono">{dataset.publicReleaseDate || 'Historical'}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Study Abstract & Factors
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'files'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Repository Files ({files.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('protocols')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'protocols'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Experimental Protocols ({dataset.protocols?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('publications')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'publications'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Peer-Reviewed Publications ({dataset.publications?.length || 0})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Research Abstract & Objectives
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-850">
              {dataset.description}
            </p>
          </div>

          {/* Factors */}
          {dataset.factors && dataset.factors.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Study Experimental Factors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dataset.factors.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{f.name}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">{f.type}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{f.value || 'Defined in protocol'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'files' && (
        <DatasetFileExplorer studyId={dataset.studyId} files={files} />
      )}

      {activeTab === 'protocols' && (
        <div className="space-y-3">
          {dataset.protocols?.map((p, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">{p.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'publications' && (
        <div className="space-y-3">
          {dataset.publications?.map((pub, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-200">{pub.title}</h4>
              <div className="text-xs text-slate-400">{pub.authors}</div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                {pub.journal && <span>{pub.journal} ({pub.year})</span>}
                {pub.pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    PubMed: {pub.pmid}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
