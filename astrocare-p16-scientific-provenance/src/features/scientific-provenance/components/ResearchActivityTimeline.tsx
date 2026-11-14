import React, { useState } from 'react'
import {
  Clock,
  Database,
  BookmarkCheck,
  FileCheck2,
  ShieldCheck,
  Quote,
  RotateCcw,
  User,
  Info,
  Search,
} from 'lucide-react'
import { ActivityRecord, AuditAction } from '../types/audit.types'

interface ResearchActivityTimelineProps {
  logs: ActivityRecord[]
  onClearLogs?: () => void
}

export const ResearchActivityTimeline: React.FC<ResearchActivityTimelineProps> = ({
  logs,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>('all')

  const filteredLogs = logs.filter((log) => {
    if (selectedAction !== 'all' && log.action !== selectedAction) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim()
      const inDesc = log.description.toLowerCase().includes(q)
      const inActor = log.actor.toLowerCase().includes(q)
      const inRecord = log.affectedRecordId.toLowerCase().includes(q)
      if (!inDesc && !inActor && !inRecord) return false
    }
    return true
  })

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'source_created':
      case 'source_updated':
      case 'source_deleted':
        return <Database className="w-3.5 h-3.5 text-astro-cyan" />
      case 'claim_created':
      case 'claim_updated':
      case 'claim_deleted':
        return <BookmarkCheck className="w-3.5 h-3.5 text-astro-violet" />
      case 'evidence_linked':
      case 'evidence_unlinked':
        return <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
      case 'validation_run':
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
      case 'citation_exported':
        return <Quote className="w-3.5 h-3.5 text-astro-sky" />
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Disclaimer / Notice */}
      <div className="p-4 rounded-lg bg-astro-card border border-astro-border text-xs text-slate-300 space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
          <Info className="w-4 h-4 text-astro-cyan" />
          Demonstration Audit Trail Architecture Notice
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          This local activity log records research additions, source edits, evidence linkages, and validation checks. In production deployment, AstroCare integrates with an immutable cryptographic audit ledger for tamper-evident regulatory compliance.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit records..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 focus:outline-none focus:border-astro-cyan/50 font-mono"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value as any)}
          className="bg-astro-darkest border border-astro-border rounded px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-astro-cyan/50"
        >
          <option value="all">All Audit Actions</option>
          <option value="source_created">Source Created</option>
          <option value="source_updated">Source Updated</option>
          <option value="claim_created">Claim Created</option>
          <option value="claim_updated">Claim Updated</option>
          <option value="evidence_linked">Evidence Linked</option>
          <option value="validation_run">Validation Run</option>
          <option value="status_changed">Status Changed</option>
        </select>
      </div>

      {/* Timeline List */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-5 shadow-sm space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No audit records match the current filter.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-astro-border">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group text-xs">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-astro-card border border-astro-border flex items-center justify-center group-hover:border-astro-cyan transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-astro-cyan" />
                </div>

                <div className="p-3.5 rounded-lg bg-astro-card/50 hover:bg-astro-card border border-astro-border/60 transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-astro-darkest border border-astro-border">
                        {getActionIcon(log.action)}
                      </span>
                      <span className="font-mono text-slate-200 font-semibold uppercase text-[11px]">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-[10px] text-astro-cyan">
                        [{log.affectedRecordId}]
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{log.actor}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
