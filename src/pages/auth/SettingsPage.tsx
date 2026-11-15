import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { Bell, Wifi } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isOffline, toggleOfflineSimulation } = useOfflineSync();
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [telemetryFrequency, setTelemetryFrequency] = useState('1 Hz (High Precision)');
  const [contrastMode, setContrastMode] = useState('Aerospace Dark (Standard)');

  return (
    <PageContainer>
      <PageHeader
        title="System & Telemetry Settings"
        subtitle="Configure sensor sample intervals, offline propagation buffers, and audio alert triggers"
        badge={<StatusIndicator status="NOMINAL" label="ONLINE" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DossierCard
          title="COMMUNICATION & OFFLINE QUEUE CONFIGURATION"
          subtitle="DEEP-SPACE COMMUNICATIONS LATENCY ENGINE"
          badge={<Wifi className="w-4 h-4 text-astro-sage" />}
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm">
              <div>
                <span className="font-bold text-[#E8F4F0] block">Mars Comm Delay Simulation</span>
                <span className="text-[10px] text-[#8CA8A0]">Toggle between direct link and 4-22 min delay queue</span>
              </div>
              <button
                type="button"
                onClick={toggleOfflineSimulation}
                className={`px-3 py-1 rounded-sm border font-bold text-xs ${
                  isOffline
                    ? 'bg-[#F3BB57] text-[#030A09] border-[#F3BB57]'
                    : 'bg-[#21E6D0] text-[#030A09] border-[#21E6D0]'
                }`}
              >
                {isOffline ? 'OFFLINE (BUFFERING)' : 'ONLINE'}
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8CA8A0] uppercase">Telemetry Sampling Frequency</label>
              <select
                value={telemetryFrequency}
                onChange={(e) => setTelemetryFrequency(e.target.value)}
                className="w-full p-2 bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] rounded-sm text-xs font-mono outline-none focus:border-[#21E6D0]"
              >
                <option value="1 Hz (High Precision)" className="bg-[#0A1715]">1 Hz (Standard Telemetry Resolution)</option>
                <option value="10 Hz (ECG Burst Mode)" className="bg-[#0A1715]">10 Hz (Burst ECG & Spectral Analysis)</option>
                <option value="0.1 Hz (Battery Conserve)" className="bg-[#0A1715]">0.1 Hz (Emergency Low-Power Telemetry)</option>
              </select>
            </div>
          </div>
        </DossierCard>

        <DossierCard
          title="ALERT & INTERFACE PREFERENCES"
          subtitle="SAFETY THRESHOLD DISPATCH"
          badge={<Bell className="w-4 h-4 text-[#21E6D0]" />}
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm">
              <div>
                <span className="font-bold text-[#E8F4F0] block">Critical Audible Alert Chimes</span>
                <span className="text-[10px] text-[#8CA8A0]">Sound alarm for CRITICAL hypoxia or cardiac arrhythmias</span>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="accent-[#21E6D0] w-4 h-4"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8CA8A0] uppercase">Color & Contrast Enclave</label>
              <select
                value={contrastMode}
                onChange={(e) => setContrastMode(e.target.value)}
                className="w-full p-2 bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] rounded-sm text-xs font-mono outline-none focus:border-[#21E6D0]"
              >
                <option value="Aerospace Dark (Standard)" className="bg-[#0A1715]">Aerospace Obsidian / Dark Paper</option>
                <option value="Red Lighting (Night Shift)" className="bg-[#0A1715]">Red Ambient Lighting (Circadian Preserve)</option>
                <option value="High Contrast Flight Deck" className="bg-[#0A1715]">High Contrast Flight Deck (EVA Sunlight)</option>
              </select>
            </div>
          </div>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
