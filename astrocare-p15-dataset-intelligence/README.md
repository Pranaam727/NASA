# AstroCare P15 — NASA Biomedical Dataset Intelligence
### NASA Open Science Data Repository Explorer, Biomedical Data Analytics & Comparative Research

![AstroCare P15](https://img.shields.io/badge/AstroCare-Module%20P15-06B6D4?style=for-the-badge)
![NASA OSDR](https://img.shields.io/badge/NASA-OSDR%20Integrated-3B82F6?style=for-the-badge)
![Status](https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge)
![Tests](https://img.shields.io/badge/Vitest-16%2F16%20Passing-emerald?style=for-the-badge)

AstroCare P15 is an aerospace biomedical research intelligence platform module engineered to monitor, understand, and research astronaut health during spaceflight missions. It provides genuine data exploration across the **NASA Open Science Data Repository (OSDR)**, multi-study comparative analytics with biological population checking, longitudinal mission epoch tracking, an interactive data visualization studio, and automated research dossier generation.

---

## Key Features

1. **NASA Dataset Intelligence Dashboard**:
   - Executive telemetry cards (Total Discovered, Biomedical Studies, Human/Animal/Cell breakdown, Active Categories).
   - Visualizations of study distributions, organism breakdown, mission profiles, and health domains.
   - Genuine telemetry provenance tags (`LIVE NASA API`, `VERIFIED OSDR RECORD`, `DEMONSTRATION VALUE`).

2. **NASA OSDR Query Engine**:
   - Live query adapter targeting official OSDR endpoints:
     - Search: `https://osdr.nasa.gov/osdr/data/search`
     - Study Metadata: `https://osdr.nasa.gov/osdr/data/osd/meta/{id}`
     - File Manifest: `https://osdr.nasa.gov/osdr/data/osd/files/{id}`
   - Automatic proxy handling to bypass browser CORS restrictions.
   - Graceful fallback to verified authentic NASA benchmark datasets.

3. **Dataset Catalogue & Domain Exploration**:
   - Multi-category browser spanning 10 NASA Human Research Program (HRP) health risk domains: Cardiovascular, Bone, Muscle, Immune, Radiation, Sleep, Behavioral, Vision, Microbiome, and Metabolism.
   - Dual viewing modes: Modern card layout and sortable compact metadata table.

4. **Strict Biological Model Classification**:
   - Preserves original study terminology and taxonomy.
   - Enforces scientific stratification between living human astronauts, ground-based bed rest analogs, animal models (*Mus musculus*), and in vitro cell lines.
   - Never infers human participation from a mission name alone.

5. **Comparative Analytics Workspace**:
   - 5-point scientific comparability checklist: Organism check, Population model check, Unit consistency, Gravitational environment, and Temporal phase mapping.
   - **Mandatory Scientific Integrity Enforcement**: Automatically blocks direct numerical cohort merging across incompatible species or assays while providing side-by-side qualitative evaluation matrices.

6. **Longitudinal Analysis Studio**:
   - Chronological mapping across standard spaceflight epochs: Preflight baseline (`L-44`, `L-3`), Inflight orbital microgravity (`FD-2`), and Postflight terrestrial recovery (`R+1`, `R+3`, `R+82`).
   - Stratified cohort averages and individual biorepository sample tracking.

7. **Data Visualization Studio**:
   - Interactive Recharts studio: Line charts, grouped bar charts, scatter plots, and data tables.
   - Descriptive cohort statistics (N, Mean, Median, StdDev, Min, Max).
   - Unit-preserving CSV and JSON export.

8. **Research Report Generator**:
   - Structured research summaries (Executive Summary, Study Objectives, Experimental Protocols, Observed Findings, Limitations, Primary OSDR References).
   - Export to Markdown, CSV metrics, and print-ready PDF view.

---

## Verified NASA Candidate Datasets Included

| Accession | Study Title | Organism | Study Model | Primary Domain |
|---|---|---|---|---|
| **OSD-575** | SpaceX Inspiration4 Blood Serum Metabolic Panel & Cytokine Arrays | *Homo sapiens* | Human Spaceflight | Cardiovascular / Immune |
| **OSD-53** | Spaceflight Modulates Gene Expression in Astronauts | *Homo sapiens* | Human Spaceflight | Immune / Transcriptomics |
| **OSD-2** | Response of Human Lymphoblastoid Cells to HZE Fe-56 or Gamma-rays | *Homo sapiens* (TK6) | Cell Culture (NSRL) | Radiation Biology |
| **OSD-4** | Microarray Analysis of Space-flown Murine Thymus Tissue (STS-118) | *Mus musculus* | Animal Model | Immune System |
| **OSD-54** | Immune Responses to In Vitro LPS Assault in Simulated Microgravity | *Homo sapiens* (In Vitro) | Cell Culture | Immune System |
| **OSD-661** | Countering Muscle and Bone Loss with Spaceflight: GSK3 as Target | *Mus musculus* | Animal Model (HLS) | Bone and Muscle |
| **OSD-73** | Transcriptome Profiles in Human Bronchial Epithelial Cells (HZE) | *Homo sapiens* (NHBE) | Cell Culture (NSRL) | Radiation Biology |
| **OSD-174** | Circadian Clock Gene Expression in Hair Follicles of ISS Astronauts | *Homo sapiens* | Human Spaceflight | Sleep & Behavioral |
| **OSD-471** | Spaceflight-Induced Bone Loss in Murine Spinal Segments (Bion-M1) | *Mus musculus* | Animal Model (Orbital) | Bone and Muscle |
| **OSD-751** | Spaceflight Effects on Inflammasome Activation in Mouse Brain (RR-1) | *Mus musculus* | Animal Model (ISS) | Neuro-Behavioral |

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone or extract repository
cd "c:/Users/Pooja/OneDrive/Desktop/prompt 15"

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to explore the AstroCare P15 interface. The Vite dev server automatically proxies `/api/osdr` to NASA's live OSDR endpoint.

### Running Test Suite
```bash
npm test
```
Executes 16 comprehensive unit and integration tests with Vitest covering the OSDR search adapter, metadata parsing, classification, compatibility checks, and report generation.

### Production Build
```bash
npm run build
```
Typechecks with `tsc` and generates minified, production-ready static assets in `dist/`.

---

## Integration into Master AstroCare

For detailed step-by-step instructions on selectively merging P15 into the existing AstroCare master application without disrupting P01–P14 code, refer to [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md).

---

## License

Developed for the AstroCare Aerospace Biomedical Intelligence Platform under NASA Open Science Data Repository Open Science policies.
