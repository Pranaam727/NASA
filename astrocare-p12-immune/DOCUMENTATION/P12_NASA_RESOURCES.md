# AstroCare P12 — NASA Research Resources & OSDR Integration

This document catalogues the official NASA research publications, human research roadmaps, technical reports, and NASA Open Science Data Repository (OSDR) datasets integrated into Module P12.

---

## 1. Official NASA Research Frameworks

### NASA RESOURCE 1 — Risk of Altered Immune System Responses
- **Source URL:** https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/
- **Organization:** NASA Human Research Program (HRP)
- **Relevance:** Foundational justification for spaceflight immune monitoring across blood, saliva, and urine biospecimens; addresses subclinical latent viral reactivation, allergy, and post-flight recovery.

### NASA RESOURCE 2 — NASA Immunology and Virology Laboratory
- **Source URL:** https://www.nasa.gov/directorates/esdmd/hhp/immunology-and-virology/
- **Organization:** NASA Johnson Space Center (JSC)
- **Relevance:** Primary operational research protocols for spaceflight flow cytometry, early T-cell activation, ex-vivo NK-cell cytotoxicity assays, and salivary herpesvirus qPCR.

### NASA RESOURCE 3 — NASA Immune Risk Portfolio
- **Source URL:** https://www.nasa.gov/directorates/esdmd/hhp/immune-risk/
- **Organization:** NASA Exploration Systems Development Mission Directorate
- **Relevance:** Risk architecture for deep space transit to the Moon and Mars; clinical criteria and countermeasure development.

### NASA RESOURCE 4 — NASA Human Research Roadmap (Risk i=85)
- **Source URL:** https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=85
- **Organization:** NASA Human Research Program
- **Relevance:** "Risk of Adverse Health Event Due to Altered Immune System". Outlines the formal evidence base, research milestones, and progress criteria for spaceflight clinical immunological flight rules.

### NASA RESOURCE 5 — NASA Immune Research Gap IM-106
- **Source URL:** https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=818
- **Organization:** NASA Human Research Roadmap
- **Relevance:** "Characterize the Effects of Stress, Microgravity, Radiation, Nutrition, Circadian Misalignment, Hypoxia, and Spaceflight Multi-Stressor Synergies on Immune Dysregulation." Directly motivates P12's cross-module context interfaces with P10 (Radiation) and P11 (Sleep/Wellness).

### NASA RESOURCE 6 — Long-Term Spaceflight Alters Immunity
- **Source URL:** https://www.nasa.gov/missions/station/scientists-probe-how-long-term-spaceflight-alters-immunity/
- **Organization:** NASA International Space Station Research & Science
- **Relevance:** Longitudinal sampling methodology spanning pre-flight, in-flight (ISS), and post-flight recovery windows.

### NASA RESOURCE 7 — NASA Flow Cytometry Methods (NTRS-20230016983)
- **Source URL:** https://ntrs.nasa.gov/citations/20230016983
- **Title:** *Flow Cytometry Methods to Monitor Immune System Dysregulation in Astronauts*
- **Organization:** NASA Technical Reports Server (NTRS)
- **Relevance:** Technical specification of fluorophore-conjugated antibody panels, lymphocyte gating strategies, cytometric bead arrays, and biospecimen cryopreservation standards.

---

## 2. NASA OSDR Datasets Investigated & Integrated

| Study Identifier | Study Title | Biological Organism | Specimen / Tissue | Assay Type | Model System Classification | Access Level |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OSD-575** | SpaceX Inspiration4 Blood Serum Metabolic Panel and Immune/Cardiac Cytokine Arrays | *Homo sapiens* (Civilian crew, n=4) | Venous Blood Serum (Pre/In/Post) | Luminex 37-Plex Bead Array & Chemistry | **Human Astronaut Research** | Open Science (OSDR) |
| **OSD-53** | Spaceflight Modulates Gene Expression in Astronauts | *Homo sapiens* (ISS / STS crew) | Venous Whole Blood (PBMC) | Whole-Genome RNA-Seq & Microarray | **Human Astronaut Research** | Open Science (OSDR) |
| **OSD-2** | Response of Human Lymphoblastoid Cells to HZE (Iron Ions) or Gamma-Rays | *Homo sapiens* (TK6 / WTK1 cell lines) | In-Vitro Cultured Lymphoblasts | Microarray & Clonogenic Survival | **Human Cell-Model Research** *(NOT direct astronaut test)* | Open Science (OSDR) |
| **OSD-4** | Microarray Analysis of Space-Flown Murine Thymus Tissue | *Mus musculus* (C57BL/6J female mice) | Murine Thymus Tissue (STS-108) | Affymetrix Murine Genome Microarray | **Animal-Model Research** *(NOT human clinical data)* | Open Science (OSDR) |
| **OSD-54** | Immune Responses to the In-Vitro LPS Assault Engineered in Spaceflight Study | *Homo sapiens* (Ex-vivo whole blood) | LPS-Stimulated Whole Blood | Multiparameter ELISA & RNA Profiling | **In-Vitro / Ex-Vivo Research** *(Stimulation challenge)* | Open Science (OSDR) |

---

## 3. Data-Source Limitations & Offline Resilience

- **Static Metadata Catalogue:** P12 provides a verified static metadata catalogue of OSDR datasets and NASA resources.
- **Offline Reliability:** The application does not crash or freeze if NASA OSDR endpoints or internet connectivity are unavailable.
- **Authentic Links:** Every dataset and research record provides direct, valid hyperlinks to the official `osdr.nasa.gov` and `nasa.gov` portals.
