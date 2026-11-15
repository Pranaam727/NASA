import React, { useState } from 'react';
import { AstronautProfile, CreateAstronautProfileInput } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AstronautProfileCard } from '../components/digital-twin/AstronautProfileCard';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { UserPlus, Download, RefreshCw, X, Check } from 'lucide-react';

interface AstronautProfilesPageProps {
  profiles: AstronautProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (input: CreateAstronautProfileInput) => void;
  onUpdateProfile: (id: string, updates: Partial<AstronautProfile>) => void;
  onDeleteProfile: (id: string) => void;
  onResetProfiles: () => void;
}

export const AstronautProfilesPage: React.FC<AstronautProfilesPageProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onResetProfiles,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formInput, setFormInput] = useState<CreateAstronautProfileInput>({
    displayName: '',
    codeName: '',
    role: '',
    missionId: 'ASTRA-VIII',
    missionName: 'Astra Exploration Simulation',
    missionType: 'LEO',
    missionPhase: 'Preflight',
    missionDay: -10,
    missionDurationDays: 180,
    age: 39,
    biologicalSex: 'Female',
    heightCm: 170,
    weightKg: 65,
    notes: 'Synthetic demonstration profile.',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.displayName) return;
    onCreateProfile(formInput);
    setShowCreateModal(false);
    // Reset form
    setFormInput({
      displayName: '',
      codeName: '',
      role: '',
      missionId: 'ASTRA-VIII',
      missionName: 'Astra Exploration Simulation',
      missionType: 'LEO',
      missionPhase: 'Preflight',
      missionDay: -10,
      missionDurationDays: 180,
      age: 39,
      biologicalSex: 'Female',
      heightCm: 170,
      weightKg: 65,
      notes: 'Synthetic demonstration profile.',
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `astrocare_profiles_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Astronaut Profile Management
            </h1>
            <Badge variant="cyan">{profiles.length} DEMO PROFILES</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Maintain and configure synthetic astronaut digital twin identities, baseline records, and mission phase parameters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportJson}
          >
            Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onResetProfiles}
          >
            Reset Demo Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Profile
          </Button>
        </div>
      </div>

      <DisclaimerNotice />

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((p) => (
          <AstronautProfileCard
            key={p.id}
            profile={p}
            isActive={p.id === activeProfileId}
            onSelect={() => onSelectProfile(p.id)}
            onDelete={profiles.length > 1 ? () => onDeleteProfile(p.id) : undefined}
          />
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                Create Synthetic Astronaut Profile
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Maya Patel"
                    value={formInput.displayName}
                    onChange={(e) => setFormInput({ ...formInput, displayName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Callsign / Codename</label>
                  <input
                    type="text"
                    placeholder="e.g. Aurora-5"
                    value={formInput.codeName}
                    onChange={(e) => setFormInput({ ...formInput, codeName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Role / Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Flight Surgeon / EVA"
                    value={formInput.role}
                    onChange={(e) => setFormInput({ ...formInput, role: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mission ID</label>
                  <input
                    type="text"
                    value={formInput.missionId}
                    onChange={(e) => setFormInput({ ...formInput, missionId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Mission Phase</label>
                  <select
                    value={formInput.missionPhase}
                    onChange={(e) => setFormInput({ ...formInput, missionPhase: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Preflight">Preflight</option>
                    <option value="Inflight">Inflight</option>
                    <option value="Postflight">Postflight</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Flight Day</label>
                  <input
                    type="number"
                    value={formInput.missionDay}
                    onChange={(e) => setFormInput({ ...formInput, missionDay: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={formInput.missionDurationDays}
                    onChange={(e) =>
                      setFormInput({ ...formInput, missionDurationDays: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={formInput.age || ''}
                    onChange={(e) => setFormInput({ ...formInput, age: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formInput.heightCm || ''}
                    onChange={(e) => setFormInput({ ...formInput, heightCm: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formInput.weightKg || ''}
                    onChange={(e) => setFormInput({ ...formInput, weightKg: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={<Check className="w-3.5 h-3.5" />}>
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
