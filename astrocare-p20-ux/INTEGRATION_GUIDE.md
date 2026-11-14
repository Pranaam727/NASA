# AstroCare Mission-Wide UI/UX Experience, Design System & Scientific Provenance Integration Guide

**Module Identifier:** `PROMPT 20/21 (P20/21)`  
**Platform:** AstroCare Aerospace Biomedical Intelligence Platform  
**Target:** Mission Control UI/UX Architecture, Design System & NASA Provenance  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts + Lucide Icons  

---

## 1. Executive Summary

This module establishes the unified, mission-control user experience for the **AstroCare** aerospace biomedical intelligence platform. Rather than a disconnected series of disjointed dashboards, P20 delivers:

1. **Mission Control Operational Core:** Real-time Mission Elapsed Time (MET), telemetry downlink status, crew health matrix, active flight surgeon investigations, and an activity audit timeline.
2. **Aerospace Biomedical Design System:** Centralized design tokens supporting both **Dark Mission-Control Mode** and **Light Scientific Workspace Mode**, controlled status colors, and WCAG 2.2 Level AA accessibility compliance.
3. **NASA Scientific Source Integration:** Traceable, non-hallucinated research provenance referencing official NASA repositories:
   - NASA Human Research Program (HRP)
   - NASA Open Science Data Repository (OSDR)
   - NASA OSDR Metadata Schema & ISA-Tab Guidelines
   - NASA Life Sciences Portal (NLSP)
   - NASA Ongoing Human Research Directory
   - NASA Web & Digital Accessibility Policy
   - NASA Web Design System (NASA WDS)
4. **Data Provenance & Quality Badging:** Strict visual demarcation distinguishing `LIVE TELEMETRY`, `SIMULATED DATA`, `NASA RESEARCH SOURCE`, `DERIVED METRIC`, `AI-GENERATED INTERPRETATION`, `DETERMINISTIC FALLBACK`, and `INCOMPLETE DATA`.
5. **Information Architecture & Route Contracts:** 5 primary navigation groups with clear typed contracts and placeholders for external P-modules (`P05`–`P17`).

---

## 2. Directory Structure

```text
astrocare-p20-ux/
├── src/
│   ├── index.ts                 # Master public export barrel for platform integration
│   ├── App.tsx                  # Root application wrapper with ThemeProvider
│   ├── main.tsx                 # Vite DOM mount
│   ├── index.css                # Tailwind v4 styles, telemetry radar grid, custom scrollbars
│   ├── design-system/
│   │   ├── tokens.ts            # Centralized design tokens (colors, typography, dimensions)
│   │   ├── ThemeContext.tsx     # ThemeMode provider (Dark / Light) with high-contrast toggle
│   │   └── utils.ts             # cn() class merge, accessible focus rings, card surfaces
│   ├── types/
│   │   ├── contracts.ts         # Standalone Data Contracts (Mission, Astronaut, HealthMetric, etc.)
│   │   ├── navigation.ts        # Navigation groups, routes, and breadcrumb contracts
│   │   └── index.ts             # Type exports
│   ├── data/
│   │   ├── nasaSources.ts       # Authentic NASA HRP, OSDR, and NLSP research records
│   │   ├── mockMissionData.ts   # Active Expedition 72 mission metadata, alerts, and investigations
│   │   ├── crewRoster.ts        # 4-member astronaut crew profiles with baseline vital ranges
│   │   ├── healthMetrics.ts     # Multi-domain time-series telemetry data with nominal bands
│   │   ├── telemetryEvents.ts   # Chronological activity timeline with category & provenance tags
│   │   ├── navigationTree.ts    # Complete information architecture with P-module routes
│   │   └── mockDataProvider.ts  # Deterministic local provider implementing all contracts
│   ├── components/
│   │   ├── AstroCareMissionControlApp.tsx # Master Mission Control workstation component
│   │   ├── common/              # MissionHeader, MissionSidebar, DetailDrawer, GlobalSearchModal,
│   │   │                        # TelemetryStatus, DataQualityIndicator, DataProvenanceBadge, etc.
│   │   ├── cards/               # CrewMemberCard, HealthMetricCard, AlertSummaryCard
│   │   ├── charts/              # MetricTrendChart, BaselineComparisonChart, MultiMetricComparisonChart
│   │   ├── research/            # ResearchCitationPanel, SourceDetailModal, ScientificSourceBadge
│   │   ├── timeline/            # MissionTimeline with category filtering
│   │   └── views/               # MissionOverviewView, CrewRosterView, VitalMonitoringView,
│   │                            # HealthAnalyticsView, ResearchSourcesView, SettingsView, PlaceholderModuleView
│   └── tests/
│       └── astrocare.test.ts    # Vitest QA suite (Tokens, Routes, NASA Ground Truth, Data Provider)
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── tsconfig.json                # TypeScript solution config
├── tsconfig.app.json            # Application TS compiler options
└── package.json                 # Dependencies and scripts
```

