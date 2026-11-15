# AstroCare P17 — Master Project Integration Guide

This guide details the procedure for selectively merging **Module P17 (Astronaut Digital Twin & Predictive Health Intelligence)** into the overarching AstroCare Master React Application.

---

## 1. Module Purpose

Module P17 provides an isolated, high-performance aerospace biomedical intelligence system. It models astronaut physiological health across microgravity missions, evaluates multi-system longitudinal data (cardiovascular, musculoskeletal, immune, neurological, sleep, and radiation), computes forward statistical forecasts with confidence bounds, flags anomalies using explainable statistical rules, and simulates hypothetical mission environments.

---

## 2. Folder Structure

```
src/
├── types/                           # Clean TypeScript interfaces
│   ├── astronaut.types.ts
│   ├── measurement.types.ts
│   ├── prediction.types.ts
│   ├── anomaly.types.ts
│   ├── mission.types.ts
│   ├── nasaResearch.types.ts
│   └── index.ts
├── utils/                           # Pure mathematical & validation utilities
│   ├── statistics.ts                # OLS Regression, Holt's, SMA, Z-Scores
│   ├── unitValidation.ts            # Biomedical unit registry & compatibility
│   ├── dataQuality.ts               # Completeness & telemetry gap analysis
│   ├── safeStorage.ts               # Isomorphic LocalStorage / memory fallback
│   └── formatting.ts                # Display formatters
├── data/                            # Demonstration models & NASA evidence
│   ├── demoAstronauts.ts
│   ├── demoMeasurements.ts
│   ├── demoScenarios.ts
│   └── nasaResearchData.ts
├── services/                        # Encapsulated stateful services
│   ├── astronautProfileService.ts
│   ├── measurementService.ts
│   ├── predictionService.ts
│   ├── anomalyDetectionService.ts
│   ├── missionScenarioService.ts
│   └── nasaResearchService.ts
├── hooks/                           # React domain hooks
│   ├── useAstronautProfiles.ts
│   ├── usePhysiologicalMeasurements.ts
│   ├── useHealthTimeline.ts
│   ├── usePredictiveAnalytics.ts
│   └── useAnomalyDetection.ts
├── components/                      # Reusable visual components
│   ├── common/                      # Badges, Cards, MetricCards, Buttons
│   ├── layout/                      # Navbar, Sidebar, Root Layout
│   └── digital-twin/                # SVG Anatomical Twin, TrendCharts, Panels
├── pages/                           # 17 Feature Pages
│   ├── DigitalTwinDashboardPage.tsx
│   ├── AstronautProfilesPage.tsx
│   ├── ... (Cardiovascular, Musculoskeletal, Immune, etc.)
│   └── SettingsPage.tsx
├── features/
│   └── astronaut-digital-twin/      # Public module barrel export
│       └── index.ts
└── App.tsx                          # Route definitions
```

---

## 3. Dependencies

