# AstroCare Aerospace Biomedical Intelligence Platform

AstroCare is an advanced aerospace biomedical intelligence platform designed to monitor, understand, and research astronaut health during spaceflight missions.

## Platform Modules

### 1. `ai-intelligence/` (P13 Module)
- **Module Identifier:** `ai-intelligence`
- **Core Technology:** React 19, TypeScript, Tailwind CSS, Vite, Gemini API client with fallback simulation.
- **Capabilities:**
  - Biomedical clinical conversational assistant.
  - Health data interpretation (cardiovascular, musculoskeletal, radiation, sleep, immune).
  - NASA research summarizer with verified citations.
  - Mission context comparison and risk intelligence.
- **Archive:** `ai-intelligence.zip`

### 2. `astrocare-p20-ux/` (P20 Module)
- **Module Identifier:** `astrocare-p20-ux`
- **Core Technology:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Vite, Vitest.
- **Capabilities:**
  - Unified AstroCare Mission Control Home Cockpit (Expedition 72, MET, live telemetry downlink at 1 Hz).
  - Design system with Dark Mission-Control and Light Scientific Workspace themes.
  - 5-group Information Architecture (Mission Operations, Health Monitoring, Intelligence, Scientific Research, Operations).
  - Scientific data visualizations (Time-series baseline envelopes, normalized baseline bar comparisons, dual-axis multi-metric correlations).
  - NASA Research Provenance and Open Science Data Repositories (NASA HRP, OSDR, LSDA/NLSP, GeneLab).
  - Strict Data Provenance Badges (`LIVE TELEMETRY`, `SIMULATED DATA`, `NASA RESEARCH SOURCE`, etc.).
  - WCAG 2.2 AA accessibility, keyboard navigation, and global Cmd/Ctrl+K search palette.
  - Documented route contracts and integration placeholders for external modules (`P05`–`P17`).
- **Archive:** `AstroCare_P20_UX_Experience.zip`

### 3. `astrocare-p21-readiness/` (P21 Module — Final Module)
- **Module Identifier:** `astrocare-p21-readiness`
- **Core Technology:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Vite, Vitest.
- **Capabilities:**
  - Deployment Readiness Dashboard (Modules A–J) with calibrated composite readiness score.
  - 21-Module Integration Registry (`P01`–`P21`) with interactive architectural dependency graph.
  - NASA Data Source Verification Center auditing 7 official NASA portals with 5-tier verification states.
  - Environment Configuration & Secret Quarantine Validator with masked values and profile management.
  - Backend Gateway, Database & API Infrastructure Health with simulation and live ping modes.
  - 12-point Cybersecurity & PHI Quarantine Review (OWASP Top 10, NASA-STD-2820).
  - Automated QA Pipeline tracking unit tests, strict TypeScript (`tsc -b`), and production builds.
  - Multi-Target Deployment Manifests for Vercel, Docker, Netlify, Node.js, and static NGINX servers.
  - Hackathon Demo Center with 3 preloaded aerospace scenarios and synthetic data quarantine.
  - Final Release Checklist & Report Exporter (Markdown, JSON, CSV).
- **Archive:** `AstroCare_P21_Deployment_Readiness.zip`
- **Integration Guide:** `P21_INTEGRATION_GUIDE.md`

## Quick Start (P21 Readiness Center)
```bash
cd astrocare-p21-readiness
npm install
npm run dev
```

## Running Tests
```bash
cd astrocare-p21-readiness
npm test
```

## Production Build
```bash
cd astrocare-p21-readiness
npm run build
```

---
*Disclaimer: AstroCare is an aerospace biomedical research and educational tool. It does not provide medical diagnoses or replace qualified NASA aerospace flight surgeons.*
