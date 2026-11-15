import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useRole } from '@/context/RoleContext';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { SEED_LAB_BIOMARKERS } from '@/data/seedData';
import { LaboratoryBiomarker } from '@/types/database.types';
import { Plus, Info } from 'lucide-react';

export const LaboratoryPage: React.FC = () => {
  const { selectedAstronaut, currentRole } = useRole();
  const { enqueueSyncItem } = useOfflineSync();

  const [biomarkers, setBiomarkers] = useState<LaboratoryBiomarker[]>(SEED_LAB_BIOMARKERS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Biomarker Entry Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<LaboratoryBiomarker['category']>('IMMUNE');
  const [value, setValue] = useState<number>(0);
  const [unit, setUnit] = useState('pg/mL');
  const [refLow, setRefLow] = useState<number>(0);
  const [refHigh, setRefHigh] = useState<number>(10);
  const [instrument, setInstrument] = useState('Onboard Bio-Analyzer Cartridge');

  const handleAddBiomarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isAbnormal = value < refLow || value > refHigh;

    const newBio: LaboratoryBiomarker = {
      id: `lab-${Date.now()}`,
      astronaut_id: selectedAstronaut.id,
      biomarker_name: name,
      category,
      observed_value: value,
      unit,
      reference_low: refLow,
      reference_high: refHigh,
      collection_timestamp: new Date().toISOString(),
      is_abnormal: isAbnormal,
      source_instrument: instrument,
    };

    setBiomarkers([newBio, ...biomarkers]);
    enqueueSyncItem('LAB_RECORD', newBio as unknown as Record<string, unknown>);
    setShowAddModal(false);
    setName('');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Immune & Laboratory Intelligence"
        subtitle="Onboard biomedical micro-assays, cytokine shifts, and flight laboratory biomarkers"
        badge={<StatusIndicator status="NOMINAL" label="BIO-ANALYZER READY" />}
      />

      <div className="space-y-6">
        {/* Top Disclaimer */}
        <div className="p-3.5 rounded-sm bg-astro-bg-subtle/80 border border-astro-border-hairline flex items-start space-x-3 text-xs text-astro-text-secondary">
          <Info className="w-4 h-4 text-astro-text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-astro-text-primary">LABORATORY PROVENANCE NOTICE:</span> In-flight
            fingerstick and saliva immunoassays track spaceflight-induced T-cell suppression, latent viral reactivation,
            and microgravity cytokine bias. Values are referenced strictly against instrument-calibrated envelopes.
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs font-mono text-[#8CA8A0]">
            <span>Astronaut: <strong className="text-[#E8F4F0]">{selectedAstronaut.profile?.full_name}</strong></span>
            <span>|</span>
            <span>Total Assays: <strong className="text-[#21E6D0]">{biomarkers.length}</strong></span>
          </div>

          {currentRole === 'MEDICAL_OFFICER' && (
            <button
              type="button"
              onClick={() => setShowAddModal(!showAddModal)}
              className="px-4 py-2 bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-cyberGlow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>RECORD NEW ASSAY SAMPLE</span>
            </button>
          )}
        </div>

        {/* Modal / Form for adding biomarker */}
        {showAddModal && currentRole === 'MEDICAL_OFFICER' && (
          <form
            onSubmit={handleAddBiomarker}
            className="p-5 rounded-2xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.25)] space-y-4 shadow-cyberCard"
          >
            <span className="font-mono text-xs font-bold text-[#E8F4F0] uppercase block tracking-wider">
              LOG NEW LABORATORY SAMPLE ENTRY
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8CA8A0] block">
                  Biomarker Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interferon-gamma (IFN-γ)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8CA8A0] block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LaboratoryBiomarker['category'])}
                  className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none cursor-pointer"
                >
                  <option value="IMMUNE" className="bg-[#0A1715]">Immune Cytokine</option>
                  <option value="INFLAMMATORY" className="bg-[#0A1715]">Inflammatory</option>
                  <option value="METABOLIC" className="bg-[#0A1715]">Metabolic</option>
                  <option value="HEMATOLOGY" className="bg-[#0A1715]">Hematology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8CA8A0] block">
                  Observed Value & Unit
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-2/3 p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-1/3 p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8CA8A0] block">
                  Reference Range (Low - High)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={refLow}
                    onChange={(e) => setRefLow(Number(e.target.value))}
                    className="w-1/2 p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={refHigh}
                    onChange={(e) => setRefHigh(Number(e.target.value))}
                    className="w-1/2 p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-[#8CA8A0] block">
                  Source Instrument & Cartridge
                </label>
                <input
                  type="text"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-[#0A1715] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:border-[#21E6D0] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-mono border border-[rgba(55,210,185,0.2)] text-[#8CA8A0] hover:text-[#E8F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl font-bold shadow-cyberGlow"
              >
                Save Assay Record
              </button>
            </div>
          </form>
        )}

        {/* Biomarkers Table */}
        <DossierCard
          title="IN-FLIGHT BIOMARKER ASSAY RECORDS"
          subtitle="MICRO-FLUIDIC FLOW CYTOMETRY & IMMUNOASSAY ARCHIVE"
        >
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs font-mono border border-[rgba(55,210,185,0.18)] rounded-xl overflow-hidden">
              <thead className="bg-[#0A1715] text-[#8CA8A0] text-left">
                <tr>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">BIOMARKER</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">CATEGORY</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">OBSERVED VALUE</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">REFERENCE ENVELOPE</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">COLLECTION TIME</th>
                  <th className="p-3 border-b border-[rgba(55,210,185,0.18)]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(55,210,185,0.1)] bg-[#0D1E1A]">
                {biomarkers.map((bio) => (
                  <tr key={bio.id} className="hover:bg-[#10251F] transition-colors">
                    <td className="p-3 font-bold text-[#E8F4F0]">
                      {bio.biomarker_name}
                      <span className="block text-[9px] text-[#57766D] font-normal mt-0.5">
                        {bio.source_instrument}
                      </span>
                    </td>
                    <td className="p-3 text-[#8CA8A0]">{bio.category}</td>
                    <td className="p-3 font-bold text-[#E8F4F0]">
                      {bio.observed_value} {bio.unit}
                    </td>
                    <td className="p-3 text-[#8CA8A0]">
                      {bio.reference_low} – {bio.reference_high} {bio.unit}
                    </td>
                    <td className="p-3 text-[#57766D]">
                      {new Date(bio.collection_timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {bio.is_abnormal ? (
                        <span className="font-mono text-[9px] px-2.5 py-1 rounded-lg bg-[#F3BB57]/15 text-[#F3BB57] border border-[#F3BB57]/40 font-bold">
                          OUT OF RANGE
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] px-2.5 py-1 rounded-lg bg-[#21E6D0]/15 text-[#21E6D0] border border-[#21E6D0]/40 font-bold">
                          NOMINAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
