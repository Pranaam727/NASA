import React, { useState, useEffect } from 'react';
import { SidebarNav } from './features/risk-intelligence/components/SidebarNav';
import { HeaderNav } from './features/risk-intelligence/components/HeaderNav';

// P14 Pages
import { RiskOverviewPage } from './features/risk-intelligence/pages/RiskOverviewPage';
import { RiskCategoriesPage } from './features/risk-intelligence/pages/RiskCategoriesPage';
import { RadiationRiskPage } from './features/risk-intelligence/pages/RadiationRiskPage';
import { CardiovascularRiskPage } from './features/risk-intelligence/pages/CardiovascularRiskPage';
import { BoneMuscleRiskPage } from './features/risk-intelligence/pages/BoneMuscleRiskPage';
import { ImmuneRiskPage } from './features/risk-intelligence/pages/ImmuneRiskPage';
import { SleepPsychologicalRiskPage } from './features/risk-intelligence/pages/SleepPsychologicalRiskPage';
import { VisionNeurologicalRiskPage } from './features/risk-intelligence/pages/VisionNeurologicalRiskPage';
import { EvidenceLibraryPage } from './features/risk-intelligence/pages/EvidenceLibraryPage';
import { ResearchExplorerPage } from './features/risk-intelligence/pages/ResearchExplorerPage';
import { MitigationStrategiesPage } from './features/risk-intelligence/pages/MitigationStrategiesPage';
import { MissionRiskAnalysisPage } from './features/risk-intelligence/pages/MissionRiskAnalysisPage';
import { ResearchInsightsPage } from './features/risk-intelligence/pages/ResearchInsightsPage';
import { SettingsPage } from './features/risk-intelligence/pages/SettingsPage';

export const App: React.FC = () => {
  // Simple, robust client router supporting direct browser URL hash or path
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('/')) return hash;
    const path = window.location.pathname;
    if (path && path.startsWith('/risks')) return path;
    return '/risks';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('/')) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearch = (query: string) => {
    navigate('/risks/research');
  };

  const renderActivePage = () => {
    switch (currentRoute) {
      case '/risks':
      case '/risks/dashboard':
      case '/':
        return <RiskOverviewPage onNavigate={navigate} />;
      case '/risks/categories':
        return <RiskCategoriesPage onNavigate={navigate} />;
      case '/risks/cardiovascular':
        return <CardiovascularRiskPage onNavigate={navigate} />;
      case '/risks/bone-muscle':
        return <BoneMuscleRiskPage onNavigate={navigate} />;
      case '/risks/radiation':
        return <RadiationRiskPage onNavigate={navigate} />;
      case '/risks/immune':
        return <ImmuneRiskPage onNavigate={navigate} />;
      case '/risks/sleep-psychological':
        return <SleepPsychologicalRiskPage onNavigate={navigate} />;
      case '/risks/vision-neurological':
        return <VisionNeurologicalRiskPage onNavigate={navigate} />;
      case '/risks/evidence':
        return <EvidenceLibraryPage onNavigate={navigate} />;
      case '/risks/research':
        return <ResearchExplorerPage onNavigate={navigate} />;
      case '/risks/mitigation':
        return <MitigationStrategiesPage onNavigate={navigate} />;
      case '/risks/mission-analysis':
        return <MissionRiskAnalysisPage onNavigate={navigate} />;
      case '/risks/insights':
        return <ResearchInsightsPage onNavigate={navigate} />;
      case '/risks/settings':
        return <SettingsPage onNavigate={navigate} />;
      default:
        return <RiskOverviewPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col antialiased">
      <div className="flex flex-1">
        
        {/* Sidebar Nav */}
        <SidebarNav
          currentRoute={currentRoute}
          onNavigate={navigate}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-space-950">
          
          {/* Top Header */}
          <HeaderNav
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSearchSubmit={handleGlobalSearch}
            activeMissionName="ISS Baseline / Mars Ready"
          />

          {/* Page View Body */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActivePage()}
          </main>

          {/* Platform Footer */}
          <footer className="border-t border-slate-800/80 bg-space-950 px-6 py-4 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">AstroCare P14</span>
              <span>•</span>
              <span>NASA Human-Spaceflight Risk Intelligence</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-cyan-400">HRP-STD-2024</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Grounded in NASA Human Research Program Roadmap & Open Science Data Repository (OSDR).
            </div>
          </footer>

        </div>

      </div>
    </div>
  );
};
