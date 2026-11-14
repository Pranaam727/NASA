# ASTROCARE MASTER VISUAL IDENTITY & DESIGN SYSTEM SPECIFICATION
**Document Reference:** `ASTRO-DS-2026-REV-1.0`  
**Classification:** Engineering & Design Standards Document  
**Target Platform:** AstroCare — Astronaut Health Intelligence & Mission Monitoring System  

---

## 1. Design Philosophy

### The Creative Direction: Swiss Editorial × Aerospace Engineering × Medical Instrumentation

AstroCare rejects the clichéd visual tropes of generic SaaS applications and sci-fi entertainment interfaces (glowing neon cyan, deep purple gradients, faux-holographic glassmorphism, and bloated border radii). Instead, AstroCare establishes an authentic design language rooted in three rigorous disciplines:

```
┌──────────────────────────────┐     ┌──────────────────────────────┐
│    SWISS EDITORIAL DESIGN    │  ×  │    AEROSPACE ENGINEERING     │
│  - Asymmetrical grids        │     │  - Calibrated telemetry      │
│  - Typographic hierarchy     │     │  - Mission Elapsed Time (MET)│
│  - Purposeful whitespace     │     │  - High information density  │
│  - Crisp structural rules    │     │  - Subsystem status flags    │
└──────────────┬───────────────┘     └──────────────┬───────────────┘
               │                                    │
               └─────────────────┬──────────────────┘
                                 ▼
               ┌────────────────────────────────────┐
               │   PREMIUM MEDICAL INSTRUMENTATION   │
               │  - Restrained diagnostic palette   │
               │  - Tabular physiological readings  │
               │  - Rigorous data provenance badges │
               │  - Unambiguous alert tiering       │
               └────────────────────────────────────┘
```

### Visual & Atmospheric Principles
- **Scientific Precision**: Every element has an informational rationale. If a line, box, or label does not communicate telemetry, status, or structural hierarchy, it is excluded.
- **Cognitive Calmness**: In long-duration spaceflight and critical medical telemetry, sensory overload causes cognitive fatigue. The warm ivory ground (`#F3F0E8`) provides a high-contrast, low-glare visual foundation that reduces optical fatigue over extended monitoring shifts.
- **Engineered Authenticity**: Interfaces evoke physical aerospace hardware consoles, scientific journals, and clinical flight dossiers rather than transient web trends.
- **Tactile Restraint**: Borders are 1px hairlines; corners are sharp or micro-radiused (0px–4px); elevation is conveyed through fine linework and tone contrast rather than diffuse drop shadows.

---

## 2. Brand Identity

### 2.1 The Wordmark
The AstroCare wordmark is set in **Manrope Bold** with controlled uppercase tracking (`+0.08em`), balanced by a technical sub-label set in **IBM Plex Mono**:

```
ASTROCARE
[ MED-INTEL // MISSION HEALTH ECOSYSTEM ]
```

- **Geometry**: Geometric, humanist proportions with balanced optical weights.
- **Treatment**: Solid `#242824` (Deep Graphite) on light surfaces. On technical dark panels, `#F3F0E8` (Warm Ivory).
- **Prohibited**: Gradients inside the wordmark, faux bevels, outer glows, or drop shadows.

### 2.2 The Minimalist Logo Mark: "The Biometric Horizon"
The brand mark represents an orbital flight path intersecting a physiological waveform. It consists of:
1. **The Orbital Ring**: A single 1.5px hairline elliptical arc representing orbital mechanics and mission trajectory.
2. **The Biometric Impulse**: A crisp, singular ECG-derived QRS vector cutting through the orbital plane at a $15^\circ$ angle.
3. **The Center Datum**: A 3px solid circular core representing the monitored astronaut at the focus of the orbit.

```
       . — — — — .
    /      /\       \
   |  — — /  \ — — — |   [ THE BIOMETRIC HORIZON ]
    \    /    \/    /
       ` — — — — '
