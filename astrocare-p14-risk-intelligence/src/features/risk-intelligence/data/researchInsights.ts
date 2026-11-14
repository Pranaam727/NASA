export interface ResearchInsight {
  id: string;
  question: string;
  summary: string;
  scientificDeepDive: string;
  biologicalMechanism: string[];
  keyFindings: string[];
  scientificLimitations: string[];
  primaryEvidenceIds: string[];
  sourceCitations: {
    title: string;
    source: string;
    url: string;
    doi?: string;
  }[];
  riskCategoryCode: string;
}

export const RESEARCH_INSIGHTS: ResearchInsight[] = [
  {
    id: 'insight-sans-pathology',
    question: 'What is Spaceflight-Associated Neuro-Ocular Syndrome (SANS) and what causes it?',
    summary: 'SANS is a neuro-ophthalmic syndrome affecting ~70% of long-duration astronauts, characterized by optic disc edema, posterior globe flattening, choroidal folds, and hyperopic refractive shifts.',
    scientificDeepDive: 'On Earth, gravity pulls ~1.5 to 2 liters of intravascular fluid toward the lower extremities when upright. Intracranial pressure (ICP) in the upright posture drops to zero or slightly subatmospheric (-2 to 0 mmHg), while intraocular pressure (IOP) remains around 14-16 mmHg, creating a healthy positive translaminar pressure difference across the lamina cribrosa. In microgravity, the continuous cephalad fluid shift eliminates this upright diurnal reduction in ICP. Constant mildly elevated, non-pulsatile ICP (~10-15 mmHg) day and night alters the mechanical pressure differential across the posterior scleral shell, impeding axoplasmic flow in the optic nerve, engorging the optic nerve sheath with cerebrospinal fluid, and flattening the globe.',
    biologicalMechanism: [
      'Inversion of the normal upright translaminar cribrosa pressure gradient',
      'Impaired retrograde glymphatic and venous drainage through the internal jugular veins',
      'Underlying genetic variants in the one-carbon folate-methionine metabolic pathway altering microvascular endothelial reactivity'
    ],
    keyFindings: [
      'In-flight optical coherence tomography (OCT) shows progressive optic disc swelling that does not plateau over 6-12 month stays.',
      'Hyperopic refractive shifts of +0.5 to +1.75 diopters frequently occur, necessitating adjustable space glasses ("Superfocus" or "Space Anticipation" lenses).',
      'Lower body negative pressure (LBNP) at -25 to -30 mmHg mechanically reverses optic nerve sheath distension by drawing venous fluid back to the pelvis and legs.'
    ],
    scientificLimitations: [
      'Direct, continuous intracranial pressure cannot currently be measured in-flight with lumbar puncture due to surgical risk in microgravity.',
      'Translational animal models (rodents) possess different ocular anatomy (lack of lamina cribrosa structure identical to humans).',
      'Long-term consequences beyond 12-month flights remain uncertain for a 3-year Mars mission.'
    ],
    primaryEvidenceIds: ['EV-SANS-001', 'EV-SANS-002', 'EV-SANS-003'],
    sourceCitations: [
      {
        title: 'Characterization of Spaceflight-Associated Neuro-Ocular Syndrome (SANS) via In-Flight Optical Coherence Tomography',
        source: 'Ophthalmology (2020)',
        url: 'https://www.sciencedirect.com/science/article/pii/S016164201932338X',
        doi: '10.1016/j.ophtha.2019.12.011'
      },
      {
        title: 'B-Vitamin and One-Carbon Metabolic Pathway Polymorphisms Are Associated with SANS Risk in ISS Astronauts',
        source: 'The American Journal of Clinical Nutrition (2020)',
        url: 'https://academic.oup.com/ajcn/article/111/5/977/5809569',
        doi: '10.1093/ajcn/nqaa024'
      }
    ],
    riskCategoryCode: 'SANS'
  },
  {
    id: 'insight-bone-remodeling',
    question: 'Why does microgravity decouple bone remodeling and accelerate demineralization?',
    summary: 'Skeletal unloading in weightlessness arrests osteocyte mechanotransduction, triggering surges in sclerostin that halt osteoblast bone formation while osteoclasts aggressively resorb weight-bearing bone.',
    scientificDeepDive: 'Under 1-G terrestrial loading, mechanical compression generates interstitial fluid shear flow through osteocyte canalicular channels. This fluid shear stress activates cell-membrane integrins, triggering local prostaglandin E2 and nitric oxide release and suppressing sclerostin and DKK1 expression. This enables Wnt/beta-catenin signaling in osteoblasts, stimulating continuous mineral deposition. In microgravity, the absence of ground reaction forces silences osteocyte fluid shear. Unchecked sclerostin expression represses osteoblast maturation. Concurrently, bone marrow stromal cells upregulate RANKL relative to osteoprotegerin (OPG), unleashing unrestrained osteoclast differentiation and matrix resorption.',
    biologicalMechanism: [
      'Loss of canalicular fluid shear stress stops mechanosensitive Wnt/beta-catenin activation',
      'Hyper-secretion of sclerostin and DKK1 by mechanosensory osteocytes',
      'Surge in osteoclast-mediated bone resorption liberating ~200-250 mg elemental calcium daily into circulation'
    ],
    keyFindings: [
      'Astronauts lose ~1.0-1.5% bone mineral density per month in weight-bearing bones (calcaneus, femoral neck, lumbar vertebrae) without heavy resistance countermeasures.',
      'The Advanced Resistive Exercise Device (ARED) provides up to 600 lbs of load, attenuating DXA density loss to < 0.5% per month when combined with adequate nutrition.',
      'High-Resolution pQCT reveals that trabecular structural microarchitecture does not fully recover even after 12 months on Earth.'
    ],
    scientificLimitations: [
      'DXA 2D areal density measurements cannot distinguish cortical thinning from trabecular micro-perforation in operational flight medicine.',
      'Minimum partial-gravity threshold required to prevent bone demineralization (0.16-G Moon vs 0.38-G Mars) has not been tested in human subjects.'
    ],
    primaryEvidenceIds: ['EV-BONE-001', 'EV-BONE-002', 'EV-BONE-003'],
    sourceCitations: [
      {
        title: 'Bone Mineral Density Preservation in ISS Astronauts Using the Advanced Resistive Exercise Device (ARED)',
        source: 'Journal of Bone and Mineral Research (2013)',
        url: 'https://asbmr.onlinelibrary.wiley.com/doi/10.1002/jbmr.1976',
        doi: '10.1002/jbmr.1976'
      },
      {
        title: 'Incomplete Recovery of Bone Microarchitecture and Strength After 6-to-12-Month Spaceflight',
        source: 'Scientific Reports (2022)',
        url: 'https://www.nature.com/articles/s41598-022-14979-4',
        doi: '10.1038/s41598-022-14979-4'
      }
    ],
    riskCategoryCode: 'BONE'
  },
  {
    id: 'insight-radiation-deepspace',
    question: 'Why is Galactic Cosmic Radiation (GCR) an unprecedented challenge for deep-space missions?',
    summary: 'Galactic cosmic radiation consists of relativistic atomic nuclei stripped of electrons (HZE ions) that penetrate spacecraft shielding and produce complex clustered DNA double-strand breaks that challenge human cellular repair.',
    scientificDeepDive: 'Unlike terrestrial gamma rays or X-rays that cause sparsely distributed ionization, GCR contains high-energy, heavy charged ions (such as 56Fe, 28Si, 16O) traveling near the speed of light. As an iron nucleus traverses a human cell nucleus, it creates a cylindrical core of dense ionization surrounded by a penumbra of energetic delta electrons. This deposits tens to hundreds of Gray along a single microscopic track, creating dense clusters of base damage, abasic sites, and double-strand breaks within 1-2 helical turns of DNA. Standard non-homologous end joining (NHEJ) and homologous recombination repair pathways are prone to misrepair or failure, yielding chromosomal translocations and persistent genomic instability.',
    biologicalMechanism: [
      'High linear energy transfer (high-LET) track structure depositing clustered, complex DNA lesions',
      'Persistent microvascular endothelial senescence generating a chronic pro-inflammatory secretory phenotype (SASP)',
      'Neuroinflammatory microglial activation impairing dendritic arborization and synaptic plasticity in the hippocampus and prefrontal cortex'
    ],
    keyFindings: [
      'Measurements from the MSL Curiosity RAD instrument during interplanetary cruise demonstrated an unshielded GCR dose equivalent rate of 1.84 ± 0.30 mSv/day.',
      'A nominal 1000-day round-trip Mars mission exposes crew to ~1000-1200 mSv, exceeding current NASA 600 mSv career exposure standards.',
      'Passive aluminum shielding cannot stop high-energy GCR; beyond a certain thickness, secondary fragmentation neutrons can increase tissue dose.'
    ],
    scientificLimitations: [
      'Terrestrial accelerators (like NSRL at Brookhaven) deliver acute, pulsed ion beams rather than the continuous, ultra-low dose-rate flux of deep space.',
      'Epidemiological cancer risk models extrapolate from Japanese atomic bomb survivors exposed to low-LET gamma rays, introducing quality factor uncertainty of 200-300%.'
    ],
    primaryEvidenceIds: ['EV-RAD-001', 'EV-RAD-002', 'EV-RAD-003', 'EV-RAD-005'],
    sourceCitations: [
      {
        title: 'Measurements of Energetic Particle Radiation in Transit to Mars on the Mars Science Laboratory',
        source: 'Science (2013)',
        url: 'https://www.science.org/doi/10.1126/science.1235989',
        doi: '10.1126/science.1235989'
      },
      {
        title: 'NASA Space Radiation Cancer Risk Model and Permissible Exposure Limits',
        source: 'NASA Technical Reports Server (2022)',
        url: 'https://ntrs.nasa.gov/citations/20220002138'
      }
    ],
    riskCategoryCode: 'RAD'
  },
  {
    id: 'insight-cardio-deconditioning',
    question: 'What causes cardiovascular deconditioning and post-flight orthostatic intolerance?',
    summary: 'The immediate shift of 1.5-2 L of fluid from the legs to the upper torso triggers a compensatory 10-15% reduction in circulating plasma volume, followed by left ventricular mass reduction and blunted baroreceptor responsiveness.',
    scientificDeepDive: 'In Earth\'s 1-G gravity field, gravity exerts hydrostatic pressure, pulling venous blood toward the lower limbs (pressures of ~100 mmHg in feet veins when standing). In weightlessness, this hydrostatic column disappears, shifting fluid cephalad. High-pressure arterial and low-pressure cardiopulmonary volume receptors sense acute hypervolemia, triggering diuresis and fluid transudation into interstitial tissue, contracting circulating blood volume within 24-48 hours. Concurrently, the heart requires less myocardial work to pump blood in the absence of gravitational resistance, resulting in an 8-10% decrease in left ventricular mass over 6 months. Upon return to gravity, reduced circulating volume combined with blunted carotid baroreflex-mediated vasoconstriction causes blood to pool in the lower body, starving the brain of perfusion and causing presyncope or syncope.',
    biologicalMechanism: [
      'Gauer-Henry reflex mediated hypovolemia via suppressed antidiuretic hormone (ADH) and renin-aldosterone',
      'Myocardial unloading causing progressive left ventricular eccentric remodeling and sarcomere thinning',
      'Downregulation of vascular alpha-1 adrenergic sensitivity and reduced peripheral norepinephrine spillover'
    ],
    keyFindings: [
      'Over 60% of long-duration ISS crew experience presyncope during passive stand tests immediately post-flight without fluid loading and compression suits.',
      'Internal jugular vein ultrasound revealed stagnant or retrograde flow in 55% of crew and one in-flight occlusive venous thrombosis requiring anticoagulation.',
      'High-intensity interval cycle ergometry attenuates cardiovascular deconditioning but cannot completely prevent orthostatic intolerance upon re-entry.'
    ],
    scientificLimitations: [
      'Post-flight landing assessments are frequently confounded by neurovestibular motion sickness medications (promethazine), hydration variations, and suit design.',
      'In-flight invasive hemodynamic measurements (e.g. pulmonary capillary wedge pressure) cannot be routinely performed.'
    ],
    primaryEvidenceIds: ['EV-CARDIO-001', 'EV-CARDIO-002', 'EV-CARDIO-003'],
    sourceCitations: [
      {
        title: 'Assessment of Jugular Venous Flow and Thrombosis During Long-Duration Spaceflight',
        source: 'JAMA Network Open (2019)',
        url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2755307',
        doi: '10.1001/jamanetworkopen.2019.15011'
      },
      {
        title: 'Post-flight Orthostatic Intolerance: Incidence, Mechanisms, and Operational Countermeasures',
        source: 'NASA Technical Reports Server (2020)',
        url: 'https://ntrs.nasa.gov/citations/20205001290'
      }
    ],
    riskCategoryCode: 'CARDIO'
  },
  {
    id: 'insight-immune-reactivation',
    question: 'How does spaceflight trigger latent herpesvirus reactivation and immune suppression?',
    summary: 'A convergence of elevated glucocorticoids, altered circadian rhythms, microgravity cytoskeleton disruption, and cosmic radiation blunts T-cell and NK-cell surveillance, allowing dormant viruses (EBV, CMV, VZV) to shed.',
    scientificDeepDive: 'Over 95% of human adults harbor dormant herpesviruses (such as Epstein-Barr virus, Cytomegalovirus, and Varicella-Zoster virus) integrated into sensory ganglia or memory B-lymphocytes, kept strictly suppressed by cytotoxic CD8+ T-cells and NK-cells. Spaceflight imposes multi-system biological stress: salivary cortisol and catecholamines are chronically elevated, which directly activates viral promoters via glucocorticoid-response elements. Simultaneously, cellular experiments show that microgravity inhibits early T-cell receptor (TCR) signal transduction, suppressing protein kinase C (PKC) translocation to the plasma membrane and arresting IL-2 and IFN-gamma transcription. With surveillance crippled, viruses replicate and shed asymptomatic viral particles into saliva, blood, and urine.',
    biologicalMechanism: [
      'Glucocorticoid transrepression of cell-mediated antiviral immune surveillance',
      'Direct biophysical disruption of lymphocyte actin cytoskeleton and immunological synapse formation',
      'Shifts in T-helper balance toward Th2 allergic phenotype with suppression of Th1 cell-mediated immunity'
    ],
    keyFindings: [
      'Viral DNA is shed in saliva or urine in > 60% of ISS astronauts compared to < 2% in healthy terrestrial controls.',
      'Viral copy numbers increase with cumulative mission duration and correlate with neuroendocrine stress biomarkers.',
      'Clinical infectious manifestations remain rare on ISS due to sterile closed environment, but deep-space exploration risks opportunistic infection.'
    ],
    scientificLimitations: [
      'Most astronauts are healthy, elite physical specimens; generalizability to diverse populations or aging crews requires further study.',
      'Distinguishing the direct microgravity biophysical effect on lymphocytes from psychological and circadian stress requires complex ground analog controls.'
    ],
    primaryEvidenceIds: ['EV-IMMUNE-001', 'EV-IMMUNE-002'],
    sourceCitations: [
      {
        title: 'Latent Herpesvirus Reactivation in Astronauts During Long-Duration Spaceflight',
        source: 'Frontiers in Microbiology (2019)',
        url: 'https://www.frontiersin.org/articles/10.3389/fmicb.2019.00016/full',
        doi: '10.3389/fmicb.2019.00016'
      },
      {
        title: 'Inhibition of T-Cell Activation in Microgravity by Suppression of Early Transduction Signals',
        source: 'npj Microgravity (2016)',
        url: 'https://www.nature.com/articles/npjmgrav20164',
        doi: '10.1038/npjmgrav.2016.4'
      }
    ],
    riskCategoryCode: 'IMMUNE'
  },
  {
    id: 'insight-sleep-circadian',
    question: 'Why is restorative sleep severely compromised during orbital and planetary spaceflight?',
    summary: 'The loss of natural 24-hour solar zeitgebers (16 orbital sunrises/sunsets daily), continuous life-support acoustic hum, lack of contact pressure, and operational shiftwork cause chronic sleep restriction averaging < 6 hours/night.',
    scientificDeepDive: 'Circadian entrainment relies on intrinsically photosensitive retinal ganglion cells (ipRGCs) receiving blue-enriched 480 nm light at dawn, resetting the suprachiasmatic nucleus (SCN) circadian master clock. Aboard the ISS, orbital mechanics produce a sunrise or sunset every 45 minutes outside the window. Inside, ambient acoustic noise from ventilation fans and water recyclers exceeds 55 dBA. Without gravity, astronauts float inside sleeping bags tethered to cabin walls, lacking the tactile cutaneous pressure cues that signal sleep comfort terrestrially. Consequently, sleep architecture is fragmented: restorative Stage N3 slow-wave sleep and REM sleep are reduced, and astronauts experience micro-awakenings.',
    biologicalMechanism: [
      'Melanopsin retinal signaling desynchronization from 90-minute orbital lighting cycles',
      'Loss of somatosensory mechanoreceptor feedback (absence of gravitational bed contact pressure)',
      'Acoustic arousal thresholds triggered by continuous habitat mechanical noise'
    ],
    keyFindings: [
      'NASA actigraphy studies across 85 astronauts found an average flight sleep duration of only 5.96 hours per night despite 8.5 hours scheduled.',
      'Sleeping medications (primarily zolpidem and zaleplon) were used on 78% of ISS missions and 52% of Space Shuttle nights.',
      'Dynamic Solid-State Light Assemblies (SSLA) with blue-depleted evening spectra significantly improve circadian alignment and sleep onset latency.'
    ],
    scientificLimitations: [
      'Wrist actigraphy overestimates sleep duration during quiet wakefulness; full polysomnography (EEG/EOG/EMG) is technically difficult to perform routinely in flight.',
      'Individual variation in sleep need and chronotype introduces substantial noise into group data.'
    ],
    primaryEvidenceIds: ['EV-SLEEP-001'],
    sourceCitations: [
      {
        title: 'Prevalence of Sleep Deficiency and Hypnotic Use in Astronauts Before, During, and After Spaceflight',
        source: 'The Lancet Neurology (2014)',
        url: 'https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(14)70152-0/fulltext',
        doi: '10.1016/S1474-4422(14)70152-0'
      }
    ],
    riskCategoryCode: 'SLEEP'
  }
];
