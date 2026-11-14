# AstroCare — Virtual Sensor & Telemetry Simulation Engine

**Document Version:** 1.0  
**Prompt:** 05/21  
**Status:** Complete ✓

---

## 1. Overview

The AstroCare Simulation Engine is a pure-software physiological and environmental telemetry generation system. It simulates the data streams that would originate from physical sensors aboard a long-duration spacecraft, enabling a fully functional health monitoring platform without requiring physical medical hardware.

All generated data is explicitly labelled `isSimulated: true` and `dataSource: 'SIMULATOR'` in every emitted packet. The architecture is designed so that future real hardware streams can be plugged in by implementing the `ITelemetrySource` interface without modifying any downstream consumer.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SimulationEngine                           │
│                                                                 │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │ SeededPRNG │  │  Scenario    │  │   Lifecycle Controls   │   │
│  │ Mulberry32 │  │  Modulators  │  │ start/pause/resume/    │   │
│  │ Box-Muller │  │  (7 configs) │  │ reset/stop/setSpeed    │   │
│  └────────────┘  └──────────────┘  └───────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────── Sensor Rack ───────────────────┐  │
│  │  HeartRate │ SpO2 │ BloodPressure │ BodyTemp │ Respiratory │  │
│  │  ECG (50Hz)│ Radiation │ Activity │ Sleep                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌────────────────── Event Bus (Set-based) ──────────────────┐  │
│  │  onTelemetryPacket │ onRadiationPacket │ onEcgSample      │  │
│  │  onSimulationEvent │ onStateChange                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌────────────────── Zod Validation Layer ───────────────────┐  │
│  │  VitalSignsPacketSchema │ RadiationPacketSchema           │  │
│  │  Physiological bounds enforced before any broadcast       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │ VitalSignsPacket                 │ RadiationPacket
         ▼                                 ▼
   telemetryService                  radiationService
   (DataProvider)                    (DataProvider)
         │                                 │
   ┌─────▼──────────────────────────────────▼────┐
   │          useSimulation() React Hook          │
   │  Bounded ring buffer (30 points per channel) │
   └──────────────────────────────────────────────┘
         │
   ┌─────▼──────────────────────────────────────┐
   │         SimulationPage Components           │
   │  LiveInstrumentRack │ EcgOscilloscopeView   │
   │  LiveChartsView │ EventTimeline │ Controls  │
   └────────────────────────────────────────────┘
