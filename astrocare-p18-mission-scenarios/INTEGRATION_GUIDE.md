# AstroCare — Module 18/21 Integration Guide

**Module Title:** Mission Scenarios, Operational Simulation & Mission Readiness Intelligence Platform  
**Target Platform:** AstroCare Aerospace Biomedical Intelligence Suite  
**Package:** `astrocare-mission-scenarios`  
**Version:** `1.0.0`

---

## 1. Module Overview

Module 18/21 provides an interactive, deterministic, aerospace-grade simulation and mission readiness platform for AstroCare. It enables mission controllers, biomedical engineers, and researchers to:
- Load, inspect, and execute ten predefined mission anomaly scenarios or author custom scenarios.
- Run time-stepped simulations (1x to 300x speed) with start, pause, resume, reset, and single-step controls.
- Dynamically model interactions across cabin atmosphere (pressure, $O_2$, $CO_2$, temperature, humidity), crew vitals ($SpO_2$, HR, respiratory rate, fatigue, cognitive stress), radiation exposure (absorbed dose in mGy vs effective dose in mSv), and consumables ($O_2$, $H_2O$, battery power, food rations).
- Evaluate operational risks via a NASA SP-2015-6105-inspired 5x5 Likelihood $\times$ Consequence engine.
- Apply recovery interventions (e.g. storm shelter ingress, LiOH canister deployment, workload stand-down) and perform what-if outcome comparisons.
- Export structured mission simulation reports in JSON and CSV formats.

---

## 2. Standalone Execution

The module is completely self-contained and runs with standard npm scripts without any external backend dependencies:

```bash
# Navigate to module directory
cd AstroCare_P18_Mission_Scenarios

# Install dependencies
npm install

# Run Vite development server
npm run dev
# Accessible at http://localhost:3000

# Run Vitest test suite (43 deterministic tests)
npm test

# Build production bundle
npm run build
```

---

## 3. Application Routes

| Route | View Component | Description |
|---|---|---|
| `/overview` | `MissionOverview` | Master flight control telemetry HUD, trends, risk radar, and alerts. |
| `/library` | `ScenarioLibrary` | Searchable directory of 10 standard scenarios + user-saved scenarios. |
| `/builder` | `ScenarioBuilder` | Interactive scenario authoring interface with configurable bounds and custom events. |
| `/simulation` | `LiveSimulation` | Primary simulation console with real-time controls, telemetry charts, and recovery panel. |
| `/risk` | `RiskAssessment` | Explainable NASA 5x5 operational risk matrix and category scorecards. |
| `/crew` | `CrewReadiness` | Astronaut readiness radar, clinical breakdown, and decision-support trade-offs. |
| `/resources` | `ResourceManagement` | Consumables depletion projections and nominal vs emergency burn comparisons. |
| `/timeline` | `EventTimeline` | Filterable chronological event stream and future schedule inspection. |
| `/reports` | `MissionReports` | Automated simulation report generator with JSON/CSV export capabilities. |
| `/settings` | `SystemSettings` | Simulation engine configurations, mission profile setup, and NASA references. |

---

## 4. Exported TypeScript Contracts

All integration types are exported from `src/contracts/index.ts`:

```typescript
import type {
  MissionProfile,
  EnvironmentalSimulationState,
  RadiationSimulationState,
  CrewSimulationState,
  ResourceSimulationState,
  MissionRiskAssessment,
  ScenarioDefinition,
  ScenarioEvent,
  SimulationTelemetrySnapshot,
  SimulationState,
  MissionSimulationReport,
  ISimulationServiceProvider
} from './src/contracts';
```

### Core Interface Definitions

