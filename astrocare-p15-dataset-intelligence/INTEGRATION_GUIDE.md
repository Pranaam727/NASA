# ASTROCARE P15 — NASA BIOMEDICAL DATASET INTELLIGENCE
## Selective Integration Architecture & Master Application Merge Guide

---

### 1. Module Purpose

**P15 (NASA Biomedical Dataset Intelligence)** is an aerospace research intelligence module developed for the **AstroCare** spaceflight health platform. It provides genuine data exploration, multi-omics indexing, file inspection, longitudinal tracking, and comparative scientific analytics powered by the **NASA Open Science Data Repository (OSDR)** (formerly GeneLab & ALSDA).

Key capabilities:
- **Direct OSDR Integration**: Real-time study search, REST API metadata retrieval (`/osd/meta/{id}`), file manifest inspection (`/osd/files/{id}`), and download links.
- **Strict Biological Population Classification**: Prevents scientific conflation between human astronaut flight studies, terrestrial analogs, animal models (*Mus musculus*), and in vitro cell cultures.
- **Comparative Scientific Integrity Engine**: Automatically evaluates biological comparability between studies and blocks cross-species or cross-modal numerical merging with scientific rationales.
- **Longitudinal Phase Analysis**: Maps physiological trajectories across Preflight (L-44, L-3), Inflight (FD-2), and Postflight (R+1, R+3, R+82) sampling epochs.
- **Data Visualization Studio**: Interactive line graphs, grouped bar charts, scatter plots, and underlying raw observation matrices with unit-preserving CSV/JSON export.
- **Automated Research Dossier Generator**: Assembles multi-study intelligence summaries in Markdown, CSV, and print-ready formats.

---

### 2. Isolated Folder Structure

All P15 module code is completely contained inside `src/features/nasa-dataset-intelligence/`, designed to be dropped directly into the AstroCare master project without modifying existing P01–P14 code:

```
src/features/nasa-dataset-intelligence/
├── components/
│   ├── DatasetCard.tsx               # Reusable study card with tags, metrics & actions
│   ├── DatasetComparisonPanel.tsx     # Side-by-side matrix & 5-point compatibility checks
│   ├── DatasetDetailPanel.tsx         # Full-screen modal with ISA-TAB metadata & tabs
│   ├── DatasetFileExplorer.tsx        # File manifest, sizes, categories & download links
│   ├── DatasetMetadataTable.tsx       # Compact sortable table view of catalogued studies
│   ├── DatasetSearchFilters.tsx       # Multi-parameter search & domain filtering controls
│   ├── DatasetSummaryCards.tsx        # Top telemetry KPI cards with source provenance badges
│   ├── DataVisualizationPanel.tsx     # Recharts studio with chart switcher & cohort stats
│   ├── Navbar.tsx                     # Top navigation with live OSDR telemetry status
│   ├── ResearchTimeline.tsx           # Mission chronology & sampling epoch visualization
│   ├── Sidebar.tsx                    # 15-section aerospace navigation sidebar
│   └── StatusBadge.tsx                # Provenance, population model & availability badges
├── data/
│   ├── benchmarkDatasets.ts           # Authentic NASA OSDR studies (OSD-575, 53, 2, 4, 661, etc.)
│   └── demoObservations.ts            # Genuine biological measurements across flight epochs
├── hooks/
│   ├── useDatasetComparison.ts        # Comparison state management & validation hook
│   ├── useDatasetMetadata.ts          # Single-study retrieval & file manifests hook
│   ├── useDatasetSearch.ts            # Search, filter, pagination & latency tracking hook
│   └── useLongitudinalData.ts         # Epoch time-series filtering & cohort averaging hook
├── pages/
│   ├── BiomedicalResearchPage.tsx     # 10 NASA HRP health risk domains & variables
│   ├── BoneMuscleResearchPage.tsx     # Densitometry, trabecular bone loss, GSK3 targets
│   ├── CardiovascularResearchPage.tsx # Cephalic fluid shift & hs-cTnI troponin kinetics
│   ├── ComparativeAnalyticsPage.tsx   # Cross-study comparative analytics workspace
│   ├── DatasetCataloguePage.tsx       # Multi-category catalogue with grid/table toggle
│   ├── DatasetDetailPage.tsx          # Standalone drilldown view for individual studies
│   ├── DatasetExplorerPage.tsx        # Real-time NASA OSDR repository query interface
│   ├── DatasetOverviewPage.tsx        # Executive dashboard & study distribution charts
│   ├── HumanStudiesPage.tsx           # Certified human astronaut & bed rest analog studies
│   ├── ImmuneResearchPage.tsx         # Thymic involution, cytokine arrays & LPS challenges
│   ├── LongitudinalAnalysisPage.tsx   # Temporal trajectories across L-, FD-, and R- epochs
│   ├── RadiationResearchPage.tsx      # GCR, HZE iron ion tracks & DNA repair foci kinetics
│   ├── ResearchReportsPage.tsx        # Research dossier builder with Markdown/CSV exports
│   ├── SettingsPage.tsx               # Upstream API endpoint & provider mode configuration
│   └── SleepBehavioralPage.tsx        # Circadian clock genes (PER1/BMAL1) & neuro-inflammation
├── services/
│   ├── dataNormalizationService.ts    # Iso-molar unit conversions & cohort statistics
│   ├── datasetComparisonService.ts    # 5-point scientific compatibility evaluation engine
│   ├── nasaOsdrService.ts             # NASA OSDR API client with dev proxy & fallback
│   └── reportExportService.ts         # Markdown, CSV, and structured report synthesis
├── types/
│   ├── comparison.types.ts            # Compatibility report & validation schemas
│   ├── dataset.types.ts               # DatasetRecord, DatasetFile, SearchFilter schemas
│   ├── observation.types.ts           # MeasurementVariable & ResearchObservation schemas
│   └── research.types.ts             # ResearchReportData & ProviderSettings schemas
└── index.ts                           # Single barrel export for all P15 components & services
```