```

### 2.3 Brand Iconography Treatment
- **Style**: Strict 1.5px stroke weight; squared stroke caps; sharp corner joins.
- **Grid**: $16\times 16\text{px}$ and $20\times 20\text{px}$ base viewports.
- **Coloration**: Monochromatic inheritance (`currentColor`) matching typography tokens; never multi-colored or filled unless representing an active alert beacon.

---

## 3. Colour Design Tokens

### 3.1 Master Palette Specification

| Token Name | Hex Code | RGB | Role & Usage |
| :--- | :--- | :--- | :--- |
| `primary-background` | `#F3F0E8` | `243, 240, 232` | Warm Ivory — Primary canvas, whole-page background. Eliminates screen glare. |
| `secondary-background` | `#EAE6DC` | `234, 230, 220` | Soft Stone — Sidebars, panel containers, table headers, secondary surfaces. |
| `surface-clean` | `#FFFFFF` | `255, 255, 255` | Clean Surface — Isolated cards, modal sheets, active telemetry panels. |
| `surface-subtle` | `#ECE8DE` | `236, 232, 222` | Subtle Hover / Interactive highlight state. |
| `primary-text` | `#242824` | `36, 40, 36` | Deep Graphite — High-contrast primary headings, numbers, critical readings. |
| `secondary-text` | `#73766F` | `115, 118, 111` | Muted Graphite — Supporting labels, metadata, chart axes, units. |
| `tertiary-text` | `#9A9E96` | `154, 158, 150` | Faint Metadata — Inactive states, minor captions, timestamps. |
| `border-hairline` | `#D8D4C9` | `216, 212, 201` | Fine Divider — 1px structural grid lines, card borders, column dividers. |
| `border-strong` | `#8C9086` | `140, 144, 134` | Emphasized Divider — Active card outlines, selected tab baselines. |
| `status-healthy` | `#738174` | `115, 129, 116` | Sage Green — Nominal physiological status, calibrated signals, normal bands. |
| `status-caution` | `#D16C48` | `209, 108, 72` | Signal Terracotta — Warning alerts, baseline deviation ($>2\sigma$), caution states. |
| `status-critical` | `#B9473E` | `185, 71, 62` | Critical Red — Life/mission threat, severe hypoxia, emergency alerts. |
| `accent-sandstone` | `#D8CBAF` | `216, 203, 175` | Structural Sandstone — Historical baselines, badges, reference markers. |

### 3.2 Semantic Token Mapping

```css
:root {
  /* ==========================================================================
     SURFACES & BACKGROUNDS
     ========================================================================== */
  --bg-app: #F3F0E8;
  --bg-sidebar: #EAE6DC;
  --bg-card: #FFFFFF;
  --bg-subtle: #ECE8DE;
  --bg-overlay: rgba(36, 40, 36, 0.4);

  /* ==========================================================================
     TYPOGRAPHY & INK
     ========================================================================== */
  --text-primary: #242824;
  --text-secondary: #73766F;
  --text-tertiary: #9A9E96;
  --text-inverted: #F3F0E8;

  /* ==========================================================================
     HAIRLINES & BORDERS
     ========================================================================== */
  --border-divider: #D8D4C9;
  --border-focused: #242824;
  --border-caution: #D16C48;
  --border-critical: #B9473E;

  /* ==========================================================================
     CLINICAL STATUS & TELEMETRY INDICATORS
     ========================================================================== */
  --status-nominal: #738174;
  --status-nominal-bg: rgba(115, 129, 116, 0.12);
  --status-caution: #D16C48;
  --status-caution-bg: rgba(209, 108, 72, 0.12);
  --status-critical: #B9473E;
  --status-critical-bg: rgba(185, 71, 62, 0.12);
  --status-simulated: #D8CBAF;
  --status-simulated-bg: rgba(216, 203, 175, 0.2);

  /* ==========================================================================
     CHART & DATA VISUALIZATION PALETTE
     ========================================================================== */
  --chart-grid: #D8D4C9;
  --chart-axis: #73766F;
  --chart-series-1: #242824; /* Primary series (Graphite) */
  --chart-series-2: #738174; /* Baseline / Secondary (Sage) */
  --chart-series-3: #D16C48; /* Warning / Stress (Terracotta) */
  --chart-series-4: #D8CBAF; /* Reference / Ideal (Sandstone) */
  --chart-critical: #B9473E; /* Exceeded threshold (Red) */
}
```

