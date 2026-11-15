# AstroCare — NASA Research & Scientific Grounding Reference Document

**Module:** Prompt 18/21 — Mission Scenarios, Operational Simulation & Mission Readiness Intelligence  
**Author:** AstroCare Aerospace Biomedical Intelligence Platform  
**System Status:** Operational Simulation & Decision Support Model  
**Classification:** Educational and Engineering Demonstration Simulator (Not Certified for Live Flight Operations)

---

## 1. Core Scientific Grounding & Public NASA Documentation

This module incorporates principles, baseline metrics, and risk taxonomies established across publicly accessible NASA research publications, human-system standards, and engineering handbooks.

### 1.1 Human Systems & Vital Sign Thresholds
* **NASA-STD-3001, Volume 1, Revision B (2022)**: *NASA Space Flight Human-System Standard: Crew Health*
  * **Domain:** Biomedical limits, medical care capability, and physiological monitoring.
  * **Public URL:** https://standards.nasa.gov/standard/NASA/NASA-STD-3001-Volume-1
  * **Applied In Module:** Baseline nominal heart rates (50–100 bpm), minimum blood oxygen saturation ($SpO_2 \ge 95\%$ nominal; hypoxia intervention alert at $< 90\%$), respiratory rates (12–20 br/min).
  * **Distinction:**
    * *Established Scientific Background:* Oxygen deprivation directly reduces oxyhemoglobin saturation, triggering compensatory tachycardia and tachypnea.
    * *Simplified Model Assumption:* Lumped-parameter continuous response function connecting ambient cabin $ppO_2$ directly to $SpO_2$ with empirical decay kinetics.
    * *Simulated Output:* Dynamic $SpO_2$ and heart rate curves labeled as computational approximations.
    * *Limitations:* Does not model individual vascular compliance, hemoglobin electrophoresis variations, or altitude sickness preconditioning.

### 1.2 Spacecraft Environmental Control & Life Support Systems (ECLSS)
* **NASA-STD-3001, Volume 2, Revision D (2023)**: *NASA Space Flight Human-System Standard: Human Factors, Habitability, and Environmental Health*
  * **Domain:** Cabin atmospheric composition, pressure limits, carbon dioxide limits, and thermal environment.
  * **Public URL:** https://standards.nasa.gov/standard/NASA/NASA-STD-3001-Volume-2
  * **Applied In Module:**
    * Total cabin pressure: Nominal $101.3\text{ kPa}$; minimum contingency flight limit $70.3\text{ kPa}$.
    * Partial pressure oxygen ($ppO_2$): Nominal $21.3\text{ kPa}$ ($21\%$).
    * Carbon dioxide ($ppCO_2$): Nominal $< 0.4\text{ kPa}$ ($< 3\text{ mmHg}$); alert threshold at $> 0.5\text{ kPa}$; critical symptoms at $> 1.0\text{ kPa}$.
    * Temperature: Nominal $18.0^\circ\text{C} - 27.0^\circ\text{C}$.
  * **Distinction:**
    * *Established Scientific Background:* Elevated carbon dioxide impairs executive function and induces headaches in microgravity due to altered cerebral hemodynamics.
    * *Simplified Model Assumption:* Zero-dimensional compartment volume mass-balance differential equation for $CO_2$ generation and scrubber removal.
    * *Simulated Output:* Environmental telemetry streams depicting cabin gas kinetics under equipment anomalies.
    * *Limitations:* Omits 3D fluid airflow dead zones and localized pockets of exhaled $CO_2$.

### 1.3 Space Radiation Carcinogenesis and Acute Exposure
* **NASA Human Research Roadmap (HRR) — Radiation Carcinogenesis & CNS Risks (2021)**
  * **Domain:** Biological effects of Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE).
  * **Public URL:** https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=99
