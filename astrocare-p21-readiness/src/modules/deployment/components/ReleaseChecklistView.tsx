// ============================================================================
// AstroCare Module J: Final Release Checklist & Report Generator View
// Tracks release criteria across 10 mission domains with interactive toggles and blocker audits.
// ============================================================================

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Filter, 
  ShieldAlert, 
  Download,
  Edit3,
  Save,
  Clock
} from 'lucide-react';
import { ReleaseChecklistItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface ReleaseChecklistViewProps {
  items: ReleaseChecklistItem[];
  onToggleItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onOpenReportModal: () => void;
}

export const ReleaseChecklistView: React.FC<ReleaseChecklistViewProps> = ({
  items,
  onToggleItem,
  onUpdateNotes,
  onOpenReportModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const categories = Array.from(new Set(items.map(i => i.category)));

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(i => i.category === selectedCategory);

  const completedCount = items.filter(i => i.completed).length;
  const blockersCount = items.filter(i => i.isBlocker && !i.completed).length;

  const startEditNotes = (item: ReleaseChecklistItem) => {
    setEditingId(item.id);
    setTempNotes(item.notes);
  };

  const saveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              MISSION READINESS GATE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Completed: {completedCount} / {items.length} ({Math.round((completedCount / items.length) * 100)}%)
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Final Release Verification Checklist & Mission Report Center
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Official operational release gating. Items marked as critical blockers must be resolved before sign-off. Generates audit reports in Markdown, JSON, and CSV.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Export Deployment Report</span>
        </button>
      </div>

      {/* Blocker Banner */}
      {blockersCount > 0 ? (
        <div className="bg-rose-950/40 border border-rose-800/80 p-4 rounded-xl flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="text-rose-400 font-bold block mb-0.5">
              {blockersCount} Mission Blocker(s) Unresolved:
            </span>
            Platform cannot be marked as production candidate while critical blockers remain unverified.
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="text-emerald-400 font-bold block mb-0.5">
              Zero Active Release Blockers:
            </span>
            All gating criteria for Hackathon Demonstration and Staging Deployment are satisfied.
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-cyan-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Domains ({items.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Items Table */}
      <div className="space-y-3">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.completed
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-slate-900 border-amber-800/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleItem(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      item.priority === 'critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.priority}
                    </span>
                    {item.isBlocker && !item.completed && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                        BLOCKER
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm font-bold ${item.completed ? 'text-white' : 'text-amber-200'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Notes & verification timestamp */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 w-full mt-1">
                        <input
                          type="text"
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="bg-slate-950 border border-cyan-500 rounded px-2.5 py-1 text-xs text-white flex-1 font-mono focus:outline-none"
                        />
                        <button
                          onClick={() => saveNotes(item.id)}
                          className="px-2.5 py-1 text-xs bg-cyan-600 text-white rounded font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-slate-300 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                          Notes: {item.notes}
                        </span>
                        <button
                          onClick={() => startEditNotes(item)}
                          className="text-slate-500 hover:text-cyan-400 text-[11px]"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[10px] text-slate-500">
                {new Date(item.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