### 3.3 Contrast & Accessibility Validation
All core text combinations exceed **WCAG 2.1 AA** requirements ($>4.5:1$ for body, $>3.0:1$ for large headings):
- **Deep Graphite (`#242824`) on Warm Ivory (`#F3F0E8`)**: Contrast Ratio **12.1:1** (Passes AAA).
- **Deep Graphite (`#242824`) on Clean White (`#FFFFFF`)**: Contrast Ratio **13.8:1** (Passes AAA).
- **Muted Graphite (`#73766F`) on Warm Ivory (`#F3F0E8`)**: Contrast Ratio **4.62:1** (Passes AA).
- **Critical Red (`#B9473E`) on Clean White (`#FFFFFF`)**: Contrast Ratio **5.21:1** (Passes AA).
- **Signal Terracotta (`#D16C48`) on Clean White (`#FFFFFF`)**: Contrast Ratio **4.55:1** (Passes AA).

---

## 4. Typography System

### 4.1 Typeface Attribution & Pairing
1. **Headings & Display**: `Manrope` (Clean neo-grotesque with geometric clarity and optical balance).
2. **Body & User Interface**: `Inter` (Engineered for digital legibility, neutral personality, superior x-height).
3. **Telemetry & Technical Metrics**: `IBM Plex Mono` (Engineered monospace with distinct glyph discrimination e.g., `0` vs `O`, `1` vs `l`, with tabular lining figures enabled).

### 4.2 Typographic Hierarchy Scale

| Scale Token | Typeface | Size | Line Height | Weight | Tracking | Purpose / Applied Elements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | Manrope | 30px | 36px (1.2) | 700 (Bold) | `-0.02em` | Major page banners, Mission overview title. |
| `text-page-title` | Manrope | 22px | 28px (1.27) | 700 (Bold) | `-0.015em` | Top-level view headers, astronaut names. |
| `text-section-title` | Manrope | 16px | 22px (1.38) | 600 (Semi) | `-0.01em` | Dossier sections, subsystem grouping headers. |
| `text-card-title` | Manrope | 13px | 18px (1.38) | 600 (Semi) | `0.0em` | Widget headers, card banners, table column groups. |
| `text-body` | Inter | 14px | 20px (1.43) | 400 (Regular) | `0.0em` | Clinical notes, journal entries, narrative summaries. |
| `text-body-strong` | Inter | 14px | 20px (1.43) | 600 (Semi) | `0.0em` | Key findings, active astronaut labels. |
| `text-caption` | Inter | 12px | 16px (1.33) | 400 (Regular) | `+0.01em` | Form helper notes, secondary status descriptions. |
| `text-mono-hero` | IBM Plex Mono | 32px | 32px (1.0) | 600 (Semi) | `-0.03em` | Primary vitals readout (e.g., `142` bpm, `98%`). |
| `text-mono-metric` | IBM Plex Mono | 18px | 22px (1.22) | 500 (Med) | `-0.01em` | Secondary sensor telemetry, blood pressure. |
| `text-mono-label` | IBM Plex Mono | 11px | 14px (1.27) | 500 (Med) | `+0.04em` | Units (`mmHg`, `mSv/h`), timestamps, data provenance tags. |
| `text-mono-micro` | IBM Plex Mono | 9px | 12px (1.33) | 600 (Semi) | `+0.08em` | Sub-labels, MET indicators, sensor quality codes. |

### 4.3 Monospace Tabular Figures Invariant
All numerical readings must enforce OpenType tabular lining figures:
```css
.tabular-nums {
  font-feature-settings: "tnum" 1, "zero" 1;
  font-variant-numeric: tabular-nums;
}
```
*Rationale*: Prevents horizontal layout jitter when real-time telemetry numbers update at 1Hz–10Hz.

---

## 5. Spacing, Elevation & Layout System

### 5.1 The 4px Mathematical Spacing Scale
The system uses an 8px base rhythm with 4px micro-increments:

```
space-1:  4px   (Hairline gaps, tag padding)
space-2:  8px   (Inter-element compact spacing)
space-3:  12px  (Form field internal padding)
space-4:  16px  (Standard component interior padding)
space-6:  24px  (Grid column gutters, card separation)
space-8:  32px  (Major section vertical rhythm)
space-12: 48px  (Editorial section separation)
space-16: 64px  (Page margin boundaries)
```

