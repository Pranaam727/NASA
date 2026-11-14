import React from 'react';
import { Astronaut } from '../../types/contracts';
import { CrewMemberCard } from '../cards/CrewMemberCard';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { Users, Heart, Activity, Wind, ShieldCheck, AlertTriangle } from 'lucide-react';
import { CARD_SURFACE } from '../../design-system/utils';

interface CrewRosterViewProps {
  crewMembers: Astronaut[];
  selectedAstronaut: Astronaut | null;
  onSelectAstronaut: (astronaut: Astronaut) => void;
  onOpenDossier: (astronaut: Astronaut) => void;
}

export const CrewRosterView: React.FC<CrewRosterViewProps> = ({
  crewMembers,
  selectedAstronaut,
  onSelectAstronaut,
  onOpenDossier
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white">
              Expedition 72 Monitored Crew Roster
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
              4 Monitored Crew
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Continuous biosensor telemetry, baseline physiological profiles, and countermeasure compliance tracking.
          </p>
        </div>

        <DataProvenanceBadge type="live-telemetry" />
      </div>

      {/* Grid of Crew Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crewMembers.map((member) => (
          <CrewMemberCard
            key={member.id}
            astronaut={member}
            isSelected={selectedAstronaut?.id === member.id}
            onSelect={onSelectAstronaut}
            onOpenDetails={onOpenDossier}
          />
        ))}
      </div>

      {/* Comparative Roster Table */}
      <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-4`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm font-sans flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            <span>Comparative Cross-Crew Vital Telemetry Matrix</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Realtime 1 Hz Bio-Harness Synchronization
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Astronaut</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Pulse (bpm)</th>
                <th className="px-4 py-3">Arterial BP</th>
                <th className="px-4 py-3">SpO₂</th>
                <th className="px-4 py-3">HRV rMSSD</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
              {crewMembers.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-sans font-bold text-slate-900 dark:text-white">
                    {a.name} <span className="text-[11px] text-slate-400 font-mono">({a.callsign})</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-sans">{a.role}</td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{a.primaryVitals.heartRateBpm}</td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{a.primaryVitals.bloodPressureSys}/{a.primaryVitals.bloodPressureDia}</td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{a.primaryVitals.spo2Percent}%</td>
                  <td className="px-4 py-3 font-bold text-cyan-600 dark:text-cyan-300">{a.primaryVitals.hrvRmssdMs} ms</td>
                  <td className="px-4 py-3">
                    {a.overallHealthStatus === 'nominal' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-500/30">NOMINAL</span>
                    ) : a.overallHealthStatus === 'critical' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-500/30">CRITICAL</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-amber-500/30">WARNING</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOpenDossier(a)}
                      className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      Dossier →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
