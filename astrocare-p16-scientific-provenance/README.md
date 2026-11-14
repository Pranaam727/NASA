# AstroCare P16 — Scientific Provenance & Citation Intelligence

> Aerospace Biomedical Intelligence Platform: NASA Research Verification, Evidence Traceability, Scientific Source Registry & Insight Attribution.

---

## Overview

**AstroCare P16** is a standalone, fully functional scientific provenance and citation intelligence platform developed for the AstroCare aerospace biomedical suite. It provides end-to-end evidence traceability, ensuring that clinical interpretations, astronaut health monitors, and generative AI research summaries can be verified against authentic NASA Human Research Program publications, peer-reviewed medical journals, and NASA Open Science Data Repository (OSDR) datasets.

---

## Key Features

1. **Scientific Source Registry:** Structured registry of authentic NASA Technical Reports, Evidence Reports, and peer-reviewed studies with full metadata tracking (DOI, accession numbers, publisher, volume, retrieval timestamps).
2. **NASA Research Discovery:** Search and ingest records from official NASA repositories (Human Research Program, Human Spaceflight Risk Portfolio, OSDR, and NTRS).
3. **Scientific Claim Registry:** Management of aerospace health claims across bone/muscle, radiation, cardiovascular, neurovestibular, immune, and circadian domains with review status tracking (Supported, Partially Supported, Needs Review, Unsupported, Disputed).
4. **Claim-to-Source Traceability:** Bidirectional relationship explorer linking claims to supporting sources and granular evidence records.
5. **Evidence Classification & Quality Matrix:** Transparent disclosure of study populations, sample sizes (e.g. n=1 twin flight vs n=17 astronaut cohort), experimental methodologies, and limitations without arbitrary quality scores.
6. **Citation Formatting Engine:** Instantly formats references in **APA 7th, IEEE, Vancouver, and Harvard**, with one-click copy and BibTeX export. Flags incomplete metadata warnings without fabricating missing data.
7. **Source Validation & Duplicate Collision Detection:** Normalizes canonical URLs, DOIs, and OSDR IDs to detect duplicate registrations and distinguish static schema validation from live network reachability checks.
8. **Insight Lineage & Gemini AI Attribution:** Multi-tier lineage tracker (Insight → Datasets → Sources → Claims) declaring prompt parameters, temperature, confidence scores, and simulation boundaries.
9. **Dataset Attribution (NASA OSDR):** Dedicated management for NASA GeneLab & Ames Life Sciences accessions (e.g., OSDR-379, OSDR-194, OSDR-421).
10. **Research Transparency Dossiers:** Generates verifiable audit reports in Markdown, JSON, and CSV.
11. **Demonstration Audit History:** Tracks source additions, edits, evidence linkages, and validation checks with local persistence and one-click baseline restoration.

---

## Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (Dark aerospace biomedical visual identity with navy, charcoal, cyan, and violet accents)
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library + JSDOM

---

## Quick Start

### Installation
```bash
# Clone or extract repository
cd prompt-16

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```

### Running Test Suite
```bash
npm test
```

### Building for Production
```bash
npm run build
```

---

## Architecture & Master Integration

All P16 code is encapsulated inside `src/features/scientific-provenance/`. The module exposes a clean public API via `src/features/scientific-provenance/index.ts`, allowing selective integration into the AstroCare master project without modifying existing routers or global styles.

Refer to `INTEGRATION_GUIDE.md` for detailed instructions on merging P16 into the master AstroCare application.
