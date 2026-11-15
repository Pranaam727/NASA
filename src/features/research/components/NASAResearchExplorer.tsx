import React, { useState } from 'react';
import { SEED_NASA_RESEARCH } from '@/data/seedData';
import { NASAResearchRecord } from '@/types/database.types';
import { DossierCard } from '@/components/common/DossierCard';
import {
  Search,
  ExternalLink,
  Database,
  Info,
} from 'lucide-react';

export const NASAResearchExplorer: React.FC = () => {
  const [researchList] = useState<NASAResearchRecord[]>(SEED_NASA_RESEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'CARDIOVASCULAR',
    'RADIATION',
    'NEURO_OCULAR',
    'IMMUNE',
    'MUSCULOSKELETAL',
    'BEHAVIORAL',
  ];

  const filtered = researchList.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.dataset_id && item.dataset_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'ALL' || item.health_category === selectedCategory;

    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-3.5 rounded-sm bg-astro-bg-subtle/80 border border-astro-border-hairline flex items-start space-x-3 text-xs text-astro-text-secondary">
        <Info className="w-4 h-4 text-astro-text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-astro-text-primary">PROVENANCE & CITATION NOTICE:</span> This
          repository connects live AstroCare biometric telemetry models to published, peer-reviewed spaceflight
          medicine research and open NASA datasets. AstroCare does not claim NASA endorsement or certification.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#57766D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NASA studies, DOIs, authors, or dataset IDs..."
            className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] placeholder:text-[#57766D] rounded-sm focus:outline-none focus:border-[#21E6D0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-mono rounded-sm border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#21E6D0] text-[#030A09] border-[#21E6D0] font-bold shadow-md'
                  : 'bg-[#06110F] text-[#8CA8A0] border-[rgba(55,210,185,0.2)] hover:border-[#21E6D0]/50 hover:text-[#E8F4F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Research Cards List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <DossierCard
            key={item.id}
            title={item.title}
            subtitle={`${item.program} // ${item.authors} (${item.publication_year})`}
            action={
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline text-astro-text-primary font-bold">
                {item.health_category}
              </span>
            }
          >
            <div className="space-y-3 pt-2">
              <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
                {item.abstract}
              </p>

              <div className="pt-2 border-t border-astro-border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center space-x-3 text-astro-text-tertiary">
                  {item.dataset_id && (
                    <span className="flex items-center space-x-1 text-astro-text-primary">
                      <Database className="w-3.5 h-3.5" />
                      <span>{item.dataset_id}</span>
                    </span>
                  )}
                  <span>Pub: {item.publication_year}</span>
                </div>

                <a
                  href={item.doi_or_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-astro-text-primary hover:underline font-semibold"
                >
                  <span>Official Research Portal / DOI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </DossierCard>
        ))}
      </div>
    </div>
  );
};
