// ============================================================================
// AstroCare P21 — Deployment & Mission Readiness Core Type Contracts
// ============================================================================

export type VerificationState = 'passed' | 'warning' | 'failed' | 'blocked' | 'not_run';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface DeploymentCheck {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'nasa' | 'ai' | 'security' | 'tests' | 'environment';
  name: string;
  description: string;
  status: VerificationState;
  severity: SeverityLevel;
  message: string;
  remediation?: string;
  timestamp: string;
  isSimulated?: boolean;
}

export type ModuleIntegrationStatusType = 
  | 'integrated' 
  | 'partially_integrated' 
  | 'pending' 
  | 'failed' 
  | 'not_verified';

export interface ModuleIntegrationStatus {
  promptId: string; // e.g. "P01", "P13", "P20", "P21"
  name: string;
  category: 'core' | 'clinical' | 'intelligence' | 'research' | 'operations' | 'readiness';
  status: ModuleIntegrationStatusType;
  route: string;
  componentName: string;
  serviceDependencies: string[];
  typeCompatible: boolean;
  dataProviderAvailable: boolean;
  testStatus: 'passed' | 'failed' | 'pending' | 'untested';
  lastVerified: string;
  description: string;
  notes?: string;
}

export type NASASourceCategory = 
  | 'Human Research' 
  | 'Space Omics & Biology' 
  | 'REST API' 
  | 'Space Radiation' 
  | 'Life Sciences Archive' 
  | 'Design & Standards';

export interface NASAVerificationLevels {
  linkAvailable: boolean;
  apiConnectivity: boolean;
  authValid: boolean;
  datasetAvailable: boolean;
  actualDataRetrieved: boolean;
}

export interface NASAResourceStatus {
  id: string;
  name: string;
  officialUrl: string;
  apiUrl?: string;
  category: NASASourceCategory;
  integrationType: 'REST API' | 'Dataset Archive' | 'Metadata Service' | 'Scientific Reference';
  connectivityStatus: 'online' | 'degraded' | 'offline' | 'simulated' | 'verifying';
  verificationLevel: NASAVerificationLevels;
  authRequirement: 'None' | 'API Key' | 'Bearer Token' | 'NASA Earthdata';
  apiResponseStatus?: number;
  dataFreshness?: string;
  latencyMs?: number;
  provenanceTag: string;
  organismContext: 'Human Astronaut' | 'Human Ground Analog' | 'Animal Model' | 'Cell/Tissue-Chip' | 'Synthetic Simulation';
  errorDetails?: string;
  lastSuccessfulVerification: string;
  citationString: string;
}

export interface EnvironmentVariableSpec {
  key: string;
  description: string;
  required: boolean;
  isSecret: boolean;
  expectedPattern?: RegExp;
  formatDescription: string;
  defaultMockAllowed: boolean;
}

export interface EnvironmentValidationResult {
  key: string;
  description: string;
  required: boolean;
  isSecret: boolean;
  present: boolean;
  formatValid: boolean;
  detectedFormat: string;
  expectedFormat: string;
  profile: 'development' | 'staging' | 'production';
  status: 'valid' | 'missing' | 'invalid_format' | 'mock_active';
  recommendation: string;
}

export interface InfrastructureHealthResult {
  serviceId: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'ai_proxy' | 'telemetry_stream' | 'auth_service';
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down' | 'simulated';
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
  errorDetails?: string;
  dependencies: string[];
  isSimulated: boolean;
}

export interface SecurityCheck {
  id: string;
  category: 
    | 'Secret Management' 
    | 'API Authentication' 
    | 'Authorization Boundaries' 
    | 'Input Validation' 
    | 'Error Handling' 
    | 'Network Configuration' 
    | 'CORS Policy' 
    | 'Dependency Review' 
    | 'Sensitive Health Data (PHI)' 
    | 'Logging Practices' 
    | 'Environment Separation';
  title: string;
  description: string;
  status: 'compliant' | 'warning' | 'critical_finding' | 'needs_audit';
  finding: string;
  recommendedFix: string;
  standardReference: string; // e.g. "OWASP ASVS 4.0", "NASA-STD-2820", "HIPAA Security Rule"
  lastAudited: string;
}

export interface TestExecutionResult {
  id: string;
  category: 
    | 'Unit Tests' 
    | 'Integration Tests' 
    | 'TypeScript Compilation' 
    | 'Code Quality & Linting' 
    | 'Production Build' 
    | 'Route Contracts' 
    | 'API Adapters' 
    | 'NASA Integration' 
    | 'AI Fallback Verification';
  status: 'passed' | 'failed' | 'not_run' | 'blocked';
  testsPassed: number;
  testsTotal: number;
  durationMs: number;
  command: string;
  lastRun: string;
  details: string;
  coveragePercent?: number; // Only present when real coverage report exists
}

export interface DeploymentTargetConfig {
  targetId: 'vercel' | 'netlify' | 'docker' | 'nodejs' | 'static';
  name: string;
  iconName: string;
  description: string;
  buildCommand: string;
  outputDirectory: string;
  runtimeRequirements: string;
  environmentVariables: string[];
  spaRoutingConfig: string;
  backendRequirement: string;
  apiProxyInstructions: string;
  sampleConfigFileName: string;
  sampleConfigContent: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  code: string;
  description: string;
  astronautName: string;
  astronautId: string;
  missionPhase: string;
  met: string;
  clinicalSeverity: 'Nominal' | 'Advisory' | 'Critical';
  vitals: {
    heartRate: number;
    spo2: number;
    systolicBp: number;
    diastolicBp: number;
    coreTemp: number;
    radiationAccumulated: number;
  };
  keyFindings: string[];
  suggestedClinicalActions: string[];
  evidenceSource: string;
}

export interface ReleaseChecklistItem {
  id: string;
  category: 
    | 'Application Functionality' 
    | 'Module Integration' 
    | 'NASA Data Provenance' 
    | 'AI Integration' 
    | 'Database & Backend' 
    | 'Security' 
    | 'Testing & QA' 
    | 'Deployment Configuration' 
    | 'Demo Readiness' 
    | 'Documentation';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  completed: boolean;
  isBlocker: boolean;
  notes: string;
  lastUpdated: string;
}

export interface DeploymentReport {
  summary: {
    readinessScore: number;
    overallStatus: 'READINESS_BLOCKED' | 'ACCEPTABLE_FOR_DEMO' | 'PRODUCTION_CANDIDATE';
    verifiedModulesCount: number;
    totalModulesCount: number;
    activeBlockersCount: number;
    warningsCount: number;
    checklistCompletionPercent: number;
  };
  generatedAt: string;
  generatedBy: string;
  platformVersion: string;
  moduleIntegrations: ModuleIntegrationStatus[];
  nasaResources: NASAResourceStatus[];
  environmentSummary: {
    validCount: number;
    missingCount: number;
    mockActiveCount: number;
  };
  securityAudit: {
    compliantCount: number;
    warningCount: number;
    criticalCount: number;
  };
  testSummary: {
    passedSuites: number;
    totalSuites: number;
    allTestsPassed: boolean;
  };
  blockers: string[];
  recommendations: string[];
  disclaimer: string;
}