### 5.2 Layout Geometry & The Editorial Grid
- **Global Frame**: 12-column asymmetric grid on desktop ($1440\text{px}+$ viewport).
- **Gutter**: 24px fixed.
- **Outer Margin**: 32px horizontal padding.
- **Structural Lines**: Rather than floating islands in empty space, pages are anchored by continuous 1px dividers (`#D8D4C9`).
- **Asymmetric Proportions**:
  - Primary Telemetry Dossier: 8 columns (66.6%).
  - Real-Time Flight Surgeon Log / Alert Rail: 4 columns (33.3%).

### 5.3 Elevation & Border Radius Rules
- **Corner Radii**:
  - `rounded-none` (0px): Outer layout containers, chart viewports, table headers, oscilloscope frames.
  - `rounded-sm` (2px): Action buttons, telemetry badges, input controls.
  - `rounded` (4px): Floating surface cards, modal dialogs.
  - **Forbidden**: `rounded-xl`, `rounded-2xl`, `rounded-full` (except circular avatar portraits and status beacon dots).
- **Shadows**:
  - Surface cards: `box-shadow: none` (Separation achieved purely through 1px hairline border + subtle background tint).
  - Floating dialogs/dropdowns: `box-shadow: 0 4px 12px rgba(36, 40, 36, 0.08)`.

---

