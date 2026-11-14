# ASTROCARE MASTER CONTINUITY MANUAL
**Document Version:** 1.0.0 (Post-Prompt 10)  
**Maintained by:** AstroCare Engineering & Aerospace Biomedical Architecture Team

---

## 1. System Mission & Scope
AstroCare is an integrated space-health intelligence and astronaut physiological monitoring platform designed for long-duration human space exploration (e.g. Lunar Gateway, Mars transit, Martian surface habitats).

The system integrates simulated real-time multiparameter physiological telemetry with authentic NASA research databases, predictive biological risk assessment algorithms, clinical triage alerting, and an aerospace-grade Swiss Editorial design system.

---

## 2. Architecture Map & Subsystems

```
                                      ASTROCARE ARCHITECTURE
                                                 │
        ┌────────────────────────────────────────┼────────────────────────────────────────┐
        ▼                                        ▼                                        ▼
[SIMULATION ENGINE]                     [ANALYTICS & ALERTS]                    [EXTERNAL NASA INTEGRATIONS]
• SimulationEngine.ts                   • HealthAnalyticsEngine.ts              • RadLab API (OSDR/RadLab)
• Speed Multipliers (1x-10x)            • Cardiovascular Analytics              • OSDR Space Biology Studies
• 7 Standard Scenarios                  • Bone & Muscle Analytics               • HRP Human Research Evidence
• Zod Schema Validation                 • Radiation Analytics Engine            • Attribution & Provenance
• Deterministic Waveforms               • Alert Deduplication & Triage          • Future: NASA Exoplanets / GeneLab
        │                                        │                                        │
        └────────────────────────────────────────┼────────────────────────────────────────┘
                                                 ▼
                                        [USER INTERFACE]
                        • Swiss Editorial Minimalist System (JetBrains Mono / Inter)
                        • Pages: Dashboard, Cardio, Bone, Muscle, Radiation, Analytics, Settings
                        • Recharts Dual-Mode Waveforms & Threat Severity Panels
```

---

## 3. Implemented Modules (P01 – P10)
- **P01–P03:** Foundational design tokens, high-density aerospace layout, dark mode, responsive grid, Supabase client schema.
- **P04–P06:** Dashboard overview, astronaut crew profiles, telemetry stream contracts, vitals widget library.
- **P07:** Physics-driven deterministic spaceflight physiological simulation engine (`SimulationEngine.ts`), 7 standardized mission scenarios (Resting, High-G Re-entry, EVA Microgravity, Hypoxia, SPE Solar Storm, Deep Space Sickness, Heat Stress).
- **P08:** Cardiovascular analytics subsystem, Z-score baseline deviations, tachycardia/bradycardia alerts, contract normalization.
- **P09:** Musculoskeletal health modules (Bone mineral density loss rates, sarcopenia/muscle atrophy models, dual-energy X-ray absorptiometry simulation).
- **P10:** **Space Radiation Health Intelligence module**:
  - Simulated astronaut virtual dosimeter telemetry integration.
  - NASA RadLab API live client with Pandas split-table parser and DosTel/Columbus fixtures.
  - NASA OSDR study explorer with accession linkouts and metadata inspector.
  - NASA Human Research Program (HRP) evidence briefs and cancer risk references.
  - Recharts dose rate & cumulative exposure dual-mode graphs.
  - Numerical trapezoidal dose integration & 500 mSv career limit mission analysis.
  - Full AI adapter (`exportRadiationContextForAI`) prepared for Prompt 13 Gemini multimodal diagnostics.

---

## 4. Continuity Principles for Upcoming Prompts (P11 – P21)
1. **Never Break Baseline Tests:** Maintain 100% pass rate across the comprehensive test suite (currently 143/143 tests).
2. **Data Provenance Invariant:** Always preserve the distinction between:
   - `isSimulated: true` for virtual crew biometric/dosimetric telemetry.
   - `dataSource: 'NASA_RADLAB'` / `'NASA_OSDR'` for historical flight data.
   - Non-clinical disclaimer on all health dashboards.
3. **No Duplicate Engines:** Never spawn redundant simulation engines or alert dispatchers. Always subscribe to `simulationEngine` and `alertService`.
4. **TypeScript Strictness:** Maintain zero `tsc --noEmit` errors.
5. **Portable Backups:** Maintain prompt packages and complete source zip backups after every prompt completion.
