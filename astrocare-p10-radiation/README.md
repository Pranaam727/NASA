# ASTROCARE
**Astronaut Health Intelligence & Mission Monitoring System**

*Autonomous Long-Duration Space Mission Health Architecture*

---

## 1. Project Overview

AstroCare is a clinical-grade astronaut health monitoring, physiological telemetry, and AI intelligence system engineered for long-duration deep-space exploration (e.g., Deep Space Gateway, Artemis lunar base operations, and Mars transit missions).

Because physical medical wearables are not available in a collegiate hackathon development setting, AstroCare implements a software-based **Virtual Sensor & Telemetry Simulation Engine** that generates mathematically modeled vital signs, 50Hz ECG rhythm strips, and ambient radiation telemetry across 7 repeatable mission scenarios.

### Core Visual Direction
AstroCare follows a strict **Swiss Editorial Design × Aerospace Engineering × Medical Instrumentation** design philosophy:
- **Canvas / Background**: Warm Ivory (`#F3F0E8`)
- **Secondary Surfaces**: Soft Stone (`#EAE6DC`)
- **Primary Ink**: Deep Graphite (`#242824`)
- **Diagnostic Accents**: Sage Green (`#738174`), Signal Terracotta (`#D16C48`), Critical Red (`#B9473E`), Sandstone (`#D8CBAF`)
- **Typography**: Manrope (Headings), Inter (Body), IBM Plex Mono (Tabular Telemetry)

---

## 2. Technology Stack

- **Frontend Framework**: React 18.3+ with Vite
- **Language**: TypeScript 5.6+
- **Styling**: Tailwind CSS 3.4+ with custom semantic design tokens
- **Routing**: React Router v6
- **Iconography**: Lucide React
- **Visualization**: Recharts & HTML5 Native Canvas Oscilloscope
- **Backend & Database**: Supabase (PostgreSQL 15+) with Row Level Security (RLS) & Realtime
- **AI Intelligence**: Google Gemini API via Supabase Edge Function Proxy
- **Schema & Invariants**: Zod runtime validation

---

## 3. Prerequisites

- **Node.js**: `v20.x` or higher (verified on `v24.21.0`)
- **npm**: `v10.x` or higher (verified on `v11.19.0`)

---

## 4. Installation & Local Setup

```bash
# 1. Clone the repository or navigate to project root
cd AstroCare

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env (Default runs in DEMO MODE out of the box)
cp .env.example .env

# 4. Start the Vite development server
npm run dev
```

The application will start locally at `http://localhost:3000`.

---

## 5. Development & Build Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on port 3000 |
| `npm run build` | Compiles TypeScript (`tsc`) and bundles production assets via Vite |
| `npm run preview` | Locally previews the production build output |
| `npm run lint` | Runs TypeScript type checking across all source files |
| `npm test` | Runs the automated data layer, telemetry invariant, and security test suite |

---

## 6. Environment Configuration

See `.env.example` for available configuration parameters:

```ini
# Supabase Configuration
# If left with placeholder values, the application automatically runs in DEMO MODE
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Mission Configuration
VITE_DEFAULT_MISSION_CODE=ARES-VI
VITE_MISSION_TARGET=MARS_JEZERO_BASE
VITE_SIMULATION_SPEED=1.0

# Google Gemini API Key (Proxied via Edge Function in production)
VITE_GEMINI_API_KEY=
```

---

## 7. Project Structure

```
AstroCare/
├── docs/
│   ├── ARCHITECTURE.md       # Master technical architecture & schema blueprint
│   └── DESIGN_SYSTEM.md      # Master Swiss Editorial visual identity tokens
├── public/
│   └── favicon.svg           # Biometric Horizon brand mark
├── src/
│   ├── assets/               # Brand vectors & iconography
│   ├── components/
│   │   ├── common/           # Reusable Swiss Editorial UI atoms
│   │   │   ├── Buttons.tsx
│   │   │   ├── DataDisplay.tsx
│   │   │   ├── DossierCard.tsx
│   │   │   ├── Feedback.tsx
│   │   │   ├── Inputs.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Typography.tsx
│   │   │   └── Visualization.tsx
│   │   └── layout/           # Application shell components
│   │       ├── AppShell.tsx
│   │       ├── PageContainer.tsx
│   │       ├── Sidebar.tsx
│   │       ├── SidebarNavigation.tsx
│   │       └── Topbar.tsx
│   ├── constants/            # Centralized routes & navigation tree
│   ├── pages/                # Module views & dossiers
│   │   ├── AlertsPage.tsx
│   │   ├── AstronautDetailPage.tsx
│   │   ├── AstronautsPage.tsx
│   │   ├── IntelligencePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── OverviewPage.tsx
│   │   ├── RadiationPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SimulationPage.tsx
│   │   ├── SpaceHealthPage.tsx
│   │   ├── VitalsPage.tsx
│   │   └── WellnessPage.tsx
│   ├── services/             # Supabase client & demo mode detection
│   ├── styles/               # Design tokens & Tailwind directives
│   ├── types/                # Standardized telemetry contracts & database types
│   ├── App.tsx               # Master React Router configuration
│   └── main.tsx              # DOM root mount
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 8. Architectural Documentation Reference
- [Architecture Blueprint (`docs/ARCHITECTURE.md`)](file:///c:/Users/ASUS/OneDrive/Desktop/AstroCare/docs/ARCHITECTURE.md)
- [Design System Standards (`docs/DESIGN_SYSTEM.md`)](file:///c:/Users/ASUS/OneDrive/Desktop/AstroCare/docs/DESIGN_SYSTEM.md)
