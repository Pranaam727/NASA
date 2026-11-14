# AstroCare P16: Scientific Provenance & Citation Intelligence — Master Integration Guide

## 1. Module Purpose
**P16 — Scientific Provenance & Citation Intelligence** is an aerospace biomedical module designed to guarantee that every clinical insight, astronaut telemetry interpretation, and physiological finding presented throughout the **AstroCare** platform can be verified and traced back to authentic scientific literature, NASA publications, Technical Reports, and Open Science Data Repository (OSDR) multi-omics datasets.

Key Capabilities:
- **Scientific Source Registry:** Structured catalog of NASA Technical Reports, peer-reviewed journals, and OSDR accessions with strict preservation of canonical URLs, DOIs, and retrieval timestamps.
- **NASA Research Discovery:** Ingestion workflow connecting directly to official NASA portals (HRP Evidence Books, Human Spaceflight Risk Portfolio, NTRS, and OSDR).
- **Bidirectional Claim-to-Source Traceability:** Transparent relational links between clinical statements, study populations (n=1 flight, cohort scans), methodologies, and limitations.
- **Academic Citation Formatting Engine:** Generates standards-compliant citations in **APA 7th, IEEE, Vancouver, and Harvard**, complete with BibTeX export and incomplete metadata warnings.
- **Automated Validation & Duplicate Collisions:** Strict syntax, DOI, URL, and OSDR ID normalization to prevent duplicate registrations and flag missing fields without fabricating data.
- **Insight Lineage & AI Attribution:** Designed specifically for cross-module integration with **P15 Gemini AI**, tracing machine-synthesized research summaries to underlying studies while making simulation boundaries explicit.
- **Research Transparency Reports:** Compile publication-ready audit dossiers in Markdown, JSON, and CSV.

---

## 2. Feature Folder Structure

```
src/features/scientific-provenance/
├── components/
│   ├── NavigationSidebar.tsx        # 13-point aerospace sidebar navigation
│   ├── TopNavbar.tsx                # Aerospace search, citation style switcher, and quick actions
│   ├── ProvenanceSummaryCards.tsx   # 7 summary metrics (sources, claims, warnings, coverage)
│   ├── SourceRegistryTable.tsx      # Searchable, filterable source catalog with CSV/JSON export
│   ├── SourceDetailPanel.tsx        # Full metadata drawer with citation formatter & claim links
│   ├── AddSourceModal.tsx           # Controlled source entry modal with validation guards
│   ├── ScientificClaimCard.tsx      # Status badges, evidence counters, and traceability links
│   ├── ClaimDetailModal.tsx         # Bidirectional claim-to-source traceability matrix
│   ├── EvidenceCard.tsx             # Granular study classification (cohorts, methods, limitations)
│   ├── CitationPanel.tsx            # Multi-style citation switcher, copy engine, BibTeX export
│   ├── InsightLineageGraph.tsx      # Step-by-step provenance graph (Insight → Datasets → Sources → Claims)
│   ├── SourceValidationPanel.tsx    # Bibliographic integrity checker & reachability distinction
│   ├── DuplicateDetectionView.tsx   # Canonical URL / DOI / OSDR accession collision resolver
│   ├── EvidenceQualityMatrix.tsx    # Methodological disclosure matrix (avoids fake quality scores)
│   ├── ReportBuilder.tsx            # Dossier compiler with live Markdown preview, JSON & CSV
│   └── ResearchActivityTimeline.tsx # Chronological demonstration audit log
├── pages/
│   ├── ProvenanceOverviewPage.tsx   # Visual overview dashboard with domain/evidence breakdowns
│   ├── SourceRegistryPage.tsx       # Scientific source registry view
│   ├── NASAResearchSourcesPage.tsx  # NASA Discovery and direct repository portal links
│   ├── CitationExplorerPage.tsx     # Dedicated citation style generator & BibTeX export
│   ├── EvidenceRecordsPage.tsx      # Detailed evidence classifications by study type
│   ├── ScientificClaimsPage.tsx     # Scientific assertions and evidence linking
│   ├── InsightProvenancePage.tsx    # Lineage tracking for AI and module insights
│   ├── DatasetAttributionPage.tsx   # NASA OSDR datasets (RR-1, STS-135, Bion-M1)
│   ├── SourceValidationPage.tsx     # Metadata validation & reachability engine
│   ├── DuplicateDetectionPage.tsx   # Duplicate detection engine & test injector
│   ├── EvidenceQualityPage.tsx      # Study rigor, sample size, and limitation analysis
│   ├── ResearchReportsPage.tsx      # Transparency report generator & exporter
│   └── ActivitySettingsPage.tsx     # Demonstration audit trail & repository reset
├── context/
│   └── ScientificProvenanceContext.tsx # React Context state provider with LocalStorage persistence
├── hooks/
│   ├── useScientificSources.ts      # Custom hook for filtering and managing sources
│   ├── useScientificClaims.ts       # Custom hook for claims and source relationships
│   ├── useCitations.ts              # Custom hook for formatted citations & BibTeX
│   ├── useProvenance.ts             # Custom hook for insight lineage graph traversal
│   ├── useEvidence.ts               # Custom hook for granular evidence records
│   ├── useValidation.ts             # Custom hook for automated validation & duplicates
│   └── useAudit.ts                  # Custom hook for activity audit log
├── services/
│   ├── citationService.ts           # APA, IEEE, Vancouver, Harvard, BibTeX formatter
│   ├── sourceValidationService.ts   # URL, DOI, dataset ID normalization & verification
│   ├── nasaDiscoveryService.ts      # Curated NASA records and official portal registry
│   └── reportService.ts             # Markdown, JSON, and CSV dossier generator
├── types/
│   ├── source.types.ts              # ScientificSource, SourceType, ResearchDomain
│   ├── claim.types.ts               # ScientificClaim, ClaimStatus, ClaimCategory
│   ├── evidence.types.ts            # EvidenceRecord, EvidenceType, SupportingRelationship
│   ├── citation.types.ts            # CitationStyle, FormattedCitation
│   ├── provenance.types.ts          # InsightProvenance, ProvenanceMethod, SimulationStatus
│   ├── validation.types.ts          # ValidationStatus, SourceValidationResult
│   ├── dataset.types.ts             # DatasetAttribution (NASA OSDR)
│   ├── audit.types.ts               # ActivityRecord, AuditAction
│   └── report.types.ts              # ResearchReportConfig, GeneratedReport
├── data/
│   ├── demoSources.ts               # Authentic NASA HRP, Science, and OSDR sources
│   ├── demoClaims.ts                # Verified spaceflight biomedical assertions
│   ├── demoEvidence.ts             # Granular astronaut and rodent study evidence records
│   ├── demoInsights.ts             # Cross-module insights (including Gemini AI summaries)
│   └── demoDatasets.ts             # NASA OSDR-379, OSDR-194, OSDR-421, OSDR-137
├── __tests__/
│   └── provenance.test.ts           # Vitest unit & integration test suite
└── index.ts                         # Clean public API for AstroCare master integration
```

