# AstroCare Mission-Wide UI/UX Experience, Design System & NASA Provenance (`P20/21`)

An aerospace biomedical intelligence platform designed to monitor, understand, and research astronaut health during spaceflight operations.

![React](https://img.shields.io/badge/React-19.3-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-emerald.svg)
![Recharts](https://img.shields.io/badge/Recharts-v3-purple.svg)
![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA%20Target-green.svg)

---

## Core Capabilities

1. **Mission Control Home Dashboard:**
   - Real-time Mission Elapsed Time (MET), telemetry downlink status, and system health metrics.
   - Interactive crew roster with multi-domain vital indicators and individual health dossiers.
   - Chronological mission activity timeline with provenance tags and category filtering.
   - Active clinical alerts and flight surgeon investigation tracking.

2. **Unified Aerospace Design System:**
   - Dual-theme support: **Dark Mission Control** and **Light Scientific Workspace**.
   - Centralized design tokens for colors, typography, status badges, chart palettes, and spacing.
   - Reusable component library (`MissionHeader`, `MissionSidebar`, `CrewMemberCard`, `HealthMetricCard`, `MetricTrendChart`, `DetailDrawer`, etc.).

3. **Authentic NASA Scientific Ground Truth:**
   - Integrated research records from NASA Human Research Program (HRP), Open Science Data Repository (OSDR), NASA Life Sciences Portal (NLSP), and Ongoing Research.
   - Zero-fabrication citation panels with verified study metadata and access classification tiers.

4. **Scientific Data Visualization:**
   - Accurate time-series charts with baseline reference lines and nominal envelope margins.
   - Baseline comparison indices comparing spaceflight remodeling against 1-G terrestrial baselines.
   - Dual-axis multi-metric correlation analysis.

5. **Global Navigation & Search:**
   - Accessible keyboard-driven command palette (`Cmd/Ctrl + K`) for instant lookup of crew, metrics, investigations, and NASA studies.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run automated test suite
npm test

# Build production bundle
npm run build
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for master platform embedding contracts.
