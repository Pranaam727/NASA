# AstroCare P17 — File Manifest

| Path | Description |
| :--- | :--- |
| `package.json` | Project configuration, scripts, dependencies (React 18, Vite, Tailwind CSS, Recharts) |
| `tsconfig.json` | TypeScript compiler configuration with path aliases |
| `tsconfig.node.json` | Node compiler configuration for Vite |
| `vite.config.ts` | Vite configuration with React plugin and path alias resolver |
| `tailwind.config.js` | Tailwind CSS configuration with AstroCare palette extensions |
| `postcss.config.js` | PostCSS configuration for Tailwind CSS and Autoprefixer |
| `index.html` | Application HTML entry point with dark mode, typography, and favicon |
| `README.md` | Complete project documentation, features, routes, and scientific integrity statement |
| `INTEGRATION_GUIDE.md` | Master AstroCare integration guide with 12 sections as required |
| `FILE_MANIFEST.md` | This file manifest |
| `src/main.tsx` | React DOM root rendering |
| `src/App.tsx` | Application routes, providers, and layout wiring for all 17 features |
| `src/index.css` | Tailwind base, custom scrollbar, and glow styles |
| `src/index.ts` | Main barrel export |
| `src/types/astronaut.types.ts` | Astronaut profile and baseline measurement interfaces |
| `src/types/measurement.types.ts` | Physiological measurement, observation, and system status interfaces |
| `src/types/prediction.types.ts` | Predictive analysis and forecast point interfaces |
| `src/types/anomaly.types.ts` | Explainable anomaly record and review status interfaces |
| `src/types/mission.types.ts` | Mission scenario, environment, and simulation interfaces |
| `src/types/nasaResearch.types.ts` | NASA research study and repository metadata interfaces |
| `src/types/index.ts` | Types barrel export |
| `src/utils/statistics.ts` | Linear regression, Holt smoothing, SMA, Z-score, RoC algorithms |
| `src/utils/unitValidation.ts` | Biomedical variable registry and unit compatibility validator |
| `src/utils/dataQuality.ts` | Data completeness and telemetry gap identification utility |
| `src/utils/safeStorage.ts` | Isomorphic LocalStorage / in-memory storage fallback |
| `src/utils/formatting.ts` | Mission flight day, date, number, and color formatters |
| `src/data/demoAstronauts.ts` | Synthetic demonstration astronaut profiles (Elena Vance, Marcus Thorne, etc.) |
| `src/data/demoMeasurements.ts` | Longitudinal multi-system telemetry time series across mission phases |
| `src/data/demoScenarios.ts` | Mission environment simulation scenarios (ISS, Lunar Gateway, Mars, Analog) |
| `src/data/nasaResearchData.ts` | NASA HRP, OSDR, GeneLab, and NTRS research studies |
| `src/services/astronautProfileService.ts` | Profile CRUD and persistence service |
| `src/services/measurementService.ts` | Measurement queries, filtering, and system summaries service |
| `src/services/predictionService.ts` | Statistical forecast generation with confidence intervals |
| `src/services/anomalyDetectionService.ts` | Explainable anomaly detection and review management service |
| `src/services/missionScenarioService.ts` | Mission scenario simulation and comparison service |
| `src/services/nasaResearchService.ts` | NASA research search and retrieval service |
| `src/hooks/useAstronautProfiles.ts` | Hook for managing astronaut profiles |
| `src/hooks/usePhysiologicalMeasurements.ts` | Hook for querying measurements by system and variable |
| `src/hooks/useHealthTimeline.ts` | Hook for filtering observations across phases and systems |
| `src/hooks/usePredictiveAnalytics.ts` | Hook for running predictive forecasts |
| `src/hooks/useAnomalyDetection.ts` | Hook for running anomaly detection and status updates |
| `src/components/common/Badge.tsx` | Status and category badge component |
| `src/components/common/Card.tsx` | Glassmorphic dark card component with glow effects |
| `src/components/common/Button.tsx` | Accessible button component with variants |
| `src/components/common/UnitTag.tsx` | Scientific unit tag component |
| `src/components/common/DisclaimerNotice.tsx` | Aerospace biomedical integrity disclaimer notice component |
| `src/components/common/MetricCard.tsx` | KPI metric card with baseline and delta comparisons |
| `src/components/common/EmptyState.tsx` | Fallback empty state component |
| `src/components/layout/Navbar.tsx` | Sticky navigation bar with active subject selector and mission day pill |
| `src/components/layout/Sidebar.tsx` | 17-link grouped sidebar navigation |
| `src/components/layout/Layout.tsx` | Main application shell layout |
| `src/components/digital-twin/AnatomicalTwinView.tsx` | Interactive vector SVG anatomical digital twin silhouette |
| `src/components/digital-twin/MeasurementTrendChart.tsx` | Recharts time-series chart with phase markers and baselines |
| `src/components/digital-twin/AstronautProfileCard.tsx` | Astronaut subject card with bio-data and quick actions |
| `src/components/digital-twin/PhysiologicalSystemCard.tsx` | Physiological system summary card |
| `src/components/digital-twin/PredictionPanel.tsx` | Interactive predictive forecasting engine panel |
| `src/components/digital-twin/AnomalyDetectionPanel.tsx` | Explainable anomaly detection and flight surgeon review panel |
| `src/components/digital-twin/MissionScenarioEditor.tsx` | Mission environment and countermeasure simulator panel |
| `src/components/digital-twin/HealthComparisonPanel.tsx` | Cross-profile and unit compatibility comparison panel |
| `src/pages/DigitalTwinDashboardPage.tsx` | Main digital twin overview dashboard |
| `src/pages/AstronautProfilesPage.tsx` | Astronaut profile management page |
| `src/pages/PhysiologicalHealthPage.tsx` | Physiological systems dashboard |
| `src/pages/VitalSignsPage.tsx` | Vital signs monitoring page |
| `src/pages/HealthTimelinePage.tsx` | Longitudinal health timeline page |
| `src/pages/CardiovascularTwinPage.tsx` | Cardiovascular digital twin domain page |
| `src/pages/MusculoskeletalTwinPage.tsx` | Bone & muscle digital twin domain page |
| `src/pages/ImmuneTwinPage.tsx` | Immune & cytokine digital twin domain page |
| `src/pages/NeurologicalTwinPage.tsx` | Neurological & sensorimotor digital twin domain page |
| `src/pages/SleepCircadianTwinPage.tsx` | Sleep & circadian rhythm digital twin domain page |
| `src/pages/RadiationContextPage.tsx` | Space radiation exposure context domain page |
| `src/pages/PredictiveAnalyticsPage.tsx` | Predictive analytics page |
| `src/pages/AnomalyDetectionPage.tsx` | Explainable anomaly detection page |
| `src/pages/MissionSimulatorPage.tsx` | Mission scenario simulator page |
| `src/pages/HealthComparisonPage.tsx` | Health comparison workspace page |
| `src/pages/ReportsPage.tsx` | Reports, clinical dossier, and markdown export page |
| `src/pages/SettingsPage.tsx` | Settings, persistence config, and demo data seeder page |
| `src/features/astronaut-digital-twin/index.ts` | Clean public feature exports for master project integration |
| `src/tests/statistics.test.ts` | Unit tests for regression, Holt smoothing, SMA, and Z-scores |
| `src/tests/unitValidation.test.ts` | Unit tests for unit compatibility checks |
| `src/tests/anomalyDetection.test.ts` | Unit tests for anomaly rules and review updates |
| `src/tests/missionSimulator.test.ts` | Unit tests for mission scenario impacts |
| `src/tests/profileAndPrediction.test.ts` | Unit tests for profile CRUD, quality, and predictions |
