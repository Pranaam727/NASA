import { NASAResearchRecord, ImmuneResearchInsightTopic } from '../types/nasa';

export const OFFICIAL_NASA_RESOURCES = [
  {
    id: 'NASA-RES-1',
    title: 'Risk of Altered Immune System Responses',
    officialUrl: 'https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/',
    organization: 'NASA Human Research Program (HRP)',
    category: 'ROADMAP_RISK_GAP',
    summary:
      'Official NASA overview of the risk that spaceflight stressors (microgravity, radiation, confinement, circadian disruption) alter astronaut immune defenses, leading to increased risk of infection, hypersensitivity, or latent viral reactivation.',
    topics: ['Risk Overview', 'Spaceflight Stressors', 'Blood / Saliva / Urine Monitoring', 'Latent Viral Reactivation'],
  },
  {
    id: 'NASA-RES-2',
    title: 'NASA Immunology and Virology Laboratory',
    officialUrl: 'https://www.nasa.gov/directorates/esdmd/hhp/immunology-and-virology/',
    organization: 'NASA Johnson Space Center (JSC) - Health & Human Performance Directorate',
    category: 'TECHNICAL_REPORT',
    summary:
      'The primary NASA laboratory responsible for characterizing spaceflight-induced immune dysregulation, T-cell/NK-cell functional suppression, cytokine shift, and latent herpesvirus shedding in human spaceflight.',
    topics: ['T-Cell Function', 'NK-Cell Function', 'Cytokine Profiles', 'Multiplex Assays', 'Latent Viruses'],
  },
  {
    id: 'NASA-RES-3',
    title: 'NASA Immune Risk Portfolio',
    officialUrl: 'https://www.nasa.gov/directorates/esdmd/hhp/immune-risk/',
    organization: 'NASA Exploration Systems Development Mission Directorate',
    category: 'ROADMAP_RISK_GAP',
    summary:
      'Detailed strategic roadmap addressing risks of adverse health events due to altered immune system responses during exploration-class lunar and Martian transit missions.',
    topics: ['Exploration Missions', 'Clinical Risk Mitigation', 'Countermeasure Evaluation', 'Biomarkers'],
  },
  {
    id: 'NASA-RES-4',
    title: 'NASA Human Research Roadmap: Risk of Adverse Health Event Due to Altered Immune System (Risk i=85)',
    officialUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=85',
    organization: 'NASA Human Research Roadmap',
    category: 'ROADMAP_RISK_GAP',
    summary:
      'Formal research framework defining the evidence base, clinical criteria, progress metrics, and gaps required to characterize and prevent immune system compromise during deep-space operations.',
    topics: ['Evidence Base', 'Research Milestones', 'Clinical Criteria', 'Longitudinal Validation'],
  },
  {
    id: 'NASA-RES-5',
    title: 'NASA Immune Research Gap IM-106: Characterize Stressors Contributing to In-Flight Immune Dysregulation',
    officialUrl: 'https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=818',
    organization: 'NASA Human Research Roadmap',
    category: 'ROADMAP_RISK_GAP',
    summary:
      'Priority research gap focused on delineating the individual and synergistic contributions of microgravity, radiation, psychological stress, circadian misalignment, hypoxia, and nutritional deficits to astronaut immune dysregulation.',
    topics: ['Stress Synergies', 'Microgravity & Radiation Interaction', 'Biomarker Validation', 'Spacecraft Atmosphere'],
  },
  {
    id: 'NASA-RES-6',
    title: 'Scientists Probe How Long-Term Spaceflight Alters Immunity',
    officialUrl: 'https://www.nasa.gov/missions/station/scientists-probe-how-long-term-spaceflight-alters-immunity/',
    organization: 'NASA International Space Station Research & Science',
    category: 'HUMAN_ASTRONAUT_RESEARCH',
    summary:
      'ISS expedition study investigating astronaut blood, saliva, and urine specimens collected before, during, and after 6- to 12-month orbital tours to evaluate leukocyte kinetics, cytokine production, and viral shedding.',
    topics: ['ISS Expedition Studies', 'Pre/In/Post Longitudinal Sampling', 'Salivary Cortisol', 'Viral Copy Assays'],
  },
  {
    id: 'NASA-RES-7',
    title: 'Flow Cytometry Methods to Monitor Immune System Dysregulation in Astronauts (NTRS-20230016983)',
    officialUrl: 'https://ntrs.nasa.gov/citations/20230016983',
    organization: 'NASA Technical Reports Server (NTRS) / JSC Immunology Lab',
    category: 'TECHNICAL_REPORT',
    summary:
      'Comprehensive NASA technical report detailing standardized multiparameter flow cytometry panels for peripheral leukocyte immunophenotyping, intracellular cytokine staining, and functional assay protocols for spaceflight biospecimens.',
    topics: ['Flow Cytometry Panels', 'Lymphocyte Subsets', 'Fluorophore Conjugates', 'Quality Assurance', 'Biobanking'],
  },
];

