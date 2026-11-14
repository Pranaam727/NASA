import React, { useState } from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { FollowUpChecklistItem as IFollowUpChecklistItem, FollowUpPriority } from '../types/aiTypes';
import { CheckSquare, Square, Plus } from 'lucide-react';

interface FollowUpChecklistProps {
  items: IFollowUpChecklistItem[];
  onToggleItem: (item: IFollowUpChecklistItem) => void;
  onAddItem: (investigationId: string, desc: string, priority: FollowUpPriority) => void;
  investigationId?: string;
}

export const FollowUpChecklist: React.FC<FollowUpChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  investigationId = 'INV-GENERAL',
}) => {
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<FollowUpPriority>('MEDIUM');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    onAddItem(investigationId, newDesc.trim(), newPriority);
    setNewDesc('');
  };

  const getPriorityBadge = (p: FollowUpPriority) => {
    switch (p) {
      case 'URGENT':
        return 'bg-astro-status-critical/15 text-astro-status-critical border-astro-status-critical/30';
      case 'HIGH':
        return 'bg-astro-status-warning/15 text-astro-status-warning border-astro-status-warning/30';
      case 'MEDIUM':
        return 'bg-astro-blue/15 text-astro-blue border-astro-blue/30';
      default:
        return 'bg-astro-bg-subtle text-astro-text-secondary border-astro-border-hairline';
    }
  };

  return (
    <div className="space-y-6">
      <DossierCard
        title="CLINICAL FOLLOW-UP & MEDICAL PROTOCOL CHECKLIST"
        subtitle="Authoritative surveillance actions and doctor verification directives"
        action={
          <span className="font-mono text-xs text-astro-text-secondary">
            {items.filter((i) => i.status === 'COMPLETED').length} / {items.length} COMPLETED
          </span>
        }
      >
        <div className="space-y-5">
          {/* Add Item Row */}
          <form onSubmit={handleAdd} className="flex gap-2 font-mono text-xs">
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Add flight surgeon protocol or monitoring action..."
              className="flex-1 bg-astro-bg-surface border border-astro-border-hairline rounded-sm px-3 py-1.5 text-astro-text-primary outline-none focus:border-astro-sage font-body"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as FollowUpPriority)}
              className="bg-astro-bg-surface border border-astro-border-hairline rounded-sm px-2.5 py-1.5 text-astro-text-primary outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <button
              type="submit"
              className="flex items-center space-x-1 px-3 py-1.5 bg-astro-sage/20 border border-astro-sage text-astro-text-primary font-bold rounded-sm hover:bg-astro-sage/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          </form>

          {/* List Items */}
          {items.length === 0 ? (
            <div className="p-6 bg-astro-bg-surface border border-astro-border-hairline rounded-sm text-center text-xs font-body text-astro-text-secondary">
              No follow-up action items logged. Initiate a clinical investigation to generate AI-suggested follow-ups.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                return (
                  <div
                    key={item.itemId}
                    onClick={() => onToggleItem(item)}
                    className={`p-3 rounded-sm border flex items-center justify-between cursor-pointer transition-colors ${
                      isCompleted
                        ? 'bg-astro-bg-surface/40 border-astro-border-hairline opacity-60'
                        : 'bg-astro-bg-surface border-astro-border-hairline hover:border-astro-border'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-astro-status-healthy shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-astro-text-secondary shrink-0" />
                      )}
                      <div>
                        <span
                          className={`text-xs font-body ${
                            isCompleted ? 'line-through text-astro-text-secondary' : 'text-astro-text-primary'
                          }`}
                        >
                          {item.description}
                        </span>
                        {item.notes && (
                          <span className="block text-[10px] font-mono text-astro-text-secondary mt-0.5">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase font-bold ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DossierCard>
    </div>
  );
};
