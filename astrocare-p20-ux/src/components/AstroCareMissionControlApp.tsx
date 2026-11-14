import React, { useState, useEffect } from 'react';
import {
  Mission,
  Astronaut,
  AlertSummary,
  InvestigationSummary,
  MissionEvent,
  ResearchSource,
  HealthMetric
} from '../types/contracts';
import { dataProvider, GlobalSearchResult } from '../data/mockDataProvider';
import { ASTROCARE_NAVIGATION_TREE } from '../data/navigationTree';
import { NavigationRoute } from '../types/navigation';
import { MissionHeader } from './common/MissionHeader';
import { MissionSidebar } from './common/MissionSidebar';
import { DetailDrawer } from './common/DetailDrawer';
import { SourceDetailModal } from './research/SourceDetailModal';
import { GlobalSearchModal } from './common/GlobalSearchModal';
import { MissionTimeline } from './timeline/MissionTimeline';
import { MetricTrendChart } from './charts/MetricTrendChart';

// Views
import { MissionOverviewView } from './views/MissionOverviewView';
import { CrewRosterView } from './views/CrewRosterView';
import { VitalMonitoringView } from './views/VitalMonitoringView';
import { HealthAnalyticsView } from './views/HealthAnalyticsView';
import { ResearchSourcesView } from './views/ResearchSourcesView';
import { PlaceholderModuleView } from './views/PlaceholderModuleView';
import { SettingsView } from './views/SettingsView';

import {
  Heart,
  Activity,
  Wind,
  ShieldCheck,
  ChevronRight,
  FileSearch,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CARD_SURFACE } from '../design-system/utils';

