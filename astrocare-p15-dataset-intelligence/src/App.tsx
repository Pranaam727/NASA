import React, { useState } from 'react';
import {
  Sidebar,
  Navbar,
  DatasetOverviewPage,
  DatasetExplorerPage,
  DatasetCataloguePage,
  DatasetDetailPage,
  BiomedicalResearchPage,
  HumanStudiesPage,
  ImmuneResearchPage,
  RadiationResearchPage,
  CardiovascularResearchPage,
  BoneMuscleResearchPage,
  SleepBehavioralPage,
  ComparativeAnalyticsPage,
  LongitudinalAnalysisPage,
  VisualizationStudioPage,
  ResearchReportsPage,
  SettingsPage,
  DatasetDetailPanel,
  BENCHMARK_NASA_DATASETS,
  type NavigationPage,
  type DatasetRecord
} from './features/nasa-dataset-intelligence';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [modalStudyId, setModalStudyId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['OSD-575', 'OSD-53']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle comparison state for a given study ID
  const handleToggleCompare = (studyId: string) => {
    setComparisonIds(prev =>
      prev.includes(studyId) ? prev.filter(id => id !== studyId) : [...prev, studyId]
    );
  };

  // Inspect study: open in modal or navigate to detail page
  const handleInspectStudy = (studyId: string) => {
    setSelectedStudyId(studyId);
  };

  const handleOpenModal = (studyId: string) => {
    setModalStudyId(studyId);
  };

  const modalDataset = BENCHMARK_NASA_DATASETS.find(d => d.studyId === modalStudyId);

  const renderActivePage = () => {
    // If a specific study is selected for detail drilldown
    if (selectedStudyId) {
      return (
        <DatasetDetailPage
          studyId={selectedStudyId}
          onBack={() => setSelectedStudyId(null)}
          onToggleCompare={handleToggleCompare}
          isComparing={comparisonIds.includes(selectedStudyId)}
        />
      );
    }

    switch (currentPage) {
      case 'overview':
        return (
          <DatasetOverviewPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
            provenance="CACHED_NASA_BENCHMARK"
          />
        );
      case 'explorer':
        return (
          <DatasetExplorerPage
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'catalogue':
        return (
          <DatasetCataloguePage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'biomedical':
        return (
          <BiomedicalResearchPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
          />
        );
      case 'human-studies':
        return (
          <HumanStudiesPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'immune':
        return (
          <ImmuneResearchPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'radiation':
        return (
          <RadiationResearchPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'cardiovascular':
        return (
          <CardiovascularResearchPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'bone-muscle':
        return (
          <BoneMuscleResearchPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'sleep-behavioral':
        return (
          <SleepBehavioralPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'comparison':
        return (
          <ComparativeAnalyticsPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            selectedComparisonIds={comparisonIds}
            onToggleCompare={handleToggleCompare}
            onClearComparison={() => setComparisonIds([])}
          />
        );
      case 'longitudinal':
        return (
          <LongitudinalAnalysisPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
          />
        );
      case 'visualization':
        return (
          <VisualizationStudioPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
          />
        );
      case 'reports':
        return (
          <ResearchReportsPage
            datasets={BENCHMARK_NASA_DATASETS}
            selectedComparisonIds={comparisonIds}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DatasetOverviewPage
            datasets={BENCHMARK_NASA_DATASETS}
            onSelectStudy={handleInspectStudy}
            onToggleCompare={handleToggleCompare}
            selectedComparisonIds={comparisonIds}
            provenance="CACHED_NASA_BENCHMARK"
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080C14] text-slate-100 font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Sidebar Navigation (15 sections) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setSelectedStudyId(null);
          setCurrentPage(page);
        }}
        isOpen={isSidebarOpen}
        comparisonCount={comparisonIds.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onSearchSubmit={(q) => {
            setSelectedStudyId(null);
            setCurrentPage('explorer');
          }}
          provenance="CACHED_NASA_BENCHMARK"
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Detail Modal if triggered */}
      {modalDataset && (
        <DatasetDetailPanel
          dataset={modalDataset}
          onClose={() => setModalStudyId(null)}
          onToggleCompare={handleToggleCompare}
          isComparing={comparisonIds.includes(modalDataset.studyId)}
        />
      )}
    </div>
  );
};

export default App;
