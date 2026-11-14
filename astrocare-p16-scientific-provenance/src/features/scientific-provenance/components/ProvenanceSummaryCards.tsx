import React from 'react'
import {
  Database,
  Satellite,
  FolderGit2,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { PageId } from './NavigationSidebar'

interface ProvenanceSummaryCardsProps {
  totalSources: number
  nasaSourcesCount: number
  datasetReferencesCount: number
  totalClaims: number
  supportedClaimsCount: number
  missingSourceWarningsCount: number
  recentlyValidatedCount: number
  onNavigate: (page: PageId) => void
}

export const ProvenanceSummaryCards: React.FC<ProvenanceSummaryCardsProps> = ({
  totalSources,
  nasaSourcesCount,
  datasetReferencesCount,
  totalClaims,
  supportedClaimsCount,
  missingSourceWarningsCount,
  recentlyValidatedCount,
  onNavigate,
}) => {
  const cards = [
    {
      label: 'Registered Sources',
      value: totalSources,
      subtext: `${nasaSourcesCount} official NASA publications`,
      icon: Database,
      accent: 'border-astro-cyan/30 text-astro-cyan bg-astro-cyan/10',
      page: 'sources' as PageId,
    },
    {
      label: 'NASA Sources',
      value: nasaSourcesCount,
      subtext: 'HRP, NTRS & OSDR studies',
      icon: Satellite,
      accent: 'border-astro-blue/30 text-astro-blue bg-astro-blue/10',
      page: 'nasa' as PageId,
    },
    {
      label: 'OSDR Datasets',
      value: datasetReferencesCount,
      subtext: 'GeneLab & Ames open-science',
      icon: FolderGit2,
      accent: 'border-astro-sky/30 text-astro-sky bg-astro-sky/10',
      page: 'datasets' as PageId,
    },
    {
      label: 'Scientific Claims',
      value: totalClaims,
      subtext: `${supportedClaimsCount} fully supported`,
      icon: BookmarkCheck,
      accent: 'border-astro-violet/30 text-astro-violet bg-astro-violet/10',
      page: 'claims' as PageId,
    },
    {
      label: 'Evidence Coverage',
      value: totalClaims > 0 ? `${Math.round((supportedClaimsCount / totalClaims) * 100)}%` : '0%',
      subtext: `${supportedClaimsCount} of ${totalClaims} backed by sources`,
      icon: CheckCircle2,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      page: 'evidence' as PageId,
    },
    {
      label: 'Missing Sources',
      value: missingSourceWarningsCount,
      subtext: missingSourceWarningsCount > 0 ? 'Requires scientific review' : 'No orphans detected',
      icon: AlertTriangle,
      accent:
        missingSourceWarningsCount > 0
          ? 'border-amber-500/40 text-amber-400 bg-amber-500/10 animate-pulse'
          : 'border-slate-600/30 text-slate-400 bg-slate-800/10',
      page: 'claims' as PageId,
    },
    {
      label: 'Integrity Validations',
      value: recentlyValidatedCount,
      subtext: 'Format & duplicate verified',
      icon: ShieldCheck,
      accent: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
      page: 'validation' as PageId,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            onClick={() => onNavigate(card.page)}
            className="group cursor-pointer bg-astro-card hover:bg-astro-cardHover border border-astro-border hover:border-astro-borderLight rounded-lg p-3.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-md border flex items-center justify-center ${card.accent}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-slate-100 group-hover:text-astro-cyan transition-colors">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">{card.subtext}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
