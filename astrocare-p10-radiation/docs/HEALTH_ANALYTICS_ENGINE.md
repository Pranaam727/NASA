# AstroCare — Health Analytics & Deterministic Risk Engine

**Document Version:** 1.0  
**Prompt:** 06/21  
**Status:** Complete ✓

---

## 1. Overview

The AstroCare Health Analytics & Deterministic Risk Engine forms Layer 4 of the autonomous space health architecture. It processes raw physiological and environmental telemetry streams from virtual sensors (or pluggable hardware feeds), evaluates them against individual astronaut personal baselines, computes multi-system composite risk scores ($0\text{--}100$), detects compounding clinical synergisms, and drives deterministic alert generation with deduplication cooldowns.

In accordance with AstroCare Core Tenet 2, all medical alerts and risk classifications are evaluated **strictly deterministically** via transparent rule thresholds and statistical deviations.

---

## 2. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               Layer 1 & 2: Telemetry Streams                    │
│    VitalSignsPacket (1Hz)     │    RadiationPacket (1Hz)        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BaselineEngine                             │
│  - Loads astronaut resting baselines (HR, SpO2, BP sys/dia)     │
│  - Computes Delta (Δ), % Delta, and Standardized z-Score        │
│  - Standard aerospace 1-sigma biological variabilities (σ)      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        RiskEngine                               │
│  - Cardiovascular Subsystem Score (0-100)                       │
│  - Pulmonary & Hypoxia Subsystem Score (0-100)                  │
│  - Radiation Dosimetry Subsystem Score (0-100)                  │
│  - Thermoregulation & Metabolic Score (0-100)                   │
│  - Compound Synergism Correlator (Cardio-Hypoxic penalty)       │
│  - Composite Weighted Index (0-100) → RiskLevel                 │
│    [NORMAL < 25 | CAUTION 25-49 | WARNING 50-74 | CRITICAL ≥75]│
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AlertEngine                               │
│  - Canonical Rules Catalog (10 standardized aerospace rules)    │
│  - Cooldown Deduplication Window (30s-60s per astronaut:rule)   │
│  - Severity Escalation Bypass (Warning → Critical fires immed.) │
│  - State Machine: ACTIVE → ACKNOWLEDGED → RESOLVED              │
│  - Fire-and-forget sync to IAlertService (Demo / Supabase)      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│            useHealthAnalytics() React Hook                      │
│  - Real-time continuous subscription to simulationEngine       │
│  - Maintains 30-point rolling risk history                      │
│  - Drives SpaceHealthPage & AlertsPage UI dashboards            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Mathematical & Physiological Models

### 3.1 Individual Astronaut Baselines & Standard Deviations
Baseline biological variabilities (1-sigma) used for z-score normalizations:
- $\sigma_{\text{HR}} = 6.0\text{ bpm}$
- $\sigma_{\text{SpO}_2} = 1.0\%$
- $\sigma_{\text{BP\_SYS}} = 7.5\text{ mmHg}$
- $\sigma_{\text{BP\_DIA}} = 5.0\text{ mmHg}$
- $\sigma_{\text{RR}} = 2.0\text{ rpm}$
- $\sigma_{\text{Temp}} = 0.25^\circ\text{C}$
- $\sigma_{\text{Flux}} = 0.015\ \mu\text{Sv/h}$

### 3.2 Z-Score Formulation
$$z = \frac{v_{\text{current}} - v_{\text{baseline}}}{\sigma}$$

### 3.3 Composite Risk Score Formulation
The baseline composite risk score $S_{\text{base}}$ is calculated as:
$$S_{\text{base}} = 0.35 \times S_{\text{resp}} + 0.30 \times S_{\text{cv}} + 0.25 \times S_{\text{rad}} + 0.10 \times S_{\text{th}}$$

Where:
- $S_{\text{resp}}$: Pulmonary & Arterial Oxygenation Score ($0\text{--}100$)
- $S_{\text{cv}}$: Cardiovascular Dynamics Score ($0\text{--}100$)
- $S_{\text{rad}}$: Space Weather & Radiation Dosimetry Score ($0\text{--}100$)
- $S_{\text{th}}$: Core Thermoregulation Score ($0\text{--}100$)

