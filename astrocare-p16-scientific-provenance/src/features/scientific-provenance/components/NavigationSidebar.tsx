import React from 'react'
import {
  Compass,
  Database,
  Satellite,
  Quote,
  FileCheck2,
  BookmarkCheck,
  GitBranch,
  FolderGit2,
  ShieldCheck,
  CopyCheck,
  Award,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

export type PageId =
  | 'overview'
  | 'sources'
  | 'nasa'
  | 'citations'
  | 'evidence'
  | 'claims'
  | 'insights'
  | 'datasets'
  | 'validation'
  | 'duplicates'
  | 'quality'
  | 'reports'
  | 'activity'

interface NavigationSidebarProps {
  currentPage: PageId
  onSelectPage: (page: PageId) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  unsupportedClaimsCount: number
  validationWarningsCount: number
}

interface NavItem {
  id: PageId
  label: string
  icon: React.ElementType
  badge?: number | string
  badgeVariant?: 'amber' | 'cyan' | 'violet'
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentPage,
  onSelectPage,
  isMobileOpen,
  onCloseMobile,
  unsupportedClaimsCount,
  validationWarningsCount,
}) => {
  const navItems: { section: string; items: NavItem[] }[] = [
    {
      section: 'CORE PROVENANCE',
      items: [
        { id: 'overview', label: 'Overview', icon: Compass },
        { id: 'sources', label: 'Scientific Sources', icon: Database },
        { id: 'nasa', label: 'NASA Research Discovery', icon: Satellite },
        { id: 'citations', label: 'Citation Explorer', icon: Quote },
      ],
    },
    {
      section: 'EVIDENCE & CLAIMS',
      items: [
        { id: 'evidence', label: 'Evidence Records', icon: FileCheck2 },
        {
          id: 'claims',
          label: 'Research Claims',
          icon: BookmarkCheck,
          badge: unsupportedClaimsCount > 0 ? `${unsupportedClaimsCount} unverified` : undefined,
          badgeVariant: 'amber',
        },
        { id: 'insights', label: 'Insight Provenance', icon: GitBranch },
        { id: 'datasets', label: 'Dataset Attribution', icon: FolderGit2 },
      ],
    },
    {
      section: 'INTEGRITY & QUALITY',
      items: [
        {
          id: 'validation',
          label: 'Source Validation',
          icon: ShieldCheck,
          badge: validationWarningsCount > 0 ? validationWarningsCount : undefined,
          badgeVariant: 'amber',
        },
        { id: 'duplicates', label: 'Duplicate Detection', icon: CopyCheck },
        { id: 'quality', label: 'Evidence Quality', icon: Award },
        { id: 'reports', label: 'Research Reports', icon: FileText },
        { id: 'activity', label: 'Audit History & Settings', icon: Clock },
      ],
    },
  ]

  const handleNavClick = (id: PageId) => {
    onSelectPage(id)
    onCloseMobile()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-astro-surface border-r border-astro-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-astro-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-astro-cyan/20 to-astro-blue/20 border border-astro-cyan/40 flex items-center justify-center text-astro-cyan shadow-sm glow-cyan-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-wider text-slate-100 uppercase">
                  AstroCare
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-astro-cyan/10 border border-astro-cyan/30 text-astro-cyan font-mono font-semibold">
                  P16
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Scientific Provenance & Citations
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group) => (
            <div key={group.section} className="space-y-1">
              <h4 className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
                {group.section}
              </h4>
              <nav className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-astro-card text-astro-cyan border border-astro-cyan/30 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-astro-card/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-astro-cyan'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                            item.badgeVariant === 'amber'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-astro-cyan/20 text-astro-cyan border border-astro-cyan/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer info: NASA verification link */}
        <div className="p-3 border-t border-astro-border bg-astro-darkest/60">
          <div className="p-2.5 rounded-md bg-astro-card border border-astro-border text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                NASA HRP Connected
              </span>
              <a
                href="https://humanresearchroadmap.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="text-astro-cyan hover:underline flex items-center gap-0.5"
                title="Open official NASA Human Research Roadmap"
              >
                Roadmap <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Evidence tracing calibrated to NASA Human Spaceflight Risk Portfolio standards.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
