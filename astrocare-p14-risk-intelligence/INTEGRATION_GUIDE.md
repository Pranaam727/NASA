# AstroCare P14 — Integration Guide

> **Module**: P14 Human-Spaceflight Risk Intelligence  
> **Target**: AstroCare Master Application Integration  
> **Author**: Aerospace Biomedical Software Engineering Team  

---

## 1. Module Purpose

AstroCare P14 provides an independent, self-contained biomedical risk intelligence platform focused on NASA Human Research Program (HRP) evidence, risk categories, flight countermeasures, Open Science Data Repository (OSDR) discovery, and mission-related health analysis.

It is designed following the **Isolated Feature Pattern**:
- All code resides strictly under `src/features/risk-intelligence/`.
- Zero assumptions about modules P01 through P13.
- No modifications required to the master application's global CSS, base HTML, or state stores.
- Completely pluggable into the master application router under `/risks/*`.

---

## 2. Folder Structure

```
src/
└── features/
    └── risk-intelligence/
        ├── components/
        │   ├── EvidenceCard.tsx              # Reusable evidence card with classification badges
        │   ├── EvidenceDetailPanel.tsx       # Slide-over modal with full methodology & limitations
        │   ├── HeaderNav.tsx                 # Top navigation bar with search & active mission status
        │   ├── MissionConfiguration.tsx      # Configurator form for mission duration, radiation & gravity
        │   ├── MitigationCard.tsx            # Countermeasure card with readiness badge & residual risk
        │   ├── ResearchTimeline.tsx          # Interactive chronological timeline of NASA discoveries
        │   ├── RiskCategoryCard.tsx          # Reusable risk category card with system tags
        │   ├── RiskComparisonChart.tsx       # Interactive SVG analytics comparing evidence & vulnerability
        │   ├── RiskSummaryCards.tsx          # Top quantitative metric summary cards
        │   └── SidebarNav.tsx                # Professional 14-item responsive sidebar navigation
        │
        ├── data/
        │   ├── missionProfiles.ts            # Presets: ISS, Artemis Lunar Surface, Mars Conjunction 1000d
        │   ├── nasaEvidenceLibrary.ts        # Verified NASA HRP flight & analog research records
        │   ├── nasaMitigations.ts            # Operational flight rules & advanced countermeasures
        │   ├── nasaOsdrDatasets.ts           # Curated authentic NASA OSDR study records (OSD-37, etc.)
        │   ├── nasaRiskCategories.ts         # Complete definitions for all 8 NASA HRP risk categories
        │   └── researchInsights.ts           # Deep mechanistic scientific syntheses
        │
        ├── hooks/
        │   ├── useMissionRiskAnalysis.ts     # Mission configuration & side-by-side comparison state
        │   ├── useResearchSearch.ts          # OSDR query hook with live API and curated cache fallback
        │   └── useRiskEvidence.ts            # Multi-dimensional evidence filtering & sorting hook
        │
        ├── pages/
        │   ├── BoneMuscleRiskPage.tsx        # Bone demineralization & muscle atrophy deep dive
        │   ├── CardiovascularRiskPage.tsx    # Fluid shifts, LV remodeling, IJV thrombosis, orthostatic
        │   ├── EvidenceLibraryPage.tsx       # Structured research library with multi-filter explorer
        │   ├── ImmuneRiskPage.tsx            # TCR suppression, latent herpesvirus reactivation (EBV/CMV)
        │   ├── MissionRiskAnalysisPage.tsx   # Mission risk analysis & side-by-side comparison
        │   ├── MitigationStrategiesPage.tsx  # Countermeasures across all modalities
        │   ├── RadiationRiskPage.tsx         # GCR, SPE, Van Allen belts, 600 mSv career limit
        │   ├── ResearchExplorerPage.tsx      # NASA OSDR dataset discovery and file explorer
        │   ├── ResearchInsightsPage.tsx      # Mechanistic biomedical Q&A syntheses
        │   ├── RiskCategoriesPage.tsx        # Catalog of 8 categories with cross-system comparison
        │   ├── RiskOverviewPage.tsx          # Comprehensive spaceflight risk overview dashboard
        │   ├── SettingsPage.tsx              # Endpoint status, cache management, JSON export
        │   ├── SleepPsychologicalRiskPage.tsx# Circadian disruption, isolation, Earth-out-of-view
        │   └── VisionNeurologicalRiskPage.tsx# SANS, translaminar pressure inversion, MTHFR variants
        │
        ├── services/
        │   ├── nasaOsdrService.ts            # Live OSDR API search with graceful offline fallback
        │   ├── nasaResearchService.ts        # Category retrieval, evidence filtering, comparison logic
        │   └── riskAnalysisService.ts        # Qualitative mission evaluation & delta comparison
        │
        ├── types/
        │   ├── evidence.types.ts             # StudyClassification, ResearchEvidence, FilterState
        │   ├── mission.types.ts              # MissionProfile, RiskRelevanceAssessment, MissionReport
        │   ├── mitigation.types.ts           # MitigationReadiness, MitigationStrategy
        │   ├── osdr.types.ts                 # OSDRStudy, OSDRSearchResponse
        │   └── risk.types.ts                 # RiskCategory, BiologicalMechanism, RiskComparison
        │
        └── index.ts                          # Unified public feature entrypoint
```

