# AstroCare Test Coverage Matrix

This matrix maps every supported AstroCare module, feature, and scientific calculation to its corresponding automated test cases and verification files.

---

## 1. Traceability Matrix

| Module / Feature Area | Target Component / Service | Test File | Test Case IDs | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Astronaut Health Monitoring** | `BiomedicalValidator` | `tests/unit/biomedical/biomedical.test.ts` | `bio-001` to `bio-005` | **VERIFIED (PASS)** |
| **Physical Bound Checks** | `BIOMEDICAL_PROFILES` | `tests/unit/biomedical/biomedical.test.ts` | `bio-002`, `bio-003` | **VERIFIED (PASS)** |
| **Spike Rate-of-Change** | `BiomedicalValidator` | `tests/unit/biomedical/biomedical.test.ts` | `bio-004` | **VERIFIED (PASS)** |
| **Non-Diagnostic Invariant** | `BiomedicalValidator` | `tests/unit/biomedical/biomedical.test.ts` | `bio-005` | **VERIFIED (PASS)** |
| **Mathematical Invariants** | `CalculationValidator` | `tests/unit/scientific/scientific.test.ts` | `sci-001`, `sci-002` | **VERIFIED (PASS)** |
| **Z-Scores & Statistics** | `CalculationValidator` | `tests/unit/scientific/scientific.test.ts` | `sci-003` | **VERIFIED (PASS)** |
| **Moving Averages** | `CalculationValidator` | `tests/unit/scientific/scientific.test.ts` | `sci-004` | **VERIFIED (PASS)** |
| **Anomaly Scoring** | `CalculationValidator` | `tests/unit/scientific/scientific.test.ts` | `sci-007` | **VERIFIED (PASS)** |
| **Radiation Gy vs Sv** | `RadiationCalculator` | `tests/unit/scientific/scientific.test.ts` | `sci-005`, `sci-006` | **VERIFIED (PASS)** |
| **Radiation Weighting ($w_R$)** | `RadiationCalculator` | `tests/unit/scientific/scientific.test.ts` | `sci-006` | **VERIFIED (PASS)** |
| **Gemini Inference & Citations** | `MockGeminiProvider` | `tests/unit/ai/ai.test.ts` | `ai-001` | **VERIFIED (PASS)** |
| **Deterministic Fallback** | `MockGeminiProvider` | `tests/unit/ai/ai.test.ts` | `ai-002`, `ai-003` | **VERIFIED (PASS)** |
| **Anti-Hallucination Guard** | `AIResponseValidator` | `tests/unit/ai/ai.test.ts` | `ai-004` | **VERIFIED (PASS)** |
| **Non-Prescribing Boundary** | `AIResponseValidator` | `tests/unit/ai/ai.test.ts` | `ai-005` | **VERIFIED (PASS)** |
| **Alert Preservation Guard** | `AIResponseValidator` | `tests/unit/ai/ai.test.ts` | `ai-006` | **VERIFIED (PASS)** |
| **NASA Open APIs** | `NasaApiAdapter` | `tests/unit/nasa/nasa.test.ts` | `nasa-001`, `nasa-002` | **VERIFIED (PASS)** |
| **NASA OSDR Studies** | `NasaOsdrAdapter` | `tests/unit/nasa/nasa.test.ts` | `nasa-003`, `nasa-004` | **VERIFIED (PASS)** |
| **NASA NTRS Citations** | `NasaNtrsAdapter` | `tests/unit/nasa/nasa.test.ts` | `nasa-005`, `nasa-006` | **VERIFIED (PASS)** |
| **NASA Data Portal** | `NasaDataPortalAdapter` | `tests/unit/nasa/nasa.test.ts` | `nasa-007` | **VERIFIED (PASS)** |
| **Secret Scanner (Google/AWS)** | `SecretScanner` | `tests/unit/security/security.test.ts` | `sec-001`, `sec-002` | **VERIFIED (PASS)** |
| **Vite Client Env Auditor** | `SecurityAuditor` | `tests/unit/security/security.test.ts` | `sec-003` | **VERIFIED (PASS)** |
| **XSS & Injection Protection** | `SecurityAuditor` | `tests/unit/security/security.test.ts` | `sec-004`, `sec-005` | **VERIFIED (PASS)** |
| **10k Telemetry Ingestion** | `PerformanceBenchmarker`| `tests/unit/performance/performance.test.ts` | `perf-001` | **VERIFIED (PASS)** |
| **10k Time-Series Math** | `PerformanceBenchmarker`| `tests/unit/performance/performance.test.ts` | `perf-002` | **VERIFIED (PASS)** |
| **Module Dependency Graphs** | `ModuleCompatibility` | `tests/unit/regression/regression.test.ts` | `reg-001` | **VERIFIED (PASS)** |
| **Duplicate Services** | `ModuleCompatibility` | `tests/unit/regression/regression.test.ts` | `reg-002` | **VERIFIED (PASS)** |
| **Route Collision Detection** | `ModuleCompatibility` | `tests/unit/regression/regression.test.ts` | `reg-003` | **VERIFIED (PASS)** |
| **Missing Module Dependencies**| `ModuleCompatibility` | `tests/unit/regression/regression.test.ts` | `reg-004` | **VERIFIED (PASS)** |
| **Accessibility (WCAG 2.1)** | `axe-core` | `tests/unit/accessibility/accessibility.test.tsx`| `a11y-001` to `a11y-003`| **VERIFIED (PASS)** |
| **Test Orchestration & Blocking**| `TestOrchestrator` | `tests/integration/orchestrator.test.ts` | `orch-001` | **VERIFIED (PASS)** |
| **Multi-Format Reporting** | `TestReportGenerator` | `tests/integration/orchestrator.test.ts` | `orch-002` | **VERIFIED (PASS)** |
| **Master Module Registry** | `AstroCareModuleRegistry`| `tests/integration/module-adapters.test.ts` | `mod-001` to `mod-004` | **VERIFIED (PASS)** |
| **11-Step E2E Workflow** | Clinical Decision Flow | `tests/e2e/workflow.test.ts` | `e2e-001` | **VERIFIED (PASS)** |

---

## 2. Test Execution Summary

- **Total Test Suites Executed:** 11 files
- **Total Tests Passed:** 55
- **Total Tests Failed:** 0
- **Total Tests Blocked:** 0 (Validated via dependency simulation test `test-blocked-by-failure`)
- **Total Tests Skipped:** 0
- **Overall Quality Pass Rate:** 100%
- **Integration Readiness:** READY FOR MERGE
