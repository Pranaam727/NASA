# AstroCare Framework Integration Guide

This guide details how the master AstroCare platform can integrate `@astrocare/qa-framework` as either a local workspace package or an embedded sub-module.

---

## 1. Integration Methods

### Option A: Local Package Dependency (Recommended)

In your master AstroCare `package.json`:

```json
{
  "dependencies": {
    "@astrocare/qa-framework": "file:./packages/qa-framework"
  }
}
```

Then run `npm install`.

### Option B: Direct Source Merge

Copy the `src/` directory into `packages/qa/` or `src/qa/` within the master repository. All paths use clean TypeScript barrel exports centered around `src/index.ts`.

---

## 2. Central Public Entry Point

All framework engines, validators, adapters, and types are exported from `src/index.ts`:

```typescript
import {
  TestOrchestrator,
  TestRegistry,
  TestReportGenerator,
  BiomedicalValidator,
  CalculationValidator,
  RadiationCalculator,
  MockGeminiProvider,
  AIResponseValidator,
  NasaApiAdapter,
  NasaOsdrAdapter,
  NasaNtrsAdapter,
  SecretScanner,
  SecurityAuditor,
  PerformanceBenchmarker,
  ModuleCompatibilityValidator,
  AstroCareModuleRegistry,
} from '@astrocare/qa-framework';
```

---

## 3. Registering Live Master Application Services

The master application can register its production services into `AstroCareModuleRegistry` without rewriting testing logic:

```typescript
import {
  AstroCareModuleRegistry,
  IBiomedicalService,
  IAiIntelligenceService,
  TelemetryRecord,
} from '@astrocare/qa-framework';

const registry = new AstroCareModuleRegistry();

// Connect your real master application Biomedical Service
class ProductionBiomedicalService implements IBiomedicalService {
  async ingestTelemetry(record: TelemetryRecord) {
    // Ingest into Supabase / TimescaleDB
    return { accepted: true, recordId: record.recordId };
  }

  async getAstronautLatestVitals(astronautId: string) {
    // Query live telemetry table
    return {};
  }

  async detectAnomalies(astronautId: string, metricType: string) {
    // Call live ML anomaly detector
    return [];
  }

  async assessHealthRisk(astronautId: string) {
    return { riskLevel: 'LOW' as const, factors: [] };
  }
}

// Register service
registry.registerBiomedicalService(new ProductionBiomedicalService());
```

---

## 4. Registering Module Manifests for Regression Audits

Declare your module manifests to verify interface compatibility:

```typescript
import { ModuleCompatibilityValidator } from '@astrocare/qa-framework';

const validator = new ModuleCompatibilityValidator();

validator.registerModule({
  moduleId: 'astrocare-cardiovascular',
  moduleName: 'Cardiovascular Analytics Module',
  moduleVersion: '1.4.0',
  category: 'BIOMEDICAL',
  requiredServices: ['telemetry-stream-service'],
  providedServices: ['cardiac-arrhythmia-service'],
  exportedTypes: ['CardiovascularTelemetryRecord'],
  registeredRoutes: ['/analytics/cardiac'],
  dataContracts: [],
});

const audit = validator.validateAll();
if (!audit.isCompatible) {
  console.warn('Interface collisions:', audit.duplicateRoutes);
}
```

---

## 5. Mounting the Interactive QA Dashboard

To embed the testing console into your master application dashboard:

```tsx
import React from 'react';
import { QADashboard } from '@astrocare/qa-framework/ui/QADashboard';

export const TestingConsolePage: React.FC = () => {
  return (
    <div className="admin-console-wrapper">
      <QADashboard />
    </div>
  );
};
```

---

## 6. Troubleshooting Common Integration Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `INCOMPATIBLE_UNIT` error | Telemetry stream uses non-standard units (e.g., Fahrenheit or kPa) | Use `CalculationValidator.convertBiomedicalUnit()` before submitting to validator. |
| Test marked as `BLOCKED` | A prerequisite test declared in `dependsOn` failed or was skipped | Resolve failure in the parent test or check that dependencies are executed in order. |
| `PHYSICAL_LIMIT_EXCEEDED` | SpO2 $> 100\%$ or negative heart rate | Flag as `SENSOR_MALFUNCTION` at the ingestion layer; do not feed into clinical copilot. |
| Deterministic fallback warning | Gemini quota reached or offline | Expected behavior: ensure response provenance is flagged with `deterministicFallbackInvoked: true`. |
| Axe-core canvas error in JSDOM | Canvas ligatures unmocked in test runner | Ensure `HTMLCanvasElement.prototype.getContext = () => null;` is in your test setup file. |
