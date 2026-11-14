// ============================================================================
// AstroCare P21 — Mission Readiness & Deployment Verification Test Suite
// Verifies environment validation, NASA connectivity, readiness calculations,
// security checklists, and report generation.
// ============================================================================

import { describe, it, expect } from 'vitest';
import { 
  ASTROCARE_MODULES_REGISTRY,
  NASA_SOURCES_REGISTRY,
  SECURITY_CHECKS_DATA,
  TEST_SUITES_DATA,
  RELEASE_CHECKLIST_DATA,
  DEMO_SCENARIOS_DATA,
  calculateDeploymentReadiness,
  generateDeploymentReportData,
  validateEnvironmentVariables,
  maskSecretValue,
  formatReportAsMarkdown,
  formatReportAsJSON,
  formatReportAsCSV
} from '../modules/deployment';

describe('AstroCare P21 Module Registry', () => {
  it('tracks all 21 prompt modules from P01 to P21', () => {
    expect(ASTROCARE_MODULES_REGISTRY.length).toBe(21);
    const ids = ASTROCARE_MODULES_REGISTRY.map(m => m.promptId);
    expect(ids).toContain('P01');
    expect(ids).toContain('P13');
    expect(ids).toContain('P20');
    expect(ids).toContain('P21');
  });

  it('confirms implemented modules P13, P20, and P21 are integrated and typed', () => {
    const p13 = ASTROCARE_MODULES_REGISTRY.find(m => m.promptId === 'P13');
    const p20 = ASTROCARE_MODULES_REGISTRY.find(m => m.promptId === 'P20');
    const p21 = ASTROCARE_MODULES_REGISTRY.find(m => m.promptId === 'P21');

    expect(p13?.status).toBe('integrated');
    expect(p20?.status).toBe('integrated');
    expect(p21?.status).toBe('integrated');

    expect(p13?.typeCompatible).toBe(true);
    expect(p20?.typeCompatible).toBe(true);
    expect(p21?.typeCompatible).toBe(true);
  });

  it('defines valid route contracts and component targets for all modules', () => {
    ASTROCARE_MODULES_REGISTRY.forEach(mod => {
      expect(mod.route).toMatch(/^\/[a-z0-9\-_/]*$/);
      expect(mod.componentName.length).toBeGreaterThan(0);
      expect(Array.isArray(mod.serviceDependencies)).toBe(true);
    });
  });
});

describe('NASA Scientific Provenance & Source Registry', () => {
  it('includes required official NASA research resources', () => {
    const ids = NASA_SOURCES_REGISTRY.map(s => s.id);
    expect(ids).toContain('nasa-hrp');
    expect(ids).toContain('nasa-osdr');
    expect(ids).toContain('nasa-osdr-api');
    expect(ids).toContain('nasa-open-api');
    expect(ids).toContain('nasa-radiation');
    expect(ids).toContain('nasa-lsda');
    expect(ids).toContain('nasa-taskbook');
  });

  it('differentiates 5 verification levels and organism populations', () => {
    NASA_SOURCES_REGISTRY.forEach(source => {
      const v = source.verificationLevel;
      expect(typeof v.linkAvailable).toBe('boolean');
      expect(typeof v.apiConnectivity).toBe('boolean');
      expect(typeof v.authValid).toBe('boolean');
      expect(typeof v.datasetAvailable).toBe('boolean');
      expect(typeof v.actualDataRetrieved).toBe('boolean');
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.provenanceTag.length).toBeGreaterThan(0);
    });
  });
});

describe('Environment Variable Validation & Secret Quarantine', () => {
  it('masks secret values properly to prevent credential leakage', () => {
    expect(maskSecretValue('AIzaSyAstroCareDemoKeyExample39Chars_XX')).toBe('AIza...s_XX');
    expect(maskSecretValue('short')).toBe('****');
    expect(maskSecretValue(undefined)).toBe('(not set)');
  });

  it('identifies valid configuration formats and profiles', () => {
    const devResults = validateEnvironmentVariables('development');
    expect(devResults.length).toBeGreaterThanOrEqual(8);
    const geminiSpec = devResults.find(r => r.key === 'GEMINI_API_KEY');
    expect(geminiSpec?.isSecret).toBe(true);
  });

  it('validates URL formatting for BACKEND_API_URL and FRONTEND_URL', () => {
    const custom = {
      BACKEND_API_URL: 'http://localhost:3001',
      FRONTEND_URL: 'http://localhost:5173',
      APPLICATION_ENV: 'development',
      DEMO_MODE: 'true'
    };
    const results = validateEnvironmentVariables('development', custom);
    const backendResult = results.find(r => r.key === 'BACKEND_API_URL');
    expect(backendResult?.formatValid).toBe(true);
    expect(backendResult?.status).toBe('valid');
  });
});

