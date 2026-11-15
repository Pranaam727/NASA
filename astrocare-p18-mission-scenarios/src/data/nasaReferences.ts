/**
 * NASA RESEARCH & SCIENTIFIC GROUNDING
 * AstroCare Module 18: Mission Scenarios & Operational Simulation
 * 
 * Formal references to public NASA research, engineering standards,
 * and biomedical publications.
 */

export interface NasaReferenceItem {
  id: string;
  code: string;
  title: string;
  domain: 'Human Health & Physiology' | 'Space Radiation' | 'ECLSS & Environment' | 'Risk & Operations' | 'Cognitive & Behavioral';
  source: string;
  url: string;
  publicationYear: number;
  scientificContext: string;
  modelImplementationNote: string;
  limitations: string;
}

export const NASA_REFERENCES: NasaReferenceItem[] = [
  {
    id: 'nasa-std-3001-v1',
    code: 'NASA-STD-3001 Vol 1 Rev B',
    title: 'NASA Space Flight Human-System Standard: Crew Health',
    domain: 'Human Health & Physiology',
    source: 'NASA Technical Standards Program',
    url: 'https://standards.nasa.gov/standard/NASA/NASA-STD-3001-Volume-1',
    publicationYear: 2022,
    scientificContext: 'Defines baseline health care requirements, physiological thresholds, and clinical capabilities for crewed exploration missions.',
    modelImplementationNote: 'Used to establish nominal and critical vital sign boundaries (Heart Rate 50-100 bpm baseline, SpO2 > 95% nominal, < 90% hypoxia alert).',
    limitations: 'AstroCare implements a simplified compartment physiological surrogate model, not an FDA-approved clinical diagnostic algorithm.'
  },
  {
    id: 'nasa-std-3001-v2',
    code: 'NASA-STD-3001 Vol 2 Rev D',
    title: 'NASA Space Flight Human-System Standard: Human Factors, Habitability, and Environmental Health',
    domain: 'ECLSS & Environment',
    source: 'NASA Technical Standards Program',
    url: 'https://standards.nasa.gov/standard/NASA/NASA-STD-3001-Volume-2',
    publicationYear: 2023,
    scientificContext: 'Specifies acceptable cabin atmospheric pressure (nominally 101.3 kPa, minimal 70.3 kPa contingency), ppO2 (19.5-23.1 kPa), ppCO2 (< 0.4 kPa / 3 mmHg), and cabin temperature (18-27°C).',
    modelImplementationNote: 'Environmental bounds in SimulationEngine directly reflect Table 6.1-1 and Table 6.2-1 nominal and contingency limits.',
    limitations: 'Calculations utilize lumped-parameter atmospheric mass balances rather than full Computational Fluid Dynamics (CFD).'
  },
  {
    id: 'hrp-roadmap-radiation',
    code: 'NASA HRP Radiation Risk',
    title: 'Risk of Radiation Carcinogenesis, CNS Effects, and Acute Radiation Syndromes from Space Radiation',
    domain: 'Space Radiation',
    source: 'NASA Human Research Roadmap (HRR)',
    url: 'https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=99',
    publicationYear: 2021,
    scientificContext: 'Characterizes Galactic Cosmic Rays (GCR) background (~1.2-1.8 mSv/day) versus Solar Particle Events (SPE) where proton fluxes > 10 MeV can exceed lethal absorbed doses without shielding.',
    modelImplementationNote: 'Distinguishes rigorously between absorbed dose (mGy) and effective dose (mSv) incorporating average proton quality factor Q ≈ 2.0 - 3.5 during SPEs and Q ≈ 3.5 - 4.5 for GCR.',
    limitations: 'Simplified 1D slab shielding attenuation model (5 g/cm² to 25 g/cm² aluminum equivalent) replaces complex 3D ray-tracing and Monte Carlo HZETRN transport.'
  },
  {
    id: 'hrp-sleep-circadian',
    code: 'NASA HRP Sleep & Fatigue',
    title: 'Risk of Performance Decrements and Adverse Health Outcomes Resulting from Sleep Loss, Circadian De-synchronization, and Work Overload',
    domain: 'Cognitive & Behavioral',
    source: 'NASA Human Research Roadmap',
    url: 'https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=105',
    publicationYear: 2020,
    scientificContext: 'Quantifies cumulative cognitive and psychomotor vigilance degradation following acute sleep deprivation and circadian phase misalignment during critical mission timelines.',
    modelImplementationNote: 'Couples sleep debt and workload indices with simulated reaction time and readiness score degradation using a two-process sleep regulation surrogate.',
    limitations: 'Educational behavioral heuristic. Individual astronaut resilience, genetic variations, and pharmacological countermeasures are represented by parameterized coefficients.'
  },
  {
    id: 'nasa-tp-2020-5009604',
    code: 'NASA/TP-2020-5009604',
    title: 'NASA Space Cancer Risk Model: Assessment of Exploration Mission Scenarios',
    domain: 'Space Radiation',
    source: 'NASA Technical Reports Server',
    url: 'https://ntrs.nasa.gov/citations/20205009604',
    publicationYear: 2020,
    scientificContext: 'Detailed probabilistic analysis of space radiation health impacts, standardizing career exposure limits and short-term operational action levels for SPE shelter ingress.',
    modelImplementationNote: 'Storm shelter protocol triggers in the engine when ambient effective dose rate surpasses 1,000 µSv/h (1 mSv/h).',
    limitations: 'Calculations represent prompt operational exposure rate heuristics rather than lifetime excess risk of cancer mortality (%RECPC).'
  },
  {
    id: 'nasa-sp-2015-6105',
    code: 'NASA Systems Engineering SP-2015-6105',
    title: 'NASA Systems Engineering Handbook, Rev 2',
    domain: 'Risk & Operations',
    source: 'NASA Technical Reports Server',
    url: 'https://www.nasa.gov/seh/6-3-risk-management',
    publicationYear: 2016,
    scientificContext: 'Formal 5x5 Likelihood and Consequence operational risk classification framework used across flight operations, anomaly response boards, and mission flight rules.',
    modelImplementationNote: 'The AstroCare Risk Assessment Engine formats all risk categories (1-5 Likelihood, 1-5 Consequence) directly mapped to NASA 5x5 risk matrix scoring.',
    limitations: 'Risk severity scores are deterministically computed based on telemetry threshold rules and do not replace formal flight control team consensus decisions.'
  }
];

export const SCIENTIFIC_MODEL_DISCLAIMERS = [
  'SIMULATION MODEL NOTICE: All outputs generated by this module are educational, illustrative, and computational approximations.',
  'NO NASA CLINICAL ENDORSEMENT: The algorithms herein are derived from open public literature and are not certified by NASA, ESA, or medical authorities for live human spaceflight medical operations.',
  'PHYSICS ASSUMPTIONS: Atmospheric gas kinetics assume ideal gas law and homogenous mixing. Radiation shielding uses simplified mass-attenuation exponentials.',
  'PHYSIOLOGY ASSUMPTIONS: Human vital signs respond dynamically to environmental hypoxia, hypercapnia, thermal strain, and work fatigue via simplified continuous differential transfer functions.'
];
