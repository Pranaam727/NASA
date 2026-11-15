// AstroCare P11 — NASA Research Explorer Page

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Tag,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import type { NasaResearchEntry, ResearchCategory } from '../types';
import { formatDate } from '../utils';
import {
  Card,
  SectionHeader,
  Button,
  LoadingState,
  ErrorState,
  EmptyState,
  DisclaimerBanner,
  DataOriginTag,
  NasaSourceLink,
} from '../components/shared';
import { useAsyncData } from '../hooks';
import {
  getNasaResearchEntries,
  filterResearchByCategory,
  filterResearchByQuery,
} from '../services/nasa/nasaResearchService';

const ALL_CATEGORIES: { id: ResearchCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Domains' },
  { id: 'SLEEP', label: 'Sleep Health' },
  { id: 'CIRCADIAN', label: 'Circadian Desynchrony' },
  { id: 'BEHAVIORAL_HEALTH', label: 'Behavioral Health' },
  { id: 'COGNITIVE_PERFORMANCE', label: 'Cognitive Performance' },
  { id: 'ISOLATION', label: 'Isolation & Confinement' },
  { id: 'TEAM_COHESION', label: 'Team Cohesion' },
  { id: 'HUMAN_FACTORS', label: 'Human Factors' },
];

export function NasaResearchPage() {
  const { data: entries, status, error, refetch } = useAsyncData<NasaResearchEntry[]>(
    getNasaResearchEntries,
    []
  );

  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    let list = entries;
    if (selectedCategory !== 'ALL') {
      list = filterResearchByCategory(list, [selectedCategory]);
    }
    if (searchQuery.trim()) {
      list = filterResearchByQuery(list, searchQuery);
    }
    return list;
  }, [entries, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <DisclaimerBanner />

      {/* Scientific Authenticity Notice */}
      <div className="rounded-xl border border-[#3d2600] bg-[#1a1200] p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#8fa3be] space-y-1">
          <p className="font-semibold text-[#f59e0b]">Official NASA Research Integration & Provenance</p>
          <p>
            All citations, risk definitions, and task summaries in this explorer link directly to official NASA Human
            Research Program (HRP), Human Research Roadmap (HRR), and Open Science Data Repository (OSDR) endpoints.
            Source metadata is verified and cached locally so this tool functions fully in offline mission scenarios.
          </p>
        </div>
      </div>

      {/* Title & Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8edf5] tracking-tight">NASA Human Research Program Explorer</h1>
          <p className="text-xs text-[#8fa3be] mt-1">
            Curated evidence repository for spaceflight behavioral, circadian, cognitive, and interpersonal risks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataOriginTag origin="NASA_RESEARCH" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0f1520] border border-[#1e2a3a] p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#4a6080] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NASA studies by keywords, task ID, or physiological domain..."
            className="w-full bg-[#0a0d14] border border-[#1e2a3a] rounded-lg pl-9 pr-4 py-2 text-xs text-[#e8edf5] placeholder-[#4a6080] focus:border-[#3b82f6] focus:outline-none"
          />
        </div>
        <div className="text-xs text-[#8fa3be] flex-shrink-0 pr-2">
          Showing <strong className="text-[#e8edf5]">{filteredEntries.length}</strong> verified entries
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a]'
                  : 'bg-[#131924] text-[#8fa3be] border border-[#1e2a3a] hover:bg-[#19202f] hover:text-[#e8edf5]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {status === 'loading' && <LoadingState message="Querying verified NASA research repository..." />}
      {status === 'error' && <ErrorState message={error || 'Failed to load research metadata'} onRetry={refetch} />}

      {status === 'success' && (
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <EmptyState message="No NASA research entries matched your active search query or filter." />
          ) : (
            filteredEntries.map((entry) => {
              const isExpanded = expandedCardId === entry.id;
              return (
                <Card key={entry.id} className="border border-[#1e2a3a] space-y-4 hover:border-[#2a3a52] transition-colors">
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#f59e0b] bg-[#3d2600] px-2 py-0.5 rounded uppercase">
                          {entry.source}
                        </span>
                        {entry.studyIdentifier && (
                          <span className="text-[10px] text-[#3b82f6] bg-[#1e3a5f] px-2 py-0.5 rounded font-mono">
                            {entry.studyIdentifier}
                          </span>
                        )}
                        {entry.categories.map((c) => (
                          <span key={c} className="text-[10px] text-[#8fa3be] bg-[#1e2a3a] px-2 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-base font-bold text-[#e8edf5] leading-snug">{entry.title}</h2>
                    </div>

                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e3a5f] text-[#3b82f6] text-xs font-semibold hover:bg-[#2a4a7a] transition-colors flex-shrink-0"
                    >
                      <span>Open NASA Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs text-[#8fa3be] leading-relaxed">{entry.description}</p>

                  {/* Key Findings Bullet List */}
                  {entry.keyFindings && entry.keyFindings.length > 0 && (
                    <div className="p-3 rounded-lg bg-[#0a0d14] border border-[#1e2a3a] space-y-2">
                      <p className="text-[11px] font-semibold text-[#e8edf5]">Key Research Findings & Operational Takeaways:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[#8fa3be]">
                        {(isExpanded ? entry.keyFindings : entry.keyFindings.slice(0, 3)).map((finding, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {finding}
                          </li>
                        ))}
                      </ul>
                      {entry.keyFindings.length > 3 && (
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="text-[11px] text-[#3b82f6] hover:underline flex items-center gap-1 mt-1 font-semibold"
                        >
                          {isExpanded ? (
                            <>
                              <span>Show fewer findings</span>
                              <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              <span>Show all {entry.keyFindings.length} findings</span>
                              <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Footer Meta */}
                  <div className="pt-2 border-t border-[#1e2a3a] flex flex-wrap items-center justify-between text-[11px] text-[#4a6080] gap-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-[#4a6080]" />
                      <span>{entry.tags.join(' · ')}</span>
                    </div>
                    <div>
                      <span>Source Metadata Verified: {formatDate(entry.retrievedAt)}</span>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