export const OSDR_DATASETS: NASAResearchRecord[] = [
  {
    id: 'OSD-575',
    studyIdentifier: 'OSD-575',
    title: 'SpaceX Inspiration4 Blood Serum Metabolic Panel and Immune/Cardiac Cytokine Arrays',
    category: 'HUMAN_ASTRONAUT_RESEARCH',
    topics: ['CYTOKINE_ARRAY', 'IMMUNE_CELL_PROFILING', 'INFLAMMATION'],
    organism: 'Homo sapiens (Human civilian astronauts, n=4)',
    sampleType: 'Blood Serum (Pre-flight L-44, L-3, In-flight FD2, FD3, Post-flight R+1, R+45, R+82)',
    assayType: 'Luminex 37-Plex Human Cytokine / Chemokine Array & Comprehensive Metabolic Panel',
    description:
      'Investigated systemic immune, inflammatory, and metabolic responses in 4 civilian crewmembers during the 3-day high-apogee SpaceX Inspiration4 orbital mission. Shows transient elevations in IL-6, IL-8, TNF-α, and key chemokines upon orbital insertion and recovery.',
    experimentalContext:
      'Short-duration (3 days), high-apogee (~585 km) Earth orbit. Subjected to microgravity, elevated space radiation (Van Allen belt anomaly transit), and high operational stress without ISS docking.',
    spaceflightRelevance:
      'Demonstrates rapid acute cytokine response in non-professional astronauts and proves feasibility of multi-omics and cytokine arrays for short-to-medium spaceflight missions.',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/study/OSD-575',
    retrievalTimestamp: '2026-11-14T10:00:00Z',
    dataAccessLevel: 'OPEN_SCIENCE',
    citation: 'Overbey, E.G., et al. Nature 630, 2024 (Inspiration4 Space Omics and Medical Atlas - SOMA).',
    keyFindings: [
      'Pro-inflammatory cytokine surge (IL-6, IL-8, TNF-α) observed within 48h of orbital exposure.',
      'Significant increase in circulating monocyte chemoattractants (MCP-1 / CCL2).',
      'Prompt return toward pre-flight baseline by R+45 post-splashdown.',
    ],
    caveatsAndLimitations: [
      'Small cohort (n=4).',
      'Short mission duration (3 days); long-duration ISS trajectories may exhibit chronic adaptation profiles rather than acute spikes.',
    ],
  },
  {
    id: 'OSD-53',
    studyIdentifier: 'OSD-53',
    title: 'Spaceflight Modulates Gene Expression in Astronauts',
    category: 'HUMAN_ASTRONAUT_RESEARCH',
    topics: ['GENE_EXPRESSION', 'IMMUNE_CELL_PROFILING', 'INFLAMMATION'],
    organism: 'Homo sapiens (Human ISS / STS astronauts)',
    sampleType: 'Whole Blood Peripheral Blood Mononuclear Cells (PBMC)',
    assayType: 'Illumina Whole-Genome RNA-Seq & Affymetrix Human Gene Expression Microarray',
    description:
      'Analyzed transcriptional alterations in peripheral blood cells of astronauts on short shuttle missions (STS) and long-duration ISS flights. Demonstrates transcriptional downregulation of T-cell receptor signaling and cell-cycle genes alongside upregulation of innate immune and DNA-repair transcripts.',
    experimentalContext:
      'Venous blood samples drawn pre-flight (L-180, L-60, L-10), in-flight on ISS (FD30, FD90, FD180 via CHeCS centrifuge/ambient return), and post-flight (R+0, R+30).',
    spaceflightRelevance:
      'Direct genetic evidence of adaptive immune suppression and compensatory innate inflammatory gene induction in human astronauts.',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/study/OSD-53',
    retrievalTimestamp: '2026-11-14T10:00:00Z',
    dataAccessLevel: 'OPEN_SCIENCE',
    citation: 'Crucian, B.E., et al. J Leukoc Biol 98(3), 2015; NASA OSDR OSD-53 GeneLab Repository.',
    keyFindings: [
      'Downregulation of CD3/CD28-mediated T-cell activation pathways.',
      'Up-regulation of NF-κB inflammatory signaling and oxidative stress response genes.',
      'Latent herpesvirus reactivation transcripts correlated with elevated in-flight stress markers.',
    ],
    caveatsAndLimitations: [
      'Pre-flight vs in-flight logistics required in-flight sample return cold-stowage or delayed RNA extraction.',
    ],
  },
  {
    id: 'OSD-2',
    studyIdentifier: 'OSD-2',
    title: 'Response of Human Lymphoblastoid Cells to HZE (Iron Ions) or Gamma-Rays',
    category: 'HUMAN_CELL_MODEL',
    topics: ['RADIATION_IMMUNOLOGY', 'GENE_EXPRESSION', 'IMMUNE_CELL_PROFILING'],
    organism: 'Human lymphoblastoid cell lines (TK6 & WTK1 in-vitro culture)',
    sampleType: 'Cultured Human B-lymphoblastoid Cells',
    assayType: 'Agilent Human 1A Microarray & Clonogenic Survival Assay',
    description:
      'In-vitro radiation biology study exposing human lymphoblastoid immune cells to high-LET Galactic Cosmic Ray simulant (Fe-56 ions at 1 GeV/nucleon) versus terrestrial gamma-rays (Cs-137) at NASA Space Radiation Laboratory (NSRL).',
    experimentalContext:
      'Cell-line culture irradiated at Brookhaven National Laboratory / NSRL under controlled laboratory conditions. NOT a direct astronaut blood specimen.',
    spaceflightRelevance:
      'Reveals how heavy-ion cosmic radiation causes complex clustered DNA damage and induces apoptosis in human lymphoid lineage cells, distinct from low-LET gamma radiation.',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/study/OSD-2',
    retrievalTimestamp: '2026-11-14T10:00:00Z',
    dataAccessLevel: 'OPEN_SCIENCE',
    citation: 'Ding, L.H., et al. BMC Genomics 14, 2013; NASA GeneLab / OSDR OSD-2.',
    keyFindings: [
      'High-LET Fe ions induce persistent G2/M cell cycle arrest and extensive chromosomal breaks in lymphoid cells.',
      'Distinct gene expression signature involving p53-independent apoptotic pathways.',
      'Significant bystander effect on non-irradiated neighboring lymphoid cells.',
    ],
    caveatsAndLimitations: [
      'CRITICAL: Cell-model experiment using immortalized lymphoblastoid cell lines.',
      'Does NOT represent whole-organism astronaut physiology or in-vivo immune network resilience.',
    ],
  },
  {
    id: 'OSD-4',
    studyIdentifier: 'OSD-4',
    title: 'Microarray Analysis of Space-Flown Murine Thymus Tissue',
    category: 'ANIMAL_MODEL',
    topics: ['IMMUNE_CELL_PROFILING', 'GENE_EXPRESSION'],
    organism: 'Mus musculus (C57BL/6J female mice, n=12 flown, n=12 ground)',
    sampleType: 'Murine Thymic Parenchyma (Primary lymphoid organ)',
    assayType: 'Affymetrix Murine Genome U74Av2 Microarray',
    description:
      'Investigated the molecular impact of 11 days and 19 hours of spaceflight (STS-108 / Endeavour) on mouse thymus tissue. Demonstrated accelerated thymic involution, loss of thymocyte cellularity, and altered T-cell receptor rearrangement gene expression.',
    experimentalContext:
      'Rodent flight hardware (Animal Enclosure Modules) aboard Space Shuttle STS-108. Synchronous ground control mice maintained under identical temperature and humidity conditions.',
    spaceflightRelevance:
      'Provides biological insight into primary T-cell development and central immune organ atrophy induced by spaceflight microgravity and launch/re-entry hypergravity.',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/study/OSD-4',
    retrievalTimestamp: '2026-11-14T10:00:00Z',
    dataAccessLevel: 'OPEN_SCIENCE',
    citation: 'Gridley, D.S., et al. In Vivo 22(1), 2008; NASA OSDR OSD-4.',
    keyFindings: [
      'Downregulation of thymic genes encoding T-cell receptor alpha/beta constant chains.',
      'Marked reduction in organ weight and thymocyte progenitor proliferation.',
      'Upregulation of pro-apoptotic genes (Bax, Caspase-3) in cortical thymocytes.',
    ],
    caveatsAndLimitations: [
      'CRITICAL: Animal-model rodent study.',
      'Mouse thymic kinetics differ significantly from adult human astronauts whose thymuses are already largely physiologically involuted.',
    ],
  },
  {
    id: 'OSD-54',
    studyIdentifier: 'OSD-54',
    title: 'Immune Responses to the In-Vitro LPS Assault Engineered in Spaceflight Multi-Omics Study',
    category: 'IN_VITRO_RESEARCH',
    topics: ['INFLAMMATION', 'CYTOKINE_ARRAY', 'GENE_EXPRESSION'],
    organism: 'Homo sapiens (Ex-vivo whole blood culture)',
    sampleType: 'Human Whole Blood stimulated with Bacterial Lipopolysaccharide (LPS)',
    assayType: 'Multi-parameter Cytokine ELISA & Illumina Transcriptome Profiling',
    description:
      'Assessed the functional inflammatory competence of human immune cells by challenging whole blood samples ex-vivo with endotoxin (E. coli LPS) to measure toll-like receptor 4 (TLR4) activation and downstream cytokine secretion.',
    experimentalContext:
      'Ex-vivo immune functional challenge experiment. Evaluates whether immune cells can mount a normal inflammatory response upon bacterial pathogen mimic challenge.',
    spaceflightRelevance:
      'Demonstrates that while baseline cytokine levels may fluctuate, the reserve capacity to respond to acute bacterial endotoxin is altered, indicating uncoupling of innate pathogen recognition.',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/study/OSD-54',
    retrievalTimestamp: '2026-11-14T10:00:00Z',
    dataAccessLevel: 'OPEN_SCIENCE',
    citation: 'NASA Space Life and Physical Sciences Research / OSDR Study OSD-54.',
    keyFindings: [
      'Suppressed induction of TNF-α and IL-1β upon LPS challenge in prolonged stress models.',
      'Altered TLR4 signaling cascade phosphorylation.',
      'Evidence of monocyte functional "stunning" under combined physiological stressors.',
    ],
    caveatsAndLimitations: [
      'Ex-vivo assay simulating pathogen assault; results reflect laboratory stimulation conditions rather than an active astronaut infection.',
    ],
  },
];

