# ASTROCARE — PROMPT 12

IMMUNE SYSTEM MONITORING, BIOMARKER ANALYTICS & LABORATORY INTELLIGENCE

1. ROLE AND MISSION

Act as a Senior Full-Stack Engineer, Biomedical Data Scientist, Aerospace Biomedical Research Engineer, Laboratory Informatics Specialist and NASA Research Integration Engineer.

You are responsible for independently implementing P12 of AstroCare.

AstroCare is a larger aerospace biomedical intelligence platform being developed by multiple team members simultaneously.

You may not have access to the previous development conversations or source code for P01–P11.

Therefore, this prompt contains the complete requirements for your assignment.

Your task is to create a complete, functional, visually polished and independently runnable module that can later be integrated into the existing master AstroCare application.

IMPORTANT:

You are developing one module of a larger application, not creating an entirely separate competing AstroCare product.

You must:

- Build P12 independently.
- Follow a modular architecture.
- Use consistent naming and TypeScript contracts.
- Create reusable components and services.
- Integrate genuine NASA research resources.
- Provide deterministic demonstration data.
- Avoid dependencies on unfinished P10, P11 or P13 modules.
- Produce a detailed integration handoff.
- Produce and verify complete ZIP backups.

Do not stop at planning, wireframes or placeholder components.

Implement the actual application.

---

2. MODULE IDENTITY AND SCOPE

Module name:

ASTROCARE — IMMUNE SYSTEM & LABORATORY INTELLIGENCE

Module identifier:

P12

Primary objective:

Monitor, organize, visualize and analyze immune-related laboratory measurements and biological indicators relevant to astronaut health during spaceflight.

Spaceflight introduces multiple stressors that may influence immune function, including:

- Microgravity.
- Radiation.
- Physiological stress.
- Circadian disruption.
- Sleep changes.
- Nutrition changes.
- Isolation and confinement.
- Mission duration.

NASA research has documented changes in immune-cell distributions and functions, cytokine profiles, inflammatory responses and latent-virus reactivation in some astronauts.

The module should demonstrate how longitudinal biological measurements can help researchers monitor these changes.

Scope boundaries

P12 owns:

1. Immune health dashboard.
2. Immune-cell analytics.
3. Cytokine analytics.
4. Inflammatory biomarker monitoring.
5. Blood sample records.
6. Saliva sample records.
7. Urine sample records.
8. Laboratory sample tracking.
9. Longitudinal comparisons.
10. Immune monitoring alerts.
11. NASA immune research explorer.
12. OSDR dataset discovery and metadata integration.

Do not independently recreate:

- Space radiation monitoring from P10.
- Sleep and mental wellness analytics from P11.
- The complete AstroCare application shell.
- The master mission management system.
- The master global navigation.
- The master AI assistant.

Instead, provide integration interfaces for these systems.

---

3. DEVELOPMENT ENVIRONMENT

Preferred technology stack:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Recharts.
- Lucide React.
- React Router.

Use the existing project configuration if a starter repository is supplied.

If no starter repository is supplied, create a standalone React + TypeScript + Vite project.

Use maintainable and reusable architecture.

Suggested folder structure:

src/
components/
layout/
dashboard/
immune/
biomarkers/
laboratory/
samples/
charts/
research/
shared/

features/
immune-monitoring/
immune-cells/
cytokine-analysis/
inflammatory-markers/
laboratory-management/
sample-management/
longitudinal-analysis/
nasa-research/

services/
immune/
laboratory/
nasa/
alerts/

hooks/
types/
constants/
data/
utils/
routes/

App.tsx
main.tsx

integration/
adapters/
contracts/

documentation/
tests/
backups/

You may improve this structure when technically justified.

Keep the business logic independent of the UI.

Do not put every feature into a single component.

---

4. MODULE A — IMMUNE HEALTH DASHBOARD

Create the primary dashboard:

/immune

This must be the central entry point of P12.

Mission context

Display:

- Astronaut identifier.
- Mission identifier.
- Mission duration.
- Mission phase.
- Latest sample collection date.
- Latest laboratory result date.
- Monitoring status.
- Data-source status.

Use synthetic demonstration records.

Do not use real astronaut medical information.

Immune health indicators

Display the available measurements:

- Total leukocyte count.
- Absolute lymphocyte count.
- Neutrophil count.
- Monocyte count.
- Eosinophil count.
- Basophil count.
- CD4 T-cell count.
- CD8 T-cell count.
- CD4/CD8 ratio.
- Natural killer cell measurements.
- B-cell measurements.

Only display measurements actually supported by the available data.

Do not fabricate unavailable measurements.

Dashboard cards

Create:

