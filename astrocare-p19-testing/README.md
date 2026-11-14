# AstroCare — Prompt 19/21: Comprehensive Testing, Scientific Validation & Quality Assurance Framework

[![Verification Status](https://img.shields.io/badge/Verification-PASSING-10b981.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue.svg)](#)
[![Vitest](https://img.shields.io/badge/Vitest-1.6.1-green.svg)](#)
[![NASA Standards](https://img.shields.io/badge/NASA_Standards-NPR_7150.2D%20%7C%20NASA--STD--8739.8B-0284c7.svg)](#)
[![Offline Operational](https://img.shields.io/badge/Offline-100%25_Deterministic-purple.svg)](#)

AstroCare is an aerospace biomedical intelligence platform designed to monitor astronaut health, analyze biomedical telemetry, interpret scientific research, detect anomalies, assess mission risks, and support flight surgeon medical decision-making.

This standalone package delivers a professional, reusable, and independently executable Quality Assurance and Scientific Validation engine designed for seamless integration into the master AstroCare application.

---

## 1. Key Framework Capabilities

- **Central Test Orchestrator & Registry:** Execution sequencing, timeout guards, dependency blocking (`dependsOn`), duration telemetry, and status aggregation (`PASS`, `FAIL`, `BLOCKED`, `WARNING`, `SKIPPED`).
- **Biomedical Validation Engine:** Validates data types, missing/null values, timestamps, duplicate packets, unit compatibility, physical impossibility bounds, operational flight envelope alerts, clinical reference intervals, and sensor spike/rate-of-change anomalies.
- **Strict Non-Diagnostic Safety Guard:** Enforces `isDiagnostic: false` across all findings to guarantee no autonomous diagnosis is ever made without human flight surgeon authority.
- **Scientific Calculation & Radiation Dosimetry Suite:** Mathematical invariant verification (zero deviation, division-by-zero guards, Z-scores, moving averages) and strict physical separation of Absorbed Dose ($\text{Gy}$) vs Biologically Weighted Equivalent Dose ($\text{Sv}$) using ICRP 103 / NASA Space Cancer Risk weighting factors ($w_R$).
- **AI Intelligence & Grounding Validator:** Offline deterministic mock Gemini provider, anti-hallucination verification, deterministic fallback protection (strictly never labeled as Gemini), active alert preservation, and prohibition of autonomous prescribing language.
- **NASA Data Authority Adapters:** Authoritative adapters for `api.nasa.gov` (with DEMO_KEY 30 req/hr safeguards), NASA Open Science Data Repository (OSDR, `geode-py`), NASA Technical Reports Server (NTRS), and NASA Open Data Portal (`data.nasa.gov`).
- **Cybersecurity & Secret Scanner:** Regex scanning for exposed Google Gemini tokens, AWS keys, JWTs, and private keys with automatic masking. Audits Vite client bundles for accidental environment variable leaks.
- **Performance Benchmarking:** Validates ingestion of 10,000 biotelemetry records in $<100\text{ ms}$ and 10,000 time-series calculations in $<50\text{ ms}$.
- **Cross-Module Regression & Manifest Validator:** Audits module manifests for duplicate services, route collisions, conflicting exported types, and missing dependency links.
- **Axe-Core Accessibility:** WCAG 2.1 AA compliant UI components for mission flight displays.
- **Interactive QA Dashboard & Multi-Format Exporter:** Live React testing console reading actual engine results with instant downloads for JSON, Standalone HTML, and CSV reports.

---

## 2. Directory Structure

```
prompt-19/
├── src/
│   ├── index.ts                      # Central public entry point (re-exports all engines)
│   ├── types/                        # TypeScript schemas & contracts
│   │   ├── index.ts
│   │   ├── test-results.ts           # Statuses, suite results, reports
│   │   ├── biomedical.ts             # Telemetry records, validation profiles
│   │   ├── calculations.ts           # Math, time-series, radiation physics
│   │   ├── ai.ts                     # AI grounding, context, citations
│   │   ├── nasa.ts                   # NASA API, OSDR, NTRS schemas
│   │   └── modules.ts                # Module manifests, compatibility results
│   ├── engine/                       # Test Orchestration Core
│   │   ├── TestOrchestrator.ts       # Central suite executor & runner
│   │   ├── TestRegistry.ts           # Suite registration & history
│   │   └── TestReportGenerator.ts    # JSON, HTML, and CSV export engine
│   ├── validation/                   # Domain Validators
│   │   ├── biomedical/
│   │   │   ├── BiomedicalValidator.ts
│   │   │   └── profiles.ts           # Clinical, physical & flight rule limits
│   │   ├── scientific/
│   │   │   ├── CalculationValidator.ts
│   │   │   └── RadiationCalculator.ts # Gy vs Sv, w_R weighting factors
│   │   └── ai/
│   │       ├── AIResponseValidator.ts # Anti-hallucination & grounding checker
│   │       └── MockGeminiProvider.ts  # Offline mock AI & deterministic fallback
│   ├── adapters/                     # Integration & Source Adapters
│   │   ├── nasa/
│   │   │   ├── NasaApiAdapter.ts
│   │   │   ├── NasaOsdrAdapter.ts
│   │   │   ├── NasaNtrsAdapter.ts
│   │   │   └── NasaDataPortalAdapter.ts
│   │   ├── modules/
│   │   │   └── AstroCareAdapters.ts  # Decoupled contracts for master project
│   │   └── api/
│   │       └── ApiTestClient.ts      # Reusable API mock client
│   ├── security/
│   │   ├── SecretScanner.ts          # Credential & secret leak scanner
│   │   └── SecurityAuditor.ts        # Client bundle & XSS auditor
│   ├── performance/
│   │   └── PerformanceBenchmarker.ts # 10k batch latency & throughput
│   ├── regression/
│   │   └── ModuleCompatibilityValidator.ts # Cross-manifest auditor
│   ├── fixtures/
│   │   └── index.ts                  # Synthetic astronauts, telemetry & radiation
│   └── ui/                           # QA Testing Dashboard
│       ├── QADashboard.tsx           # Interactive testing console
│       ├── TestSummaryCards.tsx
│       ├── ModuleHealthView.tsx
│       ├── SecurityPerfView.tsx
│       └── default-suites.ts         # Standard AstroCare test definitions
├── tests/
│   ├── setup.ts                      # Vitest test setup & JSDOM mocks
│   ├── unit/                         # Unit Test Suites
│   │   ├── biomedical/biomedical.test.ts
│   │   ├── scientific/scientific.test.ts
│   │   ├── ai/ai.test.ts
│   │   ├── nasa/nasa.test.ts
│   │   ├── security/security.test.ts
│   │   ├── performance/performance.test.ts
│   │   ├── accessibility/accessibility.test.tsx
│   │   └── regression/regression.test.ts
│   ├── integration/                  # Integration Test Suites
│   │   ├── orchestrator.test.ts
│   │   └── module-adapters.test.ts
│   └── e2e/                          # End-to-End Workflow Suites
│       └── workflow.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── TESTING_GUIDE.md
├── NASA_VALIDATION.md
├── INTEGRATION_GUIDE.md
└── TEST_COVERAGE_MATRIX.md
```

---

## 3. Installation & Verification Commands

### Prerequisites
- Node.js $\ge$ 18.0.0
- npm $\ge$ 9.0.0

### Run Tests and Verifications

```bash
# 1. Install dependencies
npm.cmd install

# 2. Run all automated tests (Vitest)
npm.cmd test

# 3. Run individual domain test suites
npm.cmd run test:unit           # All unit test suites
npm.cmd run test:integration    # Orchestrator & service adapter integration
npm.cmd run test:e2e            # 11-step end-to-end mission workflow
npm.cmd run test:bio            # Astronaut telemetry & physiological bounds
npm.cmd run test:sci            # Scientific calculations & radiation dosimetry
npm.cmd run test:ai             # Gemini grounding, hallucination & fallback
npm.cmd run test:nasa           # NASA API, OSDR, NTRS, Data Portal
npm.cmd run test:security       # Secret scanning & environment audits
npm.cmd run test:perf           # 10k batch latency budgets
npm.cmd run test:a11y           # Axe-core accessibility compliance
npm.cmd run test:regression     # Module manifest compatibility

# 4. Comprehensive single-command verification
npm.cmd run verify              # Runs TypeScript check + All tests + Production build

# 5. Launch interactive QA Dashboard
npm.cmd run dev
```

---

## 4. NASA Software Engineering Notice

AstroCare software verification aligns with principles from NASA NPR 7150.2D (*NASA Software Engineering Requirements*) and NASA-STD-8739.8B (*Software Assurance and Software Safety Standard*). AstroCare is a student-developed research and decision-support project; it does not claim NASA endorsement or formal flight-software qualification.
