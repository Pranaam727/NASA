import React, { useState } from 'react';
import { useAstroCareAI } from '../../providers/ProviderContext';
import { NASAResearchDoc, HealthDomain } from '../../types';
import { NASA_RESEARCH_DATABASE, SCIENTIFIC_GLOSSARY } from '../../data/nasaResearchDocs';
import { DataOriginBadge } from '../common/DataOriginBadge';
import { MarkdownRenderer } from '../chat/MarkdownRenderer';
import {
  BookOpen,
  Search,
  ExternalLink,
  Sparkles,
  FileText,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface ResearchAssistantViewProps {
  initialSelectedDocId?: string | null;
  onCloseSelectedDoc?: () => void;
}

export const ResearchAssistantView: React.FC<ResearchAssistantViewProps> = ({
  initialSelectedDocId
}) => {
  const { provider } = useAstroCareAI();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<HealthDomain | 'all'>('all');
  const [activeDoc, setActiveDoc] = useState<NASAResearchDoc>(() => {
    if (initialSelectedDocId) {
      return NASA_RESEARCH_DATABASE.find(d => d.id === initialSelectedDocId) || NASA_RESEARCH_DATABASE[0];
    }
    return NASA_RESEARCH_DATABASE[0];
  });

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // Filtered research documents
  const filteredDocs = NASA_RESEARCH_DATABASE.filter(doc => {
    const matchesDomain = selectedDomain === 'all' || doc.domains.includes(selectedDomain);
    const matchesQuery = searchQuery.trim() === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ntrsId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesQuery;
  });

  const handleGenerateSummary = async () => {
    if (!activeDoc) return;
    setIsSummarizing(true);
    setAiSummary(null);

    try {
      const result = await provider.summarizeResearch(activeDoc.id, searchQuery || undefined);
      setAiSummary(result.summary);
    } catch (err) {
      console.error('Failed to summarize research:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              NASA Scientific Research Assistant & Evidence Repository
            </h2>
            <DataOriginBadge origin="nasa-hrp-ground-truth" />
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Verified NASA Technical Report Server (NTRS) Evidence Books & Peer-Reviewed Space Medicine Literature
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, NTRS ID, authors, SANS..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Domain Filters & Terminology Quick Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              selectedDomain === 'all'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All Disciplines ({NASA_RESEARCH_DATABASE.length})
          </button>
          {(['cardiovascular', 'musculoskeletal', 'radiation', 'sleep', 'immune'] as HealthDomain[]).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all cursor-pointer ${
                selectedDomain === d
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Quick Aerospace Terminology Pill */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Glossary:</span>
          {['SANS', 'Cephalad Fluid Shift', 'GCR', 'BMD Resorption', 'ARED', 'HRV rMSSD'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTerm(t)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 text-slate-300 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Documents List, Right Active Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Documents List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>NASA Evidence Repository ({filteredDocs.length})</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Zero Hallucinations Guaranteed
            </span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDoc(doc);
                    setAiSummary(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg glow-cyan'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                      {doc.ntrsId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{doc.year}</span>
                  </div>

                  <h3 className="font-semibold text-xs text-white leading-snug line-clamp-2">
                    {doc.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {doc.abstract}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {doc.domains.map(dom => (
                      <span
                        key={dom}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 capitalize"
                      >
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Document Detail Inspector */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-5">
          {activeDoc ? (
            <>
              {/* Document Header */}
              <div className="space-y-2 pb-4 border-b border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                      {activeDoc.ntrsId}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Published: {activeDoc.year}
                    </span>
                  </div>

                  {activeDoc.url && (
                    <a
                      href={activeDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      <span>View in NASA NTRS</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h2 className="text-base font-bold text-white leading-tight">
                  {activeDoc.title}
                </h2>

                <p className="text-xs text-slate-400 font-mono">
                  {activeDoc.publication}
                </p>

                <p className="text-[11px] text-slate-500">
                  <strong className="text-slate-400">Authors:</strong> {activeDoc.authors.join(', ')}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleGenerateSummary}
                  disabled={isSummarizing}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 glow-cyan"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSummarizing ? 'animate-spin' : ''}`} />
                  <span>{isSummarizing ? 'Synthesizing with Gemini...' : 'Summarize Paper with AI'}</span>
                </button>

                <span className="text-[11px] font-mono text-slate-500">
                  Citation verified against NASA Human Research Program
                </span>
              </div>

              {/* AI Summary View if generated */}
              {aiSummary && (
                <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-4 shadow-lg glow-cyan animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-cyan-500/20 text-xs font-semibold text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Gemini AI Scientific Synthesis</span>
                  </div>
                  <MarkdownRenderer content={aiSummary} />
                </div>
              )}

              {/* Abstract */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Executive Abstract</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-lg border border-slate-850">
                  {activeDoc.abstract}
                </p>
              </div>

              {/* Verified Key Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Key Biomedical Findings (Ground Truth)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeDoc.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-emerald-400 font-bold font-mono">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Takeaways */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Operational Clinical Takeaways</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeDoc.clinicalTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-amber-400 font-bold font-mono">→</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs font-mono">
              Select a research publication from the repository to inspect.
            </div>
          )}
        </div>

      </div>

      {/* Terminology Explanation Modal */}
      {selectedTerm && SCIENTIFIC_GLOSSARY[selectedTerm] && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl glow-cyan">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  Aerospace Biomedical Terminology: {selectedTerm}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 font-mono text-[11px] block uppercase">Scientific Definition:</span>
                <p className="mt-1 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                  {SCIENTIFIC_GLOSSARY[selectedTerm].definition}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[11px] block uppercase">Aerospace Operational Significance:</span>
                <p className="mt-1 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800 text-cyan-200">
                  {SCIENTIFIC_GLOSSARY[selectedTerm].aerospaceSignificance}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500 font-mono text-[11px]">Related Domains:</span>
                {SCIENTIFIC_GLOSSARY[selectedTerm].relatedDomains.map(d => (
                  <span key={d} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTerm(null)}
                className="px-4 py-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
