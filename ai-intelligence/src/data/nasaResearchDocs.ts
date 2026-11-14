import { NASAResearchDoc } from '../types';

export const NASA_RESEARCH_DATABASE: NASAResearchDoc[] = [
  {
    id: 'nasa-twin-study-2019',
    title: 'The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight',
    ntrsId: 'NTRS-20190029871',
    doi: '10.1126/science.aau8650',
    year: 2019,
    authors: ['Garrett-Bakelman FE', 'Darshi M', 'Green SJ', 'Gur RC', 'Lin L', 'Macias BR', 'Crucian BE', 'Feinberg AP', 'Mason CE'],
    publication: 'Science, Vol. 364, Issue 6436',
    domains: ['cardiovascular', 'immune', 'radiation', 'sleep'],
    abstract: 'To date, 559 humans have flown in space, but long-duration (>180 days) missions present health risks. We conducted a multi-omics, molecular, physiological, and cognitive analysis of identical twin astronauts over 340 days on the International Space Station compared to Earth ground control. Key findings included persistent immune activation, telomere elongation during flight followed by rapid shortening post-flight, subclinical vascular stiffening, and chromosomal inversions linked to radiation exposure.',
    keyFindings: [
      'Telomeres lengthened significantly during spaceflight but experienced rapid attrition within 48 hours of return to Earth.',
      'Persistently elevated inflammatory cytokines (IL-6, TNF-alpha) confirmed chronic subclinical immune response during microgravity.',
      'Significant cognitive performance decline observed during the early post-flight rehabilitation phase.',
      'Chromosomal translocations and inversions increased, validating cumulative galactic cosmic ray (GCR) exposure models.'
    ],
    clinicalTakeaways: [
      'In-flight immune activation requires continual monitoring; infection resistance may be perturbed.',
      'Post-flight cardiovascular re-adaptation presents elevated arterial stiffness that normalizes over 6-9 months.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20190029871',
    verifiedGroundTruth: true
  },
  {
    id: 'nasa-hrp-sans-2021',
    title: 'Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS) - Evidence Book',
    ntrsId: 'NTRS-20210022087',
    doi: '10.1038/s41526-020-00115-2',
    year: 2021,
    authors: ['Macias BR', 'Patel NB', 'Gibson CR', 'Samuels BC', 'Laurie SS', 'Lee AG', 'Stenger MB'],
    publication: 'NASA Human Research Program Evidence Report (NASA/TP-2021-220087)',
    domains: ['cardiovascular'],
    abstract: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS) is characterized by optic disc edema, globe flattening, choroidal and retinal folds, hyperopic refractive shifts, and nerve fiber layer thickening in long-duration astronauts. The primary mechanism is cephalad venous fluid shift due to the absence of hydrostatic gradients in microgravity, combined with elevated cabin ambient CO2 levels and individual anatomical susceptibility.',
    keyFindings: [
      'Approximately 70% of long-duration ISS crewmembers develop mild to moderate optic disc edema.',
      'Cephalad fluid redistribution prevents nocturnal reduction of intracranial pressure (ICP), maintaining mildly elevated central venous pressure.',
      'Elevated ambient spacecraft carbon dioxide (>3.0 mmHg) correlates with increased reported incidence of ophthalmic symptoms.',
      'Lower body negative pressure (LBNP) of 20-25 mmHg has demonstrated venous reflow restoring pre-flight jugular vein hemodynamics.'
    ],
    clinicalTakeaways: [
      'Crew reporting blurred near vision or headache in flight day >30 require urgent fundoscopy and optical coherence tomography (OCT).',
      'Cephalad venous congestion is best counteracted by daily protocolized negative pressure exercise.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20210022087',
    verifiedGroundTruth: true
  },
  {
    id: 'nasa-hrp-bone-2016',
    title: 'Risk of Early Onset Osteoporosis and Bone Fracture Due to Spaceflight',
    ntrsId: 'NTRS-20160010860',
    doi: '10.1002/jbmr.3924',
    year: 2016,
    authors: ['Orwoll ES', 'Adler RA', 'Amin S', 'Bikle DD', 'Bouxsein ML', 'Cleek JE', 'Smith SM', 'Sibonga JD'],
    publication: 'NASA Human Research Program Evidence Report (NASA/TM-2016-218601)',
    domains: ['musculoskeletal'],
    abstract: 'In microgravity, bone mechanical unloading leads to unchecked osteoclast resorption and suppressed osteoblast bone formation. Astronauts lose on average 1.0% to 1.5% of bone mineral density (BMD) per month in weight-bearing skeletal sites (lumbar spine, femoral neck, and calcaneus). High-resistance countermeasure exercises (ARED) combined with nutritional interventions (vitamin D, calcium, bisphosphonates) have dramatically reduced bone loss rates on the ISS.',
    keyFindings: [
      'Cancellous (trabecular) bone exhibits preferential degradation over cortical bone during missions >90 days.',
      'Serum C-telopeptide (CTX) and urine N-telopeptide (NTX) biomarkers spike by 50-100% within the first 14 days of microgravity.',
      'ARED (Advanced Resistive Exercise Device) load protocols >600 lbs axial load mitigate >85% of lumbar spine bone demineralization.',
      'Recovery of pre-flight bone mineral density requires 1.5x to 2.5x the mission duration elapsed.'
    ],
    clinicalTakeaways: [
      'Elevated urinary calcium excretion increases nephrolithiasis (kidney stone) risk; mandatory hydration (>2.5 L/day) is critical.',
      'Resistance training compliance must exceed 90% of scheduled sessions to prevent microarchitectural trabecular perforation.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20160010860',
    verifiedGroundTruth: true
  },
  {
    id: 'nasa-hrp-radiation-2019',
    title: 'Risk of Cardiovascular Disease and Other Degenerative Tissue Effects from Space Radiation',
    ntrsId: 'NTRS-20190033302',
    doi: '10.1016/j.lssr.2019.04.001',
    year: 2019,
    authors: ['Huff JL', 'Elgart SR', 'Blakely EA', 'Mao XW', 'Coupe BD', 'Parihar VK', 'Cucinotta FA'],
    publication: 'NASA Technical Publication (NASA/TP-2019-220302)',
    domains: ['radiation', 'cardiovascular'],
    abstract: 'Space radiation consists of trapped protons in the South Atlantic Anomaly (SAA), galactic cosmic rays (GCR, high-Z and high-energy HZE ions), and solar particle events (SPE). Exposure leads to oxidative stress, endothelial damage, accelerated microvascular atherosclerosis, and DNA double-strand breaks. Deep-space exploration missions beyond LEO will exceed low-Earth orbit dose rates by a factor of 3 to 5.',
    keyFindings: [
      'GCR HZE ions (e.g., 56Fe) induce dense ionization tracks causing clustered, unrepairable DNA lesions.',
      'Accumulated doses >100 mSv correlate with persistent endothelial dysfunction and capillary rarefaction in myocardial tissue models.',
      'Career radiation exposure limits for astronauts are calculated based on a 3% mean risk of exposure-induced death (REID) at 95% confidence interval.',
      'Active SPE monitoring and storm-shelter protocols provide 10x attenuation against high-flux proton surges.'
    ],
    clinicalTakeaways: [
      'Dosimeter spikes during coronal mass ejections require immediate shelter in core vehicle modules with high water-shielding density.',
      'Biomarkers of DNA damage (gamma-H2AX foci) should be monitored post-EVA and during solar maximums.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20190033302',
    verifiedGroundTruth: true
  },
  {
    id: 'nasa-hrp-muscle-2020',
    title: 'Risk of Impaired Performance Due to Reduced Muscle Mass, Strength, and Endurance',
    ntrsId: 'NTRS-20205001235',
    doi: '10.1038/s41526-020-0104-5',
    year: 2020,
    authors: ['Ploutz-Snyder LL', 'Downs M', 'Goetchius E', 'Crowell B', 'English KL', 'Ploutz-Snyder R', 'Ryder JW'],
    publication: 'NASA Human Research Program Evidence Book (NASA/TP-2020-220083)',
    domains: ['musculoskeletal'],
    abstract: 'Without continuous gravitational loading, postural muscles (slow-twitch oxidative Type I fibers in soleus, gastrocnemius, and erector spinae) experience rapid atrophy, fiber phenotype transition toward fast glycolytic Type IIx, and neuromuscular degradation. In the absence of countermeasures, crew lose up to 20% of calf muscle volume and 30% of peak knee extensor strength within 180 days.',
    keyFindings: [
      'Postural antigravity extensor muscles degrade 3x faster than flexor muscle groups.',
      'Neuromuscular junction activation efficiency declines prior to measurable macroscopic volumetric loss.',
      'Concurrent resistance training and high-intensity interval cycle ergometry (T2/CEVIS) preserves ~90% of isometric muscle capacity.',
      'Post-flight muscle soreness and delayed onset muscle soreness (DOMS) peak between Flight Day R+2 and R+5.'
    ],
    clinicalTakeaways: [
      'Muscle cross-sectional area loss can be halted with daily eccentric resistance loading.',
      'Calf circumference measurements provide a rapid non-invasive proxy for lower-extremity postural muscle volume.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20205001235',
    verifiedGroundTruth: true
  },
  {
    id: 'nasa-crucian-immune-2020',
    title: 'Immune System Dysregulation During Long-Duration Spaceflight and Terrestrial Spaceflight Analogs',
    ntrsId: 'NTRS-20200002198',
    doi: '10.3389/fmicb.2020.00445',
    year: 2020,
    authors: ['Crucian BE', 'Choukèr A', 'Simpson RJ', 'Mehta SK', 'Marshall GD', 'Smith SM', 'Sams CF'],
    publication: 'Frontiers in Microbiology, Section Infectious Diseases, 11:445',
    domains: ['immune'],
    abstract: 'Astronauts experience multifactorial immune dysregulation caused by microgravity, psychological stress, circadian misalignment, sleep deprivation, and radiation. Subclinical reactivation of latent herpesviruses (Epstein-Barr virus EBV, Varicella-Zoster virus VZV, and Cytomegalovirus CMV) is observed in over 50% of ISS crewmembers, along with reduced T-cell receptor blastogenesis and elevated pro-inflammatory cytokines.',
    keyFindings: [
      'EBV viral shedding in saliva increases up to 100-fold during mission operational peaks (docking, EVAs).',
      'T-cell activation pathways (CD69 expression and IL-2 secretion) are diminished by >40% in simulated microgravity and in-flight samples.',
      'Peripheral white blood cell distribution shifts toward immature granulocytes.',
      'Hypersensitivity skin reactions and unexplained rash events occur at a higher incidence on orbit.'
    ],
    clinicalTakeaways: [
      'Viral reactivation serves as an objective biomarker for cumulative mission stress load.',
      'Prophylactic antiviral protocols and targeted immune-supporting nutritional regimens (e.g. polyphenols, omega-3) are recommended.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20200002198',
    verifiedGroundTruth: true
  },
  {
    id: 'nasa-sleep-circadian-2014',
    title: 'Prevalence of sleep deficiency and use of hypnotic drugs in astronauts before, during, and after spaceflight',
    ntrsId: 'NTRS-20140010899',
    doi: '10.1016/S1474-4422(14)70122-X',
    year: 2014,
    authors: ['Barger LK', 'Flynn-Evans EE', 'Kubey A', 'Walsh L', 'Ronda JM', 'Wang W', 'Wright KP', 'Czeisler CA'],
    publication: 'The Lancet Neurology, 13(9):904-912',
    domains: ['sleep'],
    abstract: 'Sleep deficiency is pervasive among astronauts, averaging less than 6 hours per night during space shuttle and ISS missions. Environmental disrupters include 90-minute orbital sunrise/sunset cycles, acoustic noise (>60 dBA in crew quarters), carbon dioxide micro-pockets, and microgravity lack of tactile proprioceptive feedback. Three-quarters of crewmembers report using sleep-promoting medications (zolpidem, zaleplon, melatonin) during flight.',
    keyFindings: [
      'Astronauts averaged 5.96 hours of sleep per night in flight vs 6.35 hours post-flight and 7.4 hours baseline target.',
      'Slow-wave deep sleep (N3) and REM sleep percentages decrease markedly during critical mission operational phases.',
      'Circadian phase misalignment occurs in 65% of crew due to slam-shifting of sleep schedules during visiting vehicle rendezvous.',
      'Narrow-band blue-enriched solid-state dynamic lighting (SSLA) improves circadian entrainment and subjective sleep quality by 28%.'
    ],
    clinicalTakeaways: [
      'Cumulative sleep debt degrades reaction time, working memory, and autonomous emergency response capabilities.',
      'Chronobiological protocols (timed dynamic lighting + 0.5-3mg exogenous melatonin) should precede sleep aids.'
    ],
    url: 'https://ntrs.nasa.gov/citations/20140010899',
    verifiedGroundTruth: true
  }
];

export const SCIENTIFIC_GLOSSARY: Record<string, { term: string; phonetic?: string; definition: string; aerospaceSignificance: string; relatedDomains: string[] }> = {
  'SANS': {
    term: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS)',
    phonetic: 'sænz',
    definition: 'A constellation of ophthalmic findings observed in long-duration astronauts including optic disc edema, globe flattening, choroidal folds, and hyperopic refractive shifts.',
    aerospaceSignificance: 'Caused by cephalad fluid shifts that elevate central venous pressure without Earth-like nocturnal ICP reduction. Present in ~70% of ISS crew to varying degrees.',
    relatedDomains: ['cardiovascular', 'neurology']
  },
  'Cephalad Fluid Shift': {
    term: 'Cephalad Fluid Shift',
    phonetic: 'sɛf-ə-læd flu-ɪd ʃɪft',
    definition: 'The headward redistribution of approximately 1.5 to 2 liters of intravascular and interstitial fluid upon entry into microgravity due to loss of the gravitational hydrostatic pressure gradient.',
    aerospaceSignificance: 'Causes facial puffiness, nasal congestion, altered baroreceptor setpoints, initial stroke volume increase followed by hypovolemia, and elevated cranial venous pressure.',
    relatedDomains: ['cardiovascular']
  },
  'GCR': {
    term: 'Galactic Cosmic Rays (GCR)',
    definition: 'High-energy protons and heavy relativistic atomic nuclei (HZE ions such as 56Fe) originating outside the Solar System.',
    aerospaceSignificance: 'Omnidirectional, highly penetrating, and cannot be completely shielded by spacecraft hulls. Primary driver of long-term cancer risk, cardiovascular endothelial damage, and central nervous system risks on deep space missions.',
    relatedDomains: ['radiation']
  },
  'SPE': {
    term: 'Solar Particle Event (SPE)',
    definition: 'A sporadic influx of high-energy protons ejected during solar flares or coronal mass ejections (CMEs).',
    aerospaceSignificance: 'Presents acute radiation sickness risk (nausea, hematological suppression) if unshielded. Requires crew to take shelter in heavily shielded module storm shelters.',
    relatedDomains: ['radiation']
  },
  'BMD Resorption': {
    term: 'Bone Mineral Density (BMD) Resorption',
    definition: 'The osteoclast-mediated dissolution of bone mineral matrix resulting from the removal of gravitational loading forces on the skeleton.',
    aerospaceSignificance: 'Astronauts lose 1.0-1.5% BMD per month in the calcaneus, femoral neck, and lumbar spine, releasing calcium into the bloodstream and raising nephrolithiasis risks.',
    relatedDomains: ['musculoskeletal']
  },
  'ARED': {
    term: 'Advanced Resistive Exercise Device (ARED)',
    definition: 'An exercise countermeasure apparatus on the ISS using vacuum cylinders to provide up to 600 lbs (2670 N) of constant load to simulate free-weight resistance exercises in microgravity.',
    aerospaceSignificance: 'The premier countermeasure for preventing bone demineralization and postural slow-twitch muscle atrophy on long-duration orbital missions.',
    relatedDomains: ['musculoskeletal']
  },
  'HRV rMSSD': {
    term: 'HRV rMSSD (Root Mean Square of Successive Differences)',
    definition: 'A primary heart rate variability metric that quantifies parasympathetic (vagal) autonomic regulation of the heart.',
    aerospaceSignificance: 'Drops during high sympathetic stress, systemic inflammation, chronic sleep deficit, or cardiovascular deconditioning. A leading indicator of operational fatigue.',
    relatedDomains: ['cardiovascular', 'sleep']
  },
  'Orthostatic Intolerance': {
    term: 'Orthostatic Intolerance',
    definition: 'Inability to maintain blood pressure and cerebral perfusion upon returning to an upright posture in a 1-g gravitational field.',
    aerospaceSignificance: 'Affects up to 80% of returning long-duration astronauts due to microgravity-induced plasma volume reduction, baroreceptor resetting, and leg venous pooling.',
    relatedDomains: ['cardiovascular']
  }
};
