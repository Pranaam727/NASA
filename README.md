# ASTROCARE
**Aerospace Biomedical Intelligence & Mission Health Monitoring Platform**

*Autonomous Long-Duration Space Mission Health Architecture & NASA Research Intelligence*

---

## 1. Platform Overview

AstroCare is an integrated aerospace biomedical intelligence platform designed to monitor, analyze, and research astronaut health during long-duration deep space exploration missions (e.g., Artemis lunar base operations, Deep Space Gateway, and Mars transit).

The platform bridges operational clinical monitoring and scientific research by combining a high-fidelity **Virtual Sensor & Telemetry Simulation Engine**, a **Clinical Reasoning Copilot**, **Space Radiation Intelligence**, and specialized multi-omics and risk analytics modules.

---

## 2. Platform Architecture & Modules

The repository unifies the operational **AstroCare Core Platform (P01–P09)** with specialized **Extended Research & Readiness Modules (P10–P21)**:

### Part A: Core Interactive Platform (`P01`–`P09`)
Located at project root (`src/`, `public/`, `supabase/`, `docs/`):
- **P01–P06: Core Telemetry & Simulation Engine**: 7 mission scenarios (nominal, hypoxia, SPE storm, exercise strain, sleep disruption, fever, cardiac arrhythmia), 50Hz ECG oscilloscope generator, biometric thresholds, and baseline delta comparators.
- **P07: AI Health Intelligence & Gemini Integration**: Grounded context builder, deterministic algorithmic provider, Gemini Edge Function proxy, anomaly explanation panel, and trend interpreter.
- **P08: Clinical Reasoning Copilot & Medical Decision Support**: Flight surgeon situation dashboard, multi-metric correlation engine, diagnostic investigation workspace, and prioritized action checklists.
- **P09: Space Radiation Intelligence & Biological Risk Analytics**: NASA Permissible Exposure Limit (PEL) career tracking, organ-specific vulnerability matrix (BFO, CNS, Cardiovascular, Ocular), and Beer-Lambert shielding mass attenuation simulator.
- **Verification Suite**: 236/236 passing automated unit and integration tests.

### Part B: Extended Aerospace Research Modules (`P10`–`P21`)
- **`astrocare-p10-radiation/` (P10 Module)**: NASA RadLab flight archive integration, historical mission dosimetric comparison, and OSDR radiation biology exploration.
- **`astrocare-p12-immune/` (P12 Module)**: Spaceflight immune dysregulation, cytokine shift monitoring (IL-6, TNF-α, IFN-γ, CRP), and sample cold-chain logistics.
- **`ai-intelligence/` (P13 Module)**: Biomedical conversational assistant with multi-axis health interpretation and research summarizer.
- **`astrocare-p14-risk-intelligence/` (P14 Module)**: NASA Human Research Program (HRP) 8 core risk categories, evidence library with DOIs, and OSDR live search.
- **`astrocare-p15-dataset-intelligence/` (P15 Module)**: NASA Open Science Data Repository (OSDR) multi-omics indexing and population classification.
- **`astrocare-p16-scientific-provenance/` (P16 Module)**: Citation lineage graph, NASA Technical Report registry, and evidence quality auditing.
- **`astrocare-p19-testing/` (P19 Module)**: Aerospace QA test framework with biomedical calculation validators and security scans.
- **`astrocare-p20-ux/` (P20 Module)**: Unified mission control cockpit design system, expedition telemetry downlink, and WCAG 2.2 AA accessibility.
- **`astrocare-p21-readiness/` (P21 Module)**: Hackathon deployment readiness dashboard, 21-module registry, and multi-target deployment manifests.

---

## 3. Technology Stack

- **Frontend Core**: React 18.3+ with TypeScript 5.6+ & Vite
- **Visual Design**: Swiss Editorial Design philosophy (`#F3F0E8` canvas, `#242824` ink) with Tailwind CSS
- **Visualization**: Recharts & Native HTML5 Canvas Oscilloscope
- **Backend & Storage**: Supabase (PostgreSQL 15+) with Row Level Security (RLS) & Realtime
- **AI Integration**: Google Gemini API via Supabase Edge Function Proxy with deterministic fallback
- **Runtime Validation**: Zod invariant schemas for all telemetry packets

---

## 4. Quick Start — Core Application

```bash
# 1. Clone repository
git clone https://github.com/sakshi-07-sk/nasa.git
cd nasa

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start development server (Port 3000)
npm run dev

# 5. Run test suite (236 tests)
npm test

# 6. Build production bundle
npm run build
```

---

## 5. Architectural Documentation

Comprehensive technical specifications are available in the [`docs/`](docs/) directory:
- [System Architecture Blueprint (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- [Swiss Editorial Design System (`docs/DESIGN_SYSTEM.md`)](docs/DESIGN_SYSTEM.md)
- [Database Schema Contract (`docs/DATABASE_SCHEMA.md`)](docs/DATABASE_SCHEMA.md)
- [Simulation Engine Specification (`docs/SIMULATION_ENGINE.md`)](docs/SIMULATION_ENGINE.md)
- [Health Analytics & Risk Engine (`docs/HEALTH_ANALYTICS.md`)](docs/HEALTH_ANALYTICS.md)
- [AI Health Intelligence & Gemini Integration (`docs/AI_INTELLIGENCE.md`)](docs/AI_INTELLIGENCE.md)
- [Clinical Reasoning Copilot (`docs/CLINICAL_COPILOT.md`)](docs/CLINICAL_COPILOT.md)
- [Space Radiation Intelligence (`docs/RADIATION_INTELLIGENCE.md`)](docs/RADIATION_INTELLIGENCE.md)
- [P21 Deployment Integration Guide (`P21_INTEGRATION_GUIDE.md`)](P21_INTEGRATION_GUIDE.md)

---

## 6. Medical & Regulatory Disclaimer

*AstroCare is an aerospace biomedical research and flight support engineering platform. It does not provide medical diagnoses or replace certified NASA aerospace flight surgeons or mission medical controllers.*
