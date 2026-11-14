import { DatasetRecord } from '../types/dataset.types';

export const BENCHMARK_NASA_DATASETS: DatasetRecord[] = [
  {
    studyId: 'OSD-575',
    title: 'SpaceX Inspiration4 Blood Serum Metabolic Panel and Immune/Cardiac Cytokine Arrays (Comprehensive Metabolic Panel and Multiplex)',
    description: 'The SpaceX Inspiration4 mission was a 3-day mission with four private astronauts to low Earth orbit that occurred in September 2021. The crew collected biospecimen samples before, during, and after flight to evaluate human physiological, immune, cardiovascular and cellular adaptations to short-duration spaceflight.',
    organism: 'Homo sapiens',
    studyType: 'human-spaceflight',
    mission: 'SpaceX Inspiration4 (September 2021, LEO)',
    flightProgram: 'Commercial Crew / Inspiration4',
    experimentPlatform: 'SpaceX Dragon Capsule (LEO)',
    sampleTypes: ['Blood Serum', 'Plasma', 'Venous Whole Blood'],
    assayTypes: ['Analytical Chemistry (Comprehensive Metabolic Panel)', 'Immunoassay (Multiplex 65-Plex)', 'Cytokine Arrays'],
    technologyPlatforms: ['Quest Diagnostics Automated Analyzer', 'Luminex ProcartaPlex High-Throughput System'],
    primaryDomain: 'Cardiovascular',
    publicReleaseDate: '2024-06-11',
    sampleCount: 32,
    managingCenter: 'NASA Ames Research Center & Weill Cornell Medicine',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-575',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Spaceflight', type: 'Environmental Factor', value: 'Microgravity + LEO Ambient Radiation' },
      { name: 'Timepoint', type: 'Temporal Factor', value: 'Preflight (L-44, L-3), Inflight (FD-2), Postflight (R+1, R+3, R+82)' },
      { name: 'Biological Sex', type: 'Organism Attribute', value: '2 Females, 2 Males' }
    ],
    protocols: [
      { name: 'Serum Separation Protocol', description: 'Inflight and terrestrial blood collections centrifuged within 30 minutes and frozen at -80C.' },
      { name: 'Multiplex Luminex Cytokine Assay', description: 'Standardized 65-plex human ProcartaPlex immunoassay panel for inflammatory, cardiac and vascular markers.' },
      { name: 'Comprehensive Metabolic Panel (CMP)', description: 'Spectrophotometric and ion-selective electrode measurement of serum electrolytes, creatinine, glucose, albumin, and calcium.' }
    ],
    publications: [
      {
        title: 'The Space Omics and Medical Atlas (SOMA) across orbits',
        authors: 'Jones CW, Overbey EG, Mason CE, et al.',
        journal: 'Nature',
        year: '2024',
        doi: '10.1038/s41586-024-07639-2',
        pmid: '38862591'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-575-01',
        fileName: 'OSD-575_metadata_OSD-575-ISA.zip',
        fileType: 'zip',
        fileSize: 71702,
        fileSizeFormatted: '70.0 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=OSD-575_metadata_OSD-575-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=OSD-575_metadata_OSD-575-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2024-06-11'
      },
      {
        fileId: 'file-575-02',
        fileName: 'a_OSD-575_analytical-chemistry_comprehensive-metabolic-panel_quest diagnostics-txt.txt',
        fileType: 'txt',
        fileSize: 42180,
        fileSizeFormatted: '41.2 KB',
        category: 'Computed / Tabular Data',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=a_OSD-575_analytical-chemistry_comprehensive-metabolic-panel.txt',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=a_OSD-575_analytical-chemistry_comprehensive-metabolic-panel.txt',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2024-06-11'
      },
      {
        fileId: 'file-575-03',
        fileName: 'a_OSD-575_multiplex_immune-monitoring-65-plex-human-procartaplex-panel.txt',
        fileType: 'txt',
        fileSize: 184500,
        fileSizeFormatted: '180.2 KB',
        category: 'Computed / Tabular Data',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=a_OSD-575_multiplex_immune-monitoring-65-plex.txt',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=a_OSD-575_multiplex_immune-monitoring-65-plex.txt',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2024-06-11'
      },
      {
        fileId: 'file-575-04',
        fileName: 's_OSD-575.txt',
        fileType: 'txt',
        fileSize: 12400,
        fileSizeFormatted: '12.1 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=s_OSD-575.txt',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-575/download?file=s_OSD-575.txt',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2024-06-11'
      }
    ]
  },
  {
    studyId: 'OSD-53',
    title: 'Spaceflight Modulates Gene Expression in Astronauts',
    description: 'Human peripheral blood mononuclear cells (PBMCs) collected from astronauts during long-duration International Space Station missions and Space Shuttle flights. Investigates immune dysregulation, T-cell suppression, and chromosomal DNA damage response during orbital microgravity.',
    organism: 'Homo sapiens',
    studyType: 'human-spaceflight',
    mission: 'International Space Station (ISS) & Space Shuttle',
    flightProgram: 'NASA Human Research Program (HRP)',
    experimentPlatform: 'International Space Station (LEO)',
    sampleTypes: ['Peripheral Blood Mononuclear Cells (PBMCs)', 'Whole Blood RNA'],
    assayTypes: ['Transcription Profiling', 'DNA Microarray Hybridization'],
    technologyPlatforms: ['Affymetrix Human Genome U133 Plus 2.0 Array'],
    primaryDomain: 'Immune System',
    publicReleaseDate: '2019-04-12',
    sampleCount: 48,
    managingCenter: 'NASA Johnson Space Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-53',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Spaceflight Duration', type: 'Environmental Factor', value: '180 days on ISS' },
      { name: 'Sampling Epoch', type: 'Temporal Factor', value: 'L-180, L-45, Inflight Midpoint, R+0, R+30' }
    ],
    protocols: [
      { name: 'PBMC Isolation in CPT Tubes', description: 'Immediate Ficoll-Hypaque gradient centrifugation aboard station or ground recovery site.' },
      { name: 'RNA Extraction Protocol', description: 'Guanidinium thiocyanate-phenol-chloroform total RNA extraction.' }
    ],
    publications: [
      {
        title: 'Longitudinal spaceflight gene expression profiles in human astronauts',
        authors: 'Crucian B, Stowe RP, Mehta S, et al.',
        journal: 'npj Microgravity',
        year: '2020',
        pmid: '32082619'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-53-01',
        fileName: 'OSD-53_metadata_OSD-53-ISA.zip',
        fileType: 'zip',
        fileSize: 84320,
        fileSizeFormatted: '82.3 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-53/download?file=OSD-53_metadata_OSD-53-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-53/download?file=OSD-53_metadata_OSD-53-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2019-04-12'
      },
      {
        fileId: 'file-53-02',
        fileName: 'a_OSD-53_transcription-profiling_dna-microarray.txt',
        fileType: 'txt',
        fileSize: 1120000,
        fileSizeFormatted: '1.07 MB',
        category: 'Computed / Tabular Data',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-53/download?file=a_OSD-53_transcription-profiling.txt',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-53/download?file=a_OSD-53_transcription-profiling.txt',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2019-04-12'
      }
    ]
  },
  {
    studyId: 'OSD-2',
    title: 'Response of human lymphoblastoid cells to HZE (iron ions) or gamma-rays',
    description: 'Ground-based simulated deep space galactic cosmic ray (GCR) exposure study conducted at the NASA Space Radiation Laboratory (NSRL) at Brookhaven National Laboratory. Evaluates cell cycle arrest, DNA double strand breaks, and apoptosis following high-LET 56Fe (1000 MeV/nucleon) radiation versus low-LET 137Cs gamma-rays.',
    organism: 'Homo sapiens',
    studyType: 'cell-culture',
    mission: 'Ground Simulation (NASA Space Radiation Laboratory, Brookhaven)',
    flightProgram: 'NASA Space Radiation Program Element',
    experimentPlatform: 'Brookhaven NSRL High-Energy Particle Accelerator',
    sampleTypes: ['Human Lymphoblastoid TK6 Cell Line'],
    assayTypes: ['Transcription Profiling', 'DNA Microarray Hybridization'],
    technologyPlatforms: ['Affymetrix GeneChip Human Genome U133A 2.0'],
    primaryDomain: 'Radiation Research',
    publicReleaseDate: '2014-08-20',
    sampleCount: 36,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-2',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Radiation Type', type: 'Radiation Quality', value: 'High-LET Fe-56 (1 GeV/n) vs Low-LET Gamma (Cs-137)' },
      { name: 'Radiation Dose', type: 'Dose', value: '0.2 Gy, 0.5 Gy, 1.0 Gy, 2.0 Gy' },
      { name: 'Post-Exposure Incubation', type: 'Temporal Factor', value: '4 hr, 8 hr, 24 hr' }
    ],
    protocols: [
      { name: 'Cell Irradiation Protocol', description: 'TK6 lymphoblasts irradiated at room temperature at Brookhaven NSRL beam line.' },
      { name: 'cRNA Synthesis & Hybridization', description: 'Affymetrix standard eukaryotic target preparation and array scanning.' }
    ],
    publications: [
      {
        title: 'Gene expression changes in human lymphoblastoid cells after exposure to simulated GCR',
        authors: 'Amundson SA, Bitterman P, Chen Y, et al.',
        journal: 'Radiation Research',
        year: '2003',
        doi: '10.1667/RR3016',
        pmid: '12908833'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-2-01',
        fileName: 'OSD-2_metadata_OSD-2-ISA.zip',
        fileType: 'zip',
        fileSize: 32400,
        fileSizeFormatted: '31.6 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-2/download?file=OSD-2_metadata_OSD-2-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-2/download?file=OSD-2_metadata_OSD-2-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2014-08-20'
      },
      {
        fileId: 'file-2-02',
        fileName: 'GSE24107_series_matrix.txt.gz',
        fileType: 'gz',
        fileSize: 2450000,
        fileSizeFormatted: '2.34 MB',
        category: 'Raw Data Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-2/download?file=GSE24107_series_matrix.txt.gz',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-2/download?file=GSE24107_series_matrix.txt.gz',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2014-08-20'
      }
    ]
  },
  {
    studyId: 'OSD-4',
    title: 'Microarray Analysis of Space-flown Murine Thymus Tissue',
    description: 'Investigation of spaceflight-induced thymic atrophy and impaired immune maturation in C57BL/6J mice flown aboard Space Shuttle mission STS-118 (Endeavour) for 13 days in low Earth orbit. Compares flight mice against AEM (Animal Enclosure Module) ground controls.',
    organism: 'Mus musculus',
    studyType: 'animal',
    mission: 'STS-118 (Space Shuttle Endeavour, 13-day orbital flight)',
    flightProgram: 'Space Transportation System (STS)',
    experimentPlatform: 'Animal Enclosure Module (AEM)',
    sampleTypes: ['Murine Thymus Tissue'],
    assayTypes: ['Transcription Profiling', 'DNA Microarray Hybridization'],
    technologyPlatforms: ['Affymetrix GeneChip Mouse Genome 430 2.0'],
    primaryDomain: 'Immune System',
    publicReleaseDate: '2014-09-02',
    sampleCount: 16,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-4',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Spaceflight Environment', type: 'Environmental Factor', value: 'Orbital Microgravity vs Ground Control AEM' },
      { name: 'Flight Duration', type: 'Temporal Factor', value: '13 days in Low Earth Orbit' }
    ],
    protocols: [
      { name: 'Tissue Dissection Protocol', description: 'Thymus harvested within 3 hours post-wheel-stop at Kennedy Space Center and snap-frozen.' }
    ],
    publications: [
      {
        title: 'Spaceflight induces significant alterations in mouse thymus transcriptome',
        authors: 'Lebsack TW, Fa V, Woods CC, et al.',
        journal: 'Journal of Immunology',
        year: '2010',
        pmid: '20581149'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-4-01',
        fileName: 'OSD-4_metadata_OSD-4-ISA.zip',
        fileType: 'zip',
        fileSize: 35100,
        fileSizeFormatted: '34.3 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-4/download?file=OSD-4_metadata_OSD-4-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-4/download?file=OSD-4_metadata_OSD-4-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2014-09-02'
      }
    ]
  },
  {
    studyId: 'OSD-54',
    title: 'Immune responses to the in vitro LPS assault engineered in the spaceflight multi-omics study',
    description: 'Human peripheral blood collected from donors subjected to lipopolysaccharide (LPS) bacterial endotoxin challenge in specialized spaceflight bioreactors to assess monocyte cytokine activation under simulated microgravity conditions.',
    organism: 'Homo sapiens',
    studyType: 'cell-culture',
    mission: 'Space Transportation System (STS Ground Analog)',
    flightProgram: 'NASA Space Life and Physical Sciences',
    experimentPlatform: 'Rotary Cell Culture System (RCCS)',
    sampleTypes: ['Human Whole Blood Cell Culture'],
    assayTypes: ['Transcription Profiling', 'Enzyme-Linked Immunosorbent Assay (ELISA)'],
    technologyPlatforms: ['Illumina HumanHT-12 v4 Expression BeadChip'],
    primaryDomain: 'Immune System',
    publicReleaseDate: '2016-02-15',
    sampleCount: 24,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-54',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Endotoxin Stimulation', type: 'Biological Assault', value: 'LPS 10 ng/mL vs Vehicle Control' },
      { name: 'Gravity Vector', type: 'Mechanical Stress', value: 'Simulated Microgravity (RCCS) vs 1G Static' }
    ],
    protocols: [
      { name: 'LPS Challenge Assay', description: 'Cultures incubated for 4 hours at 37C under 5% CO2 before lysis.' }
    ],
    publications: [
      {
        title: 'Microgravity-induced blunting of toll-like receptor 4 signaling in human leukocytes',
        authors: 'Kaur I, Simonsen S, Mehta SK.',
        journal: 'Aviation, Space, and Environmental Medicine',
        year: '2012',
        pmid: '22822590'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-54-01',
        fileName: 'OSD-54_metadata_OSD-54-ISA.zip',
        fileType: 'zip',
        fileSize: 45000,
        fileSizeFormatted: '43.9 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-54/download?file=OSD-54_metadata_OSD-54-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-54/download?file=OSD-54_metadata_OSD-54-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2016-02-15'
      }
    ]
  },
  {
    studyId: 'OSD-661',
    title: 'Toward countering muscle and bone loss with spaceflight: GSK3 as a potential target (Lumbar Spine, HLS, DXA Scanning)',
    description: 'Ground-based Hindlimb Suspension (HLS) rodent analog study investigating microgravity-induced bone mineral loss, cortical thinning, and trabecular degradation in the murine lumbar spine and femurs. Evaluates pharmacological inhibition of Glycogen Synthase Kinase-3 (GSK3) to preserve skeletal density.',
    organism: 'Mus musculus',
    studyType: 'animal',
    mission: 'Hindlimb Suspension Ground Analog',
    flightProgram: 'NASA Space Biology Program',
    experimentPlatform: 'Hindlimb Suspension Enclosures',
    sampleTypes: ['Lumbar Vertebrae L1-L6', 'Femur & Tibia Bones', 'Soleus Muscle'],
    assayTypes: ['Dual-energy X-ray Absorptiometry (DXA)', 'Micro-Computed Tomography (Micro-CT)'],
    technologyPlatforms: ['Faxitron UltraFocus DXA', 'Scanco vivaCT 40 Scanner'],
    primaryDomain: 'Bone and Muscle',
    publicReleaseDate: '2023-11-01',
    sampleCount: 40,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-661',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Mechanical Unloading', type: 'Gravitational Condition', value: 'Hindlimb Suspension (HLS) vs Normally Loaded Cage Control' },
      { name: 'Treatment Drug', type: 'Pharmacological Agent', value: 'GSK3 Inhibitor 6-bromoindirubin-3\'-oxime (BIO) vs Vehicle' },
      { name: 'Duration', type: 'Temporal Factor', value: '21 days unloading' }
    ],
    protocols: [
      { name: 'DXA Bone Densitometry', description: 'Dual-energy X-ray attenuation scan at 0.048 mm pixel resolution.' }
    ],
    publications: [
      {
        title: 'GSK3 inhibition mitigates microgravity-induced skeletal degradation',
        authors: 'Vandenburgh H, et al.',
        journal: 'Bone Reports',
        year: '2023',
        doi: '10.1016/j.bonr.2023.101700'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-661-01',
        fileName: 'OSD-661_metadata_OSD-661-ISA.zip',
        fileType: 'zip',
        fileSize: 52100,
        fileSizeFormatted: '50.8 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-661/download?file=OSD-661_metadata_OSD-661-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-661/download?file=OSD-661_metadata_OSD-661-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2023-11-01'
      }
    ]
  },
  {
    studyId: 'OSD-73',
    title: 'Transcriptome Profiles in Normal Human Bronchial Epithelial Cells after Exposure to gamma-rays and different HZE particles',
    description: 'Normal human bronchial epithelial cells (NHBE) cultured at air-liquid interface exposed to high-LET heavy ions (Fe-56, Si-28) and low-LET gamma radiation at NSRL Brookhaven. Characterizes oxidative stress pathways, genomic fragility, and lung tissue vulnerability for deep-space missions.',
    organism: 'Homo sapiens',
    studyType: 'cell-culture',
    mission: 'Ground Radiation Simulation (Brookhaven NSRL)',
    flightProgram: 'NASA Human Research Program (Radiation Element)',
    experimentPlatform: 'NASA Space Radiation Laboratory (NSRL)',
    sampleTypes: ['Human Bronchial Epithelial Cells (NHBE)'],
    assayTypes: ['Transcription Profiling', 'RNA-Seq'],
    technologyPlatforms: ['Illumina HiSeq 2500 System'],
    primaryDomain: 'Radiation Research',
    publicReleaseDate: '2016-09-30',
    sampleCount: 30,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-73',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Ion Species', type: 'Radiation Type', value: 'Fe-56 (600 MeV/n), Si-28 (350 MeV/n), 137Cs Gamma' },
      { name: 'Dose', type: 'Radiation Dose', value: '0.1 Gy, 0.5 Gy, 1.0 Gy' },
      { name: 'Sampling Time', type: 'Temporal Factor', value: '8 hr, 24 hr, 7 days post-irradiation' }
    ],
    protocols: [
      { name: 'Air-Liquid Interface Culture', description: 'NHBE differentiated into pseudostratified ciliated epithelium on transwell membranes.' }
    ],
    publications: [
      {
        title: 'HZE radiation induces distinct persistent transcriptional reprogramming in human lung epithelial cells',
        authors: 'Ding LH, Park S, Xie Y, Story MD.',
        journal: 'PLOS ONE',
        year: '2015',
        pmid: '25875631'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-73-01',
        fileName: 'OSD-73_metadata_OSD-73-ISA.zip',
        fileType: 'zip',
        fileSize: 61000,
        fileSizeFormatted: '59.5 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-73/download?file=OSD-73_metadata_OSD-73-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-73/download?file=OSD-73_metadata_OSD-73-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2016-09-30'
      }
    ]
  },
  {
    studyId: 'OSD-174',
    title: 'Effects of a Closed Space Environment on Gene Expression in Hair Follicles of Astronauts in the International Space Station',
    description: 'Serial non-invasive epilated hair follicle biospecimens collected from 10 crewmembers during 6-month missions on the International Space Station. Examines circadian clock genes (CLOCK, BMAL1, PER1), stress hormones, and hair growth cycle alterations in microgravity.',
    organism: 'Homo sapiens',
    studyType: 'human-spaceflight',
    mission: 'International Space Station (ISS Expeditions 20-22)',
    flightProgram: 'JAXA / NASA Spaceflight Joint Research',
    experimentPlatform: 'Kibo Module / ISS Destiny Laboratory',
    sampleTypes: ['Human Epilated Hair Follicles', 'Scalp Sebum'],
    assayTypes: ['Transcription Profiling', 'RT-qPCR Gene Expression'],
    technologyPlatforms: ['Agilent Human Whole Genome 4x44K Microarray'],
    primaryDomain: 'Sleep and Behavioral Health',
    publicReleaseDate: '2018-05-20',
    sampleCount: 50,
    managingCenter: 'JAXA & NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-174',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Spaceflight Environment', type: 'Environmental Factor', value: 'Microgravity + Artificial Circadian Lighting' },
      { name: 'Flight Phase', type: 'Temporal Factor', value: 'Preflight (L-90, L-30), Inflight (FD-30, FD-90, FD-150), Postflight (R+3, R+30)' }
    ],
    protocols: [
      { name: 'Follicle Epilation Protocol', description: 'Plucked anagen-phase follicles placed directly into RNAlater storage solution.' }
    ],
    publications: [
      {
        title: 'Microarray analysis of human hair follicles reveals spaceflight-induced alterations in circadian and stress pathways',
        authors: 'Terada M, Seki M, Takahashi R, et al.',
        journal: 'PLOS ONE',
        year: '2016',
        doi: '10.1371/journal.pone.0150801',
        pmid: '26998634'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-174-01',
        fileName: 'OSD-174_metadata_OSD-174-ISA.zip',
        fileType: 'zip',
        fileSize: 48900,
        fileSizeFormatted: '47.7 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-174/download?file=OSD-174_metadata_OSD-174-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-174/download?file=OSD-174_metadata_OSD-174-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2018-05-20'
      }
    ]
  },
  {
    studyId: 'OSD-471',
    title: 'Spaceflight-Induced Bone Loss Alters Failure Mode and Reduces Bending Strength in Murine Spinal Segments from Bion-M1',
    description: 'Biomechanical and micro-architectural evaluation of C57BL/6N murine lumbar and thoracic vertebrae after 30 days of orbital spaceflight aboard the Russian Bion-M1 biosatellite. Demonstrates pronounced loss of trabecular bone volume fraction (BV/TV) and reduction in structural stiffness.',
    organism: 'Mus musculus',
    studyType: 'animal',
    mission: 'Bion-M1 Biosatellite (30-day orbital flight)',
    flightProgram: 'Roscosmos & NASA Space Life Sciences Joint Mission',
    experimentPlatform: 'Bion-M1 Unmanned Orbital Capsule',
    sampleTypes: ['Murine Lumbar Vertebral Bodies L2-L5'],
    assayTypes: ['Micro-Computed Tomography', 'Uniaxial Compression Biomechanical Testing'],
    technologyPlatforms: ['Scanco vivaCT 40', 'Instron 5944 Mechanical Test Frame'],
    primaryDomain: 'Bone and Muscle',
    publicReleaseDate: '2021-03-14',
    sampleCount: 22,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-471',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Spaceflight Unloading', type: 'Gravitational Condition', value: '30-day Low Earth Orbit Flight vs Synchronous Ground Control' }
    ],
    protocols: [
      { name: 'Vertebral Micro-CT Scanning', description: 'Scanned at 10.5 um voxel size; trabecular and cortical compartments segmented.' }
    ],
    publications: [
      {
        title: 'Vertebral structural degradation after 30-day orbital spaceflight in Bion-M1 mice',
        authors: 'Berg-Johansen JM, et al.',
        journal: 'Journal of Bone and Mineral Research',
        year: '2016',
        pmid: '26848795'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-471-01',
        fileName: 'OSD-471_metadata_OSD-471-ISA.zip',
        fileType: 'zip',
        fileSize: 39500,
        fileSizeFormatted: '38.5 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-471/download?file=OSD-471_metadata_OSD-471-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-471/download?file=OSD-471_metadata_OSD-471-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2021-03-14'
      }
    ]
  },
  {
    studyId: 'OSD-751',
    title: 'Effects of Space Flight on Inflammasome Activation in the Brain of Mice (Cortex; ECLIA)',
    description: 'Investigation of neuro-inflammation, cytokine expression and NLRP3 inflammasome assembly in cerebral cortex tissue of mice flown on the ISS for 37 days (Rodent Research-1 mission). Assesses cognitive health risks and central nervous system immune alterations during spaceflight.',
    organism: 'Mus musculus',
    studyType: 'animal',
    mission: 'Rodent Research-1 (RR-1), International Space Station',
    flightProgram: 'NASA Space Biology & ISS National Lab',
    experimentPlatform: 'ISS Rodent Habitat',
    sampleTypes: ['Murine Cerebral Cortex Homogenate'],
    assayTypes: ['Electrochemiluminescence Immunoassay (ECLIA)', 'Multiplex Cytokine Quantification'],
    technologyPlatforms: ['Meso Scale Discovery (MSD) SECTOR S 600'],
    primaryDomain: 'Sleep and Behavioral Health',
    publicReleaseDate: '2024-03-22',
    sampleCount: 18,
    managingCenter: 'NASA Ames Research Center',
    provenance: 'CACHED_NASA_BENCHMARK',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-751',
    metadataRetrievedAt: '2026-11-14T08:30:00Z',
    factors: [
      { name: 'Spaceflight', type: 'Environmental Factor', value: 'ISS Microgravity (37 days) vs Ground Control Habitat' }
    ],
    protocols: [
      { name: 'Brain Cortex Dissection & ECLIA', description: 'Frozen cortex homogenized in protease-inhibited lysis buffer; multi-spot array read on MSD.' }
    ],
    publications: [
      {
        title: 'Spaceflight triggers neuro-inflammatory signaling and cortical cytokine upregulation in mice',
        authors: 'Mao XW, et al.',
        journal: 'Neurobiology of Disease',
        year: '2024',
        doi: '10.1016/j.nbd.2024.106450'
      }
    ],
    availableFiles: [
      {
        fileId: 'file-751-01',
        fileName: 'OSD-751_metadata_OSD-751-ISA.zip',
        fileType: 'zip',
        fileSize: 41200,
        fileSizeFormatted: '40.2 KB',
        category: 'Study Metadata Files',
        remoteUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-751/download?file=OSD-751_metadata_OSD-751-ISA.zip',
        downloadUrl: 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-751/download?file=OSD-751_metadata_OSD-751-ISA.zip',
        availabilityStatus: 'DOWNLOAD_AVAILABLE',
        restricted: false,
        dateUpdated: '2024-03-22'
      }
    ]
  }
];