export const AstroCareMissionControlApp: React.FC = () => {
  // Core Platform Data State
  const [mission, setMission] = useState<Mission | null>(null);
  const [crewMembers, setCrewMembers] = useState<Astronaut[]>([]);
  const [selectedAstronaut, setSelectedAstronaut] = useState<Astronaut | null>(null);
  const [alerts, setAlerts] = useState<AlertSummary[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<MissionEvent[]>([]);
  const [researchSources, setResearchSources] = useState<ResearchSource[]>([]);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);

  // Navigation State
  const [currentRouteId, setCurrentRouteId] = useState<string>('mission-overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals & Drawers State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeSourceModal, setActiveSourceModal] = useState<ResearchSource | null>(null);
  const [activeAstronautDrawer, setActiveAstronautDrawer] = useState<Astronaut | null>(null);
  const [activeMetricDrawer, setActiveMetricDrawer] = useState<HealthMetric | null>(null);

  // Initial Data Load
  useEffect(() => {
    const load = async () => {
      const [m, c, a, inv, t, s] = await Promise.all([
        dataProvider.getMission(),
        dataProvider.getCrewMembers(),
        dataProvider.getAlerts(),
        dataProvider.getInvestigations(),
        dataProvider.getTimelineEvents(),
        dataProvider.getResearchSources()
      ]);
      setMission(m);
      setCrewMembers(c);
      setSelectedAstronaut(c[0]);
      setAlerts(a);
      setInvestigations(inv);
      setTimelineEvents(t);
      setResearchSources(s);

      const initialMetrics = await dataProvider.getHealthMetrics(c[0].id);
      setMetrics(initialMetrics);
    };
    load();
  }, []);

  // Update metrics when astronaut changes
  useEffect(() => {
    if (selectedAstronaut) {
      dataProvider.getHealthMetrics(selectedAstronaut.id).then(setMetrics);
    }
  }, [selectedAstronaut]);

  // Global Keyboard Shortcut: Cmd/Ctrl + K for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mission || crewMembers.length === 0) {
    return (
      <div className="min-h-screen bg-[#070a12] text-white flex items-center justify-center font-mono">
        Acquiring AstroCare Telemetry Stream...
      </div>
    );
  }

  // Find active route object
  const allRoutes = ASTROCARE_NAVIGATION_TREE.flatMap(g => g.routes);
  const currentRoute = allRoutes.find(r => r.id === currentRouteId) || allRoutes[0];

  const handleSearchResult = (result: GlobalSearchResult) => {
    setCurrentRouteId(result.routeId);
    if (result.category === 'Astronaut' && result.targetId) {
      const a = crewMembers.find(c => c.id === result.targetId);
      if (a) {
        setSelectedAstronaut(a);
        setActiveAstronautDrawer(a);
      }
    } else if (result.category === 'NASA Research' && result.targetId) {
      const s = researchSources.find(src => src.id === result.targetId);
      if (s) setActiveSourceModal(s);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, acknowledged: true } : a)));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-800 dark:text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Collapsible Mission Sidebar */}
      <MissionSidebar
        currentRouteId={currentRouteId}
        onNavigate={setCurrentRouteId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-telemetry-grid">
        
        {/* 2. Mission Header */}
        <MissionHeader
          mission={mission}
          crewMembers={crewMembers}
          selectedAstronaut={selectedAstronaut}
          onSelectAstronaut={setSelectedAstronaut}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* 3. Operational Main Container */}
        <main className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
          
          {/* Breadcrumb & Route Title Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
                <span>AstroCare</span>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize">{currentRoute.groupId.replace(/-/g, ' ')}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{currentRoute.label}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white">
                {currentRoute.label}
              </h1>
            </div>

            {selectedAstronaut && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-sm">
                <span className="text-slate-400">Context:</span>
                <span className="font-bold text-slate-800 dark:text-cyan-300">
                  {selectedAstronaut.name} ({selectedAstronaut.callsign})
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
            )}
          </div>

          {/* VIEW SWITCHER */}
          {currentRouteId === 'mission-overview' && (
            <MissionOverviewView
              mission={mission}
              crewMembers={crewMembers}
              alerts={alerts}
              investigations={investigations}
              timelineEvents={timelineEvents}
              researchSources={researchSources}
              selectedAstronaut={selectedAstronaut}
              onSelectAstronaut={setSelectedAstronaut}
              onOpenAstronautDossier={setActiveAstronautDrawer}
              onOpenInvestigation={(invId) => {
                setCurrentRouteId('investigations');
              }}
              onSelectResearchSource={setActiveSourceModal}
              onNavigate={setCurrentRouteId}
            />
          )}

          {currentRouteId === 'crew-roster' && (
            <CrewRosterView
              crewMembers={crewMembers}
              selectedAstronaut={selectedAstronaut}
              onSelectAstronaut={setSelectedAstronaut}
              onOpenDossier={setActiveAstronautDrawer}
            />
          )}

          {currentRouteId === 'vital-monitoring' && (
            <VitalMonitoringView
              crewMembers={crewMembers}
              selectedAstronaut={selectedAstronaut}
              onSelectAstronaut={setSelectedAstronaut}
            />
          )}

          {currentRouteId === 'health-analytics' && (
            <HealthAnalyticsView
              astronaut={selectedAstronaut || crewMembers[0]}
              metrics={metrics}
              onOpenMetricDrawer={setActiveMetricDrawer}
            />
          )}

          {currentRouteId === 'mission-timeline' && (
            <div className="space-y-6">
              <MissionTimeline events={timelineEvents} />
            </div>
          )}

          {(currentRouteId === 'nasa-sources' || currentRouteId === 'research-explorer' || currentRouteId === 'evidence-citations') && (
            <ResearchSourcesView
              sources={researchSources}
              onSelectSource={setActiveSourceModal}
            />
          )}

          {currentRouteId === 'investigations' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-purple-500" />
                  <span>Aerospace Medical Investigations & Flight Surgeon Protocols</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Active clinical surveillance cases supervised by NASA Flight Surgeons.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investigations.map((inv) => (
                  <div key={inv.id} className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                        {inv.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                        {inv.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {inv.title}
                    </h3>

                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1">
                      <div>Subject: <strong className="text-slate-800 dark:text-slate-200">{inv.astronautName}</strong></div>
                      <div>Physician: {inv.assignedPhysician}</div>
                      <div>Lead Discipline: <span className="capitalize text-cyan-600 dark:text-cyan-400">{inv.leadDomain}</span></div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Prescribed Protocol Actions:</span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {inv.targetActions.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentRouteId === 'settings' && (
            <SettingsView />
          )}

          {/* Fallback to Placeholder Module for External P-modules */}
          {!currentRoute.isImplementedInP20 && (
            <PlaceholderModuleView route={currentRoute} />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono mt-auto bg-white/50 dark:bg-[#070a12]/50">
          <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">ASTROCARE</span>
              <span>•</span>
              <span>P20/21 Mission-Wide UI/UX Experience</span>
              <span>•</span>
              <span className="text-emerald-500 font-bold">WCAG 2.2 AA Compliant</span>
            </div>
            <div>
              Ground Truth References: NASA Human Research Program & Open Science Data Repository
            </div>
          </div>
        </footer>

      </div>

      {/* 4. MODALS & DRAWERS */}
      
      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResult}
      />

      {/* NASA Source Detail Modal */}
      <SourceDetailModal
        source={activeSourceModal}
        onClose={() => setActiveSourceModal(null)}
      />

      {/* Astronaut Deep-Dive Dossier Drawer */}
      <DetailDrawer
        isOpen={Boolean(activeAstronautDrawer)}
        onClose={() => setActiveAstronautDrawer(null)}
        title={activeAstronautDrawer?.name || 'Astronaut Profile'}
        subtitle={`${activeAstronautDrawer?.role} • ${activeAstronautDrawer?.callsign}`}
      >
        {activeAstronautDrawer && (
          <div className="space-y-5 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Agency / Nationality:</span>
                <span className="font-bold">{activeAstronautDrawer.agency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flight Elapsed Time:</span>
                <span className="font-bold text-cyan-500">Day {activeAstronautDrawer.flightDay} of 180</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Spacewalks (EVA):</span>
                <span>{activeAstronautDrawer.evaCount} Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telemetry Stream:</span>
                <span className="text-emerald-500 font-bold uppercase">{activeAstronautDrawer.dataAvailability}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase">Primary Vital Envelope</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Resting Pulse</span>
                  <span className="text-base font-bold text-rose-500">{activeAstronautDrawer.primaryVitals.heartRateBpm} bpm</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                  <span className="text-base font-bold text-cyan-500">{activeAstronautDrawer.primaryVitals.bloodPressureSys}/{activeAstronautDrawer.primaryVitals.bloodPressureDia} mmHg</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Oxygen Saturation</span>
                  <span className="text-base font-bold text-blue-500">{activeAstronautDrawer.primaryVitals.spo2Percent}%</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">HRV rMSSD</span>
                  <span className="text-base font-bold text-purple-500">{activeAstronautDrawer.primaryVitals.hrvRmssdMs} ms</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-200 space-y-1">
              <strong className="text-cyan-600 dark:text-cyan-300 font-bold block">Current Clinical Observation:</strong>
              <p className="font-sans text-xs leading-relaxed">{activeAstronautDrawer.latestObservation}</p>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Metric Inspection Drawer */}
      <DetailDrawer
        isOpen={Boolean(activeMetricDrawer)}
        onClose={() => setActiveMetricDrawer(null)}
        title={activeMetricDrawer?.name || 'Metric Details'}
        subtitle={`${activeMetricDrawer?.domain.toUpperCase()} • ${activeMetricDrawer?.unit}`}
      >
        {activeMetricDrawer && (
          <div className="space-y-4">
            <MetricTrendChart metric={activeMetricDrawer} height={280} />
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Value:</span>
                <span className="font-bold text-cyan-500">{activeMetricDrawer.currentValue} {activeMetricDrawer.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">1-G Baseline:</span>
                <span>{activeMetricDrawer.baselineValue} {activeMetricDrawer.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nominal Bounds:</span>
                <span>[{activeMetricDrawer.nominalRange[0]} - {activeMetricDrawer.nominalRange[1]}] {activeMetricDrawer.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source:</span>
                <span>{activeMetricDrawer.provenance.sourceSystem}</span>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