---

## 3. Installation & Standalone Execution

### Prerequisites
- Node.js >= 18.0.0 (tested on v24.14.1)
- npm >= 9.0.0

```bash
# Navigate to module folder
cd astrocare-p20-ux

# Install dependencies
npm install

# Start development server
npm run dev
# -> Opens http://localhost:5174

# Run automated test suite
npm test

# Build production bundle
npm run build
```

---

## 4. Master Platform Integration

### Option A: Mounting the Complete Mission-Control Workstation

Install or copy the module files into the AstroCare master codebase and mount:

```tsx
import React from 'react';
import { 
  AstroCareMissionControlApp, 
  ThemeProvider 
} from './astrocare-p20-ux';

export function AstroCarePlatformRoot() {
  return (
    <ThemeProvider>
      <AstroCareMissionControlApp />
    </ThemeProvider>
  );
}
```

### Option B: Embedding Individual Modular Components

Platform developers can import and use any design-system component independently:

```tsx
import { 
  MetricTrendChart, 
  CrewMemberCard, 
  DataProvenanceBadge, 
  ResearchCitationPanel 
} from './astrocare-p20-ux';

// Rendering a verified scientific trend chart:
<MetricTrendChart 
  metric={astronautHeartRateMetric} 
  height={280} 
/>

// Displaying a strict data provenance badge:
<DataProvenanceBadge type="nasa-research-source" />
```

---

## 5. Standalone Data Contracts & External Module Integration

The module defines clear TypeScript interfaces in `src/types/contracts.ts`.

### External P-Module Route Contracts
For capabilities developed by other engineering teams (`P05`–`P17`), P20 provides documented route placeholders (`PlaceholderModuleView`):

| Module ID | Destination Route | Target Contract Path | Input Data Expected | Output Events |
| :--- | :--- | :--- | :--- | :--- |
| **P05** | Cardiovascular Health | `/health/cardiovascular` | `Astronaut`, `HealthMetric[]` | `onAlertGenerated` |
| **P06** | Bone & Muscle Health | `/health/musculoskeletal` | `Astronaut`, `HealthMetric[]` | `onCountermeasureAdjusted` |
| **P07** | Radiation Monitoring | `/health/radiation` | `Astronaut`, `CPADDosimeter[]` | `onSPEShelterAlert` |
| **P08** | Wellness & Sleep | `/health/sleep-wellness` | `Astronaut`, `ActigraphySession[]` | `onSleepDebtLogged` |
| **P09** | Immune & Laboratory | `/health/immune` | `Astronaut`, `AssayResult[]` | `onViralReactivationFlagged` |
| **P13** | AI Intelligence Assistant | `/intelligence/assistant` | `ChatMessage[]`, `MissionContext` | `onCopilotReply` |
| **P14** | Clinical Copilot | `/intelligence/copilot` | `HealthObservation[]` | `onProtocolPrescribed` |
| **P15** | Anomaly Detection | `/intelligence/anomalies` | `TimeSeriesStream[]` | `onAnomalyDetected` |
| **P16** | Risk Intelligence | `/intelligence/risk-matrix` | `MissionContext`, `CrewRoster[]` | `onRiskUpdated` |
| **P17** | Mission Reports | `/operations/reports` | `MissionSummary`, `DailyShift` | `onReportSigned` |

---

## 6. NASA Scientific Source Model

Every scientific citation implements the `ResearchSource` interface:

```typescript
export interface ResearchSource {
  id: string;
  title: string;
  publishingOrganization: 'NASA Human Research Program' | 'NASA Biological & Physical Sciences' | 'NASA Life Sciences Portal' | 'NASA Headquarters' | 'NASA WDS';
  sourceUrl: string;
  publicationDate?: string;
  accessDate: string;
  researchCategory: string;
  studyIdentifier?: string; // e.g. OSDR-542, NTRS-20210022087
  description: string;
  dataAccessClassification: 'public-open-science' | 'de-identified-human-research' | 'controlled-access-restricted' | 'operational-flight-guideline';
  sourceType: SourceType;
  verifiedGroundTruth: boolean;
  supportedDomains: HealthDomain[];
}
```

---

## 7. Known Limitations & Boundaries

1. **Telemetry is Deterministically Simulated:** In the absence of an active Space Network TDRSS downlink, all in-flight vitals are produced by the local deterministic sample provider (`MockAstroCareDataProvider`). No actual astronaut personal health data is exposed.
2. **External P-Modules are Documented Placeholders:** As designed for prompt independence, external P-modules (`P05`–`P17`) render structured contract views showing expected input/output interfaces rather than mock implementations.
3. **Accessibility Audit:** The UI adheres to WCAG 2.2 Level AA design patterns (focus states, contrast ratios, ARIA semantics, non-color status indicators). Full official Section 508 certification requires a formal audit by the procuring entity.
