# AstroCare P14 — NASA Human-Spaceflight Risk Intelligence

> **Aerospace Biomedical Intelligence, NASA Evidence Library, and Mission Health Risk Analysis**  
> Grounded in the **NASA Human Research Program (HRP)**, **NASA Human Research Roadmap (HRR)**, **NASA Open Science Data Repository (OSDR)**, and **NASA Technical Reports Server (NTRS)**.

---

## 1. Overview

**AstroCare P14** is an aerospace biomedical research and clinical intelligence module engineered to monitor, understand, and evaluate astronaut physiological risks during orbital and deep-space missions.

P14 is developed as an **independent, self-contained module** with complete feature isolation under `src/features/risk-intelligence/`. It runs standalone for rapid evaluation and testing, and is structured for seamless, selective integration into the master AstroCare multi-module application.

### Key Capabilities

1. **Spaceflight Risk Dashboard**: 8 primary biomedical risk categories established by the NASA Human Research Program.
2. **Dedicated Physiological Risk Pages**:
   - **Radiation Risks**: Galactic Cosmic Rays (GCR), Solar Particle Events (SPE), Van Allen Belts, clustered DNA DSBs, endothelial senescence, 600 mSv career limit.
   - **Cardiovascular Risks**: Hydrostatic fluid redistribution, 10–15% plasma volume contraction, left ventricular mass reduction, internal jugular vein flow stasis/thrombosis, orthostatic intolerance.
   - **Bone Health Risks**: Osteocyte mechanotransduction arrest, sclerostin/RANKL uncoupling, trabecular microarchitectural loss, calcium balance, and nephrolithiasis risk.
   - **Muscle Health Risks**: Postural soleus/gastrocnemius atrophy, slow-to-fast (Type I to Type II) fiber-type switching, MuRF1/Atrogin-1 ubiquitin-proteasome degradation.
   - **Immune System Risks**: Blunted T-cell receptor (TCR) PKC translocation, latent herpesvirus reactivation (EBV, CMV, VZV in > 60% of crew), altered microbial virulence in closed habitats.
   - **Sleep & Circadian Risks**: 90-minute orbital cycle disruption (16 sunrises/sunsets daily), slow-wave/REM sleep fragmentation, average flight sleep < 6.0h, Martian 24h 39m sol desynchrony.
   - **Psychological & Behavioral Risks**: Isolation, confinement, sensory monotony, interpersonal friction, Earth-out-of-view phenomenon, and third-quarter morale decline.
   - **Vision & Neurological Risks (SANS)**: Translaminar cribrosa pressure gradient inversion, optic disc edema (papilledema), posterior globe flattening, choroidal folds, hyperopic shifts, and MTHFR one-carbon metabolic genetic variants.
3. **NASA Evidence Library**: Comprehensive index of astronaut flight studies, ground-based analogs (6° head-down tilt bed rest, HERA, NEK isolation), animal models, and cell cultures. Rigorously segregates direct human astronaut findings from pre-clinical models.
4. **NASA OSDR Study Discovery**: Direct integration and study search against the NASA Open Science Data Repository (`https://osdr.nasa.gov/osdr/data/search`), complete with verified flight payloads, assays, and specimen metadata.
5. **Mitigation Strategies Intelligence**: Operational flight countermeasures (ARED, CEVIS, dynamic SSLA circadian lighting, fluid loading, compression garments) vs. analog-validated and advanced R&D protocols (LBNP daily vacuum suits, bisphosphonates, radioprotective antioxidants).
6. **Mission Risk Analysis & Side-by-Side Comparison**: Configurable mission simulator (LEO, Lunar Gateway, Artemis Lunar Base, Mars Conjunction 1000-day, Deep-Space Asteroid). Delivers research-based qualitative relevance without fabricated probabilities. Supports side-by-side comparative analysis of two mission architectures.
7. **Research Insights**: Deep mechanistic scientific explainers answering fundamental spaceflight medicine questions grounded in peer-reviewed aerospace evidence.

---

## 2. Visual Identity & Aesthetic Direction

- **Dark Navy & Charcoal Workspace**: Deep space palette (`#050811`, `#070C18`, `#0F172A`, `#1E293B`).
- **Restrained Scientific Accents**: Cyan (`#00B4D8`), Blue (`#3B82F6`), Teal (`#00F5D4`), Violet (`#8B5CF6`), and Amber (`#F59E0B`).
- **Subtle borders, clean cards, and responsive layouts**.
- **No decorative clutter or unsupported numerical illness scores**.

---

## 3. Technology Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript 5.6
- **UI Framework**: React 18
- **Styling**: Tailwind CSS 3.4 with custom aerospace space-navy theme
- **Icons**: Lucide React
- **Build Tool**: Vite 5.4
- **Test Framework**: Vitest 2.1 with full automated test suite

---

## 4. Quick Start (Running P14 Standalone)

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Run test suite
npm test

# 4. Type check and build production bundle
npm run build
```

The application will start on `http://localhost:5173/` with full interactive routing, evidence searching, OSDR exploration, and mission analysis.

---

## 5. Verification & Testing

P14 includes automated unit and integration tests covering:
- 8 NASA HRP Risk Category schemas and metadata integrity.
- Direct astronaut human evidence vs. pre-clinical classification enforcement.
- NASA OSDR study search and fallback archive.
- Flight-operational countermeasures and residual risk notices.
- Qualitative mission risk relevance without fabricated probabilities.
- Side-by-side mission comparative evaluation logic.
- Multi-domain risk comparison and shared physiological systems.

Run all tests:
```bash
npm test
```

---

## 6. Scientific Integrity Rules

1. **Zero Fabricated Citations**: All research citations are verified against real NASA HRP publications, Science, Nature, JAMA, or official NTRS accession numbers.
2. **Clear Classification**: Pre-clinical animal and cell models are never represented as direct proof of human astronaut deep-space outcomes.
3. **No Fabricated Probabilities**: Mission risk relevance is strictly presented as qualitative research assessments grounded in peer-reviewed literature.
4. **Countermeasure Residual Risk**: Every mitigation strategy explicitly discloses residual risk (e.g. ARED preserves gross BMD but does not eliminate trabecular microarchitectural loss).