### 3.4 Compound Synergism & Safety Invariants
1. **Cardio-Hypoxic Compound Distress:** If $\text{SpO}_2 \le 88\%$ AND $\text{HR} \ge 115\text{ bpm}$, a synergy penalty $+40$ is applied.
2. **Hypertensive Sympathetic Surge:** If $\text{HR} \ge 125\text{ bpm}$ AND $\text{BP}_{\text{sys}} \ge 148\text{ mmHg}$, a synergy penalty $+12$ is applied.
3. **Compound Environmental EVA Breach:** If an active SPE surge occurs while $\text{SpO}_2 \le 90\%$ or $\text{HR} \ge 130\text{ bpm}$, a synergy penalty $+25$ is applied.
4. **Safety Floor Invariant:** If any individual subsystem reaches `CRITICAL` status, the composite score cannot drop below 55 (`WARNING`).
5. **Synergy Critical Invariant:** If any subsystem is `CRITICAL` and an active compound synergy is present, the composite score escalates to $\ge 78$ (`CRITICAL`).

---

## 4. Canonical Alert Rules Catalog

| Rule Code | Title | Category | Severity | Threshold Trigger | Cooldown |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RULE-CV-TACHY-CRIT` | Severe Tachycardia Alert | CARDIOVASCULAR | CRITICAL | $\text{HR} \ge 145\text{ bpm}$ | 45s |
| `RULE-CV-TACHY-WARN` | Moderate Exertional Tachycardia | CARDIOVASCULAR | MEDIUM | $120 \le \text{HR} < 145\text{ bpm}$ | 60s |
| `RULE-CV-BRADY-CRIT` | Severe Sinus Bradycardia | CARDIOVASCULAR | CRITICAL | $\text{HR} \le 42\text{ bpm}$ | 45s |
| `RULE-HP-DESAT-CRIT` | Acute Arterial Hypoxia Emergency | RESPIRATORY | CRITICAL | $\text{SpO}_2 \le 88\%$ | 30s |
| `RULE-HP-DESAT-WARN` | Moderate Oxygen Desaturation | RESPIRATORY | HIGH | $88 < \text{SpO}_2 \le 92\%$ | 60s |
| `RULE-BP-HYPER-HIGH` | Hypertensive Pressure Surge | CARDIOVASCULAR | HIGH | $\text{Sys} \ge 150 \lor \text{Dia} \ge 98\text{ mmHg}$ | 60s |
| `RULE-RR-TACHY-WARN` | Compensatory Tachypnea | RESPIRATORY | MEDIUM | $\text{RR} \ge 24\text{ rpm}$ | 60s |
| `RULE-RD-SPE-CRIT` | Solar Particle Event (SPE) Alarm | RADIATION | CRITICAL | $\text{Flux} \ge 1.0\ \mu\text{Sv/h} \lor \text{isSpeActive}$ | 60s |
| `RULE-TH-HYPER-WARN` | Core Hyperthermia Warning | METABOLIC_THERMAL | MEDIUM | $\text{Temp} \ge 38.2^\circ\text{C}$ | 60s |
| `RULE-COMPOUND-CARDIO-HYPOX` | Compound Cardio-Hypoxic Failure | CARDIOVASCULAR | CRITICAL | $\text{SpO}_2 \le 88\% \land \text{HR} \ge 120\text{ bpm}$ | 30s |

---

## 5. UI Integration

- **[SpaceHealthPage.tsx](file:///c:/Users/ASUS/OneDrive/Desktop/AstroCareNew/AstroCare/src/pages/SpaceHealthPage.tsx):**
  - Live composite risk gauge (`RiskScoreCard`)
  - Subsystem risk cards (`SubsystemRiskMatrix`)
  - 30-point rolling trajectory chart (`RiskTrendsChart`)
  - Personal baseline delta matrix (`BaselineComparisonTable`)
  - Interactive triage queue (`ActiveAlertsQueue`)
  - Astronaut crew selector with automatic baseline switching
- **[AlertsPage.tsx](file:///c:/Users/ASUS/OneDrive/Desktop/AstroCareNew/AstroCare/src/pages/AlertsPage.tsx):**
  - KPI summary tally cards (Active, Critical, In-Triage, Resolved)
  - Interactive triage action queue with notes dialog
  - Historical audit log with severity filters
  - 10-rule canonical catalog reference cards

---

## 6. Test Suite Verification

**Test File:** `src/tests/riskEngine.test.ts` (Integrated into `src/tests/runAllTests.ts`)

- 10 test groups validating:
  1. Astronaut personal baseline profiling & z-score deviations
  2. Nominal resting biometrics homeostatic classification
  3. Isolated cardiovascular tachycardia detection
  4. Acute hypoxia desaturation detection
  5. Solar Particle Event radiation surge detection
  6. Multi-parameter compound synergism compounding
  7. Deterministic calculation consistency
  8. Alert generation & threshold evaluation
  9. Alert deduplication cooldown & severity escalation bypass
  10. Alert lifecycle state transitions (Active → Acknowledged → Resolved)

**Result:** 34/34 tests passed. Combined suite: **95/95 tests passed, 0 failures**.
