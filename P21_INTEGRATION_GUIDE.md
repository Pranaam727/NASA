# AstroCare P21 — Final Deployment, NASA Integration & Hackathon Readiness Guide

## 1. Overview
The **AstroCare P21 Module** (`astrocare-p21-readiness`) is a centralized aerospace biomedical deployment-readiness, integration-verification, and hackathon presentation subsystem. It verifies all 21 AstroCare modules (`P01`–`P21`), provides real-time connectivity auditing against 7 official NASA research portals, isolates synthetic demonstration telemetry, and generates downloadable audit reports.

---

## 2. Technology Stack & Required Dependencies
The module is built with React 19, TypeScript, Tailwind CSS v4, Lucide React, and Recharts.

To integrate into an existing AstroCare master application, ensure the following dependencies are present in `package.json`:
```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.73.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "recharts": "^3.10.1",
    "tailwind-merge": "^3.7.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.5",
    "tailwindcss": "^4.3.5",
    "typescript": "~7.0.2",
    "vite": "^8.3.8",
    "vitest": "^5.1.0"
  }
}
```

---

## 3. Files & Folders to Copy
To selectively integrate P21 into your master project without overwriting existing code, copy:

```text
src/modules/deployment/
├── components/
│   ├── ReadinessGauge.tsx
│   ├── StatusBadge.tsx
│   ├── DependencyGraphModal.tsx
│   ├── ReportExportModal.tsx
│   ├── DeploymentDashboardView.tsx      # Module A
│   ├── ModuleRegistryView.tsx           # Module B
│   ├── NASAIntegrationCenterView.tsx    # Module C
│   ├── EnvironmentValidatorView.tsx     # Module D
│   ├── InfrastructureHealthView.tsx     # Module E
│   ├── SecurityReadinessView.tsx        # Module F
│   ├── TestReadinessView.tsx            # Module G
│   ├── DeploymentConfigView.tsx         # Module H
│   ├── DemoReadinessView.tsx            # Module I
│   └── ReleaseChecklistView.tsx         # Module J
├── data/
│   ├── modulesRegistryData.ts           # 21-module tracking matrix
│   ├── nasaSourcesRegistry.ts           # 7 official NASA portals & APIs
│   ├── environmentSpecs.ts              # Env validation rules & patterns
│   ├── securityChecksData.ts            # 12-point aerospace security checklist
│   ├── testSuitesData.ts                # Test execution definitions
│   ├── deploymentTargetsData.ts         # Vercel, Docker, Netlify, NGINX configs
│   ├── demoScenariosData.ts             # 3 preloaded clinical scenarios
│   └── releaseChecklistData.ts          # Operational gating checklist
├── services/
│   ├── readinessCalculator.ts           # Honest score calculation (never fake 100%)
│   ├── environmentValidator.ts          # Pattern validation & secret masking
│   ├── nasaVerifier.ts                  # 5-tier NASA connectivity probe
│   ├── infrastructureHealthService.ts   # Safe endpoint health checker
│   └── reportExporter.ts                # Markdown, JSON, and CSV exporter
├── types/
│   └── index.ts                         # Strongly typed domain interfaces
└── index.ts                             # Clean export entry point
```

---

## 4. Route & Navigation Registration
In your AstroCare master router (e.g., React Router, TanStack Router, or custom navigator), register the `/readiness` route:

```tsx
import React from 'react';
import { AstroCareDeploymentReadinessCenter } from './modules/deployment';

// Option A: React Router v6 / v7
export const routes = [
  {
    path: '/readiness',
    element: <AstroCareDeploymentReadinessCenter />
  }
];

// Option B: Embedding as a sub-view inside P20 Unified UX:
export function OperationsHub() {
  return (
    <div className="w-full h-full">
      <AstroCareDeploymentReadinessCenter initialTab="overview" />
    </div>
  );
}
```

Add the navigation item to your master sidebar under the **Operations / Readiness** section:
```tsx
{
  id: 'readiness',
  label: 'Deployment Readiness',
  path: '/readiness',
  icon: 'Rocket',
  badge: 'P21'
}
```

---

## 5. Required Environment Variables
Configure your `.env` file using the template below:

```bash
# 1. NASA Open APIs Token (Optional; defaults to mock in DEMO_MODE)
NASA_API_KEY=DEMO_KEY

# 2. Google Gemini API Key (Quarantined behind backend proxy)
# NEVER prefix with VITE_ to avoid bundling into client JS
GEMINI_API_KEY=AIzaSyAstroCareDemoKeyExample39Chars_XX

# 3. Telemetry Store (Supabase / PostgreSQL)
SUPABASE_URL=https://astrocare-telemetry.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.examplePayloadSignature

# 4. Endpoints & Network Topology
BACKEND_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# 5. Runtime Profile & Demo Flags
APPLICATION_ENV=development
DEMO_MODE=true
```

---

## 6. Connecting the Module Registry to Live Applications
By default, `modulesRegistryData.ts` contains the status for all 21 AstroCare modules. To dynamically update module status based on your project's build:

```tsx
import { AstroCareDeploymentReadinessCenter, ASTROCARE_MODULES_REGISTRY } from './modules/deployment';

// Inspect your application router at runtime:
const runtimeModules = ASTROCARE_MODULES_REGISTRY.map(mod => {
  const isRouteRegistered = Boolean(myAppRouter.getRoute(mod.route));
  return {
    ...mod,
    status: isRouteRegistered ? 'integrated' : mod.status,
    lastVerified: new Date().toISOString()
  };
});
```

---

## 7. How to Run Tests
Execute the automated Vitest test suite covering all 14 verification specs:
```bash
cd astrocare-p21-readiness
npm test
```

---

## 8. How to Run Production Build
Run strict TypeScript type-checking followed by Vite optimization:
```bash
cd astrocare-p21-readiness
npm run build
```
Output artifacts will be generated in `dist/` ready for edge or container deployment.

---

## 9. NASA Scientific Attribution & Safety Disclaimer
AstroCare is an aerospace biomedical intelligence platform designed for research and operational simulation. It does not provide medical diagnoses or replace certified NASA aerospace flight surgeons.
