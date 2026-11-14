// ============================================================================
// ASTROCARE P15 - NASA BIOMEDICAL DATASET INTELLIGENCE MODULE
// Public Integration Exports & Services
// ============================================================================

// 1. Pages
export { DatasetOverviewPage } from './pages/DatasetOverviewPage';
export { DatasetExplorerPage } from './pages/DatasetExplorerPage';
export { DatasetCataloguePage } from './pages/DatasetCataloguePage';
export { DatasetDetailPage } from './pages/DatasetDetailPage';
export { BiomedicalResearchPage } from './pages/BiomedicalResearchPage';
export { HumanStudiesPage } from './pages/HumanStudiesPage';
export { ImmuneResearchPage } from './pages/ImmuneResearchPage';
export { RadiationResearchPage } from './pages/RadiationResearchPage';
export { CardiovascularResearchPage } from './pages/CardiovascularResearchPage';
export { BoneMuscleResearchPage } from './pages/BoneMuscleResearchPage';
export { SleepBehavioralPage } from './pages/SleepBehavioralPage';
export { ComparativeAnalyticsPage } from './pages/ComparativeAnalyticsPage';
export { LongitudinalAnalysisPage } from './pages/LongitudinalAnalysisPage';
export { VisualizationStudioPage } from './pages/VisualizationStudioPage';
export { ResearchReportsPage } from './pages/ResearchReportsPage';
export { SettingsPage } from './pages/SettingsPage';

// 2. Reusable UI Components
export { DatasetCard } from './components/DatasetCard';
export { DatasetSummaryCards } from './components/DatasetSummaryCards';
export { DatasetDetailPanel } from './components/DatasetDetailPanel';
export { DatasetSearchFilters } from './components/DatasetSearchFilters';
export { DatasetFileExplorer } from './components/DatasetFileExplorer';
export { DatasetComparisonPanel } from './components/DatasetComparisonPanel';
export { ResearchTimeline } from './components/ResearchTimeline';
export { DataVisualizationPanel } from './components/DataVisualizationPanel';
export { DatasetMetadataTable } from './components/DatasetMetadataTable';
export { StatusBadge } from './components/StatusBadge';
export { Navbar } from './components/Navbar';
export { Sidebar, type NavigationPage } from './components/Sidebar';

// 3. Services & Provider Implementations
export { NasaOsdrService } from './services/nasaOsdrService';
export { DatasetComparisonService } from './services/datasetComparisonService';
export { DataNormalizationService, type UnitConversionResult } from './services/dataNormalizationService';
export { ReportExportService } from './services/reportExportService';

// 4. Custom Hooks
export { useDatasetSearch } from './hooks/useDatasetSearch';
export { useDatasetMetadata } from './hooks/useDatasetMetadata';
export { useDatasetComparison } from './hooks/useDatasetComparison';
export { useLongitudinalData } from './hooks/useLongitudinalData';

// 5. Types & Interfaces
export type {
  StudyPopulation,
  ProvenanceType,
  FileAvailabilityStatus,
  DatasetFile,
  DatasetRecord,
  SearchFilterParams,
  SearchResultPage,
  FactorItem,
  ProtocolItem,
  PublicationItem
} from './types/dataset.types';

export type {
  BiomedicalDomain,
  MissionPhase,
  MeasurementVariable,
  ResearchObservation
} from './types/observation.types';

export type {
  CompatibilityStatus,
  ScientificCompatibilityReport,
  DatasetComparisonState
} from './types/comparison.types';

export type {
  ResearchReportData,
  ProviderSettings
} from './types/research.types';

// 6. Benchmark Data
export { BENCHMARK_NASA_DATASETS } from './data/benchmarkDatasets';
export { BENCHMARK_VARIABLES, BENCHMARK_OBSERVATIONS } from './data/demoObservations';
