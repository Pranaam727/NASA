// ============================================================================
// AstroCare Final Release Checklist Dataset
// Tracks completion, blockers, priority, and verification for deployment readiness
// ============================================================================

import { ReleaseChecklistItem } from '../types';

export const RELEASE_CHECKLIST_DATA: ReleaseChecklistItem[] = [
  {
    id: 'chk-01',
    category: 'Application Functionality',
    title: 'Mission Overview Cockpit & Real-time Downlink',
    description: 'Verify Expedition 72 telemetry dashboard renders without layout shifts and updates live at 1 Hz.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: 'Verified in P20 MissionOverviewView and VitalMonitoringView.',
    lastUpdated: '2026-11-14T16:48:00Z'
  },
  {
    id: 'chk-02',
    category: 'Module Integration',
    title: 'P13 AI Intelligence Assistant Integration',
    description: 'Verify P13 conversational chat, health interpretation, and safety banners are connected and functional.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: 'P13 verified with GeminiBackendProvider and MockAIProvider fallback.',
    lastUpdated: '2026-11-14T15:55:00Z'
  },
  {
    id: 'chk-03',
    category: 'Module Integration',
    title: 'External Clinical Modules Route Placeholders (P05-P17)',
    description: 'Verify all non-embedded modules present documented route contracts and integration guides instead of broken links.',
    priority: 'high',
    completed: true,
    isBlocker: false,
    notes: 'Verified in P20 PlaceholderModuleView across all 18 routes.',
    lastUpdated: '2026-11-14T16:47:00Z'
  },
  {
    id: 'chk-04',
    category: 'NASA Data Provenance',
    title: 'Authentic NASA Research Repository Citations',
    description: 'Verify official NASA resources (HRP, OSDR, LSDA/NLSP, TaskBook) are properly attributed with zero fabricated citations.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: '7 authentic NASA resources integrated with DOIs, access tiers, and BibTeX export.',
    lastUpdated: '2026-11-14T16:47:00Z'
  },
  {
    id: 'chk-05',
    category: 'NASA Data Provenance',
    title: 'Organism & Population Context Distinction',
    description: 'Ensure human astronaut findings are clearly differentiated from ground analog, animal, and cell/tissue-chip studies.',
    priority: 'high',
    completed: true,
    isBlocker: false,
    notes: 'Enforced via OrganismContext badge metadata on all scientific cards.',
    lastUpdated: '2026-11-14T16:45:00Z'
  },
  {
    id: 'chk-06',
    category: 'AI Integration',
    title: 'Gemini API Graceful Fallback & Mock Mode',
    description: 'Ensure the application functions fully with synthetic biomedical intelligence when GEMINI_API_KEY is not configured.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: 'MockAIProvider switches seamlessly without crashing UI or throwing unhandled errors.',
    lastUpdated: '2026-11-14T15:52:00Z'
  },
  {
    id: 'chk-07',
    category: 'Database & Backend',
    title: 'Backend Proxy Quarantine for API Keys',
    description: 'Ensure API keys are never bundled in frontend JavaScript client code.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: 'Verified: zero client-side exposed secrets in Vite bundle.',
    lastUpdated: '2026-11-14T17:00:00Z'
  },
  {
    id: 'chk-08',
    category: 'Security',
    title: 'Non-Diagnostic Aerospace Medical Disclaimers',
    description: 'Confirm that all clinical insights and AI outputs explicitly state they are informational and not medical diagnoses.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: 'Permanent safety banner present across AI and clinical views.',
    lastUpdated: '2026-11-14T17:00:00Z'
  },
  {
    id: 'chk-09',
    category: 'Testing & QA',
    title: 'Automated Vitest Test Suite Execution',
    description: 'Run automated test suite and confirm all unit and integration tests pass.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: '14/14 tests passing in P20 test suite; zero regressions.',
    lastUpdated: '2026-11-14T16:47:32Z'
  },
  {
    id: 'chk-10',
    category: 'Testing & QA',
    title: 'Strict TypeScript Compilation & Production Build',
    description: 'Verify `tsc -b` and `vite build` complete with zero errors and optimal asset chunk sizes.',
    priority: 'critical',
    completed: true,
    isBlocker: false,
    notes: 'Clean build verified: 121 kB gzip JS, 5.6 kB gzip CSS.',
    lastUpdated: '2026-11-14T16:48:15Z'
  },
  {
    id: 'chk-11',
    category: 'Deployment Configuration',
    title: 'Production Hosting Manifests (Vercel, Docker, Netlify, NGINX)',
    description: 'Provide ready-to-deploy configuration manifests and SPA routing rewrite rules.',
    priority: 'high',
    completed: true,
    isBlocker: false,
    notes: 'Config files created for Vercel, Netlify, Docker, Node.js, and static NGINX.',
    lastUpdated: '2026-11-14T17:50:00Z'
  },
  {
    id: 'chk-12',
    category: 'Demo Readiness',
    title: 'Hackathon Presentation Scenarios Preloaded',
    description: 'Ensure 3 distinct demonstration scenarios (Nominal, Post-EVA Anomaly, SANS Decision-Support) are selectable in 1 click.',
    priority: 'high',
    completed: true,
    isBlocker: false,
    notes: 'Interactive scenario switcher with synthetic data disclaimer banner active.',
    lastUpdated: '2026-11-14T17:50:00Z'
  },
  {
    id: 'chk-13',
    category: 'Documentation',
    title: 'Integration Guide & API Route Contracts',
    description: 'Provide P21_INTEGRATION_GUIDE.md with step-by-step copy instructions, dependency lists, and registry hooks.',
    priority: 'high',
    completed: true,
    isBlocker: false,
    notes: 'Documented comprehensively in P21_INTEGRATION_GUIDE.md.',
    lastUpdated: '2026-11-14T17:50:00Z'
  }
];
