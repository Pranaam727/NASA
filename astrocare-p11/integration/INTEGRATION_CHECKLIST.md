# AstroCare P11 — Master Application Integration Checklist

Use this checklist when integrating P11 into the master AstroCare repository:

- [ ] **Step 1: Install Peer Dependencies**
  - Verify `react-router-dom`, `recharts`, `lucide-react`, `date-fns`, `clsx`, `tailwind-merge` are installed.
- [ ] **Step 2: Copy Directory Trees**
  - Copy `src/components/`, `src/pages/`, `src/services/`, `src/types/`, `src/constants/`, `src/data/`, `src/utils/`, `src/hooks/`, and `src/context/` into master.
- [ ] **Step 3: Register Routes**
  - Register `/wellness/*` routes under master router as documented in `WELLNESS_ROUTE_MAP.md`.
- [ ] **Step 4: Implement Data Provider Adapter**
  - Either use `localDemoProvider` for standalone demonstration or implement `WellnessDataProvider` to connect to master backend/telemetry stream.
- [ ] **Step 5: Verify Color Scheme & CSS Variables**
  - Verify that dark space theme CSS variables from `src/index.css` are imported or merged into master application styling.
- [ ] **Step 6: Configure Astronaut & Mission ID Injection**
  - Pass the active master astronaut ID and mission identifier into `WellnessProvider` context.
- [ ] **Step 7: Run Unit & Integration Tests**
  - Execute `npm test` to verify all 45 P11 tests pass without regressions in the master repository.
- [ ] **Step 8: Build Verification**
  - Run `npm run build` to confirm clean TypeScript bundling without errors.
