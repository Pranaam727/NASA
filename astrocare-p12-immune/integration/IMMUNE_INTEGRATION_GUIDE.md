# AstroCare P12 — Master Integration Guide

## 1. Executive Summary

Module P12 (**Immune System Monitoring, Biomarker Analytics & Laboratory Intelligence**) was developed as an independent, modular subsystem of the AstroCare aerospace biomedical platform.

It operates with zero hard dependencies on unfinished P10 (Radiation), P11 (Sleep/Wellness), or P13 modules, while offering standard adapter interfaces for optional context consumption.

---

## 2. Integration Modes

Module P12 supports three integration patterns:

### Pattern A: Full Embedded Subsystem (Recommended)
Mount P12 routes under `/immune` in the master AstroCare application router.
```tsx
import { AppRoutes as ImmuneRoutes } from './modules/p12-immune/routes/AppRoutes';

// Inside Master Router:
<Route path="/immune/*" element={<ImmuneRoutes />} />
```

### Pattern B: Master Dashboard Widget Embeds
Embed standalone executive summary widgets into the master AstroCare overview screen:
```tsx
import {
  ImmuneHealthSummary,
  BiomarkerSummary,
  LaboratoryStatusSummary,
  ImmuneAlertSummary
} from './modules/p12-immune/components/dashboard';

export const MasterDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <ImmuneHealthSummary astronautId="AST-042" onNavigateToModule={() => navigate('/immune')} />
    <BiomarkerSummary astronautId="AST-042" onNavigateToModule={() => navigate('/immune/biomarkers')} />
    <LaboratoryStatusSummary astronautId="AST-042" onNavigateToModule={() => navigate('/immune/laboratory')} />
    <ImmuneAlertSummary astronautId="AST-042" onNavigateToModule={() => navigate('/immune/alerts')} />
  </div>
);
```

### Pattern C: Centralized Alert Bus Dispatch
Streamline P12 alerts into the central AstroCare alert manager:
```typescript
import { alertService } from './modules/p12-immune/services/alerts/alertService';

const masterAlerts = alertService.toMasterAstroCareAlerts('AST-042');
masterAlertService.registerModuleAlerts(masterAlerts);
```

---

## 3. P10 & P11 Optional Context Injection

P12 gracefully consumes optional context if present:

1. **P10 Radiation Intelligence Context:**
   - Feeds cumulative dose (mSv) and GCR flux index into the P12 telemetry strip.
   - If omitted, defaults safely to simulation telemetry without breaking.

2. **P11 Wellness & Sleep Context:**
   - Feeds mean sleep score and subjective stress index.
   - Enhances contextual interpretation of salivary cortisol and viral reactivation markers.

---

## 4. Dependencies

The module requires:
- `react` >= 18.2
- `react-dom` >= 18.2
- `react-router-dom` >= 6.20
- `recharts` >= 2.10
- `lucide-react` >= 0.400
- `tailwindcss` >= 3.4
