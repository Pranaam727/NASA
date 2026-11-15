import React, { useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface ResearchItem {
  id: string;
  category: 'HRP Evidence' | 'OSDR Multi-Omics' | 'Radiation Dosimetry' | 'Human Twin Study';
  title: string;
  source: string;
  doiOrUrl: string;
  summary: string;
  relevanceToAstroCare: string;
  provenance: 'NASA HRP' | 'NASA OSDR' | 'SCIENCE' | 'NASA TECHNICAL REPORT';
}

const RESEARCH_DATA: ResearchItem[] = [
  {
    id: 'twin-study',
    category: 'Human Twin Study',
    title: 'The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight',
    source: 'Garrett-Bakelman et al., Science 364(6436), eaau8650 (2019)',
    doiOrUrl: 'https://doi.org/10.1126/science.aau8650',
    summary:
      'Comprehensive multi-omic assessment of identical twin astronauts (Scott and Mark Kelly) across a 340-day ISS mission. Observed telomere elongation during spaceflight with rapid post-flight shortening, immune activation, and carotid artery intimal-medial thickening.',
    relevanceToAstroCare:
      'Directly informs AstroCare’s multi-axis biometric correlation engine and longitudinal post-flight recovery modeling.',
    provenance: 'SCIENCE',
  },
  {
    id: 'hrp-radiation',
    category: 'Radiation Dosimetry',
    title: 'Risk of Radiation Carcinogenesis and Degenerative Tissue Pathologies',
    source: 'NASA Human Research Program Human Research Roadmap (HRR) Evidence Report',
    doiOrUrl: 'https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=100',
    summary:
      'Quantifies cancer risks from high-energy galactic cosmic rays (HZE ions) and SPE protons, formalizing permissible career exposure limits (PEL = 600 mSv) across age and gender cohorts.',
    relevanceToAstroCare:
      'AstroCare’s Radiation Intelligence module implements the exact Beer-Lambert aluminum shielding mass attenuation formulas and PEL tracking models established in this document.',
    provenance: 'NASA HRP',
  },
  {
    id: 'osdr-multiomics',
    category: 'OSDR Multi-Omics',
    title: 'NASA Open Science Data Repository (OSDR) Transcriptomic Archives',
    source: 'NASA OSDR Studies OSD-379, OSD-120, OSD-253',
    doiOrUrl: 'https://osdr.nasa.gov/bio/repo/',
    summary:
      'Open science transcriptomic, proteomic, and epigenetic datasets collected from spaceflown rodent and human tissue assays showing mitochondrial dysfunction and oxidative phosphorylation downregulation.',
    relevanceToAstroCare:
      'Underpins AstroCare’s simulated molecular health indicators and mitochondrial metabolic stress index.',
    provenance: 'NASA OSDR',
  },
  {
    id: 'hrp-sans',
    category: 'HRP Evidence',
    title: 'Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS)',
    source: 'NASA Human Research Program Evidence Book (2020 Revision)',
    doiOrUrl: 'https://humanresearchroadmap.nasa.gov/evidence/reports/SANS.pdf',
    summary:
      'Details the pathophysiology of optic disc edema, globe flattening, choroidal folds, and hyperopic shifts driven by cephalad venous engorgement and elevated intracranial pressure.',
    relevanceToAstroCare:
      'Shapes the symptom triaging rules inside AstroCare’s Clinical Reasoning Copilot for cephalad fluid redistribution warnings.',
    provenance: 'NASA TECHNICAL REPORT',
  },
];

export const ScienceSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = ['ALL', 'HRP Evidence', 'OSDR Multi-Omics', 'Radiation Dosimetry', 'Human Twin Study'];

  const filteredItems =
    filter === 'ALL'
      ? RESEARCH_DATA
      : RESEARCH_DATA.filter((item) => item.category === filter);

  return (
    <section id="science" className="relative py-28 bg-[#05070B] overflow-hidden border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/20">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
              PEER-REVIEWED SCIENTIFIC PROVENANCE
            </span>
          </div>

          <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            BUILT AROUND
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-iceBlue to-ultraviolet">
              SPACEFLIGHT SCIENCE.
            </span>
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            AstroCare links health assessment algorithms directly to authoritative space medicine
            literature, NASA open data repositories, and documented physiological research.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                filter === cat
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-glowCyan'
                  : 'glass-panel-subtle border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Research Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((paper) => (
            <div
              key={paper.id}
              className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/25 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-semibold">
                    {paper.provenance}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{paper.category}</span>
                </div>

                <h3 className="text-lg font-space font-bold text-white leading-snug">
                  {paper.title}
                </h3>

                <div className="text-xs font-mono text-slate-400 italic">{paper.source}</div>

                <p className="text-slate-300 text-sm leading-relaxed">{paper.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">
                    ASTROCARE INTEGRATION:
                  </span>
                  {paper.relevanceToAstroCare}
                </div>

                <div className="flex justify-end">
                  <a
                    href={paper.doiOrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Inspect Publication / DOI</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer on Provenance */}
        <div className="mt-12 text-center text-xs font-mono text-slate-400 max-w-2xl mx-auto">
          Notice: Scientific papers and NASA databases cited above represent open scientific
          literature. AstroCare is an independent research platform and does not claim official
          endorsement or certification by NASA.
        </div>
      </div>
    </section>
  );
};
