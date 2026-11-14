# AstroCare P12 — Route Map Specification

| Route Path | Module Component | Purpose | Telemetry Rendered |
| :--- | :--- | :--- | :--- |
| `/immune` | `ImmuneDashboardPage` | Central P12 executive overview | Mission status, 8 core cards, leukocyte area chart, cytokine baseline comparison bar chart, specimen summary table. |
| `/immune/cells` | `ImmuneCellsPage` | Cytometric & immunophenotyping | Leukocyte differential donut chart, lymphocyte subsets bar chart, functional ex-vivo assay cards, filterable records table. |
| `/immune/biomarkers` | `BiomarkersPage` | Cytokine array & inflammation | Luminex multiplex line chart (pg/mL), segregated hs-CRP & cortisol axes, expandable biomarker details log. |
| `/immune/laboratory` | `SampleManagementPage`| Biospecimen tracking & custody | Multi-sample pipeline, cryogenic condition logs, audit chain-of-custody, specimen registration modal, workflow advance modal. |
| `/immune/results` | `LaboratoryResultsPage`| Diagnostic assay records | Filterable & sortable results table, pagination, CSV export generator, individual result telemetry inspection modal. |
| `/immune/longitudinal`| `LongitudinalAnalysisPage`| Multi-phase trajectory kinetics| Pre-flight baseline comparison matrix, zero-baseline safe percentage calculations, sampling rate verification, longitudinal kinetics table. |
| `/immune/alerts` | `AlertEnginePage` | Rules-based surveillance | Configurable departure alerts, follow-up recommendations, acknowledgment workflow, master adapter JSON preview. |
| `/immune/insights` | `ResearchInsightsPage` | Scientific educational briefing| NASA HRP knowledgebase, 4-tier epistemology framework (findings, mechanisms, hypotheses, clinical caveats). |
| `/immune/research` | `NasaResearchExplorerPage`| OSDR open science catalogue | Curated metadata catalogue for OSD-575, OSD-53, OSD-2, OSD-4, OSD-54, search, bookmarks, official NASA resource links. |
