/**
 * AstroCare Quality Assurance Framework - Core Result Types
 * Standards reference: NASA NPR 7150.2D & NASA-STD-8739.8B
 */

export type TestStatus = 'PASS' | 'FAIL' | 'SKIPPED' | 'BLOCKED' | 'WARNING';

export type TestSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TestCategory =
  | 'FUNCTIONAL'
  | 'UNIT'
  | 'INTEGRATION'
  | 'E2E'
  | 'API'
  | 'BIOMEDICAL'
  | 'SCIENTIFIC'
  | 'AI_GROUNDING'
  | 'NASA_DATA'
  | 'SECURITY'
  | 'PERFORMANCE'
  | 'ACCESSIBILITY'
  | 'REGRESSION';

export interface TestFailureDetails {
  message: string;
  expected?: unknown;
  actual?: unknown;
  stack?: string;
  codeSnippet?: string;
  blockingReason?: string;
}

export interface TestCaseDefinition {
  id: string;
  name: string;
  category: TestCategory;
  moduleName: string;
  description: string;
  severity: TestSeverity;
  tags?: string[];
  dependsOn?: string[]; // IDs of tests that must PASS before this executes, else BLOCKED
  timeoutMs?: number;
  fn: () => Promise<void> | void;
}

export interface TestCaseResult {
  id: string;
  name: string;
  category: TestCategory;
  moduleName: string;
  description: string;
  severity: TestSeverity;
  status: TestStatus;
  durationMs: number;
  expectedResult?: string;
  actualResult?: string;
  failureDetails?: TestFailureDetails;
  warnings?: string[];
  timestamp: string;
}

export interface TestSuiteDefinition {
  id: string;
  name: string;
  moduleName: string;
  category: TestCategory;
  description: string;
  tests: TestCaseDefinition[];
}

export interface TestSuiteResult {
  id: string;
  name: string;
  moduleName: string;
  category: TestCategory;
  durationMs: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  blocked: number;
  warnings: number;
  testResults: TestCaseResult[];
}

export interface ModuleHealthSummary {
  moduleName: string;
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  warnings: number;
  healthScore: number; // 0 - 100%
  status: 'HEALTHY' | 'DEGRADED' | 'FAILING' | 'BLOCKED';
}

export interface IntegrationReadinessReport {
  overallScore: number; // 0 - 100
  isReadyForIntegration: boolean;
  blockers: string[];
  recommendations: string[];
  categoryBreakdown: Record<TestCategory, { total: number; passed: number; score: number }>;
  nasaComplianceNote: string;
}

export interface OverallTestReport {
  reportId: string;
  frameworkVersion: string;
  generatedAt: string;
  environment: {
    nodeVersion: string;
    os: string;
    platform: string;
    offlineMode: boolean;
  };
  summary: {
    totalSuites: number;
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    blocked: number;
    warnings: number;
    passRate: number;
    totalDurationMs: number;
  };
  moduleHealth: ModuleHealthSummary[];
  integrationReadiness: IntegrationReadinessReport;
  suiteResults: TestSuiteResult[];
  failures: TestCaseResult[];
  warnings: TestCaseResult[];
}
