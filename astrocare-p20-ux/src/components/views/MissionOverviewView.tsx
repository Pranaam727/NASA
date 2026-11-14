import React from 'react';
import {
  Mission,
  Astronaut,
  AlertSummary,
  InvestigationSummary,
  MissionEvent,
  ResearchSource
} from '../../types/contracts';
import { CrewMemberCard } from '../cards/CrewMemberCard';
import { AlertSummaryCard } from '../cards/AlertSummaryCard';
import { MissionTimeline } from '../timeline/MissionTimeline';
import { ResearchCitationPanel } from '../research/ResearchCitationPanel';
import {
  Users,
  AlertTriangle,
  FileSearch,
  Activity,
  Sparkles,
  ShieldCheck,
  Radio,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CARD_SURFACE, FOCUS_RING } from '../../design-system/utils';

interface MissionOverviewViewProps {
  mission: Mission;
  crewMembers: Astronaut[];
  alerts: AlertSummary[];
  investigations: InvestigationSummary[];
  timelineEvents: MissionEvent[];
  researchSources: ResearchSource[];
  selectedAstronaut: Astronaut | null;
  onSelectAstronaut: (astronaut: Astronaut | null) => void;
  onOpenAstronautDossier: (astronaut: Astronaut) => void;
  onOpenInvestigation: (invId: string) => void;
  onSelectResearchSource: (source: ResearchSource) => void;
  onNavigate: (routeId: string) => void;
}

export const MissionOverviewView: React.FC<MissionOverviewViewProps> = ({
  mission,
  crewMembers,
  alerts,
  investigations,
  timelineEvents,
  researchSources,
  selectedAstronaut,
  onSelectAstronaut,
  onOpenAstronautDossier,
  onOpenInvestigation,
  onSelectResearchSource,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      
      {/* SECTION B: MISSION HEALTH OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Monitored Crew */}
        <div className={`p-4 rounded-2xl ${CARD_SURFACE}`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>MONITORED CREW</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {crewMembers.length} <span className="text-xs font-normal text-slate-400">Astronauts</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-500 mt-1 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>100% Bio-Harness Link Active</span>
          </div>
        </div>

        {/* Active Risk Alerts */}
        <div className={`p-4 rounded-2xl ${CARD_SURFACE}`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>ACTIVE RISK ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-500">
            {alerts.filter(a => !a.acknowledged).length} <span className="text-xs font-normal text-slate-400">Actionable</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            1 Critical • 2 Warning Flags
          </div>
        </div>

        {/* Open Investigations */}
        <div className={`p-4 rounded-2xl ${CARD_SURFACE}`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>OPEN INVESTIGATIONS</span>
            <FileSearch className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-cyan-300">
            {investigations.length} <span className="text-xs font-normal text-slate-400">Cases</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mt-1 truncate">
            SANS & Trabecular Bone Oversight
          </div>
        </div>

        {/* AI Intelligence Status */}
        <div className={`p-4 rounded-2xl ${CARD_SURFACE}`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
            <span>AI COPILOT STATUS</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-500 dark:text-indigo-400">
            Online <span className="text-xs font-normal text-slate-400">v2.5 Flash</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Multi-Domain Synthesis Ready
          </div>
        </div>

      </div>

      {/* SECTION C: CREW HEALTH OVERVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              <span>Monitored Astronaut Health Roster</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Click any crew member to filter mission-control telemetry or inspect their individual biomedical dossier.
            </p>
          </div>

          <button
            onClick={() => onNavigate('crew-roster')}
            className={`text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer ${FOCUS_RING}`}
          >
            <span>View Full Roster Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crewMembers.map((member) => (
            <CrewMemberCard
              key={member.id}
              astronaut={member}
              isSelected={selectedAstronaut?.id === member.id}
              onSelect={(a) => onSelectAstronaut(a)}
              onOpenDetails={(a) => onOpenAstronautDossier(a)}
            />
          ))}
        </div>
      </div>

      {/* TWO COLUMNS: ALERTS & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Active Clinical Alerts & Investigations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Prioritized Flight Surgeon Alerts</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {alerts.length} Active Events
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertSummaryCard
                key={alert.id}
                alert={alert}
                onOpenInvestigation={onOpenInvestigation}
              />
            ))}
          </div>

          {/* Environmental Telemetry Snapshot */}
          <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2 text-xs font-mono`}>
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
              Active Habitat Environment (Node 2 Harmony)
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <div>Cabin CO₂: <strong className="text-amber-500">{mission.ambientEnvironment.cabinCo2Ppm} ppm</strong> (~2.4 mmHg)</div>
              <div>Atm Pressure: <strong className="text-slate-900 dark:text-white">{mission.ambientEnvironment.cabinPressureKpa} kPa</strong></div>
              <div>GCR Dosimetry: <strong className="text-slate-900 dark:text-white">{mission.ambientEnvironment.gcrDosimetryRateMicroSvPerDay} µSv/d</strong></div>
              <div>Ambient Temp: <strong className="text-slate-900 dark:text-white">{mission.ambientEnvironment.ambientTempC} °C</strong></div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Chronological Mission Activity Timeline */}
        <div className="lg:col-span-7">
          <MissionTimeline
            events={timelineEvents}
            onOpenInvestigation={onOpenInvestigation}
          />
        </div>

      </div>

      {/* SECTION F: RESEARCH PROVENANCE & NASA GROUND TRUTH */}
      <ResearchCitationPanel
        sources={researchSources}
        onSelectSource={onSelectResearchSource}
      />

    </div>
  );
};
