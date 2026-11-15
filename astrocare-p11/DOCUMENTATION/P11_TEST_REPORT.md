# AstroCare P11 — Test Verification Report

**Execution Date:** 2026-11-14  
**Runner:** Vitest v3.2.7 (Node v24.19.0, JSDOM v26.1.0)  
**Total Test Suites:** 4 passed (100%)  
**Total Tests:** 45 passed, 0 failed  
**Execution Duration:** 15.79s  

---

## 1. Test Suite Results

### 1.1 `src/test/analyticsService.test.ts` (30/30 passed)
- `computeSleepAnalytics > returns zero values for empty records` (passed)
- `computeSleepAnalytics > computes correct average duration for single record` (passed)
- `computeSleepAnalytics > computes correct average duration for multiple records` (passed)
- `computeSleepAnalytics > computes sleep deficit correctly` (passed)
- `computeSleepAnalytics > accumulates sleep deficit across multiple records` (passed)
- `computeSleepAnalytics > does not count excess sleep as negative deficit` (passed)
- `computeSleepAnalytics > computes correct average efficiency` (passed)
- `computeSleepAnalytics > computes consistency score within 0-100 range` (passed)
- `computeSleepAnalytics > assigns correct astronautId` (passed)
- `estimateCircadianAlignment > returns 100 for zero deviation` (passed)
- `estimateCircadianAlignment > returns lower scores for greater deviation` (passed)
- `estimateCircadianAlignment > never returns negative score` (passed)
- `estimateCircadianAlignment > never returns score above 100` (passed)
- `estimateCircadianAlignment > treats negative deviation same as positive` (passed)
- `estimateCircadianAlignment > returns exactly 0 for 150-minute deviation` (passed)
- `computeFatigueComposite > returns low composite for minimal fatigue inputs` (passed)
- `computeFatigueComposite > returns high composite for maximum fatigue inputs` (passed)
- `computeFatigueComposite > returns value between 0 and 100` (passed)
- `computeFatigueComposite > low alertness increases composite (inverted scale)` (passed)
- `reactionTimeToScore > returns 100 for reaction time <= 200ms` (passed)
- `reactionTimeToScore > returns 0 for reaction time >= 600ms` (passed)
- `reactionTimeToScore > returns intermediate score for 400ms` (passed)
- `reactionTimeToScore > score decreases as reaction time increases` (passed)
- `computeWellnessAnalytics > returns INSUFFICIENT_DATA when no records` (passed)
- `computeWellnessAnalytics > returns NORMAL status for good indicators` (passed)
- `computeWellnessAnalytics > computes overall score between 0 and 100` (passed)
- `computeWellnessAnalytics > assigns CALCULATED dataOrigin` (passed)
- `sleepToChartPoints > converts records to chart points with correct values` (passed)
- `sleepToChartPoints > returns empty array for empty records` (passed)
- `wellnessToTrendPoints > extracts correct field values` (passed)

### 1.2 `src/test/recommendationEngine.test.ts` (6/6 passed)
- `triggers sleep duration recommendation when sleep is under 7 hours` (passed)
- `triggers stress recommendation when stress is 7 or higher` (passed)
- `triggers fatigue recommendation when fatigue is 7 or higher` (passed)
- `triggers team recommendation when cohesion is below 65` (passed)
- `triggers circadian drift recommendation when alignment is below 55` (passed)
- `returns empty array when all indicators are nominal` (passed)

### 1.3 `src/test/nasaResearchService.test.ts` (4/4 passed)
- `retrieves verified official NASA research entries` (passed)
- `filters entries by category correctly` (passed)
- `filters entries by keyword query` (passed)
- `preserves valid official NASA URLs` (passed)

### 1.4 `src/test/localDemoProvider.test.ts` (5/5 passed)
- `loads seed sleep records for demo astronaut` (passed)
- `loads seed wellness records for demo astronaut` (passed)
- `saves new sleep record and retrieves it` (passed)
- `saves new wellness record and retrieves it` (passed)
- `resets demo data cleanly back to seed` (passed)

---

## 2. Production Build Verification
- Command: `npm run build` (`tsc -b && vite build`)
- Output: `dist/index.html` (0.46 kB), `dist/assets/*.css` (30.35 kB), `dist/assets/*.js` (907.63 kB)
- Result: Clean exit code 0.