export const IMMUNE_INSIGHT_TOPICS: ImmuneResearchInsightTopic[] = [
  {
    id: 'INSIGHT-1',
    title: 'Microgravity & Immune Cell Mechanics',
    iconName: 'Orbit',
    summary:
      'How physical unloading and cephalad fluid redistribution alter immune-cell morphology, cytoskeletal dynamics, and shear-dependent extravasation.',
    observedFindings: [
      'Cephalad fluid shift causes transient hemoconcentration and rapid redistribution of peripheral leukocytes.',
      'Lymphocytes in microgravity exhibit altered cortical actin polymerization and impaired immune synapse formation.',
      'Reduced blastogenesis upon mitogen stimulation (PHA / ConA) observed in space-flown cell cultures.',
    ],
    possibleMechanisms: [
      'Mechanical unloading disrupts mechanotransductive signaling through integrins and focal adhesion kinases.',
      'Altered intracellular convection reduces secondary messenger signaling efficiency.',
    ],
    hypotheses: [
      'Gravitational unloading alters nuclear lamin structure and chromatin accessibility in resting T cells.',
    ],
    clinicalDistinction:
      'Altered in-vitro cell mechanics do not automatically equate to clinical immunodeficiency in healthy astronauts.',
    relatedNasaResources: ['NASA-RES-1', 'NASA-RES-2', 'OSD-53'],
  },
  {
    id: 'INSIGHT-2',
    title: 'Space Radiation & Immunological Vulnerability',
    iconName: 'Zap',
    summary:
      'Impact of galactic cosmic rays (GCR) and solar particle events (SPE) on radiosensitive lymphocyte subsets and hematopoietic stem cell progenitors.',
    observedFindings: [
      'Lymphocytes are among the most radiosensitive human cells (D0 ~ 1-1.5 Gy for apoptosis).',
      'High-LET heavy ions (Fe-56, Si-28) produce complex non-rejoining DNA double-strand breaks in lymphoid precursors.',
      'Persistent chromosomal aberrations observed in peripheral lymphocytes years post-flight.',
    ],
    possibleMechanisms: [
      'Radiation-induced genomic instability leads to clonal hematopoiesis or accelerated lymphocyte senescence.',
      'Bystander effects mediated by extracellular vesicles and reactive oxygen species.',
    ],
    hypotheses: [
      'Cumulative exploration mission doses (>0.5 Sv) may diminish the naive T-cell repertoire diversity.',
    ],
    clinicalDistinction:
      'Laboratory ion-beam data (e.g. OSD-2) use acute high-dose simulant exposures, whereas astronauts receive chronic low-dose-rate space radiation.',
    relatedNasaResources: ['NASA-RES-4', 'NASA-RES-5', 'OSD-2'],
  },
  {
    id: 'INSIGHT-3',
    title: 'Cytokine Shifts & Subclinical Inflammation',
    iconName: 'Activity',
    summary:
      'The "spaceflight cytokine signature" — concurrent pro-inflammatory elevation with paradoxical cellular immune suppression.',
    observedFindings: [
      'Elevated circulating concentrations of pro-inflammatory cytokines (IL-6, TNF-α, IL-1β) in blood and saliva.',
      'Concurrently elevated regulatory or counter-inflammatory cytokines (IL-10, IL-1RA).',
      'Pronounced cytokine shifts immediately post-landing, exacerbated by hypergravity and physical re-adaptation.',
    ],
    possibleMechanisms: [
      'Chronic subclinical sterile inflammation induced by muscle unloading, sleep loss, and oxidative stress.',
      'Endothelial activation triggered by fluid shifts and microvascular remodeling.',
    ],
    hypotheses: [
      'Sustained in-flight cytokine elevation may heighten susceptibility to dermatological rashes and hypersensitivities.',
    ],
    clinicalDistinction:
      'Biomarker elevations indicate biological system stress and remodeling, NOT acute clinical sepsis or autoimmune disease.',
    relatedNasaResources: ['NASA-RES-6', 'OSD-575', 'OSD-54'],
  },
  {
    id: 'INSIGHT-4',
    title: 'T-Cell and NK-Cell Functional Suppression',
    iconName: 'ShieldAlert',
    summary:
      'Quantitative preservation vs qualitative depression: why normal cell counts can mask depressed cytotoxic and cytokine-producing activity.',
    observedFindings: [
      'While circulating absolute lymphocyte counts often remain within terrestrial reference ranges, early T-cell activation (CD69, CD25 upregulation) is suppressed by 30-50%.',
      'Ex-vivo natural killer cell cytotoxicity (% target cell lysis) is significantly reduced during long-duration flight.',
      'Reconstitution occurs within 14-30 days post-splashdown.',
    ],
    possibleMechanisms: [
      'Neuroendocrine signaling via glucocorticoids (cortisol) and catecholamines suppresses IL-2 receptor expression.',
      'Downregulation of protein kinase C and NFAT translocation pathways.',
    ],
    hypotheses: [
      'Functional suppression is driven primarily by mission operational stress and circadian disruption rather than microgravity per se.',
    ],
    clinicalDistinction:
      'An intact or normal NK cell count does not establish normal NK cytotoxic function; functional assays are required.',
    relatedNasaResources: ['NASA-RES-2', 'NASA-RES-7', 'NASA-RES-4'],
  },
  {
    id: 'INSIGHT-5',
    title: 'Latent Herpesvirus Reactivation in Spaceflight',
    iconName: 'Bug',
    summary:
      'Epstein-Barr Virus (EBV), Varicella-Zoster Virus (VZV), and Cytomegalovirus (CMV) shedding as sensitive indicators of neuroimmune stress.',
    observedFindings: [
      'Over 50% of astronauts shed latent viral DNA (EBV, VZV, CMV) in saliva and urine during spaceflight.',
      'Shedding frequency and viral copy numbers correlate strongly with mission duration and reported stress scores.',
      'The vast majority of viral reactivation events are subclinical and asymptomatic.',
    ],
    possibleMechanisms: [
      'Weakening of cytotoxic CD8+ T-cell and NK-cell immune surveillance allows dormant viruses in ganglia and B cells to reactivate.',
      'Elevated salivary cortisol directly stimulates viral replication via glucocorticoid response elements in viral promoters.',
    ],
    hypotheses: [
      'Viral shedding monitoring serves as a non-invasive, objective biosensor for cumulative physiological and psychological stress.',
    ],
    clinicalDistinction:
      'Asymptomatic viral shedding is a biological biomarker of stress-induced dysregulation, not necessarily an active symptomatic shingles or infectious mononucleosis infection.',
    relatedNasaResources: ['NASA-RES-1', 'NASA-RES-6'],
  },
  {
    id: 'INSIGHT-6',
    title: 'Multi-Stressor Synergy & IM-106 Framework',
    iconName: 'Layers',
    summary:
      'Understanding why no single stressor explains spaceflight immune dysregulation: the combined action of stress, radiation, hypoxia, and nutrition.',
    observedFindings: [
      'Ground-based isolation and bed-rest analogs (e.g. HERA, :envihab) produce partial immune shifts, but the full phenotype only appears in actual spaceflight.',
      'Circadian misalignment, elevated ambient spacecraft CO2 (~0.3-0.5%), and altered dietary nutrient intake exacerbate immune dysregulation.',
    ],
    possibleMechanisms: [
      'Crosstalk between the sympathetic nervous system (SNS), HPA axis, gut microbiome, and lymphoid organs.',
      'Oxidative stress compounding metabolic shifts.',
    ],
    hypotheses: [
      'Combined mitigation strategies (targeted antioxidant nutrition, circadian lighting, tailored resistive exercise) will prevent cumulative immune degradation on Mars missions.',
    ],
    clinicalDistinction:
      'Associations between multiple biomarkers must be interpreted holistically; single-biomarker monitoring is insufficient for clinical flight rule decisions.',
    relatedNasaResources: ['NASA-RES-3', 'NASA-RES-5'],
  },
];
