/**
 * AstroCare Mission-Wide UI/UX Experience, Design System & NASA Scientific Source Integration
 * Module Identifier: P20/21
 * Public Library Entry Point
 */

// Master Application
export { AstroCareMissionControlApp } from './components/AstroCareMissionControlApp';

// Design System & Themes
export { DESIGN_TOKENS } from './design-system/tokens';
export type { ThemeMode } from './design-system/tokens';
export { ThemeProvider, useTheme } from './design-system/ThemeContext';
export { cn, FOCUS_RING, CARD_SURFACE, HEADER_SURFACE } from './design-system/utils';

// Standalone Data Contracts & Types
export type {
  Mission,
  Astronaut,
  HealthMetric,
  HealthObservation,
  MissionEvent,
  AlertSummary,
  InvestigationSummary,
  ResearchSource,
  DataProvenance,
  DataProvenanceType,
  HealthDomain,
  MetricStatus,
  MissionPhase,
  EventCategory,
  SourceType,
  DataAccessClassification,
  NavigationGroup,
  NavigationRoute,
  BreadcrumbItem
} from './types';

// Reusable Components
export { MissionHeader } from './components/common/MissionHeader';
export { MissionSidebar } from './components/common/MissionSidebar';
export { MissionNavigation } from './components/common/MissionNavigation';
export { TelemetryStatus } from './components/common/TelemetryStatus';
export { DataQualityIndicator } from './components/common/DataQualityIndicator';
export { DataProvenanceBadge } from './components/common/DataProvenanceBadge';
export { ScientificSourceBadge } from './components/common/ScientificSourceBadge';
export { DetailDrawer } from './components/common/DetailDrawer';
export { ConfirmationDialog } from './components/common/ConfirmationDialog';
export { GlobalSearchModal } from './components/common/GlobalSearchModal';
export { LoadingState } from './components/common/LoadingState';
export { EmptyState, ErrorState } from './components/common/EmptyState';

// Cards & Scientific Visualizations
export { CrewMemberCard } from './components/cards/CrewMemberCard';
export { HealthMetricCard } from './components/cards/HealthMetricCard';
export { AlertSummaryCard } from './components/cards/AlertSummaryCard';
export { MetricTrendChart } from './components/charts/MetricTrendChart';
export { BaselineComparisonChart } from './components/charts/BaselineComparisonChart';
export { MultiMetricComparisonChart } from './components/charts/MultiMetricComparisonChart';
export { ResearchCitationPanel } from './components/research/ResearchCitationPanel';
export { SourceDetailModal } from './components/research/SourceDetailModal';
export { MissionTimeline } from './components/timeline/MissionTimeline';

// Views
export { MissionOverviewView } from './components/views/MissionOverviewView';
export { CrewRosterView } from './components/views/CrewRosterView';
export { VitalMonitoringView } from './components/views/VitalMonitoringView';
export { HealthAnalyticsView } from './components/views/HealthAnalyticsView';
export { ResearchSourcesView } from './components/views/ResearchSourcesView';
export { PlaceholderModuleView } from './components/views/PlaceholderModuleView';
export { SettingsView } from './components/views/SettingsView';

// Sample Data & Provider
export { dataProvider, MockAstroCareDataProvider } from './data/mockDataProvider';
export { NASA_OFFICIAL_RESEARCH_SOURCES } from './data/nasaSources';
export { CURRENT_MISSION, MOCK_ALERTS, MOCK_INVESTIGATIONS } from './data/mockMissionData';
export { CREW_MEMBERS } from './data/crewRoster';
export { MOCK_ASTRONAUT_METRICS } from './data/healthMetrics';
export { MISSION_ACTIVITY_TIMELINE } from './data/telemetryEvents';
export { ASTROCARE_NAVIGATION_TREE } from './data/navigationTree';
