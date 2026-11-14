# NASA Data and Scientific Resource Validation

This document describes the NASA data authorities, API endpoints, metadata schemas, rate-limiting policies, and NASA software assurance standards implemented in the AstroCare Quality Assurance Framework.

---

## 1. Authoritative NASA Data Resources Implemented

### A. NASA Open APIs (`api.nasa.gov`)
- **Official URL:** [https://api.nasa.gov/](https://api.nasa.gov/)
- **Adapter Implementation:** `NasaApiAdapter` (`src/adapters/nasa/NasaApiAdapter.ts`)
- **Implemented Endpoints:**
  - `GET /planetary/apod` (Connectivity & availability probe)
- **Rate-Limit Enforcement:**
  - `DEMO_KEY`: Strict ceiling of 30 requests per hour and 50 requests per day. The framework alerts if tests exceed this quota.
  - Registered Key: Default limit of 1,000 requests per hour.
- **Safety Safeguard:** All automated test suites run in `mockMode: true` by default to avoid exhausting live NASA API quotas.

### B. NASA Open Science Data Repository (OSDR)
- **Official URL:** [https://osdr.nasa.gov/](https://osdr.nasa.gov/)
- **API Documentation:** [https://osdr.nasa.gov/geode-py/ws/](https://osdr.nasa.gov/geode-py/ws/)
- **Adapter Implementation:** `NasaOsdrAdapter` (`src/adapters/nasa/NasaOsdrAdapter.ts`)
- **Implemented Endpoints:**
  - `GET /geode-py/ws/repo/search?term={term}` (Study dataset discovery)
  - `GET /geode-py/ws/studies/{accession}` (Full study metadata retrieval)
- **Metadata Validation:**
  - Accession format verification (`OSD-XXX` pattern)
  - Organism classification, sample counts, and assay counts
  - Data file lineage, format, checksum (SHA-256), and remote URL pointers
- **Data Policy:** Tests validate study and file metadata contracts. Large multi-gigabyte raw sequencing payloads are never downloaded during routine tests.

### C. NASA Technical Reports Server (NTRS)
- **Official URL:** [https://ntrs.nasa.gov/](https://ntrs.nasa.gov/)
- **API Documentation:** [https://ntrs.nasa.gov/api/openapi/](https://ntrs.nasa.gov/api/openapi/)
- **Adapter Implementation:** `NasaNtrsAdapter` (`src/adapters/nasa/NasaNtrsAdapter.ts`)
- **Implemented Endpoints:**
  - `GET /api/citations/search?q={query}` (Literature search)
  - `GET /api/citations/{id}` (Publication citation retrieval)
- **Citation Metadata Validation:**
  - Publication identifier, author affiliations, abstract, subject categories, and landing page URLs.
  - **Notice on Full Text:** Full-text PDF documents are not available for every publication. The validator treats PDF absence as an informational warning, not a validation failure.

### D. NASA Open Data Portal (`data.nasa.gov`)
- **Official URL:** [https://data.nasa.gov/](https://data.nasa.gov/)
- **Adapter Implementation:** `NasaDataPortalAdapter` (`src/adapters/nasa/NasaDataPortalAdapter.ts`)
- **Catalogue Notice:** `data.nasa.gov` serves as a discovery catalogue. Actual underlying data is hosted by specialized NASA archives (PDS, DAAC, LSDA, OSDR). The adapter verifies dataset discovery records and warns that underlying download requires the host repository's adapter.

---

## 2. NASA Software Engineering & Assurance Guidance

The framework aligns with principles established in authoritative NASA standards:

1. **NASA NPR 7150.2D — NASA Software Engineering Requirements:**
   - *Requirements Traceability:* Each test case is uniquely identified and tagged with its target module and severity.
   - *Verification Evidence:* Test execution durations, timestamps, and actual vs expected values are recorded without fabrication.
   - *Defect Tracking:* Distinguishes execution failures (`FAIL`) from unexecuted tests blocked by prerequisites (`BLOCKED`).

2. **NASA-STD-8739.8B — Software Assurance and Software Safety Standard:**
   - *Safety Boundary Enforcement:* The biomedical validator enforces `isDiagnostic: false` to ensure algorithms never issue autonomous diagnoses.
   - *Radiation Calculation Integrity:* Biological weighting factors ($w_R$) strictly differentiate physical absorbed dose ($\text{Gy}$) from equivalent dose ($\text{Sv}$).
   - *Anti-Hallucination & Provenance:* AI outputs are strictly grounded against supplied telemetry and citations. Deterministic fallbacks are never labeled as generative model outputs.

3. **NASA Software Engineering Handbook:**
   - Practical automated regression verification and change-impact detection across module manifests.

---

## 3. Mandatory Disclaimer

> **IMPORTANT NOTICE:** AstroCare is a research and clinical decision-support platform developed by university students and researchers. It does not claim formal NASA certification, NASA endorsement, compliance certification, or flight-software qualification under NASA NPR 7150.2D. The NASA references cited herein serve strictly as engineering quality benchmarks and guidance standards.
