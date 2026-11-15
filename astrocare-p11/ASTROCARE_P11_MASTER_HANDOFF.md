# ASTROCARE P11 — MASTER HANDOFF SPECIFICATION
**Module Name:** P11 — Astronaut Wellness, Sleep, Circadian Rhythm & Mental Health Intelligence  
**System Role:** Aerospace Biomedical Software Architect, Human Factors Research Engineer & NASA Research Specialist  
**Deliverable Status:** 100% Complete, Independently Runnable, Fully Documented & Production Verified  

---

## 1. Module Overview
AstroCare P11 is an aerospace biomedical intelligence module that models, visualizes, and tracks the physiological, circadian, and psychological health parameters of astronauts during long-duration spaceflight.

The platform provides:
- **Astronaut Wellness Executive Dashboard (`/wellness`):** Composite wellness scoring, health status classification (`NORMAL`, `MONITOR`, `WARNING`, `INSUFFICIENT_DATA`), and active threshold alerts.
- **Sleep Health Analytics (`/wellness/sleep`):** Duration, efficiency %, latency, awakenings, sleep deficit tracking, and manual record entry.
- **Circadian Rhythm Intelligence (`/wellness/circadian`):** Interactive 24-hour SVG schedule timeline, schedule alignment estimation, and circadian drift tracking.
- **Mental Wellness & Stress Monitoring (`/wellness/mental`):** Subjective check-in battery (Mood, Stress, Energy, Well-Being) with confidential private notes.
- **Cognitive Performance Testing (`/wellness/cognitive`):** 3 interactive tests (PVT reaction time, symbol cancellation attention scan, visual memory span).
- **Team Cohesion & Psycho-Social Isolation (`/wellness/team`):** Collective crew cohesion, communication, collaboration, and cumulative confinement metrics.
- **Wellness Recommendation Engine (`/wellness/recommendations`):** Rules-based operational countermeasures grounded in NASA Human Research Program literature.
- **NASA Human Research Explorer (`/wellness/research`):** Offline-ready repository of verified NASA HRP, Human Research Roadmap, and OSDR sources.

---