P17 requires standard modern React dependencies already common in modern dashboards:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.29.0",
    "lucide-react": "^0.475.0",
    "recharts": "^2.15.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.1"
  }
}
```

No specialized native binaries or heavy neural-network dependencies are required; all statistical routines are implemented natively in TypeScript.

---

## 4. Required Environment Variables

**None.**
P17 is completely self-contained and runs 100% client-side without external API keys or secrets. It operates seamlessly in sandboxed, offline, or secure intranet deployments.

---

## 5. Routes

All P17 routes are namespaced under `/digital-twin/*`:

- `/digital-twin`
- `/digital-twin/profiles`
- `/digital-twin/physiology`
- `/digital-twin/vitals`
- `/digital-twin/timeline`
- `/digital-twin/cardiovascular`
- `/digital-twin/musculoskeletal`
- `/digital-twin/immune`
- `/digital-twin/neurological`
- `/digital-twin/sleep`
- `/digital-twin/radiation`
- `/digital-twin/predictions`
- `/digital-twin/anomalies`
- `/digital-twin/simulator`
- `/digital-twin/comparison`
- `/digital-twin/reports`
- `/digital-twin/settings`

---

## 6. Public Exports

The barrel export file `src/features/astronaut-digital-twin/index.ts` exposes all public interfaces:

```typescript
import {
  AstronautProfile,
  PhysiologicalMeasurement,
  PredictiveAnalysis,
  AnomalyRecord,
  MissionScenario,
  AnatomicalTwinView,
  MeasurementTrendChart,
  PredictionPanel,
  AnomalyDetectionPanel,
  predictionService,
  anomalyDetectionService,
  areVariablesCompatible,
} from './features/astronaut-digital-twin';
```

---

## 7. Data Models & 8. Measurement Interfaces

Core interfaces defined in `src/types/`:

```typescript
export interface AstronautProfile {
  id: string;
  displayName: string;
  codeName: string;
  role: string;
  missionId: string;
  missionName: string;
  missionType: 'LEO' | 'Lunar Gateway' | 'Mars Transit' | 'Deep Space' | 'Ground Analog';
  missionPhase: 'Preflight' | 'Inflight' | 'Postflight' | 'Recovery';
  missionDay: number;
  missionDurationDays: number;
  isSynthetic: boolean;
  baselineMeasurements: Record<string, BaselineMeasurement>;
}

export interface PhysiologicalMeasurement {
  id: string;
  astronautId: string;
  system: PhysiologicalSystemType;
  variable: string;
  variableName: string;
  value: number | null; // null if unavailable
  unit: string;
  timestamp: string;
  missionDay: number;
  missionPhase: MissionPhase;
  sourceType: SourceType;
  simulationStatus: SimulationStatus;
  qualityScore: number;
  isSynthetic: boolean;
}
```

---

## 9. Prediction & Anomaly Services

- **`predictionService.generateForecast(astronautId, variable, modelType, horizon)`**:
  Calculates OLS linear regression slope, intercept, R², and 95% confidence intervals or Holt linear exponential smoothing. Enforces minimum sample size (n >= 3) and attaches transparent model limitations.
- **`anomalyDetectionService.runDetection(astronautId)`**:
  Evaluates telemetry against personal baselines and consecutive observation deltas. Categorizes severities (Low, Moderate, Elevated) and provides full review status workflow.

---

## 10. NASA Research Integrations

Links to authentic NASA research are surfaced in `src/data/nasaResearchData.ts`:
- **OSDR:** OSD-379 (Longitudinal Immune & Plasma Multi-Omics)
- **GeneLab:** OSD-530 (Cardiac Remodeling under Hindlimb Unloading)
- **HRP Risks:** NASA-HRP-RISK-01 (Bone Mineral Loss & ARED Countermeasures)
- **Roadmap:** NASA-HRP-RISK-04 (Neuro-ocular SANS and Sensorimotor Adaptation)
- **NTRS:** NASA/TP-20230008412 (Space Radiation PELs and GCR Biology)

---

## 11. Synthetic Data Limitations

- **No Medical Telemetry Feed:** Public real-time astronaut medical feeds do not exist due to privacy laws.
- **Labeling:** All data points carry `isSynthetic: true` and `simulationStatus: 'Synthetic Demonstration'`.
- **Non-Diagnostic:** The application displays clear disclaimers that statistical forecasts and anomaly scores are educational and analytical exploratory tools, not clinical diagnoses.

---

## 12. Selective Integration Step-by-Step

To incorporate P17 into the master AstroCare application without touching other modules:

1. **Copy Source Directory:**
   Copy the `src/` files from this package into your master repository under `src/features/p17-digital-twin/`.
2. **Verify Dependencies:**
   Ensure `recharts`, `lucide-react`, and `clsx` are present in your master `package.json`.
3. **Add Navigation Route:**
   In your master routing file (e.g. `App.tsx` or `routes.tsx`), mount the P17 sub-tree:
   ```tsx
   import { AppContent as DigitalTwinApp } from './features/p17-digital-twin/App';

   // Inside your master <Routes>:
   <Route path="/digital-twin/*" element={<DigitalTwinApp />} />
   ```
4. **Sidebar Navigation Link:**
   Add a navigation item pointing to `/digital-twin` in your master sidebar.
5. **No Style Conflicts:**
   Tailwind classes in P17 use standard Tailwind prefixes and scoped astro colors that do not override default Tailwind themes.
