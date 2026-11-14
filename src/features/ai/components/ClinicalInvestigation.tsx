import React, { useState } from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { ClinicalInvestigation as IClinicalInvestigation, VitalParameter } from '../types/aiTypes';
import { PlusCircle, ChevronRight } from 'lucide-react';

interface ClinicalInvestigationProps {
  investigations: IClinicalInvestigation[];
  selectedInvestigation: IClinicalInvestigation | null;
  onSelectInvestigation: (inv: IClinicalInvestigation) => void;
  onCreateInvestigation: (title: string, metric: VitalParameter, notes?: string) => Promise<any>;
}

export const ClinicalInvestigation: React.FC<ClinicalInvestigationProps> = ({
  investigations,
  selectedInvestigation,
  onSelectInvestigation,
  onCreateInvestigation,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMetric, setNewMetric] = useState<VitalParameter>('HEART_RATE');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateInvestigation(newTitle.trim(), newMetric, newNotes.trim());
      setShowCreateModal(false);
      setNewTitle('');
      setNewNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm font-bold text-astro-text-primary uppercase">
            Mission Clinical Investigations
          </h3>
          <p className="font-body text-xs text-astro-text-secondary">
            Structured physician diagnostic triage, case tracks, and automated evidence aggregation
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-astro-sage/20 border border-astro-sage text-astro-text-primary text-xs font-mono font-bold rounded-sm hover:bg-astro-sage/30 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>NEW INVESTIGATION</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="md:col-span-1 space-y-3">
          <div className="font-mono text-xs text-astro-text-secondary uppercase">
            Active Investigations ({investigations.length})
          </div>
          {investigations.length === 0 ? (
            <div className="p-4 bg-astro-bg-surface border border-astro-border-hairline rounded-sm text-xs font-body text-astro-text-secondary text-center">
              No investigations currently open for this astronaut. Click "New Investigation" to initiate case inquiry.
            </div>
          ) : (
            <div className="space-y-2">
              {investigations.map((inv) => {
                const isSelected = selectedInvestigation?.investigationId === inv.investigationId;
                return (
                  <div
                    key={inv.investigationId}
                    onClick={() => onSelectInvestigation(inv)}
                    className={`p-3 rounded-sm border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-astro-bg-subtle border-astro-sage shadow-sm'
                        : 'bg-astro-bg-surface border-astro-border-hairline hover:border-astro-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-astro-sage/10 text-astro-sage font-bold">
                        {inv.primaryMetric}
                      </span>
                      <span className="font-mono text-[9px] text-astro-text-secondary uppercase">
                        {inv.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-astro-text-primary mt-1.5 truncate">
                      {inv.title}
                    </div>
                    <div className="text-[10px] font-mono text-astro-text-secondary mt-1 flex items-center justify-between">
                      <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="md:col-span-2">
          {selectedInvestigation ? (
            <DossierCard
              title={selectedInvestigation.title}
              subtitle={`ID: ${selectedInvestigation.investigationId} | STATUS: ${selectedInvestigation.status}`}
              action={
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-astro-bg-subtle text-astro-text-primary border border-astro-border-hairline">
                  {selectedInvestigation.timeRange} WINDOW
                </span>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-astro-bg-subtle/40 rounded-sm border border-astro-border-hairline">
                    <span className="text-astro-text-secondary block text-[10px]">PRIMARY CHANNEL</span>
                    <span className="font-bold text-astro-text-primary mt-0.5 block">{selectedInvestigation.primaryMetric}</span>
                  </div>
                  <div className="p-2.5 bg-astro-bg-subtle/40 rounded-sm border border-astro-border-hairline">
                    <span className="text-astro-text-secondary block text-[10px]">REGISTERED AT</span>
                    <span className="text-astro-text-primary mt-0.5 block">{new Date(selectedInvestigation.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[11px] text-astro-text-secondary uppercase mb-1.5">
                    Clinical Notes & Hypothesis
                  </div>
                  <div className="p-3 bg-astro-bg-surface border border-astro-border-hairline rounded-sm text-xs font-body text-astro-text-primary leading-relaxed">
                    {selectedInvestigation.notes || 'No specific diagnostic hypothesis notes recorded by medical officer.'}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[11px] text-astro-text-secondary uppercase mb-1.5">
                    Associated Deterministic Alerts ({selectedInvestigation.relatedAlertIds.length})
                  </div>
                  {selectedInvestigation.relatedAlertIds.length === 0 ? (
                    <div className="text-xs font-body text-astro-text-secondary italic">
                      Zero direct rule triggers linked to this investigation track.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInvestigation.relatedAlertIds.map((altId) => (
                        <span
                          key={altId}
                          className="font-mono text-[10px] px-2 py-0.5 bg-astro-bg-subtle text-astro-status-warning border border-astro-border-hairline rounded-sm"
                        >
                          {altId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DossierCard>
          ) : (
            <div className="p-8 bg-astro-bg-surface border border-astro-border-hairline rounded-sm text-center text-xs font-body text-astro-text-secondary">
              Select an investigation to view case telemetry details or generate analytical reports.
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-astro-bg-card border border-astro-border-hairline rounded-sm max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-mono text-sm font-bold text-astro-text-primary uppercase">
              Initiate Clinical Investigation
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-astro-text-secondary block mb-1">Investigation Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Transient SpO2 Desaturation During EVA Drill"
                  className="w-full bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-2 text-astro-text-primary focus:border-astro-sage outline-none"
                />
              </div>

              <div>
                <label className="text-astro-text-secondary block mb-1">Primary Biometric Parameter</label>
                <select
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value as VitalParameter)}
                  className="w-full bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-2 text-astro-text-primary focus:border-astro-sage outline-none"
                >
                  <option value="HEART_RATE">Heart Rate (HR)</option>
                  <option value="SPO2">Blood Oxygen Saturation (SpO2)</option>
                  <option value="BLOOD_PRESSURE_SYS">Blood Pressure Systolic</option>
                  <option value="BLOOD_PRESSURE_DIA">Blood Pressure Diastolic</option>
                  <option value="CORE_TEMP">Core Temperature</option>
                  <option value="RESPIRATORY_RATE">Respiratory Rate</option>
                  <option value="RADIATION_FLUX">Radiation Flux</option>
                </select>
              </div>

              <div>
                <label className="text-astro-text-secondary block mb-1">Flight Surgeon Notes / Directives</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Clinical suspicions, potential environmental factors, sensor anomalies..."
                  className="w-full bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-2 text-astro-text-primary focus:border-astro-sage outline-none font-body"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-astro-border-hairline text-astro-text-secondary rounded-sm hover:bg-astro-bg-subtle"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-astro-sage/20 border border-astro-sage text-astro-text-primary font-bold rounded-sm hover:bg-astro-sage/30"
                >
                  {isSubmitting ? 'CREATING...' : 'CREATE TRACK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