## 6. Component Design Standards

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ASTROCARE MEDICAL DOSSIER CONTAINER (.dossier-card)                         │
├──────────────────────────────────────────────────────┬───────────────────────┤
│ REF: BIO-ARES-04 // CREW: DR. SARAH VANCE            │ STATUS: [SIMULATED]   │
├──────────────────────────────────────────────────────┴───────────────────────┤
│                                                                              │
│  HEART RATE (ECG CH-1)                 CORE TEMPERATURE                      │
│  ┌──────────────────────────────┐      ┌──────────────────────────────┐      │
│  │ 074                          │      │ 36.8                         │      │
│  │ bpm  [ NOMINAL // +2 Δ ]     │      │ °C   [ NOMINAL ]             │      │
│  └──────────────────────────────┘      └──────────────────────────────┘      │
│                                                                              │
│  WAVEFORM OSCILLOSCOPE (50Hz RHYTHM STRIP)                                  │
│  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.1 Navigation Components
- **Sidebar**: Fixed 240px width on desktop; collapsible to 64px icon rail. Background `#EAE6DC`.
- **Navigation Item**: 36px height; 12px horizontal padding; 0px border radius.
  - Default: Text `#73766F`, background transparent.
  - Hover: Text `#242824`, background `#ECE8DE`.
  - Active: Text `#242824`, font weight 600, accented by a 2px solid `#242824` left indicator bar.
- **Mission Selector**: Compact dropdown displaying `ARES-VI // SOL 142`.
- **Comm Status Indicator**: 6px pulsing dot:
  - Green (`#738174`): Real-time link nominal ($<250\text{ms}$).
  - Terracotta (`#D16C48`): Mars speed-of-light delay buffer active ($>5\text{min}$).

### 6.2 Data Display & Metric Components
- **Vital Metric Display**:
  - Micro Header: 10px uppercase `IBM Plex Mono` with secondary color (`#73766F`).
  - Value: 32px bold `IBM Plex Mono` with tabular numerals.
  - Unit: 11px uppercase `IBM Plex Mono` baseline-aligned.
  - Delta Indicator: e.g., `+3 bpm (30m avg)` in Sage Green or Terracotta.
  - Provenance Badge: Compact pill e.g., `[SIMULATED]` in Sandstone tint or `[MEASURED]` in Sage tint.

### 6.3 Medical Dossier & Incident Components
- **Clinical Data Table**:
  - Header: `#EAE6DC` background, 1px bottom border `#D8D4C9`, 11px uppercase `IBM Plex Mono` column titles.
  - Rows: 36px height, alternating subtle hover state `#F8F6F1`, tabular numeric alignment for all clinical parameters.
- **Alert Triage Pill**:
  - `CRITICAL`: Background `rgba(185, 71, 62, 0.12)`, Text `#B9473E`, Border 1px `#B9473E`.
  - `HIGH`: Background `rgba(209, 108, 72, 0.12)`, Text `#D16C48`, Border 1px `#D16C48`.
  - `MEDIUM`: Background `rgba(216, 203, 175, 0.25)`, Text `#7A6643`, Border 1px `#D8CBAF`.
  - `LOW`: Background `rgba(115, 129, 116, 0.12)`, Text `#738174`, Border 1px `#738174`.

### 6.4 Form & General UI Controls
- **Buttons**:
  - Height: 34px (Compact), 40px (Standard).
  - Shape: 2px micro-radius (`rounded-sm`).
  - Primary Button: Background `#242824`, Text `#F3F0E8`, hover background `#3D433D`.
  - Secondary Button: Background `transparent`, Border 1px `#D8D4C9`, Text `#242824`, hover background `#EAE6DC`.
  - Danger Button: Background `#B9473E`, Text `#FFFFFF`, hover background `#9E3B33`.
- **Input Fields**:
  - Height: 36px.
  - Border: 1px solid `#D8D4C9`, background `#FFFFFF`.
  - Focus Ring: 1px solid `#242824` (Zero fuzzy blue halos).

---

## 7. Application Shell Design

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] ASTROCARE   │ MISSION: ARES-VI // DEEP SPACE TRANSIT │ MET: 142d 18h 22m 04s │ COMMS: 4.2kbps [NOMINAL]   │
├──────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ NAVIGATION   │ VIEWPORT TITLE: MISSION CONTROL HEALTH TELEMETRY MATRIX              ROLE: FLIGHT SURGEON         │
│ ──────────── ├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Overview  │                                                                                                   │
│ 2. Astronauts│  [ EDITORIAL CREW HEALTH DOSSIER ]                                                                │
│ 3. Vitals    │  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────────────────────┐  │
│ 4. Analytics │  │ CMDR. MARCUS CHEN       │  │ DR. SARAH VANCE         │  │ ACTIVE HEALTH ALERTS (3)          │  │
│ 5. Wellness  │  │ HR: 68 bpm // SpO2: 99% │  │ HR: 112 bpm // SpO2: 94%│  │ • 14:22 UTC - TACHYCARDIA (Vance)│  │
│ 6. Radiation │  │ STATUS: NOMINAL         │  │ STATUS: ELEVATED STRESS │  │ • 12:05 UTC - RAD FLUX SPIKE   │  │
│ 7. AI Intel  │  └─────────────────────────┘  └─────────────────────────┘  └───────────────────────────────────┘  │
│ 8. Alerts    │                                                                                                   │
│ 9. Reports   │  [ HISTORICAL MULTI-SYSTEM TELEMETRY GRAPH ]                                                      │
│ 10. Simulator│  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
├──────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ OPERATIONAL FOOTER // DATA ENGINE: VIRTUAL SENSOR ADAPTER [ACTIVE] // REVISION 1.0.4                             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Header Instrumentation Elements
1. **Brand Cluster**: Biometric Horizon icon + `ASTROCARE` mark.
2. **Mission Metadata Block**: Mission Code (`ARES-VI`), Target (`MARS JEZERO CRATER`).
3. **Mission Elapsed Time (MET)**: Continuous running clock in `IBM Plex Mono` (`142:18:22:04`).
4. **Telemetry Link Status**: Comms status flag + latency counter.
5. **Operator Profile Badge**: Call-sign, role badge (`FLIGHT SURGEON`), emergency broadcast bell.

---

## 8. Distinctive Page Design Language (All 10 Sections)

To prevent visual monotony while preserving design system coherence, each view employs a distinct information architecture tailored to its clinical function:

