import React from 'react'
import {
  Menu,
  Search,
  PlusCircle,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react'
import { CitationStyle } from '../types/citation.types'

interface TopNavbarProps {
  onToggleMobileMenu: () => void
  globalSearchQuery: string
  onSearchChange: (query: string) => void
  currentCitationStyle: CitationStyle
  onSelectCitationStyle: (style: CitationStyle) => void
  onOpenAddSource: () => void
  onResetDefaults: () => void
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileMenu,
  globalSearchQuery,
  onSearchChange,
  currentCitationStyle,
  onSelectCitationStyle,
  onOpenAddSource,
  onResetDefaults,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-astro-surface/90 backdrop-blur-md border-b border-astro-border px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & breadcrumb/title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-astro-card border border-astro-border"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-astro-cyan font-semibold">ASTROCARE</span>
          <span>/</span>
          <span>RESEARCH INTELLIGENCE</span>
          <span>/</span>
          <span className="text-slate-200 font-medium">P16 SCIENTIFIC PROVENANCE</span>
        </div>
      </div>

      {/* Center: Global Filter / Search */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search verified publications, claims, DOIs, OSDR studies..."
            className="w-full pl-9 pr-3 py-1.5 bg-astro-darkest/70 border border-astro-border rounded-md text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-astro-cyan/60 focus:ring-1 focus:ring-astro-cyan/50 transition-all font-mono"
          />
          {globalSearchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white bg-astro-card px-1.5 py-0.5 rounded border border-astro-border"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Citation format fast switch */}
        <div className="hidden md:flex items-center bg-astro-darkest/70 border border-astro-border rounded-md p-0.5">
          <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-astro-cyan" />
            Style:
          </span>
          {(['apa', 'ieee', 'vancouver', 'harvard'] as CitationStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => onSelectCitationStyle(style)}
              className={`text-[11px] font-mono px-2 py-1 rounded transition-colors uppercase ${
                currentCitationStyle === style
                  ? 'bg-astro-cyan/20 text-astro-cyan font-bold border border-astro-cyan/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Add Source button */}
        <button
          onClick={onOpenAddSource}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-astro-cyan text-astro-darkest font-semibold text-xs hover:bg-cyan-300 transition-all shadow-sm glow-cyan-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Add Source</span>
        </button>

        {/* Reset Demo button */}
        <button
          onClick={onResetDefaults}
          title="Reset demonstration data to authentic NASA baseline"
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-astro-card border border-astro-border transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Integrity status pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Integrity Guard Active</span>
        </div>
      </div>
    </header>
  )
}
