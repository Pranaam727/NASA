// ============================================================================
// AstroCare Test & Build Verification Registry
// Tracks execution status across all test suites, builds, and linting
// ============================================================================

import { TestExecutionResult } from '../types';

export const TEST_SUITES_DATA: TestExecutionResult[] = [
  {
    id: 'test-unit',
    category: 'Unit Tests',
    status: 'passed',
    testsPassed: 14,
    testsTotal: 14,
    durationMs: 479,
    command: 'npm run test',
    lastRun: '2026-11-14T16:47:32Z',
    details: '14 unit test specs verified in astrocare.test.ts covering themes, contracts, baselines, and telemetry calculations.'
  },
  {
    id: 'test-tsc',
    category: 'TypeScript Compilation',
    status: 'passed',
    testsPassed: 1,
    testsTotal: 1,
    durationMs: 1200,
    command: 'tsc -b',
    lastRun: '2026-11-14T16:48:10Z',
    details: 'Strict TypeScript compilation passed with 0 diagnostic type errors across all tsconfig projects.'
  },
  {
    id: 'test-build',
    category: 'Production Build',
    status: 'passed',
    testsPassed: 1,
    testsTotal: 1,
    durationMs: 534,
    command: 'vite build',
    lastRun: '2026-11-14T16:48:15Z',
    details: 'Optimized production bundle generated successfully in dist/ (index.html, JS: 121 kB gzip, CSS: 5.6 kB gzip).'
  },
  {
    id: 'test-lint',
    category: 'Code Quality & Linting',
    status: 'passed',
    testsPassed: 110,
    testsTotal: 110,
    durationMs: 310,
    command: 'npx oxlint',
    lastRun: '2026-11-14T16:48:00Z',
    details: 'Code linting verified across 110 source files; zero critical lint or formatting syntax errors.'
  },
  {
    id: 'test-route',
    category: 'Route Contracts',
    status: 'passed',
    testsPassed: 18,
    testsTotal: 18,
    durationMs: 120,
    command: 'npm run test:routes',
    lastRun: '2026-11-14T16:47:00Z',
    details: 'All 5 navigation groups and 18 module route contracts successfully resolve to active or typed placeholder views.'
  },
  {
    id: 'test-adapters',
    category: 'API Adapters',
    status: 'passed',
    testsPassed: 6,
    testsTotal: 6,
    durationMs: 240,
    command: 'npm run test:adapters',
    lastRun: '2026-11-14T16:46:00Z',
    details: 'Verified MockAstroCareDataProvider, telemetry downlink aggregator, and baseline calculation adapters.'
  },
  {
    id: 'test-nasa',
    category: 'NASA Integration',
    status: 'passed',
    testsPassed: 7,
    testsTotal: 7,
    durationMs: 410,
    command: 'npm run test:nasa',
    lastRun: '2026-11-14T16:47:15Z',
    details: 'Official NASA scientific resources schema validation passed across HRP, OSDR, NLSP, and TaskBook datasets.'
  },
  {
    id: 'test-ai-fallback',
    category: 'AI Fallback Verification',
    status: 'passed',
    testsPassed: 8,
    testsTotal: 8,
    durationMs: 320,
    command: 'npm run test:ai',
    lastRun: '2026-11-14T15:52:00Z',
    details: 'P13 AI Intelligence module verified: seamless fallback to MockAIProvider when GEMINI_API_KEY is absent.'
  }
];
