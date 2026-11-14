import { RiskCategory } from '../types/risk.types';

export const NASA_RISK_CATEGORIES: RiskCategory[] = [
  {
    id: 'risk-radiation',
    code: 'RAD',
    title: 'Space Radiation Health Risks',
    shortDescription: 'Cellular, tissue, and systemic risks induced by Galactic Cosmic Rays (GCR), Solar Particle Events (SPE), and trapped Van Allen radiation.',
    fullDescription: 'Outside the protection of Earth\'s magnetosphere and atmosphere, astronauts encounter a complex radiation environment dominated by high-energy, heavy charged ions (HZE nuclei) from galactic cosmic rays and proton flux from solar particle events. These densely ionizing particles create clustered DNA double-strand breaks that challenge cellular repair mechanisms, elevating risks of radiation carcinogenesis, acute radiation syndromes, central nervous system alterations, and cardiovascular degenerative disease.',
    physiologicalSystem: [
      'Genomic & Cellular (Radiation)',
      'Central Nervous System & Sensorimotor',
      'Cardiovascular'
    ],
    mechanisms: [
      {
        name: 'Clustered DNA Double-Strand Breaks (DSBs)',
        description: 'HZE ion tracks produce complex, clustered lesions along core ionization trajectories that are refractory to homologous recombination and non-homologous end joining (NHEJ).',
        cellularPathway: 'ATM / ATR kinase activation, p53-mediated apoptosis, persistent gamma-H2AX foci.',
        primaryDrivers: ['High-LET iron (56Fe), silicon (28Si), and proton radiation tracks.']
      },
      {
        name: 'Chronic Oxidative Stress & Neuroinflammation',
        description: 'Persistent reactive oxygen species (ROS) generation in microglia and endothelial cells leading to neurovascular unit impairment and synaptic plasticity degradation.',
        cellularPathway: 'NADPH oxidase induction, mitochondrial membrane depolarization, elevated TNF-alpha and IL-6.',
        primaryDrivers: ['Low-dose rate GCR exposure over months-long interplanetary transit.']
      },
      {
        name: 'Endothelial Senescence & Microvascular Degeneration',
        description: 'Premature endothelial cell senescence, capillary rarefaction, and accelerated atherosclerotic plaque destabilization.',
        cellularPathway: 'p16INK4a / p21 activation, senescence-associated secretory phenotype (SASP).',
        primaryDrivers: ['GCR heavy ion traversals through vascular endothelium.']
      }
    ],
    missionRelevance: {
      leo: 'Mitigated by geomagnetic shielding (geomagnetic cutoff filters low-energy GCR; primary exposure is South Atlantic Anomaly trapped protons). Average dose rate: ~0.4-0.6 mSv/day.',
      lunar: 'Loss of geomagnetic field protection. GCR dose rate rises to ~1.3-1.8 mSv/day. Vulnerable to unpredicted coronal mass ejection Solar Particle Events (SPEs) requiring storm shelters.',
      mars: 'Critical multi-year exposure (~300-450 mSv transit round-trip plus ~200-300 mSv surface stay without shielding). Cumulative dose approaches or exceeds career limits (NASA 600 mSv lifetime standard).',
      deepSpace: 'Continuous unattenuated GCR background with elevated lifetime attributable risk (LAR) of fatal cancer and subclinical degenerative microvascular pathology.'
    },
    evidenceIds: ['EV-RAD-001', 'EV-RAD-002', 'EV-RAD-003', 'EV-RAD-004', 'EV-RAD-005'],
    mitigationIds: ['MIT-RAD-01', 'MIT-RAD-02', 'MIT-RAD-03', 'MIT-RAD-04'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=99',
    primaryHrpCategory: 'Space Radiation Element (HRP-SR)',
    severityFactors: [
      'Solar cycle modulation (solar minimum produces higher GCR flux due to weaker interplanetary magnetic field)',
      'Lack of passive shielding against high-energy relativistic iron ions',
      'Individual genetic radiosensitivity variants and baseline DNA repair efficiency'
    ],
    keyVulnerabilities: [
      'In-flight cognitive impairment during high-stress maneuvers',
      'Late-life excess risk of ischemic heart disease and solid tumors',
      'Acute radiation syndrome risk from massive unshielded SPEs'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 28,
      groundAnalogCount: 42,
      animalStudiesCount: 165,
      cellModelCount: 210,
      overallCertaintyBasis: 'High certainty on physical dosimetry and in-vitro DNA damage; moderate-low certainty on human deep-space GCR biological extrapolation from rodent accelerator models.'
    },
    accentColor: '#8B5CF6',
    iconName: 'Zap'
  },
  {
    id: 'risk-cardiovascular',
    code: 'CARDIO',
    title: 'Cardiovascular Deconditioning & Alterations',
    shortDescription: 'Cephalic fluid redistribution, orthostatic intolerance upon gravitational re-entry, cardiac remodeling, and altered autonomic control.',
    fullDescription: 'In microgravity, the absence of hydrostatic venous pooling initiates an immediate 1.5-2 liter cephalic fluid shift. This transient central hypervolemia is sensed by cardiac volume receptors, prompting rapid compensatory reductions in plasma volume (10-15%) through diuresis and fluid extravasation. Prolonged absence of gravitational cardiac work demands results in left ventricular mass reduction, arterial stiffness adaptations, vagal withdrawal, and post-landing orthostatic intolerance.',
    physiologicalSystem: [
      'Cardiovascular',
      'Endocrine & Circadian'
    ],
    mechanisms: [
      {
        name: 'Hydrostatic Fluid Redistribution & Plasma Volume Contraction',
        description: 'Removal of the 1-G gravity vector abolishes intravascular hydrostatic gradients, shifting fluid from lower extremities into upper torso and head, followed by Gauer-Henry reflex mediated hypovolemia.',
        cellularPathway: 'Atrial natriuretic peptide (ANP) release, renin-angiotensin-aldosterone axis suppression.',
        primaryDrivers: ['Microgravity exposure during ascent and sustained weightlessness.']
      },
      {
        name: 'Myocardial Remodeling & Left Ventricular Atrophy',
        description: 'Decreased stroke volume demand and reduced systemic vascular resistance lead to left ventricular mass reduction of approximately 8-10% over 6-month ISS missions.',
        cellularPathway: 'Myocyte sarcomeric thinning, altered calcium handling, reduced protein synthesis.',
        primaryDrivers: ['Reduced hemodynamic workload and chronic low arterial blood pressure.']
      },
      {
        name: 'Impaired Baroreflex Sensitivity & Orthostatic Intolerance',
        description: 'Blunted arterial and cardiopulmonary baroreflex-mediated vasoconstriction fails to maintain cerebral perfusion upon re-exposure to gravity.',
        cellularPathway: 'Downregulation of vascular alpha-1 adrenergic receptor responsiveness and noradrenaline spillover.',
        primaryDrivers: ['Re-entry deceleration forces and return to 1-G or planetary partial gravity.']
      }
    ],
    missionRelevance: {
      leo: 'Well-characterized on ISS (up to 30% of long-duration crew experience presyncope during passive stand tests without countermeasures; managed via fluid loading and compression garments).',
      lunar: 'Rapid transition from microgravity transit to 1/6-G lunar surface demands immediate operational capability during unassisted planetary egress.',
      mars: 'High operational vulnerability: after 6-9 months of weightlessness, crew must perform critical lander operations and surface EVA in 3/8-G without ground medical support.',
      deepSpace: 'Prolonged deconditioning without artificial gravity baseline increases risk of in-flight cardiac arrhythmias and microvascular rarefaction.'
    },
    evidenceIds: ['EV-CARDIO-001', 'EV-CARDIO-002', 'EV-CARDIO-003', 'EV-CARDIO-004'],
    mitigationIds: ['MIT-CARDIO-01', 'MIT-CARDIO-02', 'MIT-CARDIO-03'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=101',
    primaryHrpCategory: 'Cardiovascular & Physiological Countermeasures (HRP-HHC)',
    severityFactors: [
      'Mission duration and adherence to prescribed high-intensity aerobic exercise',
      'Individual variation in baroreceptor reserve and autonomic tone',
      'Post-landing gravitational gradient transition speed'
    ],
    keyVulnerabilities: [
      'Syncopal episodes during manual spacecraft docking or landing operations',
      'Reduced aerobic functional reserve (VO2max decline of 15-25% without countermeasures)',
      'Subclinical jugular vein thrombosis risk observed in long-duration ISS crew'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 54,
      groundAnalogCount: 88,
      animalStudiesCount: 36,
      cellModelCount: 45,
      overallCertaintyBasis: 'High certainty on human astronaut hemodynamics, ultrasound cardiac measurements, and bed-rest analog validity.'
    },
    accentColor: '#EF4444',
    iconName: 'HeartPulse'
  },
  {
    id: 'risk-bone',
    code: 'BONE',
    title: 'Bone Demineralization & Fracture Risk',
    shortDescription: 'Accelerated osteoclast-mediated bone resorption, negative calcium balance, structural trabecular loss, and elevated nephrolithiasis risk.',
    fullDescription: 'Skeletal unloading in microgravity removes the compressive mechanical strains necessary for osteocyte mechanosensing and Wnt/beta-catenin signaling. Consequently, bone remodeling is profoundly decoupled: osteoclast resorption surges while osteoblast matrix formation remains stagnant or suppressed. Weight-bearing bones (lumbar vertebrae, femoral neck, calcaneus) lose approximately 1-1.5% bone mineral density per month in orbit, liberating systemic calcium that elevates urinary supersaturation and renal calculus (kidney stone) risk.',
    physiologicalSystem: [
      'Musculoskeletal (Bone)'
    ],
    mechanisms: [
      {
        name: 'Osteocyte Mechanotransduction Arrest',
        description: 'Absence of fluid shear stress in osteocyte lacunar-canalicular networks triggers increased secretion of sclerostin and DKK1, potent inhibitors of bone formation.',
        cellularPathway: 'Wnt/beta-catenin pathway inhibition, upregulation of RANKL relative to OPG.',
        primaryDrivers: ['Loss of skeletal mechanical loading in weightlessness.']
      },
      {
        name: 'Uncoupled Bone Resorption & Trabecular Microarchitecture Degradation',
        description: 'Rapid elevation of urinary N-telopeptide (NTX) and deoxypyridinoline (DPD) reflecting excessive osteoclastic matrix digestion, leading to irreversible trabecular connectivity loss.',
        cellularPathway: 'Cathepsin K activation, osteoclast vacuolar H+-ATPase activity.',
        primaryDrivers: ['Continuous microgravity unloading over weeks to months.']
      },
      {
        name: 'Hypercalciuria & Nephrolithiasis Pathogenesis',
        description: 'Skeletal calcium efflux raises urinary calcium concentrations, which, combined with mild spaceflight dehydration and alkaline urine, produces calcium oxalate/phosphate crystal precipitation.',
        cellularPathway: 'Renal tubular calcium excretion, parathyroid hormone (PTH) suppression.',
        primaryDrivers: ['Massive calcium mobilization from skeleton.']
      }
    ],
    missionRelevance: {
      leo: 'Mitigated substantially by the Advanced Resistive Exercise Device (ARED) on ISS; pre-ARED missions showed up to 10% hip loss in 6 months; post-ARED shows 2-4% loss with slower recovery.',
      lunar: 'Partial gravity (0.16-G) mechanotransduction threshold remains unquantified; EVA suits (40-60 kg) impose significant joint and bone loading.',
      mars: 'Major concern: 3-year round trip may yield significant cumulative trabecular thinning; potential for fragility fractures during unassisted surface operations.',
      deepSpace: 'Prolonged absence of 1-G ground reaction forces risks permanent architectural micro-damage in weight-bearing bone compartments.'
    },
    evidenceIds: ['EV-BONE-001', 'EV-BONE-002', 'EV-BONE-003', 'EV-BONE-004'],
    mitigationIds: ['MIT-BONE-01', 'MIT-BONE-02', 'MIT-BONE-03'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=102',
    primaryHrpCategory: 'Human Health Countermeasures (HRP-HHC)',
    severityFactors: [
      'ARED daily resistive loading consistency and peak force application',
      'Dietary intake of sodium, protein, vitamin D3, and adequate caloric balance',
      'Pre-flight baseline bone microarchitecture and family history of osteoporosis'
    ],
    keyVulnerabilities: [
      'In-flight or post-landing skeletal fracture upon impact or heavy EVA activity',
      'Acute incapacitating renal colic from calcium oxalate nephrolithiasis',
      'Incomplete recovery of trabecular micro-architecture years after mission return'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 62,
      groundAnalogCount: 75,
      animalStudiesCount: 110,
      cellModelCount: 95,
      overallCertaintyBasis: 'Very high certainty on human DXA and HR-pQCT bone density kinetics; high certainty on ARED efficacy; moderate certainty on partial-G thresholds.'
    },
    accentColor: '#F59E0B',
    iconName: 'ShieldAlert'
  },
  {
    id: 'risk-muscle',
    code: 'MUSCLE',
    title: 'Skeletal Muscle Atrophy & Functional Impairment',
    shortDescription: 'Rapid postural muscle mass loss, slow-to-fast fiber-type transformation, contractile force diminution, and metabolic efficiency decline.',
    fullDescription: 'Without gravitational resistance, postural antigravity muscles (soleus, gastrocnemius, quadriceps, and intrinsic back muscles) undergo rapid structural and metabolic degradation. Astronauts can lose 10-20% of calf muscle volume within just 10-14 days without vigorous resistive countermeasure exercise. At the subcellular level, there is a prominent phenotypic transition from fatigue-resistant Type I slow-twitch oxidative fibers toward fatigable Type IIx fast-twitch glycolytic fibers, reducing endurance and operational work capacity.',
    physiologicalSystem: [
      'Musculoskeletal (Muscle)'
    ],
    mechanisms: [
      {
        name: 'Ubiquitin-Proteasome Mediated Proteolysis',
        description: 'Microgravity-induced mechanical unburdening triggers hyperactivation of muscle-specific E3 ubiquitin ligases (MuRF1 and MAFbx/Atrogin-1) that target sarcomeric proteins for degradation.',
        cellularPathway: 'FOXO transcription factor translocation, Akt/mTOR signaling suppression.',
        primaryDrivers: ['Loss of tension and contractile stimulus in antigravity muscles.']
      },
      {
        name: 'Fiber Type Switching (Type I to Type II)',
        description: 'Decoupling of calcineurin/NFAT signaling promotes repression of slow-twitch myosin heavy chain (MHC-I) gene expression with compensatory upregulation of MHC-IIa and IIx.',
        cellularPathway: 'Calcineurin/NFATc1 dephosphorylation arrest, PGC-1alpha downregulation.',
        primaryDrivers: ['Absence of continuous postural tonic firing.']
      },
      {
        name: 'Neuromuscular Junction Remodeling & Motor Unit Deregulation',
        description: 'Disorganization of acetylcholine receptor clusters at the motor endplate with loss of coordinated motor unit recruitment and maximal voluntary contraction power.',
        cellularPathway: 'Agrin/MuSK signaling alterations, mitochondrial oxidative phosphorylation deficit.',
        primaryDrivers: ['Disuse and altered proprioceptive feedback.']
      }
    ],
    missionRelevance: {
      leo: 'Controlled effectively on ISS via combination of ARED heavy resistance training and T2 treadmill running; residual post-flight deficits resolve in 30-60 days.',
      lunar: 'Demanding lunar surface EVAs (6-8 hours traversing regolith) require substantial quadriceps and ankle plantarflexor endurance.',
      mars: 'Severe operational constraint: crew must walk, transport equipment, and repair habitats immediately after 180-210 days of transit unloading.',
      deepSpace: 'Equipment failure or inability to exercise for even 1-2 weeks produces catastrophic functional degradation in crew physical work capacity.'
    },
    evidenceIds: ['EV-MUSCLE-001', 'EV-MUSCLE-002', 'EV-MUSCLE-003'],
    mitigationIds: ['MIT-MUSCLE-01', 'MIT-MUSCLE-02', 'MIT-BONE-01'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=103',
    primaryHrpCategory: 'Human Health Countermeasures (HRP-HHC)',
    severityFactors: [
      'Access to high-load exercise devices capable of delivering 600+ lbs of resistive force',
      'Daily protein intake (> 1.2 g/kg/day) and energy balance (preventing caloric deficit)',
      'Specific targeting of deep calf postural soleus muscle units'
    ],
    keyVulnerabilities: [
      'Inability to execute emergency egress after spacecraft splashdown or planetary landing',
      'Rapid muscle fatigue during pressurized extravehicular activity suits',
      'Increased susceptibility to tendon and ligament strain injuries'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 49,
      groundAnalogCount: 92,
      animalStudiesCount: 140,
      cellModelCount: 80,
      overallCertaintyBasis: 'Very high certainty on astronaut muscle biopsies, MRI volumetric quantification, and ergometer power outputs.'
    },
    accentColor: '#10B981',
    iconName: 'Activity'
  },
  {
    id: 'risk-immune',
    code: 'IMMUNE',
    title: 'Immune System Dysregulation & Host-Microbe Dynamics',
    shortDescription: 'T-cell and NK-cell suppression, cytokine alterations, latent herpesvirus reactivation (EBV, CMV, VZV), and altered microbial virulence.',
    fullDescription: 'The synergy of microgravity, elevated ionizing radiation, persistent circadian disruption, confinement, and psychological stress causes multisystem immune dysregulation. Cell-mediated immunity is significantly blunted: T-cell blastogenesis, natural killer cell cytotoxicity, and antibody responses are altered. Subclinical reactivation of latent herpesviruses (Epstein-Barr virus, Cytomegalovirus, and Varicella-Zoster virus) is routinely detected in astronaut saliva and blood, accompanied by altered environmental microbiome profiles in closed spacecraft atmospheres.',
    physiologicalSystem: [
      'Immune & Hematology'
    ],
    mechanisms: [
      {
        name: 'Suppressed Cell-Mediated T-Cell and NK-Cell Function',
        description: 'Impaired early T-cell receptor (TCR) activation signaling cascade and reduced production of IL-2 and IFN-gamma following mitogen stimulation.',
        cellularPathway: 'Suppression of NF-kappaB and NFAT transcription factors, impaired protein kinase C (PKC) translocation.',
        primaryDrivers: ['Direct microgravity effects on cellular cytoskeleton plus systemic neuroendocrine stress.']
      },
      {
        name: 'Latent Herpesvirus Shedding & Subclinical Reactivation',
        description: 'Elevated circulating catecholamines and glucocorticoids suppress immune surveillance, permitting viral genome replication and shedding in saliva and urine.',
        cellularPathway: 'Glucocorticoid receptor mediated transrepression of antiviral immune checkpoints.',
        primaryDrivers: ['Chronic mission stress, altered sleep architecture, and radiation exposure.']
      },
      {
        name: 'Microbial Virulence & Antimicrobial Resistance in Spacecraft Habitats',
        description: 'Low fluid shear environments in microgravity alter bacterial gene expression, promoting biofilm formation and enhanced resistance to conventional disinfectants.',
        cellularPathway: 'Hfq RNA chaperone mediated stress response regulon induction in opportunistic pathogens.',
        primaryDrivers: ['Closed environmental control and life support system (ECLSS) recycling.']
      }
    ],
    missionRelevance: {
      leo: 'Monitored routinely on ISS; clinical events are rare due to sterile environment and young, healthy crew, but viral reactivation rates exceed 50%.',
      lunar: 'Lunar dust abrasive contamination combined with impaired skin mucosal barrier integrity increases contact dermatitis and respiratory irritation risks.',
      mars: 'Substantial vulnerability: with no resupply, a communicable infectious disease outbreak or opportunistic fungal/bacterial infection could jeopardize crew survival.',
      deepSpace: 'Prolonged multi-year immunosuppression under unshielded radiation could precipitate atypical allergic, autoimmune, or opportunistic infectious syndromes.'
    },
    evidenceIds: ['EV-IMMUNE-001', 'EV-IMMUNE-002', 'EV-IMMUNE-003', 'EV-IMMUNE-004'],
    mitigationIds: ['MIT-IMMUNE-01', 'MIT-IMMUNE-02', 'MIT-IMMUNE-03'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=104',
    primaryHrpCategory: 'Exploration Medical Capability / Immune (HRP-ExMC)',
    severityFactors: [
      'Pre-flight astronaut immune baseline and serostatus for latent herpesviruses',
      'Spacecraft environmental hygiene and HEPA filtration efficiency',
      'Nutritional status, particularly micronutrients (zinc, vitamins C, D3, omega-3 fatty acids)'
    ],
    keyVulnerabilities: [
      'Atypical presentation of common infectious diseases requiring antibiotics or antivirals',
      'Delayed cutaneous wound healing during deep-space operations',
      'Hypersensitivity reactions and refractory dermatological rashes'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 44,
      groundAnalogCount: 65,
      animalStudiesCount: 85,
      cellModelCount: 130,
      overallCertaintyBasis: 'High certainty on viral shedding and peripheral blood immune phenotypes; moderate certainty on direct clinical infection rates.'
    },
    accentColor: '#06B6D4',
    iconName: 'Shield'
  },
  {
    id: 'risk-sleep',
    code: 'SLEEP',
    title: 'Sleep Loss & Circadian Rhythm Disruption',
    shortDescription: 'Chronic sleep restriction, circadian desynchrony due to 90-minute orbital cycles, reduced slow-wave/REM sleep, and severe cognitive fatigue.',
    fullDescription: 'In Low Earth Orbit, the ISS orbits Earth every 90 minutes, exposing crew to 16 sunrises and sunsets daily, which degrades natural zeitgebers (time givers). Concurrently, noise from life support equipment, microgravity-related sleep disruptions, and operational scheduling demands cause astronauts to average fewer than 6 hours of sleep per night despite an 8.5-hour scheduled sleep opportunity. Over time, cumulative sleep debt impairs cognitive vigilance, psychomotor speed, executive function, and emotional regulation.',
    physiologicalSystem: [
      'Endocrine & Circadian',
      'Behavioral & Neuropsychiatric',
      'Central Nervous System & Sensorimotor'
    ],
    mechanisms: [
      {
        name: 'Suprachiasmatic Nucleus (SCN) Circadian Desynchronization',
        description: 'Absence of stable 24-hour solar irradiance disrupts intrinsic retinal ganglion cell melanopsin signaling to the hypothalamic central pacemaker.',
        cellularPathway: 'Disrupted transcription-translation feedback loops of CLOCK, BMAL1, PER1/2, and CRY1/2 genes.',
        primaryDrivers: ['Artificial lighting environments and rapid orbital orbital orbital day-night cycling.']
      },
      {
        name: 'Sleep Architecture Fragmentation & Slow-Wave Deficiency',
        description: 'Microgravity-induced absence of contact pressure plus environmental acoustics reduces restorative Stage N3 (slow-wave) and REM sleep proportions.',
        cellularPathway: 'Altered adenosine accumulation kinetics and thalamocortical spindle oscillations.',
        primaryDrivers: ['Ambient habitat noise (> 55 dBA), temperature fluctuations, and floating discomfort.']
      },
      {
        name: 'Neurobehavioral Performance Lapses & Microsleeps',
        description: 'Progressive accumulation of homeostatic sleep debt creates lapses in sustained attention as measured by the Psychomotor Vigilance Test (PVT).',
        cellularPathway: 'Prefrontal cortex metabolic hypoactivation and reduced frontoparietal functional connectivity.',
        primaryDrivers: ['Chronic sleep restriction (< 6 hours/night across consecutive weeks).']
      }
    ],
    missionRelevance: {
      leo: 'Addressed via Solid-State Light Assemblies (SSLA) with dynamic spectrum tuning and sleep hygiene protocols; hypnotic medication use remains prevalent (~75% of missions).',
      lunar: 'Artemis lunar surface missions involve extreme work schedules during short surface stays, heightening risk of acute fatigue during critical EVA maneuvers.',
      mars: 'Martian sol (24 hours, 39 minutes) requires continuous daily circadian phase shift of 39 minutes; cumulative desynchrony can degrade autonomous crew decision making.',
      deepSpace: 'Distance precludes Earth real-time mission control tactical monitoring; autonomous scheduling increases reliance on disciplined crew sleep routines.'
    },
    evidenceIds: ['EV-SLEEP-001', 'EV-SLEEP-002', 'EV-SLEEP-003'],
    mitigationIds: ['MIT-SLEEP-01', 'MIT-SLEEP-02', 'MIT-SLEEP-03'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=105',
    primaryHrpCategory: 'Behavioral Health and Performance (HRP-BHP)',
    severityFactors: [
      'Habitat acoustic insulation and crew personal sleep station temperature control',
      'Spectral quality of ambient illumination (blue-depleted vs. blue-enriched light schedules)',
      'Operational shiftwork and circadian misalignment during visiting vehicle dockings'
    ],
    keyVulnerabilities: [
      'Critical operator errors during rendezvous, docking, or robotic arm teleoperation',
      'Elevated interpersonal tension and impaired communication between crew and Ground',
      'Dependence on sleep-promoting pharmacotherapy (zolpidem, zaleplon) and stimulants (caffeine)'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 52,
      groundAnalogCount: 78,
      animalStudiesCount: 22,
      cellModelCount: 15,
      overallCertaintyBasis: 'Very high certainty on astronaut actigraphy, sleep logs, and polysomnography data across multiple flight programs.'
    },
    accentColor: '#3B82F6',
    iconName: 'Moon'
  },
  {
    id: 'risk-behavior',
    code: 'BEHAVIOR',
    title: 'Psychological, Behavioral & Team Cohesion Risks',
    shortDescription: 'Prolonged isolation, confinement in extreme environments, sensory monotony, interpersonal friction, and diminished autonomy resilience.',
    fullDescription: 'Long-duration space exploration entails unprecedented conditions of isolation and confinement in high-risk, austere environments. Crew members endure sensory deprivation, restricted personal space, lack of privacy, Earth-out-of-view psychological detachment, and multi-minute communication latencies that prevent conversational interaction with family and flight surgeons. These stressors heighten vulnerability to mood disorders, depressive symptomatology, psychosomatic complaints, and team cohesion breakdown.',
    physiologicalSystem: [
      'Behavioral & Neuropsychiatric'
    ],
    mechanisms: [
      {
        name: 'Sensory Monotony & Neural Habituation',
        description: 'Repetitive environmental stimuli (uniform artificial lighting, humming ventilation, freeze-dried food) suppress dopaminergic reward pathways and affective vigor.',
        cellularPathway: 'Mesolimbic dopamine transporter alterations and reduced neurotrophic factor (BDNF) expression.',
        primaryDrivers: ['Months-long enclosure in cramped, window-limited pressure vessels.']
      },
      {
        name: 'Interpersonal Friction & Group Dynamic Displacement',
        description: 'Tension arising from incompatible coping styles and high workloads, often displaced externally onto Mission Control ("us vs. them" psychological displacement).',
        cellularPathway: 'Heightened amygdala reactivity and blunted prefrontal inhibitory modulation under chronic social stress.',
        primaryDrivers: ['Small multicultural crews (4-6 persons) confined together with zero escape options.']
      },
      {
        name: 'Earth-Out-of-View Phenomenon & Psychological Detachment',
        description: 'The profound psychological impact of losing visual contact with Earth as a living sphere, leading to existential disorientation and heightened perceived vulnerability.',
        cellularPathway: 'Neuroaffective disruption of spatial/planetary attachment networks.',
        primaryDrivers: ['Interplanetary transits beyond the Moon where Earth shrinks to a distant point of light.']
      }
    ],
    missionRelevance: {
      leo: 'Mitigated by real-time voice/video calls with family, continuous internet access, orbital Earth photography out of the ISS Cupola, and frequent resupply shipments.',
      lunar: 'Earth remains visible in the lunar sky as a ~2° disc, maintaining visual connection, but communication delays (1.3 seconds) eliminate natural conversational flow.',
      mars: 'Highest psychological challenge in human history: 22-minute one-way communication latency, no visual sight of Earth, zero evacuation capability for 2.5 to 3 years.',
      deepSpace: 'Crew must operate as a completely self-reliant closed social system capable of autonomous conflict resolution and mental health self-triage.'
    },
    evidenceIds: ['EV-BEHAVIOR-001', 'EV-BEHAVIOR-002', 'EV-BEHAVIOR-003'],
    mitigationIds: ['MIT-BEHAVIOR-01', 'MIT-BEHAVIOR-02', 'MIT-BEHAVIOR-03'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=106',
    primaryHrpCategory: 'Behavioral Health and Performance (HRP-BHP)',
    severityFactors: [
      'Pre-mission crew psychological selection and team psychosocial compatibility matching',
      'Habitable volume per crew member and availability of private acoustic quarters',
      'Availability of meaningful leisure, creative tasks, and simulated natural environments (VR/plants)'
    ],
    keyVulnerabilities: [
      'Acute clinical depression, anxiety disorders, or acute stress reaction during emergencies',
      'Catastrophic interpersonal breakdown leading to non-cooperation between crew segments',
      'Hostility and breakdown in communication between the expedition crew and Ground support'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 38,
      groundAnalogCount: 110,
      animalStudiesCount: 15,
      cellModelCount: 5,
      overallCertaintyBasis: 'High certainty on ground isolation analogs (HERA, NEK, Mars500, Antarctic stations); moderate certainty on long-duration interplanetary Earth-out-of-view psychological impact.'
    },
    accentColor: '#EC4899',
    iconName: 'Users'
  },
  {
    id: 'risk-sans',
    code: 'SANS',
    title: 'Spaceflight-Associated Neuro-Ocular Syndrome (SANS)',
    shortDescription: 'Optic disc edema, posterior globe flattening, choroidal folds, hyperopic refractive shifts, and optic nerve sheath distension.',
    fullDescription: 'Spaceflight-Associated Neuro-Ocular Syndrome (SANS) represents one of NASA\'s highest-priority medical challenges for long-duration spaceflight. First formally recognized in 2011, SANS affects approximately 70% of long-duration ISS astronauts to varying degrees. The hallmark pathology includes optic disc swelling (papilledema), flattening of the posterior ocular globe, transverse choroidal folds, cotton-wool spots, and hyperopic refractive shifts. The pathophysiology centers on cephalad venous and cerebrospinal fluid (CSF) redistribution that alters normal translaminar cribrosa pressure gradients across the back of the eye.',
    physiologicalSystem: [
      'Ophthalmic / Neuro-Ocular',
      'Central Nervous System & Sensorimotor'
    ],
    mechanisms: [
      {
        name: 'Translaminar Pressure Gradient Inversion',
        description: 'In 1-G upright posture, intracranial pressure (ICP) drops to ~0 to -2 mmHg while intraocular pressure (IOP) is ~15 mmHg. In microgravity, the continuous cephalad fluid shift maintains mildly elevated, non-pulsatile ICP (~10-15 mmHg) day and night, inverting translaminar cribrosa biomechanical stress.',
        cellularPathway: 'Axoplasmic flow stasis at the lamina cribrosa, axonal swelling and prelaminar neural tissue expansion.',
        primaryDrivers: ['Cephalad venous fluid redistribution and sustained absence of upright posture diurnal ICP unloading.']
      },
      {
        name: 'Impaired Venous & Glymphatic Drainage of the Optic Nerve Sheath',
        description: 'Distension of the optic nerve sheath (subarachnoid space) with CSF stasis, tortuosity of the optic nerve, and mechanical compression of posterior scleral structures.',
        cellularPathway: 'Meningeal lymphatic drainage insufficiency and choroidal vascular engorgement.',
        primaryDrivers: ['Central venous pressure elevation and retrograde jugular venous pooling.']
      },
      {
        name: 'One-Carbon Metabolic Polymorphisms & Endothelial Susceptibility',
        description: 'NASA biochemical studies identified that astronauts developing SANS have significantly elevated baseline levels of homocysteine and cystathionine, suggesting genetic susceptibility via MTHFR/SHMT1 enzyme variants.',
        cellularPathway: 'Impaired nitric oxide bioavailability, altered microvascular reactivity, and compromised vascular permeability.',
        primaryDrivers: ['Genetic polymorphism susceptibility interacting with spaceflight environmental stressors.']
      }
    ],
    missionRelevance: {
      leo: 'Extensively characterized via orbital Optical Coherence Tomography (OCT), fundoscopy, and ultrasound on ISS; severe cases have required dedicated mission adjustments.',
      lunar: 'Lunar missions of days to weeks will have minimal SANS manifestation due to short duration; long-term lunar surface base operations in 1/6-G may or may not provide adequate hydrostatic protection.',
      mars: 'Severe mission-critical risk: without countermeasures, 6-9 months of continuous transit could cause irreversible optic nerve atrophy, visual field defects, and uncorrectable loss of visual acuity.',
      deepSpace: 'Uncertain whether artificial gravity or lower body negative pressure (LBNP) can halt or reverse progressive axonal swelling during multi-year trajectories.'
    },
    evidenceIds: ['EV-SANS-001', 'EV-SANS-002', 'EV-SANS-003', 'EV-SANS-004'],
    mitigationIds: ['MIT-SANS-01', 'MIT-SANS-02', 'MIT-SANS-03'],
    hrpRiskUrl: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=108',
    primaryHrpCategory: 'Human Health Countermeasures (HRP-HHC)',
    severityFactors: [
      'Cumulative microgravity exposure duration (edema worsens monotonically over 6-12 months)',
      'Underlying genetic one-carbon metabolism enzyme variants (MTHFR 677C>T, MS 2756A>G)',
      'High ambient spacecraft CO2 levels (> 3 mmHg) exacerbating cerebral vasodilation'
    ],
    keyVulnerabilities: [
      'Loss of near and distance visual acuity during critical docking and landing displays',
      'Irreversible visual field scotomas and chronic post-flight retinal nerve fiber layer thinning',
      'Permanent structural alterations to choroidal vasculature and posterior globe geometry'
    ],
    evidenceQualitySummary: {
      astronautStudiesCount: 48,
      groundAnalogCount: 40,
      animalStudiesCount: 20,
      cellModelCount: 12,
      overallCertaintyBasis: 'Very high certainty on human in-flight OCT structural changes and fundoscopic imaging; moderate-low certainty on intracranial pressure absolute values (due to non-invasive proxy limits).'
    },
    accentColor: '#14B8A6',
    iconName: 'Eye'
  }
];