1. Latest immune-cell profile.
2. Latest cytokine profile.
3. Inflammatory biomarker summary.
4. Sample collection status.
5. Changes from baseline.
6. Historical immune trends.
7. Recent monitoring alerts.
8. NASA research insights.

Each card should have a clear title, value, unit, timestamp and data provenance.

Monitoring states

Use:

- NORMAL.
- MONITOR.
- WARNING.
- CRITICAL.
- INSUFFICIENT DATA.

Thresholds must be configurable.

Where reference ranges are shown, document their source and context.

Do not invent universal astronaut-specific reference ranges.

Make clear that a result outside a selected reference range does not automatically establish disease.

---

5. MODULE B — IMMUNE CELL ANALYTICS

Create a dedicated immune-cell analysis page:

/immune/cells

Support the following categories:

Leukocyte profile

- White blood cell count.
- Absolute lymphocyte count.
- Absolute neutrophil count.
- Monocyte count.
- Eosinophil count.
- Basophil count.

Lymphocyte subsets

Where supported by available records:

- CD3 T cells.
- CD4 T cells.
- CD8 T cells.
- B cells.
- Natural killer cells.

Functional immune measurements

Where supported:

- T-cell functional response.
- NK-cell functional response.
- Monocyte activity.
- Stimulated cytokine production.
- Virus-specific immune response.

Do not confuse cell counts with functional activity.

For example, an NK-cell count does not independently establish NK-cell function.

Visualizations

Create:

- Immune-cell distribution chart.
- Lymphocyte subset comparison.
- Cell-count trend charts.
- Baseline versus latest comparison.
- Pre-flight, in-flight and post-flight comparison.
- Mission timeline.

Support date filters and metric selection.

Every chart must use actual available records or explicitly labelled synthetic demonstration data.

---

6. MODULE C — CYTOKINE AND INFLAMMATORY BIOMARKER ANALYTICS

Create:

/immune/biomarkers

Track available biomarker categories.

Cytokines

Examples include:

- IL-6.
- IL-1β.
- IL-10.
- TNF-α.
- IFN-γ.
- Other supported cytokines.

Inflammatory indicators

Where supported:

- C-reactive protein.
- Other documented inflammatory markers.
- Relevant immunoregulatory proteins.

Stress-related biomarkers

Where relevant and supported:

- Cortisol.
- Other stress-related hormonal measurements.

Do not assume that all markers are measured in every sample.

Do not generate invented biological values and attribute them to NASA.

Features

Implement:

- Individual biomarker detail pages or expandable panels.
- Latest measurement.
- Historical trend.
- Baseline comparison.
- Measurement unit.
- Sample type.
- Collection timestamp.
- Laboratory method.
- Reference interval, where available.
- Source and provenance.

Charts

Include:

- Cytokine trend chart.
- Inflammatory biomarker trend.
- Multi-marker comparison.
- Pre-flight versus in-flight versus post-flight.
- Baseline deviation.

Allow selecting individual markers.

Avoid combining biomarkers with incompatible units on a single numerical axis.

---

7. MODULE D — LABORATORY SAMPLE MANAGEMENT

Create:

/immune/laboratory

Build a functional sample management interface.

Sample types

Support:

- Blood.
- Plasma.
- Serum.
- Saliva.
- Urine.

Do not assume all sample types can be used for every assay.

Sample records

Each sample should include:

- Sample ID.
- Astronaut ID.
- Mission ID.
- Sample type.
- Collection date and time.
- Mission phase.
- Collection status.
- Processing status.
- Storage status.
- Laboratory destination.
- Associated assays.
- Data source.

Sample workflow

Support:

1. Scheduled.
2. Collected.
3. In transit.
4. Received.
5. Processing.
6. Analysis completed.
7. Archived.
8. Cancelled.

Allow users to:

- Add a sample.
- Edit a demonstration sample.
- View sample details.
- Filter by sample type.
- Filter by status.
- Search by sample ID.
- View sample history.

Use validation.

Prevent duplicate sample IDs.

Persist demonstration records.

Clearly identify this as a simulated laboratory workflow, not a real specimen tracking system.

---

8. MODULE E — LABORATORY RESULTS

Create:

/immune/results

Implement a structured laboratory result system.

Each result should contain:

- Result ID.
- Sample ID.
- Astronaut ID.
- Mission ID.
- Analyte.
- Result value.
- Unit.
- Reference interval, if available.
- Assay method.
- Laboratory name or source.
- Collection timestamp.
- Result timestamp.
- Result status.
- Data provenance.

Result interpretation

Support:

- Within selected reference interval.
- Below selected reference interval.
- Above selected reference interval.
- Pending.
- Not available.
- Insufficient data.

Reference ranges must be tied to their source and context.

Never silently apply a terrestrial reference range to all astronaut populations.

Never claim that an abnormal laboratory result independently establishes a clinical diagnosis.