* **NASA/TP-2020-5009604**: *NASA Space Cancer Risk Model: Assessment of Exploration Mission Scenarios*
  * **Domain:** Effective dose calculations, quality factors ($Q$), and storm shelter ingress rules.
  * **Public URL:** https://ntrs.nasa.gov/citations/20205009604
  * **Applied In Module:**
    * **Quantity Distinction:** Strict separation between **Absorbed Dose** (Gray, $\text{Gy}$, $\text{mGy}$) and **Equivalent/Effective Dose** (Sievert, $\text{Sv}$, $\text{mSv}$, $\mu\text{Sv/h}$).
    * Background GCR dose rate modeled at $\sim 60\ \mu\text{Sv/h}$ effective dose rate.
    * SPE proton storm escalation raising unshielded dose rates to $> 1{,}000 - 2{,}500\ \mu\text{Sv/h}$.
    * Storm shelter mass shielding comparison: nominal habitat ($5\text{ g/cm}^2\ \text{Al eq.}$) vs dedicated storm shelter ($25\text{ g/cm}^2\ \text{Al/water/polyethylene eq.}$) with an $85\%$ attenuation factor ($\times 0.15$).
  * **Distinction:**
    * *Established Scientific Background:* Heavy ions and high-energy protons carry higher Linear Energy Transfer (LET) and biological efficacy than terrestrial gamma rays ($Q \approx 2.0 - 4.5$).
    * *Simplified Model Assumption:* Exponential mass attenuation factor applied uniformly across the proton energy spectrum.
    * *Simulated Output:* Real-time accumulation meters for both absorbed dose ($\text{mGy}$) and effective dose ($\text{mSv}$).
    * *Limitations:* Does not run full 3D Monte Carlo (GEANT4/FLUKA) or deterministic transport (HZETRN) codes in browser.

### 1.4 Fatigue, Sleep Loss & Circadian Desynchronization
* **NASA Human Research Roadmap (HRR) — Sleep Loss & Fatigue (2020)**
  * **Domain:** Cognitive fatigue, work overload, and vigilance degradations.
  * **Public URL:** https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=105
  * **Applied In Module:**
    * Two-process model surrogate correlating extended continuous duty cycles ($> 16-20\text{ h}$) with fatigue index growth and readiness degradation.
    * Sleep debt accumulation causing simulated reaction time increase and task failure probabilities.
  * **Distinction:**
    * *Established Scientific Background:* Circadian phase shifts combined with acute sleep deprivation degrade psychomotor vigilance task (PVT) speed and working memory.
    * *Simplified Model Assumption:* Linear-decay recovery and workload-coupled accumulation indices.
    * *Simulated Output:* Composite Astronaut Readiness Percentage ($0-100\%$) categorized into Optimal, Nominal, Degraded, Impaired, and Critical.
    * *Limitations:* Excludes individual pharmacogenomic responses to modafinil, melatonin, or light therapy.

### 1.5 Systems Engineering Risk Matrix & Flight Rules
* **NASA Systems Engineering Handbook, SP-2015-6105 Rev 2 (2016)**
  * **Domain:** 5x5 Likelihood and Consequence operational risk classification.
  * **Public URL:** https://www.nasa.gov/seh/6-3-risk-management
  * **Applied In Module:**
    * Standard 5x5 risk evaluation matrix evaluating Likelihood ($1-5$) $\times$ Consequence ($1-5$) to produce normalized severity scores ($1-25$).
    * Persistent critical alert banners that remain highlighted regardless of nominal subsystem performance elsewhere.
  * **Distinction:**
    * *Established Scientific Background:* Standard risk governance methodology utilized by Flight Control Teams (FCT) and Mission Operations Directorate.
    * *Simplified Model Assumption:* Rule-based automated threshold evaluation rather than formal Mission Control consensus voting.
    * *Simulated Output:* Explainable risk cards providing observed conditions, triggering scenario events, rationale, and recommended procedural actions.

---

## 2. Model Assumptions and Explicit Disclaimers

1. **Simulated Model Notice:** All operational data, vital signs, environmental kinetics, and radiation doses generated by AstroCare Module 18 are educational and illustrative approximations.
2. **No NASA Clinical Endorsement:** Neither NASA, ESA, JAXA, nor any medical regulatory authority has validated this application for clinical or tactical flight operations.
3. **Deterministic Reproducibility:** The simulation engine utilizes a deterministic pseudo-random number generator (Mulberry32) with fixed seeds to guarantee reproducible trajectories across runs.
4. **Transparent Units:** All units conform to international aerospace standards:
   * Atmospheric Pressure: Kilopascals ($\text{kPa}$)
   * Partial Pressures: Kilopascals ($\text{kPa}$)
   * Temperature: Degrees Celsius ($^\circ\text{C}$)
   * Radiation Absorbed Dose: Milligray ($\text{mGy}$)
   * Radiation Effective Dose: Millisievert ($\text{mSv}$) and Dose Rate ($\mu\text{Sv/h}$)
   * Metabolic Consumables: Kilograms ($\text{kg}$), Liters ($\text{L}$), Kilowatt-hours ($\text{kWh}$).
