import React, { useState } from 'react';
import { NASA_MITIGATION_STRATEGIES } from '../data/nasaMitigations';
import { MitigationCard } from '../components/MitigationCard';
import { 
  Wrench, 
  Search, 
  CheckCircle, 
  FlaskConical, 
  Lightbulb, 
  AlertCircle,
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';

interface MitigationStrategiesPageProps {
  onNavigate: (route: string) => void;
}

export const MitigationStrategiesPage: React.FC<MitigationStrategiesPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedReadiness, setSelectedReadiness] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  const filteredMitigations = NASA_MITIGATION_STRATEGIES.filter(mit => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matches = 
        mit.title.toLowerCase().includes(q) ||
        mit.scientificRationale.toLowerCase().includes(q) ||
        mit.protocolDescription.toLowerCase().includes(q) ||
        mit.code.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (selectedCategory !== 'ALL' && mit.category !== selectedCategory) return false;
    if (selectedReadiness !== 'ALL' && mit.readiness !== selectedReadiness) return false;
    if (selectedRisk !== 'ALL' && !mit.targetRiskIds.includes(selectedRisk)) return false;

    return true;
  });

  const operationalCount = NASA_MITIGATION_STRATEGIES.filter(m => m.readiness === 'OPERATIONAL').length;
  const analogCount = NASA_MITIGATION_STRATEGIES.filter(m => m.readiness === 'VALIDATED_ANALOG').length;
  const researchCount = NASA_MITIGATION_STRATEGIES.filter(m => m.readiness === 'ADVANCED_RESEARCH').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Biomedical Countermeasures & Mitigation Strategies
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            NASA Human Health Countermeasures (HHC) and behavioral interventions engineered to offset physiological degradation, bone mineral loss, muscle atrophy, cardiovascular deconditioning, and space radiation risks.
          </p>
        </div>

        {/* Readiness Breakdown Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{operationalCount} Flight Operational</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-medium flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{analogCount} Analog Validated</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-medium flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{researchCount} Advanced R&D</span>
          </div>
        </div>
      </div>

      {/* Mandatory Aerospace Ethics Notice */}
      <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100">Residual Risk Precaution:</strong> Countermeasures mitigate physiological deconditioning and delay symptom onset, but <em>do not completely eliminate human health risks</em>. For instance, heavy resistance exercise on ARED preserves gross cortical bone mass but fails to stop trabecular microarchitectural deterioration.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-space-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search countermeasures by name, protocol, hardware (ARED, CEVIS, SSLA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Readiness Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Readiness:</label>
          <select
            value={selectedReadiness}
            onChange={(e) => setSelectedReadiness(e.target.value)}
            className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Readiness Levels</option>
            <option value="OPERATIONAL">Flight Operational Standard</option>
            <option value="VALIDATED_ANALOG">Ground/Bed-Rest Validated</option>
            <option value="ADVANCED_RESEARCH">Advanced Research</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Type:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Modalities</option>
            <option value="PHYSICAL_EXERCISE">Physical Exercise (ARED, CEVIS)</option>
            <option value="ENVIRONMENTAL_ENGINEERING">Environmental Engineering</option>
            <option value="NUTRITIONAL">Nutritional & Supplements</option>
            <option value="PHARMACOLOGICAL">Pharmacological</option>
            <option value="MONITORING_SURVEILLANCE">Surveillance & Dosimetry</option>
            <option value="BEHAVIORAL_PSYCHOLOGICAL">Behavioral & Psychosocial</option>
          </select>
        </div>

        {/* Target Domain */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Domain:</label>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-space-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Domains</option>
            <option value="RAD">RAD - Space Radiation</option>
            <option value="CARDIO">CARDIO - Cardiovascular</option>
            <option value="BONE">BONE - Bone Loss</option>
            <option value="MUSCLE">MUSCLE - Muscle Atrophy</option>
            <option value="SANS">SANS - Neuro-Ocular</option>
            <option value="SLEEP">SLEEP - Sleep & Circadian</option>
            <option value="BEHAVIOR">BEHAVIOR - Behavioral Health</option>
            <option value="IMMUNE">IMMUNE - Immune System</option>
          </select>
        </div>

        {/* Reset */}
        {(search || selectedCategory !== 'ALL' || selectedReadiness !== 'ALL' || selectedRisk !== 'ALL') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setSelectedReadiness('ALL');
              setSelectedRisk('ALL');
            }}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Grid of Mitigations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMitigations.map(mit => (
          <MitigationCard
            key={mit.id}
            mitigation={mit}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMitigations.length === 0 && (
        <div className="text-center py-12 bg-space-900 border border-slate-800 rounded-xl space-y-2">
          <Wrench className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No matching mitigation strategies</h3>
          <p className="text-xs text-slate-500">Try broadening your search or resetting the modality and readiness filters.</p>
        </div>
      )}

    </div>
  );
};