---

## 3. Dependencies

P14 has a minimal, modern dependency footprint:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  }
}
```

*Note: P14 does not require heavy canvas charting libraries (Chart.js / Recharts) because it uses custom, bulletproof, tooltipped responsive SVG charting components that avoid external canvas crashes or SSR issues.*

---

## 4. Route Mapping

When mounting P14 into the master AstroCare application router (e.g. React Router v6 or Next.js App Router):

| Route Path | Component | Description |
|---|---|---|
| `/risks` | `<RiskOverviewPage />` | Main Spaceflight Risk Intelligence Dashboard |
| `/risks/categories` | `<RiskCategoriesPage />` | All 8 HRP Risk Categories with multi-domain comparison |
| `/risks/cardiovascular` | `<CardiovascularRiskPage />` | Dedicated Cardiovascular risks, IJV thrombosis, orthostatic intolerance |
| `/risks/bone-muscle` | `<BoneMuscleRiskPage />` | Bone demineralization & muscle atrophy deep dive |
| `/risks/radiation` | `<RadiationRiskPage />` | GCR, SPEs, trapped belts, and 600 mSv career limit |
| `/risks/immune` | `<ImmuneRiskPage />` | T-cell suppression, latent herpesvirus shedding (EBV, CMV, VZV) |
| `/risks/sleep-psychological` | `<SleepPsychologicalRiskPage />` | Circadian disruption, 90-min orbit cycle, isolation, Earth-out-of-view |
| `/risks/vision-neurological` | `<VisionNeurologicalRiskPage />` | SANS, optic disc edema, posterior globe flattening, one-carbon genetics |
| `/risks/evidence` | `<EvidenceLibraryPage />` | Structured NASA Evidence Library with multi-filter explorer |
| `/risks/research` | `<ResearchExplorerPage />` | NASA Open Science Data Repository (OSDR) dataset discovery |
| `/risks/mitigation` | `<MitigationStrategiesPage />` | Operational and advanced countermeasures catalog |
| `/risks/mission-analysis` | `<MissionRiskAnalysisPage />` | Interactive mission configurator & side-by-side comparative analysis |
| `/risks/insights` | `<ResearchInsightsPage />` | Mechanistic aerospace biomedical Q&A explainers |
| `/risks/settings` | `<SettingsPage />` | Endpoint status, cache management, and data export |

---

## 5. Public Exports

The entire feature is exported through `src/features/risk-intelligence/index.ts`:

```typescript
import {
  // Pages
  RiskOverviewPage,
  RiskCategoriesPage,
  RadiationRiskPage,
  CardiovascularRiskPage,
  BoneMuscleRiskPage,
  ImmuneRiskPage,
  SleepPsychologicalRiskPage,
  VisionNeurologicalRiskPage,
  EvidenceLibraryPage,
  ResearchExplorerPage,
  MitigationStrategiesPage,
  MissionRiskAnalysisPage,
  ResearchInsightsPage,
  SettingsPage,

  // Reusable Components
  RiskSummaryCards,
  RiskCategoryCard,
  EvidenceCard,
  EvidenceDetailPanel,
  MitigationCard,
  MissionConfiguration,
  RiskComparisonChart,
  ResearchTimeline,

  // Services
  NasaResearchService,
  NasaOsdrService,
  RiskAnalysisService,

  // Types
  type RiskCategory,
  type ResearchEvidence,
  type MitigationStrategy,
  type MissionProfile,
  type OSDRStudy
} from './features/risk-intelligence';
```

---

## 6. Core TypeScript Interfaces

### `RiskCategory`
```typescript
export interface RiskCategory {
  id: string;
  code: HrpRiskCode; // 'RAD' | 'CARDIO' | 'BONE' | 'MUSCLE' | 'IMMUNE' | 'SLEEP' | 'BEHAVIOR' | 'SANS'
  title: string;
  shortDescription: string;
  fullDescription: string;
  physiologicalSystem: PhysiologicalSystem[];
  mechanisms: BiologicalMechanism[];
  missionRelevance: MissionRelevanceMatrix;
  evidenceIds: string[];
  mitigationIds: string[];
  hrpRiskUrl: string;
  primaryHrpCategory: string;
  severityFactors: string[];
  keyVulnerabilities: string[];
  evidenceQualitySummary: {
    astronautStudiesCount: number;
    groundAnalogCount: number;
    animalStudiesCount: number;
    cellModelCount: number;
    overallCertaintyBasis: string;
  };
  accentColor: string;
  iconName: string;
}
```

### `ResearchEvidence`
```typescript
export interface ResearchEvidence {
  id: string;
  evidenceCode: string;
  title: string;
  sourceOrganization: string;
  publicationDate: string;
  studyType: StudyClassification; // 'astronaut_human' | 'ground_analog' | 'animal_model' | ...
  population: string;
  sampleSize: string;
  organism: string;
  methodology: string;
  experimentalEnvironment: string;
  measurementMethods: string;
  findings: string;
  limitations: string;
  generalizability: string;
  sourceUrl: string;
  doi?: string;
  ntrsId?: string;
  osdrId?: string;
  relatedRiskIds: string[];
  missionContext?: string;
  isDirectHumanEvidence: boolean;
}
```

### `MitigationStrategy`
```typescript
export interface MitigationStrategy {
  id: string;
  code: string;
  title: string;
  category: MitigationCategory;
  readiness: MitigationReadiness; // 'OPERATIONAL' | 'VALIDATED_ANALOG' | 'ADVANCED_RESEARCH' | 'CONCEPTUAL'
  targetRiskIds: string[];
  scientificRationale: string;
  protocolDescription: string;
  hardwareOrTechnology?: string[];
  supportingEvidenceIds: string[];
  evidenceLimitations: string;
  missionApplicability: {
    leo: string;
    lunar: string;
    mars: string;
  };
  residualRiskNote: string;
  references: { title: string; source: string; url: string; year: number }[];
}
```

---

## 7. NASA Research Integrations

P14 integrates with four official NASA resources:
1. **NASA Human Research Program (HRP)**: Direct references to HRP risk roadmaps (`https://humanresearchroadmap.nasa.gov/Risks/`).
2. **NASA Technical Reports Server (NTRS)**: Direct links to official NASA technical memos (`https://ntrs.nasa.gov/citations/`).
3. **NASA Open Science Data Repository (OSDR)**: Direct links to biological studies (`https://osdr.nasa.gov/bio/repo/data/studies/OSD-{ID}`).
4. **Peer-Reviewed Aerospace Publications**: Validated DOIs to publications in *Science*, *Nature*, *Journal of Applied Physiology*, *JAMA Network Open*, *Ophthalmology*, and *Frontiers in Microbiology*.

