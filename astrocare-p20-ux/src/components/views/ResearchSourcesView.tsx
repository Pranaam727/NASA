import React, { useState } from 'react';
import { ResearchSource, HealthDomain } from '../../types/contracts';
import { ScientificSourceBadge } from '../common/ScientificSourceBadge';
import { Database, ShieldCheck, ExternalLink, Search, Lock, BookOpen } from 'lucide-react';
import { CARD_SURFACE, FOCUS_RING } from '../../design-system/utils';

interface ResearchSourcesViewProps {
  sources: ResearchSource[];
  onSelectSource: (source: ResearchSource) => void;
}

export const ResearchSourcesView: React.FC<ResearchSourcesViewProps> = ({
  sources,
  onSelectSource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<HealthDomain | 'all'>('all');

  const filteredSources = sources.filter(s => {
    const matchesDomain = selectedDomain === 'all' || s.supportedDomains.includes(selectedDomain);
    const matchesSearch = searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studyIdentifier && s.studyIdentifier.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white">
              Official NASA Scientific Research & Provenance Catalog
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified NASA Ground Truth
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Primary research foundation incorporating NASA Human Research Program, Open Science Data Repository (OSDR), and NLSP evidence reports.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NASA studies, OSDR ID, SANS..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-sans text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDomain('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            selectedDomain === 'all'
              ? 'bg-cyan-600 text-white font-bold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Domains ({sources.length})
        </button>
        {(['cardiovascular', 'musculoskeletal', 'radiation', 'sleep', 'immune', 'behavioral'] as HealthDomain[]).map(d => (
          <button
            key={d}
            onClick={() => setSelectedDomain(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
              selectedDomain === d
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((source) => {
          const isRestricted = source.dataAccessClassification === 'controlled-access-restricted';

          return (
            <div
              key={source.id}
              onClick={() => onSelectSource(source)}
              className={`rounded-2xl p-5 cursor-pointer transition-all ${CARD_SURFACE} hover:border-cyan-500/50 space-y-3 group`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30">
                    {source.studyIdentifier || source.publishingOrganization}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {source.researchCategory}
                  </span>
                </div>

                <div className="text-[10px] font-mono">
                  {isRestricted ? (
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Lock className="w-3 h-3" /> Controlled Tier
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-medium">Open Science</span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 leading-snug">
                {source.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {source.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {source.supportedDomains.map(d => (
                  <span key={d} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 capitalize">
                    {d}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500">
                <span>{source.publishingOrganization}</span>
                <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:underline">
                  Inspect Record <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