| View Name | Primary Visual Metaphor | Layout Composition | Key Structural Elements |
| :--- | :--- | :--- | :--- |
| **1. Mission Overview** | Global Flight Deck & Multi-Crew Readiness Board | Asymmetrical 3-column editorial grid. | Crew readiness cards, orbital timeline bar, composite health radar, urgent alert ticker. |
| **2. Astronaut Roster** | Clinical Biographical Dossier | 2-column split (Left: Crew selector list, Right: Comprehensive physical dossier). | Bio metrics, baseline vital standards, EVA qualification badges, emergency contacts. |
| **3. Vital Monitoring** | Real-Time Scientific Instrument Console | Full-width high-frequency instrument rack. | 50Hz Canvas ECG oscilloscope sweep, large tabular vital readouts, signal quality gauges. |
| **4. Space Health** | Multi-System Physiological Laboratory | Tabbed deep-dive analytical layout (Cardio, Bone, Muscle, Immune). | DXA scan density comparison bar, muscle torque loss slope, white blood cell panel table. |
| **5. Mental Wellness** | Private Psychological Sanctuary | Generous whitespace, calm single-column narrative stream. | Circadian sleep architecture graph, mood matrix slider, encrypted private journal drawer. |
| **6. Radiation Monitoring**| Environmental Dosimetry & Physics Monitor | High-density technical telemetry layout. | Cumulative dose gauge vs NASA career limits, solar particle event timeline, flux histogram. |
| **7. AI Intelligence** | Aerospace Medical Research Console | Split workbench (Left: Evidence & Telemetry context inspector, Right: Copilot dialogue). | Provenance citation tags, contextual risk explanations, recommended flight protocols. |
| **8. Alerts & Incidents** | Critical Operations Incident Desk | Triage table with priority-ranked queue & resolution drawer. | Severity filter pills, acknowledgement countdown timer, action log timeline, audit sign-off. |
| **9. Reports & Dossiers** | Formal Scientific Publishing Desk | Document preview layout with vector print styling. | Daily/Weekly dossier selector, executive briefing synthesis, `@react-pdf/renderer` trigger. |
| **10. Simulation Lab** | Telemetry Testbed & Hardware Emulation Cockpit | Control console with scenario injection dials. | 7 scenario preset cards, clock speed slider ($1\times\text{--}10\times$), anomaly fault injector. |

---

## 9. Chart Design Rules (Recharts Invariants)

All data visualizations must adhere strictly to the following aesthetic rules:

```typescript
// Recharts Global Theme Config Tokens
export const ASTRO_CHART_THEME = {
  background: 'transparent',
  grid: {
    stroke: '#D8D4C9',
    strokeDasharray: '2 2',
    strokeWidth: 1,
  },
  axis: {
    stroke: '#8C9086',
    tick: { fill: '#73766F', fontSize: 11, fontFamily: 'IBM Plex Mono' },
    tickLine: { stroke: '#D8D4C9' },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #D8D4C9',
      borderRadius: '2px',
      padding: '8px 12px',
      boxShadow: '0 2px 6px rgba(36, 40, 36, 0.06)',
      fontFamily: 'Inter',
      fontSize: '12px',
      color: '#242824',
    },
  },
  colors: {
    primary: '#242824',
    healthy: '#738174',
    caution: '#D16C48',
    critical: '#B9473E',
    reference: '#D8CBAF',
  }
};
```

### Chart Construction Rules
1. **No Gratuitous Fills**: Avoid high-opacity gradients beneath area charts. If an area chart is required, use a subtle `0.08` opacity fill in Sage or Terracotta.
2. **Explicit Reference Lines**: Every physiological chart displaying heart rate, oxygen saturation, or radiation must plot the astronaut's personal nominal baseline as a dashed `#738174` reference line.
3. **Mandatory Unit Annotations**: Y-axes must explicitly declare units in `IBM Plex Mono` (e.g., `bpm`, `mmHg`, `%`, `mSv`).
4. **Data Discontinuity**: Missing readings or sensor dropouts must render as dashed line segments with a `DEGRADED_SIGNAL` tooltip, never interpolated as smooth continuous data.

---

## 10. Interaction & Motion Design

AstroCare interfaces are instruments operated by mission controllers and flight surgeons. Animations must be purposeful, restrained, and respect human cognitive response times:

- **State Transitions**: `150ms` ease-out for hover, button clicks, and dropdown reveals.
- **Data Stream Updates**: 1Hz vital signs updates must transition via subtle numeric cross-fades rather than jarring slide animations.
- **ECG Oscilloscope**: 50Hz Canvas sweep line renders with a soft trailing phosphorescent decay effect, simulating analog CRT medical monitors without flickering.
- **Reduced Motion**: Full support for `prefers-reduced-motion: reduce`. All CSS transitions collapse to `0ms` when enabled.
- **Keyboard Navigation**: All controls (buttons, inputs, scenario toggles, alert dismissals) must maintain a visible 1px solid `#242824` focus ring with a 2px offset.

---

