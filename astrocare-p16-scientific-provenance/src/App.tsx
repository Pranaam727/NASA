import React, { useState } from 'react'
import {
  ProvenanceProvider,
  useScientificProvenance,
} from './features/scientific-provenance/context/ScientificProvenanceContext'
import {
  NavigationSidebar,
  PageId,
} from './features/scientific-provenance/components/NavigationSidebar'
import { TopNavbar } from './features/scientific-provenance/components/TopNavbar'
import { AddSourceModal } from './features/scientific-provenance/components/AddSourceModal'
import { SourceDetailPanel } from './features/scientific-provenance/components/SourceDetailPanel'

// Pages
import { ProvenanceOverviewPage } from './features/scientific-provenance/pages/ProvenanceOverviewPage'
import { SourceRegistryPage } from './features/scientific-provenance/pages/SourceRegistryPage'
import { NASAResearchSourcesPage } from './features/scientific-provenance/pages/NASAResearchSourcesPage'
import { CitationExplorerPage } from './features/scientific-provenance/pages/CitationExplorerPage'
import { EvidenceRecordsPage } from './features/scientific-provenance/pages/EvidenceRecordsPage'
import { ScientificClaimsPage } from './features/scientific-provenance/pages/ScientificClaimsPage'
import { InsightProvenancePage } from './features/scientific-provenance/pages/InsightProvenancePage'
import { DatasetAttributionPage } from './features/scientific-provenance/pages/DatasetAttributionPage'
import { SourceValidationPage } from './features/scientific-provenance/pages/SourceValidationPage'
import { DuplicateDetectionPage } from './features/scientific-provenance/pages/DuplicateDetectionPage'
import { EvidenceQualityPage } from './features/scientific-provenance/pages/EvidenceQualityPage'
import { ResearchReportsPage } from './features/scientific-provenance/pages/ResearchReportsPage'
import { ActivitySettingsPage } from './features/scientific-provenance/pages/ActivitySettingsPage'

import { ScientificSource } from './features/scientific-provenance/types/source.types'

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('overview')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false)
  const [selectedSourceForDetail, setSelectedSourceForDetail] = useState<ScientificSource | null>(null)

  const {
    sources,
    claims,
    evidence,
    validationResults,
    selectedCitationStyle,
    setSelectedCitationStyle,
    addSource,
    resetToDefaults,
  } = useScientificProvenance()

  const unsupportedClaimsCount = claims.filter((c) => c.sourceIds.length === 0).length
  const validationWarningsCount = Object.values(validationResults).filter(
    (res) => res.status === 'incomplete_metadata' || res.isDuplicate || res.status === 'duplicate_detected'
  ).length

  const handleSelectSource = (source: ScientificSource) => {
    setSelectedSourceForDetail(source)
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'overview':
        return (
          <ProvenanceOverviewPage
            onNavigate={(page) => setCurrentPage(page)}
            onSelectSource={handleSelectSource}
          />
        )
      case 'sources':
        return <SourceRegistryPage />
      case 'nasa':
        return <NASAResearchSourcesPage />
      case 'citations':
        return <CitationExplorerPage />
      case 'evidence':
        return <EvidenceRecordsPage />
      case 'claims':
        return <ScientificClaimsPage />
      case 'insights':
        return <InsightProvenancePage />
      case 'datasets':
        return <DatasetAttributionPage />
      case 'validation':
        return <SourceValidationPage />
      case 'duplicates':
        return <DuplicateDetectionPage />
      case 'quality':
        return <EvidenceQualityPage />
      case 'reports':
        return <ResearchReportsPage />
      case 'activity':
        return <ActivitySettingsPage />
      default:
        return (
          <ProvenanceOverviewPage
            onNavigate={(page) => setCurrentPage(page)}
            onSelectSource={handleSelectSource}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-astro-bg text-slate-100 flex flex-col font-sans selection:bg-astro-cyan selection:text-astro-darkest">
      {/* Sidebar Navigation */}
      <NavigationSidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        unsupportedClaimsCount={unsupportedClaimsCount}
        validationWarningsCount={validationWarningsCount}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNavbar
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
          globalSearchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          currentCitationStyle={selectedCitationStyle}
          onSelectCitationStyle={setSelectedCitationStyle}
          onOpenAddSource={() => setIsAddSourceOpen(true)}
          onResetDefaults={() => {
            if (window.confirm('Reset local state to default authentic NASA baseline records?')) {
              resetToDefaults()
            }
          }}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-astro-border py-4 px-6 text-center text-xs text-slate-400 font-mono bg-astro-darkest/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>AstroCare • P16 Scientific Provenance & Citation Intelligence</span>
            <span className="text-slate-400">
              Validated against NASA Human Research Roadmap & Open Science Data Repositories
            </span>
          </div>
        </footer>
      </div>

      {/* Global Add Source Modal */}
      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onSave={(source) => addSource(source)}
      />

      {/* Global Source Inspection Panel */}
      <SourceDetailPanel
        source={selectedSourceForDetail}
        onClose={() => setSelectedSourceForDetail(null)}
        validationResult={selectedSourceForDetail ? validationResults[selectedSourceForDetail.id] : undefined}
        linkedClaims={
          selectedSourceForDetail
            ? claims.filter((c) => c.sourceIds.includes(selectedSourceForDetail.id))
            : []
        }
        linkedEvidence={
          selectedSourceForDetail
            ? evidence.filter((e) => e.sourceId === selectedSourceForDetail.id)
            : []
        }
        onOpenEdit={() => {}}
      />
    </div>
  )
}

export function App() {
  return (
    <ProvenanceProvider>
      <AppContent />
    </ProvenanceProvider>
  )
}

export default App
