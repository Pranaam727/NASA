# AstroCare Gemini AI Intelligence Module (`ai-intelligence`)

An aerospace biomedical intelligence module powered by Google's Gemini API, purpose-built for the **AstroCare** astronaut health and spaceflight research platform.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.3-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.3-purple.svg)
![Gemini API](https://img.shields.io/badge/Google%20Gen%20AI-2.5%20Flash-emerald.svg)

---

## Features

1. **AI Assistant:**
   - Multi-turn chat interface with session management and history export.
   - Domain-specific suggested questions and contextual prompts.
   - Comprehensive error recovery, latency indicator, and retry states.
   - Rich Markdown formatting with interactive citation chips.

2. **Health Data Interpretation:**
   - Structured intake across 5 domains: Cardiovascular, Musculoskeletal, Radiation, Sleep, and Immune.
   - Real-time comparison against baseline and nominal ranges.
   - Interactive telemetry slider to simulate anomalies (e.g. drop HRV, increase cabin CO2, spike bone resorption).
   - Strict separation of factual **Observations** from pathophysiological **Hypotheses**.

3. **Research Assistant:**
   - Verified NASA Technical Report Server (NTRS) Evidence Books & peer-reviewed literature.
   - Interactive Terminology Explainer (SANS, cephalad fluid shift, GCR, SPE, BMD resorption, ARED).
   - Zero hallucination guarantee: citations map exclusively to verified publications.

4. **Mission Context Engine:**
   - Adjust mission phases (Pre-launch, Long-duration ISS, Lunar Transit, Mars Surface).
   - Dynamic environmental telemetry (Cabin CO2, GCR dosimeter rates, exercise compliance).
   - Cross-domain contextual correlation linking environmental stressors to physiological outcomes.

5. **AI Insights & Risk Stratification:**
   - Executive multi-domain status synthesis.
   - Aerospace biomedical risk pattern matrix (low, moderate, elevated, high).
   - Concrete suggested inquiries for certified Flight Surgeons and Biomedical Engineers (BMEs).
   - Explicit grounding disclosures for missing or noisy telemetry channels.

6. **Safety & Zero-Exposure Architecture:**
   - Strict non-diagnostic clinical advisory banner.
   - Secure backend proxy prevents Gemini API key exposure in frontend bundles.
   - Transparent Mock Simulation Mode when no API key is configured.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run frontend + backend proxy concurrently
npm run dev

# Run test suite
npm test

# Build production distribution
npm run build
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for complete embedding instructions into the AstroCare master platform.
