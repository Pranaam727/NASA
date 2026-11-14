// =========================================================================
// ASTROCARE P14 — NASA HUMAN-SPACEFLIGHT RISK INTELLIGENCE MODULE
// Public Feature Exports
// =========================================================================

// Pages
export { RiskOverviewPage } from './pages/RiskOverviewPage';
export { RiskCategoriesPage } from './pages/RiskCategoriesPage';
export { RadiationRiskPage } from './pages/RadiationRiskPage';
export { CardiovascularRiskPage } from './pages/CardiovascularRiskPage';
export { BoneMuscleRiskPage } from './pages/BoneMuscleRiskPage';
export { ImmuneRiskPage } from './pages/ImmuneRiskPage';
export { SleepPsychologicalRiskPage } from './pages/SleepPsychologicalRiskPage';
export { VisionNeurologicalRiskPage } from './pages/VisionNeurologicalRiskPage';
export { EvidenceLibraryPage } from './pages/EvidenceLibraryPage';
export { ResearchExplorerPage } from './pages/ResearchExplorerPage';
export { MitigationStrategiesPage } from './pages/MitigationStrategiesPage';
export { MissionRiskAnalysisPage } from './pages/MissionRiskAnalysisPage';
export { ResearchInsightsPage } from './pages/ResearchInsightsPage';
export { SettingsPage } from './pages/SettingsPage';

// Reusable Components
export { RiskSummaryCards } from './components/RiskSummaryCards';
export { RiskCategoryCard } from './components/RiskCategoryCard';
export { EvidenceCard } from './components/EvidenceCard';
export { EvidenceDetailPanel } from './components/EvidenceDetailPanel';
export { MitigationCard } from './components/MitigationCard';
export { MissionConfiguration } from './components/MissionConfiguration';
export { RiskComparisonChart } from './components/RiskComparisonChart';
export { ResearchTimeline } from './components/ResearchTimeline';
export { SidebarNav } from './components/SidebarNav';
export { HeaderNav } from './components/HeaderNav';

// Services
export { NasaResearchService } from './services/nasaResearchService';
export { NasaOsdrService } from './services/nasaOsdrService';
export { RiskAnalysisService } from './services/riskAnalysisService';

// Hooks
export { useRiskEvidence } from './hooks/useRiskEvidence';
export { useResearchSearch } from './hooks/useResearchSearch';
export { useMissionRiskAnalysis } from './hooks/useMissionRiskAnalysis';

// Types
export * from './types/risk.types';
export * from './types/evidence.types';
export * from './types/mitigation.types';
export * from './types/mission.types';
export * from './types/osdr.types';

// Preloaded Authentic NASA Datasets
export { NASA_RISK_CATEGORIES } from './data/nasaRiskCategories';
export { NASA_EVIDENCE_LIBRARY } from './data/nasaEvidenceLibrary';
export { NASA_MITIGATION_STRATEGIES } from './data/nasaMitigations';
export { CURATED_OSDR_DATASETS } from './data/nasaOsdrDatasets';
export { PRESET_MISSION_PROFILES } from './data/missionProfiles';
export { RESEARCH_INSIGHTS } from './data/researchInsights';
