# AstroCare P17 — Astronaut Digital Twin & Predictive Health Intelligence

> **Aerospace Biomedical Intelligence, Physiological Digital Twin, Longitudinal Health Monitoring & Predictive Mission Analytics**

---

## Overview

**AstroCare P17** is an advanced, standalone aerospace biomedical intelligence module designed to track, model, and forecast astronaut physiological adaptations across long-duration spaceflight missions. Built with React 18, TypeScript, Vite, Tailwind CSS, Recharts, and Lucide React, it provides an interactive human physiological digital twin, longitudinal multi-system telemetry analysis, explainable anomaly detection, and statistical trajectory forecasting.

This module was developed completely independently and is architected for later **selective integration** into the AstroCare master platform without overwriting or polluting global master architectures.

---

## Key Features

1. **Interactive Vector Anatomical Digital Twin**
   - Stylized anatomical silhouette SVG with interactive physiological system hot spots.
   - Interactive deep-dive into **Cardiovascular**, **Musculoskeletal**, **Immune & Lymphatic**, **Neurological & Vestibular**, **Sleep & Circadian**, and **Radiation Context** systems.
   - Live telemetry status markers, observational quality scores, and linked NASA research citations.

2. **Longitudinal Telemetry & Multi-Phase Timeline**
   - Chronological tracking across **Preflight**, **Inflight**, **Postflight**, and **Recovery** phases.
   - Graceful handling of telemetry gaps (e.g., in-flight centrifuge thermal excursions displayed as "Unavailable" rather than fabricated).
   - High-fidelity time-series charts with ground baselines and physiological reference bands.

3. **Predictive Health Intelligence Engine**
   - Multi-algorithm predictive modeling:
     - **Ordinary Least Squares (OLS) Linear Regression** with 95% confidence interval estimation.
     - **Holt Linear Exponential Smoothing** for non-linear trended biological series.
     - **Simple Moving Average (SMA)** baseline extrapolations.
   - Explicit mathematical assumptions, horizon configuration (7 to 60 days), and statistical limitations.
   - Strict disclaimers: exploratory research tool, not a medical device or clinical diagnosis.

4. **Explainable Anomaly Detection Center**
   - Statistical Z-score deviation monitoring against personal ground baselines.
   - Sudden rate-of-change shift detection (>20% to >50% acute shifts).
   - Missing observation gap identification.
   - Interactive Flight Surgeon acknowledgment and review workflow with reviewer notes.
   - Configurable sensitivity thresholds.

5. **Mission Environment & Countermeasure Simulator**
   - Parameter sliders for mission duration (30 to 720 days), ARED resistive volume, aerobic cycle/treadmill protocols, and sleep target hours.
   - Multi-environment presets: ISS Low Earth Orbit (LEO), Lunar Gateway / Artemis NRHO, Mars Conjunction-Class Transit, and CHAPEA Ground Isolation Analogs.
   - Multi-system impact projections and mission readiness index calculation.

6. **Cross-Profile Health Comparison Workspace**
   - Biomedical unit compatibility verification engine (prevents comparing scientifically distinct dimensions such as bpm vs mmHg, or cumulative mSv vs instantaneous mSv/day).
   - Side-by-side ground baseline vs inflight observation bar charts and delta analysis.

7. **NASA Research & Evidence Integration**
   - Direct integration with NASA Human Research Program (HRP) Risks, NASA Open Science Data Repository (OSDR), GeneLab, and NASA Technical Reports Server (NTRS).
   - Accession links, study types, organism models, and limitations.

8. **Astronaut Profile Management**
   - Local persistence via `localStorage` (with automatic in-memory fallback for testing and SSR).
   - Full CRUD: Create, Edit, Delete, Switch Active Subject, and Export JSON.

---

## Visual Identity

- **Theme:** Dark navy (`#080c14`) and charcoal (`#0f172a`).
- **Accents:** Cyan (`#06b6d4`), teal (`#14b8a6`), blue (`#3b82f6`), rose (`#f43f5e`), and restrained violet (`#8b5cf6`).
- **Design:** Clean cards, subtle borders (`#1e293b`), monospace metrics, responsive desktop and mobile navigation.

---

## Navigation Routes (17 Routes)

| Path | Page / Feature |
| :--- | :--- |
| `/digital-twin` | Digital Twin Overview (KPIs, Anatomical SVG, Trend Previews) |
| `/digital-twin/profiles` | Astronaut Profile Management (CRUD, Bio-Data) |
| `/digital-twin/physiology` | Physiological Dashboard (6 Multi-System Summaries) |
| `/digital-twin/vitals` | Vital Signs Monitoring (HR, BP, VO2 Max, Bioharness) |
| `/digital-twin/timeline` | Longitudinal Health Timeline (Multi-Phase Observation Ledger) |
| `/digital-twin/cardiovascular` | Cardiovascular Twin (Hemodynamics & Fluid Shifts) |
| `/digital-twin/musculoskeletal` | Bone & Muscle Twin (BMD T-Score, Isometric Torque, ARED) |
| `/digital-twin/immune` | Immune Health Twin (Cytokines, TNF-a, T-cell Activation) |
| `/digital-twin/neurological` | Neurological Twin (Sensorimotor Balance, PVT Latency, SANS) |
| `/digital-twin/sleep` | Sleep & Circadian Twin (Actigraphy, Sleep Debt, SSLA) |
| `/digital-twin/radiation` | Radiation Context (Cumulative Dose, Daily Rate, GCR/SPE) |
| `/digital-twin/predictions` | Predictive Analytics (Linear Regression, Holt Smoothing, CIs) |
| `/digital-twin/anomalies` | Anomaly Detection (Explainable Alerts, Review Workflow) |
| `/digital-twin/simulator` | Mission Simulation (LEO, Lunar, Mars, Analog Environments) |
| `/digital-twin/comparison` | Health Comparison Workspace (Unit Verification, Cohort Analysis) |
| `/digital-twin/reports` | Reports & Dossier Summaries (Markdown & Print Export) |
| `/digital-twin/settings` | Settings & Demo Data Seeder |

---

## Installation & Running

### Prerequisites
- Node.js >= 18
- npm

### Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Run Tests
```bash
npm test
```
Executes Vitest suite covering statistics, unit compatibility, anomaly detection, scenario simulator, and profile persistence.

### Production Build
```bash
npm run build
```
Generates optimized production bundle in `dist/`.

---

## Scientific Integrity Statement

1. **Synthetic Telemetry:** All astronaut profiles, physiological observations, and biometric time series in this application are synthetic demonstration records modeled on published aerospace biomedical literature.
2. **No Real Astronaut PHI:** No real astronaut personal health information (PHI) is contained or processed.
3. **Exploratory Analytics Only:** Statistical models (linear regression, exponential smoothing) and anomaly notifications represent analytical demonstration rules and do NOT constitute clinical diagnoses, official NASA flight surgeon decisions, or medical advice.