---

### 3. Dependencies

P15 requires the following standard dependencies:

```json
{
  "dependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0",
    "lucide-react": "^0.475.0 || ^1.16.0",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0 || ^19.0.0",
    "@types/react-dom": "^18.2.0 || ^19.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0",
    "vitest": "^3.0.0"
  }
}
```

---

### 4. Application Routes

When integrating P15 into the master AstroCare React Router / TanStack Router:

| Route Path | Component | Description |
|---|---|---|
| `/datasets` | `DatasetOverviewPage` | Executive telemetry dashboard & study distributions |
| `/datasets/explorer` | `DatasetExplorerPage` | Live NASA OSDR search & schema parsing |
| `/datasets/catalogue` | `DatasetCataloguePage` | Catalogued studies with grid/table view |
| `/datasets/:studyId` | `DatasetDetailPage` | Dedicated study accession inspection page |
| `/datasets/biomedical` | `BiomedicalResearchPage` | 10 NASA HRP biomedical risk domains |
| `/datasets/human-studies` | `HumanStudiesPage` | Authenticated astronaut & analog studies |
| `/datasets/immune` | `ImmuneResearchPage` | Cytokines, thymic atrophy & immune dysregulation |
| `/datasets/radiation` | `RadiationResearchPage` | GCR, HZE Fe-56 ions & DNA double-strand breaks |
| `/datasets/cardiovascular`| `CardiovascularResearchPage` | Fluid shifts, cardiac troponin & orthostatic risk |
| `/datasets/bone-muscle` | `BoneMuscleResearchPage` | Trabecular bone mineral density & GSK3 targets |
| `/datasets/sleep-behavioral`| `SleepBehavioralPage` | Circadian clock genes & neuro-behavioral health |
| `/datasets/comparison` | `ComparativeAnalyticsPage` | Multi-study comparative workspace & validator |
| `/datasets/longitudinal` | `LongitudinalAnalysisPage` | Preflight, inflight & postflight trajectory studio |
| `/datasets/visualization`| `VisualizationStudioPage` | Recharts interactive studio with CSV export |
| `/datasets/reports` | `ResearchReportsPage` | Automated research dossier generator |
| `/datasets/settings` | `SettingsPage` | OSDR endpoint, CORS proxy & offline configuration |

---

### 5. Public Barrel Exports (`index.ts`)

Everything needed from P15 is cleanly exported from `src/features/nasa-dataset-intelligence/index.ts`:

```typescript
import {
  DatasetOverviewPage,
  DatasetExplorerPage,
  ComparativeAnalyticsPage,
  LongitudinalAnalysisPage,
  NasaOsdrService,
  DatasetComparisonService,
  type DatasetRecord,
  type ResearchObservation
} from './features/nasa-dataset-intelligence';
```

---

### 6. Key TypeScript Interfaces

#### `DatasetRecord`
```typescript
export interface DatasetRecord {
  studyId: string; // e.g. "OSD-575"
  title: string;
  description: string;
  organism: string; // e.g. "Homo sapiens", "Mus musculus"
  studyType: 'human-spaceflight' | 'human-analog' | 'animal' | 'cell-culture' | 'microbial' | 'other';
  mission: string;
  flightProgram: string;
  experimentPlatform: string;
  sampleTypes: string[];
  assayTypes: string[];
  technologyPlatforms: string[];
  factors: FactorItem[];
  protocols: ProtocolItem[];
  publications: PublicationItem[];
  availableFiles: DatasetFile[];
  sourceUrl: string;
  metadataRetrievedAt: string;
  provenance: 'LIVE_NASA_API' | 'CACHED_NASA_BENCHMARK' | 'SYNTHETIC_DEMO';
  primaryDomain: string;
  publicReleaseDate?: string;
  sampleCount?: number;
  managingCenter?: string;
}
```

#### `ResearchObservation`
```typescript
export interface ResearchObservation {
  observationId: string;
  studyId: string;
  variableId: string;
  variableName: string;
  numericValue: number;
  originalUnit: string;
  collectionPhase: 'Preflight' | 'Inflight' | 'Postflight' | 'Ground Control' | 'Analog Confinement';
  phaseDay: number; // e.g. -44, 2, 1, 82
  phaseDayLabel: string; // "L-44", "FD-2", "R+1", "R+82"
  sampleId: string;
  subjectId: string;
  organism: string;
  studyPopulation: string;
  experimentalCondition: string;
}
```

