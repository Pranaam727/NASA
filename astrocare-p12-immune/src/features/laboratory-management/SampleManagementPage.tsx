import React, { useState } from 'react';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { laboratoryService } from '../../services/laboratory/laboratoryService';
import {
  LaboratorySample,
  SampleType,
  SampleWorkflowStatus,
  StorageCondition,
} from '../../types';
import { StateBadge } from '../../components/shared/StateBadge';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Thermometer,
  MapPin,
  FlaskConical,
} from 'lucide-react';

export const SampleManagementPage: React.FC = () => {
  const { currentAstronaut, refreshData } = useAstroCareContext();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<SampleType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<SampleWorkflowStatus | 'ALL'>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedSample, setSelectedSample] = useState<LaboratorySample | null>(null);
  const [workflowUpdateModal, setWorkflowUpdateModal] = useState<LaboratorySample | null>(null);

  // New Sample Form State
  const [newSampleId, setNewSampleId] = useState<string>('');
  const [newSampleType, setNewSampleType] = useState<SampleType>('BLOOD');
  const [newVolume, setNewVolume] = useState<number>(5.0);
  const [newStorage, setNewStorage] = useState<StorageCondition>('CRYOPRESERVED_MINUS_80C');
  const [newLocation, setNewLocation] = useState<string>('MELFI-3 Dewar #2');
  const [newLab, setNewLab] = useState<string>('ISS Columbus Human Research Facility');
  const [newAssays, setNewAssays] = useState<string>('CBC, Flow Cytometry');
  const [newNotes, setNewNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Workflow update state
  const [nextStatus, setNextStatus] = useState<SampleWorkflowStatus>('PROCESSING');
  const [operatorName, setOperatorName] = useState<string>('Dr. Elena Rostova (Crew CMO)');
  const [workflowComment, setWorkflowComment] = useState<string>('Centrifuged and aliquoted.');

  const samples = laboratoryService.getSamples({
    astronautId: currentAstronaut.astronautId,
    sampleType: selectedType,
    workflowStatus: selectedStatus,
    searchTerm: searchTerm,
  });

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newSampleId.trim()) {
      setFormError('Sample ID is required.');
      return;
    }

    const res = laboratoryService.addSample({
      id: newSampleId.trim(),
      astronautId: currentAstronaut.astronautId,
      missionId: currentAstronaut.missionId,
      sampleType: newSampleType,
      collectionTimestamp: new Date().toISOString(),
      missionPhase: currentAstronaut.missionPhase,
      missionDay: currentAstronaut.missionElapsedDays,
      collectionStatus: 'SUCCESS',
      workflowStatus: 'COLLECTED',
      storageCondition: newStorage,
      storageLocation: newLocation,
      volumeMl: Number(newVolume),
      laboratory: newLab,
      associatedAssays: newAssays.split(',').map((a) => a.trim()).filter(Boolean),
      collectedBy: operatorName,
      notes: newNotes,
      source: 'ISS Onboard Phlebotomy & Sampling Kit',
      dataOrigin: 'SIMULATED',
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to add sample.');
      return;
    }

    setIsAddModalOpen(false);
    setNewSampleId('');
    setNewNotes('');
    refreshData();
  };

  const handleUpdateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowUpdateModal) return;

    laboratoryService.updateSampleWorkflow(
      workflowUpdateModal.id,
      nextStatus,
      operatorName,
      workflowComment
    );

    setWorkflowUpdateModal(null);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module D — Specimen Tracking
            </span>
            <DataOriginBadge origin="SIMULATED" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            Laboratory Biospecimen & Sample Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Longitudinal biological specimen workflow engine tracking collection integrity, cryogenic chain of custody,
            and analytical dispatch across Blood, Plasma, Serum, Saliva, and Urine fractions.
          </p>
        </div>

        {/* Action Button: Add New Demonstration Specimen */}
        <button
          onClick={() => {
            setNewSampleId(`SMP-2026-${Math.floor(100 + Math.random() * 900)}`);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-900/30 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Register Sample
        </button>
      </div>

      {/* Workflow Legend Strip */}
      <div className="bg-space-950 p-4 rounded-xl border border-space-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
          Standard Biospecimen Pipeline:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-slate-300">1. Scheduled</span>
          <span className="text-slate-600">→</span>
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-emerald-400">2. Collected</span>
          <span className="text-slate-600">→</span>
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-sky-400">3. In Transit</span>
          <span className="text-slate-600">→</span>
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-sky-400">4. Received</span>
          <span className="text-slate-600">→</span>
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-amber-400">5. Processing</span>
          <span className="text-slate-600">→</span>
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-emerald-300">6. Completed</span>
          <span className="text-slate-600">→</span>
          <span className="bg-space-900 px-2 py-0.5 rounded border border-space-800 text-slate-400">7. Archived</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Sample ID, laboratory, assay, or storage location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-space-950 border border-space-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-space-950 px-3 py-2 rounded-lg border border-space-800 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-space-900">All Types</option>
              <option value="BLOOD" className="bg-space-900">Blood (Whole)</option>
              <option value="SERUM" className="bg-space-900">Serum</option>
              <option value="PLASMA" className="bg-space-900">Plasma</option>
              <option value="SALIVA" className="bg-space-900">Saliva</option>
              <option value="URINE" className="bg-space-900">Urine</option>
            </select>
          </div>

          <div className="bg-space-950 px-3 py-2 rounded-lg border border-space-800 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-space-900">All Statuses</option>
              <option value="SCHEDULED" className="bg-space-900">Scheduled</option>
              <option value="COLLECTED" className="bg-space-900">Collected</option>
              <option value="IN_TRANSIT" className="bg-space-900">In Transit</option>
              <option value="PROCESSING" className="bg-space-900">Processing</option>
              <option value="ANALYSIS_COMPLETED" className="bg-space-900">Completed</option>
              <option value="ARCHIVED" className="bg-space-900">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            Registered Biospecimens ({samples.length} Records)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Astronaut: {currentAstronaut.name} ({currentAstronaut.astronautId})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Sample ID</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Volume</th>
                <th className="pb-2">Collection Date</th>
                <th className="pb-2">Mission Phase</th>
                <th className="pb-2">Workflow Status</th>
                <th className="pb-2">Storage Location</th>
                <th className="pb-2">Laboratory</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {samples.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No biological samples matching filter criteria.
                  </td>
                </tr>
              ) : (
                samples.map((s) => (
                  <tr key={s.id} className="hover:bg-space-850/50 transition">
                    <td className="py-3 font-bold text-cyan-300">{s.id}</td>
                    <td className="py-3 text-white font-medium">{s.sampleType}</td>
                    <td className="py-3 text-slate-300">{s.volumeMl} mL</td>
                    <td className="py-3 text-slate-400">{s.collectionTimestamp.replace('T', ' ').slice(0, 16)}</td>
                    <td className="py-3 text-slate-400">{s.missionPhase}</td>
                    <td className="py-3">
                      <StateBadge state={s.workflowStatus} size="sm" />
                    </td>
                    <td className="py-3 text-slate-300 truncate max-w-[150px]" title={s.storageLocation}>
                      {s.storageLocation}
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-[160px]" title={s.laboratory}>
                      {s.laboratory}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSample(s)}
                          className="px-2 py-1 rounded bg-space-800 hover:bg-space-700 text-slate-300 text-[11px] font-mono transition"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setWorkflowUpdateModal(s);
                            setNextStatus(s.workflowStatus);
                          }}
                          className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/70 text-cyan-300 text-[11px] font-mono transition"
                        >
                          Advance
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Sample Details & Custody History */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-900 border border-space-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSample(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                SPECIMEN CUSTODY LOG
              </span>
              <DataOriginBadge origin={selectedSample.dataOrigin} />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              Sample {selectedSample.id} — {selectedSample.sampleType}
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-6">
              Astronaut {selectedSample.astronautId} | {selectedSample.missionId} | Flight Day {selectedSample.missionDay}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-space-950 p-4 rounded-lg border border-space-800 text-xs font-mono mb-6">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Volume</span>
                <span className="font-bold text-white">{selectedSample.volumeMl} mL</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Storage Condition</span>
                <span className="font-bold text-cyan-300">{selectedSample.storageCondition.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Location</span>
                <span className="font-bold text-slate-300">{selectedSample.storageLocation}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Target Lab</span>
                <span className="font-bold text-slate-300">{selectedSample.laboratory}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Phlebotomist / Operator</span>
                <span className="font-bold text-slate-300">{selectedSample.collectedBy}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Workflow State</span>
                <StateBadge state={selectedSample.workflowStatus} size="sm" />
              </div>
            </div>

            {/* Associated Assays */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">Associated Assays</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedSample.associatedAssays.map((a, i) => (
                  <span
                    key={i}
                    className="bg-space-800 text-cyan-300 text-xs font-mono px-2.5 py-1 rounded border border-space-700"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Custody Chain Event History */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                <History className="w-4 h-4 text-cyan-400" />
                Chain of Custody & Workflow Audit Trail
              </h4>
              <div className="space-y-3 border-l-2 border-space-800 ml-2 pl-4 text-xs font-mono">
                {selectedSample.history.map((ev, index) => (
                  <div key={index} className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute -left-[21px] top-1" />
                    <div className="flex items-center gap-2">
                      <StateBadge state={ev.status} size="sm" />
                      <span className="text-slate-500 text-[11px]">{ev.timestamp.replace('T', ' ').slice(0, 16)}</span>
                    </div>
                    <p className="text-slate-300 mt-1 font-sans text-xs">{ev.comment}</p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Operator: {ev.operator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Advance Workflow Status */}
      {workflowUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateWorkflow}
            className="bg-space-900 border border-space-700 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setWorkflowUpdateModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white tracking-tight mb-1">
              Advance Sample Workflow
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Specimen: {workflowUpdateModal.id} ({workflowUpdateModal.sampleType})
            </p>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">New Workflow Stage</label>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as any)}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="COLLECTED">COLLECTED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT (Cold Stowage Return)</option>
                  <option value="RECEIVED">RECEIVED (Lab Delivery)</option>
                  <option value="PROCESSING">PROCESSING (Aliquoting/Staining)</option>
                  <option value="ANALYSIS_COMPLETED">ANALYSIS_COMPLETED (Downlinked)</option>
                  <option value="ARCHIVED">ARCHIVED (Cryo-Preserved)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operator Identifier</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Audit Log Comment</label>
                <textarea
                  value={workflowComment}
                  onChange={(e) => setWorkflowComment(e.target.value)}
                  rows={3}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Centrifuged in CHeCS, transferred to MELFI-3."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWorkflowUpdateModal(null)}
                  className="px-3 py-1.5 rounded bg-space-800 text-slate-300 hover:bg-space-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Commit Status
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Add New Demonstration Specimen */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSample}
            className="bg-space-900 border border-space-700 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white tracking-tight mb-1">
              Register New Biospecimen
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Simulated laboratory collection logging for {currentAstronaut.name}
            </p>

            {formError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-2.5 rounded text-xs font-mono mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Sample ID *</label>
                  <input
                    type="text"
                    value={newSampleId}
                    onChange={(e) => setNewSampleId(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. SMP-2026-099"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sample Type *</label>
                  <select
                    value={newSampleType}
                    onChange={(e) => setNewSampleType(e.target.value as any)}
                    className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="BLOOD">BLOOD (Whole)</option>
                    <option value="SERUM">SERUM</option>
                    <option value="PLASMA">PLASMA</option>
                    <option value="SALIVA">SALIVA</option>
                    <option value="URINE">URINE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Volume (mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newVolume}
                    onChange={(e) => setNewVolume(Number(e.target.value))}
                    className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Storage Condition</label>
                  <select
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value as any)}
                    className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRYOPRESERVED_MINUS_80C">-80°C Cryopreservation</option>
                    <option value="FROZEN_MINUS_20C">-20°C Frozen</option>
                    <option value="REFRIGERATED_4C">4°C Refrigerated</option>
                    <option value="ROOM_TEMPERATURE">Room Temperature</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Storage Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Laboratory</label>
                <input
                  type="text"
                  value={newLab}
                  onChange={(e) => setNewLab(e.target.value)}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Associated Assays (Comma-separated)</label>
                <input
                  type="text"
                  value={newAssays}
                  onChange={(e) => setNewAssays(e.target.value)}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Luminex 37-Plex, hs-CRP"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Field Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Collection condition, subject state, etc."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-space-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-space-800 text-slate-300 hover:bg-space-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Register Specimen
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
