# ASTROCARE CHANGELOG

## [Prompt 10] - 2026-11-14
### Added
- Space Radiation Health Intelligence architecture under `src/features/radiation/`.
- Standardized radiation units, conversions ($\mu\text{Gy} \leftrightarrow \text{mGy} \leftrightarrow \text{Gy}$, $\mu\text{Sv} \leftrightarrow \text{mSv} \leftrightarrow \text{Sv}$), and numerical trapezoidal dose integration (`radiationUnits.ts`).
- NASA RadLab integration service (`nasaRadLabService.ts`) querying `https://visualization.osdr.nasa.gov/radlab/api/` and parsing Pandas `split` tables.
- Historical ISS DosTel2 Columbus module radiation telemetry dataset fixtures (`radLabFixtures.ts`).
- NASA Open Science Data Repository (OSDR) discovery service (`nasaOsdrService.ts`) querying `https://osdr.nasa.gov/osdr/data/search` and study metadata endpoints (`/osd/meta/`).
- NASA Human Research Program (HRP) evidence briefs and research roadmap integration (`nasaHrpService.ts`).
- Real-time radiation telemetry hook (`useRadiationTelemetry.ts`) subscribing to `simulationEngine.onRadiationPacket`.
- NASA research exploration hook (`useNasaRadiationResearch.ts`).
- Radiation UI components: `RadiationMetricCards`, `RadiationExposureChart`, `RadiationAlertPanel`, `MissionExposurePanel`, `NasaRadLabExplorer`, `NasaOsdrResearchExplorer`, `NasaHrpEvidencePanel`, `RadiationProvenancePanel`.
- Dedicated Space Radiation Health page (`src/pages/RadiationPage.tsx`) mounted at `/radiation`.
- AI research and context adapter for future Gemini Prompt 13 (`radiationAiAdapter.ts`).
- Comprehensive Radiation test suite (`src/tests/RadiationIntelligence.test.ts`) adding 48 tests.
- Master continuity documentation under `project-documentation/prompts/`.

### Fixed
- Restored `useTelemetry.ts` simulation hook for cardiovascular and vital signs pages.
- Corrected alert payload schemas across `useCardioAnalytics.ts` and `useMuscleAnalytics.ts`.
- Removed recursive directory junctions avoiding Vite watcher `ELOOP` failures.
- Added explicit routes in `src/App.tsx` for `/cardio`, `/bone`, and `/muscle`.

### Verified
- 143/143 tests passing.
- 0 TypeScript compilation errors.
- Successful production build via Vite.
- Complete visual and interaction verification in browser.

---

## [Prompt 09] - 2026-11-13
- Musculoskeletal health analytics (bone mineral density loss and muscle atrophy tracking).
- 95/95 tests passing.
- `AstroCare_P09_Backup.zip` archived.

---

## [Prompt 01 - 08] - 2026-11-13
- Project setup, Swiss Editorial design system, astronaut profiles, real-time telemetry streaming, simulation engine with 7 scenarios, and cardiovascular analytics engine.
