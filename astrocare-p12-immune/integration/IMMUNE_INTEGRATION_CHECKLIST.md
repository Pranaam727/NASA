# AstroCare P12 — Integration Checklist

Use this checklist during the merge of P12 into the master AstroCare application:

- [ ] **1. Dependencies Verification:**
  - Verify `react` and `react-dom` (>= 18.2).
  - Verify `react-router-dom` (>= 6.20).
  - Verify `recharts` (>= 2.10) for charting.
  - Verify `lucide-react` for telemetry iconography.
  - Verify Tailwind CSS theme has dark space palette or map P12 color classes (`space-900`, `space-950`).

- [ ] **2. Type Contract Alignment:**
  - Import contracts from `src/types/index.ts`.
  - Confirm `AstronautContext` matches master context schema or apply adapter.
  - Confirm `MasterAstroCareAlert` aligns with master alert system.

- [ ] **3. Context Providers:**
  - Wrap the module or master app with `AstroCareProvider` from `src/hooks/useAstroCareContext`.
  - Wire up optional `radiationContext` from P10 if available.
  - Wire up optional `wellnessContext` from P11 if available.

- [ ] **4. Route Integration:**
  - Mount `/immune` routes in the main application router using `AppRoutes`.
  - Confirm sub-routes: `/immune/cells`, `/immune/biomarkers`, `/immune/laboratory`, `/immune/results`, `/immune/longitudinal`, `/immune/alerts`, `/immune/insights`, `/immune/research`.

- [ ] **5. Master Dashboard Embedding:**
  - Import `ImmuneHealthSummary`, `BiomarkerSummary`, `LaboratoryStatusSummary`, and `ImmuneAlertSummary`.
  - Mount them in the central AstroCare medical overview grid.

- [ ] **6. Alert Pipeline Coupling:**
  - Invoke `alertService.toMasterAstroCareAlerts()` to bridge P12 alerts to the master toast/notification center.

- [ ] **7. Storage & Persistence:**
  - P12 uses isolated localStorage keys prefixed with `astrocare_p12_`.
  - Verify no collision with master application storage keys.
  - Test the "Reset Demo Data" hook to ensure local persistence can be cleared without affecting other modules.

- [ ] **8. Verification Run:**
  - Run `npm test` across unit and integration tests.
  - Run `npm run build` to confirm zero TypeScript compilation errors.
