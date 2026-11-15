# AstroCare P11 — Biomedical & Telemetry Data Dictionary

| Metric / Field | Type | Scale / Range | Units | Provenance | Description |
|---|---|---|---|---|---|
| `totalSleepDurationMinutes` | Integer | 0 – 720 | Minutes | ACTIGRAPH / SIMULATED | Measured total sleep episode |
| `sleepEfficiencyPercent` | Number | 0 – 100 | % | CALCULATED | Ratio of sleep duration to total time in bed |
| `sleepLatencyMinutes` | Integer | 0 – 120 | Minutes | SELF_REPORT / ACTIGRAPH | Duration from lights out to sleep onset |
| `awakeningsCount` | Integer | 0 – 20 | Count | ACTIGRAPH / SIMULATED | Disruptions during sleep episode |
| `scheduleDeviation` | Integer | -360 – +360 | Minutes | CALCULATED | Difference between scheduled and actual sleep onset |
| `moodScore` | Integer | 1 – 10 | Rating | SELF_REPORT | Subjective emotional state (10 = optimal) |
| `stressScore` | Integer | 1 – 10 | Rating | SELF_REPORT | Subjective stress level (Inverted: 1 = minimal, 10 = extreme) |
| `energyScore` | Integer | 1 – 10 | Rating | SELF_REPORT | Vitality / energy level (1 = exhausted, 10 = energized) |
| `wellbeingScore` | Integer | 1 – 10 | Rating | SELF_REPORT | Overall holistic well-being rating (10 = optimal) |
| `privateNotes` | String | UTF-8 | Text | USER_ENTERED | Confidential session reflection notes |
| `alignmentScore` | Number | 0 – 100 | Score | CALCULATED | Derived circadian schedule alignment index |
| `reactionTimeMs` | Number | 100 – 1500 | Milliseconds | USER_TEST | Psychomotor vigilance reaction response latency |
| `accuracyPercent` | Number | 0 – 100 | % | USER_TEST | Cognitive task accuracy percentage |
| `cohesionScore` | Number | 0 – 100 | % | SIMULATED | Collective crew cohesion indicator |
| `communicationScore`| Number | 0 – 100 | % | SIMULATED | Crew communication efficiency index |
| `collaborationScore` | Number | 0 – 100 | % | SIMULATED | Cross-operational crew coordination score |
| `conflictIndicator` | Number | 0 – 100 | Points | CALCULATED | Micro-indicator of communication tension |
| `isolationDurationDays`| Integer| 0 – 1000 | Days | SIMULATED | Cumulative elapsed mission confinement days |
| `crewInteractionFreq` | Integer | 0 – 50 | Sessions/Day | SIMULATED | Logged collective debriefs / syncs |