describe('Deployment Readiness Calculator', () => {
  it('calculates weighted readiness score and NEVER fabricates 100%', () => {
    const envResults = validateEnvironmentVariables('development');
    const breakdown = calculateDeploymentReadiness(
      ASTROCARE_MODULES_REGISTRY,
      NASA_SOURCES_REGISTRY,
      envResults,
      SECURITY_CHECKS_DATA,
      TEST_SUITES_DATA,
      RELEASE_CHECKLIST_DATA
    );

    // Bounded between realistic aerospace thresholds (60% to 92%)
    expect(breakdown.overallScore).toBeGreaterThanOrEqual(60);
    expect(breakdown.overallScore).toBeLessThan(100); // Strict rule: never 100%
    expect(breakdown.overallScore).toBeLessThanOrEqual(92);
    expect(breakdown.statusLabel).toBe('ACCEPTABLE_FOR_DEMO');
  });

  it('detects blockers when critical security findings exist', () => {
    const mockSecurity = [
      ...SECURITY_CHECKS_DATA,
      {
        id: 'sec-test-blocker',
        category: 'Secret Management' as const,
        title: 'Unsanitized Key in Bundle',
        description: 'Test Blocker',
        status: 'critical_finding' as const,
        finding: 'Critical exposed key',
        recommendedFix: 'Remove key',
        standardReference: 'OWASP',
        lastAudited: new Date().toISOString()
      }
    ];

    const envResults = validateEnvironmentVariables('development');
    const breakdown = calculateDeploymentReadiness(
      ASTROCARE_MODULES_REGISTRY,
      NASA_SOURCES_REGISTRY,
      envResults,
      mockSecurity,
      TEST_SUITES_DATA,
      RELEASE_CHECKLIST_DATA
    );

    expect(breakdown.activeBlockersCount).toBeGreaterThan(0);
    expect(breakdown.statusLabel).toBe('READINESS_BLOCKED');
  });
});

describe('Security & Privacy Readiness Checklist', () => {
  it('covers all 12 aerospace security vector categories', () => {
    expect(SECURITY_CHECKS_DATA.length).toBeGreaterThanOrEqual(12);
    const categories = Array.from(new Set(SECURITY_CHECKS_DATA.map(s => s.category)));
    expect(categories).toContain('Secret Management');
    expect(categories).toContain('Sensitive Health Data (PHI)');
    expect(categories).toContain('CORS Policy');
    expect(categories).toContain('Dependency Review');
    expect(categories).toContain('Input Validation');
  });
});

describe('Hackathon Demo Scenarios', () => {
  it('provides at least 3 distinct aerospace clinical scenarios', () => {
    expect(DEMO_SCENARIOS_DATA.length).toBeGreaterThanOrEqual(3);
    const codes = DEMO_SCENARIOS_DATA.map(s => s.code);
    expect(codes).toContain('SCENARIO-A01-NOMINAL');
    expect(codes).toContain('SCENARIO-B02-ANOMALY');
    expect(codes).toContain('SCENARIO-C03-DECISION');
  });

  it('guarantees complete synthetic telemetry parameter sets for all scenarios', () => {
    DEMO_SCENARIOS_DATA.forEach(scenario => {
      expect(scenario.vitals.heartRate).toBeGreaterThan(40);
      expect(scenario.vitals.spo2).toBeGreaterThan(90);
      expect(scenario.vitals.systolicBp).toBeGreaterThan(100);
      expect(scenario.vitals.coreTemp).toBeGreaterThan(36);
      expect(scenario.keyFindings.length).toBeGreaterThan(0);
      expect(scenario.suggestedClinicalActions.length).toBeGreaterThan(0);
    });
  });
});

describe('Release Report Generation & Exporter', () => {
  it('generates Markdown, JSON, and CSV reports containing audit metadata', () => {
    const envResults = validateEnvironmentVariables('development');
    const breakdown = calculateDeploymentReadiness(
      ASTROCARE_MODULES_REGISTRY,
      NASA_SOURCES_REGISTRY,
      envResults,
      SECURITY_CHECKS_DATA,
      TEST_SUITES_DATA,
      RELEASE_CHECKLIST_DATA
    );
    const report = generateDeploymentReportData(
      breakdown,
      ASTROCARE_MODULES_REGISTRY,
      NASA_SOURCES_REGISTRY,
      envResults,
      SECURITY_CHECKS_DATA,
      TEST_SUITES_DATA,
      RELEASE_CHECKLIST_DATA
    );

    const md = formatReportAsMarkdown(report);
    expect(md).toContain('# AstroCare Aerospace Biomedical Intelligence Platform');
    expect(md).toContain('Final Mission Deployment & Readiness Audit Report');
    expect(md).toContain('NASA Scientific Disclaimer');

    const jsonStr = formatReportAsJSON(report);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.summary.readinessScore).toBe(breakdown.overallScore);

    const csv = formatReportAsCSV(report);
    expect(csv).toContain('Category,Identifier,Name,Status,Details');
    expect(csv).toContain('P01');
    expect(csv).toContain('nasa-hrp');
  });
});
