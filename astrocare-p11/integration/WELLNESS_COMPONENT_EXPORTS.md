# AstroCare P11 — Reusable Component Exports

All components are built with clean TypeScript interfaces and styled using Tailwind CSS and CSS variables.

## 1. Page Components
- `WellnessDashboard`: Main executive astronaut overview and alert hub
- `SleepPage`: Complete sleep logs, duration/efficiency trends, and manual sleep log entry
- `CircadianPage`: Interactive 24-hr SVG schedule timeline, alignment score, and drift trends
- `MentalWellnessPage`: Slider-based check-in battery, private notes, and 14-day trajectory area charts
- `CognitivePage`: 3 interactive assessments (PVT reaction latency, attention cancellation, memory span)
- `TeamPage`: Aggregate crew cohesion, communication, collaboration, and isolation duration tracking
- `WellnessRecommendationsPage`: Filterable operational countermeasures linked to NASA research
- `NasaResearchPage`: Offline-ready NASA Human Research Program evidence search and source links

## 2. Shared Atomic UI Components (`src/components/shared/index.tsx`)
- `Card`: Aerospace dark-themed bordered container with hover states
- `MetricCard`: Standardized metric tile with label, value, unit, subtext, icon, and trend indicator
- `ScoreRing`: Radial SVG progress ring with animated stroke and interior score readout
- `StatusBadge`: Semantic pill for `NORMAL`, `MONITOR`, `WARNING`, `INSUFFICIENT_DATA`
- `SeverityBadge`: Color-coded badge for `INFO`, `CAUTION`, `WARNING`, `CRITICAL`
- `ScaleInput`: Interactive slider for 1–10 subjective scales with color gradients and tooltips
- `Tabs`: Accessible tab switcher with icons
- `ProgressBar`: Linear progress bar with percentage readout
- `DisclaimerBanner`: Standardized aerospace research educational disclaimer
- `DataOriginTag`: Visual provenance chip (`SIMULATED`, `USER_ENTERED`, `CALCULATED`, `NASA_RESEARCH`)
- `NasaSourceLink`: External link pill pointing to verified official NASA research URLs
- `LoadingState` / `ErrorState` / `EmptyState`: Resilient asynchronous status fallbacks
