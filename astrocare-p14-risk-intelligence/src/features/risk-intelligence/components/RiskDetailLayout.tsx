import React, { useState } from 'react';
import { RiskCategory } from '../types/risk.types';
import { ResearchEvidence } from '../types/evidence.types';
import { MitigationStrategy } from '../types/mitigation.types';
import { EvidenceCard } from './EvidenceCard';
import { EvidenceDetailPanel } from './EvidenceDetailPanel';
import { MitigationCard } from './MitigationCard';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldAlert, 
  Layers, 
  Dna, 
  Rocket, 
  Wrench, 
  BookOpen, 
  AlertTriangle,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

interface RiskDetailLayoutProps {
  category: RiskCategory;
  evidence: ResearchEvidence[];
  mitigations: MitigationStrategy[];
  onNavigateBack: () => void;
  onNavigateOtherCategory?: (route: string) => void;
  additionalSections?: React.ReactNode;
}

export const RiskDetailLayout: React.FC<RiskDetailLayoutProps> = ({
  category,
  evidence,
  mitigations,
  onNavigateBack,
  onNavigateOtherCategory,
  additionalSections
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<ResearchEvidence | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanisms' | 'evidence' | 'mitigations' | 'limitations'>('overview');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onNavigateBack}
          className="text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Risk Categories
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-space-800 text-cyan-300 border border-slate-700">
            {category.code}
          </span>
          <a
            href={category.hrpRiskUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            NASA Roadmap Risk Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Hero Header */}
      <div 
        className="bg-space-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden"
        style={{ borderLeftColor: category.accentColor, borderLeftWidth: '6px' }}
      >
        <div className="max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-space-800 text-slate-300 border border-slate-700">
              {category.primaryHrpCategory}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {evidence.length} Indexed Evidence Records
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            {category.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {category.fullDescription}
          </p>

          {/* Affected Systems Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400">Affected Physiological Systems:</span>
            {category.physiologicalSystem.map((sys, idx) => (
              <span 
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-space-800/90 text-cyan-300 border border-cyan-800/40 font-medium"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'overview' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Overview & Health Effects
        </button>
        <button
          onClick={() => setActiveTab('mechanisms')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'mechanisms' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Biological Mechanisms ({category.mechanisms.length})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'evidence' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. NASA Research Evidence ({evidence.length})
        </button>
        <button
          onClick={() => setActiveTab('mitigations')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'mitigations' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Known Countermeasures ({mitigations.length})
        </button>
        <button
          onClick={() => setActiveTab('limitations')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'limitations' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          5. Evidence Quality & Limitations
        </button>
      </div>

      {/* Tab 1: Overview & Effects */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Potential Health Effects & Vulnerabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Potential Effects on Astronaut Health
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {category.keyVulnerabilities.map((vuln, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-violet-400" /> Severity Escalation Drivers
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {category.severityFactors.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Mission Relevance Across Exploration Architectures */}
          <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-400" /> Mission Relevance Across Exploration Architectures
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Low Earth Orbit (ISS)
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {category.missionRelevance.leo}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Lunar Artemis Gateway
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {category.missionRelevance.lunar}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Mars Conjunction Mission
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {category.missionRelevance.mars}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-violet-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" /> Deep Space Habitats
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {category.missionRelevance.deepSpace}
                </p>
              </div>

            </div>
          </div>

          {/* Any page-specific deep dive components */}
          {additionalSections}

        </div>
      )}

      {/* Tab 2: Biological Mechanisms */}
      {activeTab === 'mechanisms' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-300">
            <strong>Subcellular Pathophysiology:</strong> Aerospace medical understanding of how the spaceflight environment disrupts homeostasis at the molecular, cellular, and organ levels.
          </div>

          <div className="space-y-4">
            {category.mechanisms.map((mech, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300">
                    <Dna className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {mech.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {mech.description}
                </p>

                {mech.cellularPathway && (
                  <div className="p-3 rounded-lg bg-space-950 border border-slate-800 text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold block mb-0.5">Cellular Pathway & Signaling Cascade:</span>
                    <span className="text-slate-200 font-mono text-[11px]">{mech.cellularPathway}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Primary Biophysical Drivers:</span>
                  {mech.primaryDrivers.map((driver, dIdx) => (
                    <span key={dIdx} className="px-2 py-0.5 rounded bg-space-800 text-slate-300 text-[11px] border border-slate-700">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: NASA Research Evidence */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>Indexed NASA Human Research Program Studies for {category.code}</span>
            <span className="font-mono text-cyan-400">{evidence.length} studies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map(ev => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                onOpenDetails={(e) => setSelectedEvidence(e)}
              />
            ))}
          </div>

          {evidence.length === 0 && (
            <div className="text-center py-10 bg-space-900 border border-slate-800 rounded-xl">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No specific evidence records linked to this category code.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Known Countermeasures */}
      {activeTab === 'mitigations' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-300">
            <strong>Operational Flight Rules & Research Protocols:</strong> Established engineering, nutritional, and physical exercise countermeasures designed to mitigate risks in this category. Note that no countermeasure completely eliminates risk.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitigations.map(mit => (
              <MitigationCard
                key={mit.id}
                mitigation={mit}
              />
            ))}
          </div>

          {mitigations.length === 0 && (
            <div className="text-center py-10 bg-space-900 border border-slate-800 rounded-xl">
              <Wrench className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Countermeasures currently under active HRP roadmap formulation.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Evidence Quality & Limitations */}
      {activeTab === 'limitations' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-space-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" /> Evidence Interpretation & Quality Framework
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Astronaut Studies</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {category.evidenceQualitySummary.astronautStudiesCount}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ground Analogs</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">
                  {category.evidenceQualitySummary.groundAnalogCount}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Animal Studies</span>
                <span className="text-lg font-bold text-violet-400 font-mono">
                  {category.evidenceQualitySummary.animalStudiesCount}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-space-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cell Culture</span>
                <span className="text-lg font-bold text-amber-400 font-mono">
                  {category.evidenceQualitySummary.cellModelCount}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="text-cyan-400 font-semibold block mb-1">Scientific Certainty Assessment Basis:</span>
              {category.evidenceQualitySummary.overallCertaintyBasis}
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300">Methodological Generalizability Caveats:</strong> Human spaceflight studies operate under unavoidable sample size constraints (typically n = 6 to 34 per investigation) due to the limited number of astronauts flying long-duration orbital missions. Data is predominantly gathered in Low Earth Orbit (LEO) with active geomagnetic shielding, and must be responsibly interpreted when modeling unshielded deep-space Mars missions.
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over / Modal Evidence Detail Panel */}
      <EvidenceDetailPanel
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

    </div>
  );
};
