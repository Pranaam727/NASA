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
  - Unified AstroCare Mission Control Home Dashboard (Expedition 72, MET, live telemetry downlink at 1 Hz).
  - Design system with Dark Mission-Control and Light Scientific Workspace themes.
  - 5-group Information Architecture (Mission Operations, Health Monitoring, Intelligence, Scientific Research, Operations).
  - Scientific data visualizations (Time-series baseline envelopes, normalized baseline bar comparisons, dual-axis multi-metric correlations).
  - NASA Research Provenance and Open Science Data Repositories (NASA HRP, OSDR, LSDA/NLSP, GeneLab).
  - Strict Data Provenance Badges (`LIVE TELEMETRY`, `SIMULATED DATA`, `NASA RESEARCH SOURCE`, `DERIVED METRIC`, etc.).
  - WCAG 2.2 AA accessibility target, keyboard navigation, and global Cmd/Ctrl+K search palette.
  - Documented route contracts and integration placeholders for external modules (`P05`–`P17`).
- **Archive:** `AstroCare_P20_UX_Experience.zip`

## Quick Start

### Running the UX Experience Module (P20)
```bash
cd astrocare-p20-ux
npm install
npm run dev
```

### Running Tests
```bash
cd astrocare-p20-ux
npm test
```

### Production Build
```bash
cd astrocare-p20-ux
npm run build
```

---
*Disclaimer: AstroCare is an aerospace biomedical research and educational tool. It does not provide medical diagnoses or replace qualified aerospace flight surgeons.*
