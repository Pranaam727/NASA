import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { Search, ExternalLink, BookOpen, Dna, Activity, Heart, Shield, Eye, X } from 'lucide-react';
import { RadiationResearchStudy } from '../types/radiationTypes';

interface NasaOsdrResearchExplorerProps {
  studies: RadiationResearchStudy[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedStudy: RadiationResearchStudy | null;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onSelectStudy: (study: RadiationResearchStudy | null) => void;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Studies', icon: BookOpen },
  { id: 'DNA_DAMAGE', label: 'DNA Repair & Mutagenesis', icon: Dna },
  { id: 'OXIDATIVE_STRESS', label: 'Oxidative Stress & Cellular', icon: Activity },
  { id: 'CARDIOVASCULAR_RISK', label: 'Endothelial & Cardio', icon: Heart },
  { id: 'CNS_EFFECTS', label: 'Neuro & Ocular (SANS)', icon: Eye },
  { id: 'COUNTERMEASURES', label: 'Shielding & Radioprotection', icon: Shield },
];

export const NasaOsdrResearchExplorer: React.FC<NasaOsdrResearchExplorerProps> = ({
  studies,
  isLoading,
  searchTerm,
  selectedCategory,
  selectedStudy,
  onSearchChange,
  onCategoryChange,
  onSelectStudy,
}) => {
  return (
    <DossierCard
      title="NASA Open Science Data Repository (OSDR) Research Explorer"
      subtitle="SPACE-BIOLOGY STUDIES // PEER-REVIEWED GENOMIC & CELLULAR RADIATION DATASETS"
      badge={
        <span className="font-mono text-xs text-astro-text-secondary">
          {studies.length} STUDIES FOUND
        </span>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-astro-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search studies (e.g. 'DNA repair', 'oxidative', 'cardio', '56Fe')..."
              className="w-full pl-9 pr-4 py-2 bg-[#F3F0E8] border border-astro-border-hairline rounded font-mono text-xs text-astro-ink placeholder:text-astro-text-secondary focus:outline-none focus:border-astro-ink"
            />
          </div>

          <a
            href="https://osdr.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EAE6DC] hover:bg-[#D8CBAF] transition-colors rounded text-xs font-mono text-astro-ink shrink-0"
          >
            <span>NASA OSDR Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  isSelected
                    ? 'bg-[#242824] text-[#F3F0E8] font-medium'
                    : 'bg-[#EAE6DC] text-astro-ink hover:bg-[#D8CBAF]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Study Cards Grid */}
        {isLoading ? (
          <div className="py-12 text-center font-mono text-xs text-astro-text-secondary">
            QUERYING NASA OSDR STUDY METADATA...
          </div>
        ) : studies.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-astro-text-secondary">
            NO NASA OSDR STUDIES FOUND MATCHING SEARCH CRITERIA.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studies.map((study) => (
              <div
                key={study.id}
                onClick={() => onSelectStudy(study)}
                className="p-3.5 bg-[#F3F0E8] hover:bg-[#EAE6DC]/60 border border-astro-border-hairline rounded cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-[#242824] text-[#F3F0E8] rounded font-mono text-[10px] font-bold">
                      {study.accessionNumber}
                    </span>
                    <span className="text-[10px] font-mono text-astro-text-secondary">
                      {study.publicationDate}
                    </span>
                  </div>

                  <h4 className="font-heading font-semibold text-xs text-astro-ink group-hover:text-[#D16C48] transition-colors line-clamp-2 leading-snug">
                    {study.title}
                  </h4>

                  <p className="font-body text-xs text-astro-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {study.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-astro-border-hairline text-[10px] font-mono text-astro-text-secondary">
                  <span>{study.organism}</span>
                  <span className="text-astro-status-healthy font-semibold">VIEW METADATA &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Study Detail Modal */}
        {selectedStudy && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#F3F0E8] border border-astro-border-hairline rounded-lg max-w-2xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => onSelectStudy(null)}
                className="absolute top-4 right-4 p-1 rounded hover:bg-[#EAE6DC] text-astro-text-secondary hover:text-astro-ink"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-[#242824] text-[#F3F0E8] font-mono text-xs font-bold rounded">
                  {selectedStudy.accessionNumber}
                </span>
                <span className="px-2 py-0.5 bg-[#EAE6DC] font-mono text-[11px] text-astro-ink rounded">
                  {selectedStudy.researchCategory}
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-astro-ink leading-snug mt-1">
                {selectedStudy.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 my-3 border-y border-astro-border-hairline text-xs font-mono">
                <div>
                  <span className="text-[10px] text-astro-text-secondary block">ORGANISM</span>
                  <span className="font-semibold text-astro-ink">{selectedStudy.organism}</span>
                </div>
                <div>
                  <span className="text-[10px] text-astro-text-secondary block">ASSAY TYPE</span>
                  <span className="font-semibold text-astro-ink">{selectedStudy.studyType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-astro-text-secondary block">RELEASE DATE</span>
                  <span className="font-semibold text-astro-ink">{selectedStudy.publicationDate}</span>
                </div>
              </div>

              <div className="space-y-3 font-body text-xs text-astro-ink leading-relaxed">
                <div>
                  <h5 className="font-heading font-semibold text-xs uppercase text-astro-text-secondary mb-1">
                    Study Overview & Scientific Rationale
                  </h5>
                  <p>{selectedStudy.description}</p>
                </div>

                {selectedStudy.metadata.radiationSource && (
                  <div>
                    <h5 className="font-heading font-semibold text-xs uppercase text-astro-text-secondary mb-1">
                      Radiation Field & Exposure Characteristics
                    </h5>
                    <p className="font-mono bg-[#EAE6DC]/60 p-2 rounded border border-astro-border-hairline">
                      {selectedStudy.metadata.radiationSource}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-astro-border-hairline">
                <span className="text-[10px] font-mono text-astro-text-secondary">
                  NASA OSDR Accession: {selectedStudy.accessionNumber}
                </span>

                <a
                  href={selectedStudy.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#242824] text-[#F3F0E8] rounded font-mono text-xs hover:bg-black transition-colors"
                >
                  <span>Open on NASA OSDR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </DossierCard>
  );
};
