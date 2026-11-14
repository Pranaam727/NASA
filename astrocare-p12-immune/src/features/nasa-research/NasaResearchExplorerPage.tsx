import React, { useState } from 'react';
import { nasaResearchService } from '../../services/nasa/nasaResearchService';
import { NASAResearchRecord, StudyCategory, ResearchTopic } from '../../types';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  Database,
  Search,
  Filter,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Info,
  ShieldCheck,
  AlertTriangle,
  X,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

export const NasaResearchExplorerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | 'ALL'>('ALL');
  const [savedOnly, setSavedOnly] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'OSDR_DATASETS' | 'NASA_RESOURCES'>('OSDR_DATASETS');
  const [detailDataset, setDetailDataset] = useState<NASAResearchRecord | null>(null);

  const datasets = nasaResearchService.getDatasets({
    category: selectedCategory,
    topic: selectedTopic,
    searchTerm: searchTerm,
    savedOnly: savedOnly,
  });

  const officialResources = nasaResearchService.getOfficialResources();

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    nasaResearchService.toggleSaveDataset(id);
    // Force re-render
    setDetailDataset((prev) => (prev ? { ...prev } : null));
  };

  const getCategoryBadgeClass = (category: StudyCategory) => {
    switch (category) {
      case 'HUMAN_ASTRONAUT_RESEARCH':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'HUMAN_CELL_MODEL':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/80';
      case 'ANIMAL_MODEL':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'IN_VITRO_RESEARCH':
        return 'bg-sky-950/80 text-sky-300 border-sky-800/80';
      case 'TECHNICAL_REPORT':
      case 'ROADMAP_RISK_GAP':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module I — NASA OSDR & Open Science Discovery
            </span>
            <DataOriginBadge origin="NASA_RESEARCH" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            NASA Open Science Data Repository (OSDR) Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Curated metadata catalogue connecting AstroCare P12 telemetry with authentic NASA flight investigations,
            cell-model radiation biology assays, and animal models from the NASA Open Science Data Repository.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-space-800 font-mono text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('OSDR_DATASETS')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'OSDR_DATASETS'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            OSDR Studies ({datasets.length})
          </button>
          <button
            onClick={() => setActiveTab('NASA_RESOURCES')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'NASA_RESOURCES'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NASA Programs ({officialResources.length})
          </button>
        </div>
      </div>

      {/* Model System Classification Guardrail */}
      <div className="bg-space-950/80 border border-space-800 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed font-mono">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold uppercase block mb-1">
            Biological Model System Distinctions (Mandatory Scientific Guardrail)
          </strong>
          <span className="text-slate-300 font-sans">
            Never conflate biological models. Datasets in this explorer are explicitly partitioned:
            <strong className="text-emerald-300"> Human Astronaut Research</strong> represents actual crew specimens (e.g. OSD-575 Inspiration4, OSD-53 ISS);
            <strong className="text-purple-300"> Human Cell Models</strong> (e.g. OSD-2 lymphoblastoid culture) represent in-vitro cell lines exposed to particle beams;
            <strong className="text-amber-300"> Animal Models</strong> (e.g. OSD-4 murine thymus) represent rodent flight biology.
          </span>
        </div>
      </div>

      {activeTab === 'OSDR_DATASETS' ? (
        <>
          {/* Filters & Search Strip */}
          <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search OSDR studies by identifier (e.g. OSD-575), organism, assay, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-space-950 border border-space-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-space-950 px-2.5 py-1.5 rounded-lg border border-space-800 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase">Model:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-space-900">All Model Types</option>
                  <option value="HUMAN_ASTRONAUT_RESEARCH" className="bg-space-900">Human Astronaut Data</option>
                  <option value="HUMAN_CELL_MODEL" className="bg-space-900">Human Cell Model</option>
                  <option value="ANIMAL_MODEL" className="bg-space-900">Animal Model</option>
                  <option value="IN_VITRO_RESEARCH" className="bg-space-900">In-Vitro Challenge</option>
                </select>
              </div>

              <div className="bg-space-950 px-2.5 py-1.5 rounded-lg border border-space-800 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase">Topic:</span>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-space-900">All Topics</option>
                  <option value="CYTOKINE_ARRAY" className="bg-space-900">Cytokine Array</option>
                  <option value="IMMUNE_CELL_PROFILING" className="bg-space-900">Immune Cell Profiling</option>
                  <option value="GENE_EXPRESSION" className="bg-space-900">Gene Expression</option>
                  <option value="RADIATION_IMMUNOLOGY" className="bg-space-900">Radiation Immunology</option>
                  <option value="INFLAMMATION" className="bg-space-900">Inflammation</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 ml-1">
                <input
                  type="checkbox"
                  checked={savedOnly}
                  onChange={(e) => setSavedOnly(e.target.checked)}
                  className="rounded border-space-700 bg-space-950 text-cyan-500 focus:ring-0"
                />
                <span>Saved</span>
              </label>
            </div>
          </div>

          {/* Dataset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasets.map((dataset) => {
              const isSaved = nasaResearchService.isSaved(dataset.id);
              return (
                <div
                  key={dataset.id}
                  onClick={() => setDetailDataset(dataset)}
                  className="bg-space-900 border border-space-800 hover:border-space-700 rounded-xl p-5 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top Strip */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded">
                          {dataset.studyIdentifier}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                            dataset.category
                          )}`}
                        >
                          {dataset.category.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleBookmark(dataset.id, e)}
                        title={isSaved ? 'Remove from saved' : 'Save dataset'}
                        className="text-slate-400 hover:text-cyan-400 transition"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight leading-snug mb-2">
                      {dataset.title}
                    </h3>

                    <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed mb-3">
                      {dataset.description}
                    </p>

                    <div className="space-y-1 text-xs font-mono text-slate-400">
                      <div>
                        <strong className="text-slate-300">Organism: </strong>
                        <span>{dataset.organism}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300">Sample: </strong>
                        <span>{dataset.sampleType}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300">Assay: </strong>
                        <span>{dataset.assayType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Strip */}
                  <div className="mt-4 pt-3 border-t border-space-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-slate-500">
                      Access: {dataset.dataAccessLevel.replace(/_/g, ' ')}
                    </span>
                    <a
                      href={dataset.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>OSDR Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* NASA Official Programs & Human Research Roadmap Resources List */
        <div className="space-y-4">
          {officialResources.map((res) => (
            <div
              key={res.id}
              className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                    {res.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{res.organization}</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{res.title}</h3>
                <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
                  {res.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.topics.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-space-950 text-cyan-300 px-2 py-0.5 rounded border border-space-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={res.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-space-950 hover:bg-space-800 text-cyan-400 border border-cyan-800/80 text-xs font-mono font-bold transition flex-shrink-0"
              >
                <span>Visit NASA Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Full OSDR Study Metadata Inspector */}
      {detailDataset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-900 border border-space-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailDataset(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded">
                {detailDataset.studyIdentifier}
              </span>
              <span
                className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                  detailDataset.category
                )}`}
              >
                {detailDataset.category.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-auto mr-8">
                Retrieved: {detailDataset.retrievalTimestamp.split('T')[0]}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              {detailDataset.title}
            </h3>

            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4 pb-3 border-b border-space-800">
              {detailDataset.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-space-950 p-4 rounded-lg border border-space-800 mb-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Biological Organism</span>
                <span className="font-bold text-white">{detailDataset.organism}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Tissue / Specimen Type</span>
                <span className="font-bold text-cyan-300">{detailDataset.sampleType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Analytical Assay</span>
                <span className="font-bold text-white">{detailDataset.assayType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Access Level</span>
                <span className="font-bold text-slate-300">{detailDataset.dataAccessLevel}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-cyan-300 font-mono uppercase text-[11px] block mb-1">
                  Spaceflight Mission Context
                </strong>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {detailDataset.experimentalContext}
                </p>
              </div>

              <div>
                <strong className="text-cyan-300 font-mono uppercase text-[11px] block mb-1">
                  Relevance to Astronaut Immune Health
                </strong>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {detailDataset.spaceflightRelevance}
                </p>
              </div>

              <div>
                <strong className="text-emerald-400 font-mono uppercase text-[11px] block mb-1">
                  Key Documented Findings
                </strong>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 font-sans">
                  {detailDataset.keyFindings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-space-950 p-3 rounded-lg border border-amber-900/50">
                <strong className="text-amber-400 font-mono uppercase text-[11px] block mb-1">
                  Scientific Caveats & Limitations
                </strong>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 font-sans">
                  {detailDataset.caveatsAndLimitations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-space-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[11px] truncate max-w-md" title={detailDataset.citation}>
                Citation: {detailDataset.citation}
              </span>
              <a
                href={detailDataset.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 transition flex-shrink-0"
              >
                <span>Open in NASA OSDR</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