```typescript
export interface EnvironmentalSimulationState {
  cabinPressureKPa: number;
  oxygenKPa: number;
  oxygenPercent: number;
  co2KPa: number;
  co2Percent: number;
  temperatureC: number;
  humidityPercent: number;
  leakRatePercentPerDay: number;
  scrubberEfficiencyPercent: number;
  tcsStatus: 'Nominal' | 'Degraded' | 'Failed';
}

export interface RadiationSimulationState {
  backgroundDoseRateMicroGyPerHour: number;
  effectiveDoseRateMicroSvPerHour: number;
  speActive: boolean;
  speFluxProtonsPerCm2Sec: number;
  accumulatedAbsorbedDoseMilliGy: number;  // Gray (mGy)
  accumulatedEquivalentDoseMilliSv: number; // Sievert (mSv)
  stormShelterActive: boolean;
  shieldingThicknessGCm2: number;
  shieldingAttenuationFactor: number;
}

export interface CrewSimulationState {
  heartRateBpm: number;
  oxygenSaturationPercent: number;
  respiratoryRateBpm: number;
  fatigueIndex: number; // 0-100
  circadianDisruptionIndex: number; // 0-100
  cognitiveStressIndex: number; // 0-100
  workloadIndex: number; // 0-100
  readinessScorePercent: number; // 0-100%
  readinessCategory: 'Optimal' | 'Nominal' | 'Degraded' | 'Impaired' | 'Critical';
  clinicalSummary: string;
}

export interface MissionRiskAssessment {
  category: 'Environmental' | 'Radiation' | 'Crew Condition' | 'Equipment' | 'Resource' | 'Communication' | 'Compound Emergency';
  severity: 'Nominal' | 'Low' | 'Moderate' | 'High' | 'Critical';
  likelihood: number; // 1 to 5
  consequence: number; // 1 to 5
  riskScore: number; // likelihood * consequence (1-25)
  observedConditions: string;
  triggeringEvents: string[];
  rationale: string;
  suggestedOperationalResponse: string;
}
```

---

## 5. Integrating with Parent AstroCare Platform

### Option A: Direct Component Mounting within AstroCare Layout
Mount the module under an AstroCare route like `/modules/mission-scenarios`:

```tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MissionOverview from 'astrocare-mission-scenarios/pages/MissionOverview';
import LiveSimulation from 'astrocare-mission-scenarios/pages/LiveSimulation';
import ScenarioLibrary from 'astrocare-mission-scenarios/pages/ScenarioLibrary';

export function AstroCareScenarioModule() {
  return (
    <div className="astrocare-module-p18 h-full bg-space-950 text-slate-100">
      <Routes>
        <Route path="/" element={<MissionOverview />} />
        <Route path="/library" element={<ScenarioLibrary />} />
        <Route path="/simulation" element={<LiveSimulation />} />
      </Routes>
    </div>
  );
}
```

### Option B: Headless Simulation Engine Service Provider
To embed the simulation mechanics into another AstroCare dashboard without the UI:

```typescript
import { SimulationEngine } from 'astrocare-mission-scenarios/engine/SimulationEngine';
import { PREDEFINED_SCENARIOS } from 'astrocare-mission-scenarios/data/scenarios';

// Initialize deterministic engine with reproducible seed
const engine = new SimulationEngine(12345);

// Load scenario (e.g. S02 Solar Particle Event)
const speScenario = PREDEFINED_SCENARIOS.find(s => s.id === 'S02-SPE')!;
engine.loadScenario(speScenario);

// Step simulation forward by 60 seconds
engine.step(60);

// Capture real-time snapshot
const telemetry = engine.snapshot();
console.log('Effective Dose Rate:', telemetry.radiation.effectiveDoseRateMicroSvPerHour, 'µSv/h');
console.log('Crew Readiness Category:', telemetry.crew.readinessCategory);
console.log('Active Alerts:', telemetry.activeAlerts);

// Apply operational countermeasure
engine.applyRecoveryAction('shelter_ingress');
engine.step(60);
console.log('Post-shelter Dose Rate:', engine.snapshot().radiation.effectiveDoseRateMicroSvPerHour);
```

---

## 6. Dependencies & Limitations

- **Dependencies:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Zustand 4, Recharts 2, Lucide React.
- **No External Network Calls:** The simulation executes entirely client-side using deterministic numerical algorithms.
- **Model Assumptions:** Atmospheric gas kinetics assume ideal gas mixing; radiation shielding uses a calibrated mass-attenuation factor; crew physiology uses continuous empirical response transfer functions. All outputs are explicitly stamped as simulated data.