---

## 3. Dependencies
The module requires minimal, non-conflicting dependencies:
```json
{
  "dependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "lucide-react": "^1.73.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "vitest": "^5.0.0"
  }
}
```

---

## 4. Suggested Routes in AstroCare Master
When merging P16 into the master router (e.g., React Router, TanStack Router), map the following sub-routes:

| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/provenance` | `<ProvenanceOverviewPage />` | Core summary metrics & distribution charts |
| `/provenance/sources` | `<SourceRegistryPage />` | Full scientific source catalog & editor |
| `/provenance/nasa` | `<NASAResearchSourcesPage />` | Official NASA repository discovery & ingestion |
| `/provenance/citations` | `<CitationExplorerPage />` | Multi-standard citation viewer & BibTeX export |
| `/provenance/evidence` | `<EvidenceRecordsPage />` | Granular study classifications and findings |
| `/provenance/claims` | `<ScientificClaimsPage />` | Scientific assertions & claim-to-source linking |
| `/provenance/insights` | `<InsightProvenancePage />` | AI model metadata & multi-step lineage graph |
| `/provenance/datasets` | `<DatasetAttributionPage />` | NASA Open Science Data Repository studies |
| `/provenance/validation` | `<SourceValidationPage />` | Metadata verification & reachability checks |
| `/provenance/duplicates` | `<DuplicateDetectionPage />` | Canonical URL / DOI / OSDR duplicate resolution |
| `/provenance/quality` | `<EvidenceQualityPage />` | Transparent cohort size and methodology matrix |
| `/provenance/reports` | `<ResearchReportsPage />` | Transparency dossier compiler (MD, JSON, CSV) |
| `/provenance/activity` | `<ActivitySettingsPage />` | Audit trail & baseline reset |

---

## 5. Public Exports (`index.ts`)
The entire module is exported cleanly from `src/features/scientific-provenance/index.ts`:
```typescript
import {
  ProvenanceProvider,
  ProvenanceOverviewPage,
  SourceRegistryPage,
  CitationService,
  SourceValidationService,
  ReportService
} from './features/scientific-provenance'
```

---

## 6. How to Selectively Merge P16 into AstroCare Master

### Step 1: Copy Feature Directory
Copy the entire `src/features/scientific-provenance/` folder directly into the AstroCare master project's `src/features/` folder.

### Step 2: Wrap Master Route or Provider Tree
In your master application or route layout, wrap the `/provenance` route branch in `<ProvenanceProvider>`:
```tsx
import { ProvenanceProvider } from '@/features/scientific-provenance'

export function ProvenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProvenanceProvider>
      {children}
    </ProvenanceProvider>
  )
}
```

### Step 3: Connect with Gemini AI (P15) and Telemetry Modules
To trace an insight generated by another AstroCare module (such as **P15 Gemini AI**, **P08 Cardiovascular**, or **P12 Radiation**), call `addInsight()`:
```typescript
import { useScientificProvenance } from '@/features/scientific-provenance'

const { addInsight } = useScientificProvenance()

// When P15 generates a clinical summary:
addInsight({
  id: 'INS-GEMINI-892',
  insightText: 'Observed progressive heart rate variability flattening during EVA prep.',
  generationMethod: 'ai_generated_interpretation',
  relatedHealthDomain: 'cardiovascular',
  relatedDatasetIds: ['OSDR-379'],
  supportingSourceIds: ['SRC-NASA-EVD-CARD-007'],
  createdAt: new Date().toISOString(),
  retrievalDate: new Date().toISOString().split('T')[0],
  aiModelMetadata: {
    modelName: 'Gemini-1.5-Pro Aerospace BioMedical',
    promptVersion: 'v2.4-cardio-synthesis',
    temperature: 0.2,
    confidenceScore: 0.88,
  },
  simulationStatus: 'authentic_flight_data',
  reviewStatus: 'under_review',
  moduleOrigin: 'P15_GeminiAI'
})
```

---

## 7. Scientific Integrity Guarantees
- **No Fabricated Sources or Identifiers:** Every initial record corresponds to real, authentic NASA Human Research Program documents, technical papers, or OSDR multi-omics datasets.
- **No Synthetic Quality Scores:** The module rejects arbitrary numerical scores in favor of transparent study population disclosures, sample size reporting, and acknowledged scientific limitations.
- **Clear AI Boundary:** The module strictly enforces that citations attached to generative AI outputs do not prove clinical validity without formal expert review.
