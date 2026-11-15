# AstroCare P11 — Master Application Integration Guide

## 1. Integration Architecture
AstroCare P11 was engineered to be integrated into the master AstroCare application with zero architectural friction.

### Decoupled Design Patterns:
- **Provider Interface Pattern:** All telemetry and persistent operations go through `WellnessDataProvider`.
- **Dependency Injection Context:** The React tree consumes data via `useWellnessContext()`.
- **Zero Hardcoded IDs:** Components read `astronautId` and `missionId` from context.
- **Self-Contained Styles:** Dark space aesthetic defined via CSS variables with fallbacks.

---

## 2. Step-by-Step Merge Instructions

### Step 1: Copy Source Directories
Copy the `src/` subdirectories into your master AstroCare repository:
- `src/components/shared/` -> `src/components/shared/` (or merge)
- `src/pages/` -> `src/features/wellness/pages/`
- `src/services/` -> `src/services/wellness/`
- `src/types/` -> `src/types/wellness.ts`
- `src/utils/` -> `src/utils/wellness.ts`
- `src/data/` -> `src/data/wellness/`
- `src/context/` -> `src/context/`

### Step 2: Route Registration
Add the wellness sub-routes into your master React Router tree:
```tsx
import { AppLayout } from './features/wellness/components/layout/AppLayout';
import { WellnessDashboard } from './features/wellness/pages/WellnessDashboard';
import { SleepPage } from './features/wellness/pages/SleepPage';
import { CircadianPage } from './features/wellness/pages/CircadianPage';
import { MentalWellnessPage } from './features/wellness/pages/MentalWellnessPage';
import { CognitivePage } from './features/wellness/pages/CognitivePage';
import { TeamPage } from './features/wellness/pages/TeamPage';
import { WellnessRecommendationsPage } from './features/wellness/pages/WellnessRecommendationsPage';
import { NasaResearchPage } from './features/wellness/pages/NasaResearchPage';

export const routes = [
  {
    path: '/wellness',
    element: <AppLayout />,
    children: [
      { index: true, element: <WellnessDashboard /> },
      { path: 'sleep', element: <SleepPage /> },
      { path: 'circadian', element: <CircadianPage /> },
      { path: 'mental', element: <MentalWellnessPage /> },
      { path: 'cognitive', element: <CognitivePage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'recommendations', element: <WellnessRecommendationsPage /> },
      { path: 'research', element: <NasaResearchPage /> },
    ],
  },
];
```

### Step 3: Connect Live Telemetry & Backend
Implement the `WellnessDataProvider` interface (see `integration/WELLNESS_API_ADAPTER_EXAMPLE.ts`) to connect your master API, websocket feed, or simulation engine.