---

### 7. NASA OSDR Integration Details

NASA OSDR provides public spaceflight biomedical datasets:
- **Search API**: `https://osdr.nasa.gov/osdr/data/search?term={query}&from={offset}&size={limit}`
- **Study Metadata**: `https://osdr.nasa.gov/osdr/data/osd/meta/{id}`
- **Study Files**: `https://osdr.nasa.gov/osdr/data/osd/files/{id}`

#### Dev Proxy Configuration (`vite.config.ts`)
Because NASA's public endpoints do not emit permissive browser CORS headers (`Access-Control-Allow-Origin: osdr.nasa.gov`), Vite dev proxy routes `/api/osdr` to `https://osdr.nasa.gov/osdr/data`:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api/osdr': {
      target: 'https://osdr.nasa.gov/osdr/data',
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api\/osdr/, ''),
      secure: false,
    },
  },
}
```

---

### 8. Dataset Provider Configuration & Fallback Policy

The `NasaOsdrService` implements a three-tier provider pattern:
1. **Live Proxy Query**: Queries `/api/osdr` with a 4500ms timeout.
2. **Direct Fallback**: If proxy is unavailable, attempts direct fetch.
3. **Verified Benchmark Fallback**: If network is offline, air-gapped, or rate-limited, immediately returns verified authentic NASA OSDR records (`OSD-575`, `OSD-53`, `OSD-2`, `OSD-4`, `OSD-661`, etc.) with a clear `CACHED_NASA_BENCHMARK` badge.

---

### 9. Data Normalization & Preserved Scientific Units

The `DataNormalizationService`:
- Validates dimensional compatibility before any conversion.
- Permits iso-molar concentration identity mappings: `1 pg/mL = 1 ng/L`.
- Converts cortisol `µg/dL` to `nmol/L` using hydrocortisone molecular mass (362.46 g/mol).
- **Strictly rejects cross-domain conversions**: Attempts to convert bone mineral density (`mg/cm³`) to blood concentrations (`pg/mL`) are rejected with an explicit violation error.
- All visualizations retain original scientific units.

---

### 10. Scientific Comparison Limitations

The `DatasetComparisonService` enforces a mandatory 5-point verification checklist before allowing multi-study data merging:
1. **Organism Compatibility**: Living human astronauts and animal models (*Mus musculus*) cannot be merged into a single cohort.
2. **Study Population Model**: In vitro cell cultures under beamline radiation cannot be pooled with whole-organism astronaut cohorts.
3. **Unit Consistency**: Physical dimensions must match.
4. **Gravitational / Environmental Context**: Orbital microgravity is distinguished from 1G terrestrial baselines and bed rest simulations.
5. **Temporal Phase Mapping**: Preflight baseline, inflight microgravity, and postflight recovery are preserved as distinct epochs.

If any check fails, **direct numerical merging is blocked** and an explanatory warning banner is displayed alongside a side-by-side metadata evaluation matrix.

---

### 11. Step-by-Step Selective Integration into Master AstroCare

To selectively integrate P15 into the AstroCare master repository:

1. **Copy Module Folder**:
   Copy `src/features/nasa-dataset-intelligence/` into the master repository under `src/features/nasa-dataset-intelligence/`.

2. **Add Dev Proxy to Master `vite.config.ts`**:
   Add the `/api/osdr` proxy configuration into your master Vite configuration:
   ```typescript
   proxy: {
     '/api/osdr': {
       target: 'https://osdr.nasa.gov/osdr/data',
       changeOrigin: true,
       rewrite: (p) => p.replace(/^\/api\/osdr/, ''),
     },
   }
   ```

3. **Register Routes in Master Router**:
   In your master routing file (e.g. `src/routes.tsx` or `AppRouter.tsx`):
   ```typescript
   import {
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
     SettingsPage
   } from '@/features/nasa-dataset-intelligence';

   export const p15Routes = [
     { path: '/datasets', element: <DatasetOverviewPage ... /> },
     { path: '/datasets/explorer', element: <DatasetExplorerPage ... /> },
     { path: '/datasets/catalogue', element: <DatasetCataloguePage ... /> },
     { path: '/datasets/comparison', element: <ComparativeAnalyticsPage ... /> },
     { path: '/datasets/longitudinal', element: <LongitudinalAnalysisPage ... /> },
     { path: '/datasets/visualization', element: <VisualizationStudioPage ... /> },
     { path: '/datasets/reports', element: <ResearchReportsPage ... /> },
     { path: '/datasets/settings', element: <SettingsPage /> },
   ];
   ```

4. **Add Navigation Entry in Master Sidebar**:
   Add the `NASA OSDR Intelligence` parent item in your master sidebar, routing to `/datasets`.

5. **Run Tests**:
   ```bash
   npm test
   ```

*No global CSS, master navigation router, or P01–P14 code is overwritten or disrupted.*
