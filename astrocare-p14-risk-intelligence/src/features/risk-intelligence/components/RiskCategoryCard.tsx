import React from 'react';
import { 
  Zap, 
  HeartPulse, 
  ShieldAlert, 
  Activity, 
  Shield, 
  Moon, 
  Users, 
  Eye, 
  ChevronRight, 
  FileText, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { RiskCategory } from '../types/risk.types';

interface RiskCategoryCardProps {
  category: RiskCategory;
  onSelect: (category: RiskCategory) => void;
  onNavigateDetail?: (route: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  HeartPulse,
  ShieldAlert,
  Activity,
  Shield,
  Moon,
  Users,
  Eye
};

export const RiskCategoryCard: React.FC<RiskCategoryCardProps> = ({
  category,
  onSelect,
  onNavigateDetail
}) => {
  const IconComponent = ICON_MAP[category.iconName] || ShieldAlert;

  const getRouteForCategory = (code: string) => {
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
  };

  return (
    <div 
      className="bg-space-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-cyan-950/20"
      style={{ borderLeftColor: category.accentColor, borderLeftWidth: '4px' }}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-lg border flex items-center justify-center"
              style={{ backgroundColor: `${category.accentColor}15`, borderColor: `${category.accentColor}40` }}
            >
              <IconComponent className="w-5 h-5" style={{ color: category.accentColor }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-slate-700/60">
                  {category.code}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {category.primaryHrpCategory}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mt-0.5">
                {category.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
          {category.shortDescription}
        </p>

        {/* Affected Systems Pills */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Affected Physiological Systems
          </div>
          <div className="flex flex-wrap gap-1.5">
            {category.physiologicalSystem.map((sys, idx) => (
              <span 
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-space-800/80 text-slate-300 border border-slate-700/50"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>

        {/* Key Mechanisms Preview */}
        <div className="mb-4 bg-space-950/60 p-2.5 rounded-lg border border-slate-800/70 text-xs">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Primary Biological Driver
          </div>
          <div className="text-slate-200 font-medium text-xs truncate">
            {category.mechanisms[0]?.name || 'Mechanisms documented'}
          </div>
        </div>

        {/* Evidence & Countermeasure Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-800/80 text-slate-400">
          <div>
            <span className="text-slate-200 font-semibold font-mono">{category.evidenceQualitySummary.astronautStudiesCount}</span> human flight studies
          </div>
          <div>
            <span className="text-slate-200 font-semibold font-mono">{category.mitigationIds.length}</span> documented countermeasures
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        <a 
          href={category.hrpRiskUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          NASA HRP Roadmap <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(category)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 transition-colors flex items-center gap-1 border border-slate-700/60"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Quick View
          </button>
          {onNavigateDetail && (
            <button
              onClick={() => onNavigateDetail(getRouteForCategory(category.code))}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-medium transition-colors flex items-center gap-1 border border-cyan-800/60"
            >
              Deep Dive <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
