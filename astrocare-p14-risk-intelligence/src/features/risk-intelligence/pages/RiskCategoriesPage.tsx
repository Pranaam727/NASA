import React, { useState } from 'react';
import { NASA_RISK_CATEGORIES } from '../data/nasaRiskCategories';
import { RiskCategoryCard } from '../components/RiskCategoryCard';
import { RiskComparisonChart } from '../components/RiskComparisonChart';
import { RiskCategory } from '../types/risk.types';
import { 
  ShieldAlert, 
  Search, 
  Layers, 
  CheckSquare, 
  Square, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface RiskCategoriesPageProps {
  onNavigate: (route: string) => void;
}

export const RiskCategoriesPage: React.FC<RiskCategoriesPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(['RAD', 'CARDIO', 'BONE', 'SANS']);
  const [showComparison, setShowComparison] = useState(false);

  // Extract all unique physiological systems
  const allSystems = Array.from(
    new Set(NASA_RISK_CATEGORIES.flatMap(c => c.physiologicalSystem))
  );

  const filteredCategories = NASA_RISK_CATEGORIES.filter(cat => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matches = 
        cat.title.toLowerCase().includes(q) ||
        cat.code.toLowerCase().includes(q) ||
        cat.shortDescription.toLowerCase().includes(q) ||
        cat.physiologicalSystem.some(s => s.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (selectedSystem !== 'ALL') {
      if (!cat.physiologicalSystem.includes(selectedSystem as any)) return false;
    }

    return true;
  });

  const toggleCategorySelection = (code: string) => {
    if (selectedCategoryIds.includes(code)) {
      if (selectedCategoryIds.length > 2) {
        setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== code));
      }
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, code]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              NASA Human-Spaceflight Risk Categories
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Eight major biomedical risk domains identified by the NASA Human Research Program (HRP), characterizing microgravity adaptation, space radiation hazards, and planetary exploration stressors.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showComparison 
                ? 'bg-cyan-500 text-space-950 shadow-md shadow-cyan-500/20' 
                : 'bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            {showComparison ? 'Hide Comparison Panel' : `Compare Selected (${selectedCategoryIds.length})`}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-space-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search risk categories, physiological systems, mechanisms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* System Filter */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">System:</label>
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Systems ({allSystems.length})</option>
            {allSystems.map((sys, idx) => (
              <option key={idx} value={sys}>{sys}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {(search || selectedSystem !== 'ALL') && (
          <button
            onClick={() => { setSearch(''); setSelectedSystem('ALL'); }}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Comparison Selector Ribbon */}
      <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">Select domains to compare (min 2):</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {NASA_RISK_CATEGORIES.map(cat => {
            const isSelected = selectedCategoryIds.includes(cat.code);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategorySelection(cat.code)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 border ${
                  isSelected 
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700/80 font-semibold' 
                    : 'bg-space-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {isSelected ? <CheckSquare className="w-3 h-3 text-cyan-400" /> : <Square className="w-3 h-3 text-slate-500" />}
                {cat.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Comparison Panel (if expanded) */}
      {showComparison && (
        <div className="animate-in fade-in duration-200">
          <RiskComparisonChart categoryIds={selectedCategoryIds} />
        </div>
      )}

      {/* Risk Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.map(category => (
          <RiskCategoryCard
            key={category.id}
            category={category}
            onSelect={(cat) => onNavigate(getRouteForCode(cat.code))}
            onNavigateDetail={(route) => onNavigate(route)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-space-900 border border-slate-800 rounded-xl space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No matching risk categories</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or physiological system filter.</p>
        </div>
      )}

    </div>
  );
};

function getRouteForCode(code: string): string {
  switch (code) {
    case 'RAD': return '/risks/radiation';
    case 'CARDIO': return '/risks/cardiovascular';
    case 'BONE':
    case 'MUSCLE': return '/risks/bone-muscle';
    case 'IMMUNE': return '/risks/immune';
    case 'SLEEP':
    case 'BEHAVIOR': return '/risks/sleep-psychological';
    case 'SANS': return '/risks/vision-neurological';
    default: return '/risks/categories';
  }
}