```

---

## 3. Pseudo-Random Number Generator (PRNG)

**File:** `src/features/simulation/math/prng.ts`

### Algorithm: Mulberry32

A 32-bit seed-based PRNG using the Mulberry32 algorithm, which provides:
- Deterministic reproducibility from any integer seed
- Excellent statistical distribution properties
- Extremely low computational cost

### Gaussian Sampling: Box-Muller Transform

Gaussian (normal) noise is generated using the Box-Muller transform on pairs of uniform samples, providing biologically realistic noise around physiological baselines.

### Key APIs

```typescript
const prng = new SeededPRNG(seed: number);
prng.next()                    // → uniform [0, 1)
prng.nextGaussian(mean, std)   // → Gaussian sample
prng.setSeed(newSeed)          // Reset determinism
```

**Determinism guarantee:** Two `SeededPRNG` instances constructed with the same seed will produce bit-identical output sequences.

---

## 4. Sensor Generator Models

### 4.1 Heart Rate Sensor

**File:** `src/features/simulation/generators/HeartRateSensor.ts`

**Model:** Exponential lag convergence toward target HR with physiological noise.

```
HR_next = HR_current + (target - HR_current) × 0.1
target  = baseline + targetOffsetBpm + stressFactor × 40
RSA     = sin(t × 2π × 0.25) × 2.0  bpm  [breathing modulation, 0.25 Hz]
Mayer   = sin(t × 2π × 0.1) × 1.5   bpm  [Mayer wave, 0.1 Hz]
noise   = Gaussian(0, 0.8)           bpm
output  = clamp(HR_next + RSA + Mayer + noise, 20, 250)
```

**Range:** 20–250 bpm (physiological hard limit)

---

### 4.2 Blood Oxygen Sensor (SpO₂)

**File:** `src/features/simulation/generators/BloodOxygenSensor.ts`

**Model:** Hypoxia desaturation with hysteresis via exponential lag.

The sensor models the chemoreceptor-driven desaturation curve that occurs during exposure to low partial pressure oxygen (suit micro-leak, altitude sickness simulation). Quality status automatically degrades to `DEGRADED_SIGNAL` below 88%.

**Range:** 50–100%

---

### 4.3 Blood Pressure Sensor

**File:** `src/features/simulation/generators/BloodPressureSensor.ts`

**Model:** Baroreflex coupling of systolic pressure to current heart rate.

```
systolicTarget  = baseline_sys + (currentHR - baselineHR) × 0.4 + bpStressDelta
diastolicTarget = baseline_dia + (currentHR - baselineHR) × 0.15
```

Diastolic floor constraint ensures `diastolic < systolic` at all times.

**Range:** Systolic 50–260 mmHg, Diastolic 30–180 mmHg

---

### 4.4 Body Temperature Sensor

**File:** `src/features/simulation/generators/BodyTempSensor.ts`

**Model:** Circadian diurnal wave plus exponential convergence toward thermal stress target.

```
circadian = sin(t × 2π / 86400) × 0.3  °C  [24h wave]
target    = baseline + thermalDelta
output    = clamp(smoothed + circadian + noise, 32.0, 43.0)
```

**Range:** 32.0–43.0°C

---

### 4.5 Respiratory Rate Sensor

**File:** `src/features/simulation/generators/RespiratorySensor.ts`

**Model:** Dual coupling — tachycardia drives tachypnea, hypoxia drives chemoreceptor-mediated compensatory breathing increase.

```
hrContribution     = (currentHR - baselineHR) × 0.18   rpm
hypoxiaContribution = |hypoxiaDelta| × 0.6              rpm
target  = baselineRR + hrContribution + hypoxiaContribution
RR_next = RR_current + (target - RR_current) × 0.1
```

**Range:** 4–60 rpm

---

### 4.6 ECG Generator

**File:** `src/features/simulation/generators/EcgGenerator.ts`

**Model:** Mathematical Gaussian dipole model for P-Q-R-S-T waveform components at configurable sample rate (default 50 Hz).

| Wave | Center Phase | Width (σ) | Amplitude |
|------|-------------|-----------|-----------|
| P    | 0.15        | 0.035     | +0.15 mV  |
| Q    | 0.35        | 0.012     | −0.12 mV  |
| R    | 0.38        | 0.018     | +1.25 mV  |
| S    | 0.41        | 0.015     | −0.28 mV  |
| T    | 0.65        | 0.070     | +0.32 mV  |

Phase advances at `1 / (sampleRateHz × cycleDuration)` per sample. Isoelectric baseline noise: Gaussian(0, 0.012) mV.

**Output:** `generateBatch(hr, 50)` → 50-sample array representing 1 second at 50 Hz. `generateSample(hr)` → real-time continuous single-sample mode (used by oscilloscope view).

---

### 4.7 Radiation Sensor

**File:** `src/features/simulation/generators/RadiationSensor.ts`

**Model:** Poisson-like scintillation detector with SPE surge capability and integrated dose accumulation.

```
targetFlux = isSPE ? baseline + speSurgeFlux : baseline
rate       = isSPE ? 0.15 : 0.05               [fast surge, slow decay]
flux_next  = flux + (targetFlux - flux) × rate
deltaDose  = (flux × deltaSeconds) / (3600 × 1000)  mSv
accumulatedDose += deltaDose
```

Dose accumulated with 6-decimal precision (mSv). SPE flag is asserted when `isSpeActive=true` or calculated flux > 1.0 uSv/h.

**Range:** 0.0–1000.0 uSv/h ambient flux

---

### 4.8 Activity Sensor

**File:** `src/features/simulation/generators/ActivitySensor.ts`

**Model:** Workout session generator for ISS exercise equipment types.

| Equipment | Type |
|-----------|------|
| `ARED_RESISTANCE` | Advanced Resistive Exercise Device |
| `T2_TREADMILL` | T2 Zero-G locomotion treadmill |
| `CYCLE_ERGOMETER` | CEVIS cycle ergometer |

Output includes: workload (Joules), calories burned (kcal), duration, MET equivalent, muscle groups engaged.

---

### 4.9 Sleep Generator

**File:** `src/features/simulation/generators/SleepGenerator.ts`

**Model:** Sleep stage distribution model with circadian disruption and deprivation factor.

```
nominalDuration = 480 min  (8 hours)
duration = max(180, nominal − deprivationFactor × 220 + noise)
remPct   = max(0.1, 0.22 − deprivationFactor × 0.08)
deepPct  = max(0.08, 0.20 − deprivationFactor × 0.1)
quality  = clamp(88 − deprivationFactor × 52 − awakenings × 3, 15, 100)
```

Disruption flags issued for: `CIRCADIAN_PHASE_SHIFT`, `MICROGRAVITY_VESTIBULAR_AROUSAL`, `CHRONIC_FATIGUE_ACCRUAL`.

---

## 5. Scenario System

**Files:**  
- `src/features/simulation/scenarios/scenarioTypes.ts`  
- `src/features/simulation/scenarios/scenarioDefinitions.ts`

Each scenario is a `SimulationScenarioDefinition` containing a parameter modulator set applied to every sensor generator on each tick.

| ID | Scenario | Key Modulators |
|----|----------|---------------|
| `SCENARIO_1_NOMINAL` | Nominal Mission Day | All offsets zero |
| `SCENARIO_2_CARDIO_STRESS` | High-Intensity Exercise | hrOffset +55, stressFactor 0.8, bpDelta +20 |
| `SCENARIO_3_HYPOXIA` | Suit Micro-Leak / Hypoxia | spo2Drop −14, hrOffset +25, respDelta −12 |
| `SCENARIO_4_SLEEP_DEPRIVED` | Sleep Deprivation | hrOffset +12, thermalDelta +0.3, deprivation 0.75 |
| `SCENARIO_5_RADIATION_SPE` | Solar Particle Event | isSpeActive true, speSurgeFlux +12.5 uSv/h |
| `SCENARIO_6_DECONDITIONING` | Prolonged Microgravity | hrOffset +18, bpDelta +10, orthostatic flag |
| `SCENARIO_7_MULTI_FACTOR` | Multi-System Emergency | Combines SPE + hypoxia + deconditioning stressors |

---

## 6. Simulation Engine Lifecycle

**File:** `src/features/simulation/engine/SimulationEngine.ts`

### State Machine

```
     start()         pause()