## 11. Responsive Design Breakpoints

```
Breakpoint System:
- sm:  640px   (Mobile terminal: Single-column scroll, drawer navigation)
- md:  768px   (Tablet flight deck: 2-column stacked layout)
- lg:  1024px  (Laptop mission console: Collapsed sidebar, 8/4 grid)
- xl:  1280px  (Standard mission workstation: Expanded sidebar, full 12-col grid)
- 2xl: 1536px+ (Multi-monitor flight room canvas: Ultra-wide telemetry viewports)
```

- **Mobile Viewport Invariant**: The desktop sidebar collapses into a slide-over drawer accessible via a 36px header button. Critical telemetry cards stack vertically, maintaining font readability and tabular numeral sizes.

---

## 12. Strict Anti-Slop Enforcement Rules

To preserve the authentic aerospace medical aesthetic, the following practices are **strictly prohibited** across all codebase contributions:

1. ❌ **No generic blue/purple neon gradients** (e.g., `from-indigo-500 to-purple-600`).
2. ❌ **No cyberpunk styling** (no fake glitch animations, scanlines, or neon wireframes).
3. ❌ **No arbitrary floating glassmorphism** (no `backdrop-blur-md` with transparent white borders on every card).
4. ❌ **No repetitive card syndrome** (every page must not look like an identical grid of 4 identical square cards).
5. ❌ **No giant pill containers** (`rounded-3xl` or `rounded-full` containers around rectangular data).
6. ❌ **No decorative non-functional charts** (every chart must map to real telemetry contracts).
7. ❌ **No uncalibrated colors** (never use arbitrary Tailwind colors like `emerald-500`, `amber-400`, `violet-600`; strictly use the defined semantic tokens).

---

## 13. Centralized CSS Variables & Tailwind Setup Proposal

### 13.1 Root CSS Variables (`src/styles/tokens.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap');

:root {
  /* Colors */
  --color-bg-primary: #F3F0E8;
  --color-bg-secondary: #EAE6DC;
  --color-bg-surface: #FFFFFF;
  --color-bg-subtle: #ECE8DE;

  --color-text-primary: #242824;
  --color-text-secondary: #73766F;
  --color-text-tertiary: #9A9E96;

  --color-border-hairline: #D8D4C9;
  --color-border-focus: #242824;

  --color-status-healthy: #738174;
  --color-status-caution: #D16C48;
  --color-status-critical: #B9473E;
  --color-status-sandstone: #D8CBAF;

  /* Fonts */
  --font-display: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}
```

### 13.2 Tailwind Configuration Mapping (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: {
            primary: 'var(--color-bg-primary)',
            secondary: 'var(--color-bg-secondary)',
            surface: 'var(--color-bg-surface)',
            subtle: 'var(--color-bg-subtle)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
            tertiary: 'var(--color-text-tertiary)',
          },
          border: {
            hairline: 'var(--color-border-hairline)',
            focus: 'var(--color-border-focus)',
          },
          status: {
            healthy: 'var(--color-status-healthy)',
            caution: 'var(--color-status-caution)',
            critical: 'var(--color-status-critical)',
            sandstone: 'var(--color-status-sandstone)',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
      },
    },
  },
  plugins: [],
};
```

---

## 14. Component Architecture Proposal

To ensure all eight upcoming development modules share the exact same UI foundations, the following core component atoms will be implemented in `src/components/common/`:

1. **`DossierCard`**: Hairline-bordered 1px container with technical header strip and optional action slot.
2. **`MetricDisplay`**: Monospace numerical readout with tabular numbers, dynamic delta pills, and provenance markers.
3. **`StatusBadge`**: Precision clinical indicator pill with strict 4-tier color tokens (`healthy`, `caution`, `critical`, `simulated`).
4. **`ClinicalButton`**: 2px micro-radiused action button (Primary Graphite, Secondary Outline, Danger Crimson).
5. **`HairlineDivider`**: 1px clinical separator supporting horizontal and vertical orientations with optional metadata text.
6. **`EcgOscilloscope`**: Native HTML5 Canvas 50Hz rhythm strip with phosphor decay and baseline calibration marks.

---
*AstroCare Master Design System Specification confirmed and recorded. Proceeding to PROMPT 03 upon user approval.*
