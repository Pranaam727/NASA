# AstroCare P11 — Master Application Integration Guide

## 1. Overview
The P11 module (`AstroCare P11: Astronaut Wellness, Sleep, Circadian Rhythm & Mental Health Intelligence`) is designed as a self-contained, loosely coupled React module with a dependency injection architecture via `WellnessDataProvider`.

## 2. Directory Structure to Copy
To merge P11 into the master AstroCare application, copy the following directory structure into your master application's `src/` tree:

```
src/
├── features/wellness/          # Or components/wellness/
│   ├── pages/
│   │   ├── WellnessDashboard.tsx
│   │   ├── SleepPage.tsx
│   │   ├── CircadianPage.tsx
│   │   ├── MentalWellnessPage.tsx
│   │   ├── CognitivePage.tsx
│   │   ├── TeamPage.tsx
│   │   ├── WellnessRecommendationsPage.tsx
│   │   └── NasaResearchPage.tsx
│   ├── components/
│   │   ├── shared/             # Reusable cards, score rings, badges
│   │   └── layout/AppLayout.tsx
│   ├── context/WellnessContext.tsx
│   ├── services/
│   │   ├── wellness/
│   │   │   ├── analyticsService.ts
│   │   │   ├── localDemoProvider.ts
│   │   │   └── recommendationEngine.ts
│   │   └── nasa/
│   │       └── nasaResearchService.ts
│   ├── types/                  # Typed data contracts
│   ├── constants/              # Thresholds, scale docs, NASA sources
│   ├── data/                   # Deterministic demo and research seeds
│   └── utils/                  # Safe calculation and date helpers
```

## 3. Required NPM Dependencies
Ensure the master application's `package.json` includes:
- `react` (>= 18.0.0 or 19.x)
- `react-dom`
- `react-router-dom` (>= 6.x or 7.x)
- `recharts` (>= 2.x)
- `lucide-react`
- `date-fns` (>= 3.x or 4.x)
- `clsx`
- `tailwind-merge`

## 4. Connecting the Master Data Provider
Replace `localDemoProvider` with a master provider implementing `WellnessDataProvider`:
```typescript
import { WellnessProvider } from './features/wellness/context/WellnessContext';
import { masterAstroCareAdapter } from './integration/WELLNESS_API_ADAPTER_EXAMPLE';

function App() {
  return (
    <WellnessProvider customProvider={masterAstroCareAdapter} astronautId={currentCrewId} missionId={currentMissionId}>
      <RouterProvider router={router} />
    </WellnessProvider>
  );
}
```

## 5. Merging Route Configurations
In your master React Router configuration, mount the child routes under `/wellness`:
```typescript
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
}
```

## 6. Telemetry & Simulation Engine Hook
If the master application possesses a real-time telemetry simulator or websocket feed:
- Map incoming telemetry to `SleepRecord`, `WellnessRecord`, or `CircadianRecord`.
- Pass new entries to `dataProvider.saveSleepRecord()` or your backend database.