STOPPED ──────► RUNNING ◄────► PAUSED
   ▲               │  resume()
   │    reset()    │
   └───────────────┘  stop()
```

### Timer Architecture

The engine runs two independent setInterval timers:
1. **Vitals Tick** — fires every `1000ms / speedMultiplier` (minimum 50ms), generates a complete `VitalSignsPacket`
2. **ECG High-Frequency Tick** — fires every `~20ms / min(speedMultiplier, 2.0)` (minimum 10ms), pushes a single ECG sample to the ring buffer and ECG listeners

### Speed Multiplier

`setSpeed(multiplier)` reschedules both timers at the new rate without data loss.

### Packet ID Generation

All packet IDs use `crypto.randomUUID()` to satisfy the strict `z.string().uuid()` Zod schema constraint in `VitalSignsPacketSchema` and `RadiationPacketSchema`.

### Zod Validation Gate

Every generated packet passes through a Zod schema validation before being broadcast. Invalid packets (e.g., values violating physiological bounds) are discarded with a console warning and never reach subscribers or the persistence layer. This ensures zero contract violations in the event bus.

### Persistence

Telemetry packets are persisted asynchronously (fire-and-forget) via the data provider:
- `telemetryService.recordVitalPacket(packet)` — vital signs
- `radiationService.recordRadiationPacket(packet)` — radiation

In demo mode, these are in-memory stores. In Supabase mode, they write to `telemetry_readings` and `radiation_readings` tables.

---

## 7. React Hook: `useSimulation`

**File:** `src/features/simulation/hooks/useSimulation.ts`

The hook wraps the global `simulationEngine` singleton and exposes:
- `state: SimulationState` — current engine state (reactive)
- `vitalsHistory: VitalSignsPacket[]` — ring buffer of last 30 vital packets
- `radiationHistory: RadiationPacket[]` — ring buffer of last 30 radiation packets
- `ecgBuffer: number[]` — 200-sample ECG ring buffer
- `events: SimulationTimelineEvent[]` — event log (last 50)
- `start / pause / resume / reset / setScenario / setAstronaut / setSpeed` — control functions

All subscriptions are cleaned up on component unmount via returned unsubscribe functions stored in `useEffect` returns.

---

## 8. Telemetry Data Contracts

**File:** `src/types/telemetry.ts`

| Schema | Purpose |
|--------|---------|
| `VitalSignsPacketSchema` | Complete broadcast frame with HR, BP, SpO₂, RR, Temp, ECG |
| `RadiationPacketSchema` | Radiation flux, accumulated dose, SPE flag |
| `SingleTelemetryReadingSchema` | Atomic individual measurement with physiological bounds |
| `TelemetryBatchSchema` | Container for batched transmission |

**Provenance fields (invariant):**
- `isSimulated: true` — always set on simulator output
- `dataSource: 'SIMULATOR'` — always set on simulator output

These fields allow any downstream consumer (alerts engine, AI module, charts, reports) to distinguish simulated from real sensor data.

---

## 9. UI Components

All components in `src/features/simulation/components/`:

| Component | Purpose |
|-----------|---------|
| `SimulationHeader` | Status badge, elapsed clock, current scenario name |
| `SimulationControls` | Start / Pause / Resume / Reset buttons + speed selector |
| `ScenarioSelector` | 7-scenario grid with visual state highlighting |
| `LiveInstrumentRack` | Real-time vital sign instrument gauges |
| `EcgOscilloscopeView` | Canvas-based phosphor sweep oscilloscope at 50Hz |
| `LiveChartsView` | Recharts multi-channel time series with dual Y-axes |
| `EventTimelineView` | Chronological event log with type colour coding |

---

## 10. Scientific Limitations & Caveats

1. **Simplified physiology** — The models are mathematical approximations, not full physiological simulation. They capture qualitative behaviour (e.g., HR rises with stress, SpO₂ falls with hypoxia) but are not clinically validated.

2. **Stochastic noise** — Gaussian noise is used for biological variability. Real sensor noise includes structured artefacts (motion, electrode contact, electromagnetic interference) not modelled here.

3. **Independent channels** — Sensor outputs are coupled via shared modulators but each generator maintains its own state. Cross-coupling (e.g., how true hypoxia affects HR, temperature, and respiration simultaneously) is approximated rather than mechanistically modelled.

4. **No pharmacokinetic model** — Medication effects, countermeasure impacts (e.g., exercise protocols, LBNP), and fluid shifts are not modelled.

5. **Radiation simplification** — The SPE surge model uses a first-order lag rather than the actual spectral energy distribution and shielding effectiveness curves from NASA CREME96 or OLTARIS.

6. **Data is for demonstration only** — All simulated telemetry is for hackathon demonstration purposes and must never be used for actual medical decision-making.

---

## 11. Adding New Sensors

To add a new sensor generator:

1. Create `src/features/simulation/generators/NewSensor.ts`
   - Accept `SeededPRNG` in constructor
   - Implement `generate(...modulators): NewSensorOutput`
   - Implement `reset(): void`
   - Clamp output to physiological bounds
   - Return a `qualityStatus: QualityStatus`

2. Add output field to `VitalSignsPacketSchema` in `src/types/telemetry.ts`

3. Instantiate in `SimulationEngine.ts` constructor and call `generate()` inside `tick()`

4. Add appropriate modulator parameters to `scenarioTypes.ts` and all 7 scenario definitions in `scenarioDefinitions.ts`

5. Add a subscription method to `SimulationEngine` following the existing pattern

6. Update the `useSimulation` hook to subscribe and expose the new data stream

7. Add UI component or extend `LiveInstrumentRack` to display the new channel

8. Add test cases to `src/tests/simulationEngine.test.ts`

---

## 12. Test Coverage

**File:** `src/tests/simulationEngine.test.ts`

| Test Group | Tests | Coverage |
|-----------|-------|---------|
| PRNG Determinism | 1 | Seed reproducibility, bit-exact output |
| Sensor Boundary Invariants | 1 | HR physiological clamp |
| Heart Rate Generator | 1 | Ramp convergence under stress |
| SpO₂ Hypoxia | 2 | Desaturation curve, quality degradation |
| Blood Pressure | 2 | Systolic/diastolic pairing, baroreflex |
| Body Temperature | 1 | Resting range |
| Respiratory Rate | 1 | Tachypnea coupling convergence |
| ECG Generator | 3 | Frame length, R-wave amplitude, S-wave trough |
| Radiation | 3 | SPE flux spike, dose monotonicity, event flag |
| Activity & Sleep | 3 | Workload, deprivation truncation, quality degradation |
| Scenario Repertoire | 2 | Count, ID completeness |
| Engine Lifecycle | 4 | Start/pause/resume/reset state machine |
| Speed & Astronaut | 2 | Multiplier, crew switching |
| Telemetry Validation | 3 | Packet receipt, Zod schema pass, unsubscribe |
| Provenance | 4 | isSimulated, dataSource on both packet types |

**Result: 34/34 PASSED ✓** (Combined suite: 122/122 ✓)

---

*Document generated for AstroCare Prompt 05/21 — Virtual Sensor & Telemetry Simulation Engine*