---

## 8. NASA OSDR Integration Architecture

The `NasaOsdrService` implements a resilient multi-tier fetch adapter:

```
User Query / Filter
        │
        ▼
Attempt Live Fetch (4000ms timeout)
https://osdr.nasa.gov/osdr/data/search
        │
   ┌────┴──────────────────────────┐
   │ Success                       │ Network failure / CORS block / Timeout
   ▼                               ▼
Map live JSON hits              Serve curated authentic OSDR cache
(Payload, Assays, Organism)     (OSD-37, OSD-104, OSD-120, OSD-137, OSD-254, etc.)
   │                               │
   └───────────────┬───────────────┘
                   ▼
     Return unified OSDRSearchResponse
   (with explicit data source attribution notice)
```

---

## 9. Steps for Selective Integration into AstroCare Master

### Step 1: Copy Feature Directory
Copy the directory `src/features/risk-intelligence/` into the master AstroCare project under `src/features/risk-intelligence/`.

### Step 2: Ensure Peer Dependencies
Ensure `lucide-react` is present in the master `package.json`. If not, run:
```bash
npm install lucide-react
```

### Step 3: Register Routes in Master Router
In the master AstroCare router (e.g. `AppRoutes.tsx` or `router.tsx`):

```tsx
import { 
  RiskOverviewPage, 
  RiskCategoriesPage,
  RadiationRiskPage,
  CardiovascularRiskPage,
  BoneMuscleRiskPage,
  ImmuneRiskPage,
  SleepPsychologicalRiskPage,
  VisionNeurologicalRiskPage,
  EvidenceLibraryPage,
  ResearchExplorerPage,
  MitigationStrategiesPage,
  MissionRiskAnalysisPage,
  ResearchInsightsPage,
  SettingsPage 
} from '@/features/risk-intelligence';

// Add to your Route definitions:
<Route path="/risks" element={<RiskOverviewPage onNavigate={navigate} />} />
<Route path="/risks/categories" element={<RiskCategoriesPage onNavigate={navigate} />} />
<Route path="/risks/radiation" element={<RadiationRiskPage onNavigate={navigate} />} />
<Route path="/risks/cardiovascular" element={<CardiovascularRiskPage onNavigate={navigate} />} />
<Route path="/risks/bone-muscle" element={<BoneMuscleRiskPage onNavigate={navigate} />} />
<Route path="/risks/immune" element={<ImmuneRiskPage onNavigate={navigate} />} />
<Route path="/risks/sleep-psychological" element={<SleepPsychologicalRiskPage onNavigate={navigate} />} />
<Route path="/risks/vision-neurological" element={<VisionNeurologicalRiskPage onNavigate={navigate} />} />
<Route path="/risks/evidence" element={<EvidenceLibraryPage onNavigate={navigate} />} />
<Route path="/risks/research" element={<ResearchExplorerPage onNavigate={navigate} />} />
<Route path="/risks/mitigation" element={<MitigationStrategiesPage onNavigate={navigate} />} />
<Route path="/risks/mission-analysis" element={<MissionRiskAnalysisPage onNavigate={navigate} />} />
<Route path="/risks/insights" element={<ResearchInsightsPage onNavigate={navigate} />} />
<Route path="/risks/settings" element={<SettingsPage onNavigate={navigate} />} />
```

### Step 4: Add Navigation Item to Master Sidebar
In the master AstroCare sidebar, add an entry pointing to `/risks`:
- **Label**: "Risk Intelligence (HRP)"
- **Icon**: `ShieldAlert` or `Activity`
- **Route**: `/risks`

---

## 10. Verification of Integration

After integrating:
1. Verify route `/risks` renders the summary cards and risk overview.
2. Verify clicking "Deep Dive" on any category navigates to its respective physiological detail page.
3. Verify evidence library search filters direct astronaut studies.
4. Verify mission risk analysis allows toggling between presets and running side-by-side comparison mode.
5. Verify zero console warnings or styling conflicts.
