# AstroCare P12 — Biomedical Data Dictionary

This document details every clinical, cytometric, biochemical, and operational data entity, field, measurement unit, reference standard, and calculation rule in Module P12.

---

## 1. Leukocyte & Cytometric Parameters

| Identifier | Name | Unit | Terrestrial Reference Interval | Source & Assay Standard | Clinical Significance in Spaceflight |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `WBC_TOTAL` | Total Leukocyte Count | x10^9 / L | 4.5 – 11.0 | Automated Hematology (Sysmex XN) / NASA HHP | Microgravity fluid shift causes initial hemoconcentration; mild granulocytic shift common. |
| `LYMPHOCYTE_ABS` | Absolute Lymphocyte Count | x10^9 / L | 1.0 – 4.8 | Flow Cytometry / Automated Differential | Evaluates circulating cell-mediated adaptive pool; functional lymphopenia monitored. |
| `NEUTROPHIL_ABS` | Absolute Neutrophil Count | x10^9 / L | 1.8 – 7.7 | Automated Differential Counter | Acute neutrophilia documented post-launch and post-landing due to gravitational readaptation stress. |
| `MONOCYTE_ABS` | Monocyte Count | x10^9 / L | 0.2 – 0.8 | Automated Differential / Flow Cytometry | Antigen presenting and phagocytic precursor; altered cytokine secretion dynamics in-flight. |
| `EOSINOPHIL_ABS` | Eosinophil Count | x10^9 / L | 0.02 – 0.50 | Automated Differential Counter | Monitored for allergic hypersensitivity to spacecraft cabin particulates. |
| `BASOPHIL_ABS` | Basophil Count | x10^9 / L | 0.02 – 0.10 | Automated Differential Counter | Granulocytic marker involved in histamine release and hypersensitivity cascades. |
| `CD3_T_CELL` | CD3+ Pan T Cells | cells/µL | 700 – 2100 | NTRS-20230016983 Multiparameter Flow Panel | Total circulating T-cell compartment coordinating adaptive cellular immunity. |
| `CD4_HELPER_T` | CD4+ Helper T Lymphocytes | cells/µL | 400 – 1400 | NTRS-20230016983 Flow Panel | Directs cytokine cascades and B-cell antibody class switching; counts decline moderately in-flight. |
| `CD8_CYTOTOXIC_T`| CD8+ Cytotoxic T Lymphocytes| cells/µL | 200 – 900 | NTRS-20230016983 Flow Panel | Primary defense against intracellular pathogens and viral reactivation surveillance. |
| `CD4_CD8_RATIO` | CD4 / CD8 Ratio | ratio | 1.0 – 3.5 | Flow Cytometry Calculated Parameter | Inversion (<1.0) indicates chronic immune activation, latent herpesvirus challenge, or senescence. |
| `B_CELL_CD19` | CD19+ B Lymphocytes | cells/µL | 100 – 500 | NTRS-20230016983 Flow Panel | Humoral antibody precursor; generally stable during short-duration orbital missions. |
| `NK_CELL_CD16_56`| CD16+CD56+ Natural Killer Cells| cells/µL | 90 – 600 | NTRS-20230016983 Flow Panel | Innate antiviral and oncolytic surveillance. **Note: Count does not indicate function.** |
| `NK_CYTOTOXICITY_LYSIS`| NK Cytotoxic Activity | % Target Lysis | 20.0 – 50.0 | Ex-Vivo Calcein-AM Release vs K562 Targets (HRR-85) | Functional cytolytic competence; routinely suppressed by 30-50% in long-duration spaceflight. |
| `T_CELL_STIM_PHA`| T-Cell Mitogenic Response | Stimulation Index | 35.0 – 95.0 | Ex-Vivo Phytohemagglutinin Culture | Functional blastogenesis and activation capacity; significantly depressed in microgravity. |
| `VIRAL_SHEDDING_EBV`| Salivary EBV DNA Copies | copies/mL | 0 – 50 (Target: 0) | WetLab-2 Quantitative Real-Time PCR (qPCR) | Sensitive biomarker of neuroendocrine stress and cytotoxic surveillance depression. |

---

## 2. Cytokines, Inflammatory Reactants & Stress Hormones

| Identifier | Analyte | Unit | Reference Interval | Standard / Assay | Spaceflight Relevance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `IL_6` | Interleukin-6 | pg/mL | 0.5 – 5.0 | Luminex 37-Plex Bead Array / OSD-575 | Pleiotropic inflammatory cytokine; prominent post-splashdown surge and mission elevation. |
| `TNF_ALPHA` | Tumor Necrosis Factor-α | pg/mL | 0.5 – 6.0 | Luminex Multiplex / OSD-575 Standard | Mediator of systemic inflammation, muscle atrophy signaling, and endothelial remodeling. |
| `IL_1_BETA` | Interleukin-1β | pg/mL | 0.1 – 3.0 | Luminex Multiplex / OSD-575 Standard | Early phase pyrogenic and inflammatory signal transducer. |
| `IL_10` | Interleukin-10 | pg/mL | 1.0 – 8.0 | Luminex Multiplex / OSD-575 Standard | Counter-regulatory anti-inflammatory mediator maintaining homeostatic balance. |
| `IFN_GAMMA` | Interferon-γ | pg/mL | 0.1 – 4.5 | Luminex Multiplex / OSD-575 Standard | Type II interferon driving cell-mediated antiviral response. |
| `IL_8` | Interleukin-8 (CXCL8) | pg/mL | 2.0 – 15.0 | Luminex Multiplex / OSD-575 Standard | Neutrophil chemoattractant chemokine; elevated post-orbital insertion. |
| `CRP_HS` | High-Sensitivity CRP | mg/L | 0.1 – 3.0 (<1 low, 1-3 monitor, >3 high) | High-Sensitivity Immunoturbidimetry / CDC Guidelines | Systemic acute-phase reactant synthesized by hepatocytes in response to IL-6. |
| `FERRITIN` | Serum Ferritin | ng/mL | 30.0 – 300.0 | Chemiluminescent Immunoassay (CMIA) | Positive acute-phase reactant reflecting tissue iron stores and inflammatory activity. |
| `CORTISOL_SALIVARY`| Morning Salivary Free Cortisol| nmol/L | 3.5 – 27.0 | Chemiluminescent Immunoassay / NASA Circadian Std | Bioavailable glucocorticoid indexing HPA-axis stress response and circadian alignment. |
| `CORTISOL_SERUM`| Total Serum Cortisol | µg/dL | 5.0 – 23.0 | Chemiluminescent Immunoassay | Total circulating cortisol influenced by corticosteroid-binding globulin. |

---

## 3. Mathematical & Algorithmic Rules

### Baseline Calculation
$$Baseline = \frac{1}{N_{pre}} \sum_{i=1}^{N_{pre}} Value_i$$
Where $N_{pre}$ is the number of valid pre-flight (PRE_FLIGHT) baseline measurements.

### Absolute Change
$$\Delta_{abs} = Value_{latest} - Baseline$$

### Percentage Change (with Division-by-Zero Protection)
$$Change_{\%} = \begin{cases} \frac{Value_{latest} - Baseline}{|Baseline|} \times 100 & \text{if } Baseline > 0 \\ \text{null (non-calculable)} & \text{if } Baseline \le 0 \text{ or null} \end{cases}$$

### Sampling Completeness Ratio
$$Missing_{\%} = \max\left(0, \frac{N_{expected} - N_{observed}}{N_{expected}} \times 100\right)$$
