# AstroCare P12 — Integration Guide

This guide provides instructions for the master AstroCare integrator to incorporate Module P12 into the unified aerospace platform.

---

## 1. Directory Structure Overview

```
src/
  components/
    dashboard/          # Reusable summary widgets for master dashboard
    layout/             # Navbar and AppLayout with scientific telemetry strips
    shared/             # StateBadge, DataOriginBadge, MetricCard
  constants/            # Clinical reference ranges, NASA research metadata
  data/                 # Deterministic mock demonstration data
  features/
    immune-monitoring/  # Module A (Dashboard) & Module G (Alerts)
    immune-cells/       # Module B (Immune Cells & Flow Cytometry)
    cytokine-analysis/  # Module C (Cytokines & Biomarkers)
    laboratory-management/ # Module D (Samples) & Module E (Results)
    longitudinal-analysis/ # Module F (Longitudinal Trajectories)
    nasa-research/      # Module H (Insights) & Module I (OSDR Explorer)
  hooks/                # useAstroCareContext
  services/             # laboratoryService, immuneService, alertService, nasaResearchService
  types/                # TypeScript contracts
  utils/                # Metrology & calculation rules, CSV generator
  routes/               # AppRoutes with sub-route definitions
```

---

## 2. Mounting P12 in Master Router

To mount P12 into the unified AstroCare application:
```tsx
import { AppRoutes as ImmuneRoutes } from './modules/p12-immune/routes/AppRoutes';

// Inside Master App Routes:
<Route path="/immune/*" element={<ImmuneRoutes />} />
```

---

## 3. Embedding Widgets into Master Dashboard

```tsx
import {
  ImmuneHealthSummary,
  BiomarkerSummary,
  LaboratoryStatusSummary,
  ImmuneAlertSummary
} from './modules/p12-immune/components/dashboard';

export const MasterAstroCareOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ImmuneHealthSummary astronautId="AST-042" />
      <BiomarkerSummary astronautId="AST-042" />
      <LaboratoryStatusSummary astronautId="AST-042" />
      <ImmuneAlertSummary astronautId="AST-042" />
    </div>
  );
};
```

---

## 4. Alert Engine Adapter

```typescript
import { alertService } from './modules/p12-immune/services/alerts/alertService';
import { MasterAstroCareAlert } from './modules/p12-immune/types';

const alerts: MasterAstroCareAlert[] = alertService.toMasterAstroCareAlerts('AST-042');
masterAlertHub.dispatch(alerts);
```
