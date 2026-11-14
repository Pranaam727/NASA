// Public exports for AstroCare P16 Scientific Provenance & Citation Intelligence

// Pages
export { ProvenanceOverviewPage } from './pages/ProvenanceOverviewPage'
export { SourceRegistryPage } from './pages/SourceRegistryPage'
export { NASAResearchSourcesPage } from './pages/NASAResearchSourcesPage'
export { CitationExplorerPage } from './pages/CitationExplorerPage'
export { EvidenceRecordsPage } from './pages/EvidenceRecordsPage'
export { ScientificClaimsPage } from './pages/ScientificClaimsPage'
export { InsightProvenancePage } from './pages/InsightProvenancePage'
export { DatasetAttributionPage } from './pages/DatasetAttributionPage'
export { SourceValidationPage } from './pages/SourceValidationPage'
export { DuplicateDetectionPage } from './pages/DuplicateDetectionPage'
export { EvidenceQualityPage } from './pages/EvidenceQualityPage'
export { ResearchReportsPage } from './pages/ResearchReportsPage'
export { ActivitySettingsPage } from './pages/ActivitySettingsPage'

// Components
export { NavigationSidebar } from './components/NavigationSidebar'
export type { PageId } from './components/NavigationSidebar'
export { TopNavbar } from './components/TopNavbar'
export { ProvenanceSummaryCards } from './components/ProvenanceSummaryCards'
export { SourceRegistryTable } from './components/SourceRegistryTable'
export { SourceDetailPanel } from './components/SourceDetailPanel'
export { AddSourceModal } from './components/AddSourceModal'
export { ScientificClaimCard } from './components/ScientificClaimCard'
export { ClaimDetailModal } from './components/ClaimDetailModal'
export { EvidenceCard } from './components/EvidenceCard'
export { CitationPanel } from './components/CitationPanel'
export { InsightLineageGraph } from './components/InsightLineageGraph'
export { SourceValidationPanel } from './components/SourceValidationPanel'
export { DuplicateDetectionView } from './components/DuplicateDetectionView'
export { EvidenceQualityMatrix } from './components/EvidenceQualityMatrix'
export { ReportBuilder } from './components/ReportBuilder'
export { ResearchActivityTimeline } from './components/ResearchActivityTimeline'

// Context & Hooks
export {
  ProvenanceProvider,
  useScientificProvenance,
} from './context/ScientificProvenanceContext'
export { useScientificSources } from './hooks/useScientificSources'
export { useScientificClaims } from './hooks/useScientificClaims'
export { useCitations } from './hooks/useCitations'
export { useProvenance } from './hooks/useProvenance'
export { useEvidence } from './hooks/useEvidence'
export { useValidation } from './hooks/useValidation'
export { useAudit } from './hooks/useAudit'

// Services
export { CitationService } from './services/citationService'
export { SourceValidationService } from './services/sourceValidationService'
export { NASADiscoveryService, OFFICIAL_NASA_REPOSITORIES } from './services/nasaDiscoveryService'
export { ReportService } from './services/reportService'

// Types
export * from './types/source.types'
export * from './types/claim.types'
export * from './types/evidence.types'
export * from './types/citation.types'
export * from './types/provenance.types'
export * from './types/validation.types'
export * from './types/dataset.types'
export * from './types/audit.types'
export * from './types/report.types'
