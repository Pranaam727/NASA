# AstroCare P12 — Component Exports

The following components are exported for integration into the Master AstroCare application:

## 1. Executive Dashboard Widgets

Export location: `src/components/dashboard/index.ts`

| Component | Props | Description |
| :--- | :--- | :--- |
| `ImmuneHealthSummary` | `astronautId?: string; onNavigateToModule?: () => void;` | Displays WBC, CD4/CD8 ratio, NK cytotoxicity % with monitoring state pill. |
| `BiomarkerSummary` | `astronautId?: string; onNavigateToModule?: () => void;` | Displays IL-6, hs-CRP, and Salivary Cortisol levels with shift indicator. |
| `LaboratoryStatusSummary` | `astronautId?: string; onNavigateToModule?: () => void;` | Displays biospecimen inventory, analyzed samples, and cryogenic status. |
| `ImmuneAlertSummary` | `astronautId?: string; onNavigateToModule?: () => void;` | Displays unresolved alert count and top active surveillance notice. |

## 2. Reusable Visual Components

Export location: `src/components/shared/`

| Component | Props | Description |
| :--- | :--- | :--- |
| `StateBadge` | `state: MonitoringState \| ResultInterpretation; size?: 'sm' \| 'md' \| 'lg';` | Standard color-coded telemetry status pill. |
| `DataOriginBadge` | `origin: DataOrigin \| string;` | Explicit visual distinction for SIMULATED vs NASA OPEN SCIENCE data. |
| `MetricCard` | `title: string; value: number \| string; unit: string; baselineValue?: number; ...` | Comprehensive metric card with baseline change and reference ranges. |

## 3. Full Pages & Routes

Export location: `src/features/` & `src/routes/AppRoutes.tsx`

| Page Component | Path | Description |
| :--- | :--- | :--- |
| `ImmuneDashboardPage` | `/immune` | Primary executive monitoring hub. |
| `ImmuneCellsPage` | `/immune/cells` | Cytometric leukocyte and lymphocyte subsets. |
| `BiomarkersPage` | `/immune/biomarkers` | Multiplex cytokines, acute-phase reactants, stress markers. |
| `SampleManagementPage` | `/immune/laboratory` | Laboratory specimen chain of custody and tracking. |
| `LaboratoryResultsPage` | `/immune/results` | Diagnostic assay table with filtering and CSV export. |
| `LongitudinalAnalysisPage` | `/immune/longitudinal` | Trajectory kinetics, zero-baseline safe comparisons. |
| `AlertEnginePage` | `/immune/alerts` | Rules-based surveillance and dispatch. |
| `ResearchInsightsPage` | `/immune/insights` | Educational scientific briefing. |
| `NasaResearchExplorerPage` | `/immune/research` | Curated NASA OSDR open science catalogue. |