## 2. Complete Folder Structure
```
astrocare-p11/
├── dist/                              # Production build output
├── integration/                       # Master integration contracts & adapters
│   ├── INTEGRATION_CHECKLIST.md
│   ├── WELLNESS_API_ADAPTER_EXAMPLE.ts
│   ├── WELLNESS_COMPONENT_EXPORTS.md
│   ├── WELLNESS_DATA_CONTRACTS.md
│   ├── WELLNESS_INTEGRATION_GUIDE.md
│   └── WELLNESS_ROUTE_MAP.md
├── DOCUMENTATION/                     # Full project documentation & handoff notes
│   ├── prompts/
│   │   ├── P11_DATA_DICTIONARY.md
│   │   ├── P11_DEPENDENCIES.md
│   │   ├── P11_IMPLEMENTATION_REPORT.md
│   │   ├── P11_INTEGRATION_GUIDE.md
│   │   ├── P11_NEXT_SESSION_HANDOFF.md
│   │   ├── P11_PROMPT.md
│   │   └── P11_TEST_REPORT.md
│   ├── P11_DATA_DICTIONARY.md
│   ├── P11_DEPENDENCIES.md
│   ├── P11_IMPLEMENTATION_REPORT.md
│   ├── P11_INTEGRATION_GUIDE.md
│   ├── P11_NEXT_SESSION_HANDOFF.md
│   ├── P11_PROMPT.md
│   └── P11_TEST_REPORT.md
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.tsx          # Collapsible sidebar layout & header
│   │   └── shared/
│   │       └── index.tsx              # Reusable UI components (MetricCard, ScoreRing, etc.)
│   ├── constants/
│   │   └── index.ts                   # Thresholds, scale docs, NASA URLs, disclaimer
│   ├── context/
│   │   └── WellnessContext.tsx        # React Context & useWellnessContext hook
│   ├── data/
│   │   ├── demoData.ts                # Deterministic 90-day simulation seed data
│   │   └── nasaResearch.ts            # Curated verified NASA research metadata
│   ├── hooks/
│   │   └── index.ts                   # useAsyncData, useTimer, useLocalStorage
│   ├── pages/
│   │   ├── CircadianPage.tsx          # 24-hr schedule timeline & alignment
│   │   ├── CognitivePage.tsx          # 3 interactive tests & reaction time scoring
│   │   ├── LandingPage.tsx            # Standalone portal & module directory
│   │   ├── MentalWellnessPage.tsx     # Check-in sliders & private reflections
│   │   ├── NasaResearchPage.tsx       # Verified NASA research explorer
│   │   ├── SleepPage.tsx              # Sleep duration, efficiency & manual logger
│   │   ├── TeamPage.tsx               # Crew cohesion & isolation metrics
│   │   ├── WellnessDashboard.tsx      # Executive overview & active alerts
│   │   └── WellnessRecommendationsPage.tsx # Algorithmic countermeasures
│   ├── routes/
│   │   └── index.tsx                  # React Router 7 declarative configuration
│   ├── services/
│   │   ├── nasa/
│   │   │   └── nasaResearchService.ts # NASA research query & cache service
│   │   └── wellness/
│   │       ├── analyticsService.ts    # Transparent formulas & composite indices
│   │       ├── localDemoProvider.ts   # Local demo provider + localStorage persistence
│   │       └── recommendationEngine.ts # Rules-based countermeasure engine
│   ├── test/
│   │   ├── analyticsService.test.ts   # 30 unit tests for analytics
│   │   ├── localDemoProvider.test.ts  # 5 tests for demo provider & persistence
│   │   ├── nasaResearchService.test.ts# 4 tests for NASA research service
│   │   ├── recommendationEngine.test.ts # 6 tests for recommendations
│   │   └── setup.ts                   # Vitest setup & mocks
│   ├── types/
│   │   └── index.ts                   # Strongly-typed TypeScript contracts
│   ├── utils/
│   │   └── index.ts                   # Date formatting, math, and status logic
│   ├── index.css                      # Tailwind v4 theme & CSS custom variables
│   └── main.tsx                       # React application bootstrap
├── ASTROCARE_P11_MASTER_HANDOFF.md
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 3. All Exported Components & Types
- **Types (`src/types/index.ts`):** `SleepRecord`, `WellnessRecord`, `CircadianRecord`, `FatigueRecord`, `CognitivePerformanceRecord`, `TeamWellnessRecord`, `WellnessAlert`, `WellnessRecommendation`, `NasaResearchEntry`, `WellnessDataProvider`.
- **Pages (`src/pages/`):** `WellnessDashboard`, `SleepPage`, `CircadianPage`, `MentalWellnessPage`, `CognitivePage`, `TeamPage`, `WellnessRecommendationsPage`, `NasaResearchPage`, `LandingPage`.
- **Shared Components (`src/components/shared/`):** `Card`, `MetricCard`, `ScoreRing`, `StatusBadge`, `SeverityBadge`, `ScaleInput`, `Tabs`, `ProgressBar`, `DisclaimerBanner`, `DataOriginTag`, `NasaSourceLink`, `LoadingState`, `ErrorState`, `EmptyState`.

---

## 4. Services Summary
1. `analyticsService.ts`: Computes sleep duration/efficiency/deficit, circadian alignment, composite fatigue scores, normalized reaction time latency, and overall wellness index.
2. `localDemoProvider.ts`: Implementation of `WellnessDataProvider` backing local interactive sessions with localStorage caching.
3. `recommendationEngine.ts`: Evaluates multi-stream metrics and outputs actionable, research-grounded countermeasures.
4. `nasaResearchService.ts`: Caches and queries official NASA HRP, HRR, and OSDR research entries with original source URL retention.

---

## 5. Verification & Test Suite Summary
- **Vitest Unit & Integration Tests:** 45/45 Passed (100%).
- **Production Build:** Vite 8 + TypeScript compiled in 2.47s without errors (`dist/index.html`, `dist/assets/*`).
- **Linter:** Oxlint executed with 0 errors.