Results table

Implement:

- Search.
- Sorting.
- Filters.
- Pagination.
- Detailed record view.
- Export to CSV.

CSV exports must preserve measurement units and source information.

---

9. MODULE F — LONGITUDINAL IMMUNE MONITORING

Create:

/immune/longitudinal

This is one of the most important features.

Analyze changes in immune measurements across mission phases.

Support:

- Pre-flight.
- In-flight.
- Post-flight.
- Recovery follow-up.

Where actual data do not exist, use clearly labelled synthetic records.

Calculate:

- Baseline value.
- Latest value.
- Absolute change.
- Percentage change, where mathematically meaningful.
- Measurement frequency.
- Missing-data percentage.
- Historical trend.

Provide:

- Baseline comparison charts.
- Time-series charts.
- Mission phase comparison.
- Multi-marker timeline.
- Sample collection timeline.

Handle zero baseline values safely.

Do not calculate percentage change when the baseline is zero or invalid.

Do not interpret a trend as a clinically significant change without an appropriate validated rule.

---

10. MODULE G — IMMUNE MONITORING ALERT ENGINE

Create a reusable rules-based alert engine.

Monitor:

- Configured biomarker thresholds.
- Changes from baseline.
- Missing laboratory results.
- Abnormal sample workflow states.
- Stale measurements.
- Unexpected measurement patterns.

Each alert should contain:

- Alert ID.
- Astronaut ID.
- Mission ID.
- Category.
- Severity.
- Analyte.
- Observed value.
- Reference value or configured threshold.
- Unit.
- Timestamp.
- Source.
- Explanation.
- Recommended follow-up.

Support:

- NORMAL.
- INFORMATIONAL.
- WARNING.
- CRITICAL.

Allow:

- Acknowledging alerts.
- Filtering by severity.
- Filtering by category.
- Viewing historical alerts.

Do not generate medical diagnoses.

Do not automatically recommend medication or treatment.

Use transparent and configurable demonstration rules.

Create an adapter so the master AstroCare alert service can later consume P12 alerts.

---

11. MODULE H — IMMUNE RESEARCH INSIGHTS

Create:

/immune/insights

This section should explain how different spaceflight conditions may relate to immune monitoring.

Include educational research categories:

- Microgravity and immune function.
- Radiation and immune response.
- Cytokine changes.
- T-cell function.
- NK-cell function.
- Inflammation.
- Latent viral reactivation.
- Physiological stress.
- Nutrition and immunity.
- Mission duration.

Use NASA research as the primary scientific basis.

Explain the difference between:

- Observed research findings.
- Possible biological mechanisms.
- Hypotheses.
- Demonstration analytics.
- Clinically established conclusions.

Do not present associations as proof of causation.

Do not claim that one biomarker alone can determine an astronaut's immune health.

---

12. MANDATORY NASA RESOURCE INTEGRATION

NASA integration is mandatory for this hackathon project.

Do not merely add NASA logos or links.

Use real NASA research resources and make them accessible through the application.

NASA RESOURCE 1 — Altered Immune System Responses

Official source:

https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/

NASA RESOURCE 2 — NASA Immunology and Virology Laboratory

Official source:

https://www.nasa.gov/directorates/esdmd/hhp/immunology-and-virology/

NASA RESOURCE 3 — NASA Immune Risk

Official source:

https://www.nasa.gov/directorates/esdmd/hhp/immune-risk/

NASA RESOURCE 4 — NASA Human Research Roadmap

Official source:

https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=85

NASA RESOURCE 5 — NASA Immune Research Gap IM-106

Official source:

https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=818

NASA RESOURCE 6 — NASA Spaceflight Immune Research

Official source:

https://www.nasa.gov/missions/station/scientists-probe-how-long-term-spaceflight-alters-immunity/

NASA RESOURCE 7 — NASA Flow Cytometry Research

NASA Technical Reports Server:

https://ntrs.nasa.gov/citations/20230016983

---

13. NASA OSDR — REAL DATASET INTEGRATION

Candidate datasets:
OSD-575, OSD-53, OSD-2, OSD-4, OSD-54.

---

14. NASA RESEARCH EXPLORER: /immune/research
15. MODULE I — DATA ARCHITECTURE
16. MODULE J — MASTER ASTROCARE INTEGRATION CONTRACT
17. MODULE K — UI/UX DESIGN
18. MODULE L — PERSISTENCE AND DEMONSTRATION DATA
19. TESTING AND QUALITY ASSURANCE
20. INDEPENDENT APPLICATION VERIFICATION
21. DOCUMENTATION
22. ZIP BACKUP SYSTEM — MANDATORY
23. CONTINUITY AND PROJECT DOCUMENTATION
24. FINAL DELIVERY REPORT
