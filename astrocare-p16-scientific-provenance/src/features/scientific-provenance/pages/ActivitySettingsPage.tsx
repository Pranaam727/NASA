import React from 'react'
import { Clock, RotateCcw, ShieldCheck, Database, Info, Trash2 } from 'lucide-react'
import { ResearchActivityTimeline } from '../components/ResearchActivityTimeline'
import { useScientificProvenance } from '../context/ScientificProvenanceContext'

export const ActivitySettingsPage: React.FC = () => {
  const { auditLog, resetToDefaults, sources, claims, evidence, datasets } = useScientificProvenance()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-astro-cyan font-bold">AUDIT-SETTINGS-12</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-astro-card border border-astro-border font-mono text-slate-300">
            Local Demonstration Trail
          </span>
        </div>
        <h1 className="text-lg font-bold text-slate-100">
          Research Activity Audit Trail & Prototype Settings
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Complete operational log of source registrations, metadata edits, claim creation, and validation events. For this standalone prototype, changes are persisted in browser LocalStorage.
        </p>
      </div>

      {/* Database State and Reset Action */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-mono">
          <Database className="w-4 h-4 text-astro-cyan" />
          Demonstration Repository State & Maintenance
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-astro-card border border-astro-border">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Sources In Store</span>
            <span className="text-lg font-mono font-bold text-astro-cyan">{sources.length}</span>
          </div>
          <div className="p-3 rounded bg-astro-card border border-astro-border">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Claims In Store</span>
            <span className="text-lg font-mono font-bold text-astro-violet">{claims.length}</span>
          </div>
          <div className="p-3 rounded bg-astro-card border border-astro-border">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Evidence Records</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{evidence.length}</span>
          </div>
          <div className="p-3 rounded bg-astro-card border border-astro-border">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">OSDR Datasets</span>
            <span className="text-lg font-mono font-bold text-teal-400">{datasets.length}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-astro-border">
          <p className="text-[11px] text-slate-400">
            Resetting clears local additions and restores authentic NASA baseline records.
          </p>

          <button
            onClick={() => {
              if (window.confirm('Reset all repositories back to authentic default NASA baseline?')) {
                resetToDefaults()
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-mono font-medium transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Authentic Baseline</span>
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <ResearchActivityTimeline logs={auditLog} />
    </div>
  )
}
