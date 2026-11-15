# AstroCare P11 — Next Session Handoff & Developer Guide

## 1. Project Overview & Current State
- **Workspace:** `c:\Users\Admin\Downloads\Nasa PRAN\astrocare-p11`
- **Application Type:** React 19 + TypeScript + Vite 8 + Recharts + Tailwind CSS
- **Test Status:** 45/45 Unit & Integration tests passing (`npm test`)
- **Build Status:** Production build clean (`npm run build` -> `dist/`)
- **Lint Status:** Clean (`npm run lint` -> 0 errors)

---

## 2. Key Entry Points
- `src/main.tsx`: Root React bootstrap mounting `WellnessProvider` and `RouterProvider`.
- `src/routes/index.tsx`: Declarative router definition with all 8 module routes.
- `src/types/index.ts`: Central TypeScript contracts for all data structures and services.
- `src/services/wellness/analyticsService.ts`: Core transparent calculation algorithms.
- `src/services/wellness/localDemoProvider.ts`: Local deterministic provider with localStorage persistence.
- `src/services/wellness/recommendationEngine.ts`: Rule-based countermeasure generator.
- `src/services/nasa/nasaResearchService.ts`: NASA HRP research metadata service.

---

## 3. How to Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Run test suite
npm test

# 4. Build for production
npm run build
```

---

## 4. Potential Future Enhancements
1. **Wearable Biosensor Integration:** Map actigraphy micro-movements into `SleepRecord` objects.
2. **Audio/Vocal Biomarkers:** Analyze speech latency during mission debriefs (when permitted by crew consent).
3. **Advanced Phototherapy Modeling:** Expand the 24-hr circadian timeline to simulate dynamic lux levels from ISS Solid-State Light Assemblies (SSLA).
